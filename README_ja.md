<div align="center">
  <img src="assets/logo.png" alt="DragonMCP Logo" width="200">

  # DragonMCP

  **中国ローカルライフエージェントの神経中枢**

  [English](README.md) | [简体中文](README_zh-CN.md) | [日本語](README_ja.md) | [한국어](README_ko.md) | [Français](README_fr.md) | [Deutsch](README_de.md)

  Claude / DeepSeek / Qwen に、デリバリーの注文、DiDiの配車、高速鉄道チケットの確認、公共料金の支払いを直接任せましょう。

  [製品要件 (PRD)](.trae/documents/dragon_mcp_prd.md) • [アーキテクチャ](.trae/documents/dragon_mcp_technical_architecture.md) • [貢献](#-contributing--貢献)

  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
  [![MCP](https://img.shields.io/badge/Protocol-MCP-green.svg)](https://modelcontextprotocol.io/)
  [![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)
  [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/arthurpanhku/DragonMCP/pulls)
</div>

---

## 🌟 DragonMCPとは？

DragonMCPは、AIエージェントと**大中華圏（中国本土、香港）およびアジア**のローカルライフサービスとの架け橋となるように設計されたModel Context Protocol (MCP) サーバーです。

AIエージェントと現実世界のサービス間の「ラストワンマイル」の問題を解決することを目指しています。

---

## 🔥 ライブデモ：MTRリアルタイム時刻表

最初のMVP（実用最小限の製品）として、**MTR（香港鉄路）クエリツール**を実装しました。AIエージェントは、MTRのオープンAPIからリアルタイムの列車時刻表を直接取得できるようになりました。

**シナリオ**:
> ユーザー：「金鐘（Admiralty）から中環（Central）への次の列車はいつですか？」

**エージェントの応答**:
> "Next Island Line train from Admiralty to Central (towards Kennedy Town):
> - Arriving in: 2 min(s) (10:30:00)
> - Subsequent trains: 5 min(s) (10:33:00)"

*(DragonMCPをMCPクライアントに接続して、ぜひ試してみてください！)*

---

## 🏗️ アーキテクチャ

DragonMCPは、AIエージェントとさまざまなローカルサービスAPI間のミドルウェアとして機能します。

```mermaid
graph TD
    A[AI Agent Client] -->|MCP Protocol| B[DragonMCP Server]
    B --> C[Service Router]
    
    subgraph "Service Modules"
        C --> D[Payment Service]
        C --> E[Travel Service]
        C --> F[Lifestyle Service]
        C --> G[Gov Service]
    end
    
    subgraph "External APIs"
        D -.-> H[WeChat/Alipay]
        E -.-> I[MTR/Amap/Didi]
        F -.-> J[Meituan/Taobao]
        G -.-> K[HK Gov/Mainland Gov]
    end
```

詳細については、[技術アーキテクチャドキュメント](.trae/documents/dragon_mcp_technical_architecture.md)を参照してください。

---

## 🗺️ ロードマップと機能

### フェーズ1：MVP（現在）
- [x] **コアフレームワーク**: Express + MCP SDK + TypeScriptのセットアップ。
- [x] **交通 (MTR)**: 港島線と荃湾線のリアルタイム時刻表クエリ。
- [ ] **フードデリバリー (Demo)**: 注文プロセスのシミュレーション（店舗検索 -> メニュー選択 -> カート追加）。
- [ ] **基本設定**: 環境変数とプロジェクト構造。

### フェーズ2：拡張
- [ ] **決済統合**: WeChat Pay / Alipay（サンドボックス/QRコード生成）。
- [ ] **交通機関の追加**: 高速鉄道（12306）のチケット確認、DiDi/Uberの見積もり。
- [ ] **Eコマース**: 商品検索の集約（Taobao/JD）。
- [ ] **多地域サポート**: 中国本土 / 香港 / シンガポール間のコンテキスト切り替え。

### フェーズ3：エコシステム
- [ ] **プラグインシステム**: コミュニティが個別のサービスツールを提供できるようにする。
- [ ] **ユーザー認証**: 個人サービスのための安全なトークン管理。

---

## 🚀 はじめに

### 前提条件
*   Node.js >= 18
*   npm または yarn

### インストール

1.  リポジトリをクローンします:
    ```bash
    git clone https://github.com/arthurpanhku/DragonMCP.git
    cd DragonMCP
    ```

2.  依存関係をインストールします:
    ```bash
    npm install
    ```

3.  環境変数を設定します:
    ```bash
    cp .env.example .env
    # 必要に応じて .env を編集します（現在、MTR APIにキーは不要です）
    ```

### サーバーの実行

SSEサポート付きで開発サーバーを起動します:

```bash
npm run dev
```

サーバーは `http://localhost:3000` で起動します。
SSEエンドポイント: `http://localhost:3000/mcp/sse`

### Claude Desktopへの接続

`claude_desktop_config.json` に以下を追加してください:

```json
{
  "mcpServers": {
    "DragonMCP": {
      "command": "node",
      "args": ["/path/to/DragonMCP/dist/server.js"], 
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
```
*(注：ローカル開発の場合は、最初にビルドするか、ts-nodeラッパーを指定する必要がある場合があります)*

---

## 🧪 テスト

単体テストと統合テストを実行します:

```bash
# Jestの実験的VMモジュールを有効にする（ESMサポート）
NODE_OPTIONS="$NODE_OPTIONS --experimental-vm-modules" npm test
```

---

## 🤝 貢献

開発者、デザイナー、プロダクト思想家を問わず、あらゆる貢献を歓迎します！

### 以下の支援を必要としています：
1.  **Playwrightスクリプト**: フードデリバリーアプリ（美団/Ele.me）のWebフローのシミュレーション。
2.  **MTR路線の追加**: 東鉄線、屯馬線などの駅データの追加。
3.  **ドキュメント**: ドキュメントの他言語への翻訳。

詳細は [CONTRIBUTING.md](CONTRIBUTING.md)（近日公開）を参照してください。

---

## 📄 ライセンス

このプロジェクトはMITライセンスの下でライセンスされています - 詳細は [LICENSE](LICENSE) ファイルを参照してください。
