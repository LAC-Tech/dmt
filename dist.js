var T=e=>{let n=s=>e.successfulTest(e.description(s,e.success("\u2713"))),t=(s,{reason:f})=>{let o=(()=>{switch(f.kind){case"threw-exn":return e.exn(e.fail(f.error));case"not-equal":{let h=f.changes.map(({kind:a,value:d})=>{switch(a){case"expected":return e.fail(d);case"actual":return e.success(d);case"same":return e.same(d)}});return e.diff(h)}}})();return e.failedTest(e.description(s,e.fail("\u2716")),o)},r=({fails:s,passes:f,children:o})=>h=>{let a=[...f?[e.success("\u2713",e.sub(f))]:[],...s?[e.fail("\u2716",e.sub(s))]:[]];return e.details(s!=0,e.summary(h,a),o)},u=s=>f=>{switch(s.kind){case"pass":return n(f);case"fail":return t(f,s)}},i=s=>r({...s,children:l(s.children)}),l=s=>Object.entries(s).map(([f,o])=>("kind"in o?u(o):i(o))(f));return l};var C=({fails:e,passes:n,children:t})=>{let r=e==0?"\u2713":`\u2716${e}`;document.title=`dmt ${r}`;let u=document.createDocumentFragment(),i=document.createElement("style");i.textContent=`
			html {
				color: whitesmoke;
				background: #000007;
				font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
			}

			.indent {
				padding-left: 1em;
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

			pre {
				font-family: monospace;
				margin: 0;
			}
	`,u.append(i);let l=ue(t);for(let s of l)u.appendChild(s);return u},p=(e,n,t=[])=>{let r=document.createElement(e);return Object.assign(r,n),Array.isArray(t)?r.append(...t):r.append(t),r},re={success:(...e)=>p("span",{className:"success"},e),fail:(...e)=>p("span",{className:"fail"},e),same:e=>p("span",{innerText:e}),diff:e=>p("pre",{className:"diff indent"},e),exn:e=>p("pre",{className:"indent"},e),successfulTest:e=>p("div",{className:"indent"},e),failedTest:(e,n)=>p("div",{className:"indent"},[e,n]),description:(e,n)=>p("div",{className:"description"},[e,n]),sub:e=>p("small",{},p("sub",{},e.toString())),summary:(e,n)=>p("summary",{},[p("b",{},e),...n]),details:(e,n,t)=>p("details",{className:"indent",open:e},[n,...t])},ue=T(re);function y(){}y.prototype={diff:function(n,t){var r=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{},u=r.callback;typeof r=="function"&&(u=r,r={}),this.options=r;var i=this;function l(g){return u?(setTimeout(function(){u(void 0,g)},0),!0):g}n=this.castInput(n),t=this.castInput(t),n=this.removeEmpty(this.tokenize(n)),t=this.removeEmpty(this.tokenize(t));var s=t.length,f=n.length,o=1,h=s+f,a=[{newPos:-1,components:[]}],d=this.extractCommon(a[0],t,n,0);if(a[0].newPos+1>=s&&d+1>=f)return l([{value:this.join(t),count:t.length}]);function m(){for(var g=-1*o;g<=o;g+=2){var w=void 0,N=a[g-1],E=a[g+1],x=(E?E.newPos:0)-g;N&&(a[g-1]=void 0);var z=N&&N.newPos+1<s,W=E&&0<=x&&x<f;if(!z&&!W){a[g]=void 0;continue}if(!z||W&&N.newPos<E.newPos?(w=se(E),i.pushComponent(w.components,void 0,!0)):(w=N,w.newPos++,i.pushComponent(w.components,!0,void 0)),x=i.extractCommon(w,t,n,g),w.newPos+1>=s&&x+1>=f)return l(ie(i,w.components,t,n,i.useLongestToken));a[g]=w}o++}if(u)(function g(){setTimeout(function(){if(o>h)return u();m()||g()},0)})();else for(;o<=h;){var F=m();if(F)return F}},pushComponent:function(n,t,r){var u=n[n.length-1];u&&u.added===t&&u.removed===r?n[n.length-1]={count:u.count+1,added:t,removed:r}:n.push({count:1,added:t,removed:r})},extractCommon:function(n,t,r,u){for(var i=t.length,l=r.length,s=n.newPos,f=s-u,o=0;s+1<i&&f+1<l&&this.equals(t[s+1],r[f+1]);)s++,f++,o++;return o&&n.components.push({count:o}),n.newPos=s,f},equals:function(n,t){return this.options.comparator?this.options.comparator(n,t):n===t||this.options.ignoreCase&&n.toLowerCase()===t.toLowerCase()},removeEmpty:function(n){for(var t=[],r=0;r<n.length;r++)n[r]&&t.push(n[r]);return t},castInput:function(n){return n},tokenize:function(n){return n.split("")},join:function(n){return n.join("")}};function ie(e,n,t,r,u){for(var i=0,l=n.length,s=0,f=0;i<l;i++){var o=n[i];if(o.removed){if(o.value=e.join(r.slice(f,f+o.count)),f+=o.count,i&&n[i-1].added){var a=n[i-1];n[i-1]=n[i],n[i]=a}}else{if(!o.added&&u){var h=t.slice(s,s+o.count);h=h.map(function(m,F){var g=r[f+F];return g.length>m.length?g:m}),o.value=e.join(h)}else o.value=e.join(t.slice(s,s+o.count));s+=o.count,o.added||(f+=o.count)}}var d=n[l-1];return l>1&&typeof d.value=="string"&&(d.added||d.removed)&&e.equals("",d.value)&&(n[l-2].value+=d.value,n.pop()),n}function se(e){return{newPos:e.newPos,components:e.components.slice(0)}}var Ve=new y;var B=/^[A-Za-z\xC0-\u02C6\u02C8-\u02D7\u02DE-\u02FF\u1E00-\u1EFF]+$/,U=/\S/,J=new y;J.equals=function(e,n){return this.options.ignoreCase&&(e=e.toLowerCase(),n=n.toLowerCase()),e===n||this.options.ignoreWhitespace&&!U.test(e)&&!U.test(n)};J.tokenize=function(e){for(var n=e.split(/([^\S\r\n]+|[()[\]{}'"\r\n]|\b)/),t=0;t<n.length-1;t++)!n[t+1]&&n[t+2]&&B.test(n[t])&&B.test(n[t+2])&&(n[t]+=n[t+2],n.splice(t+1,2),t--);return n};var k=new y;k.tokenize=function(e){var n=[],t=e.split(/(\n|\r\n)/);t[t.length-1]||t.pop();for(var r=0;r<t.length;r++){var u=t[r];r%2&&!this.options.newlineIsToken?n[n.length-1]+=u:(this.options.ignoreWhitespace&&(u=u.trim()),n.push(u))}return n};var fe=new y;fe.tokenize=function(e){return e.split(/(\S.+?[.!?])(?=\s+|$)/)};var oe=new y;oe.tokenize=function(e){return e.split(/([{}:;,]|\s+)/)};function R(e){return typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?R=function(n){return typeof n}:R=function(n){return n&&typeof Symbol=="function"&&n.constructor===Symbol&&n!==Symbol.prototype?"symbol":typeof n},R(e)}var le=Object.prototype.toString,L=new y;L.useLongestToken=!0;L.tokenize=k.tokenize;L.castInput=function(e){var n=this.options,t=n.undefinedReplacement,r=n.stringifyReplacer,u=r===void 0?function(i,l){return typeof l>"u"?t:l}:r;return typeof e=="string"?e:JSON.stringify(_(e,null,null,u),u,"  ")};L.equals=function(e,n){return y.prototype.equals.call(L,e.replace(/,([\r\n])/g,"$1"),n.replace(/,([\r\n])/g,"$1"))};function D(e,n,t){return L.diff(e,n,t)}function _(e,n,t,r,u){n=n||[],t=t||[],r&&(e=r(u,e));var i;for(i=0;i<n.length;i+=1)if(n[i]===e)return t[i];var l;if(le.call(e)==="[object Array]"){for(n.push(e),l=new Array(e.length),t.push(l),i=0;i<e.length;i+=1)l[i]=_(e[i],n,t,r,u);return n.pop(),t.pop(),l}if(e&&e.toJSON&&(e=e.toJSON()),R(e)==="object"&&e!==null){n.push(e),l={},t.push(l);var s=[],f;for(f in e)e.hasOwnProperty(f)&&s.push(f);for(s.sort(),i=0;i<s.length;i+=1)f=s[i],l[f]=_(e[f],n,t,r,f);n.pop(),t.pop()}else l=e;return l}var b=new y;b.tokenize=function(e){return e.slice()};b.join=b.removeEmpty=function(e){return e};function c(e,n=[]){return(...t)=>(r=>r.length>=e.length?e(...r):c(e,r))([...n,...t])}var A=e=>Array.prototype.slice.call(e);function ce(e,n,t){let r=e<0?t.length+e:e;if(e>=t.length||r<0)return t;let u=A(t);return u[r]=n(u[r]),u}var Xe=c(ce);function ae(e){return()=>e}var H=Array.isArray;function he(e,n,t){return Object.assign({},t,{[e]:n})}var de=c(he);function O(e){return e<<0===e}var Ze=Number.isInteger||O;function G(e,n,t){let r=typeof e=="string"?e.split(".").map(i=>O(Number(i))?Number(i):i):e;if(r.length===0)return n;let u=r[0];if(r.length>1){let l=typeof t!="object"||t===null||!t.hasOwnProperty(u)?O(r[1])?[]:{}:t[u];n=G(Array.prototype.slice.call(r,1),n,l)}if(O(u)&&H(t)){let i=A(t);return i[u]=n,i}return de(u,n,t)}var Ge=c(G);function ge(e,n,t){if(e>n)throw new Error("min must not be greater than max in clamp(min, max, value)");if(t>=e&&t<=n)return t;if(t>n)return n;if(t<e)return e}var Me=c(ge);function pe(e,n,t){if(!H(t))throw new TypeError("reduce: list must be array or iterable");let r=0,u=t.length;for(;r<u;)n=e(n,t[r],r,t),r++;return n}var me=c(pe);function we(e){return e==null||Number.isNaN(e)===!0}function S(e,n){return arguments.length===1?t=>S(e,t):we(n)?e:n}function I(e){if(e===null)return"Null";if(e===void 0)return"Undefined";if(Number.isNaN(e))return"NaN";let n=Object.prototype.toString.call(e).slice(8,-1);return n==="AsyncFunction"?"Async":n}function ye(e,n){if(!H(n))throw new Error(`Cannot read property 'indexOf' of ${n}`);let t=I(e);if(!["Object","Array","NaN","RegExp"].includes(t))return n.indexOf(e);let r=-1,u=-1,{length:i}=n;for(;++r<i&&u===-1;)v(n[r],e)&&(u=r);return u}function V(e){let n=[],t;for(;!(t=e.next()).done;)n.push(t.value);return n}function ve(e,n){if(e.size!==n.size)return!1;let t=V(e.values()),r=V(n.values());return t.filter(i=>ye(i,r)===-1).length===0}function P(e){let n=e.__proto__.toString();return["Error","TypeError"].includes(n)?[n,e.message]:[]}function X(e){return e.toDateString?[!0,e.getTime()]:[!1]}function Z(e){return e.constructor!==RegExp?[!1]:[!0,e.toString()]}function v(e,n){if(arguments.length===1)return o=>v(e,o);let t=I(e);if(t!==I(n))return!1;if(t==="Function")return e.name===void 0?!1:e.name===n.name;if(["NaN","Undefined","Null"].includes(t))return!0;if(t==="Number")return Object.is(-0,e)!==Object.is(-0,n)?!1:e.toString()===n.toString();if(["String","Boolean"].includes(t))return e.toString()===n.toString();if(t==="Array"){let o=Array.from(e),h=Array.from(n);if(o.toString()!==h.toString())return!1;let a=!0;return o.forEach((d,m)=>{a&&d!==h[m]&&!v(d,h[m])&&(a=!1)}),a}let r=Z(e),u=Z(n);if(r[0])return u[0]?r[1]===u[1]:!1;if(u[0])return!1;let i=X(e),l=X(n);if(i[0])return l[0]?i[1]===l[1]:!1;if(l[0])return!1;let s=P(e),f=P(n);if(s[0])return f[0]?s[0]===f[0]&&s[1]===f[1]:!1;if(t==="Set")return ve(e,n);if(t==="Object"){let o=Object.keys(e);if(o.length!==Object.keys(n).length)return!1;let h=!0;return o.forEach(a=>{if(h){let d=e[a],m=n[a];d!==m&&!v(d,m)&&(h=!1)}}),h}return!1}function j(e,n){if(arguments.length===1)return t=>j(e,t);if(!!n)return n[e]}function Le(e,n,t){return v(j(e,n),j(e,t))}var Qe=c(Le);function q(e,n){if(arguments.length===1)return i=>q(e,i);if(n==null)return;let t=n,r=0,u=typeof e=="string"?e.split("."):e;for(;r<u.length;){if(t==null||t[u[r]]===null)return;t=t[u[r]],r++}return t}function Ne(e,n,t){return(...r)=>(typeof e=="boolean"?e:e(...r))===!0?n(...r):t(...r)}var Ye=c(Ne);function Ee(e,n,t){let r=-1,{length:u}=e;t=t>u?u:t,t<0&&(t+=u),u=n>t?0:t-n>>>0,n>>>=0;let i=Array(u);for(;++r<u;)i[r]=e[r+n];return i}function M(e,n){return arguments.length===1?t=>M(e,t):n!=null&&n.constructor===e||n instanceof e}function Fe(e,n,t){let r=A(t);return e===-1?r.fill(n,e):r.fill(n,e,e+1)}var Ke=c(Fe);function xe(e,n,t){return e(t)>e(n)?t:n}var en=c(xe);function Re(e,n,t){return e(t)<e(n)?t:n}var nn=c(Re);function Oe(e,n,t){if(e<0||n<0)throw new Error("Rambda.move does not support negative indexes");if(e>t.length-1||n>t.length-1)return t;let r=A(t);return r[e]=t[n],r[n]=t[e],r}var tn=c(Oe);function Q(e,n){return arguments.length===1?t=>Q(e,t):e*n}var Y=e=>({x:e,map:n=>Y(n(e))});function Ae(e,n,t){return e(r=>Y(n(r)))(t).x}var _e=c(Ae);function be(e,n,t){return v(q(e,t),n)}var rn=c(be);function Ie(e,n,t){return S(e,q(n,t))}var un=c(Ie);var sn=me(Q,1);function je(e,n,t){return t?t[e]===n:!1}var fn=c(je);function He(e,n,t){return M(e,t[n])}var on=c(He);function Se(e,n,t){return t?S(e,t[n]):e}var ln=c(Se);function qe(e,n,t){return t.replace(e,n)}var cn=c(qe);function $e(e,n,t){return _e(e,ae(n),t)}var an=c($e);function ze(e,n,t){return t.slice(e,n)}var hn=c(ze);function K(e,n){return arguments.length===1?t=>K(e,t):e<0?n.slice():typeof n=="string"?n.slice(0,e):Ee(n,0,e)}function We(e,n,t){return e(t)?n(t):t}var dn=c(We);function Te(e,n,t){return K(n.length>t.length?t.length:n.length,n).map((r,u)=>e(r,t[u]))}var gn=c(Te);var Ce=async e=>{try{let n=await Promise.resolve(e());if("expected"in n)return ee(n);if("throws"in n){try{n.assert()}catch(r){return ee({actual:r,expected:n.throws})}return ne(void 0,n.throws)}throw`Bad keys: ${Object.keys(n).join(", ")}`}catch(n){return{kind:"fail",reason:{kind:"threw-exn",error:`${n}`}}}},ee=({actual:e,expected:n})=>v(e,n)?{kind:"pass"}:ne(e,n),ne=(e,n)=>{let t=(()=>e===void 0&&n===void 0?[]:e===void 0||n===void 0?[{kind:"actual",value:e},{kind:"expected",value:n}]:D(e,n).map(({added:r,removed:u,value:i})=>u?{kind:"actual",value:i}:r?{kind:"expected",value:i}:{kind:"same",value:i}))();return{kind:"fail",reason:{kind:"not-equal",changes:t}}},$=async e=>{let n={passes:0,fails:0,children:{}};for(let[t,r]of Object.entries(e))if(Ue(r)){let u=await Ce(r),[i,l]=te(u);n.passes+=i,n.fails+=l,n.children[t]=u}else{let u=await $(r),[i,l]=Be(u.children);n.passes+=i,n.fails+=l,n.children[t]=u}return n},Be=e=>Object.values(e).reduce(([n,t],r)=>{let[u,i]="kind"in r?te(r):[r.passes,r.fails];return[n+u,t+i]},[0,0]),te=e=>e.kind=="pass"?[1,0]:[0,1],Ue=e=>typeof e=="function";var Nn=async(e,n)=>{let t=await $(n);return e.appendChild(C(t))};export{Nn as default};
