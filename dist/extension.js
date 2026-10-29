// translation_regex_me · generated; see README.md and NOTICE.
(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    try {
      return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
    } catch (e) {
      throw mod = 0, e;
    }
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // node_modules/picocolors/picocolors.browser.js
  var require_picocolors_browser = __commonJS({
    "node_modules/picocolors/picocolors.browser.js"(exports, module) {
      var x = String;
      var create2 = function() {
        return { isColorSupported: false, reset: x, bold: x, dim: x, italic: x, underline: x, inverse: x, hidden: x, strikethrough: x, black: x, red: x, green: x, yellow: x, blue: x, magenta: x, cyan: x, white: x, gray: x, bgBlack: x, bgRed: x, bgGreen: x, bgYellow: x, bgBlue: x, bgMagenta: x, bgCyan: x, bgWhite: x, blackBright: x, redBright: x, greenBright: x, yellowBright: x, blueBright: x, magentaBright: x, cyanBright: x, whiteBright: x, bgBlackBright: x, bgRedBright: x, bgGreenBright: x, bgYellowBright: x, bgBlueBright: x, bgMagentaBright: x, bgCyanBright: x, bgWhiteBright: x };
      };
      module.exports = create2();
      module.exports.createColors = create2;
    }
  });

  // (disabled):node_modules/postcss/lib/terminal-highlight
  var require_terminal_highlight = __commonJS({
    "(disabled):node_modules/postcss/lib/terminal-highlight"() {
    }
  });

  // node_modules/postcss/lib/css-syntax-error.js
  var require_css_syntax_error = __commonJS({
    "node_modules/postcss/lib/css-syntax-error.js"(exports, module) {
      "use strict";
      var pico = require_picocolors_browser();
      var terminalHighlight = require_terminal_highlight();
      var CssSyntaxError2 = class _CssSyntaxError extends Error {
        constructor(message, line, column, source, file, plugin2) {
          super(message);
          this.name = "CssSyntaxError";
          this.reason = message;
          if (file) {
            this.file = file;
          }
          if (source) {
            this.source = source;
          }
          if (plugin2) {
            this.plugin = plugin2;
          }
          if (typeof line !== "undefined" && typeof column !== "undefined") {
            if (typeof line === "number") {
              this.line = line;
              this.column = column;
            } else {
              this.line = line.line;
              this.column = line.column;
              this.endLine = column.line;
              this.endColumn = column.column;
            }
          }
          this.setMessage();
          if (Error.captureStackTrace) {
            Error.captureStackTrace(this, _CssSyntaxError);
          }
        }
        setMessage() {
          this.message = this.plugin ? this.plugin + ": " : "";
          this.message += this.file ? this.file : "<css input>";
          if (typeof this.line !== "undefined") {
            this.message += ":" + this.line + ":" + this.column;
          }
          this.message += ": " + this.reason;
        }
        showSourceCode(color) {
          if (!this.source) return "";
          let css = this.source;
          if (color == null) color = pico.isColorSupported;
          let aside = (text2) => text2;
          let mark = (text2) => text2;
          let highlight = (text2) => text2;
          if (color) {
            let { bold, gray, red } = pico.createColors(true);
            mark = (text2) => bold(red(text2));
            aside = (text2) => gray(text2);
            if (terminalHighlight) {
              highlight = (text2) => terminalHighlight(text2);
            }
          }
          let lines = css.split(/\r?\n/);
          let start2 = Math.max(this.line - 3, 0);
          let end = Math.min(this.line + 2, lines.length);
          let maxWidth = String(end).length;
          return lines.slice(start2, end).map((line, index) => {
            let number = start2 + 1 + index;
            let gutter = " " + (" " + number).slice(-maxWidth) + " | ";
            if (number === this.line) {
              if (line.length > 160) {
                let padding = 20;
                let subLineStart = Math.max(0, this.column - padding);
                let subLineEnd = Math.max(
                  this.column + padding,
                  this.endColumn + padding
                );
                let subLine = line.slice(subLineStart, subLineEnd);
                let spacing2 = aside(gutter.replace(/\d/g, " ")) + line.slice(0, Math.min(this.column - 1, padding - 1)).replace(/[^\t]/g, " ");
                return mark(">") + aside(gutter) + highlight(subLine) + "\n " + spacing2 + mark("^");
              }
              let spacing = aside(gutter.replace(/\d/g, " ")) + line.slice(0, this.column - 1).replace(/[^\t]/g, " ");
              return mark(">") + aside(gutter) + highlight(line) + "\n " + spacing + mark("^");
            }
            return " " + aside(gutter) + highlight(line);
          }).join("\n");
        }
        toString() {
          let code = this.showSourceCode();
          if (code) {
            code = "\n\n" + code + "\n";
          }
          return this.name + ": " + this.message + code;
        }
      };
      module.exports = CssSyntaxError2;
      CssSyntaxError2.default = CssSyntaxError2;
    }
  });

  // node_modules/postcss/lib/stringifier.js
  var require_stringifier = __commonJS({
    "node_modules/postcss/lib/stringifier.js"(exports, module) {
      "use strict";
      var STYLE_TAG = /(<)(\/?style\b)/gi;
      var COMMENT_OPEN = /(<)(!--)/g;
      var AT_NAME_END = /[\t\n\f\r "#'()/;[\\\]{}]/;
      function escapeHTMLInCSS(str) {
        if (typeof str !== "string") return str;
        if (!str.includes("<")) return str;
        return str.replace(STYLE_TAG, "\\3c $2").replace(COMMENT_OPEN, "\\3c $2");
      }
      var DEFAULT_RAW = {
        after: "\n",
        beforeClose: "\n",
        beforeComment: "\n",
        beforeDecl: "\n",
        beforeOpen: " ",
        beforeRule: "\n",
        colon: ": ",
        commentLeft: " ",
        commentRight: " ",
        emptyBody: "",
        indent: "    ",
        semicolon: false
      };
      function capitalize(str) {
        return str[0].toUpperCase() + str.slice(1);
      }
      function atruleStart(str, node) {
        let name = "@" + node.name;
        let params = node.params ? str.rawValue(node, "params") : "";
        let afterName = node.raws.afterName;
        if (typeof afterName === "undefined") {
          afterName = params ? " " : "";
        } else if (afterName === "" && params && !AT_NAME_END.test(params[0])) {
          afterName = " ";
        }
        return name + afterName + params;
      }
      function pushBody(str, stack, node) {
        let nodes = node.nodes;
        let last = nodes.length - 1;
        while (last > 0) {
          if (nodes[last].type !== "comment") break;
          last -= 1;
        }
        let semicolon = str.raw(node, "semicolon");
        let isDocument = node.type === "document";
        for (let i = nodes.length - 1; i >= 0; i--) {
          let child = nodes[i];
          let childSemicolon = last !== i || semicolon;
          if (!childSemicolon && i < nodes.length - 1 && (child.type === "atrule" && !child.nodes || child.type === "decl" && child.prop.startsWith("--"))) {
            childSemicolon = true;
          }
          stack.push({
            document: isDocument,
            node: child,
            semicolon: childSemicolon
          });
        }
      }
      function pushBlock(str, stack, node, start2) {
        let between = str.raw(node, "between", "beforeOpen");
        str.builder(escapeHTMLInCSS(start2 + between) + "{", node, "start");
        let hasNodes = node.nodes && node.nodes.length;
        let close = () => {
          let after = hasNodes ? str.raw(node, "after") : str.raw(node, "after", "emptyBody");
          if (after) str.builder(escapeHTMLInCSS(after));
          str.builder("}", node, "end");
          if (node.type === "rule" && node.raws.ownSemicolon) {
            str.builder(escapeHTMLInCSS(node.raws.ownSemicolon), node, "end");
          }
        };
        if (hasNodes) {
          stack.push(close);
          pushBody(str, stack, node);
        } else {
          close();
        }
      }
      var Stringifier = class _Stringifier {
        constructor(builder) {
          this.builder = builder;
        }
        atrule(node, semicolon) {
          let start2 = atruleStart(this, node);
          if (node.nodes) {
            this.block(node, start2);
          } else {
            let end = (node.raws.between || "") + (semicolon ? ";" : "");
            this.builder(escapeHTMLInCSS(start2 + end), node);
          }
        }
        beforeAfter(node, detect) {
          let value;
          if (node.type === "decl") {
            value = this.raw(node, null, "beforeDecl");
          } else if (node.type === "comment") {
            value = this.raw(node, null, "beforeComment");
          } else if (detect === "before") {
            value = this.raw(node, null, "beforeRule");
          } else {
            value = this.raw(node, null, "beforeClose");
          }
          let buf = node.parent;
          let depth = 0;
          while (buf && buf.type !== "root") {
            depth += 1;
            buf = buf.parent;
          }
          if (value.includes("\n")) {
            let indent = this.raw(node, null, "indent");
            if (indent.length) {
              for (let step = 0; step < depth; step++) value += indent;
            }
          }
          return value;
        }
        block(node, start2) {
          let between = this.raw(node, "between", "beforeOpen");
          this.builder(escapeHTMLInCSS(start2 + between) + "{", node, "start");
          let after;
          if (node.nodes && node.nodes.length) {
            this.body(node);
            after = this.raw(node, "after");
          } else {
            after = this.raw(node, "after", "emptyBody");
          }
          if (after) this.builder(escapeHTMLInCSS(after));
          this.builder("}", node, "end");
        }
        body(node) {
          let proto = _Stringifier.prototype;
          let expandable = ["atrule", "block", "body", "rule", "stringify"].every(
            (method) => this[method] === proto[method]
          );
          let stack = [];
          pushBody(this, stack, node);
          while (stack.length > 0) {
            let entry = stack.pop();
            if (typeof entry === "function") {
              entry();
              continue;
            }
            let child = entry.node;
            let before = this.raw(child, "before");
            if (before) {
              this.builder(entry.document ? before : escapeHTMLInCSS(before));
            }
            if (expandable && child.type === "rule") {
              pushBlock(this, stack, child, this.rawValue(child, "selector"));
            } else if (expandable && child.type === "atrule" && child.nodes) {
              pushBlock(this, stack, child, atruleStart(this, child));
            } else {
              this.stringify(child, entry.semicolon);
            }
          }
        }
        comment(node) {
          let left = this.raw(node, "left", "commentLeft");
          let right = this.raw(node, "right", "commentRight");
          this.builder(escapeHTMLInCSS("/*" + left + node.text + right + "*/"), node);
        }
        decl(node, semicolon) {
          let raws = node.raws;
          let between = this.raw(node, "between", "colon");
          let string = node.prop + between + this.rawValue(node, "value");
          if (node.important) {
            string += raws.important || " !important";
          }
          if (semicolon) string += ";";
          this.builder(escapeHTMLInCSS(string), node);
        }
        document(node) {
          this.body(node);
        }
        raw(node, own, detect) {
          let value;
          if (!detect) detect = own;
          if (own) {
            value = node.raws[own];
            if (typeof value !== "undefined") return value;
          }
          let parent = node.parent;
          if (detect === "before") {
            if (!parent || parent.type === "root" && parent.first === node) {
              return "";
            }
            if (parent && parent.type === "document") {
              return "";
            }
          }
          if (!parent) return DEFAULT_RAW[detect];
          let root2 = node.root();
          let cache = root2.rawCache || (root2.rawCache = {});
          if (typeof cache[detect] !== "undefined") {
            return cache[detect];
          }
          if (detect === "before" || detect === "after") {
            return this.beforeAfter(node, detect);
          } else {
            let method = "raw" + capitalize(detect);
            if (this[method]) {
              value = this[method](root2, node);
            } else {
              root2.walk((i) => {
                value = i.raws[own];
                if (typeof value !== "undefined") return false;
              });
            }
          }
          if (typeof value === "undefined") value = DEFAULT_RAW[detect];
          cache[detect] = value;
          return value;
        }
        rawBeforeClose(root2) {
          let value;
          root2.walk((i) => {
            if (i.nodes && i.nodes.length > 0) {
              if (typeof i.raws.after !== "undefined") {
                value = i.raws.after;
                if (value.includes("\n")) {
                  value = value.replace(/[^\n]+$/, "");
                }
                return false;
              }
            }
          });
          if (value) value = value.replace(/\S/g, "");
          return value;
        }
        rawBeforeComment(root2, node) {
          let value;
          root2.walkComments((i) => {
            if (typeof i.raws.before !== "undefined") {
              value = i.raws.before;
              if (value.includes("\n")) {
                value = value.replace(/[^\n]+$/, "");
              }
              return false;
            }
          });
          if (typeof value === "undefined") {
            value = this.raw(node, null, "beforeDecl");
          } else if (value) {
            value = value.replace(/\S/g, "");
          }
          return value;
        }
        rawBeforeDecl(root2, node) {
          let value;
          root2.walkDecls((i) => {
            if (typeof i.raws.before !== "undefined") {
              value = i.raws.before;
              if (value.includes("\n")) {
                value = value.replace(/[^\n]+$/, "");
              }
              return false;
            }
          });
          if (typeof value === "undefined") {
            value = this.raw(node, null, "beforeRule");
          } else if (value) {
            value = value.replace(/\S/g, "");
          }
          return value;
        }
        rawBeforeOpen(root2) {
          let value;
          root2.walk((i) => {
            if (i.type !== "decl") {
              value = i.raws.between;
              if (typeof value !== "undefined") return false;
            }
          });
          return value;
        }
        rawBeforeRule(root2) {
          let value;
          root2.walk((i) => {
            if (i.nodes && (i.parent !== root2 || root2.first !== i)) {
              if (typeof i.raws.before !== "undefined") {
                value = i.raws.before;
                if (value.includes("\n")) {
                  value = value.replace(/[^\n]+$/, "");
                }
                return false;
              }
            }
          });
          if (value) value = value.replace(/\S/g, "");
          return value;
        }
        rawColon(root2) {
          let value;
          root2.walkDecls((i) => {
            if (typeof i.raws.between !== "undefined") {
              value = i.raws.between.replace(/[^\s:]/g, "");
              return false;
            }
          });
          return value;
        }
        rawEmptyBody(root2) {
          let value;
          root2.walk((i) => {
            if (i.nodes && i.nodes.length === 0) {
              value = i.raws.after;
              if (typeof value !== "undefined") return false;
            }
          });
          return value;
        }
        rawIndent(root2) {
          if (root2.raws.indent) return root2.raws.indent;
          let value;
          root2.walk((i) => {
            let p = i.parent;
            if (p && p !== root2 && p.parent && p.parent === root2) {
              if (typeof i.raws.before !== "undefined") {
                let parts = i.raws.before.split("\n");
                value = parts[parts.length - 1];
                value = value.replace(/\S/g, "");
                return false;
              }
            }
          });
          return value;
        }
        rawSemicolon(root2) {
          let value;
          root2.walk((i) => {
            if (i.nodes && i.nodes.length && i.last.type === "decl") {
              value = i.raws.semicolon;
              if (typeof value !== "undefined") return false;
            }
          });
          return value;
        }
        rawValue(node, prop) {
          let value = node[prop];
          let raw = node.raws[prop];
          if (raw && raw.value === value) {
            return raw.raw;
          }
          return value;
        }
        root(node) {
          this.body(node);
          if (node.raws.after) {
            let after = node.raws.after;
            let isDocument = node.parent && node.parent.type === "document";
            this.builder(isDocument ? after : escapeHTMLInCSS(after));
          }
        }
        rule(node) {
          this.block(node, this.rawValue(node, "selector"));
          if (node.raws.ownSemicolon) {
            this.builder(escapeHTMLInCSS(node.raws.ownSemicolon), node, "end");
          }
        }
        stringify(node, semicolon) {
          if (!this[node.type]) {
            throw new Error(
              "Unknown AST node type " + node.type + ". Maybe you need to change PostCSS stringifier."
            );
          }
          this[node.type](node, semicolon);
        }
      };
      module.exports = Stringifier;
      Stringifier.default = Stringifier;
    }
  });

  // node_modules/postcss/lib/stringify.js
  var require_stringify = __commonJS({
    "node_modules/postcss/lib/stringify.js"(exports, module) {
      "use strict";
      var Stringifier = require_stringifier();
      function stringify2(node, builder) {
        let str = new Stringifier(builder);
        str.stringify(node);
      }
      module.exports = stringify2;
      stringify2.default = stringify2;
    }
  });

  // node_modules/postcss/lib/symbols.js
  var require_symbols = __commonJS({
    "node_modules/postcss/lib/symbols.js"(exports, module) {
      "use strict";
      module.exports.isClean = /* @__PURE__ */ Symbol("isClean");
      module.exports.my = /* @__PURE__ */ Symbol("my");
    }
  });

  // node_modules/postcss/lib/node.js
  var require_node = __commonJS({
    "node_modules/postcss/lib/node.js"(exports, module) {
      "use strict";
      var CssSyntaxError2 = require_css_syntax_error();
      var Stringifier = require_stringifier();
      var stringify2 = require_stringify();
      var { isClean, my } = require_symbols();
      function cloneNode(obj, parent) {
        let cloned = new obj.constructor();
        let stack = [[obj, cloned, parent]];
        while (stack.length > 0) {
          let [source, target, targetParent] = stack.pop();
          for (let i in source) {
            if (!Object.prototype.hasOwnProperty.call(source, i)) {
              continue;
            }
            if (i === "proxyCache") continue;
            let value = source[i];
            let type = typeof value;
            if (i === "parent" && type === "object") {
              if (targetParent) target[i] = targetParent;
            } else if (i === "source") {
              target[i] = value;
            } else if (Array.isArray(value)) {
              let children = [];
              target[i] = children;
              for (let j of value) {
                let childClone = new j.constructor();
                children.push(childClone);
                stack.push([j, childClone, target]);
              }
            } else {
              if (type === "object" && value !== null) {
                let valueClone = new value.constructor();
                stack.push([value, valueClone, void 0]);
                value = valueClone;
              }
              target[i] = value;
            }
          }
        }
        return cloned;
      }
      function sourceOffset(inputCSS, position) {
        if (position && typeof position.offset !== "undefined") {
          return position.offset;
        }
        let column = 1;
        let line = 1;
        let offset = 0;
        for (let i = 0; i < inputCSS.length; i++) {
          if (line === position.line && column === position.column) {
            offset = i;
            break;
          }
          if (inputCSS[i] === "\n") {
            column = 1;
            line += 1;
          } else {
            column += 1;
          }
        }
        return offset;
      }
      var Node2 = class _Node {
        get proxyOf() {
          return this;
        }
        constructor(defaults = {}) {
          this.raws = {};
          this[isClean] = false;
          this[my] = true;
          for (let name of Object.keys(defaults)) {
            if (name === "__proto__") continue;
            if (name === "nodes") {
              this.nodes = [];
              for (let node of defaults[name]) {
                if (typeof node.clone === "function" && node.parent) {
                  this.append(node.clone());
                } else {
                  this.append(node);
                }
              }
            } else {
              this[name] = defaults[name];
            }
          }
        }
        addToError(error) {
          error.postcssNode = this;
          if (error.stack && this.source && /\n\s{4}at /.test(error.stack)) {
            let s = this.source;
            error.stack = error.stack.replace(
              /\n\s{4}at /,
              `$&${s.input.from}:${s.start.line}:${s.start.column}$&`
            );
          }
          return error;
        }
        after(add) {
          this.parent.insertAfter(this, add);
          return this;
        }
        assign(overrides = {}) {
          for (let name in overrides) {
            this[name] = overrides[name];
          }
          return this;
        }
        before(add) {
          this.parent.insertBefore(this, add);
          return this;
        }
        cleanRaws(keepBetween) {
          delete this.raws.before;
          delete this.raws.after;
          if (!keepBetween) delete this.raws.between;
        }
        clone(overrides = {}) {
          let cloned = cloneNode(this);
          for (let name in overrides) {
            cloned[name] = overrides[name];
          }
          return cloned;
        }
        cloneAfter(overrides = {}) {
          let cloned = this.clone(overrides);
          this.parent.insertAfter(this, cloned);
          return cloned;
        }
        cloneBefore(overrides = {}) {
          let cloned = this.clone(overrides);
          this.parent.insertBefore(this, cloned);
          return cloned;
        }
        error(message, opts = {}) {
          if (this.source) {
            let { end, start: start2 } = this.rangeBy(opts);
            return this.source.input.error(
              message,
              { column: start2.column, line: start2.line },
              { column: end.column, line: end.line },
              opts
            );
          }
          return new CssSyntaxError2(message);
        }
        getProxyProcessor() {
          return {
            get(node, prop) {
              if (prop === "proxyOf") {
                return node;
              } else if (prop === "root") {
                return () => node.root().toProxy();
              } else {
                return node[prop];
              }
            },
            set(node, prop, value) {
              if (node[prop] === value) return true;
              node[prop] = value;
              if (prop === "prop" || prop === "value" || prop === "name" || prop === "params" || prop === "important" || /* c8 ignore next */
              prop === "text") {
                node.markDirty();
              }
              return true;
            }
          };
        }
        /* c8 ignore next 3 */
        markClean() {
          this[isClean] = true;
        }
        markDirty() {
          if (this[isClean]) {
            this[isClean] = false;
            let next = this;
            while (next = next.parent) {
              next[isClean] = false;
            }
          }
        }
        next() {
          if (!this.parent) return void 0;
          let index = this.parent.index(this);
          return this.parent.nodes[index + 1];
        }
        positionBy(opts = {}) {
          let inputString = "document" in this.source.input ? this.source.input.document : this.source.input.css;
          let pos = {
            column: this.source.start.column,
            line: this.source.start.line,
            offset: sourceOffset(inputString, this.source.start)
          };
          if (opts.index) {
            pos = this.positionInside(opts.index);
          } else if (opts.word) {
            let stringRepresentation = inputString.slice(
              sourceOffset(inputString, this.source.start),
              sourceOffset(inputString, this.source.end)
            );
            let index = stringRepresentation.indexOf(opts.word);
            if (index !== -1) pos = this.positionInside(index);
          }
          return pos;
        }
        positionInside(index) {
          let column = this.source.start.column;
          let line = this.source.start.line;
          let inputString = "document" in this.source.input ? this.source.input.document : this.source.input.css;
          let offset = sourceOffset(inputString, this.source.start);
          let end = offset + index;
          for (let i = offset; i < end; i++) {
            if (inputString[i] === "\n") {
              column = 1;
              line += 1;
            } else {
              column += 1;
            }
          }
          return { column, line, offset: end };
        }
        prev() {
          if (!this.parent) return void 0;
          let index = this.parent.index(this);
          return this.parent.nodes[index - 1];
        }
        rangeBy(opts = {}) {
          let inputString = "document" in this.source.input ? this.source.input.document : this.source.input.css;
          let start2 = {
            column: this.source.start.column,
            line: this.source.start.line,
            offset: sourceOffset(inputString, this.source.start)
          };
          let end = this.source.end ? {
            column: this.source.end.column + 1,
            line: this.source.end.line,
            offset: typeof this.source.end.offset === "number" ? (
              // `source.end.offset` is exclusive, so we don't need to add 1
              this.source.end.offset
            ) : (
              // Since line/column in this.source.end is inclusive,
              // the `sourceOffset(... , this.source.end)` returns an inclusive offset.
              // So, we add 1 to convert it to exclusive.
              sourceOffset(inputString, this.source.end) + 1
            )
          } : {
            column: start2.column + 1,
            line: start2.line,
            offset: start2.offset + 1
          };
          if (opts.word) {
            let stringRepresentation = inputString.slice(
              sourceOffset(inputString, this.source.start),
              sourceOffset(inputString, this.source.end)
            );
            let index = stringRepresentation.indexOf(opts.word);
            if (index !== -1) {
              start2 = this.positionInside(index);
              end = this.positionInside(index + opts.word.length);
            }
          } else {
            if (opts.start) {
              start2 = {
                column: opts.start.column,
                line: opts.start.line,
                offset: sourceOffset(inputString, opts.start)
              };
            } else if (typeof opts.index === "number") {
              start2 = this.positionInside(opts.index);
            }
            if (opts.end) {
              end = {
                column: opts.end.column,
                line: opts.end.line,
                offset: sourceOffset(inputString, opts.end)
              };
            } else if (typeof opts.endIndex === "number") {
              end = this.positionInside(opts.endIndex);
            } else if (typeof opts.index === "number") {
              end = this.positionInside(opts.index + 1);
            }
          }
          if (end.line < start2.line || end.line === start2.line && end.column <= start2.column) {
            end = {
              column: start2.column + 1,
              line: start2.line,
              offset: start2.offset + 1
            };
          }
          return { end, start: start2 };
        }
        raw(prop, defaultType) {
          let str = new Stringifier();
          return str.raw(this, prop, defaultType);
        }
        remove() {
          if (this.parent) {
            this.parent.removeChild(this);
          }
          this.parent = void 0;
          return this;
        }
        replaceWith(...nodes) {
          if (this.parent) {
            let bookmark = this;
            let foundSelf = false;
            for (let node of nodes) {
              if (node === this) {
                foundSelf = true;
              } else if (foundSelf) {
                this.parent.insertAfter(bookmark, node);
                bookmark = node;
              } else {
                this.parent.insertBefore(bookmark, node);
              }
            }
            if (!foundSelf) {
              this.remove();
            }
          }
          return this;
        }
        root() {
          let result = this;
          while (result.parent && result.parent.type !== "document") {
            result = result.parent;
          }
          return result;
        }
        toJSON(_, inputs) {
          let emitInputs = inputs == null;
          inputs = inputs || /* @__PURE__ */ new Map();
          let holderOfRoot = [];
          let queue = [[this, holderOfRoot, 0]];
          for (let step = 0; step < queue.length; step++) {
            let [node, holder, key] = queue[step];
            let fixed2 = {};
            holder[key] = fixed2;
            for (let name in node) {
              if (!Object.prototype.hasOwnProperty.call(node, name)) {
                continue;
              }
              if (name === "parent" || name === "proxyCache") continue;
              let value = node[name];
              if (Array.isArray(value)) {
                let fixedArray = [];
                fixed2[name] = fixedArray;
                for (let i = 0; i < value.length; i++) {
                  let item = value[i];
                  if (typeof item === "object" && item.toJSON) {
                    if (item.toJSON === _Node.prototype.toJSON) {
                      queue.push([item, fixedArray, i]);
                    } else {
                      fixedArray[i] = item.toJSON(null, inputs);
                    }
                  } else {
                    fixedArray[i] = item;
                  }
                }
              } else if (typeof value === "object" && value.toJSON) {
                if (value.toJSON === _Node.prototype.toJSON) {
                  queue.push([value, fixed2, name]);
                } else {
                  fixed2[name] = value.toJSON(null, inputs);
                }
              } else if (name === "source") {
                if (value == null) continue;
                let inputId = inputs.get(value.input);
                if (inputId == null) {
                  inputId = inputs.size;
                  inputs.set(value.input, inputId);
                }
                fixed2[name] = {
                  end: value.end,
                  inputId,
                  start: value.start
                };
              } else {
                fixed2[name] = value;
              }
            }
          }
          let fixed = holderOfRoot[0];
          if (emitInputs) {
            fixed.inputs = [...inputs.keys()].map((input) => input.toJSON());
          }
          return fixed;
        }
        toProxy() {
          if (!this.proxyCache) {
            this.proxyCache = new Proxy(this, this.getProxyProcessor());
          }
          return this.proxyCache;
        }
        toString(stringifier = stringify2) {
          if (stringifier.stringify) stringifier = stringifier.stringify;
          let result = "";
          stringifier(this, (i) => {
            result += i;
          });
          return result;
        }
        warn(result, text2, opts = {}) {
          let data = { node: this };
          for (let i in opts) data[i] = opts[i];
          return result.warn(text2, data);
        }
      };
      module.exports = Node2;
      Node2.default = Node2;
    }
  });

  // node_modules/postcss/lib/comment.js
  var require_comment = __commonJS({
    "node_modules/postcss/lib/comment.js"(exports, module) {
      "use strict";
      var Node2 = require_node();
      var Comment2 = class extends Node2 {
        constructor(defaults) {
          super(defaults);
          this.type = "comment";
        }
      };
      module.exports = Comment2;
      Comment2.default = Comment2;
    }
  });

  // node_modules/postcss/lib/declaration.js
  var require_declaration = __commonJS({
    "node_modules/postcss/lib/declaration.js"(exports, module) {
      "use strict";
      var Node2 = require_node();
      var Declaration2 = class extends Node2 {
        get variable() {
          return this.prop.startsWith("--") || this.prop[0] === "$";
        }
        constructor(defaults) {
          if (defaults && typeof defaults.value !== "undefined" && typeof defaults.value !== "string") {
            defaults = { ...defaults, value: String(defaults.value) };
          }
          super(defaults);
          this.type = "decl";
        }
      };
      module.exports = Declaration2;
      Declaration2.default = Declaration2;
    }
  });

  // node_modules/postcss/lib/container.js
  var require_container = __commonJS({
    "node_modules/postcss/lib/container.js"(exports, module) {
      "use strict";
      var Comment2 = require_comment();
      var Declaration2 = require_declaration();
      var Node2 = require_node();
      var { isClean, my } = require_symbols();
      var AtRule2;
      var parse2;
      var Root2;
      var Rule2;
      function cleanSource(nodes) {
        let stack = nodes.slice();
        while (stack.length > 0) {
          let node = stack.pop();
          delete node.source;
          if (node.nodes) {
            node.nodes = node.nodes.slice();
            for (let i of node.nodes) stack.push(i);
          }
        }
        return nodes.slice();
      }
      function markTreeDirty(node) {
        let stack = [node];
        while (stack.length > 0) {
          let next = stack.pop();
          next[isClean] = false;
          if (next.proxyOf.nodes) {
            for (let i of next.proxyOf.nodes) stack.push(i);
          }
        }
      }
      var Container2 = class _Container extends Node2 {
        get first() {
          if (!this.proxyOf.nodes) return void 0;
          return this.proxyOf.nodes[0];
        }
        get last() {
          if (!this.proxyOf.nodes) return void 0;
          return this.proxyOf.nodes[this.proxyOf.nodes.length - 1];
        }
        append(...children) {
          for (let child of children) {
            let nodes = this.normalize(child, this.last);
            for (let node of nodes) this.proxyOf.nodes.push(node);
          }
          this.markDirty();
          return this;
        }
        cleanRaws(keepBetween) {
          let stack = [this];
          while (stack.length > 0) {
            let node = stack.pop();
            if (node !== this && node.cleanRaws !== _Container.prototype.cleanRaws) {
              node.cleanRaws(keepBetween);
              continue;
            }
            Node2.prototype.cleanRaws.call(node, keepBetween);
            if (node.nodes) {
              for (let child of node.nodes) stack.push(child);
            }
          }
        }
        each(callback) {
          if (!this.proxyOf.nodes) return void 0;
          let iterator = this.getIterator();
          let index, result;
          while (this.indexes[iterator] < this.proxyOf.nodes.length) {
            index = this.indexes[iterator];
            result = callback(this.proxyOf.nodes[index], index);
            if (result === false) break;
            this.indexes[iterator] += 1;
          }
          delete this.indexes[iterator];
          return result;
        }
        every(condition) {
          return this.nodes.every(condition);
        }
        getIterator() {
          if (!this.lastEach) this.lastEach = 0;
          if (!this.indexes) this.indexes = {};
          this.lastEach += 1;
          let iterator = this.lastEach;
          this.indexes[iterator] = 0;
          return iterator;
        }
        getProxyProcessor() {
          return {
            get(node, prop) {
              if (prop === "proxyOf") {
                return node;
              } else if (!node[prop]) {
                return node[prop];
              } else if (prop === "each" || typeof prop === "string" && prop.startsWith("walk")) {
                return (...args) => {
                  return node[prop](
                    ...args.map((i) => {
                      if (typeof i === "function") {
                        return (child, index) => i(child.toProxy(), index);
                      } else {
                        return i;
                      }
                    })
                  );
                };
              } else if (prop === "every" || prop === "some") {
                return (cb) => {
                  return node[prop](
                    (child, ...other) => cb(child.toProxy(), ...other)
                  );
                };
              } else if (prop === "root") {
                return () => node.root().toProxy();
              } else if (prop === "nodes") {
                return node.nodes.map((i) => i.toProxy());
              } else if (prop === "first" || prop === "last") {
                return node[prop].toProxy();
              } else {
                return node[prop];
              }
            },
            set(node, prop, value) {
              if (node[prop] === value) return true;
              node[prop] = value;
              if (prop === "name" || prop === "params" || prop === "selector") {
                node.markDirty();
              }
              return true;
            }
          };
        }
        index(child) {
          if (typeof child === "number") return child;
          if (child.proxyOf) child = child.proxyOf;
          return this.proxyOf.nodes.indexOf(child);
        }
        insertAfter(exist, add) {
          let existIndex = this.index(exist);
          let nodes = this.normalize(add, this.proxyOf.nodes[existIndex]).reverse();
          existIndex = this.index(exist);
          for (let node of nodes) this.proxyOf.nodes.splice(existIndex + 1, 0, node);
          let index;
          for (let id in this.indexes) {
            index = this.indexes[id];
            if (existIndex < index) {
              this.indexes[id] = index + nodes.length;
            }
          }
          this.markDirty();
          return this;
        }
        insertBefore(exist, add) {
          let existIndex = this.index(exist);
          let type = existIndex === 0 ? "prepend" : false;
          let nodes = this.normalize(
            add,
            this.proxyOf.nodes[existIndex],
            type
          ).reverse();
          existIndex = this.index(exist);
          for (let node of nodes) this.proxyOf.nodes.splice(existIndex, 0, node);
          let index;
          for (let id in this.indexes) {
            index = this.indexes[id];
            if (existIndex <= index) {
              this.indexes[id] = index + nodes.length;
            }
          }
          this.markDirty();
          return this;
        }
        normalize(nodes, sample) {
          if (typeof nodes === "string") {
            nodes = cleanSource(parse2(nodes).nodes);
          } else if (typeof nodes === "undefined") {
            nodes = [];
          } else if (Array.isArray(nodes)) {
            nodes = nodes.slice(0);
            for (let i of nodes) {
              if (i.parent) i.parent.removeChild(i, "ignore");
            }
          } else if (nodes.type === "root" && this.type !== "document") {
            nodes = nodes.nodes.slice(0);
            for (let i of nodes) {
              if (i.parent) i.parent.removeChild(i, "ignore");
            }
          } else if (nodes.type) {
            nodes = [nodes];
          } else if (nodes.prop) {
            if (typeof nodes.value === "undefined") {
              throw new Error("Value field is missed in node creation");
            } else if (typeof nodes.value !== "string") {
              nodes.value = String(nodes.value);
            }
            nodes = [new Declaration2(nodes)];
          } else if (nodes.selector || nodes.selectors) {
            nodes = [new Rule2(nodes)];
          } else if (nodes.name) {
            nodes = [new AtRule2(nodes)];
          } else if (nodes.text) {
            nodes = [new Comment2(nodes)];
          } else {
            throw new Error("Unknown node type in node creation");
          }
          let processed = nodes.map((i) => {
            if (!i[my]) _Container.rebuild(i);
            i = i.proxyOf;
            if (i.parent) i.parent.removeChild(i);
            if (i[isClean]) markTreeDirty(i);
            if (!i.raws) i.raws = {};
            if (typeof i.raws.before === "undefined") {
              if (sample && typeof sample.raws.before !== "undefined") {
                i.raws.before = sample.raws.before.replace(/\S/g, "");
              }
            }
            i.parent = this.proxyOf;
            return i;
          });
          return processed;
        }
        prepend(...children) {
          children = children.reverse();
          for (let child of children) {
            let nodes = this.normalize(child, this.first, "prepend").reverse();
            for (let node of nodes) this.proxyOf.nodes.unshift(node);
            for (let id in this.indexes) {
              this.indexes[id] = this.indexes[id] + nodes.length;
            }
          }
          this.markDirty();
          return this;
        }
        push(child) {
          child.parent = this;
          this.proxyOf.nodes.push(child);
          return this;
        }
        removeAll() {
          for (let node of this.proxyOf.nodes) node.parent = void 0;
          this.proxyOf.nodes = [];
          this.markDirty();
          return this;
        }
        removeChild(child) {
          child = this.index(child);
          this.proxyOf.nodes[child].parent = void 0;
          this.proxyOf.nodes.splice(child, 1);
          let index;
          for (let id in this.indexes) {
            index = this.indexes[id];
            if (index >= child) {
              this.indexes[id] = index - 1;
            }
          }
          this.markDirty();
          return this;
        }
        replaceValues(pattern, opts, callback) {
          if (!callback) {
            callback = opts;
            opts = {};
          }
          this.walkDecls((decl2) => {
            if (opts.props && !opts.props.includes(decl2.prop)) return;
            if (opts.fast && !decl2.value.includes(opts.fast)) return;
            decl2.value = decl2.value.replace(pattern, callback);
          });
          this.markDirty();
          return this;
        }
        some(condition) {
          return this.nodes.some(condition);
        }
        walk(callback) {
          if (!this.proxyOf.nodes) return void 0;
          let stack = [{ iterator: this.getIterator(), node: this.proxyOf }];
          while (stack.length > 0) {
            let { iterator, node } = stack[stack.length - 1];
            let index = node.indexes[iterator];
            if (index >= node.proxyOf.nodes.length) {
              delete node.indexes[iterator];
              stack.pop();
              let parent = stack[stack.length - 1];
              if (parent) parent.node.indexes[parent.iterator] += 1;
              continue;
            }
            let child = node.proxyOf.nodes[index];
            let result;
            try {
              result = callback(child, index);
            } catch (e) {
              throw child.addToError(e);
            }
            if (result === false) {
              for (let opened of stack) {
                delete opened.node.indexes[opened.iterator];
              }
              return false;
            }
            if (child.walk && child.proxyOf.nodes) {
              stack.push({ iterator: child.getIterator(), node: child });
            } else {
              node.indexes[iterator] += 1;
            }
          }
          return void 0;
        }
        walkAtRules(name, callback) {
          if (!callback) {
            callback = name;
            return this.walk((child, i) => {
              if (child.type === "atrule") {
                return callback(child, i);
              }
            });
          }
          if (name instanceof RegExp) {
            return this.walk((child, i) => {
              if (child.type === "atrule" && name.test(child.name)) {
                return callback(child, i);
              }
            });
          }
          return this.walk((child, i) => {
            if (child.type === "atrule" && child.name === name) {
              return callback(child, i);
            }
          });
        }
        walkComments(callback) {
          return this.walk((child, i) => {
            if (child.type === "comment") {
              return callback(child, i);
            }
          });
        }
        walkDecls(prop, callback) {
          if (!callback) {
            callback = prop;
            return this.walk((child, i) => {
              if (child.type === "decl") {
                return callback(child, i);
              }
            });
          }
          if (prop instanceof RegExp) {
            return this.walk((child, i) => {
              if (child.type === "decl" && prop.test(child.prop)) {
                return callback(child, i);
              }
            });
          }
          return this.walk((child, i) => {
            if (child.type === "decl" && child.prop === prop) {
              return callback(child, i);
            }
          });
        }
        walkRules(selector, callback) {
          if (!callback) {
            callback = selector;
            return this.walk((child, i) => {
              if (child.type === "rule") {
                return callback(child, i);
              }
            });
          }
          if (selector instanceof RegExp) {
            return this.walk((child, i) => {
              if (child.type === "rule" && selector.test(child.selector)) {
                return callback(child, i);
              }
            });
          }
          return this.walk((child, i) => {
            if (child.type === "rule" && child.selector === selector) {
              return callback(child, i);
            }
          });
        }
      };
      Container2.registerParse = (dependant) => {
        parse2 = dependant;
      };
      Container2.registerRule = (dependant) => {
        Rule2 = dependant;
      };
      Container2.registerAtRule = (dependant) => {
        AtRule2 = dependant;
      };
      Container2.registerRoot = (dependant) => {
        Root2 = dependant;
      };
      module.exports = Container2;
      Container2.default = Container2;
      Container2.rebuild = (node) => {
        let stack = [node];
        while (stack.length > 0) {
          let next = stack.pop();
          if (next.type === "atrule") {
            Object.setPrototypeOf(next, AtRule2.prototype);
          } else if (next.type === "rule") {
            Object.setPrototypeOf(next, Rule2.prototype);
          } else if (next.type === "decl") {
            Object.setPrototypeOf(next, Declaration2.prototype);
          } else if (next.type === "comment") {
            Object.setPrototypeOf(next, Comment2.prototype);
          } else if (next.type === "root") {
            Object.setPrototypeOf(next, Root2.prototype);
          }
          next[my] = true;
          if (next.nodes) {
            for (let child of next.nodes) stack.push(child);
          }
        }
      };
    }
  });

  // node_modules/postcss/lib/at-rule.js
  var require_at_rule = __commonJS({
    "node_modules/postcss/lib/at-rule.js"(exports, module) {
      "use strict";
      var Container2 = require_container();
      var AtRule2 = class extends Container2 {
        constructor(defaults) {
          super(defaults);
          this.type = "atrule";
        }
        append(...children) {
          if (!this.proxyOf.nodes) this.nodes = [];
          return super.append(...children);
        }
        prepend(...children) {
          if (!this.proxyOf.nodes) this.nodes = [];
          return super.prepend(...children);
        }
      };
      module.exports = AtRule2;
      AtRule2.default = AtRule2;
      Container2.registerAtRule(AtRule2);
    }
  });

  // node_modules/postcss/lib/document.js
  var require_document = __commonJS({
    "node_modules/postcss/lib/document.js"(exports, module) {
      "use strict";
      var Container2 = require_container();
      var LazyResult;
      var Processor2;
      var Document2 = class extends Container2 {
        constructor(defaults) {
          super({ type: "document", ...defaults });
          if (!this.nodes) {
            this.nodes = [];
          }
        }
        toResult(opts = {}) {
          let lazy = new LazyResult(new Processor2(), this, opts);
          return lazy.stringify();
        }
      };
      Document2.registerLazyResult = (dependant) => {
        LazyResult = dependant;
      };
      Document2.registerProcessor = (dependant) => {
        Processor2 = dependant;
      };
      module.exports = Document2;
      Document2.default = Document2;
    }
  });

  // node_modules/nanoid/non-secure/index.cjs
  var require_non_secure = __commonJS({
    "node_modules/nanoid/non-secure/index.cjs"(exports, module) {
      var urlAlphabet = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";
      var customAlphabet = (alphabet, defaultSize = 21) => {
        return (size = defaultSize) => {
          let id = "";
          let i = size | 0;
          while (i-- > 0) {
            id += alphabet[Math.random() * alphabet.length | 0];
          }
          return id;
        };
      };
      var nanoid = (size = 21) => {
        let id = "";
        let i = size | 0;
        while (i-- > 0) {
          id += urlAlphabet[Math.random() * 64 | 0];
        }
        return id;
      };
      module.exports = { nanoid, customAlphabet };
    }
  });

  // (disabled):path
  var require_path = __commonJS({
    "(disabled):path"() {
    }
  });

  // (disabled):node_modules/source-map-js/source-map.js
  var require_source_map = __commonJS({
    "(disabled):node_modules/source-map-js/source-map.js"() {
    }
  });

  // (disabled):url
  var require_url = __commonJS({
    "(disabled):url"() {
    }
  });

  // (disabled):fs
  var require_fs = __commonJS({
    "(disabled):fs"() {
    }
  });

  // node_modules/postcss/lib/previous-map.js
  var require_previous_map = __commonJS({
    "node_modules/postcss/lib/previous-map.js"(exports, module) {
      "use strict";
      var { existsSync, readFileSync } = require_fs();
      var { dirname, isAbsolute, join, relative, sep } = require_path();
      var { SourceMapConsumer, SourceMapGenerator } = require_source_map();
      function fromBase64(str) {
        if (Buffer) {
          return Buffer.from(str, "base64").toString();
        } else {
          return window.atob(str);
        }
      }
      var PreviousMap = class {
        constructor(css, opts) {
          if (opts.map === false) return;
          if (opts.unsafeMap) this.unsafeMap = true;
          this.loadAnnotation(css);
          this.inline = this.startWith(this.annotation, "data:");
          let prev = opts.map ? opts.map.prev : void 0;
          let text2 = this.loadMap(opts.from, prev);
          if (!this.mapFile && opts.from) {
            this.mapFile = opts.from;
          }
          if (this.mapFile) this.root = dirname(this.mapFile);
          if (text2) this.text = text2;
        }
        consumer() {
          if (!this.consumerCache) {
            this.consumerCache = new SourceMapConsumer(this.json || this.text);
          }
          return this.consumerCache;
        }
        decodeInline(text2) {
          let baseCharsetUri = /^data:application\/json;charset=utf-?8;base64,/;
          let baseUri = /^data:application\/json;base64,/;
          let charsetUri = /^data:application\/json;charset=utf-?8,/;
          let uri = /^data:application\/json,/;
          let uriMatch = text2.match(charsetUri) || text2.match(uri);
          if (uriMatch) {
            return decodeURIComponent(text2.substr(uriMatch[0].length));
          }
          let baseUriMatch = text2.match(baseCharsetUri) || text2.match(baseUri);
          if (baseUriMatch) {
            return fromBase64(text2.substr(baseUriMatch[0].length));
          }
          let encoding = text2.slice("data:application/json;".length);
          encoding = encoding.slice(0, encoding.indexOf(","));
          throw new Error("Unsupported source map encoding " + encoding);
        }
        getAnnotationURL(sourceMapString) {
          return sourceMapString.replace(/^\/\*\s*# sourceMappingURL=/, "").trim();
        }
        isMap(map) {
          if (typeof map !== "object") return false;
          return typeof map.mappings === "string" || typeof map._mappings === "string" || Array.isArray(map.sections);
        }
        loadAnnotation(css) {
          let comments = css.match(/\/\*\s*# sourceMappingURL=/g);
          if (!comments) return;
          let start2 = css.lastIndexOf(comments.pop());
          let end = css.indexOf("*/", start2);
          if (start2 > -1 && end > -1) {
            this.annotation = this.getAnnotationURL(css.substring(start2, end));
          }
        }
        loadFile(path, cssFile, trusted) {
          if (!trusted && !this.unsafeMap) {
            if (!/\.map$/i.test(path)) return void 0;
            if (!cssFile) return void 0;
            let rel = relative(dirname(cssFile), path);
            if (rel === ".." || rel.startsWith(".." + sep) || isAbsolute(rel)) {
              return void 0;
            }
          }
          this.root = dirname(path);
          if (existsSync(path)) {
            this.mapFile = path;
            return readFileSync(path, "utf-8").toString().trim();
          }
        }
        loadMap(file, prev) {
          if (prev === false) return false;
          if (prev) {
            if (typeof prev === "string") {
              return prev;
            } else if (typeof prev === "function") {
              let prevPath = prev(file);
              if (prevPath) {
                let map = this.loadFile(prevPath, file, true);
                if (!map) {
                  throw new Error(
                    "Unable to load previous source map: " + prevPath.toString()
                  );
                }
                return map;
              }
            } else if (prev instanceof SourceMapConsumer) {
              return SourceMapGenerator.fromSourceMap(prev).toString();
            } else if (prev instanceof SourceMapGenerator) {
              return prev.toString();
            } else if (this.isMap(prev)) {
              return JSON.stringify(prev);
            } else {
              throw new Error(
                "Unsupported previous source map format: " + prev.toString()
              );
            }
          } else if (this.inline) {
            return this.decodeInline(this.annotation);
          } else if (this.annotation) {
            let map = this.annotation;
            if (file) map = join(dirname(file), map);
            let unknown = this.loadFile(map, file, false);
            if (unknown) {
              try {
                this.json = JSON.parse(unknown.replace(/^\)]}'[^\n]*\n/, ""));
              } catch {
                return void 0;
              }
            }
            return unknown;
          }
        }
        startWith(string, start2) {
          if (!string) return false;
          return string.substr(0, start2.length) === start2;
        }
        withContent() {
          return !!(this.consumer().sourcesContent && this.consumer().sourcesContent.length > 0);
        }
      };
      module.exports = PreviousMap;
      PreviousMap.default = PreviousMap;
    }
  });

  // node_modules/postcss/lib/input.js
  var require_input = __commonJS({
    "node_modules/postcss/lib/input.js"(exports, module) {
      "use strict";
      var { nanoid } = require_non_secure();
      var { isAbsolute, resolve } = require_path();
      var { SourceMapConsumer, SourceMapGenerator } = require_source_map();
      var { fileURLToPath, pathToFileURL } = require_url();
      var CssSyntaxError2 = require_css_syntax_error();
      var PreviousMap = require_previous_map();
      var terminalHighlight = require_terminal_highlight();
      var lineToIndexCache = /* @__PURE__ */ Symbol("lineToIndexCache");
      var sourceMapAvailable = Boolean(SourceMapConsumer && SourceMapGenerator);
      var pathAvailable = Boolean(resolve && isAbsolute);
      function getLineToIndex(input) {
        if (input[lineToIndexCache]) return input[lineToIndexCache];
        let lines = input.css.split("\n");
        let lineToIndex = new Array(lines.length);
        let prevIndex = 0;
        for (let i = 0, l = lines.length; i < l; i++) {
          lineToIndex[i] = prevIndex;
          prevIndex += lines[i].length + 1;
        }
        input[lineToIndexCache] = lineToIndex;
        return lineToIndex;
      }
      var Input2 = class {
        get from() {
          return this.file || this.id;
        }
        constructor(css, opts = {}) {
          if (css === null || typeof css === "undefined" || typeof css === "object" && !css.toString) {
            throw new Error(`PostCSS received ${css} instead of CSS string`);
          }
          this.css = css.toString();
          if (this.css[0] === "\uFEFF" || this.css[0] === "\uFFFE") {
            this.hasBOM = true;
            this.css = this.css.slice(1);
          } else {
            this.hasBOM = false;
          }
          this.document = this.css;
          if (opts.document) this.document = opts.document.toString();
          if (opts.from) {
            if (!pathAvailable || /^\w+:\/\//.test(opts.from) || isAbsolute(opts.from)) {
              this.file = opts.from;
            } else {
              this.file = resolve(opts.from);
            }
          }
          if (pathAvailable && sourceMapAvailable) {
            let map = new PreviousMap(this.css, opts);
            if (map.text) {
              this.map = map;
              let file = map.consumer().file;
              if (!this.file && file) this.file = this.mapResolve(file);
            }
          }
          if (!this.file) {
            this.id = "<input css " + nanoid(6) + ">";
          }
          if (this.map) this.map.file = this.from;
        }
        error(message, line, column, opts = {}) {
          let endColumn, endLine, endOffset, offset, result;
          if (line && typeof line === "object") {
            let start2 = line;
            let end = column;
            if (typeof start2.offset === "number") {
              offset = start2.offset;
              let pos = this.fromOffset(offset);
              line = pos.line;
              column = pos.col;
            } else {
              line = start2.line;
              column = start2.column;
              offset = this.fromLineAndColumn(line, column);
            }
            if (typeof end.offset === "number") {
              endOffset = end.offset;
              let pos = this.fromOffset(endOffset);
              endLine = pos.line;
              endColumn = pos.col;
            } else {
              endLine = end.line;
              endColumn = end.column;
              endOffset = this.fromLineAndColumn(end.line, end.column);
            }
          } else if (!column) {
            offset = line;
            let pos = this.fromOffset(offset);
            line = pos.line;
            column = pos.col;
          } else {
            offset = this.fromLineAndColumn(line, column);
          }
          let origin = this.origin(line, column, endLine, endColumn);
          if (origin) {
            result = new CssSyntaxError2(
              message,
              origin.endLine === void 0 ? origin.line : { column: origin.column, line: origin.line },
              origin.endLine === void 0 ? origin.column : { column: origin.endColumn, line: origin.endLine },
              origin.source,
              origin.file,
              opts.plugin
            );
          } else {
            result = new CssSyntaxError2(
              message,
              endLine === void 0 ? line : { column, line },
              endLine === void 0 ? column : { column: endColumn, line: endLine },
              this.css,
              this.file,
              opts.plugin
            );
          }
          result.input = {
            column,
            endColumn,
            endLine,
            endOffset,
            line,
            offset,
            source: this.css
          };
          if (this.file) {
            if (pathToFileURL) {
              result.input.url = pathToFileURL(this.file).toString();
            }
            result.input.file = this.file;
          }
          return result;
        }
        fromLineAndColumn(line, column) {
          let lineToIndex = getLineToIndex(this);
          let index = lineToIndex[line - 1];
          return index + column - 1;
        }
        fromOffset(offset) {
          let lineToIndex = getLineToIndex(this);
          let lastLine = lineToIndex[lineToIndex.length - 1];
          let min = 0;
          if (offset >= lastLine) {
            min = lineToIndex.length - 1;
          } else {
            let max = lineToIndex.length - 2;
            let mid;
            while (min < max) {
              mid = min + (max - min >> 1);
              if (offset < lineToIndex[mid]) {
                max = mid - 1;
              } else if (offset >= lineToIndex[mid + 1]) {
                min = mid + 1;
              } else {
                min = mid;
                break;
              }
            }
          }
          return {
            col: offset - lineToIndex[min] + 1,
            line: min + 1
          };
        }
        mapResolve(file) {
          if (/^\w+:\/\//.test(file)) {
            return file;
          }
          return resolve(this.map.consumer().sourceRoot || this.map.root || ".", file);
        }
        origin(line, column, endLine, endColumn) {
          if (!this.map) return false;
          let consumer = this.map.consumer();
          let from = consumer.originalPositionFor({ column: column - 1, line });
          if (!from.source) return false;
          let to;
          if (typeof endLine === "number") {
            let toPosition = consumer.originalPositionFor({
              column: endColumn - 1,
              line: endLine
            });
            if (toPosition.source) to = toPosition;
          }
          let fromUrl;
          if (isAbsolute(from.source)) {
            fromUrl = pathToFileURL(from.source);
          } else {
            fromUrl = new URL(
              from.source,
              this.map.consumer().sourceRoot || pathToFileURL(this.map.mapFile)
            );
          }
          let result = {
            column: from.column + 1,
            endColumn: to && to.column + 1,
            endLine: to && to.line,
            line: from.line,
            url: fromUrl.toString()
          };
          if (fromUrl.protocol === "file:") {
            if (fileURLToPath) {
              result.file = fileURLToPath(fromUrl);
            } else {
              throw new Error(`file: protocol is not available in this PostCSS build`);
            }
          }
          let source = consumer.sourceContentFor(from.source);
          if (source) result.source = source;
          return result;
        }
        toJSON() {
          let json = {};
          for (let name of ["hasBOM", "css", "file", "id"]) {
            if (this[name] != null) {
              json[name] = this[name];
            }
          }
          if (this.map) {
            json.map = { ...this.map };
            if (json.map.consumerCache) {
              json.map.consumerCache = void 0;
            }
          }
          return json;
        }
      };
      module.exports = Input2;
      Input2.default = Input2;
      if (terminalHighlight && terminalHighlight.registerInput) {
        terminalHighlight.registerInput(Input2);
      }
    }
  });

  // node_modules/postcss/lib/root.js
  var require_root = __commonJS({
    "node_modules/postcss/lib/root.js"(exports, module) {
      "use strict";
      var Container2 = require_container();
      var LazyResult;
      var Processor2;
      var Root2 = class extends Container2 {
        constructor(defaults) {
          super(defaults);
          this.type = "root";
          if (!this.nodes) this.nodes = [];
        }
        normalize(child, sample, type) {
          let keepBefore = /* @__PURE__ */ new Set();
          for (let node of Array.isArray(child) ? child : [child]) {
            if (node && typeof node === "object" && !node.parent && node.raws && typeof node.raws.before !== "undefined") {
              keepBefore.add(node.raws);
            }
          }
          let nodes = super.normalize(child);
          if (sample) {
            if (type === "prepend") {
              if (this.nodes.length > 1) {
                sample.raws.before = this.nodes[1].raws.before;
              } else {
                delete sample.raws.before;
              }
            } else if (this.first !== sample) {
              for (let node of nodes) {
                if (!keepBefore.has(node.raws)) {
                  node.raws.before = sample.raws.before;
                }
              }
            }
          }
          return nodes;
        }
        removeChild(child, ignore) {
          let index = this.index(child);
          if (!ignore && index === 0 && this.nodes.length > 1) {
            this.nodes[1].raws.before = this.nodes[index].raws.before;
          }
          return super.removeChild(child);
        }
        toResult(opts = {}) {
          let lazy = new LazyResult(new Processor2(), this, opts);
          return lazy.stringify();
        }
      };
      Root2.registerLazyResult = (dependant) => {
        LazyResult = dependant;
      };
      Root2.registerProcessor = (dependant) => {
        Processor2 = dependant;
      };
      module.exports = Root2;
      Root2.default = Root2;
      Container2.registerRoot(Root2);
    }
  });

  // node_modules/postcss/lib/list.js
  var require_list = __commonJS({
    "node_modules/postcss/lib/list.js"(exports, module) {
      "use strict";
      var list2 = {
        comma(string) {
          return list2.split(string, [","], true);
        },
        space(string) {
          let spaces = [" ", "\n", "	"];
          return list2.split(string, spaces);
        },
        split(string, separators, last) {
          let array = [];
          let current = "";
          let split = false;
          let func = 0;
          let inQuote = false;
          let prevQuote = "";
          let escape = false;
          for (let letter of string) {
            if (escape) {
              escape = false;
            } else if (letter === "\\") {
              escape = true;
            } else if (inQuote) {
              if (letter === prevQuote) {
                inQuote = false;
              }
            } else if (letter === '"' || letter === "'") {
              inQuote = true;
              prevQuote = letter;
            } else if (letter === "(") {
              func += 1;
            } else if (letter === ")") {
              if (func > 0) func -= 1;
            } else if (func === 0) {
              if (separators.includes(letter)) split = true;
            }
            if (split) {
              if (current !== "") array.push(current.trim());
              current = "";
              split = false;
            } else {
              current += letter;
            }
          }
          if (last || current !== "") array.push(current.trim());
          return array;
        }
      };
      module.exports = list2;
      list2.default = list2;
    }
  });

  // node_modules/postcss/lib/rule.js
  var require_rule = __commonJS({
    "node_modules/postcss/lib/rule.js"(exports, module) {
      "use strict";
      var Container2 = require_container();
      var list2 = require_list();
      var Rule2 = class extends Container2 {
        get selectors() {
          return list2.comma(this.selector);
        }
        set selectors(values) {
          let match = this.selector ? this.selector.match(/,\s*/) : null;
          let sep = match ? match[0] : "," + this.raw("between", "beforeOpen");
          this.selector = values.join(sep);
        }
        constructor(defaults) {
          super(defaults);
          this.type = "rule";
          if (!this.nodes) this.nodes = [];
        }
      };
      module.exports = Rule2;
      Rule2.default = Rule2;
      Container2.registerRule(Rule2);
    }
  });

  // node_modules/postcss/lib/fromJSON.js
  var require_fromJSON = __commonJS({
    "node_modules/postcss/lib/fromJSON.js"(exports, module) {
      "use strict";
      var AtRule2 = require_at_rule();
      var Comment2 = require_comment();
      var Declaration2 = require_declaration();
      var Input2 = require_input();
      var PreviousMap = require_previous_map();
      var Root2 = require_root();
      var Rule2 = require_rule();
      function hydrateInputs(json, inputs) {
        if (!json.inputs) return inputs;
        return json.inputs.map((input) => {
          let inputHydrated = { ...input, __proto__: Input2.prototype };
          if (inputHydrated.map) {
            inputHydrated.map = {
              ...inputHydrated.map,
              __proto__: PreviousMap.prototype
            };
          }
          return inputHydrated;
        });
      }
      function constructNode(json, inputs, children) {
        let defaults = { ...json };
        delete defaults.inputs;
        delete defaults.nodes;
        if (defaults.source) {
          let { inputId, ...source } = defaults.source;
          defaults.source = source;
          if (inputId != null) {
            defaults.source.input = inputs[inputId];
          }
        }
        let node;
        if (defaults.type === "root") {
          node = new Root2(defaults);
        } else if (defaults.type === "decl") {
          node = new Declaration2(defaults);
        } else if (defaults.type === "rule") {
          node = new Rule2(defaults);
        } else if (defaults.type === "comment") {
          node = new Comment2(defaults);
        } else if (defaults.type === "atrule") {
          node = new AtRule2(defaults);
        } else {
          throw new Error("Unknown node type: " + json.type);
        }
        if (children) {
          node.nodes = children;
          for (let child of children) child.parent = node;
        }
        return node;
      }
      function fromJSON2(json, inputs) {
        if (Array.isArray(json)) return json.map((n) => fromJSON2(n));
        let result;
        let stack = [
          { childIndex: 0, children: [], inputs: hydrateInputs(json, inputs), json }
        ];
        while (stack.length > 0) {
          let frame = stack[stack.length - 1];
          let jsonNodes = frame.json.nodes;
          if (jsonNodes && frame.childIndex < jsonNodes.length) {
            let childJson = jsonNodes[frame.childIndex];
            frame.childIndex += 1;
            stack.push({
              childIndex: 0,
              children: [],
              inputs: hydrateInputs(childJson, frame.inputs),
              json: childJson
            });
            continue;
          }
          stack.pop();
          let node = constructNode(
            frame.json,
            frame.inputs,
            jsonNodes ? frame.children : void 0
          );
          if (stack.length > 0) {
            stack[stack.length - 1].children.push(node);
          } else {
            result = node;
          }
        }
        return result;
      }
      module.exports = fromJSON2;
      fromJSON2.default = fromJSON2;
    }
  });

  // node_modules/postcss/lib/map-generator.js
  var require_map_generator = __commonJS({
    "node_modules/postcss/lib/map-generator.js"(exports, module) {
      "use strict";
      var { dirname, relative, resolve, sep } = require_path();
      var { SourceMapConsumer, SourceMapGenerator } = require_source_map();
      var { pathToFileURL } = require_url();
      var Input2 = require_input();
      var sourceMapAvailable = Boolean(SourceMapConsumer && SourceMapGenerator);
      var pathAvailable = Boolean(dirname && resolve && relative && sep);
      var MapGenerator = class {
        constructor(stringify2, root2, opts, cssString) {
          this.stringify = stringify2;
          this.mapOpts = opts.map || {};
          this.root = root2;
          this.opts = opts;
          this.css = cssString;
          this.originalCSS = cssString;
          this.usesFileUrls = !this.mapOpts.from && this.mapOpts.absolute;
          this.memoizedFileURLs = /* @__PURE__ */ new Map();
          this.memoizedPaths = /* @__PURE__ */ new Map();
          this.memoizedURLs = /* @__PURE__ */ new Map();
        }
        addAnnotation() {
          let content;
          if (this.isInline()) {
            content = "data:application/json;base64," + this.toBase64(this.map.toString());
          } else if (typeof this.mapOpts.annotation === "string") {
            content = this.mapOpts.annotation;
          } else if (typeof this.mapOpts.annotation === "function") {
            content = this.mapOpts.annotation(this.opts.to, this.root);
          } else {
            content = this.outputFile() + ".map";
          }
          let eol = "\n";
          if (this.css.includes("\r\n")) eol = "\r\n";
          this.css += eol + "/*# sourceMappingURL=" + content + " */";
        }
        applyPrevMaps() {
          for (let prev of this.previous()) {
            let from = this.toUrl(this.path(prev.file));
            let root2 = prev.root || dirname(prev.file);
            let map;
            if (this.mapOpts.sourcesContent === false) {
              map = new SourceMapConsumer(prev.text);
              if (map.sourcesContent) {
                map.sourcesContent = null;
              }
            } else {
              map = prev.consumer();
            }
            this.map.applySourceMap(map, from, this.toUrl(this.path(root2)));
          }
        }
        clearAnnotation() {
          if (this.mapOpts.annotation === false) return;
          if (this.root) {
            let node;
            for (let i = this.root.nodes.length - 1; i >= 0; i--) {
              node = this.root.nodes[i];
              if (node.type !== "comment") continue;
              if (node.text.startsWith("# sourceMappingURL=")) {
                this.root.removeChild(i);
              }
            }
          } else if (this.css) {
            let startIndex;
            while ((startIndex = this.css.lastIndexOf("/*#")) !== -1) {
              let endIndex = this.css.indexOf("*/", startIndex + 3);
              if (endIndex === -1) break;
              while (startIndex > 0 && this.css[startIndex - 1] === "\n") {
                startIndex--;
              }
              this.css = this.css.slice(0, startIndex) + this.css.slice(endIndex + 2);
            }
          }
        }
        generate() {
          this.clearAnnotation();
          if (pathAvailable && sourceMapAvailable && this.isMap()) {
            return this.generateMap();
          } else {
            let result = "";
            this.stringify(this.root, (i) => {
              result += i;
            });
            return [result];
          }
        }
        generateMap() {
          if (this.root) {
            this.generateString();
          } else if (this.previous().length === 1) {
            let prev = this.previous()[0].consumer();
            prev.file = this.outputFile();
            this.map = SourceMapGenerator.fromSourceMap(prev, {
              ignoreInvalidMapping: true
            });
          } else {
            this.map = new SourceMapGenerator({
              file: this.outputFile(),
              ignoreInvalidMapping: true
            });
            this.map.addMapping({
              generated: { column: 0, line: 1 },
              original: { column: 0, line: 1 },
              source: this.opts.from ? this.toUrl(this.path(this.opts.from)) : "<no source>"
            });
          }
          if (this.isSourcesContent()) this.setSourcesContent();
          if (this.root && this.previous().length > 0) this.applyPrevMaps();
          if (this.isAnnotation()) this.addAnnotation();
          if (this.isInline()) {
            return [this.css];
          } else {
            return [this.css, this.map];
          }
        }
        generateString() {
          this.css = "";
          this.map = new SourceMapGenerator({
            file: this.outputFile(),
            ignoreInvalidMapping: true
          });
          let line = 1;
          let column = 1;
          let noSource = "<no source>";
          let mapping = {
            generated: { column: 0, line: 0 },
            original: { column: 0, line: 0 },
            source: ""
          };
          let last, lines;
          this.stringify(this.root, (str, node, type) => {
            this.css += str;
            if (node && type !== "end") {
              mapping.generated.line = line;
              mapping.generated.column = column - 1;
              if (node.source && node.source.start) {
                mapping.source = this.sourcePath(node);
                mapping.original.line = node.source.start.line;
                mapping.original.column = node.source.start.column - 1;
                this.map.addMapping(mapping);
              } else {
                mapping.source = noSource;
                mapping.original.line = 1;
                mapping.original.column = 0;
                this.map.addMapping(mapping);
              }
            }
            lines = str.match(/\n/g);
            if (lines) {
              line += lines.length;
              last = str.lastIndexOf("\n");
              column = str.length - last;
            } else {
              column += str.length;
            }
            if (node && type !== "start") {
              let p = node.parent || { raws: {} };
              let childless = node.type === "decl" || node.type === "atrule" && !node.nodes;
              if (!childless || node !== p.last || p.raws.semicolon) {
                if (node.source && node.source.end) {
                  mapping.source = this.sourcePath(node);
                  mapping.original.line = node.source.end.line;
                  mapping.original.column = node.source.end.column - 1;
                  mapping.generated.line = line;
                  mapping.generated.column = column - 2;
                  this.map.addMapping(mapping);
                } else {
                  mapping.source = noSource;
                  mapping.original.line = 1;
                  mapping.original.column = 0;
                  mapping.generated.line = line;
                  mapping.generated.column = column - 1;
                  this.map.addMapping(mapping);
                }
              }
            }
          });
        }
        isAnnotation() {
          if (this.isInline()) {
            return true;
          }
          if (typeof this.mapOpts.annotation !== "undefined") {
            return this.mapOpts.annotation;
          }
          if (this.previous().length) {
            return this.previous().some((i) => i.annotation);
          }
          return true;
        }
        isInline() {
          if (typeof this.mapOpts.inline !== "undefined") {
            return this.mapOpts.inline;
          }
          let annotation = this.mapOpts.annotation;
          if (typeof annotation !== "undefined" && annotation !== true) {
            return false;
          }
          if (this.previous().length) {
            return this.previous().some((i) => i.inline);
          }
          return true;
        }
        isMap() {
          if (typeof this.opts.map !== "undefined") {
            return !!this.opts.map;
          }
          return this.previous().length > 0;
        }
        isSourcesContent() {
          if (typeof this.mapOpts.sourcesContent !== "undefined") {
            return this.mapOpts.sourcesContent;
          }
          if (this.previous().length) {
            return this.previous().some((i) => i.withContent());
          }
          return true;
        }
        outputFile() {
          if (this.opts.to) {
            return this.path(this.opts.to);
          } else if (this.opts.from) {
            return this.path(this.opts.from);
          } else {
            return "to.css";
          }
        }
        path(file) {
          if (this.mapOpts.absolute) return file;
          if (file.charCodeAt(0) === 60) return file;
          if (/^\w+:\/\//.test(file)) return file;
          let cached = this.memoizedPaths.get(file);
          if (cached) return cached;
          let from = this.opts.to ? dirname(this.opts.to) : ".";
          if (typeof this.mapOpts.annotation === "string") {
            from = dirname(resolve(from, this.mapOpts.annotation));
          }
          let path = relative(from, file);
          this.memoizedPaths.set(file, path);
          return path;
        }
        previous() {
          if (!this.previousMaps) {
            this.previousMaps = [];
            if (this.root) {
              this.root.walk((node) => {
                if (node.source && node.source.input.map) {
                  let map = node.source.input.map;
                  if (!this.previousMaps.includes(map)) {
                    this.previousMaps.push(map);
                  }
                }
              });
            } else {
              let input = new Input2(this.originalCSS, this.opts);
              if (input.map) this.previousMaps.push(input.map);
            }
          }
          return this.previousMaps;
        }
        setSourcesContent() {
          let already = {};
          if (this.root) {
            this.root.walk((node) => {
              if (node.source) {
                let from = node.source.input.from;
                if (from && !already[from]) {
                  already[from] = true;
                  let fromUrl = this.usesFileUrls ? this.toFileUrl(from) : this.toUrl(this.path(from));
                  this.map.setSourceContent(fromUrl, node.source.input.css);
                }
              }
            });
          } else if (this.css) {
            let from = this.opts.from ? this.toUrl(this.path(this.opts.from)) : "<no source>";
            this.map.setSourceContent(from, this.css);
          }
        }
        sourcePath(node) {
          if (this.mapOpts.from) {
            return this.toUrl(this.mapOpts.from);
          } else if (this.usesFileUrls) {
            return this.toFileUrl(node.source.input.from);
          } else {
            return this.toUrl(this.path(node.source.input.from));
          }
        }
        toBase64(str) {
          if (Buffer) {
            return Buffer.from(str).toString("base64");
          } else {
            return window.btoa(unescape(encodeURIComponent(str)));
          }
        }
        toFileUrl(path) {
          let cached = this.memoizedFileURLs.get(path);
          if (cached) return cached;
          if (pathToFileURL) {
            let fileURL = pathToFileURL(path).toString();
            this.memoizedFileURLs.set(path, fileURL);
            return fileURL;
          } else {
            throw new Error(
              "`map.absolute` option is not available in this PostCSS build"
            );
          }
        }
        toUrl(path) {
          let cached = this.memoizedURLs.get(path);
          if (cached) return cached;
          if (sep === "\\") {
            path = path.replace(/\\/g, "/");
          }
          let url = encodeURI(path).replace(/[#?]/g, encodeURIComponent);
          this.memoizedURLs.set(path, url);
          return url;
        }
      };
      module.exports = MapGenerator;
    }
  });

  // node_modules/postcss/lib/tokenize.js
  var require_tokenize = __commonJS({
    "node_modules/postcss/lib/tokenize.js"(exports, module) {
      "use strict";
      var SINGLE_QUOTE = "'".charCodeAt(0);
      var DOUBLE_QUOTE = '"'.charCodeAt(0);
      var BACKSLASH = "\\".charCodeAt(0);
      var SLASH = "/".charCodeAt(0);
      var NEWLINE = "\n".charCodeAt(0);
      var SPACE = " ".charCodeAt(0);
      var FEED = "\f".charCodeAt(0);
      var TAB = "	".charCodeAt(0);
      var CR = "\r".charCodeAt(0);
      var OPEN_SQUARE = "[".charCodeAt(0);
      var CLOSE_SQUARE = "]".charCodeAt(0);
      var OPEN_PARENTHESES = "(".charCodeAt(0);
      var CLOSE_PARENTHESES = ")".charCodeAt(0);
      var OPEN_CURLY = "{".charCodeAt(0);
      var CLOSE_CURLY = "}".charCodeAt(0);
      var SEMICOLON = ";".charCodeAt(0);
      var ASTERISK = "*".charCodeAt(0);
      var COLON = ":".charCodeAt(0);
      var AT = "@".charCodeAt(0);
      var RE_AT_END = /[\t\n\f\r "#'()/;[\\\]{}]/g;
      var RE_WORD_END = /[\t\n\f\r !"#'():;@[\\\]{}]|\/(?=\*)/g;
      var RE_BAD_BRACKET = /.[\r\n"'(/\\]/;
      var RE_HEX_ESCAPE = /[\da-f]/i;
      module.exports = function tokenizer(input, options = {}) {
        let css = input.css.valueOf();
        let ignore = options.ignoreErrors;
        let code, content, escape, next, quote;
        let currentToken, escaped, escapePos, n, prev;
        let length = css.length;
        let pos = 0;
        let buffer = [];
        let returned = [];
        let lastBadParen = -1;
        function position() {
          return pos;
        }
        function unclosed(what) {
          throw input.error("Unclosed " + what, pos);
        }
        function endOfFile() {
          return returned.length === 0 && pos >= length;
        }
        function nextToken(opts) {
          if (returned.length) return returned.pop();
          if (pos >= length) return;
          let ignoreUnclosed = opts ? opts.ignoreUnclosed : false;
          code = css.charCodeAt(pos);
          switch (code) {
            case NEWLINE:
            case SPACE:
            case TAB:
            case CR:
            case FEED: {
              next = pos;
              do {
                next += 1;
                code = css.charCodeAt(next);
              } while (code === SPACE || code === NEWLINE || code === TAB || code === CR || code === FEED);
              currentToken = ["space", css.slice(pos, next)];
              pos = next - 1;
              break;
            }
            case OPEN_SQUARE:
            case CLOSE_SQUARE:
            case OPEN_CURLY:
            case CLOSE_CURLY:
            case COLON:
            case SEMICOLON:
            case CLOSE_PARENTHESES: {
              let controlChar = String.fromCharCode(code);
              currentToken = [controlChar, controlChar, pos];
              break;
            }
            case OPEN_PARENTHESES: {
              prev = buffer.length ? buffer.pop()[1] : "";
              n = css.charCodeAt(pos + 1);
              if (prev === "url" && n !== SINGLE_QUOTE && n !== DOUBLE_QUOTE && n !== SPACE && n !== NEWLINE && n !== TAB && n !== FEED && n !== CR) {
                next = pos;
                do {
                  escaped = false;
                  next = css.indexOf(")", next + 1);
                  if (next === -1) {
                    if (ignore || ignoreUnclosed) {
                      next = pos;
                      break;
                    } else {
                      unclosed("bracket");
                    }
                  }
                  escapePos = next;
                  while (css.charCodeAt(escapePos - 1) === BACKSLASH) {
                    escapePos -= 1;
                    escaped = !escaped;
                  }
                } while (escaped);
                currentToken = ["brackets", css.slice(pos, next + 1), pos, next];
                pos = next;
              } else if (pos <= lastBadParen) {
                currentToken = ["(", "(", pos];
              } else {
                next = css.indexOf(")", pos + 1);
                content = css.slice(pos, next + 1);
                if (next === -1 || RE_BAD_BRACKET.test(content)) {
                  lastBadParen = next === -1 ? length : next;
                  currentToken = ["(", "(", pos];
                } else {
                  currentToken = ["brackets", content, pos, next];
                  pos = next;
                }
              }
              break;
            }
            case SINGLE_QUOTE:
            case DOUBLE_QUOTE: {
              quote = code === SINGLE_QUOTE ? "'" : '"';
              next = pos;
              do {
                escaped = false;
                next = css.indexOf(quote, next + 1);
                if (next === -1) {
                  if (ignore || ignoreUnclosed) {
                    next = pos + 1;
                    break;
                  } else {
                    unclosed("string");
                  }
                }
                escapePos = next;
                while (css.charCodeAt(escapePos - 1) === BACKSLASH) {
                  escapePos -= 1;
                  escaped = !escaped;
                }
              } while (escaped);
              currentToken = ["string", css.slice(pos, next + 1), pos, next];
              pos = next;
              break;
            }
            case AT: {
              RE_AT_END.lastIndex = pos + 1;
              RE_AT_END.test(css);
              if (RE_AT_END.lastIndex === 0) {
                next = css.length - 1;
              } else {
                next = RE_AT_END.lastIndex - 2;
              }
              currentToken = ["at-word", css.slice(pos, next + 1), pos, next];
              pos = next;
              break;
            }
            case BACKSLASH: {
              next = pos;
              escape = true;
              while (css.charCodeAt(next + 1) === BACKSLASH) {
                next += 1;
                escape = !escape;
              }
              code = css.charCodeAt(next + 1);
              if (escape && code !== SLASH && code !== SPACE && code !== NEWLINE && code !== TAB && code !== CR && code !== FEED) {
                next += 1;
                if (RE_HEX_ESCAPE.test(css.charAt(next))) {
                  while (RE_HEX_ESCAPE.test(css.charAt(next + 1))) {
                    next += 1;
                  }
                  if (css.charCodeAt(next + 1) === SPACE) {
                    next += 1;
                  }
                }
              }
              currentToken = ["word", css.slice(pos, next + 1), pos, next];
              pos = next;
              break;
            }
            default: {
              if (code === SLASH && css.charCodeAt(pos + 1) === ASTERISK) {
                next = css.indexOf("*/", pos + 2) + 1;
                if (next === 0) {
                  if (ignore || ignoreUnclosed) {
                    next = css.length;
                  } else {
                    unclosed("comment");
                  }
                }
                currentToken = ["comment", css.slice(pos, next + 1), pos, next];
                pos = next;
              } else {
                RE_WORD_END.lastIndex = pos + 1;
                RE_WORD_END.test(css);
                if (RE_WORD_END.lastIndex === 0) {
                  next = css.length - 1;
                } else {
                  next = RE_WORD_END.lastIndex - 2;
                }
                currentToken = ["word", css.slice(pos, next + 1), pos, next];
                buffer.push(currentToken);
                pos = next;
              }
              break;
            }
          }
          pos++;
          return currentToken;
        }
        function back(token) {
          returned.push(token);
        }
        return {
          back,
          endOfFile,
          nextToken,
          position
        };
      };
    }
  });

  // node_modules/postcss/lib/parser.js
  var require_parser = __commonJS({
    "node_modules/postcss/lib/parser.js"(exports, module) {
      "use strict";
      var AtRule2 = require_at_rule();
      var Comment2 = require_comment();
      var Declaration2 = require_declaration();
      var Root2 = require_root();
      var Rule2 = require_rule();
      var tokenizer = require_tokenize();
      var SAFE_COMMENT_NEIGHBOR = {
        empty: true,
        space: true
      };
      function findLastWithPosition(tokens) {
        for (let i = tokens.length - 1; i >= 0; i--) {
          let token = tokens[i];
          let pos = token[3] || token[2];
          if (pos) return pos;
        }
      }
      function tokensToString(tokens, from, to) {
        let result = "";
        for (let i = from; i < to; i++) result += tokens[i][1];
        return result;
      }
      var Parser = class {
        constructor(input) {
          this.input = input;
          this.root = new Root2();
          this.current = this.root;
          this.spaces = "";
          this.semicolon = false;
          this.createTokenizer();
          this.root.source = { input, start: { column: 1, line: 1, offset: 0 } };
        }
        atrule(token) {
          let node = new AtRule2();
          node.name = token[1].slice(1);
          if (node.name === "") {
            this.unnamedAtrule(node, token);
          }
          this.init(node, token[2]);
          let type;
          let prev;
          let shift;
          let last = false;
          let open = false;
          let params = [];
          let brackets = [];
          while (!this.tokenizer.endOfFile()) {
            token = this.tokenizer.nextToken();
            type = token[0];
            if (type === "(" || type === "[") {
              brackets.push(type === "(" ? ")" : "]");
            } else if (type === "{" && brackets.length > 0) {
              brackets.push("}");
            } else if (type === brackets[brackets.length - 1]) {
              brackets.pop();
            }
            if (brackets.length === 0) {
              if (type === ";") {
                node.source.end = this.getPosition(token[2]);
                node.source.end.offset++;
                this.semicolon = true;
                break;
              } else if (type === "{") {
                open = true;
                break;
              } else if (type === "}") {
                if (params.length > 0) {
                  shift = params.length - 1;
                  prev = params[shift];
                  while (prev && prev[0] === "space") {
                    prev = params[--shift];
                  }
                  if (prev) {
                    node.source.end = this.getPosition(prev[3] || prev[2]);
                    node.source.end.offset++;
                  }
                }
                this.end(token);
                break;
              } else {
                params.push(token);
              }
            } else {
              params.push(token);
            }
            if (this.tokenizer.endOfFile()) {
              last = true;
              break;
            }
          }
          node.raws.between = this.spacesAndCommentsFromEnd(params);
          if (params.length) {
            node.raws.afterName = this.spacesAndCommentsFromStart(params);
            this.raw(node, "params", params);
            if (last) {
              token = params[params.length - 1];
              node.source.end = this.getPosition(token[3] || token[2]);
              node.source.end.offset++;
              this.spaces = node.raws.between;
              node.raws.between = "";
            }
          } else {
            node.raws.afterName = "";
            node.params = "";
          }
          if (open) {
            node.nodes = [];
            this.current = node;
          }
        }
        checkMissedSemicolon(tokens) {
          let colon = this.colon(tokens);
          if (colon === false) return;
          let founded = 0;
          let token;
          for (let j = colon - 1; j >= 0; j--) {
            token = tokens[j];
            if (token[0] !== "space") {
              founded += 1;
              if (founded === 2) break;
            }
          }
          throw this.input.error(
            "Missed semicolon",
            token[0] === "word" ? token[3] + 1 : token[2]
          );
        }
        colon(tokens) {
          let brackets = 0;
          let prev, token, type;
          for (let [i, element] of tokens.entries()) {
            token = element;
            type = token[0];
            if (type === "(") {
              brackets += 1;
            }
            if (type === ")") {
              brackets -= 1;
            }
            if (brackets === 0 && type === ":") {
              if (!prev) {
                this.doubleColon(token);
              } else if (prev[0] === "word" && prev[1] === "progid") {
                continue;
              } else {
                return i;
              }
            }
            prev = token;
          }
          return false;
        }
        comment(token) {
          let node = new Comment2();
          this.init(node, token[2]);
          node.source.end = this.getPosition(token[3] || token[2]);
          node.source.end.offset++;
          let text2 = token[1].slice(2, -2);
          if (!text2.trim()) {
            node.text = "";
            node.raws.left = text2;
            node.raws.right = "";
          } else {
            let match = text2.match(/^(\s*)([^]*\S)(\s*)$/);
            node.text = match[2];
            node.raws.left = match[1];
            node.raws.right = match[3];
          }
        }
        createTokenizer() {
          this.tokenizer = tokenizer(this.input);
        }
        decl(tokens, customProperty) {
          let node = new Declaration2();
          this.init(node, tokens[0][2]);
          let last = tokens[tokens.length - 1];
          if (last[0] === ";") {
            this.semicolon = true;
            tokens.pop();
          }
          node.source.end = this.getPosition(
            last[3] || last[2] || findLastWithPosition(tokens)
          );
          node.source.end.offset++;
          let start2 = 0;
          while (tokens[start2][0] !== "word") {
            if (start2 === tokens.length - 1) this.unknownWord([tokens[start2]]);
            start2++;
          }
          node.raws.before += tokensToString(tokens, 0, start2);
          node.source.start = this.getPosition(tokens[start2][2]);
          let propStart = start2;
          while (start2 < tokens.length) {
            let type = tokens[start2][0];
            if (type === ":" || type === "space" || type === "comment") {
              break;
            }
            start2++;
          }
          node.prop = tokensToString(tokens, propStart, start2);
          let betweenStart = start2;
          let token;
          while (start2 < tokens.length) {
            token = tokens[start2];
            start2++;
            if (token[0] === ":") break;
            if (token[0] === "word" && /\w/.test(token[1])) {
              this.unknownWord([token]);
            }
          }
          node.raws.between = tokensToString(tokens, betweenStart, start2);
          if (node.prop[0] === "_" || node.prop[0] === "*") {
            node.raws.before += node.prop[0];
            node.prop = node.prop.slice(1);
          }
          let firstSpacesStart = start2;
          while (start2 < tokens.length) {
            let next = tokens[start2][0];
            if (next !== "space" && next !== "comment") break;
            start2++;
          }
          let firstSpaces = tokens.slice(firstSpacesStart, start2);
          tokens = tokens.slice(start2);
          this.precheckMissedSemicolon(tokens);
          for (let i = tokens.length - 1; i >= 0; i--) {
            token = tokens[i];
            if (token[1].toLowerCase() === "!important") {
              node.important = true;
              let string = this.stringFrom(tokens, i);
              string = this.spacesFromEnd(tokens) + string;
              if (string !== " !important") node.raws.important = string;
              break;
            } else if (token[1].toLowerCase() === "important") {
              let cache = tokens.slice(0);
              let str = "";
              for (let j = i; j > 0; j--) {
                let type = cache[j][0];
                if (str.trim().startsWith("!") && type !== "space") {
                  break;
                }
                str = cache.pop()[1] + str;
              }
              if (str.trim().startsWith("!")) {
                node.important = true;
                node.raws.important = str;
                tokens = cache;
              }
            }
            if (token[0] !== "space" && token[0] !== "comment") {
              break;
            }
          }
          let hasWord = tokens.some((i) => i[0] !== "space" && i[0] !== "comment");
          if (hasWord) {
            node.raws.between += firstSpaces.map((i) => i[1]).join("");
            firstSpaces = [];
          }
          this.raw(node, "value", firstSpaces.concat(tokens), customProperty);
          if (node.value.includes(":") && !customProperty) {
            this.checkMissedSemicolon(tokens);
          }
        }
        doubleColon(token) {
          throw this.input.error(
            "Double colon",
            { offset: token[2] },
            { offset: token[2] + token[1].length }
          );
        }
        emptyRule(token) {
          let node = new Rule2();
          this.init(node, token[2]);
          node.selector = "";
          node.raws.between = "";
          this.current = node;
        }
        end(token) {
          if (this.current.nodes && this.current.nodes.length) {
            this.current.raws.semicolon = this.semicolon;
          }
          this.semicolon = false;
          this.current.raws.after = (this.current.raws.after || "") + this.spaces;
          this.spaces = "";
          if (this.current.parent) {
            this.current.source.end = this.getPosition(token[2]);
            this.current.source.end.offset++;
            this.current = this.current.parent;
          } else {
            this.unexpectedClose(token);
          }
        }
        endFile() {
          if (this.current.parent) this.unclosedBlock();
          if (this.current.nodes && this.current.nodes.length) {
            this.current.raws.semicolon = this.semicolon;
          }
          this.current.raws.after = (this.current.raws.after || "") + this.spaces;
          this.root.source.end = this.getPosition(this.tokenizer.position());
        }
        freeSemicolon(token) {
          this.spaces += token[1];
          if (this.current.nodes) {
            let prev = this.current.nodes[this.current.nodes.length - 1];
            if (prev && prev.type === "rule" && !prev.raws.ownSemicolon) {
              prev.raws.ownSemicolon = this.spaces;
              this.spaces = "";
              prev.source.end = this.getPosition(token[2]);
              prev.source.end.offset += prev.raws.ownSemicolon.length;
            }
          }
        }
        // Helpers
        getPosition(offset) {
          let pos = this.input.fromOffset(offset);
          return {
            column: pos.col,
            line: pos.line,
            offset
          };
        }
        init(node, offset) {
          this.current.push(node);
          node.source = {
            input: this.input,
            start: this.getPosition(offset)
          };
          node.raws.before = this.spaces;
          this.spaces = "";
          if (node.type !== "comment") this.semicolon = false;
        }
        other(start2) {
          let end = false;
          let type = null;
          let colon = false;
          let bracket = null;
          let brackets = [];
          let customProperty = start2[1].startsWith("--");
          let tokens = [];
          let token = start2;
          while (token) {
            type = token[0];
            tokens.push(token);
            if (type === "(" || type === "[") {
              if (!bracket) bracket = token;
              brackets.push(type === "(" ? ")" : "]");
            } else if (customProperty && colon && type === "{") {
              if (!bracket) bracket = token;
              brackets.push("}");
            } else if (brackets.length === 0) {
              if (type === ";") {
                if (colon) {
                  this.decl(tokens, customProperty);
                  return;
                } else {
                  break;
                }
              } else if (type === "{") {
                this.rule(tokens);
                return;
              } else if (type === "}") {
                this.tokenizer.back(tokens.pop());
                end = true;
                break;
              } else if (type === ":") {
                colon = true;
              }
            } else if (type === brackets[brackets.length - 1]) {
              brackets.pop();
              if (brackets.length === 0) bracket = null;
            }
            token = this.tokenizer.nextToken();
          }
          if (this.tokenizer.endOfFile()) end = true;
          if (brackets.length > 0) this.unclosedBracket(bracket);
          if (end && colon) {
            if (!customProperty) {
              while (tokens.length) {
                token = tokens[tokens.length - 1][0];
                if (token !== "space" && token !== "comment") break;
                this.tokenizer.back(tokens.pop());
              }
            }
            this.decl(tokens, customProperty);
          } else {
            this.unknownWord(tokens);
          }
        }
        parse() {
          let token;
          while (!this.tokenizer.endOfFile()) {
            token = this.tokenizer.nextToken();
            switch (token[0]) {
              case "space":
                this.spaces += token[1];
                break;
              case ";":
                this.freeSemicolon(token);
                break;
              case "}":
                this.end(token);
                break;
              case "comment":
                this.comment(token);
                break;
              case "at-word":
                this.atrule(token);
                break;
              case "{":
                this.emptyRule(token);
                break;
              default:
                this.other(token);
                break;
            }
          }
          this.endFile();
        }
        precheckMissedSemicolon() {
        }
        raw(node, prop, tokens, customProperty) {
          let token, type;
          let length = tokens.length;
          let value = "";
          let clean = true;
          let next, prev;
          for (let i = 0; i < length; i += 1) {
            token = tokens[i];
            type = token[0];
            if (type === "space" && i === length - 1 && !customProperty) {
              clean = false;
            } else if (type === "comment") {
              prev = tokens[i - 1] ? tokens[i - 1][0] : "empty";
              next = tokens[i + 1] ? tokens[i + 1][0] : "empty";
              if (!SAFE_COMMENT_NEIGHBOR[prev] && !SAFE_COMMENT_NEIGHBOR[next]) {
                if (value.slice(-1) === ",") {
                  clean = false;
                } else {
                  value += token[1];
                }
              } else {
                clean = false;
              }
            } else {
              value += token[1];
            }
          }
          if (!clean) {
            let raw = tokens.reduce((all, i) => all + i[1], "");
            node.raws[prop] = { raw, value };
          }
          node[prop] = value;
        }
        rule(tokens) {
          tokens.pop();
          let node = new Rule2();
          this.init(node, tokens[0][2]);
          node.raws.between = this.spacesAndCommentsFromEnd(tokens);
          this.raw(node, "selector", tokens);
          this.current = node;
        }
        spacesAndCommentsFromEnd(tokens) {
          let lastTokenType;
          let spaces = "";
          while (tokens.length) {
            lastTokenType = tokens[tokens.length - 1][0];
            if (lastTokenType !== "space" && lastTokenType !== "comment") break;
            spaces = tokens.pop()[1] + spaces;
          }
          return spaces;
        }
        // Errors
        spacesAndCommentsFromStart(tokens) {
          let next;
          let spaces = "";
          while (tokens.length) {
            next = tokens[0][0];
            if (next !== "space" && next !== "comment") break;
            spaces += tokens.shift()[1];
          }
          return spaces;
        }
        spacesFromEnd(tokens) {
          let lastTokenType;
          let spaces = "";
          while (tokens.length) {
            lastTokenType = tokens[tokens.length - 1][0];
            if (lastTokenType !== "space") break;
            spaces = tokens.pop()[1] + spaces;
          }
          return spaces;
        }
        stringFrom(tokens, from) {
          let result = "";
          for (let i = from; i < tokens.length; i++) {
            result += tokens[i][1];
          }
          tokens.splice(from, tokens.length - from);
          return result;
        }
        unclosedBlock() {
          let pos = this.current.source.start;
          throw this.input.error("Unclosed block", pos.line, pos.column);
        }
        unclosedBracket(bracket) {
          throw this.input.error(
            "Unclosed bracket",
            { offset: bracket[2] },
            { offset: bracket[2] + 1 }
          );
        }
        unexpectedClose(token) {
          throw this.input.error(
            "Unexpected }",
            { offset: token[2] },
            { offset: token[2] + 1 }
          );
        }
        unknownWord(tokens) {
          throw this.input.error(
            "Unknown word " + tokens[0][1],
            { offset: tokens[0][2] },
            { offset: tokens[0][2] + tokens[0][1].length }
          );
        }
        unnamedAtrule(node, token) {
          throw this.input.error(
            "At-rule without name",
            { offset: token[2] },
            { offset: token[2] + token[1].length }
          );
        }
      };
      module.exports = Parser;
    }
  });

  // node_modules/postcss/lib/parse.js
  var require_parse = __commonJS({
    "node_modules/postcss/lib/parse.js"(exports, module) {
      "use strict";
      var Container2 = require_container();
      var Input2 = require_input();
      var Parser = require_parser();
      function parse2(css, opts) {
        let input = new Input2(css, opts);
        let parser = new Parser(input);
        try {
          parser.parse();
        } catch (e) {
          if (true) {
            if (e.name === "CssSyntaxError" && opts && opts.from) {
              if (/\.scss$/i.test(opts.from)) {
                e.message += "\nYou tried to parse SCSS with the standard CSS parser; try again with the postcss-scss parser";
              } else if (/\.sass/i.test(opts.from)) {
                e.message += "\nYou tried to parse Sass with the standard CSS parser; try again with the postcss-sass parser";
              } else if (/\.less$/i.test(opts.from)) {
                e.message += "\nYou tried to parse Less with the standard CSS parser; try again with the postcss-less parser";
              }
            }
          }
          throw e;
        }
        return parser.root;
      }
      module.exports = parse2;
      parse2.default = parse2;
      Container2.registerParse(parse2);
    }
  });

  // node_modules/postcss/lib/warning.js
  var require_warning = __commonJS({
    "node_modules/postcss/lib/warning.js"(exports, module) {
      "use strict";
      var Container2 = require_container();
      var { my } = require_symbols();
      var Warning2 = class {
        constructor(text2, opts = {}) {
          this.type = "warning";
          this.text = text2;
          if (opts.node && opts.node.source) {
            if (!opts.node[my]) {
              Container2.rebuild(opts.node);
            }
            let range = opts.node.rangeBy(opts);
            this.line = range.start.line;
            this.column = range.start.column;
            this.endLine = range.end.line;
            this.endColumn = range.end.column;
          }
          for (let opt in opts) this[opt] = opts[opt];
        }
        toString() {
          if (this.node) {
            return this.node.error(this.text, {
              index: this.index,
              plugin: this.plugin,
              word: this.word
            }).message;
          }
          if (this.plugin) {
            return this.plugin + ": " + this.text;
          }
          return this.text;
        }
      };
      module.exports = Warning2;
      Warning2.default = Warning2;
    }
  });

  // node_modules/postcss/lib/result.js
  var require_result = __commonJS({
    "node_modules/postcss/lib/result.js"(exports, module) {
      "use strict";
      var Warning2 = require_warning();
      var Result2 = class {
        get content() {
          return this.css;
        }
        constructor(processor, root2, opts) {
          this.processor = processor;
          this.messages = [];
          this.root = root2;
          this.opts = opts;
          this.css = "";
          this.map = void 0;
        }
        toString() {
          return this.css;
        }
        warn(text2, opts = {}) {
          if (!opts.plugin) {
            if (this.lastPlugin && this.lastPlugin.postcssPlugin) {
              opts.plugin = this.lastPlugin.postcssPlugin;
            }
          }
          let warning = new Warning2(text2, opts);
          this.messages.push(warning);
          return warning;
        }
        warnings() {
          return this.messages.filter((i) => i.type === "warning");
        }
      };
      module.exports = Result2;
      Result2.default = Result2;
    }
  });

  // node_modules/postcss/lib/warn-once.js
  var require_warn_once = __commonJS({
    "node_modules/postcss/lib/warn-once.js"(exports, module) {
      "use strict";
      var printed = {};
      module.exports = function warnOnce(message) {
        if (printed[message]) return;
        printed[message] = true;
        if (typeof console !== "undefined" && console.warn) {
          console.warn(message);
        }
      };
    }
  });

  // node_modules/postcss/lib/lazy-result.js
  var require_lazy_result = __commonJS({
    "node_modules/postcss/lib/lazy-result.js"(exports, module) {
      "use strict";
      var Container2 = require_container();
      var Document2 = require_document();
      var MapGenerator = require_map_generator();
      var parse2 = require_parse();
      var Result2 = require_result();
      var Root2 = require_root();
      var stringify2 = require_stringify();
      var { isClean, my } = require_symbols();
      var warnOnce = require_warn_once();
      var TYPE_TO_CLASS_NAME = {
        atrule: "AtRule",
        comment: "Comment",
        decl: "Declaration",
        document: "Document",
        root: "Root",
        rule: "Rule"
      };
      var PLUGIN_PROPS = {
        AtRule: true,
        AtRuleExit: true,
        Comment: true,
        CommentExit: true,
        Declaration: true,
        DeclarationExit: true,
        Document: true,
        DocumentExit: true,
        Once: true,
        OnceExit: true,
        postcssPlugin: true,
        prepare: true,
        Root: true,
        RootExit: true,
        Rule: true,
        RuleExit: true
      };
      var NOT_VISITORS = {
        Once: true,
        postcssPlugin: true,
        prepare: true
      };
      var CHILDREN = 0;
      function isPromise(obj) {
        return typeof obj === "object" && typeof obj.then === "function";
      }
      function getEvents(node) {
        let key = false;
        let type = TYPE_TO_CLASS_NAME[node.type];
        if (node.type === "decl") {
          key = node.prop.toLowerCase();
        } else if (node.type === "atrule") {
          key = node.name.toLowerCase();
        }
        if (key && node.append) {
          return [
            type,
            type + "-" + key,
            CHILDREN,
            type + "Exit",
            type + "Exit-" + key
          ];
        } else if (key) {
          return [type, type + "-" + key, type + "Exit", type + "Exit-" + key];
        } else if (node.append) {
          return [type, CHILDREN, type + "Exit"];
        } else {
          return [type, type + "Exit"];
        }
      }
      function toStack(node) {
        let events;
        if (node.type === "document") {
          events = ["Document", CHILDREN, "DocumentExit"];
        } else if (node.type === "root") {
          events = ["Root", CHILDREN, "RootExit"];
        } else {
          events = getEvents(node);
        }
        return {
          eventIndex: 0,
          events,
          iterator: 0,
          node,
          visitorIndex: 0,
          visitors: []
        };
      }
      function cleanMarks(node) {
        let stack = [node];
        while (stack.length > 0) {
          let next = stack.pop();
          next[isClean] = false;
          if (next.nodes) {
            for (let i of next.nodes) stack.push(i);
          }
        }
        return node;
      }
      var postcss2 = {};
      var LazyResult = class _LazyResult {
        get content() {
          return this.stringify().content;
        }
        get css() {
          return this.stringify().css;
        }
        get map() {
          return this.stringify().map;
        }
        get messages() {
          return this.sync().messages;
        }
        get opts() {
          return this.result.opts;
        }
        get processor() {
          return this.result.processor;
        }
        get root() {
          return this.sync().root;
        }
        get [Symbol.toStringTag]() {
          return "LazyResult";
        }
        constructor(processor, css, opts) {
          this.stringified = false;
          this.processed = false;
          let root2;
          if (typeof css === "object" && css !== null && (css.type === "root" || css.type === "document")) {
            root2 = cleanMarks(css);
          } else if (css instanceof _LazyResult || css instanceof Result2) {
            root2 = cleanMarks(css.root);
            if (css.map) {
              if (typeof opts.map === "undefined") opts.map = {};
              if (!opts.map.inline) opts.map.inline = false;
              opts.map.prev = css.map;
            }
          } else {
            let parser = parse2;
            if (opts.syntax) parser = opts.syntax.parse;
            if (opts.parser) parser = opts.parser;
            if (parser.parse) parser = parser.parse;
            try {
              root2 = parser(css, opts);
            } catch (error) {
              this.processed = true;
              this.error = error;
            }
            if (root2 && !root2[my]) {
              Container2.rebuild(root2);
            }
          }
          this.result = new Result2(processor, root2, opts);
          this.helpers = { ...postcss2, postcss: postcss2, result: this.result };
          this.plugins = this.processor.plugins.map((plugin2) => {
            if (typeof plugin2 === "object" && plugin2.prepare) {
              return { ...plugin2, ...plugin2.prepare(this.result) };
            } else {
              return plugin2;
            }
          });
        }
        async() {
          if (this.error) return Promise.reject(this.error);
          if (this.processed) return Promise.resolve(this.result);
          if (!this.processing) {
            this.processing = this.runAsync();
          }
          return this.processing;
        }
        catch(onRejected) {
          return this.async().catch(onRejected);
        }
        finally(onFinally) {
          return this.async().then(onFinally, onFinally);
        }
        getAsyncError() {
          throw new Error("Use process(css).then(cb) to work with async plugins");
        }
        handleError(error, node) {
          let plugin2 = this.result.lastPlugin;
          try {
            if (node) node.addToError(error);
            this.error = error;
            if (error.name === "CssSyntaxError" && !error.plugin) {
              error.plugin = plugin2.postcssPlugin;
              error.setMessage();
            } else if (plugin2.postcssVersion) {
              if (true) {
                let pluginName = plugin2.postcssPlugin;
                let pluginVer = plugin2.postcssVersion;
                let runtimeVer = this.result.processor.version;
                let a = pluginVer.split(".");
                let b = runtimeVer.split(".");
                if (a[0] !== b[0] || parseInt(a[1]) > parseInt(b[1])) {
                  console.error(
                    "Unknown error from PostCSS plugin. Your current PostCSS version is " + runtimeVer + ", but " + pluginName + " uses " + pluginVer + ". Perhaps this is the source of the error below."
                  );
                }
              }
            }
          } catch (err) {
            if (console && console.error) console.error(err);
          }
          return error;
        }
        prepareVisitors() {
          this.listeners = {};
          let add = (plugin2, type, cb) => {
            if (!this.listeners[type]) this.listeners[type] = [];
            this.listeners[type].push([plugin2, cb]);
          };
          for (let plugin2 of this.plugins) {
            if (typeof plugin2 === "object") {
              for (let event in plugin2) {
                if (!PLUGIN_PROPS[event] && /^[A-Z]/.test(event)) {
                  throw new Error(
                    `Unknown event ${event} in ${plugin2.postcssPlugin}. Try to update PostCSS (${this.processor.version} now).`
                  );
                }
                if (!NOT_VISITORS[event]) {
                  if (typeof plugin2[event] === "object") {
                    for (let filter in plugin2[event]) {
                      if (filter === "*") {
                        add(plugin2, event, plugin2[event][filter]);
                      } else {
                        add(
                          plugin2,
                          event + "-" + filter.toLowerCase(),
                          plugin2[event][filter]
                        );
                      }
                    }
                  } else if (typeof plugin2[event] === "function") {
                    add(plugin2, event, plugin2[event]);
                  }
                }
              }
            }
          }
          this.hasListener = Object.keys(this.listeners).length > 0;
        }
        async runAsync() {
          this.plugin = 0;
          for (let i = 0; i < this.plugins.length; i++) {
            let plugin2 = this.plugins[i];
            let promise = this.runOnRoot(plugin2);
            if (isPromise(promise)) {
              try {
                await promise;
              } catch (error) {
                throw this.handleError(error);
              }
            }
          }
          this.prepareVisitors();
          if (this.hasListener) {
            let root2 = this.result.root;
            while (!root2[isClean]) {
              root2[isClean] = true;
              let stack = [toStack(root2)];
              while (stack.length > 0) {
                let promise = this.visitTick(stack);
                if (isPromise(promise)) {
                  try {
                    await promise;
                  } catch (e) {
                    let node = stack[stack.length - 1].node;
                    throw this.handleError(e, node);
                  }
                }
              }
            }
            if (this.listeners.OnceExit) {
              for (let [plugin2, visitor] of this.listeners.OnceExit) {
                this.result.lastPlugin = plugin2;
                try {
                  if (root2.type === "document") {
                    let roots = root2.nodes.map(
                      (subRoot) => visitor(subRoot, this.helpers)
                    );
                    await Promise.all(roots);
                  } else {
                    await visitor(root2, this.helpers);
                  }
                } catch (e) {
                  throw this.handleError(e);
                }
              }
            }
          }
          this.processed = true;
          return this.stringify();
        }
        runOnRoot(plugin2) {
          this.result.lastPlugin = plugin2;
          try {
            if (typeof plugin2 === "object" && plugin2.Once) {
              if (this.result.root.type === "document") {
                let roots = this.result.root.nodes.map(
                  (root2) => plugin2.Once(root2, this.helpers)
                );
                if (isPromise(roots[0])) {
                  return Promise.all(roots);
                }
                return roots;
              }
              return plugin2.Once(this.result.root, this.helpers);
            } else if (typeof plugin2 === "function") {
              return plugin2(this.result.root, this.result);
            }
          } catch (error) {
            throw this.handleError(error);
          }
        }
        stringify() {
          if (this.error) throw this.error;
          if (this.stringified) return this.result;
          this.stringified = true;
          this.sync();
          let opts = this.result.opts;
          let str = stringify2;
          if (opts.syntax) str = opts.syntax.stringify;
          if (opts.stringifier) str = opts.stringifier;
          if (str.stringify) str = str.stringify;
          let rootSource = this.result.root.source;
          if (opts.map === void 0 && !(rootSource && rootSource.input && rootSource.input.map)) {
            let result = "";
            str(this.result.root, (i) => {
              result += i;
            });
            this.result.css = result;
            return this.result;
          }
          let map = new MapGenerator(str, this.result.root, this.result.opts);
          let data = map.generate();
          this.result.css = data[0];
          this.result.map = data[1];
          return this.result;
        }
        sync() {
          if (this.error) throw this.error;
          if (this.processed) return this.result;
          this.processed = true;
          if (this.processing) {
            throw this.getAsyncError();
          }
          for (let plugin2 of this.plugins) {
            let promise = this.runOnRoot(plugin2);
            if (isPromise(promise)) {
              throw this.getAsyncError();
            }
          }
          this.prepareVisitors();
          if (this.hasListener) {
            let root2 = this.result.root;
            while (!root2[isClean]) {
              root2[isClean] = true;
              this.walkSync(root2);
            }
            if (this.listeners.OnceExit) {
              if (root2.type === "document") {
                for (let subRoot of root2.nodes) {
                  this.visitSync(this.listeners.OnceExit, subRoot);
                }
              } else {
                this.visitSync(this.listeners.OnceExit, root2);
              }
            }
          }
          return this.result;
        }
        then(onFulfilled, onRejected) {
          if (true) {
            if (!("from" in this.opts)) {
              warnOnce(
                "Without `from` option PostCSS could generate wrong source map and will not find Browserslist config. Set it to CSS file path or to `undefined` to prevent this warning."
              );
            }
          }
          return this.async().then(onFulfilled, onRejected);
        }
        toString() {
          return this.css;
        }
        visitSync(visitors, node) {
          for (let [plugin2, visitor] of visitors) {
            this.result.lastPlugin = plugin2;
            let promise;
            try {
              promise = visitor(node, this.helpers);
            } catch (e) {
              throw this.handleError(e, node.proxyOf);
            }
            if (node.type !== "root" && node.type !== "document" && !node.parent) {
              return true;
            }
            if (isPromise(promise)) {
              throw this.getAsyncError();
            }
          }
        }
        visitTick(stack) {
          let visit = stack[stack.length - 1];
          let { node, visitors } = visit;
          if (node.type !== "root" && node.type !== "document" && !node.parent) {
            stack.pop();
            return;
          }
          if (visitors.length > 0 && visit.visitorIndex < visitors.length) {
            let [plugin2, visitor] = visitors[visit.visitorIndex];
            visit.visitorIndex += 1;
            if (visit.visitorIndex === visitors.length) {
              visit.visitors = [];
              visit.visitorIndex = 0;
            }
            this.result.lastPlugin = plugin2;
            try {
              return visitor(node.toProxy(), this.helpers);
            } catch (e) {
              throw this.handleError(e, node);
            }
          }
          if (visit.iterator !== 0) {
            let iterator = visit.iterator;
            let child;
            while (child = node.nodes[node.indexes[iterator]]) {
              node.indexes[iterator] += 1;
              if (!child[isClean]) {
                child[isClean] = true;
                stack.push(toStack(child));
                return;
              }
            }
            visit.iterator = 0;
            delete node.indexes[iterator];
          }
          let events = visit.events;
          while (visit.eventIndex < events.length) {
            let event = events[visit.eventIndex];
            visit.eventIndex += 1;
            if (event === CHILDREN) {
              if (node.nodes && node.nodes.length) {
                node[isClean] = true;
                visit.iterator = node.getIterator();
              }
              return;
            } else if (this.listeners[event]) {
              visit.visitors = this.listeners[event];
              return;
            }
          }
          stack.pop();
        }
        walkSync(node) {
          node[isClean] = true;
          let stack = [{ eventIndex: 0, events: getEvents(node), iterator: 0, node }];
          while (stack.length > 0) {
            let visit = stack[stack.length - 1];
            let visitNode = visit.node;
            if (visit.iterator !== 0) {
              let iterator = visit.iterator;
              let child;
              let descended = false;
              while (child = visitNode.nodes[visitNode.indexes[iterator]]) {
                visitNode.indexes[iterator] += 1;
                if (!child[isClean]) {
                  child[isClean] = true;
                  stack.push({
                    eventIndex: 0,
                    events: getEvents(child),
                    iterator: 0,
                    node: child
                  });
                  descended = true;
                  break;
                }
              }
              if (descended) continue;
              visit.iterator = 0;
              delete visitNode.indexes[iterator];
            }
            if (visit.eventIndex < visit.events.length) {
              let event = visit.events[visit.eventIndex];
              visit.eventIndex += 1;
              if (event === CHILDREN) {
                if (visitNode.nodes && visitNode.nodes.length) {
                  visit.iterator = visitNode.getIterator();
                }
              } else {
                let visitors = this.listeners[event];
                if (visitors) {
                  if (this.visitSync(visitors, visitNode.toProxy())) stack.pop();
                }
              }
              continue;
            }
            stack.pop();
          }
        }
        warnings() {
          return this.sync().warnings();
        }
      };
      LazyResult.registerPostcss = (dependant) => {
        postcss2 = dependant;
      };
      module.exports = LazyResult;
      LazyResult.default = LazyResult;
      Root2.registerLazyResult(LazyResult);
      Document2.registerLazyResult(LazyResult);
    }
  });

  // node_modules/postcss/lib/no-work-result.js
  var require_no_work_result = __commonJS({
    "node_modules/postcss/lib/no-work-result.js"(exports, module) {
      "use strict";
      var MapGenerator = require_map_generator();
      var parse2 = require_parse();
      var Result2 = require_result();
      var stringify2 = require_stringify();
      var warnOnce = require_warn_once();
      var NoWorkResult = class {
        get content() {
          return this.result.css;
        }
        get css() {
          return this.result.css;
        }
        get map() {
          return this.result.map;
        }
        get messages() {
          return [];
        }
        get opts() {
          return this.result.opts;
        }
        get processor() {
          return this.result.processor;
        }
        get root() {
          if (this._root) {
            return this._root;
          }
          let root2;
          let parser = parse2;
          try {
            root2 = parser(this._css, this._opts);
          } catch (error) {
            this.error = error;
          }
          if (this.error) {
            throw this.error;
          } else {
            this._root = root2;
            return root2;
          }
        }
        get [Symbol.toStringTag]() {
          return "NoWorkResult";
        }
        constructor(processor, css, opts) {
          css = css.toString();
          this.stringified = false;
          this._processor = processor;
          this._css = css;
          this._opts = opts;
          this._map = void 0;
          let str = stringify2;
          this.result = new Result2(this._processor, void 0, this._opts);
          this.result.css = css;
          let self = this;
          Object.defineProperty(this.result, "root", {
            get() {
              return self.root;
            }
          });
          let map = new MapGenerator(str, void 0, this._opts, css);
          if (map.isMap()) {
            let [generatedCSS, generatedMap] = map.generate();
            if (generatedCSS) {
              this.result.css = generatedCSS;
            }
            if (generatedMap) {
              this.result.map = generatedMap;
            }
          } else {
            map.clearAnnotation();
            this.result.css = map.css;
          }
        }
        async() {
          if (this.error) return Promise.reject(this.error);
          return Promise.resolve(this.result);
        }
        catch(onRejected) {
          return this.async().catch(onRejected);
        }
        finally(onFinally) {
          return this.async().then(onFinally, onFinally);
        }
        sync() {
          if (this.error) throw this.error;
          return this.result;
        }
        then(onFulfilled, onRejected) {
          if (true) {
            if (!("from" in this._opts)) {
              warnOnce(
                "Without `from` option PostCSS could generate wrong source map and will not find Browserslist config. Set it to CSS file path or to `undefined` to prevent this warning."
              );
            }
          }
          return this.async().then(onFulfilled, onRejected);
        }
        toString() {
          return this._css;
        }
        warnings() {
          return [];
        }
      };
      module.exports = NoWorkResult;
      NoWorkResult.default = NoWorkResult;
    }
  });

  // node_modules/postcss/lib/processor.js
  var require_processor = __commonJS({
    "node_modules/postcss/lib/processor.js"(exports, module) {
      "use strict";
      var Document2 = require_document();
      var LazyResult = require_lazy_result();
      var NoWorkResult = require_no_work_result();
      var Root2 = require_root();
      var Processor2 = class {
        constructor(plugins = []) {
          this.version = "8.5.23";
          this.plugins = this.normalize(plugins);
        }
        normalize(plugins) {
          let normalized = [];
          for (let i of plugins) {
            if (i.postcss === true) {
              i = i();
            } else if (i.postcss) {
              i = i.postcss;
            }
            if (typeof i === "object" && Array.isArray(i.plugins)) {
              normalized = normalized.concat(i.plugins);
            } else if (typeof i === "object" && i.postcssPlugin) {
              normalized.push(i);
            } else if (typeof i === "function") {
              normalized.push(i);
            } else if (typeof i === "object" && (i.parse || i.stringify)) {
              if (true) {
                throw new Error(
                  "PostCSS syntaxes cannot be used as plugins. Instead, please use one of the syntax/parser/stringifier options as outlined in your PostCSS runner documentation."
                );
              }
            } else {
              throw new Error(i + " is not a PostCSS plugin");
            }
          }
          return normalized;
        }
        process(css, opts = {}) {
          if (!this.plugins.length && !opts.parser && !opts.stringifier && !opts.syntax) {
            return new NoWorkResult(this, css, opts);
          } else {
            return new LazyResult(this, css, opts);
          }
        }
        use(plugin2) {
          this.plugins = this.plugins.concat(this.normalize([plugin2]));
          return this;
        }
      };
      module.exports = Processor2;
      Processor2.default = Processor2;
      Root2.registerProcessor(Processor2);
      Document2.registerProcessor(Processor2);
    }
  });

  // node_modules/postcss/lib/postcss.js
  var require_postcss = __commonJS({
    "node_modules/postcss/lib/postcss.js"(exports, module) {
      "use strict";
      var AtRule2 = require_at_rule();
      var Comment2 = require_comment();
      var Container2 = require_container();
      var CssSyntaxError2 = require_css_syntax_error();
      var Declaration2 = require_declaration();
      var Document2 = require_document();
      var fromJSON2 = require_fromJSON();
      var Input2 = require_input();
      var LazyResult = require_lazy_result();
      var list2 = require_list();
      var Node2 = require_node();
      var parse2 = require_parse();
      var Processor2 = require_processor();
      var Result2 = require_result();
      var Root2 = require_root();
      var Rule2 = require_rule();
      var stringify2 = require_stringify();
      var Warning2 = require_warning();
      function postcss2(...plugins) {
        if (plugins.length === 1 && Array.isArray(plugins[0])) {
          plugins = plugins[0];
        }
        return new Processor2(plugins);
      }
      postcss2.plugin = function plugin2(name, initializer) {
        let warningPrinted = false;
        function creator(...args) {
          if (console && console.warn && !warningPrinted) {
            warningPrinted = true;
            console.warn(
              name + ": postcss.plugin was deprecated. Migration guide:\nhttps://evilmartians.com/chronicles/postcss-8-plugin-migration"
            );
            if (process.env.LANG && process.env.LANG.startsWith("cn")) {
              console.warn(
                name + ": \u91CC\u9762 postcss.plugin \u88AB\u5F03\u7528. \u8FC1\u79FB\u6307\u5357:\nhttps://www.w3ctech.com/topic/2226"
              );
            }
          }
          let transformer = initializer(...args);
          transformer.postcssPlugin = name;
          transformer.postcssVersion = new Processor2().version;
          return transformer;
        }
        let cache;
        Object.defineProperty(creator, "postcss", {
          get() {
            if (!cache) cache = creator();
            return cache;
          }
        });
        creator.process = function(css, processOpts, pluginOpts) {
          return postcss2([creator(pluginOpts)]).process(css, processOpts);
        };
        return creator;
      };
      postcss2.stringify = stringify2;
      postcss2.parse = parse2;
      postcss2.fromJSON = fromJSON2;
      postcss2.list = list2;
      postcss2.comment = (defaults) => new Comment2(defaults);
      postcss2.atRule = (defaults) => new AtRule2(defaults);
      postcss2.decl = (defaults) => new Declaration2(defaults);
      postcss2.rule = (defaults) => new Rule2(defaults);
      postcss2.root = (defaults) => new Root2(defaults);
      postcss2.document = (defaults) => new Document2(defaults);
      postcss2.CssSyntaxError = CssSyntaxError2;
      postcss2.Declaration = Declaration2;
      postcss2.Container = Container2;
      postcss2.Processor = Processor2;
      postcss2.Document = Document2;
      postcss2.Comment = Comment2;
      postcss2.Warning = Warning2;
      postcss2.AtRule = AtRule2;
      postcss2.Result = Result2;
      postcss2.Input = Input2;
      postcss2.Rule = Rule2;
      postcss2.Root = Root2;
      postcss2.Node = Node2;
      LazyResult.registerPostcss(postcss2);
      module.exports = postcss2;
      postcss2.default = postcss2;
    }
  });

  // vendor/upstream/regex-replacement.ts
  var CASE_COMMANDS = /* @__PURE__ */ new Set(["U", "L", "E", "u", "l"]);
  var LITERAL_PLACEHOLDER_PREFIX = "MARINARA_REGEX_LITERAL_";
  function escapeRegExpLiteral(value) {
    return value.replace(/[\\^$.*+?()[\]{}|]/g, "\\$&");
  }
  function findBalancedMacroEnd(input, start2) {
    let depth = 0;
    for (let index = start2; index < input.length - 1; index++) {
      if (input[index] === "{" && input[index + 1] === "{") {
        depth += 1;
        index += 1;
        continue;
      }
      if (input[index] === "}" && input[index + 1] === "}") {
        depth -= 1;
        index += 1;
        if (depth === 0) return index + 1;
      }
    }
    return -1;
  }
  function replaceBalancedMacros(input, replacer) {
    let result = "";
    let index = 0;
    while (index < input.length) {
      const start2 = input.indexOf("{{", index);
      if (start2 === -1) {
        result += input.slice(index);
        break;
      }
      result += input.slice(index, start2);
      const end = findBalancedMacroEnd(input, start2);
      if (end === -1) {
        result += input.slice(start2);
        break;
      }
      const original = input.slice(start2, end);
      const replacement = replacer(original);
      result += replacement ?? original;
      index = end;
    }
    return result;
  }
  function prepareLiteralMacroPlaceholders(value, resolveLiteral) {
    if (!resolveLiteral || !value.includes("{{")) return { template: value, literals: [] };
    const literals = [];
    const template = replaceBalancedMacros(value, (original) => {
      const token = `${LITERAL_PLACEHOLDER_PREFIX}${literals.length}`;
      literals.push({ token, value: resolveLiteral(original) });
      return token;
    });
    return { template, literals };
  }
  function restoreLiteralMacroPlaceholders(value, literals) {
    let result = value;
    for (const literal of literals) {
      result = result.split(literal.token).join(literal.value);
    }
    return result;
  }
  function readCapture(captures, index) {
    if (index < 1 || index > captures.length) return null;
    return captures[index - 1] ?? "";
  }
  function applyCase(value, mode, oneShot) {
    let result = mode === "upper" ? value.toUpperCase() : mode === "lower" ? value.toLowerCase() : value;
    if (oneShot && result.length > 0) {
      result = oneShot === "upper-first" ? result.charAt(0).toUpperCase() + result.slice(1) : result.charAt(0).toLowerCase() + result.slice(1);
      return { value: result, oneShot: null };
    }
    return { value: result, oneShot };
  }
  function expandRegexReplacementToken(replacement, index, ctx) {
    const next = replacement[index + 1];
    if (!next) return { value: "$", nextIndex: index + 1 };
    if (next === "$") return { value: "$", nextIndex: index + 2 };
    if (next === "&") return { value: ctx.match, nextIndex: index + 2 };
    if (next === "`") return { value: ctx.input.slice(0, ctx.offset), nextIndex: index + 2 };
    if (next === "'") return { value: ctx.input.slice(ctx.offset + ctx.match.length), nextIndex: index + 2 };
    if (next === "<") {
      const closeIndex = replacement.indexOf(">", index + 2);
      if (closeIndex !== -1) {
        const name = replacement.slice(index + 2, closeIndex);
        if (ctx.groups && Object.prototype.hasOwnProperty.call(ctx.groups, name)) {
          return { value: ctx.groups[name] ?? "", nextIndex: closeIndex + 1 };
        }
        if (ctx.groups) {
          return { value: "", nextIndex: closeIndex + 1 };
        }
      }
      return { value: "$", nextIndex: index + 1 };
    }
    if (/\d/.test(next)) {
      const twoDigit = replacement.slice(index + 1, index + 3);
      if (/^\d{2}$/.test(twoDigit)) {
        const twoDigitValue = readCapture(ctx.captures, Number(twoDigit));
        if (twoDigitValue !== null) return { value: twoDigitValue, nextIndex: index + 3 };
      }
      const oneDigitValue = readCapture(ctx.captures, Number(next));
      if (oneDigitValue !== null) return { value: oneDigitValue, nextIndex: index + 2 };
    }
    return { value: "$", nextIndex: index + 1 };
  }
  function expandRegexReplacement(replacement, ctx) {
    let result = "";
    let index = 0;
    let caseMode = "none";
    let oneShotCaseMode = null;
    const append = (value) => {
      const transformed = applyCase(value, caseMode, oneShotCaseMode);
      result += transformed.value;
      oneShotCaseMode = transformed.oneShot;
    };
    const startsCommandArgument = (command) => {
      const afterCommand = replacement[index + 2];
      if (command === "E") return caseMode !== "none" || oneShotCaseMode !== null;
      return afterCommand === "$" || afterCommand === "\\";
    };
    while (index < replacement.length) {
      const char = replacement[index];
      if (char === "\\") {
        const next = replacement[index + 1];
        const escapedCommand = next === "\\" ? replacement[index + 2] : void 0;
        if (escapedCommand && CASE_COMMANDS.has(escapedCommand)) {
          append(`\\${escapedCommand}`);
          index += 3;
          continue;
        }
        if (next === "U" && startsCommandArgument("U")) {
          caseMode = "upper";
          index += 2;
          continue;
        }
        if (next === "L" && startsCommandArgument("L")) {
          caseMode = "lower";
          index += 2;
          continue;
        }
        if (next === "E" && startsCommandArgument("E")) {
          caseMode = "none";
          index += 2;
          continue;
        }
        if (next === "u" && startsCommandArgument("u")) {
          oneShotCaseMode = "upper-first";
          index += 2;
          continue;
        }
        if (next === "l" && startsCommandArgument("l")) {
          oneShotCaseMode = "lower-first";
          index += 2;
          continue;
        }
      }
      if (char === "$") {
        const token = expandRegexReplacementToken(replacement, index, ctx);
        append(token.value);
        index = token.nextIndex;
        continue;
      }
      append(char ?? "");
      index += 1;
    }
    return result;
  }
  function resolveRegexPatternLiteralMacros(pattern, resolveLiteral) {
    if (!resolveLiteral || !pattern.includes("{{")) return pattern;
    return replaceBalancedMacros(pattern, (original) => escapeRegExpLiteral(resolveLiteral(original)));
  }
  function applyRegexReplacement(text2, regex, replacement, resolveReplacement) {
    const preparedReplacement = prepareLiteralMacroPlaceholders(replacement, resolveReplacement);
    return text2.replace(regex, (...args) => {
      const lastArg = args[args.length - 1];
      const hasGroups = typeof lastArg === "object" && lastArg !== null;
      const groups = hasGroups ? lastArg : void 0;
      const input = args[args.length - (hasGroups ? 2 : 1)];
      const offset = args[args.length - (hasGroups ? 3 : 2)];
      const match = args[0];
      const captures = args.slice(1, hasGroups ? -3 : -2).map((capture) => capture == null ? "" : String(capture));
      const expanded = expandRegexReplacement(preparedReplacement.template, {
        match,
        captures,
        offset,
        input,
        groups
      });
      return restoreLiteralMacroPlaceholders(expanded, preparedReplacement.literals);
    });
  }

  // vendor/upstream/regex-safety.ts
  var DEFAULTS = {
    maxLength: 1e3,
    maxStarHeight: 1,
    maxRepetition: Infinity
  };
  var INVALID_QUANTIFIER = /* @__PURE__ */ Symbol("invalid-quantifier");
  function isPatternSafe(source, options = {}) {
    const { maxLength, maxStarHeight, maxRepetition } = { ...DEFAULTS, ...options };
    if (typeof source !== "string") return false;
    if (source.length === 0) return true;
    if (source.length > maxLength) return false;
    if (hasPolynomialBacktrackingRisk(source, maxRepetition)) return false;
    let i = 0;
    let groupDepth = 0;
    const groupInnerHeight = [];
    const groupBodyStart = [];
    let topLevelHeight = 0;
    const recordAtomHeight = (h) => {
      if (groupDepth > 0) {
        const idx = groupInnerHeight.length - 1;
        if (h > groupInnerHeight[idx]) groupInnerHeight[idx] = h;
      } else if (h > topLevelHeight) {
        topLevelHeight = h;
      }
    };
    while (i < source.length) {
      const c = source[i];
      if (c === "\\") {
        const atomEnd2 = consumeEscapedAtom(source, i);
        if (atomEnd2 === null) return false;
        const consumed2 = consumeQuantifier(source, atomEnd2, maxRepetition);
        if (consumed2 === INVALID_QUANTIFIER) return false;
        recordAtomHeight(consumed2?.addsStarHeight ? 1 : 0);
        i = consumed2?.end ?? atomEnd2;
        continue;
      }
      if (c === "[") {
        const closeIdx = findCharClassClose(source, i);
        if (closeIdx === -1) return false;
        const atomEnd2 = closeIdx + 1;
        const consumed2 = consumeQuantifier(source, atomEnd2, maxRepetition);
        if (consumed2 === INVALID_QUANTIFIER) return false;
        recordAtomHeight(consumed2?.addsStarHeight ? 1 : 0);
        i = consumed2?.end ?? atomEnd2;
        continue;
      }
      if (c === "(") {
        groupDepth += 1;
        groupInnerHeight.push(0);
        const bodyStart = getGroupBodyStart(source, i);
        if (bodyStart === null) return false;
        groupBodyStart.push(bodyStart);
        i = bodyStart;
        continue;
      }
      if (c === ")") {
        if (groupDepth === 0) return false;
        const innerHeight = groupInnerHeight.pop() ?? 0;
        const bodyStart = groupBodyStart.pop() ?? i;
        groupDepth -= 1;
        const consumed2 = consumeQuantifier(source, i + 1, maxRepetition);
        if (consumed2 === INVALID_QUANTIFIER) return false;
        const quantified = consumed2?.addsStarHeight === true;
        if (quantified && hasUnsafeQuantifiedAlternation(source.slice(bodyStart, i))) return false;
        const groupHeight = innerHeight + (quantified ? 1 : 0);
        if (groupHeight > maxStarHeight) return false;
        recordAtomHeight(groupHeight);
        i = consumed2?.end ?? i + 1;
        continue;
      }
      const atomEnd = i + 1;
      const consumed = consumeQuantifier(source, atomEnd, maxRepetition);
      if (consumed === INVALID_QUANTIFIER) return false;
      recordAtomHeight(consumed?.addsStarHeight ? 1 : 0);
      i = consumed?.end ?? atomEnd;
    }
    if (groupDepth !== 0) return false;
    if (topLevelHeight > maxStarHeight) return false;
    return true;
  }
  function consumeQuantifier(source, i, maxRepetition) {
    const c = source[i];
    if (c === "*" || c === "+" || c === "?") {
      const next = source[i + 1];
      if (next === "+") return INVALID_QUANTIFIER;
      return {
        end: next === "?" ? i + 2 : i + 1,
        addsStarHeight: c !== "?",
        unbounded: c !== "?",
        required: c === "+"
      };
    }
    if (c === "{") {
      const close = source.indexOf("}", i + 1);
      if (close === -1) return null;
      const body = source.slice(i + 1, close);
      const m = /^(\d+)(,(\d*))?$/.exec(body);
      if (!m) return null;
      const lo = Number(m[1]);
      const upperRaw = m[3];
      const hi = m[2] === void 0 ? lo : upperRaw === "" || upperRaw === void 0 ? Infinity : Number(upperRaw);
      if (!Number.isFinite(lo) || lo > maxRepetition) return INVALID_QUANTIFIER;
      if (Number.isFinite(hi) && hi > maxRepetition) return INVALID_QUANTIFIER;
      if (!Number.isFinite(hi) && Number.isFinite(maxRepetition)) return INVALID_QUANTIFIER;
      let next = close + 1;
      if (source[next] === "+") return INVALID_QUANTIFIER;
      if (source[next] === "?") next += 1;
      return { end: next, addsStarHeight: true, unbounded: !Number.isFinite(hi), required: lo > 0 };
    }
    return null;
  }
  function consumeEscapedAtom(source, i) {
    const next = source[i + 1];
    if (next === void 0) return null;
    if ((next === "p" || next === "P" || next === "u") && source[i + 2] === "{") {
      const close = source.indexOf("}", i + 3);
      return close === -1 ? null : close + 1;
    }
    return i + 2;
  }
  function getGroupBodyStart(source, openIdx) {
    if (source[openIdx + 1] !== "?") return openIdx + 1;
    const kind = source[openIdx + 2];
    if (kind === ":" || kind === "=" || kind === "!") return openIdx + 3;
    if (kind === "<") {
      const lookbehindKind = source[openIdx + 3];
      if (lookbehindKind === "=" || lookbehindKind === "!") return openIdx + 4;
      const close = source.indexOf(">", openIdx + 3);
      return close === -1 ? null : close + 1;
    }
    return null;
  }
  function findCharClassClose(source, openIdx) {
    let j = openIdx + 1;
    if (source[j] === "^") j += 1;
    if (source[j] === "]") j += 1;
    while (j < source.length) {
      const c = source[j];
      if (c === "\\") {
        j += 2;
        continue;
      }
      if (c === "]") return j;
      j += 1;
    }
    return -1;
  }
  function hasUnsafeQuantifiedAlternation(body) {
    const alternatives = splitTopLevelAlternatives(body);
    if (alternatives.length < 2) return false;
    const tokenized = alternatives.map(tokenizeAlternative);
    if (tokenized.some((tokens) => tokens.length === 0)) return true;
    for (let i = 0; i < tokenized.length; i += 1) {
      for (let j = i + 1; j < tokenized.length; j += 1) {
        const a = tokenized[i];
        const b = tokenized[j];
        if (isTokenPrefix(a, b) || isTokenPrefix(b, a)) return true;
      }
    }
    return false;
  }
  function splitTopLevelAlternatives(body) {
    const alternatives = [];
    let start2 = 0;
    let depth = 0;
    let inClass = false;
    for (let i = 0; i < body.length; i += 1) {
      const c = body[i];
      if (c === "\\") {
        i += 1;
        continue;
      }
      if (inClass) {
        if (c === "]") inClass = false;
        continue;
      }
      if (c === "[") {
        inClass = true;
        continue;
      }
      if (c === "(") {
        depth += 1;
        continue;
      }
      if (c === ")") {
        depth = Math.max(0, depth - 1);
        continue;
      }
      if (c === "|" && depth === 0) {
        alternatives.push(body.slice(start2, i));
        start2 = i + 1;
      }
    }
    alternatives.push(body.slice(start2));
    return alternatives;
  }
  function tokenizeAlternative(alternative) {
    const tokens = [];
    for (let i = 0; i < alternative.length; i += 1) {
      const c = alternative[i];
      if (c === "\\") {
        const end = consumeEscapedAtom(alternative, i);
        if (end === null) return tokens;
        tokens.push(alternative.slice(i, end));
        i = end - 1;
        continue;
      }
      if (c === "[") {
        const close = findCharClassClose(alternative, i);
        if (close === -1) return tokens;
        tokens.push(alternative.slice(i, close + 1));
        i = close;
        continue;
      }
      if ("(){}*+?|^$.".includes(c)) {
        return tokens;
      }
      tokens.push(c);
    }
    return tokens;
  }
  function isTokenPrefix(prefix, candidate) {
    if (prefix.length > candidate.length) return false;
    return prefix.every((token, index) => candidate[index] === token);
  }
  function hasPolynomialBacktrackingRisk(source, maxRepetition) {
    let broadUnboundedCount = 0;
    let adjacentBroadUnboundedCount = 0;
    let pendingNegatedClassBoundary = null;
    let countBeforePendingNegatedClass = 0;
    const consumeRequiredLiteralBoundary = (literal) => {
      adjacentBroadUnboundedCount = 0;
      if (literal !== null && pendingNegatedClassBoundary !== null && !characterClassMatchesLiteral(pendingNegatedClassBoundary, literal)) {
        broadUnboundedCount = countBeforePendingNegatedClass;
        pendingNegatedClassBoundary = null;
      }
    };
    for (let i = 0; i < source.length; ) {
      const c = source[i];
      if (c === "\\") {
        const atomEnd2 = consumeEscapedAtom(source, i);
        if (atomEnd2 === null) return true;
        const consumed2 = consumeQuantifier(source, atomEnd2, maxRepetition);
        if (consumed2 === INVALID_QUANTIFIER) return true;
        const broadUnbounded = consumed2?.unbounded === true && isBroadEscapedAtom(source[i + 1]);
        if (broadUnbounded) {
          pendingNegatedClassBoundary = null;
          countBeforePendingNegatedClass = broadUnboundedCount;
          broadUnboundedCount += 1;
          adjacentBroadUnboundedCount += 1;
          if (adjacentBroadUnboundedCount >= 2 || broadUnboundedCount >= 3) return true;
        } else if (isRequiredLiteralAtom(consumed2)) {
          consumeRequiredLiteralBoundary(readRequiredLiteral(source.slice(i, atomEnd2)));
        }
        i = consumed2?.end ?? atomEnd2;
        continue;
      }
      if (c === "[") {
        const closeIdx = findCharClassClose(source, i);
        if (closeIdx === -1) return true;
        const atomEnd2 = closeIdx + 1;
        const consumed2 = consumeQuantifier(source, atomEnd2, maxRepetition);
        if (consumed2 === INVALID_QUANTIFIER) return true;
        const broadUnbounded = consumed2?.unbounded === true && isBroadCharacterClass(source.slice(i, atomEnd2));
        if (broadUnbounded) {
          const characterClass = source.slice(i, atomEnd2);
          countBeforePendingNegatedClass = broadUnboundedCount;
          pendingNegatedClassBoundary = characterClass.startsWith("[^") ? characterClass : null;
          broadUnboundedCount += 1;
          adjacentBroadUnboundedCount += 1;
          if (adjacentBroadUnboundedCount >= 2 || broadUnboundedCount >= 3) return true;
        } else if (isRequiredLiteralAtom(consumed2)) {
          consumeRequiredLiteralBoundary(null);
        }
        i = consumed2?.end ?? atomEnd2;
        continue;
      }
      if (c === ".") {
        const atomEnd2 = i + 1;
        const consumed2 = consumeQuantifier(source, atomEnd2, maxRepetition);
        if (consumed2 === INVALID_QUANTIFIER) return true;
        if (consumed2?.unbounded) {
          pendingNegatedClassBoundary = null;
          countBeforePendingNegatedClass = broadUnboundedCount;
          broadUnboundedCount += 1;
          adjacentBroadUnboundedCount += 1;
          if (adjacentBroadUnboundedCount >= 2 || broadUnboundedCount >= 3) return true;
        } else if (isRequiredLiteralAtom(consumed2)) {
          consumeRequiredLiteralBoundary(".");
        }
        i = consumed2?.end ?? atomEnd2;
        continue;
      }
      if (c === "(" || c === ")" || c === "|" || c === "^" || c === "$") {
        i += 1;
        continue;
      }
      const atomEnd = i + 1;
      const consumed = consumeQuantifier(source, atomEnd, maxRepetition);
      if (consumed === INVALID_QUANTIFIER) return true;
      if (isRequiredLiteralAtom(consumed)) consumeRequiredLiteralBoundary(c);
      i = consumed?.end ?? atomEnd;
    }
    return false;
  }
  function readRequiredLiteral(atom) {
    if (atom.length === 1) return atom;
    if (/^\\[\\^$.*+?()[\]{}|/-]$/.test(atom)) return atom[1] ?? null;
    return null;
  }
  function characterClassMatchesLiteral(characterClass, literal) {
    try {
      return new RegExp(`^(?:${characterClass})$`).test(literal);
    } catch {
      return true;
    }
  }
  function isRequiredLiteralAtom(consumed) {
    return consumed === null || consumed.required;
  }
  function isBroadEscapedAtom(atom) {
    return atom === "s" || atom === "S" || atom === "w" || atom === "W" || atom === "d" || atom === "D";
  }
  function isBroadCharacterClass(source) {
    const body = source.slice(1, -1);
    if (!body) return false;
    if (body.startsWith("^")) return true;
    return body.includes("\\s") || body.includes("\\S") || body.includes("\\w") || body.includes("\\W") || body.includes("\\d") || body.includes("\\D");
  }

  // vendor/upstream/regex-scoping.ts
  function resolveScopedRegexMode(override, presetDefault) {
    for (const value of [override, presetDefault]) {
      if (value === "disabled" || value === "exclusive" || value === "chat") return value;
    }
    return "disabled";
  }

  // src/regex.ts
  function getApplyMode(row) {
    return row.applyMode === "prompt" || row.applyMode === "display" || row.applyMode === "both" ? row.applyMode : row.promptOnly === "true" ? "prompt" : "display";
  }
  function parseScript(row) {
    const placements = (() => {
      try {
        const parsed = JSON.parse(row.placement);
        if (!Array.isArray(parsed)) return ["ai_output"];
        return parsed.filter(
          (placement) => placement === "ai_output" || placement === "user_input"
        );
      } catch {
        return ["ai_output"];
      }
    })();
    const trimStrings = (() => {
      try {
        const parsed = JSON.parse(row.trimStrings);
        return Array.isArray(parsed) ? parsed.filter((entry) => typeof entry === "string") : [];
      } catch {
        return [];
      }
    })();
    const targetCharacterIds = (() => {
      try {
        const parsed = JSON.parse(row.targetCharacterIds);
        return Array.isArray(parsed) ? parsed.filter((entry) => typeof entry === "string") : [];
      } catch {
        return [];
      }
    })();
    const targetPromptPresetIds = (() => {
      try {
        const parsed = JSON.parse(row.targetPromptPresetIds);
        return Array.isArray(parsed) ? parsed.filter((entry) => typeof entry === "string") : [];
      } catch {
        return [];
      }
    })();
    return {
      ...row,
      // packages/client/src/hooks/use-apply-regex.ts:72
      enabledBool: row.enabled === "true",
      applyMode: getApplyMode(row),
      placements,
      trimStrings,
      targetCharacterIds,
      targetPromptPresetIds
    };
  }
  function applyScripts(text2, scripts, placement, options) {
    let result = text2;
    for (const script of scripts) {
      if (!script.enabledBool) continue;
      if (!script.placements.includes(placement)) continue;
      if (options?.promptOnly) {
        if (script.applyMode !== "prompt" && script.applyMode !== "both") continue;
      } else if (script.applyMode !== "display" && script.applyMode !== "both") {
        continue;
      }
      if (options?.targetedOnly && script.targetCharacterIds.length === 0) continue;
      if (script.targetCharacterIds.length > 0) {
        if (options?.promptOnly) {
          if (!options.targetCharacterId || !script.targetCharacterIds.includes(options.targetCharacterId)) continue;
        } else {
          const rawMode = options?.scopedMode;
          const mode = rawMode === "exclusive" || rawMode === "chat" ? rawMode : "disabled";
          if (mode === "disabled") continue;
          if (mode === "exclusive") {
            const charId = options?.characterId;
            if (!charId || !script.targetCharacterIds.includes(charId)) continue;
          }
        }
      }
      if (script.targetPromptPresetIds.length > 0) {
        if (!options?.promptPresetId || !script.targetPromptPresetIds.includes(options.promptPresetId)) continue;
      }
      if (options?.depth != null) {
        if (script.minDepth != null && options.depth < script.minDepth) continue;
        if (script.maxDepth != null && options.depth > script.maxDepth) continue;
      }
      try {
        const findRegex = options?.resolveMacros ? resolveRegexPatternLiteralMacros(script.findRegex, options.resolveMacros) : script.findRegex;
        if (!findRegex) continue;
        if (!isPatternSafe(findRegex)) continue;
        const re = new RegExp(findRegex, script.flags);
        result = applyRegexReplacement(
          result,
          re,
          script.replaceString,
          (value) => (
            // packages/client/src/hooks/use-apply-regex.ts:148
            options?.resolveMacros ? options.resolveMacros(value) : value
          )
        );
        for (const trim of script.trimStrings) {
          const resolvedTrim = options?.resolveMacros ? options.resolveMacros(trim) : trim;
          if (resolvedTrim) result = result.split(resolvedTrim).join("");
        }
      } catch {
      }
    }
    return result;
  }

  // vendor/upstream/macro-engine.ts
  var CHARACTER_REFERENCE_ID_PATTERN = /\{\{([A-Za-z0-9_-]{21})\}\}/g;
  var PERSONA_REFERENCE_ID_PATTERN = /\{\{persona-([A-Za-z0-9_-]{21})\}\}/gi;
  var CHARACTER_MACRO_NAMES = /* @__PURE__ */ new Set([
    "appearance",
    "backstory",
    "char",
    "char_about",
    "charname",
    "charnamephonetic",
    "charphonetic",
    "charposthistory",
    "charsysinfo",
    "convo_behavior",
    "convo_display",
    "description",
    "example",
    "group",
    "personality",
    "scenario"
  ]);
  var CHARACTER_CONDITIONAL_OPERAND_NAMES = /* @__PURE__ */ new Set([
    ...CHARACTER_MACRO_NAMES,
    "character",
    "characterphonetic",
    "speaker",
    "speakerphonetic"
  ]);
  var MAX_CHARACTER_FIELD_RESOLUTION_DEPTH = 4;
  var MAX_DICE_COUNT = 1e3;
  var MAX_DICE_SIDES = 1e6;
  var MAX_MACRO_RESOLUTION_DEPTH = 16;
  var MAX_MACRO_EXPANSIONS = 2e3;
  var MAX_MACRO_OUTPUT_LENGTH = 2e5;
  var DEFERRED_CHARACTER_MACRO_TOKEN_PREFIX = "MARINARA_DEFERRED_CHARACTER_";
  var DEFERRED_CHARACTER_CONDITIONAL_TOKEN_PREFIX = "MARINARA_DEFERRED_CHARACTER_IF:";
  var DEFERRED_CHARACTER_CONDITIONAL_TOKEN_RE = new RegExp(
    `${DEFERRED_CHARACTER_CONDITIONAL_TOKEN_PREFIX.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}([^\\x1f]+)\\x1f`,
    "g"
  );
  var DEFERRED_RELOCATION_CONDITIONAL_TOKEN_PREFIX = "MARINARA_DEFERRED_RELOCATION_IF:";
  var DEFERRED_RELOCATION_CONDITIONAL_TOKEN_RE = new RegExp(
    `${DEFERRED_RELOCATION_CONDITIONAL_TOKEN_PREFIX.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}([^\\x1f]+)\\x1f`,
    "g"
  );
  var DEFERRED_CHARACTER_MACRO_TOKENS = {
    char: `${DEFERRED_CHARACTER_MACRO_TOKEN_PREFIX}CHAR`,
    charPhonetic: `${DEFERRED_CHARACTER_MACRO_TOKEN_PREFIX}CHAR_PHONETIC`,
    group: `${DEFERRED_CHARACTER_MACRO_TOKEN_PREFIX}GROUP`,
    description: `${DEFERRED_CHARACTER_MACRO_TOKEN_PREFIX}DESCRIPTION`,
    personality: `${DEFERRED_CHARACTER_MACRO_TOKEN_PREFIX}PERSONALITY`,
    backstory: `${DEFERRED_CHARACTER_MACRO_TOKEN_PREFIX}BACKSTORY`,
    appearance: `${DEFERRED_CHARACTER_MACRO_TOKEN_PREFIX}APPEARANCE`,
    scenario: `${DEFERRED_CHARACTER_MACRO_TOKEN_PREFIX}SCENARIO`,
    example: `${DEFERRED_CHARACTER_MACRO_TOKEN_PREFIX}EXAMPLE`,
    systemPrompt: `${DEFERRED_CHARACTER_MACRO_TOKEN_PREFIX}SYSTEM_PROMPT`,
    postHistoryInstructions: `${DEFERRED_CHARACTER_MACRO_TOKEN_PREFIX}POST_HISTORY`,
    convoDisplay: `${DEFERRED_CHARACTER_MACRO_TOKEN_PREFIX}CONVO_DISPLAY`,
    charAbout: `${DEFERRED_CHARACTER_MACRO_TOKEN_PREFIX}CHAR_ABOUT`,
    convoBehavior: `${DEFERRED_CHARACTER_MACRO_TOKEN_PREFIX}CONVO_BEHAVIOR`
  };
  function stripMacroComments(template) {
    let result = "";
    let cursor = 0;
    while (cursor < template.length) {
      const start2 = template.indexOf("{{//", cursor);
      if (start2 < 0) break;
      const firstClose = template.indexOf("}}", start2 + 4);
      if (firstClose < 0) break;
      result += template.slice(cursor, start2);
      cursor = firstClose + 2;
    }
    return result + template.slice(cursor);
  }
  function getMacroBudget(options) {
    if (options.macroBudget) return options.macroBudget;
    const budget = { expansions: 0 };
    options.macroBudget = budget;
    return budget;
  }
  function macroLimit(options, key) {
    switch (key) {
      case "maxMacroDepth":
        return options.maxMacroDepth ?? MAX_MACRO_RESOLUTION_DEPTH;
      case "maxMacroExpansions":
        return options.maxMacroExpansions ?? MAX_MACRO_EXPANSIONS;
      case "maxMacroOutputLength":
        return options.maxMacroOutputLength ?? MAX_MACRO_OUTPUT_LENGTH;
    }
  }
  function consumeMacroExpansion(options) {
    const budget = getMacroBudget(options);
    budget.expansions += 1;
    if (budget.expansions > macroLimit(options, "maxMacroExpansions")) {
      budget.exceeded = true;
      return false;
    }
    return true;
  }
  function nestedMacroOptions(options) {
    return {
      ...options,
      macroBudget: getMacroBudget(options),
      macroDepth: (options.macroDepth ?? 0) + 1
    };
  }
  function readMacroVariable(map, name) {
    if (!map || !Object.prototype.hasOwnProperty.call(map, name)) return void 0;
    const value = map[name];
    return typeof value === "string" ? value : void 0;
  }
  function readReasoningMacro(ctx, name) {
    if (readMacroVariable(ctx.variables, name) !== void 0 || ctx.deferredPresetVariableNames?.has(name) || readMacroVariable(ctx.localVariables, name) !== void 0) {
      return void 0;
    }
    return ctx.reasoning ?? "";
  }
  function clampMacroOutput(value, options) {
    const maxLength = macroLimit(options, "maxMacroOutputLength");
    if (value.length <= maxLength) return value;
    getMacroBudget(options).exceeded = true;
    return value.slice(0, maxLength);
  }
  function hashStringToUint32(value) {
    let hash = 2166136261;
    for (let index = 0; index < value.length; index += 1) {
      hash ^= value.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
  }
  function seededUnitRandom(seed) {
    let state = hashStringToUint32(seed) || 2654435769;
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 4294967296;
  }
  function randomUnit(options, original) {
    return options.randomSeed ? seededUnitRandom(`${options.randomSeed}:${original}`) : Math.random();
  }
  function randomInteger(options, original, min, max) {
    return Math.floor(randomUnit(options, original) * (max - min + 1)) + min;
  }
  function normalizeMacroIdentity(value) {
    return value.trim().replace(/\s+/g, " ").toLowerCase();
  }
  function resolveGroupCharacters(ctx) {
    const responderName = normalizeMacroIdentity(ctx.char);
    return (ctx.groupCharacters ?? ctx.characters).map((name) => name.trim()).filter((name) => name.length > 0 && normalizeMacroIdentity(name) !== responderName).join(", ");
  }
  function getCharacterFieldValue(profile, field) {
    return stripMacroComments(profile[field] ?? "");
  }
  function resolveCharacterFieldValue(profile, field, depth, baseContext) {
    const value = getCharacterFieldValue(profile, field);
    if (!value) return "";
    if (depth >= MAX_CHARACTER_FIELD_RESOLUTION_DEPTH) return "";
    return resolveCharacterScopedMacros(value, profile, depth + 1, baseContext);
  }
  function macroContextForCharacterProfile(profile, base) {
    return {
      user: base?.user ?? "User",
      userPhonetic: base?.userPhonetic,
      char: profile.name,
      charPhonetic: profile.phoneticName ?? profile.name,
      characters: base?.characters ?? [profile.name],
      groupCharacters: base?.groupCharacters,
      characterProfiles: base?.characterProfiles ?? [profile],
      variables: base?.variables ?? {},
      localVariables: base?.localVariables,
      deferredPresetVariableNames: base?.deferredPresetVariableNames,
      lastInput: base?.lastInput,
      chatId: base?.chatId,
      model: base?.model,
      reasoning: base?.reasoning,
      lastGenerationType: base?.lastGenerationType,
      idleDuration: base?.idleDuration,
      timeZone: base?.timeZone,
      agentData: base?.agentData,
      personaReferences: base?.personaReferences,
      personaFields: base?.personaFields,
      convoFields: base?.convoFields,
      decisions: base?.decisions,
      characterFields: {
        phoneticName: profile.phoneticName ?? "",
        description: profile.description ?? "",
        personality: profile.personality ?? "",
        backstory: profile.backstory ?? "",
        appearance: profile.appearance ?? "",
        scenario: profile.scenario ?? "",
        example: profile.example ?? "",
        systemPrompt: profile.systemPrompt ?? "",
        postHistoryInstructions: profile.postHistoryInstructions ?? ""
      }
    };
  }
  function resolveCharacterScopedMacros(template, profile, depth = 0, baseContext) {
    const scopedContext = macroContextForCharacterProfile(profile, baseContext);
    const scoped = resolveConditionalBlocks(stripMacroComments(template), scopedContext, {});
    return scoped.replace(/\{\{\s*original\s*\}\}/gi, "").replace(/\{\{\s*char(?:Name)?\s*\}\}/gi, () => profile.name).replace(/\{\{\s*char(?:Name)?Phonetic\s*\}\}/gi, () => profile.phoneticName ?? profile.name).replace(/\{\{\s*group\s*\}\}/gi, () => resolveGroupCharacters(scopedContext)).replace(
      /\{\{\s*description\s*\}\}/gi,
      () => resolveCharacterFieldValue(profile, "description", depth, baseContext)
    ).replace(
      /\{\{\s*personality\s*\}\}/gi,
      () => resolveCharacterFieldValue(profile, "personality", depth, baseContext)
    ).replace(/\{\{\s*backstory\s*\}\}/gi, () => resolveCharacterFieldValue(profile, "backstory", depth, baseContext)).replace(/\{\{\s*appearance\s*\}\}/gi, () => resolveCharacterFieldValue(profile, "appearance", depth, baseContext)).replace(/\{\{\s*scenario\s*\}\}/gi, () => resolveCharacterFieldValue(profile, "scenario", depth, baseContext)).replace(/\{\{\s*example\s*\}\}/gi, () => resolveCharacterFieldValue(profile, "example", depth, baseContext)).replace(
      /\{\{\s*charSysInfo\s*\}\}/gi,
      () => resolveCharacterFieldValue(profile, "systemPrompt", depth, baseContext)
    ).replace(
      /\{\{\s*charPostHistory\s*\}\}/gi,
      () => resolveCharacterFieldValue(profile, "postHistoryInstructions", depth, baseContext)
    );
  }
  function hasCharacterConditionalOperandCandidate(condition) {
    let quote = null;
    let escaped = false;
    for (let index = 0; index < condition.length; index++) {
      const character = condition[index];
      if (quote) {
        if (escaped) escaped = false;
        else if (character === "\\") escaped = true;
        else if (quoteKind(character) === quote) quote = null;
        continue;
      }
      const nextQuote = quoteKind(character);
      if (nextQuote) {
        quote = nextQuote;
        continue;
      }
      const candidateStart = character === "@" ? index + 1 : index;
      let candidateEnd = candidateStart;
      while (candidateEnd < condition.length) {
        const code = condition.charCodeAt(candidateEnd);
        const isIdentifierCharacter = code >= 48 && code <= 57 || code >= 65 && code <= 90 || code === 95 || code >= 97 && code <= 122;
        if (!isIdentifierCharacter) break;
        candidateEnd++;
      }
      if (candidateEnd === candidateStart) continue;
      if (CHARACTER_CONDITIONAL_OPERAND_NAMES.has(condition.slice(candidateStart, candidateEnd).toLowerCase())) {
        return true;
      }
      index = candidateEnd - 1;
    }
    return false;
  }
  function hasCharacterMacro(template) {
    const lowerTemplate = template.toLowerCase();
    for (const name of CHARACTER_MACRO_NAMES) {
      if (lowerTemplate.includes(`{{${name}}}`)) return true;
    }
    let searchIndex = 0;
    while (searchIndex < template.length) {
      const start2 = template.indexOf("{{", searchIndex);
      if (start2 === -1) return false;
      let bodyStart = start2 + 2;
      while (bodyStart < template.length && /\s/u.test(template[bodyStart])) bodyStart++;
      let nameEnd = bodyStart;
      while (nameEnd < template.length && /[A-Za-z_]/u.test(template[nameEnd])) nameEnd++;
      const name = template.slice(bodyStart, nameEnd).toLowerCase();
      let directEnd = nameEnd;
      while (directEnd < template.length && /\s/u.test(template[directEnd])) directEnd++;
      if (template.startsWith("}}", directEnd) && CHARACTER_MACRO_NAMES.has(name)) return true;
      const ifEnd = bodyStart + 3;
      const elseIfEnd = directEnd + 2;
      const isIf = template.slice(bodyStart, ifEnd).toLowerCase() === "#if" && (template.startsWith("}}", ifEnd) || ifEnd < template.length && /\s/u.test(template[ifEnd]));
      const isElseIf = name === "else" && directEnd > nameEnd && template.slice(directEnd, elseIfEnd).toLowerCase() === "if" && (template.startsWith("}}", elseIfEnd) || elseIfEnd < template.length && /\s/u.test(template[elseIfEnd]));
      if (!isIf && !isElseIf) {
        searchIndex = Math.max(start2 + 2, nameEnd);
        continue;
      }
      const end = findBalancedMacroEnd2(template, start2);
      if (end === -1) {
        return hasCharacterConditionalOperandCandidate(template.slice(bodyStart));
      }
      const body = template.slice(start2 + 2, end - 2).trim();
      const condition = parseIfCondition(body) ?? parseElseIfCondition(body);
      if (condition !== null && hasCharacterConditionalOperandCandidate(condition) && (conditionDependsOnCharacter(condition) || conditionHasLegacyAdjacentCharacterReference(condition))) {
        return true;
      }
      searchIndex = end;
    }
    return false;
  }
  function expandBracketedCharacterBlocks(template, ctx) {
    const profiles = ctx.characterProfiles ?? [];
    if (profiles.length <= 1 || !hasCharacterMacro(template)) {
      return template;
    }
    const lines = template.split(/\r?\n/);
    const expandedLines = [];
    let changed = false;
    for (let index = 0; index < lines.length; index++) {
      const line = lines[index];
      if (line.trim() !== "[") {
        expandedLines.push(line);
        continue;
      }
      let endIndex = index + 1;
      while (endIndex < lines.length && lines[endIndex].trim() !== "]") {
        endIndex += 1;
      }
      if (endIndex >= lines.length) {
        expandedLines.push(line);
        continue;
      }
      const block = lines.slice(index, endIndex + 1).join("\n");
      if (!hasCharacterMacro(block)) {
        expandedLines.push(...lines.slice(index, endIndex + 1));
        index = endIndex;
        continue;
      }
      changed = true;
      expandedLines.push(
        ...profiles.map((profile) => resolveCharacterScopedMacros(block, profile, 0, ctx)).join("\n").split("\n")
      );
      index = endIndex;
    }
    return changed ? expandedLines.join("\n") : template;
  }
  function findBalancedMacroEnd2(input, start2) {
    let depth = 0;
    for (let index = start2; index < input.length - 1; index++) {
      if (input[index] === "{" && input[index + 1] === "{") {
        depth += 1;
        index += 1;
        continue;
      }
      if (input[index] === "}" && input[index + 1] === "}") {
        depth -= 1;
        index += 1;
        if (depth === 0) return index + 1;
      }
    }
    return -1;
  }
  function replaceBalancedMacros2(input, replacer) {
    let result = "";
    let index = 0;
    while (index < input.length) {
      const start2 = input.indexOf("{{", index);
      if (start2 === -1) {
        result += input.slice(index);
        break;
      }
      result += input.slice(index, start2);
      const end = findBalancedMacroEnd2(input, start2);
      if (end === -1) {
        result += input.slice(start2);
        break;
      }
      const original = input.slice(start2, end);
      const body = input.slice(start2 + 2, end - 2);
      const replacement = replacer(body, original);
      if (replacement !== void 0) {
        result += replacement;
        index = end;
      } else {
        result += "{{";
        index = start2 + 2;
      }
    }
    return result;
  }
  function encodeDeferredConditional(payload, prefix = DEFERRED_CHARACTER_CONDITIONAL_TOKEN_PREFIX) {
    return `${prefix}${encodeURIComponent(JSON.stringify(payload))}`;
  }
  function quoteKind(value) {
    if (!value) return null;
    if (/["\u201c\u201d\u201e\u201f]/u.test(value)) return "double";
    if (/['\u2018\u2019\u201a\u201b]/u.test(value)) return "single";
    return null;
  }
  function stripOuterQuotes(value) {
    const trimmed = value.trim();
    if (trimmed.length < 2) return null;
    const openingKind = quoteKind(trimmed[0]);
    if (!openingKind || quoteKind(trimmed[trimmed.length - 1]) !== openingKind) return null;
    return trimmed.slice(1, -1).replace(/\\(["'\u2018\u2019\u201a\u201b\u201c\u201d\u201e\u201f\\])/g, "$1").replace(/\\n/g, "\n");
  }
  var DECISION_OPERAND_PREFIX_RE = /^decision\s*:/iu;
  var DECISION_CHOICE_OPERAND_PREFIX_RE = /^decision_choice\s*:/iu;
  var MAX_DECISION_TIMING_TURNS = 1e3;
  var DECISION_STATEMENT_WITH_MODIFIERS_RE = /^(["\u201c\u201d\u201e\u201f]|['\u2018\u2019\u201a\u201b])([\s\S]*)(["\u201c\u201d\u201e\u201f]|['\u2018\u2019\u201a\u201b])((?:\s+[a-z_]+\s*:\s*\S+)*)\s*$/iu;
  var DECISION_LIFETIME_RE = /\s+(until|while)\s*:\s*(?:["\u201c\u201d\u201e\u201f]([^"\u201c\u201d\u201e\u201f]*)["\u201c\u201d\u201e\u201f]|['\u2018\u2019\u201a\u201b]([^'\u2018\u2019\u201a\u201b]*)['\u2018\u2019\u201a\u201b])(?::([a-z]+))?(?=\s|$)/giu;
  function lifetimeModifier(kind, statement, mode = "") {
    if (!statement.trim()) return void 0;
    const until = kind.toLowerCase() === "until";
    const set = mode.toLowerCase();
    const and = set === "and" || set === "restrict" ? true : set === "or" || set === "extend" ? false : until;
    return { statement: statement.trim(), kind: until ? "until" : "while", mode: and ? "and" : "or" };
  }
  function statementAfterPrefix(raw, prefix) {
    const token = raw.trim();
    if (!prefix.test(token)) return null;
    const timing = {};
    const rest = token.replace(prefix, "").replace(DECISION_LIFETIME_RE, (_match, kind, double, single, mode) => {
      const lasts = timing.lasts ?? lifetimeModifier(kind, double ?? single ?? "", mode);
      if (lasts) timing.lasts = lasts;
      return "";
    }).trim();
    const quoted = DECISION_STATEMENT_WITH_MODIFIERS_RE.exec(rest);
    if (quoted && quoteKind(quoted[1]) === quoteKind(quoted[3]) && quoted[4].trim()) {
      const question2 = stripOuterQuotes(`${quoted[1]}${quoted[2]}${quoted[3]}`) ?? quoted[2];
      if (!question2.trim()) return null;
      for (const modifier of quoted[4].trim().split(/\s+(?=[a-z_]+\s*:)/iu)) {
        const [name, value] = modifier.split(":").map((part) => part.trim().toLowerCase());
        const turns = /^\d+$/u.test(value ?? "") ? Math.min(MAX_DECISION_TIMING_TURNS, Number(value)) : NaN;
        if ((name === "sticky" || name === "cooldown" || name === "every") && turns > 0) timing[name] = turns;
        else if (name === "priority" && (value === "high" || value === "low")) timing.priority = value;
      }
      return { question: question2, timing };
    }
    const question = stripOuterQuotes(rest) ?? rest;
    return question.trim() ? { question, timing } : null;
  }
  function decisionQuestionFromOperand(raw) {
    return statementAfterPrefix(raw, DECISION_OPERAND_PREFIX_RE)?.question ?? null;
  }
  function decisionChoiceQuestionFromOperand(raw) {
    return statementAfterPrefix(raw, DECISION_CHOICE_OPERAND_PREFIX_RE)?.question ?? null;
  }
  var DECISION_CHOICE_OPERATORS = /* @__PURE__ */ new Set(["==", "=", "is", "!=", "is not"]);
  function splitChoiceCriteria(raw) {
    const trimmed = raw.trim();
    if (stripOuterQuotes(trimmed) === null) return null;
    const kind = quoteKind(trimmed[0]);
    let escaped = false;
    for (let index = 1; index < trimmed.length - 1; index += 1) {
      const character = trimmed[index];
      if (escaped) escaped = false;
      else if (character === "\\") escaped = true;
      else if (quoteKind(character) === kind) {
        const separator = /^\s*:\s*/u.exec(trimmed.slice(index + 1));
        const rest = separator ? trimmed.slice(index + 1 + separator[0].length) : "";
        const criteria = quoteKind(rest[0]) === kind ? stripOuterQuotes(rest) : null;
        if (criteria === null) return null;
        const optionRaw = trimmed.slice(0, index + 1);
        return { option: stripOuterQuotes(optionRaw), optionRaw, criteria };
      }
    }
    return null;
  }
  function withoutChoiceCriteria(parsed) {
    if (parsed.right === void 0 || !DECISION_CHOICE_OPERATORS.has(parsed.operator)) return parsed;
    if (decisionChoiceQuestionFromOperand(parsed.left) !== null) {
      const right = splitChoiceCriteria(parsed.right)?.optionRaw;
      return right ? { ...parsed, right } : parsed;
    }
    if (decisionChoiceQuestionFromOperand(parsed.right) !== null) {
      const left = splitChoiceCriteria(parsed.left)?.optionRaw;
      return left ? { ...parsed, left } : parsed;
    }
    return parsed;
  }
  function normalizeDecisionQuestion(text2) {
    return text2.replace(/\s+/gu, " ").trim();
  }
  function resolveDecisionQuestionText(question, ctx) {
    return normalizeDecisionQuestion(resolveMacros(question, { ...ctx, decisions: void 0 }, { trimResult: true }));
  }
  function normalizeConditionKey(value) {
    return value.trim().replace(/^@/, "").toLowerCase();
  }
  function resolvePersonaText(ctx) {
    return [
      ctx.personaFields?.description,
      ctx.personaFields?.personality,
      ctx.personaFields?.backstory,
      ctx.personaFields?.appearance,
      ctx.personaFields?.scenario
    ].filter((part) => typeof part === "string" && part.trim().length > 0).join("\n");
  }
  function resolveConditionalOperand(raw, ctx, options) {
    const quoted = stripOuterQuotes(raw);
    if (quoted !== null) return quoted;
    const decisionQuestion = decisionQuestionFromOperand(raw);
    if (decisionQuestion !== null) {
      const key = resolveDecisionQuestionText(decisionQuestion, ctx);
      const answer = ctx.decisions?.answers?.get(key);
      if (answer === void 0 && key) ctx.decisions?.unanswered?.add(key);
      return answer === true ? "true" : "";
    }
    const choiceQuestion = decisionChoiceQuestionFromOperand(raw);
    if (choiceQuestion !== null) {
      const key = resolveDecisionQuestionText(choiceQuestion, ctx);
      const choice = ctx.decisions?.choices?.get(key);
      if (choice === void 0 && key) ctx.decisions?.unanswered?.add(key);
      return choice ?? "";
    }
    const token = raw.trim();
    const normalized = normalizeConditionKey(token);
    switch (normalized) {
      case "char":
      case "charname":
      case "character":
      case "speaker":
        return ctx.char;
      case "charphonetic":
      case "charnamephonetic":
      case "characterphonetic":
      case "speakerphonetic":
        return ctx.charPhonetic || ctx.characterFields?.phoneticName || ctx.char;
      case "user":
      case "username":
        return ctx.user;
      case "userphonetic":
      case "usernamephonetic":
        return ctx.userPhonetic || ctx.personaFields?.phoneticName || ctx.user;
      case "persona":
        return resolvePersonaText(ctx);
      case "personadescription":
        return ctx.personaFields?.description ?? "";
      case "personapersonality":
        return ctx.personaFields?.personality ?? "";
      case "personabackstory":
        return ctx.personaFields?.backstory ?? "";
      case "personaappearance":
        return ctx.personaFields?.appearance ?? "";
      case "personascenario":
        return ctx.personaFields?.scenario ?? "";
      case "characters":
        return ctx.characters.join(", ");
      case "group":
        return resolveGroupCharacters(ctx);
      case "input":
        return ctx.lastInput ?? "";
      case "model":
        return ctx.model ?? "";
      case "reasoning": {
        const name = token.replace(/^@/, "");
        const reasoning = readReasoningMacro(ctx, name);
        if (reasoning !== void 0) return reasoning;
        return readMacroVariable(ctx.variables, name) ?? readMacroVariable(ctx.localVariables, name) ?? "";
      }
      case "chatid":
        return ctx.chatId ?? "";
      case "description":
        return ctx.characterFields?.description ?? "";
      case "personality":
        return ctx.characterFields?.personality ?? "";
      case "backstory":
        return ctx.characterFields?.backstory ?? "";
      case "appearance":
        return ctx.characterFields?.appearance ?? "";
      case "scenario":
        return ctx.characterFields?.scenario ?? "";
      case "example":
        return ctx.characterFields?.example ?? "";
      case "charsysinfo":
        return ctx.characterFields?.systemPrompt ?? "";
      case "charposthistory":
        return ctx.characterFields?.postHistoryInstructions ?? "";
      default:
        if (/^var[:.]/i.test(token)) {
          const name = token.replace(/^var[:.]/i, "").trim();
          return readMacroVariable(ctx.variables, name) ?? readMacroVariable(ctx.localVariables, name) ?? "";
        }
        if (!/^(setvar|addvar|addnumvar|incvar|decvar)\b/i.test(token)) {
          const braced = `{{${token}}}`;
          const resolved = resolveMacros(braced, ctx, {
            ...nestedMacroOptions(options),
            trimResult: false,
            deferCharacterMacros: void 0
          });
          if (resolved !== braced) return resolved;
        }
        return readMacroVariable(ctx.variables, token) ?? readMacroVariable(ctx.localVariables, token) ?? token;
    }
  }
  function isCharacterConditionalOperand(raw) {
    const decisionQuestion = decisionQuestionFromOperand(raw) ?? decisionChoiceQuestionFromOperand(raw);
    if (decisionQuestion !== null) return hasCharacterMacro(decisionQuestion);
    return CHARACTER_CONDITIONAL_OPERAND_NAMES.has(normalizeConditionKey(raw));
  }
  var CONDITION_WORD_OPERATOR_RE = /(?:is\s+not|not\s+contains|not\s+includes|contains|includes|is)(?=\s|$)/iuy;
  function parseConditionExpression(condition) {
    const symbolicOperators = [">=", "<=", "==", "!=", ">", "<", "="];
    let quote = null;
    let escaped = false;
    let macroDepth = 0;
    for (let index = 0; index < condition.length; index += 1) {
      const character = condition[index];
      if (quote) {
        if (escaped) escaped = false;
        else if (character === "\\") escaped = true;
        else if (quoteKind(character) === quote) quote = null;
        continue;
      }
      if (macroDepth > 0) {
        if (character === "{" && condition[index + 1] === "{") {
          macroDepth += 1;
          index += 1;
        } else if (character === "}" && condition[index + 1] === "}") {
          macroDepth -= 1;
          index += 1;
        }
        continue;
      }
      const nextQuote = quoteKind(character);
      if (nextQuote) {
        quote = nextQuote;
        continue;
      }
      if (character === "{" && condition[index + 1] === "{") {
        macroDepth = 1;
        index += 1;
        continue;
      }
      const symbolicOperator = symbolicOperators.find((operator) => condition.startsWith(operator, index));
      if (symbolicOperator) {
        const left = condition.slice(0, index).trim();
        const right = condition.slice(index + symbolicOperator.length).trim();
        if (left && right) return { left, operator: symbolicOperator, right };
      }
      if (index === 0 || /\s/u.test(condition[index - 1])) {
        CONDITION_WORD_OPERATOR_RE.lastIndex = index;
        const wordMatch = CONDITION_WORD_OPERATOR_RE.exec(condition);
        if (wordMatch?.[0]) {
          const left = condition.slice(0, index).trim();
          const right = condition.slice(index + wordMatch[0].length).trim();
          if (left && right) {
            return { left, operator: wordMatch[0].toLowerCase().replace(/\s+/g, " "), right };
          }
        }
      }
    }
    return { left: condition.trim(), operator: "truthy" };
  }
  function createConditionSyntaxFrame(atomStart) {
    return {
      atomStart,
      andChildren: [],
      orChildren: [],
      expectsOperand: true,
      literalParenthesisDepth: 0
    };
  }
  function appendConditionSyntaxNode(frame, node) {
    if (!frame.expectsOperand) {
      const previous = frame.andChildren.pop();
      if (previous.kind === "adjacent") {
        previous.children.push(node);
        frame.andChildren.push(previous);
      } else {
        frame.andChildren.push({ kind: "adjacent", children: [previous, node] });
      }
      frame.expectsOperand = false;
      return;
    }
    frame.andChildren.push(node);
    frame.expectsOperand = false;
  }
  function conditionSyntaxNodeText(node) {
    const parts = [];
    const pending = [node];
    while (pending.length > 0) {
      const part = pending.pop();
      if (typeof part === "string") {
        parts.push(part);
      } else if (part.kind === "atom") {
        parts.push(part.value);
      } else if (part.kind === "group") {
        pending.push(")", part.child, "(");
      } else {
        const separator = part.kind === "and" ? " && " : part.kind === "or" ? " || " : "";
        for (let index = part.children.length - 1; index >= 0; index -= 1) {
          pending.push(part.children[index]);
          if (index > 0 && separator) pending.push(separator);
        }
      }
    }
    return parts.join("");
  }
  function appendConditionAtom(frame, condition, end, forceEmpty) {
    const value = condition.slice(frame.atomStart, end).trim();
    frame.atomStart = end;
    if (!value && !(forceEmpty && frame.expectsOperand)) return;
    appendConditionSyntaxNode(frame, { kind: "atom", value });
  }
  function combineConditionNodes(kind, children) {
    return children.length === 1 ? children[0] : { kind, children };
  }
  function finishConditionSyntaxFrame(frame) {
    const andNode = combineConditionNodes("and", frame.andChildren);
    if (frame.orChildren.length === 0) return andNode;
    return combineConditionNodes("or", [...frame.orChildren, andNode]);
  }
  function parseConditionSyntax(condition) {
    const frames = [createConditionSyntaxFrame(0)];
    let quote = null;
    let escaped = false;
    let macroDepth = 0;
    for (let index = 0; index < condition.length; index += 1) {
      const character = condition[index];
      const frame = frames[frames.length - 1];
      if (quote) {
        if (escaped) escaped = false;
        else if (character === "\\") escaped = true;
        else if (quoteKind(character) === quote) quote = null;
        continue;
      }
      if (macroDepth > 0) {
        if (character === "{" && condition[index + 1] === "{") {
          macroDepth += 1;
          index += 1;
        } else if (character === "}" && condition[index + 1] === "}") {
          macroDepth -= 1;
          index += 1;
        }
        continue;
      }
      const nextQuote = quoteKind(character);
      if (nextQuote) {
        quote = nextQuote;
        continue;
      }
      if (character === "{" && condition[index + 1] === "{") {
        macroDepth = 1;
        index += 1;
        continue;
      }
      if (character === "(") {
        const prefix = condition.slice(frame.atomStart, index);
        if (frame.literalParenthesisDepth === 0 && frame.expectsOperand && prefix.trim().length === 0) {
          frames.push(createConditionSyntaxFrame(index + 1));
        } else {
          frame.literalParenthesisDepth += 1;
        }
        continue;
      }
      if (character === ")") {
        if (frame.literalParenthesisDepth > 0) {
          frame.literalParenthesisDepth -= 1;
          continue;
        }
        if (frames.length === 1) {
          if (frame.andChildren.length > 0) {
            appendConditionSyntaxNode(frame, { kind: "atom", value: ")" });
            frame.atomStart = index + 1;
          }
          continue;
        }
        appendConditionAtom(frame, condition, index, true);
        const groupedNode = finishConditionSyntaxFrame(frame);
        frames.pop();
        const parent = frames[frames.length - 1];
        appendConditionSyntaxNode(parent, { kind: "group", child: groupedNode });
        parent.atomStart = index + 1;
        continue;
      }
      const operator = frame.literalParenthesisDepth === 0 ? condition.slice(index, index + 2) : "";
      if (operator !== "&&" && operator !== "||") continue;
      appendConditionAtom(frame, condition, index, true);
      if (operator === "||") {
        frame.orChildren.push(combineConditionNodes("and", frame.andChildren));
        frame.andChildren = [];
      }
      frame.expectsOperand = true;
      frame.atomStart = index + 2;
      index += 1;
    }
    const root2 = frames[0];
    appendConditionAtom(root2, condition, condition.length, true);
    return finishConditionSyntaxFrame(root2);
  }
  function parseConditionComparisons(condition) {
    const comparisons = [];
    const pending = [parseConditionSyntax(condition)];
    while (pending.length > 0) {
      const node = pending.pop();
      if (node.kind === "atom") {
        comparisons.push(parseConditionExpression(node.value));
      } else if (node.kind === "group") {
        pending.push(node.child);
      } else if (node.kind === "adjacent") {
        comparisons.push(parseConditionExpression(conditionSyntaxNodeText(node)));
      } else {
        for (let index = node.children.length - 1; index >= 0; index -= 1) pending.push(node.children[index]);
      }
    }
    return comparisons;
  }
  function conditionHasLegacyAdjacentCharacterReference(condition) {
    const pending = [
      { node: parseConditionSyntax(condition), insideAdjacent: false }
    ];
    while (pending.length > 0) {
      const { node, insideAdjacent } = pending.pop();
      if (node.kind === "atom") {
        if (!insideAdjacent) continue;
        const parsed = parseConditionExpression(node.value);
        if (isCharacterConditionalOperand(parsed.left) || (parsed.right ? isCharacterConditionalOperand(parsed.right) : false)) {
          return true;
        }
      } else if (node.kind === "group") {
        pending.push({ node: node.child, insideAdjacent });
      } else {
        const childInsideAdjacent = insideAdjacent || node.kind === "adjacent";
        for (const child of node.children) pending.push({ node: child, insideAdjacent: childInsideAdjacent });
      }
    }
    return false;
  }
  function conditionDependsOnCharacter(condition) {
    return parseConditionComparisons(condition).some(
      (parsed) => isCharacterConditionalOperand(parsed.left) || (parsed.right ? isCharacterConditionalOperand(parsed.right) : false)
    );
  }
  function parseConditionNumber(value) {
    const trimmed = value.trim();
    if (!trimmed) return null;
    const parsed = Number(trimmed);
    return Number.isFinite(parsed) ? parsed : null;
  }
  function compareConditionValues(left, operator, right) {
    const leftNormalized = left.trim().toLowerCase();
    const rightNormalized = right.trim().toLowerCase();
    const leftNumber = parseConditionNumber(left);
    const rightNumber = parseConditionNumber(right);
    const bothNumeric = leftNumber !== null && rightNumber !== null;
    switch (operator) {
      case "=":
      case "==":
      case "is":
        if (bothNumeric) return leftNumber === rightNumber;
        return leftNormalized === rightNormalized;
      case "!=":
      case "is not":
        if (bothNumeric) return leftNumber !== rightNumber;
        return leftNormalized !== rightNormalized;
      case ">":
        return bothNumeric ? leftNumber > rightNumber : false;
      case "<":
        return bothNumeric ? leftNumber < rightNumber : false;
      case ">=":
        return bothNumeric ? leftNumber >= rightNumber : false;
      case "<=":
        return bothNumeric ? leftNumber <= rightNumber : false;
      case "contains":
      case "includes":
        return leftNormalized.includes(rightNormalized);
      case "not contains":
      case "not includes":
        return !leftNormalized.includes(rightNormalized);
      default:
        return false;
    }
  }
  function resolveConditionMacros(condition, ctx, options) {
    if (!condition.includes("{{")) return condition;
    return resolveMacros(condition, ctx, {
      ...nestedMacroOptions(options),
      trimResult: false
    });
  }
  function evaluateParsedCondition(written, ctx, options) {
    const parsed = withoutChoiceCriteria(written);
    const left = resolveConditionalOperand(parsed.left, ctx, options);
    if (parsed.operator === "truthy") return left.trim().length > 0 && !/^(false|0|no|off|null|undefined)$/i.test(left);
    const right = resolveConditionalOperand(parsed.right ?? "", ctx, options);
    if (isUnansweredDecisionOperand(parsed.left, ctx) || isUnansweredDecisionOperand(parsed.right ?? "", ctx))
      return false;
    return compareConditionValues(left, parsed.operator, right);
  }
  function isUnansweredDecisionOperand(raw, ctx) {
    const question = decisionQuestionFromOperand(raw);
    if (question !== null) return ctx.decisions?.answers?.get(resolveDecisionQuestionText(question, ctx)) === void 0;
    const choiceQuestion = decisionChoiceQuestionFromOperand(raw);
    if (choiceQuestion !== null)
      return ctx.decisions?.choices?.get(resolveDecisionQuestionText(choiceQuestion, ctx)) === void 0;
    return false;
  }
  function parseResolvedConditionAtom(atom, ctx, options) {
    return parseConditionExpression(resolveConditionMacros(atom, ctx, options));
  }
  function conditionSyntaxAtomValue(node) {
    if (node.kind === "atom") return node.value;
    return node.kind === "adjacent" ? conditionSyntaxNodeText(node) : null;
  }
  function evaluateOrConditionAtom(atom, equalityShorthand, ctx, options) {
    const parsed = parseResolvedConditionAtom(atom, ctx, options);
    let effective = parsed;
    let nextShorthand = equalityShorthand;
    if (["=", "==", "is"].includes(parsed.operator) && parsed.right !== void 0) {
      nextShorthand = { left: parsed.left, operator: parsed.operator };
    } else if (equalityShorthand && parsed.operator === "truthy" && stripOuterQuotes(parsed.left) !== null) {
      effective = { ...equalityShorthand, right: parsed.left };
    }
    return { matches: evaluateParsedCondition(effective, ctx, options), equalityShorthand: nextShorthand };
  }
  function evaluateConditionExpression(condition, ctx, options) {
    const frames = [];
    let current = parseConditionSyntax(condition);
    let result = false;
    while (true) {
      if (current) {
        if (current.kind === "atom" || current.kind === "adjacent") {
          result = evaluateParsedCondition(
            parseResolvedConditionAtom(conditionSyntaxAtomValue(current), ctx, options),
            ctx,
            options
          );
          current = null;
        } else if (current.kind === "group") {
          frames.push({ kind: "group" });
          current = current.child;
          continue;
        } else if (current.kind === "and") {
          frames.push({ kind: "and", children: current.children, index: 0 });
          current = current.children[0];
          continue;
        } else {
          const frame2 = {
            kind: "or",
            children: current.children,
            index: 0,
            equalityShorthand: null
          };
          frames.push(frame2);
          const child2 = current.children[0];
          if (child2.kind === "atom" || child2.kind === "adjacent") {
            const evaluated = evaluateOrConditionAtom(
              conditionSyntaxAtomValue(child2),
              frame2.equalityShorthand,
              ctx,
              options
            );
            frame2.equalityShorthand = evaluated.equalityShorthand;
            result = evaluated.matches;
            current = null;
          } else {
            current = child2;
          }
          continue;
        }
      }
      const frame = frames[frames.length - 1];
      if (!frame) return result;
      if (frame.kind === "group") {
        frames.pop();
        continue;
      }
      if (frame.kind === "and") {
        if (!result) {
          frames.pop();
          continue;
        }
        frame.index += 1;
        if (frame.index >= frame.children.length) {
          frames.pop();
          result = true;
        } else {
          current = frame.children[frame.index];
        }
        continue;
      }
      if (result) {
        frames.pop();
        continue;
      }
      frame.index += 1;
      if (frame.index >= frame.children.length) {
        frames.pop();
        result = false;
        continue;
      }
      const child = frame.children[frame.index];
      if (child.kind === "atom" || child.kind === "adjacent") {
        const evaluated = evaluateOrConditionAtom(
          conditionSyntaxAtomValue(child),
          frame.equalityShorthand,
          ctx,
          options
        );
        frame.equalityShorthand = evaluated.equalityShorthand;
        result = evaluated.matches;
      } else {
        current = child;
      }
    }
  }
  function evaluateCondition(condition, ctx, options = {}) {
    return evaluateConditionExpression(condition, ctx, options);
  }
  function readNextMacroTag(input, fromIndex) {
    let searchIndex = fromIndex;
    while (searchIndex < input.length) {
      const start2 = input.indexOf("{{", searchIndex);
      if (start2 === -1) return null;
      const end = findBalancedMacroEnd2(input, start2);
      if (end === -1) return null;
      return { start: start2, end, body: input.slice(start2 + 2, end - 2).trim() };
    }
    return null;
  }
  function parseIfCondition(body) {
    const match = body.match(/^#if(?:\s+([\s\S]*))?$/i);
    return match ? (match[1] ?? "").trim() : null;
  }
  function parseElseIfCondition(body) {
    const match = body.match(/^else\s+if(?:\s+([\s\S]*))?$/i);
    return match ? (match[1] ?? "").trim() : null;
  }
  function findConditionalStart(input, fromIndex) {
    let searchIndex = fromIndex;
    while (searchIndex < input.length) {
      const tag = readNextMacroTag(input, searchIndex);
      if (!tag) return null;
      const condition = parseIfCondition(tag.body);
      if (condition !== null) return { ...tag, condition };
      searchIndex = tag.end;
    }
    return null;
  }
  function findConditionalBranches(input, contentStart, initialCondition) {
    let depth = 1;
    let currentBranch = {
      condition: initialCondition,
      contentStart
    };
    const branches = [];
    let searchIndex = contentStart;
    while (searchIndex < input.length) {
      const tag = readNextMacroTag(input, searchIndex);
      if (!tag) return null;
      const body = tag.body;
      const normalized = body.toLowerCase();
      if (parseIfCondition(body) !== null) {
        depth += 1;
        searchIndex = tag.end;
        continue;
      }
      if (normalized === "/if") {
        depth -= 1;
        if (depth === 0) {
          branches.push({ ...currentBranch, contentEnd: tag.start });
          return { branches, endStart: tag.start, endEnd: tag.end };
        }
        searchIndex = tag.end;
        continue;
      }
      if (depth === 1) {
        const elseIfCondition = parseElseIfCondition(body);
        if (normalized === "else" || elseIfCondition !== null) {
          branches.push({ ...currentBranch, contentEnd: tag.start });
          currentBranch = {
            condition: normalized === "else" ? null : elseIfCondition ?? "",
            contentStart: tag.end
          };
          searchIndex = tag.end;
          continue;
        }
      }
      searchIndex = tag.end;
    }
    return null;
  }
  function branchDependsOnCharacter(branches) {
    return branches.some((branch) => branch.condition !== null && conditionDependsOnCharacter(branch.condition));
  }
  function conditionDependsOnDeferredOperand(condition, predicate) {
    return parseConditionComparisons(condition).some(
      (parsed) => predicate(parsed.left) || (parsed.right ? predicate(parsed.right) : false)
    );
  }
  function isDeferredPresetOperand(operand, ctx) {
    const claimed = ctx.deferredPresetVariableNames;
    if (!claimed?.size) return false;
    const unwrap = (value) => value.trim().replace(/^var[:.]/i, "").trim();
    if (claimed.has(unwrap(operand))) return true;
    for (const match of operand.matchAll(/\{\{\s*([^{}]+?)\s*\}\}/g)) {
      if (claimed.has(unwrap(match[1]))) return true;
    }
    return false;
  }
  function branchDependsOnDeferredOperand(branches, predicate) {
    return branches.some(
      (branch) => branch.condition !== null && conditionDependsOnDeferredOperand(branch.condition, predicate)
    );
  }
  function trimDeferredStandaloneBranches(branches, openStandalone, closeStandalone) {
    if (!openStandalone && !closeStandalone) return branches;
    return branches.map((branch, index) => {
      let content = branch.content;
      if (openStandalone) content = content.replace(/^[ \t]*\n/, "");
      if (closeStandalone && index === branches.length - 1) content = content.replace(/\n[ \t]*$/, "\n");
      return { condition: branch.condition, content };
    });
  }
  function selectConditionalPayloadBranch(payload, ctx, options) {
    const chainBranches = payload.branches;
    const branches = Array.isArray(chainBranches) ? chainBranches : [
      {
        condition: payload.condition,
        content: payload.truthy
      },
      { condition: null, content: payload.falsy }
    ];
    if (ctx.decisions?.planned) return planConditionalBranches(branches, ctx.decisions.planned, ctx, options);
    for (const branch of branches) {
      if (branch.condition === null || evaluateCondition(branch.condition, ctx, options)) {
        return branch.content;
      }
    }
    return "";
  }
  var PLAN_LATE_OPERAND_NAMES = /* @__PURE__ */ new Set(["char_about", "convo_display", "convo_behavior"]);
  var PLAN_FIXED_OPERAND_NAMES = /* @__PURE__ */ new Set([
    ...[...CHARACTER_CONDITIONAL_OPERAND_NAMES].filter((name) => !PLAN_LATE_OPERAND_NAMES.has(name)),
    "user",
    "username",
    "userphonetic",
    "usernamephonetic",
    "persona",
    "personadescription",
    "personapersonality",
    "personabackstory",
    "personaappearance",
    "personascenario",
    "characters",
    "group",
    "input",
    "model",
    "reasoning",
    "chatid",
    "description",
    "personality",
    "backstory",
    "appearance",
    "scenario",
    "example",
    "charsysinfo",
    "charposthistory"
  ]);
  var PLAN_PER_CHARACTER_OPERAND_NAMES = /* @__PURE__ */ new Set([
    ...CHARACTER_CONDITIONAL_OPERAND_NAMES,
    "description",
    "personality",
    "backstory",
    "appearance",
    "scenario",
    "example",
    "charsysinfo",
    "charposthistory"
  ]);
  function planConditionOperand(raw, statements, ctx, options) {
    const quoted = stripOuterQuotes(raw);
    if (quoted !== null) return quoted;
    const noulQuestion = decisionQuestionFromOperand(raw);
    const question = noulQuestion ?? decisionChoiceQuestionFromOperand(raw);
    if (question !== null) {
      const written = normalizeDecisionQuestion(question);
      if (written) statements.push(written);
      const resolved = resolveDecisionQuestionText(question, ctx);
      if (resolved && resolved !== written) statements.push(resolved);
      if (noulQuestion !== null) {
        const answer = ctx.decisions?.answers?.get(resolved);
        return answer === void 0 ? null : answer ? "true" : "";
      }
      return ctx.decisions?.choices?.get(resolved) ?? null;
    }
    if (ctx.decisions?.plannedSettledOnly) return resolveConditionalOperand(raw, ctx, options);
    const token = raw.trim();
    if (/^-?\d+(?:\.\d+)?$/u.test(token)) return token;
    const key = normalizeConditionKey(token);
    if (!PLAN_FIXED_OPERAND_NAMES.has(key)) return null;
    const group = (ctx.characterProfiles?.length ?? 0) > 1 || ctx.characters.length > 1;
    if (group && PLAN_PER_CHARACTER_OPERAND_NAMES.has(key)) return null;
    return resolveConditionalOperand(raw, ctx, options);
  }
  function planConditionAtom(atom, equalityShorthand, ctx, options) {
    const parsed = ctx.decisions?.plannedSettledOnly ? parseResolvedConditionAtom(atom, ctx, options) : parseConditionExpression(atom);
    let effective = parsed;
    let nextShorthand = equalityShorthand;
    if (["=", "==", "is"].includes(parsed.operator) && parsed.right !== void 0) {
      nextShorthand = { left: parsed.left, operator: parsed.operator };
    } else if (equalityShorthand && parsed.operator === "truthy" && stripOuterQuotes(parsed.left) !== null) {
      effective = { ...equalityShorthand, right: parsed.left };
    }
    effective = withoutChoiceCriteria(effective);
    const statements = [];
    const left = planConditionOperand(effective.left, statements, ctx, options);
    const right = effective.operator === "truthy" ? "" : planConditionOperand(effective.right ?? "", statements, ctx, options);
    let value;
    if (left === null || right === null) value = "unknown";
    else if (effective.operator === "truthy")
      value = left.trim().length > 0 && !/^(false|0|no|off|null|undefined)$/i.test(left);
    else value = compareConditionValues(left, effective.operator, right);
    return { value, statements, equalityShorthand: nextShorthand };
  }
  function planCondition(node, ctx, options) {
    if (node.kind === "atom" || node.kind === "adjacent")
      return planConditionAtom(conditionSyntaxAtomValue(node), null, ctx, options);
    if (node.kind === "group") return planCondition(node.child, ctx, options);
    const settles = node.kind === "and" ? false : true;
    const statements = [];
    let unknown = false;
    let equalityShorthand = null;
    for (const child of node.children) {
      let result;
      if (node.kind === "or" && (child.kind === "atom" || child.kind === "adjacent")) {
        const atom = planConditionAtom(conditionSyntaxAtomValue(child), equalityShorthand, ctx, options);
        equalityShorthand = atom.equalityShorthand;
        result = atom;
      } else {
        result = planCondition(child, ctx, options);
      }
      if (result.value === settles) return { value: settles, statements: [] };
      if (result.value === "unknown") unknown = true;
      statements.push(...result.statements);
    }
    return { value: unknown ? "unknown" : !settles, statements };
  }
  function planConditionalBranches(branches, planned, ctx, options) {
    const reached = [];
    for (const branch of branches) {
      if (branch.condition === null) {
        reached.push(branch.content);
        break;
      }
      const result = planCondition(parseConditionSyntax(branch.condition), ctx, options);
      for (const statement of result.statements) planned.add(statement);
      if (result.value === false) continue;
      if (result.value === "unknown" && ctx.decisions?.plannedSettledOnly) break;
      reached.push(branch.content);
      if (result.value === true) break;
    }
    return reached.join("\n");
  }
  function resolveVariableOperationMacros(input, ctx, options) {
    return replaceBalancedMacros2(input, (body, original) => {
      const readMatch = body.match(/^(getvar|incvar|decvar)::([\w.-]+)$/i);
      const writeMatch = body.match(/^(setvar|addvar|addnumvar)::([\w.-]+)::([\s\S]*)$/i);
      const op = String(readMatch?.[1] ?? writeMatch?.[1] ?? "").toLowerCase();
      const name = readMatch?.[2] ?? writeMatch?.[2];
      if (!op || !name) return void 0;
      if (!consumeMacroExpansion(options)) return original;
      const localVariables = ctx.localVariables ?? (ctx.localVariables = ctx.variables);
      const readLocalVariable = () => Object.prototype.hasOwnProperty.call(localVariables, name) ? localVariables[name] : void 0;
      const writeLocalVariable = (value) => {
        Object.defineProperty(localVariables, name, {
          value,
          enumerable: true,
          configurable: true,
          writable: true
        });
        return value;
      };
      switch (op) {
        case "getvar":
          return readLocalVariable() ?? "";
        case "setvar":
          writeLocalVariable(
            resolveMacros(writeMatch?.[3] ?? "", ctx, {
              ...nestedMacroOptions(options),
              trimResult: false
            })
          );
          return "";
        case "addvar": {
          const current = readLocalVariable() ?? "";
          const added = resolveMacros(writeMatch?.[3] ?? "", ctx, {
            ...nestedMacroOptions(options),
            trimResult: false
          });
          const currentNumber = Number(current);
          const addedNumber = Number(added);
          writeLocalVariable(
            current.trim() && added.trim() && Number.isFinite(currentNumber) && Number.isFinite(addedNumber) ? String(currentNumber + addedNumber) : current + added
          );
          return "";
        }
        case "addnumvar": {
          const currentValue = Number(readLocalVariable() ?? "0");
          const addedValue = Number(
            resolveMacros(writeMatch?.[3] ?? "", ctx, { ...nestedMacroOptions(options), trimResult: false })
          );
          const currentNumber = Number.isFinite(currentValue) ? currentValue : 0;
          const addedNumber = Number.isFinite(addedValue) ? addedValue : 0;
          const sum = currentNumber + addedNumber;
          writeLocalVariable(String(Number.isFinite(sum) ? sum : currentNumber));
          return "";
        }
        case "incvar": {
          const current = Number(readLocalVariable() ?? "0");
          const next = (Number.isFinite(current) ? current : 0) + 1;
          return writeLocalVariable(String(next));
        }
        case "decvar": {
          const current = Number(readLocalVariable() ?? "0");
          const next = (Number.isFinite(current) ? current : 0) - 1;
          return writeLocalVariable(String(next));
        }
        default:
          return "";
      }
    });
  }
  function resolveConditionalBlocks(input, ctx, options) {
    let result = "";
    let index = 0;
    while (index < input.length) {
      const startMatch = findConditionalStart(input, index);
      if (!startMatch) {
        result += resolveVariableOperationMacros(input.slice(index), ctx, options);
        break;
      }
      const blockStart = startMatch.start;
      const condition = startMatch.condition;
      const contentStart = startMatch.end;
      const blockEnd = findConditionalBranches(input, contentStart, condition);
      if (!blockEnd) {
        result += resolveVariableOperationMacros(input.slice(index), ctx, options);
        break;
      }
      const branches = blockEnd.branches.map((branch) => ({
        condition: branch.condition,
        content: input.slice(branch.contentStart, branch.contentEnd)
      }));
      const preTag = input.slice(index, blockStart);
      const resolvedPreTag = resolveVariableOperationMacros(preTag, ctx, options);
      const openLineStart = /(^|\n)[ \t]*$/.test(preTag);
      const openLineEnd = /^[ \t]*\n/.test(input.slice(contentStart));
      const openStandalone = openLineStart && openLineEnd;
      const closeLineIndentStart = input.lastIndexOf("\n", blockEnd.endStart - 1) + 1;
      const closeLineStart = /^[ \t]*$/.test(input.slice(closeLineIndentStart, blockEnd.endStart));
      const closeTrailing = input.slice(blockEnd.endEnd).match(/^[ \t]*\n/);
      const closeStandalone = closeLineStart && closeTrailing !== null;
      const deferCharacter = Boolean(options.deferCharacterMacros) && branchDependsOnCharacter(branches);
      const deferOperand = options.deferConditionalOperand !== void 0 || ctx.deferredPresetVariableNames?.size ? (operand) => options.deferConditionalOperand?.(operand) === true || isDeferredPresetOperand(operand, ctx) : void 0;
      const deferRelocation = !deferCharacter && deferOperand !== void 0 && branchDependsOnDeferredOperand(branches, deferOperand);
      if (deferCharacter) {
        result += resolvedPreTag;
        result += encodeDeferredConditional({ branches });
        index = blockEnd.endEnd;
      } else if (deferRelocation) {
        result += openStandalone ? resolvedPreTag.replace(/[ \t]*$/, "") : resolvedPreTag;
        result += encodeDeferredConditional(
          { branches: trimDeferredStandaloneBranches(branches, openStandalone, closeStandalone) },
          DEFERRED_RELOCATION_CONDITIONAL_TOKEN_PREFIX
        );
        index = closeStandalone && closeTrailing ? blockEnd.endEnd + closeTrailing[0].length : blockEnd.endEnd;
      } else {
        const selected = selectConditionalPayloadBranch({ branches }, ctx, options);
        const resolvedBlock = resolveConditionalBlocks(selected, ctx, options);
        let emittedPre = resolvedPreTag;
        let emittedBlock = resolvedBlock;
        let nextIndex = blockEnd.endEnd;
        if (openStandalone) {
          emittedPre = emittedPre.replace(/[ \t]*$/, "");
          emittedBlock = emittedBlock.replace(/^[ \t]*\n/, "");
        }
        if (closeStandalone) {
          emittedBlock = emittedBlock.replace(/[ \t]*$/, "");
          nextIndex = blockEnd.endEnd + closeTrailing[0].length;
        }
        result += emittedPre + emittedBlock;
        index = nextIndex;
      }
    }
    return result;
  }
  function splitTopLevelDoubleColon(input) {
    const parts = [];
    let current = "";
    let depth = 0;
    for (let index = 0; index < input.length; index++) {
      if (input[index] === "{" && input[index + 1] === "{") {
        depth += 1;
        current += "{{";
        index += 1;
        continue;
      }
      if (input[index] === "}" && input[index + 1] === "}" && depth > 0) {
        depth -= 1;
        current += "}}";
        index += 1;
        continue;
      }
      if (depth === 0 && input[index] === ":" && input[index + 1] === ":") {
        parts.push(current);
        current = "";
        index += 1;
        continue;
      }
      current += input[index];
    }
    parts.push(current);
    return parts;
  }
  function findTopLevelWeightMarker(input) {
    let depth = 0;
    let markerIndex = -1;
    for (let index = 0; index < input.length; index++) {
      if (input[index] === "{" && input[index + 1] === "{") {
        depth += 1;
        index += 1;
        continue;
      }
      if (input[index] === "}" && input[index + 1] === "}" && depth > 0) {
        depth -= 1;
        index += 1;
        continue;
      }
      if (depth === 0 && input[index] === "@") {
        markerIndex = index;
      }
    }
    return markerIndex;
  }
  function parseWeightedRandomChoice(choice) {
    const markerIndex = findTopLevelWeightMarker(choice);
    if (markerIndex === -1) return { text: choice, weight: 1 };
    const weightText = choice.slice(markerIndex + 1).trim();
    if (!/^(?:\d+|\d*\.\d+)$/.test(weightText)) {
      return { text: choice, weight: 1 };
    }
    const weight = Number(weightText);
    if (!Number.isFinite(weight) || weight < 0) {
      return { text: choice, weight: 1 };
    }
    return { text: choice.slice(0, markerIndex).trim(), weight };
  }
  function pickWeightedRandomChoice(choices, options, original) {
    const weightedChoices = choices.map(parseWeightedRandomChoice).filter((choice) => choice.text.length > 0);
    const totalWeight = weightedChoices.reduce((total, choice) => total + choice.weight, 0);
    if (totalWeight <= 0) return "";
    let roll = randomUnit(options, original) * totalWeight;
    for (const choice of weightedChoices) {
      roll -= choice.weight;
      if (roll < 0) return choice.text;
    }
    return weightedChoices[weightedChoices.length - 1]?.text ?? "";
  }
  function shortOffsetToIsoSuffix(value) {
    if (!value || value === "GMT" || value === "UTC") return "Z";
    const match = value.match(/^(?:GMT|UTC)([+-])(\d{1,2})(?::?(\d{2}))?$/u);
    if (!match) return "";
    const sign = match[1];
    const hours = match[2];
    const minutes = match[3] ?? "00";
    if (!sign || !hours) return "";
    return `${sign}${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
  }
  function formatMacroDateTime(now, requestedTimeZone) {
    const preferredTimeZone = typeof requestedTimeZone === "string" && requestedTimeZone.trim() ? requestedTimeZone.trim() : void 0;
    const build = (timeZone) => {
      const formatter = new Intl.DateTimeFormat("en-US", {
        ...timeZone ? { timeZone } : {},
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hourCycle: "h23",
        weekday: "long",
        timeZoneName: "shortOffset"
      });
      const parts = new Map(formatter.formatToParts(now).map((part) => [part.type, part.value]));
      const year = parts.get("year") ?? String(now.getFullYear()).padStart(4, "0");
      const month = parts.get("month") ?? String(now.getMonth() + 1).padStart(2, "0");
      const day = parts.get("day") ?? String(now.getDate()).padStart(2, "0");
      const hour = parts.get("hour") ?? String(now.getHours()).padStart(2, "0");
      const minute = parts.get("minute") ?? String(now.getMinutes()).padStart(2, "0");
      const second = parts.get("second") ?? String(now.getSeconds()).padStart(2, "0");
      const date = `${year}-${month}-${day}`;
      const time = `${hour}:${minute}`;
      const offset = shortOffsetToIsoSuffix(parts.get("timeZoneName"));
      const datetime = `${date}T${time}:${second}${offset}`;
      return {
        date,
        time,
        datetime,
        isoTime: datetime,
        weekday: parts.get("weekday") ?? now.toLocaleDateString("en-US", { weekday: "long" }),
        timeZone: timeZone ?? Intl.DateTimeFormat().resolvedOptions().timeZone ?? ""
      };
    };
    try {
      return build(preferredTimeZone);
    } catch {
      return build();
    }
  }
  var LOREBOOK_INCLUDE_RE = /\{\{\s*include::/iu;
  function usesLorebookIncludes(text2) {
    return LOREBOOK_INCLUDE_RE.test(text2);
  }
  function findIncludedEntry(source, currentBookIds, parts) {
    const named = (name) => (item) => item.name.trim().toLowerCase() === name.toLowerCase();
    const entryRef = parts.at(-1) ?? "";
    if (!entryRef || parts.length > 2) return void 0;
    let bookIds = currentBookIds;
    if (parts.length === 2) {
      const book = source.books.find((item) => item.id === parts[0]) ?? source.books.find(named(parts[0]));
      if (!book) return void 0;
      bookIds = [book.id];
    } else {
      const byId = source.entries.find((entry) => entry.id === entryRef);
      if (byId) return byId;
    }
    const inBooks = source.entries.filter((entry) => bookIds.includes(entry.lorebookId));
    return inBooks.find((entry) => entry.id === entryRef) ?? inBooks.find(named(entryRef));
  }
  function expandLorebookIncludes(text2, source, scope = {}, options = {}) {
    if (!usesLorebookIncludes(text2)) return text2;
    return replaceBalancedMacros2(text2, (body, original) => {
      const match = /^\s*include::([\s\S]*)$/iu.exec(body);
      if (!match) return void 0;
      if (!consumeMacroExpansion(options)) return original;
      const parts = splitTopLevelDoubleColon(match[1]).map((part) => part.trim());
      const entry = findIncludedEntry(source, scope.currentBookIds ?? source.currentBookIds, parts);
      if (!entry || scope.seen?.has(entry.id)) return "";
      return expandLorebookIncludes(
        stripMacroComments(entry.content),
        source,
        { currentBookIds: [entry.lorebookId], seen: /* @__PURE__ */ new Set([...scope.seen ?? [], entry.id]) },
        options
      );
    });
  }
  function resolveMacros(template, ctx, options = {}) {
    options = {
      ...options,
      macroBudget: getMacroBudget(options),
      maxMacroOutputLength: options.maxMacroOutputLength ?? template.length + MAX_MACRO_OUTPUT_LENGTH
    };
    const macroDepth = options.macroDepth ?? 0;
    if (macroDepth > macroLimit(options, "maxMacroDepth")) {
      getMacroBudget(options).exceeded = true;
      return clampMacroOutput(template, options);
    }
    if (!template.includes("{{") && !template.includes("") && !template.includes("\0")) {
      const passthrough = options.trimResult !== false ? template.trim() : template;
      return clampMacroOutput(passthrough, options);
    }
    let result = template;
    const fieldResolutionDepth = options.fieldResolutionDepth ?? 0;
    const resolveNestedFieldMacros = (value) => {
      const stripped = stripMacroComments(value);
      if (!stripped.includes("{{")) return stripped;
      if (fieldResolutionDepth >= MAX_CHARACTER_FIELD_RESOLUTION_DEPTH) return "";
      return resolveMacros(stripped, ctx, {
        ...nestedMacroOptions(options),
        trimResult: false,
        fieldResolutionDepth: fieldResolutionDepth + 1
      });
    };
    const deferCharacterMacros = options.deferCharacterMacros;
    const characterReplacement = (field) => {
      const isNameField = field === "char" || field === "charPhonetic" || field === "group";
      if (deferCharacterMacros === "all" || deferCharacterMacros === "names" && isNameField) {
        return DEFERRED_CHARACTER_MACRO_TOKENS[field];
      }
      if (field === "char") return ctx.char;
      if (field === "charPhonetic") return ctx.charPhonetic || ctx.characterFields?.phoneticName || ctx.char;
      if (field === "group") return resolveGroupCharacters(ctx);
      return resolveNestedFieldMacros(ctx.characterFields?.[field] ?? "");
    };
    const conversationCharacterReplacement = (field, value) => deferCharacterMacros === "all" ? DEFERRED_CHARACTER_MACRO_TOKENS[field] : value ?? "";
    result = stripMacroComments(result);
    if (ctx.lorebookIncludes) result = expandLorebookIncludes(result, ctx.lorebookIncludes, {}, options);
    let personaText = null;
    const buildPersonaText = () => [
      ctx.personaFields?.description,
      ctx.personaFields?.personality,
      ctx.personaFields?.backstory,
      ctx.personaFields?.appearance,
      ctx.personaFields?.scenario
    ].map((part) => typeof part === "string" ? resolveNestedFieldMacros(part) : part).filter((part) => typeof part === "string" && part.trim().length > 0).join("\n");
    if (/\{\{persona\}\}/i.test(result)) personaText = buildPersonaText();
    result = expandBracketedCharacterBlocks(result, ctx);
    result = resolveConditionalBlocks(result, ctx, options);
    result = result.replace(/\{\{\s*(?:noop|original)\s*\}\}/gi, "");
    result = replaceBalancedMacros2(result, (body) => /^banned(?:\s+[\s\S]*)?$/i.test(body.trim()) ? "" : void 0);
    result = result.replace(/\{\{user(?:Name)?\}\}/gi, ctx.user);
    result = result.replace(
      /\{\{user(?:Name)?Phonetic\}\}/gi,
      ctx.userPhonetic || ctx.personaFields?.phoneticName || ctx.user
    );
    if (/\{\{persona\}\}/i.test(result)) {
      result = result.replace(/\{\{persona\}\}/gi, personaText ?? (personaText = buildPersonaText()));
    }
    result = result.replace(
      /\{\{personaDescription\}\}/gi,
      () => resolveNestedFieldMacros(ctx.personaFields?.description ?? "")
    );
    result = result.replace(
      /\{\{personaPersonality\}\}/gi,
      () => resolveNestedFieldMacros(ctx.personaFields?.personality ?? "")
    );
    result = result.replace(
      /\{\{personaBackstory\}\}/gi,
      () => resolveNestedFieldMacros(ctx.personaFields?.backstory ?? "")
    );
    result = result.replace(
      /\{\{personaAppearance\}\}/gi,
      () => resolveNestedFieldMacros(ctx.personaFields?.appearance ?? "")
    );
    result = result.replace(
      /\{\{personaScenario\}\}/gi,
      () => resolveNestedFieldMacros(ctx.personaFields?.scenario ?? "")
    );
    result = result.replace(/\{\{char(?:Name)?\}\}/gi, () => characterReplacement("char"));
    result = result.replace(/\{\{char(?:Name)?Phonetic\}\}/gi, () => characterReplacement("charPhonetic"));
    result = result.replace(/\{\{characters\}\}/gi, () => ctx.characters.join(", "));
    result = result.replace(/\{\{group\}\}/gi, () => characterReplacement("group"));
    result = result.replace(/\{\{description\}\}/gi, () => characterReplacement("description"));
    result = result.replace(/\{\{personality\}\}/gi, () => characterReplacement("personality"));
    result = result.replace(/\{\{backstory\}\}/gi, () => characterReplacement("backstory"));
    result = result.replace(/\{\{appearance\}\}/gi, () => characterReplacement("appearance"));
    result = result.replace(/\{\{scenario\}\}/gi, () => characterReplacement("scenario"));
    result = result.replace(/\{\{example\}\}/gi, () => characterReplacement("example"));
    result = result.replace(/\{\{charSysInfo\}\}/gi, () => characterReplacement("systemPrompt"));
    result = result.replace(/\{\{charPostHistory\}\}/gi, () => characterReplacement("postHistoryInstructions"));
    result = result.replace(
      /\{\{convo_display\}\}/gi,
      () => conversationCharacterReplacement("convoDisplay", ctx.convoFields?.charDisplayName)
    );
    result = result.replace(
      /\{\{char_about\}\}/gi,
      () => conversationCharacterReplacement("charAbout", ctx.convoFields?.charAbout)
    );
    result = result.replace(/\{\{persona_about\}\}/gi, () => ctx.convoFields?.personaAbout ?? "");
    result = result.replace(
      /\{\{convo_behavior\}\}/gi,
      () => conversationCharacterReplacement("convoBehavior", ctx.convoFields?.convoBehavior)
    );
    result = result.replace(/\{\{input\}\}/gi, ctx.lastInput ?? "");
    result = result.replace(/\{\{model\}\}/gi, ctx.model ?? "");
    result = result.replace(/\{\{(reasoning)\}\}/gi, (match, name) => readReasoningMacro(ctx, name) ?? match);
    result = result.replace(/\{\{chatId\}\}/gi, ctx.chatId ?? "");
    result = result.replace(/\{\{lastGenerationType\}\}/gi, ctx.lastGenerationType ?? "");
    result = result.replace(/\{\{idle_duration\}\}/gi, ctx.idleDuration ?? "");
    result = result.replace(PERSONA_REFERENCE_ID_PATTERN, (match, personaId) => {
      const reference = ctx.personaReferences?.[personaId];
      return reference !== void 0 ? reference : match;
    });
    const unresolvedCharacterReferences = /* @__PURE__ */ new Set();
    result = result.replace(CHARACTER_REFERENCE_ID_PATTERN, (match, characterId) => {
      const reference = ctx.characterReferences?.[characterId];
      if (reference !== void 0) return reference;
      unresolvedCharacterReferences.add(characterId);
      return match;
    });
    const now = /* @__PURE__ */ new Date();
    let macroDateTime = null;
    const getMacroDateTime = () => macroDateTime ?? (macroDateTime = formatMacroDateTime(now, ctx.timeZone));
    result = result.replace(/\{\{date\}\}/gi, () => getMacroDateTime().date);
    result = result.replace(/\{\{time\}\}/gi, () => getMacroDateTime().time);
    result = result.replace(/\{\{datetime\}\}/gi, () => getMacroDateTime().datetime);
    result = result.replace(/\{\{isotime\}\}/gi, () => getMacroDateTime().isoTime);
    result = result.replace(/\{\{weekday\}\}/gi, () => getMacroDateTime().weekday);
    result = result.replace(/\{\{timezone\}\}/gi, () => getMacroDateTime().timeZone);
    result = result.replace(/\{\{random\}\}/gi, (original) => {
      if (!consumeMacroExpansion(options)) return original;
      return String(randomInteger(options, original, 0, 100));
    });
    result = replaceBalancedMacros2(result, (body, original) => {
      const match = body.match(/^random::([\s\S]*)$/i);
      if (!match) return void 0;
      if (!consumeMacroExpansion(options)) return original;
      const choices = splitTopLevelDoubleColon(match[1] ?? "").map((choice2) => choice2.trim()).filter(Boolean);
      if (choices.length === 0) return "";
      const choice = pickWeightedRandomChoice(choices, options, original);
      return resolveMacros(choice, ctx, { ...nestedMacroOptions(options), trimResult: false });
    });
    result = result.replace(/\{\{random:(\d+):(\d+)\}\}/gi, (original, min, max) => {
      if (!consumeMacroExpansion(options)) return original;
      const first = parseInt(min, 10);
      const second = parseInt(max, 10);
      const lo = Math.min(first, second);
      const hi = Math.max(first, second);
      return String(randomInteger(options, original, lo, hi));
    });
    result = result.replace(/\{\{roll:(\d+)d(\d+)\}\}/gi, (original, count, sides) => {
      if (!consumeMacroExpansion(options)) return original;
      const n = Math.min(parseInt(count, 10), MAX_DICE_COUNT);
      const s = Math.min(parseInt(sides, 10), MAX_DICE_SIDES);
      if (n < 1 || s < 1) return "0";
      let total = 0;
      for (let i = 0; i < n; i++) total += randomInteger(options, `${original}:${i}`, 1, s);
      return String(total);
    });
    result = resolveVariableOperationMacros(result, ctx, options);
    result = result.replace(
      /\{\{uppercase\}\}([\s\S]*?)\{\{\/uppercase\}\}/gi,
      (_, inner) => inner.toUpperCase()
    );
    result = result.replace(
      /\{\{lowercase\}\}([\s\S]*?)\{\{\/lowercase\}\}/gi,
      (_, inner) => inner.toLowerCase()
    );
    result = result.replace(/\{\{newline\}\}/gi, "\n");
    result = result.replace(/\{\{\\n\}\}/g, "\n");
    result = result.replace(/\{\{trimStart\}\}/gi, "\0TRIM_START\0");
    result = result.replace(/\{\{trimEnd\}\}/gi, "\0TRIM_END\0");
    result = result.replace(/\{\{trim\}\}/gi, "");
    if (result.includes("\0TRIM_START\0")) {
      result = result.replace(/\x00TRIM_START\x00\s*/g, "");
    }
    if (result.includes("\0TRIM_END\0")) {
      result = result.replace(/\s*\x00TRIM_END\x00/g, "");
    }
    result = result.replace(/\{\{(\w+)\}\}/g, (match, name) => {
      if (unresolvedCharacterReferences.has(name)) return match;
      const presetValue = readMacroVariable(ctx.variables, name);
      if (presetValue !== void 0) return presetValue;
      if (ctx.deferredPresetVariableNames?.has(name)) return match;
      const chatValue = readMacroVariable(ctx.localVariables, name);
      return chatValue !== void 0 ? chatValue : match;
    });
    result = result.replace(/\{\{agent::([\w-]+)\}\}/gi, (_, type) => {
      return ctx.agentData?.[type] ?? "";
    });
    result = replaceBalancedMacros2(result, (body) => {
      const match = body.match(/^outlet::([\s\S]*)$/i);
      if (!match) return void 0;
      const name = (match[1] ?? "").trim();
      return name && ctx.outlets && Object.prototype.hasOwnProperty.call(ctx.outlets, name) ? ctx.outlets[name] : "";
    });
    result = result.replace(/\{\{lorebooksize::([\w-]+)\}\}/gi, (_, id) => {
      const counts = ctx.lorebookEntryCounts;
      return counts && Object.prototype.hasOwnProperty.call(counts, id) ? String(counts[id]) : "0";
    });
    if (options.trimResult !== false) {
      result = result.trim();
    }
    return clampMacroOutput(result, options);
  }

  // src/macros.ts
  function getString(value) {
    return typeof value === "string" ? value : "";
  }
  function getRecord(value) {
    return value && typeof value === "object" ? value : null;
  }
  function getChatCharacterIds(chat) {
    if (!chat) return [];
    const raw = chat.characterIds;
    if (Array.isArray(raw)) {
      return Array.from(new Set(raw.filter((value) => typeof value === "string" && value.length > 0)));
    }
    if (typeof raw === "string") {
      try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? Array.from(new Set(parsed.filter((value) => typeof value === "string" && value.length > 0))) : [];
      } catch {
        return [];
      }
    }
    return [];
  }
  function parseCharacterMacroData(raw) {
    if (!raw) return null;
    try {
      const parsed = typeof raw.data === "string" ? JSON.parse(raw.data) : raw.data;
      const data = getRecord(parsed);
      if (!data) return { id: raw.id, name: "Unknown" };
      const extensions = getRecord(data.extensions);
      return {
        id: raw.id,
        name: getString(data.name) || "Unknown",
        description: getString(data.description),
        personality: getString(data.personality),
        backstory: getString(extensions?.backstory),
        appearance: getString(extensions?.appearance),
        scenario: getString(data.scenario),
        example: getString(data.mes_example),
        systemPrompt: getString(data.system_prompt),
        postHistoryInstructions: getString(data.post_history_instructions)
      };
    } catch {
      return { id: raw.id, name: "Unknown" };
    }
  }
  function buildMessageMacroContext({
    persona,
    primaryCharacter,
    characters = [],
    userName,
    variables = {},
    lastInput
  }) {
    const fallbackCharacter = primaryCharacter ?? characters[0] ?? null;
    return {
      user: userName ?? persona?.name ?? "User",
      char: fallbackCharacter?.name ?? "Character",
      characters: characters.map((character) => character.name).filter((name) => name.trim().length > 0),
      variables,
      lastInput,
      characterFields: fallbackCharacter ? {
        description: fallbackCharacter.description ?? "",
        personality: fallbackCharacter.personality ?? "",
        backstory: fallbackCharacter.backstory ?? "",
        appearance: fallbackCharacter.appearance ?? "",
        scenario: fallbackCharacter.scenario ?? "",
        example: fallbackCharacter.example ?? "",
        systemPrompt: fallbackCharacter.systemPrompt ?? "",
        postHistoryInstructions: fallbackCharacter.postHistoryInstructions ?? ""
      } : void 0,
      personaFields: persona ? {
        description: persona.description ?? "",
        personality: persona.personality ?? "",
        backstory: persona.backstory ?? "",
        appearance: persona.appearance ?? "",
        scenario: persona.scenario ?? ""
      } : void 0
    };
  }
  var VARIABLE_OP_MACRO_RE = /\{\{\s*(?:setvar|addvar|addnumvar|incvar|decvar|getvar)\b/i;
  var RESOLVER_CACHE_MAX_TEMPLATE_LENGTH = 2048;
  function createMessageMacroResolver(context, options) {
    const macroContext = buildMessageMacroContext(context);
    const cache = /* @__PURE__ */ new Map();
    let variablesTouched = false;
    return (template) => {
      const touchesVariables = VARIABLE_OP_MACRO_RE.test(template);
      if (touchesVariables) variablesTouched = true;
      const cacheable = !touchesVariables && !variablesTouched && template.length <= RESOLVER_CACHE_MAX_TEMPLATE_LENGTH;
      if (cacheable) {
        const cached = cache.get(template);
        if (cached !== void 0) return cached;
      }
      const resolved = resolveMacros(template, macroContext, { trimResult: false, randomSeed: options?.randomSeed });
      if (cacheable) cache.set(template, resolved);
      return resolved;
    };
  }

  // vendor/upstream/quote-format.ts
  var STRAIGHT_DOUBLE_QUOTE = '"';
  var STRAIGHT_SINGLE_QUOTE = "'";
  var LEFT_DOUBLE_QUOTE = "\u201C";
  var RIGHT_DOUBLE_QUOTE = "\u201D";
  var LEFT_SINGLE_QUOTE = "\u2018";
  var RIGHT_SINGLE_QUOTE = "\u2019";
  var DOUBLE_QUOTE_RE = /["\u201c\u201d\u201e\u201f]/g;
  var SINGLE_QUOTE_RE = /['\u2018\u2019\u201a\u201b]/g;
  var QUOTE_RE = /["'\u2018\u2019\u201a\u201b\u201c\u201d\u201e\u201f]/;
  var PROTECTED_TEXT_RE = /```[\s\S]*?```|`[^`\n]*`|<\/?[A-Za-z][^<>]*>/g;
  function isLetterOrNumber(value) {
    return !!value && /[\p{L}\p{N}]/u.test(value);
  }
  function isOpeningContext(previous) {
    return !previous || /[\s([{<]/.test(previous) || previous === "\u2014" || previous === "\u2013";
  }
  function formatDoubleQuote(previous, next) {
    if (!next) return previous ? RIGHT_DOUBLE_QUOTE : LEFT_DOUBLE_QUOTE;
    if (/\s/.test(next)) return RIGHT_DOUBLE_QUOTE;
    return isOpeningContext(previous) ? LEFT_DOUBLE_QUOTE : RIGHT_DOUBLE_QUOTE;
  }
  function formatSingleQuote(previous, next) {
    if (isLetterOrNumber(previous) && isLetterOrNumber(next)) return RIGHT_SINGLE_QUOTE;
    if (!next) return previous ? RIGHT_SINGLE_QUOTE : LEFT_SINGLE_QUOTE;
    if (/\s/.test(next)) return RIGHT_SINGLE_QUOTE;
    return isOpeningContext(previous) ? LEFT_SINGLE_QUOTE : RIGHT_SINGLE_QUOTE;
  }
  function toStraightQuotes(value) {
    return value.replace(DOUBLE_QUOTE_RE, STRAIGHT_DOUBLE_QUOTE).replace(SINGLE_QUOTE_RE, STRAIGHT_SINGLE_QUOTE);
  }
  function toTypographicQuotes(value) {
    const straight = toStraightQuotes(value);
    let result = "";
    for (let index = 0; index < straight.length; index++) {
      const current = straight[index];
      if (current === STRAIGHT_DOUBLE_QUOTE) {
        result += formatDoubleQuote(straight[index - 1], straight[index + 1]);
        continue;
      }
      if (current === STRAIGHT_SINGLE_QUOTE) {
        result += formatSingleQuote(straight[index - 1], straight[index + 1]);
        continue;
      }
      result += current ?? "";
    }
    return result;
  }
  function formatUnprotectedText(value, format) {
    return format === "typographic" ? toTypographicQuotes(value) : toStraightQuotes(value);
  }
  function formatTextQuotes(value, format) {
    if (!QUOTE_RE.test(value)) return value;
    let result = "";
    let lastIndex = 0;
    let match;
    PROTECTED_TEXT_RE.lastIndex = 0;
    while ((match = PROTECTED_TEXT_RE.exec(value)) !== null) {
      result += formatUnprotectedText(value.slice(lastIndex, match.index), format);
      result += match[0];
      lastIndex = match.index + match[0].length;
    }
    result += formatUnprotectedText(value.slice(lastIndex), format);
    return result;
  }

  // vendor/dompurify/purify.es.mjs
  /*! @license DOMPurify 3.4.13 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.4.13/LICENSE */
  function _arrayLikeToArray(r, a) {
    (null == a || a > r.length) && (a = r.length);
    for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
    return n;
  }
  function _arrayWithHoles(r) {
    if (Array.isArray(r)) return r;
  }
  function _iterableToArrayLimit(r, l) {
    var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
    if (null != t) {
      var e, n, i, u, a = [], f = true, o = false;
      try {
        if (i = (t = t.call(r)).next, 0 === l) ;
        else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = true) ;
      } catch (r2) {
        o = true, n = r2;
      } finally {
        try {
          if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return;
        } finally {
          if (o) throw n;
        }
      }
      return a;
    }
  }
  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _slicedToArray(r, e) {
    return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest();
  }
  function _unsupportedIterableToArray(r, a) {
    if (r) {
      if ("string" == typeof r) return _arrayLikeToArray(r, a);
      var t = {}.toString.call(r).slice(8, -1);
      return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
    }
  }
  var entries = Object.entries;
  var setPrototypeOf = Object.setPrototypeOf;
  var isFrozen = Object.isFrozen;
  var getPrototypeOf = Object.getPrototypeOf;
  var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
  var freeze = Object.freeze;
  var seal = Object.seal;
  var create = Object.create;
  var _ref = typeof Reflect !== "undefined" && Reflect;
  var apply = _ref.apply;
  var construct = _ref.construct;
  if (!freeze) {
    freeze = function freeze2(x) {
      return x;
    };
  }
  if (!seal) {
    seal = function seal2(x) {
      return x;
    };
  }
  if (!apply) {
    apply = function apply2(func, thisArg) {
      for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        args[_key - 2] = arguments[_key];
      }
      return func.apply(thisArg, args);
    };
  }
  if (!construct) {
    construct = function construct2(Func) {
      for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }
      return new Func(...args);
    };
  }
  var arrayForEach = unapply(Array.prototype.forEach);
  var arrayLastIndexOf = unapply(Array.prototype.lastIndexOf);
  var arrayPop = unapply(Array.prototype.pop);
  var arrayPush = unapply(Array.prototype.push);
  var arraySplice = unapply(Array.prototype.splice);
  var arrayIsArray = Array.isArray;
  var stringToLowerCase = unapply(String.prototype.toLowerCase);
  var stringToString = unapply(String.prototype.toString);
  var stringMatch = unapply(String.prototype.match);
  var stringReplace = unapply(String.prototype.replace);
  var stringIndexOf = unapply(String.prototype.indexOf);
  var stringTrim = unapply(String.prototype.trim);
  var numberToString = unapply(Number.prototype.toString);
  var booleanToString = unapply(Boolean.prototype.toString);
  var bigintToString = typeof BigInt === "undefined" ? null : unapply(BigInt.prototype.toString);
  var symbolToString = typeof Symbol === "undefined" ? null : unapply(Symbol.prototype.toString);
  var objectHasOwnProperty = unapply(Object.prototype.hasOwnProperty);
  var objectToString = unapply(Object.prototype.toString);
  var regExpTest = unapply(RegExp.prototype.test);
  var typeErrorCreate = unconstruct(TypeError);
  function unapply(func) {
    return function(thisArg) {
      if (thisArg instanceof RegExp) {
        thisArg.lastIndex = 0;
      }
      for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        args[_key3 - 1] = arguments[_key3];
      }
      return apply(func, thisArg, args);
    };
  }
  function unconstruct(Func) {
    return function() {
      for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
      }
      return construct(Func, args);
    };
  }
  function addToSet(set, array) {
    let transformCaseFunc = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : stringToLowerCase;
    if (setPrototypeOf) {
      setPrototypeOf(set, null);
    }
    if (!arrayIsArray(array)) {
      return set;
    }
    let l = array.length;
    while (l--) {
      let element = array[l];
      if (typeof element === "string") {
        const lcElement = transformCaseFunc(element);
        if (lcElement !== element) {
          if (!isFrozen(array)) {
            array[l] = lcElement;
          }
          element = lcElement;
        }
      }
      set[element] = true;
    }
    return set;
  }
  function cleanArray(array) {
    for (let index = 0; index < array.length; index++) {
      const isPropertyExist = objectHasOwnProperty(array, index);
      if (!isPropertyExist) {
        array[index] = null;
      }
    }
    return array;
  }
  function clone(object) {
    const newObject = create(null);
    for (const _ref2 of entries(object)) {
      var _ref3 = _slicedToArray(_ref2, 2);
      const property = _ref3[0];
      const value = _ref3[1];
      const isPropertyExist = objectHasOwnProperty(object, property);
      if (isPropertyExist) {
        if (arrayIsArray(value)) {
          newObject[property] = cleanArray(value);
        } else if (value && typeof value === "object" && value.constructor === Object) {
          newObject[property] = clone(value);
        } else {
          newObject[property] = value;
        }
      }
    }
    return newObject;
  }
  function stringifyValue(value) {
    switch (typeof value) {
      case "string": {
        return value;
      }
      case "number": {
        return numberToString(value);
      }
      case "boolean": {
        return booleanToString(value);
      }
      case "bigint": {
        return bigintToString ? bigintToString(value) : "0";
      }
      case "symbol": {
        return symbolToString ? symbolToString(value) : "Symbol()";
      }
      case "undefined": {
        return objectToString(value);
      }
      case "function":
      case "object": {
        if (value === null) {
          return objectToString(value);
        }
        const valueAsRecord = value;
        const valueToString = lookupGetter(valueAsRecord, "toString");
        if (typeof valueToString === "function") {
          const stringified = valueToString(valueAsRecord);
          return typeof stringified === "string" ? stringified : objectToString(stringified);
        }
        return objectToString(value);
      }
      default: {
        return objectToString(value);
      }
    }
  }
  function lookupGetter(object, prop) {
    while (object !== null) {
      const desc = getOwnPropertyDescriptor(object, prop);
      if (desc) {
        if (desc.get) {
          return unapply(desc.get);
        }
        if (typeof desc.value === "function") {
          return unapply(desc.value);
        }
      }
      object = getPrototypeOf(object);
    }
    function fallbackValue() {
      return null;
    }
    return fallbackValue;
  }
  function isRegex(value) {
    try {
      regExpTest(value, "");
      return true;
    } catch (_unused) {
      return false;
    }
  }
  var html$1 = freeze(["a", "abbr", "acronym", "address", "area", "article", "aside", "audio", "b", "bdi", "bdo", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "content", "data", "datalist", "dd", "decorator", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "element", "em", "fieldset", "figcaption", "figure", "font", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "img", "input", "ins", "kbd", "label", "legend", "li", "main", "map", "mark", "marquee", "menu", "menuitem", "meter", "nav", "nobr", "ol", "optgroup", "option", "output", "p", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "search", "section", "select", "shadow", "slot", "small", "source", "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "tr", "track", "tt", "u", "ul", "var", "video", "wbr"]);
  var svg$1 = freeze(["svg", "a", "altglyph", "altglyphdef", "altglyphitem", "animatecolor", "animatemotion", "animatetransform", "circle", "clippath", "defs", "desc", "ellipse", "enterkeyhint", "exportparts", "filter", "font", "g", "glyph", "glyphref", "hkern", "image", "inputmode", "line", "lineargradient", "marker", "mask", "metadata", "mpath", "part", "path", "pattern", "polygon", "polyline", "radialgradient", "rect", "stop", "style", "switch", "symbol", "text", "textpath", "title", "tref", "tspan", "view", "vkern"]);
  var svgFilters = freeze(["feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feDropShadow", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence"]);
  var svgDisallowed = freeze(["animate", "color-profile", "cursor", "discard", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "foreignobject", "hatch", "hatchpath", "mesh", "meshgradient", "meshpatch", "meshrow", "missing-glyph", "script", "set", "solidcolor", "unknown", "use"]);
  var mathMl$1 = freeze(["math", "menclose", "merror", "mfenced", "mfrac", "mglyph", "mi", "mlabeledtr", "mmultiscripts", "mn", "mo", "mover", "mpadded", "mphantom", "mroot", "mrow", "ms", "mspace", "msqrt", "mstyle", "msub", "msup", "msubsup", "mtable", "mtd", "mtext", "mtr", "munder", "munderover", "mprescripts"]);
  var mathMlDisallowed = freeze(["maction", "maligngroup", "malignmark", "mlongdiv", "mscarries", "mscarry", "msgroup", "mstack", "msline", "msrow", "semantics", "annotation", "annotation-xml", "mprescripts", "none"]);
  var text = freeze(["#text"]);
  var html = freeze(["accept", "action", "align", "alt", "autocapitalize", "autocomplete", "autopictureinpicture", "autoplay", "background", "bgcolor", "border", "capture", "cellpadding", "cellspacing", "checked", "cite", "class", "clear", "color", "cols", "colspan", "command", "commandfor", "controls", "controlslist", "coords", "crossorigin", "datetime", "decoding", "default", "dir", "disabled", "disablepictureinpicture", "disableremoteplayback", "download", "draggable", "enctype", "enterkeyhint", "exportparts", "face", "for", "headers", "height", "hidden", "high", "href", "hreflang", "id", "inert", "inputmode", "integrity", "ismap", "kind", "label", "lang", "list", "loading", "loop", "low", "max", "maxlength", "media", "method", "min", "minlength", "multiple", "muted", "name", "nonce", "noshade", "novalidate", "nowrap", "open", "optimum", "part", "pattern", "placeholder", "playsinline", "popover", "popovertarget", "popovertargetaction", "poster", "preload", "pubdate", "radiogroup", "readonly", "rel", "required", "rev", "reversed", "role", "rows", "rowspan", "spellcheck", "scope", "selected", "shape", "size", "sizes", "slot", "span", "srclang", "start", "src", "srcset", "step", "style", "summary", "tabindex", "title", "translate", "type", "usemap", "valign", "value", "width", "wrap", "xmlns"]);
  var svg = freeze(["accent-height", "accumulate", "additive", "alignment-baseline", "amplitude", "ascent", "attributename", "attributetype", "azimuth", "basefrequency", "baseline-shift", "begin", "bias", "by", "class", "clip", "clippathunits", "clip-path", "clip-rule", "color", "color-interpolation", "color-interpolation-filters", "color-profile", "color-rendering", "cx", "cy", "d", "dx", "dy", "diffuseconstant", "direction", "display", "divisor", "dominant-baseline", "dur", "edgemode", "elevation", "end", "exponent", "fill", "fill-opacity", "fill-rule", "filter", "filterunits", "flood-color", "flood-opacity", "font-family", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-variant", "font-weight", "fx", "fy", "g1", "g2", "glyph-name", "glyphref", "gradientunits", "gradienttransform", "height", "href", "id", "image-rendering", "in", "in2", "intercept", "k", "k1", "k2", "k3", "k4", "kerning", "keypoints", "keysplines", "keytimes", "lang", "lengthadjust", "letter-spacing", "kernelmatrix", "kernelunitlength", "lighting-color", "local", "marker-end", "marker-mid", "marker-start", "markerheight", "markerunits", "markerwidth", "maskcontentunits", "maskunits", "max", "mask", "mask-type", "media", "method", "mode", "min", "name", "numoctaves", "offset", "operator", "opacity", "order", "orient", "orientation", "origin", "overflow", "paint-order", "path", "pathlength", "patterncontentunits", "patterntransform", "patternunits", "points", "preservealpha", "preserveaspectratio", "primitiveunits", "r", "rx", "ry", "radius", "refx", "refy", "repeatcount", "repeatdur", "restart", "result", "rotate", "scale", "seed", "shape-rendering", "slope", "specularconstant", "specularexponent", "spreadmethod", "startoffset", "stddeviation", "stitchtiles", "stop-color", "stop-opacity", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke", "stroke-width", "style", "surfacescale", "systemlanguage", "tabindex", "tablevalues", "targetx", "targety", "transform", "transform-origin", "text-anchor", "text-decoration", "text-orientation", "text-rendering", "textlength", "type", "u1", "u2", "unicode", "values", "viewbox", "visibility", "version", "vert-adv-y", "vert-origin-x", "vert-origin-y", "width", "word-spacing", "wrap", "writing-mode", "xchannelselector", "ychannelselector", "x", "x1", "x2", "xmlns", "y", "y1", "y2", "z", "zoomandpan"]);
  var mathMl = freeze(["accent", "accentunder", "align", "bevelled", "close", "columnalign", "columnlines", "columnspacing", "columnspan", "denomalign", "depth", "dir", "display", "displaystyle", "encoding", "fence", "frame", "height", "href", "id", "largeop", "length", "linethickness", "lquote", "lspace", "mathbackground", "mathcolor", "mathsize", "mathvariant", "maxsize", "minsize", "movablelimits", "notation", "numalign", "open", "rowalign", "rowlines", "rowspacing", "rowspan", "rspace", "rquote", "scriptlevel", "scriptminsize", "scriptsizemultiplier", "selection", "separator", "separators", "stretchy", "subscriptshift", "supscriptshift", "symmetric", "voffset", "width", "xmlns"]);
  var xml = freeze(["xlink:href", "xml:id", "xlink:title", "xml:space", "xmlns:xlink"]);
  var MUSTACHE_EXPR = seal(/{{[\w\W]*|^[\w\W]*}}/g);
  var ERB_EXPR = seal(/<%[\w\W]*|^[\w\W]*%>/g);
  var TMPLIT_EXPR = seal(/\${[\w\W]*/g);
  var DATA_ATTR = seal(/^data-[\-\w.\u00B7-\uFFFF]+$/);
  var ARIA_ATTR = seal(/^aria-[\-\w]+$/);
  var IS_ALLOWED_URI = seal(
    /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
    // eslint-disable-line no-useless-escape
  );
  var IS_SCRIPT_OR_DATA = seal(/^(?:\w+script|data):/i);
  var ATTR_WHITESPACE = seal(
    /[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g
    // eslint-disable-line no-control-regex
  );
  var DOCTYPE_NAME = seal(/^html$/i);
  var CUSTOM_ELEMENT = seal(/^[a-z][.\w]*(-[.\w]+)+$/i);
  var ELEMENT_MARKUP_PROBE = seal(/<[/\w!]/g);
  var COMMENT_MARKUP_PROBE = seal(/<[/\w]/g);
  var FALLBACK_TAG_CLOSE = seal(/<\/no(script|embed|frames)/i);
  var SELF_CLOSING_TAG = seal(/\/>/i);
  var NODE_TYPE = {
    element: 1,
    attribute: 2,
    text: 3,
    cdataSection: 4,
    entityReference: 5,
    // Deprecated
    entityNode: 6,
    // Deprecated
    processingInstruction: 7,
    comment: 8,
    document: 9,
    documentType: 10,
    documentFragment: 11,
    notation: 12
    // Deprecated
  };
  var getGlobal = function getGlobal2() {
    return typeof window === "undefined" ? null : window;
  };
  var _createTrustedTypesPolicy = function _createTrustedTypesPolicy2(trustedTypes, purifyHostElement) {
    if (typeof trustedTypes !== "object" || typeof trustedTypes.createPolicy !== "function") {
      return null;
    }
    let suffix = null;
    const ATTR_NAME = "data-tt-policy-suffix";
    if (purifyHostElement && purifyHostElement.hasAttribute(ATTR_NAME)) {
      suffix = purifyHostElement.getAttribute(ATTR_NAME);
    }
    const policyName = "dompurify" + (suffix ? "#" + suffix : "");
    try {
      return trustedTypes.createPolicy(policyName, {
        createHTML(html2) {
          return html2;
        },
        createScriptURL(scriptUrl) {
          return scriptUrl;
        }
      });
    } catch (_) {
      console.warn("TrustedTypes policy " + policyName + " could not be created.");
      return null;
    }
  };
  var _createHooksMap = function _createHooksMap2() {
    return {
      afterSanitizeAttributes: [],
      afterSanitizeElements: [],
      afterSanitizeShadowDOM: [],
      beforeSanitizeAttributes: [],
      beforeSanitizeElements: [],
      beforeSanitizeShadowDOM: [],
      uponSanitizeAttribute: [],
      uponSanitizeElement: [],
      uponSanitizeShadowNode: []
    };
  };
  var _resolveSetOption = function _resolveSetOption2(cfg, key, fallback, options) {
    return objectHasOwnProperty(cfg, key) && arrayIsArray(cfg[key]) ? addToSet(options.base ? clone(options.base) : {}, cfg[key], options.transform) : fallback;
  };
  function createDOMPurify() {
    let window2 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : getGlobal();
    const DOMPurify = (root2) => createDOMPurify(root2);
    DOMPurify.version = "3.4.13";
    DOMPurify.removed = [];
    if (!window2 || !window2.document || window2.document.nodeType !== NODE_TYPE.document || !window2.Element) {
      DOMPurify.isSupported = false;
      return DOMPurify;
    }
    let document2 = window2.document;
    const originalDocument = document2;
    const currentScript = originalDocument.currentScript;
    window2.DocumentFragment;
    const HTMLTemplateElement = window2.HTMLTemplateElement, Node2 = window2.Node, Element = window2.Element, NodeFilter = window2.NodeFilter, _window$NamedNodeMap = window2.NamedNodeMap;
    _window$NamedNodeMap === void 0 ? window2.NamedNodeMap || window2.MozNamedAttrMap : _window$NamedNodeMap;
    window2.HTMLFormElement;
    const DOMParser = window2.DOMParser, trustedTypes = window2.trustedTypes;
    const ElementPrototype = Element.prototype;
    const cloneNode = lookupGetter(ElementPrototype, "cloneNode");
    const remove = lookupGetter(ElementPrototype, "remove");
    const getNextSibling = lookupGetter(ElementPrototype, "nextSibling");
    const getChildNodes = lookupGetter(ElementPrototype, "childNodes");
    const getParentNode = lookupGetter(ElementPrototype, "parentNode");
    const getShadowRoot = lookupGetter(ElementPrototype, "shadowRoot");
    const getAttributes = lookupGetter(ElementPrototype, "attributes");
    const getNodeType = Node2 && Node2.prototype ? lookupGetter(Node2.prototype, "nodeType") : null;
    const getNodeName = Node2 && Node2.prototype ? lookupGetter(Node2.prototype, "nodeName") : null;
    const getOwnerDocument = Node2 && Node2.prototype ? lookupGetter(Node2.prototype, "ownerDocument") : null;
    if (typeof HTMLTemplateElement === "function") {
      const template = document2.createElement("template");
      if (template.content && template.content.ownerDocument) {
        document2 = template.content.ownerDocument;
      }
    }
    let trustedTypesPolicy;
    let emptyHTML = "";
    let defaultTrustedTypesPolicy;
    let defaultTrustedTypesPolicyResolved = false;
    let IN_TRUSTED_TYPES_POLICY = 0;
    const _assertNotInTrustedTypesPolicy = function _assertNotInTrustedTypesPolicy2() {
      if (IN_TRUSTED_TYPES_POLICY > 0) {
        throw typeErrorCreate('A configured TRUSTED_TYPES_POLICY callback (createHTML or createScriptURL) must not call DOMPurify.sanitize, as that causes infinite recursion. Do not pass a policy whose callbacks wrap DOMPurify as TRUSTED_TYPES_POLICY; see the "DOMPurify and Trusted Types" section of the README.');
      }
    };
    const _createTrustedHTML = function _createTrustedHTML2(html2) {
      _assertNotInTrustedTypesPolicy();
      IN_TRUSTED_TYPES_POLICY++;
      try {
        return trustedTypesPolicy.createHTML(html2);
      } finally {
        IN_TRUSTED_TYPES_POLICY--;
      }
    };
    const _createTrustedScriptURL = function _createTrustedScriptURL2(scriptUrl) {
      _assertNotInTrustedTypesPolicy();
      IN_TRUSTED_TYPES_POLICY++;
      try {
        return trustedTypesPolicy.createScriptURL(scriptUrl);
      } finally {
        IN_TRUSTED_TYPES_POLICY--;
      }
    };
    const _getDefaultTrustedTypesPolicy = function _getDefaultTrustedTypesPolicy2() {
      if (!defaultTrustedTypesPolicyResolved) {
        defaultTrustedTypesPolicy = _createTrustedTypesPolicy(trustedTypes, currentScript);
        defaultTrustedTypesPolicyResolved = true;
      }
      return defaultTrustedTypesPolicy;
    };
    const _document = document2, implementation = _document.implementation, createNodeIterator = _document.createNodeIterator, createDocumentFragment = _document.createDocumentFragment, getElementsByTagName = _document.getElementsByTagName;
    const importNode = originalDocument.importNode;
    let hooks = _createHooksMap();
    DOMPurify.isSupported = typeof entries === "function" && typeof getParentNode === "function" && implementation && implementation.createHTMLDocument !== void 0;
    const MUSTACHE_EXPR$1 = MUSTACHE_EXPR, ERB_EXPR$1 = ERB_EXPR, TMPLIT_EXPR$1 = TMPLIT_EXPR, DATA_ATTR$1 = DATA_ATTR, ARIA_ATTR$1 = ARIA_ATTR, IS_SCRIPT_OR_DATA$1 = IS_SCRIPT_OR_DATA, ATTR_WHITESPACE$1 = ATTR_WHITESPACE, CUSTOM_ELEMENT$1 = CUSTOM_ELEMENT;
    let IS_ALLOWED_URI$1 = IS_ALLOWED_URI;
    let ALLOWED_TAGS = null;
    const DEFAULT_ALLOWED_TAGS = addToSet({}, [...html$1, ...svg$1, ...svgFilters, ...mathMl$1, ...text]);
    let ALLOWED_ATTR = null;
    const DEFAULT_ALLOWED_ATTR = addToSet({}, [...html, ...svg, ...mathMl, ...xml]);
    let CUSTOM_ELEMENT_HANDLING = Object.seal(create(null, {
      tagNameCheck: {
        writable: true,
        configurable: false,
        enumerable: true,
        value: null
      },
      attributeNameCheck: {
        writable: true,
        configurable: false,
        enumerable: true,
        value: null
      },
      allowCustomizedBuiltInElements: {
        writable: true,
        configurable: false,
        enumerable: true,
        value: false
      }
    }));
    let FORBID_TAGS = null;
    let FORBID_ATTR = null;
    const EXTRA_ELEMENT_HANDLING = Object.seal(create(null, {
      tagCheck: {
        writable: true,
        configurable: false,
        enumerable: true,
        value: null
      },
      attributeCheck: {
        writable: true,
        configurable: false,
        enumerable: true,
        value: null
      }
    }));
    let ALLOW_ARIA_ATTR = true;
    let ALLOW_DATA_ATTR = true;
    let ALLOW_UNKNOWN_PROTOCOLS = false;
    let ALLOW_SELF_CLOSE_IN_ATTR = true;
    let SAFE_FOR_TEMPLATES = false;
    let SAFE_FOR_XML = true;
    let WHOLE_DOCUMENT = false;
    let SET_CONFIG = false;
    let SET_CONFIG_ALLOWED_TAGS = null;
    let SET_CONFIG_ALLOWED_ATTR = null;
    let FORCE_BODY = false;
    let RETURN_DOM = false;
    let RETURN_DOM_FRAGMENT = false;
    let RETURN_TRUSTED_TYPE = false;
    let SANITIZE_DOM = true;
    let SANITIZE_NAMED_PROPS = false;
    const SANITIZE_NAMED_PROPS_PREFIX = "user-content-";
    let KEEP_CONTENT = true;
    let IN_PLACE = false;
    let USE_PROFILES = {};
    let FORBID_CONTENTS = null;
    const DEFAULT_FORBID_CONTENTS = addToSet({}, [
      "annotation-xml",
      "audio",
      "colgroup",
      "desc",
      "foreignobject",
      "head",
      "iframe",
      "math",
      "mi",
      "mn",
      "mo",
      "ms",
      "mtext",
      "noembed",
      "noframes",
      "noscript",
      "plaintext",
      "script",
      // <selectedcontent> mirrors the selected <option>'s subtree, cloned by
      // the UA (customizable <select>) — including any on* handlers — and the
      // engine re-mirrors synchronously whenever a removal changes which
      // option/selectedcontent is current, even inside DOMPurify's inert
      // DOMParser document. Hoisting its children on removal re-inserts a fresh
      // mirror target ahead of the walk, which the engine refills, looping
      // forever (DoS) and amplifying output. Dropping its content on removal
      // (rather than hoisting) breaks that cascade; the content is a duplicate
      // of the option, which is sanitized on its own. See campaign-3 F1/F6.
      "selectedcontent",
      "style",
      "svg",
      "template",
      "thead",
      "title",
      "video",
      "xmp"
    ]);
    let DATA_URI_TAGS = null;
    const DEFAULT_DATA_URI_TAGS = addToSet({}, ["audio", "video", "img", "source", "image", "track"]);
    let URI_SAFE_ATTRIBUTES = null;
    const DEFAULT_URI_SAFE_ATTRIBUTES = addToSet({}, ["alt", "class", "for", "id", "label", "name", "pattern", "placeholder", "role", "summary", "title", "value", "style", "xmlns"]);
    const MATHML_NAMESPACE = "http://www.w3.org/1998/Math/MathML";
    const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
    const HTML_NAMESPACE = "http://www.w3.org/1999/xhtml";
    let NAMESPACE = HTML_NAMESPACE;
    let IS_EMPTY_INPUT = false;
    let ALLOWED_NAMESPACES = null;
    const DEFAULT_ALLOWED_NAMESPACES = addToSet({}, [MATHML_NAMESPACE, SVG_NAMESPACE, HTML_NAMESPACE], stringToString);
    const DEFAULT_MATHML_TEXT_INTEGRATION_POINTS = freeze(["mi", "mo", "mn", "ms", "mtext"]);
    let MATHML_TEXT_INTEGRATION_POINTS = addToSet({}, DEFAULT_MATHML_TEXT_INTEGRATION_POINTS);
    const DEFAULT_HTML_INTEGRATION_POINTS = freeze(["annotation-xml"]);
    let HTML_INTEGRATION_POINTS = addToSet({}, DEFAULT_HTML_INTEGRATION_POINTS);
    const COMMON_SVG_AND_HTML_ELEMENTS = addToSet({}, ["title", "style", "font", "a", "script"]);
    let PARSER_MEDIA_TYPE = null;
    const SUPPORTED_PARSER_MEDIA_TYPES = ["application/xhtml+xml", "text/html"];
    const DEFAULT_PARSER_MEDIA_TYPE = "text/html";
    let transformCaseFunc = null;
    let CONFIG = null;
    const formElement = document2.createElement("form");
    const isRegexOrFunction = function isRegexOrFunction2(testValue) {
      return testValue instanceof RegExp || testValue instanceof Function;
    };
    const _parseConfig = function _parseConfig2() {
      let cfg = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
      if (CONFIG && CONFIG === cfg) {
        return;
      }
      if (!cfg || typeof cfg !== "object") {
        cfg = {};
      }
      cfg = clone(cfg);
      PARSER_MEDIA_TYPE = // eslint-disable-next-line unicorn/prefer-includes
      SUPPORTED_PARSER_MEDIA_TYPES.indexOf(cfg.PARSER_MEDIA_TYPE) === -1 ? DEFAULT_PARSER_MEDIA_TYPE : cfg.PARSER_MEDIA_TYPE;
      transformCaseFunc = PARSER_MEDIA_TYPE === "application/xhtml+xml" ? stringToString : stringToLowerCase;
      ALLOWED_TAGS = _resolveSetOption(cfg, "ALLOWED_TAGS", DEFAULT_ALLOWED_TAGS, {
        transform: transformCaseFunc
      });
      ALLOWED_ATTR = _resolveSetOption(cfg, "ALLOWED_ATTR", DEFAULT_ALLOWED_ATTR, {
        transform: transformCaseFunc
      });
      ALLOWED_NAMESPACES = _resolveSetOption(cfg, "ALLOWED_NAMESPACES", DEFAULT_ALLOWED_NAMESPACES, {
        transform: stringToString
      });
      URI_SAFE_ATTRIBUTES = _resolveSetOption(cfg, "ADD_URI_SAFE_ATTR", DEFAULT_URI_SAFE_ATTRIBUTES, {
        transform: transformCaseFunc,
        base: DEFAULT_URI_SAFE_ATTRIBUTES
      });
      DATA_URI_TAGS = _resolveSetOption(cfg, "ADD_DATA_URI_TAGS", DEFAULT_DATA_URI_TAGS, {
        transform: transformCaseFunc,
        base: DEFAULT_DATA_URI_TAGS
      });
      FORBID_CONTENTS = _resolveSetOption(cfg, "FORBID_CONTENTS", DEFAULT_FORBID_CONTENTS, {
        transform: transformCaseFunc
      });
      FORBID_TAGS = _resolveSetOption(cfg, "FORBID_TAGS", clone({}), {
        transform: transformCaseFunc
      });
      FORBID_ATTR = _resolveSetOption(cfg, "FORBID_ATTR", clone({}), {
        transform: transformCaseFunc
      });
      USE_PROFILES = objectHasOwnProperty(cfg, "USE_PROFILES") ? cfg.USE_PROFILES && typeof cfg.USE_PROFILES === "object" ? clone(cfg.USE_PROFILES) : cfg.USE_PROFILES : false;
      ALLOW_ARIA_ATTR = cfg.ALLOW_ARIA_ATTR !== false;
      ALLOW_DATA_ATTR = cfg.ALLOW_DATA_ATTR !== false;
      ALLOW_UNKNOWN_PROTOCOLS = cfg.ALLOW_UNKNOWN_PROTOCOLS || false;
      ALLOW_SELF_CLOSE_IN_ATTR = cfg.ALLOW_SELF_CLOSE_IN_ATTR !== false;
      SAFE_FOR_TEMPLATES = cfg.SAFE_FOR_TEMPLATES || false;
      SAFE_FOR_XML = cfg.SAFE_FOR_XML !== false;
      WHOLE_DOCUMENT = cfg.WHOLE_DOCUMENT || false;
      RETURN_DOM = cfg.RETURN_DOM || false;
      RETURN_DOM_FRAGMENT = cfg.RETURN_DOM_FRAGMENT || false;
      RETURN_TRUSTED_TYPE = cfg.RETURN_TRUSTED_TYPE || false;
      FORCE_BODY = cfg.FORCE_BODY || false;
      SANITIZE_DOM = cfg.SANITIZE_DOM !== false;
      SANITIZE_NAMED_PROPS = cfg.SANITIZE_NAMED_PROPS || false;
      KEEP_CONTENT = cfg.KEEP_CONTENT !== false;
      IN_PLACE = cfg.IN_PLACE || false;
      IS_ALLOWED_URI$1 = isRegex(cfg.ALLOWED_URI_REGEXP) ? cfg.ALLOWED_URI_REGEXP : IS_ALLOWED_URI;
      NAMESPACE = typeof cfg.NAMESPACE === "string" ? cfg.NAMESPACE : HTML_NAMESPACE;
      MATHML_TEXT_INTEGRATION_POINTS = objectHasOwnProperty(cfg, "MATHML_TEXT_INTEGRATION_POINTS") && cfg.MATHML_TEXT_INTEGRATION_POINTS && typeof cfg.MATHML_TEXT_INTEGRATION_POINTS === "object" ? clone(cfg.MATHML_TEXT_INTEGRATION_POINTS) : addToSet({}, DEFAULT_MATHML_TEXT_INTEGRATION_POINTS);
      HTML_INTEGRATION_POINTS = objectHasOwnProperty(cfg, "HTML_INTEGRATION_POINTS") && cfg.HTML_INTEGRATION_POINTS && typeof cfg.HTML_INTEGRATION_POINTS === "object" ? clone(cfg.HTML_INTEGRATION_POINTS) : addToSet({}, DEFAULT_HTML_INTEGRATION_POINTS);
      const customElementHandling = objectHasOwnProperty(cfg, "CUSTOM_ELEMENT_HANDLING") && cfg.CUSTOM_ELEMENT_HANDLING && typeof cfg.CUSTOM_ELEMENT_HANDLING === "object" ? clone(cfg.CUSTOM_ELEMENT_HANDLING) : create(null);
      CUSTOM_ELEMENT_HANDLING = create(null);
      if (objectHasOwnProperty(customElementHandling, "tagNameCheck") && isRegexOrFunction(customElementHandling.tagNameCheck)) {
        CUSTOM_ELEMENT_HANDLING.tagNameCheck = customElementHandling.tagNameCheck;
      }
      if (objectHasOwnProperty(customElementHandling, "attributeNameCheck") && isRegexOrFunction(customElementHandling.attributeNameCheck)) {
        CUSTOM_ELEMENT_HANDLING.attributeNameCheck = customElementHandling.attributeNameCheck;
      }
      if (objectHasOwnProperty(customElementHandling, "allowCustomizedBuiltInElements") && typeof customElementHandling.allowCustomizedBuiltInElements === "boolean") {
        CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements = customElementHandling.allowCustomizedBuiltInElements;
      }
      seal(CUSTOM_ELEMENT_HANDLING);
      if (SAFE_FOR_TEMPLATES) {
        ALLOW_DATA_ATTR = false;
      }
      if (RETURN_DOM_FRAGMENT) {
        RETURN_DOM = true;
      }
      if (USE_PROFILES) {
        ALLOWED_TAGS = addToSet({}, text);
        ALLOWED_ATTR = create(null);
        if (USE_PROFILES.html === true) {
          addToSet(ALLOWED_TAGS, html$1);
          addToSet(ALLOWED_ATTR, html);
        }
        if (USE_PROFILES.svg === true) {
          addToSet(ALLOWED_TAGS, svg$1);
          addToSet(ALLOWED_ATTR, svg);
          addToSet(ALLOWED_ATTR, xml);
        }
        if (USE_PROFILES.svgFilters === true) {
          addToSet(ALLOWED_TAGS, svgFilters);
          addToSet(ALLOWED_ATTR, svg);
          addToSet(ALLOWED_ATTR, xml);
        }
        if (USE_PROFILES.mathMl === true) {
          addToSet(ALLOWED_TAGS, mathMl$1);
          addToSet(ALLOWED_ATTR, mathMl);
          addToSet(ALLOWED_ATTR, xml);
        }
      }
      EXTRA_ELEMENT_HANDLING.tagCheck = null;
      EXTRA_ELEMENT_HANDLING.attributeCheck = null;
      if (objectHasOwnProperty(cfg, "ADD_TAGS")) {
        if (typeof cfg.ADD_TAGS === "function") {
          EXTRA_ELEMENT_HANDLING.tagCheck = cfg.ADD_TAGS;
        } else if (arrayIsArray(cfg.ADD_TAGS)) {
          if (ALLOWED_TAGS === DEFAULT_ALLOWED_TAGS) {
            ALLOWED_TAGS = clone(ALLOWED_TAGS);
          }
          addToSet(ALLOWED_TAGS, cfg.ADD_TAGS, transformCaseFunc);
        }
      }
      if (objectHasOwnProperty(cfg, "ADD_ATTR")) {
        if (typeof cfg.ADD_ATTR === "function") {
          EXTRA_ELEMENT_HANDLING.attributeCheck = cfg.ADD_ATTR;
        } else if (arrayIsArray(cfg.ADD_ATTR)) {
          if (ALLOWED_ATTR === DEFAULT_ALLOWED_ATTR) {
            ALLOWED_ATTR = clone(ALLOWED_ATTR);
          }
          addToSet(ALLOWED_ATTR, cfg.ADD_ATTR, transformCaseFunc);
        }
      }
      if (objectHasOwnProperty(cfg, "ADD_URI_SAFE_ATTR") && arrayIsArray(cfg.ADD_URI_SAFE_ATTR)) {
        addToSet(URI_SAFE_ATTRIBUTES, cfg.ADD_URI_SAFE_ATTR, transformCaseFunc);
      }
      if (objectHasOwnProperty(cfg, "FORBID_CONTENTS") && arrayIsArray(cfg.FORBID_CONTENTS)) {
        if (FORBID_CONTENTS === DEFAULT_FORBID_CONTENTS) {
          FORBID_CONTENTS = clone(FORBID_CONTENTS);
        }
        addToSet(FORBID_CONTENTS, cfg.FORBID_CONTENTS, transformCaseFunc);
      }
      if (objectHasOwnProperty(cfg, "ADD_FORBID_CONTENTS") && arrayIsArray(cfg.ADD_FORBID_CONTENTS)) {
        if (FORBID_CONTENTS === DEFAULT_FORBID_CONTENTS) {
          FORBID_CONTENTS = clone(FORBID_CONTENTS);
        }
        addToSet(FORBID_CONTENTS, cfg.ADD_FORBID_CONTENTS, transformCaseFunc);
      }
      if (KEEP_CONTENT) {
        ALLOWED_TAGS["#text"] = true;
      }
      if (WHOLE_DOCUMENT) {
        addToSet(ALLOWED_TAGS, ["html", "head", "body"]);
      }
      if (ALLOWED_TAGS.table) {
        addToSet(ALLOWED_TAGS, ["tbody"]);
        delete FORBID_TAGS.tbody;
      }
      if (cfg.TRUSTED_TYPES_POLICY) {
        if (typeof cfg.TRUSTED_TYPES_POLICY.createHTML !== "function") {
          throw typeErrorCreate('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
        }
        if (typeof cfg.TRUSTED_TYPES_POLICY.createScriptURL !== "function") {
          throw typeErrorCreate('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
        }
        const previousTrustedTypesPolicy = trustedTypesPolicy;
        trustedTypesPolicy = cfg.TRUSTED_TYPES_POLICY;
        try {
          emptyHTML = _createTrustedHTML("");
        } catch (error) {
          trustedTypesPolicy = previousTrustedTypesPolicy;
          throw error;
        }
      } else if (cfg.TRUSTED_TYPES_POLICY === null) {
        trustedTypesPolicy = void 0;
        emptyHTML = "";
      } else {
        if (trustedTypesPolicy === void 0) {
          trustedTypesPolicy = _getDefaultTrustedTypesPolicy();
        }
        if (trustedTypesPolicy && typeof emptyHTML === "string") {
          emptyHTML = _createTrustedHTML("");
        }
      }
      if (freeze) {
        freeze(cfg);
      }
      CONFIG = cfg;
    };
    const ALL_SVG_TAGS = addToSet({}, [...svg$1, ...svgFilters, ...svgDisallowed]);
    const ALL_MATHML_TAGS = addToSet({}, [...mathMl$1, ...mathMlDisallowed]);
    const _checkSvgNamespace = function _checkSvgNamespace2(tagName, parent, parentTagName) {
      if (parent.namespaceURI === HTML_NAMESPACE) {
        return tagName === "svg";
      }
      if (parent.namespaceURI === MATHML_NAMESPACE) {
        return tagName === "svg" && (parentTagName === "annotation-xml" || MATHML_TEXT_INTEGRATION_POINTS[parentTagName]);
      }
      return Boolean(ALL_SVG_TAGS[tagName]);
    };
    const _checkMathMlNamespace = function _checkMathMlNamespace2(tagName, parent, parentTagName) {
      if (parent.namespaceURI === HTML_NAMESPACE) {
        return tagName === "math";
      }
      if (parent.namespaceURI === SVG_NAMESPACE) {
        return tagName === "math" && HTML_INTEGRATION_POINTS[parentTagName];
      }
      return Boolean(ALL_MATHML_TAGS[tagName]);
    };
    const _checkHtmlNamespace = function _checkHtmlNamespace2(tagName, parent, parentTagName) {
      if (parent.namespaceURI === SVG_NAMESPACE && !HTML_INTEGRATION_POINTS[parentTagName]) {
        return false;
      }
      if (parent.namespaceURI === MATHML_NAMESPACE && !MATHML_TEXT_INTEGRATION_POINTS[parentTagName]) {
        return false;
      }
      return !ALL_MATHML_TAGS[tagName] && (COMMON_SVG_AND_HTML_ELEMENTS[tagName] || !ALL_SVG_TAGS[tagName]);
    };
    const _checkValidNamespace = function _checkValidNamespace2(element) {
      let parent = getParentNode(element);
      if (!parent || !parent.tagName) {
        parent = {
          namespaceURI: NAMESPACE,
          tagName: "template"
        };
      }
      const tagName = stringToLowerCase(element.tagName);
      const parentTagName = stringToLowerCase(parent.tagName);
      if (!ALLOWED_NAMESPACES[element.namespaceURI]) {
        return false;
      }
      if (element.namespaceURI === SVG_NAMESPACE) {
        return _checkSvgNamespace(tagName, parent, parentTagName);
      }
      if (element.namespaceURI === MATHML_NAMESPACE) {
        return _checkMathMlNamespace(tagName, parent, parentTagName);
      }
      if (element.namespaceURI === HTML_NAMESPACE) {
        return _checkHtmlNamespace(tagName, parent, parentTagName);
      }
      if (PARSER_MEDIA_TYPE === "application/xhtml+xml" && ALLOWED_NAMESPACES[element.namespaceURI]) {
        return true;
      }
      return false;
    };
    const _forceRemove = function _forceRemove2(node) {
      arrayPush(DOMPurify.removed, {
        element: node
      });
      try {
        getParentNode(node).removeChild(node);
      } catch (_) {
        remove(node);
        if (!getParentNode(node)) {
          throw typeErrorCreate("a node selected for removal could not be detached from its tree and cannot be safely returned; refusing to sanitize in place");
        }
      }
    };
    const _neutralizeRoot = function _neutralizeRoot2(root2) {
      _neutralizeSubtree(root2);
      const childNodes = getChildNodes(root2);
      if (childNodes) {
        const snapshot = [];
        arrayForEach(childNodes, (child) => {
          arrayPush(snapshot, child);
        });
        arrayForEach(snapshot, (child) => {
          try {
            remove(child);
          } catch (_) {
          }
        });
      }
      const attributes = getAttributes(root2);
      if (attributes) {
        for (let i = attributes.length - 1; i >= 0; --i) {
          const attribute = attributes[i];
          const name = attribute && attribute.name;
          if (typeof name === "string") {
            try {
              root2.removeAttribute(name);
            } catch (_) {
            }
          }
        }
      }
    };
    const _removeAttribute = function _removeAttribute2(name, element) {
      try {
        arrayPush(DOMPurify.removed, {
          attribute: element.getAttributeNode(name),
          from: element
        });
      } catch (_) {
        arrayPush(DOMPurify.removed, {
          attribute: null,
          from: element
        });
      }
      element.removeAttribute(name);
      if (name === "is") {
        if (RETURN_DOM || RETURN_DOM_FRAGMENT) {
          try {
            _forceRemove(element);
          } catch (_) {
          }
        } else {
          try {
            element.setAttribute(name, "");
          } catch (_) {
          }
        }
      }
    };
    const _stripDisallowedAttributes = function _stripDisallowedAttributes2(element) {
      const attributes = getAttributes(element);
      if (!attributes) {
        return;
      }
      for (let i = attributes.length - 1; i >= 0; --i) {
        const attribute = attributes[i];
        const name = attribute && attribute.name;
        if (typeof name !== "string" || ALLOWED_ATTR[transformCaseFunc(name)]) {
          continue;
        }
        try {
          element.removeAttribute(name);
        } catch (_) {
        }
      }
    };
    const _neutralizeSubtree = function _neutralizeSubtree2(root2) {
      const stack = [root2];
      while (stack.length > 0) {
        const node = stack.pop();
        const nodeType = getNodeType ? getNodeType(node) : node.nodeType;
        if (nodeType === NODE_TYPE.element) {
          _stripDisallowedAttributes(node);
        }
        const childNodes = getChildNodes(node);
        if (childNodes) {
          for (let i = childNodes.length - 1; i >= 0; --i) {
            stack.push(childNodes[i]);
          }
        }
      }
    };
    const _neutralizePatchLinkage = function _neutralizePatchLinkage2(root2) {
      if (!SAFE_FOR_XML) {
        return;
      }
      const stack = [root2];
      while (stack.length > 0) {
        const node = stack.pop();
        const nodeType = getNodeType ? getNodeType(node) : node.nodeType;
        if (nodeType === NODE_TYPE.processingInstruction || nodeType === NODE_TYPE.comment && regExpTest(COMMENT_MARKUP_PROBE, node.data)) {
          try {
            remove(node);
          } catch (_) {
          }
          continue;
        }
        if (nodeType === NODE_TYPE.element) {
          const element = node;
          const lcTag = transformCaseFunc(getNodeName ? getNodeName(node) : node.nodeName);
          try {
            if (element.hasAttribute && element.hasAttribute("patchsrc")) {
              element.removeAttribute("patchsrc");
            }
            if (element.hasAttribute && element.hasAttribute("for") && lcTag !== "label" && lcTag !== "output") {
              element.removeAttribute("for");
            }
          } catch (_) {
          }
        }
        const childNodes = getChildNodes(node);
        if (childNodes) {
          for (let i = childNodes.length - 1; i >= 0; --i) {
            stack.push(childNodes[i]);
          }
        }
      }
    };
    const _initDocument = function _initDocument2(dirty) {
      let doc = null;
      let leadingWhitespace = null;
      if (FORCE_BODY) {
        dirty = "<remove></remove>" + dirty;
      } else {
        const matches = stringMatch(dirty, /^[\r\n\t ]+/);
        leadingWhitespace = matches && matches[0];
      }
      if (PARSER_MEDIA_TYPE === "application/xhtml+xml" && NAMESPACE === HTML_NAMESPACE) {
        dirty = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + dirty + "</body></html>";
      }
      const dirtyPayload = trustedTypesPolicy ? _createTrustedHTML(dirty) : dirty;
      if (NAMESPACE === HTML_NAMESPACE) {
        try {
          doc = new DOMParser().parseFromString(dirtyPayload, PARSER_MEDIA_TYPE);
        } catch (_) {
        }
      }
      if (!doc || !doc.documentElement) {
        doc = implementation.createDocument(NAMESPACE, "template", null);
        try {
          doc.documentElement.innerHTML = IS_EMPTY_INPUT ? emptyHTML : dirtyPayload;
        } catch (_) {
        }
      }
      const body = doc.body || doc.documentElement;
      if (dirty && leadingWhitespace) {
        body.insertBefore(document2.createTextNode(leadingWhitespace), body.childNodes[0] || null);
      }
      if (NAMESPACE === HTML_NAMESPACE) {
        return getElementsByTagName.call(doc, WHOLE_DOCUMENT ? "html" : "body")[0];
      }
      return WHOLE_DOCUMENT ? doc.documentElement : body;
    };
    const _createNodeIterator = function _createNodeIterator2(root2) {
      const doc = getOwnerDocument ? getOwnerDocument(root2) : root2.ownerDocument;
      return createNodeIterator.call(
        doc || root2,
        root2,
        // eslint-disable-next-line no-bitwise
        NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_COMMENT | NodeFilter.SHOW_TEXT | NodeFilter.SHOW_PROCESSING_INSTRUCTION | NodeFilter.SHOW_CDATA_SECTION,
        null
      );
    };
    const _stripTemplateExpressions = function _stripTemplateExpressions2(value) {
      value = stringReplace(value, MUSTACHE_EXPR$1, " ");
      value = stringReplace(value, ERB_EXPR$1, " ");
      value = stringReplace(value, TMPLIT_EXPR$1, " ");
      return value;
    };
    const _scrubTemplateExpressions2 = function _scrubTemplateExpressions(node) {
      var _node$querySelectorAl;
      node.normalize();
      const doc = getOwnerDocument ? getOwnerDocument(node) : node.ownerDocument;
      const walker = createNodeIterator.call(
        doc || node,
        node,
        // eslint-disable-next-line no-bitwise
        NodeFilter.SHOW_TEXT | NodeFilter.SHOW_COMMENT | NodeFilter.SHOW_CDATA_SECTION | NodeFilter.SHOW_PROCESSING_INSTRUCTION,
        null
      );
      let currentNode = walker.nextNode();
      while (currentNode) {
        currentNode.data = _stripTemplateExpressions(currentNode.data);
        currentNode = walker.nextNode();
      }
      const templates = (_node$querySelectorAl = node.querySelectorAll) === null || _node$querySelectorAl === void 0 ? void 0 : _node$querySelectorAl.call(node, "template");
      if (templates) {
        arrayForEach(templates, (tmpl) => {
          if (_isDocumentFragment(tmpl.content)) {
            _scrubTemplateExpressions2(tmpl.content);
          }
        });
      }
    };
    const _isClobbered = function _isClobbered2(element) {
      const realTagName = getNodeName ? getNodeName(element) : null;
      if (typeof realTagName !== "string") {
        return false;
      }
      if (transformCaseFunc(realTagName) !== "form") {
        return false;
      }
      return typeof element.nodeName !== "string" || typeof element.textContent !== "string" || typeof element.removeChild !== "function" || // Realm-safe NamedNodeMap detection: equality against the cached
      // prototype getter. Clobbered .attributes (e.g. <input name="attributes">)
      // makes the direct read diverge from the cached read; a clean form
      // (same-realm OR foreign-realm) has both reads pointing at the same
      // canonical NamedNodeMap.
      element.attributes !== getAttributes(element) || typeof element.removeAttribute !== "function" || typeof element.setAttribute !== "function" || typeof element.namespaceURI !== "string" || typeof element.insertBefore !== "function" || typeof element.hasChildNodes !== "function" || // NodeType clobbering probe. Cached Node.prototype.nodeType getter
      // returns the integer 1 for any Element regardless of realm; direct
      // read on a clobbered form (e.g. <input name="nodeType">) returns
      // the named child element. Cheap addition — nodeType is read from
      // an internal slot, no serialization cost — and removes a residual
      // clobbering surface used by several mXSS / PI / comment branches
      // in _sanitizeElements that compare currentNode.nodeType directly.
      element.nodeType !== getNodeType(element) || // HTMLFormElement has [LegacyOverrideBuiltIns]: a descendant named
      // "childNodes" shadows the prototype getter. Direct reads of
      // form.childNodes from a clobbered form return the named child
      // instead of the real NodeList, so any walk that reads it directly
      // skips the form's real children. Compare the direct read to the
      // cached Node.prototype getter — when the form's named-property
      // getter intercepts the read, the two values differ and we flag
      // the form. This catches every clobbering child type (input,
      // select, etc.) regardless of whether the named child happens to
      // carry a numeric .length, which a typeof-based probe would miss
      // (e.g. HTMLSelectElement.length is a defined unsigned-long).
      element.childNodes !== getChildNodes(element);
    };
    const _isDocumentFragment = function _isDocumentFragment2(value) {
      if (!getNodeType || typeof value !== "object" || value === null) {
        return false;
      }
      try {
        return getNodeType(value) === NODE_TYPE.documentFragment;
      } catch (_) {
        return false;
      }
    };
    const _isNode = function _isNode2(value) {
      if (!getNodeType || typeof value !== "object" || value === null) {
        return false;
      }
      try {
        return typeof getNodeType(value) === "number";
      } catch (_) {
        return false;
      }
    };
    function _executeHooks(hooks2, currentNode, data) {
      if (hooks2.length === 0) {
        return;
      }
      arrayForEach(hooks2, (hook) => {
        hook.call(DOMPurify, currentNode, data, CONFIG);
      });
    }
    const _isUnsafeNode = function _isUnsafeNode2(currentNode, tagName) {
      if (SAFE_FOR_XML && currentNode.hasChildNodes() && !_isNode(currentNode.firstElementChild) && regExpTest(ELEMENT_MARKUP_PROBE, currentNode.textContent) && regExpTest(ELEMENT_MARKUP_PROBE, currentNode.innerHTML)) {
        return true;
      }
      if (SAFE_FOR_XML && currentNode.namespaceURI === HTML_NAMESPACE && tagName === "style" && _isNode(currentNode.firstElementChild)) {
        return true;
      }
      if (currentNode.nodeType === NODE_TYPE.processingInstruction) {
        return true;
      }
      if (SAFE_FOR_XML && currentNode.nodeType === NODE_TYPE.comment && regExpTest(COMMENT_MARKUP_PROBE, currentNode.data)) {
        return true;
      }
      return false;
    };
    const _sanitizeDisallowedNode = function _sanitizeDisallowedNode2(currentNode, tagName, root2) {
      if (!FORBID_TAGS[tagName] && _isBasicCustomElement(tagName)) {
        if (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, tagName)) {
          return false;
        }
        if (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(tagName)) {
          return false;
        }
      }
      if (KEEP_CONTENT && !FORBID_CONTENTS[tagName]) {
        const parentNode = getParentNode(currentNode);
        const childNodes = getChildNodes(currentNode);
        if (childNodes && parentNode) {
          const childCount = childNodes.length;
          for (let i = childCount - 1; i >= 0; --i) {
            const hoisted = currentNode === root2 ? cloneNode(childNodes[i], true) : childNodes[i];
            parentNode.insertBefore(hoisted, getNextSibling(currentNode));
          }
        }
      }
      _forceRemove(currentNode);
      return true;
    };
    const _forkSharedAllowlist = function _forkSharedAllowlist2(hookList, set, defaultSet, setConfigSet) {
      if (hookList.length === 0) {
        return set;
      }
      return set === defaultSet || set === setConfigSet ? clone(set) : set;
    };
    const _sanitizeElements = function _sanitizeElements2(currentNode, root2) {
      _executeHooks(hooks.beforeSanitizeElements, currentNode, null);
      if (currentNode !== root2 && getParentNode(currentNode) === null) {
        if (IN_PLACE) {
          _neutralizeSubtree(currentNode);
        }
        return true;
      }
      if (_isClobbered(currentNode)) {
        _forceRemove(currentNode);
        return true;
      }
      const tagName = transformCaseFunc(getNodeName ? getNodeName(currentNode) : currentNode.nodeName);
      ALLOWED_TAGS = _forkSharedAllowlist(hooks.uponSanitizeElement, ALLOWED_TAGS, DEFAULT_ALLOWED_TAGS, SET_CONFIG_ALLOWED_TAGS);
      _executeHooks(hooks.uponSanitizeElement, currentNode, {
        tagName,
        allowedTags: ALLOWED_TAGS
      });
      if (currentNode !== root2 && getParentNode(currentNode) === null) {
        if (IN_PLACE) {
          _neutralizeSubtree(currentNode);
        }
        return true;
      }
      if (_isUnsafeNode(currentNode, tagName)) {
        _forceRemove(currentNode);
        return true;
      }
      if (FORBID_TAGS[tagName] || !(EXTRA_ELEMENT_HANDLING.tagCheck instanceof Function && EXTRA_ELEMENT_HANDLING.tagCheck(tagName)) && !ALLOWED_TAGS[tagName]) {
        const removed = _sanitizeDisallowedNode(currentNode, tagName, root2);
        if (removed === false) {
          _executeHooks(hooks.afterSanitizeElements, currentNode, null);
        }
        return removed;
      }
      const nt = getNodeType ? getNodeType(currentNode) : currentNode.nodeType;
      if (nt === NODE_TYPE.element && !_checkValidNamespace(currentNode)) {
        _forceRemove(currentNode);
        return true;
      }
      if ((tagName === "noscript" || tagName === "noembed" || tagName === "noframes") && regExpTest(FALLBACK_TAG_CLOSE, currentNode.innerHTML)) {
        _forceRemove(currentNode);
        return true;
      }
      if (SAFE_FOR_TEMPLATES && currentNode.nodeType === NODE_TYPE.text) {
        const content = _stripTemplateExpressions(currentNode.textContent);
        if (currentNode.textContent !== content) {
          arrayPush(DOMPurify.removed, {
            element: currentNode.cloneNode()
          });
          currentNode.textContent = content;
        }
      }
      _executeHooks(hooks.afterSanitizeElements, currentNode, null);
      return false;
    };
    const _isValidAttribute = function _isValidAttribute2(lcTag, lcName, value) {
      if (FORBID_ATTR[lcName]) {
        return false;
      }
      if (SAFE_FOR_XML && lcName === "patchsrc") {
        return false;
      }
      if (SAFE_FOR_XML && lcName === "for" && lcTag !== "label" && lcTag !== "output") {
        return false;
      }
      if (SANITIZE_DOM && (lcName === "id" || lcName === "name") && (value in document2 || value in formElement)) {
        return false;
      }
      const nameIsPermitted = ALLOWED_ATTR[lcName] || EXTRA_ELEMENT_HANDLING.attributeCheck instanceof Function && EXTRA_ELEMENT_HANDLING.attributeCheck(lcName, lcTag);
      if (ALLOW_DATA_ATTR && regExpTest(DATA_ATTR$1, lcName)) ;
      else if (ALLOW_ARIA_ATTR && regExpTest(ARIA_ATTR$1, lcName)) ;
      else if (!nameIsPermitted) {
        if (
          // First condition does a very basic check if a) it's basically a valid custom element tagname AND
          // b) if the tagName passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
          // and c) if the attribute name passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.attributeNameCheck
          _isBasicCustomElement(lcTag) && (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, lcTag) || CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(lcTag)) && (CUSTOM_ELEMENT_HANDLING.attributeNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.attributeNameCheck, lcName) || CUSTOM_ELEMENT_HANDLING.attributeNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.attributeNameCheck(lcName, lcTag)) || // Alternative, second condition checks if it's an `is`-attribute, AND
          // the value passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
          lcName === "is" && CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements && (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, value) || CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(value))
        ) ;
        else {
          return false;
        }
      } else if (URI_SAFE_ATTRIBUTES[lcName]) ;
      else if (regExpTest(IS_ALLOWED_URI$1, stringReplace(value, ATTR_WHITESPACE$1, ""))) ;
      else if ((lcName === "src" || lcName === "xlink:href" || lcName === "href") && lcTag !== "script" && stringIndexOf(value, "data:") === 0 && DATA_URI_TAGS[lcTag]) ;
      else if (ALLOW_UNKNOWN_PROTOCOLS && !regExpTest(IS_SCRIPT_OR_DATA$1, stringReplace(value, ATTR_WHITESPACE$1, ""))) ;
      else if (value) {
        return false;
      } else ;
      return true;
    };
    const RESERVED_CUSTOM_ELEMENT_NAMES = addToSet({}, ["annotation-xml", "color-profile", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "missing-glyph"]);
    const _isBasicCustomElement = function _isBasicCustomElement2(tagName) {
      return !RESERVED_CUSTOM_ELEMENT_NAMES[stringToLowerCase(tagName)] && regExpTest(CUSTOM_ELEMENT$1, tagName);
    };
    const _applyTrustedTypesToAttribute = function _applyTrustedTypesToAttribute2(lcTag, lcName, namespaceURI, value) {
      if (trustedTypesPolicy && typeof trustedTypes === "object" && typeof trustedTypes.getAttributeType === "function" && !namespaceURI) {
        switch (trustedTypes.getAttributeType(lcTag, lcName)) {
          case "TrustedHTML": {
            return _createTrustedHTML(value);
          }
          case "TrustedScriptURL": {
            return _createTrustedScriptURL(value);
          }
        }
      }
      return value;
    };
    const _setAttributeValue = function _setAttributeValue2(currentNode, name, namespaceURI, value) {
      try {
        if (namespaceURI) {
          currentNode.setAttributeNS(namespaceURI, name, value);
        } else {
          currentNode.setAttribute(name, value);
        }
        if (_isClobbered(currentNode)) {
          _forceRemove(currentNode);
        } else {
          arrayPop(DOMPurify.removed);
        }
      } catch (_) {
        _removeAttribute(name, currentNode);
      }
    };
    const _sanitizeAttributes = function _sanitizeAttributes2(currentNode) {
      _executeHooks(hooks.beforeSanitizeAttributes, currentNode, null);
      const attributes = currentNode.attributes;
      if (!attributes || _isClobbered(currentNode)) {
        return;
      }
      ALLOWED_ATTR = _forkSharedAllowlist(hooks.uponSanitizeAttribute, ALLOWED_ATTR, DEFAULT_ALLOWED_ATTR, SET_CONFIG_ALLOWED_ATTR);
      const hookEvent = {
        attrName: "",
        attrValue: "",
        keepAttr: true,
        allowedAttributes: ALLOWED_ATTR,
        forceKeepAttr: void 0
      };
      let l = attributes.length;
      const lcTag = transformCaseFunc(currentNode.nodeName);
      while (l--) {
        const attr = attributes[l];
        const name = attr.name, namespaceURI = attr.namespaceURI, attrValue = attr.value;
        const lcName = transformCaseFunc(name);
        const initValue = attrValue;
        let value = name === "value" ? initValue : stringTrim(initValue);
        hookEvent.attrName = lcName;
        hookEvent.attrValue = value;
        hookEvent.keepAttr = true;
        hookEvent.forceKeepAttr = void 0;
        _executeHooks(hooks.uponSanitizeAttribute, currentNode, hookEvent);
        value = hookEvent.attrValue;
        if (SANITIZE_NAMED_PROPS && (lcName === "id" || lcName === "name") && stringIndexOf(value, SANITIZE_NAMED_PROPS_PREFIX) !== 0) {
          _removeAttribute(name, currentNode);
          value = SANITIZE_NAMED_PROPS_PREFIX + value;
        }
        if (SAFE_FOR_XML && regExpTest(/((--!?|])>)|<\/(style|script|title|xmp|textarea|noscript|iframe|noembed|noframes)/i, value)) {
          _removeAttribute(name, currentNode);
          continue;
        }
        if (lcName === "attributename" && stringMatch(value, "href")) {
          _removeAttribute(name, currentNode);
          continue;
        }
        if (hookEvent.forceKeepAttr) {
          continue;
        }
        if (!hookEvent.keepAttr) {
          _removeAttribute(name, currentNode);
          continue;
        }
        if (!ALLOW_SELF_CLOSE_IN_ATTR && regExpTest(SELF_CLOSING_TAG, value)) {
          _removeAttribute(name, currentNode);
          continue;
        }
        if (SAFE_FOR_TEMPLATES) {
          value = _stripTemplateExpressions(value);
        }
        if (!_isValidAttribute(lcTag, lcName, value)) {
          _removeAttribute(name, currentNode);
          continue;
        }
        value = _applyTrustedTypesToAttribute(lcTag, lcName, namespaceURI, value);
        if (value !== initValue) {
          _setAttributeValue(currentNode, name, namespaceURI, value);
        }
      }
      _executeHooks(hooks.afterSanitizeAttributes, currentNode, null);
    };
    const _sanitizeShadowDOM2 = function _sanitizeShadowDOM(fragment) {
      let shadowNode = null;
      const shadowIterator = _createNodeIterator(fragment);
      _executeHooks(hooks.beforeSanitizeShadowDOM, fragment, null);
      while (shadowNode = shadowIterator.nextNode()) {
        _executeHooks(hooks.uponSanitizeShadowNode, shadowNode, null);
        _sanitizeElements(shadowNode, fragment);
        _sanitizeAttributes(shadowNode);
        if (_isDocumentFragment(shadowNode.content)) {
          _sanitizeShadowDOM2(shadowNode.content);
        }
        const shadowNodeType = getNodeType ? getNodeType(shadowNode) : shadowNode.nodeType;
        if (shadowNodeType === NODE_TYPE.element) {
          const innerSr = getShadowRoot(shadowNode);
          if (_isDocumentFragment(innerSr)) {
            _sanitizeAttachedShadowRoots(innerSr);
            _sanitizeShadowDOM2(innerSr);
          }
        }
      }
      _executeHooks(hooks.afterSanitizeShadowDOM, fragment, null);
    };
    const _sanitizeAttachedShadowRoots = function _sanitizeAttachedShadowRoots2(root2) {
      const stack = [{
        node: root2,
        shadow: null
      }];
      while (stack.length > 0) {
        const item = stack.pop();
        if (item.shadow) {
          _sanitizeShadowDOM2(item.shadow);
          continue;
        }
        const node = item.node;
        const nodeType = getNodeType ? getNodeType(node) : node.nodeType;
        const isElement = nodeType === NODE_TYPE.element;
        const childNodes = getChildNodes(node);
        if (childNodes) {
          for (let i = childNodes.length - 1; i >= 0; --i) {
            stack.push({
              node: childNodes[i],
              shadow: null
            });
          }
        }
        if (isElement) {
          const rootName = getNodeName ? getNodeName(node) : null;
          if (typeof rootName === "string" && transformCaseFunc(rootName) === "template") {
            const content = node.content;
            if (_isDocumentFragment(content)) {
              stack.push({
                node: content,
                shadow: null
              });
            }
          }
        }
        if (isElement) {
          const sr = getShadowRoot(node);
          if (_isDocumentFragment(sr)) {
            stack.push({
              node: null,
              shadow: sr
            }, {
              node: sr,
              shadow: null
            });
          }
        }
      }
    };
    DOMPurify.sanitize = function(dirty) {
      let cfg = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      let body = null;
      let importedNode = null;
      let currentNode = null;
      let returnNode = null;
      IS_EMPTY_INPUT = !dirty;
      if (IS_EMPTY_INPUT) {
        dirty = "<!-->";
      }
      if (typeof dirty !== "string" && !_isNode(dirty)) {
        dirty = stringifyValue(dirty);
        if (typeof dirty !== "string") {
          throw typeErrorCreate("dirty is not a string, aborting");
        }
      }
      if (!DOMPurify.isSupported) {
        return dirty;
      }
      if (SET_CONFIG) {
        ALLOWED_TAGS = SET_CONFIG_ALLOWED_TAGS;
        ALLOWED_ATTR = SET_CONFIG_ALLOWED_ATTR;
      } else {
        _parseConfig(cfg);
      }
      if (hooks.uponSanitizeElement.length > 0 || hooks.uponSanitizeAttribute.length > 0) {
        ALLOWED_TAGS = clone(ALLOWED_TAGS);
      }
      if (hooks.uponSanitizeAttribute.length > 0) {
        ALLOWED_ATTR = clone(ALLOWED_ATTR);
      }
      DOMPurify.removed = [];
      const inPlace = IN_PLACE && typeof dirty !== "string" && _isNode(dirty);
      if (inPlace) {
        _neutralizePatchLinkage(dirty);
        const nn = getNodeName ? getNodeName(dirty) : dirty.nodeName;
        if (typeof nn === "string") {
          const tagName = transformCaseFunc(nn);
          if (!ALLOWED_TAGS[tagName] || FORBID_TAGS[tagName]) {
            _neutralizeRoot(dirty);
            throw typeErrorCreate("root node is forbidden and cannot be sanitized in-place");
          }
        }
        if (_isClobbered(dirty)) {
          _neutralizeRoot(dirty);
          throw typeErrorCreate("root node is clobbered and cannot be sanitized in-place");
        }
        try {
          _sanitizeAttachedShadowRoots(dirty);
        } catch (error) {
          _neutralizeRoot(dirty);
          throw error;
        }
      } else if (_isNode(dirty)) {
        body = _initDocument("<!---->");
        importedNode = body.ownerDocument.importNode(dirty, true);
        if (importedNode.nodeType === NODE_TYPE.element && importedNode.nodeName === "BODY") {
          body = importedNode;
        } else if (importedNode.nodeName === "HTML") {
          body = importedNode;
        } else {
          body.appendChild(importedNode);
        }
        _sanitizeAttachedShadowRoots(importedNode);
      } else {
        if (!RETURN_DOM && !SAFE_FOR_TEMPLATES && !WHOLE_DOCUMENT && // eslint-disable-next-line unicorn/prefer-includes
        dirty.indexOf("<") === -1) {
          return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? _createTrustedHTML(dirty) : dirty;
        }
        body = _initDocument(dirty);
        if (!body) {
          return RETURN_DOM ? null : RETURN_TRUSTED_TYPE ? emptyHTML : "";
        }
      }
      if (body && FORCE_BODY) {
        _forceRemove(body.firstChild);
      }
      const walkRoot = inPlace ? dirty : body;
      try {
        const nodeIterator = _createNodeIterator(walkRoot);
        while (currentNode = nodeIterator.nextNode()) {
          _sanitizeElements(currentNode, walkRoot);
          _sanitizeAttributes(currentNode);
          if (_isDocumentFragment(currentNode.content)) {
            _sanitizeShadowDOM2(currentNode.content);
          }
        }
      } catch (error) {
        if (inPlace) {
          _neutralizeRoot(dirty);
          arrayForEach(DOMPurify.removed, (entry) => {
            if (entry.element) {
              _neutralizeSubtree(entry.element);
            }
          });
        }
        throw error;
      }
      if (inPlace) {
        arrayForEach(DOMPurify.removed, (entry) => {
          if (entry.element) {
            _neutralizeSubtree(entry.element);
          }
        });
        if (SAFE_FOR_TEMPLATES) {
          _scrubTemplateExpressions2(dirty);
        }
        return dirty;
      }
      if (RETURN_DOM) {
        if (SAFE_FOR_TEMPLATES) {
          _scrubTemplateExpressions2(body);
        }
        if (RETURN_DOM_FRAGMENT) {
          returnNode = createDocumentFragment.call(body.ownerDocument);
          while (body.firstChild) {
            returnNode.appendChild(body.firstChild);
          }
        } else {
          returnNode = body;
        }
        if (ALLOWED_ATTR.shadowroot || ALLOWED_ATTR.shadowrootmode) {
          returnNode = importNode.call(originalDocument, returnNode, true);
        }
        return returnNode;
      }
      let serializedHTML = WHOLE_DOCUMENT ? body.outerHTML : body.innerHTML;
      if (WHOLE_DOCUMENT && ALLOWED_TAGS["!doctype"] && body.ownerDocument && body.ownerDocument.doctype && body.ownerDocument.doctype.name && regExpTest(DOCTYPE_NAME, body.ownerDocument.doctype.name)) {
        serializedHTML = "<!DOCTYPE " + body.ownerDocument.doctype.name + ">\n" + serializedHTML;
      }
      if (SAFE_FOR_TEMPLATES) {
        serializedHTML = _stripTemplateExpressions(serializedHTML);
      }
      return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? _createTrustedHTML(serializedHTML) : serializedHTML;
    };
    DOMPurify.setConfig = function() {
      let cfg = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
      _parseConfig(cfg);
      SET_CONFIG = true;
      SET_CONFIG_ALLOWED_TAGS = ALLOWED_TAGS;
      SET_CONFIG_ALLOWED_ATTR = ALLOWED_ATTR;
    };
    DOMPurify.clearConfig = function() {
      CONFIG = null;
      SET_CONFIG = false;
      SET_CONFIG_ALLOWED_TAGS = null;
      SET_CONFIG_ALLOWED_ATTR = null;
      trustedTypesPolicy = defaultTrustedTypesPolicy;
      emptyHTML = "";
    };
    DOMPurify.isValidAttribute = function(tag, attr, value) {
      if (!CONFIG) {
        _parseConfig({});
      }
      const lcTag = transformCaseFunc(tag);
      const lcName = transformCaseFunc(attr);
      return _isValidAttribute(lcTag, lcName, value);
    };
    DOMPurify.addHook = function(entryPoint, hookFunction) {
      if (typeof hookFunction !== "function") {
        return;
      }
      if (!objectHasOwnProperty(hooks, entryPoint)) {
        return;
      }
      arrayPush(hooks[entryPoint], hookFunction);
    };
    DOMPurify.removeHook = function(entryPoint, hookFunction) {
      if (!objectHasOwnProperty(hooks, entryPoint)) {
        return void 0;
      }
      if (hookFunction !== void 0) {
        const index = arrayLastIndexOf(hooks[entryPoint], hookFunction);
        return index === -1 ? void 0 : arraySplice(hooks[entryPoint], index, 1)[0];
      }
      return arrayPop(hooks[entryPoint]);
    };
    DOMPurify.removeHooks = function(entryPoint) {
      if (!objectHasOwnProperty(hooks, entryPoint)) {
        return;
      }
      hooks[entryPoint] = [];
    };
    DOMPurify.removeAllHooks = function() {
      hooks = _createHooksMap();
    };
    return DOMPurify;
  }
  var purify = createDOMPurify();

  // node_modules/postcss/lib/postcss.mjs
  var import_postcss = __toESM(require_postcss(), 1);
  var postcss_default = import_postcss.default;
  var stringify = import_postcss.default.stringify;
  var fromJSON = import_postcss.default.fromJSON;
  var plugin = import_postcss.default.plugin;
  var parse = import_postcss.default.parse;
  var list = import_postcss.default.list;
  var document = import_postcss.default.document;
  var comment = import_postcss.default.comment;
  var atRule = import_postcss.default.atRule;
  var rule = import_postcss.default.rule;
  var decl = import_postcss.default.decl;
  var root = import_postcss.default.root;
  var CssSyntaxError = import_postcss.default.CssSyntaxError;
  var Declaration = import_postcss.default.Declaration;
  var Container = import_postcss.default.Container;
  var Processor = import_postcss.default.Processor;
  var Document = import_postcss.default.Document;
  var Comment = import_postcss.default.Comment;
  var Warning = import_postcss.default.Warning;
  var AtRule = import_postcss.default.AtRule;
  var Result = import_postcss.default.Result;
  var Input = import_postcss.default.Input;
  var Rule = import_postcss.default.Rule;
  var Root = import_postcss.default.Root;
  var Node = import_postcss.default.Node;

  // src/html-policy.ts
  var CHAT_HTML_ALLOWED_TAGS = [
    "a",
    "abbr",
    "aside",
    "b",
    "bdi",
    "bdo",
    "blockquote",
    "br",
    "caption",
    "center",
    "cite",
    "code",
    "col",
    "colgroup",
    "dd",
    "del",
    "details",
    "dfn",
    "div",
    "dl",
    "dt",
    "em",
    "figcaption",
    "figure",
    "font",
    "footer",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "header",
    "hr",
    "i",
    "img",
    "ins",
    "kbd",
    "li",
    "main",
    "mark",
    "nav",
    "ol",
    "p",
    "pre",
    "q",
    "s",
    "samp",
    "section",
    "small",
    "span",
    "strong",
    "sub",
    "summary",
    "sup",
    "table",
    "tbody",
    "td",
    "tfoot",
    "th",
    "thead",
    "time",
    "tr",
    "u",
    "ul",
    "var"
  ];
  var CHAT_HTML_ALLOWED_ATTR = [
    "alt",
    "class",
    "color",
    "colspan",
    "data-spk",
    "decoding",
    "href",
    "id",
    "loading",
    "rel",
    "rowspan",
    "src",
    "style",
    "target",
    "title"
  ];

  // src/remote-images.ts
  var remoteImageHref = (_value) => "blocked";

  // src/host-css.ts
  var STRING_OR_ESCAPE = /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|\\(?:[0-9a-fA-F]{1,6}\s?|[\s\S])/g;
  var SAFE_POSITION_VALUES = /* @__PURE__ */ new Set([
    "absolute",
    "inherit",
    "initial",
    "relative",
    "revert",
    "revert-layer",
    "static",
    "unset"
  ]);
  var GLOBAL_AT_RULES = /* @__PURE__ */ new Set([
    "charset",
    "color-profile",
    "counter-style",
    "custom-media",
    "custom-selector",
    "font-feature-values",
    "font-palette-values",
    "function",
    "page",
    "position-try",
    "view-transition"
  ]);
  function stripCssComments(css) {
    let result = "";
    let quote = null;
    let escaped = false;
    for (let index = 0; index < css.length; index += 1) {
      const char = css[index];
      const next = css[index + 1];
      if (quote) {
        result += char;
        if (escaped) escaped = false;
        else if (char === "\\") escaped = true;
        else if (char === quote) quote = null;
        continue;
      }
      if (char === '"' || char === "'") {
        quote = char;
        result += char;
        continue;
      }
      if (char !== "/" || next !== "*") {
        result += char;
        continue;
      }
      result += " ";
      index += 2;
      while (index < css.length && !(css[index] === "*" && css[index + 1] === "/")) index += 1;
      if (index < css.length) index += 1;
    }
    return result;
  }
  function decodeCssEscapes(input) {
    return input.replace(
      /\\(?:([0-9a-fA-F]{1,6})\s?|([\s\S]))/g,
      (_match, hex, char) => {
        if (hex) {
          const codePoint = parseInt(hex, 16);
          return codePoint > 0 && codePoint <= 1114111 ? String.fromCodePoint(codePoint) : "";
        }
        return char ?? "";
      }
    );
  }
  function canonicalizeKeywordEscapes(css) {
    return css.replace(STRING_OR_ESCAPE, (match, stringLiteral) => {
      if (stringLiteral !== void 0) return stringLiteral;
      const decoded = decodeCssEscapes(match);
      return /^[-A-Za-z@]$/.test(decoded) ? decoded : match;
    });
  }
  function isCssNameCharacter(char) {
    return char !== void 0 && /[-_0-9A-Za-z\\\u0080-\uFFFF]/u.test(char);
  }
  function findAtRuleEnd(css, startIndex) {
    let quote = null;
    let escaped = false;
    let parenthesisDepth = 0;
    let blockDepth = 0;
    for (let index = startIndex; index < css.length; index += 1) {
      const char = css[index];
      if (quote) {
        if (escaped) escaped = false;
        else if (char === "\\") escaped = true;
        else if (char === quote) quote = null;
        continue;
      }
      if (char === '"' || char === "'") {
        quote = char;
        continue;
      }
      if (char === "(") parenthesisDepth += 1;
      else if (char === ")" && parenthesisDepth > 0) parenthesisDepth -= 1;
      else if (parenthesisDepth === 0 && char === "{") blockDepth += 1;
      else if (parenthesisDepth === 0 && char === "}" && blockDepth > 0) {
        blockDepth -= 1;
        if (blockDepth === 0) return index + 1;
      } else if (parenthesisDepth === 0 && blockDepth === 0 && char === ";") {
        return index + 1;
      }
    }
    return css.length;
  }
  function stripGlobalAtRules(css) {
    let result = "";
    let cursor = 0;
    let index = 0;
    let quote = null;
    let escaped = false;
    while (index < css.length) {
      const char = css[index];
      if (quote) {
        if (escaped) escaped = false;
        else if (char === "\\") escaped = true;
        else if (char === quote) quote = null;
        index += 1;
        continue;
      }
      if (char === '"' || char === "'") {
        quote = char;
        index += 1;
        continue;
      }
      if (char !== "@") {
        index += 1;
        continue;
      }
      const nameMatch = /^@([-A-Za-z]+)/u.exec(css.slice(index));
      const name = nameMatch?.[1]?.toLowerCase();
      if (!name || !GLOBAL_AT_RULES.has(name)) {
        index += 1;
        continue;
      }
      result += `${css.slice(cursor, index)} `;
      index = findAtRuleEnd(css, index + name.length + 1);
      cursor = index;
    }
    return result + css.slice(cursor);
  }
  function hashCssScope(value) {
    let hash = 2166136261;
    for (let index = 0; index < value.length; index += 1) {
      hash ^= value.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0).toString(36);
  }
  function replaceCssIdentifier(input, identifier, replacement, flags = "g") {
    const escaped = identifier.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return input.replace(new RegExp(`(^|[^-_A-Za-z0-9])${escaped}(?=$|[^-_A-Za-z0-9])`, flags), `$1${replacement}`);
  }
  function namespaceMessageCssGlobals(css, scopeSelector) {
    const salt = hashCssScope(`${scopeSelector}\\0${css}`);
    const animationNames = /* @__PURE__ */ new Map();
    const fontNames = /* @__PURE__ */ new Map();
    const propertyNames = /* @__PURE__ */ new Map();
    try {
      const root2 = postcss_default.parse(css, { from: void 0 });
      root2.walkAtRules((atRule2) => {
        const ruleName = atRule2.name.toLowerCase();
        if (ruleName === "keyframes" || ruleName === "-webkit-keyframes") {
          const name = atRule2.params.trim();
          if (!/^[-_A-Za-z][-_A-Za-z0-9]*$/u.test(name)) {
            atRule2.remove();
            return;
          }
          const replacement = `mari-msg-${salt}-${name}`;
          animationNames.set(name, replacement);
          atRule2.params = replacement;
          return;
        }
        if (ruleName === "property") {
          const name = atRule2.params.trim();
          if (!/^--[-_A-Za-z0-9]+$/u.test(name)) {
            atRule2.remove();
            return;
          }
          const replacement = `--mari-msg-${salt}-${name.slice(2)}`;
          propertyNames.set(name, replacement);
          atRule2.params = replacement;
          return;
        }
        if (ruleName === "layer") {
          const name = atRule2.params.trim();
          if (!atRule2.nodes) {
            atRule2.remove();
            return;
          }
          if (!name) return;
          if (!/^[-_A-Za-z][-_A-Za-z0-9]*(?:\.[-_A-Za-z][-_A-Za-z0-9]*)*$/u.test(name)) {
            atRule2.remove();
            return;
          }
          atRule2.params = `mari-msg-layer-${salt}-${hashCssScope(name)}`;
          return;
        }
        if (ruleName !== "font-face") return;
        const families = atRule2.nodes?.filter(
          (node) => node.type === "decl" && node.prop.toLowerCase() === "font-family"
        );
        if (!families?.length) {
          atRule2.remove();
          return;
        }
        for (const declaration of families) {
          const quoted = /^(?:"([^"]+)"|'([^']+)')$/u.exec(declaration.value.trim());
          const name = (quoted?.[1] ?? quoted?.[2] ?? declaration.value.trim()).trim();
          if (!name) {
            atRule2.remove();
            return;
          }
          const replacement = `mari-msg-font-${salt}-${hashCssScope(name.toLowerCase())}`;
          fontNames.set(name.toLowerCase(), replacement);
          declaration.value = `"${replacement}"`;
        }
      });
      root2.walkDecls((declaration) => {
        let value = declaration.value;
        const property = declaration.prop.toLowerCase();
        if (property === "animation" || property === "animation-name" || property.startsWith("--")) {
          for (const [name, replacement] of animationNames) value = replaceCssIdentifier(value, name, replacement);
        }
        if (property === "font" || property === "font-family" || property.startsWith("--")) {
          const orderedFontNames = [...fontNames].sort(([left], [right]) => right.length - left.length);
          for (const [name, replacement] of orderedFontNames) {
            const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            value = value.replace(new RegExp(`(['"])${escaped}\\1`, "gi"), `"${replacement}"`);
            value = replaceCssIdentifier(value, name, `"${replacement}"`, "gi");
          }
        }
        for (const [name, replacement] of propertyNames) value = replaceCssIdentifier(value, name, replacement);
        declaration.value = value;
        for (const [name, replacement] of propertyNames) {
          declaration.prop = replaceCssIdentifier(declaration.prop, name, replacement);
        }
      });
      return root2.toString();
    } catch {
      return "";
    }
  }
  var CONDITIONAL_AT_RULES = /* @__PURE__ */ new Set(["container", "layer", "media", "scope", "starting-style", "supports"]);
  var PRESERVED_GLOBAL_AT_RULES = /* @__PURE__ */ new Set([
    "font-face",
    "keyframes",
    "property",
    "-webkit-keyframes"
  ]);
  function isInsideGlobalRule(node, globalAtRules) {
    for (let parent = node.parent; parent; parent = parent.parent) {
      if (parent.type === "atrule" && globalAtRules.has(parent.name.toLowerCase())) return true;
    }
    return false;
  }
  function isNestedRule(node) {
    for (let parent = node.parent; parent; parent = parent.parent) {
      if (parent.type === "rule") return true;
    }
    return false;
  }
  function selectsScopeSibling(selector, scopeSelector) {
    if (!selector.startsWith(scopeSelector)) return false;
    let depth = 0;
    let quote = null;
    let index = scopeSelector.length;
    for (; index < selector.length; index += 1) {
      const char = selector[index];
      if (quote) {
        if (char === "\\") index += 1;
        else if (char === quote) quote = null;
        continue;
      }
      if (char === "\\") index += 1;
      else if (char === '"' || char === "'") quote = char;
      else if (char === "(" || char === "[") depth += 1;
      else if ((char === ")" || char === "]") && depth > 0) depth -= 1;
      else if (depth === 0 && /[\s>~+|]/u.test(char)) break;
    }
    return /^\s*(?:[~+]|\|\|)/u.test(selector.slice(index));
  }
  function scopeMessageSelector(selector, scopeSelector) {
    if (selector === ":root" || selector === "html" || selector === "body") return scopeSelector;
    return `${scopeSelector} ${selector}`;
  }
  function parseCss(css, closeUnclosedBlocks) {
    for (let attempt = 0; ; attempt += 1) {
      try {
        return postcss_default.parse(css, { from: void 0 });
      } catch (error) {
        if (!closeUnclosedBlocks || attempt >= 32) throw error;
        if (!(error instanceof CssSyntaxError) || error.reason !== "Unclosed block") throw error;
        css += "}";
      }
    }
  }
  function scopeCssRules(css, scopeSelector, options = {}) {
    const mapSelector = options.mapSelector ?? scopeMessageSelector;
    const globalAtRules = options.globalAtRules ?? PRESERVED_GLOBAL_AT_RULES;
    try {
      const root2 = parseCss(css, options.closeUnclosedBlocks === true);
      root2.walkAtRules((atRule2) => {
        const name = atRule2.name.toLowerCase();
        if (!atRule2.nodes && CONDITIONAL_AT_RULES.has(name)) {
          atRule2.remove();
          return;
        }
        if (!globalAtRules.has(name) && !CONDITIONAL_AT_RULES.has(name)) atRule2.remove();
      });
      root2.walkDecls((declaration) => {
        if (declaration.parent?.type === "root") declaration.remove();
      });
      root2.walkRules((rule2) => {
        if (isInsideGlobalRule(rule2, globalAtRules)) return;
        if (isNestedRule(rule2)) {
          rule2.remove();
          return;
        }
        const selectors = rule2.selectors.map((selector) => mapSelector(selector.trim(), scopeSelector)).filter((selector) => !selectsScopeSibling(selector, scopeSelector));
        if (selectors.length === 0) rule2.remove();
        else rule2.selectors = selectors;
      });
      return root2.toString();
    } catch {
      return "";
    }
  }
  function stripForbiddenStatementAtRules(css) {
    let result = "";
    let cursor = 0;
    let index = 0;
    let quote = null;
    let escaped = false;
    let parenthesisDepth = 0;
    while (index < css.length) {
      const char = css[index];
      if (quote) {
        if (escaped) escaped = false;
        else if (char === "\\") escaped = true;
        else if (char === quote) quote = null;
        index += 1;
        continue;
      }
      if (char === '"' || char === "'") {
        quote = char;
        index += 1;
        continue;
      }
      if (char === "(") {
        parenthesisDepth += 1;
        index += 1;
        continue;
      }
      if (char === ")" && parenthesisDepth > 0) {
        parenthesisDepth -= 1;
        index += 1;
        continue;
      }
      const lower = parenthesisDepth === 0 ? css.slice(index, index + 10).toLowerCase() : "";
      const keyword = lower.startsWith("@import") ? "@import" : lower.startsWith("@namespace") ? "@namespace" : null;
      if (!keyword || isCssNameCharacter(css[index + keyword.length])) {
        index += 1;
        continue;
      }
      result += `${css.slice(cursor, index)} `;
      index += keyword.length;
      let depth = 0;
      let statementQuote = null;
      let statementEscaped = false;
      while (index < css.length) {
        const statementChar = css[index];
        if (statementQuote) {
          if (statementEscaped) statementEscaped = false;
          else if (statementChar === "\\") statementEscaped = true;
          else if (statementChar === statementQuote) statementQuote = null;
        } else if (statementChar === '"' || statementChar === "'") {
          statementQuote = statementChar;
        } else if (statementChar === "(") {
          depth += 1;
        } else if (statementChar === ")" && depth > 0) {
          depth -= 1;
        } else if (statementChar === ";" && depth === 0) {
          index += 1;
          break;
        }
        index += 1;
      }
      cursor = index;
    }
    return result + css.slice(cursor);
  }
  function sanitizePositionDeclarations(css) {
    return css.replace(
      /(^|[;{])(\s*)position\s*:\s*([^;}]*)/gim,
      (_match, boundary, spacing, rawValue) => {
        const value = rawValue.replace(/!important/gi, "").trim().toLowerCase();
        const safeValue = value === "fixed" || value === "sticky" ? "absolute" : SAFE_POSITION_VALUES.has(value) ? value : "static";
        return `${boundary}${spacing}position:${safeValue}`;
      }
    );
  }
  function neutralizeUnsafeImageSets(css) {
    const startPattern = /(?:-webkit-)?image-set\s*\(/giu;
    let result = "";
    let cursor = 0;
    for (let match = startPattern.exec(css); match; match = startPattern.exec(css)) {
      let quote = null;
      let escaped = false;
      let depth = 1;
      let index = startPattern.lastIndex;
      for (; index < css.length && depth > 0; index++) {
        const ch = css[index];
        if (quote) {
          if (escaped) escaped = false;
          else if (ch === "\\") escaped = true;
          else if (ch === quote) quote = null;
          continue;
        }
        if (ch === '"' || ch === "'") quote = ch;
        else if (ch === "(") depth++;
        else if (ch === ")") depth--;
      }
      if (depth !== 0) break;
      const expression = css.slice(match.index, index);
      const sources = expression.match(/(?:url\s*\(\s*)?["']?data:image\/[^")'\s]+["']?\s*\)?/giu) ?? [];
      const remainder = expression.replace(/^(?:-webkit-)?image-set\s*\(/iu, "").replace(/\)$/u, "").replace(/(?:url\s*\(\s*)?["']?data:image\/[^")'\s]+["']?\s*\)?/giu, "").replace(/\btype\s*\([^)]*\)/giu, "").replace(/(?:\d+(?:\.\d+)?x|\d+dpi|\d+dpcm|\d+dppx)/giu, "").replace(/[\s,]/gu, "");
      result += css.slice(cursor, match.index);
      result += sources.length > 0 && remainder.length === 0 ? expression : "url(about:invalid)";
      cursor = index;
      startPattern.lastIndex = index;
    }
    return result + css.slice(cursor);
  }
  function isLocalCssUrl(body) {
    let value = body.trim();
    const quote = value[0];
    if (quote === '"' || quote === "'") value = value.slice(1, value.endsWith(quote) ? -1 : void 0).trim();
    if (/^data:image\//iu.test(value)) return true;
    return /^https?:\/\//iu.test(value) && !value.includes("\\") && remoteImageHref(value) === null;
  }
  function dropRemoteCssUrls(css) {
    return neutralizeUnsafeImageSets(css.replace(/(?<![-\w])src\s*\(/giu, "url(")).replace(
      /url\s*\(([^)]*)\)/giu,
      (match, body) => isLocalCssUrl(body) ? match : "none"
    );
  }
  function sanitizeChatMessageCss(css, options = {}) {
    let sanitized = canonicalizeKeywordEscapes(stripCssComments(css));
    sanitized = stripGlobalAtRules(stripForbiddenStatementAtRules(sanitized)).replace(/expression\s*\([^)]*\)/gi, " ").replace(/javascript\s*:/gi, " ").replace(/vbscript\s*:/gi, " ").replace(/behavior\s*:/gi, "x-behavior:").replace(/-moz-binding\s*:/gi, "x-moz-binding:").replace(/url\s*\(\s*(?!['"]?(?:data:image\/|https?:\/\/))(['"]?)[^)]+\)/gi, "none").replace(/!\s*important/gi, " ").replace(/(?<![-\w])content\s*:[^;}]*/gi, " ").replace(/</g, "\\3c ");
    if (options.remoteUrls === false) sanitized = dropRemoteCssUrls(sanitized);
    return sanitizePositionDeclarations(sanitized).trim();
  }
  function scopeChatMessageCss(css, scopeSelector, options = {}) {
    const sanitized = namespaceMessageCssGlobals(sanitizeChatMessageCss(css, options), scopeSelector);
    if (!sanitized) return "";
    return scopeCssRules(sanitized, scopeSelector).trim();
  }

  // src/sanitize.ts
  function offlineCss(css, block = true) {
    const clean = block ? scopeChatMessageCss(css, ".translation-content", { remoteUrls: false }) : sanitizeChatMessageCss(css, { remoteUrls: false });
    try {
      const parsed = postcss_default.parse(block ? clean : `x{${clean}}`);
      parsed.walkAtRules((rule2) => {
        if (!["media", "supports", "container", "layer", "keyframes", "-webkit-keyframes"].includes(rule2.name.toLowerCase())) rule2.remove();
      });
      parsed.walkDecls((decl2) => {
        const value = decl2.value.replace(/\/\*[\s\S]*?\*\//g, " ").replace(
          /\\(?:([0-9a-f]{1,6})\s?|([^\n]))/gi,
          (_, hex, char) => hex ? String.fromCodePoint(Math.min(parseInt(hex, 16), 1114111)) : char
        );
        if (/(?:url|src|image|image-set|paint|expression)\s*\(|(?:javascript|vbscript)\s*:/i.test(value) || /^(?:behavior|-moz-binding)$/i.test(decl2.prop)) decl2.remove();
      });
      return block ? parsed.toString() : (parsed.first?.nodes ?? []).map((node) => node.toString()).join(";");
    } catch {
      return "";
    }
  }
  function createSanitizer(window2) {
    const purify2 = purify(window2);
    return (html2) => {
      const styles = purify2.sanitize(`<div>${html2}</div>`, {
        ALLOWED_TAGS: ["div", "style"],
        ALLOWED_ATTR: [],
        FORBID_CONTENTS: [],
        RETURN_DOM_FRAGMENT: true
      });
      const css = offlineCss([...styles.querySelectorAll("style")].map((s) => s.textContent ?? "").join("\n"));
      const fragment = purify2.sanitize(html2, {
        ALLOWED_TAGS: [...CHAT_HTML_ALLOWED_TAGS],
        ALLOWED_ATTR: [...CHAT_HTML_ALLOWED_ATTR],
        ALLOW_DATA_ATTR: false,
        ALLOW_UNKNOWN_PROTOCOLS: false,
        FORBID_TAGS: ["animate", "embed", "foreignObject", "iframe", "math", "object", "script", "svg", "style"],
        FORBID_ATTR: ["onerror", "onload", "onclick", "srcdoc"],
        RETURN_DOM_FRAGMENT: true
      });
      for (const element of fragment.querySelectorAll("[style]")) {
        const style = offlineCss(element.getAttribute("style") ?? "", false);
        if (style) element.setAttribute("style", style);
        else element.removeAttribute("style");
      }
      for (const anchor of fragment.querySelectorAll("a")) {
        anchor.setAttribute("rel", "noopener noreferrer");
        if (!anchor.getAttribute("href")?.startsWith("#")) anchor.removeAttribute("href");
        anchor.removeAttribute("target");
      }
      for (const img of fragment.querySelectorAll("img")) {
        if (!/^data:image\/(?:png|jpeg|gif|webp|avif);base64,[a-z0-9+/=\s]+$/i.test(img.getAttribute("src") ?? "")) {
          img.replaceWith(window2.document.createTextNode(img.getAttribute("alt") || "[\uC774\uBBF8\uC9C0 \uC0DD\uB7B5]"));
        } else img.setAttribute("referrerpolicy", "no-referrer");
      }
      return { fragment, css };
    };
  }

  // vendor/upstream/preset-choices.ts
  function parseChoiceOptions(options) {
    try {
      const parsed = typeof options === "string" ? JSON.parse(options) : options;
      if (!Array.isArray(parsed)) return [];
      return parsed.flatMap(
        (option) => option && typeof option === "object" && typeof option.value === "string" ? [{ value: option.value }] : []
      );
    } catch {
      return [];
    }
  }
  function sanitizeChoiceSelection(selected, options, isMulti) {
    if (selected === void 0) return void 0;
    const validValues = new Set(options.map((option) => option.value));
    const candidates = Array.isArray(selected) ? selected : [selected];
    if (isMulti) {
      return candidates.filter((value, index) => validValues.has(value) && candidates.indexOf(value) === index);
    }
    return candidates.find((value) => validValues.has(value));
  }
  function readChoiceFlag(value) {
    return value === true || value === "true" || value === 1 || value === "1";
  }
  function resolveChoiceVariableValue(input) {
    const isRandom = readChoiceFlag(input.randomPick);
    const isMulti = readChoiceFlag(input.multiSelect) || isRandom && Array.isArray(input.selected);
    if (input.selected === "" || Array.isArray(input.selected) && input.selected.length === 0) return "";
    const selected = sanitizeChoiceSelection(input.selected, input.options, isMulti);
    if (isMulti && Array.isArray(selected)) {
      if (selected.length === 0) return "";
      if (isRandom) {
        const random = input.random ?? Math.random;
        const roll = random();
        const unit = Number.isFinite(roll) ? Math.min(1, Math.max(0, roll)) : 0;
        const index = Math.min(selected.length - 1, Math.floor(unit * selected.length));
        return selected[index] ?? "";
      }
      return selected.join(input.separator ?? ", ");
    }
    if (selected !== void 0) {
      return Array.isArray(selected) ? selected[0] ?? "" : selected;
    }
    return input.options[0]?.value ?? "";
  }

  // src/data.ts
  var record = (value) => {
    try {
      const r = typeof value === "string" ? JSON.parse(value) : value;
      return r && typeof r === "object" && !Array.isArray(r) ? r : {};
    } catch {
      return {};
    }
  };
  function activeChatId(window2) {
    const state = window2.__MARINARA_HOST__?.stores?.chat?.getState?.();
    if (state && "activeChatId" in state) return state.activeChatId || null;
    try {
      return window2.localStorage.getItem("marinara-active-chat-id") || null;
    } catch {
      return null;
    }
  }
  function quoteFormat(window2) {
    const live = window2.__MARINARA_HOST__?.stores?.ui?.getState?.().quoteFormat;
    if (live) return live;
    try {
      const stored = record(window2.localStorage.getItem("marinara-engine-ui"));
      const backup = record(window2.localStorage.getItem("marinara-engine-ui:host"));
      const chosen = stored.state && typeof stored.version === "number" && stored.version < 103 && backup.version === 103 ? backup : stored;
      return chosen.state?.quoteFormat === "typographic" ? "typographic" : "straight";
    } catch {
      return "straight";
    }
  }
  function createData(api, window2) {
    const cache = /* @__PURE__ */ new Map();
    const controllers = /* @__PURE__ */ new Map();
    let disposed = false;
    async function get(path, ttl = 15e3) {
      if (disposed || !path.startsWith("/api/") || path.includes("://")) throw Error("API unavailable");
      const old = cache.get(path);
      if (old && Date.now() - old.time < ttl) return old.promise;
      const controller = new window2.AbortController();
      const timer = window2.setTimeout(() => controller.abort(), 8e3);
      controllers.set(controller, timer);
      const entry = { time: Date.now(), promise: Promise.resolve(null) };
      entry.promise = (async () => {
        try {
          const response = await api.fetch(path, { method: "GET", cache: "no-store", signal: controller.signal });
          if (!response.ok) throw Error("API read failed");
          const result = await response.json();
          if (disposed || controller.signal.aborted) throw Error("Disposed");
          return result;
        } catch (error) {
          if (cache.get(path) === entry) cache.delete(path);
          throw error;
        } finally {
          window2.clearTimeout(timer);
          controllers.delete(controller);
        }
      })();
      cache.set(path, entry);
      return entry.promise;
    }
    function invalidate(all = false) {
      for (const path of cache.keys()) if (all || /\/messages$/.test(path)) cache.delete(path);
      for (const [c, timer] of controllers) {
        window2.clearTimeout(timer);
        c.abort();
      }
      controllers.clear();
    }
    async function snapshot(id) {
      const [chat, messages, rules, presets] = await Promise.all([
        get(`/api/chats/${encodeURIComponent(id)}`),
        get(`/api/chats/${encodeURIComponent(id)}/messages`, 1500),
        get("/api/regex-scripts"),
        get("/api/prompts")
      ]);
      if (chat?.id !== id || !Array.isArray(messages) || !Array.isArray(rules) || !Array.isArray(presets)) throw Error("Invalid API shape");
      const bySwipe = new Map(messages.map((m) => [`${id}:${m.id}:${m.activeSwipeIndex ?? 0}`, m]));
      return { chat, messages, rules, presets, bySwipe };
    }
    async function resolver(chat, message) {
      const seed = `${message.id}:${message.activeSwipeIndex ?? 0}`;
      const ids = getChatCharacterIds(chat);
      if (message.characterId && !ids.includes(message.characterId)) ids.push(message.characterId);
      const characters = (await Promise.all(ids.map((id) => get(`/api/characters/${encodeURIComponent(id)}`)))).map(parseCharacterMacroData).filter(Boolean).map(({ systemPrompt: _system, postHistoryInstructions: _history, ...display }) => display);
      const primaryCharacter = characters.find((c) => c.id === message.characterId) ?? characters[0] ?? { name: "Assistant" };
      let persona;
      if (chat.personaCharacterId) persona = parseCharacterMacroData(await get(`/api/characters/${encodeURIComponent(chat.personaCharacterId)}`));
      else if (chat.personaId) persona = await get(`/api/characters/personas/${encodeURIComponent(chat.personaId)}`);
      const connection = chat.mode === "roleplay" && chat.connectionId ? await get(`/api/connections/${encodeURIComponent(chat.connectionId)}`) : null;
      const presetId = connection?.promptPresetId || chat.promptPresetId || null;
      const full = presetId ? await get(`/api/prompts/${encodeURIComponent(presetId)}/full`) : null;
      const defaults = record(full?.preset?.defaultChoices);
      const choices = presetId !== chat.promptPresetId ? defaults : { ...defaults, ...record(chat.metadata).presetChoices };
      const variables = Object.fromEntries((full?.choiceBlocks ?? []).map((block) => [
        block.variableName,
        resolveChoiceVariableValue({
          selected: choices[block.variableName],
          options: parseChoiceOptions(block.options),
          multiSelect: block.multiSelect,
          randomPick: block.randomPick,
          separator: block.separator,
          random: () => seededUnitRandom(`${seed}:${block.variableName}`)
        })
      ]));
      const context = {
        variables,
        userName: persona?.name ?? (chat.mode === "conversation" ? "User" : "You"),
        persona,
        primaryCharacter,
        characters: characters.length ? characters : [primaryCharacter]
      };
      return chat.mode === "conversation" ? (value) => createMessageMacroResolver(context, { randomSeed: seed })(value) : createMessageMacroResolver(context, { randomSeed: seed });
    }
    return { get, snapshot, resolver, invalidate, dispose() {
      disposed = true;
      invalidate(true);
      cache.clear();
    }, cache };
  }

  // src/actions.ts
  var TITLE = "\uBC88\uC5ED\uBB38\uC5D0 \uD45C\uC2DC \uC815\uADDC\uC2DD \uC801\uC6A9 \xB7 \uAE38\uAC8C \uB20C\uB7EC \uC124\uC815 (\uC6B0\uD074\uB9AD \uAC00\uB2A5)";
  var OWN = "data-translation-regex-action";
  function createActions(window2, onToggle, onSettings) {
    const document2 = window2.document, entries2 = /* @__PURE__ */ new Map();
    const css = document2.createElement("style");
    css.setAttribute(OWN, "");
    css.textContent = `
button[${OWN}]{position:relative;touch-action:manipulation;user-select:none;-webkit-user-select:none;-webkit-touch-callout:none}
button[${OWN}][aria-pressed=true]::after,button[${OWN}][aria-busy=true]::after,button[${OWN}][data-state=error]::after{content:'';position:absolute;right:3px;top:3px;width:4px;height:4px;border-radius:50%;background:currentColor}
button[${OWN}][data-state=error]::after{background:#e86868}
button[${OWN}][aria-busy=true]::after{animation:translation-regex-pulse .8s infinite alternate}
@keyframes translation-regex-pulse{to{opacity:.25}}`;
    document2.head.append(css);
    function remove(row, entry) {
      entry.cleanup();
      entry.host.remove();
      entries2.delete(row);
    }
    function gestures(button, id) {
      const life = new window2.AbortController();
      let timer, touch, held = false, cancelled = false, suppressClick = false;
      const clear = () => {
        window2.clearTimeout(timer);
        timer = void 0;
      };
      const stop = (e) => e.stopPropagation();
      const consume = (e) => {
        e.preventDefault();
        e.stopPropagation();
      };
      const listen = (type, fn) => button.addEventListener(type, fn, { passive: false, signal: life.signal });
      listen("pointerdown", (e) => {
        stop(e);
        suppressClick = false;
      });
      listen("mousedown", stop);
      listen("pointerup", stop);
      listen("touchstart", (e) => {
        consume(e);
        clear();
        suppressClick = true;
        held = false;
        cancelled = e.touches.length !== 1;
        touch = e.touches[0];
        if (cancelled) return;
        timer = window2.setTimeout(() => {
          timer = void 0;
          if (!button.isConnected) return;
          held = true;
          onSettings(button);
        }, 600);
      });
      listen("touchmove", (e) => {
        consume(e);
        const current = [...e.touches].find((t) => t.identifier === touch?.identifier);
        if (!current || Math.hypot(current.clientX - touch.clientX, current.clientY - touch.clientY) > 10) {
          cancelled = true;
          clear();
        }
      });
      listen("touchend", (e) => {
        consume(e);
        clear();
        if (touch && !held && !cancelled && e.touches.length === 0) onToggle(id);
        touch = void 0;
      });
      for (const type of ["touchcancel", "pointercancel", "pointerleave"]) listen(type, (e) => {
        stop(e);
        clear();
        cancelled = true;
        touch = void 0;
      });
      listen("contextmenu", (e) => {
        consume(e);
        if (touch) return;
        clear();
        suppressClick = true;
        onSettings(button);
      });
      listen("selectstart", consume);
      listen("keydown", () => {
        suppressClick = false;
      });
      listen("click", (e) => {
        consume(e);
        if (!suppressClick) onToggle(id);
      });
      listen("dblclick", stop);
      return () => {
        clear();
        life.abort();
      };
    }
    function sync() {
      for (const [row, entry] of entries2) if (!row.isConnected || !entry.host.isConnected || entry.host.parentElement !== row || row.closest("[data-message-id]")?.getAttribute("data-message-id") !== entry.id) remove(row, entry);
      const seen = /* @__PURE__ */ new Set();
      for (const row of document2.querySelectorAll(".mari-message-actions")) {
        const root2 = row.closest("[data-message-id]"), id = root2?.getAttribute("data-message-id");
        if (!id || root2.matches(".mari-message-user,[data-message-role=user]") || seen.has(id)) continue;
        seen.add(id);
        if (entries2.has(row)) {
          const { button: button2 } = entries2.get(row);
          if (row.lastElementChild !== button2) row.append(button2);
          continue;
        }
        for (const stale of row.querySelectorAll(`button[${OWN}]`)) stale.remove();
        const button = document2.createElement("button");
        button.type = "button";
        button.setAttribute(OWN, "");
        button.className = "mari-chat-style-control mari-chat-message-action [-webkit-tap-highlight-color:transparent] inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md p-0 text-base leading-none transition-colors md:transition-all md:active:scale-90 max-md:h-8 max-md:w-7 max-md:max-w-full max-md:text-sm max-md:active:bg-[var(--marinara-chat-message-action-bg-hover)] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-30 text-[var(--marinara-chat-message-action-text)] [@media(pointer:fine)]:hover:bg-[var(--marinara-chat-message-action-bg-hover)] [@media(pointer:fine)]:hover:text-[var(--marinara-chat-message-action-text-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--marinara-chat-chrome-focus-ring)]";
        button.title = TITLE;
        button.setAttribute("aria-label", TITLE);
        button.setAttribute("aria-pressed", "false");
        button.setAttribute("aria-haspopup", "dialog");
        button.innerHTML = '<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-dasharray="2 2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2 22 7.5v9L12 22 2 16.5v-9ZM2 7.5 12 13l10-5.5M12 13v9M12 2v11"/></svg>';
        const cleanup = gestures(button, id);
        row.append(button);
        entries2.set(row, { host: button, button, id, cleanup });
      }
    }
    function state(id, kind, detail = "") {
      for (const entry of entries2.values()) if (entry.id === id) {
        entry.button.dataset.state = kind;
        entry.button.setAttribute("aria-pressed", String(kind === "applied"));
        entry.button.setAttribute("aria-busy", String(kind === "busy"));
        entry.button.title = detail ? `${TITLE} \xB7 ${detail}` : TITLE;
      }
    }
    return {
      sync,
      state,
      kind: (id) => [...entries2.values()].find((e) => e.id === id)?.button.dataset.state,
      ids: () => [...entries2.values()].map((e) => e.id),
      dispose() {
        for (const [row, entry] of entries2) remove(row, entry);
        css.remove();
      }
    };
  }

  // src/launcher.ts
  var LAUNCHER_ID = "translation-regex-launcher";
  var COMPOSERS = '.composer,.mari-composer,.mari-chat-composer,[data-testid="composer"],[data-testid="chat-composer"],[data-chat-composer]';
  var SIZE = 44;
  var GAP = 8;
  function createLauncher(window2, onToggle, shown) {
    const document2 = window2.document, life = new window2.AbortController();
    const button = document2.createElement("button"), css = document2.createElement("style");
    css.setAttribute("data-translation-regex-launcher-style", "");
    button.id = LAUNCHER_ID;
    button.dataset.testid = LAUNCHER_ID;
    button.type = "button";
    button.setAttribute("aria-label", "\uBC88\uC5ED\uBB38 \uC815\uADDC\uC2DD \uC124\uC815 \xB7 \uC704\uC544\uB798\uB85C \uC774\uB3D9 \xB7 0.7\uCD08 \uAE38\uAC8C \uB20C\uB7EC \uC704\uCE58 \uCD08\uAE30\uD654");
    button.title = button.getAttribute("aria-label");
    button.setAttribute("aria-haspopup", "dialog");
    button.setAttribute("aria-expanded", "false");
    button.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-dasharray="2 2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2 22 7.5v9L12 22 2 16.5v-9ZM2 7.5 12 13l10-5.5M12 13v9M12 2v11"/></svg>';
    css.textContent = `#${LAUNCHER_ID}{position:fixed;right:0;z-index:999;box-sizing:border-box;width:44px;height:44px;min-width:44px;min-height:44px;padding:0;border:1px solid #6c7185;border-radius:10px 0 0 10px;background:var(--marinara-chat-message-action-bg-hover,#303444);color:var(--marinara-chat-message-action-text,#eee);cursor:pointer;touch-action:none;user-select:none;-webkit-user-select:none;-webkit-touch-callout:none}
#${LAUNCHER_ID} svg{display:block;margin:auto;pointer-events:none}
#${LAUNCHER_ID}[data-launcher-disabled],#${LAUNCHER_ID}[data-launcher-no-room]{display:none!important}`;
    document2.head.append(css);
    let disposed = false, wantedY, top = 0, press, holdTimer, clickTimer, suppressClick = false;
    const observed = /* @__PURE__ */ new Set();
    const resize = window2.ResizeObserver ? new window2.ResizeObserver(() => sync()) : void 0;
    function attr(name, value) {
      if (button.hasAttribute(name) !== value) button.toggleAttribute(name, value);
    }
    function sync() {
      if (disposed) return;
      for (const stale of document2.querySelectorAll(`#${LAUNCHER_ID}`)) if (stale !== button) stale.remove();
      if (button.parentNode !== document2.body) document2.body.append(button);
      const viewport = window2.visualViewport;
      const start2 = viewport?.offsetTop || 0, height = viewport?.height || window2.innerHeight;
      const min = start2 + GAP;
      let bottom = start2 + height - GAP;
      const composers = new Set(document2.querySelectorAll(COMPOSERS));
      for (const input of document2.querySelectorAll('textarea,[contenteditable="true"],[role="textbox"]')) {
        if (!input.closest("[data-message-id],#translation_regex_me")) composers.add(input.closest(COMPOSERS) || input.closest("form") || input);
      }
      for (const old of observed) if (!composers.has(old)) {
        resize?.unobserve(old);
        observed.delete(old);
      }
      for (const composer of composers) {
        if (!observed.has(composer)) {
          observed.add(composer);
          resize?.observe(composer);
        }
        const rect = composer.getBoundingClientRect(), style = window2.getComputedStyle(composer);
        if (rect.width > 0 && rect.height > 0 && rect.bottom > start2 && rect.top < start2 + height && style.display !== "none" && style.visibility !== "hidden") bottom = Math.min(bottom, rect.top - GAP);
      }
      const max = bottom - SIZE;
      attr("data-launcher-disabled", !shown);
      attr("data-launcher-no-room", max < min);
      top = Math.max(min, Math.min(max, wantedY ?? start2 + (height - SIZE) / 2));
      if (button.style.top !== `${top}px`) button.style.top = `${top}px`;
      const right = Math.max(0, window2.innerWidth - ((viewport?.offsetLeft || 0) + (viewport?.width || window2.innerWidth)));
      if (button.style.right !== `${right}px`) button.style.right = `${right}px`;
    }
    function clearHold() {
      window2.clearTimeout(holdTimer);
      holdTimer = void 0;
    }
    function suppress() {
      suppressClick = true;
      window2.clearTimeout(clickTimer);
      clickTimer = window2.setTimeout(() => {
        suppressClick = false;
        clickTimer = void 0;
      }, 500);
    }
    function end() {
      clearHold();
      const previous = press;
      press = void 0;
      if (previous?.dragged || previous?.held) suppress();
      try {
        if (previous) button.releasePointerCapture(previous.id);
      } catch {
      }
    }
    const listen = (target, type, fn) => target.addEventListener(type, fn, { signal: life.signal, passive: false });
    listen(button, "pointerdown", (e) => {
      e.stopPropagation();
      if (press) {
        end();
        suppress();
        return;
      }
      if (e.button !== 0 || e.isPrimary === false) return;
      window2.clearTimeout(clickTimer);
      suppressClick = false;
      press = { id: e.pointerId, y: e.clientY, top, dragged: false, held: false };
      try {
        button.setPointerCapture(e.pointerId);
      } catch {
      }
      holdTimer = window2.setTimeout(() => {
        holdTimer = void 0;
        if (!press || press.dragged || !button.isConnected) return;
        press.held = true;
        wantedY = void 0;
        sync();
      }, 700);
    });
    listen(window2, "pointermove", (e) => {
      if (!press || e.pointerId !== press.id) return;
      const dy = e.clientY - press.y;
      if (Math.abs(dy) > 6) {
        press.dragged = true;
        clearHold();
      }
      if (press.dragged) {
        e.preventDefault();
        wantedY = press.top + dy;
        sync();
      }
    });
    listen(window2, "pointerup", (e) => {
      if (press?.id === e.pointerId) end();
    });
    listen(window2, "pointercancel", (e) => {
      if (press?.id === e.pointerId) {
        end();
        suppress();
      }
    });
    listen(button, "lostpointercapture", () => {
      if (press) {
        end();
        suppress();
      }
    });
    listen(window2, "blur", end);
    listen(button, "click", (e) => {
      e.stopPropagation();
      if (suppressClick) {
        suppressClick = false;
        window2.clearTimeout(clickTimer);
        e.preventDefault();
        return;
      }
      onToggle(button);
    });
    for (const type of ["contextmenu", "selectstart"]) listen(button, type, (e) => {
      e.preventDefault();
      e.stopPropagation();
    });
    listen(window2, "resize", sync);
    listen(window2, "scroll", sync);
    if (window2.visualViewport) for (const type of ["resize", "scroll"]) listen(window2.visualViewport, type, sync);
    const observer = new window2.MutationObserver(() => {
      if (!button.isConnected) end();
      sync();
    });
    sync();
    observer.observe(document2.body, { subtree: true, childList: true, attributes: true, attributeFilter: ["class", "style", "hidden"] });
    return {
      button,
      sync,
      setShown(value) {
        shown = value;
        sync();
      },
      dispose() {
        disposed = true;
        end();
        window2.clearTimeout(clickTimer);
        life.abort();
        observer.disconnect();
        resize?.disconnect();
        button.remove();
        css.remove();
      }
    };
  }

  // src/translation.ts
  var markup = () => /<!--[\s\S]*?-->|<\/?[A-Za-z][\w:.-]*(?:\s+(?:[^<>"']|"[^"]*"|'[^']*')*)?\s*\/?>/g;
  var voidTags = new Set("area base br col embed hr img input link meta param source track wbr".split(" "));
  function tagRanges(text2) {
    const ranges = [], stack = [];
    let start2 = 0;
    for (const match of text2.matchAll(markup())) {
      const token = match[0], name = /^<\/?([\w:.-]+)/.exec(token)?.[1].toLowerCase();
      const begin = match.index, end = begin + token.length;
      if (!name || voidTags.has(name) || /\/>$/.test(token)) {
        if (!stack.length) ranges.push([begin, end]);
        continue;
      }
      if (!stack.length) start2 = begin;
      if (token.startsWith("</")) {
        if (stack.at(-1) === name) stack.pop();
        else if (stack.length) continue;
        if (!stack.length) ranges.push([start2, end]);
      } else stack.push(name);
    }
    if (stack.length) ranges.push([start2, text2.length]);
    return ranges;
  }
  function splitTranslation(text2, limit = 3e3) {
    if (!Number.isInteger(limit) || limit < 32) throw Error("Invalid chunk limit");
    const ranges = tagRanges(text2), chunks = [];
    const safe = (n) => !ranges.some(([a, b]) => a < n && n < b);
    let start2 = 0;
    while (start2 < text2.length) {
      let end = Math.min(start2 + limit, text2.length);
      if (end < text2.length) {
        const slice = text2.slice(start2, end);
        const boundary = (pattern) => [...slice.matchAll(pattern)].map((m) => start2 + m.index + m[0].length).filter((n) => n > start2 && safe(n)).at(-1);
        end = boundary(/\n[ \t]*\n+/g) ?? boundary(/[.!?。！？]["'”’»)]*\s+/g) ?? boundary(/\s+/g) ?? end;
        const block = ranges.find(([a, b]) => a < end && end < b);
        if (block) end = block[0] > start2 ? block[0] : block[1];
        if (end < text2.length && /[\uDC00-\uDFFF]/.test(text2[end])) end--;
      }
      chunks.push(text2.slice(start2, end));
      start2 = end;
    }
    return chunks;
  }
  function protectTags(source) {
    let prefix = "TRX_TAG_";
    while (source.includes(prefix)) prefix += "X";
    const tags = [];
    const token = (i) => `[[${prefix}${i}]]`;
    const text2 = source.replace(markup(), (tag) => {
      tags.push(tag);
      return token(tags.length - 1);
    });
    return { text: text2, restore(output) {
      let previous = -1;
      for (let i = 0; i < tags.length; i++) {
        const at = output.indexOf(token(i));
        if (at <= previous || output.indexOf(token(i), at + 1) !== -1) return { text: source, fallback: true };
        previous = at;
      }
      if (tags.length && [...output.matchAll(markup())].length) return { text: source, fallback: true };
      const restored = output.replace(new RegExp(`\\[\\[${prefix}(\\d+)\\]\\]`, "g"), (whole, n) => tags[Number(n)] ?? whole);
      if (restored.includes(`[[${prefix}`)) return { text: source, fallback: true };
      return { text: restored, fallback: false };
    } };
  }
  var prose = (s) => s.replace(markup(), "").trim();
  var terminal = (s) => /[.!?。！？…]["'”’»)*\]]*$/.test(s.trim());
  function truncation(source, translation) {
    const a = prose(source), b = prose(translation);
    const lowRatio = a.length >= 600 && b.length > 0 && b.length / a.length < 0.45;
    const midSentence = a.length >= 300 && b.length >= 40 && terminal(a) && !terminal(b);
    return { suspected: lowRatio || midSentence, lowRatio, midSentence };
  }
  function continuationOffset(source, translation) {
    const tail = translation.trimEnd();
    if (!tail) return null;
    if (source.startsWith(tail) && tail.length < source.length && !tagRanges(source).some(([a, b]) => a < tail.length && tail.length < b)) return tail.length;
    const ranges = tagRanges(tail), last = ranges.at(-1);
    if (last && last[1] === tail.length) {
      const anchor = tail.slice(last[0], last[1]), at = source.indexOf(anchor);
      if (anchor.length >= 16 && at >= 0 && source.indexOf(anchor, at + 1) === -1 && at + anchor.length < source.length && !tagRanges(source).some(([a, b]) => a < at + anchor.length && at + anchor.length < b)) return at + anchor.length;
    }
    return null;
  }
  function sourceMatches(message, extra = record(message.extra)) {
    return extra.translationSource === message.content || typeof extra.translationPolisherLongSource === "string" && extra.translationPolisherLongSource.length > 0 && extra.translationPolisherLongSource === message.content;
  }
  function translationConfig(chat) {
    const meta = record(chat.metadata);
    const string = (key) => typeof meta[key] === "string" ? meta[key] : void 0;
    const prompt = meta.translationOutputPrompt === void 0 ? string("translationPrompt") : string("translationOutputPrompt");
    return {
      chatId: chat.id,
      provider: ["ai", "google", "deepl", "deeplx"].includes(meta.translationProvider) ? meta.translationProvider : "google",
      targetLanguage: string("translationOutputTargetLang")?.trim() || string("translationTargetLang")?.trim() || "en",
      connectionId: string("translationConnectionId"),
      systemPrompt: prompt,
      deeplApiKey: string("translationDeeplApiKey"),
      deeplxUrl: string("translationDeeplxUrl")
    };
  }
  function createTranslationJobs(api, window2, notify, saved) {
    let disposed = false, job;
    const controllers = /* @__PURE__ */ new Set();
    const attempted = /* @__PURE__ */ new Set();
    const signature = (m) => JSON.stringify([
      m.content,
      m.activeSwipeIndex ?? 0,
      record(m.extra).translation,
      record(m.extra).translationSource,
      record(m.extra).translationHidden,
      record(m.extra).translationPolisherLongSource
    ]);
    const active = (j) => !disposed && job === j && activeChatId(window2) === j.chatId;
    const check = (j) => {
      if (!active(j) || j.controller.signal.aborted) throw Error("\uCDE8\uC18C\uB428 \xB7 \uAE30\uC874 \uBC88\uC5ED \uC720\uC9C0");
    };
    async function request(path, method, body, parent) {
      if (disposed || !path.startsWith("/api/") || path.includes("://")) throw Error("API unavailable");
      const controller = new window2.AbortController();
      controllers.add(controller);
      const abort = () => controller.abort();
      parent.addEventListener("abort", abort, { once: true });
      const timeout = window2.setTimeout(abort, method === "POST" ? 12e4 : 15e3);
      controller.signal.addEventListener("abort", () => window2.clearTimeout(timeout), { once: true });
      const headers = {};
      if (method !== "GET") {
        headers["x-marinara-csrf"] = "1";
        headers["Content-Type"] = "application/json";
      }
      try {
        if (parent.aborted) controller.abort();
        try {
          const secret = window2.localStorage.getItem("marinara_admin_secret")?.trim();
          if (secret) headers["X-Admin-Secret"] = secret;
        } catch {
        }
        if (controller.signal.aborted) throw Error("\uCDE8\uC18C\uB428");
        const response = await Promise.race([
          api.fetch(path, {
            method,
            headers,
            body: body === void 0 ? void 0 : JSON.stringify(body),
            cache: "no-store",
            credentials: "same-origin",
            signal: controller.signal
          }),
          new Promise((_, reject) => controller.signal.addEventListener("abort", () => reject(Error("\uCDE8\uC18C \uB610\uB294 \uC694\uCCAD \uC2DC\uAC04 \uCD08\uACFC")), { once: true }))
        ]);
        if (controller.signal.aborted || disposed) throw Error("\uCDE8\uC18C \uB610\uB294 \uC694\uCCAD \uC2DC\uAC04 \uCD08\uACFC");
        if (!response.ok) throw Error(`\uBC88\uC5ED API \uC2E4\uD328 (${response.status ?? "unknown"}) \xB7 \uAE30\uC874 \uBC88\uC5ED \uC720\uC9C0`);
        return response.status === 204 ? void 0 : await response.json();
      } finally {
        window2.clearTimeout(timeout);
        parent.removeEventListener("abort", abort);
        controllers.delete(controller);
      }
    }
    async function verify(j) {
      check(j);
      const messages = await request(`/api/chats/${encodeURIComponent(j.chatId)}/messages`, "GET", void 0, j.controller.signal);
      check(j);
      const current = Array.isArray(messages) && messages.find((m) => m.id === j.messageId);
      if (!current || signature(current) !== j.signature) throw Error("\uC6D0\uBB38\xB7\uC2A4\uC640\uC774\uD504 \uB610\uB294 \uBC88\uC5ED\uC774 \uBCC0\uACBD\uB428 \xB7 \uC800\uC7A5\uD558\uC9C0 \uC54A\uC558\uC2B5\uB2C8\uB2E4");
    }
    const resultText = (j) => j.prefix + j.parts.join("");
    function emit(j, text2, busy) {
      if (!disposed && job === j) notify({ messageId: j.messageId, text: text2, busy, partial: !busy && j.parts.length > 0 });
    }
    async function persist(j) {
      await verify(j);
      const text2 = resultText(j);
      await request(
        `/api/chats/${encodeURIComponent(j.chatId)}/messages/${encodeURIComponent(j.messageId)}/extra?swipeIndex=${j.swipe}`,
        "PATCH",
        { translation: text2, translationSource: j.source, translationHidden: false },
        j.controller.signal
      );
      if (!active(j)) return;
      attempted.add(`${j.chatId}:${j.messageId}:${JSON.stringify([j.source, j.swipe, text2])}`);
      j.parts = [];
      saved(j, text2);
      emit(j, `\uBC88\uC5ED \uC800\uC7A5 \uC644\uB8CC${j.fallbacks ? ` \xB7 \uD0DC\uADF8 \uBCF5\uC6D0 \uC2E4\uD328 ${j.fallbacks}\uAC1C \uCCAD\uD06C\uB294 \uC6D0\uBB38 \uBCF4\uC874` : ""}`, false);
    }
    async function execute(messageId, mode, automatic = false) {
      if (disposed || job?.busy || job?.parts.length) return;
      const chatId = activeChatId(window2);
      if (!chatId) return;
      const j = { chatId, messageId, controller: new window2.AbortController(), busy: true, parts: [], prefix: "", fallbacks: 0 };
      job = j;
      emit(j, "\uBC88\uC5ED \uC900\uBE44 \uC911", true);
      try {
        const [chat, messages, generation] = await Promise.all([
          request(`/api/chats/${encodeURIComponent(chatId)}`, "GET", void 0, j.controller.signal),
          request(`/api/chats/${encodeURIComponent(chatId)}/messages`, "GET", void 0, j.controller.signal),
          request(`/api/generate/status/${encodeURIComponent(chatId)}`, "GET", void 0, j.controller.signal)
        ]);
        check(j);
        if (generation?.active !== false || generation.translating) throw Error("\uC0DD\uC131/\uBC88\uC5ED \uC911 \xB7 \uC644\uB8CC \uD6C4 \uB2E4\uC2DC \uC2DC\uB3C4\uD558\uC138\uC694");
        const message = Array.isArray(messages) && messages.find((m) => m.id === messageId);
        if (chat?.id !== chatId || !message || message.role !== "assistant" || typeof message.content !== "string" || !message.content.trim()) throw Error("\uD604\uC7AC AI \uC6D0\uBB38\uC744 \uD655\uC778\uD560 \uC218 \uC5C6\uC74C");
        const extra = record(message.extra), raw = typeof extra.translation === "string" ? extra.translation : "";
        if (automatic && (extra.translationHidden === true || !sourceMatches(message) || !truncation(message.content, raw).suspected)) {
          emit(j, "\uCD5C\uC2E0 \uBC88\uC5ED\uC740 \uC790\uB3D9 \uC774\uC5B4 \uBC88\uC5ED \uB300\uC0C1\uC774 \uC544\uB2D9\uB2C8\uB2E4", false);
          return;
        }
        j.source = message.content;
        j.swipe = message.activeSwipeIndex ?? 0;
        j.signature = signature(message);
        const attempt = `${chatId}:${messageId}:${JSON.stringify([j.source, j.swipe, raw])}`;
        if (automatic && attempted.has(attempt)) {
          emit(j, "\uC774\uBBF8 \uC790\uB3D9 \uD655\uC778\uD55C \uBC88\uC5ED\uC785\uB2C8\uB2E4", false);
          return;
        }
        attempted.add(attempt);
        let offset = 0;
        if (mode === "continue") {
          if (!sourceMatches(message)) throw Error("\uD604\uC7AC \uC6D0\uBB38\uACFC \uBC88\uC5ED \uCD9C\uCC98 \uBD88\uC77C\uCE58 \xB7 \uB098\uB220\uC11C \uB2E4\uC2DC \uBC88\uC5ED\uC744 \uC0AC\uC6A9\uD558\uC138\uC694");
          const estimated = continuationOffset(j.source, raw);
          if (estimated === null) throw Error("\uC774\uC5B4\uC9C8 \uC6D0\uBB38 \uC704\uCE58\uAC00 \uBD88\uD655\uC2E4\uD569\uB2C8\uB2E4 \xB7 \uB098\uB220\uC11C \uB2E4\uC2DC \uBC88\uC5ED\uC744 \uC0AC\uC6A9\uD558\uC138\uC694");
          offset = estimated;
          j.prefix = raw.trimEnd();
        }
        const config = translationConfig(chat), chunks = splitTranslation(j.source.slice(offset));
        for (let i = 0; i < chunks.length; i++) {
          check(j);
          await verify(j);
          emit(j, `\uBC88\uC5ED \uC911 \xB7 \uCCAD\uD06C ${i + 1}/${chunks.length}`, true);
          const chunk = chunks[i], protectedText = protectTags(chunk);
          if (protectedText.text.length > (config.provider === "google" ? 5e3 : 5e4)) throw Error("\uD0DC\uADF8 \uBE14\uB85D\uC774 \uACF5\uAE09\uC790 \uD55C\uB3C4\uB97C \uB118\uC2B5\uB2C8\uB2E4 \xB7 \uD0DC\uADF8\uB97C \uB098\uB204\uC9C0 \uC54A\uACE0 \uC911\uB2E8\uD588\uC2B5\uB2C8\uB2E4");
          const response = await request("/api/translate", "POST", { ...config, text: protectedText.text }, j.controller.signal);
          check(j);
          if (typeof response?.translatedText !== "string" || !response.translatedText.trim()) throw Error("\uBE44\uC5B4 \uC788\uB294 \uBC88\uC5ED \uC751\uB2F5");
          const restored = protectedText.restore(response.translatedText);
          if (restored.fallback) j.fallbacks++;
          const leading = /^\s*/.exec(chunk)[0], trailing = /\s*$/.exec(chunk)[0];
          j.parts.push(leading + restored.text.trim() + trailing);
        }
        await persist(j);
      } catch (error) {
        j.controller.abort();
        emit(j, `${error instanceof Error ? error.message : "\uBC88\uC5ED \uC2E4\uD328"}${j.parts.length ? " \xB7 \uC644\uB8CC\uB41C \uBD80\uBD84 \uACB0\uACFC\uB97C \uC800\uC7A5\uD558\uAC70\uB098 \uBC84\uB9B4 \uC218 \uC788\uC2B5\uB2C8\uB2E4" : ""}`, false);
      } finally {
        j.busy = false;
        if (active(j)) notify({ busy: false, partial: j.parts.length > 0, messageId });
      }
    }
    return {
      execute,
      get busy() {
        return !!job?.busy;
      },
      get pending() {
        return !!job?.busy || !!job?.parts.length;
      },
      canAuto(chatId, m) {
        return !this.pending && !attempted.has(`${chatId}:${m.id}:${JSON.stringify([m.content, m.activeSwipeIndex ?? 0, record(m.extra).translation])}`);
      },
      cancel() {
        job?.controller.abort();
      },
      discard() {
        if (job?.busy) return;
        job = void 0;
        notify({ busy: false, partial: false, text: "\uBD80\uBD84 \uACB0\uACFC \uBC84\uB9BC \xB7 \uAE30\uC874 \uBC88\uC5ED \uC720\uC9C0" });
      },
      async savePartial() {
        const j = job;
        if (!j || j.busy || !j.parts.length || !active(j)) return;
        j.controller = new window2.AbortController();
        j.busy = true;
        emit(j, "\uBD80\uBD84 \uACB0\uACFC \uC800\uC7A5 \uC911", true);
        try {
          await persist(j);
        } catch (error) {
          emit(j, error instanceof Error ? error.message : "\uC800\uC7A5 \uC2E4\uD328 \xB7 \uAE30\uC874 \uBC88\uC5ED \uC720\uC9C0", false);
        } finally {
          j.busy = false;
          if (active(j)) notify({ busy: false, partial: j.parts.length > 0, messageId: j.messageId });
        }
      },
      navigation() {
        if (job && activeChatId(window2) !== job.chatId) {
          job.controller.abort();
          job = void 0;
          notify({ busy: false, partial: false, text: "\uCC44\uD305 \uC774\uB3D9\uC73C\uB85C \uCDE8\uC18C \xB7 \uAE30\uC874 \uBC88\uC5ED \uC720\uC9C0" });
        }
      },
      dispose() {
        disposed = true;
        job?.controller.abort();
        for (const c of controllers) c.abort();
        job = void 0;
        attempted.clear();
      }
    };
  }

  // src/runtime.ts
  var KEY = "translation_regex_me";
  var BASE_CSS = `:host{display:block;min-width:0;max-width:100%;contain:layout style paint;isolation:isolate}
.translation-content{position:relative;max-width:100%;overflow:auto;overflow-wrap:anywhere;white-space:pre-wrap}
.translation-content *{box-sizing:border-box;max-width:100%}table{display:block;overflow:auto}img{height:auto}pre{overflow:auto}`;
  function start(api, window2) {
    const document2 = window2.document;
    window2[KEY]?.dispose?.();
    const data = createData(api, window2), sanitize = createSanitizer(window2);
    let disposed = false, epoch = 0, timer, interval, running = false, rerun = false;
    let currentId = activeChatId(window2), store, queryCache;
    let offStore, offQuery, lastStore = "";
    const mounted = /* @__PURE__ */ new Map();
    const life = new window2.AbortController();
    const choices = /* @__PURE__ */ new Map(), intents = /* @__PURE__ */ new Map(), requested = /* @__PURE__ */ new Set();
    const settings = { enabled: false, conversation: false, autoContinue: false, showLauncher: true };
    const savedTranslations = /* @__PURE__ */ new Map();
    try {
      const saved = JSON.parse(window2.localStorage.getItem(`${KEY}.settings`) || "{}");
      settings.enabled = saved.autoApply === true;
      settings.conversation = saved.conversation === true;
      settings.autoContinue = saved.autoContinue === true;
      settings.showLauncher = saved.showLauncher !== false;
    } catch {
    }
    const el = (tag, text2) => {
      const n = document2.createElement(tag);
      if (text2) n.textContent = text2;
      return n;
    };
    const ui = el("div");
    ui.id = KEY;
    ui.hidden = true;
    const shadow = ui.attachShadow({ mode: "open" }), style = el("style");
    style.textContent = `:host{position:fixed;inset:0;z-index:1000;display:grid;place-items:center;padding:12px;background:#0006;font:14px/1.5 system-ui;color:#eee}:host([hidden]){display:none!important}
*{box-sizing:border-box}button{font:inherit;color:inherit;background:#303444;border:1px solid #6c7185;border-radius:8px;padding:8px 12px;cursor:pointer}
section{display:flex;flex-direction:column;background:#222633;border:1px solid #6c7185;border-radius:12px;padding:12px;width:320px;max-width:calc(100vw - 24px);max-height:70vh;max-height:min(70dvh,calc(100dvh - 96px));overflow:hidden;overflow-wrap:anywhere}
header{display:flex;align-items:center;justify-content:space-between;gap:8px;flex:none}header button{min-width:44px;min-height:44px;flex:none}.settings-body{overflow:auto;min-height:0}
[hidden]{display:none!important}label{display:flex;align-items:flex-start;gap:8px;margin:12px 0}input{flex:none;width:18px;height:18px}p{font-size:12px;margin:8px 0}h2{font-size:15px;margin:0}`;
    const panel = el("section");
    panel.hidden = true;
    panel.id = "settings";
    panel.setAttribute("aria-label", "\uBC88\uC5ED\uBB38 \uC815\uADDC\uC2DD \uC124\uC815");
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-modal", "true");
    const close = el("button", "\uB2EB\uAE30");
    close.type = "button";
    const status = el("p", "\uC218\uB3D9 \uC2E4\uD589 \xB7 \uBA54\uC2DC\uC9C0\uC758 \uC810\uC120 \uD050\uBE0C \uBC84\uD2BC\uC744 \uB204\uB974\uC138\uC694");
    status.setAttribute("role", "status");
    const header = el("header"), content = el("div");
    content.className = "settings-body";
    header.append(el("h2", "\uBC88\uC5ED\uBB38 \uD45C\uC2DC \uC815\uADDC\uC2DD"), close);
    panel.append(header, content);
    for (const [key, title] of [["enabled", "\uBC88\uC5ED\uBB38\uC5D0 \uC790\uB3D9 \uC801\uC6A9 (\uAE30\uBCF8 \uAEBC\uC9D0)"], ["conversation", "\uB300\uD654 \uBAA8\uB4DC\uC5D0\uB3C4 \uC801\uC6A9 (\uC6D0\uBB38 \uBC88\uC5ED\uB9CC)"], ["autoContinue", "\uBC88\uC5ED\uC774 \uB04A\uACBC\uC73C\uBA74 \uC790\uB3D9\uC73C\uB85C \uC774\uC5B4\uC11C (\uAE30\uBCF8 \uAEBC\uC9D0)"], ["showLauncher", "\uD50C\uB85C\uD305 \uB7F0\uCC98 \uD45C\uC2DC"]]) {
      const label = el("label"), input = el("input");
      input.type = "checkbox";
      input.checked = settings[key];
      input.id = key;
      input.addEventListener("change", () => {
        settings[key] = input.checked;
        try {
          window2.localStorage.setItem(`${KEY}.settings`, JSON.stringify({ autoApply: settings.enabled, conversation: settings.conversation, autoContinue: settings.autoContinue, showLauncher: settings.showLauncher }));
        } catch {
        }
        if (key === "showLauncher") {
          launcher.setShown(settings.showLauncher);
          return;
        }
        choices.clear();
        intents.clear();
        requested.clear();
        invalidate(true);
      }, { signal: life.signal });
      label.append(input, el("span", title));
      content.append(label);
    }
    content.append(el("p", "\uB300\uD654 \uBAA8\uB4DC\uC5D0\uC11C \uC774\uBBF8 \uAC00\uACF5\uD55C HTML\uC744 \uBC88\uC5ED\uD55C \uACBD\uC6B0\uC5D0\uB294 \uC911\uBCF5 \uC801\uC6A9\uC744 \uD53C\uD558\uAE30 \uC704\uD574 \uC6D0\uB798 \uBC88\uC5ED\uBB38\uC744 \uD45C\uC2DC\uD569\uB2C8\uB2E4."));
    const refresh = el("button", "\uADDC\uCE59 \uC0C8\uB85C\uACE0\uCE68");
    refresh.type = "button";
    refresh.addEventListener("click", () => invalidate(true), { signal: life.signal });
    const translationMenu = el("div"), jobStatus = el("p"), partialHelp = el("p", "\uBD80\uBD84 \uACB0\uACFC \uC800\uC7A5\uC740 \uAE30\uC874 \uBC88\uC5ED\uC744 \uC644\uB8CC\uB41C \uCCAD\uD06C\uAE4C\uC9C0\uC758 \uBC88\uC5ED\uC73C\uB85C \uBC14\uAFC9\uB2C8\uB2E4.");
    partialHelp.hidden = true;
    jobStatus.setAttribute("role", "status");
    const resume = el("button", "\uC774\uC5B4\uC11C \uBC88\uC5ED"), split = el("button", "\uB098\uB220\uC11C \uB2E4\uC2DC \uBC88\uC5ED");
    const cancel = el("button", "\uCDE8\uC18C"), keep = el("button", "\uBD80\uBD84 \uACB0\uACFC \uC800\uC7A5"), discard = el("button", "\uBD80\uBD84 \uACB0\uACFC \uBC84\uB9AC\uAE30");
    resume.id = "continue-translation";
    split.id = "split-translation";
    cancel.id = "cancel-translation";
    keep.id = "save-partial";
    discard.id = "discard-partial";
    cancel.hidden = keep.hidden = discard.hidden = true;
    translationMenu.append(resume, split, cancel, keep, discard, partialHelp, jobStatus);
    content.append(status, translationMenu, refresh);
    shadow.append(style, panel);
    document2.body.append(ui);
    let opener, panelChatId;
    const launcher = createLauncher(window2, (button) => {
      if (ui.hidden) openPanel(button);
      else closePanel();
    }, settings.showLauncher);
    function openPanel(button) {
      opener = button;
      panelChatId = activeChatId(window2);
      ui.hidden = false;
      panel.hidden = false;
      translationMenu.hidden = !button?.closest("[data-message-id]");
      launcher.button.setAttribute("aria-expanded", "true");
      close.focus({ preventScroll: true });
    }
    function closePanel() {
      ui.hidden = true;
      panel.hidden = true;
      launcher.button.setAttribute("aria-expanded", "false");
      if (opener?.isConnected) opener.focus({ preventScroll: true });
      opener = void 0;
    }
    close.addEventListener("click", closePanel, { signal: life.signal });
    ui.addEventListener("click", (e) => {
      e.stopPropagation();
      if (e.composedPath()[0] === ui) closePanel();
    }, { signal: life.signal });
    for (const type of ["pointerdown", "touchstart", "contextmenu"]) ui.addEventListener(type, (e) => e.stopPropagation(), { signal: life.signal });
    document2.addEventListener("keydown", (e) => {
      if (ui.hidden) return;
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        closePanel();
      }
      if (e.key === "Tab") {
        const controls = [...panel.querySelectorAll("button,input")].filter((n) => !n.closest("[hidden]") && !n.disabled), index = controls.indexOf(shadow.activeElement);
        if (index === -1 || !e.shiftKey && index === controls.length - 1 || e.shiftKey && index === 0) {
          e.preventDefault();
          controls[e.shiftKey ? controls.length - 1 : 0].focus();
        }
      }
    }, { capture: true, signal: life.signal });
    document2.addEventListener("focusin", (e) => {
      if (!ui.hidden && !e.composedPath().includes(ui)) close.focus({ preventScroll: true });
    }, { signal: life.signal });
    const jobs = createTranslationJobs(api, window2, (state) => {
      if (state.text !== void 0) jobStatus.textContent = state.text;
      partialHelp.hidden = !state.partial;
      cancel.hidden = !state.busy;
      keep.hidden = discard.hidden = !state.partial;
      resume.disabled = split.disabled = state.busy || state.partial;
      keep.disabled = discard.disabled = state.busy;
      if (state.messageId) actions.state(state.messageId, state.busy ? "busy" : "idle", state.text || jobStatus.textContent);
    }, (job, text2) => {
      savedTranslations.set(job.messageId, text2);
      intents.set(job.messageId, true);
      requested.add(job.messageId);
      invalidate(true);
      try {
        Promise.resolve(window2.__MARINARA_HOST__?.queryClient?.invalidateQueries?.({ queryKey: ["chats", "messages", job.chatId] })).catch(() => {
        });
      } catch {
      }
    });
    for (const [button, mode] of [[resume, "continue"], [split, "split"]]) {
      button.type = "button";
      button.addEventListener("click", () => {
        const id = opener?.closest("[data-message-id]")?.getAttribute("data-message-id");
        if (id && panelChatId === activeChatId(window2)) void jobs.execute(id, mode);
        else jobStatus.textContent = "\uCC44\uD305\uC774 \uBCC0\uACBD\uB418\uC5C8\uC2B5\uB2C8\uB2E4 \xB7 \uD604\uC7AC \uBA54\uC2DC\uC9C0\uC758 \uD050\uBE0C \uBA54\uB274\uB97C \uB2E4\uC2DC \uC5EC\uC138\uC694";
      }, { signal: life.signal });
    }
    cancel.addEventListener("click", () => jobs.cancel(), { signal: life.signal });
    keep.addEventListener("click", () => {
      void jobs.savePartial();
    }, { signal: life.signal });
    discard.addEventListener("click", () => jobs.discard(), { signal: life.signal });
    const actions = createActions(window2, (messageId) => {
      const wanted = actions.kind(messageId) === "error" || !requested.has(messageId);
      intents.set(messageId, wanted);
      if (wanted) requested.add(messageId);
      else requested.delete(messageId);
      invalidate(true);
      actions.state(messageId, wanted ? "busy" : "idle", wanted ? "\uC801\uC6A9 \uC911" : "\uC6D0\uB798 \uBC88\uC5ED\uBB38 \uD45C\uC2DC");
    }, openPanel);
    function observe() {
      if (!disposed) observer.observe(document2.body, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true,
        attributeFilter: ["class", "style", "hidden", "data-message-id"]
      });
    }
    function quiet(fn) {
      observer.disconnect();
      try {
        fn();
      } finally {
        observe();
      }
    }
    function release(node) {
      const state = mounted.get(node);
      if (!state) return;
      state.wrapper.remove();
      if (node.style.getPropertyValue("display") === "none" && node.style.getPropertyPriority("display") === "important") {
        if (state.display) node.style.setProperty("display", state.display, state.priority);
        else node.style.removeProperty("display");
        if (!state.hadStyle && !node.getAttribute("style")) node.removeAttribute("style");
      }
      mounted.delete(node);
    }
    function restoreAll() {
      quiet(() => {
        for (const node of mounted.keys()) release(node);
      });
    }
    function schedule() {
      if (disposed) return;
      window2.clearTimeout(timer);
      timer = window2.setTimeout(() => {
        timer = null;
        void run();
      }, 60);
    }
    function invalidate(all = false) {
      if (disposed) return;
      epoch++;
      data.invalidate(all);
      restoreAll();
      schedule();
    }
    function relevant(m) {
      const target = m.target.nodeType === 1 ? m.target : m.target.parentElement;
      if (target?.closest?.(`[data-${KEY}],[data-translation-regex-action],#${KEY}`)) return false;
      if (target?.closest?.("[data-translation-polisher-ui]") && !target.closest(".translation-text,.mari-message-content")) return false;
      const node = target?.closest?.(".translation-text,.mari-message-content");
      const old = mounted.get(node);
      if (old && fingerprint(node) === old.fingerprint && node.nextSibling === old.wrapper && node.style.getPropertyValue("display") === "none") return false;
      if (target?.closest?.("[data-message-id],.translation-text")) return true;
      return [...m.addedNodes || [], ...m.removedNodes || []].some((n) => n.nodeType === 1 && (n.matches?.(".translation-text,[data-message-id]") || n.querySelector?.(".translation-text,[data-message-id]")));
    }
    const observer = new window2.MutationObserver((records) => {
      if (records.some(relevant) || [...mounted].some(([n, s]) => !n.isConnected || !s.wrapper.isConnected)) {
        epoch++;
        data.invalidate();
        schedule();
      }
    });
    function connect() {
      const host = window2.__MARINARA_HOST__;
      if (host?.stores?.chat !== store) {
        offStore?.();
        store = host?.stores?.chat;
        const consume = (s) => {
          const signature = JSON.stringify([s.activeChatId, s.activeChat, s.isStreaming, s.streamingChatId]);
          if (lastStore && lastStore !== signature) invalidate(true);
          lastStore = signature;
        };
        if (store?.subscribe) {
          offStore = store.subscribe(consume);
          consume(store.getState());
        }
      }
      const next = host?.queryClient?.getQueryCache?.();
      if (next !== queryCache) {
        offQuery?.();
        queryCache = next;
        offQuery = next?.subscribe((event) => {
          const key = event.query?.queryKey;
          if (event.type === "updated" && ["success", "invalidate"].includes(event.action?.type) && ["chats", "regex-scripts", "presets", "characters", "personas", "connections"].includes(key?.[0])) invalidate(true);
        });
      }
    }
    const fingerprint = (node) => `${node.closest("[data-message-id]")?.getAttribute("data-message-id")}\0${node.className}\0${node.innerHTML}`;
    function current(version, id) {
      return !disposed && epoch === version && activeChatId(window2) === id;
    }
    async function run() {
      if (disposed) return;
      if (running) {
        rerun = true;
        return;
      }
      running = true;
      let version = epoch;
      try {
        connect();
        jobs.navigation();
        const id = activeChatId(window2);
        if (id !== currentId) {
          currentId = id;
          savedTranslations.clear();
          choices.clear();
          intents.clear();
          requested.clear();
          epoch++;
          data.invalidate(true);
          restoreAll();
        }
        quiet(() => {
          for (const [node, state2] of mounted) if (!node.isConnected || !state2.wrapper.isConnected) release(node);
          actions.sync();
        });
        if (!id) {
          restoreAll();
          status.textContent = "\uD65C\uC131 \uCC44\uD305 \uC5C6\uC74C";
          return;
        }
        if (jobs.busy) return;
        const roots = [...document2.querySelectorAll("[data-message-id]")];
        if (!roots.length) {
          restoreAll();
          status.textContent = "\uD45C\uC2DC\uB41C \uBA54\uC2DC\uC9C0 \uC5C6\uC74C";
          return;
        }
        if (!settings.enabled && !settings.autoContinue && !requested.size && !intents.size && ![...choices.values()].some(Boolean)) {
          restoreAll();
          for (const mid of actions.ids()) actions.state(mid, "idle");
          status.textContent = "\uC218\uB3D9 \uC2E4\uD589 \xB7 \uBA54\uC2DC\uC9C0\uC758 \uC810\uC120 \uD050\uBE0C \uBC84\uD2BC\uC744 \uB204\uB974\uC138\uC694";
          return;
        }
        version = epoch;
        const candidates = roots.flatMap((root2) => [...root2.querySelectorAll(".translation-text,.mari-message-content")]).filter((node) => !node.hasAttribute(`data-${KEY}`));
        const stamps = new Map(candidates.map((node) => [node, fingerprint(node)]));
        if (!jobs.busy) for (const mid of requested) actions.state(mid, "busy", "\uC801\uC6A9 \uC911");
        const state = store?.getState?.();
        if (state?.isStreaming && (!state.streamingChatId || state.streamingChatId === id)) {
          restoreAll();
          for (const mid of actions.ids()) actions.state(mid, "busy", "\uC0DD\uC131 \uC911 \xB7 \uC644\uB8CC \uD6C4 \uD655\uC778");
          status.textContent = "\uC0DD\uC131 \uC911 \xB7 \uC6D0\uB798 \uBC88\uC5ED\uBB38 \uD45C\uC2DC";
          return;
        }
        if (!store) {
          const generation = await data.get(`/api/generate/status/${encodeURIComponent(id)}`, 1e3);
          if (typeof generation?.active !== "boolean") throw Error("Invalid generation status");
          if (!current(version, id)) return;
          if (generation.active || generation.translating) {
            restoreAll();
            for (const mid of actions.ids()) actions.state(mid, "busy", "\uC0DD\uC131/\uBC88\uC5ED \uC911 \xB7 \uC644\uB8CC \uD6C4 \uD655\uC778");
            status.textContent = "\uC0DD\uC131/\uBC88\uC5ED \uC911 \xB7 \uC6D0\uB798 \uBC88\uC5ED\uBB38 \uD45C\uC2DC";
            return;
          }
        }
        const snapshot = await data.snapshot(id);
        if (!current(version, id)) return;
        if (jobs.busy) return;
        const { chat, messages, rules, presets } = snapshot;
        if (chat.mode !== "roleplay" && !(chat.mode === "conversation" && settings.conversation)) {
          restoreAll();
          for (const mid of actions.ids()) actions.state(mid, "idle", "\uC774 \uCC44\uD305 \uBAA8\uB4DC\uB294 \uC124\uC815\uC5D0\uC11C \uD5C8\uC6A9\uD574\uC57C \uD569\uB2C8\uB2E4");
          status.textContent = "\uC774 \uCC44\uD305 \uBAA8\uB4DC\uC5D0\uC11C\uB294 \uC6D0\uB798 \uBC88\uC5ED\uBB38 \uD45C\uC2DC";
          return;
        }
        const scripts = rules.map(parseScript);
        const scopedMode = resolveScopedRegexMode(record(chat.metadata).scopedRegexMode, presets.find((p) => p.id === chat.promptPresetId)?.scopedRegexMode);
        let count = 0;
        const validNodes = /* @__PURE__ */ new Set();
        const details = /* @__PURE__ */ new Set();
        for (const root2 of roots) {
          if (!current(version, id)) return;
          const messageId = root2.getAttribute("data-message-id");
          const index = messages.findIndex((m) => m.id === messageId), message = messages[index];
          const skip = (detail) => {
            details.add(detail);
            actions.state(messageId, "idle", detail);
          };
          if (!message || message.role !== "assistant") {
            skip("\uD604\uC7AC AI \uBA54\uC2DC\uC9C0\uB97C API\uC5D0\uC11C \uD655\uC778\uD560 \uC218 \uC5C6\uC74C");
            continue;
          }
          const key = `${id}:${message.id}:${message.activeSwipeIndex ?? 0}`;
          if (intents.has(messageId)) {
            choices.set(key, intents.get(messageId));
            intents.delete(messageId);
          }
          const messageExtra = record(message.extra);
          if (settings.autoContinue && !messageExtra.translationHidden && sourceMatches(message) && typeof messageExtra.translation === "string" && truncation(message.content, messageExtra.translation).suspected && jobs.canAuto(id, message)) {
            void jobs.execute(messageId, "continue", true);
            return;
          }
          if (jobs.busy) continue;
          const wanted = choices.get(key) ?? settings.enabled;
          if (wanted) requested.add(messageId);
          else requested.delete(messageId);
          if (!wanted) {
            actions.state(messageId, "idle");
            continue;
          }
          const swipe = snapshot.bySwipe.get(key);
          const extra = record(swipe.extra), raw = extra.translation;
          if (typeof raw !== "string" || !raw) {
            skip("API\uC5D0 \uC800\uC7A5\uB41C \uBC88\uC5ED\uBB38 \uC5C6\uC74C \xB7 \uB2E4\uC74C \uD655\uC778 \uB54C \uC7AC\uC2DC\uB3C4");
            continue;
          }
          if (extra.translationHidden === true) {
            skip("\uC228\uAE34 \uBC88\uC5ED\uBB38 \xB7 \uC6D0\uB798 \uD45C\uC2DC \uC720\uC9C0");
            continue;
          }
          if (chat.mode === "roleplay" && typeof extra.translationSource === "string" && !sourceMatches(message, extra)) {
            skip("\uD604\uC7AC \uC2A4\uC640\uC774\uD504\uC640 \uBC88\uC5ED \uC6D0\uBB38 \uBD88\uC77C\uCE58");
            continue;
          }
          if (chat.mode === "conversation" && !sourceMatches(message, extra)) {
            skip("\uAC00\uACF5\uB41C HTML \uB610\uB294 \uCD9C\uCC98 \uBBF8\uD655\uC778 \uBC88\uC5ED \xB7 \uC911\uBCF5 \uC801\uC6A9 \uBC29\uC9C0");
            continue;
          }
          const separate = [...root2.querySelectorAll(".translation-text")].filter((n) => n.closest("[data-message-id]") === root2);
          const inline = record(chat.metadata).translationDisplayOnly === true && sourceMatches(message, extra);
          const nodes = separate.length ? separate : inline ? [...root2.querySelectorAll(".mari-message-content")].filter((n) => !n.hasAttribute(`data-${KEY}`) && n.closest("[data-message-id]") === root2) : [];
          if (nodes.length !== 1 || root2.querySelector("textarea,[contenteditable=true]")) {
            skip("\uC9C0\uC6D0\uD558\uB294 \uBC88\uC5ED \uD45C\uC2DC \uC601\uC5ED \uC5C6\uC74C");
            continue;
          }
          const node = nodes[0];
          if (!separate.length && [...node.parentElement.children].some((n) => n !== node && !n.hasAttribute(`data-${KEY}`) && n.classList.contains("border-t") && n.querySelector("span") && !n.querySelector(".translation-text"))) {
            skip("\uBC88\uC5ED \uC9C4\uD589 \uC911 \xB7 \uC6D0\uB798 \uD45C\uC2DC \uC720\uC9C0");
            continue;
          }
          if (!separate.length && node.querySelector("button,input,select,video,audio")) {
            skip("\uC0C1\uD638\uC791\uC6A9 \uBCF8\uBB38 \xB7 \uC6D0\uB798 \uD45C\uC2DC \uC720\uC9C0");
            continue;
          }
          if (node.querySelector("[data-translation-polisher-ui]")) {
            skip("\uB2E4\uB4EC\uAE30 UI\uAC00 \uD3EC\uD568\uB41C \uBC88\uC5ED \uC601\uC5ED \xB7 \uC6D0\uB798 \uD45C\uC2DC \uC720\uC9C0");
            continue;
          }
          if (!stamps.has(node)) {
            skip("\uD654\uBA74 \uBCC0\uACBD \uC911 \xB7 \uB2E4\uC74C \uD655\uC778 \uB54C \uC7AC\uC2DC\uB3C4");
            continue;
          }
          validNodes.add(node);
          const resolve = /\{\{/.test(raw + rules.map((r) => `${r.findRegex}${r.replaceString}${r.trimStrings}`).join("")) ? await data.resolver(chat, message) : createMessageMacroResolver({ userName: "You", primaryCharacter: { name: "Assistant" } }, { randomSeed: `${message.id}:${message.activeSwipeIndex ?? 0}` });
          if (!current(version, id)) return;
          const output = resolve(formatTextQuotes(applyScripts(raw, scripts, "ai_output", {
            depth: messages.length - 1 - index,
            resolveMacros: resolve,
            scopedMode,
            characterId: message.characterId,
            promptPresetId: chat.promptPresetId
          }), quoteFormat(window2)));
          if (!current(version, id) || !node.isConnected || fingerprint(node) !== stamps.get(node)) continue;
          if (output === raw && savedTranslations.get(messageId) !== raw) {
            quiet(() => release(node));
            skip("\uC801\uC6A9\uD560 \uADDC\uCE59 \uC5C6\uC74C \xB7 \uC6D0\uB798 \uBC88\uC5ED\uBB38 \uD45C\uC2DC");
            continue;
          }
          const signature = JSON.stringify([id, message.id, message.activeSwipeIndex ?? 0, raw, output, stamps.get(node)]);
          if (mounted.get(node)?.signature === signature && node.nextSibling === mounted.get(node).wrapper) {
            count++;
            actions.state(messageId, "applied", "\uC801\uC6A9\uB428 \xB7 \uB2E4\uC2DC \uB204\uB974\uBA74 \uC6D0\uB798 \uBC88\uC5ED\uBB38");
            continue;
          }
          const clean = sanitize(output);
          if (!clean.fragment.textContent?.trim() && !clean.fragment.querySelector("img,hr")) {
            quiet(() => release(node));
            skip("\uBCC0\uD658 \uACB0\uACFC\uAC00 \uBE44\uC5B4 \uC6D0\uB798 \uBC88\uC5ED\uBB38 \uD45C\uC2DC");
            continue;
          }
          const wrapper = el("div");
          wrapper.setAttribute(`data-${KEY}`, "");
          wrapper.className = node.className.replace(/\btranslation-text\b/g, "").trim();
          const renderedRoot = wrapper.attachShadow({ mode: "open" }), css = el("style"), body = el("div");
          body.className = "translation-content";
          css.textContent = BASE_CSS + "\n" + clean.css;
          body.append(clean.fragment);
          renderedRoot.append(css, body);
          quiet(() => {
            release(node);
            const old = { display: node.style.getPropertyValue("display"), priority: node.style.getPropertyPriority("display"), hadStyle: node.hasAttribute("style") };
            node.after(wrapper);
            mounted.set(node, { ...old, wrapper, signature, fingerprint: fingerprint(node) });
            node.style.setProperty("display", "none", "important");
          });
          count++;
          actions.state(messageId, "applied", "\uC801\uC6A9\uB428 \xB7 \uB2E4\uC2DC \uB204\uB974\uBA74 \uC6D0\uB798 \uBC88\uC5ED\uBB38");
        }
        quiet(() => {
          for (const node of mounted.keys()) if (!validNodes.has(node)) release(node);
        });
        status.textContent = count ? `${count}\uAC1C \uBC88\uC5ED\uBB38\uC5D0 \uD45C\uC2DC \uC815\uADDC\uC2DD \uC801\uC6A9` : [...details].join(" / ") || "\uC218\uB3D9 \uC2E4\uD589 \xB7 \uBA54\uC2DC\uC9C0\uC758 \uC810\uC120 \uD050\uBE0C \uBC84\uD2BC\uC744 \uB204\uB974\uC138\uC694";
      } catch {
        if (!disposed && version === epoch) {
          restoreAll();
          for (const mid of actions.ids()) actions.state(mid, "error", "\uC801\uC6A9 \uC2E4\uD328 \xB7 \uC6D0\uB798 \uBC88\uC5ED\uBB38 \uD45C\uC2DC \xB7 \uB2E4\uC2DC \uB204\uB974\uAC70\uB098 \uB2E4\uC74C \uD655\uC778 \uB54C \uC7AC\uC2DC\uB3C4");
          status.textContent = "\uC801\uC6A9 \uC2E4\uD328 \xB7 \uC6D0\uB798 \uBC88\uC5ED\uBB38 \uD45C\uC2DC (\uC790\uB3D9 \uC7AC\uC2DC\uB3C4)";
        }
      } finally {
        running = false;
        if (rerun && !disposed) {
          rerun = false;
          schedule();
        }
      }
    }
    function dispose() {
      if (disposed) return;
      disposed = true;
      epoch++;
      observer.disconnect();
      window2.clearTimeout(timer);
      window2.clearInterval(interval);
      life.abort();
      jobs.dispose();
      offStore?.();
      offQuery?.();
      data.dispose();
      for (const node of mounted.keys()) release(node);
      launcher.dispose();
      actions.dispose();
      choices.clear();
      intents.clear();
      requested.clear();
      ui.remove();
      if (window2[KEY]?.dispose === dispose) delete window2[KEY];
    }
    const instance = { dispose, refresh: () => invalidate(true) };
    window2[KEY] = instance;
    api.onCleanup(dispose);
    observe();
    interval = window2.setInterval(() => {
      void run();
    }, 2e3);
    void run();
    return instance;
  }

  // src/entry.ts
  try {
    start(marinara, window);
  } catch {
    marinara.log.error("\uBC88\uC5ED\uBB38 \uC815\uADDC\uC2DD \uCD08\uAE30\uD654 \uC2E4\uD328. \uD655\uC7A5\uC744 \uB2E4\uC2DC \uCF1C \uC8FC\uC138\uC694.");
  }
})();
