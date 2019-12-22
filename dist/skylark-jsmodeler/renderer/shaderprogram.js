/**
 * skylark-jsmodeler - A version of jsmodeler that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-jsmodeler/
 * @license MIT
 */
define(["../core/jsm"],function(e){return e.ShaderType={Point:0,Line:1,Triangle:2,TexturedTriangle:3},e.ShaderProgram=function(e){this.context=e,this.globalParams=null,this.shaders=null,this.currentShader=null,this.currentType=null,this.cullEnabled=null},e.ShaderProgram.prototype.Init=function(){return!!this.InitGlobalParams()&&!!this.InitShaders()},e.ShaderProgram.prototype.GetMaxLightCount=function(){return this.globalParams.maxLightCount},e.ShaderProgram.prototype.InitGlobalParams=function(){var t=new e.RenderDirectionalLight(0,0,new e.Vector(0,0,0));return this.globalParams={noDirectionalLight:t,maxLightCount:4},!0},e.ShaderProgram.prototype.InitShaders=function(){function t(t,i,r,o){var n=function(t){var i=null;return t==e.ShaderType.Triangle||t==e.ShaderType.TexturedTriangle?i=["#define "+(t==e.ShaderType.Triangle?"NOTEXTURE":"USETEXTURE"),"attribute mediump vec3 aVertexPosition;","attribute mediump vec3 aVertexNormal;","uniform mediump mat4 uViewMatrix;","uniform mediump mat4 uProjectionMatrix;","uniform mediump mat4 uTransformationMatrix;","varying mediump vec3 vVertex;","varying mediump vec3 vNormal;","#ifdef USETEXTURE","attribute mediump vec2 aVertexUV;","varying mediump vec2 vUV;","#endif","void main (void) {","\tmat4 modelViewMatrix = uViewMatrix * uTransformationMatrix;","\tvVertex = vec3 (modelViewMatrix * vec4 (aVertexPosition, 1.0));","\tvNormal = normalize (vec3 (modelViewMatrix * vec4 (aVertexNormal, 0.0)));","#ifdef USETEXTURE","\tvUV = aVertexUV;","#endif","\tgl_Position = uProjectionMatrix * vec4 (vVertex, 1.0);","}"].join("\n"):t!=e.ShaderType.Point&&t!=e.ShaderType.Line||(i=["#define "+(t==e.ShaderType.Point?"POINT":"LINE"),"attribute mediump vec3 aVertexPosition;","uniform mediump mat4 uViewMatrix;","uniform mediump mat4 uProjectionMatrix;","uniform mediump mat4 uTransformationMatrix;","#ifdef POINT","uniform mediump float uPointSize;","#endif","varying mediump vec3 vVertex;","void main (void) {","\tmat4 modelViewMatrix = uViewMatrix * uTransformationMatrix;","\tvVertex = vec3 (modelViewMatrix * vec4 (aVertexPosition, 1.0));","#ifdef POINT","\tconst mediump float scale = 200.0;","\tgl_PointSize = uPointSize * (scale / length (vVertex));","#endif","\tgl_Position = uProjectionMatrix * vec4 (vVertex, 1.0);","}"].join("\n")),i}(o),a=function(t,i){var r=null;return t==e.ShaderType.Point||t==e.ShaderType.Line?r=["#define MAX_LIGHTS "+i.maxLightCount,"struct Light","{","\tmediump vec3 diffuseColor;","};","struct Material","{","\tmediump vec3 ambientColor;","\tmediump vec3 diffuseColor;","};","uniform mediump vec3 uAmbientLightColor;","uniform Light uLights[MAX_LIGHTS];","uniform Material uMaterial;","void main (void) {","\tmediump vec3 ambientComponent = uMaterial.ambientColor * uAmbientLightColor;","\tmediump vec3 diffuseComponent = vec3 (0.0, 0.0, 0.0);","\tfor (int i = 0; i < MAX_LIGHTS; i++) {","\t\tdiffuseComponent += uMaterial.diffuseColor * uLights[i].diffuseColor;","\t}","\tgl_FragColor = vec4 (ambientComponent + diffuseComponent, 1.0);","}"].join("\n"):t!=e.ShaderType.Triangle&&t!=e.ShaderType.TexturedTriangle||(r=["#define "+(t==e.ShaderType.Triangle?"NOTEXTURE":"USETEXTURE"),"#define MAX_LIGHTS "+i.maxLightCount,"struct Light","{","\tmediump vec3 diffuseColor;","\tmediump vec3 specularColor;","\tmediump vec3 direction;","};","struct Material","{","\tmediump vec3 ambientColor;","\tmediump vec3 diffuseColor;","\tmediump vec3 specularColor;","\tmediump float shininess;","\tmediump float opacity;","};","uniform mediump vec3 uAmbientLightColor;","uniform Light uLights[MAX_LIGHTS];","uniform Material uMaterial;","varying mediump vec3 vVertex;","varying mediump vec3 vNormal;","#ifdef USETEXTURE","varying mediump vec2 vUV;","uniform sampler2D uSampler;","#endif","void main (void) {","\tmediump vec3 N = normalize (vNormal);","\tif (!gl_FrontFacing) {","\t\tN = -N;","\t}","\tmediump vec3 ambientComponent = uMaterial.ambientColor * uAmbientLightColor;","\tmediump vec3 diffuseComponent = vec3 (0.0, 0.0, 0.0);","\tmediump vec3 specularComponent = vec3 (0.0, 0.0, 0.0);","\tmediump vec3 E = normalize (-vVertex);","\tfor (int i = 0; i < MAX_LIGHTS; i++) {","\t\tmediump vec3 L = normalize (-uLights[i].direction);","\t\tmediump vec3 R = normalize (-reflect (L, N));","\t\tdiffuseComponent += uMaterial.diffuseColor * uLights[i].diffuseColor * max (dot (N, L), 0.0);","\t\tspecularComponent += uMaterial.specularColor * uLights[i].specularColor * pow (max (dot (R, E), 0.0), uMaterial.shininess);","\t}","#ifdef USETEXTURE","\tmediump vec3 textureColor = texture2D (uSampler, vec2 (vUV.s, vUV.t)).xyz;","\tambientComponent = ambientComponent * textureColor;","\tdiffuseComponent = diffuseComponent * textureColor;","\tspecularComponent = specularComponent * textureColor;","#endif","\tambientComponent = clamp (ambientComponent, 0.0, 1.0);","\tdiffuseComponent = clamp (diffuseComponent, 0.0, 1.0);","\tspecularComponent = clamp (specularComponent, 0.0, 1.0);","\tgl_FragColor = vec4 (ambientComponent + diffuseComponent + specularComponent, uMaterial.opacity);","}"].join("\n")),r}(o,r);if(null===n||null===a)return!1;var m=e.WebGLInitShaderProgram(t,n,a,function(t){e.Message(t)});return null!==m&&(t.useProgram(m),function(t,i,r,o){if(o==e.ShaderType.Triangle||o==e.ShaderType.TexturedTriangle){var n;for(i.vertexPositionAttribute=t.getAttribLocation(i,"aVertexPosition"),i.vertexNormalAttribute=t.getAttribLocation(i,"aVertexNormal"),i.ambientLightColorUniform=t.getUniformLocation(i,"uAmbientLightColor"),i.lightUniforms=[],n=0;n<r.maxLightCount;n++)i.lightUniforms.push({diffuseColor:t.getUniformLocation(i,"uLights["+n+"].diffuseColor"),specularColor:t.getUniformLocation(i,"uLights["+n+"].specularColor"),direction:t.getUniformLocation(i,"uLights["+n+"].direction")});i.materialUniforms={ambientColor:t.getUniformLocation(i,"uMaterial.ambientColor"),diffuseColor:t.getUniformLocation(i,"uMaterial.diffuseColor"),specularColor:t.getUniformLocation(i,"uMaterial.specularColor"),shininess:t.getUniformLocation(i,"uMaterial.shininess"),opacity:t.getUniformLocation(i,"uMaterial.opacity")},i.vMatrixUniform=t.getUniformLocation(i,"uViewMatrix"),i.pMatrixUniform=t.getUniformLocation(i,"uProjectionMatrix"),i.tMatrixUniform=t.getUniformLocation(i,"uTransformationMatrix"),o==e.ShaderType.TexturedTriangle&&(i.vertexUVAttribute=t.getAttribLocation(i,"aVertexUV"),i.samplerUniform=t.getUniformLocation(i,"uSampler"))}else if(o==e.ShaderType.Point||o==e.ShaderType.Line){for(i.vertexPositionAttribute=t.getAttribLocation(i,"aVertexPosition"),i.ambientLightColorUniform=t.getUniformLocation(i,"uAmbientLightColor"),i.lightUniforms=[],n=0;n<r.maxLightCount;n++)i.lightUniforms.push({diffuseColor:t.getUniformLocation(i,"uLights["+n+"].diffuseColor")});i.materialUniforms={ambientColor:t.getUniformLocation(i,"uMaterial.ambientColor"),diffuseColor:t.getUniformLocation(i,"uMaterial.diffuseColor")},i.vMatrixUniform=t.getUniformLocation(i,"uViewMatrix"),i.pMatrixUniform=t.getUniformLocation(i,"uProjectionMatrix"),i.tMatrixUniform=t.getUniformLocation(i,"uTransformationMatrix"),o==e.ShaderType.Point&&(i.pointSizeUniform=t.getUniformLocation(i,"uPointSize"))}}(t,m,r,o),i[o]=m,!0)}return this.shaders={},!!t(this.context,this.shaders,this.globalParams,e.ShaderType.Point)&&(!!t(this.context,this.shaders,this.globalParams,e.ShaderType.Line)&&(!!t(this.context,this.shaders,this.globalParams,e.ShaderType.Triangle)&&(!!t(this.context,this.shaders,this.globalParams,e.ShaderType.TexturedTriangle)&&(this.context.enable(this.context.DEPTH_TEST),this.context.depthFunc(this.context.LEQUAL),this.context.enable(this.context.BLEND),this.context.blendEquation(this.context.FUNC_ADD),this.context.blendFunc(this.context.SRC_ALPHA,this.context.ONE_MINUS_SRC_ALPHA),this.context.disable(this.context.CULL_FACE),this.cullEnabled=!1,!0))))},e.ShaderProgram.prototype.CompileMaterial=function(t,i){if(null!==t.texture){var r=this.context,o=r.createTexture(),n=new Image;n.src=t.texture,n.onload=function(){var t=e.ResizeImageToPowerOfTwoSides(n);r.bindTexture(r.TEXTURE_2D,o),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MAG_FILTER,r.LINEAR),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MIN_FILTER,r.LINEAR_MIPMAP_LINEAR),r.texImage2D(r.TEXTURE_2D,0,r.RGBA,r.RGBA,r.UNSIGNED_BYTE,t),r.generateMipmap(r.TEXTURE_2D),r.bindTexture(r.TEXTURE_2D,null),void 0!==i&&null!==i&&i()},t.SetBuffers(o,n)}},e.ShaderProgram.prototype.CompileMesh=function(e){var t=this.context,i=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,i),t.bufferData(t.ARRAY_BUFFER,e.GetVertexArray(),t.STATIC_DRAW),i.itemSize=3,i.numItems=e.VertexCount();var r=null;e.HasNormalArray()&&(r=t.createBuffer(),t.bindBuffer(t.ARRAY_BUFFER,r),t.bufferData(t.ARRAY_BUFFER,e.GetNormalArray(),t.STATIC_DRAW),r.itemSize=3,r.numItems=e.NormalCount());var o=null;e.HasUVArray()&&(o=t.createBuffer(),t.bindBuffer(t.ARRAY_BUFFER,o),t.bufferData(t.ARRAY_BUFFER,e.GetUVArray(),t.STATIC_DRAW),o.itemSize=2,o.numItems=e.UVCount()),e.SetBuffers(i,r,o)},e.ShaderProgram.prototype.GetShader=function(e){return this.shaders[e]},e.ShaderProgram.prototype.UseShader=function(e){this.currentShader=this.GetShader(e),this.currentType=e,this.context.useProgram(this.currentShader)},e.ShaderProgram.prototype.SetParameters=function(t,i,r,o){function n(e,t,i){return t<e.length?e[t]:i}var a,m,u,f=this.context,l=this.currentShader;if(this.currentType==e.ShaderType.Triangle||this.currentType==e.ShaderType.TexturedTriangle){for(f.uniform3f(l.ambientLightColorUniform,t.color[0],t.color[1],t.color[2]),a=0;a<this.globalParams.maxLightCount;a++)m=n(i,a,this.globalParams.noDirectionalLight),u=e.ApplyRotation(r,m.direction),f.uniform3f(l.lightUniforms[a].diffuseColor,m.diffuse[0],m.diffuse[1],m.diffuse[2]),f.uniform3f(l.lightUniforms[a].specularColor,m.specular[0],m.specular[1],m.specular[2]),f.uniform3f(l.lightUniforms[a].direction,u.x,u.y,u.z);f.uniformMatrix4fv(l.pMatrixUniform,!1,o),f.uniformMatrix4fv(l.vMatrixUniform,!1,r)}else if(this.currentType==e.ShaderType.Point||this.currentType==e.ShaderType.Line){for(f.uniform3f(l.ambientLightColorUniform,t.color[0],t.color[1],t.color[2]),a=0;a<this.globalParams.maxLightCount;a++)m=n(i,a,this.globalParams.noDirectionalLight),f.uniform3f(l.lightUniforms[a].diffuseColor,m.diffuse[0],m.diffuse[1],m.diffuse[2]);f.uniformMatrix4fv(l.pMatrixUniform,!1,o),f.uniformMatrix4fv(l.vMatrixUniform,!1,r)}},e.ShaderProgram.prototype.SetCullEnabled=function(e){e&&!this.cullEnabled?(this.context.enable(this.context.CULL_FACE),this.cullEnabled=!0):!e&&this.cullEnabled&&(this.context.disable(this.context.CULL_FACE),this.cullEnabled=!1)},e.ShaderProgram.prototype.DrawArrays=function(t,i,r,o,n){var a=this.context,m=this.currentShader;this.SetCullEnabled(t.singleSided),this.currentType==e.ShaderType.Triangle||this.currentType==e.ShaderType.TexturedTriangle?(a.uniform3f(m.materialUniforms.ambientColor,t.ambient[0],t.ambient[1],t.ambient[2]),a.uniform3f(m.materialUniforms.diffuseColor,t.diffuse[0],t.diffuse[1],t.diffuse[2]),a.uniform3f(m.materialUniforms.specularColor,t.specular[0],t.specular[1],t.specular[2]),a.uniform1f(m.materialUniforms.shininess,t.shininess),a.uniform1f(m.materialUniforms.opacity,t.opacity),a.uniformMatrix4fv(m.tMatrixUniform,!1,i),a.bindBuffer(a.ARRAY_BUFFER,r),a.enableVertexAttribArray(m.vertexPositionAttribute),a.vertexAttribPointer(m.vertexPositionAttribute,r.itemSize,a.FLOAT,!1,0,0),a.bindBuffer(a.ARRAY_BUFFER,o),a.enableVertexAttribArray(m.vertexNormalAttribute),a.vertexAttribPointer(m.vertexNormalAttribute,o.itemSize,a.FLOAT,!1,0,0),this.currentType==e.ShaderType.TexturedTriangle&&(a.activeTexture(a.TEXTURE0),a.bindTexture(a.TEXTURE_2D,t.textureBuffer),a.bindBuffer(a.ARRAY_BUFFER,n),a.enableVertexAttribArray(m.vertexUVAttribute),a.vertexAttribPointer(m.vertexUVAttribute,n.itemSize,a.FLOAT,!1,0,0),a.uniform1i(m.samplerUniform,0)),a.drawArrays(a.TRIANGLES,0,r.numItems)):this.currentType!=e.ShaderType.Point&&this.currentType!=e.ShaderType.Line||(a.uniform3f(m.materialUniforms.ambientColor,t.ambient[0],t.ambient[1],t.ambient[2]),a.uniform3f(m.materialUniforms.diffuseColor,t.diffuse[0],t.diffuse[1],t.diffuse[2]),a.uniformMatrix4fv(m.tMatrixUniform,!1,i),a.bindBuffer(a.ARRAY_BUFFER,r),a.enableVertexAttribArray(m.vertexPositionAttribute),a.vertexAttribPointer(m.vertexPositionAttribute,r.itemSize,a.FLOAT,!1,0,0),this.currentType==e.ShaderType.Point?(a.uniform1f(m.pointSizeUniform,t.pointSize),a.drawArrays(a.POINTS,0,r.numItems)):this.currentType==e.ShaderType.Line&&a.drawArrays(a.LINES,0,r.numItems))},e});
//# sourceMappingURL=../sourcemaps/renderer/shaderprogram.js.map
