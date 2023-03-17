document.getElementById('btn-logout').addEventListener('click', () => {
   if (confirm('Yakin ingin mengakhiri sesi login?') == true) {
      alert('Anda berhasil logout!');
      sessionStorage.removeItem('SESSION_LOGIN');
      document.location = 'index.html';
   }
});