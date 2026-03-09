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

## Development Workflow

### Project Structure
- `src/services/`: Contains all service implementations organized by region (`cn`, `hk`, `sg`, `jp`, `kr`).
- `src/mcp/`: Contains the MCP server definition and tool registration.
- `src/tests/`: Contains unit and integration tests.

### Adding a New Service
1.  Create a new directory in `src/services/<region>/<service-name>`.
2.  Implement the service logic in `service.ts` and types in `types.ts`.
3.  Register the new tool in `src/mcp/server.ts`.
4.  Add unit tests in `src/tests/`.

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
