/**
 * skylark-jsmodeler - A version of jsmodeler that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-jsmodeler/
 * @license MIT
 */
define(["../core/jsm"],function(o){return o.CoordSystem=function(o,t,i,e){this.origo=o,this.e1=t,this.e2=i,this.e3=e},o.CoordSystem.prototype.Set=function(o,t,i,e){this.origo=o,this.e1=t,this.e2=i,this.e3=e},o.CoordSystem.prototype.ToDirectionVectors=function(){return this.e1=o.CoordSub(this.e1,this.origo),this.e2=o.CoordSub(this.e2,this.origo),this.e3=o.CoordSub(this.e3,this.origo),this},o.CoordSystem.prototype.ToAbsoluteCoords=function(){return this.e1=o.CoordAdd(this.e1,this.origo),this.e2=o.CoordAdd(this.e2,this.origo),this.e3=o.CoordAdd(this.e3,this.origo),this},o.CoordSystem.prototype.Clone=function(){return new o.CoordSystem(this.origo.Clone(),this.e1.Clone(),this.e2.Clone(),this.e3.Clone())},o});
//# sourceMappingURL=../sourcemaps/geometry/coordsystem.js.map
