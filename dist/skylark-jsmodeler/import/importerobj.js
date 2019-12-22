/**
 * skylark-jsmodeler - A version of jsmodeler that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-jsmodeler/
 * @license MIT
 */
define(["../core/jsm"],function(n){return n.ReadObjFile=function(n,e){function t(n,t){function l(n,e){return n>0?n-1:e+n}function r(n,e){var t=n.indexOf(e)+e.length;return n.substr(t,n.length-t).trim()}if(0!==n.length&&"#"!=n[0]){var i,a,u,f,s,d,c,h=n.split(/\s+/);if(0!==h.length&&"#"!=h[0][0])if("g"==h[0]){if(h.length<2)return;var v="";for(i=1;i<h.length;i++)v+=h[i],i<h.length-1&&(v+=" ");!function(n){void 0!==e.onMesh&&null!==e.onMesh&&e.onMesh(n)}(v)}else if("v"==h[0]){if(h.length<4)return;t.vertexCount+=1,s=parseFloat(h[1]),d=parseFloat(h[2]),c=parseFloat(h[3]),void 0!==e.onVertex&&null!==e.onVertex&&e.onVertex(s,d,c)}else if("vn"==h[0]){if(h.length<4)return;t.normalCount+=1,function(n,t,o){void 0!==e.onNormal&&null!==e.onNormal&&e.onNormal(n,t,o)}(parseFloat(h[1]),parseFloat(h[2]),parseFloat(h[3]))}else if("vt"==h[0]){if(h.length<3)return;t.uvCount+=1,function(n,t){void 0!==e.onTexCoord&&null!==e.onTexCoord&&e.onTexCoord(n,t)}(parseFloat(h[1]),parseFloat(h[2]))}else if("f"==h[0]){if(h.length<4)return;var g,p=[],m=[],M=[];for(i=1;i<h.length;i++)g=h[i].split("/"),p.push(l(parseInt(g[0],10),t.vertexCount)),g.length>1&&g[1].length>0&&M.push(l(parseInt(g[1],10),t.uvCount)),g.length>2&&g[2].length>0&&m.push(l(parseInt(g[2],10),t.normalCount));!function(n,t,o){void 0!==e.onFace&&null!==e.onFace&&e.onFace(n,t,o)}(p,m,M)}else if("usemtl"==h[0]){if(h.length<2)return;f=h[1],void 0!==e.onUseMaterial&&null!==e.onUseMaterial&&e.onUseMaterial(f)}else if("newmtl"==h[0]){if(h.length<2)return;!function(n){void 0!==e.onNewMaterial&&null!==e.onNewMaterial&&e.onNewMaterial(n)}(h[1])}else if("Ka"==h[0]||"Kd"==h[0]||"Ks"==h[0]){if(h.length<4)return;!function(n,t,o,l){void 0!==e.onMaterialComponent&&null!==e.onMaterialComponent&&e.onMaterialComponent(n,t,o,l)}(h[0],parseFloat(h[1]),parseFloat(h[2]),parseFloat(h[3]))}else if("Ns"==h[0]||"Tr"==h[0]||"d"==h[0]){if(h.length<2)return;!function(n,t){void 0!==e.onMaterialParameter&&null!==e.onMaterialParameter&&e.onMaterialParameter(n,t)}(h[0],h[1])}else if("map_Kd"==h[0]){if(h.length<2)return;a=r(n,"map_Kd"),u=a,void 0!==e.onMaterialTexture&&null!==e.onMaterialTexture&&e.onMaterialTexture(u)}else if("mtllib"==h[0]){if(h.length<2)return;var F=function(n){return void 0!==e.onFileRequested&&null!==e.onFileRequested?e.onFileRequested(n):null}((a=r(n,"mtllib")).trim());if(null===F)return;o(F)}}}function o(n,e){var o,l=n.split("\n");for(o=0;o<l.length;o++)t(l[o].trim(),e)}void 0!==e&&null!==e||(e={});o(n,{vertexCount:0,normalCount:0,uvCount:0})},n.ConvertObjToJsonData=function(e,t){function o(n){return void 0!==t.onFileRequested&&null!==t.onFileRequested?t.onFileRequested(n):null}void 0!==t&&null!==t||(t={});var l=new n.TriangleModel,r=l.AddBody(new n.TriangleBody("Default")),i=l.GetBody(r),a={},u=null,f=null,s=[],d=[],c=[],h={},v={},g={};return n.ReadObjFile(e,{onNewMaterial:function(n){var e=l.AddMaterial({name:n});u=l.GetMaterial(e),a[n]=e},onMaterialComponent:function(n,e,t,o){null!==u&&("Ka"==n?u.ambient=[e,t,o]:"Kd"==n?u.diffuse=[e,t,o]:"Ks"==n&&(u.specular=[e,t,o]))},onMaterialParameter:function(e,t){null!==u&&("Ns"==e?(u.shininess=0,n.IsPositive(t)&&(u.shininess=(Math.log2(parseFloat(t))-1)/10)):"Tr"==e?u.opacity=1-parseFloat(t):"d"==e&&(u.opacity=parseFloat(t)))},onMaterialTexture:function(n){if(null!==u){var e=o(n);if(null!==e){var t=new window.Blob([e]),l=window.URL.createObjectURL(t);u.texture=l}}},onUseMaterial:function(n){var e=a[n];void 0!==e&&(f=e)},onMesh:function(e){var t=l.AddBody(new n.TriangleBody(e));i=l.GetBody(t),h={},v={},g={}},onVertex:function(e,t,o){s.push(new n.Coord(e,t,o))},onNormal:function(e,t,o){d.push(new n.Coord(e,t,o))},onTexCoord:function(e,t){c.push(new n.Coord2D(e,t))},onFace:function(n,e,t){function o(n,e,t,o){if(!(t<0||t>=n.length)){var l=e[t];if(void 0===l)l=o(n[t]),e[t]=l;return l}}function l(n,e,t,l){return o(e,t,l,function(e){return n.AddVertex(e.x,e.y,e.z)})}function r(n,e,t,l){return o(e,t,l,function(e){return n.AddNormal(e.x,e.y,e.z)})}function a(n,e,t,l){return o(e,t,l,function(e){return n.AddUV(e.x,e.y)})}var u,p,m,M,F,C,x=e.length==n.length,T=t.length==n.length,w=n.length;for(u=0;u<w-2;u++)p=l(i,s,h,n[0]),m=l(i,s,h,n[(u+1)%w]),M=l(i,s,h,n[(u+2)%w]),C=i.AddTriangle(p,m,M),F=i.GetTriangle(C),x&&(F.n0=r(i,d,v,e[0]),F.n1=r(i,d,v,e[(u+1)%w]),F.n2=r(i,d,v,e[(u+2)%w])),T&&(F.u0=a(i,c,g,t[0]),F.u1=a(i,c,g,t[(u+1)%w]),F.u2=a(i,c,g,t[(u+2)%w])),null!==f&&(F.mat=f)},onFileRequested:o}),l.Finalize(),n.ConvertTriangleModelToJsonData(l)},n});
//# sourceMappingURL=../sourcemaps/import/importerobj.js.map