## 🎵 Golden Melody Awards (GMA)

**GMA** 是一個提供金曲獎資訊的網站。前端使用 **Vue 3** 和 **Tailwind CSS**，並透過 **Node.js** 和 **Express** 提供後端服務，**SQLite** 作為資料庫來管理和存儲數據。


網站目前提供 2010 至 2024 年的入圍資訊，並具有以下主要功能：

- **🏠 首頁**：提供近兩年最新入圍的輪播資訊，點擊輪播資訊可前往查看詳細資訊。
- **📅 獎項頁面**：可以選擇年份以顯示該年份的入圍資訊，並可選擇獎項進入詳細頁面。
- **📅 獎項子頁面**：可以自由切換年份、查看獎項的提名資訊，**串接 KKBOX API 以展示試聽功能**。（見圖 1）
- **🔍 搜尋頁面**：可以根據入圍者、作品（歌曲）名稱或獎項來搜尋。（見圖 2）
- **📑 切換顯示模式**：在搜尋頁面支援在不同的顯示模式（表格或圖片）之間切換。
- **🏆 獲獎次數排行榜**：提供 2010 至 2024 年入圍資訊的獲獎次數排行榜。
- **⭐ 收藏功能**：可以將喜歡的作品（歌曲）添加到收藏頁面，以便下次查看。

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
  - **Node.js + Express**：在本地環境中設置 Mock Server，用於模擬 API 接口以支持前端開發。
  - **SQLite**：輕量級資料庫用於本地資料存儲。

## 🚀 安裝與運行

### 安裝相依套件 Project Setup：
```bash
npm install
```
### Compile and Hot-Reload for Development

```bash
npm run dev
```

### Compile and Minify for Production

```bash
npm run build
```
## Recommended IDE Setup、Customize configuration

[VSCode](https://code.visualstudio.com/) + See [Vite Configuration Reference](https://vitejs.dev/config/).

### 📂 項目結構
```Markdown 
src/
├── components/           # Vue 組件
│   ├── AwardsDetailView/ # 獎項詳情組件
│   │── AwardsView/       # 獎項頁面組件
│   │── HomeView/         # 主頁組件
│   ├── Menu.vue          # 選單組件
│   ├── MenuContent.vue   # 選單內容組件
│   └── SearchBox.vue     # 搜索框組件
├── views/                # 頁面視圖
│   ├── AwardsDetailView.vue # 獎項詳情頁面
│   ├── AwardsView.vue    # 獎項頁面
│   ├── FavoriteView.vue  # 收藏頁面
│   ├── HomeView.vue      # 主頁面
│   └── SearchView.vue    # 搜尋頁面
├── router/               # 路由配置
│   └── index.js
├── stores/               # 狀態管理（Pinia）
├── db/                   # 資料庫（SQLite）
```
