# 📘 SimSimTalk Frontend

SNS Webアプリ「SimSimTalk」のフロントエンドリポジトリです。  
React + TypeScript をベースに、ユーザー中心のUXとリアルタイムインタラクションを重視して実装しています。

# 🚀 Demo

👉 デモ: https://simsim-talk-client.vercel.app/

# 👉 テストアカウント

ID: test@test.com  
PW: 1234

### 📝 アカウント登録について

本プロジェクトでは、ポートフォリオ評価者が簡単に動作確認できるよう
メール認証なしで会員登録可能な設計にしています。

通常のサービスではメール認証や本人確認が必要ですが、
デモ用途のためUXと検証容易性を優先しました。

※ 実運用を想定する場合はメール認証フローを追加可能な構成です。

# 🛠 Tech Stack

- React
- TypeScript
- MUI
- Redux Toolkit
- React Hook Form
- socket.io-client
- Axios

# 📂 Architecture

## ✨ 主な機能

### 🔐 認証

- JWT HttpOnly Cookie 認証
- ログイン状態維持（authMe）
- ソケット接続時のCookie認証

### 📝 投稿

- 投稿作成 / 編集 / 削除
- 画像アップロード（R2 Storage）
- 無限スクロール
- ユーザーページ投稿一覧

### 💬 チャット（Realtime）

- socket.io ベースのリアルタイムチャット
- 未読メッセージ数表示
- チャットルーム一覧リアルタイム更新

### 🔔 通知

- いいね / コメント / フレンド申請通知
- リアルタイム通知受信
- 既読処理

### 👥 フレンド

- フレンド申請 / 承認 / 拒否
- フレンド一覧
- フレンド推薦（共通フレンド）

### ⚡ 状態管理戦略

- サーバーデータ: Redux Toolkit（RTK Queryなし・Thunkベース）
- UI状態: コンポーネント state
- フォーム状態: React Hook Form
- リアルタイム状態: socketイベント同期

### 🧠 パフォーマンス & UX最適化

- IntersectionObserver 無限スクロール
- スケルトンローディングUI
- 一部オプティミスティックUI更新
- ソケットイベント最小化設計

# 🐞 Troubleshooting

## 1️⃣ ユーザーページ投稿が表示されない問題

ユーザーページ再訪問時に投稿が読み込まれない問題が発生。

### 原因

Redux store 初期化前に最後の投稿IDが計算され、  
サーバー側で「最終ページ」と判定されていた。

### 解決

ページ入場時初期化 → ❌  
ページ離脱時初期化 → ✅

store reset を unmount タイミングへ移動して解決。

---

## 2️⃣ 無限スクロール重複リクエスト問題

IntersectionObserver が重複発火し、  
同一ページデータが複数回リクエストされていた。

### 原因

loading状態とobserver条件が分離され、  
リクエスト中もobserverが再発火していた。

### 解決

isFetching 状態を observer 条件へ追加し、  
リクエスト中の再トリガーを防止。

# 📁 プロジェクト構造

```
src
├ components
├ pages
├ features
│ ├ auth
│ ├ post
│ ├ chat
│ ├ notification
│ └ friend
├ hooks
├ store
├ utils
└ types
```

# 🧩 Backend Repository

👉 https://github.com/taeyoungNew/simsim-talk-server

# 🚧 Future Improvements

## Phase 1 – モバイル・レスポンシブ最適化

SNSサービスにおけるモバイル利用比率の高さを考慮し、
レスポンシブUIの最適化を優先的に実施する予定です。

### 1) モバイルレイアウトの再構成

### 2) タッチ操作に配慮したインタラクション改善

### 3) 小画面環境におけるフィード可読性の向上

### 4) チャットUIのモバイル最適化
