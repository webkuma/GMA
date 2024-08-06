<script setup>
import { onMounted, ref } from "vue";
// router
import { useRouter } from "vue-router";
const router = useRouter();
// pinia
import { useGetYearDataStore } from "@/stores/counter.js";
const store = useGetYearDataStore();

const yearData = ref(); // 取得所有年分
const lastYear = ref(); // 放最新年份

onMounted(async () => {
  fetchYearDataFromPinia();
});

// if(!yearData)，從 pinia 取得全部的年份
async function fetchYearDataFromPinia() {
  if (!yearData.value) {
    await store.getYearData();
    yearData.value = store.yearData; // 全部年份
    lastYear.value = yearData.value[0].year; // 最新年份
    console.log(lastYear.value);
  }
}

// 查看最新名單後跳轉
function updateSelectedYear(year) {
  router.push({ path: `/Awards/${year}` });
}
</script>

<template>
  <button
    data-aos="fade-left"
    data-aos-easing="ease-out-cubic"
    data-aos-duration="1000"
    data-aos-once="true"
    v-if="lastYear"
    @click="updateSelectedYear(lastYear)"
    type="button"
    class="mt-12 text-[#f4e0b2] font-black bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-yellow-500 dark:focus:ring-yellow-800 rounded-lg text-base px-5 py-3 text-center me-2 mb-2">
    查看最新名單
  </button>
</template>
