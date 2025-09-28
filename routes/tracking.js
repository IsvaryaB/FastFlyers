const express = require('express');
const pool = require('../config/database');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { validateTrackingUpdate } = require('../middleware/validation');

const router = express.Router();

// Get tracking history for a shipment
router.get('/:shipment_id', authenticateToken, async (req, res) => {
  try {
    const { shipment_id } = req.params;

    // First verify the shipment exists and user has access
    const shipmentResult = await pool.query(
      `SELECT s.*, u.name as user_name 
       FROM shipments s
       JOIN users u ON s.user_id = u.user_id
       WHERE s.shipment_id = $1 AND (s.user_id = $2 OR $3 = 'admin' OR $3 = 'operations')`,
      [shipment_id, req.user.user_id, req.user.role]
    );

    if (shipmentResult.rows.length === 0) {
      return res.status(404).json({ error: 'Shipment not found' });
    }

    const shipment = shipmentResult.rows[0];

    // Get tracking history
    const trackingResult = await pool.query(
      'SELECT * FROM tracking WHERE shipment_id = $1 ORDER BY timestamp ASC',
      [shipment_id]
    );

    res.json({
      shipment: {
        shipment_id: shipment.shipment_id,
        status: shipment.status,
        consignee_city: shipment.consignee_city,
        postal_code: shipment.postal_code,
        user_name: shipment.user_name,
        created_at: shipment.created_at
      },
      tracking_history: trackingResult.rows
    });
  } catch (error) {
    console.error('Get tracking error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add tracking update (Admin/Operations only)
router.post('/:shipment_id', authenticateToken, requireRole(['admin', 'operations']), validateTrackingUpdate, async (req, res) => {
  try {
    const { shipment_id } = req.params;
    const { current_location, status_update } = req.body;

    // Verify shipment exists
    const shipmentResult = await pool.query(
      'SELECT * FROM shipments WHERE shipment_id = $1',
      [shipment_id]
    );

    if (shipmentResult.rows.length === 0) {
      return res.status(404).json({ error: 'Shipment not found' });
    }

    const shipment = shipmentResult.rows[0];

    // Prevent tracking updates for cancelled shipments
    if (shipment.status === 'Cancelled') {
      return res.status(400).json({ 
        error: 'Cannot add tracking updates for cancelled shipments' 
      });
    }

    // Add tracking update
    const trackingResult = await pool.query(
      'INSERT INTO tracking (shipment_id, current_location, status_update) VALUES ($1, $2, $3) RETURNING *',
      [shipment_id, current_location, status_update]
    );

    // Update shipment status if it's a delivery status
    if (status_update === 'Delivered') {
      await pool.query(
        'UPDATE shipments SET status = \'Delivered\', updated_at = CURRENT_TIMESTAMP WHERE shipment_id = $1',
        [shipment_id]
      );
    } else if (status_update === 'In Transit' || status_update === 'At Hub' || status_update === 'Out for Delivery') {
      await pool.query(
        'UPDATE shipments SET status = \'In Transit\', updated_at = CURRENT_TIMESTAMP WHERE shipment_id = $1',
        [shipment_id]
      );
    }

    res.status(201).json({
      message: 'Tracking update added successfully',
      tracking_update: trackingResult.rows[0],
      shipment_updated: true
    });
  } catch (error) {
    console.error('Add tracking update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get real-time tracking status for a shipment
router.get('/:shipment_id/status', async (req, res) => {
  try {
    const { shipment_id } = req.params;

    // Get shipment and latest tracking info
    const result = await pool.query(
      `SELECT 
        s.shipment_id, s.status as shipment_status, s.consignee_city, s.postal_code,
        t.current_location, t.status_update, t.timestamp as last_update
       FROM shipments s
       LEFT JOIN LATERAL (
         SELECT current_location, status_update, timestamp
         FROM tracking 
         WHERE shipment_id = s.shipment_id 
         ORDER BY timestamp DESC 
         LIMIT 1
       ) t ON true
       WHERE s.shipment_id = $1`,
      [shipment_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Shipment not found' });
    }

    const tracking = result.rows[0];

    res.json({
      shipment_id: tracking.shipment_id,
      status: tracking.shipment_status,
      current_location: tracking.current_location,
      status_update: tracking.status_update,
      last_update: tracking.last_update,
      consignee_city: tracking.consignee_city,
      postal_code: tracking.postal_code
    });
  } catch (error) {
    console.error('Get tracking status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all active shipments with their latest tracking (Admin/Operations)
router.get('/admin/active', authenticateToken, requireRole(['admin', 'operations']), async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const result = await pool.query(
      `SELECT 
        s.shipment_id, s.user_id, s.consignee_city, s.postal_code, s.status as shipment_status,
        s.created_at, u.name as user_name, u.email as user_email,
        t.current_location, t.status_update, t.timestamp as last_update
       FROM shipments s
       JOIN users u ON s.user_id = u.user_id
       LEFT JOIN LATERAL (
         SELECT current_location, status_update, timestamp
         FROM tracking 
         WHERE shipment_id = s.shipment_id 
         ORDER BY timestamp DESC 
         LIMIT 1
       ) t ON true
       WHERE s.status IN ('Booked', 'In Transit')
       ORDER BY s.created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    // Get total count
    const countResult = await pool.query(
      'SELECT COUNT(*) FROM shipments WHERE status IN (\'Booked\', \'In Transit\')'
    );
    const total = parseInt(countResult.rows[0].count);

    res.json({
      active_shipments: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get active shipments error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Bulk tracking update (Admin/Operations)
router.post('/bulk-update', authenticateToken, requireRole(['admin', 'operations']), async (req, res) => {
  try {
    const { updates } = req.body;

    if (!Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({ error: 'Updates array is required' });
    }

    const results = [];
    const errors = [];

    for (const update of updates) {
      try {
        const { shipment_id, current_location, status_update } = update;

        // Validate required fields
        if (!shipment_id || !current_location || !status_update) {
          errors.push({ shipment_id, error: 'Missing required fields' });
          continue;
        }

        // Verify shipment exists
        const shipmentResult = await pool.query(
          'SELECT * FROM shipments WHERE shipment_id = $1',
          [shipment_id]
        );

        if (shipmentResult.rows.length === 0) {
          errors.push({ shipment_id, error: 'Shipment not found' });
          continue;
        }

        // Add tracking update
        const trackingResult = await pool.query(
          'INSERT INTO tracking (shipment_id, current_location, status_update) VALUES ($1, $2, $3) RETURNING *',
          [shipment_id, current_location, status_update]
        );

        // Update shipment status if needed
        if (status_update === 'Delivered') {
          await pool.query(
            'UPDATE shipments SET status = \'Delivered\', updated_at = CURRENT_TIMESTAMP WHERE shipment_id = $1',
            [shipment_id]
          );
        }

        results.push({
          shipment_id,
          tracking_update: trackingResult.rows[0]
        });
      } catch (error) {
        errors.push({ shipment_id: update.shipment_id, error: error.message });
      }
    }

    res.json({
      message: `Bulk update completed. ${results.length} successful, ${errors.length} failed.`,
      successful_updates: results,
      errors
    });
  } catch (error) {
    console.error('Bulk tracking update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;