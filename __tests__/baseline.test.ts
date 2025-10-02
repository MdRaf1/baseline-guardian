import { getBaselineStatus } from '../src/baseline';

describe('getBaselineStatus with web-features', () => {
  it("should return 'widely available' for 'color'", () => {
    expect(getBaselineStatus('color')).toBe('widely available');
  });

  it("should return 'widely available' for 'grid-template-columns'", () => {
    expect(getBaselineStatus('grid-template-columns')).toBe('widely available');
  });

  it("should return 'newly available' for 'text-wrap'", () => {
    expect(getBaselineStatus('text-wrap')).toBe('newly available');
  });

  it("should return 'limited availability' for 'view-transition-name'", () => {
    expect(getBaselineStatus('view-transition-name')).toBe('limited availability');
  });
  
  it("should return 'widely available' for 'offset-path'", () => {
    expect(getBaselineStatus('offset-path')).toBe('widely available');
  });

  it("should return 'unknown' for a non-existent property", () => {
    expect(getBaselineStatus('non-existent-property')).toBe('unknown');
  });
});
