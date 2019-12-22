/**
 * skylark-jsmodeler - A version of jsmodeler that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-jsmodeler/
 * @license MIT
 */
define(["../core/jsm"],function(t){return t.Mouse=function(){this.down=!1,this.button=0,this.shift=!1,this.ctrl=!1,this.alt=!1,this.prev=new t.Coord2D(0,0),this.curr=new t.Coord2D(0,0),this.diff=new t.Coord2D(0,0)},t.Mouse.prototype.Down=function(t,e){var i=t||window.event;this.down=!0,this.button=t.which,this.shift=t.shiftKey,this.ctrl=t.ctrlKey,this.alt=t.altKey,this.SetCurrent(i,e),this.prev=this.curr.Clone()},t.Mouse.prototype.Move=function(e,i){var o=e||window.event;this.shift=e.shiftKey,this.ctrl=e.ctrlKey,this.alt=e.altKey,this.SetCurrent(o,i),this.diff=t.CoordSub2D(this.curr,this.prev),this.prev=this.curr.Clone()},t.Mouse.prototype.Up=function(t,e){var i=t||window.event;this.down=!1,this.SetCurrent(i,e)},t.Mouse.prototype.Out=function(t,e){var i=t||window.event;this.down=!1,this.SetCurrent(i,e)},t.Mouse.prototype.SetCurrent=function(e,i){var o=e.clientX,n=e.clientY;if(void 0!==i.getBoundingClientRect){var r=i.getBoundingClientRect();o-=r.left,n-=r.top}void 0!==window.pageXOffset&&void 0!==window.pageYOffset&&(o+=window.pageXOffset,n+=window.pageYOffset),this.curr=new t.Coord2D(o,n)},t});
//# sourceMappingURL=../sourcemaps/viewer/mouse.js.map
