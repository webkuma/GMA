<script setup>
import { onMounted, ref } from "vue";
import { useRouter, RouterLink } from "vue-router";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import { Offcanvas } from "bootstrap";
import emitter from "@/components/utils/emitter.js";
import { fetchShortlistAwardsDetailData } from "@/db/Sqlite.js";

import {
  useGetKkboxTokenStore,
  useGetKkboxSongIdStore,
} from "@/stores/counter.js";
const getKkboxTokenSotre = useGetKkboxTokenStore();
const getSongIdSotre = useGetKkboxSongIdStore();

const getDB = ref();
const isLoading = ref(1);
const sortedEntries = ref(0);
const router = useRouter();
const routerParamsYear = ref();
const routerParamsAwards = ref();
const awardsData = ref(); // 取得當年度的獎項名稱&得獎作品的圖片
const isNotFoundYear = ref();
const yearList = ref(); // 下拉選單所有年份
const selectedYear = ref("");
// test
const awardsDetail = ref();
const matchid = ref();
const token = ref();
const searchKeyword = ref();
const searchType = ref();

onMounted(async () => {
  isLoading.value = 1;
  await router.isReady();
  routerParamsYear.value = router.currentRoute.value.params["year"];
  routerParamsAwards.value = router.currentRoute.value.params["awards"];
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
  token.value = await getKkboxTokenSotre.getKkboxToken();
});

emitter.on("yearChange", (year) => {
  getAwardsData(year);
});
emitter.on("updateSelectedYear", ({ year, awards }) => {
  getAwardsData(year, awards);
});
// 取得 參數年份、參數獎項的資料(detail)
async function getAwardsData(year = null, awards = null) {
  routerParamsYear.value = year ? year : routerParamsYear.value;
  routerParamsAwards.value = awards ? awards : routerParamsAwards.value;

  const res = await fetchShortlistAwardsDetailData(
    routerParamsYear.value,
    routerParamsAwards.value
  );
  if (res.length) {
    awardsDetail.value = res[0].values;
  }
}

// 試聽
async function audition(song, singer, awards) {
  switch (awards) {
    case "年度歌曲獎": // 搜尋:track
      searchKeyword.value = deleteAlbum(song) + " " + singer;
      searchType.value = "track";
      break;
    case "最佳作曲人獎": //搜尋:track
    case "最佳作詞人獎":
    case "最佳單曲製作人獎":
      searchKeyword.value = deleteAlbum(song);
      searchType.value = "track";
      break;
    case "最佳專輯製作人獎": //搜尋:album
      searchKeyword.value = deleteAlbum(song);
      searchType.value = "album";
      break;
    default: //搜尋:album
      searchKeyword.value = song + " " + singer;
      searchType.value = "album";
  }
  const id = toast.loading("Loading...", {
    position: toast.POSITION.BOTTOM_RIGHT,
    autoClose: true,
    theme: "dark",
    transition: "flip",
  });

  try {
    matchid.value = await getSongIdSotre.getSongId(
      searchKeyword.value,
      searchType.value,
      token.value.access_token
    );
    toast.clearAll();
  } catch (error) {
    console.error(error);
    toast.error("Error occurred", { autoClose: 5000 });
    toast.clearAll();
  }
}
// 刪除歌曲的引號《》
function deleteAlbum(song) {
  if (song.indexOf("《") !== -1) {
    return song.substring(0, song.indexOf("《"));
  } else {
    return song;
  }
}
</script>

<template>
  <!-- 右側歌曲資訊 -->
  <section
    class="w-full lg:w-1/2 flex flex-col bg-gray-600 bg-opacity-20 rounded">
    <!-- 獎項文字 + 試聽按鈕 -->
    <div class="flex flex-col">
      <div class="text-center mt-1">
        <button
          v-if="
            matchid &&
            routerParamsAwards !== '年度歌曲獎' &&
            routerParamsAwards !== '最佳作曲人獎' &&
            routerParamsAwards !== '最佳作詞人獎' &&
            routerParamsAwards !== '最佳單曲製作人獎'
          "
          class="text-[#f4e0b2] font-black bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-yellow-500 text-base p-3 text-center rounded-lg"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#demo">
          專輯試聽側欄
        </button>
      </div>
      <div class="text-center">
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
          allow="autoplay" />
      </div>
    </div>

    <div
      class="hover:bg-slate-700 flex justify-between rounded-md m-2"
      v-for="item in awardsDetail"
      :key="item[0]">
      <!-- 顯示歌曲/歌手 -->
      <div class="flex">
        <img
          :src="item[6]"
          class="row-span-2 p-2 rounded-xl w-20 h-20 aspect-square"
          alt="awards img" />
        <div
          v-if="item[5]"
          class="flex flex-col justify-center text-yellow-200">
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
          @click="audition(item[3], item[2], item[1])">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.0"
            stroke="currentColor"
            class="w-8 h-8">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z" />
          </svg>
        </button>
        <button
          v-else
          data-bs-toggle="offcanvas"
          data-bs-target="#demo"
          class="py-2 px-4"
          type="button"
          @click="audition(item[3], item[2], item[1])">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.0"
            stroke="currentColor"
            class="w-8 h-8">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z" />
          </svg>
        </button>
      </div>
    </div>
    <div>
      <p class="p-2 text-gray-400">
        # 試聽找錯可能是金曲獎名稱與對方建立的 KKBOX 帳號不匹配或搜尋結果重複
        ...
      </p>
    </div>
  </section>
  <!-- 側欄 iframe -->
  <div
    class="offcanvas offcanvas-start text-bg-dark"
    id="demo"
    style="width: 350px">
    <div class="offcanvas-header">
      <h1 class="offcanvas-title">專輯試聽</h1>
      <button
        type="button"
        class="btn-close btn-close-white border"
        data-bs-dismiss="offcanvas">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="{1.5}"
          stroke="currentColor"
          className="w-6 h-6">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18 18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
    <div class="offcanvas-body flex items-center justify-center">
      <div v-if="searchType === 'album'">
        <iframe
          class="fixed top-[64px] left-3 h-[calc(100%-64px)] border-0"
          :src="`https://widget.kkbox.com/v1/?id=${matchid}&type=album&terr=TW&lang=TC&autoplay=true`"
          allow="autoplay" />
      </div>
      <!-- <button class="btn btn-secondary" type="button">A Button</button> -->
    </div>
  </div>
</template>
