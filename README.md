## 🎵 Golden Melody Awards (GMA)

這是一個金曲獎資訊查詢網站，使用 Vue 3 和其他相關技術開發而成。網站目前提供 2010 至 2024 年的入圍資訊，您可以透過獎項頁面查看不同年份的入圍資訊，也可以透過搜尋功能查詢入圍者、作品（歌曲）名稱或獎項。

網站資料建置使用了 Node.js 和 Express 作為後端服務，並使用 SQLite 作為資料庫。

## 👀 Live demo [https://webkuma.github.io/GMA/](https://webkuma.github.io/GMA/)

## ✨ 功能特點
- **🏠 首頁**： 提供近兩年最新入圍的輪播資訊，點擊可前往查看詳細資訊。
- **🏆 獲獎次數排行榜**：顯示出不同年份的獲獎次數排行。
- **🔍 搜尋功能**：可以根據入圍者、作品（歌曲）名稱或獎項來搜尋。
- **⭐ 收藏功能**：可以將喜歡的作品（歌曲）添加到 LocalStorage，以便下次查看。
- **📑 列表和圖片模式**：在搜尋頁面支援在不同的顯示模式（表格或圖片）之間切換。
- **📅 獎項頁**：可以選擇年份以顯示當年的入圍資訊，並可選擇獎項進入詳細頁面，包含試聽功能和切換年份顯示詳細資訊。


<table><tr><td>
    <img src="https://github.com/user-attachments/assets/b7ae6f42-bcdd-40f9-a2b8-736f6c794d9c" />
</td></tr></table>
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
  - **Axios**：Axios KKBOX API。
  - **AOS**：視差滾動套件。
  - **Splide.js**：輪播套件。
  - **mitt**：用於兄弟組件傳遞參數。

- **後端**：
  - **Node.js + express**：後端環境和簡單的 API 服務。
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
![Top Langs](https://github-readme-stats.vercel.app/api/top-langs/?username=webkuma&hide_progress=true)
