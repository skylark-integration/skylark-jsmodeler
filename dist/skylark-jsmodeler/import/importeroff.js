/**
 * skylark-jsmodeler - A version of jsmodeler that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-jsmodeler/
 * @license MIT
 */
define(["../core/jsm"],function(e){return e.ReadOffFile=function(e,n){function o(e,o){if(0!==e.length&&"#"!=e[0]){var t,r,a,f=e.split(/\s+/);if(0!==f.length&&"#"!=f[0][0])if(o.offHeaderFound)if(o.infoFound)if(o.readVertices<o.vertexCount)3==f.length&&(t=parseFloat(f[0]),r=parseFloat(f[1]),a=parseFloat(f[2]),void 0!==n.onVertex&&null!==n.onVertex&&n.onVertex(t,r,a),o.readVertices+=1);else if(o.readFaces<o.faceCount){var i=parseInt(f[0]);if(f.length>=i+1){var l,d,u=[];for(l=1;l<i+1;l++)d=parseInt(f[l]),u.push(d);!function(e){void 0!==n.onFace&&null!==n.onFace&&n.onFace(e)}(u),o.readFaces+=1}}else;else 3==f.length&&(o.vertexCount=parseInt(f[0]),o.faceCount=parseInt(f[1]),o.infoFound=!0);else 1==f.length&&"OFF"==f[0]&&(o.offHeaderFound=!0)}}void 0!==n&&null!==n||(n={}),function(e){var n,t={offHeaderFound:!1,infoFound:!1,vertexCount:0,faceCount:0,readVertices:0,readFaces:0},r=e.split("\n");for(n=0;n<r.length;n++)o(r[n].trim(),t)}(e)},e.ConvertOffToJsonData=function(n){var o=new e.TriangleModel,t=o.AddBody(new e.TriangleBody("Default")),r=o.GetBody(t);return e.ReadOffFile(n,{onVertex:function(e,n,o){r.AddVertex(e,n,o)},onFace:function(e){var n,o,t,a,f=e.length;for(n=0;n<f-2;n++)o=e[0],t=e[n+1],a=e[n+2],r.AddTriangle(o,t,a)}}),o.Finalize(),e.ConvertTriangleModelToJsonData(o)},e});
//# sourceMappingURL=../sourcemaps/import/importeroff.js.map
