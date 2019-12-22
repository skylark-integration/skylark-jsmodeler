/**
 * skylark-jsmodeler - A version of jsmodeler that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-jsmodeler/
 * @license MIT
 */
define(["../core/jsm"],function(n){return n.HexColorToRGBComponents=function(n){for(var o=n.toString(16);o.length<6;)o="0"+o;return[parseInt(o.substr(0,2),16),parseInt(o.substr(2,2),16),parseInt(o.substr(4,2),16)]},n.HexColorToNormalizedRGBComponents=function(o){var r=n.HexColorToRGBComponents(o);return[r[0]/255,r[1]/255,r[2]/255]},n.HexColorToRGBColor=function(n){return parseInt("0x"+n,16)},n.RGBComponentsToHexColor=function(n,o,r){function t(n){for(var o=parseInt(n,10).toString(16);o.length<2;)o="0"+o;return o}var e=t(n),s=t(o),u=t(r);return parseInt("0x"+e+s+u,16)},n});
//# sourceMappingURL=../sourcemaps/modeler/color.js.map
