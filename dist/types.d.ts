import { TemplateResult } from 'lit-html';
export declare type R = TemplateResult;
export declare type Summary = Readonly<{
    passes: number;
    fails: number;
}>;
export declare type Assertion = {
    check: any;
    deepEquals: any;
} | {
    check: any;
    equals: any;
} | {
    check: () => any;
    throws: any;
};
export declare type Test = (() => Assertion) | (() => Promise<Assertion>);
export declare type TestResult = {
    kind: 'success';
} | {
    kind: 'fail';
    actual: any;
    expected: any;
} | {
    kind: 'exn';
    error: Error;
};
export declare type Suite<T> = {
    readonly [key: string]: Suite<T> | T;
};
