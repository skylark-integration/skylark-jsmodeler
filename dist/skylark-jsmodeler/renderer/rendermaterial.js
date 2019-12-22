/**
 * skylark-jsmodeler - A version of jsmodeler that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-jsmodeler/
 * @license MIT
 */
define(["../core/jsm"],function(e){return e.RenderMaterialFlags={Point:1,Line:2,Triangle:4,Textured:8,Transparent:16},e.RenderMaterial=function(t,i){this.type=t,this.ambient=[0,.8,0],this.diffuse=[0,.8,0],this.specular=[0,0,0],this.shininess=0,this.opacity=1,this.reflection=0,this.singleSided=!1,this.pointSize=.1,this.texture=null,e.CopyObjectProperties(i,this,!0)},e.RenderMaterial.prototype.SetType=function(e){this.type=e},e.RenderMaterial.prototype.SetBuffers=function(e,t){this.textureBuffer=e,this.textureImage=t},e});
//# sourceMappingURL=../sourcemaps/renderer/rendermaterial.js.map
