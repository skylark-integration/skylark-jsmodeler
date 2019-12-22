/**
 * skylark-jsmodeler - A version of jsmodeler that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-jsmodeler/
 * @license MIT
 */
define([],function(){var n=function(){this.mainVersion=0,this.subVersion=45};return n.RandomNumber=function(n,o){return Math.random()*(o-n)+n},n.RandomInt=function(n,o){return Math.floor(Math.random()*(o-n+1)+n)},n.RandomBoolean=function(){return 1===n.RandomInt(0,1)},n.SeededRandomInt=function(n,o,r){var t=(9301*r+49297)%233280/233280;return Math.floor(t*(o-n+1)+n)},n.ValueOrDefault=function(n,o){return void 0===n||null===n?o:n},n.PrevIndex=function(n,o){return n>0?n-1:o-1},n.NextIndex=function(n,o){return n<o-1?n+1:0},n.CopyObjectProperties=function(n,o,r){var t;if(void 0!==n&&null!==n&&void 0!==o&&null!==o)for(t in n)n.hasOwnProperty(t)&&(r||void 0===o[t]||null===o[t])&&(o[t]=n[t])},n.GetObjectProperty=function(n,o,r){if(void 0===n||null===n)return r;var t=n[o];return void 0===t||null===t?r:t},n.Message=function(n){console.log("JSModeler: "+n)},n});
//# sourceMappingURL=../sourcemaps/core/jsm.js.map
