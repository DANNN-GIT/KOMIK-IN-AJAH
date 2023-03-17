if (sessionStorage.getItem('SESSION_LOGIN') === null) {
   alert('Anda belum login! Silahkan login terlebih dahulu');
   document.body.style.display = 'none';
   document.location = 'index.html';
}