JSM.ThreeViewer = function ()
{
	this.canvas = null;
	
	this.scene = null;
	this.camera = null;
	this.renderer = null;
	this.ambientLight = null;
	this.directionalLight = null;
	this.runBeforeRender = null;
	this.runAfterRender = null;

	this.cameraMove = null;
	this.navigation = null;
	this.settings = null;
	this.drawLoop = null;
	this.enableDraw = null;
};

JSM.ThreeViewer.prototype.Start = function (canvas, settings)
{
	if (!JSM.IsWebGLEnabled ()) {
		return false;
	}

	if (!this.InitSettings (settings)) {
		return false;
	}
	
	if (!this.InitThree (canvas)) {
		return false;
	}

	if (!this.InitCamera (settings)) {
		return false;
	}

	if (!this.InitLights ()) {
		return false;
	}
	
	this.drawLoop = false;
	this.enableDraw = true;
	this.DrawIfNeeded ();
	return true;
};

JSM.ThreeViewer.prototype.InitSettings = function (settings)
{
	this.settings = {
		cameraEyePosition : new JSM.Coord (1.0, 1.0, 1.0),
		cameraCenterPosition : new JSM.Coord (0.0, 0.0, 0.0),
		cameraUpVector : new JSM.Coord (0.0, 0.0, 1.0),
		lightAmbientColor : [0.5, 0.5, 0.5],
		lightDiffuseColor : [0.5, 0.5, 0.5]
	};

	if (settings !== undefined) {
		if (settings.cameraEyePosition !== undefined) { this.settings.cameraEyePosition = JSM.CoordFromArray (settings.cameraEyePosition); }
		if (settings.cameraCenterPosition !== undefined) { this.settings.cameraCenterPosition = JSM.CoordFromArray (settings.cameraCenterPosition); }
		if (settings.cameraUpVector !== undefined) { this.settings.cameraUpVector = JSM.CoordFromArray (settings.cameraUpVector); }
		if (settings.lightAmbientColor !== undefined) { this.settings.lightAmbientColor = settings.lightAmbientColor; }
		if (settings.lightDiffuseColor !== undefined) { this.settings.lightDiffuseColor = settings.lightDiffuseColor; }
	}

	return true;
};

JSM.ThreeViewer.prototype.InitThree = function (canvas)
{
	this.canvas = canvas;
	if (!this.canvas || !this.canvas.getContext) {
		return false;
	}

	this.scene = new THREE.Scene();
	if (!this.scene) {
		return false;
	}

	var parameters = {
		canvas : this.canvas,
		antialias : true
	};
	this.renderer = new THREE.WebGLRenderer (parameters);
	if (!this.renderer) {
		return false;
	}
	
	this.renderer.setClearColor (new THREE.Color (0xffffff));
	this.renderer.setSize (this.canvas.width, this.canvas.height);
	return true;
};

JSM.ThreeViewer.prototype.InitCamera = function (settings)
{
	this.cameraMove = new JSM.Camera (
		JSM.CoordFromArray (settings.cameraEyePosition),
		JSM.CoordFromArray (settings.cameraCenterPosition),
		JSM.CoordFromArray (settings.cameraUpVector),
		settings.fieldOfView,
		settings.nearClippingPlane,
		settings.farClippingPlane
	);
	if (!this.cameraMove) {
		return false;
	}

	this.navigation = new JSM.Navigation ();
	if (!this.navigation.Init (this.canvas, this.cameraMove, this.DrawIfNeeded.bind (this), this.Resize.bind (this))) {
		return false;
	}
	
	this.camera = new THREE.PerspectiveCamera (this.cameraMove.fieldOfView, this.canvas.width / this.canvas.height, this.cameraMove.nearClippingPlane, this.cameraMove.farClippingPlane);
	if (!this.camera) {
		return false;
	}
	
	this.scene.add (this.camera);
	return true;
};

JSM.ThreeViewer.prototype.InitLights = function ()
{
	var ambientColor = new THREE.Color ();
	var diffuseColor = new THREE.Color ();
	ambientColor.setRGB (this.settings.lightAmbientColor[0], this.settings.lightAmbientColor[1], this.settings.lightAmbientColor[2]);
	diffuseColor.setRGB (this.settings.lightDiffuseColor[0], this.settings.lightDiffuseColor[1], this.settings.lightDiffuseColor[2]);

	this.ambientLight = new THREE.AmbientLight (ambientColor.getHex ());
	if (!this.ambientLight) {
		return false;
	}

	this.scene.add (this.ambientLight);
	
	this.directionalLight = new THREE.DirectionalLight (diffuseColor.getHex ());
	if (!this.directionalLight) {
		return false;
	}
	
	var lightPosition = new THREE.Vector3 ().subVectors (this.cameraMove.eye, this.cameraMove.center);
	this.directionalLight.position.set (lightPosition.x, lightPosition.y, lightPosition.z);

	this.scene.add (this.directionalLight);
	return true;
};

JSM.ThreeViewer.prototype.SetRunBeforeRender = function (runBeforeRender)
{
	this.runBeforeRender = runBeforeRender;
};

JSM.ThreeViewer.prototype.SetRunAfterRender = function (runAfterRender)
{
	this.runAfterRender = runAfterRender;
};

JSM.ThreeViewer.prototype.SetClearColor = function (color)
{
	this.renderer.setClearColor (new THREE.Color (color));
	this.DrawIfNeeded ();
};

JSM.ThreeViewer.prototype.AddMesh = function (mesh)
{
	this.scene.add (mesh);
	this.DrawIfNeeded ();
};

JSM.ThreeViewer.prototype.AddMeshes = function (meshes)
{
	var i;
	for (i = 0; i < meshes.length; i++) {
		this.scene.add (meshes[i]);
	}
	this.DrawIfNeeded ();
};

JSM.ThreeViewer.prototype.MeshCount = function ()
{
	var count = 0;
	
	var myThis = this;
	this.scene.traverse (function (current) {
		if (myThis.IsRelevantObject (current)) {
			count = count + 1;
		}
	});
	
	return count;
};

JSM.ThreeViewer.prototype.VisibleMeshCount = function ()
{
	var count = 0;
	
	var myThis = this;
	this.scene.traverse (function (current) {
		if (myThis.IsVisibleObject (current)) {
			count = count + 1;
		}
	});
	
	return count;
};

JSM.ThreeViewer.prototype.VertexCount = function ()
{
	var count = 0;
	
	var myThis = this;
	this.scene.traverse (function (current) {
		if (myThis.IsRelevantObject (current)) {
			count = count + current.geometry.vertices.length;
		}
	});
	
	return count;
};

JSM.ThreeViewer.prototype.FaceCount = function ()
{
	var count = 0;
	
	this.scene.traverse (function (current) {
		if (current instanceof THREE.Mesh) {
			count = count + current.geometry.faces.length;
		}
	});
	
	return count;
};

JSM.ThreeViewer.prototype.GetMesh = function (index)
{
	var current = null;
	var currIndex = 0;
	
	var i;
	for (i = 0; i < this.scene.children.length; i++) {
		current = this.scene.children[i];
		if (this.IsRelevantObject (current)) {
			if (currIndex == index) {
				return current;
			}
			currIndex = currIndex + 1;
		}
	}
	
	return null;
};

JSM.ThreeViewer.prototype.ShowMesh = function (mesh)
{
	mesh.visible = true;
	this.DrawIfNeeded ();
};

JSM.ThreeViewer.prototype.HideMesh = function (mesh)
{
	mesh.visible = false;
	this.DrawIfNeeded ();
};

JSM.ThreeViewer.prototype.RemoveMesh = function (mesh)
{
	mesh.geometry.dispose ();
	this.scene.remove (mesh);
	this.DrawIfNeeded ();
};

JSM.ThreeViewer.prototype.RemoveMeshes = function ()
{
	var current;
	var i;
	for (i = 0; i < this.scene.children.length; i++) {
		current = this.scene.children[i];
		if (this.IsRelevantObject (current)) {
			current.geometry.dispose ();
			this.scene.remove (current);
			i--;
		}
	}
	this.DrawIfNeeded ();
};

JSM.ThreeViewer.prototype.RemoveLastMesh = function ()
{
	var found = null;
	
	var myThis = this;
	this.scene.traverse (function (current) {
		if (myThis.IsRelevantObject (current)) {
			found = current;
		}
	});
	
	if (found !== null) {
		this.scene.remove (found);
	}
	
	this.DrawIfNeeded ();
};

JSM.ThreeViewer.prototype.SetCamera = function (eye, center, up)
{
	this.navigation.SetCamera (eye, center, up);
	this.navigation.SetOrbitCenter (center.Clone ());
	this.DrawIfNeeded ();
};

JSM.ThreeViewer.prototype.Resize = function ()
{
	this.camera.aspect = this.canvas.width / this.canvas.height;
	this.camera.updateProjectionMatrix ();
	this.renderer.setSize (this.canvas.width, this.canvas.height);
	this.DrawIfNeeded ();
};

JSM.ThreeViewer.prototype.FitInWindow = function ()
{
	if (this.VisibleMeshCount () === 0) {
		return;
	}
	
	var sphere = this.GetBoundingSphere ();
	this.navigation.FitInWindow (sphere.GetCenter (), sphere.GetRadius ());
	this.DrawIfNeeded ();
};

JSM.ThreeViewer.prototype.FitMeshesInWindow = function (meshes)
{
	if (meshes.length === 0) {
		return;
	}
	var sphere = this.GetFilteredBoundingSphere (function (obj) {
		return meshes.indexOf (obj) != -1;
	});
	this.navigation.FitInWindow (sphere.GetCenter (), sphere.GetRadius ());
	this.DrawIfNeeded ();
};

JSM.ThreeViewer.prototype.AdjustClippingPlanes = function (radiusLimit)
{
	var sphere = this.GetBoundingSphere ();
	if (sphere.GetRadius () < radiusLimit) {
		this.camera.near = 0.1;
		this.camera.far = 1000.0;
	} else {
		this.camera.near = 10.0;
		this.camera.far = 1000000.0;
	}
	this.camera.updateProjectionMatrix ();
	this.Draw ();
};

JSM.ThreeViewer.prototype.GetCenter = function ()
{
	var myThis = this;
	return this.GetFilteredCenter (function (obj) {
		return myThis.IsVisibleObject (obj);
	});
};

JSM.ThreeViewer.prototype.GetBoundingBox = function ()
{
	var myThis = this;
	return this.GetFilteredBoundingBox (function (obj) {
		return myThis.IsVisibleObject (obj);
	});
};

JSM.ThreeViewer.prototype.GetBoundingSphere = function ()
{
	var myThis = this;
	return this.GetFilteredBoundingSphere (function (obj) {
		return myThis.IsVisibleObject (obj);
	});
};

JSM.ThreeViewer.prototype.GetFilteredCenter = function (needToProcess)
{
	var boundingBox = this.GetFilteredBoundingBox (needToProcess);
	return boundingBox.GetCenter ();
};

JSM.ThreeViewer.prototype.GetFilteredBoundingBox = function (needToProcess)
{
	var min = new JSM.Coord (JSM.Inf, JSM.Inf, JSM.Inf);
	var max = new JSM.Coord (-JSM.Inf, -JSM.Inf, -JSM.Inf);
	
	var geometry, coord;
	this.scene.traverse (function (current) {
		if (needToProcess (current)) {
			geometry = current.geometry;
			var j;
			for (j = 0; j < geometry.vertices.length; j++) {
				coord = geometry.vertices[j].clone ();
				coord.add (current.position);
				min.x = JSM.Minimum (min.x, coord.x);
				min.y = JSM.Minimum (min.y, coord.y);
				min.z = JSM.Minimum (min.z, coord.z);
				max.x = JSM.Maximum (max.x, coord.x);
				max.y = JSM.Maximum (max.y, coord.y);
				max.z = JSM.Maximum (max.z, coord.z);
			}
		}
	});

	return new JSM.Box (min, max);
};

JSM.ThreeViewer.prototype.GetFilteredBoundingSphere = function (needToProcess)
{
	var center = this.GetFilteredCenter (needToProcess);
	var radius = 0.0;

	var geometry, coord, distance;
	this.scene.traverse (function (current) {
		if (needToProcess (current)) {
			geometry = current.geometry;
			var j;
			for (j = 0; j < geometry.vertices.length; j++) {
				coord = geometry.vertices[j].clone ();
				coord.add (current.position);
				distance = center.DistanceTo (new JSM.Coord (coord.x, coord.y, coord.z));
				if (JSM.IsGreater (distance, radius)) {
					radius = distance;
				}
			}
		}
	});

	var sphere = new JSM.Sphere (center, radius);
	return sphere;
};

JSM.ThreeViewer.prototype.GetObjectsUnderPosition = function (x, y)
{
	var mouseX = (x / this.canvas.width) * 2 - 1;
	var mouseY = -(y / this.canvas.height) * 2 + 1;

	var cameraPosition = this.camera.position;
	var vector = new THREE.Vector3 (mouseX, mouseY, 0.5);
	vector.unproject (this.camera);
	vector.sub (cameraPosition);
	vector.normalize ();

	var ray = new THREE.Raycaster (cameraPosition, vector);
	return ray.intersectObjects (this.scene.children);
};

JSM.ThreeViewer.prototype.GetObjectsUnderMouse = function ()
{
	return this.GetObjectsUnderPosition (this.navigation.mouse.curr.x, this.navigation.mouse.curr.y);
};

JSM.ThreeViewer.prototype.GetObjectsUnderTouch = function ()
{
	return this.GetObjectsUnderPosition (this.navigation.touch.curr.x, this.navigation.touch.curr.y);
};

JSM.ThreeViewer.prototype.ProjectVector = function (x, y, z)
{
	var width = this.canvas.width;
	var height = this.canvas.height;
	var halfWidth = width / 2;
	var halfHeight = height / 2;

	var vector = new THREE.Vector3 (x, y, z);
	vector.project (this.camera);
	vector.x = (vector.x * halfWidth) + halfWidth;
	vector.y = -(vector.y * halfHeight) + halfHeight;
	return vector;
};

JSM.ThreeViewer.prototype.EnableDraw = function (enable)
{
	this.enableDraw = enable;
};

JSM.ThreeViewer.prototype.Draw = function ()
{
	if (!this.enableDraw) {
		return;
	}

	if (this.runBeforeRender !== null) {
		this.runBeforeRender ();
	}

	this.camera.position.set (this.cameraMove.eye.x, this.cameraMove.eye.y, this.cameraMove.eye.z);
	this.camera.up.set (this.cameraMove.up.x, this.cameraMove.up.y, this.cameraMove.up.z);
	this.camera.lookAt (new THREE.Vector3 (this.cameraMove.center.x, this.cameraMove.center.y, this.cameraMove.center.z));

	var lightPosition = new THREE.Vector3 ().subVectors (this.cameraMove.eye, this.cameraMove.center);
	this.directionalLight.position.set (lightPosition.x, lightPosition.y, lightPosition.z);

	this.renderer.render (this.scene, this.camera);
	
	if (this.runAfterRender !== null) {
		this.runAfterRender ();
	}
	
	if (this.drawLoop) {
		requestAnimationFrame (this.Draw.bind (this));
	}
};

JSM.ThreeViewer.prototype.DrawIfNeeded = function ()
{
	if (!this.drawLoop) {
		this.Draw ();
	}
};

JSM.ThreeViewer.prototype.StartDrawLoop = function ()
{
	this.drawLoop = true;
	this.Draw ();
};

JSM.ThreeViewer.prototype.IsRelevantObject = function (threeObj)
{
	return (threeObj instanceof THREE.Mesh || threeObj instanceof THREE.LineSegments || threeObj instanceof THREE.Points);
};

JSM.ThreeViewer.prototype.IsVisibleObject = function (threeObj)
{
	return this.IsRelevantObject (threeObj) && threeObj.visible;
};
