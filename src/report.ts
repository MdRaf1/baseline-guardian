import { PolicyViolation } from './engine';

function formatStatus(status: string): string {
  return status
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function formatPolicy(policy: string): string {
  return policy.charAt(0).toUpperCase() + policy.slice(1);
}

function createTableRows(violations: PolicyViolation[]): string {
  return violations
    .map((violation) => {
      const feature = `\`${violation.property}\``;
      const baselineStatus = formatStatus(violation.baselineStatus);
      const policy = formatPolicy(violation.policy);
      const file = violation.file ? `\`${violation.file}\`` : '—';
      const line = violation.line ?? '—';

      return `| ${feature} | ${baselineStatus} | ${policy} | ${file} | ${line} |`;
    })
    .join('\n');
}

function createLearnMoreSection(violations: PolicyViolation[]): string {
  const links = new Map<string, string>();

  for (const violation of violations) {
    const property = violation.property;
    if (links.has(property)) {
      continue;
    }

    const encodedProperty = encodeURIComponent(property);
    const url = `https://developer.mozilla.org/en-US/docs/Web/CSS/${encodedProperty}`;
    links.set(property, `- [${property}](${url})`);
  }

  return Array.from(links.values()).join('\n');
}

export function createReportMarkdown(violations: PolicyViolation[], prNumber: number): string {
  const hasFailure = violations.some((violation) => violation.policy === 'fail');
  const statusLine = hasFailure ? '❌ **Action Required**' : '⚠️ **Warning**';

  const header = `## Baseline Guardian Report — PR #${prNumber}`;
  const summary = `Status: ${statusLine}`;
  const intro = `Detected ${violations.length} compatibility issue${violations.length === 1 ? '' : 's'} aligned with your policy.`;

  const tableHeader = ['| Feature | Baseline Status | Policy | File | Line |', '| --- | --- | --- | --- | --- |'].join('\n');
  const tableRows = createTableRows(violations);
  const learnMore = createLearnMoreSection(violations);

  const sections = [
    header,
    '',
    summary,
    intro,
    '',
    tableHeader,
    tableRows,
    '',
    '### Learn More & Fix',
    '',
    learnMore
  ];

  return sections.filter(Boolean).join('\n');
}
