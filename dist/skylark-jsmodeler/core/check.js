/**
 * skylark-jsmodeler - A version of jsmodeler that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-jsmodeler/
 * @license MIT
 */
define(["./jsm"],function(e){return e.IsWebGLEnabled=function(){if(!window.WebGLRenderingContext)return!1;try{var e=document.createElement("canvas");if(!e.getContext("experimental-webgl")&&!e.getContext("webgl"))return!1}catch(e){return!1}return!0},e.IsFileApiEnabled=function(){return!!(window.File&&window.FileReader&&window.FileList&&window.Blob&&window.URL)},e});
//# sourceMappingURL=../sourcemaps/core/check.js.map
