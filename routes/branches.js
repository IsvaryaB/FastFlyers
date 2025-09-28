const express = require('express');
const pool = require('../config/database');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { validateBranch } = require('../middleware/validation');

const router = express.Router();

// Get all branches (public endpoint)
router.get('/', async (req, res) => {
  try {
    const { city, state, branch_type, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM branches WHERE 1=1';
    let params = [];
    let paramCount = 0;

    if (city) {
      paramCount++;
      query += ` AND LOWER(city) = LOWER($${paramCount})`;
      params.push(city);
    }

    if (state) {
      paramCount++;
      query += ` AND LOWER(state) = LOWER($${paramCount})`;
      params.push(state);
    }

    if (branch_type) {
      paramCount++;
      query += ` AND branch_type = $${paramCount}`;
      params.push(branch_type);
    }

    query += ` ORDER BY branch_name ASC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) FROM branches WHERE 1=1';
    let countParams = [];

    if (city) {
      countParams.push(city);
      countQuery += ' AND LOWER(city) = LOWER($1)';
    }

    if (state) {
      countParams.push(state);
      countQuery += city ? ' AND LOWER(state) = LOWER($2)' : ' AND LOWER(state) = LOWER($1)';
    }

    if (branch_type) {
      countParams.push(branch_type);
      const paramIndex = city && state ? 3 : (city || state ? 2 : 1);
      countQuery += ` AND branch_type = $${paramIndex}`;
    }

    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);

    res.json({
      branches: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get branches error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single branch by ID
router.get('/:branch_id', async (req, res) => {
  try {
    const { branch_id } = req.params;

    const result = await pool.query(
      'SELECT * FROM branches WHERE branch_id = $1',
      [branch_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Branch not found' });
    }

    res.json({
      branch: result.rows[0]
    });
  } catch (error) {
    console.error('Get branch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new branch (Admin only)
router.post('/', authenticateToken, requireRole(['admin']), validateBranch, async (req, res) => {
  try {
    const {
      branch_name,
      address,
      city,
      state,
      phone,
      working_hours,
      branch_type
    } = req.body;

    const result = await pool.query(
      `INSERT INTO branches (branch_name, address, city, state, phone, working_hours, branch_type) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [branch_name, address, city, state, phone, working_hours, branch_type]
    );

    res.status(201).json({
      message: 'Branch created successfully',
      branch: result.rows[0]
    });
  } catch (error) {
    console.error('Create branch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update branch (Admin only)
router.put('/:branch_id', authenticateToken, requireRole(['admin']), validateBranch, async (req, res) => {
  try {
    const { branch_id } = req.params;
    const {
      branch_name,
      address,
      city,
      state,
      phone,
      working_hours,
      branch_type
    } = req.body;

    // Check if branch exists
    const existingBranch = await pool.query(
      'SELECT * FROM branches WHERE branch_id = $1',
      [branch_id]
    );

    if (existingBranch.rows.length === 0) {
      return res.status(404).json({ error: 'Branch not found' });
    }

    const result = await pool.query(
      `UPDATE branches 
       SET branch_name = $1, address = $2, city = $3, state = $4, 
           phone = $5, working_hours = $6, branch_type = $7, updated_at = CURRENT_TIMESTAMP
       WHERE branch_id = $8
       RETURNING *`,
      [branch_name, address, city, state, phone, working_hours, branch_type, branch_id]
    );

    res.json({
      message: 'Branch updated successfully',
      branch: result.rows[0]
    });
  } catch (error) {
    console.error('Update branch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete branch (Admin only)
router.delete('/:branch_id', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { branch_id } = req.params;

    // Check if branch exists
    const existingBranch = await pool.query(
      'SELECT * FROM branches WHERE branch_id = $1',
      [branch_id]
    );

    if (existingBranch.rows.length === 0) {
      return res.status(404).json({ error: 'Branch not found' });
    }

    // Check if branch is referenced in any shipments (optional safety check)
    const shipmentCheck = await pool.query(
      'SELECT COUNT(*) FROM shipments WHERE consignee_city = (SELECT city FROM branches WHERE branch_id = $1)',
      [branch_id]
    );

    if (parseInt(shipmentCheck.rows[0].count) > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete branch that has associated shipments. Consider updating instead.' 
      });
    }

    await pool.query('DELETE FROM branches WHERE branch_id = $1', [branch_id]);

    res.json({
      message: 'Branch deleted successfully'
    });
  } catch (error) {
    console.error('Delete branch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get branches by location (city/state)
router.get('/search/location', async (req, res) => {
  try {
    const { city, state, radius } = req.query;

    if (!city && !state) {
      return res.status(400).json({ error: 'City or state parameter is required' });
    }

    let query = 'SELECT * FROM branches WHERE 1=1';
    let params = [];
    let paramCount = 0;

    if (city) {
      paramCount++;
      query += ` AND LOWER(city) LIKE LOWER($${paramCount})`;
      params.push(`%${city}%`);
    }

    if (state) {
      paramCount++;
      query += ` AND LOWER(state) LIKE LOWER($${paramCount})`;
      params.push(`%${state}%`);
    }

    query += ' ORDER BY branch_name ASC';

    const result = await pool.query(query, params);

    res.json({
      branches: result.rows,
      search_criteria: { city, state }
    });
  } catch (error) {
    console.error('Search branches error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get branch statistics (Admin only)
router.get('/admin/statistics', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    // Get total branches by type
    const branchTypeStats = await pool.query(
      'SELECT branch_type, COUNT(*) as count FROM branches GROUP BY branch_type ORDER BY count DESC'
    );

    // Get branches by state
    const stateStats = await pool.query(
      'SELECT state, COUNT(*) as count FROM branches GROUP BY state ORDER BY count DESC LIMIT 10'
    );

    // Get total branches
    const totalBranches = await pool.query('SELECT COUNT(*) as total FROM branches');

    res.json({
      total_branches: parseInt(totalBranches.rows[0].total),
      by_type: branchTypeStats.rows,
      by_state: stateStats.rows
    });
  } catch (error) {
    console.error('Get branch statistics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;