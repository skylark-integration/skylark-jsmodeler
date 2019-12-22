/**
 * skylark-jsmodeler - A version of jsmodeler that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-jsmodeler/
 * @license MIT
 */
define(["../../core/jsm"],function(e){return e.GenerateText=function(n,o,t,r,a){function i(n,o,t,r){function a(e){return parseFloat(e)}for(var i,s=new e.Path2D({segmentation:o,offset:t,scale:r}),d=n.split(" "),l=0;l<d.length;)0!==(i=d[l++]).length&&("m"==i?(s.MoveTo(a(d[l+0]),a(d[l+1])),l+=2):"l"==i?(s.LineTo(a(d[l+0]),a(d[l+1])),l+=2):"b"==i?(s.CubicBezierTo(a(d[l+0]),a(d[l+1]),a(d[l+2]),a(d[l+3]),a(d[l+4]),a(d[l+5])),l+=6):"z"==i?s.Close():e.Message("Invalid path command found: "+i));return s}var s,d,l,f,u,c=new e.Model,h=new e.Vector2D(0,0),g=new e.Coord2D(t,t);for(s=0;s<n.length;s++)d=n[s],void 0!==(l=o.glyphs[d])&&(f=i(l.o,a,h,g),u=e.GeneratePrismsFromPath2D(f,r,!0,160*e.DegRad),c.AddBodies(u),h.x+=l.ha*g.x);return c},e});
//# sourceMappingURL=../../sourcemaps/extensions/textgenerator/textgenerator.js.map
