import { getChangedCssFiles, postPrComment } from '../src/github';

describe('getChangedCssFiles', () => {
  const pullRequest = {
    number: 42,
    base: {
      repo: {
        name: 'baseline-guardian',
        owner: { login: 'octo-org' }
      }
    }
  };

  it('returns only CSS files that are not removed', async () => {
    const files = [
      { filename: 'styles/main.css', status: 'modified' },
      { filename: 'styles/theme.CSS', status: 'added' },
      { filename: 'docs/readme.md', status: 'modified' },
      { filename: 'old.css', status: 'removed' }
    ];

    const paginate = jest.fn().mockResolvedValue(files);

    const client = {
      rest: {
        pulls: {
          listFiles: jest.fn()
        }
      },
      paginate
    } as unknown as Parameters<typeof getChangedCssFiles>[0];

    const result = await getChangedCssFiles(client, pullRequest);

    expect(paginate).toHaveBeenCalled();
    expect(result).toEqual(['styles/main.css', 'styles/theme.CSS']);
  });

  it('throws when pull request context is missing', async () => {
    const client = {
      rest: {
        pulls: {
          listFiles: jest.fn()
        }
      },
      paginate: jest.fn()
    } as unknown as Parameters<typeof getChangedCssFiles>[0];

    await expect(getChangedCssFiles(client, undefined)).rejects.toThrow(
      'Pull request context is required to fetch changed files.'
    );
  });
});

describe('postPrComment', () => {
  it('creates a comment on the pull request issue', async () => {
    const createComment = jest.fn();

    const client = {
      rest: {
        issues: {
          createComment
        }
      }
    } as unknown as Parameters<typeof postPrComment>[0];

    const context = {
      issue: { number: 77 },
      payload: {},
      repo: { owner: 'octo-org', repo: 'baseline-guardian' }
    } as unknown as Parameters<typeof postPrComment>[1];

    await postPrComment(client, context, 'Markdown body');

    expect(createComment).toHaveBeenCalledWith({
      owner: 'octo-org',
      repo: 'baseline-guardian',
      issue_number: 77,
      body: 'Markdown body'
    });
  });

  it('throws when no pull request number is available', async () => {
    const client = {
      rest: {
        issues: {
          createComment: jest.fn()
        }
      }
    } as unknown as Parameters<typeof postPrComment>[0];

    const context = {
      issue: { number: undefined },
      payload: {},
      repo: { owner: 'octo-org', repo: 'baseline-guardian' }
    } as unknown as Parameters<typeof postPrComment>[1];

    await expect(postPrComment(client, context, 'body')).rejects.toThrow(
      'Unable to determine pull request number for commenting.'
    );
  });
});
