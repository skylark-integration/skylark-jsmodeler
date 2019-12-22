/**
 * skylark-jsmodeler - A version of jsmodeler that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-jsmodeler/
 * @license MIT
 */
define(["../core/jsm"],function(e){return e.Sphere=function(e,t){this.center=e,this.radius=t},e.Sphere.prototype.Set=function(e,t){this.center=e,this.radius=t},e.Sphere.prototype.GetCenter=function(){return this.center},e.Sphere.prototype.GetRadius=function(){return this.radius},e.Sphere.prototype.Clone=function(){return new e.Sphere(this.center.Clone(),this.radius)},e});
//# sourceMappingURL=../sourcemaps/geometry/sphere.js.map
