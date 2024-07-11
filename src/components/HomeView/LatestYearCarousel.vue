<script setup>
import { onMounted, ref } from 'vue';
// router
import { useRouter } from 'vue-router';
const router = useRouter();
// pinia
import { useGetLastYearNominees } from '@/stores/counter.js';
const getLastYearNomineesStore = useGetLastYearNominees();
// Splide 引入輪播套件
import { Splide, SplideSlide } from '@splidejs/vue-splide';
import '@splidejs/vue-splide/css';

onMounted(async () => {
  getLatestNominees();
});

// 取得最新年份的資料(輪播用)
const femaleSingerNominees = ref();
const maleSingerNominees = ref();
const newArtistNominees = ref();
const topSongNominees = ref();
const lastYear = ref();

// 取得最新年份的資料(輪播用)
async function getLatestNominees() {
  topSongNominees.value = await getLastYearNomineesStore.getYearData('年度歌曲獎');
  newArtistNominees.value = await getLastYearNomineesStore.getYearData('最佳新人獎');
  femaleSingerNominees.value = await getLastYearNomineesStore.getYearData('最佳華語女歌手獎');
  maleSingerNominees.value = await getLastYearNomineesStore.getYearData('最佳華語男歌手獎');
  lastYear.value = topSongNominees.value[0].year; // 拿裡面的年份當標題用一下
}

// 點擊推播圖片後跳轉
function carouselRouter(year, awards) {
  router.push({ path: `/Awards/${year}/${awards}` });
}
</script>

<template>
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
</template>
