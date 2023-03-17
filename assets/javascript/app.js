const getSessionLogin = sessionStorage.getItem('SESSION_LOGIN');
const getUserLevel = JSON.parse(getSessionLogin);
document.body.style.backgroundImage = 'none';

const books = [];
const STORAGE_KEY = 'DATA_BUKU';
const RENDER_EVENT = 'render-books';
const SAVED_EVENT = 'saved-books';

if (getUserLevel.isAdmin == true) {
   document.querySelector('#admin-content').style.visibility = 'visible';

   function generateIdBuku() {
      return +new Date();
   }

   function generateBukuField(bukuId, judul, penulis, tahun, isComplete) {
      return {
         bukuId,
         judul,
         penulis,
         tahun,
         isComplete,
      }
   }

   function createBuku() {
      const bukuId = generateIdBuku();
      const judulBuku = document.getElementById('judul').value;
      const penulis = document.getElementById('penulis').value;
      const tahun = document.getElementById('tahun').value;

      const sendBuku = generateBukuField(bukuId, judulBuku, penulis, tahun, false);
      books.push(sendBuku);

      alert('Berhasil menambah buku komik baru!')

      document.dispatchEvent(new Event(RENDER_EVENT));
      sendToLocalStorage();
   }

   function isStorageExist() {
      if (typeof(Storage) === undefined) {
         alert('Browser kamu tidak mendukung local storage');
         return false;
      }
      return true;
   }

   function sendToLocalStorage() {
      if (isStorageExist()) {
         const parsed = JSON.stringify(books);
         localStorage.setItem(STORAGE_KEY, parsed);
         document.dispatchEvent(new Event(SAVED_EVENT));
      }
   }

   function loadBooksFromLocalStorage() {
      const getBooksData = localStorage.getItem(STORAGE_KEY);
      let bookParse = JSON.parse(getBooksData);
      if (bookParse !== null) {
         for (const bookItem of bookParse) {
            books.push(bookItem);
         }
      }
      document.dispatchEvent(new Event(RENDER_EVENT));
   }

   function findBookIndex(bukuId) {
      for (index in books) {
         if (books[index].bukuId === bukuId) {
            return index;
         }
      }
      return -1;
   }

   function removeBookFromCompleted(bukuId) {
      const bookTarget = findBookIndex(bukuId);
      if (bookTarget === -1) {
         return;
      }
      books.splice(bookTarget, 1);
      document.dispatchEvent(new Event(RENDER_EVENT));
      sendToLocalStorage();
   }

   function tampilDataBukuDashboardAdmin() {
      const boxDataBuku = document.getElementById('box-data-buku');
      const getDataBukuFromLocalStorage = localStorage.getItem(STORAGE_KEY);
      const parseDataBuku = JSON.parse(getDataBukuFromLocalStorage);
      
      parseDataBuku.forEach((getBook) => {
         const createDivBooks = document.createElement('div');
         createDivBooks.classList.add('tampil-data-buku');
         createDivBooks.setAttribute('id', `book-${getBook.bukuId}`);
         createDivBooks.innerHTML = `
            <h1 class='icons-komik'><span class='fas fa-book'></span></h1>
            <h3>${getBook.judul}</h3>
            <p>Buku atau komik ini ditulis oleh <strong>${getBook.penulis}</strong> dan diterbitkan pada tahun <strong>${getBook.tahun}</strong>.</p>
         `;
         const hapusBuku = document.createElement('button');
         hapusBuku.classList.add('btn-baca-buku');
         hapusBuku.innerText = 'Hapus buku ini!';
         hapusBuku.addEventListener('click', function() {
            if (confirm(`Yakin ingin menghapus buku ${getBook.judul}?`) == true) {
               removeBookFromCompleted(getBook.bukuId);
               alert(`Buku ${getBook.judul} berhasil dihapus!`)
               location.reload();
            }
         });

         createDivBooks.appendChild(hapusBuku);
         boxDataBuku.append(createDivBooks);
      });
   }

   function getSearchingToDisplay(getBooksData) {
      const boxDataBuku = document.getElementById('box-data-buku');
      const createDivBooks = document.createElement('div');
      createDivBooks.classList.add('tampil-data-buku');
      createDivBooks.setAttribute('id', `book-${getBooksData.bukuId}`);
      createDivBooks.innerHTML = `
         <h1 class='icons-komik'><span class='fas fa-book'></span></h1>
         <h3>${getBooksData.judul}</h3>
         <p>Buku atau komik ini ditulis oleh <strong>${getBooksData.penulis}</strong> dan diterbitkan pada tahun <strong>${getBooksData.tahun}</strong>.</p>
      `;
      
      const hapusBuku = document.createElement('button');
      hapusBuku.classList.add('btn-baca-buku');
      hapusBuku.innerText = 'Hapus buku ini!';
      hapusBuku.addEventListener('click', function() {
         if (confirm(`Yakin ingin menghapus buku ${getBooksData.judul}?`) == true) {
            removeBookFromCompleted(getBooksData.bukuId);
            alert(`Buku ${getBooksData.judul} berhasil dihapus!`)
            location.reload();
         }
      });

      createDivBooks.appendChild(hapusBuku);
      boxDataBuku.append(createDivBooks);

      return createDivBooks;
   }

   function searchBooks(judul) {
      const searchResult = books.filter(function (books) {
         return books.judul.toLowerCase().includes(judul.toLowerCase());
      });
   
      const setBooksData = document.getElementById('box-data-buku');
      setBooksData.innerHTML = '';
   
      for (const book of searchResult) {
         const bookElement = getSearchingToDisplay(book);
         if (!book.isComplete) {
            setBooksData.append(bookElement);
         } else {
            setBooksData.innerHTML = '';
         }
      }
   }

   document.addEventListener('DOMContentLoaded', () => {
      document.getElementById('form-tambah-buku').addEventListener('submit', () => {
         createBuku();
      });

      if (isStorageExist()) {
         loadBooksFromLocalStorage();
      }

      document.getElementById('cari-buku').addEventListener('submit', (event) => {
         event.preventDefault();
         const getNilaiPencarian = document.getElementById('input-pencarian-buku').value;
         searchBooks(getNilaiPencarian);
      });

      tampilDataBukuDashboardAdmin();
   });

   document.addEventListener(RENDER_EVENT, () => {
      console.log(`RENDER EVENT RUNNING`, books);
   });

   document.addEventListener(SAVED_EVENT, () => {
      console.log('Data berhasil tersimpan ke Local Storage!');
   });

} else {
   document.querySelector('#user-content').style.visibility = 'visible';
   document.querySelector('#admin-content').style.display = 'none';

   function findBook(bukuId) {
      for (const bookItem of books) {
         if (bookItem.bukuId === bukuId) {
            return bookItem;
         }
      }
      return null;
   }

   function addBookToCompleted(bukuId) {
      const bookTarget = findBook(bukuId);
      if (bookTarget == null) {
         return;
      }
      bookTarget.isComplete = true;
      document.dispatchEvent(new Event(RENDER_EVENT));
      sendToLocalStorage();
   }

   function undoBookFromCompleted(bukuId) {
      const bookTarget = findBook(bukuId);
      if (bookTarget == null) {
         return;
      }
      bookTarget.isComplete = false;
      document.dispatchEvent(new Event(RENDER_EVENT));
      sendToLocalStorage();
   }

   function getDataToDisplay(getBooksData) {
      const boxPopulerBook = document.getElementById('box-populer-book');
      const createDivPopularBooks = document.createElement('section');
      createDivPopularBooks.classList.add('populer-book-item');
      createDivPopularBooks.setAttribute('id', `book-${getBooksData.bukuId}`);
      createDivPopularBooks.innerHTML = `
         <h1 class='icons-komik'><span class='fas fa-book'></span></h1>
         <h3>${getBooksData.judul}</h3>
         <p>Buku atau komik ini ditulis oleh <strong>${getBooksData.penulis}</strong> dan diterbitkan pada tahun <strong>${getBooksData.tahun}</strong>.</p>
      `;
      boxPopulerBook.append(createDivPopularBooks);

      if (getBooksData.isComplete) {
         const undoButton = document.createElement('button');
         undoButton.classList.add('btn-baca-buku');
         undoButton.innerText = 'Tandai sebagai tamat!';
         undoButton.addEventListener('click', function() {
            undoBookFromCompleted(getBooksData.bukuId);
         });

         createDivPopularBooks.append(undoButton);
      } else {
         const checkButton = document.createElement('button');
         checkButton.classList.add('btn-baca-buku');
         checkButton.innerText = 'Aku tertarik baca buku ini!';

         checkButton.addEventListener('click', function() {
            addBookToCompleted(getBooksData.bukuId);
         });

         createDivPopularBooks.append(checkButton);
      }

      return createDivPopularBooks;
   }

   function isStorageExist() {
      if (typeof(Storage) === undefined) {
         alert('Browser kamu tidak mendukung local storage');
         return false;
      }
      return true;
   }

   function isStorageExist() {
      if (typeof(Storage) === undefined) {
         alert('Browser kamu tidak mendukung local storage');
         return false;
      }
      return true;
   }

   function sendToLocalStorage() {
      if (isStorageExist()) {
         const parsed = JSON.stringify(books);
         localStorage.setItem(STORAGE_KEY, parsed);
         document.dispatchEvent(new Event(SAVED_EVENT));
      }
   }

   function loadBooksFromLocalStorage() {
      const getBooksData = localStorage.getItem(STORAGE_KEY);
      let bookParse = JSON.parse(getBooksData);
      if (bookParse !== null) {
         for (const bookItem of bookParse) {
            books.push(bookItem);
         }
      }
      document.dispatchEvent(new Event(RENDER_EVENT));
   }

   function searchBooks(judul) {
      const searchResult = books.filter(function (books) {
         return books.judul.toLowerCase().includes(judul.toLowerCase());
      });
   
      const setBooksData = document.getElementById('box-populer-book');
      setBooksData.innerHTML = '';
   
      for (const book of searchResult) {
         const bookElement = getDataToDisplay(book);
         if (!book.isComplete) {
            setBooksData.append(bookElement);
         } else {
            setBooksData.innerHTML = '';
         }
      }
   }

   document.addEventListener('DOMContentLoaded', () => {
      if (isStorageExist()) {
         loadBooksFromLocalStorage();
      }

      document.getElementById('cari-buku').addEventListener('submit', (event) => {
         event.preventDefault();
         const getNilaiPencarian = document.getElementById('input-pencarian-buku').value;
         searchBooks(getNilaiPencarian);
      });
   });

   document.addEventListener(RENDER_EVENT, function() {
      console.log('RENDER EVENT RUNNING');
      const uncompletedBookList = document.getElementById('box-populer-book');
      uncompletedBookList.innerHTML = '';

      const completedBookList = document.getElementById('box-completed-book');
      completedBookList.innerHTML = '';

      for (const bookItem of books) {
         const booksElement = getDataToDisplay(bookItem);
         if (!bookItem.isComplete) {
            uncompletedBookList.append(booksElement);
         } else {
            completedBookList.append(booksElement);
         }
      }
   });

   document.addEventListener(SAVED_EVENT, () => {
      console.log('Data berhasil tersimpan ke Local Storage!');
   });
}