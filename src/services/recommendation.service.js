const prisma = require('../config/prisma');

const getRecommendations = async (preferences = {}) => {
  const {
    wRam = 3,
    wCpu = 4,
    wStorage = 2,
    wPrice = 1,
    maxPrice
  } = preferences;

  // Convert weights to numbers
  const wr = Number(wRam);
  const wc = Number(wCpu);
  const ws = Number(wStorage);
  const wp = Number(wPrice);

  // Fetch all laptops from database
  const allLaptops = await prisma.laptop.findMany();
  
  if (allLaptops.length === 0) {
    return [];
  }

  // Find min and max values across the entire catalog for consistent normalization
  let minPrice = Infinity, maxPriceVal = -Infinity;
  let minRam = Infinity, maxRamVal = -Infinity;
  let minCpu = Infinity, maxCpuVal = -Infinity;
  let minStorage = Infinity, maxStorageVal = -Infinity;

  allLaptops.forEach(laptop => {
    if (laptop.price < minPrice) minPrice = laptop.price;
    if (laptop.price > maxPriceVal) maxPriceVal = laptop.price;

    if (laptop.ramGb < minRam) minRam = laptop.ramGb;
    if (laptop.ramGb > maxRamVal) maxRamVal = laptop.ramGb;

    if (laptop.cpuScore < minCpu) minCpu = laptop.cpuScore;
    if (laptop.cpuScore > maxCpuVal) maxCpuVal = laptop.cpuScore;

    if (laptop.storageGb < minStorage) minStorage = laptop.storageGb;
    if (laptop.storageGb > maxStorageVal) maxStorageVal = laptop.storageGb;
  });

  // Helper function to scale a value to the range [1, 10]
  const normalize = (val, min, max) => {
    if (max === min) return 5.0; // Return middle value if there's no range
    return 1.0 + (9.0 * (val - min) / (max - min));
  };

  // Filter and score laptops
  let filteredLaptops = allLaptops;
  
  // Apply budget filter if specified
  if (maxPrice !== undefined && maxPrice !== null && maxPrice !== '') {
    const limit = Number(maxPrice);
    if (!isNaN(limit)) {
      filteredLaptops = allLaptops.filter(laptop => laptop.price <= limit);
    }
  }

  const scoredLaptops = filteredLaptops.map(laptop => {
    // Normalize each parameter to [1, 10] scale
    const normRam = normalize(laptop.ramGb, minRam, maxRamVal);
    const normCpu = normalize(laptop.cpuScore, minCpu, maxCpuVal);
    const normStorage = normalize(laptop.storageGb, minStorage, maxStorageVal);
    const normPrice = normalize(laptop.price, minPrice, maxPriceVal);

    // Weighted Scoring Formula:
    // Score = (RAM * Wram) + (CPU * Wcpu) + (Storage * Wstorage) - (Normalized Price * Wprice)
    const score = (normRam * wr) + (normCpu * wc) + (normStorage * ws) - (normPrice * wp);

    return {
      ...laptop,
      score: Number(score.toFixed(2)),
      // We can also attach normalized values for debugging or UI graphs if needed
      normalized: {
        ram: Number(normRam.toFixed(2)),
        cpu: Number(normCpu.toFixed(2)),
        storage: Number(normStorage.toFixed(2)),
        price: Number(normPrice.toFixed(2))
      }
    };
  });

  // Sort descending by score
  scoredLaptops.sort((a, b) => b.score - a.score);

  return scoredLaptops;
};

module.exports = {
  getRecommendations,
};
