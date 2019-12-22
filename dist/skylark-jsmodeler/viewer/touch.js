/**
 * skylark-jsmodeler - A version of jsmodeler that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-jsmodeler/
 * @license MIT
 */
define(["../core/jsm"],function(t){return t.Touch=function(){this.down=!1,this.fingers=0,this.prev=new t.Coord2D,this.curr=new t.Coord2D,this.diff=new t.Coord2D},t.Touch.prototype.Start=function(t,e){0!==t.touches.length&&(this.down=!0,this.fingers=t.touches.length,this.SetCurrent(t,e),this.prev=this.curr.Clone())},t.Touch.prototype.Move=function(e,o){0!==e.touches.length&&(this.fingers=e.touches.length,this.SetCurrent(e,o),this.diff=t.CoordSub2D(this.curr,this.prev),this.prev=this.curr.Clone())},t.Touch.prototype.End=function(t,e){0!==t.touches.length&&(this.down=!1,this.SetCurrent(t,e))},t.Touch.prototype.SetCurrent=function(e,o){function n(e,o){var n=e.pageX,i=e.pageY;if(void 0!==o.getBoundingClientRect){var r=o.getBoundingClientRect();n-=r.left,i-=r.top}return void 0!==window.pageXOffset&&void 0!==window.pageYOffset&&(n+=window.pageXOffset,i+=window.pageYOffset),new t.Coord2D(n,i)}if(1==e.touches.length||3==e.touches.length)this.curr=n(e.touches[0],o);else if(2==e.touches.length){var i=n(e.touches[0],o).DistanceTo(n(e.touches[1],o));this.curr=new t.Coord2D(i,i)}},t});
//# sourceMappingURL=../sourcemaps/viewer/touch.js.map
