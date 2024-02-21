<script setup>
import { onUnmounted, onMounted, ref, nextTick } from 'vue';
import Loading from '../components/Loading.vue';
// router
import { useRouter } from 'vue-router';
const router = useRouter();
// pinia
import { useGetYearDataStore } from '../stores/counter.js';
const store = useGetYearDataStore();
// gsap
import { gsap } from 'gsap';

const yearData = ref();
const isLoading = ref(1);

const bannerImageUrl = ref();
const sql = 'SELECT DISTINCT year FROM shortlist WHERE shortlist.won = 1 ORDER BY year DESC';
const LoadImg = () => {
  const img = new Image();
  img.src =
    'https://images.unsplash.com/photo-1587731556938-38755b4803a6?q=80&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&w=1599&h=600';
  img.onload = () => {
    bannerImageUrl.value = img.src;
  };
};
const lastYear = ref(); // 取得資料庫的最新年份
const anim = ref();
onMounted(async () => {
  LoadImg();
  // yearData = undefined，去 store.getYearData 拿資料
  if (!yearData.value) {
    await store.getYearData(sql);
    yearData.value = store.yearData;
    isLoading.value = store.isLoading;
    lastYear.value = yearData.value[0]; // 最新年份
  }
  await nextTick();
  gsap.set('#box', { y: 0 }); // 設置高度 讓他可以往下彈跳
  gsapAnimations();
});

// 查看最新名單跳轉
function updateSelectedYear(year) {
  router.push({ path: `/Awards/${year}` });
}
// GMA title gsap
function gsapAnimations() {
  anim.value = gsap.to(box, {
    duration: 1,
    ease: 'bounce.out',
    y: 50,
  });
}
// 離開頁面 銷毀 gsap
onUnmounted(() => {
  anim.value = null;
});
</script>

<!-- sm:640 md:768 lg:1024 xl:1280 -->
<template>
  <main class="text-white">
    <!-- loading -->
    <div v-if="isLoading === 1" class="absolute w-full h-full bg-[#202020] bg-opacity-90">
      <div class="flex items-center justify-center h-full">
        <Loading />
      </div>
    </div>

    <div v-else>
      <div class="relative shadow-sm shadow-gray-100">
        <!-- bg img -->
        <img :src="bannerImageUrl" class="w-full min-h-[calc(100vh_-_64px)] h-auto object-cover" alt="Banner Image" />
        <div class="absolute inset-0 bg-black bg-opacity-60"></div>

        <!-- text -->
        <div class="absolute inset-0">
          <div class="absolute flex flex-col items-center justify-center gap-8 w-full h-full text-gray-50">
            <p
              id="box"
              class="pb-12 [&>span:nth-child(n)]:first-letter:tracking-wide text-2xl [&>span:nth-child(2)]:px-2 [&>span:nth-child(n)]:first-letter:text-[#eacd76] [&>span:nth-child(n)]:first-letter:text-4xl [&>span:nth-child(n)]:font-extrabold [&>span:nth-child(n)]:inline-block"
            >
              <span class="text-[#f4e0b2] text-2xl md:text-3xl font-semibold">
                <span id="letter" class="inline-block letter text-3xl font-extrabold">G</span>
                <span>olden</span>
              </span>
              <span class="text-[#f4e0b2] text-2xl md:text-3xl font-semibold">
                <span id="letter" class="inline-block text-3xl font-extrabold">M</span>
                <span>elody</span>
              </span>
              <span class="text-[#f4e0b2] text-2xl md:text-3xl font-semibold">
                <span id="letter" class="inline-block text-3xl font-extrabold">A</span>
                <span>wards</span>
              </span>
            </p>
            <p class="text-2xl md:text-3xl font-medium text-[#f4e0b2] tracking-wide">Discover and Explore the Music</p>
            <p class="text-2xl md:text-3xl font-medium text-[#f4e0b2] tracking-wide">The Artists, Awards, and Works</p>
            <button
              @click="updateSelectedYear(lastYear)"
              type="button"
              class="mt-12 text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-3 text-center me-2 mb-2"
            >
              查看最新名單
            </button>
          </div>
        </div>
      </div>

      <!-- years block -->
      <div class="p-4" v-show="0">
        <!-- the years block Outer, click btn to /awards -->
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 pb-2">
          <!-- year block Inner -->
          <div v-for="year in yearData" :key="year" class="flex justify-center mt-6">
            <button
              @click="updateSelectedYear(year)"
              class="p-4 flex items-center rounded-md bg-[#F5E8C7] border border-yellow-500 space-x-1 hover:bg-amber-400 hover:border-white hover:border"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-6 h-6 stroke-[#05436C]"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0"
                />
              </svg>
              <span class="inline-block font-bold text-lg text-gray-900">{{ year }} 年</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
