/**
 * skylark-jsmodeler - A version of jsmodeler that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-jsmodeler/
 * @license MIT
 */
define(["../core/jsm"],function(t){return t.MaterialSet=function(){this.materials=[],this.defaultMaterial=new t.Material},t.MaterialSet.prototype.AddMaterial=function(t){return this.materials.push(t),this.materials.length-1},t.MaterialSet.prototype.GetMaterial=function(t){return t<0||t>=this.materials.length?this.defaultMaterial:this.materials[t]},t.MaterialSet.prototype.GetDefaultMaterial=function(){return this.defaultMaterial},t.MaterialSet.prototype.Count=function(){return this.materials.length},t});
//# sourceMappingURL=../sourcemaps/modeler/materialset.js.map
