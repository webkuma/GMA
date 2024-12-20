# 🎵 Golden Melody Awards (GMA)

**GMA** 是一個提供金曲獎資訊的網站，涵蓋 2010 至 2024 年的入圍資訊。
網站前端使用 **Vue 3** 和 **Tailwind CSS**，後端最初使用 **Node.js** 和 **Express** 作為 Mock Server，資料庫使用 **SQLite**。後來將後端轉為使用 **Supabase**。

## ✨ 主要功能：

- **🏠 首頁**：展示近兩年的最新入圍資訊，以輪播方式呈現，點擊可查看詳細內容。
- **📅 獎項頁面**：選擇年份顯示該年的入圍資訊，並可進一步查看各獎項的詳細資訊。
- **📅 獎項子頁面**：切換年份以查看獎項提名資訊，集成 **KKBOX API** 提供試聽功能。（見圖 1）
- **🔍 搜尋頁面**：根據入圍者、作品（歌曲）名稱或獎項進行搜尋。（見圖 2）
- **📑 切換顯示模式**：支援搜尋頁面可在表格和圖片模式之間切換。
- **🏆 獲獎次數排行榜**：展示 2010 至 2024 年的獲獎次數排行榜。
- **⭐ 收藏功能**：可以將喜歡的作品（歌曲）添加到收藏頁面，方便日後查看。

## 👀 Live demo [https://webkuma.github.io/GMA/](https://webkuma.github.io/GMA/)

## 🖼️ 畫面介紹
**圖 1：獎項子頁面**
<table><tr><td>
    <img src="https://github.com/user-attachments/assets/b7ae6f42-bcdd-40f9-a2b8-736f6c794d9c" />
</td></tr></table>

**圖 2：搜尋頁面**
<table><tr><td>
    <img src="https://github.com/user-attachments/assets/90a770f0-b934-42d1-b040-ba95ff265743" />
</td></tr></table>

## 🛠 技能

- **前端**：
  - **Vue 3**：用於構建整個前端界面和組件管理。
  - **Vue Router**：進行前端路由管理。
  - **vue-lazyload**：用於搜尋頁面圖片懶加載。
  - **Tailwind CSS**：用於快速構建和設計 UI 元素。
  - **Vue3 Toastify**：用於通知和消息提示功能。
  - **Pinia**：狀態管理。
  - **Axios**：負責 KKBOX API。
  - **AOS**：視差滾動套件。
  - **Splide.js**：輪播套件。
  - **mitt**：用於兄弟組件傳遞參數。

- **後端**：
  - **Supabase**：用於即時數據管理和雲端資料存儲，取代本地的 **Node.js** 和 **SQLite**。
  - ~~**Node.js + Express**：在本地環境中設置 Mock Server，用於模擬 API 接口以支持前端開發。~~
  - ~~**SQLite**：輕量級資料庫用於本地資料存儲。~~

## 🚀 技術轉換

### 為何從 **SQLite** 和 **Mock Server** 轉換到 **Supabase**

- **即時性**：**Supabase** 支持即時數據更新功能，這對於需要更新的金曲獎資訊更方便。
- **簡化部署**：轉換到 **Supabase** 使得後端結構更加簡單，現在可以直接在線上操作，無需再本地端啟動和維護。


## 📋 手動測試
以下針對網站的主要功能進行手動測試，確保正常運作且符合預期。

### 1. 🏠 首頁
- 點擊按鈕後，確認是否跳轉至獎項頁面。
- 輪播內容是否正確顯示近兩年資訊。
- 點擊輪播項目後，確認是否跳轉至對應的獎項子頁面。

### 2. 📅 獎項頁面
- 切換年份後，確認顯示的資訊是否與選擇的年份一致。
- 點擊獎項後，確認是否正確進入對應的獎項子頁面。

### 3. 📅 獎項子頁面
- 切換年份後，確認顯示的獎項資訊是否正確更新。
- 點擊或選擇獎項後，確認顯示的提名資訊是否完整且正確。
- 點擊試聽按鈕後，確認按鈕顯示狀態及音樂播放功能是否正常。

### 4. 🔍 搜尋頁面
- 當搜尋框為空時，點擊搜尋按鈕後，確認搜尋功能不被執行。
- 搜尋前：
  - 確認搜尋框內提示文字是否清楚且正確。
  - 確認獲獎次數排行榜是否正常顯示。
- 執行搜尋後：
  - 當無符合條件的結果時，確認是否顯示適當的提示訊息。
  - 確認獲獎次數排行榜是否隱藏，並顯示正確的搜尋結果。
  - 確認是否支援模糊查詢並正確返回相應結果。
  - 確認表格模式與圖表模式切換功能是否正確。
  - 確認年份正序、反序切換功能是否正確。

### 5. ⭐ 收藏功能
- 添加作品至收藏後，確認收藏頁面是否即時更新，且顯示的內容正確。
- 從收藏移除作品後，確認頁面內容是否正確同步更新。

### 6. ⚙️ Header 組件
- 確認點擊 logo 是否能正確跳轉至首頁。
- 確認 menu 子路由是否能正確跳轉至對應頁面。

---

### 📂 項目結構
```Markdown 
src/
├── components/           # Vue 組件
│   ├── AwardsDetailView/ # 獎項詳情組件
│   │── AwardsView/       # 獎項頁面組件
│   │── HomeView/         # 主頁組件
│   ├── Menu.vue          # 選單組件
│   └── SearchBox.vue     # 搜索框組件
├── views/                # 頁面視圖
│   ├── AwardsDetailView.vue # 獎項詳情頁面
│   ├── AwardsView.vue    # 獎項頁面
│   ├── FavoriteView.vue  # 收藏頁面
│   ├── HomeView.vue      # 主頁面
│   └── SearchView.vue    # 搜尋頁面
├── router/               # 路由配置
│   └── index.js
├── lib/               # supabase 相關
│   ├── backendQuery.js   # 登入和新增資料邏輯
│   ├── frontendQuery.js  # 前端頁面存取邏輯
│   ├── supabaseClient.js
│   └── userAuth.js
├── stores/               # 狀態管理（Pinia）
└── db/                   # 資料庫（SQLite 暫無使用）
```
