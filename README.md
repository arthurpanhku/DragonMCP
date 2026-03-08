<div align="center">
  <img src="public/logo.png" alt="DragonMCP Logo" width="200">

  # DragonMCP

  DragonMCP is a Model Context Protocol (MCP) server designed for AI Agents to interact with local life services in Greater China (Mainland China, Hong Kong) and Asia.

  DragonMCP 是一个专为 AI Agent 设计的 Model Context Protocol (MCP) 服务器，旨在提供大中华区（中国内地、香港）及亚洲地区的本地生活服务接口。
</div>

---

## 🌍 Project Overview / 项目概述

DragonMCP bridges the gap between AI Agents and local services, enabling agents to perform real-world tasks such as payments, travel booking, shopping, and government service queries.

DragonMCP 填补了 AI Agent 与本地服务之间的空白，使 Agent 能够执行支付、出行预订、购物和政务查询等现实任务。

### Key Features / 核心功能

*   **Payment / 支付**: WeChat Pay, Alipay (Mini-programs, Utility bills) / 微信支付、支付宝（小程序、生活缴费）
*   **Travel / 出行**: Amap/Baidu Maps, Didi/Meituan Ride-hailing, MTR/High Speed Rail (12306) / 高德/百度地图、滴滴/美团打车、港铁/高铁 (12306)
*   **Lifestyle & E-commerce / 生活与电商**: Taobao/JD/Pinduoduo/Xianyu, Xiaohongshu, Meituan/Ele.me Food Delivery / 淘宝/京东/拼多多/闲鱼、小红书、美团/饿了么外卖
*   **Government Services / 政务服务**: Hong Kong e-services, Mainland China e-government platforms / 香港 e-services、内地电子政务平台

---

## 🚀 Getting Started / 快速开始

### Prerequisites / 前置要求

*   Node.js >= 18
*   npm or yarn
*   Redis (Optional, for caching / 可选，用于缓存)
*   Supabase/PostgreSQL (Optional, for data persistence / 可选，用于数据持久化)

### Installation / 安装

1.  Clone the repository / 克隆仓库:
    ```bash
    git clone https://github.com/arthurpanhku/DragonMCP.git
    cd DragonMCP
    ```

2.  Install dependencies / 安装依赖:
    ```bash
    npm install
    ```

3.  Configure environment variables / 配置环境变量:
    ```bash
    cp .env.example .env
    # Edit .env with your API keys and configuration
    # 编辑 .env 文件，填入您的 API 密钥和配置
    ```

### Running the Server / 运行服务器

Start the development server / 启动开发服务器:

```bash
npm run server:dev
```

The server will start at `http://localhost:3000`.
服务器将在 `http://localhost:3000` 启动。

### Running Tests / 运行测试

Run unit and integration tests / 运行单元测试和集成测试:

```bash
# Note: You need to enable experimental VM modules for Jest with ESM
# 注意：使用 ESM 时需要开启 Jest 的实验性 VM 模块支持
NODE_OPTIONS="$NODE_OPTIONS --experimental-vm-modules" npm test
```

---

## 🛠 Architecture / 技术架构

*   **Runtime**: Node.js + Express + TypeScript
*   **Protocol**: Model Context Protocol (MCP) SDK
*   **Database**: PostgreSQL (via Supabase)
*   **Caching**: Redis
*   **Testing**: Jest + Supertest

---

## 📝 Documentation / 文档

*   [Product Requirements Document (PRD) / 产品需求文档](.trae/documents/dragon_mcp_prd.md)
*   [Technical Architecture / 技术架构文档](.trae/documents/dragon_mcp_technical_architecture.md)

---

## 🤝 Contributing / 贡献指南

Contributions are welcome! Please feel free to submit a Pull Request.
欢迎贡献代码！请随时提交 Pull Request。

## 📄 License / 许可证

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
本项目采用 MIT 许可证 - 详情请参阅 [LICENSE](LICENSE) 文件。
