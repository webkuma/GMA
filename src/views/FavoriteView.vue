<script setup>
import { onMounted, ref } from "vue";
import { useRouter, RouterLink } from "vue-router";
import { useSearchStore } from "../stores/counter.js";
const store = useSearchStore();
import Loading from "../components/Loading.vue";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import { fetchShortlistByIds } from "@/lib/frontendQuery.js";

const isLoading = ref(1);
const router = useRouter();
const favoriteData = ref();

onMounted(async () => {
  isLoading.value = 1;
  await router.isReady();
  loadFavoriteData();
});

/** 根據 localStorage 的資料去資料庫獲取資料
 * 1. 過濾出所有以 'favoriteStorage-' 開頭的值並提取數字 ID
 * 2. fetchShortlistByIds - 根據提取的 ID 查詢資料庫
 * localStorage：favoriteStorage-41, favoriteStorage-47, favoriteStorage-126 ...
 */
async function loadFavoriteData() {
  // console.log(localStorage);
  let favoriteStorageKeys = Object.keys(localStorage)
    .filter((key) => key.startsWith("favoriteStorage-"))
    .map((key) => parseInt(key.replace("favoriteStorage-", ""), 10));
  // console.log(favoriteStorageKeys);

  const result = await fetchShortlistByIds(favoriteStorageKeys);
  if (result) {
    favoriteData.value = result;
  } else {
    favoriteData.value = null;
  }
  isLoading.value = 0;
}
// 移除收藏歌曲操作
function handleRemoveLocalStorage(id) {
  favoriteData.value.forEach((element) => {
    if (element.id === id) {
      toast.success("已從收藏移除", {
        theme: "dark",
        autoClose: 1000,
        transition: "zoom",
        position: toast.POSITION.TOP_RIGHT,
      });
      localStorage.removeItem(`favoriteStorage-${id}`);
      loadFavoriteData();
      store.updateYearsDataStorage(id, false);
      getIsStoragedLength();
      return; // 移除後即可離開迴圈
    }
  });
}
// 計算收藏歌曲數量
function getIsStoragedLength() {
  return favoriteData.value ? favoriteData.value.length : 0;
}
</script>

<template>
  <main class="text-white">
    <!-- Loading -->
    <Loading v-if="isLoading === 1" />

    <div v-else>
      <!-- 導航列 -->
      <div class="m-4 flex justify-between items-center">
        <nav
          class="flex justify-between items-center p-3 text-gray-700 border-1 border-cg3 rounded-lg bg-gray-50"
          aria-label="Breadcrumb">
          <ol
            class="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
            <li class="inline-flex items-center">
              <RouterLink to="/" class="inline-block">
                <a
                  href="#"
                  class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
                  <svg
                    class="w-3 h-3 me-2"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20">
                    <path
                      d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
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
                  viewBox="0 0 6 10">
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m1 9 4-4-4-4" />
                </svg>
                <a
                  class="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white">
                  收藏
                </a>
              </div>
            </li>
          </ol>
        </nav>
      </div>
      <div class="m-4">
        <span class="border-b-2 border-cg4">
          <span class="text-2xl font-extrabold text-cg5">已收藏的作品 </span>
          <span class="text-cg5"> ({{ getIsStoragedLength() }})</span>
        </span>
      </div>

      <!-- 收藏的歌曲 -->
      <div class="mx-6 mb-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div
          v-for="(item, index) in favoriteData"
          :key="index"
          class="flex shadow-custom-inner shadow-yellow-500 mt-4 p-4 border rounded-lg"
          :class="{ 'bg-cg2': item.won, 'bg-gray-200 ': !item.won }">
          <div class="flex items-center justify-end mr-4">
            <svg
              @click="handleRemoveLocalStorage(item.id)"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1"
              stroke="currentColor"
              class="w-6 h-6 cursor-pointer fill-red-500">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              />
            </svg>
          </div>
          <img
            v-lazy="item.url"
            class="mr-4 w-20 h-20 sm:w-32 sm:h-32 rounded-lg aspect-square"
            alt="favorite pic" />
          <div class="flex flex-col justify-evenly pl-2">
            <div>
              <span class="text-base sm:text-xl font-semibold text-gray-700">
                {{ item.nominee }}
              </span>
              <span class="text-base sm:text-xl font-semibold text-gray-700">
                ／ {{ item.work }}
              </span>
            </div>
            <p class="text-base font-semibold text-gray-500">
              {{ item.awards }}
            </p>
          </div>
        </div>
      </div>
      <div
        v-if="!getIsStoragedLength()"
        class="p-4 flex flex-col items-center justify-center">
        <p class="text-6xl text-custom-gold">(='X'=)</p>
        <p class="text-2xl text-center pt-4">目前還沒有收藏作品</p>
      </div>
    </div>
  </main>
</template>
