/**
 * skylark-jsmodeler - A version of jsmodeler that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-jsmodeler/
 * @license MIT
 */
define(["../core/jsm"],function(t){return t.Ray=function(t,i,n){this.origin=t,this.direction=i.Normalize(),this.length=n},t.Ray.prototype.Set=function(t,i,n){this.origin=t,this.direction=i.Normalize(),this.length=n},t.Ray.prototype.GetOrigin=function(){return this.origin},t.Ray.prototype.GetDirection=function(){return this.direction},t.Ray.prototype.IsLengthReached=function(i){return void 0!==this.length&&null!==this.length&&t.IsGreater(i,this.length)},t.Ray.prototype.Clone=function(){return new t.Ray(this.origin.Clone(),this.direction.Clone(),this.length)},t});
//# sourceMappingURL=../sourcemaps/geometry/ray.js.map
