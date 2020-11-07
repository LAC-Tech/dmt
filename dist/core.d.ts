import { Suite, TestResult, Count, Test } from './types';
export { sumCounts, evaluateSuite, deepMap, isTestResult };
declare const sumCounts: (cs: Count[]) => Readonly<{
    passes: number;
    fails: number;
}>;
declare const isTestResult: (t: TestResult | Suite<TestResult>) => t is TestResult;
declare const evaluateTest: (test: Test) => Promise<TestResult>;
declare const evaluateSuite: (suite: Suite<Test>) => Promise<Suite<TestResult>>;
declare const deepMap: (suite: Suite<Test>, e: (typeof evaluateTest)) => Promise<Suite<TestResult>>;
