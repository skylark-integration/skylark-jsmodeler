/**
 * skylark-jsmodeler - A version of jsmodeler that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-jsmodeler/
 * @license MIT
 */
define(["../core/jsm"],function(n){return n.Box2D=function(n,t){this.min=n,this.max=t},n.Box2D.prototype.Set=function(n,t){this.min=n,this.max=t},n.Box2D.prototype.GetCenter=function(){return n.MidCoord2D(this.min,this.max)},n.Box2D.prototype.Clone=function(){return new n.Box2D(this.min.Clone(),this.max.Clone())},n.Box=function(n,t){this.min=n,this.max=t},n.Box.prototype.Set=function(n,t){this.min=n,this.max=t},n.Box.prototype.GetCenter=function(){return n.MidCoord(this.min,this.max)},n.Box.prototype.GetSize=function(){return n.CoordSub(this.max,this.min)},n.Box.prototype.IsCoordInside=function(t){return!(n.IsLower(t.x,this.min.x)||n.IsLower(t.y,this.min.y)||n.IsLower(t.z,this.min.z))&&!(n.IsGreater(t.x,this.max.x)||n.IsGreater(t.y,this.max.y)||n.IsGreater(t.z,this.max.z))},n.Box.prototype.Clone=function(){return new n.Box(this.min.Clone(),this.max.Clone())},n.BoxUnion=function(t,i){var o=new n.Coord(n.Minimum(t.min.x,i.min.x),n.Minimum(t.min.y,i.min.y),n.Minimum(t.min.z,i.min.z)),e=new n.Coord(n.Maximum(t.max.x,i.max.x),n.Maximum(t.max.y,i.max.y),n.Maximum(t.max.z,i.max.z));return new n.Box(o,e)},n});
//# sourceMappingURL=../sourcemaps/geometry/box.js.map
