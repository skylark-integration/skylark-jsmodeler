/**
 * skylark-jsmodeler - A version of jsmodeler that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-jsmodeler/
 * @license MIT
 */
define(["./jsm"],function(n){return n.AsyncRunTask=function(n,o,i,t,u){var s;if(void 0!==o&&null!==o)!function(n,o,i){void 0!==i.onStart&&null!==i.onStart&&i.onStart(n,o)}(i,u,o),function o(u,s,r){var e=n();!function(n,o,i){void 0!==i.onProgress&&null!==i.onProgress&&i.onProgress(n,o)}(u,s,r),e&&u<i-1?setTimeout(function(){o(u+1,s,r)},t):setTimeout(function(){!function(n,o){void 0!==o.onFinish&&null!==o.onFinish&&o.onFinish(n)}(s,r)},t)}(0,u,o);else for(s=0;s<i&&n();s++);},n});
//# sourceMappingURL=../sourcemaps/core/async.js.map
