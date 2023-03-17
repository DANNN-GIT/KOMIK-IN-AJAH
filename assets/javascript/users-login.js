const users = [
   {
      userId: 'USR-1001808892',
      nama: 'Dicoding Academy',
      username: 'dicoding@komikin.com',
      password: 'admin',
      isAdmin: true
   },
   {
      userId: 'USR-2002909984',
      nama: 'Ahmad Wildan',
      username: 'ahmadwildan@komikin.com',
      password: 'user',
      isAdmin: false
   }
];

if (localStorage.getItem('USERS_KEY') == null) {
   localStorage.setItem('USERS_KEY', JSON.stringify(users))
}

document.getElementById('form-login').addEventListener('submit', (event) => {
   const username = document.getElementById('username').value;
   const password = document.getElementById('password').value;
   
   const userData = localStorage.getItem('USERS_KEY');
   const parseData = JSON.parse(userData);
   
   if (username == parseData[0].username && password == parseData[0].password) {
      alert(`Selamat datang di aplikasi Komik.In, ${parseData[0].nama}.`);
      document.location = 'dashboard.html';
      sessionStorage.setItem('SESSION_LOGIN', JSON.stringify(parseData[0]))
   } else if (username == parseData[1].username && password == parseData[1].password) {
      alert(`Selamat datang di aplikasi Komik.In, ${parseData[1].nama}.`);
      document.location = 'dashboard.html';
      sessionStorage.setItem('SESSION_LOGIN', JSON.stringify(parseData[1]))
   } else {
      alert('Data login tidak valid!');
   }

   event.preventDefault();
});