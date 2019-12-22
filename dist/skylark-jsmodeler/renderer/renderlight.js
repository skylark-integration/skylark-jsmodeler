/**
 * skylark-jsmodeler - A version of jsmodeler that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-jsmodeler/
 * @license MIT
 */
define(["../core/jsm"],function(o){return o.RenderAmbientLight=function(e){this.color=o.HexColorToNormalizedRGBComponents(e)},o.RenderDirectionalLight=function(e,n,i){this.diffuse=o.HexColorToNormalizedRGBComponents(e),this.specular=o.HexColorToNormalizedRGBComponents(n),this.direction=i.Clone()},o});
//# sourceMappingURL=../sourcemaps/renderer/renderlight.js.map
