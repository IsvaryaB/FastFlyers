const bcrypt = require('bcryptjs');
const pool = require('../config/database');

async function seedDatabase() {
  try {
    console.log('Starting database seeding...');
    
    // Hash password for admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    // Insert admin user
    const adminUser = await pool.query(`
      INSERT INTO users (name, email, phone, role, password) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING user_id
    `, ['Admin User', 'admin@logistics.com', '+1234567890', 'admin', hashedPassword]);
    
    console.log('✅ Admin user created');
    
    // Insert sample customer
    const customerPassword = await bcrypt.hash('customer123', 10);
    const customerUser = await pool.query(`
      INSERT INTO users (name, email, phone, role, password) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING user_id
    `, ['John Doe', 'john.doe@email.com', '+1987654321', 'customer', customerPassword]);
    
    console.log('✅ Sample customer created');
    
    // Insert sample branch
    const branch = await pool.query(`
      INSERT INTO branches (branch_name, address, city, state, phone, working_hours, branch_type) 
      VALUES ($1, $2, $3, $4, $5, $6, $7) 
      RETURNING branch_id
    `, [
      'Main Distribution Center',
      '123 Logistics Ave, Suite 100',
      'New York',
      'NY',
      '+1555123456',
      'Mon-Fri: 8AM-6PM, Sat: 9AM-4PM',
      'Main'
    ]);
    
    console.log('✅ Sample branch created');
    
    // Insert sample shipment
    const shipment = await pool.query(`
      INSERT INTO shipments (user_id, consignee_city, postal_code, package_count, package_weight, net_total, contents_description, status) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
      RETURNING shipment_id
    `, [
      customerUser.rows[0].user_id,
      'Los Angeles',
      '90210',
      2,
      5.5,
      125.00,
      'Electronics and documents',
      'In Transit'
    ]);
    
    console.log('✅ Sample shipment created');
    
    // Insert sample tracking updates
    const trackingUpdates = [
      ['Package picked up from sender', 'In Transit'],
      ['Package arrived at New York hub', 'At Hub'],
      ['Package departed from New York hub', 'In Transit'],
      ['Package arrived at Los Angeles hub', 'At Hub'],
      ['Package out for delivery', 'Out for Delivery']
    ];
    
    for (const [location, status] of trackingUpdates) {
      await pool.query(`
        INSERT INTO tracking (shipment_id, current_location, status_update) 
        VALUES ($1, $2, $3)
      `, [shipment.rows[0].shipment_id, location, status]);
    }
    
    console.log('✅ Sample tracking updates created');
    
    // Insert sample support ticket
    await pool.query(`
      INSERT INTO support (user_id, subject, description, status) 
      VALUES ($1, $2, $3, $4)
    `, [
      customerUser.rows[0].user_id,
      'Delivery delay inquiry',
      'My package was supposed to be delivered yesterday but I haven\'t received it yet. Can you please check the status?',
      'Open'
    ]);
    
    console.log('✅ Sample support ticket created');
    
    // Insert additional sample data
    const additionalBranches = [
      ['Partner Hub - Chicago', '456 Commerce St', 'Chicago', 'IL', '+1312555123', 'Mon-Fri: 7AM-7PM', 'Partner'],
      ['Distribution Hub - Miami', '789 Shipping Blvd', 'Miami', 'FL', '+1305555123', 'Mon-Sat: 6AM-8PM', 'Hub'],
      ['Partner Hub - Seattle', '321 Logistics Way', 'Seattle', 'WA', '+1206555123', 'Mon-Fri: 8AM-6PM', 'Partner']
    ];
    
    for (const branch of additionalBranches) {
      await pool.query(`
        INSERT INTO branches (branch_name, address, city, state, phone, working_hours, branch_type) 
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, branch);
    }
    
    console.log('✅ Additional sample branches created');
    
    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📋 Sample Data Summary:');
    console.log('👤 Admin User: admin@logistics.com / admin123');
    console.log('👤 Customer User: john.doe@email.com / customer123');
    console.log('🏢 4 Sample branches created');
    console.log('📦 1 Sample shipment with tracking updates');
    console.log('🎫 1 Sample support ticket');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;