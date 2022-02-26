(() => {
  // src/browser.js
  var browser_default = ({ fails, passes, children }) => {
    const testSummary = fails == 0 ? "\u2713" : `\u2716${fails}`;
    document.title = `dmt ${testSummary}`;
    const result = document.createDocumentFragment();
    const style = document.createElement("style");
    style.textContent = `
			html {
				color: whitesmoke;
				background: #000007;
				font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
			}

			/* ensures nested test results are indented */
			details, .description, .success, .fail {
				padding-left: 0.5em;
			}

			.description {
				font-style: italic;
			}

			details summary {
				letter-spacing: 0.075em;
			}

			@media (min-width:960px) {
				html {
					font-size: x-large;
				}
			}

			.success {	
				color: #3fff3f;
			}

			.fail {
				color: #ff3f3f;
			}

			.diff {
				font-size: small;
			}

			.result {
				padding-top: 2px;
			}

			pre {
				font-family: monospace;
				margin: 0;
				padding-left: 1em;
			}
	`;
    result.append(style);
    for (const [k, v] of Object.entries(children))
      result.appendChild(testResultsChild(k, v));
    return result;
  };
  var h = (tagName, attributes, children = []) => {
    const result = document.createElement(tagName);
    Object.assign(result, attributes);
    if (Array.isArray(children)) {
      result.append(...children);
    } else {
      result.append(children);
    }
    return result;
  };
  var success = (innerText) => h("span", { innerText, className: "success" });
  var fail = (innerText) => h("span", { innerText, className: "fail" });
  var text = (type2, s, n) => {
    if (n == 0)
      return "";
    return h("span", { className: type2 }, [
      s,
      h("small", {}, h("sub", {}, n.toString()))
    ]);
  };
  var description = (descr, suffix) => h("span", { className: "description" }, [descr, suffix]);
  var testFail = (descr, { reason }) => {
    switch (reason.kind) {
      case "not-equal": {
        const diffLines = reason.changes.map(({ kind, value }) => {
          switch (kind) {
            case "expected":
              return fail(value);
            case "actual":
              return success(value);
            case "same":
              return value;
          }
        });
        return h("div", { className: "result" }, [
          description(descr, fail("\u2716")),
          h("pre", { className: "diff" }, diffLines)
        ]);
      }
      case "threw-exn": {
        return fail(reason.error);
      }
    }
  };
  var testPass = (descr) => h("div", { className: "result" }, h("span", {}, description(descr, success("\u2713"))));
  var testResult = (tr) => (descr) => {
    switch (tr.kind) {
      case "pass":
        return testPass(descr);
      case "fail":
        return testFail(descr, tr);
    }
  };
  var testResultsChild = (descr, v) => ("kind" in v ? testResult(v) : testResults(v))(descr);
  var testResults = ({ fails, passes, children }) => (descr) => {
    const childElements = Object.entries(children).map((child) => testResultsChild(...child));
    return h("details", { open: fails != 0 }, [
      h("summary", {}, [
        h("b", {}, descr),
        text("success", "\u2713", passes),
        text("fail", "\u2716", fails)
      ]),
      ...childElements
    ]);
  };

  // node_modules/diff/lib/index.mjs
  function Diff() {
  }
  Diff.prototype = {
    diff: function diff(oldString, newString) {
      var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      var callback = options.callback;
      if (typeof options === "function") {
        callback = options;
        options = {};
      }
      this.options = options;
      var self = this;
      function done(value) {
        if (callback) {
          setTimeout(function() {
            callback(void 0, value);
          }, 0);
          return true;
        } else {
          return value;
        }
      }
      oldString = this.castInput(oldString);
      newString = this.castInput(newString);
      oldString = this.removeEmpty(this.tokenize(oldString));
      newString = this.removeEmpty(this.tokenize(newString));
      var newLen = newString.length, oldLen = oldString.length;
      var editLength = 1;
      var maxEditLength = newLen + oldLen;
      var bestPath = [{
        newPos: -1,
        components: []
      }];
      var oldPos = this.extractCommon(bestPath[0], newString, oldString, 0);
      if (bestPath[0].newPos + 1 >= newLen && oldPos + 1 >= oldLen) {
        return done([{
          value: this.join(newString),
          count: newString.length
        }]);
      }
      function execEditLength() {
        for (var diagonalPath = -1 * editLength; diagonalPath <= editLength; diagonalPath += 2) {
          var basePath = void 0;
          var addPath = bestPath[diagonalPath - 1], removePath = bestPath[diagonalPath + 1], _oldPos = (removePath ? removePath.newPos : 0) - diagonalPath;
          if (addPath) {
            bestPath[diagonalPath - 1] = void 0;
          }
          var canAdd = addPath && addPath.newPos + 1 < newLen, canRemove = removePath && 0 <= _oldPos && _oldPos < oldLen;
          if (!canAdd && !canRemove) {
            bestPath[diagonalPath] = void 0;
            continue;
          }
          if (!canAdd || canRemove && addPath.newPos < removePath.newPos) {
            basePath = clonePath(removePath);
            self.pushComponent(basePath.components, void 0, true);
          } else {
            basePath = addPath;
            basePath.newPos++;
            self.pushComponent(basePath.components, true, void 0);
          }
          _oldPos = self.extractCommon(basePath, newString, oldString, diagonalPath);
          if (basePath.newPos + 1 >= newLen && _oldPos + 1 >= oldLen) {
            return done(buildValues(self, basePath.components, newString, oldString, self.useLongestToken));
          } else {
            bestPath[diagonalPath] = basePath;
          }
        }
        editLength++;
      }
      if (callback) {
        (function exec() {
          setTimeout(function() {
            if (editLength > maxEditLength) {
              return callback();
            }
            if (!execEditLength()) {
              exec();
            }
          }, 0);
        })();
      } else {
        while (editLength <= maxEditLength) {
          var ret = execEditLength();
          if (ret) {
            return ret;
          }
        }
      }
    },
    pushComponent: function pushComponent(components, added, removed) {
      var last = components[components.length - 1];
      if (last && last.added === added && last.removed === removed) {
        components[components.length - 1] = {
          count: last.count + 1,
          added,
          removed
        };
      } else {
        components.push({
          count: 1,
          added,
          removed
        });
      }
    },
    extractCommon: function extractCommon(basePath, newString, oldString, diagonalPath) {
      var newLen = newString.length, oldLen = oldString.length, newPos = basePath.newPos, oldPos = newPos - diagonalPath, commonCount = 0;
      while (newPos + 1 < newLen && oldPos + 1 < oldLen && this.equals(newString[newPos + 1], oldString[oldPos + 1])) {
        newPos++;
        oldPos++;
        commonCount++;
      }
      if (commonCount) {
        basePath.components.push({
          count: commonCount
        });
      }
      basePath.newPos = newPos;
      return oldPos;
    },
    equals: function equals(left, right) {
      if (this.options.comparator) {
        return this.options.comparator(left, right);
      } else {
        return left === right || this.options.ignoreCase && left.toLowerCase() === right.toLowerCase();
      }
    },
    removeEmpty: function removeEmpty(array) {
      var ret = [];
      for (var i = 0; i < array.length; i++) {
        if (array[i]) {
          ret.push(array[i]);
        }
      }
      return ret;
    },
    castInput: function castInput(value) {
      return value;
    },
    tokenize: function tokenize(value) {
      return value.split("");
    },
    join: function join(chars) {
      return chars.join("");
    }
  };
  function buildValues(diff2, components, newString, oldString, useLongestToken) {
    var componentPos = 0, componentLen = components.length, newPos = 0, oldPos = 0;
    for (; componentPos < componentLen; componentPos++) {
      var component = components[componentPos];
      if (!component.removed) {
        if (!component.added && useLongestToken) {
          var value = newString.slice(newPos, newPos + component.count);
          value = value.map(function(value2, i) {
            var oldValue = oldString[oldPos + i];
            return oldValue.length > value2.length ? oldValue : value2;
          });
          component.value = diff2.join(value);
        } else {
          component.value = diff2.join(newString.slice(newPos, newPos + component.count));
        }
        newPos += component.count;
        if (!component.added) {
          oldPos += component.count;
        }
      } else {
        component.value = diff2.join(oldString.slice(oldPos, oldPos + component.count));
        oldPos += component.count;
        if (componentPos && components[componentPos - 1].added) {
          var tmp = components[componentPos - 1];
          components[componentPos - 1] = components[componentPos];
          components[componentPos] = tmp;
        }
      }
    }
    var lastComponent = components[componentLen - 1];
    if (componentLen > 1 && typeof lastComponent.value === "string" && (lastComponent.added || lastComponent.removed) && diff2.equals("", lastComponent.value)) {
      components[componentLen - 2].value += lastComponent.value;
      components.pop();
    }
    return components;
  }
  function clonePath(path2) {
    return {
      newPos: path2.newPos,
      components: path2.components.slice(0)
    };
  }
  var characterDiff = new Diff();
  var extendedWordChars = /^[A-Za-z\xC0-\u02C6\u02C8-\u02D7\u02DE-\u02FF\u1E00-\u1EFF]+$/;
  var reWhitespace = /\S/;
  var wordDiff = new Diff();
  wordDiff.equals = function(left, right) {
    if (this.options.ignoreCase) {
      left = left.toLowerCase();
      right = right.toLowerCase();
    }
    return left === right || this.options.ignoreWhitespace && !reWhitespace.test(left) && !reWhitespace.test(right);
  };
  wordDiff.tokenize = function(value) {
    var tokens = value.split(/([^\S\r\n]+|[()[\]{}'"\r\n]|\b)/);
    for (var i = 0; i < tokens.length - 1; i++) {
      if (!tokens[i + 1] && tokens[i + 2] && extendedWordChars.test(tokens[i]) && extendedWordChars.test(tokens[i + 2])) {
        tokens[i] += tokens[i + 2];
        tokens.splice(i + 1, 2);
        i--;
      }
    }
    return tokens;
  };
  var lineDiff = new Diff();
  lineDiff.tokenize = function(value) {
    var retLines = [], linesAndNewlines = value.split(/(\n|\r\n)/);
    if (!linesAndNewlines[linesAndNewlines.length - 1]) {
      linesAndNewlines.pop();
    }
    for (var i = 0; i < linesAndNewlines.length; i++) {
      var line = linesAndNewlines[i];
      if (i % 2 && !this.options.newlineIsToken) {
        retLines[retLines.length - 1] += line;
      } else {
        if (this.options.ignoreWhitespace) {
          line = line.trim();
        }
        retLines.push(line);
      }
    }
    return retLines;
  };
  var sentenceDiff = new Diff();
  sentenceDiff.tokenize = function(value) {
    return value.split(/(\S.+?[.!?])(?=\s+|$)/);
  };
  var cssDiff = new Diff();
  cssDiff.tokenize = function(value) {
    return value.split(/([{}:;,]|\s+)/);
  };
  function _typeof(obj) {
    "@babel/helpers - typeof";
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function(obj2) {
        return typeof obj2;
      };
    } else {
      _typeof = function(obj2) {
        return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
      };
    }
    return _typeof(obj);
  }
  var objectPrototypeToString = Object.prototype.toString;
  var jsonDiff = new Diff();
  jsonDiff.useLongestToken = true;
  jsonDiff.tokenize = lineDiff.tokenize;
  jsonDiff.castInput = function(value) {
    var _this$options = this.options, undefinedReplacement = _this$options.undefinedReplacement, _this$options$stringi = _this$options.stringifyReplacer, stringifyReplacer = _this$options$stringi === void 0 ? function(k, v) {
      return typeof v === "undefined" ? undefinedReplacement : v;
    } : _this$options$stringi;
    return typeof value === "string" ? value : JSON.stringify(canonicalize(value, null, null, stringifyReplacer), stringifyReplacer, "  ");
  };
  jsonDiff.equals = function(left, right) {
    return Diff.prototype.equals.call(jsonDiff, left.replace(/,([\r\n])/g, "$1"), right.replace(/,([\r\n])/g, "$1"));
  };
  function diffJson(oldObj, newObj, options) {
    return jsonDiff.diff(oldObj, newObj, options);
  }
  function canonicalize(obj, stack, replacementStack, replacer, key) {
    stack = stack || [];
    replacementStack = replacementStack || [];
    if (replacer) {
      obj = replacer(key, obj);
    }
    var i;
    for (i = 0; i < stack.length; i += 1) {
      if (stack[i] === obj) {
        return replacementStack[i];
      }
    }
    var canonicalizedObj;
    if (objectPrototypeToString.call(obj) === "[object Array]") {
      stack.push(obj);
      canonicalizedObj = new Array(obj.length);
      replacementStack.push(canonicalizedObj);
      for (i = 0; i < obj.length; i += 1) {
        canonicalizedObj[i] = canonicalize(obj[i], stack, replacementStack, replacer, key);
      }
      stack.pop();
      replacementStack.pop();
      return canonicalizedObj;
    }
    if (obj && obj.toJSON) {
      obj = obj.toJSON();
    }
    if (_typeof(obj) === "object" && obj !== null) {
      stack.push(obj);
      canonicalizedObj = {};
      replacementStack.push(canonicalizedObj);
      var sortedKeys = [], _key;
      for (_key in obj) {
        if (obj.hasOwnProperty(_key)) {
          sortedKeys.push(_key);
        }
      }
      sortedKeys.sort();
      for (i = 0; i < sortedKeys.length; i += 1) {
        _key = sortedKeys[i];
        canonicalizedObj[_key] = canonicalize(obj[_key], stack, replacementStack, replacer, _key);
      }
      stack.pop();
      replacementStack.pop();
    } else {
      canonicalizedObj = obj;
    }
    return canonicalizedObj;
  }
  var arrayDiff = new Diff();
  arrayDiff.tokenize = function(value) {
    return value.slice();
  };
  arrayDiff.join = arrayDiff.removeEmpty = function(value) {
    return value;
  };

  // node_modules/rambda/dist/rambda.mjs
  function curry(fn, args = []) {
    return (..._args) => ((rest) => rest.length >= fn.length ? fn(...rest) : curry(fn, rest))([...args, ..._args]);
  }
  var cloneList = (list) => {
    return Array.prototype.slice.call(list);
  };
  function adjustFn(index, replaceFn2, list) {
    const actualIndex = index < 0 ? list.length + index : index;
    if (index >= list.length || actualIndex < 0)
      return list;
    const clone = cloneList(list);
    clone[actualIndex] = replaceFn2(clone[actualIndex]);
    return clone;
  }
  var adjust = curry(adjustFn);
  function always(x) {
    return () => x;
  }
  var _isArray = Array.isArray;
  function assocFn(prop2, newValue, obj) {
    return Object.assign({}, obj, {
      [prop2]: newValue
    });
  }
  var assoc = curry(assocFn);
  function _isInteger(n) {
    return n << 0 === n;
  }
  var _isInteger$1 = Number.isInteger || _isInteger;
  function assocPathFn(path2, newValue, input) {
    const pathArrValue = typeof path2 === "string" ? path2.split(".").map((x) => _isInteger(Number(x)) ? Number(x) : x) : path2;
    if (pathArrValue.length === 0) {
      return newValue;
    }
    const index = pathArrValue[0];
    if (pathArrValue.length > 1) {
      const condition = typeof input !== "object" || input === null || !input.hasOwnProperty(index);
      const nextinput = condition ? _isInteger(pathArrValue[1]) ? [] : {} : input[index];
      newValue = assocPathFn(Array.prototype.slice.call(pathArrValue, 1), newValue, nextinput);
    }
    if (_isInteger(index) && _isArray(input)) {
      const arr = cloneList(input);
      arr[index] = newValue;
      return arr;
    }
    return assoc(index, newValue, input);
  }
  var assocPath = curry(assocPathFn);
  function clampFn(min, max, input) {
    if (min > max) {
      throw new Error("min must not be greater than max in clamp(min, max, value)");
    }
    if (input >= min && input <= max)
      return input;
    if (input > max)
      return max;
    if (input < min)
      return min;
  }
  var clamp = curry(clampFn);
  function reduceFn(reducer, acc, list) {
    if (!_isArray(list)) {
      throw new TypeError("reduce: list must be array or iterable");
    }
    let index = 0;
    const len = list.length;
    while (index < len) {
      acc = reducer(acc, list[index], index, list);
      index++;
    }
    return acc;
  }
  var reduce = curry(reduceFn);
  function isFalsy(input) {
    return input === void 0 || input === null || Number.isNaN(input) === true;
  }
  function defaultTo(defaultArgument, input) {
    if (arguments.length === 1) {
      return (_input) => defaultTo(defaultArgument, _input);
    }
    return isFalsy(input) ? defaultArgument : input;
  }
  function type(input) {
    if (input === null) {
      return "Null";
    } else if (input === void 0) {
      return "Undefined";
    } else if (Number.isNaN(input)) {
      return "NaN";
    }
    const typeResult = Object.prototype.toString.call(input).slice(8, -1);
    return typeResult === "AsyncFunction" ? "Async" : typeResult;
  }
  function _indexOf(valueToFind, list) {
    if (!_isArray(list)) {
      throw new Error(`Cannot read property 'indexOf' of ${list}`);
    }
    const typeOfValue = type(valueToFind);
    if (!["Object", "Array", "NaN", "RegExp"].includes(typeOfValue))
      return list.indexOf(valueToFind);
    let index = -1;
    let foundIndex = -1;
    const {
      length
    } = list;
    while (++index < length && foundIndex === -1) {
      if (equals2(list[index], valueToFind)) {
        foundIndex = index;
      }
    }
    return foundIndex;
  }
  function _arrayFromIterator(iter) {
    const list = [];
    let next;
    while (!(next = iter.next()).done) {
      list.push(next.value);
    }
    return list;
  }
  function _equalsSets(a, b) {
    if (a.size !== b.size) {
      return false;
    }
    const aList = _arrayFromIterator(a.values());
    const bList = _arrayFromIterator(b.values());
    const filtered = aList.filter((aInstance) => _indexOf(aInstance, bList) === -1);
    return filtered.length === 0;
  }
  function parseError(maybeError) {
    const typeofError = maybeError.__proto__.toString();
    if (!["Error", "TypeError"].includes(typeofError))
      return [];
    return [typeofError, maybeError.message];
  }
  function parseDate(maybeDate) {
    if (!maybeDate.toDateString)
      return [false];
    return [true, maybeDate.getTime()];
  }
  function parseRegex(maybeRegex) {
    if (maybeRegex.constructor !== RegExp)
      return [false];
    return [true, maybeRegex.toString()];
  }
  function equals2(a, b) {
    if (arguments.length === 1)
      return (_b) => equals2(a, _b);
    const aType = type(a);
    if (aType !== type(b))
      return false;
    if (aType === "Function") {
      return a.name === void 0 ? false : a.name === b.name;
    }
    if (["NaN", "Undefined", "Null"].includes(aType))
      return true;
    if (aType === "Number") {
      if (Object.is(-0, a) !== Object.is(-0, b))
        return false;
      return a.toString() === b.toString();
    }
    if (["String", "Boolean"].includes(aType)) {
      return a.toString() === b.toString();
    }
    if (aType === "Array") {
      const aClone = Array.from(a);
      const bClone = Array.from(b);
      if (aClone.toString() !== bClone.toString()) {
        return false;
      }
      let loopArrayFlag = true;
      aClone.forEach((aCloneInstance, aCloneIndex) => {
        if (loopArrayFlag) {
          if (aCloneInstance !== bClone[aCloneIndex] && !equals2(aCloneInstance, bClone[aCloneIndex])) {
            loopArrayFlag = false;
          }
        }
      });
      return loopArrayFlag;
    }
    const aRegex = parseRegex(a);
    const bRegex = parseRegex(b);
    if (aRegex[0]) {
      return bRegex[0] ? aRegex[1] === bRegex[1] : false;
    } else if (bRegex[0])
      return false;
    const aDate = parseDate(a);
    const bDate = parseDate(b);
    if (aDate[0]) {
      return bDate[0] ? aDate[1] === bDate[1] : false;
    } else if (bDate[0])
      return false;
    const aError = parseError(a);
    const bError = parseError(b);
    if (aError[0]) {
      return bError[0] ? aError[0] === bError[0] && aError[1] === bError[1] : false;
    }
    if (aType === "Set") {
      return _equalsSets(a, b);
    }
    if (aType === "Object") {
      const aKeys = Object.keys(a);
      if (aKeys.length !== Object.keys(b).length) {
        return false;
      }
      let loopObjectFlag = true;
      aKeys.forEach((aKeyInstance) => {
        if (loopObjectFlag) {
          const aValue = a[aKeyInstance];
          const bValue = b[aKeyInstance];
          if (aValue !== bValue && !equals2(aValue, bValue)) {
            loopObjectFlag = false;
          }
        }
      });
      return loopObjectFlag;
    }
    return false;
  }
  function prop(propToFind, obj) {
    if (arguments.length === 1)
      return (_obj) => prop(propToFind, _obj);
    if (!obj)
      return void 0;
    return obj[propToFind];
  }
  function eqPropsFn(property, objA, objB) {
    return equals2(prop(property, objA), prop(property, objB));
  }
  var eqProps = curry(eqPropsFn);
  function path(pathInput, obj) {
    if (arguments.length === 1)
      return (_obj) => path(pathInput, _obj);
    if (obj === null || obj === void 0) {
      return void 0;
    }
    let willReturn = obj;
    let counter = 0;
    const pathArrValue = typeof pathInput === "string" ? pathInput.split(".") : pathInput;
    while (counter < pathArrValue.length) {
      if (willReturn === null || willReturn === void 0) {
        return void 0;
      }
      if (willReturn[pathArrValue[counter]] === null)
        return void 0;
      willReturn = willReturn[pathArrValue[counter]];
      counter++;
    }
    return willReturn;
  }
  function ifElseFn(condition, onTrue, onFalse) {
    return (...input) => {
      const conditionResult = typeof condition === "boolean" ? condition : condition(...input);
      if (conditionResult === true) {
        return onTrue(...input);
      }
      return onFalse(...input);
    };
  }
  var ifElse = curry(ifElseFn);
  function baseSlice(array, start, end) {
    let index = -1;
    let {
      length
    } = array;
    end = end > length ? length : end;
    if (end < 0) {
      end += length;
    }
    length = start > end ? 0 : end - start >>> 0;
    start >>>= 0;
    const result = Array(length);
    while (++index < length) {
      result[index] = array[index + start];
    }
    return result;
  }
  function is(targetPrototype, x) {
    if (arguments.length === 1)
      return (_x) => is(targetPrototype, _x);
    return x != null && x.constructor === targetPrototype || x instanceof targetPrototype;
  }
  function updateFn(index, newValue, list) {
    const clone = cloneList(list);
    if (index === -1)
      return clone.fill(newValue, index);
    return clone.fill(newValue, index, index + 1);
  }
  var update = curry(updateFn);
  function maxByFn(compareFn, x, y) {
    return compareFn(y) > compareFn(x) ? y : x;
  }
  var maxBy = curry(maxByFn);
  function minByFn(compareFn, x, y) {
    return compareFn(y) < compareFn(x) ? y : x;
  }
  var minBy = curry(minByFn);
  function moveFn(fromIndex, toIndex, list) {
    if (fromIndex < 0 || toIndex < 0) {
      throw new Error("Rambda.move does not support negative indexes");
    }
    if (fromIndex > list.length - 1 || toIndex > list.length - 1)
      return list;
    const clone = cloneList(list);
    clone[fromIndex] = list[toIndex];
    clone[toIndex] = list[fromIndex];
    return clone;
  }
  var move = curry(moveFn);
  function multiply(x, y) {
    if (arguments.length === 1)
      return (_y) => multiply(x, _y);
    return x * y;
  }
  var Identity = (x) => ({
    x,
    map: (fn) => Identity(fn(x))
  });
  function overFn(lens, fn, object) {
    return lens((x) => Identity(fn(x)))(object).x;
  }
  var over = curry(overFn);
  function pathEqFn(pathToSearch, target, input) {
    return equals2(path(pathToSearch, input), target);
  }
  var pathEq = curry(pathEqFn);
  function pathOrFn(defaultValue, pathInput, obj) {
    return defaultTo(defaultValue, path(pathInput, obj));
  }
  var pathOr = curry(pathOrFn);
  var product = reduce(multiply, 1);
  function propEqFn(propToFind, valueToMatch, obj) {
    if (!obj)
      return false;
    return obj[propToFind] === valueToMatch;
  }
  var propEq = curry(propEqFn);
  function propIsFn(targetPrototype, property, obj) {
    return is(targetPrototype, obj[property]);
  }
  var propIs = curry(propIsFn);
  function propOrFn(defaultValue, property, obj) {
    if (!obj)
      return defaultValue;
    return defaultTo(defaultValue, obj[property]);
  }
  var propOr = curry(propOrFn);
  function replaceFn(pattern, replacer, str) {
    return str.replace(pattern, replacer);
  }
  var replace = curry(replaceFn);
  function setFn(lens, replacer, x) {
    return over(lens, always(replacer), x);
  }
  var set = curry(setFn);
  function sliceFn(from, to, list) {
    return list.slice(from, to);
  }
  var slice = curry(sliceFn);
  function take(howMany, listOrString) {
    if (arguments.length === 1)
      return (_listOrString) => take(howMany, _listOrString);
    if (howMany < 0)
      return listOrString.slice();
    if (typeof listOrString === "string")
      return listOrString.slice(0, howMany);
    return baseSlice(listOrString, 0, howMany);
  }
  function whenFn(predicate, whenTrueFn, input) {
    if (!predicate(input))
      return input;
    return whenTrueFn(input);
  }
  var when = curry(whenFn);
  function zipWithFn(fn, x, y) {
    return take(x.length > y.length ? y.length : x.length, x).map((xInstance, i) => fn(xInstance, y[i]));
  }
  var zipWith = curry(zipWithFn);

  // src/core.js
  var evalTest = async (test) => {
    try {
      const assertion = await Promise.resolve(test());
      if ("equals" in assertion) {
        if (assertion.check === assertion.equals)
          return { kind: "pass" };
        else
          return notEqual(assertion.check, assertion.equals);
      } else if ("deepEquals" in assertion) {
        return evalDeepEquals(assertion);
      } else if ("throws" in assertion) {
        try {
          assertion.check();
        } catch (err) {
          return evalDeepEquals({ check: err, deepEquals: assertion.throws });
        }
        return notEqual(void 0, assertion.throws);
      }
      const keys = Object.keys(assertion);
      throw `Unable to evaluate assertion with fields ${keys}`;
    } catch (exn) {
      return { kind: "fail", reason: { kind: "threw-exn", error: `${exn}` } };
    }
  };
  var evalDeepEquals = ({ check: actual, deepEquals: expected }) => equals2(actual, expected) ? { kind: "pass" } : notEqual(actual, expected);
  var notEqual = (actual, expected) => {
    const changes = (() => {
      if (actual === void 0 && expected === void 0) {
        return [];
      } else if (actual === void 0 || expected === void 0) {
        return [
          { kind: "actual", value: actual },
          { kind: "expected", value: expected }
        ];
      } else {
        return diffJson(actual, expected).map(({ added, removed, value }) => {
          if (removed)
            return { kind: "actual", value };
          if (added)
            return { kind: "expected", value };
          else
            return { kind: "same", value };
        });
      }
    })();
    return { kind: "fail", reason: { kind: "not-equal", changes } };
  };
  var evalTestSuite = async (testSuite) => {
    const testResults2 = { passes: 0, fails: 0, children: {} };
    for (const [description2, t] of Object.entries(testSuite)) {
      if (isTest(t)) {
        const tr = await evalTest(t);
        const [passes, fails] = sumTestResult(tr);
        testResults2.passes += passes;
        testResults2.fails += fails;
        testResults2.children[description2] = tr;
      } else {
        const trs = await evalTestSuite(t);
        const [passes, fails] = sumTestResults(trs.children);
        testResults2.passes += passes;
        testResults2.fails += fails;
        testResults2.children[description2] = trs;
      }
    }
    return testResults2;
  };
  var sumTestResults = (trs) => Object.values(trs).reduce(([passes, fails], t) => {
    const [p, f] = "kind" in t ? sumTestResult(t) : [t.passes, t.fails];
    return [passes + p, fails + f];
  }, [0, 0]);
  var sumTestResult = (tr) => tr.kind == "pass" ? [1, 0] : [0, 1];
  var isTest = (t) => typeof t === "function";

  // src/index.js
  var src_default = async (elem, testSuite) => {
    const results = await evalTestSuite(testSuite);
    return elem.appendChild(browser_default(results));
  };
})();
