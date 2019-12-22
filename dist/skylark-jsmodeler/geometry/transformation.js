/**
 * skylark-jsmodeler - A version of jsmodeler that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-jsmodeler/
 * @license MIT
 */
define(["../core/jsm"],function(n){return n.Transformation=function(){this.matrix=n.MatrixIdentity()},n.Transformation.prototype.GetMatrix=function(){return this.matrix},n.Transformation.prototype.SetMatrix=function(n){this.matrix=n},n.Transformation.prototype.Append=function(t){this.matrix=n.MatrixMultiply(this.matrix,t.matrix)},n.Transformation.prototype.Apply=function(t){return n.ApplyTransformation(this.matrix,t)},n.Transformation.prototype.Clone=function(){var t=new n.Transformation;return t.matrix=n.MatrixClone(this.matrix),t},n.IdentityTransformation=function(){var t=new n.Transformation;return t.matrix=n.MatrixIdentity(),t},n.TranslationTransformation=function(t){var r=new n.Transformation;return r.matrix=n.MatrixTranslation(t.x,t.y,t.z),r},n.OffsetTransformation=function(t,r){var o=t.Clone().Normalize().Clone().MultiplyScalar(r);return n.TranslationTransformation(o)},n.RotationTransformation=function(t,r,o){var a=new n.Transformation;return a.matrix=n.MatrixRotation(t,r,o),a},n.RotationXTransformation=function(t,r){var o=new n.Transformation;return void 0===r||null===r?o.matrix=n.MatrixRotationX(t):(o.Append(n.TranslationTransformation(new n.Vector(-r.x,-r.y,-r.z))),o.Append(n.RotationXTransformation(t)),o.Append(n.TranslationTransformation(new n.Vector(r.x,r.y,r.z)))),o},n.RotationYTransformation=function(t,r){var o=new n.Transformation;return void 0===r||null===r?o.matrix=n.MatrixRotationY(t):(o.Append(n.TranslationTransformation(new n.Vector(-r.x,-r.y,-r.z))),o.Append(n.RotationYTransformation(t)),o.Append(n.TranslationTransformation(new n.Vector(r.x,r.y,r.z)))),o},n.RotationZTransformation=function(t,r){var o=new n.Transformation;return void 0===r||null===r?o.matrix=n.MatrixRotationZ(t):(o.Append(n.TranslationTransformation(new n.Vector(-r.x,-r.y,-r.z))),o.Append(n.RotationZTransformation(t)),o.Append(n.TranslationTransformation(new n.Vector(r.x,r.y,r.z)))),o},n.RotationXYZTransformation=function(t,r,o,a){var i=new n.Transformation;return i.Append(n.RotationXTransformation(t,a)),i.Append(n.RotationYTransformation(r,a)),i.Append(n.RotationZTransformation(o,a)),i},n});
//# sourceMappingURL=../sourcemaps/geometry/transformation.js.map
