/**
 * skylark-jsmodeler - A version of jsmodeler that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-jsmodeler/
 * @license MIT
 */
define(["../core/jsm"],function(r){return r.GetArrayBufferFromURL=function(r,e){var n=new XMLHttpRequest;n.open("GET",r,!0),n.responseType="arraybuffer",n.onload=function(){var r=n.response;r&&e.onReady&&e.onReady(r)},n.onerror=function(){e.onError&&e.onError()},n.send(null)},r.GetArrayBufferFromFile=function(r,e){var n=new FileReader;n.onloadend=function(r){r.target.readyState==FileReader.DONE&&e.onReady&&e.onReady(r.target.result)},n.onerror=function(){e.onError&&e.onError()},n.readAsArrayBuffer(r)},r.GetStringBufferFromURL=function(r,e){var n=new XMLHttpRequest;n.open("GET",r,!0),n.responseType="text",n.onload=function(){var r=n.response;r&&e.onReady&&e.onReady(r)},n.onerror=function(){e.onError&&e.onError()},n.send(null)},r.GetStringBufferFromFile=function(r,e){var n=new FileReader;n.onloadend=function(r){r.target.readyState==FileReader.DONE&&e.onReady&&e.onReady(r.target.result)},n.onerror=function(){e.onError&&e.onError()},n.readAsText(r)},r.LoadMultipleBuffers=function(e,n){!function e(n,o,t,f){if(o>=n.length)f(t);else{var a=n[o];(a.isFile?a.isArrayBuffer?r.GetArrayBufferFromFile:r.GetStringBufferFromFile:a.isArrayBuffer?r.GetArrayBufferFromURL:r.GetStringBufferFromURL)(a.originalObject,{onReady:function(r){t.push(r),e(n,o+1,t,f)},onError:function(){t.push(null),e(n,o+1,t,f)}})}}(e,0,[],function(r){n(r)})},r});
//# sourceMappingURL=../sourcemaps/import/importerutils.js.map
