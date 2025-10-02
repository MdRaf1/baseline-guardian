import { scanCss } from '../src/scanner';

describe('scanCss', () => {
  it('extracts property names with line numbers from CSS', () => {
    const css = `/* A test comment */
.card {
  color: red;
  view-transition-name: card-1; /* A modern property */
}
body { text-wrap: balance; }
`;

    const result = scanCss(css);

    expect(result).toEqual([
      { property: 'color', line: 3 },
      { property: 'view-transition-name', line: 4 },
      { property: 'text-wrap', line: 6 }
    ]);
  });

  it('ignores declarations without line information', () => {
    const css = '/* comment */';
    const result = scanCss(css);
    expect(result).toEqual([]);
  });
});
