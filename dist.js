var J=({fails:n,passes:e,children:t})=>{let r=n==0?"\u2713":`\u2716${n}`;document.title=`dmt ${r}`;let u=document.createDocumentFragment(),i=document.createElement("style");i.textContent=`
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
	`,u.append(i);for(let[s,o]of Object.entries(t))u.appendChild(D(s,o));return u},p=(n,e,t=[])=>{let r=document.createElement(n);return Object.assign(r,e),Array.isArray(t)?r.append(...t):r.append(t),r},k=n=>p("span",{innerText:n,className:"success"}),R=n=>p("span",{innerText:n,className:"fail"}),b=(n=[])=>p("div",{className:"result"},n),U=(n,e,t)=>t==0?"":p("span",{className:n},[e,p("small",{},p("sub",{},t.toString()))]),I=(n,e)=>p("span",{className:"description"},[n,e]),oe=(n,{reason:e})=>{switch(e.kind){case"not-equal":{let t=e.changes.map(({kind:r,value:u})=>{switch(r){case"expected":return R(u);case"actual":return k(u);case"same":return u}});return b([I(n,R("\u2716")),p("pre",{className:"diff"},t)])}case"threw-exn":return b([I(n,R("\u2716")),p("pre",{},R(e.error))])}},le=n=>b(p("span",{},I(n,k("\u2713")))),ce=n=>e=>{switch(n.kind){case"pass":return le(e);case"fail":return oe(e,n)}},D=(n,e)=>("kind"in e?ce(e):ae(e))(n),ae=({fails:n,passes:e,children:t})=>r=>{let u=Object.entries(t).map(i=>D(...i));return p("details",{open:n!=0},[p("summary",{},[p("b",{},r),U("success","\u2713",e),U("fail","\u2716",n)]),...u])};function y(){}y.prototype={diff:function(e,t){var r=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{},u=r.callback;typeof r=="function"&&(u=r,r={}),this.options=r;var i=this;function s(a){return u?(setTimeout(function(){u(void 0,a)},0),!0):a}e=this.castInput(e),t=this.castInput(t),e=this.removeEmpty(this.tokenize(e)),t=this.removeEmpty(this.tokenize(t));var o=t.length,l=e.length,f=1,d=o+l,h=[{newPos:-1,components:[]}],g=this.extractCommon(h[0],t,e,0);if(h[0].newPos+1>=o&&g+1>=l)return s([{value:this.join(t),count:t.length}]);function m(){for(var a=-1*f;a<=f;a+=2){var w=void 0,N=h[a-1],E=h[a+1],x=(E?E.newPos:0)-a;N&&(h[a-1]=void 0);var T=N&&N.newPos+1<o,B=E&&0<=x&&x<l;if(!T&&!B){h[a]=void 0;continue}if(!T||B&&N.newPos<E.newPos?(w=de(E),i.pushComponent(w.components,void 0,!0)):(w=N,w.newPos++,i.pushComponent(w.components,!0,void 0)),x=i.extractCommon(w,t,e,a),w.newPos+1>=o&&x+1>=l)return s(he(i,w.components,t,e,i.useLongestToken));h[a]=w}f++}if(u)(function a(){setTimeout(function(){if(f>d)return u();m()||a()},0)})();else for(;f<=d;){var F=m();if(F)return F}},pushComponent:function(e,t,r){var u=e[e.length-1];u&&u.added===t&&u.removed===r?e[e.length-1]={count:u.count+1,added:t,removed:r}:e.push({count:1,added:t,removed:r})},extractCommon:function(e,t,r,u){for(var i=t.length,s=r.length,o=e.newPos,l=o-u,f=0;o+1<i&&l+1<s&&this.equals(t[o+1],r[l+1]);)o++,l++,f++;return f&&e.components.push({count:f}),e.newPos=o,l},equals:function(e,t){return this.options.comparator?this.options.comparator(e,t):e===t||this.options.ignoreCase&&e.toLowerCase()===t.toLowerCase()},removeEmpty:function(e){for(var t=[],r=0;r<e.length;r++)e[r]&&t.push(e[r]);return t},castInput:function(e){return e},tokenize:function(e){return e.split("")},join:function(e){return e.join("")}};function he(n,e,t,r,u){for(var i=0,s=e.length,o=0,l=0;i<s;i++){var f=e[i];if(f.removed){if(f.value=n.join(r.slice(l,l+f.count)),l+=f.count,i&&e[i-1].added){var h=e[i-1];e[i-1]=e[i],e[i]=h}}else{if(!f.added&&u){var d=t.slice(o,o+f.count);d=d.map(function(m,F){var a=r[l+F];return a.length>m.length?a:m}),f.value=n.join(d)}else f.value=n.join(t.slice(o,o+f.count));o+=f.count,f.added||(l+=f.count)}}var g=e[s-1];return s>1&&typeof g.value=="string"&&(g.added||g.removed)&&n.equals("",g.value)&&(e[s-2].value+=g.value,e.pop()),e}function de(n){return{newPos:n.newPos,components:n.components.slice(0)}}var Me=new y;var V=/^[A-Za-z\xC0-\u02C6\u02C8-\u02D7\u02DE-\u02FF\u1E00-\u1EFF]+$/,P=/\S/,X=new y;X.equals=function(n,e){return this.options.ignoreCase&&(n=n.toLowerCase(),e=e.toLowerCase()),n===e||this.options.ignoreWhitespace&&!P.test(n)&&!P.test(e)};X.tokenize=function(n){for(var e=n.split(/([^\S\r\n]+|[()[\]{}'"\r\n]|\b)/),t=0;t<e.length-1;t++)!e[t+1]&&e[t+2]&&V.test(e[t])&&V.test(e[t+2])&&(e[t]+=e[t+2],e.splice(t+1,2),t--);return e};var Z=new y;Z.tokenize=function(n){var e=[],t=n.split(/(\n|\r\n)/);t[t.length-1]||t.pop();for(var r=0;r<t.length;r++){var u=t[r];r%2&&!this.options.newlineIsToken?e[e.length-1]+=u:(this.options.ignoreWhitespace&&(u=u.trim()),e.push(u))}return e};var ge=new y;ge.tokenize=function(n){return n.split(/(\S.+?[.!?])(?=\s+|$)/)};var pe=new y;pe.tokenize=function(n){return n.split(/([{}:;,]|\s+)/)};function O(n){return typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?O=function(e){return typeof e}:O=function(e){return e&&typeof Symbol=="function"&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},O(n)}var me=Object.prototype.toString,L=new y;L.useLongestToken=!0;L.tokenize=Z.tokenize;L.castInput=function(n){var e=this.options,t=e.undefinedReplacement,r=e.stringifyReplacer,u=r===void 0?function(i,s){return typeof s>"u"?t:s}:r;return typeof n=="string"?n:JSON.stringify(j(n,null,null,u),u,"  ")};L.equals=function(n,e){return y.prototype.equals.call(L,n.replace(/,([\r\n])/g,"$1"),e.replace(/,([\r\n])/g,"$1"))};function G(n,e,t){return L.diff(n,e,t)}function j(n,e,t,r,u){e=e||[],t=t||[],r&&(n=r(u,n));var i;for(i=0;i<e.length;i+=1)if(e[i]===n)return t[i];var s;if(me.call(n)==="[object Array]"){for(e.push(n),s=new Array(n.length),t.push(s),i=0;i<n.length;i+=1)s[i]=j(n[i],e,t,r,u);return e.pop(),t.pop(),s}if(n&&n.toJSON&&(n=n.toJSON()),O(n)==="object"&&n!==null){e.push(n),s={},t.push(s);var o=[],l;for(l in n)n.hasOwnProperty(l)&&o.push(l);for(o.sort(),i=0;i<o.length;i+=1)l=o[i],s[l]=j(n[l],e,t,r,l);e.pop(),t.pop()}else s=n;return s}var H=new y;H.tokenize=function(n){return n.slice()};H.join=H.removeEmpty=function(n){return n};function c(n,e=[]){return(...t)=>(r=>r.length>=n.length?n(...r):c(n,r))([...e,...t])}var _=n=>Array.prototype.slice.call(n);function we(n,e,t){let r=n<0?t.length+n:n;if(n>=t.length||r<0)return t;let u=_(t);return u[r]=e(u[r]),u}var Ye=c(we);function ye(n){return()=>n}var $=Array.isArray;function ve(n,e,t){return Object.assign({},t,{[n]:e})}var Le=c(ve);function A(n){return n<<0===n}var Ke=Number.isInteger||A;function ee(n,e,t){let r=typeof n=="string"?n.split(".").map(i=>A(Number(i))?Number(i):i):n;if(r.length===0)return e;let u=r[0];if(r.length>1){let s=typeof t!="object"||t===null||!t.hasOwnProperty(u)?A(r[1])?[]:{}:t[u];e=ee(Array.prototype.slice.call(r,1),e,s)}if(A(u)&&$(t)){let i=_(t);return i[u]=e,i}return Le(u,e,t)}var en=c(ee);function Ne(n,e,t){if(n>e)throw new Error("min must not be greater than max in clamp(min, max, value)");if(t>=n&&t<=e)return t;if(t>e)return e;if(t<n)return n}var nn=c(Ne);function Ee(n,e,t){if(!$(t))throw new TypeError("reduce: list must be array or iterable");let r=0,u=t.length;for(;r<u;)e=n(e,t[r],r,t),r++;return e}var Fe=c(Ee);function xe(n){return n==null||Number.isNaN(n)===!0}function z(n,e){return arguments.length===1?t=>z(n,t):xe(e)?n:e}function S(n){if(n===null)return"Null";if(n===void 0)return"Undefined";if(Number.isNaN(n))return"NaN";let e=Object.prototype.toString.call(n).slice(8,-1);return e==="AsyncFunction"?"Async":e}function Re(n,e){if(!$(e))throw new Error(`Cannot read property 'indexOf' of ${e}`);let t=S(n);if(!["Object","Array","NaN","RegExp"].includes(t))return e.indexOf(n);let r=-1,u=-1,{length:i}=e;for(;++r<i&&u===-1;)v(e[r],n)&&(u=r);return u}function M(n){let e=[],t;for(;!(t=n.next()).done;)e.push(t.value);return e}function Oe(n,e){if(n.size!==e.size)return!1;let t=M(n.values()),r=M(e.values());return t.filter(i=>Re(i,r)===-1).length===0}function Q(n){let e=n.__proto__.toString();return["Error","TypeError"].includes(e)?[e,n.message]:[]}function Y(n){return n.toDateString?[!0,n.getTime()]:[!1]}function K(n){return n.constructor!==RegExp?[!1]:[!0,n.toString()]}function v(n,e){if(arguments.length===1)return f=>v(n,f);let t=S(n);if(t!==S(e))return!1;if(t==="Function")return n.name===void 0?!1:n.name===e.name;if(["NaN","Undefined","Null"].includes(t))return!0;if(t==="Number")return Object.is(-0,n)!==Object.is(-0,e)?!1:n.toString()===e.toString();if(["String","Boolean"].includes(t))return n.toString()===e.toString();if(t==="Array"){let f=Array.from(n),d=Array.from(e);if(f.toString()!==d.toString())return!1;let h=!0;return f.forEach((g,m)=>{h&&g!==d[m]&&!v(g,d[m])&&(h=!1)}),h}let r=K(n),u=K(e);if(r[0])return u[0]?r[1]===u[1]:!1;if(u[0])return!1;let i=Y(n),s=Y(e);if(i[0])return s[0]?i[1]===s[1]:!1;if(s[0])return!1;let o=Q(n),l=Q(e);if(o[0])return l[0]?o[0]===l[0]&&o[1]===l[1]:!1;if(t==="Set")return Oe(n,e);if(t==="Object"){let f=Object.keys(n);if(f.length!==Object.keys(e).length)return!1;let d=!0;return f.forEach(h=>{if(d){let g=n[h],m=e[h];g!==m&&!v(g,m)&&(d=!1)}}),d}return!1}function q(n,e){if(arguments.length===1)return t=>q(n,t);if(!!e)return e[n]}function Ae(n,e,t){return v(q(n,e),q(n,t))}var tn=c(Ae);function W(n,e){if(arguments.length===1)return i=>W(n,i);if(e==null)return;let t=e,r=0,u=typeof n=="string"?n.split("."):n;for(;r<u.length;){if(t==null||t[u[r]]===null)return;t=t[u[r]],r++}return t}function _e(n,e,t){return(...r)=>(typeof n=="boolean"?n:n(...r))===!0?e(...r):t(...r)}var rn=c(_e);function be(n,e,t){let r=-1,{length:u}=n;t=t>u?u:t,t<0&&(t+=u),u=e>t?0:t-e>>>0,e>>>=0;let i=Array(u);for(;++r<u;)i[r]=n[r+e];return i}function ne(n,e){return arguments.length===1?t=>ne(n,t):e!=null&&e.constructor===n||e instanceof n}function Ie(n,e,t){let r=_(t);return n===-1?r.fill(e,n):r.fill(e,n,n+1)}var un=c(Ie);function je(n,e,t){return n(t)>n(e)?t:e}var sn=c(je);function He(n,e,t){return n(t)<n(e)?t:e}var fn=c(He);function Se(n,e,t){if(n<0||e<0)throw new Error("Rambda.move does not support negative indexes");if(n>t.length-1||e>t.length-1)return t;let r=_(t);return r[n]=t[e],r[e]=t[n],r}var on=c(Se);function te(n,e){return arguments.length===1?t=>te(n,t):n*e}var re=n=>({x:n,map:e=>re(e(n))});function qe(n,e,t){return n(r=>re(e(r)))(t).x}var $e=c(qe);function ze(n,e,t){return v(W(n,t),e)}var ln=c(ze);function We(n,e,t){return z(n,W(e,t))}var cn=c(We);var an=Fe(te,1);function Ce(n,e,t){return t?t[n]===e:!1}var hn=c(Ce);function Te(n,e,t){return ne(n,t[e])}var dn=c(Te);function Be(n,e,t){return t?z(n,t[e]):n}var gn=c(Be);function Ue(n,e,t){return t.replace(n,e)}var pn=c(Ue);function Je(n,e,t){return $e(n,ye(e),t)}var mn=c(Je);function ke(n,e,t){return t.slice(n,e)}var wn=c(ke);function ue(n,e){return arguments.length===1?t=>ue(n,t):n<0?e.slice():typeof e=="string"?e.slice(0,n):be(e,0,n)}function De(n,e,t){return n(t)?e(t):t}var yn=c(De);function Ve(n,e,t){return ue(e.length>t.length?t.length:e.length,e).map((r,u)=>n(r,t[u]))}var vn=c(Ve);var Pe=async n=>{try{let e=await Promise.resolve(n());if("expected"in e)return ie(e);if("throws"in e){try{e.assert()}catch(r){return ie({actual:r,expected:e.throws})}return se(void 0,e.throws)}throw`Unable to evaluate assertion with fields ${Object.keys(e)}`}catch(e){return{kind:"fail",reason:{kind:"threw-exn",error:`${e}`}}}},ie=({actual:n,expected:e})=>v(n,e)?{kind:"pass"}:se(n,e),se=(n,e)=>{let t=(()=>n===void 0&&e===void 0?[]:n===void 0||e===void 0?[{kind:"actual",value:n},{kind:"expected",value:e}]:G(n,e).map(({added:r,removed:u,value:i})=>u?{kind:"actual",value:i}:r?{kind:"expected",value:i}:{kind:"same",value:i}))();return{kind:"fail",reason:{kind:"not-equal",changes:t}}},C=async n=>{let e={passes:0,fails:0,children:{}};for(let[t,r]of Object.entries(n))if(Ze(r)){let u=await Pe(r),[i,s]=fe(u);e.passes+=i,e.fails+=s,e.children[t]=u}else{let u=await C(r),[i,s]=Xe(u.children);e.passes+=i,e.fails+=s,e.children[t]=u}return e},Xe=n=>Object.values(n).reduce(([e,t],r)=>{let[u,i]="kind"in r?fe(r):[r.passes,r.fails];return[e+u,t+i]},[0,0]),fe=n=>n.kind=="pass"?[1,0]:[0,1],Ze=n=>typeof n=="function";var On=async(n,e)=>{let t=await C(e);return n.appendChild(J(t))};export{On as default,C as evalTestSuite};
