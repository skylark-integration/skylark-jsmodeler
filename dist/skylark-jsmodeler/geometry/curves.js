/**
 * skylark-jsmodeler - A version of jsmodeler that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-jsmodeler/
 * @license MIT
 */
define(["../core/jsm"],function(n){return n.GenerateCubicBezierCurve=function(r,e,o,t,u){function i(r,e,o,t,u){var i=u*u,f=i*u,a=1-u,c=a*a,y=c*a,v=y*r.x+3*c*u*e.x+3*a*i*o.x+f*t.x,x=y*r.y+3*c*u*e.y+3*a*i*o.y+f*t.y;return new n.Coord2D(v,x)}var f,a,c=[],y=1/u;for(f=0;f<=u;f++)a=i(r,e,o,t,f*y),c.push(a);return c},n.BernsteinPolynomial=function(r,e,o){return function(r,e){var o,t=1,u=n.Minimum(e,r-e);for(o=0;o<u;o++)t*=r-o,t/=o+1;return t}(e,r)*Math.pow(o,r)*Math.pow(1-o,e-r)},n.GenerateBezierCurve=function(r,e){var o,t,u,i,f,a,c=[],y=r.length-1,v=1/e;for(o=0;o<=e;o++){for(u=o*v,a=new n.Coord2D(0,0),t=0;t<=y;t++)i=r[t],f=n.BernsteinPolynomial(t,y,u),a.x+=i.x*f,a.y+=i.y*f;c.push(a)}return c},n});
//# sourceMappingURL=../sourcemaps/geometry/curves.js.map
