<script setup>
import { onUnmounted, onMounted, ref, nextTick } from 'vue';
import Loading from '../components/Loading.vue';
// router
import { useRouter } from 'vue-router';
const router = useRouter();
// pinia
import { useGetYearDataStore } from '../stores/counter.js';
import { useGetLastYearNominees } from '../stores/counter.js';
const store = useGetYearDataStore();
const getLastYearNomineesStore = useGetLastYearNominees();
// Splide
import { Splide, SplideSlide } from '@splidejs/vue-splide';
import '@splidejs/vue-splide/css';

const yearData = ref();
const isLoading = ref(1);

const bannerImageUrl = ref();
const LoadImg = () => {
  const img = new Image();
  img.src =
    'https://images.unsplash.com/photo-1587731556938-38755b4803a6?q=80&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&w=1599&h=600';
  img.onload = () => {
    bannerImageUrl.value = img.src;
  };
};
const lastYear = ref(); // 取得資料庫的最新年份
// 取得最新年份的資料(輪播用)
const femaleSingerNominees = ref();
const maleSingerNominees = ref();
const newArtistNominees = ref();
const topSongNominees = ref();
// 取得去年(max-1)的資料(輪播用)
const previousYearTopSongNominees = ref();
const previousYearNewArtistNominees = ref();
const previousYearFemaleSingerNominees = ref();
const previousYearMaleSingerNominees = ref();
// 動畫用
const anim = ref();
onMounted(async () => {
  LoadImg();
  // yearData = undefined，去 store.getYearData 拿資料
  if (!yearData.value) {
    await store.getYearData();
    yearData.value = store.yearData;
    isLoading.value = store.isLoading;
    lastYear.value = yearData.value[0]; // 最新年份
  }
  await nextTick();
  getLatestNominees();
  getPreviousYearNominees();
});

// 取得最新年份的資料(輪播用)
async function getLatestNominees() {
  topSongNominees.value = await getLastYearNomineesStore.getYearData('年度歌曲獎');
  newArtistNominees.value = await getLastYearNomineesStore.getYearData('最佳新人獎');
  femaleSingerNominees.value = await getLastYearNomineesStore.getYearData('最佳華語女歌手獎');
  maleSingerNominees.value = await getLastYearNomineesStore.getYearData('最佳華語男歌手獎');
}
// 取得去年(max-1)的資料(輪播用)
async function getPreviousYearNominees() {
  previousYearTopSongNominees.value = await getLastYearNomineesStore.getYearData('年度歌曲獎', true);
  previousYearNewArtistNominees.value = await getLastYearNomineesStore.getYearData('最佳新人獎', true);
  previousYearFemaleSingerNominees.value = await getLastYearNomineesStore.getYearData('最佳華語女歌手獎', true);
  previousYearMaleSingerNominees.value = await getLastYearNomineesStore.getYearData('最佳華語男歌手獎', true);
}

// 點擊推播圖片後跳轉
function carouselRouter(year, awards) {
  router.push({ path: `/Awards/${year}/${awards}` });
}
// 查看最新名單跳轉
function updateSelectedYear(year) {
  router.push({ path: `/Awards/${year}` });
}
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
      <!-- bg img -->
      <div class="grid relative shadow-sm shadow-gray-100">
        <img
          :src="bannerImageUrl"
          class="relative w-full min-h-[calc(100vh_-_150px)] h-auto object-cover bg-black bg-opacity-60"
          alt="Banner Image"
        />
        <div class="absolute inset-0 bg-black opacity-50"></div>

        <!-- text -->
        <div class="absolute inset-0 col-span-1">
          <div class="absolute flex flex-col items-center justify-center gap-8 w-full h-full text-gray-50">
            <p
              data-aos="fade-down"
              class="[&>span:nth-child(n)]:first-letter:tracking-wide text-2xl [&>span:nth-child(2)]:px-2 [&>span:nth-child(n)]:first-letter:text-[#eacd76] [&>span:nth-child(n)]:first-letter:text-4xl [&>span:nth-child(n)]:font-extrabold [&>span:nth-child(n)]:inline-block"
            >
              <span class="text-[#f4e0b2] text-2xl md:text-3xl font-semibold">
                <span id="letter" class="inline-block letter text-3xl font-bold">G</span>
                <span>olden</span>
              </span>
              <span class="text-[#f4e0b2] text-2xl md:text-3xl font-semibold">
                <span id="letter" class="inline-block text-3xl font-bold">M</span>
                <span>elody</span>
              </span>
              <span class="text-[#f4e0b2] text-2xl md:text-3xl font-semibold">
                <span id="letter" class="inline-block text-3xl font-bold">A</span>
                <span>wards</span>
              </span>
            </p>
            <p class="text-2xl md:text-3xl font-medium text-[#f4e0b2] tracking-wide">Discover and Explore the Music</p>
            <p class="text-2xl md:text-3xl font-medium text-[#f4e0b2] tracking-wide">The Artists, Awards, and Works</p>
            <button
              @click="updateSelectedYear(lastYear)"
              type="button"
              class="mt-12 text-[#f4e0b2] font-black bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-yellow-500 dark:focus:ring-yellow-800 rounded-lg text-base px-5 py-3 text-center me-2 mb-2"
            >
              查看最新名單
            </button>
          </div>
        </div>
        <!-- <div class="absolute top-0 grid grid-cols-7 w-full h-full min-h-[calc(100vh_-_150px)]">
          <div class="col-span-4">
            <div class="flex flex-col items-center justify-center gap-2 w-full h-full text-gray-50">
              <p
                id="box"
                class="pb-12 [&>span:nth-child(n)]:first-letter:tracking-wide text-2xl [&>span:nth-child(2)]:px-2 [&>span:nth-child(n)]:first-letter:text-[#eacd76] [&>span:nth-child(n)]:first-letter:text-4xl [&>span:nth-child(n)]:font-extrabold [&>span:nth-child(n)]:inline-block"
              >
                <span class="text-[#f4e0b2] text-2xl md:text-3xl font-semibold">
                  <span id="letter" class="inline-block letter text-3xl font-bold">G</span>
                  <span>olden</span>
                </span>
                <span class="text-[#f4e0b2] text-2xl md:text-3xl font-semibold">
                  <span id="letter" class="inline-block text-3xl font-bold">M</span>
                  <span>elody</span>
                </span>
                <span class="text-[#f4e0b2] text-2xl md:text-3xl font-semibold">
                  <span id="letter" class="inline-block text-3xl font-bold">A</span>
                  <span>wards</span>
                </span>
              </p>
              <p class="text-2xl md:text-3xl font-medium text-[#f4e0b2] tracking-wide">
                Discover and Explore the Music
              </p>
              <p class="text-2xl md:text-3xl font-medium text-[#f4e0b2] tracking-wide">
                The Artists, Awards, and Works
              </p>
              <button
                @click="updateSelectedYear(lastYear)"
                type="button"
                class="mt-12 text-white bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-yellow-300 dark:focus:ring-yellow-800 font-medium rounded-lg text-sm px-5 py-3 text-center me-2 mb-2"
              >
                查看最新名單
              </button>
            </div>
          </div>
          <div class="col-span-2 flex flex-col justify-center">
            或者搜尋
            <div class="relative mr-2 flex items-center justify-center">
              <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg
                  class="w-4 h-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="search"
                id="default-search"
                class="block w-full py-4 pl-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search Mockups, Logos..."
                required
              />
              <button
                type="submit"
                class="text-white absolute end-2.5 bottom-4 bg-yellow-600 hover:bg-yellow-700 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:focus:ring-yellow-800"
              >
                Search
              </button>
            </div>
          </div>
        </div> -->
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

      <!-- 最新提名 -->
      <div class="h-auto w-full grid grid-cols-1 sm:grid-cols-4 sm:py-12">
        <div class="col-span-1 flex flex-col items-center justify-center px-2" data-aos="zoom-in">
          <h2 class="text-4xl text-[#f4e0b2] font-black pt-4">{{ lastYear }} 最新提名</h2>
          <h3 class="text-xl text-[#f4e0b2] py-4">點選圖片查看詳細資料</h3>
        </div>
        <div
          data-aos="fade-left"
          data-aos-easing="ease-out-cubic"
          data-aos-duration="1000"
          class="col-span-1 sm:col-span-3 bg-yellow-600 text-[#fffccc] rounded-l-3xl p-16"
        >
          <div class="grid grid-cols-1 lg:grid-cols-2 place-items-center place-content-center">
            <div>
              <h3 class="text-center font-bold text-xl my-4">年度歌曲獎</h3>
              <div class="h-[230px] w-[250px]">
                <Splide :options="{ rewind: true, autoplay: true, type: loop }" aria-label="My Favorite Images">
                  <SplideSlide v-for="(item, index) in topSongNominees" :key="item.id">
                    <img
                      :src="item.url"
                      :alt="item.work"
                      class="w-[150px] ml-12 rounded cursor-pointer"
                      @click="carouselRouter(item.year, item.awards)"
                    />
                    <div class="flex flex-col items-center justify-center mt-4 mb-4">
                      <h3>{{ item.nominee + ' ' + item.work }}</h3>
                    </div>
                  </SplideSlide>
                </Splide>
              </div>
            </div>
            <div>
              <h3 class="text-center font-bold text-xl my-4">最佳新人獎</h3>
              <div class="h-[230px] w-[250px]">
                <Splide :options="{ rewind: true, autoplay: true }" aria-label="My Favorite Images">
                  <SplideSlide v-for="(item, index) in newArtistNominees" :key="item.id">
                    <img
                      :src="item.url"
                      :alt="item.work"
                      class="w-[150px] ml-12 rounded cursor-pointer"
                      @click="carouselRouter(item.year, item.awards)"
                    />
                    <div class="flex flex-col items-center justify-center mt-4 mb-4">
                      <h3>{{ item.nominee + ' ' + item.work }}</h3>
                    </div>
                  </SplideSlide>
                </Splide>
              </div>
            </div>
            <div>
              <h3 class="text-center font-bold text-xl my-4">最佳華語女歌手獎</h3>
              <div class="h-[230px] w-[250px]">
                <Splide :options="{ rewind: true, autoplay: true }" aria-label="My Favorite Images">
                  <SplideSlide v-for="(item, index) in femaleSingerNominees" :key="item.id">
                    <img
                      :src="item.url"
                      :alt="item.work"
                      class="w-[150px] ml-12 rounded cursor-pointer"
                      @click="carouselRouter(item.year, item.awards)"
                    />
                    <div class="flex flex-col items-center justify-center mt-4 mb-4">
                      <h3>{{ item.nominee + ' ' + item.work }}</h3>
                    </div>
                  </SplideSlide>
                </Splide>
              </div>
            </div>
            <div>
              <h3 class="text-center font-bold text-xl my-4">最佳華語男歌手獎</h3>
              <div class="h-[230px] w-[250px]">
                <Splide :options="{ rewind: true, autoplay: true }" aria-label="My Favorite Images">
                  <SplideSlide v-for="(item, index) in maleSingerNominees" :key="item.id">
                    <img
                      :src="item.url"
                      :alt="item.work"
                      class="w-[150px] ml-12 rounded cursor-pointer"
                      @click="carouselRouter(item.year, item.awards)"
                    />
                    <div class="flex flex-col items-center justify-center mt-4 mb-4">
                      <h3>{{ item.nominee + ' ' + item.work }}</h3>
                    </div>
                  </SplideSlide>
                </Splide>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 去年提名 -->
      <div class="h-auto w-full grid grid-cols-1 sm:grid-cols-4 justify-end sm:py-12 mt-16">
        <div class="col-span-1 flex flex-col items-center justify-center px-2 sm:order-last" data-aos="zoom-in">
          <h2 class="text-4xl text-[#f4e0b2] font-black pt-4">{{ lastYear - 1 }} 提名</h2>
          <h3 class="text-xl text-[#f4e0b2] py-4">點選圖片查看詳細資料</h3>
        </div>
        <div
          data-aos="fade-right"
          data-aos-easing="ease-out-cubic"
          data-aos-duration="1000"
          class="col-span-1 sm:col-span-3 bg-yellow-600 text-[#fffccc] rounded-r-3xl p-16"
        >
          <div class="grid grid-cols-1 lg:grid-cols-2 place-items-center place-content-center">
            <div>
              <h3 class="text-center font-bold text-xl my-4">年度歌曲獎</h3>
              <div class="h-[230px] w-[250px]">
                <Splide :options="{ rewind: true, autoplay: true, type: loop }" aria-label="My Favorite Images">
                  <SplideSlide v-for="(item, index) in previousYearTopSongNominees" :key="item.id">
                    <img
                      :src="item.url"
                      :alt="item.work"
                      class="w-[150px] ml-12 rounded cursor-pointer"
                      @click="carouselRouter(item.year, item.awards)"
                    />
                    <div class="flex flex-col items-center justify-center mt-4 mb-4">
                      <h3>{{ item.nominee + ' ' + item.work }}</h3>
                    </div>
                  </SplideSlide>
                </Splide>
              </div>
            </div>
            <div>
              <h3 class="text-center font-bold text-xl my-4">最佳新人獎</h3>
              <div class="h-[230px] w-[250px]">
                <Splide :options="{ rewind: true, autoplay: true }" aria-label="My Favorite Images">
                  <SplideSlide v-for="(item, index) in previousYearNewArtistNominees" :key="item.id">
                    <img
                      :src="item.url"
                      :alt="item.work"
                      class="w-[150px] ml-12 rounded cursor-pointer"
                      @click="carouselRouter(item.year, item.awards)"
                    />
                    <div class="flex flex-col items-center justify-center mt-4 mb-4">
                      <h3>{{ item.nominee + ' ' + item.work }}</h3>
                    </div>
                  </SplideSlide>
                </Splide>
              </div>
            </div>
            <div>
              <h3 class="text-center font-bold text-xl my-4">最佳華語女歌手獎</h3>
              <div class="h-[230px] w-[250px]">
                <Splide :options="{ rewind: true, autoplay: true }" aria-label="My Favorite Images">
                  <SplideSlide v-for="(item, index) in previousYearFemaleSingerNominees" :key="item.id">
                    <img
                      :src="item.url"
                      :alt="item.work"
                      class="w-[150px] ml-12 rounded cursor-pointer"
                      @click="carouselRouter(item.year, item.awards)"
                    />
                    <div class="flex flex-col items-center justify-center mt-4 mb-4">
                      <h3>{{ item.nominee + ' ' + item.work }}</h3>
                    </div>
                  </SplideSlide>
                </Splide>
              </div>
            </div>
            <div>
              <h3 class="text-center font-bold text-xl my-4">最佳華語男歌手獎</h3>
              <div class="h-[230px] w-[250px]">
                <Splide :options="{ rewind: true, autoplay: true }" aria-label="My Favorite Images">
                  <SplideSlide v-for="(item, index) in previousYearMaleSingerNominees" :key="item.id">
                    <img
                      :src="item.url"
                      :alt="item.work"
                      class="w-[150px] ml-12 rounded cursor-pointer"
                      @click="carouselRouter(item.year, item.awards)"
                    />
                    <div class="flex flex-col items-center justify-center mt-4 mb-4">
                      <h3>{{ item.nominee + ' ' + item.work }}</h3>
                    </div>
                  </SplideSlide>
                </Splide>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
