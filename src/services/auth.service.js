const prisma = require('../config/prisma');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwt');

const login = async (email, password) => {
  if (!email || !password) {
    const error = new Error('Email and password are required');
    error.statusCode = 400;
    throw error;
  }

  const admin = await prisma.admin.findUnique({
    where: { email },
  });

  if (!admin) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const isPasswordMatch = await bcrypt.compare(password, admin.password);
  if (!isPasswordMatch) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const token = generateToken({ adminId: admin.id, email: admin.email });

  return {
    token,
    admin: {
      id: admin.id,
      email: admin.email,
    },
  };
};

module.exports = {
  login,
};
