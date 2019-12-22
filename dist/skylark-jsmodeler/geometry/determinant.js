/**
 * skylark-jsmodeler - A version of jsmodeler that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-jsmodeler/
 * @license MIT
 */
define(["../core/jsm"],function(t){return t.MatrixDeterminant2x2=function(t,n,r,e){return t*e-n*r},t.MatrixDeterminant3x3=function(n,r,e,i,a,x,m,D,M){return n*t.MatrixDeterminant2x2(a,x,D,M)-r*t.MatrixDeterminant2x2(i,x,m,M)+e*t.MatrixDeterminant2x2(i,a,m,D)},t.MatrixDeterminant4x4=function(n,r,e,i,a,x,m,D,M,u,c,f,o,d,j,s){return t.MatrixDeterminant3x3(x,m,D,u,c,f,d,j,s)*n-t.MatrixDeterminant3x3(a,m,D,M,c,f,o,j,s)*r+t.MatrixDeterminant3x3(a,x,D,M,u,f,o,d,s)*e-t.MatrixDeterminant3x3(a,x,m,M,u,c,o,d,j)*i},t});
//# sourceMappingURL=../sourcemaps/geometry/determinant.js.map
