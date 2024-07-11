import initSqlJs from 'sql.js';
// 初始化 Sqlite 
let cachedDB = null;
async function initDatabase() {
  if (cachedDB) {
    return cachedDB;
  }

  try {
    const sqlPromise = await initSqlJs({
      locateFile: (file) => `https://sql.js.org/dist/${file}`,
    });
    const dataPromise = fetch('/backend/music.db').then((res) => {
      if (!res.ok) {
        throw new Error('Failed to fetch database file.');
      }
      return res.arrayBuffer();
    });
    const [SQL, buf] = await Promise.all([sqlPromise, dataPromise]);
    cachedDB = new SQL.Database(new Uint8Array(buf));
    return cachedDB;
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
}

// views/FavoriteView.vue 根據 localStorage 的資料去資料庫獲取資料
export async function fetchShortlistByIds(parms){
  const db = await initDatabase();
  const res = db.exec(
    `SELECT DISTINCT * FROM shortlist WHERE id IN (${parms.join(', ')}) ORDER BY year DESC`,
  );
  return res;
}
