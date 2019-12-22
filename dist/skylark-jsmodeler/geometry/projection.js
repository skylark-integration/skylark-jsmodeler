/**
 * skylark-jsmodeler - A version of jsmodeler that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-jsmodeler/
 * @license MIT
 */
define(["../core/jsm"],function(r){return r.MatrixView=function(t,e,i){if(t.IsEqual(e))return r.MatrixIdentity();var o=[],n=r.CoordSub(t,e).Normalize(),a=r.VectorCross(i,n).Normalize(),u=r.VectorCross(n,a).Normalize();return o[0]=a.x,o[1]=u.x,o[2]=n.x,o[3]=0,o[4]=a.y,o[5]=u.y,o[6]=n.y,o[7]=0,o[8]=a.z,o[9]=u.z,o[10]=n.z,o[11]=0,o[12]=-r.VectorDot(a,t),o[13]=-r.VectorDot(u,t),o[14]=-r.VectorDot(n,t),o[15]=1,o},r.MatrixPerspective=function(r,t,e,i){var o=[],n=1/Math.tan(r/2),a=1/(e-i);return o[0]=n/t,o[1]=0,o[2]=0,o[3]=0,o[4]=0,o[5]=n,o[6]=0,o[7]=0,o[8]=0,o[9]=0,o[10]=(i+e)*a,o[11]=-1,o[12]=0,o[13]=0,o[14]=2*i*e*a,o[15]=0,o},r.Project=function(t,e,i,o,n,a,u,x,c){var M=[t.x,t.y,t.z,1],l=r.MatrixView(e,i,o),y=r.MatrixPerspective(n,a,u,x),s=r.MatrixMultiply(l,y),v=r.MatrixVectorMultiply(s,M),z=v[3];if(r.IsZero(z))return null;var V=new r.Coord(0,0,0);return V.x=(v[0]/z*.5+.5)*c[2]+c[0],V.y=(v[1]/z*.5+.5)*c[3]+c[1],V.z=v[2]/z*.5+.5,V},r.Unproject=function(t,e,i,o,n,a,u,x,c){var M=[(t.x-c[0])/c[2]*2-1,(t.y-c[1])/c[3]*2-1,2*t.z-1,1],l=r.MatrixView(e,i,o),y=r.MatrixPerspective(n,a,u,x),s=r.MatrixMultiply(l,y),v=r.MatrixInvert(s),z=r.MatrixVectorMultiply(v,M),V=z[3];if(r.IsZero(V))return null;var f=new r.Coord(0,0,0);return f.x=z[0]/z[3],f.y=z[1]/z[3],f.z=z[2]/z[3],f},r});
//# sourceMappingURL=../sourcemaps/geometry/projection.js.map
