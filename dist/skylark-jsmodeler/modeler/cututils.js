/**
 * skylark-jsmodeler - A version of jsmodeler that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-jsmodeler/
 * @license MIT
 */
define(["../core/jsm"],function(e){return e.CutBodyByPlane=function(o,n){function t(o,n,t){function r(o,n,t,r){t.push(new e.Coord(n.x,n.y,n.z)),r.push(o)}function u(t,r,u,d){var i=e.CoordSub(o[r],o[t]).Normalize(),x=new e.Line(o[t],i),s=n.LineIntersection(x);u.push(new e.Coord(s.x,s.y,s.z)),d.push(-1)}var d,i,x,s=void 0!==t&&null!==t,f=o.length,h=[],l=[],y=!1;for(d=0;d<f;d++)x=o[d],i=n.CoordPosition(x),l.push(i!==e.CoordPlanePosition.CoordAtBackOfPlane),d>0&&l[d-1]!==l[d]&&(y=!0);if(!y){if(!1===l[0])return h;for(d=0;d<f;d++)x=o[d],h.push(new e.Coord(x.x,x.y,x.z)),s&&t.push(d);return h}var C,a,g,p,P,V,w=[],c=[];for(d=0;d<f;d++)C=d-1,a=d,0===d&&(C=f-1),x=o[a],l[a]?(l[C]||u(C,a,w,c),r(a,x,w,c)):l[C]&&u(C,a,w,c);for(d=0;d<w.length;d++)g=w[d],P=h[h.length-1],0!==d&&P.IsEqual(g)?s&&(V=c[d-1],-1!==(p=c[d])?t[t.length-1]=p:-1!==V&&(t[t.length-1]=V)):(h.push(new e.Coord(g.x,g.y,g.z)),s&&(p=c[d],t.push(p)));return h}function r(o,n,t){var r,u=-1;for(r=t;r<o.VertexCount();r++)if(n.IsEqual(o.GetVertexPosition(r))){u=r;break}return-1===u&&(u=o.AddVertex(new e.BodyVertex(new e.Coord(n.x,n.y,n.z)))),u}var u,d,i,x,s,f,h,l,y=new e.Body,C=[],a=[],g=[],p=[];for(u=0;u<o.PolygonCount();u++){for(i=o.GetPolygon(u),x=[],d=0;d<i.VertexIndexCount();d++)s=o.GetVertexPosition(i.GetVertexIndex(d)),x.push(new e.Coord(s.x,s.y,s.z));for(f=t(x,n,h=[]),d=0;d<h.length;d++)-1!==h[d]&&(g[i.GetVertexIndex(h[d])]=!0);C.push(f),a.push(h)}for(u=0;u<o.VertexCount();u++)g[u]&&(l=o.GetVertexPosition(u),p[u]=y.AddVertex(new e.BodyVertex(new e.Coord(l.x,l.y,l.z))));var P,V,w=y.VertexCount();for(u=0;u<o.PolygonCount();u++)if(i=o.GetPolygon(u),f=C[u],0!==(h=a[u]).length){for(V=[],d=0;d<h.length;d++)-1!==h[d]?V.push(p[i.GetVertexIndex(h[d])]):(l=f[d],V.push(r(y,l,w)));(P=new e.BodyPolygon(V)).InheritAttributes(i),y.AddPolygon(P)}return y},e});
//# sourceMappingURL=../sourcemaps/modeler/cututils.js.map
