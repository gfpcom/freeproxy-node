# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-11-19

### Added

- Initial release of freeproxy-node
- Zero-dependency HTTP client using native Node.js `https` module
- Full TypeScript support with comprehensive type definitions
- Async/await API with `query()`, `queryCountry()`, `queryProtocol()`, `queryPage()` methods
- Custom `FreeProxyError` class for error handling
- Dual package support (ESM and CommonJS)
- Comprehensive test suite with Jest
- Detailed documentation and examples
- GitHub Actions CI/CD workflows
- Support for Node.js 16+

### Features

- Simple and intuitive API for fetching proxies from GetFreeProxy API
- Query filtering by country, protocol, and pagination
- Built-in error handling with detailed error information
- Request timeout configuration
- Custom API endpoint support
- Direct proxy array return (no response wrapping)
