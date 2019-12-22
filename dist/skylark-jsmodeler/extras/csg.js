/**
 * skylark-jsmodeler - A version of jsmodeler that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-jsmodeler/
 * @license MIT
 */
define(["../core/jsm"],function(e){return e.BooleanOperation=function(n,r,o){function t(n,r,o,t){function a(n,o){return r.AddVertex(new e.BodyVertex(n))}var d,i,u=new e.BodyPolygon([]);if(t)for(d=n.VertexCount()-1;d>=0;d--)i=a(n.GetVertex(d)),u.AddVertexIndex(i);else for(d=0;d<n.VertexCount();d++)i=a(n.GetVertex(d)),u.AddVertexIndex(i);void 0!==n.userData&&u.SetMaterialIndex(n.userData.material),r.AddPolygon(u)}function a(e,n,r,o){var a;for(a=0;a<e.length;a++)t(e[a],n,0,o)}function d(n,r,o,t,a,d){function i(e,n){var r,o;for(r=0;r<e.length;r++)void 0===(o=e[r]).userData&&(o.userData=n)}var u,f;for(u=0;u<n.length;u++)f=n[u],e.ClipPolygonWithBSPTree(f.polygon,r,o,t,a,d),i(o,f.userData),i(t,f.userData),i(a,f.userData),i(d,f.userData)}var i=new e.BSPTree,u=new e.BSPTree;e.AddBodyToBSPTree(r,i,"a"),e.AddBodyToBSPTree(o,u,"b");var f=[],B=[],x=[],s=[];d(i.GetNodes(),u,f,B,x,s);var l=[],c=[],v=[];d(u.GetNodes(),i,l,c,v,[]);var g=new e.Body;new e.Octree(e.BoxUnion(r.GetBoundingBox(),o.GetBoundingBox()));return"Union"==n?(a(f,g,0,!1),a(x,g,0,!1),a(s,g,0,!1),a(l,g,0,!1),a(v,g,0,!1)):"Difference"==n?(a(f,g,0,!1),a(x,g,0,!1),a(c,g,0,!0)):"Intersection"==n&&(a(B,g,0,!1),a(s,g,0,!1),a(c,g,0,!1)),g},e});
//# sourceMappingURL=../sourcemaps/extras/csg.js.map
