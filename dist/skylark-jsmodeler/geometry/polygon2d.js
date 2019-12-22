/**
 * skylark-jsmodeler - A version of jsmodeler that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-jsmodeler/
 * @license MIT
 */
define(["../core/jsm"],function(t){return t.Complexity={Invalid:0,Convex:1,Concave:2,Complex:3},t.CoordPolygonPosition2D={OnVertex:0,OnEdge:1,Inside:2,Outside:3},t.SectorPolygonPosition2D={IntersectionOnePoint:0,IntersectionCoincident:1,IntersectionOnVertex:2,NoIntersection:3},t.Polygon2D=function(){this.vertices=null,this.cache=null,this.Clear()},t.Polygon2D.prototype.AddVertex=function(o,e){this.AddVertexCoord(new t.Coord2D(o,e))},t.Polygon2D.prototype.AddVertexCoord=function(t){this.vertices.push(t),this.ClearCache()},t.Polygon2D.prototype.GetVertex=function(t){return this.vertices[t]},t.Polygon2D.prototype.RemoveVertex=function(t){this.vertices.splice(t,1)},t.Polygon2D.prototype.VertexCount=function(){return this.vertices.length},t.Polygon2D.prototype.EnumerateVertices=function(t,o,e){var n=this.vertices.length,r=t;for(e(r);r!=o;)e(r=(r+1)%n)},t.Polygon2D.prototype.GetNextVertex=function(o){return t.NextIndex(o,this.vertices.length)},t.Polygon2D.prototype.GetPrevVertex=function(o){return t.PrevIndex(o,this.vertices.length)},t.Polygon2D.prototype.ShiftVertices=function(o){t.ShiftArray(this.vertices,o),this.ClearCache()},t.Polygon2D.prototype.ReverseVertices=function(){this.vertices.reverse(),this.ClearCache()},t.Polygon2D.prototype.GetVertexAngle=function(o){var e=this.vertices[this.GetPrevVertex(o)],n=this.vertices[o],r=this.vertices[this.GetNextVertex(o)],i=t.CoordSub2D(e,n),s=t.CoordSub2D(r,n);return i.AngleTo(s)},t.Polygon2D.prototype.GetSignedArea=function(){if(null!==this.cache.signedArea)return this.cache.signedArea;var t=this.vertices.length,o=0;if(t>=3){var e,n,r;for(e=0;e<t;e++)n=this.vertices[e],r=this.vertices[(e+1)%t],o+=n.x*r.y-r.x*n.y;o*=.5}return this.cache.signedArea=o,o},t.Polygon2D.prototype.GetArea=function(){var t=this.GetSignedArea();return Math.abs(t)},t.Polygon2D.prototype.GetOrientation=function(){if(null!==this.cache.orientation)return this.cache.orientation;var o=t.Orientation.Invalid;if(this.vertices.length>=3){var e=this.GetSignedArea();t.IsPositive(e)?o=t.Orientation.CounterClockwise:t.IsNegative(e)&&(o=t.Orientation.Clockwise)}return this.cache.orientation=o,o},t.Polygon2D.prototype.GetComplexity=function(){if(null!==this.cache.complexity)return this.cache.complexity;var o=this.vertices.length;if(o<3)return t.Complexity.Invalid;var e,n=t.Complexity.Invalid;if(this.GetOrientation()!=t.Orientation.Invalid)for(n=t.Complexity.Convex,e=0;e<o;e++)if(this.IsConcaveVertex(e)){n=t.Complexity.Concave;break}return this.cache.complexity=n,n},t.Polygon2D.prototype.GetVertexOrientation=function(o){if(void 0!==this.cache.vertexOrientations[o])return this.cache.vertexOrientations[o];var e=this.vertices[this.GetPrevVertex(o)],n=this.vertices[o],r=this.vertices[this.GetNextVertex(o)],i=t.CoordOrientation2D(e,n,r);return this.cache.vertexOrientations[o]=i,i},t.Polygon2D.prototype.IsConvexVertex=function(o){var e=this.GetOrientation(),n=this.GetVertexOrientation(o);return n!=t.Orientation.Invalid&&n==e},t.Polygon2D.prototype.IsConcaveVertex=function(o){var e=this.GetOrientation(),n=this.GetVertexOrientation(o);return n!=t.Orientation.Invalid&&n!=e},t.Polygon2D.prototype.CoordPosition=function(o){function e(o,e,n){var r=e.y-o.y,i=n.y-o.y,s=t.IsNegative(r),u=t.IsPositive(r),c=t.IsNegative(i),l=t.IsPositive(i);if(s&&c||u&&l)return 0;var h=!s&&!u,a=!c&&!l;if(h&&a)return 0;var y=function(o,e,n){var r=new t.Coord2D(e.x,o.y);if(!t.IsEqual(e.y,o.y)){var i=Math.abs((e.y-o.y)/(n.y-e.y));r.x=e.x+(n.x-e.x)*i}return r}(o,e,n);if(t.IsLower(y.x,o.x))return 0;if(t.IsGreater(y.x,o.x)){if(h||a){var C=t.IsGreater(n.y,e.y);return h&&C||a&&!C?1:0}return 1}return 1}var n,r,i,s,u=this.vertices.length,c=0;for(n=0;n<u;n++){if(r=this.vertices[n],i=this.vertices[(n+1)%u],(s=new t.Sector2D(r,i).CoordPosition(o))==t.CoordSectorPosition2D.CoordInsideOfSector)return t.CoordPolygonPosition2D.OnEdge;if(s==t.CoordSectorPosition2D.CoordOnSectorEndCoord)return t.CoordPolygonPosition2D.OnVertex;c+=e(o,r,i)}return c%2!=0?t.CoordPolygonPosition2D.Inside:t.CoordPolygonPosition2D.Outside},t.Polygon2D.prototype.SectorPosition=function(o,e,n){var r,i,s,u,c,l,h,a=t.SectorPolygonPosition2D.NoIntersection,y=this.vertices.length;if(y<3)return a;for(r=0;r<y;r++)if(i=r,s=(r+1)%y,u=this.vertices[i],c=this.vertices[s],i!=e&&s!=e&&i!=n&&s!=n){if(l=new t.Sector2D(u,c),(h=o.SectorPosition(l))==t.SectorSectorPosition2D.SectorsIntersectOnePoint)return t.SectorPolygonPosition2D.IntersectionOnePoint;if(h==t.SectorSectorPosition2D.SectorsIntersectCoincident)return t.SectorPolygonPosition2D.IntersectionCoincident;h==t.SectorSectorPosition2D.SectorsIntersectEndPoint&&(a=t.SectorPolygonPosition2D.IntersectionOnVertex)}return a},t.Polygon2D.prototype.IsDiagonal=function(o,e){if(o==e)return!1;if(this.GetPrevVertex(o)==e||this.GetNextVertex(o)==e)return!1;var n=this.vertices[o],r=this.vertices[e];return!n.IsEqual(r)&&(!function(o,e,n){var r=o.GetVertex(e),i=o.GetVertex(n),s=new t.Sector2D(r,i);return o.SectorPosition(s,e,n)!=t.SectorPolygonPosition2D.NoIntersection}(this,o,e)&&!!function(o,e,n){var r=o.GetVertex(e),i=o.GetVertex(n),s=new t.Coord2D((r.x+i.x)/2,(r.y+i.y)/2);return o.CoordPosition(s)==t.CoordPolygonPosition2D.Inside}(this,o,e))},t.Polygon2D.prototype.ToArray=function(){var t,o,e=[];for(t=0;t<this.vertices.length;t++)o=this.vertices[t],e.push(o.Clone());return e},t.Polygon2D.prototype.FromArray=function(t){var o,e;for(this.Clear(),o=0;o<t.length;o++)e=t[o],this.AddVertex(e.x,e.y)},t.Polygon2D.prototype.GetBoundingBox=function(){if(null!==this.cache.boundingBox)return this.cache.boundingBox;var o,e,n=new t.Box2D(new t.Coord2D(t.Inf,t.Inf),new t.Coord2D(-t.Inf,-t.Inf));for(o=0;o<this.vertices.length;o++)e=this.vertices[o],n.min.x=t.Minimum(n.min.x,e.x),n.min.y=t.Minimum(n.min.y,e.y),n.max.x=t.Maximum(n.max.x,e.x),n.max.y=t.Maximum(n.max.y,e.y);return this.cache.boundingBox=n,n},t.Polygon2D.prototype.Clear=function(){this.vertices=[],this.ClearCache()},t.Polygon2D.prototype.ClearCache=function(){this.cache={signedArea:null,orientation:null,vertexOrientations:{},complexity:null,boundingBox:null}},t.Polygon2D.prototype.Clone=function(){var o,e,n=new t.Polygon2D;for(o=0;o<this.vertices.length;o++)e=this.vertices[o],n.AddVertexCoord(e.Clone());return n},t.ContourPolygon2D=function(){this.contours=null,this.Clear()},t.ContourPolygon2D.prototype.AddVertex=function(t,o){this.lastContour.AddVertex(t,o)},t.ContourPolygon2D.prototype.AddVertexCoord=function(t){this.lastContour.AddVertexCoord(t)},t.ContourPolygon2D.prototype.AddContourVertex=function(t,o,e){return this.contours[t].AddVertex(o,e)},t.ContourPolygon2D.prototype.AddContourVertexCoord=function(t,o){return this.contours[t].AddVertexCoord(o)},t.ContourPolygon2D.prototype.VertexCount=function(){var t,o=0;for(t=0;t<this.contours.length;t++)o+=this.contours[t].VertexCount();return o},t.ContourPolygon2D.prototype.ReverseVertices=function(){var t;for(t=0;t<this.contours.length;t++)this.contours[t].ReverseVertices()},t.ContourPolygon2D.prototype.ContourVertexCount=function(t){return this.contours[t].VertexCount()},t.ContourPolygon2D.prototype.AddContour=function(o){this.lastContour=void 0===o||null===o?new t.Polygon2D:o,this.contours.push(this.lastContour)},t.ContourPolygon2D.prototype.GetLastContour=function(){return this.lastContour},t.ContourPolygon2D.prototype.GetContourVertex=function(t,o){return this.contours[t].GetVertex(o)},t.ContourPolygon2D.prototype.GetContour=function(t){return this.contours[t]},t.ContourPolygon2D.prototype.ContourCount=function(){return this.contours.length},t.ContourPolygon2D.prototype.GetSignedArea=function(){var t,o=0;for(t=0;t<this.contours.length;t++)o+=this.contours[t].GetSignedArea();return o},t.ContourPolygon2D.prototype.GetArea=function(){var t=this.GetSignedArea();return Math.abs(t)},t.ContourPolygon2D.prototype.GetOrientation=function(){if(null===this.lastContour)return t.Orientation.Invalid;var o,e,n=this.contours[0].GetOrientation();if(1==this.contours.length)return n;if(n==t.Orientation.Invalid)return t.Orientation.Invalid;for(o=1;o<this.contours.length;o++){if((e=this.contours[o].GetOrientation())==t.Orientation.Invalid)return t.Orientation.Invalid;if(n==e)return t.Orientation.Invalid}return n},t.ContourPolygon2D.prototype.GetComplexity=function(){if(null===this.lastContour)return t.Complexity.Invalid;if(1==this.contours.length)return this.contours[0].GetComplexity();var o;for(o=1;o<this.contours.length;o++)if(this.contours[o].GetComplexity()==t.Complexity.Invalid)return t.Complexity.Invalid;return t.Complexity.Complex},t.ContourPolygon2D.prototype.ToArray=function(){var t,o,e,n,r=[];for(t=0;t<this.contours.length;t++){for(e=this.contours[t],o=0;o<e.VertexCount();o++)n=e.GetVertex(o),r.push(n.Clone());t<this.contours.length-1&&r.push(null)}return r},t.ContourPolygon2D.prototype.FromArray=function(t){var o,e;for(this.Clear(),this.AddContour(),o=0;o<t.length;o++)null===(e=t[o])?this.AddContour():this.AddVertex(e.x,e.y)},t.ContourPolygon2D.prototype.Clear=function(){this.contours=[],this.lastContour=null},t.ContourPolygon2D.prototype.Clone=function(){var o,e,n=new t.ContourPolygon2D;for(o=0;o<this.contours.length;o++)e=this.contours[o],n.AddContour(e.Clone());return n},t});
//# sourceMappingURL=../sourcemaps/geometry/polygon2d.js.map
