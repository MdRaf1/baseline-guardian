import * as fs from 'fs';
import { loadPolicy } from '../src/config';

jest.mock('fs', () => ({
  readFileSync: jest.fn(),
  existsSync: jest.fn()
}));

const mockedFs = fs as jest.Mocked<typeof fs>;

describe('loadPolicy', () => {
  const ORIGINAL_ENV = process.env;
  const workspacePath = '/tmp/repo';

  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV, GITHUB_WORKSPACE: workspacePath };
    jest.clearAllMocks();
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  it('loads a valid policy file successfully', () => {
    const yaml = `policy:\n  newly_available: fail\n  deprecated: warn\n`;
    mockedFs.existsSync.mockReturnValue(true);
  mockedFs.readFileSync.mockReturnValue(yaml);

    const result = loadPolicy();

    expect(result).toEqual({
      policy: {
        newly_available: 'fail',
        deprecated: 'warn'
      }
    });
  });

  it('throws when the configuration file is missing', () => {
    mockedFs.existsSync.mockReturnValue(false);

    expect(() => loadPolicy()).toThrowError(
      'Configuration file .baseline-guardian.yml not found.'
    );
  });

  it('throws when the YAML is malformed', () => {
    mockedFs.existsSync.mockReturnValue(true);
  mockedFs.readFileSync.mockReturnValue('policy: :invalid');

    expect(() => loadPolicy()).toThrow();
  });

  it('throws when a policy value is invalid', () => {
    const yaml = `policy:\n  newly_available: error\n`;
    mockedFs.existsSync.mockReturnValue(true);
  mockedFs.readFileSync.mockReturnValue(yaml);

    expect(() => loadPolicy()).toThrowError(
      "Invalid policy value: error. Must be one of 'fail', 'warn', or 'ignore'."
    );
  });
});
