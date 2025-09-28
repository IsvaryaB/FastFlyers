const express = require('express');
const pool = require('../config/database');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { validateSupportTicket } = require('../middleware/validation');

const router = express.Router();

// Create support ticket
router.post('/', authenticateToken, validateSupportTicket, async (req, res) => {
  try {
    const { subject, description } = req.body;

    const result = await pool.query(
      `INSERT INTO support (user_id, subject, description, status) 
       VALUES ($1, $2, $3, 'Open') 
       RETURNING *`,
      [req.user.user_id, subject, description]
    );

    res.status(201).json({
      message: 'Support ticket created successfully',
      ticket: result.rows[0]
    });
  } catch (error) {
    console.error('Create support ticket error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's support tickets
router.get('/my-tickets', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT s.*, u.name as user_name, u.email as user_email
      FROM support s
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
    let countQuery = 'SELECT COUNT(*) FROM support WHERE user_id = $1';
    let countParams = [req.user.user_id];

    if (status) {
      countQuery += ' AND status = $2';
      countParams.push(status);
    }

    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);

    res.json({
      tickets: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get user tickets error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single support ticket
router.get('/:ticket_id', authenticateToken, async (req, res) => {
  try {
    const { ticket_id } = req.params;

    const result = await pool.query(
      `SELECT s.*, u.name as user_name, u.email as user_email, u.phone as user_phone
       FROM support s
       JOIN users u ON s.user_id = u.user_id
       WHERE s.ticket_id = $1 AND (s.user_id = $2 OR $3 = 'admin' OR $3 = 'operations')`,
      [ticket_id, req.user.user_id, req.user.role]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Support ticket not found' });
    }

    res.json({
      ticket: result.rows[0]
    });
  } catch (error) {
    console.error('Get support ticket error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update support ticket status (Admin/Operations only)
router.put('/:ticket_id', authenticateToken, requireRole(['admin', 'operations']), async (req, res) => {
  try {
    const { ticket_id } = req.params;
    const { status } = req.body;

    if (!status || !['Open', 'Closed', 'Pending'].includes(status)) {
      return res.status(400).json({ 
        error: 'Valid status is required (Open, Closed, Pending)' 
      });
    }

    // Check if ticket exists
    const existingTicket = await pool.query(
      'SELECT * FROM support WHERE ticket_id = $1',
      [ticket_id]
    );

    if (existingTicket.rows.length === 0) {
      return res.status(404).json({ error: 'Support ticket not found' });
    }

    const result = await pool.query(
      'UPDATE support SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE ticket_id = $2 RETURNING *',
      [status, ticket_id]
    );

    res.json({
      message: 'Support ticket status updated successfully',
      ticket: result.rows[0]
    });
  } catch (error) {
    console.error('Update support ticket error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all support tickets (Admin/Operations only)
router.get('/admin/all', authenticateToken, requireRole(['admin', 'operations']), async (req, res) => {
  try {
    const { page = 1, limit = 20, status, user_id } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT s.*, u.name as user_name, u.email as user_email, u.phone as user_phone
      FROM support s
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
    let countQuery = 'SELECT COUNT(*) FROM support WHERE 1=1';
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
      tickets: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get all support tickets error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get support ticket statistics (Admin only)
router.get('/admin/statistics', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    // Get tickets by status
    const statusStats = await pool.query(
      'SELECT status, COUNT(*) as count FROM support GROUP BY status ORDER BY count DESC'
    );

    // Get tickets by month (last 12 months)
    const monthlyStats = await pool.query(
      `SELECT 
        DATE_TRUNC('month', created_at) as month,
        COUNT(*) as count
       FROM support 
       WHERE created_at >= NOW() - INTERVAL '12 months'
       GROUP BY DATE_TRUNC('month', created_at)
       ORDER BY month DESC`
    );

    // Get total tickets
    const totalTickets = await pool.query('SELECT COUNT(*) as total FROM support');

    // Get open tickets count
    const openTickets = await pool.query(
      'SELECT COUNT(*) as open_count FROM support WHERE status = \'Open\''
    );

    // Get average response time (tickets closed in last 30 days)
    const avgResponseTime = await pool.query(
      `SELECT 
        AVG(EXTRACT(EPOCH FROM (updated_at - created_at))/3600) as avg_hours
       FROM support 
       WHERE status = 'Closed' 
       AND updated_at >= NOW() - INTERVAL '30 days'`
    );

    res.json({
      total_tickets: parseInt(totalTickets.rows[0].total),
      open_tickets: parseInt(openTickets.rows[0].open_count),
      by_status: statusStats.rows,
      monthly_trend: monthlyStats.rows,
      avg_response_time_hours: parseFloat(avgResponseTime.rows[0].avg_hours) || 0
    });
  } catch (error) {
    console.error('Get support statistics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Bulk update support tickets (Admin/Operations only)
router.put('/admin/bulk-update', authenticateToken, requireRole(['admin', 'operations']), async (req, res) => {
  try {
    const { ticket_ids, status } = req.body;

    if (!Array.isArray(ticket_ids) || ticket_ids.length === 0) {
      return res.status(400).json({ error: 'Ticket IDs array is required' });
    }

    if (!status || !['Open', 'Closed', 'Pending'].includes(status)) {
      return res.status(400).json({ 
        error: 'Valid status is required (Open, Closed, Pending)' 
      });
    }

    const result = await pool.query(
      `UPDATE support 
       SET status = $1, updated_at = CURRENT_TIMESTAMP 
       WHERE ticket_id = ANY($2) 
       RETURNING ticket_id, status`,
      [status, ticket_ids]
    );

    res.json({
      message: `Updated ${result.rows.length} support tickets to ${status}`,
      updated_tickets: result.rows
    });
  } catch (error) {
    console.error('Bulk update support tickets error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;