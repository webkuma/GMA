<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { fetchShortlistYear } from "@/lib/frontendQuery.js";
import emitter from "@/components/utils/emitter.js";

const router = useRouter();
const yearData = ref(); // 下拉選單所有年份
const selectedYear = ref(""); // 目前的年份

onMounted(async () => {
  await router.isReady();
  getYearSelected();
});

/* 下拉選單獲取全部年份
 * 1. fetchShortlistYear() 取得資料庫所有年份
 * 2. 整理格式 0: {year:2024}  1: {year:2023}
 * 3. 將路由的年份參數赋值给 selectedYear(select v-model)，避免重新進入頁面的錯誤
 * 4. 將路由的年份參數 emit 到組件: YearAwardsData，以查詢該年份的獎項(尚未 @change)
 */
async function getYearSelected() {
  const result = await fetchShortlistYear();
  yearData.value = result.map((item) => item.year);
  selectedYear.value = router.currentRoute.value.params["year"];
  emitter.emit("yearChange", selectedYear.value);
}
// 下拉選單 @change 發 emit 到組件: YearAwardsData，以查詢該年份的獎項(已 @change)
function onchangeUpdateYear(year) {
  router.push({ path: `/Awards/${year}` });
  emitter.emit("yearChange", year);
}
</script>

<template>
  <!-- 年份下拉選單 -->
  <div class="flex">
    <select
      @change="onchangeUpdateYear(selectedYear)"
      v-model="selectedYear"
      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-4">
      <option :value="year" v-for="year in yearData" :key="year">
        {{ year }}
      </option>
    </select>
  </div>
</template>
