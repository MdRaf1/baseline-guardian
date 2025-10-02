# Baseline Guardian

[![GitHub Marketplace](https://img.shields.io/badge/Marketplace-Baseline%20Guardian-blue.svg?colorA=24292e&colorB=0366d6&style=flat&longCache=true&logo=github)](https://github.com/marketplace/actions/baseline-guardian)
[![CI](https://github.com/MdRaf1/baseline-guardian/actions/workflows/ci.yml/badge.svg)](https://github.com/MdRaf1/baseline-guardian/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Enforce modern web standards before they hit production.**

<!-- markdownlint-disable-next-line MD033 -->
<p align="center">
  <!-- markdownlint-disable-next-line MD033 -->
  <img src="https://raw.githubusercontent.com/MdRaf1/baseline-guardian/main/docs/pr-comment.gif" alt="Baseline Guardian PR Comment" />
</p>

## The Problem: Why Linters Aren't Enough

Linters and IDE extensions do a decent job of flagging cutting-edge web features, but they are optional nudges that disappear the moment a developer is on a tight deadline. Without an enforceable check, it's easy for an unsupported CSS or JavaScript feature to slip into a pull request. When that happens, teams ship regressions that manifest as broken layouts, missing interactions, and a degraded experience for anyone on the wrong browser. Baseline Guardian turns compatibility awareness into a fail-safe. By plugging straight into your CI/CD pipeline, it promotes compatibility from a best-effort suggestion to a strict team policy that every pull request must satisfy.

## How It Works

1. **Scans Pull Requests:** Automatically triggers on every pull request to scan changed CSS files.
2. **Checks Baseline Data:** Cross-references all CSS properties found against the official `web-features` dataset to determine their Baseline status (`widely available`, `newly available`, or `limited availability`).
3. **Enforces Team Policy:** Validates these statuses against a simple `.baseline-guardian.yml` policy file located in the root of your repository.
4. **Reports in the PR:** If any violations are found, it posts a clear, actionable comment directly on the pull request, listing the non-compliant features with direct links to their MDN documentation.

## Installation

Baseline Guardian is available in the [GitHub Actions Marketplace](https://github.com/marketplace/actions/baseline-guardian). Follow the quick start guide below to add it to your repository.

## Quick Start

### 1. Create Workflow File

Create `.github/workflows/baseline-guardian.yml` with the workflow below.

````yaml
# .github/workflows/baseline-guardian.yml
name: 'Baseline Guardian'

on:
  pull_request:
    types: [opened, synchronize]

permissions:
  contents: read
  pull-requests: write
  checks: write

jobs:
  run-guardian:
    name: Run Baseline Guardian
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Run Baseline Guardian
        uses: MdRaf1/baseline-guardian@v1.0.0
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
````

### 2. Create Policy File

Add a `.baseline-guardian.yml` file to the root of your repository.

````yaml
# .baseline-guardian.yml
# Fail the check if any 'newly available' features are used.
# Warn about any 'limited availability' features.
policy:
  newly_available: fail
  limited_availability: warn
````

## Configuration

Tweak Baseline Guardian by editing `.baseline-guardian.yml`. Use the commented template below as a guide.

````yaml
# .baseline-guardian.yml

# Define the action to take for each Baseline status level.
# Options are:
# 'fail': Exits with a failure code, blocking the PR (if branch protection is enabled).
# 'warn': Exits with a success code but still posts a comment listing the features.
# 'ignore': Takes no action for features with this status.
policy:
  newly_available: fail
  limited_availability: warn

# A list of specific web features to ignore during scans.
# This is useful for features you are polyfilling or have otherwise approved for use.
# Feature IDs must match the format used by the 'web-features' package.
ignore_features:
  - 'css.properties.view-transition-name'
  - 'css.selectors.:has'
````

## Development & Contributing

To set up the development environment, clone the repository and run `npm install`. You can then run `npm run build` to compile the TypeScript source.

Contributions are welcome! Please feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License — see the [LICENSE](./LICENSE) file for details.
