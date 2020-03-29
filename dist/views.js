"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
exports.__esModule = true;
var lit_html_1 = require("lit-html");
var diffJson = require('diff').diffJson;
var successResult = function (description) {
    return testOutput([success('✓'), description]);
};
var failResult = function (description, error) { return ([
    [fail('✖'), description],
    ["error: '" + error + "'"]
].map(testOutput)); };
var success = function (text) { return lit_html_1.html(templateObject_1 || (templateObject_1 = __makeTemplateObject(["<span class=\"success\">", "</span>"], ["<span class=\"success\">", "</span>"])), text); };
var fail = function (text) { return lit_html_1.html(templateObject_2 || (templateObject_2 = __makeTemplateObject(["<span class=\"fail\">", "</span>"], ["<span class=\"fail\">", "</span>"])), text); };
var testOutput = function (templates) { return lit_html_1.html(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n\t<div class=\"result\"><pre>", "</pre></div>"], ["\n\t<div class=\"result\"><pre>", "</pre></div>"])), templates); };
var text = function (type, str, n) {
    if (n == 0)
        return lit_html_1.html(templateObject_4 || (templateObject_4 = __makeTemplateObject([""], [""])));
    return lit_html_1.html(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n\t\t<span class=", ">\n\t\t\t", "<small><sub>", "</sub></small>\n\t\t</span>"], ["\n\t\t<span class=", ">\n\t\t\t", "<small><sub>", "</sub></small>\n\t\t</span>"])), type, str, n);
};
var testResult = function (description, result) {
    switch (result.kind) {
        case 'success': return [successResult(description)];
        case 'fail': return ([
            diff(description, diffJson(result.actual, result.expected))
        ]);
        case 'exn': {
            console.error(result);
            return failResult(description, result.error);
        }
    }
};
exports.testResult = testResult;
var node = function (_a) {
    var name = _a.name, summary = _a.summary, depth = _a.depth, views = _a.views;
    var passes = summary.passes, fails = summary.fails;
    return lit_html_1.html(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n\t\t<details ?open=", ">\n\t\t\t<summary class=", ">\n\t\t\t\t<b>", "</b>\n\t\t\t\t", "\n\t\t\t\t", "\n\t\t\t</summary>\n\t\t\t", "\n\t\t</details>"], ["\n\t\t<details ?open=", ">\n\t\t\t<summary class=", ">\n\t\t\t\t<b>", "</b>\n\t\t\t\t", "\n\t\t\t\t", "\n\t\t\t</summary>\n\t\t\t", "\n\t\t</details>"])), fails != 0, "h" + depth, name, text('success', '✓', passes), text('fail', '✖', fails), views);
};
exports.node = node;
var diff = function (description, lines) {
    var diffLines = lines.map(function (_a) {
        var added = _a.added, removed = _a.removed, value = _a.value;
        if (added)
            return success(value);
        if (removed)
            return fail(value);
        else
            return value;
    });
    return lit_html_1.html(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n\t\t<div class=\"result\">\n\t\t\t<pre>", "", "</pre>\t\t\t\n\t\t\t<pre class='diff'>", "</pre>\n\t\t</div>"], ["\n\t\t<div class=\"result\">\n\t\t\t<pre>", "", "</pre>\t\t\t\n\t\t\t<pre class='diff'>", "</pre>\n\t\t</div>"])), fail('✖'), description, diffLines);
};
var root = function (views) { return lit_html_1.html(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n\t<style>\n\t.h1 {\n\t\tfont-size: larger;\n\t\tmargin-bottom: 0.5em;\t\n\t}\n\n\t.h2 {\n\t\tmargin-left: 0.5em;\n\t}\n\n\t.h3 {\n\t\tmargin-left: 1em;\n\t}\n\n\t.h4 {\n\t\tmargin-left: 1.5em;\n\t}\n\n\t.h5 {\n\t\tmargin-left: 2em\n\t}\n\n\t.h6 {\n\t\tmargin-left: 2.5em;\n\t}\n\n\t.h7 {\n\t\tmargin-left: 3em;\n\t}\n\n\thtml {\n\t\tcolor: whitesmoke;\n\t\tbackground: #000007;\n\t\tfont-family: \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n\t}\n\n\tdetails summary {\n\t\tfont-size: smaller;\n\t\tletter-spacing: 0.075em;\n\t}\n\n\t@media (min-width:960px) {\n\t\thtml {\n\t\t\tfont-size: x-large;\n\t\t}\n\t}\n\n\t.success {\t\n\t\tcolor: #5fff5f;\n\t}\n\n\t.fail {\n\t\tcolor: #ff5f5f;\n\t}\n\n\t.success, .fail {\n\t\tpadding-right: 0.125rem;\n\t}\n\n\t.diff {\n\t\tfont-size: smaller;\n\t}\n\n\t.result {\n\t\tfont-family: monospace;\n\t\tmargin-left: 2em;\n\t}\n\n\tpre {\n\t\tmargin: 0;\n\t}\n\t</style>\n\t<div>", "</div>"], ["\n\t<style>\n\t.h1 {\n\t\tfont-size: larger;\n\t\tmargin-bottom: 0.5em;\t\n\t}\n\n\t.h2 {\n\t\tmargin-left: 0.5em;\n\t}\n\n\t.h3 {\n\t\tmargin-left: 1em;\n\t}\n\n\t.h4 {\n\t\tmargin-left: 1.5em;\n\t}\n\n\t.h5 {\n\t\tmargin-left: 2em\n\t}\n\n\t.h6 {\n\t\tmargin-left: 2.5em;\n\t}\n\n\t.h7 {\n\t\tmargin-left: 3em;\n\t}\n\n\thtml {\n\t\tcolor: whitesmoke;\n\t\tbackground: #000007;\n\t\tfont-family: \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n\t}\n\n\tdetails summary {\n\t\tfont-size: smaller;\n\t\tletter-spacing: 0.075em;\n\t}\n\n\t@media (min-width:960px) {\n\t\thtml {\n\t\t\tfont-size: x-large;\n\t\t}\n\t}\n\n\t.success {\t\n\t\tcolor: #5fff5f;\n\t}\n\n\t.fail {\n\t\tcolor: #ff5f5f;\n\t}\n\n\t.success, .fail {\n\t\tpadding-right: 0.125rem;\n\t}\n\n\t.diff {\n\t\tfont-size: smaller;\n\t}\n\n\t.result {\n\t\tfont-family: monospace;\n\t\tmargin-left: 2em;\n\t}\n\n\tpre {\n\t\tmargin: 0;\n\t}\n\t</style>\n\t<div>", "</div>"])), views); };
exports.root = root;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8;
