<script setup>
import LatestYearCarousel from "@/components/HomeView/LatestYearCarousel.vue";
import PreviousYearCarousel from "@/components/HomeView/PreviousYearCarousel.vue";
import Banner from "@/components/HomeView/Banner.vue";
</script>

<!-- sm:640 md:768 lg:1024 xl:1280 -->
<template>
  <main class="overflow-x-hidden">
    <div>
      <!-- bg img -->
      <Banner></Banner>

      <!-- 最新提名 -->
      <LatestYearCarousel></LatestYearCarousel>

      <!-- 去年提名 -->
      <PreviousYearCarousel></PreviousYearCarousel>
    </div>
  </main>
</template>
