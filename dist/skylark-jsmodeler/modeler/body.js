/**
 * skylark-jsmodeler - A version of jsmodeler that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-jsmodeler/
 * @license MIT
 */
define(["../core/jsm"],function(t){return t.BodyVertex=function(t){this.position=t},t.BodyVertex.prototype.GetPosition=function(){return this.position},t.BodyVertex.prototype.SetPosition=function(t){this.position=t},t.BodyVertex.prototype.Clone=function(){return new t.BodyVertex(this.position.Clone())},t.BodyPoint=function(t){this.vertex=t,this.material=-1},t.BodyPoint.prototype.GetVertexIndex=function(){return this.vertex},t.BodyPoint.prototype.SetVertexIndex=function(t){this.vertex=t},t.BodyPoint.prototype.HasMaterialIndex=function(){return-1!==this.material},t.BodyPoint.prototype.GetMaterialIndex=function(){return this.material},t.BodyPoint.prototype.SetMaterialIndex=function(t){this.material=t},t.BodyPoint.prototype.InheritAttributes=function(t){this.material=t.material},t.BodyPoint.prototype.Clone=function(){var e=new t.BodyPoint(this.vertex);return e.material=this.material,e},t.BodyLine=function(t,e){this.beg=t,this.end=e,this.material=-1},t.BodyLine.prototype.GetBegVertexIndex=function(){return this.beg},t.BodyLine.prototype.SetBegVertexIndex=function(t){this.beg=t},t.BodyLine.prototype.GetEndVertexIndex=function(){return this.end},t.BodyLine.prototype.SetEndVertexIndex=function(t){this.end=t},t.BodyLine.prototype.HasMaterialIndex=function(){return-1!==this.material},t.BodyLine.prototype.GetMaterialIndex=function(){return this.material},t.BodyLine.prototype.SetMaterialIndex=function(t){this.material=t},t.BodyLine.prototype.InheritAttributes=function(t){this.material=t.material},t.BodyLine.prototype.Clone=function(){var e=new t.BodyLine(this.beg,this.end);return e.material=this.material,e},t.BodyPolygon=function(t){this.vertices=t,this.material=-1,this.curved=-1},t.BodyPolygon.prototype.AddVertexIndex=function(t){this.vertices.push(t)},t.BodyPolygon.prototype.InsertVertexIndex=function(t,e){this.vertices.splice(e,0,t)},t.BodyPolygon.prototype.GetVertexIndex=function(t){return this.vertices[t]},t.BodyPolygon.prototype.SetVertexIndex=function(t,e){this.vertices[t]=e},t.BodyPolygon.prototype.GetVertexIndices=function(){return this.vertices},t.BodyPolygon.prototype.SetVertexIndices=function(t){this.vertices=t},t.BodyPolygon.prototype.VertexIndexCount=function(){return this.vertices.length},t.BodyPolygon.prototype.HasMaterialIndex=function(){return-1!==this.material},t.BodyPolygon.prototype.GetMaterialIndex=function(){return this.material},t.BodyPolygon.prototype.SetMaterialIndex=function(t){this.material=t},t.BodyPolygon.prototype.HasCurveGroup=function(){return-1!==this.curved},t.BodyPolygon.prototype.GetCurveGroup=function(){return this.curved},t.BodyPolygon.prototype.SetCurveGroup=function(t){this.curved=t},t.BodyPolygon.prototype.ReverseVertexIndices=function(){this.vertices.reverse()},t.BodyPolygon.prototype.InheritAttributes=function(t){this.material=t.material,this.curved=t.curved},t.BodyPolygon.prototype.Clone=function(){var e,o=new t.BodyPolygon([]);for(e=0;e<this.vertices.length;e++)o.vertices.push(this.vertices[e]);return o.material=this.material,o.curved=this.curved,o},t.TextureProjectionType={Planar:0,Cubic:1,Cylindrical:2},t.BodyTextureProjection=function(){this.type=null,this.coords=null,this.SetCubic(new t.Coord(0,0,0),new t.Coord(1,0,0),new t.Coord(0,1,0),new t.Coord(0,0,1))},t.BodyTextureProjection.prototype.GetType=function(){return this.type},t.BodyTextureProjection.prototype.GetCoords=function(){return this.coords},t.BodyTextureProjection.prototype.SetType=function(t){this.type=t},t.BodyTextureProjection.prototype.SetCoords=function(t){this.coords=t},t.BodyTextureProjection.prototype.SetPlanar=function(e,o,n){this.type=t.TextureProjectionType.Planar,this.coords=new t.CoordSystem(e,o,n,new t.Coord(0,0,0))},t.BodyTextureProjection.prototype.SetCubic=function(e,o,n,i){this.type=t.TextureProjectionType.Cubic,this.coords=new t.CoordSystem(e,o,n,i)},t.BodyTextureProjection.prototype.SetCylindrical=function(e,o,n,i){this.type=t.TextureProjectionType.Cylindrical,this.coords=new t.CoordSystem(e,n.Clone().SetLength(o),t.VectorCross(i,n).SetLength(o),i)},t.BodyTextureProjection.prototype.Transform=function(t){this.coords.ToAbsoluteCoords(),this.coords.origo=t.Apply(this.coords.origo),this.coords.e1=t.Apply(this.coords.e1),this.coords.e2=t.Apply(this.coords.e2),this.coords.e3=t.Apply(this.coords.e3),this.coords.ToDirectionVectors()},t.BodyTextureProjection.prototype.Clone=function(){var e=new t.BodyTextureProjection;return e.SetType(this.type),e.SetCoords(this.coords.Clone()),e},t.Body=function(){this.Clear()},t.Body.prototype.AddVertex=function(t){return this.vertices.push(t),this.vertices.length-1},t.Body.prototype.AddPoint=function(t){return this.points.push(t),this.points.length-1},t.Body.prototype.AddLine=function(t){return this.lines.push(t),this.lines.length-1},t.Body.prototype.AddPolygon=function(t){return this.polygons.push(t),this.polygons.length-1},t.Body.prototype.GetVertex=function(t){return this.vertices[t]},t.Body.prototype.GetVertexPosition=function(t){return this.vertices[t].position},t.Body.prototype.SetVertexPosition=function(t,e){this.vertices[t].position=e},t.Body.prototype.GetPoint=function(t){return this.points[t]},t.Body.prototype.GetLine=function(t){return this.lines[t]},t.Body.prototype.GetPolygon=function(t){return this.polygons[t]},t.Body.prototype.SetPointsMaterialIndex=function(t){var e;for(e=0;e<this.points.length;e++)this.points[e].SetMaterialIndex(t)},t.Body.prototype.SetLinesMaterialIndex=function(t){var e;for(e=0;e<this.lines.length;e++)this.lines[e].SetMaterialIndex(t)},t.Body.prototype.SetPolygonsMaterialIndex=function(t){var e;for(e=0;e<this.polygons.length;e++)this.polygons[e].SetMaterialIndex(t)},t.Body.prototype.SetPolygonsCurveGroup=function(t){var e;for(e=0;e<this.polygons.length;e++)this.polygons[e].SetCurveGroup(t)},t.Body.prototype.RemoveVertex=function(t){var e,o,n,i,r,s,p=[],y=[],d=[];for(e=0;e<this.points.length;e++)(n=this.points[e]).GetVertexIndex()==t?p.push(e):n.GetVertexIndex()>=t&&n.SetVertexIndex(n.GetVertexIndex()-1);for(e=0;e<this.lines.length;e++)(i=this.lines[e]).GetBegVertexIndex()==t||i.GetEndVertexIndex()==t?y.push(e):(i.GetBegVertexIndex()>=t&&i.SetBegVertexIndex(i.GetBegVertexIndex()-1),i.GetEndVertexIndex()>=t&&i.SetEndVertexIndex(i.GetEndVertexIndex()-1));for(e=0;e<this.polygons.length;e++)for(r=this.polygons[e],o=0;o<r.VertexIndexCount();o++){if(s=r.GetVertexIndex(o),r.GetVertexIndex(o)==t){d.push(e);break}s>=t&&r.SetVertexIndex(o,s-1)}for(e=0;e<p.length;e++)this.RemovePoint(p[e]-e);for(e=0;e<y.length;e++)this.RemoveLine(y[e]-e);for(e=0;e<d.length;e++)this.RemovePolygon(d[e]-e);this.vertices.splice(t,1)},t.Body.prototype.RemovePoint=function(t){this.points.splice(t,1)},t.Body.prototype.RemoveLine=function(t){this.lines.splice(t,1)},t.Body.prototype.RemovePolygon=function(t){this.polygons.splice(t,1)},t.Body.prototype.VertexCount=function(){return this.vertices.length},t.Body.prototype.PointCount=function(){return this.points.length},t.Body.prototype.LineCount=function(){return this.lines.length},t.Body.prototype.PolygonCount=function(){return this.polygons.length},t.Body.prototype.GetTextureProjection=function(){return this.projection},t.Body.prototype.SetTextureProjection=function(t){this.projection=t},t.Body.prototype.SetPlanarTextureProjection=function(t,e,o){this.projection.SetPlanar(t,e,o)},t.Body.prototype.SetCubicTextureProjection=function(t,e,o,n){this.projection.SetCubic(t,e,o,n)},t.Body.prototype.SetCylindricalTextureProjection=function(t,e,o,n){this.projection.SetCylindrical(t,e,o,n)},t.Body.prototype.Transform=function(t){var e;for(e=0;e<this.vertices.length;e++)this.vertices[e].position=t.Apply(this.vertices[e].position);this.projection.Transform(t)},t.Body.prototype.GetBoundingBox=function(){var e,o,n=new t.Coord(t.Inf,t.Inf,t.Inf),i=new t.Coord(-t.Inf,-t.Inf,-t.Inf);for(e=0;e<this.vertices.length;e++)o=this.vertices[e].position,n.x=t.Minimum(n.x,o.x),n.y=t.Minimum(n.y,o.y),n.z=t.Minimum(n.z,o.z),i.x=t.Maximum(i.x,o.x),i.y=t.Maximum(i.y,o.y),i.z=t.Maximum(i.z,o.z);return new t.Box(n,i)},t.Body.prototype.GetCenter=function(){return this.GetBoundingBox().GetCenter()},t.Body.prototype.GetBoundingSphere=function(){var e,o,n=this.GetCenter(),i=0;for(e=0;e<this.vertices.length;e++)o=n.DistanceTo(this.vertices[e].position),t.IsGreater(o,i)&&(i=o);return new t.Sphere(n,i)},t.Body.prototype.OffsetToOrigo=function(){var e,o=this.GetCenter().Clone();for(o.MultiplyScalar(-1),e=0;e<this.vertices.length;e++)this.vertices[e].position=t.CoordAdd(this.vertices[e].position,o)},t.Body.prototype.Merge=function(t){var e,o,n,i,r,s=this.vertices.length;for(e=0;e<t.VertexCount();e++)this.vertices.push(t.GetVertex(e).Clone());for(e=0;e<t.PointCount();e++)(n=t.GetPoint(e).Clone()).SetVertexIndex(n.GetVertexIndex()+s),this.points.push(n);for(e=0;e<t.LineCount();e++)(i=t.GetLine(e).Clone()).SetBegVertexIndex(i.GetBegVertexIndex()+s),i.SetEndVertexIndex(i.GetEndVertexIndex()+s),this.lines.push(i);for(e=0;e<t.PolygonCount();e++){for(r=t.GetPolygon(e).Clone(),o=0;o<r.VertexIndexCount();o++)r.vertices[o]+=s;this.polygons.push(r)}},t.Body.prototype.Clear=function(){this.vertices=[],this.points=[],this.lines=[],this.polygons=[],this.projection=new t.BodyTextureProjection},t.Body.prototype.Clone=function(){var e,o=new t.Body;for(e=0;e<this.vertices.length;e++)o.AddVertex(this.vertices[e].Clone());for(e=0;e<this.points.length;e++)o.AddPoint(this.points[e].Clone());for(e=0;e<this.lines.length;e++)o.AddLine(this.lines[e].Clone());for(e=0;e<this.polygons.length;e++)o.AddPolygon(this.polygons[e].Clone());return o.SetTextureProjection(this.projection.Clone()),o},t});
//# sourceMappingURL=../sourcemaps/modeler/body.js.map