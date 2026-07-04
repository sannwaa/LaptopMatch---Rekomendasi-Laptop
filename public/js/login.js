document.addEventListener('DOMContentLoaded', () => {
  // Check if already logged in
  const token = localStorage.getItem('token');
  if (token) {
    window.location.href = 'dashboard.html';
    return;
  }

  const form = document.getElementById('login-form');

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

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      try {
        const response = await api.post('/auth/login', { email, password });

        if (response.success && response.data) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('adminEmail', response.data.admin.email);
          showToast('Login berhasil! Mengalihkan...');
          
          setTimeout(() => {
            window.location.href = 'dashboard.html';
          }, 1000);
        } else {
          showToast(response.message || 'Login gagal. Periksa kembali email dan password.', 'error');
        }
      } catch (err) {
        console.error(err);
        showToast('Koneksi server gagal.', 'error');
      }
    });
  }
});
