import type { Context } from '@actions/github/lib/context';
import type { GitHub } from '@actions/github/lib/utils';
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
export declare function getChangedCssFiles(client: Octokit, pullRequest: PullRequestContext | undefined): Promise<string[]>;
export declare function postPrComment(client: Octokit, context: Context, body: string): Promise<void>;
export {};
