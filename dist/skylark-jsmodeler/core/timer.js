/**
 * skylark-jsmodeler - A version of jsmodeler that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-jsmodeler/
 * @license MIT
 */
define(["./jsm"],function(t){return t.Timer=function(){this.start=0,this.stop=0},t.Timer.prototype.Start=function(){var t=new Date;this.start=t.getTime()},t.Timer.prototype.Stop=function(){var t=new Date;this.end=t.getTime()},t.Timer.prototype.Result=function(){return this.end-this.start},t.FPSCounter=function(){this.start=null,this.frames=null,this.current=null},t.FPSCounter.prototype.Get=function(t){var e=(new Date).getTime();null===this.start&&(this.start=e,this.frames=0,this.current=0),null!==t&&void 0!==t||(t=1e3),this.frames=this.frames+1;var r=e-this.start;return r>=t&&(this.current=this.frames/r*1e3,this.start=e,this.frames=0),parseInt(this.current,10)},t});
//# sourceMappingURL=../sourcemaps/core/timer.js.map
