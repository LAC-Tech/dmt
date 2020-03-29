import { Suite, TestResult, Test } from './types';
export { combineSummaries, evaluateSuite, deepMap, isTestResult };
declare const combineSummaries: (ss: Readonly<{
    passes: number;
    fails: number;
}>[]) => Readonly<{
    passes: number;
    fails: number;
}>;
declare const isTestResult: (t: {
    kind: "success";
} | {
    kind: "fail";
    actual: any;
    expected: any;
} | {
    kind: "exn";
    error: Error;
} | Suite<TestResult>) => t is TestResult;
declare const evaluateSuite: (suite: Suite<Test>) => Promise<Suite<TestResult>>;
declare const deepMap: (suite: Suite<Test>, e: (test: Test) => Promise<TestResult>) => Promise<Suite<TestResult>>;
