/**
 * skylark-jsmodeler - A version of jsmodeler that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-jsmodeler/
 * @license MIT
 */
define(["../core/jsm"],function(r){return r.RenderMesh=function(r){this.material=r,this.vertexArray=null,this.normalArray=null,this.uvArray=null,this.vertexBuffer=null,this.normalBuffer=null,this.uvBuffer=null},r.RenderMesh.prototype.SetMaterial=function(r){this.material=r},r.RenderMesh.prototype.GetMaterial=function(){return this.material},r.RenderMesh.prototype.SetVertexArray=function(r){this.vertexArray=new Float32Array(r)},r.RenderMesh.prototype.SetNormalArray=function(r){this.normalArray=new Float32Array(r)},r.RenderMesh.prototype.SetUVArray=function(r){this.uvArray=new Float32Array(r)},r.RenderMesh.prototype.HasVertexArray=function(){return null!==this.vertexArray},r.RenderMesh.prototype.HasNormalArray=function(){return null!==this.normalArray},r.RenderMesh.prototype.HasUVArray=function(){return null!==this.uvArray},r.RenderMesh.prototype.GetVertexArray=function(){return this.vertexArray},r.RenderMesh.prototype.GetNormalArray=function(){return this.normalArray},r.RenderMesh.prototype.GetUVArray=function(){return this.uvArray},r.RenderMesh.prototype.SetBuffers=function(r,e,t){this.vertexBuffer=r,this.normalBuffer=e,this.uvBuffer=t},r.RenderMesh.prototype.GetVertexBuffer=function(){return this.vertexBuffer},r.RenderMesh.prototype.GetNormalBuffer=function(){return this.normalBuffer},r.RenderMesh.prototype.GetUVBuffer=function(){return this.uvBuffer},r.RenderMesh.prototype.VertexCount=function(){return parseInt(this.vertexArray.length/3,10)},r.RenderMesh.prototype.NormalCount=function(){return parseInt(this.normalArray.length/3,10)},r.RenderMesh.prototype.UVCount=function(){return parseInt(this.uvArray.length/2,10)},r.RenderMesh.prototype.GetVertex=function(e){return new r.Coord(this.vertexArray[3*e],this.vertexArray[3*e+1],this.vertexArray[3*e+2])},r.RenderMesh.prototype.GetTransformedVertex=function(r,e){var t=this.GetVertex(r);return e.Apply(t)},r});
//# sourceMappingURL=../sourcemaps/renderer/rendermesh.js.map
