/**
 * skylark-jsmodeler - A version of jsmodeler that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-jsmodeler/
 * @license MIT
 */
define(["../core/jsm"],function(r){return r.Eps=1e-8,r.Inf=9999999999,r.RadDeg=57.29577951308232,r.DegRad=.017453292519943,r.IsZero=function(n){return Math.abs(n)<r.Eps},r.IsPositive=function(n){return n>r.Eps},r.IsNegative=function(n){return n<-r.Eps},r.IsLower=function(n,t){return t-n>r.Eps},r.IsGreater=function(n,t){return n-t>r.Eps},r.IsEqual=function(n,t){return Math.abs(t-n)<r.Eps},r.IsEqualWithEps=function(r,n,t){return Math.abs(n-r)<t},r.IsLowerOrEqual=function(n,t){return r.IsLower(n,t)||r.IsEqual(n,t)},r.IsGreaterOrEqual=function(n,t){return r.IsGreater(n,t)||r.IsEqual(n,t)},r.Minimum=function(n,t){return r.IsLower(n,t)?n:t},r.Maximum=function(n,t){return r.IsGreater(n,t)?n:t},r.ArcSin=function(n){return r.IsGreaterOrEqual(n,1)?Math.PI/2:r.IsLowerOrEqual(n,-1)?-Math.PI/2:Math.asin(n)},r.ArcCos=function(n){return r.IsGreaterOrEqual(n,1)?0:r.IsLowerOrEqual(n,-1)?Math.PI:Math.acos(n)},r});
//# sourceMappingURL=../sourcemaps/geometry/definitions.js.map
