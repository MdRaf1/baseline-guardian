import { promises as fs } from 'fs';
import * as path from 'path';
import * as core from '@actions/core';
import * as github from '@actions/github';
import { loadPolicy } from './config';
import { getChangedCssFiles, postPrComment, PullRequestContext } from './github';
import { scanCss, FoundProperty } from './scanner';
import { runPolicyEngine } from './engine';
import { createReportMarkdown } from './report';

async function run(): Promise<void> {
  try {
    const token = core.getInput('token', { required: true });
    const { context } = github;
    const pullRequest = context.payload.pull_request as PullRequestContext | undefined;

    if (!pullRequest) {
      throw new Error('This action must be run in the context of a pull_request event.');
    }

    const client = github.getOctokit(token);

    const policy = loadPolicy();

    const cssFiles = await getChangedCssFiles(client, pullRequest);
    const workspace = process.env.GITHUB_WORKSPACE ?? process.cwd();

    const allProperties: FoundProperty[] = [];

    for (const filePath of cssFiles) {
      const absolutePath = path.join(workspace, filePath);

      try {
        const fileContents = await fs.readFile(absolutePath, 'utf8');
        const properties = scanCss(fileContents).map((property) => ({
          ...property,
          file: filePath
        }));
        allProperties.push(...properties);
      } catch (fileError) {
        const message = fileError instanceof Error ? fileError.message : 'Unknown error';
        core.warning(`Failed to process ${filePath}: ${message}`);
      }
    }

    const violations = runPolicyEngine(allProperties, policy);

    if (violations.length === 0) {
      console.log('Baseline Guardian: no policy violations detected.');
      return;
    }

    const report = createReportMarkdown(violations, pullRequest.number);
    await postPrComment(client, context, report);
    console.log('Baseline Guardian: posted policy report to pull request.');

    if (violations.some((violation) => violation.policy === 'fail')) {
      core.setFailed(
        "This PR introduces web features that do not meet the team's configured compatibility policy."
      );
    }
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    } else {
      core.setFailed('An unknown error occurred.');
    }
  }
}

void run();
