const express = require('express');
const pool = require('../config/database');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Admin dashboard overview
router.get('/dashboard', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    // Get total users by role
    const userStats = await pool.query(
      'SELECT role, COUNT(*) as count FROM users GROUP BY role ORDER BY count DESC'
    );

    // Get total shipments by status
    const shipmentStats = await pool.query(
      'SELECT status, COUNT(*) as count FROM shipments GROUP BY status ORDER BY count DESC'
    );

    // Get total branches by type
    const branchStats = await pool.query(
      'SELECT branch_type, COUNT(*) as count FROM branches GROUP BY branch_type ORDER BY count DESC'
    );

    // Get total support tickets by status
    const supportStats = await pool.query(
      'SELECT status, COUNT(*) as count FROM support GROUP BY status ORDER BY count DESC'
    );

    // Get recent activity (last 7 days)
    const recentShipments = await pool.query(
      `SELECT COUNT(*) as count FROM shipments 
       WHERE created_at >= NOW() - INTERVAL '7 days'`
    );

    const recentUsers = await pool.query(
      `SELECT COUNT(*) as count FROM users 
       WHERE created_at >= NOW() - INTERVAL '7 days'`
    );

    const recentTickets = await pool.query(
      `SELECT COUNT(*) as count FROM support 
       WHERE created_at >= NOW() - INTERVAL '7 days'`
    );

    res.json({
      overview: {
        total_users: userStats.rows.reduce((sum, row) => sum + parseInt(row.count), 0),
        total_shipments: shipmentStats.rows.reduce((sum, row) => sum + parseInt(row.count), 0),
        total_branches: branchStats.rows.reduce((sum, row) => sum + parseInt(row.count), 0),
        total_support_tickets: supportStats.rows.reduce((sum, row) => sum + parseInt(row.count), 0)
      },
      users_by_role: userStats.rows,
      shipments_by_status: shipmentStats.rows,
      branches_by_type: branchStats.rows,
      support_tickets_by_status: supportStats.rows,
      recent_activity: {
        shipments_last_7_days: parseInt(recentShipments.rows[0].count),
        users_last_7_days: parseInt(recentUsers.rows[0].count),
        tickets_last_7_days: parseInt(recentTickets.rows[0].count)
      }
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Shipment analytics
router.get('/analytics/shipments', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { period = '30' } = req.query; // days

    // Shipment trends over time
    const shipmentTrends = await pool.query(
      `SELECT 
        DATE_TRUNC('day', created_at) as date,
        COUNT(*) as count,
        status
       FROM shipments 
       WHERE created_at >= NOW() - INTERVAL '${period} days'
       GROUP BY DATE_TRUNC('day', created_at), status
       ORDER BY date DESC`
    );

    // Average delivery time (for delivered shipments)
    const avgDeliveryTime = await pool.query(
      `SELECT 
        AVG(EXTRACT(EPOCH FROM (updated_at - created_at))/86400) as avg_days
       FROM shipments 
       WHERE status = 'Delivered' 
       AND created_at >= NOW() - INTERVAL '${period} days'`
    );

    // Success rate (delivered vs total)
    const successRate = await pool.query(
      `SELECT 
        COUNT(CASE WHEN status = 'Delivered' THEN 1 END) as delivered,
        COUNT(*) as total
       FROM shipments 
       WHERE created_at >= NOW() - INTERVAL '${period} days'`
    );

    // Top cities by shipment volume
    const topCities = await pool.query(
      `SELECT 
        consignee_city,
        COUNT(*) as shipment_count
       FROM shipments 
       WHERE created_at >= NOW() - INTERVAL '${period} days'
       GROUP BY consignee_city
       ORDER BY shipment_count DESC
       LIMIT 10`
    );

    // Revenue analytics
    const revenueStats = await pool.query(
      `SELECT 
        SUM(net_total) as total_revenue,
        AVG(net_total) as avg_shipment_value,
        COUNT(*) as total_shipments
       FROM shipments 
       WHERE created_at >= NOW() - INTERVAL '${period} days'`
    );

    const delivered = parseInt(successRate.rows[0].delivered);
    const total = parseInt(successRate.rows[0].total);
    const successRatePercent = total > 0 ? (delivered / total) * 100 : 0;

    res.json({
      period_days: parseInt(period),
      shipment_trends: shipmentTrends.rows,
      average_delivery_time_days: parseFloat(avgDeliveryTime.rows[0].avg_days) || 0,
      success_rate_percent: parseFloat(successRatePercent.toFixed(2)),
      top_cities: topCities.rows,
      revenue: {
        total_revenue: parseFloat(revenueStats.rows[0].total_revenue) || 0,
        average_shipment_value: parseFloat(revenueStats.rows[0].avg_shipment_value) || 0,
        total_shipments: parseInt(revenueStats.rows[0].total_shipments)
      }
    });
  } catch (error) {
    console.error('Shipment analytics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User analytics
router.get('/analytics/users', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { period = '30' } = req.query; // days

    // User registration trends
    const userTrends = await pool.query(
      `SELECT 
        DATE_TRUNC('day', created_at) as date,
        COUNT(*) as count,
        role
       FROM users 
       WHERE created_at >= NOW() - INTERVAL '${period} days'
       GROUP BY DATE_TRUNC('day', created_at), role
       ORDER BY date DESC`
    );

    // Active users (users with shipments in the period)
    const activeUsers = await pool.query(
      `SELECT COUNT(DISTINCT user_id) as count
       FROM shipments 
       WHERE created_at >= NOW() - INTERVAL '${period} days'`
    );

    // Top users by shipment count
    const topUsers = await pool.query(
      `SELECT 
        u.name,
        u.email,
        u.role,
        COUNT(s.shipment_id) as shipment_count,
        SUM(s.net_total) as total_spent
       FROM users u
       LEFT JOIN shipments s ON u.user_id = s.user_id
       WHERE s.created_at >= NOW() - INTERVAL '${period} days' OR s.created_at IS NULL
       GROUP BY u.user_id, u.name, u.email, u.role
       HAVING COUNT(s.shipment_id) > 0
       ORDER BY shipment_count DESC
       LIMIT 10`
    );

    res.json({
      period_days: parseInt(period),
      user_registration_trends: userTrends.rows,
      active_users: parseInt(activeUsers.rows[0].count),
      top_users: topUsers.rows
    });
  } catch (error) {
    console.error('User analytics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// System health check
router.get('/health', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    // Check database connection
    const dbCheck = await pool.query('SELECT NOW() as current_time');
    
    // Get table row counts
    const tableStats = await pool.query(`
      SELECT 
        'users' as table_name, COUNT(*) as row_count FROM users
      UNION ALL
      SELECT 
        'shipments' as table_name, COUNT(*) as row_count FROM shipments
      UNION ALL
      SELECT 
        'tracking' as table_name, COUNT(*) as row_count FROM tracking
      UNION ALL
      SELECT 
        'branches' as table_name, COUNT(*) as row_count FROM branches
      UNION ALL
      SELECT 
        'support' as table_name, COUNT(*) as row_count FROM support
    `);

    // Check for any critical issues
    const criticalIssues = [];
    
    // Check for stuck shipments (booked for more than 7 days)
    const stuckShipments = await pool.query(
      `SELECT COUNT(*) as count FROM shipments 
       WHERE status = 'Booked' AND created_at < NOW() - INTERVAL '7 days'`
    );
    
    if (parseInt(stuckShipments.rows[0].count) > 0) {
      criticalIssues.push({
        type: 'stuck_shipments',
        count: parseInt(stuckShipments.rows[0].count),
        message: 'Shipments stuck in "Booked" status for more than 7 days'
      });
    }

    // Check for open support tickets older than 48 hours
    const oldTickets = await pool.query(
      `SELECT COUNT(*) as count FROM support 
       WHERE status = 'Open' AND created_at < NOW() - INTERVAL '48 hours'`
    );
    
    if (parseInt(oldTickets.rows[0].count) > 0) {
      criticalIssues.push({
        type: 'old_support_tickets',
        count: parseInt(oldTickets.rows[0].count),
        message: 'Open support tickets older than 48 hours'
      });
    }

    res.json({
      status: 'healthy',
      database: {
        connected: true,
        current_time: dbCheck.rows[0].current_time
      },
      table_statistics: tableStats.rows,
      critical_issues: criticalIssues,
      system_uptime: process.uptime()
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({ 
      status: 'unhealthy',
      error: 'Database connection failed',
      details: error.message
    });
  }
});

// Export data (Admin only)
router.get('/export/:type', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { type } = req.params;
    const { format = 'json' } = req.query;

    let query;
    let filename;

    switch (type) {
      case 'users':
        query = 'SELECT user_id, name, email, phone, role, created_at FROM users ORDER BY created_at DESC';
        filename = 'users_export';
        break;
      case 'shipments':
        query = `
          SELECT s.*, u.name as user_name, u.email as user_email
          FROM shipments s
          JOIN users u ON s.user_id = u.user_id
          ORDER BY s.created_at DESC
        `;
        filename = 'shipments_export';
        break;
      case 'branches':
        query = 'SELECT * FROM branches ORDER BY branch_name';
        filename = 'branches_export';
        break;
      case 'support':
        query = `
          SELECT s.*, u.name as user_name, u.email as user_email
          FROM support s
          JOIN users u ON s.user_id = u.user_id
          ORDER BY s.created_at DESC
        `;
        filename = 'support_tickets_export';
        break;
      default:
        return res.status(400).json({ error: 'Invalid export type' });
    }

    const result = await pool.query(query);

    if (format === 'csv') {
      // Convert to CSV format
      const headers = Object.keys(result.rows[0] || {});
      const csvContent = [
        headers.join(','),
        ...result.rows.map(row => 
          headers.map(header => `"${row[header] || ''}"`).join(',')
        )
      ].join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}.csv"`);
      res.send(csvContent);
    } else {
      res.json({
        export_type: type,
        export_date: new Date().toISOString(),
        total_records: result.rows.length,
        data: result.rows
      });
    }
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: 'Export failed' });
  }
});

module.exports = router;