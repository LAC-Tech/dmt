import { TemplateResult } from 'lit-html';
import { Count, R, TestResult } from './types';
export { node, testResult, root };
declare const testResult: (description: string, result: TestResult) => TemplateResult[];
declare const node: ({ name, count, depth, views }: {
    name: string;
    count: Count;
    depth: number;
    views: R[];
}) => TemplateResult;
declare const root: (views: TemplateResult[]) => TemplateResult;
