import { TemplateResult } from 'lit-html';
import { Count, HtmlTemplate, TestResult } from './types';
export { node, testResult, root };
declare const testResult: (description: string, result: TestResult) => TemplateResult[];
declare const node: ({ name, count, indent, views }: {
    name: string;
    count: Count;
    indent: number;
    views: HtmlTemplate[];
}) => TemplateResult;
declare const root: (views: TemplateResult[]) => TemplateResult;
