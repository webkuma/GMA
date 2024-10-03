<script setup>
import { onMounted, ref } from "vue";
import { fetchShortlistAwardsData } from "@/lib/frontendQuery.js";
import { useRouter } from "vue-router";
import emitter from "@/components/utils/emitter.js";

// 監聽子組件下拉選單的value -> getYearData(year) 拿這個年份的資料
emitter.on("yearChange", (year) => {
  selectedYear.value = year;
  getYearData(year);
});

const router = useRouter();
const selectedYear = ref(); // 目前的年份
const awardsData = ref(); // 取得下拉選單年份的獎項名稱、得獎作品圖片
onMounted(async () => {
  await router.isReady();
});

/* 取得年份參數的獎項名稱、得獎作品圖片
 * 1. fetchShortlistAwardsData() 取得該年份的獎項資料
 * 2. 如果查詢年份後無資料，發一個 emit 給父組件，用以表示無此年份
 */
async function getYearData(year) {
  const res = await fetchShortlistAwardsData(year);
  if (res.length) {
    awardsData.value = res;
  } else {
    emitter.emit("isNotFoundYear", true);
  }
}
// 點選獎項後跳轉到詳細頁面，例如：Awards/2024/年度專輯獎
function updateSelectedYear(awards) {
  router.push({ path: `/Awards/${selectedYear.value}/${awards}` });
}
</script>

<template>
  <!-- awards  -->
  <div
    class="place-items-center place-content-center grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
    <div
      class="relative w-60 h-60 flex items-center justify-center bg-cg4 rounded-md cursor-pointer m-4"
      v-for="item in awardsData"
      :key="item.id"
      @click="updateSelectedYear(item.awards)">
      <span
        class="absolute inset-2 bg-black opacity-10 rounded-md"
        aria-hidden="true"></span>
      <span class="absolute text-xl font-bold">{{ item.awards }}</span>
      <img
        :src="item.url"
        class="p-2 rounded-xl w-60 h-60 aspect-square"
        alt="awards img" />
    </div>
  </div>
</template>
