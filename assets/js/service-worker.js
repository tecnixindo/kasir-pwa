// /assets/js/service-worker.js

// 1. WAJIB: Impor Workbox dan Workbox Google Analytics
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');

// Pastikan Workbox berhasil dimuat
if (!workbox) {
  console.error(`Workbox gagal dimuat. Workbox hanya tersedia di browser modern dan
                Service Worker API.`);
}

// 2. Inisialisasi Workbox Google Analytics (Offline Analytics)
// Ini akan secara otomatis menyimpan (queue) hits GA yang gagal saat offline
// dan mengirimkannya kembali saat online.
if (workbox.googleAnalytics) {
  try {
    workbox.googleAnalytics.initialize();
    console.log('Workbox Google Analytics: Offline tracking diaktifkan.');
  } catch (error) {
    console.error('Gagal menginisialisasi Workbox Google Analytics:', error);
  }
}

// 3. Konfigurasi Pre-caching (Aset Inti Aplikasi)
// Daftar aset inti yang harus di-cache saat Service Worker terinstal.
const CACHE_NAME = 'kasir-pwa-v1';
const urlsToCache = [
  // --- Core App Pages ---
  '/', // Sangat disarankan untuk meng-cache halaman utama (index.html)
  '/index.html', // Pastikan index.html di-cache agar bisa jadi fallback utama
  '/pos.html',
  '/product.html',
  '/customer.html',
  '/report.html',
  '/setting.html',
  '/profile.html',
  '/logout.html',
  '/install.html', // Jangan lupa tambahkan halaman install yang baru Anda buat!

  // --- Manifest & Icons (KRUSIAL UNTUK INSTALL) ---
  '/assets/json/manifest.json', // <-- WAJIB DITAMBAHKAN
  '/assets/img/icon-192x192.png', // <-- WAJIB DITAMBAHKAN
  '/assets/img/icon-512x512.png', // <-- SANGAT DISARANKAN (untuk splash screen)

  // --- Stylesheets ---
  'https://cdn.jsdelivr.net/npm/admin-lte@3.2/dist/css/adminlte.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/awesomplete/1.1.7/awesomplete.min.css',
  '/assets/css/awesomplete.dark.css',
  'https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700&display=swap',

  // --- Scripts ---
  'https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js',
  'https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/js/bootstrap.bundle.min.js',
  'https://cdn.jsdelivr.net/npm/admin-lte@3.2/dist/js/adminlte.min.js',
  'https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.js',
  'https://cdn.jsdelivr.net/npm/pouchdb@7.3.0/dist/pouchdb.min.js',
  'https://unpkg.com/html5-qrcode@2.3.8/html5-qrcode.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/howler/2.2.3/howler.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/awesomplete/1.1.7/awesomplete.min.js',
  '/assets/js/scanner.js',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js',

  // --- Assets ---
  '/assets/mp3/beep-success.mp3',
  '/assets/mp3/beep-failed.mp3'
];

// Daftarkan URL di atas untuk di-cache segera (Precaching)
workbox.precaching.precacheAndRoute(urlsToCache);

// 4. Konfigurasi Routing (Strategi Caching untuk Aset Tambahan)
// Gunakan workbox.routing untuk menentukan strategi berdasarkan URL.

// A. Strategi untuk Aset CDN dan Pihak Ketiga (Stale While Revalidate)
// Strategi ini cepat (melayani dari cache jika ada) tetapi tetap memperbarui cache 
// di latar belakang saat koneksi tersedia. Sangat ideal untuk library eksternal.
workbox.routing.registerRoute(
  // CDN Stylesheets & Scripts
  ({url}) => url.origin === 'https://cdn.jsdelivr.net' || 
             url.origin === 'https://cdnjs.cloudflare.com',
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'cdn-assets',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 50, // Batasi jumlah item
        maxAgeSeconds: 30 * 24 * 60 * 60, // Hapus setelah 30 hari
      }),
    ],
  }),
);

// B. Strategi untuk Google Fonts (Cache First)
// Font jarang berubah, jadi Cache First lebih efisien.
workbox.routing.registerRoute(
  ({url}) => url.origin === 'https://fonts.googleapis.com' ||
             url.origin === 'https://fonts.gstatic.com',
  new workbox.strategies.CacheFirst({
    cacheName: 'google-fonts',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 30,
        maxAgeSeconds: 365 * 24 * 60 * 60, // Hapus setelah 1 tahun
      }),
    ],
  }),
);

// C. Strategi untuk Request API (Network First atau Stale While Revalidate)
// Asumsikan data API (PouchDB/Database Sync) harus diutamakan dari Network.
// Ganti /api/v1/ dengan endpoint API Anda yang sebenarnya.
workbox.routing.registerRoute(
    ({url}) => url.pathname.startsWith('/api/v1/'),
    new workbox.strategies.NetworkFirst({
        cacheName: 'data-api',
        plugins: [
            new workbox.expiration.ExpirationPlugin({
                maxEntries: 10,
            }),
        ],
    })
);


// 5. Penanganan Navigasi Offline (Fallback)
// Ini adalah fallback untuk halaman yang tidak ada di Pre-cache saat offline.
workbox.routing.registerRoute(
  // Hanya berlaku untuk permintaan navigasi (misalnya saat mengetik URL baru)
  ({request}) => request.mode === 'navigate',
  async () => {
    try {
      // Coba ambil dari network
      return await new workbox.strategies.NetworkOnly().handle({request});
    } catch (error) {
      // Jika network gagal, kembalikan halaman utama (fallback)
      const cachedResponse = await caches.match('/index.html');
      
      // Jika index.html sudah di-cache (dari precache), kembalikan itu.
      if (cachedResponse) {
        return cachedResponse;
      }
      // Jika tidak ada apa-apa, Workbox akan menampilkan error default browser (tidak disarankan)
      throw error;
    }
  }
);


// 6. Pengaturan Service Worker Lanjutan
// Mengaktifkan skipWaiting agar Service Worker baru segera mengambil alih kendali.
self.skipWaiting();

// Install service worker
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch dari cache dulu (offline-first)
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Return response dari cache jika ada
        if (response) {
          return response;
        }
        // Jika tidak ada di cache, fetch dari network
        return fetch(event.request).catch(function() {
          // Jika offline dan tidak ada di cache, return halaman default
          if (event.request.mode === 'navigate') {
            return caches.match('/pos.html'); // Lebih baik gunakan index.html sebagai fallback utama
          }
        });
      })
  );
});

// Update cache
self.addEventListener('activate', function(event) {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});


// [OPTIONAL] Event untuk menangani notifikasi latar belakang
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/')
  );
});