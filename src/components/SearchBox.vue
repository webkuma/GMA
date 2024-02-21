<script setup>
import { computed } from 'vue';
import { useSearchStore } from '../stores/counter.js';
import { useRoute, useRouter } from 'vue-router';
const route = useRoute();
const router = useRouter();
const store = useSearchStore();
const searchInput = computed(() => store.searchInput); // 監聽ref 返回ref

// @enter
function handleSearch() {
  if (route.fullPath !== '/Search' && searchInput.value.split(' ').join('').length !== 0) {
    router.push({ path: `/Search` });
    // router.push({ path: '/Search', hash: '#' });
  }
  store.setSearchWord();
}

function clearSearchInput() {
  store.searchInput = '';
}
</script>
<template>
  <div id="outer" class="relative block m-4 w-2/3 sm:w-1/3 md:w-1/2">
    <!-- 搜尋框本體 -->
    <div>
      <div class="relative">
        <!-- 放大鏡 icon -->
        <span class="absolute inset-y-0 left-0 flex items-center pl-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6 stroke-slate-400"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </span>
        <!-- 搜尋框本框 -->
        <input
          v-model="store.searchInput"
          @keyup.enter="handleSearch()"
          class="placeholder:italic placeholder:text-slate-400 w-full border border-slate-300 rounded-md pl-9 shadow-sm block bg-white focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1"
          placeholder="歌手/歌曲/獎項"
          type="text"
          name="search"
          autocomplete="off"
        />
        <!-- X(清除) icon -->
        <span @click="clearSearchInput()" class="absolute inset-y-0 right-0 flex items-center pr-2 cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6 stroke-slate-400"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </span>
      </div>
    </div>
  </div>
</template>
<style scoped>
input,
svg_inputClear {
  -webkit-text-fill-color: black;
}
input::placeholder {
  -webkit-text-fill-color: #b3b3b3;
}
</style>
