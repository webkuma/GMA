<script setup>
import { onMounted, ref } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import Loading from '../components/Loading.vue';
import Swal from 'sweetalert2';
import initSqlJs from 'sql.js';

const getDB = ref();
const isLoading = ref(1);
const sortedEntries = ref(0);
const router = useRouter();
const routerParamsYear = ref();
const awardsData  = ref(); // 取得當年度的獎項名稱&得獎作品的圖片
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

onMounted(async () => {
  LoadImg();
  isLoading.value = 1;
  await router.isReady();
  routerParamsYear.value = router.currentRoute.value.params['year'];
  getYearData();
  getSelectedYear();
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

// 取得當年度的獎項名稱&得獎作品的圖片
async function getYearData() {
  const db = await initDatabase();
  const imgResult = db.exec(
    `SELECT DISTINCT awards.awards, shortlist.url
    FROM awards, shortlist
    WHERE awards.awards = shortlist.awards
    AND shortlist.year = ${routerParamsYear.value}
    AND shortlist.won = 1;`,
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
  router.push({ path: `/Awards/${year}` });
  getYearData();
}
// @click 顯示該獎項的提名資訊
function openSwal2(p1, bgImg) {
  let str = '';
  const result = getDB.value.exec(`
  select * from shortlist where year = ${routerParamsYear.value} and awards = "${p1}"`);
  if (result && result.length >= 1) {
    result[0].values.forEach((e) => {
      // e[5] = 得獎
      if (e[5]) {
        str += `
          <div class="flex justify-center items-stretch  m-4" v-for="item in sortedEntries"
          :key="item.id">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-7 h-7 text-red-600 leading-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
            </svg>
            <span class="inline-block ml-1 font-semibold text-red-600">${e[2]} ／ ${e[3]}</span><br>
          </div>`;
      } else {
        str += `<span class="inline-block font-semibold m-2">${e[2]} ／ ${e[3]}</span><br>`;
      }
    });
  } else {
    str = '還沒建立資料ㄋQQ';
  }

  Swal.fire({
    title: p1,
    html: str,
    color: '#bb9457',
    background: `url(${bgImg})`,
    // icon: 'error',
    confirmButtonText: 'Cool',
  });
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
                  <a
                    class="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white"
                  >
                    {{ routerParamsYear }} 年
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
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-4"
          >
            <option :value="year" v-for="year in yearList" :key="year">{{ year }}</option>
          </select>
        </div>
      </div>

      <!-- awards  -->
      <div
        class="place-items-center place-content-center grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      >
        <div
          class="relative w-60 h-60 flex items-center justify-center bg-custom-gold rounded-md cursor-pointer m-4"
          v-for="item in awardsData"
          :key="item.id"
          @click="openSwal2(item[0], alertBackgroundImg)"
        >
          <span class="absolute inset-0 bg-black rounded-md opacity-50" aria-hidden="true"></span>
          <span class="absolute text-xl font-bold">{{ item[0] }}</span>
          <img :src="item[1]" class="p-2 rounded-xl w-60 h-60 aspect-square" alt="awards img" />
        </div>
      </div>
    </div>
  </main>
</template>
