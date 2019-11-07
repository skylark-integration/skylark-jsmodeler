/**
* Function: SvgToModel
* Description: Converts an svg objects rect, path and polygon elements to a body.
* Parameters:
*	svgObject {html svg element} the svg element
*	height {number} the height of the result body
*	segmentLength {number} the maximum length of curved segments
*	curveAngle {number} if not null, defines the curve angle of the model
* Returns:
*	{Model} the result
*/
JSM.SvgToModel = function (svgObject, height, segmentLength, curveAngle)
{
	function SegmentElem (elem, segmentLength)
	{
		function AddTransformedVertex (dummySVG, result, elem, x, y)
		{
			var point = dummySVG.createSVGPoint ();
			point.x = x;
			point.y = y;
			
			var transformed = point;
			var matrix = elem.getCTM ();
			if (matrix !== undefined && matrix !== null) {
				transformed = point.matrixTransform (matrix);				
			}
			var transformedCoord = new JSM.Coord2D (transformed.x, transformed.y);
			var resultCoord = new JSM.Coord2D (x, y);
			
			var contour = result.GetLastContour ();
			var contourVertexCount = contour.VertexCount ();
			if (contourVertexCount > 0) {
				if (contour.GetVertex (contourVertexCount - 1).IsEqualWithEps (transformedCoord, 0.1)) {
					return resultCoord;
				}
			}
			
			contour.AddVertex (transformed.x, transformed.y);
			return resultCoord;
		}

		function SegmentCurve (dummySVG, originalPath, segmentLength, lastCoord, items, result)
		{
			function CreatePath (items)
			{
				function GenerateMoveCommand (x, y)
				{
					return 'M ' + x + ' ' + y + ' ';
				}
			
				var svgNameSpace = 'http://www.w3.org/2000/svg';
				var path = document.createElementNS (svgNameSpace, 'path');

				var commandString = GenerateMoveCommand (lastCoord.x, lastCoord.y);
				var i, item, command, largeArcFlag, sweepFlag;
				for (i = 0; i < items.length; i++) {
					item = items[i];
					if (item.pathSegType == SVGPathSeg.PATHSEG_CURVETO_CUBIC_ABS ||
						item.pathSegType == SVGPathSeg.PATHSEG_CURVETO_CUBIC_REL) {
						command = (item.pathSegType == SVGPathSeg.PATHSEG_CURVETO_CUBIC_ABS ? 'C' : 'c');
						commandString += command + ' ' + item.x1 + ' ' + item.y1 + ' ' + item.x2 + ' ' + item.y2 + ' ' + item.x + ' ' + item.y + ' ';
					} else if (	item.pathSegType == SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_ABS ||
								item.pathSegType == SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_REL){
						command = (item.pathSegType == SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_ABS ? 'Q' : 'q');
						commandString += command + ' ' + item.x1 + ' ' + item.y1 + ' ' + item.x + ' ' + item.y + ' ';
					} else if (	item.pathSegType == SVGPathSeg.PATHSEG_ARC_ABS ||
								item.pathSegType == SVGPathSeg.PATHSEG_ARC_REL){
						command = (item.pathSegType == SVGPathSeg.PATHSEG_ARC_ABS ? 'A' : 'a');
						largeArcFlag = (item.largeArcFlag ? 1 : 0);
						sweepFlag = (item.sweepFlag ? 1 : 0);
						commandString +=  command + ' ' + item.r1 + ' ' + item.r2 + ' ' + item.angle + ' ' + largeArcFlag + ' ' + sweepFlag + ' ' + item.x + ' ' + item.y + ' ';
					} else if (	item.pathSegType == SVGPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_ABS ||
								item.pathSegType == SVGPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_REL){
						command = (item.pathSegType == SVGPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_ABS ? 'S' : 's');
						commandString +=  command + ' ' + item.x2 + ' ' + item.y2 + ' ' + item.x + ' ' + item.y + ' ';
					} else {
						// unknown segment type
					}
				}
				
				path.setAttributeNS (null, 'd', commandString);
				return path;
			}
		
			var path = CreatePath (items);
			var pathLength = path.getTotalLength ();

			var segmentation = 0;
			if (segmentLength > 0) {
				segmentation = parseInt (pathLength / segmentLength, 10);
			}
			if (segmentation < 3) {
				segmentation = 3;
			}
			
			var step = pathLength / segmentation;
			var i, point;
			for (i = 1; i <= segmentation; i++) {
				point = path.getPointAtLength (i * step);
				lastCoord = AddTransformedVertex (dummySVG, result, originalPath, point.x, point.y);
			}
			
			return lastCoord;
		}
		
		function IsCurvedItem (item)
		{
			return	item.pathSegType == SVGPathSeg.PATHSEG_CURVETO_CUBIC_ABS ||
					item.pathSegType == SVGPathSeg.PATHSEG_CURVETO_CUBIC_REL ||
					item.pathSegType == SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_ABS ||
					item.pathSegType == SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_REL ||
					item.pathSegType == SVGPathSeg.PATHSEG_ARC_ABS ||
					item.pathSegType == SVGPathSeg.PATHSEG_ARC_REL ||
					item.pathSegType == SVGPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_ABS ||
					item.pathSegType == SVGPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_REL;
		}
		
		function IsSmoothItem (item)
		{
			return	item.pathSegType == SVGPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_ABS ||
					item.pathSegType == SVGPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_REL;
		}

		function RemoveEqualEndVertices (polygon)
		{
			var contour = polygon.GetLastContour ();
			var vertexCount = contour.VertexCount ();
			if (vertexCount === 0) {
				return;
			}
			
			var firstCoord = contour.GetVertex (0);
			var lastCoord = contour.GetVertex (vertexCount - 1);
			if (firstCoord.IsEqualWithEps (lastCoord, 0.1)) {
				// TODO: Do not access vertices directly
				contour.vertices.pop ();
			}
		}
	
		function StartNewContour (result)
		{
			if (result.GetLastContour ().VertexCount () > 0) {
				RemoveEqualEndVertices (result);
				result.AddContour ();
			}
		}
	
		function SVGColorToHex (path)
		{
			var svgColor = '';
			var target = path;
			while (target !== null && target !== undefined && svgColor.length === 0) {
				svgColor = target.getAttribute ('fill');
				if (svgColor === null) {
					svgColor = target.style.fill;
				}
				target = target.parentElement;
			}

			var result = 0x000000;
			if (svgColor.length === 0) {
				return result;
			}
			
			if (svgColor[0] == '#') {
				result = JSM.HexColorToRGBColor (svgColor.substring (1));
			} else {
				var firstBracket = svgColor.indexOf ('(');
				var secondBracket = svgColor.indexOf (')');
				if (firstBracket == -1 || secondBracket == -1) {
					return result;
				}
				
				var numbers = svgColor.substring (firstBracket + 1, secondBracket);
				var rgb = numbers.split (', ');
				if (rgb.length != 3) {
					return result;
				}
				
				result = JSM.RGBComponentsToHexColor (rgb[0], rgb[1], rgb[2]);
			}
			
			return result;
		}
	
		var result = new JSM.ContourPolygon2D ();
		result.AddContour ();

		var dummySVG = document.createElementNS ('http://www.w3.org/2000/svg', 'svg');

		var i, j;
		if (elem instanceof SVGPathElement) {
			var lastCoord = new JSM.Coord2D (0.0, 0.0);
			var lastMoveCoord = new JSM.Coord2D (0.0, 0.0);

			var currentSegmentLength = segmentLength;
			if (elem.hasAttribute ('segmentlength')) {
				currentSegmentLength = parseFloat (elem.getAttribute ('segmentlength'));
			}
			
			var item, items, currentItem;
			for (i = 0; i < elem.pathSegList.numberOfItems; i++) {
				item = elem.pathSegList.getItem (i);
				if (item.pathSegType == SVGPathSeg.PATHSEG_CLOSEPATH) {
					// do nothing
				} else if (item.pathSegType == SVGPathSeg.PATHSEG_MOVETO_ABS) {
					StartNewContour (result);
					lastCoord = AddTransformedVertex (dummySVG, result, elem, item.x, item.y);
					lastMoveCoord = lastCoord.Clone ();
				} else if (item.pathSegType == SVGPathSeg.PATHSEG_MOVETO_REL) {
					StartNewContour (result);
					lastCoord = AddTransformedVertex (dummySVG, result, elem, lastMoveCoord.x + item.x, lastMoveCoord.y + item.y);
					lastMoveCoord = lastCoord.Clone ();
				} else if (item.pathSegType == SVGPathSeg.PATHSEG_LINETO_ABS) {
					lastCoord = AddTransformedVertex (dummySVG, result, elem, item.x, item.y);
				} else if (item.pathSegType == SVGPathSeg.PATHSEG_LINETO_REL) {
					lastCoord = AddTransformedVertex (dummySVG, result, elem, lastCoord.x + item.x, lastCoord.y + item.y);
				} else if (item.pathSegType == SVGPathSeg.PATHSEG_LINETO_HORIZONTAL_ABS) {
					lastCoord = AddTransformedVertex (dummySVG, result, elem, item.x, lastCoord.y);
				} else if (item.pathSegType == SVGPathSeg.PATHSEG_LINETO_VERTICAL_ABS) {
					lastCoord = AddTransformedVertex (dummySVG, result, elem, lastCoord.x, item.y);
				} else if (item.pathSegType == SVGPathSeg.PATHSEG_LINETO_HORIZONTAL_REL) {
					lastCoord = AddTransformedVertex (dummySVG, result, elem, lastCoord.x + item.x, lastCoord.y);
				} else if (item.pathSegType == SVGPathSeg.PATHSEG_LINETO_VERTICAL_REL) {
					lastCoord = AddTransformedVertex (dummySVG, result, elem, lastCoord.x, lastCoord.y + item.y);
				} else if (IsCurvedItem (item)) {
					items = [];
					if (IsSmoothItem (item)) {
						for (j = i; j < elem.pathSegList.numberOfItems; j++) {
							currentItem = elem.pathSegList.getItem (j);
							if (!IsSmoothItem (currentItem)) {
								break;
							}
							items.push (currentItem);
						}
						i = j - 1;
					} else {
						items.push (item);
					}
					lastCoord = SegmentCurve (dummySVG, elem, currentSegmentLength, lastCoord, items, result);
				} else {
					// unknown segment type
				}
			}
			
			RemoveEqualEndVertices (result);
		} else if (elem instanceof SVGRectElement) {
			AddTransformedVertex (dummySVG, result, elem, elem.x.baseVal.value, elem.y.baseVal.value);
			AddTransformedVertex (dummySVG, result, elem, elem.x.baseVal.value + elem.width.baseVal.value, elem.y.baseVal.value);
			AddTransformedVertex (dummySVG, result, elem, elem.x.baseVal.value + elem.width.baseVal.value, elem.y.baseVal.value + elem.height.baseVal.value);
			AddTransformedVertex (dummySVG, result, elem, elem.x.baseVal.value, elem.y.baseVal.value + elem.height.baseVal.value);
		} else if (elem instanceof SVGPolygonElement) {
			var point;
			for (i = 0; i < elem.points.numberOfItems; i++) {
				point = elem.points.getItem (i);
				AddTransformedVertex (dummySVG, result, elem, point.x, point.y);
			}
		}
		result.color = SVGColorToHex (elem);
		result.originalElem = elem;
		return result;
	}
	
	function SegmentPaths (svgObject, segmentLength)
	{
		function AddElemType (svgObject, elemType, result)
		{
			var elems = svgObject.getElementsByTagName (elemType);
			var i;
			for (i = 0; i < elems.length; i++) {
				result.push (elems[i]);
			}
		}
	
		var result = [];
		var elems = [];
		AddElemType (svgObject, 'path', elems);
		AddElemType (svgObject, 'rect', elems);
		AddElemType (svgObject, 'polygon', elems);
		
		var currentSegmentLength = segmentLength;
		if (svgObject.hasAttribute ('segmentlength')) {
			currentSegmentLength = parseFloat (svgObject.getAttribute ('segmentlength'));
		}

		var i, current;
		for (i = 0; i < elems.length; i++) {
			current = SegmentElem (elems[i], currentSegmentLength);
			result.push (current);
		}
		
		return result;
	}
	
	function ContourPolygonToPrisms (polygon, height, curveAngle)
	{
		function AppendPolygonVertices (polygon, vertexArray, reversed)
		{
			var i, coord;
			if (!reversed) {
				for (i = 0; i < polygon.VertexCount (); i++) {
					coord = polygon.GetVertex (i);
					vertexArray.push (new JSM.Coord (coord.x, -coord.y, 0.0));
				}
			} else {
				for (i = polygon.VertexCount () - 1; i >= 0; i--) {
					coord = polygon.GetVertex (i);
					vertexArray.push (new JSM.Coord (coord.x, -coord.y, 0.0));
				}
			}
		}
		
		function CreateBasePolygon (polygon)
		{
			var basePolygon = [];
			var orientation = polygon.GetOrientation ();
			var reversed = (orientation == JSM.Orientation.CounterClockwise);
			AppendPolygonVertices (polygon, basePolygon, reversed);
			return basePolygon;
		}
	
		function AddHoleToBasePolygon (basePolygon, holePolygon)
		{
			basePolygon.push (null);
			var orientation = holePolygon.GetOrientation ();
			var reversed = (orientation == JSM.Orientation.Clockwise);
			AppendPolygonVertices (holePolygon, basePolygon, reversed);
		}

		var prisms = [];
		var direction = new JSM.Vector (0.0, 0.0, 1.0);
		
		var currentHeight = height;
		if (polygon.originalElem !== undefined) {
			if (polygon.originalElem.hasAttribute ('modelheight')) {
				currentHeight = parseFloat (polygon.originalElem.getAttribute ('modelheight'));
			}
		}
		
		var basePolygon, baseOrientation, prism;
		var contourCount = polygon.ContourCount ();
		if (contourCount === 0) {
			return null;
		}
		
		if (contourCount == 1) {
			baseOrientation = polygon.GetContour (0).GetOrientation ();
			basePolygon = CreateBasePolygon (polygon.GetContour (0));
			prism = JSM.GeneratePrism (basePolygon, direction, currentHeight, true, curveAngle);
			prisms.push (prism);
		} else if (contourCount > 1) {
			baseOrientation = polygon.GetContour (0).GetOrientation ();
			var holeBasePolygon = CreateBasePolygon (polygon.GetContour (0));
			var hasHoles = false;
			
			var i, orientation;
			for (i = 1; i < polygon.ContourCount (); i++) {
				orientation = polygon.GetContour (i).GetOrientation ();
				if (orientation == baseOrientation) {
					basePolygon = CreateBasePolygon (polygon.GetContour (i));
					prism = JSM.GeneratePrism (basePolygon, direction, currentHeight, true, curveAngle);
					prisms.push (prism);
				} else {
					AddHoleToBasePolygon (holeBasePolygon, polygon.GetContour (i));
					hasHoles = true;
				}
			}
			
			if (!hasHoles) {
				prism = JSM.GeneratePrism (holeBasePolygon, direction, currentHeight, true, curveAngle);
				prisms.push (prism);
			} else {
				prism = JSM.GeneratePrismWithHole (holeBasePolygon, direction, currentHeight, true, curveAngle);
				prisms.push (prism);
			}
		}
		
		var material = new JSM.Material ({ambient : polygon.color, diffuse : polygon.color});
		return [prisms, material];
	}
	
	var model = new JSM.Model ();
	var polygons = SegmentPaths (svgObject, segmentLength);

	var currentHeight = height;
	if (svgObject.hasAttribute ('modelheight')) {
		currentHeight = parseFloat (svgObject.getAttribute ('modelheight'));
	}
	
	var i, j, prismsAndMaterial, currentPrisms, currentPrism, currentMaterial;
	for (i = 0; i < polygons.length; i++) {
		prismsAndMaterial = ContourPolygonToPrisms (polygons[i], currentHeight, curveAngle);
		if (prismsAndMaterial === null) {
			continue;
		}
		currentPrisms = prismsAndMaterial[0];
		currentMaterial = prismsAndMaterial[1];
		model.AddMaterial (currentMaterial);
		for (j = 0; j < currentPrisms.length; j++) {
			currentPrism = currentPrisms[j];
			currentPrism.SetPolygonsMaterialIndex (model.MaterialCount () - 1);
			model.AddBody (currentPrism);
		}
	}

	return model;
};
