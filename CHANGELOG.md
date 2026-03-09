# Changelog

All notable changes to this project will be documented in this file.

## [0.2.0] - 2026-03-09

### Added
- **Amap (Gaode) Routes**: Added `amap_driving_direction` (Fastest route) and `amap_transit_direction` (Integrated public transit) tools.
- **HK Weather**: Added `hk_weather_current` tool to fetch real-time weather reports from Hong Kong Observatory.
- **System Self-Test**: Added `system_run_selftest` tool for agents to verify the health of MTR, Amap, and Weather services.
- **Docker Support**: Added `Dockerfile` and `docker-compose.yml` for containerized deployment.
- **Documentation**: Updated all 6 language READMEs with new features and fixed Mermaid diagram rendering issues.

### Changed
- **Refactoring**: Reorganized `src/services` directory structure by region (`cn`, `hk`, `sg`, `jp`, `kr`) for better scalability.
  - Moved MTR to `src/services/hk/mtr`
  - Moved Amap/Didi/WeChat/Alipay/Meituan/Taobao to `src/services/cn/`
  - Moved Grab to `src/services/sg/`
  - Moved LINE Pay to `src/services/jp/`
  - Moved Naver Maps to `src/services/kr/`
- **Configuration**: Updated `tsconfig.json` to properly resolve paths and output to `./dist`.

### Fixed
- Fixed Mermaid architecture diagram syntax error (parentheses in node labels) in all README files.

## [0.1.0] - 2026-03-09

### Added
- Initial release of DragonMCP.
- Core MCP Server implementation with Express and SSE support.
- **MTR Service**: Real-time schedule query for Island Line & Tsuen Wan Line.
- **Amap Service**: POI search and walking directions.
- **Mock Services**: Basic mocks for WeChat Pay, Alipay, Didi, Meituan, Taobao, Grab, LINE Pay, and Naver Maps.
- Multi-language READMEs (English, Chinese, Japanese, Korean, French, German).
