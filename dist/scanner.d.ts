export interface FoundProperty {
    property: string;
    line: number;
    file?: string;
}
export declare function scanCss(cssContent: string): FoundProperty[];
