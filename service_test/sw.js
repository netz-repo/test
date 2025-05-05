// שם המטמון
const CACHE_NAME = 'synagogue-info-cache-v1';

// הקבצים שיש לשמור במטמון בעת ההתקנה
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/data.json',
  '/version.json',
  '/background.jpg'
];

// התקנת ה-Service Worker
self.addEventListener('install', event => {
  console.log('Service Worker: מותקן');
  
  // שמירת קבצים במטמון
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: מטמון נפתח');
        return cache.addAll(FILES_TO_CACHE);
      })
      .then(() => {
        // התקנה מיידית ללא המתנה לסגירת הגרסה הישנה
        return self.skipWaiting();
      })
  );
});

// אירוע הפעלה - ניקוי מטמונים ישנים
self.addEventListener('activate', event => {
  console.log('Service Worker: פעיל');
  
  // מחיקת מטמונים ישנים
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: מוחק מטמון ישן', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => {
      // לקיחת שליטה על כל הלקוחות ללא רענון
      return self.clients.claim();
    })
  );
});

// טיפול בבקשות רשת
self.addEventListener('fetch', event => {
  console.log('Service Worker: בקשה נתפסה', event.request.url);
  
  // אסטרטגיית Network First עבור בקשות JSON
  if (event.request.url.includes('data.json') || event.request.url.includes('version.json')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // העתק התגובה ושמור במטמון
          let responseClone = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseClone);
            });
          return response;
        })
        .catch(() => {
          // אם אין חיבור לאינטרנט, השתמש בגרסה מהמטמון
          return caches.match(event.request);
        })
    );
  } else {
    // אסטרטגיית Cache First עבור קבצים סטטיים
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }
          
          // אם הקובץ לא נמצא במטמון, נסה להוריד אותו
          return fetch(event.request)
            .then(response => {
              // בדוק שהתגובה תקינה
              if (!response || response.status !== 200 || response.type !== 'basic') {
                return response;
              }
              
              // העתק את התגובה ושמור במטמון
              let responseClone = response.clone();
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseClone);
                });
              
              return response;
            });
        })
    );
  }
});

// טיפול בהודעות מהדף
self.addEventListener('message', event => {
  if (event.data.type === 'UPDATE_CACHE') {
    console.log('Service Worker: מעדכן מטמון', event.data.url);
    
    // יצירת תגובה חדשה מהמידע שהתקבל
    const responseData = new Response(JSON.stringify(event.data.data), {
      headers: { 'Content-Type': 'application/json' }
    });
    
    // עדכון המטמון עם המידע החדש
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.put(event.data.url, responseData);
      })
      .then(() => {
        console.log('Service Worker: מטמון עודכן בהצלחה');
      })
      .catch(error => {
        console.error('Service Worker: שגיאה בעדכון המטמון', error);
      });
  }
});