/**
 * skylark-jsmodeler - A version of jsmodeler that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-jsmodeler/
 * @license MIT
 */
define(["./jsm"],function(e){return e.LoadJsonFile=function(e,n){var t=new XMLHttpRequest;t.overrideMimeType("application/json"),t.open("GET",e,!0),t.onreadystatechange=function(){if(4==t.readyState){var e=JSON.parse(t.responseText);n(e)}},t.send(null)},e});
//# sourceMappingURL=../sourcemaps/core/jsonloader.js.map
