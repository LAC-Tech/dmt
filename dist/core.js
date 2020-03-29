"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var deepEql = require('deep-eql');
var combineSummaries = function (ss) { return ss.reduce(function (x, y) { return ({
    passes: x.passes + y.passes,
    fails: x.fails + y.fails
}); }, { passes: 0, fails: 0 }); };
exports.combineSummaries = combineSummaries;
var equalFromBinaryPredicate = function (equal) { return function (actual, expected) {
    if (!equal(actual, expected))
        return { kind: 'fail', actual: actual, expected: expected };
    return { kind: 'success' };
}; };
var deepEqual = equalFromBinaryPredicate(deepEql);
var equal = equalFromBinaryPredicate(function (a, b) { return a === b; });
var isTest = function (t) { return typeof t === "function"; };
var isTestResult = function (t) {
    if (t.kind === 'exn')
        return 'error' in t;
    if (t.kind === 'fail')
        return 'actual' in t && 'expected' in t;
    if (t.kind === 'success')
        return true;
    return false;
};
exports.isTestResult = isTestResult;
var evaluateTest = function (test) { return __awaiter(void 0, void 0, void 0, function () {
    var calledTest, check, result, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Promise.resolve(test())];
            case 1:
                calledTest = _a.sent();
                check = calledTest.check;
                result = 'deepEquals' in calledTest ?
                    deepEqual(check, calledTest.deepEquals) :
                    equal(check, calledTest.equals);
                return [2 /*return*/, result];
            case 2:
                error_1 = _a.sent();
                return [2 /*return*/, { kind: 'exn', error: error_1 }];
            case 3: return [2 /*return*/];
        }
    });
}); };
var evaluateSuite = function (suite) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, deepMap(suite, evaluateTest)];
}); }); };
exports.evaluateSuite = evaluateSuite;
var deepMap = function (suite, e) { return __awaiter(void 0, void 0, void 0, function () {
    var result, _i, _a, description, v, newVal, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                result = {};
                _i = 0, _a = Object.keys(suite);
                _d.label = 1;
            case 1:
                if (!(_i < _a.length)) return [3 /*break*/, 4];
                description = _a[_i];
                v = suite[description];
                newVal = isTest(v) ? e(v) : deepMap(v, e);
                _b = result;
                _c = description;
                return [4 /*yield*/, newVal];
            case 2:
                _b[_c] = _d.sent();
                _d.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4: return [2 /*return*/, result];
        }
    });
}); };
exports.deepMap = deepMap;
