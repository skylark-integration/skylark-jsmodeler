/**
 * skylark-jsmodeler - A version of jsmodeler that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-jsmodeler/
 * @license MIT
 */
define(["../core/jsm"],function(e){return e.RenderBody=function(){this.transformation=new e.Transformation,this.meshes={}},e.RenderBody.prototype.AddMesh=function(e){void 0===this.meshes[e.material.type]&&(this.meshes[e.material.type]=[]),this.meshes[e.material.type].push(e)},e.RenderBody.prototype.EnumerateMeshes=function(e){var t;for(t in this.meshes)this.meshes.hasOwnProperty(t)&&this.EnumerateTypedMeshes(t,e)},e.RenderBody.prototype.HasTypedMeshes=function(e){return void 0!==this.meshes[e]},e.RenderBody.prototype.EnumerateTypedMeshes=function(e,t){if(this.HasTypedMeshes(e)){var n,s=this.meshes[e];for(n=0;n<s.length;n++)t(s[n])}},e.RenderBody.prototype.EnumerateMeshesWithFlag=function(e,t){var n;for(n in this.meshes)this.meshes.hasOwnProperty(n)&&n&e&&this.EnumerateTypedMeshes(n,t)},e.RenderBody.prototype.GetTransformation=function(){return this.transformation},e.RenderBody.prototype.GetTransformationMatrix=function(){return this.transformation.matrix},e.RenderBody.prototype.SetTransformation=function(e){this.transformation=e},e.RenderBody.prototype.AppendTransformation=function(e){this.transformation.Append(e)},e});
//# sourceMappingURL=../sourcemaps/renderer/renderbody.js.map
