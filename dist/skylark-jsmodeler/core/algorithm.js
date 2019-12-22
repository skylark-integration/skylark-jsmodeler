/**
 * skylark-jsmodeler - A version of jsmodeler that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-jsmodeler/
 * @license MIT
 */
define(["./jsm"],function(r){return r.SwapArrayValues=function(r,n,t){var u=r[n];r[n]=r[t],r[t]=u},r.BubbleSort=function(n,t,u){if(n.length<2)return!1;var f=t;if(void 0===f||null===f)return!1;var e,i,a=u;for(void 0!==a&&null!==a||(a=function(t,u){r.SwapArrayValues(n,t,u)}),e=0;e<n.length-1;e++)for(i=0;i<n.length-e-1;i++)f(n[i],n[i+1])||a(i,i+1);return!0},r.ShiftArray=function(r,n){var t;for(t=0;t<n;t++)r.push(r.shift())},r});
//# sourceMappingURL=../sourcemaps/core/algorithm.js.map
