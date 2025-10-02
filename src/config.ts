import { existsSync, readFileSync } from 'fs';
import * as path from 'path';
import { load } from 'js-yaml';

export type PolicyValue = 'fail' | 'warn' | 'ignore';

export interface Policy {
  policy: Record<string, PolicyValue>;
}

const CONFIG_FILENAME = '.baseline-guardian.yml';
const VALID_POLICY_VALUES: ReadonlySet<PolicyValue> = new Set(['fail', 'warn', 'ignore']);

function ensureWorkspace(): string {
  return process.env.GITHUB_WORKSPACE ?? process.cwd();
}

function validatePolicyValues(policy: unknown): Record<string, PolicyValue> {
  if (!policy || typeof policy !== 'object') {
    throw new Error('Configuration must define a "policy" object.');
  }

  const validatedPolicy: Record<string, PolicyValue> = {};

  for (const [rule, value] of Object.entries(policy as Record<string, unknown>)) {
    if (typeof value !== 'string' || !VALID_POLICY_VALUES.has(value as PolicyValue)) {
      throw new Error(`Invalid policy value: ${String(value)}. Must be one of 'fail', 'warn', or 'ignore'.`);
    }
    validatedPolicy[rule] = value as PolicyValue;
  }

  return validatedPolicy;
}

export function loadPolicy(): Policy {
  const workspace = ensureWorkspace();
  const configPath = path.join(workspace, CONFIG_FILENAME);

  if (!existsSync(configPath)) {
    throw new Error('Configuration file .baseline-guardian.yml not found.');
  }

  const fileContents = readFileSync(configPath, 'utf8');
  let parsed: unknown;

  try {
    parsed = load(fileContents);
  } catch (error) {
    throw error instanceof Error ? error : new Error('Failed to parse configuration file.');
  }

  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Configuration file is empty or invalid.');
  }

  const config = parsed as { policy?: unknown };

  if (!('policy' in config)) {
    throw new Error('Configuration must contain a "policy" section.');
  }

  const policy = validatePolicyValues(config.policy);

  return { policy };
}
