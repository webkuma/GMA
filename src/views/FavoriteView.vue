<script setup>
import { onMounted, ref } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import { useSearchStore } from '../stores/counter.js';
const store = useSearchStore();
import Loading from '../components/Loading.vue';
import initSqlJs from 'sql.js';

const isLoading = ref(1);
const router = useRouter();
const getDB = ref();
const favoriteData = ref();
const favoriteStorageKeys = ref();
const emptyFavoriteData = ref();

onMounted(async () => {
  isLoading.value = 1;
  await router.isReady();
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

// 用 Object.keys(localStorage) 的 ID 查詢+顯示
async function getSelectedYear() {
  favoriteStorageKeys.value = Object.keys(localStorage)
    .filter((key) => key.startsWith('favoriteStorage-'))
    .map((key) => parseInt(key.replace('favoriteStorage-', ''), 10));

  const db = await initDatabase();
  const result = db.exec(
    `SELECT DISTINCT * FROM shortlist WHERE id IN (${favoriteStorageKeys.value.join(', ')}) ORDER BY year DESC`,
  );
  if (result[0]) {
    favoriteData.value = result[0].values.map((data) => ({
      id: data[0],
      awards: data[1],
      nominee: data[2],
      work: data[3],
      year: data[4],
      won: data[5],
      url: data[6],
      isStoraged: localStorage.getItem(`favoriteStorage-${data[0]}`) ? true : false,
    }));
    isLoading.value = 0;
  } else {
    emptyFavoriteData.value = true;
    isLoading.value = 0;
  }
}
// 移除收藏歌曲操作
function handleRemoveLocalStorage(id) {
  favoriteData.value.forEach((element) => {
    if (element.id == id) {
      element.isStoraged = false;
      localStorage.removeItem(`favoriteStorage-${id}`);
      store.updateYearsDataStorage(id, false);
      getIsStoragedLength();
    }
  });
}
// 計算收藏歌曲數量
function getIsStoragedLength() {
  let length = 0;
  if (favoriteData.value) {
    favoriteData.value.forEach((element) => {
      element.isStoraged ? length++ : '';
    });
  }
  return length;
}
</script>

<template>
  <main class="text-white">
    <!-- Loading -->
    <div v-if="isLoading === 1" class="absolute w-full h-full bg-[#202020] bg-opacity-90">
      <div class="flex items-center justify-center h-full">
        <Loading />
      </div>
    </div>

    <div v-else>
      <!-- 導航列 -->
      <div class="m-4 flex justify-between items-center">
        <nav
          class="flex justify-between items-center p-3 text-gray-700 border border-gray-200 rounded-lg bg-gray-50"
          aria-label="Breadcrumb"
        >
          <ol class="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
            <li class="inline-flex items-center">
              <RouterLink to="/" class="inline-block">
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
                  收藏
                </a>
              </div>
            </li>
          </ol>
        </nav>
      </div>
      <div class="m-4">
        <span class="border-b-4 border-custom-gold">
          <span class="text-2xl">已收藏的作品</span>
          <span> ({{ getIsStoragedLength() }})</span>
        </span>
      </div>

      <!-- 收藏的歌曲 -->
      <div class="mx-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div
          v-for="(item, index) in favoriteData"
          :key="index"
          class="flex shadow-custom-inner shadow-yellow-500 mt-4 p-4 border rounded-lg"
          :class="{ 'bg-[#F5E8C7]': item.won, 'bg-gray-200 ': !item.won, hidden: !item.isStoraged }"
        >
          <div class="flex items-center justify-end mr-4">
            <svg
              @click="handleRemoveLocalStorage(item.id)"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1"
              stroke="currentColor"
              class="w-6 h-6 cursor-pointer fill-red-500"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
              />
            </svg>
          </div>
          <img v-lazy="item.url" class="mr-4 w-20 h-20 sm:w-32 sm:h-32 rounded-lg aspect-square" alt="" />
          <div class="flex flex-col justify-evenly pl-2">
            <div class="">
              <span class="text-base sm:text-xl font-semibold text-gray-700">{{ item.nominee }}</span>
              <span class="text-base sm:text-xl font-semibold text-gray-700">／ {{ item.work }}</span>
            </div>
            <p class="text-base font-semibold text-gray-500">
              {{ item.awards }}
            </p>
          </div>
        </div>
      </div>
      <div v-if="!getIsStoragedLength()" class="p-4">還沒收藏作品...</div>
    </div>
  </main>
</template>
