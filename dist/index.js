"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var lit_html_1 = require("lit-html");
var core_1 = require("./core");
exports.evaluateSuite = core_1.evaluateSuite;
var view = require("./views");
var run = function (elem, _a) {
    var client = _a.client, server = _a.server;
    return __awaiter(void 0, void 0, void 0, function () {
        var suite, _b, _c, views, summary, fails;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _b = {
                        server: server || {}
                    };
                    return [4 /*yield*/, core_1.evaluateSuite(client || {})];
                case 1:
                    suite = (_b.client = _d.sent(),
                        _b);
                    return [4 /*yield*/, render(name, suite, 0)];
                case 2:
                    _c = _d.sent(), views = _c.views, summary = _c.summary;
                    fails = summary.fails;
                    document.title = "tests " + (fails == 0 ? '✓' : "\u2716" + fails);
                    lit_html_1.render(view.root(views), elem);
                    return [2 /*return*/];
            }
        });
    });
};
exports.run = run;
var render = function (name, suite, depth) { return __awaiter(void 0, void 0, void 0, function () {
    var success, summary_1, asyncChildren, children, views, summary;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (core_1.isTestResult(suite)) {
                    success = suite.kind === 'success';
                    summary_1 = success ? { passes: 1, fails: 0 } : { passes: 0, fails: 1 };
                    return [2 /*return*/, { summary: summary_1, views: view.testResult(name, suite) }];
                }
                asyncChildren = Object
                    .entries(suite)
                    .map(function (_a) {
                    var subName = _a[0], subSuite = _a[1];
                    return __awaiter(void 0, void 0, void 0, function () {
                        var _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    _b = [{ name: subName, depth: depth + 1, suite: subSuite }];
                                    return [4 /*yield*/, render(subName, subSuite, depth + 1)];
                                case 1: return [2 /*return*/, (__assign.apply(void 0, _b.concat([_c.sent()])))];
                            }
                        });
                    });
                });
                return [4 /*yield*/, Promise.all(asyncChildren)];
            case 1:
                children = _a.sent();
                views = children.flatMap(function (n) {
                    if (core_1.isTestResult(n.suite))
                        return view.testResult(n.name, n.suite);
                    else
                        return view.node(n);
                });
                summary = core_1.combineSummaries(children.map(function (c) { return c.summary; }));
                return [2 /*return*/, { views: views, summary: summary }];
        }
    });
}); };
