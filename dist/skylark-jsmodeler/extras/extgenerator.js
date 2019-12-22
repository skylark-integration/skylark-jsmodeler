/**
 * skylark-jsmodeler - A version of jsmodeler that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-jsmodeler/
 * @license MIT
 */
define(["../core/jsm"],function(e){return e.LegoDimensions=function(){this.legoWidth=.78,this.legoSmallHeight=.32,this.legoLargeHeight=.96,this.legoWallWidth=.16,this.legoCylinderWidth=.5,this.legoCylinderHeight=.17,this.legoBottomSmallCylinderWidth=.3,this.legoBottomLargeCylinderWidth=.6,this.legoBottomLargeCylinderWallWidth=.1},e.GenerateLegoBrick=function(o,t,r,n,i,l,h){function a(o,t){var r,n;for(r=0;r<o.VertexCount();r++)(n=o.GetVertex(r)).position=e.CoordAdd(n.position,t)}var d=new e.LegoDimensions,g=new e.Vector(0,0,1),s=d.legoWidth,C=d.legoLargeHeight;r||(C=d.legoSmallHeight);var u=d.legoWallWidth,f=d.legoCylinderWidth,y=d.legoCylinderHeight,w=d.legoBottomSmallCylinderWidth,M=d.legoBottomLargeCylinderWidth,c=d.legoBottomLargeCylinderWallWidth,W=[];W.push(new e.Coord(0,0,0)),W.push(new e.Coord(s*o,0,0)),W.push(new e.Coord(s*o,s*t,0)),W.push(new e.Coord(0,s*t,0));var m,p,x=new e.Body,v=e.GeneratePrismShell(W,g,C-u,u,!0);for(x.Merge(v),m=0;m<4;m++)W[m].z=C-u;var B,G,S,L,H=e.GeneratePrism(W,g,u,!0,null);if(x.Merge(H),n)for(m=0;m<o;m++)for(p=0;p<t;p++)B=new e.Coord(s*m+s/2,s*p+s/2,C+y/2),a(G=e.GenerateCylinder(f/2,y,l,!0,h),B),x.Merge(G);if(i)if(1===o&&t>1||1===t&&o>1)for(S=t,L=!0,o>t&&(S=o,L=!1),m=0;m<S-1;m++)B=L?new e.Coord(s/2,s*(m+1),(C-u)/2):new e.Coord(s*(m+1),s/2,(C-u)/2),a(G=e.GenerateCylinder(w/2,C-u,l,!0,h),B),x.Merge(G);else if(o>1&&t>1)for(m=0;m<o-1;m++)for(p=0;p<t-1;p++)[],B=new e.Coord(s*(m+1),s*(p+1),(C-u)/2),a(G=e.GenerateCylinderShell(M/2,C-u,c,l,!0,h),B),x.Merge(G);return x.SetCubicTextureProjection(new e.Coord(0,0,0),new e.Coord(1,0,0),new e.Coord(0,1,0),new e.Coord(0,0,1)),x},e.GenerateConvexHullBody=function(o){var t,r,n,i,l,h=new e.Body,a=e.ConvexHull3D(o),d={};for(t=0;t<a.length;t++)for(n=a[t],r=0;r<n.length;r++)(i=n[r])in d||(d[i]=h.VertexCount(),h.AddVertex(new e.BodyVertex(o[i])));for(t=0;t<a.length;t++){for(n=a[t],l=[],r=0;r<n.length;r++)i=n[r],l.push(d[i]);h.AddPolygon(new e.BodyPolygon(l))}return h},e.GenerateSuperShape=function(o,t,r,n,i,l,h,a,d,g,s,C,u,f){function y(e){var o=Math.sqrt(e.x*e.x+e.y*e.y+e.z*e.z);return[o,Math.asin(e.z/o),Math.atan2(e.y,e.x)]}function w(e,o,t,r,n,i,l){var h=Math.abs(Math.cos(r*e/4)/o),a=Math.abs(Math.sin(r*e/4)/t);return Math.pow(Math.pow(h,i)+Math.pow(a,l),-1/n)}function M(u,f){var y=new e.Coord(0,0,0),M=w(u,h,a,d,g,s,C),c=w(f,o,t,r,n,i,l);return y.x=c*Math.cos(f)*M*Math.cos(u),y.y=c*Math.sin(f)*M*Math.cos(u),y.z=M*Math.sin(u),y}var c,W,m,p,x=e.GenerateSphere(1,u,f);for(c=0;c<x.VertexCount();c++)p=M((m=y((W=x.GetVertex(c)).position))[1],m[2]),W.SetPosition(p);return x},e});
//# sourceMappingURL=../sourcemaps/extras/extgenerator.js.map
