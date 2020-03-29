import { TemplateResult } from 'lit-html';
import { TestResult } from './types';
export { node, testResult, root };
declare const testResult: (description: string, result: TestResult) => TemplateResult[];
declare const node: ({ name, summary, depth, views }: {
    name: string;
    summary: Readonly<{
        passes: number;
        fails: number;
    }>;
    depth: number;
    views: TemplateResult[];
}) => TemplateResult;
declare const root: (views: TemplateResult[]) => TemplateResult;
