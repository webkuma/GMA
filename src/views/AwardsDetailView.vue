<script setup>
import { onMounted, ref } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import Loading from '../components/Loading.vue';
import Swal from 'sweetalert2';
import initSqlJs from 'sql.js';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import { Offcanvas } from 'bootstrap';

import { useGetKkboxTokenStore } from '../stores/counter.js';
import { useGetKkboxSongIdStore } from '../stores/counter.js';
const getKkboxTokenSotre = useGetKkboxTokenStore();
const getSongIdSotre = useGetKkboxSongIdStore();

const getDB = ref();
const isLoading = ref(1);
const sortedEntries = ref(0);
const router = useRouter();
const routerParamsYear = ref();
const routerParamsAwards = ref();
const awardsData = ref(); // 取得當年度的獎項名稱&得獎作品的圖片
const alertBackgroundImg = ref();
const LoadImg = () => {
  const img = new Image();
  img.src =
    'https://png.pngtree.com/png-clipart/20230817/original/pngtree-vertical-stripes-background-in-abstract-white-and-gray-geometric-pattern-vector-png-image_10462619.png';
  img.onload = () => {
    alertBackgroundImg.value = img.src;
  };
};
const isNotFoundYear = ref();
const yearList = ref(); // 下拉選單所有年份
const selectedYear = ref('');
// test
const awardsDetail = ref();
const matchid = ref();
const token = ref();
const searchKeyword = ref();
const searchType = ref();

onMounted(async () => {
  LoadImg();
  isLoading.value = 1;
  await router.isReady();
  routerParamsYear.value = router.currentRoute.value.params['year'];
  routerParamsAwards.value = router.currentRoute.value.params['awards'];
  getYearData();
  getSelectedYear();
  getAwardsData();
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
  token.value = await getKkboxTokenSotre.getKkboxToken();
  // 检查 Token 是否有效，则获取新的 Token
  // if (!getKkboxTokenSotre.hasValidToken()) {
  //   token.value = await getKkboxTokenSotre.getKkboxToken();
  //   console.log(token.value.access_token);
  // }
  // console.log(getKkboxTokenSotre.hasValidToken());
});

async function initDatabase() {
  const sqlPromise = await initSqlJs({
    locateFile: (file) => `https://sql.js.org/dist/${file}`,
  });
  const dataPromise = fetch('/backend/music.db').then((res) => res.arrayBuffer());
  const [SQL, buf] = await Promise.all([sqlPromise, dataPromise]);
  const db = new SQL.Database(new Uint8Array(buf));
  getDB.value = db;
  return db;
}
// 取得 參數年份、參數獎項的資料
async function getAwardsData(year = null, awards = null) {
  routerParamsYear.value = year ? year : routerParamsYear.value;
  routerParamsAwards.value = awards ? awards : routerParamsAwards.value;

  const db = await initDatabase();
  const result = db.exec(
    `select * from shortlist where year = ${routerParamsYear.value} and awards = "${routerParamsAwards.value}"`,
  );
  awardsDetail.value = result[0].values;
}
// 取得當年度的獎項名稱&得獎作品的圖片
async function getYearData() {
  const db = await initDatabase();
  const imgResult = db.exec(
    `SELECT DISTINCT awards.awards, shortlist.url, shortlist.year
    FROM awards, shortlist
    WHERE awards.awards = shortlist.awards
    AND shortlist.year = ${routerParamsYear.value}
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
    END;`,
  );
  if (imgResult.length) {
    awardsData.value = imgResult[0].values;
    const result = db.exec(`select * from shortlist where year = ${routerParamsYear.value}`);
    sortedEntries.value = result[0].values;
    sortedEntries.value ? (isLoading.value = 0) : (isLoading.value = 1);
    isNotFoundYear.value = false;
  } else {
    isNotFoundYear.value = true;
    isLoading.value = 0;
  }
}
// 下拉選單獲取全部年份
async function getSelectedYear() {
  const db = await initDatabase();
  const result = db.exec(`select DISTINCT year from shortlist ORDER BY year DESC`);
  yearList.value = result[0].values.map((item) => item[0]);
  selectedYear.value = routerParamsYear.value; // [0] 取最新年份
}
// 下拉選單 @change => getYearData()
function onchangeUpdateYear(year) {
  routerParamsYear.value = year;
  console.log(`/Awards/${year}/${routerParamsAwards.value}`);
  router.push({ path: `/Awards/${year}/${routerParamsAwards.value}` });
  getAwardsData(); // 拿右邊資料
  getYearData(); // 拿左邊獎項
}
// 查看最新名單跳轉
function updateSelectedYear(year, awards) {
  getAwardsData(year, awards);
  router.push({ path: `/Awards/${year}/${awards}` });
}
// 試聽
async function audition(song, singer, awards) {
  switch (awards) {
    case '年度歌曲獎': // 搜尋:track
      searchKeyword.value = deleteAlbum(song) + ' ' + singer;
      searchType.value = 'track';
      break;
    case '最佳作曲人獎': //搜尋:track
    case '最佳作詞人獎':
    case '最佳單曲製作人獎':
      searchKeyword.value = deleteAlbum(song);
      searchType.value = 'track';
      break;
    case '最佳專輯製作人獎': //搜尋:album
      searchKeyword.value = deleteAlbum(song);
      searchType.value = 'album';
      break;
    default: //搜尋:album
      searchKeyword.value = song + ' ' + singer;
      searchType.value = 'album';
  }
  const id = toast.loading('Loading...', {
    position: toast.POSITION.BOTTOM_RIGHT,
    autoClose: true,
    theme: 'dark',
    transition: 'flip',
  });

  try {
    matchid.value = await getSongIdSotre.getSongId(searchKeyword.value, searchType.value, token.value.access_token);
    toast.clearAll();
  } catch (error) {
    console.error(error);
    toast.error('Error occurred', { autoClose: 5000 });
    toast.clearAll();
  }
}
// 刪除歌曲的引號《》
function deleteAlbum(song) {
  if (song.indexOf('《') !== -1) {
    return song.substring(0, song.indexOf('《'));
  } else {
    return song;
  }
}
</script>

<template>
  <main class="text-white">
    <!-- 處理非預期的年份 -->
    <div v-if="isNotFoundYear" class="z-20 absolute w-full h-full bg-[#202020]/90 bg-opacity-90">
      <div class="flex flex-col items-center justify-center h-full text-white">
        <p class="text-6xl text-custom-gold">(='X'=)</p>
        <p class="text-2xl m-4">年份錯誤</p>
        <p class="text-lg">
          <RouterLink
            to="/"
            class="p-3 flex items-center justify-center text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 focus:ring-4 font-medium rounded-lg text-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-4 h-4 mr-1"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
            </svg>
            <span>返回首頁</span>
          </RouterLink>
        </p>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="isLoading === 1" class="absolute w-full h-full bg-[#202020] bg-opacity-90">
      <div class="flex items-center justify-center h-full">
        <Loading />
      </div>
    </div>

    <!-- main content -->
    <div v-if="!isNotFoundYear && isLoading === 0">
      <div class="flex justify-between p-4">
        <!-- 導航列 -->
        <div class="flex justify-between items-center">
          <nav
            class="flex justify-between items-center p-3 text-gray-700 border border-gray-200 rounded-lg bg-gray-50"
            aria-label="Breadcrumb"
          >
            <ol class="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
              <li class="inline-flex items-center">
                <RouterLink to="/" class="flex items-center">
                  <a
                    href="#"
                    class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
                  >
                    <svg
                      class="w-3 h-3 me-2"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"
                      />
                    </svg>
                    首頁
                  </a>
                </RouterLink>
              </li>
              <li>
                <div class="flex items-center">
                  <svg
                    class="rtl:rotate-180 block w-3 h-3 mx-1 text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 6 10"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="m1 9 4-4-4-4"
                    />
                  </svg>
                  <RouterLink :to="`/Awards/${routerParamsYear}`" class="flex items-center">
                    <a
                      class="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white"
                    >
                      {{ routerParamsYear }} 年
                    </a>
                  </RouterLink>
                </div>
              </li>
              <li>
                <div class="flex items-center">
                  <svg
                    class="rtl:rotate-180 block w-3 h-3 mx-1 text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 6 10"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="m1 9 4-4-4-4"
                    />
                  </svg>
                  <a
                    class="ms-1 text-sm font-medium text-gray-900 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white"
                  >
                    {{ routerParamsAwards }}
                  </a>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        <!-- 年份下拉選單 -->
        <div class="flex">
          <select
            @change="onchangeUpdateYear(selectedYear)"
            v-model="selectedYear"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-2"
          >
            <option :value="year" v-for="year in yearList" :key="year">{{ year }}</option>
          </select>
        </div>
      </div>

      <!-- [0]:id、[1]:獎項、[2]:歌手、[3]:歌、[4]:年、[5]:得獎0/1、[6]:圖片url -->
      <div class="flex flex-col lg:flex-row gap-1 px-4">
        <!-- < lg 顯示下拉選單 -->
        <section class="flex lg:hidden mb-4">
          <select
            @change="updateSelectedYear(routerParamsYear, routerParamsAwards)"
            v-model="routerParamsAwards"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-2"
          >
            <option :value="item[0]" v-for="item in awardsData" :key="item.id">{{ item[0] }}</option>
          </select>
        </section>
        <!-- > lg 顯示圖形化的介面 -->
        <section class="w-1/2 bg-gray-600 bg-opacity-20 rounded hidden lg:block">
          <h2 class="pt-4 text-2xl font-bold text-center text-yellow-200">看其他獎項</h2>
          <div class="place-items-center place-content-center grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            <!-- awardsData[0]:awards [1]:src [2]:year -->
            <div
              class="relative w-32 h-32 flex items-center justify-center bg-custom-gold rounded-md cursor-pointer m-4"
              v-for="item in awardsData"
              :key="item.id"
              @click="updateSelectedYear(item[2], item[0])"
            >
              <span class="absolute inset-0 bg-black rounded-md opacity-50" aria-hidden="true"></span>
              <span class="absolute font-bold">{{ item[0] }}</span>
              <img :src="item[1]" class="p-1 rounded-xl w-32 h-32 aspect-square" alt="awards img" />
            </div>
          </div>
        </section>
        <!-- 歌曲資訊 -->
        <section class="w-full lg:w-1/2 flex flex-col bg-gray-600 bg-opacity-20 rounded">
          <!-- 獎項文字 + 試聽按鈕 -->
          <div class="grid grid-cols-8">
            <div class="grid grid-cols-subgrid col-span-2 gap-4 justify-items-center content-center">
              <button
                v-if="
                  matchid &&
                  routerParamsAwards !== '年度歌曲獎' &&
                  routerParamsAwards !== '最佳作曲人獎' &&
                  routerParamsAwards !== '最佳作詞人獎' &&
                  routerParamsAwards !== '最佳單曲製作人獎'
                "
                class="col-start-1 text-[#f4e0b2] font-black bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-yellow-500 text-base p-3 text-center me-2 mb-2 rounded-lg"
                type="button"
                data-bs-toggle="offcanvas"
                data-bs-target="#demo"
              >
                專輯試聽側欄
              </button>
            </div>
            <div class="grid grid-cols-subgrid col-span-4 gap-4">
              <h2 class="col-start-2 py-4 text-2xl font-bold text-yellow-200">
                {{ routerParamsAwards }}
              </h2>
            </div>
          </div>
          <!-- 歌曲 iframe-->
          <div v-if="matchid" class="flex justify-center">
            <div v-if="searchType === 'track'">
              <iframe
                class="h-[100px] w-72"
                :src="`https://widget.kkbox.com/v1/?id=${matchid}&type=song&terr=TW&lang=TC&autoplay=true`"
                allow="autoplay"
              />
            </div>
          </div>

          <div
            class="hover:bg-slate-700 flex justify-between rounded-md m-2"
            v-for="item in awardsDetail"
            :key="item[0]"
          >
            <!-- 顯示歌曲/歌手 -->
            <div class="flex">
              <img :src="item[6]" class="row-span-2 p-2 rounded-xl w-20 h-20 aspect-square" alt="awards img" />
              <div v-if="item[5]" class="flex flex-col justify-center text-yellow-200">
                <span>{{ item[3] }}</span>
                <span>{{ item[2] }}</span>
              </div>
              <div v-else class="flex flex-col justify-center">
                <span>{{ item[3] }}</span>
                <span>{{ item[2] }}</span>
              </div>
            </div>
            <!-- 試聽按鈕 -->
            <div v-if="token" class="flex items-center justify-center">
              <button
                v-if="
                  item[1] === '年度歌曲獎' ||
                  item[1] === '最佳作曲人獎' ||
                  item[1] === '最佳作詞人獎' ||
                  item[1] === '最佳單曲製作人獎'
                "
                class="py-2 px-4"
                type="button"
                @click="audition(item[3], item[2], item[1])"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.0"
                  stroke="currentColor"
                  class="w-8 h-8"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z"
                  />
                </svg>
              </button>
              <button
                v-else
                data-bs-toggle="offcanvas"
                data-bs-target="#demo"
                class="py-2 px-4"
                type="button"
                @click="audition(item[3], item[2], item[1])"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.0"
                  stroke="currentColor"
                  class="w-8 h-8"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div>
            <p class="p-2 text-gray-400"># 試聽找錯可能是金曲獎名稱與對方建立的 KKBOX 帳號不匹配或搜尋結果重複 ...</p>
          </div>
        </section>
      </div>
    </div>
  </main>
  <!-- 側欄 iframe -->
  <div class="offcanvas offcanvas-start text-bg-dark" id="demo" style="width: 350px">
    <div class="offcanvas-header">
      <h1 class="offcanvas-title">專輯試聽</h1>
      <button type="button" class="btn-close btn-close-white border" data-bs-dismiss="offcanvas">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="{1.5}"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
    <div class="offcanvas-body flex items-center justify-center">
      <div v-if="searchType === 'album'">
        <iframe
          class="fixed top-[64px] left-3 h-[calc(100%-64px)] border-0"
          :src="`https://widget.kkbox.com/v1/?id=${matchid}&type=album&terr=TW&lang=TC&autoplay=true`"
          allow="autoplay"
        />
      </div>
      <!-- <button class="btn btn-secondary" type="button">A Button</button> -->
    </div>
  </div>
</template>
