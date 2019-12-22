/**
 * skylark-jsmodeler - A version of jsmodeler that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-jsmodeler/
 * @license MIT
 */
define(["../core/jsm"],function(t){return t.GetGaussianCParameter=function(t,e,n,r){return Math.sqrt(-Math.pow(t-n,2)/(2*Math.log(r/Math.abs(e))))},t.GetGaussianValue=function(t,e,n,r){return e*Math.exp(-Math.pow(t-n,2)/(2*Math.pow(r,2)))},t.GenerateCirclePoints=function(e,n,r){var o,a,u=[],h=n,s=2*Math.PI,i=2*Math.PI/h;for(o=0;o<h;o++)a=t.CylindricalToCartesian(e,0,s),void 0!==r&&null!==r&&(a=t.CoordAdd(a,r)),u.push(a),s+=i;return u},t.GetRuledMesh=function(e,n,r,o,a){if(e.length===n.length){var u,h,s,i,f,l,M,c=e.length-1,p=r,d=[],C=[];for(u=0;u<=c;u++)d.push(t.CoordSub(n[u],e[u])),C.push(e[u].DistanceTo(n[u]));for(u=0;u<=c;u++)for(s=C[u]/p,h=0;h<=p;h++)i=e[u].Clone().Offset(d[u],s*h),o.push(i);for(u=0;u<c;u++)for(h=0;h<p;h++)l=(f=u*(p+1)+h)+1,f+p+1+1,M=[f=u*(p+1)+h,l=f+p+1,l+1,f+1],a.push(M)}},t});
//# sourceMappingURL=../sourcemaps/geometry/utilities.js.map
