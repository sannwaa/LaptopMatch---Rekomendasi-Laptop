document.addEventListener('DOMContentLoaded', () => {
  // Elements for slider indicators
  const sliders = [
    { input: 'wCpu', indicator: 'val-cpu' },
    { input: 'wRam', indicator: 'val-ram' },
    { input: 'wStorage', indicator: 'val-storage' },
    { input: 'wPrice', indicator: 'val-price' }
  ];

  sliders.forEach(slider => {
    const inputEl = document.getElementById(slider.input);
    const indicatorEl = document.getElementById(slider.indicator);
    if (inputEl && indicatorEl) {
      inputEl.addEventListener('input', (e) => {
        indicatorEl.textContent = e.target.value;
      });
    }
  });

  // Toast helper
  function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => {
        toast.remove();
      }, 500);
    }, 3000);
  }

  // Currency Formatter
  function formatRupiah(number) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(number);
  }

  // Handle recommendation form submission
  const form = document.getElementById('recommendation-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const wCpu = document.getElementById('wCpu').value;
      const wRam = document.getElementById('wRam').value;
      const wStorage = document.getElementById('wStorage').value;
      const wPrice = document.getElementById('wPrice').value;
      const maxPriceVal = document.getElementById('maxPrice').value;
      const maxPrice = maxPriceVal ? Number(maxPriceVal) : undefined;

      try {
        const response = await api.post('/recommendations', {
          wCpu,
          wRam,
          wStorage,
          wPrice,
          maxPrice
        });

        if (response.success) {
          renderRecommendations(response.data);
          showToast('Rekomendasi berhasil dihitung!');
        } else {
          showToast(response.message || 'Gagal menghitung rekomendasi.', 'error');
        }
      } catch (err) {
        console.error(err);
        showToast('Terjadi kesalahan koneksi server.', 'error');
      }
    });
  }

  function renderRecommendations(laptops) {
    const resultsWrapper = document.getElementById('results-wrapper');
    const resultsGrid = document.getElementById('results-grid');
    
    if (!resultsWrapper || !resultsGrid) return;
    
    resultsGrid.innerHTML = '';
    
    if (laptops.length === 0) {
      resultsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted);">
          Tidak ada laptop yang sesuai dengan anggaran atau kriteria pencarian Anda.
        </div>
      `;
      resultsWrapper.style.display = 'block';
      resultsWrapper.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    laptops.forEach((laptop) => {
      const card = document.createElement('div');
      card.className = 'laptop-card';
      
      const defaultImg = 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500';
      const imgUrl = laptop.imageUrl || defaultImg;

      card.innerHTML = `
        <div class="laptop-image-container">
          <span class="brand-badge">${laptop.brand}</span>
          <span class="score-badge">Skor: ${laptop.score}</span>
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
          <a href="detail.html?id=${laptop.id}&score=${laptop.score}" class="btn btn-secondary btn-sm text-center" style="display: block; margin-top: auto;">Lihat Detail <i class="fa-solid fa-arrow-right"></i></a>
        </div>
      `;
      resultsGrid.appendChild(card);
    });

    resultsWrapper.style.display = 'block';
    resultsWrapper.scrollIntoView({ behavior: 'smooth' });
  }
});
