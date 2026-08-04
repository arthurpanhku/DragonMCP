# Changelog

All notable changes to this project will be documented in this file.

## [0.3.0] - 2026-08-04

Refocused the project on Hong Kong and cross-border open data. Every remaining tool
calls a live API; the mock tools are gone.

### Removed
- **All 8 mock services**: WeChat Pay, Alipay, Didi, Meituan, Taobao (CN), Grab (SG), LINE Pay (JP), Naver Maps (KR). These returned fabricated data that an agent could not distinguish from real results.
- **Mock transit branches** for JP/KR/SG in the transit aggregator.
- **9 zero-import dependencies**: `@supabase/supabase-js`, `bull`, `crypto-js`, `helmet`, `joi`, `redis`, `uuid`, `winston`, `concurrently`.
- **Unused config**: Supabase, Redis, JWT/encryption secrets, WeChat, Alipay and Baidu Map settings. `JWT_SECRET` and `ENCRYPTION_KEY` are no longer required in production — nothing read them.
- **Stale translated READMEs** (de, fr, ja, ko), which documented the removed services.

### Changed
- **`search_transit_asia` renamed to `search_transit_route`**, scoped to `HK` and `CN`. The old name advertised Asia-wide coverage that was mock-only. **Breaking change.**
- **Aggregator** `services/aggregator/asia_transit` renamed to `services/aggregator/cross_border`; `AsiaTransitService` to `CrossBorderTransitService`.
- **`system_run_selftest`** documented as a live upstream reachability probe.
- **README** rewritten around verifiable data, with a Limitations section stating what the server cannot do.

### Fixed
- **MTR line coverage was under-documented.** All 10 lines were already implemented, but the README and an error message both claimed only Island and Tsuen Wan lines were supported.
- **Tuen Ma Line** was labelled "Tuen Mun Line" in English.
- **stdio integration test** called the removed `taobao_search_product`; it now exercises MTR routing offline.

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
