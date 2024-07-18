import initSqlJs from 'sql.js';
const path = process.env.NODE_ENV === 'production' ? '/GMA' : ''

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
    const dataPromise = fetch(`${path}/music.db`).then((res) => {
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

// src\views\AwardsView.vue 的子組件(YearSelect.vue) 下拉選單獲取全部年份
export async function fetchShortlistYear() {
  const db = await initDatabase();
  const res = db.exec(
    `select DISTINCT year from shortlist ORDER BY year DESC`
  );
  return res;
}

// src\views\AwardsView.vue 的子組件(YearAwardsData.vue) 取得年份參數的獎項名稱、得獎作品圖片
export async function fetchShortlistAwardsData(year) {
  const db = await initDatabase();
  const res = db.exec(
    `SELECT DISTINCT awards.awards, shortlist.url
    FROM awards, shortlist
    WHERE awards.awards = shortlist.awards
    AND shortlist.year = ${year}
    AND shortlist.won = 1
    ORDER BY CASE awards.awards
    WHEN '年度歌曲獎' THEN 1
    WHEN '年度專輯獎' THEN 2
    WHEN '最佳華語專輯獎' THEN 3
    WHEN '最佳華語男歌手獎' THEN 4
    WHEN '最佳華語女歌手獎' THEN 5
    WHEN '最佳新人獎' THEN 6
    WHEN '最佳台語專輯獎' THEN 7
    WHEN '最佳台語男歌手獎' THEN 8
    WHEN '最佳台語女歌手獎' THEN 9
    WHEN '最佳樂團獎' THEN 10
    WHEN '最佳演唱組合獎' THEN 11
    WHEN '最佳作詞人獎' THEN 12
    WHEN '最佳作曲人獎' THEN 13
    WHEN '最佳單曲製作人獎' THEN 14
    WHEN '最佳專輯製作人獎' THEN 15
    ELSE 99 -- 預設值
    END;`
  );
  return res;
}

/* src\views\AwardsDetailView.vue 的子組件(AwardsDetail.vue) 
 * 例如取得：『2024/最佳華語專輯獎』所有入圍該年份+獎項的資訊
*/
export async function fetchShortlistAwardsDetailData(year, awards) {
  const db = await initDatabase();
  const res = db.exec(
    `select * from shortlist where year = ${year} and awards = "${awards}"`
  );
  return res;
}

