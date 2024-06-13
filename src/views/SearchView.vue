<script setup>
import { ref, onMounted } from 'vue';
import Loading from '../components/Loading.vue';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

// router
import { RouterLink, useRouter } from 'vue-router';
const router = useRouter();
// pinia
import { useSearchStore } from '../stores/counter.js';
import { useGetWonListStore } from '../stores/counter.js';
const storeGetWonList = useGetWonListStore();
const store = useSearchStore();

const mountedWonList = ref(); // 搜尋獲獎次數排行資料
const isReverseArray = ref(false); // 反轉年份排序
const sql = `
SELECT
    nominee AS "nominee",
    MIN(url) AS "url",
    COUNT(CASE WHEN won = 1 THEN 1 END) AS "won",
    COUNT(*) AS "nomineeTime",
    id
FROM
    shortlist
GROUP BY
    nominee
HAVING
    COUNT(CASE WHEN won = 1 THEN 1 END) > 0
ORDER BY
    won DESC;
`;
const showScrollToTopBtn = ref();
const isListView = ref(0); // 是否顯示 List (table)

onMounted(async () => {
  await router.isReady();
  if (!mountedWonList.value) {
    await storeGetWonList.getWonListData(sql);
    mountedWonList.value = storeGetWonList.mountedWonList;
  }
});

// 反轉年份排序
function reverseArray() {
  isReverseArray.value = !isReverseArray.value;
  isReverseArray.value
    ? store.yearsData.sort((a, b) => a.year - b.year)
    : store.yearsData.sort((a, b) => b.year - a.year);
  // store.storageMatchData.reverse();
  // store.yearsData.reverse();
  // console.log(store.yearsData);
}
// 捲動回頂端
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
}
// 監聽滾動，添加回到頂端按紐
window.addEventListener('scroll', handleScroll);
function handleScroll() {
  const scrollY = window.scrollY;
  showScrollToTopBtn.value = scrollY > 200 ? 1 : 0;
}
// @click 愛心 添加到 localstorage，反之移除
function handleAddToLocalStorage(id) {
  const isIdExist = localStorage.getItem(`favoriteStorage-${id}`) ? true : false;
  if (isIdExist) {
    toast.success('已從收藏移除', {
      theme: 'dark',
      autoClose: 1500,
      transition: 'zoom',
      position: toast.POSITION.TOP_RIGHT,
    });
    localStorage.removeItem(`favoriteStorage-${id}`);
    store.updateYearsDataStorage(id, false);
  } else {
    toast.success('已添加至收藏', {
      theme: 'dark',
      autoClose: 1500,
      transition: 'zoom',
      position: toast.POSITION.TOP_RIGHT,
    });
    localStorage.setItem(`favoriteStorage-${id}`, 'id');
    store.updateYearsDataStorage(id, true);
  }
}
// 切換成列表模式 (table)
function toggleListView() {
  isListView.value = !isListView.value;
}
</script>
<template>
  <main class="text-white">
    <!-- 回到頂端 icon-fixed -->
    <div v-if="showScrollToTopBtn" class="fixed right-5 bottom-5 z-50" @click="scrollToTop">
      <button
        type="button"
        data-te-ripple-init=""
        data-te-ripple-color="light"
        class="!fixed bottom-5 right-5 rounded-full bg-red-600 p-3 text-xs font-medium uppercase leading-tight text-white shadow-md transition duration-150 ease-in-out hover:bg-red-700 hover:shadow-lg focus:bg-red-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-800 active:shadow-lg"
        id="btn-back-to-top"
        style=""
      >
        <svg
          aria-hidden="true"
          focusable="false"
          data-prefix="fas"
          class="h-4 w-4"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
        >
          <path
            fill="currentColor"
            d="M34.9 289.5l-22.2-22.2c-9.4-9.4-9.4-24.6 0-33.9L207 39c9.4-9.4 24.6-9.4 33.9 0l194.3 194.3c9.4 9.4 9.4 24.6 0 33.9L413 289.4c-9.5 9.5-25 9.3-34.3-.4L264 168.6V456c0 13.3-10.7 24-24 24h-32c-13.3 0-24-10.7-24-24V168.6L69.2 289.1c-9.3 9.8-24.8 10-34.3.4z"
          ></path>
        </svg>
      </button>
    </div>

    <!-- Loading -->
    <div v-if="!mountedWonList || store.state.Searching" class="absolute w-full h-full bg-[#202020] bg-opacity-90">
      <div class="flex items-center justify-center h-full">
        <Loading />
      </div>
    </div>

    <div v-else>
      <!-- Breadcrumbs, 年份排序  -->
      <div class="p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center">
        <nav
          class="flex justify-between items-center p-3 text-gray-700 border border-gray-200 rounded-lg bg-gray-50 max-w-[150px]"
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
                  搜尋
                </a>
              </div>
            </li>
          </ol>
        </nav>
        <div class="flex sm:justify-end gap-1 mt-2">
          <!-- 列表模式按鈕 -->
          <div class="flex">
            <label
              for="default-checkbox"
              class="flex items-center p-3 text-[#f4e0b2] bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-yellow-500 rounded-lg text-sm text-center"
            >
              <input
                v-model="isListView"
                id="default-checkbox"
                type="checkbox"
                class="w-4 h-4 mr-1 text-blue-600 bg-gray-100 border-gray-300 rounded"
                @click="toggleListView()"
              />
              <span class="font-black">列表模式</span>
            </label>
          </div>
          <!-- 獲獎列表按鈕 -->
          <button
            v-if="!store.state.UnsearchedState && !store.state.Searching"
            @click="store.backWonList()"
            type="button"
            class="p-3 text-[#f4e0b2] font-black bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-yellow-500 dark:focus:ring-red-400 rounded-lg text-sm text-center"
          >
            獲獎列表
          </button>
          <!-- 年份排序按鈕 -->
          <button
            v-if="store.state.SearchedFound"
            @click="reverseArray()"
            type="button"
            class="flex items-center justify-center p-3 text-[#f4e0b2] bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-yellow-500 dark:focus:ring-red-400 rounded-lg text-sm text-center"
          >
            <span class="mr-1 font-black">年份排序</span>
            <svg
              id="filterArrow"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-4 h-4 transition-transform duration-500"
              :class="[isReverseArray ? `rotate-0 ` : `rotate-180`]"
            >
              >
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
            </svg>
          </button>
        </div>
      </div>

      <!-- 沒有搜尋時的預覽排行 -->
      <div v-if="store.state.UnsearchedState">
        <!-- title -->
        <div class="mx-4">
          <span class="border-b-4 border-custom-gold text-2xl">2010～2023 年獲獎次數排行 </span>
        </div>
        <!-- 獎項外層 grid 排版 -->
        <div class="p-4 text-xl text-yellow-50 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
          <!-- 獎項內容 flex 排版 sm:640 md:768 lg:1024 xl:1280 -->
          <div
            v-for="(item, index) in mountedWonList"
            :key="index"
            class="flex shadow-custom-inner shadow-yellow-500 sh mx-2 mt-5 p-4 rounded-lg bg-[#F5E8C7] hover:cursor-pointer"
            @click="store.setSearchWord(item.nominee)"
          >
            <img v-lazy="item.url" class="w-24 h-24 rounded-lg aspect-square" alt="album" />
            <div class="flex flex-col justify-evenly pl-4">
              <p class="text-lg font-semibold text-gray-900">{{ item.nominee }}</p>
              <p class="text-lg font-semibold text-gray-900">獲獎: {{ item.won }} / 提名: {{ item.nomineeTime }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 沒有搜尋到時顯示錯誤資訊 -->
      <div v-if="store.state.SearchedNotFound" class="flex flex-col justify-center items-center">
        <p class="text-6xl text-custom-gold">(='X'=)</p>
        <p class="text-2xl m-4">找不到「{{ store.searchWord }}」</p>
        <p class="text-xl">請嘗試用不同關鍵字再搜尋一次。</p>
      </div>

      <!-- 有搜尋到時顯示相關資訊 -->
      <div v-if="store.state.SearchedFound">
        <!-- 如果有勾選列表模式顯示 -->
        <div v-if="isListView">
          <div v-for="yearObject in store.yearsData" :key="yearObject.year" class="text-base text-yellow-50">
            <!-- 年份 -->
            <div class="mx-4">
              <span class="pr-1 border-b-4 border-custom-gold text-2xl">{{ yearObject.year }}</span>
            </div>
            <!-- table -->
            <div class="px-4 py-2 overflow-auto">
              <table class="table table-hover overflow-x-scroll whitespace-nowrap">
                <thead>
                  <tr class="[&>*]:font-semibold">
                    <th class="rounded-ss-md w-10">收藏</th>
                    <th>獲獎</th>
                    <th>歌手</th>
                    <th>作品</th>
                    <th class="rounded-se-md">獎項</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in yearObject.data" :key="index">
                    <td>
                      <svg
                        @click="handleAddToLocalStorage(item.id)"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1"
                        stroke="currentColor"
                        class="w-6 h-6 cursor-pointer stroke-red-500"
                        :class="[item.isStoraged ? 'fill-red-500 ' : ' fill-white']"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                        />
                      </svg>
                    </td>
                    <td>
                      <span v-if="item.won" class="text-base font-semibold">得獎</span>
                      <span v-else class="text-base">入圍</span>
                    </td>
                    <td class="text-base font-normal cursor-pointer" @click="store.setSearchWord(item.nominee)">
                      {{ item.nominee }}
                    </td>
                    <td class="text-base font-normal">{{ item.work }}</td>
                    <td
                      colspan="4"
                      class="text-base font-normal cursor-pointer"
                      @click="store.setSearchWord(item.awards)"
                    >
                      {{ item.awards }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <!-- 預設顯示這個 -->
        <div v-else>
          <div v-for="yearObject in store.yearsData" :key="yearObject.year" class="text-xl text-yellow-50">
            <!-- 年份 -->
            <div class="mx-4">
              <span class="pr-1 border-b-4 border-custom-gold text-2xl">{{ yearObject.year }}</span>
            </div>
            <!-- 獎項外層 grid 排版 -->
            <div class="p-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
              <!-- 獎項內層 flex 排版 -->
              <div
                v-for="(item, index) in yearObject.data"
                :key="index"
                class="relative flex shadow-custom-inner shadow-yellow-500 mx-2 mt-4 p-4 border rounded-lg"
                :class="{ 'bg-[#F5E8C7]': item.won, 'bg-gray-200 ': !item.won }"
              >
                <div class="flex items-center justify-end mr-4">
                  <svg
                    @click="handleAddToLocalStorage(item.id)"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1"
                    stroke="currentColor"
                    class="w-6 h-6 cursor-pointer stroke-red-500"
                    :class="[item.isStoraged ? 'fill-red-500 ' : ' fill-gray-200']"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                    />
                  </svg>
                </div>
                <img
                  v-lazy="item.url"
                  class="mr-4 w-20 h-20 sm:w-32 sm:h-32 rounded-lg aspect-square"
                  alt="album pic"
                />
                <div class="flex flex-col justify-evenly pl-2">
                  <div>
                    <span
                      class="text-base sm:text-xl font-semibold text-gray-700 cursor-pointer"
                      @click="store.setSearchWord(item.nominee)"
                      >{{ item.nominee }}</span
                    >
                    <span class="text-base sm:text-xl font-semibold text-gray-700">／ {{ item.work }}</span>
                  </div>
                  <p
                    @click="store.setSearchWord(item.awards)"
                    class="text-base font-semibold text-gray-500 cursor-pointer"
                  >
                    {{ item.awards }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
<style>
.loader {
  border: 8px solid #f3f3f3;
  border-radius: 50%;
  border-top: 6px solid #daa520;
  width: 60px;
  height: 60px;
  -webkit-animation: spin 1s linear infinite; /* Safari */
  animation: spin 1s linear infinite;
}

/* Safari */
@-webkit-keyframes spin {
  0% {
    -webkit-transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
