# Rift Watch｜峽谷觀測站

Rift Watch 是一個 mobile-first 的 League of Legends 情報觀測工具，目標是把賽事、版本、隊伍動態、Meta 趨勢與重要新聞整理成適合手機快速閱讀的資訊面板。

第一版是純前端 MVP：不做登入、不接後端、不串真實 API，資料來源先以 mock data 模擬，讓功能結構與資料模型先成形，未來可以平順替換成 API response。

## 核心功能

- Dashboard：整合今日賽事、版本重點、Meta 趨勢、關注隊伍與新聞摘要。
- News：依分類篩選新聞，支援關鍵字搜尋、重要度篩選與新到舊排序。
- Matches：依賽事狀態篩選，支援隊伍搜尋，顯示日期、聯賽、比分與 BO 資訊。
- Patches：顯示版本摘要，使用 Accordion 展開 champion / item / system changes。
- Watch List：使用者可切換關注隊伍，狀態會保存在 localStorage。
- Meta Trends：使用 Recharts 視覺化目前版本趨勢熱度。

## 技術棧

- React
- TypeScript
- Vite
- React Bootstrap
- Bootstrap Icons
- CSS Modules
- Zustand
- Zustand persist middleware
- Recharts
- localStorage

## 資料模型簡介

主要資料型別集中在 `src/shared/types.ts`，方便之後對接 API 或調整資料來源。

- `NewsItem`：新聞摘要資料，包含分類、來源、標籤、關聯隊伍/選手與重要度。
- `Match`：賽事資料，包含聯賽、賽事名稱、時間、狀態、隊伍、比分與 BO 資訊。
- `PatchNote`：版本資料，包含版本號、發布時間、摘要、影響等級與變動清單。
- `ChampionChange`：英雄改動資料，標示 buff / nerf / adjust / rework 與位置。
- `Team`：隊伍資料，包含地區、簡稱、emoji logo 與關注狀態。
- `MetaTrend`：Meta 趨勢資料，包含位置、趨勢方向、熱度值與觀察筆記。

## 專案結構

```txt
src/
  app/                  # App routing 與應用入口組裝
  features/             # 依功能拆分頁面與元件
    dashboard/
    matches/
    news/
    patches/
    teams/
  shared/               # 跨功能共用資源
    components/         # 共用 UI 元件
    hooks/              # 共用 hooks
    mock/               # 第一版 mock data
    stores/             # Zustand stores
    styles/             # 全域樣式與主題變數
    utils/              # 日期、ID 等工具
    types.ts            # 共用資料模型
```

## 如何啟動專案

安裝依賴：

```bash
npm install
```

啟動開發伺服器：

```bash
npm run dev
```

若 `5173` port 已被其他專案佔用，可以指定其他 port：

```bash
npm run dev -- --port 5174
```

建立 production build：

```bash
npm run build
```

預覽 build 結果：

```bash
npm run preview
```

## 目前資料來源

第一版使用 `src/shared/mock` 內的 mock data：

- `news.ts`
- `matches.ts`
- `patches.ts`
- `teams.ts`
- `metaTrends.ts`

這些資料結構刻意貼近未來 API payload，可以在導入後端或第三方資料源時，把 store 初始化來源從 mock data 替換成 API 回傳資料，頁面元件不需要大幅改寫。

## 狀態管理與持久化

專案使用 Zustand 管理前端狀態，並透過 persist middleware 寫入 localStorage。

- `rift-watch-preferences`：關注隊伍偏好
- `rift-watch-news`：新聞資料
- `rift-watch-matches`：賽事資料
- `rift-watch-patches`：版本資料

## 面試可說明的技術亮點

- React component 拆分：以 feature-based structure 組織 Dashboard、News、Matches、Patches、Teams，讓頁面與元件責任清楚。
- TypeScript 資料模型設計：集中定義 `NewsItem`, `Match`, `PatchNote`, `Team`, `MetaTrend` 等模型，降低跨元件資料不一致的風險。
- Zustand 狀態管理：使用 store 封裝資料與查詢方法，例如新聞搜尋、賽事狀態篩選、版本高影響改動與關注隊伍。
- localStorage 持久化：使用 Zustand persist 保存使用者關注隊伍，重新整理後狀態仍保留。
- mock data 與未來 API 替換規劃：目前以 mock data 初始化 store，未來可把資料來源替換成 API fetch，維持 UI 使用 store 的介面。
- 篩選、搜尋、排序：News 與 Matches 頁面提供 category/status 篩選、關鍵字搜尋與日期排序。
- Recharts 資料視覺化：Dashboard 使用 Recharts 呈現 Meta 趨勢，讓資訊摘要不只停留在文字列表。
- mobile-first UI：最大寬度 768px 置中，資訊密度與互動控制以手機閱讀為優先。
- React Bootstrap 客製化：使用 Bootstrap 元件作為基礎，再透過 CSS Modules 與主題變數塑造深色、俐落、有電競感的產品介面。

## 未來規劃

- 串接真實賽事、版本與新聞 API。
- 加入更完整的 team / player detail pages。
- 加入資料更新時間與資料來源可信度標示。
- 增加使用者自訂追蹤條件，例如地區、隊伍、選手與 champion。
- 加入測試：Vitest、React Testing Library、store unit tests。
- 對 Recharts、Bootstrap Icons 等較大的依賴做 code splitting。
