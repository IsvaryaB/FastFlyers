const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';
let authToken = '';

// Test configuration
const testConfig = {
  admin: {
    email: 'admin@logistics.com',
    password: 'admin123'
  },
  customer: {
    email: 'john.doe@email.com',
    password: 'customer123'
  }
};

// Helper function to make authenticated requests
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

// Test functions
async function testHealthCheck() {
  console.log('🏥 Testing health check...');
  try {
    const response = await axios.get('http://localhost:3000/health');
    console.log('✅ Health check passed:', response.data);
    return true;
  } catch (error) {
    console.log('❌ Health check failed:', error.message);
    return false;
  }
}

async function testAuth() {
  console.log('🔐 Testing authentication...');
  try {
    // Test admin login
    const loginResponse = await api.post('/auth/login', testConfig.admin);
    authToken = loginResponse.data.token;
    console.log('✅ Admin login successful');
    
    // Test profile endpoint
    const profileResponse = await api.get('/auth/profile');
    console.log('✅ Profile endpoint working:', profileResponse.data.user.name);
    
    return true;
  } catch (error) {
    console.log('❌ Authentication test failed:', error.response?.data || error.message);
    return false;
  }
}

async function testShipments() {
  console.log('📦 Testing shipments...');
  try {
    // Get shipments
    const shipmentsResponse = await api.get('/shipments');
    console.log('✅ Get shipments successful:', shipmentsResponse.data.shipments.length, 'shipments found');
    
    // Get single shipment if available
    if (shipmentsResponse.data.shipments.length > 0) {
      const shipmentId = shipmentsResponse.data.shipments[0].shipment_id;
      const singleShipmentResponse = await api.get(`/shipments/${shipmentId}`);
      console.log('✅ Get single shipment successful');
    }
    
    return true;
  } catch (error) {
    console.log('❌ Shipments test failed:', error.response?.data || error.message);
    return false;
  }
}

async function testTracking() {
  console.log('📍 Testing tracking...');
  try {
    // Get shipments first to find a shipment ID
    const shipmentsResponse = await api.get('/shipments');
    if (shipmentsResponse.data.shipments.length > 0) {
      const shipmentId = shipmentsResponse.data.shipments[0].shipment_id;
      
      // Test tracking history
      const trackingResponse = await api.get(`/tracking/${shipmentId}`);
      console.log('✅ Get tracking history successful:', trackingResponse.data.tracking_history.length, 'updates');
      
      // Test real-time status
      const statusResponse = await api.get(`/tracking/${shipmentId}/status`);
      console.log('✅ Get real-time status successful');
    }
    
    return true;
  } catch (error) {
    console.log('❌ Tracking test failed:', error.response?.data || error.message);
    return false;
  }
}

async function testBranches() {
  console.log('🏢 Testing branches...');
  try {
    // Get all branches
    const branchesResponse = await api.get('/branches');
    console.log('✅ Get branches successful:', branchesResponse.data.branches.length, 'branches found');
    
    // Test search by location
    const searchResponse = await api.get('/branches/search/location?city=New York');
    console.log('✅ Branch search successful');
    
    return true;
  } catch (error) {
    console.log('❌ Branches test failed:', error.response?.data || error.message);
    return false;
  }
}

async function testSupport() {
  console.log('🎫 Testing support...');
  try {
    // Get user's support tickets
    const ticketsResponse = await api.get('/support/my-tickets');
    console.log('✅ Get support tickets successful:', ticketsResponse.data.tickets.length, 'tickets found');
    
    return true;
  } catch (error) {
    console.log('❌ Support test failed:', error.response?.data || error.message);
    return false;
  }
}

async function testAdmin() {
  console.log('👑 Testing admin endpoints...');
  try {
    // Test dashboard
    const dashboardResponse = await api.get('/admin/dashboard');
    console.log('✅ Admin dashboard successful');
    
    // Test analytics
    const analyticsResponse = await api.get('/admin/analytics/shipments?period=30');
    console.log('✅ Shipment analytics successful');
    
    // Test health check
    const healthResponse = await api.get('/admin/health');
    console.log('✅ Admin health check successful');
    
    return true;
  } catch (error) {
    console.log('❌ Admin test failed:', error.response?.data || error.message);
    return false;
  }
}

async function runAllTests() {
  console.log('🧪 Starting API Tests...\n');
  
  const tests = [
    { name: 'Health Check', fn: testHealthCheck },
    { name: 'Authentication', fn: testAuth },
    { name: 'Shipments', fn: testShipments },
    { name: 'Tracking', fn: testTracking },
    { name: 'Branches', fn: testBranches },
    { name: 'Support', fn: testSupport },
    { name: 'Admin', fn: testAdmin }
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    console.log(`\n--- ${test.name} ---`);
    try {
      const result = await test.fn();
      if (result) {
        passed++;
      } else {
        failed++;
      }
    } catch (error) {
      console.log(`❌ ${test.name} test crashed:`, error.message);
      failed++;
    }
  }
  
  console.log('\n📊 Test Results:');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
  
  if (failed === 0) {
    console.log('\n🎉 All tests passed! API is working correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Please check the server logs.');
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = {
  testHealthCheck,
  testAuth,
  testShipments,
  testTracking,
  testBranches,
  testSupport,
  testAdmin,
  runAllTests
};