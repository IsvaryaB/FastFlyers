# Logistics & Courier Tracking Backend API

A comprehensive backend system for logistics and courier tracking with PostgreSQL database, JWT authentication, and RESTful APIs.

## 🚀 Features

- **User Management**: Registration, login, role-based access control
- **Shipment Management**: Create, track, update, and cancel shipments
- **Real-time Tracking**: Live tracking updates with status management
- **Branch Management**: Manage distribution centers and partner locations
- **Support System**: Ticket creation and management
- **Admin Dashboard**: Analytics, reporting, and system management
- **Security**: JWT authentication, rate limiting, input validation
- **Documentation**: Swagger UI and Postman collection

## 📋 Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd logistics-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your database credentials:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=logistics_db
   DB_USER=postgres
   DB_PASSWORD=your_password
   JWT_SECRET=your-super-secret-jwt-key
   PORT=3000
   ```

4. **Set up PostgreSQL database**
   ```bash
   # Create database
   createdb logistics_db
   
   # Run migrations
   npm run migrate
   
   # Seed sample data
   npm run seed
   ```

5. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 📊 Database Schema

### Tables

- **users**: User accounts with roles (customer, admin, operations)
- **shipments**: Package shipments with tracking information
- **tracking**: Real-time tracking updates for shipments
- **branches**: Distribution centers and partner locations
- **support**: Customer support tickets

### Sample Data

The seed script creates:
- Admin user: `admin@logistics.com` / `admin123`
- Customer user: `john.doe@email.com` / `customer123`
- 4 sample branches
- 1 sample shipment with tracking history
- 1 sample support ticket

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Shipments
- `POST /api/shipments` - Create shipment
- `GET /api/shipments` - Get user's shipments
- `GET /api/shipments/:id` - Get shipment by ID
- `PUT /api/shipments/:id` - Update shipment
- `DELETE /api/shipments/:id` - Cancel shipment
- `GET /api/shipments/admin/all` - Get all shipments (admin)

### Tracking
- `GET /api/tracking/:id` - Get tracking history
- `GET /api/tracking/:id/status` - Get real-time status
- `POST /api/tracking/:id` - Add tracking update (admin)
- `GET /api/tracking/admin/active` - Get active shipments (admin)
- `POST /api/tracking/bulk-update` - Bulk tracking updates (admin)

### Branches
- `GET /api/branches` - Get all branches
- `GET /api/branches/:id` - Get branch by ID
- `GET /api/branches/search/location` - Search by location
- `POST /api/branches` - Create branch (admin)
- `PUT /api/branches/:id` - Update branch (admin)
- `DELETE /api/branches/:id` - Delete branch (admin)

### Support
- `POST /api/support` - Create support ticket
- `GET /api/support/my-tickets` - Get user's tickets
- `GET /api/support/:id` - Get ticket by ID
- `PUT /api/support/:id` - Update ticket status (admin)
- `GET /api/support/admin/all` - Get all tickets (admin)

### Admin
- `GET /api/admin/dashboard` - Dashboard overview
- `GET /api/admin/analytics/shipments` - Shipment analytics
- `GET /api/admin/analytics/users` - User analytics
- `GET /api/admin/health` - System health check
- `GET /api/admin/export/:type` - Export data

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### User Roles

- **customer**: Can create shipments, view own data, create support tickets
- **operations**: Can manage shipments, tracking, and support tickets
- **admin**: Full access to all features and analytics

## 📚 Documentation

### Swagger UI
Visit `http://localhost:3000/api-docs` for interactive API documentation.

### Postman Collection
Import the `postman_collection.json` file into Postman for testing all endpoints.

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage
```

## 🚀 Deployment

### Environment Variables for Production

```env
NODE_ENV=production
DB_HOST=your-production-db-host
DB_PORT=5432
DB_NAME=logistics_prod
DB_USER=your-db-user
DB_PASSWORD=your-secure-password
JWT_SECRET=your-production-jwt-secret
PORT=3000
FRONTEND_URL=https://your-frontend-domain.com
```

### Docker Deployment

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 📈 Monitoring & Analytics

The admin dashboard provides:

- **Shipment Analytics**: Success rates, delivery times, revenue metrics
- **User Analytics**: Registration trends, active users, top customers
- **System Health**: Database status, critical issues, performance metrics
- **Export Features**: Data export in JSON/CSV formats

## 🔧 Configuration

### Rate Limiting
- General API: 100 requests per 15 minutes
- Authentication: 5 requests per 15 minutes
- Shipment creation: 20 requests per hour

### CORS
Configured for frontend integration with configurable origins.

### Security
- Helmet.js for security headers
- Input validation with express-validator
- SQL injection protection with parameterized queries
- Password hashing with bcryptjs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation at `/api-docs`
- Review the Postman collection for examples

## 🔄 API Versioning

Current version: v1.0.0

Future versions will maintain backward compatibility where possible.

---

**Built with ❤️ for modern logistics and courier tracking systems**