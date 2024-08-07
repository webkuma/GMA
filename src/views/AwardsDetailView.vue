<script setup>
import loading from "@/components/Loading.vue";
import { onMounted, ref } from "vue";
import { useRouter, RouterLink } from "vue-router";
import emitter from "@/components/utils/emitter.js";
import Awards from "@/components/AwardsDetailView/Awards.vue";
import AwardsDetail from "@/components/AwardsDetailView/AwardsDetail.vue";
import YearSelect from "@/components/AwardsDetailView/YearSelect.vue";

const router = useRouter();
const isNotFoundYear = ref();
const selectedYear = ref();
const selectedAwards = ref();
const isLoading = ref(false); // 年份載入完成=1

// 監聽子組件 Awards；用以表示查無此年份
emitter.on("isNotFoundYear", () => {
  isNotFoundYear.value = true;
});
// 監聽子組件 Awards；拿年份、獎項參數來用
emitter.on("updateSelectedYear", ({ year, awards }) => {
  selectedYear.value = year;
  selectedAwards.value = awards;
});
// 監聽子組件 YearSelect；當下拉選單更新就獲取年份
emitter.on("yearChange", (year) => {
  selectedYear.value = year;
  isLoading.value = true;
});

onMounted(async () => {
  await router.isReady();
  selectedYear.value = router.currentRoute.value.params["year"];
  selectedAwards.value = router.currentRoute.value.params["awards"];
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
  // token.value = await getKkboxTokenSotre.getKkboxToken();
  // 检查 Token 是否有效，则获取新的 Token
  // if (!getKkboxTokenSotre.hasValidToken()) {
  //   token.value = await getKkboxTokenSotre.getKkboxToken();
  //   console.log(token.value.access_token);
  // }
  // console.log(getKkboxTokenSotre.hasValidToken());
});
</script>

<template>
  <main class="text-white">
    <!-- 處理非預期的年份 -->
    <div
      v-if="isNotFoundYear"
      class="z-20 absolute w-full h-full bg-[#202020]/90 bg-opacity-90">
      <div class="flex flex-col items-center justify-center h-full text-white">
        <p class="text-6xl text-custom-gold">(='X'=)</p>
        <p class="text-2xl m-4">年份錯誤</p>
        <p class="text-lg">
          <RouterLink
            to="/"
            class="p-3 flex items-center justify-center text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 focus:ring-4 font-medium rounded-lg text-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-4 h-4 mr-1">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
            </svg>
            <span>返回首頁</span>
          </RouterLink>
        </p>
      </div>
    </div>

    <!-- Loading -->
    <!-- <div class="absolute w-full h-full bg-[#202020] bg-opacity-90">
      <div class="flex items-center justify-center h-full">
        <Loading />
      </div>
    </div> -->

    <!-- main content -->
    <loading v-show="!isLoading" />
    <div v-show="isLoading">
      <div class="flex flex-col lg:flex-row gap-4 justify-between p-4">
        <!-- 導航列 -->
        <div class="flex justify-between items-center">
          <nav
            class="flex justify-between items-center p-3 text-gray-700 border-1 border-cg3 rounded-lg bg-gray-50"
            aria-label="Breadcrumb">
            <ol
              class="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
              <li class="inline-flex items-center">
                <RouterLink to="/" class="flex items-center">
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
                  <RouterLink
                    :to="`/Awards/${selectedYear}`"
                    class="flex items-center">
                    <a
                      class="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white">
                      {{ selectedYear }} 年
                    </a>
                  </RouterLink>
                </div>
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
                    class="ms-1 text-sm font-medium text-gray-900 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white">
                    {{ selectedAwards }}
                  </a>
                </div>
              </li>
            </ol>
          </nav>
        </div>
        <!-- 年份下拉選單 -->
        <YearSelect></YearSelect>
      </div>

      <!-- [0]:id、[1]:獎項、[2]:歌手、[3]:歌、[4]:年、[5]:得獎0/1、[6]:圖片url -->
      <div class="flex flex-col lg:flex-row gap-3 px-4">
        <!-- 左側獎項資訊 -->
        <Awards></Awards>
        <!-- 右側歌曲資訊 -->
        <AwardsDetail></AwardsDetail>
      </div>
    </div>
  </main>
</template>
