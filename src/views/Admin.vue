<script setup>
import { ref, onMounted } from "vue";
import { fetchShortlistYear } from "@/lib/frontendQuery.js";
import {
  fetchShortlistByYear,
  fetchAwardsList,
  updateAwardStatus,
  addNewYearEntry,
  deleteEntriesByYear,
  getShortlistByYearAndAwards,
  deleteShortlistEntry,
  addShortlistEntry,
} from "@/lib/backendQuery.js";
import { verifySignIn, signOut } from "@/lib/userAuth.js";
import Swal from "sweetalert2";
import { useRouter } from "vue-router";
const router = useRouter();

const years = ref(); // 儲存年份的列表或數據
const nowChooseYear = ref(); // 當前選擇的年份
const yearlyAwards = ref(); // 儲存每年獎項的數據
const awardsNameList = ref(); // 儲存獎項名稱列表
const newYearInput = ref(); // 用於輸入新年份的數據
const isRemoving = ref(0); // 用於切換移除狀態的布林值（0 為關閉，1 為開啟）

onMounted(async () => {
  isSignIn();
  onMountedFetchShortlistYear();
  onMountedFetchAwardsList();
});

// 登入
async function isSignIn() {
  const verifyRouter = await verifySignIn();
  router.push({ path: `${verifyRouter}` });
}
// 登出
async function isSignOut() {
  const verifyRouter = await signOut();
  router.push({ path: `${verifyRouter}` });
}

// 獲取全部年份
async function onMountedFetchShortlistYear() {
  years.value = await fetchShortlistYear();
}
// 獲取全部獎項名稱
async function onMountedFetchAwardsList() {
  awardsNameList.value = await fetchAwardsList();
}

/**
 * 根據提供的年份取得該年度的獎項資料
 * @param {number} year - 查詢的年份
 */
async function getYearyearlyAwards(year) {
  nowChooseYear.value = year;
  const res = await fetchShortlistByYear(year);
  if (res) {
    yearlyAwards.value = res;
  }
}

/**
 * 更新獲獎狀態並重新載入該年度的獎項資料
 *
 * @param {string} awards - 獎項名稱
 * @param {string} nominee - 提名者名稱
 * @param {string} work - 提名作品名稱
 *
 * @description
 * 當 radio 按鈕變更時調用此函數，會根據提供的獎項、提名者及作品名稱，
 * 更新獲獎狀態。更新成功後，會重新載入當前選擇年份的獎項資料。
 */
async function updateAwardStatusAndRefresh(awards, nominee, work) {
  const data = {
    year: nowChooseYear.value,
    awards: awards,
    nominee: nominee,
    work: work,
  };
  const status = await updateAwardStatus(data);
  if (status === 204) getYearyearlyAwards(nowChooseYear.value);
}

/**
 * 新增年份
 *
 * @description
 * 當呼叫此函數時，它會檢查 `newYearInput` 的值是否存在。如果存在，
 * 則會調用 `addNewYearEntry` 函數來新增年份。若新增成功 (HTTP 狀態碼 201)，
 * 則會重新載入年份列表以顯示最新的年份資料。
 */
async function addNewYearEntryAndRefresh() {
  if (newYearInput.value) {
    const status = await addNewYearEntry(newYearInput.value);
    if (status === 201) onMountedFetchShortlistYear();
  }
}

/**
 * 刪除指定年份的條目
 *
 * @param {number} year - 要刪除的年份
 *
 * @description
 * 當呼叫此函數時，它會根據傳入的 `year` 參數調用 `deleteEntriesByYear` 函數來刪除對應年份的條目。
 * 若刪除成功 (HTTP 狀態碼 204)，則會重新載入年份列表以顯示最新的資料。
 */
async function deleteYearAndRefresh(year) {
  const status = await deleteEntriesByYear(year);
  if (status === 204) onMountedFetchShortlistYear();
}

/**
 * 刪除指定年份和獎項的條目
 *
 * @param {string} awards - 要刪除的獎項名稱
 *
 * @description
 * 當呼叫此函數時，它會基於當前選擇的年份 (`nowChooseYear.value`) 和傳入的 `awards` 參數，
 * 調用 `deleteShortlistEntry` 函數來刪除對應的條目。
 */
async function deleteAwardEntry(awards) {
  const data = {
    year: nowChooseYear.value,
    awards: awards,
  };
  await deleteShortlistEntry(data);
}
/**
 * 新增新的獎項條目
 *
 * @param {object} params - 要新增的獎項條目資料
 * @returns {Promise<void>} - 無返回值，但會調用 `addShortlistEntry` 函數以新增資料
 *
 * @description
 * 當呼叫此函數時，它會基於傳入的 `params` 參數調用 `addShortlistEntry` 函數來新增獎項條目。
 */
async function addAwardEntry(parms) {
  const status = await addShortlistEntry(parms);
  getYearyearlyAwards(nowChooseYear.value);
}

/**
 * 顯示包含獎項資料的提示框，並處理用戶輸入的更新
 *
 * @param {string} awards - 要顯示和處理的獎項名稱
 *
 * @description
 * 這個函數會顯示一個提示框，包含當前選擇年份和指定獎項的詳細資料。提示框會顯示獎項的
 * 提名人、作品名稱及 URL，用戶可以在文本框中編輯資料。提交後，函數會將用戶輸入的資料分解成
 * 結構化格式，並刪除舊的獎項條目，然後新增更新後的條目。
 */
async function showAlert(awards) {
  let inputValue = "";
  let textareaValue = "";
  const data = {
    year: nowChooseYear.value,
    awards: awards,
  };
  // 顯示資料
  const res = await getShortlistByYearAndAwards(data);
  res.forEach((item) => {
    inputValue += `<span class='m-2 text-xl font-bold'> ${item.nominee}／${item.work}／${item.url}<span><br>`;
    textareaValue += `${item.nominee}／${item.work}／${item.url} \n`;
  });
  Swal.fire({
    title: nowChooseYear.value + awards,
    width: 1080,
    heightAuto: true,
    input: "textarea",
    inputValue: textareaValue,
    color: "rgb(206 145 0)",
    background:
      "url(https://png.pngtree.com/png-clipart/20230817/original/pngtree-vertical-stripes-background-in-abstract-white-and-gray-geometric-pattern-vector-png-image_10462619.png)",
    html: inputValue,
    showCancelButton: true,
    confirmButtonText: `<i class="fa fa-thumbs-up"></i> Submit!`,
    confirmButtonColor: "#000000",
    cancelButtonColor: "#000000",

    inputValidator: (value) => {
      if (!value) {
        return "You need to enter something!";
      }
    },
  }).then(async (result) => {
    if (result.isConfirmed) {
      const str = result.value.split("\n");
      let newArr = [];
      str.forEach((line) => {
        const parts = line.split("／");
        newArr.push({
          awards: awards,
          nominee: parts[0].trim(),
          work: parts[1].trim(),
          year: nowChooseYear.value,
          won: 0,
          url: parts[2] ? parts[2].trim() : "",
        });
      });
      try {
        deleteAwardEntry(awards);
        addAwardEntry(newArr);
      } catch (error) {
        console.error(error.message);
      }
    }
  });
}
// 用以顯示刪除按鈕的切換
function switchRemoveStatus() {
  isRemoving.value = !isRemoving.value;
}
</script>
<template>
  <body class="bg-gray-200 w-full h-full">
    <div id="app">
      <!-- title -->
      <div class="bg-blue-500 text-white text-center p-4 text-4xl">
        後台管理
      </div>
      <button
        @click="isSignOut()"
        type="submit"
        class="w-full text-white border-1 bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
        登出
      </button>
      <!-- table (year)  -->
      <button
        @click="switchRemoveStatus()"
        type="button"
        class="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm p-3 m-2">
        顯示刪除按鈕
      </button>
      <div class="flex flex-col">
        <div class="mb-2">
          <div class="flex flex-row overflow-auto">
            <div
              v-for="table in years"
              :key="table.year"
              class="flex flex-col p-2 m-2">
              <button
                @click="getYearyearlyAwards(table.year)"
                class="p-2 mb-1 border-1 border-gray-500 rounded-xl cursor-pointer text-center"
                :class="{ 'bg-red-200': nowChooseYear === table.year }">
                {{ table.year }}
              </button>
              <button
                v-if="isRemoving"
                @click="deleteYearAndRefresh(table.year)"
                class="p-1 border-1 border-gray-500 rounded-xl cursor-pointer text-center text-red-800">
                刪除
              </button>
            </div>
          </div>
        </div>
      </div>
      <!-- add year -->
      <label class="m-4">
        Year
        <input
          type="text"
          class="py-2 px-4 border border-gray-300 rounded"
          v-model="newYearInput" />
        <button
          class="p-2 ml-1 rounded-lg border-1 border-gray-400"
          @click="addNewYearEntryAndRefresh">
          新增年份
        </button>
        未開獎的預設格式：尚未開獎／尚未開獎／https://i.kfs.io/article5_cover/global/11614984v1/fit/800x420.jpg
      </label>

      <div class="grid grid-cols-3 gap-2 p-4">
        <!-- awardsNameList = 所有獎項 -->
        <div v-for="item in awardsNameList">
          <div
            class="p-4 border-1 border-gray-400 rounded-xl cursor-pointer"
            @click="showAlert(item.awards)">
            {{ item.awards }}
          </div>
          <div v-for="tableItem in yearlyAwards">
            <div v-if="tableItem.awards === item.awards" class="m-1 p-1">
              <input
                type="radio"
                :id="tableItem.id"
                :name="tableItem.awards"
                :checked="tableItem.won === 1"
                @change="
                  updateAwardStatusAndRefresh(
                    tableItem.awards,
                    tableItem.nominee,
                    tableItem.work
                  )
                " />
              <label
                :for="tableItem.id"
                class="p-1"
                :class="{ 'bg-red-200': tableItem.won === 1 }"
                >{{ tableItem.nominee }}／{{ tableItem.work }}
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </body>
</template>
