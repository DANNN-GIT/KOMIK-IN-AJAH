if (sessionStorage.getItem('SESSION_LOGIN') !== null) {
   alert('Sesi login Anda sedang aktif!');
   document.body.setAttribute('hidden', '');
   document.location = 'dashboard.html';
}