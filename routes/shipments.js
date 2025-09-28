const express = require('express');
const pool = require('../config/database');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { validateShipment } = require('../middleware/validation');
const { shipmentLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// Create new shipment
router.post('/', authenticateToken, shipmentLimiter, validateShipment, async (req, res) => {
  try {
    const {
      consignee_city,
      postal_code,
      package_count,
      package_weight,
      net_total,
      contents_description
    } = req.body;

    const result = await pool.query(
      `INSERT INTO shipments (user_id, consignee_city, postal_code, package_count, package_weight, net_total, contents_description, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'Booked') 
       RETURNING *`,
      [req.user.user_id, consignee_city, postal_code, package_count, package_weight, net_total, contents_description]
    );

    const shipment = result.rows[0];

    // Create initial tracking entry
    await pool.query(
      'INSERT INTO tracking (shipment_id, current_location, status_update) VALUES ($1, $2, $3)',
      [shipment.shipment_id, 'Package booked and ready for pickup', 'In Transit']
    );

    res.status(201).json({
      message: 'Shipment created successfully',
      shipment
    });
  } catch (error) {
    console.error('Create shipment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all shipments for authenticated user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT s.*, u.name as user_name, u.email as user_email
      FROM shipments s
      JOIN users u ON s.user_id = u.user_id
      WHERE s.user_id = $1
    `;
    let params = [req.user.user_id];
    let paramCount = 1;

    if (status) {
      paramCount++;
      query += ` AND s.status = $${paramCount}`;
      params.push(status);
    }

    query += ` ORDER BY s.created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) FROM shipments WHERE user_id = $1';
    let countParams = [req.user.user_id];

    if (status) {
      countQuery += ' AND status = $2';
      countParams.push(status);
    }

    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);

    res.json({
      shipments: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get shipments error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single shipment by ID
router.get('/:shipment_id', authenticateToken, async (req, res) => {
  try {
    const { shipment_id } = req.params;

    const result = await pool.query(
      `SELECT s.*, u.name as user_name, u.email as user_email, u.phone as user_phone
       FROM shipments s
       JOIN users u ON s.user_id = u.user_id
       WHERE s.shipment_id = $1 AND (s.user_id = $2 OR $3 = 'admin' OR $3 = 'operations')`,
      [shipment_id, req.user.user_id, req.user.role]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Shipment not found' });
    }

    res.json({
      shipment: result.rows[0]
    });
  } catch (error) {
    console.error('Get shipment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update shipment
router.put('/:shipment_id', authenticateToken, validateShipment, async (req, res) => {
  try {
    const { shipment_id } = req.params;
    const {
      consignee_city,
      postal_code,
      package_count,
      package_weight,
      net_total,
      contents_description,
      status
    } = req.body;

    // Check if shipment exists and user has permission
    const existingShipment = await pool.query(
      'SELECT * FROM shipments WHERE shipment_id = $1 AND (user_id = $2 OR $3 = \'admin\' OR $3 = \'operations\')',
      [shipment_id, req.user.user_id, req.user.role]
    );

    if (existingShipment.rows.length === 0) {
      return res.status(404).json({ error: 'Shipment not found' });
    }

    const currentStatus = existingShipment.rows[0].status;

    // Prevent updates to delivered or cancelled shipments
    if (currentStatus === 'Delivered' || currentStatus === 'Cancelled') {
      return res.status(400).json({ 
        error: 'Cannot update delivered or cancelled shipments' 
      });
    }

    const result = await pool.query(
      `UPDATE shipments 
       SET consignee_city = $1, postal_code = $2, package_count = $3, package_weight = $4, 
           net_total = $5, contents_description = $6, status = COALESCE($7, status), updated_at = CURRENT_TIMESTAMP
       WHERE shipment_id = $8
       RETURNING *`,
      [consignee_city, postal_code, package_count, package_weight, net_total, contents_description, status, shipment_id]
    );

    res.json({
      message: 'Shipment updated successfully',
      shipment: result.rows[0]
    });
  } catch (error) {
    console.error('Update shipment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Cancel shipment
router.delete('/:shipment_id', authenticateToken, async (req, res) => {
  try {
    const { shipment_id } = req.params;

    // Check if shipment exists and user has permission
    const existingShipment = await pool.query(
      'SELECT * FROM shipments WHERE shipment_id = $1 AND (user_id = $2 OR $3 = \'admin\' OR $3 = \'operations\')',
      [shipment_id, req.user.user_id, req.user.role]
    );

    if (existingShipment.rows.length === 0) {
      return res.status(404).json({ error: 'Shipment not found' });
    }

    const currentStatus = existingShipment.rows[0].status;

    // Prevent cancellation of delivered shipments
    if (currentStatus === 'Delivered') {
      return res.status(400).json({ 
        error: 'Cannot cancel delivered shipments' 
      });
    }

    if (currentStatus === 'Cancelled') {
      return res.status(400).json({ 
        error: 'Shipment is already cancelled' 
      });
    }

    // Update shipment status to cancelled
    const result = await pool.query(
      'UPDATE shipments SET status = \'Cancelled\', updated_at = CURRENT_TIMESTAMP WHERE shipment_id = $1 RETURNING *',
      [shipment_id]
    );

    // Add tracking update for cancellation
    await pool.query(
      'INSERT INTO tracking (shipment_id, current_location, status_update) VALUES ($1, $2, $3)',
      [shipment_id, 'Shipment cancelled by user', 'Cancelled']
    );

    res.json({
      message: 'Shipment cancelled successfully',
      shipment: result.rows[0]
    });
  } catch (error) {
    console.error('Cancel shipment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin/Operations: Get all shipments
router.get('/admin/all', authenticateToken, requireRole(['admin', 'operations']), async (req, res) => {
  try {
    const { page = 1, limit = 10, status, user_id } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT s.*, u.name as user_name, u.email as user_email, u.phone as user_phone
      FROM shipments s
      JOIN users u ON s.user_id = u.user_id
      WHERE 1=1
    `;
    let params = [];
    let paramCount = 0;

    if (status) {
      paramCount++;
      query += ` AND s.status = $${paramCount}`;
      params.push(status);
    }

    if (user_id) {
      paramCount++;
      query += ` AND s.user_id = $${paramCount}`;
      params.push(user_id);
    }

    query += ` ORDER BY s.created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) FROM shipments WHERE 1=1';
    let countParams = [];

    if (status) {
      countParams.push(status);
      countQuery += ' AND status = $1';
    }

    if (user_id) {
      countParams.push(user_id);
      countQuery += status ? ' AND user_id = $2' : ' AND user_id = $1';
    }

    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);

    res.json({
      shipments: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get all shipments error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;