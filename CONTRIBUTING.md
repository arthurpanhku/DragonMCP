# Contributing to DragonMCP

Thank you for your interest in contributing to DragonMCP! We welcome contributions from everyone, whether you're fixing a bug, adding a new feature, or improving documentation.

## Getting Started

1.  **Fork the repository** on GitHub.
2.  **Clone your fork** locally:
    ```bash
    git clone https://github.com/your-username/DragonMCP.git
    cd DragonMCP
    ```
3.  **Install dependencies**:
    ```bash
    npm install
    ```
4.  **Create a branch** for your changes:
    ```bash
    git checkout -b feature/my-new-feature
    ```

## The one hard rule: no mock tools

**A tool that returns fabricated data is worse than a missing tool**, because the agent
cannot tell the difference and will present the fiction to the user as fact. If an
upstream API is unavailable to you, do not register the tool.

This means:
- Every registered tool must call a real API.
- When an upstream fails, return an explicit error — never a plausible-looking fallback.
- Add your data source to `system_run_selftest` so its liveness is publicly checkable.

Scope is Hong Kong and the Mainland China border region. Open public data sources
(`data.gov.hk` and equivalents) are strongly preferred: no keys, no rate-limit paperwork,
and no terms-of-service risk.

## Development Workflow

### Project Structure
- `src/services/<region>/<service>/`: Service implementations. Regions in use: `hk`, `cn`.
- `src/services/aggregator/`: Tools that combine multiple regions.
- `src/services/system/`: Self-test and diagnostics.
- `src/mcp/`: MCP server definition and tool registration.
- `src/tests/`: Unit and integration tests.

### Adding a New Service
1.  Create a new directory in `src/services/<region>/<service-name>`.
2.  Implement the service logic in `service.ts` and types in `types.ts`.
3.  Register the new tool in `src/mcp/server.ts`.
4.  Add the upstream to `src/services/system/test/service.ts`.
5.  Add tests in `src/tests/`. **Tests must not depend on the network** — CI has no API keys.

### Testing
We use Jest for testing. Please ensure all tests pass before submitting a PR.

```bash
# Run all tests
npm test

# Run specific test file
npm test src/tests/unit/my-service.test.ts
```

### Linting
Ensure your code follows the project's coding standards:

```bash
npm run lint
```

## Pull Request Process

1.  Update the `README.md` with details of changes to the interface, if applicable.
2.  Update the `CHANGELOG.md` with a brief description of your changes.
3.  Submit a Pull Request to the `main` branch.
4.  The CI system will automatically run tests and build checks.

## Code of Conduct

Please note that this project is released with a Contributor Code of Conduct. By participating in this project you agree to abide by its terms.

## License

By contributing, you agree that your contributions will be licensed under its MIT License.
