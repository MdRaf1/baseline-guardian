export type BaselineStatus = 'widely available' | 'newly available' | 'limited availability' | 'unknown';
export declare function getBaselineStatus(property: string): BaselineStatus;
