const prisma = require('../config/prisma');

const getAllLaptops = async () => {
  return prisma.laptop.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
};

const getLaptopById = async (id) => {
  return prisma.laptop.findUnique({
    where: { id },
  });
};

const createLaptop = async (laptopData) => {
  const { name, brand, cpuScore, ramGb, storageGb, price, imageUrl, description } = laptopData;

  if (!name || !brand || cpuScore === undefined || !ramGb || !storageGb || !price || !description) {
    const error = new Error('Missing required fields');
    error.statusCode = 400;
    throw error;
  }

  return prisma.laptop.create({
    data: {
      name,
      brand,
      cpuScore: Number(cpuScore),
      ramGb: Number(ramGb),
      storageGb: Number(storageGb),
      price: Number(price),
      imageUrl: imageUrl || null,
      description,
    },
  });
};

const updateLaptop = async (id, laptopData) => {
  const { name, brand, cpuScore, ramGb, storageGb, price, imageUrl, description } = laptopData;

  const existingLaptop = await prisma.laptop.findUnique({
    where: { id },
  });

  if (!existingLaptop) {
    const error = new Error('Laptop not found');
    error.statusCode = 404;
    throw error;
  }

  return prisma.laptop.update({
    where: { id },
    data: {
      name: name || undefined,
      brand: brand || undefined,
      cpuScore: cpuScore !== undefined ? Number(cpuScore) : undefined,
      ramGb: ramGb !== undefined ? Number(ramGb) : undefined,
      storageGb: storageGb !== undefined ? Number(storageGb) : undefined,
      price: price !== undefined ? Number(price) : undefined,
      imageUrl: imageUrl !== undefined ? imageUrl : undefined,
      description: description !== undefined ? description : undefined,
    },
  });
};

const deleteLaptop = async (id) => {
  const existingLaptop = await prisma.laptop.findUnique({
    where: { id },
  });

  if (!existingLaptop) {
    const error = new Error('Laptop not found');
    error.statusCode = 404;
    throw error;
  }

  return prisma.laptop.delete({
    where: { id },
  });
};

module.exports = {
  getAllLaptops,
  getLaptopById,
  createLaptop,
  updateLaptop,
  deleteLaptop,
};
