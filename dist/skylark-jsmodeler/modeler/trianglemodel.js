/**
 * skylark-jsmodeler - A version of jsmodeler that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-jsmodeler/
 * @license MIT
 */
define(["../core/jsm"],function(e){return e.TriangleModel=function(){this.materials=[],this.bodies=[],this.defaultMaterial=-1},e.TriangleModel.prototype.AddMaterial=function(e){return this.materials.push(e),this.materials.length-1},e.TriangleModel.prototype.GetMaterial=function(e){return this.materials[e]},e.TriangleModel.prototype.AddDefaultMaterial=function(){return-1==this.defaultMaterial&&(this.defaultMaterial=this.AddMaterial({})),this.defaultMaterial},e.TriangleModel.prototype.GetDefaultMaterialIndex=function(){return this.AddDefaultMaterial()},e.TriangleModel.prototype.MaterialCount=function(){return this.materials.length},e.TriangleModel.prototype.AddBody=function(e){return this.bodies.push(e),this.bodies.length-1},e.TriangleModel.prototype.AddBodyToIndex=function(e,t){return this.bodies.splice(t,0,e),t},e.TriangleModel.prototype.GetBody=function(e){return this.bodies[e]},e.TriangleModel.prototype.VertexCount=function(){var e,t=0;for(e=0;e<this.bodies.length;e++)t+=this.bodies[e].VertexCount();return t},e.TriangleModel.prototype.TriangleCount=function(){var e,t=0;for(e=0;e<this.bodies.length;e++)t+=this.bodies[e].TriangleCount();return t},e.TriangleModel.prototype.BodyCount=function(){return this.bodies.length},e.TriangleModel.prototype.FinalizeMaterials=function(){var t,i,o={name:"Default",ambient:[.5,.5,.5],diffuse:[.5,.5,.5],specular:[.1,.1,.1],shininess:0,opacity:1,reflection:0,texture:null,offset:null,scale:null,rotation:null};for(t=0;t<this.materials.length;t++)i=this.materials[t],e.CopyObjectProperties(o,i,!1)},e.TriangleModel.prototype.FinalizeBodies=function(){var e;for(e=0;e<this.bodies.length;e++)this.bodies[e].Finalize(this)},e.TriangleModel.prototype.Finalize=function(){this.FinalizeBodies(),this.FinalizeMaterials()},e});
//# sourceMappingURL=../sourcemaps/modeler/trianglemodel.js.map