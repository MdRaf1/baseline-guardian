import { FoundProperty } from './scanner';
import { Policy } from './config';
import { BaselineStatus, getBaselineStatus } from './baseline';
import { PolicyValue } from './config';

export interface PolicyViolation extends FoundProperty {
  baselineStatus: BaselineStatus;
  policy: Extract<PolicyValue, 'fail' | 'warn'>;
}

const STATUS_TO_POLICY_KEY: Record<BaselineStatus, string | null> = {
  'widely available': null,
  'newly available': 'newly_available',
  'limited availability': 'limited_availability',
  unknown: null
};

export function runPolicyEngine(properties: FoundProperty[], policy: Policy): PolicyViolation[] {
  const violations: PolicyViolation[] = [];
  const policyRules = policy.policy ?? {};

  for (const found of properties) {
    const baselineStatus = getBaselineStatus(found.property);
    const policyKey = STATUS_TO_POLICY_KEY[baselineStatus];

    if (!policyKey) {
      continue;
    }

    const action = policyRules[policyKey];

    if (action !== 'fail' && action !== 'warn') {
      continue;
    }

    violations.push({
      ...found,
      baselineStatus,
      policy: action
    });
  }

  return violations;
}
