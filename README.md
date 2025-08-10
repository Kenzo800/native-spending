# 💰 Native Spending - 智能支出追蹤應用

> 一個現代化的個人財務管理應用，幫助您輕鬆追蹤收支、分析消費習慣，實現財務目標。

## ✨ 特色功能

### 📊 **智能財務分析**
- **視覺化圖表**: 圓餅圖展示支出分佈，一目了然
- **趨勢分析**: 月度收支趨勢，掌握財務狀況
- **分類統計**: 詳細的消費分類分析
- **實時計算**: 自動計算餘額、平均支出等關鍵指標

### 💳 **便捷交易管理**
- **快速記帳**: 簡潔的界面，3秒完成一筆記錄
- **智能分類**: 預設多種收支分類，支援自定義
- **標籤系統**: 為交易添加標籤，方便後續查找
- **位置記錄**: 可選擇記錄交易地點

### 🎨 **優雅的用戶體驗**
- **深色/淺色主題**: 自動適應系統設置或手動切換
- **港幣支持**: 預設使用港幣（HKD）顯示
- **骨架屏載入**: 流暢的載入體驗，無閃爍
- **響應式設計**: 完美適配各種設備尺寸

### 🗄️ **強大的數據管理**
- **SQLite 數據庫**: 本地存儲，安全可靠
- **數據備份**: 支援匯出/匯入功能
- **離線使用**: 無需網絡連接，隨時記帳
- **性能優化**: 快速查詢，大量數據無壓力

## 🚀 快速開始

### 環境要求
- Node.js 18.0.0 或更高版本
- npm 或 yarn
- Expo CLI
- iOS 模擬器 或 Android 模擬器

### 安裝步驟

1. **克隆項目**
   ```bash
   git clone https://github.com/your-username/native-spending.git
   cd native-spending
   ```

2. **安裝依賴**
   ```bash
   npm install
   ```

3. **啟動開發服務器**
   ```bash
   npm start
   ```

4. **運行應用**
   - **iOS**: 按 `i` 在 iOS 模擬器中打開
   - **Android**: 按 `a` 在 Android 模擬器中打開
   - **Web**: 按 `w` 在瀏覽器中打開

## 📱 應用截圖

### 主頁面
- 財務概覽卡片
- 快速操作按鈕
- 本月收支統計
- 支出分佈圓餅圖
- 最近交易列表

### 交易管理
- 交易列表（支援篩選和排序）
- 添加/編輯交易
- 分類選擇器
- 日期選擇器

### 統計分析
- 期間選擇器（7天/30天/90天/1年）
- 收支統計總覽
- 分類支出分析
- 月度趨勢圖表

### 設置頁面
- 主題模式切換
- 數據匯出/匯入
- 清除數據選項

## 🛠️ 技術架構

### 核心技術
- **React Native**: 跨平台移動應用開發
- **Expo**: 開發工具鏈和平台
- **TypeScript**: 類型安全的 JavaScript
- **SQLite**: 本地關係型數據庫

### 主要依賴
```json
{
  "expo": "~53.0.7",
  "react": "19.0.0",
  "react-native": "0.79.2",
  "expo-sqlite": "~15.2.14",
  "react-native-safe-area-context": "5.4.0",
  "@react-navigation/bottom-tabs": "^7.3.10",
  "@expo/vector-icons": "^14.1.0"
}
```

### 項目結構
```
native-spending/
├── app/                    # 主要應用頁面
│   ├── context/           # React Context（主題、應用狀態）
│   ├── index.tsx          # 主頁
│   ├── transactions.tsx   # 交易管理頁
│   ├── statistics.tsx     # 統計分析頁
│   └── settings.tsx       # 設置頁
├── components/            # 可重用組件
│   ├── ui/               # 基礎 UI 組件
│   ├── charts/           # 圖表組件
│   ├── transaction/      # 交易相關組件
│   └── skeletons/        # 骨架屏組件
├── utils/                # 工具函數
│   ├── database.ts       # SQLite 數據庫操作
│   ├── storage.ts        # 存儲 API
│   └── calculations.ts   # 財務計算函數
├── constants/            # 常量定義
├── types/               # TypeScript 類型定義
└── assets/              # 靜態資源
```

## 💾 數據管理

### 數據庫架構
```sql
-- 交易記錄表
CREATE TABLE transactions (
  id TEXT PRIMARY KEY,
  type TEXT CHECK (type IN ('income', 'expense')),
  amount REAL NOT NULL,
  description TEXT NOT NULL,
  category_id TEXT NOT NULL,
  date TEXT NOT NULL,
  location TEXT,
  tags TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- 分類表
CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  type TEXT CHECK (type IN ('income', 'expense')),
  is_default INTEGER DEFAULT 0
);

-- 預算表
CREATE TABLE budgets (
  id TEXT PRIMARY KEY,
  category_id TEXT NOT NULL,
  amount REAL NOT NULL,
  period TEXT CHECK (period IN ('monthly', 'weekly', 'daily')),
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
```

### API 接口
```typescript
// 交易操作
saveTransaction(transaction: Transaction): Promise<void>
loadTransactions(): Promise<Transaction[]>
updateTransaction(id: string, updates: Partial<Transaction>): Promise<void>
deleteTransaction(id: string): Promise<void>

// 高級查詢
getTransactionsByDateRange(startDate: string, endDate: string): Transaction[]
getTransactionsByCategory(categoryId: string): Transaction[]
getTransactionStats(): { totalIncome: number; totalExpense: number; transactionCount: number }

// 分類操作
saveCategory(category: Category): Promise<void>
loadCategories(): Promise<Category[]>
deleteCategory(id: string): Promise<void>

// 數據管理
exportData(): Promise<string>
importData(dataString: string): Promise<void>
clearAllData(): Promise<void>
```

## 🎨 設計系統

### 主題配色
```typescript
// 淺色主題
const lightTheme = {
  background: '#FFFFFF',
  surface: '#F8F9FA',
  primary: '#007AFF',
  income: '#34C759',
  expense: '#FF3B30',
  text: '#000000',
  textSecondary: '#666666'
};

// 深色主題
const darkTheme = {
  background: '#000000',
  surface: '#1C1C1E',
  primary: '#0A84FF',
  income: '#32D74B',
  expense: '#FF453A',
  text: '#FFFFFF',
  textSecondary: '#AEAEB2'
};
```

### 組件庫
- **Card**: 內容卡片容器
- **Button**: 可定制的按鈕組件
- **Input**: 文本輸入組件
- **Skeleton**: 載入骨架屏
- **PieChart**: 圓餅圖
- **TransactionItem**: 交易項目組件

## 📈 性能優化

### 數據庫優化
- **索引**: 為常用查詢字段創建索引
- **預編譯語句**: 使用 SQLite 預編譯提高查詢速度
- **批量操作**: 支援批量插入和更新

### UI 優化
- **骨架屏**: 避免白屏和閃爍
- **懶載入**: 頁面按需載入
- **SafeArea**: 正確處理設備安全區域
- **記憶化**: 使用 useMemo 和 useCallback 優化渲染

## 🔒 隱私與安全

- **本地存儲**: 所有數據存儲在設備本地
- **無網絡依賴**: 完全離線運行，保護隱私
- **數據加密**: SQLite 數據庫文件本地存儲
- **安全備份**: 匯出數據採用 JSON 格式，便於備份

## 🚧 開發計劃

### 即將推出
- [ ] 預算管理功能
- [ ] 重複交易設置
- [ ] 更多圖表類型
- [ ] 數據同步功能
- [ ] 多幣種支持

### 長期規劃
- [ ] Apple Watch / Wear OS 支持
- [ ] 銀行卡自動同步
- [ ] AI 智能分類
- [ ] 財務目標設定
- [ ] 社區分享功能

## 🤝 貢獻指南

歡迎貢獻代碼、報告 Bug 或提出建議！

1. Fork 此項目
2. 創建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

## 📄 許可證

此項目採用 MIT 許可證 - 查看 [LICENSE](LICENSE) 文件了解詳情。

## 📞 聯繫方式

- **項目鏈接**: [https://github.com/your-username/native-spending](https://github.com/your-username/native-spending)
- **問題反饋**: [Issues](https://github.com/your-username/native-spending/issues)
- **電子郵件**: your-email@example.com

---

<p align="center">
  用 ❤️ 打造的個人財務管理應用
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React%20Native-0.79.2-blue?style=flat-square&logo=react" alt="React Native" />
  <img src="https://img.shields.io/badge/Expo-53.0.7-black?style=flat-square&logo=expo" alt="Expo" />
  <img src="https://img.shields.io/badge/TypeScript-5.8.3-blue?style=flat-square&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/SQLite-3-green?style=flat-square&logo=sqlite" alt="SQLite" />
</p>