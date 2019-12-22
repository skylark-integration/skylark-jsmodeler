/**
 * skylark-jsmodeler - A version of jsmodeler that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-jsmodeler/
 * @license MIT
 */
define(["../core/jsm"],function(t){return t.Model=function(){this.bodies=[],this.materials=new t.MaterialSet},t.Model.prototype.AddBody=function(t){return this.bodies.push(t),this.bodies.length-1},t.Model.prototype.AddBodies=function(t){var e,o;for(e=0;e<t.length;e++)o=t[e],this.AddBody(o)},t.Model.prototype.GetBody=function(t){return this.bodies[t]},t.Model.prototype.BodyCount=function(){return this.bodies.length},t.Model.prototype.AddMaterial=function(t){return this.materials.AddMaterial(t)},t.Model.prototype.GetMaterial=function(t){return this.materials.GetMaterial(t)},t.Model.prototype.GetDefaultMaterial=function(){return this.materials.GetDefaultMaterial()},t.Model.prototype.GetMaterialSet=function(){return this.materials},t.Model.prototype.MaterialCount=function(){return this.materials.Count()},t.Model.prototype.VertexCount=function(){var t,e=0;for(t=0;t<this.bodies.length;t++)e+=this.bodies[t].VertexCount();return e},t.Model.prototype.PolygonCount=function(){var t,e=0;for(t=0;t<this.bodies.length;t++)e+=this.bodies[t].PolygonCount();return e},t});
//# sourceMappingURL=../sourcemaps/modeler/model.js.map
