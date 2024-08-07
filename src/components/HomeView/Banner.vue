<script setup>
import { onMounted, ref } from "vue";
import BannerBtn from "@/components/HomeView/BannerBtn.vue";

const bannerImageUrl = ref();
const LoadImg = () => {
  const img = new Image();
  img.src =
    "https://res.cloudinary.com/dhklqfzdj/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1720731934/bg_t3apy4.webp";
  img.onload = () => {
    bannerImageUrl.value = img.src;
  };
};
onMounted(async () => {
  LoadImg();
});
</script>

<template>
  <!-- bg img -->
  <div class="grid relative shadow-sm shadow-gray-100">
    <img
      :src="bannerImageUrl"
      class="relative w-full min-h-[calc(100vh_-_64px)] h-[calc(100vh_-_64px)] object-cover bg-black bg-opacity-60"
      alt="Banner Image" />
    <div class="absolute inset-0 bg-black opacity-50"></div>

    <!-- text -->
    <div class="absolute inset-0 col-span-1">
      <div
        class="absolute flex flex-col items-center justify-center gap-8 w-full h-full text-gray-50">
        <p
          data-aos="fade-down"
          class="text-2xl [&>span:nth-child(2)]:px-2 [&>span:nth-child(n)]:first-letter:text-main [&>span:nth-child(n)]:first-letter:text-4xl [&>span:nth-child(n)]:font-extrabold [&>span:nth-child(n)]:inline-block">
          <span class="text-accent text-2xl md:text-3xl font-semibold">
            Golden
          </span>
          <span class="text-accent text-2xl md:text-3xl font-semibold">
            Melody
          </span>
          <span class="text-accent text-2xl md:text-3xl font-semibold">
            Awards
          </span>
        </p>
        <p class="px-2 text-center text-2xl font-semibold text-accent">
          Discover and Explore the Music
        </p>
        <p class="px-2 text-center text-2xl font-semibold text-accent">
          The Artists, Awards, and Works
        </p>
        <BannerBtn></BannerBtn>
      </div>
    </div>
  </div>
</template>
<style scoped>
img[alt="Banner Image"] {
  opacity: 0;
}

img[src] {
  opacity: 1;
  transition: opacity 0.3s ease-in;
}
</style>
