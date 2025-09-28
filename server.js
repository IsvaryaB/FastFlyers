const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const shipmentRoutes = require('./routes/shipments');
const trackingRoutes = require('./routes/tracking');
const branchRoutes = require('./routes/branches');
const supportRoutes = require('./routes/support');
const adminRoutes = require('./routes/admin');

// Import middleware
const { generalLimiter } = require('./middleware/rateLimiter');

const app = express();
const PORT = process.env.PORT || 3000;

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Logistics & Courier Tracking API',
      version: '1.0.0',
      description: 'A comprehensive backend API for logistics and courier tracking system',
      contact: {
        name: 'API Support',
        email: 'support@logistics.com'
      }
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            user_id: { type: 'integer' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            phone: { type: 'string' },
            role: { type: 'string', enum: ['customer', 'admin', 'operations'] },
            created_at: { type: 'string', format: 'date-time' }
          }
        },
        Shipment: {
          type: 'object',
          properties: {
            shipment_id: { type: 'integer' },
            user_id: { type: 'integer' },
            consignee_city: { type: 'string' },
            postal_code: { type: 'string' },
            package_count: { type: 'integer' },
            package_weight: { type: 'number' },
            net_total: { type: 'number' },
            contents_description: { type: 'string' },
            status: { type: 'string', enum: ['Booked', 'In Transit', 'Delivered', 'Cancelled'] },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },
        Tracking: {
          type: 'object',
          properties: {
            tracking_id: { type: 'integer' },
            shipment_id: { type: 'integer' },
            current_location: { type: 'string' },
            status_update: { type: 'string', enum: ['In Transit', 'At Hub', 'Out for Delivery', 'Delivered'] },
            timestamp: { type: 'string', format: 'date-time' }
          }
        },
        Branch: {
          type: 'object',
          properties: {
            branch_id: { type: 'integer' },
            branch_name: { type: 'string' },
            address: { type: 'string' },
            city: { type: 'string' },
            state: { type: 'string' },
            phone: { type: 'string' },
            working_hours: { type: 'string' },
            branch_type: { type: 'string', enum: ['Main', 'Partner', 'Hub'] },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },
        SupportTicket: {
          type: 'object',
          properties: {
            ticket_id: { type: 'integer' },
            user_id: { type: 'integer' },
            subject: { type: 'string' },
            description: { type: 'string' },
            status: { type: 'string', enum: ['Open', 'Closed', 'Pending'] },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./routes/*.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(generalLimiter);

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Logistics API Documentation'
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/shipments', shipmentRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/api/branches', branchRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/admin', adminRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Logistics & Courier Tracking API',
    version: '1.0.0',
    documentation: '/api-docs',
    health: '/health',
    endpoints: {
      auth: '/api/auth',
      shipments: '/api/shipments',
      tracking: '/api/tracking',
      branches: '/api/branches',
      support: '/api/support',
      admin: '/api/admin'
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: `The requested endpoint ${req.originalUrl} does not exist`,
    available_endpoints: {
      documentation: '/api-docs',
      health: '/health',
      auth: '/api/auth',
      shipments: '/api/shipments',
      tracking: '/api/tracking',
      branches: '/api/branches',
      support: '/api/support',
      admin: '/api/admin'
    }
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  
  res.status(error.status || 500).json({
    error: error.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Logistics API server running on port ${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;