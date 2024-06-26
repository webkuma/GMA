import { ref, reactive, computed } from 'vue'
import { defineStore } from 'pinia'
import initSqlJs from 'sql.js';
import axios from 'axios';

/** 將 SQLite 返回的数据格式转换为对象数组。
 * 
 * @param {Array} columns - 包含列名的数组，每个元素是一个列名字符串。例如：['id', 'awards', 'nominee', 'work', 'year', 'won', 'url']。
 * @param {Array} values - 包含数据值的二维数组，每个子数组表示一行数据。例如：[[1, 'Best Actor', 'Leonardo DiCaprio', 'Inception', 2010, true, 'https://example.com/1'], ...]。
 * @returns {Array} - 转换后的对象数组，每个对象对应一行数据，其中键是列名，值是数据值。
 * 
 * @example
 * const columns = ['id', 'awards', 'nominee', 'work', 'year', 'won', 'url'];
 * const values = [
 *   [1, 'Best Actor', 'Leonardo DiCaprio', 'Inception', 2010, true, 'https://example.com/1'],
 *   [2, 'Best Actress', 'Natalie Portman', 'Black Swan', 2010, true, 'https://example.com/2'],
 * ...];
 * const result = mapSQLiteResultToObjects(columns, values);
 * // result: [
 * //   { id: 1, awards: 'Best Actor', nominee: 'Leonardo DiCaprio', work: 'Inception', year: 2010, won: true, url: 'https://example.com/1' },
 * //   { id: 2, awards: 'Best Actress', nominee: 'Natalie Portman', work: 'Black Swan', year: 2010, won: true, url: 'https://example.com/2' },
 * // ...]
 */
const mapSQLiteResultToObjects = (columns, values) => {
  return values.map(valueArray => {
      let obj = {};
      columns.forEach((col, index) => {
          obj[col] = valueArray[index];
      });
      return obj;
  });
};

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const selected = ref('分類') // SearchBox 的下拉選單
  const selectedYear = ref(''); // home 頁面的選取年份，用來傳到 awards/:year
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }

  return { count, selected, selectedYear, doubleCount, increment }
})
export const useMenuStore = defineStore('menu', () => {
  const isMaskClicked = ref(0);
  const counter = ref(0);
  function toggleMenuVisibility() {
    if(!counter.value){
      isMaskClicked.value = !isMaskClicked.value;
      counter.value = 1;
    } else {
      isMaskClicked.value = !isMaskClicked.value;
      counter.value = 0;
    }
  }
  return { isMaskClicked, counter, toggleMenuVisibility }
})
export const useSearchStore = defineStore('search', () => {
  const searchInput = ref(undefined); // 搜尋框 v-model
  const searchWord = ref(); // input 或 keyword 放這
  const storageMatchData = ref([]);
  const yearsData = ref();
  const result = ref();

  const state = reactive({
    UnsearchedState: true, // 預設顯示排行榜
    SearchedNotFound: false, // 搜尋沒有符合結果
    SearchedFound: false, // 搜尋符合結果
    Searching: false, // 搜尋中~
  });
  
  // 更新狀態用於顯示前端的畫面
  function updateState(param) {
    Object.keys(state).forEach(key => {
      state[key] = key === param ? true : false;
    });
  }
  // 回到排行榜列表，清除搜尋資料
  function backWonList(){
    searchInput.value = null;
    searchWord.value = null;
    updateState('UnsearchedState');
  }
  // searchWord 放入搜尋字 呼叫 searchHandler() 處理搜尋
  function setSearchWord(keyword = null){
    updateState('Searching');
    searchWord.value = keyword ? keyword : searchInput.value;
    searchInput.value = keyword ? keyword : searchInput.value;
    searchHandler();
  }
  // 主要的搜尋處理函數
  function searchHandler() {
    // 步驟 1: 從資料庫中取得資料
    const sqlPromise = initSqlJs({
      locateFile: (file) => `https://sql.js.org/dist/${file}`,
    });
    const dataPromise = fetch('/backend/music.db').then((res) => res.arrayBuffer());
  
    return Promise.all([sqlPromise, dataPromise]).then(([SQL, buf]) => {
      const db = new SQL.Database(new Uint8Array(buf));
      result.value = db.exec(`select * from shortlist `);

      // 步驟 2: 根據 searchWord 搜尋匹配的資料
      storageMatchData.value = getMatchingData(searchWord.value, result.value[0].values);

      // 同時將 yearsData.value 設為 undefined，以確保沒有年份資料被顯示
      if (!storageMatchData.value.length) {
        yearsData.value = undefined;
        updateState('SearchedNotFound');
      } else {
        // 步驟 3: 將 storageMatchData 轉換為所需的格式
        yearsData.value = transformData(storageMatchData.value);
        updateState('SearchedFound');

        // 步驟 4: 對資料按年份和 won 屬性進行排序
        sortData(yearsData.value);

        // 步驟 5: 捲動回頂端
        scrollToTop();
      }

      console.log(yearsData.value);
      return Promise.resolve();
    });
  }
  
  // 根據 searchWord 過濾資料
  function getMatchingData(searchWord, data) {
    // e[0]:id [1]:awards, [2]:nominee, [3]:work, [4]:year, [5]:won, [6]:url  
    return data.filter((e) => isMatch(searchWord, e[1], e[2], e[3]));
  }
  
  // 檢查 searchWord 是否與資料中的任何字段匹配
  function isMatch(searchWord, ...fields) {
    if (!searchWord) return false;
    const lowerSearchWord = searchWord.toLowerCase();
    return fields.some((field) => field.toLowerCase().includes(lowerSearchWord));
  }
  
  // 將 storageMatchData 轉換為所需的格式
  function transformData(storageMatchData) {
    const transformedData = [];
    storageMatchData.forEach((data) => {
      const year = data[4];
      let yearArray = transformedData.find((item) => item.year === year);
      if (!yearArray) {
        yearArray = { year: year, data: [] };
        transformedData.push(yearArray);
      }
      yearArray.data.push({
        id: data[0],
        awards: data[1],
        nominee: data[2],
        work: data[3],
        year: data[4],
        won: data[5],
        url: data[6],
        isStoraged: localStorage.getItem(`favoriteStorage-${data[0]}`) ? true : false,
      });
    });
    return transformedData;
  }
  
  // 對資料按年份和 won 屬性進行排序
  function sortData(yearsData) {
    yearsData.sort((a, b) => b.year - a.year);
    yearsData.forEach((yearData) => {
      yearData.data.sort((a, b) => b.won - a.won);
    });
  }
  
  /**
  * 更新 awards 頁面中的年份資料
  * @param {number} id - 要更新的資料的唯一識別符
  * @param {boolean} idStatus - true 表示收藏(+icon class)，false 表示移除(-icon class)
  */
  function updateYearsDataStorage(id, idStatus){
    yearsData.value.forEach(element => {
      element.data.forEach(data => {
        if(data.id == id){
          data.isStoraged = idStatus
        }
      });
    });
  }

  // 捲動回頂端
  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // 使用平滑滾動效果
    });
  }
  return { updateYearsDataStorage, state, updateState, yearsData ,searchWord, searchInput, storageMatchData, setSearchWord, searchHandler, backWonList }
})
// init SQLITE
export const useInitDatabaseStore = defineStore('initDatabase', () => {
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
      const db = new SQL.Database(new Uint8Array(buf));
      cachedDB = db;
      return db;
    } catch (error) {
      console.error('Database initialization failed:', error);
      throw error;
    }
  }

  return { initDatabase };
});

/* ------  HomeView ------ */

/** Homeview 取得所有年份資料(DISTINCT)。
 * 
 * @returns {Promise<Array<number>>} - 包含年份的數組。
 */
export const useGetYearDataStore = defineStore('getYearData', () => {
  const sql = "SELECT DISTINCT year FROM shortlist WHERE shortlist.won = 1 ORDER BY year DESC";
  const yearData = ref();
  const isLoading = ref();
  async function getYearData() {
    const init = useInitDatabaseStore();
    const db = await init.initDatabase() ;
    const result = db.exec(sql);
    console.log(result[0].values);
    yearData.value = result[0].values.map((item) => item[0]);
    isLoading.value = yearData.value ? 0 : 1;
  }

  return { yearData, isLoading ,getYearData }
})

/** Homeview(輪播功能) 取得指定獎項最新年份的資料。
 * 
 * @param {string} awards - 獎項名稱。
 * @param {boolean} isPreviousYear - true 為取得去年資料，否則為今年。(new)
 * @returns {Promise<Array<Object>>} - 包含最新年份指定獎項候選人資料的對象數組。
 * 
 * @remarks AND nominee != '尚未開獎'`; 為未開獎時佔位資料，輪播不需要出現。
 */
export const useGetLastYearNominees = defineStore('getLastYearAlbums', () => {
  async function getYearData(awards, isPreviousYear = false) {
    let yearQuery = isPreviousYear ? `SELECT MAX(year) - 1` : `SELECT MAX(year)`;
    const sql = `
    SELECT DISTINCT * FROM shortlist 
    WHERE year = (
        ${yearQuery}
        FROM shortlist
    )
    AND awards = '${awards}'
    AND nominee != '尚未開獎'`;
    const init = useInitDatabaseStore();
    const db = await init.initDatabase();
    const result = db.exec(sql);
    return mapSQLiteResultToObjects(result[0].columns, result[0].values);
  }

  return { getYearData }
})


// SearchView 取得list的資料 
export const useGetWonListStore = defineStore('GetWonList', () => {
  const mountedWonList = ref()
  async function getWonListData(query) {
    const sql = query
    const init = useInitDatabaseStore();
    const db = await init.initDatabase() 
    const result = db.exec(sql);
    mountedWonList.value = result[0].values.map(element => {
      return {
        nominee: element[0],
        url: element[1],
        won: element[2],
        nomineeTime: element[3],
        id: element[4],
      };
    });
  }
  return { mountedWonList, getWonListData }
})
