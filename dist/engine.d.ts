import { FoundProperty } from './scanner';
import { Policy } from './config';
import { BaselineStatus } from './baseline';
import { PolicyValue } from './config';
export interface PolicyViolation extends FoundProperty {
    baselineStatus: BaselineStatus;
    policy: Extract<PolicyValue, 'fail' | 'warn'>;
}
export declare function runPolicyEngine(properties: FoundProperty[], policy: Policy): PolicyViolation[];
