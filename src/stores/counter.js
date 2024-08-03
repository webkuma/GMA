import { fetchShortlistYear, fetchShortlist, searchShortlist } from "@/lib/frontendQuery.js";
import { ref, reactive, computed } from 'vue'
import { defineStore } from 'pinia'
import initSqlJs from 'sql.js';
import axios from 'axios';
const path = process.env.NODE_ENV === 'production' ? '/GMA' : ''

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
  async function searchHandler() {
    // 步驟 1: 從資料庫中取得資料
    result.value = await searchShortlist(searchWord.value);
    storageMatchData.value = result.value;
    console.log(result.value)
      // result.value = db.exec(`select * from shortlist`);

      // 步驟 2: 根據 searchWord 搜尋匹配的資料
      // storageMatchData.value = getMatchingData(searchWord.value, result.value[0].values);

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

      // console.log(yearsData.value);
      return Promise.resolve();
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
  // 把格式變成 { year:2024, data:[...] }, { year:2023, data:[...] }
  function transformData(storageMatchData) {
    const transformedData = [];
    storageMatchData.forEach((data) => {
      const year = data.year;
      let yearArray = transformedData.find((item) => item.year === year);
      if (!yearArray) {
        yearArray = { year: year, data: [] };
        transformedData.push(yearArray);
      }
      yearArray.data.push({
        id: data.id,
        awards: data.awards,
        nominee: data.nominee,
        work: data.work,
        year: data.year,
        won: data.won,
        url: data.url,
        isStoraged: localStorage.getItem(`favoriteStorage-${data[0]}`) ? true : false,
      });
      // console.log(transformedData)
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
  * 根據收藏或取消收藏的操作，更新搜尋/收藏頁面中資料的收藏狀態(icon)
  * 如果有搜尋關鍵字時，在收藏頁按下取消 if 就會成立，若沒有關鍵字就不會執行，但因為下次再執行會更新狀態也不會有顯示問題
  * @param {number} id - 要更新的資料的唯一識別符
  * @param {boolean} idStatus - true 表示收藏(+icon class)，false 表示移除(-icon class)
  */ 
  function updateYearsDataStorage(id, idStatus){
    if(yearsData.value){
      yearsData.value.forEach(element => {
        element.data.forEach(data => {
          if(data.id == id){
            data.isStoraged = idStatus;
          }
        });
      });
    }
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


/* ------  HomeView ------ */

/** Homeview 取得所有年份資料(DISTINCT)。
 * 
 * @returns {Promise<Array<number>>} - 包含年份的數組。
 */
export const useGetYearDataStore = defineStore('getYearData', () => {
  const yearData = ref();
  const isLoading = ref();
  async function getYearData() {
    const result = await fetchShortlistYear();
    yearData.value = result
    // console.log(yearData.value);
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
  const latestYear = ref();
  const previousYear = ref();

  // 獲取最新年份和上一年份
  async function getYear() {
    try {
      const res = await fetchShortlistYear();
      previousYear.value = res[0]?.year ?? null;
      latestYear.value = res[1]?.year ?? null;
    } catch (error) {
      console.error('Error fetching year data:', error);
    }
  }

  async function getYearData(awards, isPreviousYear = false) {
    if (!latestYear.value || !previousYear.value) {
      await getYear();
    }
    const year = isPreviousYear ? latestYear.value : previousYear.value;
    const data = { year, awards };
    try {
      const result = await fetchShortlist(data);
      return result;
    } catch (error) {
      console.error('Error fetching year data:', error);
      return;
    }
  }

  return { getYearData }
})

// 取得 kkbox token 
export const useGetKkboxTokenStore = defineStore('getKkboxToken', () => {
  const token = ref({
    access_token: '',
    expires_in: '',
    token_type: '',
  });

  const getKkboxToken = async () => {
    try {
      const response = await fetch('https://tprdzhsf2g.execute-api.ap-southeast-2.amazonaws.com/default/kkbox-token', {
        method: 'GET',
      });
      const data = await response.json();
      token.value = data
    } catch (error) {
      console.error('Error:', error);
    }
    return token.value;
  };

  const hasValidToken = () => {
    return !!token.value?.access_token && !!token.value?.expires_in;
  };

  return { getKkboxToken, hasValidToken };
});
// 取得 歌曲 ID 試聽的 iframe 要用
export const useGetKkboxSongIdStore = defineStore('getKkboxSongId', () => {
  // 傳入 1. 查詢的歌曲名稱(+歌手) 2. toekn 
  // return 歌曲ID 
  async function getSongId(searchKeyword, searchType, token) {
    console.log(searchKeyword);
    const config = {
      method: 'GET',
      url: 'https://api.kkbox.com/v1.1/search',
      params: {
        q: searchKeyword,
        type: searchType,
        territory: 'TW',
        offset: 0,
        limit: 50,
      },
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + token,
      },
    };
    try {
      const response = await axios(config);
      const res = response.data;
      if(searchType==='track'){
        return res.tracks.data[0].id;
      }else if(searchType==='album'){
        console.log(response.data.albums.data[0].id)
        return response.data.albums.data[0].id
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  return { getSongId };
});
