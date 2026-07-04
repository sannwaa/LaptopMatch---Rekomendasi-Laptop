document.addEventListener('DOMContentLoaded', async () => {
  let allLaptops = [];
  const catalogGrid = document.getElementById('catalog-grid');
  const searchInput = document.getElementById('search-input');
  const brandFilter = document.getElementById('brand-filter');
  const minPriceFilter = document.getElementById('min-price-filter');
  const maxPriceFilter = document.getElementById('max-price-filter');
  const sortBy = document.getElementById('sort-by');

  // Format Currency
  function formatRupiah(number) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(number);
  }

  // Load catalog
  async function loadCatalog() {
    try {
      const response = await api.get('/laptops');
      if (response.success) {
        allLaptops = response.data;
        renderLaptops(allLaptops);
      } else {
        showToast('Gagal memuat katalog laptop', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Gagal terhubung ke server', 'error');
    }
  }

  // Render Laptops
  function renderLaptops(laptops) {
    catalogGrid.innerHTML = '';
    if (laptops.length === 0) {
      catalogGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 60px; color: var(--text-muted); font-weight: 500;">
          <i class="fa-solid fa-laptop-slash" style="font-size: 3rem; margin-bottom: 20px; color: #cbd5e1; display: block;"></i>
          Tidak ada laptop yang cocok dengan kriteria pencarian Anda.
        </div>
      `;
      return;
    }

    laptops.forEach(laptop => {
      const card = document.createElement('div');
      card.className = 'laptop-card';
      const defaultImg = 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500';
      const imgUrl = laptop.imageUrl || defaultImg;

      card.innerHTML = `
        <div class="laptop-image-container">
          <span class="brand-badge">${laptop.brand}</span>
          <img class="laptop-img" src="${imgUrl}" alt="${laptop.name}">
        </div>
        <div class="laptop-body">
          <h3 class="laptop-title">${laptop.name}</h3>
          <div class="specs-grid">
            <div class="spec-item">
              <span class="spec-label">RAM</span>
              <span class="spec-value">${laptop.ramGb} GB</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">Storage</span>
              <span class="spec-value">${laptop.storageGb} GB</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">CPU Score</span>
              <span class="spec-value">${laptop.cpuScore} / 10</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">Brand</span>
              <span class="spec-value">${laptop.brand}</span>
            </div>
          </div>
          <div class="laptop-price">${formatRupiah(laptop.price)}</div>
          <a href="detail.html?id=${laptop.id}" class="btn btn-secondary btn-sm text-center" style="display: block; margin-top: auto;">Lihat Detail <i class="fa-solid fa-arrow-right"></i></a>
        </div>
      `;
      catalogGrid.appendChild(card);
    });
  }

  // Filter and Sort Logic
  function applyFiltersAndSorting() {
    const keyword = searchInput.value.toLowerCase();
    const brand = brandFilter.value;
    const minPrice = minPriceFilter.value ? Number(minPriceFilter.value) : 0;
    const maxPrice = maxPriceFilter.value ? Number(maxPriceFilter.value) : Infinity;
    const sortVal = sortBy.value;

    let filtered = allLaptops.filter(laptop => {
      const matchesKeyword = laptop.name.toLowerCase().includes(keyword) || laptop.brand.toLowerCase().includes(keyword);
      const matchesBrand = brand === 'ALL' || laptop.brand === brand;
      const matchesMinPrice = laptop.price >= minPrice;
      const matchesMaxPrice = laptop.price <= maxPrice;
      
      return matchesKeyword && matchesBrand && matchesMinPrice && matchesMaxPrice;
    });

    // Sorting
    if (sortVal === 'price-asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortVal === 'price-desc') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortVal === 'ram-desc') {
      filtered.sort((a, b) => b.ramGb - a.ramGb);
    } else if (sortVal === 'storage-desc') {
      filtered.sort((a, b) => b.storageGb - a.storageGb);
    } else if (sortVal === 'cpu-desc') {
      filtered.sort((a, b) => b.cpuScore - a.cpuScore);
    }

    renderLaptops(filtered);
  }

  // Event Listeners
  if (searchInput) searchInput.addEventListener('input', applyFiltersAndSorting);
  if (brandFilter) brandFilter.addEventListener('change', applyFiltersAndSorting);
  if (minPriceFilter) minPriceFilter.addEventListener('input', applyFiltersAndSorting);
  if (maxPriceFilter) maxPriceFilter.addEventListener('input', applyFiltersAndSorting);
  if (sortBy) sortBy.addEventListener('change', applyFiltersAndSorting);

  // Toast notification
  function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => toast.remove(), 500);
    }, 3000);
  }

  // Init
  await loadCatalog();
});
