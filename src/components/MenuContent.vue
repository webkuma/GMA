<script setup>
import { useRouter } from 'vue-router';
import { useMenuStore } from '../stores/counter.js';

const router = useRouter();
const store = useMenuStore();

import { useGetYearDataStore } from '../stores/counter.js';
const storeYearData = useGetYearDataStore();

document.addEventListener('click', (e) => {
  if (store.counter > 1) {
    const menu = document.querySelector('#menu');
    if (!menu.contains(e.target)) {
      store.isMaskClicked = 0;
      store.counter = 0;
    } else {
      store.isMaskClicked = 1;
    }
  } else if (store.counter === 1) {
    store.counter = 2;
  }
});

async function navigateToPage(page) {
  if (!storeYearData.yearData) {
    const sql = 'SELECT DISTINCT year FROM shortlist WHERE shortlist.won = 1 ORDER BY year DESC';
    await storeYearData.getYearData(sql);
  }
  if (page !== 'awards') {
    router.push({ path: `/${page}` });
  } else {
    router.push({ path: `/Awards/${storeYearData.yearData[0]}` });
  }
}
</script>
<template>
  <div
    v-if="store.isMaskClicked"
    class="fixed top-0 left-0 bg-black bg-opacity-20 h-full w-full z-[49]"
    sr-only="遮罩"
  ></div>
  <transition name="slide">
    <div
      v-if="store.isMaskClicked"
      id="menu"
      class="inline-block rounded-xl bg-[#1F1F23] max-h-full h-full w-[160px] fixed top-0 right-0 overflow-hidden z-50"
    >
      <!-- menu icon -->
      <div class="h-16 border-b-[1px] border-gray-500 px-4 flex items-center justify-end">
        <span data-collapse-toggle="navbar-hamburger" @click="store.toggleMenuVisibility()">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="w-10 h-10 p-1 cursor-pointer hover:rounded-full hover:bg-white hover:bg-opacity-30 fill-custom-gold"
          >
            <path
              fill-rule="evenodd"
              d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z"
              clip-rule="evenodd"
            />
          </svg>
        </span>
      </div>
      <!-- menu content -->
      <ul class="flex flex-col text-base text-white">
        <li
          class="cursor-pointer m-2 p-2 leading-10 hover:rounded hover:bg-gray-500 flex flex-row items-center justify-evenly"
          @click="navigateToPage('')"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1"
            stroke="currentColor"
            class="w-5 h-5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
            />
          </svg>
          <span>首頁</span>
        </li>
        <li
          class="cursor-pointer m-2 p-2 leading-10 hover:rounded hover:bg-gray-500 flex flex-row items-center justify-evenly"
          @click="navigateToPage('awards')"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1"
            stroke="currentColor"
            class="w-5 h-5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0"
            />
          </svg>
          <span>獎項</span>
        </li>
        <li
          class="cursor-pointer m-2 p-2 leading-10 hover:rounded hover:bg-gray-500 flex flex-row items-center justify-evenly"
          @click="navigateToPage('Search')"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1"
            stroke="currentColor"
            class="w-5 h-5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
          <span>搜尋</span>
        </li>
        <li
          class="cursor-pointer m-2 p-2 leading-10 hover:rounded hover:bg-gray-500 flex flex-row items-center justify-evenly"
          @click="navigateToPage('Favorite')"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1"
            stroke="currentColor"
            class="w-5 h-5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
            />
          </svg>
          <span>收藏</span>
        </li>
      </ul>
    </div>
  </transition>
</template>
<style>
.slide-enter-active,
.slide-leave-active {
  transition: right 0.5s ease;
}

.slide-enter-from,
.slide-leave-to {
  right: -200px;
}
</style>
