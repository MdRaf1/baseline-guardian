import { runPolicyEngine } from '../src/engine';
import type { Policy } from '../src/config';
import type { FoundProperty } from '../src/scanner';
import { getBaselineStatus } from '../src/baseline';

jest.mock('../src/baseline', () => ({
  getBaselineStatus: jest.fn()
}));

const mockedGetBaselineStatus = getBaselineStatus as jest.MockedFunction<typeof getBaselineStatus>;

describe('runPolicyEngine', () => {
  beforeEach(() => {
    mockedGetBaselineStatus.mockReset();
  });

  it('returns violations that align with the configured policy', () => {
    const policy: Policy = {
      policy: {
        newly_available: 'fail',
        limited_availability: 'warn'
      }
    };

    const properties: FoundProperty[] = [
      { property: 'view-transition-name', line: 1 },
      { property: 'text-wrap', line: 2 },
      { property: 'color', line: 3 }
    ];

    mockedGetBaselineStatus.mockImplementation((propertyName: string) => {
      switch (propertyName) {
        case 'view-transition-name':
          return 'newly available';
        case 'text-wrap':
          return 'limited availability';
        case 'color':
          return 'widely available';
        default:
          return 'unknown';
      }
    });

    const result = runPolicyEngine(properties, policy);

    expect(result).toEqual([
      {
        property: 'view-transition-name',
        line: 1,
        baselineStatus: 'newly available',
        policy: 'fail'
      },
      {
        property: 'text-wrap',
        line: 2,
        baselineStatus: 'limited availability',
        policy: 'warn'
      }
    ]);

    expect(mockedGetBaselineStatus).toHaveBeenCalledTimes(3);
  });
});
