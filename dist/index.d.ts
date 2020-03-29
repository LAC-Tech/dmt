import { Suite, TestResult, Test } from './types';
import { evaluateSuite } from './core';
export { run, evaluateSuite, Suite, Test, TestResult };
declare const run: (elem: HTMLElement, { client, server }: Partial<{
    client: Suite<Test>;
    server: Suite<TestResult>;
}>) => Promise<void>;
