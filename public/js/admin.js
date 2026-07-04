document.addEventListener('DOMContentLoaded', async () => {
  // Authentication check
  const token = localStorage.getItem('token');
  const adminEmail = localStorage.getItem('adminEmail');

  if (!token) {
    window.location.href = 'login.html';
    return;
  }

  // Display admin email
  const adminDisplay = document.getElementById('admin-display-email');
  if (adminDisplay && adminEmail) {
    adminDisplay.textContent = adminEmail;
  }

  // Logout handler
  const btnLogout = document.getElementById('btn-logout');
  if (btnLogout) {
    btnLogout.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('token');
      localStorage.removeItem('adminEmail');
      window.location.href = 'login.html';
    });
  }

  // State
  let laptops = [];
  const tableBody = document.getElementById('admin-table-body');

  // Stats Elements
  const statTotalLaptops = document.getElementById('stat-total-laptops');
  const statTotalBrands = document.getElementById('stat-total-brands');
  const statAveragePrice = document.getElementById('stat-average-price');

  // Currency formatter
  function formatRupiah(number) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(number);
  }

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

  // Load and render laptops table
  async function loadLaptops() {
    try {
      const response = await api.get('/laptops');
      if (response.success) {
        laptops = response.data;
        calculateStats();
        renderTable();
      } else {
        showToast('Gagal memuat data laptop', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Koneksi server gagal', 'error');
    }
  }

  // Calculate and display stats
  function calculateStats() {
    if (!laptops || laptops.length === 0) {
      if (statTotalLaptops) statTotalLaptops.textContent = '0';
      if (statTotalBrands) statTotalBrands.textContent = '0';
      if (statAveragePrice) statAveragePrice.textContent = 'Rp 0';
      return;
    }

    const total = laptops.length;
    
    // Unique brands
    const brandsSet = new Set(laptops.map(l => l.brand));
    const uniqueBrands = brandsSet.size;

    // Average price
    const sumPrice = laptops.reduce((sum, laptop) => sum + laptop.price, 0);
    const avgPrice = Math.round(sumPrice / total);

    if (statTotalLaptops) statTotalLaptops.textContent = total;
    if (statTotalBrands) statTotalBrands.textContent = uniqueBrands;
    if (statAveragePrice) statAveragePrice.textContent = formatRupiah(avgPrice);
  }

  function renderTable() {
    tableBody.innerHTML = '';
    if (laptops.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align: center; color: var(--text-muted); padding: 30px; font-weight: 500;">
            Tidak ada data laptop. Klik "+ Tambah Laptop Baru" untuk mengisi.
          </td>
        </tr>
      `;
      return;
    }

    laptops.forEach((laptop) => {
      const tr = document.createElement('tr');
      const defaultImg = 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=80';
      const imgUrl = laptop.imageUrl || defaultImg;

      tr.innerHTML = `
        <td><img src="${imgUrl}" alt="${laptop.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 6px; border: 1px solid var(--border);"></td>
        <td style="font-weight: 600; color: var(--text-main);">${laptop.name}</td>
        <td>${laptop.brand}</td>
        <td>${laptop.ramGb} GB</td>
        <td>${laptop.storageGb} GB</td>
        <td>${laptop.cpuScore} / 10</td>
        <td style="font-weight: 700; color: var(--primary);">${formatRupiah(laptop.price)}</td>
        <td>
          <div class="action-buttons">
            <button class="btn-action btn-edit" data-id="${laptop.id}"><i class="fa-solid fa-pen-to-square"></i> Edit</button>
            <button class="btn-action btn-delete" data-id="${laptop.id}"><i class="fa-solid fa-trash-can"></i> Hapus</button>
          </div>
        </td>
      `;
      tableBody.appendChild(tr);
    });

    // Add action event listeners
    document.querySelectorAll('.btn-edit').forEach(btn => {
      btn.addEventListener('click', (e) => {
        // Target nearest button container element just in case click lands on nested icon
        const button = e.target.closest('.btn-edit');
        if (button) handleEdit(button.dataset.id);
      });
    });

    document.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const button = e.target.closest('.btn-delete');
        if (button) handleDelete(button.dataset.id);
      });
    });
  }

  // Modal actions
  const modal = document.getElementById('laptop-modal');
  const btnAddLaptop = document.getElementById('btn-add-laptop');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalCancelBtn = document.getElementById('modal-cancel-btn');
  const form = document.getElementById('laptop-form');

  function openModal(title = 'Tambah Laptop Baru') {
    document.getElementById('modal-title').textContent = title;
    modal.classList.add('active');
  }

  function closeModal() {
    modal.classList.remove('active');
    form.reset();
    document.getElementById('laptop-id').value = '';
  }

  if (btnAddLaptop) {
    btnAddLaptop.addEventListener('click', () => {
      openModal('Tambah Laptop Baru');
    });
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalCancelBtn) modalCancelBtn.addEventListener('click', closeModal);
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Handle submit form (Create or Update)
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.getElementById('laptop-id').value;
    const name = document.getElementById('laptop-form-name').value;
    const brand = document.getElementById('laptop-form-brand').value;
    const ramGb = Number(document.getElementById('laptop-form-ram').value);
    const storageGb = Number(document.getElementById('laptop-form-storage').value);
    const cpuScore = Number(document.getElementById('laptop-form-cpu').value);
    const price = Number(document.getElementById('laptop-form-price').value);
    const imageUrl = document.getElementById('laptop-form-image').value;
    const description = document.getElementById('laptop-form-description').value;

    const payload = { name, brand, ramGb, storageGb, cpuScore, price, imageUrl, description };

    try {
      let response;
      if (id) {
        // Update
        response = await api.put(`/laptops/${id}`, payload, token);
      } else {
        // Create
        response = await api.post('/laptops', payload, token);
      }

      if (response.success) {
        showToast(id ? 'Data laptop berhasil diperbarui!' : 'Laptop baru berhasil ditambahkan!');
        closeModal();
        await loadLaptops();
      } else {
        showToast(response.message || 'Gagal menyimpan data.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Koneksi server terganggu.', 'error');
    }
  });

  // Handle Edit Action
  function handleEdit(id) {
    const laptop = laptops.find(l => l.id == id);
    if (!laptop) return;

    document.getElementById('laptop-id').value = laptop.id;
    document.getElementById('laptop-form-name').value = laptop.name;
    document.getElementById('laptop-form-brand').value = laptop.brand;
    document.getElementById('laptop-form-ram').value = laptop.ramGb;
    document.getElementById('laptop-form-storage').value = laptop.storageGb;
    document.getElementById('laptop-form-cpu').value = laptop.cpuScore;
    document.getElementById('laptop-form-price').value = laptop.price;
    document.getElementById('laptop-form-image').value = laptop.imageUrl || '';
    document.getElementById('laptop-form-description').value = laptop.description || '';

    openModal('Edit Data Laptop');
  }

  // Handle Delete Action
  async function handleDelete(id) {
    const laptop = laptops.find(l => l.id == id);
    if (!laptop) return;

    if (confirm(`Apakah Anda yakin ingin menghapus laptop "${laptop.brand} ${laptop.name}"?`)) {
      try {
        const response = await api.delete(`/laptops/${id}`, token);
        if (response.success) {
          showToast('Data laptop berhasil dihapus!');
          await loadLaptops();
        } else {
          showToast(response.message || 'Gagal menghapus data.', 'error');
        }
      } catch (err) {
        console.error(err);
        showToast('Koneksi server terganggu.', 'error');
      }
    }
  }

  // Initial load
  await loadLaptops();
});
