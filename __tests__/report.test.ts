import { createReportMarkdown } from '../src/report';
import type { PolicyViolation } from '../src/engine';

describe('createReportMarkdown', () => {
  const baseViolations: PolicyViolation[] = [
    {
      property: 'view-transition-name',
      line: 10,
      file: 'styles/card.css',
      baselineStatus: 'newly available',
      policy: 'fail'
    },
    {
      property: 'text-wrap',
      line: 20,
      file: 'styles/base.css',
      baselineStatus: 'limited availability',
      policy: 'warn'
    }
  ];

  it('renders an action-required report when failures are present', () => {
    const markdown = createReportMarkdown(baseViolations, 42);

    expect(markdown).toContain('## Baseline Guardian Report — PR #42');
    expect(markdown).toContain('Status: ❌ **Action Required**');
    expect(markdown).toContain('| `view-transition-name` | Newly Available | Fail | `styles/card.css` | 10 |');
    expect(markdown).toContain('| `text-wrap` | Limited Availability | Warn | `styles/base.css` | 20 |');
    expect(markdown).toContain('### Learn More & Fix');
    expect(markdown).toContain('- [view-transition-name](https://developer.mozilla.org/en-US/docs/Web/CSS/view-transition-name)');
    expect(markdown).toContain('- [text-wrap](https://developer.mozilla.org/en-US/docs/Web/CSS/text-wrap)');
  });

  it('renders a warning report when only warnings are present', () => {
    const warningViolations: PolicyViolation[] = baseViolations.map((violation) => ({
      ...violation,
      policy: 'warn'
    }));

    const markdown = createReportMarkdown(warningViolations, 99);

    expect(markdown).toContain('Status: ⚠️ **Warning**');
    expect(markdown).not.toContain('Status: ❌ **Action Required**');
  });
});
