<script setup>
import { onMounted, ref } from "vue";
import { useRouter, RouterLink } from "vue-router";
import { Offcanvas } from "bootstrap";
import emitter from "@/components/utils/emitter.js";
import { fetchShortlistAwardsData } from "@/lib/frontendQuery.js";

const router = useRouter();
const routerParamsYear = ref();
const routerParamsAwards = ref();
const awardsData = ref(); // 取得當年度的獎項名稱&得獎作品的圖片
const selectedYear = ref("");

onMounted(async () => {
  await router.isReady();
  routerParamsYear.value = router.currentRoute.value.params["year"];
  routerParamsAwards.value = router.currentRoute.value.params["awards"];
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

emitter.on("yearChange", (year) => {
  selectedYear.value = year;
  getYearData(year);
});
/* 取得年份參數的獎項名稱、得獎作品圖片
 * 1. fetchShortlistAwardsData() 取得該年份的獎項資料
 * 2. 如果查詢年份後無資料，發一個 emit 給父組件，用以表示無此年份
 */
async function getYearData(year) {
  const res = await fetchShortlistAwardsData(year);
  if (res) {
    awardsData.value = res;
  } else {
    emitter.emit("isNotFoundYear", true);
  }
}

// 點選獎項後發 emit 給右側
function updateSelectedYear(awards) {
  emitter.emit("updateSelectedYear", {
    year: selectedYear.value,
    awards: awards,
  });
  router.push({ path: `/Awards/${selectedYear.value}/${awards}` });
}
</script>

<template>
  <!-- 左側 < lg 顯示下拉選單 -->
  <section class="flex lg:hidden mb-4">
    <select
      @change="updateSelectedYear($event.target.value)"
      v-model="routerParamsAwards"
      class="bg-gray-50 border-1 border-cg3 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-2">
      <option :value="item.awards" v-for="item in awardsData" :key="item.id">
        {{ item.awards }}
      </option>
    </select>
  </section>
  <!-- 左側 > lg 顯示圖形化的介面 -->
  <section class="w-1/2 border-1 border-cg3 bg-cg2 rounded hidden lg:block">
    <h2 class="pt-4 text-2xl font-bold text-center text-black">看其他獎項</h2>
    <div
      class="place-items-center place-content-center grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
      <!-- awardsData[0]:awards [1]:src [2]:year -->
      <div
        class="relative w-32 h-32 flex items-center justify-center bg-cg4 rounded-md cursor-pointer m-4"
        v-for="item in awardsData"
        :key="item.id"
        @click="updateSelectedYear(item.awards)">
        <span
          class="absolute inset-1 bg-black opacity-30 rounded-md"
          aria-hidden="true"></span>
        <span class="absolute font-bold">{{ item.awards }}</span>
        <img
          :src="item.url"
          class="p-1 rounded-xl w-32 h-32 aspect-square"
          alt="awards img" />
      </div>
    </div>
  </section>
</template>
