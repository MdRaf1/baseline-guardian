# Publishing to GitHub Marketplace

This document provides instructions for publishing Baseline Guardian to the GitHub Actions Marketplace.

## Prerequisites

Before publishing to the marketplace, ensure:

1. ✅ The repository is **public** (required by GitHub)
2. ✅ The `action.yml` file is present in the repository root
3. ✅ The action has been tagged with a semantic version (e.g., `v1.0.0`)
4. ✅ The `dist/` folder contains the compiled action code
5. ✅ A comprehensive `README.md` exists with usage examples
6. ✅ A `LICENSE` file is present

## How to Publish

### Step 1: Verify Repository Settings

1. Go to your repository settings on GitHub
2. Ensure the repository is set to **Public** (Settings → General → Danger Zone)

### Step 2: Create a Release

1. Navigate to your repository on GitHub
2. Go to the "Releases" section (right sidebar or `/releases`)
3. Click "Draft a new release"
4. Select or create a new tag (e.g., `v1.0.0`)
5. Fill in the release title and description
6. **Important:** Check the box that says "**Publish this Action to the GitHub Marketplace**"
7. Select the primary category for your action (e.g., "Code Quality" or "Continuous Integration")
8. Optionally add additional categories/tags
9. Click "Publish release"

### Step 3: Verify Publication

After publishing, your action should appear in the GitHub Marketplace:
- Visit: https://github.com/marketplace/actions/baseline-guardian
- Or search for "Baseline Guardian" in the marketplace

## Marketplace Categories

Suggested categories for Baseline Guardian:
- **Primary:** Code Quality
- **Secondary:** Continuous Integration, Code Review

## Updating the Marketplace Listing

To update your action in the marketplace:

1. Make your changes and commit them
2. Build the action: `npm run build`
3. Commit the updated `dist/` folder
4. Create and push a new tag: 
   ```bash
   git tag v1.0.1
   git push origin v1.0.1
   ```
5. Create a new release on GitHub with the new tag
6. The marketplace listing will automatically update

## Marketplace Best Practices

1. **Keep README Updated:** The README is shown on the marketplace listing
2. **Use Semantic Versioning:** Follow semver for version tags (v1.0.0, v1.1.0, v2.0.0)
3. **Maintain Major Version Tags:** Create/update `v1` tag to point to latest v1.x.x release
4. **Include Examples:** Show clear usage examples in the README
5. **Document Inputs:** All action inputs should be well documented
6. **Add Branding:** The icon and color in `action.yml` appear in the marketplace

## Additional Resources

- [GitHub Actions Marketplace Documentation](https://docs.github.com/en/actions/creating-actions/publishing-actions-in-github-marketplace)
- [GitHub Actions Metadata Syntax](https://docs.github.com/en/actions/creating-actions/metadata-syntax-for-github-actions)
- [Semantic Versioning](https://semver.org/)
