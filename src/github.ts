import type { Context } from '@actions/github/lib/context';
import type { GitHub } from '@actions/github/lib/utils';
import type { RestEndpointMethodTypes } from '@octokit/plugin-rest-endpoint-methods';

type Octokit = InstanceType<typeof GitHub>;

export type PullRequestContext = {
  number: number;
  base: {
    repo: {
      name: string;
      owner: {
        login: string;
      };
    };
  };
};

type PullsListFilesParameters = RestEndpointMethodTypes['pulls']['listFiles']['parameters'];

type PullRequestFile = RestEndpointMethodTypes['pulls']['listFiles']['response']['data'][number];

const CSS_EXTENSION = '.css';

function assertPullRequestContext(pullRequest: PullRequestContext | undefined): asserts pullRequest is PullRequestContext {
  if (!pullRequest) {
    throw new Error('Pull request context is required to fetch changed files.');
  }

  if (!pullRequest.base?.repo?.owner?.login || !pullRequest.base.repo.name || !pullRequest.number) {
    throw new Error('Pull request context is missing required repository information.');
  }
}

function buildListFilesParams(pullRequest: PullRequestContext): PullsListFilesParameters {
  return {
    owner: pullRequest.base.repo.owner.login,
    repo: pullRequest.base.repo.name,
    pull_number: pullRequest.number,
    per_page: 100
  };
}

function isCssFile(file: PullRequestFile): boolean {
  return (
    file.status !== 'removed' &&
    typeof file.filename === 'string' &&
    file.filename.toLowerCase().endsWith(CSS_EXTENSION)
  );
}

export async function getChangedCssFiles(client: Octokit, pullRequest: PullRequestContext | undefined): Promise<string[]> {
  assertPullRequestContext(pullRequest);

  const params = buildListFilesParams(pullRequest);

  const files = await client.paginate(client.rest.pulls.listFiles, params as PullsListFilesParameters);

  return files
    .filter(isCssFile)
    .map((file: PullRequestFile) => file.filename);
}

export async function postPrComment(client: Octokit, context: Context, body: string): Promise<void> {
  const issueNumber = context.issue?.number ?? context.payload.pull_request?.number;

  if (!issueNumber) {
    throw new Error('Unable to determine pull request number for commenting.');
  }

  const { owner, repo } = context.repo;

  await client.rest.issues.createComment({
    owner,
    repo,
    issue_number: issueNumber,
    body
  });
}
