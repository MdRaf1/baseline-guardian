# Step-by-Step Guide: Publishing to GitHub Marketplace

This guide provides detailed instructions for publishing Baseline Guardian to the GitHub Actions Marketplace.

## ✅ Pre-Publication Checklist

All required items are now in place:

- ✅ **action.yml** - Contains all required metadata (name, description, author, branding)
- ✅ **README.md** - Comprehensive documentation with usage examples
- ✅ **LICENSE** - MIT License file
- ✅ **dist/** - Compiled action ready to run
- ✅ **Version Tag** - v1.0.0 tag exists
- ✅ **CI/CD Workflows** - Automated testing and release workflows
- ✅ **Documentation** - MARKETPLACE.md with publishing instructions

## 🚀 Publishing Steps

### Step 1: Ensure Repository is Public

1. Go to https://github.com/MdRaf1/baseline-guardian/settings
2. Scroll to the bottom of the page
3. In the "Danger Zone" section, verify the repository visibility is set to **Public**
4. If it's private, click "Change visibility" and make it public

> **Note:** GitHub Marketplace only accepts public repositories.

### Step 2: Create a GitHub Release

1. Navigate to: https://github.com/MdRaf1/baseline-guardian/releases

2. Click **"Draft a new release"**

3. Fill in the release details:
   - **Choose a tag:** Select existing tag `v1.0.0` (or create new)
   - **Release title:** `v1.0.0 - Initial Marketplace Release`
   - **Description:** Add release notes (see template below)

4. **IMPORTANT:** Check the box:
   ☑️ **"Publish this Action to the GitHub Marketplace"**

5. Configure marketplace listing:
   - **Primary category:** Select "Code Quality"
   - **Additional categories (optional):** 
     - "Continuous Integration"
     - "Code Review"

6. Click **"Publish release"**

### Step 3: Verify Publication

After publishing, verify your action appears in the marketplace:

1. Visit: https://github.com/marketplace?query=baseline+guardian
2. Or directly: https://github.com/marketplace/actions/baseline-guardian
3. Check that all information displays correctly

## 📝 Release Notes Template

Use this template when creating the release:

```markdown
## 🎉 Initial Release - Baseline Guardian

**Baseline Guardian** is now available on the GitHub Actions Marketplace!

### What is Baseline Guardian?

A GitHub Action that enforces modern web standards before they hit production. It automatically scans CSS files in pull requests for browser compatibility issues using the official web-features baseline data.

### Features

- 🔍 **Automatic Scanning** - Triggers on every pull request
- 📊 **Baseline Data** - Uses official web-features dataset
- 🛡️ **Policy Enforcement** - Configurable fail/warn/ignore policies
- 💬 **PR Comments** - Clear, actionable reports with MDN links
- ⚡ **Fast & Lightweight** - Runs in Node.js 20

### Quick Start

Add this workflow to your repository:

\`\`\`yaml
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
\`\`\`

See the [README](https://github.com/MdRaf1/baseline-guardian#readme) for full documentation.

### What's Included

- CSS property scanning
- Baseline status checking (widely available, newly available, limited availability)
- Configurable policy enforcement (.baseline-guardian.yml)
- Feature ignore list support
- Automated PR comments with violation reports

---

**Full Changelog**: https://github.com/MdRaf1/baseline-guardian/commits/v1.0.0
```

## 🔄 Future Updates

When you want to release updates:

1. Make your changes and commit them
2. Build the action: `npm run build`
3. Commit the updated `dist/` folder
4. Create and push a new tag:
   ```bash
   git tag v1.0.1
   git push origin v1.0.1
   ```
5. The automated release workflow will:
   - Run tests
   - Create a GitHub release
   - Update the marketplace listing automatically
   - Update the major version tag (v1)

## 🏷️ Version Management

### Major Version Tags

Keep major version tags updated for easy adoption:

```bash
# After releasing v1.0.1, update v1 tag
git tag -fa v1 -m "Update v1 to v1.0.1"
git push origin v1 --force
```

Users can then reference `@v1` in their workflows, which always points to the latest v1.x.x release.

### Semantic Versioning

Follow [semantic versioning](https://semver.org/):
- **Major (v2.0.0)**: Breaking changes
- **Minor (v1.1.0)**: New features, backwards compatible
- **Patch (v1.0.1)**: Bug fixes, backwards compatible

## 📚 Additional Resources

- [GitHub Marketplace Documentation](https://docs.github.com/en/actions/creating-actions/publishing-actions-in-github-marketplace)
- [GitHub Actions Metadata Syntax](https://docs.github.com/en/actions/creating-actions/metadata-syntax-for-github-actions)
- [GitHub Actions Best Practices](https://docs.github.com/en/actions/creating-actions/about-custom-actions)

## ❓ Troubleshooting

### "Publish to Marketplace" checkbox not visible

Ensure:
- Repository is public
- `action.yml` exists in repository root
- You have admin permissions on the repository

### Marketplace listing not updating

- It may take a few minutes for changes to propagate
- Check that the release is not marked as "draft"
- Verify the tag is properly pushed to GitHub

### Action not found by users

- Ensure the release is published (not draft)
- Check that "Publish to Marketplace" was checked
- Verify the repository is public
