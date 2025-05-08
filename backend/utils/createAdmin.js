const User = require('../models/User');

const createAdminUser = async () => {
  try {
    const adminExists = await User.findOne({ role: 'admin' });
    
    if (!adminExists) {
      const admin = await User.create({
        name: 'Admin',
        email: 'admin@hms.com',
        password: 'admin123',
        role: 'admin'  // Explicitly set role
      });
      console.log('Admin user created successfully:', admin.role);
    }
  } catch (error) {
    console.error('Error creating admin:', error);
  }
};

module.exports = createAdminUser;
