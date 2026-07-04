document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const laptopId = urlParams.get('id');
  const score = urlParams.get('score');

  const loadingEl = document.getElementById('detail-loading');
  const contentEl = document.getElementById('detail-content');

  // Elements
  const imgEl = document.getElementById('laptop-img');
  const nameEl = document.getElementById('laptop-name');
  const brandEl = document.getElementById('laptop-brand');
  const ramEl = document.getElementById('laptop-ram');
  const storageEl = document.getElementById('laptop-storage');
  const cpuEl = document.getElementById('laptop-cpu');
  const priceEl = document.getElementById('laptop-price');
  const descriptionEl = document.getElementById('laptop-description');
  const scoreWrapper = document.getElementById('recommendation-score-wrapper');
  const scoreValue = document.getElementById('recommendation-score-value');

  function formatRupiah(number) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(number);
  }

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

  if (!laptopId) {
    loadingEl.textContent = 'ID laptop tidak valid atau tidak ditemukan.';
    return;
  }

  // Display recommendation score if present in URL query parameters
  if (score && scoreValue && scoreWrapper) {
    scoreValue.textContent = score;
    scoreWrapper.style.display = 'flex';
  } else if (scoreWrapper) {
    scoreWrapper.style.display = 'none';
  }

  try {
    const response = await api.get(`/laptops/${laptopId}`);
    if (response.success && response.data) {
      const laptop = response.data;
      
      const defaultImg = 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500';
      imgEl.src = laptop.imageUrl || defaultImg;
      imgEl.alt = laptop.name;
      nameEl.textContent = laptop.name;
      brandEl.textContent = laptop.brand;
      ramEl.textContent = `${laptop.ramGb} GB`;
      storageEl.textContent = `${laptop.storageGb} GB`;
      cpuEl.textContent = `${laptop.cpuScore} / 10`;
      priceEl.textContent = formatRupiah(laptop.price);
      descriptionEl.textContent = laptop.description || 'Tidak ada deskripsi untuk laptop ini.';

      loadingEl.style.display = 'none';
      contentEl.style.display = 'grid';
    } else {
      loadingEl.textContent = 'Laptop tidak ditemukan.';
      showToast('Gagal memuat detail laptop', 'error');
    }
  } catch (err) {
    console.error(err);
    loadingEl.textContent = 'Gagal terhubung ke server.';
    showToast('Terjadi kesalahan koneksi', 'error');
  }
});
