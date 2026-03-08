<div align="center">
  <img src="public/logo.png" alt="DragonMCP Logo" width="200">

  # DragonMCP

  **중국 ロー컬 라이프 에이전트의 신경 중추**

  [English](README.md) | [简体中文](README_zh-CN.md) | [日本語](README_ja.md) | [한국어](README_ko.md) | [Français](README_fr.md) | [Deutsch](README_de.md)

  Claude / DeepSeek / Qwen이 배달 주문, DiDi 호출, 고속철도 표 확인, 공과금 납부를 직접 수행하게 하세요.

  [제품 요구사항 (PRD)](.trae/documents/dragon_mcp_prd.md) • [아키텍처](.trae/documents/dragon_mcp_technical_architecture.md) • [기여하기](#-contributing--기여하기)

  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
  [![MCP](https://img.shields.io/badge/Protocol-MCP-green.svg)](https://modelcontextprotocol.io/)
  [![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)
  [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/arthurpanhku/DragonMCP/pulls)
</div>

---

## 🌟 DragonMCP란?

DragonMCP는 AI 에이전트와 **중화권(중국 본토, 홍콩) 및 아시아**의 현지 생활 서비스 간의 격차를 해소하기 위해 설계된 MCP(Model Context Protocol) 서버입니다.

AI 에이전트와 실제 서비스 간의 "라스트 마일" 문제를 해결하는 것을 목표로 합니다.

---

## 🔥 라이브 데모: MTR 실시간 시간표

첫 번째 MVP(최소 기능 제품)로 **MTR(홍콩 철도) 조회 도구**를 구현했습니다. 이제 AI 에이전트가 MTR의 오픈 API에서 실시간 열차 시간표를 직접 가져올 수 있습니다.

**시나리오**:
> 사용자: "Admiralty(애드미럴티)에서 Central(센트럴)로 가는 다음 열차는 언제인가요?"

**에이전트 응답**:
> "Next Island Line train from Admiralty to Central (towards Kennedy Town):
> - Arriving in: 2 min(s) (10:30:00)
> - Subsequent trains: 5 min(s) (10:33:00)"

*(DragonMCP를 MCP 클라이언트에 연결하여 직접 체험해 보세요!)*

---

## 🏗️ 아키텍처

DragonMCP는 AI 에이전트와 다양한 로컬 서비스 API 간의 미들웨어 역할을 합니다.

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

자세한 내용은 [기술 아키텍처 문서](.trae/documents/dragon_mcp_technical_architecture.md)를 참조하세요.

---

## 🗺️ 로드맵 및 기능

### 1단계: MVP (현재)
- [x] **핵심 프레임워크**: Express + MCP SDK + TypeScript 설정.
- [x] **여행 (MTR)**: 아일랜드선 및  Tsuen Wan선 실시간 시간표 조회.
- [ ] **음식 배달 (데모)**: 주문 프로세스 시뮬레이션 (상점 검색 -> 메뉴 선택 -> 장바구니).
- [ ] **기본 구성**: 환경 변수 및 프로젝트 구조.

### 2단계: 확장
- [ ] **결제 통합**: WeChat Pay / Alipay (샌드박스/QR 코드 생성).
- [ ] **교통편 추가**: 고속철도(12306) 표 확인, DiDi/Uber 견적.
- [ ] **전자상거래**: 상품 검색 통합 (Taobao/JD).
- [ ] **다중 지역 지원**: 중국 본토 / 홍콩 / 싱가포르 간 컨텍스트 전환.

### 3단계: 생태계
- [ ] **플러그인 시스템**: 커뮤니티가 개별 서비스 도구를 기여할 수 있도록 허용.
- [ ] **사용자 인증**: 개인 서비스를 위한 안전한 토큰 관리.

---

## 🚀 시작하기

### 필수 조건
*   Node.js >= 18
*   npm 또는 yarn

### 설치

1.  저장소 복제:
    ```bash
    git clone https://github.com/arthurpanhku/DragonMCP.git
    cd DragonMCP
    ```

2.  종속성 설치:
    ```bash
    npm install
    ```

3.  환경 변수 구성:
    ```bash
    cp .env.example .env
    # 필요한 경우 .env 편집 (현재 MTR API에는 키가 필요 없음)
    ```

### 서버 실행

SSE 지원으로 개발 서버 시작:

```bash
npm run server:dev
```

서버는 `http://localhost:3000`에서 시작됩니다.
SSE 엔드포인트: `http://localhost:3000/mcp/sse`

### Claude Desktop에 연결

`claude_desktop_config.json`에 다음을 추가하세요:

```json
{
  "mcpServers": {
    "DragonMCP": {
      "command": "node",
      "args": ["/path/to/DragonMCP/api/dist/index.js"], 
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
```
*(참고: 로컬 개발의 경우 먼저 빌드하거나 ts-node 래퍼를 가리켜야 할 수 있습니다)*

---

## 🧪 테스트

단위 및 통합 테스트 실행:

```bash
# Jest용 실험적 VM 모듈 활성화 (ESM 지원)
NODE_OPTIONS="$NODE_OPTIONS --experimental-vm-modules" npm test
```

---

## 🤝 기여하기

개발자, 디자이너, 제품 기획자 등 모든 분들의 기여를 환영합니다!

### 도움이 필요한 부분:
1.  **Playwright 스크립트**: 음식 배달 앱(Meituan/Ele.me) 웹 흐름 시뮬레이션.
2.  **추가 MTR 노선**: East Rail Line, Tuen Ma Line 등의 역 데이터 추가.
3.  **문서**: 문서를 다른 언어로 번역.

자세한 내용은 [CONTRIBUTING.md](CONTRIBUTING.md) (곧 공개 예정)를 참조하세요.

---

## 📄 라이선스

이 프로젝트는 MIT 라이선스에 따라 라이선스가 부여됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.
