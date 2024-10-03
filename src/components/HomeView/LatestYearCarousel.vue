<script setup>
import { onMounted, ref } from "vue";
// router
import { useRouter } from "vue-router";
const router = useRouter();
// pinia
import { useGetLastYearNominees } from "@/stores/counter.js";
const getLastYearNomineesStore = useGetLastYearNominees();
// Splide 引入輪播套件
import { Splide, SplideSlide } from "@splidejs/vue-splide";
import "@splidejs/vue-splide/css";

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
  topSongNominees.value = await getLastYearNomineesStore.getYearData(
    "年度歌曲獎"
  );
  newArtistNominees.value = await getLastYearNomineesStore.getYearData(
    "最佳新人獎"
  );
  femaleSingerNominees.value = await getLastYearNomineesStore.getYearData(
    "最佳華語女歌手獎"
  );
  maleSingerNominees.value = await getLastYearNomineesStore.getYearData(
    "最佳華語男歌手獎"
  );
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
    <div
      class="col-span-1 flex flex-col items-center justify-center px-2"
      data-aos="zoom-in">
      <h2 class="text-4xl text-cg5 font-black pt-4">{{ lastYear }} 最新提名</h2>
      <h3 class="text-xl text-cg4 py-4">點選圖片查看詳細資料</h3>
    </div>
    <div
      data-aos="fade-left"
      data-aos-easing="ease-out-cubic"
      data-aos-duration="1000"
      class="col-span-1 sm:col-span-3 border-1 border-cg3 bg-cg2 text-black rounded-l-3xl p-16">
      <div
        class="grid grid-cols-1 lg:grid-cols-2 place-items-center place-content-center">
        <div v-if="topSongNominees?.length">
          <h3 class="text-center font-bold text-2xl my-4">年度歌曲獎</h3>
          <div class="h-[230px] w-[250px]">
            <Splide
              :options="{ rewind: true, autoplay: true, type: 'loop' }"
              aria-label="My Favorite Images">
              <SplideSlide v-for="item in topSongNominees" :key="item.id">
                <img
                  :src="item.url"
                  :alt="item.work"
                  class="w-[150px] ml-[50px] rounded cursor-pointer"
                  @click="carouselRouter(item.year, item.awards)" />
                <div
                  class="flex flex-col items-center justify-center pt-2 pb-4">
                  <h3 class="min-h-[45px] flex items-center font-semibold">
                    {{ item.nominee + "／" + item.work }}
                  </h3>
                </div>
              </SplideSlide>
            </Splide>
          </div>
        </div>
        <div v-if="newArtistNominees?.length">
          <h3 class="text-center font-bold text-2xl my-4">最佳新人獎</h3>
          <div class="h-[230px] w-[250px]">
            <Splide
              :options="{ rewind: true, autoplay: true, type: 'loop' }"
              aria-label="My Favorite Images">
              <SplideSlide v-for="item in newArtistNominees" :key="item.id">
                <img
                  :src="item.url"
                  :alt="item.work"
                  class="w-[150px] ml-[50px] rounded cursor-pointer"
                  @click="carouselRouter(item.year, item.awards)" />
                <div
                  class="flex flex-col items-center justify-center pt-2 pb-4">
                  <h3 class="min-h-[45px] flex items-center font-semibold">
                    {{ item.nominee + "／" + item.work }}
                  </h3>
                </div>
              </SplideSlide>
            </Splide>
          </div>
        </div>
        <div v-if="femaleSingerNominees?.length">
          <h3 class="text-center font-bold text-2xl my-4">最佳華語女歌手獎</h3>
          <div class="h-[230px] w-[250px]">
            <Splide
              :options="{ rewind: true, autoplay: true, type: 'loop' }"
              aria-label="My Favorite Images">
              <SplideSlide v-for="item in femaleSingerNominees" :key="item.id">
                <img
                  :src="item.url"
                  :alt="item.work"
                  class="w-[150px] ml-[50px] rounded cursor-pointer"
                  @click="carouselRouter(item.year, item.awards)" />
                <div
                  class="flex flex-col items-center justify-center pt-2 pb-4">
                  <h3 class="min-h-[45px] flex items-center font-semibold">
                    {{ item.nominee + "／" + item.work }}
                  </h3>
                </div>
              </SplideSlide>
            </Splide>
          </div>
        </div>
        <div v-if="maleSingerNominees?.length">
          <h3 class="text-center font-bold text-2xl my-4">最佳華語男歌手獎</h3>
          <div class="h-[230px] w-[250px]">
            <Splide
              :options="{ rewind: true, autoplay: true, type: 'loop' }"
              aria-label="My Favorite Images">
              <SplideSlide v-for="item in maleSingerNominees" :key="item.id">
                <img
                  :src="item.url"
                  :alt="item.work"
                  class="w-[150px] ml-[50px] rounded cursor-pointer"
                  @click="carouselRouter(item.year, item.awards)" />
                <div
                  class="flex flex-col items-center justify-center pt-2 pb-4">
                  <h3 class="min-h-[45px] flex items-center font-semibold">
                    {{ item.nominee + "／" + item.work }}
                  </h3>
                </div>
              </SplideSlide>
            </Splide>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
