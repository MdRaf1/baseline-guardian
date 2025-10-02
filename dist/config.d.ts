export type PolicyValue = 'fail' | 'warn' | 'ignore';
export interface Policy {
    policy: Record<string, PolicyValue>;
}
export declare function loadPolicy(): Policy;
