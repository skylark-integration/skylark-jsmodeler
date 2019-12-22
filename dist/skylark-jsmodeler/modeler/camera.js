/**
 * skylark-jsmodeler - A version of jsmodeler that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-jsmodeler/
 * @license MIT
 */
define(["../core/jsm"],function(e){return e.Camera=function(i,a,t,n,l,r){this.eye=e.ValueOrDefault(i,new e.Coord(1,1,1)),this.center=e.ValueOrDefault(a,new e.Coord(0,0,0)),this.up=e.ValueOrDefault(t,new e.Vector(0,0,1)),this.fieldOfView=e.ValueOrDefault(n,45),this.nearClippingPlane=e.ValueOrDefault(l,.1),this.farClippingPlane=e.ValueOrDefault(r,1e3)},e.Camera.prototype.Set=function(i,a,t,n,l,r){this.eye=i,this.center=a,this.up=t,this.fieldOfView=e.ValueOrDefault(n,45),this.nearClippingPlane=e.ValueOrDefault(l,.1),this.farClippingPlane=e.ValueOrDefault(r,1e3)},e.Camera.prototype.Clone=function(){var i=new e.Camera;return i.eye=this.eye,i.center=this.center,i.up=this.up,i.fieldOfView=this.fieldOfView,i.nearClippingPlane=this.nearClippingPlane,i.farClippingPlane=this.farClippingPlane,i},e});
//# sourceMappingURL=../sourcemaps/modeler/camera.js.map
