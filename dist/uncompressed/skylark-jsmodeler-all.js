/**
 * skylark-jsmodeler - A version of jsmodeler that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-jsmodeler/
 * @license MIT
 */
(function(factory,globals) {
  var define = globals.define,
      require = globals.require,
      isAmd = (typeof define === 'function' && define.amd),
      isCmd = (!isAmd && typeof exports !== 'undefined');

  if (!isAmd && !define) {
    var map = {};
    function absolute(relative, base) {
        if (relative[0]!==".") {
          return relative;
        }
        var stack = base.split("/"),
            parts = relative.split("/");
        stack.pop(); 
        for (var i=0; i<parts.length; i++) {
            if (parts[i] == ".")
                continue;
            if (parts[i] == "..")
                stack.pop();
            else
                stack.push(parts[i]);
        }
        return stack.join("/");
    }
    define = globals.define = function(id, deps, factory) {
        if (typeof factory == 'function') {
            map[id] = {
                factory: factory,
                deps: deps.map(function(dep){
                  return absolute(dep,id);
                }),
                resolved: false,
                exports: null
            };
            require(id);
        } else {
            map[id] = {
                factory : null,
                resolved : true,
                exports : factory
            };
        }
    };
    require = globals.require = function(id) {
        if (!map.hasOwnProperty(id)) {
            throw new Error('Module ' + id + ' has not been defined');
        }
        var module = map[id];
        if (!module.resolved) {
            var args = [];

            module.deps.forEach(function(dep){
                args.push(require(dep));
            })

            module.exports = module.factory.apply(globals, args) || null;
            module.resolved = true;
        }
        return module.exports;
    };
  }
  
  if (!define) {
     throw new Error("The module utility (ex: requirejs or skylark-utils) is not loaded!");
  }

  factory(define,require);

  if (!isAmd) {
    var skylarkjs = require("skylark-langx/skylark");

    if (isCmd) {
      module.exports = skylarkjs;
    } else {
      globals.skylarkjs  = skylarkjs;
    }
  }

})(function(define,require) {

define('skylark-langx-ns/_attach',[],function(){
    return  function attach(obj1,path,obj2) {
        if (typeof path == "string") {
            path = path.split(".");//[path]
        };
        var length = path.length,
            ns=obj1,
            i=0,
            name = path[i++];

        while (i < length) {
            ns = ns[name] = ns[name] || {};
            name = path[i++];
        }

        return ns[name] = obj2;
    }
});
define('skylark-langx-ns/ns',[
    "./_attach"
], function(_attach) {
    var skylark = {
    	attach : function(path,obj) {
    		return _attach(skylark,path,obj);
    	}
    };
    return skylark;
});

define('skylark-langx-ns/main',[
	"./ns"
],function(skylark){
	return skylark;
});
define('skylark-langx-ns', ['skylark-langx-ns/main'], function (main) { return main; });

define('skylark-langx/skylark',[
    "skylark-langx-ns"
], function(ns) {
	return ns;
});

define('skylark-jsmodeler/core/jsm',[],function(){
	var JSM = function ()
	{
		this.mainVersion = 0;
		this.subVersion = 45;
	};

	/**
	* Function: RandomNumber
	* Description: Generates a random number between two numbers.
	* Parameters:
	*	from {number} lowest random result
	*	to {number} highest random result
	* Returns:
	*	{number} the result
	*/
	JSM.RandomNumber = function (from, to)
	{
		return Math.random () * (to - from) + from;
	};

	/**
	* Function: RandomInt
	* Description: Generates a random integer between two integers.
	* Parameters:
	*	from {integer} lowest random result
	*	to {integer} highest random result
	* Returns:
	*	{integer} the result
	*/
	JSM.RandomInt = function (from, to)
	{
		return Math.floor ((Math.random () * (to - from + 1)) + from);
	};

	/**
	* Function: RandomBoolean
	* Description: Generates a random boolean value.
	* Returns:
	*	{boolean} the result
	*/
	JSM.RandomBoolean = function ()
	{
		return JSM.RandomInt (0, 1) === 1;
	};

	/**
	* Function: SeededRandomInt
	* Description: Generates a random integer between two integers. A seed number can be specified.
	* Parameters:
	*	from {integer} lowest random result
	*	to {integer} highest random result
	*	seed {integer} seed value
	* Returns:
	*	{integer} the result
	*/
	JSM.SeededRandomInt = function (from, to, seed)
	{
	    var random = ((seed * 9301 + 49297) % 233280) / 233280;
		return Math.floor ((random * (to - from + 1)) + from);
	};

	/**
	* Function: ValueOrDefault
	* Description: Returns the given value, or a default if it is undefined.
	* Parameters:
	*	val {anything} new value
	*	def {anything} default value
	* Returns:
	*	{anything} the result
	*/
	JSM.ValueOrDefault = function (val, def)
	{
		if (val === undefined || val === null) {
			return def;
		}
		return val;
	};

	/**
	* Function: PrevIndex
	* Description: Returns the circular previous index for an array with the given length.
	* Parameters:
	*	index {integer} the index
	*	length {integer} the number of indices
	*/
	JSM.PrevIndex = function (index, length)
	{
		return index > 0 ? index - 1 : length - 1;
	};

	/**
	* Function: NextIndex
	* Description: Returns the circular next index for an array with the given length.
	* Parameters:
	*	index {integer} the index
	*	length {integer} the number of indices
	*/
	JSM.NextIndex = function (index, length)
	{
		return index < length - 1 ? index + 1 : 0;
	};

	/**
	* Function: CopyObjectProperties
	* Description: Copies one object properties to another object.
	* Parameters:
	*	source {anything} source object
	*	target {anything} target object
	*	overwrite {boolean} overwrite existing properties
	*/
	JSM.CopyObjectProperties = function (source, target, overwrite)
	{
		if (source === undefined || source === null ||
			target === undefined || target === null)
		{
			return;
		}

		var property;
		for (property in source) {
			if (source.hasOwnProperty (property)) {
				if (overwrite || target[property] === undefined || target[property] === null) {
					target[property] = source[property];
				}
			}
		}
	};

	/**
	* Function: GetObjectProperty
	* Description: Returns the given property of the object. If it doesn't exist, returns the given default value.
	* Parameters:
	*	object {anything} the object
	*	propertyName {string} the name of the property
	*	defaultValue {anything} the default value
	*/
	JSM.GetObjectProperty = function (object, propertyName, defaultValue)
	{
		if (object === undefined || object === null) {
			return defaultValue;
		}

		var propertyValue = object[propertyName];
		if (propertyValue === undefined || propertyValue === null) {
			return defaultValue;
		}
		
		return propertyValue;
	};

	/**
	* Function: Message
	* Description: Writes a message to the console.
	* Parameters:
	*	message {string} the message
	*/
	JSM.Message = function (message)
	{
		console.log ('JSModeler: ' + message);
	};

	return JSM;
});



define('skylark-jsmodeler/core/timer',["./jsm"],function(JSM){
	/**
	* Class: Timer
	* Description: Utility class for time measure.
	*/
	JSM.Timer = function ()	{
		this.start = 0;
		this.stop = 0;
	};

	/**
	* Function: Timer.Start
	* Description: Starts the timer.
	*/
	JSM.Timer.prototype.Start = function ()	{
		var date = new Date ();
		this.start = date.getTime ();
	};

	/**
	* Function: Timer.Stop
	* Description: Stops the timer.
	*/
	JSM.Timer.prototype.Stop = function ()	{
		var date = new Date ();
		this.end = date.getTime ();
	};

	/**
	* Function: Timer.Result
	* Description: Returns the time between start and stop.
	* Returns:
	*	{number} The result.
	*/
	JSM.Timer.prototype.Result = function (){
		return (this.end - this.start);
	};

	/**
	* Class: FPSCounter
	* Description:
	*	Utility class for FPS count. It calculates the frames and returns FPS count for the last interval
	*	with the given length. The Get function should called in every frame.
	*/
	JSM.FPSCounter = function (){
		this.start = null;
		this.frames = null;
		this.current = null;
	};

	/**
	* Function: FPSCounter.Get
	* Description: Returns the FPS count for the last interval with the given length.
	* Parameters:
	*	interval {integer} the interval length in milliseconds
	* Returns:
	*	{integer} The result.
	*/
	JSM.FPSCounter.prototype.Get = function (interval)	{
		var date = new Date ();
		var end = date.getTime ();
		if (this.start === null) {
			this.start = end;
			this.frames = 0;
			this.current = 0;
		}

		if (interval === null || interval === undefined) {
			interval = 1000;
		}
		
		this.frames = this.frames + 1;
		var elapsed = end - this.start;
		if (elapsed >= interval) {
			this.current = 1000 * (this.frames / elapsed);
			this.start = end;
			this.frames = 0;
		}

		return parseInt (this.current, 10);
	};

	return JSM;
});

define('skylark-jsmodeler/core/algorithm',["./jsm"],function(JSM){

	/**
	* Function: SwapArrayValues
	* Description: Swaps to array values.
	* Parameters:
	*	array {anything[]} the array
	*	from {integer} from index
	*	to {integer} to index
	*/
	JSM.SwapArrayValues = function (array, from, to){
		var temp = array[from];
		array[from] = array[to];
		array[to] = temp;
	};

	/**
	* Function: BubbleSort
	* Description: Sorts an array with bubble sort.
	* Parameters:
	*	array {anything[]} the array to sort
	*	onCompare {function} the compare function
	*	onSwap {function} the swap function
	*/
	JSM.BubbleSort = function (array, onCompare, onSwap){
		if (array.length < 2) {
			return false;
		}

		var compareFunction = onCompare;
		if (compareFunction === undefined || compareFunction === null) {
			return false;
		}
		
		var swapFunction = onSwap;
		if (swapFunction === undefined || swapFunction === null) {
			swapFunction = function (i, j) {
				JSM.SwapArrayValues (array, i, j);
			};
		}
		
		var i, j;
		for (i = 0; i < array.length - 1; i++) {
			for (j = 0; j < array.length - i - 1; j++) {
				if (!compareFunction (array[j], array[j + 1])) {
					swapFunction (j, j + 1);
				}
			}
		}
		
		return true;
	};

	/**
	* Function: ShiftArray
	* Description: Shifts an array.
	* Parameters:
	*	array {anything[]} the array to shift
	*	count {integer} shift count
	*/
	JSM.ShiftArray = function (array, count){
		var i;
		for (i = 0; i < count; i++) {
			array.push (array.shift ());
		}
	};

	return JSM;
});

define('skylark-jsmodeler/core/async',["./jsm"],function(JSM){
	/**
	* Function: AsyncRunTask
	* Description:
	*	Calls a function multiple times asynchronously. If the environment
	*	is not specified, it will run synchronously.
	* Parameters:
	*	taskFunction {function} the function to run
	*	callbacks {object} callbacks for start, process, and finish
	*	runCount {integer} the count of runs
	*	timeout {integer} the timeout between runs
	*	userData {anything} task specific data
	*/
	JSM.AsyncRunTask = function (taskFunction, callbacks, runCount, timeout, userData)
	{
		function OnStart (runCount, userData, callbacks)
		{
			if (callbacks.onStart !== undefined && callbacks.onStart !== null) {
				callbacks.onStart (runCount, userData);
			}
		}

		function OnProgress (currentCount, userData, callbacks)
		{
			if (callbacks.onProgress !== undefined && callbacks.onProgress !== null) {
				callbacks.onProgress (currentCount, userData);
			}
		}
		
		function OnFinished (userData, callbacks)
		{
			if (callbacks.onFinish !== undefined && callbacks.onFinish !== null) {
				callbacks.onFinish (userData);
			}
		}

		function RunTask (currentCount, userData, callbacks)
		{
			var needContinue = taskFunction ();
			OnProgress (currentCount, userData, callbacks);
			if (needContinue && currentCount < runCount - 1) {
				setTimeout (function () {
					RunTask (currentCount + 1, userData, callbacks);
				}, timeout);
			} else {
				setTimeout (function () {
					OnFinished (userData, callbacks);
				}, timeout);
			}
		}
		
		if (callbacks === undefined || callbacks === null) {
			var i, needContinue;
			for (i = 0; i < runCount; i++) {
				needContinue = taskFunction ();
				if (!needContinue) {
					break;
				}
			}
			return;
		}
		
		OnStart (runCount, userData, callbacks);
		RunTask (0, userData, callbacks);
	};

	return JSM;
});

define('skylark-jsmodeler/core/check',["./jsm"],function(JSM){
	/**
	* Function: IsWebGLEnabled
	* Description: Returns if WebGL is enabled in the browser.
	* Returns:
	*	{boolean} the result
	*/
	JSM.IsWebGLEnabled = function (){
		if (!window.WebGLRenderingContext) {
			return false;
		}
		
		try {
			var canvas = document.createElement ('canvas');
			if (!canvas.getContext ('experimental-webgl') && !canvas.getContext ('webgl')) {
				return false;
			}
		} catch (exception) {
			return false;
		}
		
		return true;
	};

	/**
	* Function: IsFileApiEnabled
	* Description: Returns if file api is enabled in the browser.
	* Returns:
	*	{boolean} the result
	*/
	JSM.IsFileApiEnabled = function ()	{
		if (!window.File || !window.FileReader || !window.FileList || !window.Blob || !window.URL) {
			return false;
		}
		
		return true;
	};

	return JSM;
});

define('skylark-jsmodeler/core/jsonloader',["./jsm"],function(JSM){
	/**
	* Function: LoadJsonFile
	* Description: Loads a json file, and calls a callback with the parsed json.
	* Parameters:
	*	fileName {string} the name of the json
	*	onReady {function} the callback
	*/
	JSM.LoadJsonFile = function (fileName, onReady)	{
		var request = new XMLHttpRequest ();
		request.overrideMimeType ('application/json');
		request.open ('GET', fileName, true);
		request.onreadystatechange = function () {
			if (request.readyState == 4) {
				var jsonData = JSON.parse (request.responseText);
				onReady (jsonData);
			}
		};
		request.send (null);
	};

	return JSM;
});

define('skylark-jsmodeler/geometry/definitions',["../core/jsm"],function(JSM){
	JSM.Eps = 0.00000001;
	JSM.Inf = 9999999999;
	JSM.RadDeg = 57.29577951308232;
	JSM.DegRad = 0.017453292519943;

	/**
	* Function: IsZero
	* Description: Determines if the given value is near zero. Uses epsilon for comparison.
	* Parameters:
	*	a {number} the value
	* Returns:
	*	{boolean} the result
	*/
	JSM.IsZero = function (a)
	{
		return Math.abs (a) < JSM.Eps;
	};

	/**
	* Function: IsPositive
	* Description: Determines if the given value is positive. Uses epsilon for comparison.
	* Parameters:
	*	a {number} the value
	* Returns:
	*	{boolean} the result
	*/
	JSM.IsPositive = function (a)
	{
		return a > JSM.Eps;
	};

	/**
	* Function: IsNegative
	* Description: Determines if the given value is negative. Uses epsilon for comparison.
	* Parameters:
	*	a {number} the value
	* Returns:
	*	{boolean} the result
	*/
	JSM.IsNegative = function (a)
	{
		return a < -JSM.Eps;
	};

	/**
	* Function: IsLower
	* Description: Determines if a value is lower than an other. Uses epsilon for comparison.
	* Parameters:
	*	a {number} first value
	*	b {number} second value
	* Returns:
	*	{boolean} the result
	*/
	JSM.IsLower = function (a, b)
	{
		return b - a > JSM.Eps;
	};

	/**
	* Function: IsGreater
	* Description: Determines if a value is greater than an other. Uses epsilon for comparison.
	* Parameters:
	*	a {number} first value
	*	b {number} second value
	* Returns:
	*	{boolean} the result
	*/
	JSM.IsGreater = function (a, b)
	{
		return a - b > JSM.Eps;
	};

	/**
	* Function: IsEqual
	* Description: Determines if two values are equal. Uses epsilon for comparison.
	* Parameters:
	*	a {number} first value
	*	b {number} second value
	* Returns:
	*	{boolean} the result
	*/
	JSM.IsEqual = function (a, b)
	{
		return Math.abs (b - a) < JSM.Eps;
	};

	/**
	* Function: IsEqualWithEps
	* Description: Determines if two values are equal. Uses the given epsilon for comparison.
	* Parameters:
	*	a {number} first value
	*	b {number} second value
	*	eps {number} epsilon value
	* Returns:
	*	{boolean} the result
	*/
	JSM.IsEqualWithEps = function (a, b, eps)
	{
		return Math.abs (b - a) < eps;
	};

	/**
	* Function: IsLowerOrEqual
	* Description: Determines if a value is lower or equal to an other. Uses epsilon for comparison.
	* Parameters:
	*	a {number} first value
	*	b {number} second value
	* Returns:
	*	{boolean} the result
	*/
	JSM.IsLowerOrEqual = function (a, b)
	{
		return JSM.IsLower (a, b) || JSM.IsEqual (a, b);
	};

	/**
	* Function: IsGreaterOrEqual
	* Description: Determines if a value is greater or equal to an other. Uses epsilon for comparison.
	* Parameters:
	*	a {number} first value
	*	b {number} second value
	* Returns:
	*	{boolean} the result
	*/
	JSM.IsGreaterOrEqual = function (a, b)
	{
		return JSM.IsGreater (a, b) || JSM.IsEqual (a, b);
	};

	/**
	* Function: Minimum
	* Description: Returns the minimum of two values. Uses epsilon for comparison.
	* Parameters:
	*	a {number} first value
	*	b {number} second value
	* Returns:
	*	{number} the result
	*/
	JSM.Minimum = function (a, b)
	{
		return JSM.IsLower (a, b) ? a : b;
	};

	/**
	* Function: Maximum
	* Description: Returns the maximum of two values. Uses epsilon for comparison.
	* Parameters:
	*	a {number} first value
	*	b {number} second value
	* Returns:
	*	{number} the result
	*/
	JSM.Maximum = function (a, b)
	{
		return JSM.IsGreater (a, b) ? a : b;
	};

	/**
	* Function: ArcSin
	* Description: Calculates the arcus sinus value.
	* Parameters:
	*	value {number} the value
	* Returns:
	*	{number} the result
	*/
	JSM.ArcSin = function (value)
	{
		if (JSM.IsGreaterOrEqual (value, 1.0)) {
			return Math.PI / 2.0;
		} else if (JSM.IsLowerOrEqual (value, -1.0)) {
			return - Math.PI / 2.0;
		}
		
		return Math.asin (value);
	};

	/**
	* Function: ArcCos
	* Description: Calculates the arcus cosinus value.
	* Parameters:
	*	value {number} the value
	* Returns:
	*	{number} the result
	*/
	JSM.ArcCos = function (value)
	{
		if (JSM.IsGreaterOrEqual (value, 1.0)) {
			return 0.0;
		} else if (JSM.IsLowerOrEqual (value, -1.0)) {
			return Math.PI;
		}
		
		return Math.acos (value);
	};

	return JSM;
});

define('skylark-jsmodeler/geometry/coord2d',["../core/jsm"],function(JSM){
	/**
	* Class: Coord2D
	* Description: Represents a 2D coordinate.
	* Parameters:
	*	x {number} the first component
	*	y {number} the second component
	*/
	JSM.Coord2D = function (x, y)
	{
		this.x = x;
		this.y = y;
	};

	/**
	* Function: Coord2D.Set
	* Description: Sets the coordinate.
	* Parameters:
	*	x {number} the first component
	*	y {number} the second component
	*/
	JSM.Coord2D.prototype.Set = function (x, y)
	{
		this.x = x;
		this.y = y;
	};

	/**
	* Function: Coord2D.IsEqual
	* Description: Returns if the coordinate is equal with the given one.
	* Parameters:
	*	coord {Coord2D} the coordinate
	* Returns:
	*	{boolean} the result
	*/
	JSM.Coord2D.prototype.IsEqual = function (coord)
	{
		return JSM.IsEqual (this.x, coord.x) && JSM.IsEqual (this.y, coord.y);
	};

	/**
	* Function: Coord2D.IsEqualWithEps
	* Description: Returns if the coordinate is equal with the given one. Uses the given epsilon for comparison.
	* Parameters:
	*	coord {Coord2D} the coordinate
	*	eps {number} the epsilon
	* Returns:
	*	{boolean} the result
	*/
	JSM.Coord2D.prototype.IsEqualWithEps = function (coord, eps)
	{
		return JSM.IsEqualWithEps (this.x, coord.x, eps) && JSM.IsEqualWithEps (this.y, coord.y, eps);
	};

	/**
	* Function: Coord2D.DistanceTo
	* Description: Calculates the coordinate distance to the given one.
	* Parameters:
	*	coord {Coord2D} the coordinate
	* Returns:
	*	{number} the result
	*/
	JSM.Coord2D.prototype.DistanceTo = function (coord)
	{
		return Math.sqrt ((coord.x - this.x) * (coord.x - this.x) + (coord.y - this.y) * (coord.y - this.y));
	};

	/**
	* Function: Coord2D.AngleTo
	* Description: Calculates the coordinate vector angle to the given one.
	* Parameters:
	*	coord {Coord2D} the coordinate
	* Returns:
	*	{number} the result
	*/
	JSM.Coord2D.prototype.AngleTo = function (coord)
	{
		var aDirection = this.Clone ().Normalize ();
		var bDirection = coord.Clone ().Normalize ();
		if (aDirection.IsEqual (bDirection)) {
			return 0.0;
		}
		var product = JSM.VectorDot2D (aDirection, bDirection);
		return JSM.ArcCos (product);
	};

	/**
	* Function: Coord2D.Length
	* Description: Calculates the length of the coordinate vector.
	* Returns:
	*	{number} the result
	*/
	JSM.Coord2D.prototype.Length = function ()
	{
		return Math.sqrt (this.x * this.x + this.y * this.y);
	};

	/**
	* Function: Coord2D.MultiplyScalar
	* Description: Multiplies the vector with a scalar.
	* Parameters:
	*	scalar {number} the scalar
	* Returns:
	*	{Coord2D} this pointer
	*/
	JSM.Coord2D.prototype.MultiplyScalar = function (scalar)
	{
		this.x *= scalar;
		this.y *= scalar;
		return this;
	};

	/**
	* Function: Coord2D.Normalize
	* Description: Normalizes the coordinate vector.
	* Returns:
	*	{Coord2D} this pointer
	*/
	JSM.Coord2D.prototype.Normalize = function ()
	{
		var length = this.Length ();
		if (JSM.IsPositive (length)) {
			this.MultiplyScalar (1.0 / length);
		}
		return this;
	};

	/**
	* Function: Coord2D.SetLength
	* Description: Sets the length of the coordinate vector.
	* Parameters:
	*	length {number} the length
	* Returns:
	*	{Coord2D} this pointer
	*/
	JSM.Coord2D.prototype.SetLength = function (length)
	{
		var thisLength = this.Length ();
		if (JSM.IsPositive (thisLength)) {
			this.MultiplyScalar (length / thisLength);
		}
		return this;
	};

	/**
	* Function: Coord2D.Offset
	* Description: Offsets the coordinate.
	* Parameters:
	*	direction {Vector2D} the direction of the offset
	*	distance {number} the distance of the offset
	* Returns:
	*	{Coord2D} this pointer
	*/
	JSM.Coord2D.prototype.Offset = function (direction, distance)
	{
		var normal = direction.Clone ().Normalize ();
		this.x += normal.x * distance;
		this.y += normal.y * distance;
		return this;
	};

	/**
	* Function: Coord2D.Rotate
	* Description: Rotates the coordinate.
	* Parameters:
	*	angle {number} the angle of the rotation
	*	origo {Coord2D} the origo of the rotation
	* Returns:
	*	{Coord2D} this pointer
	*/
	JSM.Coord2D.prototype.Rotate = function (angle, origo)
	{
		var x = this.x - origo.x;
		var y = this.y - origo.y;
		var co = Math.cos (angle);
		var si = Math.sin (angle);
		this.x = x * co - y * si + origo.x;
		this.y = x * si + y * co + origo.y;
		return this;
	};

	/**
	* Function: Coord2D.ToString
	* Description: Converts the coordinate values to string.
	* Returns:
	*	{string} the string representation of the coordinate
	*/
	JSM.Coord2D.prototype.ToString = function ()
	{
		return ('(' + this.x + ', ' + this.y + ')');
	};

	/**
	* Function: Coord2D.Clone
	* Description: Clones the coordinate.
	* Returns:
	*	{Coord2D} a cloned instance
	*/
	JSM.Coord2D.prototype.Clone = function ()
	{
		return new JSM.Coord2D (this.x, this.y);
	};

	/**
	* Class: Vector2D
	* Description: Same as Coord2D.
	*/
	JSM.Vector2D = JSM.Coord2D;

	/**
	* Function: CoordFromArray2D
	* Description: Returns a coordinate from an array of components.
	* Parameters:
	*	array {number[2]} the array of components
	* Returns:
	*	{Coord2D} the result
	*/
	JSM.CoordFromArray2D = function (array)
	{
		return new JSM.Coord2D (array[0], array[1]);
	};

	/**
	* Function: CoordToArray2D
	* Description: Returns array of components from a coordinate.
	* Parameters:
	*	coord {Coord2D} the coordinate
	* Returns:
	*	array {number[2]} the result
	*/
	JSM.CoordToArray2D = function (coord)
	{
		return [coord.x, coord.y];
	};

	/**
	* Function: CoordAdd2D
	* Description: Adds two coordinates.
	* Parameters:
	*	a {Coord2D} the first coordinate
	*	b {Coord2D} the second coordinate
	* Returns:
	*	{Coord2D} the result
	*/
	JSM.CoordAdd2D = function (a, b)
	{
		return new JSM.Coord2D (a.x + b.x, a.y + b.y);
	};

	/**
	* Function: CoordSub2D
	* Description: Subs two coordinates.
	* Parameters:
	*	a {Coord2D} the first coordinate
	*	b {Coord2D} the second coordinate
	* Returns:
	*	{Coord2D} the result
	*/
	JSM.CoordSub2D = function (a, b)
	{
		return new JSM.Coord2D (a.x - b.x, a.y - b.y);
	};

	/**
	* Function: VectorDot2D
	* Description: Calculates the dot product of two vectors.
	* Parameters:
	*	a {Vector2D} the first vector
	*	b {Vector2D} the second vector
	* Returns:
	*	{number} the result
	*/
	JSM.VectorDot2D = function (a, b)
	{
		return a.x * b.x + a.y * b.y;
	};

	return JSM;
});

define('skylark-jsmodeler/geometry/coord',["../core/jsm"],function(JSM){
	/**
	* Class: Coord
	* Description: Represents a 3D coordinate.
	* Parameters:
	*	x {number} the first component
	*	y {number} the second component
	*	z {number} the third component
	*/
	JSM.Coord = function (x, y, z)
	{
		this.x = x;
		this.y = y;
		this.z = z;
	};

	/**
	* Function: Coord.Set
	* Description: Sets the coordinate.
	* Parameters:
	*	x {number} the first component
	*	y {number} the second component
	*	z {number} the third component
	*/
	JSM.Coord.prototype.Set = function (x, y, z)
	{
		this.x = x;
		this.y = y;
		this.z = z;
	};

	/**
	* Function: Coord.IsEqual
	* Description: Returns if the coordinate is equal with the given one.
	* Parameters:
	*	coord {Coord} the coordinate
	* Returns:
	*	{boolean} the result
	*/
	JSM.Coord.prototype.IsEqual = function (coord)
	{
		return JSM.IsEqual (this.x, coord.x) && JSM.IsEqual (this.y, coord.y) && JSM.IsEqual (this.z, coord.z);
	};

	/**
	* Function: Coord.IsEqualWithEps
	* Description: Returns if the coordinate is equal with the given one. Uses the given epsilon for comparison.
	* Parameters:
	*	coord {Coord} the coordinate
	*	eps {number} the epsilon
	* Returns:
	*	{boolean} the result
	*/
	JSM.Coord.prototype.IsEqualWithEps = function (coord, eps)
	{
		return JSM.IsEqualWithEps (this.x, coord.x, eps) && JSM.IsEqualWithEps (this.y, coord.y, eps) && JSM.IsEqualWithEps (this.z, coord.z, eps);
	};

	/**
	* Function: Coord.DistanceTo
	* Description: Calculates the coordinate distance to the given one.
	* Parameters:
	*	coord {Coord} the coordinate
	* Returns:
	*	{number} the result
	*/
	JSM.Coord.prototype.DistanceTo = function (coord)
	{
		return Math.sqrt ((coord.x - this.x) * (coord.x - this.x) + (coord.y - this.y) * (coord.y - this.y) + (coord.z - this.z) * (coord.z - this.z));
	};

	/**
	* Function: Coord.AngleTo
	* Description: Calculates the coordinate vector angle to the given one.
	* Parameters:
	*	coord {Coord} the coordinate
	* Returns:
	*	{number} the result
	*/
	JSM.Coord.prototype.AngleTo = function (coord)
	{
		var aDirection = this.Clone ().Normalize ();
		var bDirection = coord.Clone ().Normalize ();
		if (aDirection.IsEqual (bDirection)) {
			return 0.0;
		}
		var product = JSM.VectorDot (aDirection, bDirection);
		return JSM.ArcCos (product);
	};

	/**
	* Function: Coord.IsCollinearWith
	* Description: Returns if the coordinate vector is collinear with the given one.
	* Parameters:
	*	coord {Coord} the coordinate
	* Returns:
	*	{boolean} the result
	*/
	JSM.Coord.prototype.IsCollinearWith = function (coord)
	{
		var angle = this.AngleTo (coord);
		return JSM.IsEqual (angle, 0.0) || JSM.IsEqual (angle, Math.PI);
	};

	/**
	* Function: Coord.IsPerpendicularWith
	* Description: Returns if the coordinate vector is perpendicular with the given one.
	* Parameters:
	*	coord {Coord} the coordinate
	* Returns:
	*	{boolean} the result
	*/
	JSM.Coord.prototype.IsPerpendicularWith = function (coord)
	{
		var angle = this.AngleTo (coord);
		return JSM.IsEqual (angle, Math.PI / 2.0);
	};

	/**
	* Function: Coord.Length
	* Description: Calculates the length of the coordinate vector.
	* Returns:
	*	{number} the result
	*/
	JSM.Coord.prototype.Length = function ()
	{
		return Math.sqrt (this.x * this.x + this.y * this.y + this.z * this.z);
	};

	/**
	* Function: Coord.Add
	* Description: Adds the given coordinate to coordinate.
	* Parameters:
	*	coord {Coord} the coordinate
	*/
	JSM.Coord.prototype.Add = function (coord)
	{
		this.x += coord.x;
		this.y += coord.y;
		this.z += coord.z;
	};

	/**
	* Function: Coord.Sub
	* Description: Subs the given coordinate from coordinate.
	* Parameters:
	*	coord {Coord} the coordinate
	*/
	JSM.Coord.prototype.Sub = function (coord)
	{
		this.x -= coord.x;
		this.y -= coord.y;
		this.z -= coord.z;
	};

	/**
	* Function: Coord.MultiplyScalar
	* Description: Multiplies the vector with a scalar.
	* Parameters:
	*	scalar {number} the scalar
	* Returns:
	*	{Coord} this pointer
	*/
	JSM.Coord.prototype.MultiplyScalar = function (scalar)
	{
		this.x *= scalar;
		this.y *= scalar;
		this.z *= scalar;
		return this;
	};

	/**
	* Function: Coord.Normalize
	* Description: Normalizes the coordinate vector.
	* Returns:
	*	{Coord} this pointer
	*/
	JSM.Coord.prototype.Normalize = function ()
	{
		var length = this.Length ();
		if (JSM.IsPositive (length)) {
			this.MultiplyScalar (1.0 / length);
		}
		return this;
	};

	/**
	* Function: Coord.SetLength
	* Description: Sets the length of the coordinate vector.
	* Parameters:
	*	length {number} the length
	* Returns:
	*	{Coord} this pointer
	*/
	JSM.Coord.prototype.SetLength = function (length)
	{
		var thisLength = this.Length ();
		if (JSM.IsPositive (thisLength)) {
			this.MultiplyScalar (length / thisLength);
		}
		return this;
	};

	/**
	* Function: Coord.Offset
	* Description: Offsets the coordinate.
	* Parameters:
	*	direction {Vector} the direction of the offset
	*	distance {number} the distance of the offset
	* Returns:
	*	{Coord} this pointer
	*/
	JSM.Coord.prototype.Offset = function (direction, distance)
	{
		var normal = direction.Clone ().Normalize ();
		this.x += normal.x * distance;
		this.y += normal.y * distance;
		this.z += normal.z * distance;
		return this;
	};

	/**
	* Function: Coord.Rotate
	* Description: Rotates the coordinate.
	* Parameters:
	*	axis {Vector} the axis of the rotation
	*	angle {number} the angle of the rotation
	*	origo {Coord} the origo of the rotation
	* Returns:
	*	{Coord} this pointer
	*/

	JSM.Coord.prototype.Rotate = function (axis, angle, origo)
	{
		var normal = axis.Clone ().Normalize ();

		var u = normal.x;
		var v = normal.y;
		var w = normal.z;

		var x = this.x - origo.x;
		var y = this.y - origo.y;
		var z = this.z - origo.z;

		var si = Math.sin (angle);
		var co = Math.cos (angle);
		this.x = - u * (- u * x - v * y - w * z) * (1.0 - co) + x * co + (- w * y + v * z) * si;
		this.y = - v * (- u * x - v * y - w * z) * (1.0 - co) + y * co + (w * x - u * z) * si;
		this.z = - w * (- u * x - v * y - w * z) * (1.0 - co) + z * co + (- v * x + u * y) * si;
		
		this.x += origo.x;
		this.y += origo.y;
		this.z += origo.z;
		return this;
	};

	/**
	* Function: Coord.ToCoord2D
	* Description: Converts the coordinate to a 2D coordinate.
	* Parameters:
	*	normal {Vector} the normal vector for conversion
	* Returns:
	*	{Coord2D} the result
	*/
	JSM.Coord.prototype.ToCoord2D = function (normal)
	{
		var origo = new JSM.Coord (0.0, 0.0, 0.0);
		var zNormal = new JSM.Vector (0.0, 0.0, 1.0);
		var axis = JSM.VectorCross (normal, zNormal);
		var angle = normal.AngleTo (zNormal);
		var rotated = this.Clone ().Rotate (axis, angle, origo);
		return new JSM.Coord2D (rotated.x, rotated.y);
	};

	/**
	* Function: Coord.ToString
	* Description: Converts the coordinate values to string.
	* Returns:
	*	{string} the string representation of the coordinate
	*/
	JSM.Coord.prototype.ToString = function ()
	{
		return ('(' + this.x + ', ' + this.y + ', ' + this.z + ')');
	};

	/**
	* Function: Coord.Clone
	* Description: Clones the coordinate.
	* Returns:
	*	{Coord} a cloned instance
	*/
	JSM.Coord.prototype.Clone = function ()
	{
		return new JSM.Coord (this.x, this.y, this.z);
	};

	/**
	* Class: Vector
	* Description: Same as Coord.
	*/
	JSM.Vector = JSM.Coord;

	/**
	* Function: CoordFromArray
	* Description: Returns a coordinate from an array of components.
	* Parameters:
	*	array {number[3]} the array of components
	* Returns:
	*	{Coord} the result
	*/
	JSM.CoordFromArray = function (array)
	{
		return new JSM.Coord (array[0], array[1], array[2]);
	};

	/**
	* Function: CoordToArray
	* Description: Returns array of components from a coordinate.
	* Parameters:
	*	coord {Coord} the coordinate
	* Returns:
	*	array {number[3]} the result
	*/
	JSM.CoordToArray = function (coord)
	{
		return [coord.x, coord.y, coord.z];
	};

	/**
	* Function: CoordAdd
	* Description: Adds two coordinates.
	* Parameters:
	*	a {Coord} the first coordinate
	*	b {Coord} the second coordinate
	* Returns:
	*	{Coord} the result
	*/
	JSM.CoordAdd = function (a, b)
	{
		return new JSM.Coord (a.x + b.x, a.y + b.y, a.z + b.z);
	};

	/**
	* Function: CoordSub
	* Description: Subs two coordinates.
	* Parameters:
	*	a {Coord} the first coordinate
	*	b {Coord} the second coordinate
	* Returns:
	*	{Coord} the result
	*/
	JSM.CoordSub = function (a, b)
	{
		return new JSM.Coord (a.x - b.x, a.y - b.y, a.z - b.z);
	};

	/**
	* Function: VectorDot
	* Description: Calculates the dot product of two vectors.
	* Parameters:
	*	a {Vector} the first vector
	*	b {Vector} the second vector
	* Returns:
	*	{number} the result
	*/
	JSM.VectorDot = function (a, b)
	{
		return a.x * b.x + a.y * b.y + a.z * b.z;
	};

	/**
	* Function: VectorCross
	* Description: Calculates the cross product of two vectors.
	* Parameters:
	*	a {Vector} the first vector
	*	b {Vector} the second vector
	* Returns:
	*	{Vector} the result
	*/
	JSM.VectorCross = function (a, b)
	{
		var result = new JSM.Vector (0.0, 0.0, 0.0);
		result.x = a.y * b.z - a.z * b.y;
		result.y = a.z * b.x - a.x * b.z;
		result.z = a.x * b.y - a.y * b.x;
		return result;
	};

	return JSM;
});

define('skylark-jsmodeler/geometry/determinant',["../core/jsm"],function(JSM){
	/**
	* Function: MatrixDeterminant2x2
	* Description: Calculates the determinant of a 2x2 matrix.
	* Parameters:
	*	m00..m11 {4 numbers} the matrix values
	* Returns:
	*	{number} the result
	*/
	JSM.MatrixDeterminant2x2 = function (m00, m01,
										m10, m11)
	{
		return m00 * m11 - m01 * m10;
	};

	/**
	* Function: MatrixDeterminant3x3
	* Description: Calculates the determinant of a 3x3 matrix.
	* Parameters:
	*	m00..m22 {9 numbers} the matrix values
	* Returns:
	*	{number} the result
	*/
	JSM.MatrixDeterminant3x3 = function (m00, m01, m02,
										m10, m11, m12,
										m20, m21, m22)
	{
		var subDet1 = JSM.MatrixDeterminant2x2 (m11, m12, m21, m22);
		var subDet2 = JSM.MatrixDeterminant2x2 (m10, m12, m20, m22);
		var subDet3 = JSM.MatrixDeterminant2x2 (m10, m11, m20, m21);
		return m00 * subDet1 - m01 * subDet2 + m02 * subDet3;
	};

	/**
	* Function: MatrixDeterminant4x4
	* Description: Calculates the determinant of a 4x4 matrix.
	* Parameters:
	*	m00..m33 {16 numbers} the matrix values
	* Returns:
	*	{number} the result
	*/
	JSM.MatrixDeterminant4x4 = function (m00, m01, m02, m03,
										m10, m11, m12, m13,
										m20, m21, m22, m23,
										m30, m31, m32, m33)
	{
		var subDet1 = JSM.MatrixDeterminant3x3 (m11, m12, m13, m21, m22, m23, m31, m32, m33);
		var subDet2 = JSM.MatrixDeterminant3x3 (m10, m12, m13, m20, m22, m23, m30, m32, m33);
		var subDet3 = JSM.MatrixDeterminant3x3 (m10, m11, m13, m20, m21, m23, m30, m31, m33);
		var subDet4 = JSM.MatrixDeterminant3x3 (m10, m11, m12, m20, m21, m22, m30, m31, m32);
		return subDet1 * m00 - subDet2 * m01 + subDet3 * m02 - subDet4 * m03;
	};

	return JSM;
});

define('skylark-jsmodeler/geometry/coordutils',["../core/jsm"],function(JSM){
	/**
	* Enum: Orientation
	* Description: Orientation of coordinates.
	* Values:
	*	{Invalid} invalid orientation or collinear
	*	{CounterClockwise} counter clockwise orientation
	*	{Clockwise} clockwise orientation
	*/
	JSM.Orientation = {
		Invalid : 0,
		CounterClockwise : 1,
		Clockwise : 2
	};

	/**
	* Function: MidCoord2D
	* Description: Calculates the coordinate in the middle of two coordinates.
	* Parameters:
	*	a {Coord2D} first coordinate
	*	b {Coord2D} second coordinate
	* Returns:
	*	{Coord2D} the result
	*/
	JSM.MidCoord2D = function (a, b)
	{
		return new JSM.Coord2D ((a.x + b.x) / 2.0, (a.y + b.y) / 2.0);
	};

	/**
	* Function: CoordOrientation2D
	* Description: Calculates the turn type of three coordinates.
	* Parameters:
	*	a {Coord2D} the first coordinate
	*	b {Coord2D} the second coordinate
	*	c {Coord2D} the third coordinate
	* Returns:
	*	{Orientation} the result
	*/
	JSM.CoordOrientation2D = function (a, b, c)
	{
		var m00 = a.x;
		var m01 = a.y;
		var m10 = b.x;
		var m11 = b.y;
		var m20 = c.x;
		var m21 = c.y;
	    
		var determinant = m00 * m11 + m01 * m20 + m10 * m21 - m11 * m20 - m01 * m10 - m00 * m21;
		if (JSM.IsPositive (determinant)) {
			return JSM.Orientation.CounterClockwise;
		} else if (JSM.IsNegative (determinant)) {
			return JSM.Orientation.Clockwise;
		}
		
		return JSM.Orientation.Invalid;	
	};

	/**
	* Function: CoordSignedDistance2D
	* Description: Calculates the distance of two coordinates along a direction vector.
	* Parameters:
	*	a {Coord2D} first coordinate
	*	b {Coord2D} second coordinate
	*	direction {Vector2D} direction vector
	* Returns:
	*	{number} the result
	*/
	JSM.CoordSignedDistance2D = function (a, b, direction)
	{
		var abDirection = JSM.CoordSub2D (b, a);
		var distance = a.DistanceTo (b);
		
		var angle = abDirection.AngleTo (direction);
		if (JSM.IsPositive (angle)) {
			distance = -distance;
		}

		return distance;
	};

	/**
	* Function: PolarToCartesian
	* Description: Converts a polar coordinate to a cartesian coordinate.
	* Parameters:
	*	radius {number} the radius component
	*	theta {number} the angle component
	* Returns:
	*	{Coord2D} the result
	*/
	JSM.PolarToCartesian = function (radius, theta)
	{
		var result = new JSM.Coord2D (0.0, 0.0);
		result.x = radius * Math.cos (theta);
		result.y = radius * Math.sin (theta);
		return result;
	};

	/**
	* Function: GetArcLengthFromAngle
	* Description: Calculates arc length from radius and angle.
	* Parameters:
	*	radius {number} the radius of the circle
	*	theta {number} the angle of rotation
	* Returns:
	*	{number} the result
	*/
	JSM.GetArcLengthFromAngle = function (radius, theta)
	{
		return theta * radius;
	};

	/**
	* Function: GetAngleFromArcLength
	* Description: Calculates angle from arc length.
	* Parameters:
	*	radius {number} the radius of the circle
	*	arcLength {number} the arc length
	* Returns:
	*	{number} the result
	*/
	JSM.GetAngleFromArcLength = function (radius, arcLength)
	{
		if (JSM.IsEqual (radius, 0.0)) {
			return 0.0;
		}
		
		return arcLength / radius;
	};

	/**
	* Function: MidCoord
	* Description: Calculates the coordinate in the middle of two coordinates.
	* Parameters:
	*	a {Coord} first coordinate
	*	b {Coord} second coordinate
	* Returns:
	*	{Coord} the result
	*/
	JSM.MidCoord = function (a, b)
	{
		return new JSM.Coord ((a.x + b.x) / 2.0, (a.y + b.y) / 2.0, (a.z + b.z) / 2.0);
	};

	/**
	* Function: CoordSignedDistance
	* Description: Calculates the distance of two coordinates along a direction vector.
	* Parameters:
	*	a {Coord} first coordinate
	*	b {Coord} second coordinate
	*	direction {Vector} direction vector
	* Returns:
	*	{number} the result
	*/
	JSM.CoordSignedDistance = function (a, b, direction)
	{
		var abDirection = JSM.CoordSub (b, a);
		var distance = a.DistanceTo (b);
		
		var angle = abDirection.AngleTo (direction);
		if (JSM.IsPositive (angle)) {
			distance = -distance;
		}

		return distance;
	};

	/**
	* Function: GetVectorsFullAngle
	* Description: Calculates the full angle (0 to pi) of two vectors with the given normal vector.
	* Parameters:
	*	a {Vector} the first vector
	*	b {Vector} the second vector
	*	normal {Vector} the normal vector
	* Returns:
	*	{number} the result
	*/
	JSM.GetVectorsFullAngle = function (a, b, normal)
	{
		var angle = a.AngleTo (b);
		var origo = new JSM.Coord (0.0, 0.0, 0.0);
		
		if (JSM.CoordOrientation (a, origo, b, normal) == JSM.Orientation.Clockwise) {
			angle = 2.0 * Math.PI - angle;
		}
		
		return angle;
	};

	/**
	* Function: CoordOrientation
	* Description: Calculates the turn type of three coordinates.
	* Parameters:
	*	a {Coord} the first coordinate
	*	b {Coord} the second coordinate
	*	c {Coord} the third coordinate
	*	normal {Vector} normal vector for calculation
	* Returns:
	*	{Orientation} the result
	*/
	JSM.CoordOrientation = function (a, b, c, normal)
	{
		var a2 = a.ToCoord2D (normal);
		var b2 = b.ToCoord2D (normal);
		var c2 = c.ToCoord2D (normal);
		var orientation = JSM.CoordOrientation2D (a2, b2, c2);

		var zNormal = new JSM.Vector (0.0, 0.0, 1.0);
		var angle = normal.AngleTo (zNormal);
		if (JSM.IsEqual (angle, Math.PI)) {
			if (orientation == JSM.Orientation.CounterClockwise) {
				orientation = JSM.Orientation.Clockwise;
			} else if (orientation == JSM.Orientation.Clockwise) {
				orientation = JSM.Orientation.CounterClockwise;
			}
		}
		
		return orientation;
	};

	/**
	* Function: SphericalToCartesian
	* Description: Converts a spherical coordinate to a cartesian coordinate.
	* Parameters:
	*	radius {number} the radius component
	*	theta {number} the angle component
	*	phi {number} the phi component
	* Returns:
	*	{Coord} the result
	*/
	JSM.SphericalToCartesian = function (radius, theta, phi)
	{
		var result = new JSM.Coord (0.0, 0.0, 0.0);
		result.x = radius * Math.sin (theta) * Math.cos (phi);
		result.y = radius * Math.sin (theta) * Math.sin (phi);
		result.z = radius * Math.cos (theta);
		return result;
	};

	/**
	* Function: CylindricalToCartesian
	* Description: Converts a cylindrical coordinate to a cartesian coordinate.
	* Parameters:
	*	radius {number} the radius component
	*	height {number} the height component
	*	theta {number} the theta component
	* Returns:
	*	{Coord} the result
	*/
	JSM.CylindricalToCartesian = function (radius, height, theta)
	{
		var result = new JSM.Coord (0.0, 0.0, 0.0);
		result.x = radius * Math.cos (theta);
		result.y = radius * Math.sin (theta);
		result.z = height;
		return result;
	};

	/**
	* Function: GetArcLength
	* Description: Calculates arc length between two vectors.
	* Parameters:
	*	a {Vector} the first vector
	*	b {Vector} the second vector
	*	radius {number} the radius component
	* Returns:
	*	{number} the result
	*/
	JSM.GetArcLength = function (a, b, radius)
	{
		var angle = a.AngleTo (b);
		return angle * radius;
	};

	/**
	* Function: GetFullArcLength
	* Description: Calculates arc length between two vectors with the given normal vector.
	* Parameters:
	*	a {Vector} the first vector
	*	b {Vector} the second vector
	*	radius {number} the radius component
	*	normal {Vector} the normal vector
	* Returns:
	*	{number} the result
	*/
	JSM.GetFullArcLength = function (a, b, radius, normal)
	{
		var angle = JSM.GetVectorsFullAngle (a, b, normal);
		return angle * radius;
	};

	/**
	* Function: CalculateCentroid
	* Description: Calculates center points of the given coordinates.
	* Parameters:
	*	coords {Coord[*]} the array of coordinates
	* Returns:
	*	{Coord} the result
	*/
	JSM.CalculateCentroid = function (coords)
	{
		var count = coords.length;
		var centroid = new JSM.Coord (0.0, 0.0, 0.0);
		if (count >= 1) {
			var i;
			for (i = 0; i < count; i++) {
				centroid = JSM.CoordAdd (centroid, coords[i]);
			}
			centroid.MultiplyScalar (1.0 / count);
		}

		return centroid;
	};

	/**
	* Function: CalculateTriangleNormal
	* Description: Calculates normal vector for the given triangle vertices.
	* Parameters:
	*	v0 {Coord} the first vertex of the triangle
	*	v1 {Coord} the second vertex of the triangle
	*	v2 {Coord} the third vertex of the triangle
	* Returns:
	*	{Vector} the result
	*/
	JSM.CalculateTriangleNormal = function (v0, v1, v2)
	{
		var v = JSM.CoordSub (v1, v0);
		var w = JSM.CoordSub (v2, v0);
		
		var normal = new JSM.Vector (0.0, 0.0, 0.0);
		normal.x = (v.y * w.z - v.z * w.y);
		normal.y = (v.z * w.x - v.x * w.z);
		normal.z = (v.x * w.y - v.y * w.x);

		normal.Normalize ();
		return normal;
	};

	/**
	* Function: CalculateNormal
	* Description: Calculates normal vector for the given coordinates.
	* Parameters:
	*	coords {Coord[*]} the array of coordinates
	* Returns:
	*	{Vector} the result
	*/
	JSM.CalculateNormal = function (coords)
	{
		var count = coords.length;
		var normal = new JSM.Vector (0.0, 0.0, 0.0);
		if (count >= 3) {
			var i, currentIndex, nextIndex;
			var current, next;
			for (i = 0; i < count; i++) {
				currentIndex = i % count;
				nextIndex = (i + 1) % count;
		
				current = coords[currentIndex];
				next = coords[nextIndex];
		
				normal.x += (current.y - next.y) * (current.z + next.z);
				normal.y += (current.z - next.z) * (current.x + next.x);
				normal.z += (current.x - next.x) * (current.y + next.y);
			}
		}

		normal.Normalize ();
		return normal;
	};

	/**
	* Function: BarycentricInterpolation
	* Description: Calculates barycentric interpolation for the given values.
	* Parameters:
	*	vertex0, vertex1, vertex2 {Coord} the vertices of interpolation
	*	value0, value1, value2 {Coord} the values to interpolate
	*	position {Coord} the position of interpolation
	* Returns:
	*	{Coord} the result
	*/
	JSM.BarycentricInterpolation = function (vertex0, vertex1, vertex2, value0, value1, value2, position)
	{
		function GetTriangleArea (a, b, c)
		{
			var s = (a + b + c) / 2.0;
			var areaSquare = s * (s - a) * (s - b) * (s - c);
			if (areaSquare < 0.0) {
				return 0.0;
			}
			return Math.sqrt (areaSquare);
		}
		
		var edge0 = vertex0.DistanceTo (vertex1);
		var edge1 = vertex1.DistanceTo (vertex2);
		var edge2 = vertex2.DistanceTo (vertex0);
		
		var distance0 = vertex0.DistanceTo (position);
		var distance1 = vertex1.DistanceTo (position);
		var distance2 = vertex2.DistanceTo (position);
		
		var area = GetTriangleArea (edge0, edge1, edge2);
		if (JSM.IsZero (area)) {
			return value0;
		}
		
		var area0 = GetTriangleArea (edge0, distance0, distance1);
		var area1 = GetTriangleArea (edge1, distance1, distance2);
		var area2 = GetTriangleArea (edge2, distance0, distance2);
		
		var interpolated0 = value0.Clone ().MultiplyScalar (area1);
		var interpolated1 = value1.Clone ().MultiplyScalar (area2);
		var interpolated2 = value2.Clone ().MultiplyScalar (area0);
		var interpolated = JSM.CoordAdd (JSM.CoordAdd (interpolated0, interpolated1), interpolated2);
		interpolated.MultiplyScalar (1.0 / area);
		return interpolated;
	};

	return JSM;
});

define('skylark-jsmodeler/geometry/matrix',["../core/jsm"],function(JSM){
	/**
	* Function: MatrixIdentity
	* Description: Generates an identity matrix.
	* Returns:
	*	{number[16]} the result matrix
	*/
	JSM.MatrixIdentity = function ()
	{
		var result = [];
		result[0] = 1.0;
		result[1] = 0.0;
		result[2] = 0.0;
		result[3] = 0.0;
		result[4] = 0.0;
		result[5] = 1.0;
		result[6] = 0.0;
		result[7] = 0.0;
		result[8] = 0.0;
		result[9] = 0.0;
		result[10] = 1.0;
		result[11] = 0.0;
		result[12] = 0.0;
		result[13] = 0.0;
		result[14] = 0.0;
		result[15] = 1.0;
		return result;
	};

	/**
	* Function: MatrixClone
	* Description: Clones a matrix.
	* Parameters:
	*	matrix {number[16]} the source matrix
	* Returns:
	*	{number[16]} the result matrix
	*/
	JSM.MatrixClone = function (matrix)
	{
		var result = [];
		result[0] = matrix[0];
		result[1] = matrix[1];
		result[2] = matrix[2];
		result[3] = matrix[3];
		result[4] = matrix[4];
		result[5] = matrix[5];
		result[6] = matrix[6];
		result[7] = matrix[7];
		result[8] = matrix[8];
		result[9] = matrix[9];
		result[10] = matrix[10];
		result[11] = matrix[11];
		result[12] = matrix[12];
		result[13] = matrix[13];
		result[14] = matrix[14];
		result[15] = matrix[15];
		return result;
	};

	/**
	* Function: MatrixTranspose
	* Description: Transposes a matrix.
	* Parameters:
	*	matrix {number[16]} the source matrix
	* Returns:
	*	{number[16]} the result matrix
	*/
	JSM.MatrixTranspose = function (matrix)
	{
		var result = [];
		result[0] = matrix[0];
		result[1] = matrix[4];
		result[2] = matrix[8];
		result[3] = matrix[12];
		result[4] = matrix[1];
		result[5] = matrix[5];
		result[6] = matrix[9];
		result[7] = matrix[13];
		result[8] = matrix[2];
		result[9] = matrix[6];
		result[10] = matrix[10];
		result[11] = matrix[14];
		result[12] = matrix[3];
		result[13] = matrix[7];
		result[14] = matrix[11];
		result[15] = matrix[15];
		return result;
	};

	/**
	* Function: MatrixVectorMultiply
	* Description: Multiplies a matrix with a vector.
	* Parameters:
	*	matrix {number[16]} the matrix
	*	vector {number[4]} the vector
	* Returns:
	*	{number[4]} the result vector
	*/
	JSM.MatrixVectorMultiply = function (matrix, vector)
	{
		var a00 = vector[0];
		var a01 = vector[1];
		var a02 = vector[2];
		var a03 = vector[3];
		var b00 = matrix[0];
		var b01 = matrix[1];
		var b02 = matrix[2];
		var b03 = matrix[3];
		var b10 = matrix[4];
		var b11 = matrix[5];
		var b12 = matrix[6];
		var b13 = matrix[7];
		var b20 = matrix[8];
		var b21 = matrix[9];
		var b22 = matrix[10];
		var b23 = matrix[11];
		var b30 = matrix[12];
		var b31 = matrix[13];
		var b32 = matrix[14];
		var b33 = matrix[15];

		var result = [];
		result[0] = a00 * b00 + a01 * b10 + a02 * b20 + a03 * b30;
		result[1] = a00 * b01 + a01 * b11 + a02 * b21 + a03 * b31;
		result[2] = a00 * b02 + a01 * b12 + a02 * b22 + a03 * b32;
		result[3] = a00 * b03 + a01 * b13 + a02 * b23 + a03 * b33;
		return result;
	};

	/**
	* Function: MatrixMultiply
	* Description: Multiplies a two matrices.
	* Parameters:
	*	matrix1 {number[16]} first matrix
	*	matrix2 {number[16]} second matrix
	* Returns:
	*	{number[16]} the result matrix
	*/
	JSM.MatrixMultiply = function (matrix1, matrix2)
	{
		var a00 = matrix1[0];
		var a01 = matrix1[1];
		var a02 = matrix1[2];
		var a03 = matrix1[3];
		var a10 = matrix1[4];
		var a11 = matrix1[5];
		var a12 = matrix1[6];
		var a13 = matrix1[7];
		var a20 = matrix1[8];
		var a21 = matrix1[9];
		var a22 = matrix1[10];
		var a23 = matrix1[11];
		var a30 = matrix1[12];
		var a31 = matrix1[13];
		var a32 = matrix1[14];
		var a33 = matrix1[15];
		
		var b00 = matrix2[0];
		var b01 = matrix2[1];
		var b02 = matrix2[2];
		var b03 = matrix2[3];
		var b10 = matrix2[4];
		var b11 = matrix2[5];
		var b12 = matrix2[6];
		var b13 = matrix2[7];
		var b20 = matrix2[8];
		var b21 = matrix2[9];
		var b22 = matrix2[10];
		var b23 = matrix2[11];
		var b30 = matrix2[12];
		var b31 = matrix2[13];
		var b32 = matrix2[14];
		var b33 = matrix2[15];
			
		var result = [];
		result[0] = a00 * b00 + a01 * b10 + a02 * b20 + a03 * b30;
		result[1] = a00 * b01 + a01 * b11 + a02 * b21 + a03 * b31;
		result[2] = a00 * b02 + a01 * b12 + a02 * b22 + a03 * b32;
		result[3] = a00 * b03 + a01 * b13 + a02 * b23 + a03 * b33;
		result[4] = a10 * b00 + a11 * b10 + a12 * b20 + a13 * b30;
		result[5] = a10 * b01 + a11 * b11 + a12 * b21 + a13 * b31;
		result[6] = a10 * b02 + a11 * b12 + a12 * b22 + a13 * b32;
		result[7] = a10 * b03 + a11 * b13 + a12 * b23 + a13 * b33;
		result[8] = a20 * b00 + a21 * b10 + a22 * b20 + a23 * b30;
		result[9] = a20 * b01 + a21 * b11 + a22 * b21 + a23 * b31;
		result[10] = a20 * b02 + a21 * b12 + a22 * b22 + a23 * b32;
		result[11] = a20 * b03 + a21 * b13 + a22 * b23 + a23 * b33;
		result[12] = a30 * b00 + a31 * b10 + a32 * b20 + a33 * b30;
		result[13] = a30 * b01 + a31 * b11 + a32 * b21 + a33 * b31;
		result[14] = a30 * b02 + a31 * b12 + a32 * b22 + a33 * b32;
		result[15] = a30 * b03 + a31 * b13 + a32 * b23 + a33 * b33;
		return result;
	};

	/**
	* Function: MatrixDeterminant
	* Description: Calculates the determinant of a matrix.
	* Parameters:
	*	matrix {number[16]} the source matrix
	* Returns:
	*	{number} the determinant
	*/
	JSM.MatrixDeterminant = function (matrix)
	{
		var a00 = matrix[0];
		var a01 = matrix[1];
		var a02 = matrix[2];
		var a03 = matrix[3];
		var a10 = matrix[4];
		var a11 = matrix[5];
		var a12 = matrix[6];
		var a13 = matrix[7];
		var a20 = matrix[8];
		var a21 = matrix[9];
		var a22 = matrix[10];
		var a23 = matrix[11];
		var a30 = matrix[12];
		var a31 = matrix[13];
		var a32 = matrix[14];
		var a33 = matrix[15];

		var b00 = a00 * a11 - a01 * a10;
		var b01 = a00 * a12 - a02 * a10;
		var b02 = a00 * a13 - a03 * a10;
		var b03 = a01 * a12 - a02 * a11;
		var b04 = a01 * a13 - a03 * a11;
		var b05 = a02 * a13 - a03 * a12;
		var b06 = a20 * a31 - a21 * a30;
		var b07 = a20 * a32 - a22 * a30;
		var b08 = a20 * a33 - a23 * a30;
		var b09 = a21 * a32 - a22 * a31;
		var b10 = a21 * a33 - a23 * a31;
		var b11 = a22 * a33 - a23 * a32;
		
		var determinant = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
		return determinant;
	};

	/**
	* Function: MatrixInvert
	* Description: Inverts a matrix.
	* Parameters:
	*	matrix {number[16]} the source matrix
	* Returns:
	*	{number[16]} the result matrix
	*/
	JSM.MatrixInvert = function (matrix)
	{
		var a00 = matrix[0];
		var a01 = matrix[1];
		var a02 = matrix[2];
		var a03 = matrix[3];
		var a10 = matrix[4];
		var a11 = matrix[5];
		var a12 = matrix[6];
		var a13 = matrix[7];
		var a20 = matrix[8];
		var a21 = matrix[9];
		var a22 = matrix[10];
		var a23 = matrix[11];
		var a30 = matrix[12];
		var a31 = matrix[13];
		var a32 = matrix[14];
		var a33 = matrix[15];

		var b00 = a00 * a11 - a01 * a10;
		var b01 = a00 * a12 - a02 * a10;
		var b02 = a00 * a13 - a03 * a10;
		var b03 = a01 * a12 - a02 * a11;
		var b04 = a01 * a13 - a03 * a11;
		var b05 = a02 * a13 - a03 * a12;
		var b06 = a20 * a31 - a21 * a30;
		var b07 = a20 * a32 - a22 * a30;
		var b08 = a20 * a33 - a23 * a30;
		var b09 = a21 * a32 - a22 * a31;
		var b10 = a21 * a33 - a23 * a31;
		var b11 = a22 * a33 - a23 * a32;
		
		var determinant = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
		if (JSM.IsZero (determinant)) {
			return null;
		}

		var result = [];
		
		result[0] = (a11 * b11 - a12 * b10 + a13 * b09) / determinant;
		result[1] = (a02 * b10 - a01 * b11 - a03 * b09) / determinant;
		result[2] = (a31 * b05 - a32 * b04 + a33 * b03) / determinant;
		result[3] = (a22 * b04 - a21 * b05 - a23 * b03) / determinant;
		result[4] = (a12 * b08 - a10 * b11 - a13 * b07) / determinant;
		result[5] = (a00 * b11 - a02 * b08 + a03 * b07) / determinant;
		result[6] = (a32 * b02 - a30 * b05 - a33 * b01) / determinant;
		result[7] = (a20 * b05 - a22 * b02 + a23 * b01) / determinant;
		result[8] = (a10 * b10 - a11 * b08 + a13 * b06) / determinant;
		result[9] = (a01 * b08 - a00 * b10 - a03 * b06) / determinant;
		result[10] = (a30 * b04 - a31 * b02 + a33 * b00) / determinant;
		result[11] = (a21 * b02 - a20 * b04 - a23 * b00) / determinant;
		result[12] = (a11 * b07 - a10 * b09 - a12 * b06) / determinant;
		result[13] = (a00 * b09 - a01 * b07 + a02 * b06) / determinant;
		result[14] = (a31 * b01 - a30 * b03 - a32 * b00) / determinant;
		result[15] = (a20 * b03 - a21 * b01 + a22 * b00) / determinant;

		return result;
	};

	/**
	* Function: MatrixTranslation
	* Description: Creates a translation matrix.
	* Parameters:
	*	x {number} x offset of the transformation
	*	y {number} y offset of the transformation
	*	z {number} z offset of the transformation
	* Returns:
	*	{number[16]} the result matrix
	*/
	JSM.MatrixTranslation = function (x, y, z)
	{
		var result = [];
		result[0] = 1.0;
		result[1] = 0.0;
		result[2] = 0.0;
		result[3] = 0.0;
		result[4] = 0.0;
		result[5] = 1.0;
		result[6] = 0.0;
		result[7] = 0.0;
		result[8] = 0.0;
		result[9] = 0.0;
		result[10] = 1.0;
		result[11] = 0.0;
		result[12] = x;
		result[13] = y;
		result[14] = z;
		result[15] = 1.0;
		return result;
	};

	/**
	* Function: MatrixRotation
	* Description: Creates a rotation matrix around the given axis.
	* Parameters:
	*	axis {Vector} the axis of the rotation
	*	angle {number} the angle of the rotation
	*	origo {Coord} the origo of the rotation
	* Returns:
	*	{number[16]} the result matrix
	*/
	JSM.MatrixRotation = function (axis, angle, origo)
	{
		var normal = axis.Clone ().Normalize ();

		var u = normal.x;
		var v = normal.y;
		var w = normal.z;

		var u2 = u * u;
		var v2 = v * v;
		var w2 = w * w;

		var si = Math.sin (angle);
		var co = Math.cos (angle);
		
		var result = [];
		if (origo === undefined || origo === null) {
			result[0] = u2 + (v2 + w2) * co;
			result[1] = u * v * (1.0 - co) + w * si;
			result[2] = u * w * (1.0 - co) - v * si;
			result[3] = 0.0;
			result[4] = u * v * (1.0 - co) - w * si;
			result[5] = v2 + (u2 + w2) * co;
			result[6] = v * w * (1.0 - co) + u * si;
			result[7] = 0.0;
			result[8] = u * w * (1.0 - co) + v * si;
			result[9] = v * w * (1.0 - co) - u * si;
			result[10] = w2 + (u2 + v2) * co;
			result[11] = 0.0;
			result[12] = 0.0;
			result[13] = 0.0;
			result[14] = 0.0;
			result[15] = 1.0;
		} else {
			var a = origo.x;
			var b = origo.y;
			var c = origo.z;
		
			result[0] = u2 + (v2 + w2) * co;
			result[1] = u * v * (1.0 - co) + w * si;
			result[2] = u * w * (1.0 - co) - v * si;
			result[3] = 0.0;
			result[4] = u * v * (1.0 - co) - w * si;
			result[5] = v2 + (u2 + w2) * co;
			result[6] = v * w * (1.0 - co) + u * si;
			result[7] = 0.0;
			result[8] = u * w * (1.0 - co) + v * si;
			result[9] = v * w * (1.0 - co) - u * si;
			result[10] = w2 + (u2 + v2) * co;
			result[11] = 0.0;
			result[12] = (a * (v2 + w2) - u * (b * v + c * w)) * (1.0 - co) + (b * w - c * v) * si;
			result[13] = (b * (u2 + w2) - v * (a * u + c * w)) * (1.0 - co) + (c * u - a * w) * si;
			result[14] = (c * (u2 + v2) - w * (a * u + b * v)) * (1.0 - co) + (a * v - b * u) * si;
			result[15] = 1.0;
		}

		return result;
	};

	/**
	* Function: MatrixRotationQuaternion
	* Description: Creates a rotation matrix from a given quaternion.
	* Parameters:
	*	quaternion {number[4]} the quaternion
	* Returns:
	*	{number[16]} the result matrix
	*/
	JSM.MatrixRotationQuaternion = function (quaternion)
	{
		var x = quaternion[0];
		var y = quaternion[1];
		var z = quaternion[2];
		var w = quaternion[3];

		var x2 = x + x;
		var y2 = y + y;
		var z2 = z + z;

		var xx = x * x2;
		var xy = x * y2;
		var xz = x * z2;
		var yy = y * y2;
		var yz = y * z2;
		var zz = z * z2;
		var wx = w * x2;
		var wy = w * y2;
		var wz = w * z2;

		var result = [];
		result[0] = 1.0 - (yy + zz);
		result[1] = xy + wz;
		result[2] = xz - wy;
		result[3] = 0.0;
		result[4] = xy - wz;
		result[5] = 1.0 - (xx + zz);
		result[6] = yz + wx;
		result[7] = 0.0;
		result[8] = xz + wy;
		result[9] = yz - wx;
		result[10] = 1.0 - (xx + yy);
		result[11] = 0.0;
		result[12] = 0.0;
		result[13] = 0.0;
		result[14] = 0.0;
		result[15] = 1;
		return result;
	};

	/**
	* Function: MatrixRotationX
	* Description: Creates a rotation matrix around the x axis.
	* Parameters:
	*	angle {number} the angle of rotation
	* Returns:
	*	{number[16]} the result matrix
	*/
	JSM.MatrixRotationX = function (angle)
	{
		var si = Math.sin (angle);
		var co = Math.cos (angle);

		var result = [];
		result[0] = 1.0;
		result[1] = 0.0;
		result[2] = 0.0;
		result[3] = 0.0;
		result[4] = 0.0;
		result[5] = co;
		result[6] = si;
		result[7] = 0.0;
		result[8] = 0.0;
		result[9] = -si;
		result[10] = co;
		result[11] = 0.0;
		result[12] = 0.0;
		result[13] = 0.0;
		result[14] = 0.0;
		result[15] = 1.0;
		return result;
	};

	/**
	* Function: MatrixRotationY
	* Description: Creates a rotation matrix around the y axis.
	* Parameters:
	*	angle {number} the angle of rotation
	* Returns:
	*	{number[16]} the result matrix
	*/
	JSM.MatrixRotationY = function (angle)
	{
		var si = Math.sin (angle);
		var co = Math.cos (angle);

		var result = [];
		result[0] = co;
		result[1] = 0.0;
		result[2] = -si;
		result[3] = 0.0;
		result[4] = 0.0;
		result[5] = 1.0;
		result[6] = 0.0;
		result[7] = 0.0;
		result[8] = si;
		result[9] = 0.0;
		result[10] = co;
		result[11] = 0.0;
		result[12] = 0.0;
		result[13] = 0.0;
		result[14] = 0.0;
		result[15] = 1.0;
		return result;
	};

	/**
	* Function: MatrixRotationZ
	* Description: Creates a rotation matrix around the z axis.
	* Parameters:
	*	angle {number} the angle of rotation
	* Returns:
	*	{number[16]} the result matrix
	*/
	JSM.MatrixRotationZ = function (angle)
	{
		var si = Math.sin (angle);
		var co = Math.cos (angle);

		var result = [];
		result[0] = co;
		result[1] = si;
		result[2] = 0.0;
		result[3] = 0.0;
		result[4] = -si;
		result[5] = co;
		result[6] = 0.0;
		result[7] = 0.0;
		result[8] = 0.0;
		result[9] = 0.0;
		result[10] = 1.0;
		result[11] = 0.0;
		result[12] = 0.0;
		result[13] = 0.0;
		result[14] = 0.0;
		result[15] = 1.0;
		return result;
	};

	/**
	* Function: ApplyTransformation
	* Description: Applies a matrix transformation to a coordinate.
	* Parameters:
	*	matrix {number[16]} the matrix
	*	coord {Coord} the coordinate
	* Returns:
	*	{Coord} the result
	*/
	JSM.ApplyTransformation = function (matrix, coord)
	{
		var vector = [];
		vector[0] = coord.x;
		vector[1] = coord.y;
		vector[2] = coord.z;
		vector[3] = 1.0;
		
		var resultVector = JSM.MatrixVectorMultiply (matrix, vector);
		var result = new JSM.Coord (resultVector[0], resultVector[1], resultVector[2]);
		return result;
	};

	/**
	* Function: ApplyRotation
	* Description: Applies the rotation part of a matrix transformation to a coordinate.
	* Parameters:
	*	matrix {number[16]} the matrix
	*	coord {Coord} the coordinate
	* Returns:
	*	{Coord} the result
	*/
	JSM.ApplyRotation = function (matrix, coord)
	{
		var vector = [];
		vector[0] = coord.x;
		vector[1] = coord.y;
		vector[2] = coord.z;
		vector[3] = 0.0;
		
		var resultVector = JSM.MatrixVectorMultiply (matrix, vector);
		var result = new JSM.Coord (resultVector[0], resultVector[1], resultVector[2]);
		return result;
	};

	return JSM;
});

define('skylark-jsmodeler/geometry/coordsystem',["../core/jsm"],function(JSM){
	/**
	* Class: CoordSystem
	* Description: Represents coordinate system.
	* Parameters:
	*	origo {Coord} origo
	*	e1 {Vector} first direction vector
	*	e2 {Vector} second direction vector
	*	e3 {Vector} third direction vector
	*/
	JSM.CoordSystem = function (origo, e1, e2, e3)
	{
		this.origo = origo;
		this.e1 = e1;
		this.e2 = e2;
		this.e3 = e3;
	};

	/**
	* Function: CoordSystem.Set
	* Description: Sets the coordinate system.
	* Parameters:
	*	origo {Coord} origo
	*	e1 {Vector} first direction vector
	*	e2 {Vector} second direction vector
	*	e3 {Vector} third direction vector
	*/
	JSM.CoordSystem.prototype.Set = function (origo, e1, e2, e3)
	{
		this.origo = origo;
		this.e1 = e1;
		this.e2 = e2;
		this.e3 = e3;
	};

	/**
	* Function: CoordSystem.CoordSystemToDirectionVectors
	* Description: Converts coordinate system vectors to origo relative direction vectors.
	* Returns:
	*	{CoordSystem} this pointer
	*/
	JSM.CoordSystem.prototype.ToDirectionVectors = function ()
	{
		this.e1 = JSM.CoordSub (this.e1, this.origo);
		this.e2 = JSM.CoordSub (this.e2, this.origo);
		this.e3 = JSM.CoordSub (this.e3, this.origo);
		return this;
	};

	/**
	* Function: CoordSystem.CoordSystemToAbsoluteCoords
	* Description: Converts the coordinate system vectors to absolute coordinates.
	* Returns:
	*	{CoordSystem} this pointer
	*/
	JSM.CoordSystem.prototype.ToAbsoluteCoords = function ()
	{
		this.e1 = JSM.CoordAdd (this.e1, this.origo);
		this.e2 = JSM.CoordAdd (this.e2, this.origo);
		this.e3 = JSM.CoordAdd (this.e3, this.origo);
		return this;
	};

	/**
	* Function: CoordSystem.Clone
	* Description: Clones the coordinate system.
	* Returns:
	*	{CoordSystem} a cloned instance
	*/
	JSM.CoordSystem.prototype.Clone = function ()
	{
		return new JSM.CoordSystem (this.origo.Clone (), this.e1.Clone (), this.e2.Clone (), this.e3.Clone ());
	};

	return JSM;
});

define('skylark-jsmodeler/geometry/sector',["../core/jsm"],function(JSM){
	/**
	* Enum: CoordSectorPosition2D
	* Description: Position of a coordinate and a sector.
	* Values:
	*	{CoordInsideOfSector} coordinate lies inside of sector
	*	{CoordOnSectorEndCoord} coordinate lies at the end of the sector
	*	{CoordOutsideOfSector} coordinate lies outside of the sector
	*/
	JSM.CoordSectorPosition2D = {
		CoordInsideOfSector : 0,
		CoordOnSectorEndCoord : 1,
		CoordOutsideOfSector : 2
	};

	/**
	* Enum: SectorSectorPosition2D
	* Description: Position of two sectors.
	* Values:
	*	{SectorsDontIntersect} sectors do not intersect
	*	{SectorsIntersectCoincident} sectors intersect coincident
	*	{SectorsIntersectEndPoint} sectors intersect at end point
	*	{SectorsIntersectOnePoint} sectors intersect one point
	*/
	JSM.SectorSectorPosition2D = {
		SectorsDontIntersect : 0,
		SectorsIntersectCoincident : 1,
		SectorsIntersectEndPoint : 2,
		SectorsIntersectOnePoint : 3
	};

	/**
	* Enum: CoordSectorPosition
	* Description: Position of a coordinate and a sector.
	* Values:
	*	{CoordInsideOfSector} coordinate lies inside of sector
	*	{CoordOnSectorEndCoord} coordinate lies at the end of the sector
	*	{CoordOutsideOfSector} coordinate lies outside of the sector
	*/
	JSM.CoordSectorPosition = {
		CoordInsideOfSector : 0,
		CoordOnSectorEndCoord : 1,
		CoordOutsideOfSector : 2
	};

	/**
	* Class: Sector2D
	* Description: Represents a 2D sector.
	* Parameters:
	*	beg {Coord2D} the beginning coordinate
	*	end {Coord2D} the ending coordinate
	*/
	JSM.Sector2D = function (beg, end)
	{
		this.beg = beg;
		this.end = end;
	};

	/**
	* Function: Sector2D.Set
	* Description: Sets the sector.
	* Parameters:
	*	beg {Coord2D} the beginning coordinate
	*	end {Coord2D} the ending coordinate
	*/
	JSM.Sector2D.prototype.Set = function (beg, end)
	{
		this.beg = beg;
		this.end = end;
	};

	/**
	* Function: Sector.GetLength
	* Description: Returns the length of the sector.
	* Returns:
	*	{number} the result
	*/
	JSM.Sector2D.prototype.GetLength = function ()
	{
		return this.beg.DistanceTo (this.end);
	};

	/**
	* Function: Sector2D.CoordPosition
	* Description: Calculates the position of the sector and the given coordinate.
	* Parameters:
	*	coord {Coord2D} the coordinate
	* Returns:
	*	{CoordSectorPosition2D} the result
	*/
	JSM.Sector2D.prototype.CoordPosition = function (coord)
	{
		var x = coord.x;
		var y = coord.y;
		var x1 = this.beg.x;
		var y1 = this.beg.y;
		var x2 = this.end.x;
		var y2 = this.end.y;

		var length = this.GetLength ();
		if (JSM.IsZero (length)) {
			if (coord.IsEqual (this.beg)) {
				return JSM.CoordSectorPosition2D.CoordOnSectorEndCoord;
			}

			return JSM.CoordSectorPosition2D.CoordOutsideOfSector;
		}

		var u = ((x - x1) * (x2 - x1) + (y - y1) * (y2 - y1)) / (length * length);
		if (JSM.IsLower (u, 0.0) || JSM.IsGreater (u, 1.0)) {
			return JSM.CoordSectorPosition2D.CoordOutsideOfSector;
		}

		var ux = x1 + u * (x2 - x1);
		var uy = y1 + u * (y2 - y1);
		if (!JSM.IsEqual (ux, x) || !JSM.IsEqual (uy, y)) {
			return JSM.CoordSectorPosition2D.CoordOutsideOfSector;
		}

		if (JSM.IsEqual (u, 0.0) || JSM.IsEqual (u, 1.0)) {
			return JSM.CoordSectorPosition2D.CoordOnSectorEndCoord;
		}

		return JSM.CoordSectorPosition2D.CoordInsideOfSector;
	};

	/**
	* Function: Sector2D.SectorPosition
	* Description: Calculates the position of the sector and the given sector.
	* Parameters:
	*	sector {Sector2D} the sector
	*	intersection {Coord2D} (out) the intersection point if it exists
	* Returns:
	*	{SectorSectorPosition2D} the result
	*/
	JSM.Sector2D.prototype.SectorPosition = function (sector, intersection)
	{
		function IsOnSegment (beg, end, coord)
		{
			if (!coord.IsEqual (beg) && !coord.IsEqual (end) &&
				JSM.IsLowerOrEqual (coord.x, Math.max (beg.x, end.x)) &&
				JSM.IsLowerOrEqual (coord.y, Math.max (beg.y, end.y)) &&
				JSM.IsGreaterOrEqual (coord.x, Math.min (beg.x, end.x)) &&
				JSM.IsGreaterOrEqual (coord.y, Math.min (beg.y, end.y)))
			{
				return true;
			}
			return false;
		}

		var calcIntersection = (intersection !== undefined && intersection !== null);
		
		var aBeg = this.beg;
		var aEnd = this.end;
		var bBeg = sector.beg;
		var bEnd = sector.end;
		
		var equalBeg = aBeg.IsEqual (bBeg) || aBeg.IsEqual (bEnd);
		var equalEnd = aEnd.IsEqual (bBeg) || aEnd.IsEqual (bEnd);
		if (equalBeg && equalEnd) {
			return JSM.SectorSectorPosition2D.SectorsIntersectCoincident;
		}

		var x1 = aBeg.x;
		var y1 = aBeg.y;
		var x2 = aEnd.x;
		var y2 = aEnd.y;
		var x3 = bBeg.x;
		var y3 = bBeg.y;
		var x4 = bEnd.x;
		var y4 = bEnd.y;

		var numeratorA = (x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3);
		var numeratorB = (x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3);
		var denominator = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
		if (JSM.IsZero (denominator)) {
			if (JSM.IsZero (numeratorA) && JSM.IsZero (numeratorB)) {
				if (IsOnSegment (aBeg, aEnd, bBeg) ||
					IsOnSegment (aBeg, aEnd, bEnd) ||
					IsOnSegment (bBeg, bEnd, aBeg) ||
					IsOnSegment (bBeg, bEnd, aEnd))
				{
					return JSM.SectorSectorPosition2D.SectorsIntersectCoincident;
				} else if (equalBeg) {
					if (calcIntersection) {
						intersection.x = aBeg.x;
						intersection.y = aBeg.y;
					}
					return JSM.SectorSectorPosition2D.SectorsIntersectEndPoint;
				} else if (equalEnd) {
					if (calcIntersection) {
						intersection.x = aEnd.x;
						intersection.y = aEnd.y;
					}
					return JSM.SectorSectorPosition2D.SectorsIntersectEndPoint;
				}
			}
			return JSM.SectorSectorPosition2D.SectorsDontIntersect;
		}
		
		var distA = numeratorA / denominator;
		var distB = numeratorB / denominator;
		if (JSM.IsLower (distA, 0.0) || JSM.IsGreater (distA, 1.0) ||
			JSM.IsLower (distB, 0.0) || JSM.IsGreater (distB, 1.0))
		{
			return JSM.SectorSectorPosition2D.SectorsDontIntersect;
		}

		if (equalBeg) {
			if (calcIntersection) {
				intersection.x = aBeg.x;
				intersection.y = aBeg.y;
			}
			return JSM.SectorSectorPosition2D.SectorsIntersectEndPoint;
		} else if (equalEnd) {
			if (calcIntersection) {
				intersection.x = aEnd.x;
				intersection.y = aEnd.y;
			}
			return JSM.SectorSectorPosition2D.SectorsIntersectEndPoint;
		}
		
		if (calcIntersection) {
			intersection.x = x1 + distA * (x2 - x1);
			intersection.y = y1 + distA * (y2 - y1);
		}
		return JSM.SectorSectorPosition2D.SectorsIntersectOnePoint;
	};

	/**
	* Function: Sector2D.ProjectCoord
	* Description: Calculates the projected coordinate of the given coordinate.
	* Parameters:
	*	coord {Coord2D} the coordinate
	* Returns:
	*	{Coord2D} the projected coordinate
	*/
	JSM.Sector2D.prototype.ProjectCoord = function (coord)
	{
		var x = coord.x;
		var y = coord.y;

		var beg = this.beg;
		var end = this.end;
		var x1 = beg.x;
		var y1 = beg.y;
		var x2 = end.x;
		var y2 = end.y;

		var denom = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
		if (JSM.IsZero (denom)) {
			return beg.Clone ();
		}

		var u = ((x2 - x1) * (x - x1) + (y2 - y1) * (y - y1)) / denom;
		if (JSM.IsLower (u, 0.0)) {
			return beg.Clone ();
		} else if (JSM.IsGreater (u, 1.0)) {
			return end.Clone ();
		}
		
		var dir = JSM.CoordSub2D (end, beg).MultiplyScalar (u);
		var result = JSM.CoordAdd2D (beg, dir);
		return result;
	};

	/**
	* Function: Sector2D.Clone
	* Description: Clones the sector.
	* Returns:
	*	{Sector2D} a cloned instance
	*/
	JSM.Sector2D.prototype.Clone = function ()
	{
		return new JSM.Sector2D (this.beg.Clone (), this.end.Clone ());
	};

	/**
	* Class: Sector
	* Description: Represents a 3D sector.
	* Parameters:
	*	beg {Coord} the beginning coordinate
	*	end {Coord} the ending coordinate
	*/
	JSM.Sector = function (beg, end)
	{
		this.beg = beg;
		this.end = end;
	};

	/**
	* Function: Sector.Set
	* Description: Sets the sector.
	* Parameters:
	*	beg {Coord} the beginning coordinate
	*	end {Coord} the ending coordinate
	*/
	JSM.Sector.prototype.Set = function (beg, end)
	{
		this.beg = beg;
		this.end = end;
	};

	/**
	* Function: Sector.GetLength
	* Description: Returns the length of the sector.
	* Returns:
	*	{number} the result
	*/
	JSM.Sector.prototype.GetLength = function ()
	{
		return this.beg.DistanceTo (this.end);
	};

	/**
	* Function: Sector.CoordPosition
	* Description: Calculates the position of the sector and the given coordinate.
	* Parameters:
	*	coord {Coord} the coordinate
	* Returns:
	*	{CoordSectorPosition} the result
	*/
	JSM.Sector.prototype.CoordPosition = function (coord)
	{
		var x = coord.x;
		var y = coord.y;
		var z = coord.z;

		var a = this.beg;
		var b = JSM.CoordSub (this.end, this.beg);
		
		var x1 = a.x;
		var y1 = a.y;
		var z1 = a.z;
		var x2 = a.x + b.x;
		var y2 = a.y + b.y;
		var z2 = a.z + b.z;

		var denom = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1) + (z2 - z1) * (z2 - z1);
		if (JSM.IsZero (denom)) {
			if (a.IsEqual (coord)) {
				return JSM.CoordSectorPosition.CoordOnSectorEndCoord;
			}
			return JSM.CoordSectorPosition.CoordOutsideOfSector;
		}

		var u = ((x2 - x1) * (x - x1) + (y2 - y1) * (y - y1) + (z2 - z1) * (z - z1)) / denom;
		var bu = b.Clone ().MultiplyScalar (u);
		var c = JSM.CoordAdd (a, bu);
		var distance = coord.DistanceTo (c);
		if (JSM.IsZero (distance)) {
			if (JSM.IsLower (u, 0.0) || JSM.IsGreater (u, 1.0)) {
				return JSM.CoordSectorPosition.CoordOutsideOfSector;
			} else if (JSM.IsEqual (u, 0.0) || JSM.IsEqual (u, 1.0)) {
				return JSM.CoordSectorPosition.CoordOnSectorEndCoord;
			}
			return JSM.CoordSectorPosition.CoordInsideOfSector;
		}

		return JSM.CoordSectorPosition.CoordOutsideOfSector;
	};

	/**
	* Function: Sector.Clone
	* Description: Clones the sector.
	* Returns:
	*	{Sector} a cloned instance
	*/
	JSM.Sector.prototype.Clone = function ()
	{
		return new JSM.Sector (this.beg.Clone (), this.end.Clone ());
	};

	/**
	* Function: GetSectorSegmentation2D
	* Description: Returns the segmented coordinates of a sector.
	* Parameters:
	*	sector {Sector2D} the sector
	*	segmentation {integer} the segmentation
	* Returns:
	*	{Coord2D[*]} the result coordinates
	*/
	JSM.GetSectorSegmentation2D = function (sector, segmentation)
	{
		var direction = JSM.CoordSub2D (sector.end, sector.beg);
		var length = sector.beg.DistanceTo (sector.end);
		var step = length / segmentation;
		var distance = 0.0;

		var result = [];
		var i, offseted;
		for (i = 0; i <= segmentation; i++) {
			offseted = sector.beg.Clone ().Offset (direction, distance);
			result.push (offseted);
			distance += step;
		}
		return result;
	};

	/**
	* Function: GetSectorSegmentation
	* Description: Returns the segmented coordinates of a sector.
	* Parameters:
	*	sector {Sector} the sector
	*	segmentation {integer} the segmentation
	* Returns:
	*	{Coord[*]} the result coordinates
	*/
	JSM.GetSectorSegmentation = function (sector, segmentation)
	{
		var direction = JSM.CoordSub (sector.end, sector.beg);
		var length = sector.beg.DistanceTo (sector.end);
		var step = length / segmentation;
		var distance = 0.0;

		var result = [];
		var i, offseted;
		for (i = 0; i <= segmentation; i++) {
			offseted = sector.beg.Clone ().Offset (direction, distance);
			result.push (offseted);
			distance += step;
		}
		return result;
	};

	return JSM;
});

define('skylark-jsmodeler/geometry/line',["../core/jsm"],function(JSM){
	/**
	* Enum: CoordLinePosition2D
	* Description: Position of a coordinate and a line.
	* Values:
	*	{CoordOnLine} coordinate lies on the line
	*	{CoordAtLineLeft} coordinate lies on the left side of the line
	*	{CoordAtLineRight} coordinate lies on the left side right the line
	*/
	JSM.CoordLinePosition2D = {
		CoordOnLine : 0,
		CoordAtLineLeft : 1,
		CoordAtLineRight : 2
	};

	/**
	* Enum: LineLinePosition2D
	* Description: Position of two lines.
	* Values:
	*	{LinesDontIntersect} lines do not intersect
	*	{LinesIntersectsCoincident} lines intersect coincident
	*	{LinesIntersectsOnePoint} lines intersect one point
	*/
	JSM.LineLinePosition2D = {
		LinesDontIntersect : 0,
		LinesIntersectsOnePoint : 1,
		LinesIntersectsCoincident : 2
	};

	/**
	* Enum: CoordLinePosition
	* Description: Position of a coordinate and a line.
	* Values:
	*	{CoordOnLine} coordinate lies on the line
	*	{CoordOutsideOfLine} coordinate lies outside of the line
	*/
	JSM.CoordLinePosition = {
		CoordOnLine : 0,
		CoordOutsideOfLine : 1
	};

	/**
	* Enum: LineLinePosition
	* Description: Position of two lines.
	* Values:
	*	{LinesDontIntersect} lines do not intersect
	*	{LinesIntersectsCoincident} lines intersect coincident
	*	{LinesIntersectsOnePoint} lines intersect one point
	*/
	JSM.LineLinePosition = {
		LinesDontIntersect : 0,
		LinesIntersectsOnePoint : 1,
		LinesIntersectsCoincident : 2
	};

	/**
	* Class: Line2D
	* Description: Represents a 2D infinite line.
	* Parameters:
	*	start {Coord2D} the start point of the line
	*	direction {Vector2D} the direction of the line
	*/
	JSM.Line2D = function (start, direction)
	{
		this.start = start;
		this.direction = direction;
	};

	/**
	* Function: Line2D.Set
	* Description: Sets the line.
	* Parameters:
	*	start {Coord2D} the start point of the line
	*	direction {Vector2D} the direction of the line
	*/
	JSM.Line2D.prototype.Set = function (start, direction)
	{
		this.start = start;
		this.direction = direction;
	};

	/**
	* Function: Line2D.CoordPosition
	* Description: Calculates the position of the line and the given coordinate.
	* Parameters:
	*	coord {Coord2D} the coordinate
	* Returns:
	*	{CoordLinePosition2D} the result
	*/
	JSM.Line2D.prototype.CoordPosition = function (coord)
	{
		var position = this.CoordSignedDistance (coord);
		if (JSM.IsPositive (position)) {
			return JSM.CoordLinePosition2D.CoordAtLineLeft;
		} else if (JSM.IsNegative (position)) {
			return JSM.CoordLinePosition2D.CoordAtLineRight;
		}

		return JSM.CoordLinePosition2D.CoordOnLine;
	};

	/**
	* Function: Line2D.CoordSignedDistance
	* Description: Calculates the signed distance of the line and the given coordinate.
	* Parameters:
	*	coord {Coord2D} the coordinate
	* Returns:
	*	{number} the result
	*/
	JSM.Line2D.prototype.CoordSignedDistance = function (coord)
	{
		var x = coord.x;
		var y = coord.y;
		var a = this.start;
		var b = this.direction;
		return b.x * (y - a.y) - b.y * (x - a.x);
	};

	/**
	* Function: Line2D.LinePosition
	* Description: Calculates the position of the line and the given line.
	* Parameters:
	*	line {Line2D} the line
	*	intersection {Coord2D} (out) the intersection point if it exists
	* Returns:
	*	{LineLinePosition2D} the result
	*/
	JSM.Line2D.prototype.LinePosition = function (line, intersection)
	{
		var x1 = this.start.x;
		var y1 = this.start.y;
		var x2 = this.start.x + this.direction.x;
		var y2 = this.start.y + this.direction.y;
		var x3 = line.start.x;
		var y3 = line.start.y;
		var x4 = line.start.x + line.direction.x;
		var y4 = line.start.y + line.direction.y;
		
		var numeratorA = (x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3);
		var numeratorB = (x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3);
		var denominator = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
		if (JSM.IsZero (denominator)) {
			if (JSM.IsZero (numeratorA) && JSM.IsZero (numeratorB)) {
				return JSM.LineLinePosition2D.LinesIntersectsCoincident;
			}
			return JSM.LineLinePosition2D.LinesDontIntersect;
		}

		var distance = numeratorA / denominator;
		if (intersection !== null) {
			intersection.x = x1 + distance * (x2 - x1);
			intersection.y = y1 + distance * (y2 - y1);
		}
		return JSM.LineLinePosition2D.LinesIntersectsOnePoint;
	};

	/**
	* Function: Line2D.Clone
	* Description: Clones the line.
	* Returns:
	*	{Line2D} a cloned instance
	*/
	JSM.Line2D.prototype.Clone = function ()
	{
		return new JSM.Line2D (this.start.Clone (), this.direction.Clone ());
	};

	/**
	* Class: Line
	* Description: Represents a 3D infinite line.
	* Parameters:
	*	start {Coord} the start point of the line
	*	direction {Vector} the direction of the line
	*/
	JSM.Line = function (start, direction)
	{
		this.start = start;
		this.direction = direction;
	};

	/**
	* Function: Line.Set
	* Description: Sets the line.
	* Parameters:
	*	start {Coord} the start point of the line
	*	direction {Vector} the direction of the line
	*/
	JSM.Line.prototype.Set = function (start, direction)
	{
		this.start = start;
		this.direction = direction;
	};

	/**
	* Function: Line.CoordPosition
	* Description: Calculates the position of the line and the given coordinate.
	* Parameters:
	*	coord {Coord} the coordinate
	*	projected {Coord} (out) the projected coordinate
	* Returns:
	*	{CoordLinePosition} the result
	*/
	JSM.Line.prototype.CoordPosition = function (coord, projected)
	{
		var x = coord.x;
		var y = coord.y;
		var z = coord.z;

		var a = this.start;
		var b = this.direction;

		var x1 = a.x;
		var y1 = a.y;
		var z1 = a.z;
		var x2 = a.x + b.x;
		var y2 = a.y + b.y;
		var z2 = a.z + b.z;

		var denom = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1) + (z2 - z1) * (z2 - z1);
		if (JSM.IsZero (denom)) {
			if (projected !== undefined) {
				projected.Set (a.x, a.y, a.z);
			}

			if (a.IsEqual (coord)) {
				return JSM.CoordLinePosition.CoordOnLine;
			}

			return JSM.CoordLinePosition.CoordOutsideOfLine;
		}

		var u = ((x2 - x1) * (x - x1) + (y2 - y1) * (y - y1) + (z2 - z1) * (z - z1)) / denom;
		var bu = b.Clone ().MultiplyScalar (u);
		var c = JSM.CoordAdd (a, bu);
		if (projected !== undefined) {
			projected.Set (c.x, c.y, c.z);
		}

		var distance = coord.DistanceTo (c);
		if (JSM.IsZero (distance)) {
			return JSM.CoordLinePosition.CoordOnLine;
		}

		return JSM.CoordLinePosition.CoordOutsideOfLine;
	};

	/**
	* Function: Line.ProjectCoord
	* Description: Calculates the projected coordinate of the given coordinate.
	* Parameters:
	*	coord {Coord} the coordinate
	* Returns:
	*	{Coord} the result
	*/
	JSM.Line.prototype.ProjectCoord = function (coord)
	{
		var x = coord.x;
		var y = coord.y;
		var z = coord.z;

		var a = this.start;
		var b = this.direction;

		var x1 = a.x;
		var y1 = a.y;
		var z1 = a.z;
		var x2 = a.x + b.x;
		var y2 = a.y + b.y;
		var z2 = a.z + b.z;

		var denom = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1) + (z2 - z1) * (z2 - z1);
		if (JSM.IsZero (denom)) {
			return a.Clone ();
		}

		var u = ((x2 - x1) * (x - x1) + (y2 - y1) * (y - y1) + (z2 - z1) * (z - z1)) / denom;
		var bu = b.Clone ().MultiplyScalar (u);
		return JSM.CoordAdd (a, bu);
	};

	/**
	* Function: Line.ClosestPoint
	* Description: Calculates the closest points between the line and a given line.
	* Parameters:
	*	line {Line} the line
	*	thisClosestPoint {Coord} (out) the closest point on the current line
	*	lineClosestPoint {Coord} (out) the closest point on the given line
	* Returns:
	*	{boolean} success
	*/
	JSM.Line.prototype.ClosestPoint = function (line, thisClosestPoint, lineClosestPoint)
	{
		function Dmnop (v, m, n, o, p)
		{
			var result = (v[m].x - v[n].x) * (v[o].x - v[p].x) + (v[m].y - v[n].y) * (v[o].y - v[p].y) + (v[m].z - v[n].z) * (v[o].z - v[p].z);
			return result;
		}

		var aDir = this.direction.Clone ().Normalize ();
		var aStart = this.start;
		var aEnd = JSM.CoordAdd (aStart, aDir);

		var bDir = line.direction.Clone ().Normalize ();
		var bStart = line.start;
		var bEnd = JSM.CoordAdd (bStart, bDir);
		
		var v = [aStart, aEnd, bStart, bEnd];
		var d1010 = Dmnop (v, 1, 0, 1, 0);
		var d0210 = Dmnop (v, 0, 2, 1, 0);
		var d0232 = Dmnop (v, 0, 2, 3, 2);
		var d3210 = Dmnop (v, 3, 2, 1, 0);
		var d3232 = Dmnop (v, 3, 2, 3, 2);
		var denom = (d1010 * d3232 - d3210 * d3210);
		if (JSM.IsEqual (denom, 0.0)) {
			return false;
		}
		
		var nom = (d0232 * d3210 - d0210 * d3232);
		var mua = nom / denom;
		var mub = (d0232 + mua * d3210) / d3232;

		if (thisClosestPoint !== undefined) {
			aDir.MultiplyScalar (mua);
			var aClosest = JSM.CoordAdd (aStart, aDir);
			thisClosestPoint.Set (aClosest.x, aClosest.y, aClosest.z);
		}
		
		if (lineClosestPoint !== undefined) {
			bDir.MultiplyScalar (mub);
			var bClosest = JSM.CoordAdd (bStart, bDir);
			lineClosestPoint.Set (bClosest.x, bClosest.y, bClosest.z);
		}
		
		return true;
	};

	/**
	* Function: Line.LinePosition
	* Description: Calculates the position of the line and the given line.
	* Parameters:
	*	line {Line} the line
	*	intersection {Coord} (out) the intersection point if it exists
	* Returns:
	*	{LineLinePosition} the result
	*/
	JSM.Line.prototype.LinePosition = function (line, intersection)
	{
		var thisClosestPoint = new JSM.Coord (0.0, 0.0, 0.0);
		var lineClosestPoint = new JSM.Coord (0.0, 0.0, 0.0);
		if (!this.ClosestPoint (line, thisClosestPoint, lineClosestPoint)) {
			return JSM.LineLinePosition.LinesIntersectsCoincident;
		}
		
		if (thisClosestPoint.IsEqual (lineClosestPoint)) {
			if (intersection !== undefined) {
				intersection.Set (thisClosestPoint.x, thisClosestPoint.y, thisClosestPoint.z);
			}
			return JSM.LineLinePosition.LinesIntersectsOnePoint;
		}
		
		return JSM.LineLinePosition.LinesDontIntersect;
	};

	/**
	* Function: Line.Clone
	* Description: Clones the line.
	* Returns:
	*	{Line} a cloned instance
	*/
	JSM.Line.prototype.Clone = function ()
	{
		return new JSM.Line (this.start.Clone (), this.direction.Clone ());
	};

	return JSM;
});

define('skylark-jsmodeler/geometry/box',["../core/jsm"],function(JSM){
	/**
	* Class: Box2D
	* Description: Represents a 2D box.
	* Parameters:
	*	min {Coord2D} the minimum position of the box
	*	min {Coord2D} the maximum position of the box
	*/
	JSM.Box2D = function (min, max)
	{
		this.min = min;
		this.max = max;
	};

	/**
	* Function: Box2D.Set
	* Description: Sets the box.
	* Parameters:
	*	min {Coord2D} the minimum position of the box
	*	min {Coord2D} the maximum position of the box
	*/
	JSM.Box2D.prototype.Set = function (min, max)
	{
		this.min = min;
		this.max = max;
	};

	/**
	* Function: Box2D.GetCenter
	* Description: Returns the center point of the box.
	* Returns:
	*	{Coord2D} the result
	*/
	JSM.Box2D.prototype.GetCenter = function ()
	{
		return JSM.MidCoord2D (this.min, this.max);
	};

	/**
	* Function: Box2D.Clone
	* Description: Clones the box.
	* Returns:
	*	{Box2D} a cloned instance
	*/
	JSM.Box2D.prototype.Clone = function ()
	{
		return new JSM.Box2D (this.min.Clone (), this.max.Clone ());
	};

	/**
	* Class: Box
	* Description: Represents a 3D box.
	* Parameters:
	*	min {Coord} the minimum position of the box
	*	min {Coord} the maximum position of the box
	*/
	JSM.Box = function (min, max)
	{
		this.min = min;
		this.max = max;
	};

	/**
	* Function: Box.Set
	* Description: Sets the box.
	* Parameters:
	*	min {Coord} the minimum position of the box
	*	min {Coord} the maximum position of the box
	*/
	JSM.Box.prototype.Set = function (min, max)
	{
		this.min = min;
		this.max = max;
	};

	/**
	* Function: Box.GetCenter
	* Description: Returns the center point of the box.
	* Returns:
	*	{Coord} the result
	*/
	JSM.Box.prototype.GetCenter = function ()
	{
		return JSM.MidCoord (this.min, this.max);
	};

	/**
	* Function: Box.GetSize
	* Description: Returns the size of the box.
	* Returns:
	*	{Coord} the result
	*/
	JSM.Box.prototype.GetSize = function ()
	{
		return JSM.CoordSub (this.max, this.min);
	};

	/**
	* Function: Box.IsCoordInside
	* Description: Determines if the given coordinate is inside the box.
	* Parameters:
	*	coord {Coord} the coordinate
	* Returns:
	*	{boolean} the result
	*/
	JSM.Box.prototype.IsCoordInside = function (coord)
	{
		if (JSM.IsLower (coord.x, this.min.x) || JSM.IsLower (coord.y, this.min.y) || JSM.IsLower (coord.z, this.min.z)) {
			return false;
		}
		if (JSM.IsGreater (coord.x, this.max.x) || JSM.IsGreater (coord.y, this.max.y) || JSM.IsGreater (coord.z, this.max.z)) {
			return false;
		}
		return true;
	};

	/**
	* Function: Box.Clone
	* Description: Clones the box.
	* Returns:
	*	{Box} a cloned instance
	*/
	JSM.Box.prototype.Clone = function ()
	{
		return new JSM.Box (this.min.Clone (), this.max.Clone ());
	};

	/**
	* Function: BoxUnion
	* Description: Calculates the union of two 3D boxes.
	* Parameters:
	*	aBox {Box} the first box
	*	bBox {Box} the second box
	* Returns:
	*	{Box} the result
	*/
	JSM.BoxUnion = function (aBox, bBox)
	{
		var min = new JSM.Coord (JSM.Minimum (aBox.min.x, bBox.min.x), JSM.Minimum (aBox.min.y, bBox.min.y), JSM.Minimum (aBox.min.z, bBox.min.z));
		var max = new JSM.Coord (JSM.Maximum (aBox.max.x, bBox.max.x), JSM.Maximum (aBox.max.y, bBox.max.y), JSM.Maximum (aBox.max.z, bBox.max.z));
		return new JSM.Box (min, max);
	};

	return JSM;
});

define('skylark-jsmodeler/geometry/sphere',["../core/jsm"],function(JSM){
	/**
	* Class: Sphere
	* Description: Represents a sphere.
	* Parameters:
	*	center {Coord} the center of the sphere
	*	radius {number} the radius of the sphere
	*/
	JSM.Sphere = function (center, radius)
	{
		this.center = center;
		this.radius = radius;
	};

	/**
	* Function: Sphere.Set
	* Description: Sets the sphere.
	* Parameters:
	*	center {Coord} the center of the sphere
	*	radius {number} the radius of the sphere
	*/
	JSM.Sphere.prototype.Set = function (center, radius)
	{
		this.center = center;
		this.radius = radius;
	};

	/**
	* Function: Sphere.GetCenter
	* Description: Returns the center of the sphere.
	* Returns:
	*	{Coord} the result
	*/
	JSM.Sphere.prototype.GetCenter = function ()
	{
		return this.center;
	};

	/**
	* Function: Sphere.GetRadius
	* Description: Returns the radius of the sphere.
	* Returns:
	*	{number} the result
	*/
	JSM.Sphere.prototype.GetRadius = function ()
	{
		return this.radius;
	};

	/**
	* Function: Sphere.Clone
	* Description: Clones the sphere.
	* Returns:
	*	{Sphere} a cloned instance
	*/
	JSM.Sphere.prototype.Clone = function ()
	{
		return new JSM.Sphere (this.center.Clone (), this.radius);
	};

	return JSM;
});

define('skylark-jsmodeler/geometry/transformation',["../core/jsm"],function(JSM){
	/**
	* Class: Transformation
	* Description: Represents a transformation matrix.
	*/
	JSM.Transformation = function ()
	{
		this.matrix = JSM.MatrixIdentity ();
	};

	/**
	* Function: Transformation.GetMatrix
	* Description: Returns the matrix of the transformation.
	* Returns:
	*	{number[16]} the matrix
	*/
	JSM.Transformation.prototype.GetMatrix = function ()
	{
		return this.matrix;
	};

	/**
	* Function: Transformation.SetMatrix
	* Description: Sets matrix of the transformation.
	* Parameters:
	*	matrix {number[16]} the matrix
	*/
	JSM.Transformation.prototype.SetMatrix = function (matrix)
	{
		this.matrix = matrix;
	};

	/**
	* Function: Transformation.Append
	* Description: Adds a transformation to the matrix.
	* Parameters:
	*	source {Transformation} the another transformation
	*/
	JSM.Transformation.prototype.Append = function (source)
	{
		this.matrix = JSM.MatrixMultiply (this.matrix, source.matrix);
	};

	/**
	* Function: Transformation.Apply
	* Description: Apply transformation to a coordinate.
	* Parameters:
	*	coord {Coord} the coordinate
	* Returns:
	*	{Coord} the result
	*/
	JSM.Transformation.prototype.Apply = function (coord)
	{
		return JSM.ApplyTransformation (this.matrix, coord);
	};

	/**
	* Function: Transformation.Clone
	* Description: Clones the transformation.
	* Returns:
	*	{Transformation} a cloned instance
	*/
	JSM.Transformation.prototype.Clone = function ()
	{
		var result = new JSM.Transformation ();
		result.matrix = JSM.MatrixClone (this.matrix);
		return result;
	};

	/**
	* Function: IdentityTransformation
	* Description: Generates an identity transformation.
	* Returns:
	*	{Transformation} the result
	*/
	JSM.IdentityTransformation = function ()
	{
		var transformation = new JSM.Transformation ();
		transformation.matrix = JSM.MatrixIdentity ();
		return transformation;
	};

	/**
	* Function: TranslationTransformation
	* Description: Generates a translation transformation.
	* Parameters:
	*	translation {Vector} the translation vector
	* Returns:
	*	{Transformation} the result
	*/
	JSM.TranslationTransformation = function (translation)
	{
		var transformation = new JSM.Transformation ();
		transformation.matrix = JSM.MatrixTranslation (translation.x, translation.y, translation.z);
		return transformation;
	};

	/**
	* Function: OffsetTransformation
	* Description: Generates an offset transformation.
	* Parameters:
	*	direction {Vector} the direction of the offset
	*	distance {number} the distance of the offset
	* Returns:
	*	{Transformation} the result
	*/
	JSM.OffsetTransformation = function (direction, distance)
	{
		var normal = direction.Clone ().Normalize ();
		var translation = normal.Clone ().MultiplyScalar (distance);
		return JSM.TranslationTransformation (translation);
	};

	/**
	* Function: RotationTransformation
	* Description: Generates a rotation transformation.
	* Parameters:
	*	axis {Vector} the axis of the rotation
	*	angle {number} the angle of the rotation
	*	origo {Coord} the origo of the rotation
	* Returns:
	*	{Transformation} the result
	*/
	JSM.RotationTransformation = function (axis, angle, origo)
	{
		var transformation = new JSM.Transformation ();
		transformation.matrix = JSM.MatrixRotation (axis, angle, origo);
		return transformation;
	};

	/**
	* Function: RotationXTransformation
	* Description: Generates a rotation transformation around the x axis.
	* Parameters:
	*	angle {number} the angle of the rotation
	*	origo {Coord} the origo of the rotation
	* Returns:
	*	{Transformation} the result
	*/
	JSM.RotationXTransformation = function (angle, origo)
	{
		var transformation = new JSM.Transformation ();
		if (origo === undefined || origo === null) {
			transformation.matrix = JSM.MatrixRotationX (angle);
		} else {
			transformation.Append (JSM.TranslationTransformation (new JSM.Vector (-origo.x, -origo.y, -origo.z)));
			transformation.Append (JSM.RotationXTransformation (angle));
			transformation.Append (JSM.TranslationTransformation (new JSM.Vector (origo.x, origo.y, origo.z)));
		}
		return transformation;
	};

	/**
	* Function: RotationYTransformation
	* Description: Generates a rotation transformation around the y axis.
	* Parameters:
	*	angle {number} the angle of the rotation
	*	origo {Coord} the origo of the rotation
	* Returns:
	*	{Transformation} the result
	*/
	JSM.RotationYTransformation = function (angle, origo)
	{
		var transformation = new JSM.Transformation ();
		if (origo === undefined || origo === null) {
			transformation.matrix = JSM.MatrixRotationY (angle);
		} else {
			transformation.Append (JSM.TranslationTransformation (new JSM.Vector (-origo.x, -origo.y, -origo.z)));
			transformation.Append (JSM.RotationYTransformation (angle));
			transformation.Append (JSM.TranslationTransformation (new JSM.Vector (origo.x, origo.y, origo.z)));
		}
		return transformation;
	};

	/**
	* Function: RotationZTransformation
	* Description: Generates a rotation transformation around the z axis.
	* Parameters:
	*	angle {number} the angle of the rotation
	*	origo {Coord} the origo of the rotation
	* Returns:
	*	{Transformation} the result
	*/
	JSM.RotationZTransformation = function (angle, origo)
	{
		var transformation = new JSM.Transformation ();
		if (origo === undefined || origo === null) {
			transformation.matrix = JSM.MatrixRotationZ (angle);
		} else {
			transformation.Append (JSM.TranslationTransformation (new JSM.Vector (-origo.x, -origo.y, -origo.z)));
			transformation.Append (JSM.RotationZTransformation (angle));
			transformation.Append (JSM.TranslationTransformation (new JSM.Vector (origo.x, origo.y, origo.z)));
		}
		return transformation;
	};

	/**
	* Function: RotationXYZTransformation
	* Description: Generates a rotation transformation around all axis in x, y, z order.
	* Parameters:
	*	xAngle {number} the x angle of the rotation
	*	yAngle {number} the y angle of the rotation
	*	zAngle {number} the z angle of the rotation
	*	origo {Coord} the origo of the rotation
	* Returns:
	*	{Transformation} the result
	*/
	JSM.RotationXYZTransformation = function (xAngle, yAngle, zAngle, origo)
	{
		var transformation = new JSM.Transformation ();
		transformation.Append (JSM.RotationXTransformation (xAngle, origo));
		transformation.Append (JSM.RotationYTransformation (yAngle, origo));
		transformation.Append (JSM.RotationZTransformation (zAngle, origo));
		return transformation;
	};

	return JSM;
});

define('skylark-jsmodeler/geometry/plane',["../core/jsm"],function(JSM){
	/**
	* Enum: CoordPlanePosition
	* Description: Position of a coordinate and a plane.
	* Values:
	*	{CoordOnPlane} coordinate lies on the plane
	*	{CoordInFrontOfPlane} coordinate lies in front of of the plane
	*	{CoordAtBackOfPlane} coordinate lies at the back of the plane
	*/
	JSM.CoordPlanePosition = {
		CoordOnPlane : 0,
		CoordInFrontOfPlane : 1,
		CoordAtBackOfPlane : 2
	};

	/**
	* Enum: LinePlanePosition
	* Description: Position of a line and a plane.
	* Values:
	*	{LineParallelToPlane} line is parallel to the plane
	*	{LineIntersectsPlane} line intersects the plane
	*/
	JSM.LinePlanePosition = {
		LineParallelToPlane : 0,
		LineIntersectsPlane : 1
	};

	/**
	* Class: Plane
	* Description: Represents a plane.
	* Parameters:
	*	a {number} the a component of plane equation
	*	b {number} the b component of plane equation
	*	c {number} the c component of plane equation
	*	d {number} the d component of plane equation
	*/
	JSM.Plane = function (a, b, c, d)
	{
		this.a = a;
		this.b = b;
		this.c = c;
		this.d = d;
	};

	/**
	* Function: Plane.Set
	* Description: Sets the plane.
	* Parameters:
	*	a {number} the a component of plane equation
	*	b {number} the b component of plane equation
	*	c {number} the c component of plane equation
	*	d {number} the d component of plane equation
	*/
	JSM.Plane.prototype.Set = function (a, b, c, d)
	{
		this.a = a;
		this.b = b;
		this.c = c;
		this.d = d;
	};

	/**
	* Function: Plane.GetNormal
	* Description: Calculates the normal vector of the plane.
	* Returns:
	*	{Vector} the result
	*/
	JSM.Plane.prototype.GetNormal = function ()
	{
		return new JSM.Vector (this.a, this.b, this.c);
	};

	/**
	* Function: Plane.CoordSignedDistance
	* Description: Calculates the signed distance of a coordinate and the plane.
	* Parameters:
	*	coord {Coord} the coordinate
	* Returns:
	*	{number} the result
	*/
	JSM.Plane.prototype.CoordSignedDistance = function (coord)
	{
		var x = coord.x;
		var y = coord.y;
		var z = coord.z;

		var a = this.a;
		var b = this.b;
		var c = this.c;
		var d = this.d;

		var distance = (a * x + b * y + c * z + d) / Math.sqrt (a * a + b * b + c * c);
		return distance;
	};

	/**
	* Function: Plane.CoordDistance
	* Description: Calculates the distance of a coordinate and the plane.
	* Parameters:
	*	coord {Coord} the coordinate
	* Returns:
	*	{number} the result
	*/
	JSM.Plane.prototype.CoordDistance = function (coord)
	{
		var signed = this.CoordSignedDistance (coord);
		return Math.abs (signed);
	};

	/**
	* Function: Plane.ProjectCoord
	* Description: Projects a coordinate to the plane.
	* Parameters:
	*	coord {Coord} the coordinate
	* Returns:
	*	{Coord} the projected coordinate
	*/
	JSM.Plane.prototype.ProjectCoord = function (coord)
	{
		var x = coord.x;
		var y = coord.y;
		var z = coord.z;

		var a = this.a;
		var b = this.b;
		var c = this.c;
		var d = this.d;

		var distance = this.CoordDistance (coord);
		var side = a * x + b * y + c * z + d;
		if (JSM.IsGreater (side, 0.0)) {
			distance = -distance;
		}

		var normal = this.GetNormal ().Normalize ();
		var result = coord.Clone ().Offset (normal, distance);
		return result;
	};


	/**
	* Function: Plane.CoordPosition
	* Description: Calculates the position of the plane and the given coordinate.
	* Parameters:
	*	coord {Coord} the coordinate
	* Returns:
	*	{CoordPlanePosition} thre result
	*/
	JSM.Plane.prototype.CoordPosition = function (coord)
	{
		var a = this.a;
		var b = this.b;
		var c = this.c;
		var d = this.d;

		var x = coord.x;
		var y = coord.y;
		var z = coord.z;

		var s = a * x + b * y + c * z + d;
		if (JSM.IsPositive (s)) {
			return JSM.CoordPlanePosition.CoordInFrontOfPlane;
		} else if (JSM.IsNegative (s)) {
			return JSM.CoordPlanePosition.CoordAtBackOfPlane;
		}
		
		return JSM.CoordPlanePosition.CoordOnPlane;
	};

	/**
	* Function: Plane.LinePosition
	* Description: Calculates the position of the plane and the given line.
	* Parameters:
	*	line {Line} the line
	*	intersection {Coord} (out) the intersection point if it exists
	* Returns:
	*	{CoordLinePosition} the result
	*/
	JSM.Plane.prototype.LinePosition = function (line, intersection)
	{
		var	direction = line.direction.Clone ().Normalize ();

		var x1 = line.start.x;
		var y1 = line.start.y;
		var z1 = line.start.z;

		var x2 = line.start.x + direction.x;
		var y2 = line.start.y + direction.y;
		var z2 = line.start.z + direction.z;

		var a = this.a;
		var b = this.b;
		var c = this.c;
		var d = this.d;

		var denom = (a * (x1 - x2) + b * (y1 - y2) + c * (z1 - z2));
		if (JSM.IsZero (denom)) {
			return JSM.LinePlanePosition.LineParallelToPlane;
		}

		var u = (a * x1 + b * y1 + c * z1 + d) / denom;
		if (intersection !== undefined) {
			direction.MultiplyScalar (u);
			var i = JSM.CoordAdd (line.start, direction);
			intersection.Set (i.x, i.y, i.z);
		}

		return JSM.LinePlanePosition.LineIntersectsPlane;
	};

	/**
	* Function: Plane.LineIntersection
	* Description:
	*	Calculates the intersection point of a line and a plane.
	*	The line should not be parallel to the plane.
	* Parameters:
	*	line {Line} the line
	* Returns:
	*	{Coord} the result
	*/
	JSM.Plane.prototype.LineIntersection = function (line)
	{
		var	direction = line.direction.Clone ().Normalize ();

		var x1 = line.start.x;
		var y1 = line.start.y;
		var z1 = line.start.z;

		var x2 = line.start.x + direction.x;
		var y2 = line.start.y + direction.y;
		var z2 = line.start.z + direction.z;

		var a = this.a;
		var b = this.b;
		var c = this.c;
		var d = this.d;

		var denom = (a * (x1 - x2) + b * (y1 - y2) + c * (z1 - z2));
		if (JSM.IsZero (denom)) {
			return null;
		}

		var u = (a * x1 + b * y1 + c * z1 + d) / denom;
		direction.MultiplyScalar (u);
		return JSM.CoordAdd (line.start, direction);
	};

	/**
	* Function: Plane.Clone
	* Description: Clones the plane.
	* Returns:
	*	{Plane} a cloned instance
	*/
	JSM.Plane.prototype.Clone = function ()
	{
		return new JSM.Plane (this.a, this.b, this.c, this.d);
	};

	/**
	* Function: GetPlaneFromCoordAndDirection
	* Description: Generates a plane from a coordinate and a direction.
	* Parameters:
	*	coord {Coord} the coordinate
	*	direction {Vector} the direction
	* Returns:
	*	{Plane} the result
	*/
	JSM.GetPlaneFromCoordAndDirection = function (coord, direction)
	{
		var plane = new JSM.Plane ();
		var normal = direction.Clone ().Normalize ();
		var pa = normal.x;
		var pb = normal.y;
		var pc = normal.z;
		var pd = -(pa * coord.x + pb * coord.y + pc * coord.z);
		plane.Set (pa, pb, pc, pd);
		return plane;
	};

	/**
	* Function: GetPlaneFromThreeCoords
	* Description: Generates a plane from three coordinates.
	* Parameters:
	*	a {Coord} the first coordinate
	*	b {Coord} the second coordinate
	*	c {Coord} the third coordinate
	* Returns:
	*	{Plane} the result
	*/
	JSM.GetPlaneFromThreeCoords = function (a, b, c)
	{
		var plane = new JSM.Plane ();
		var pa = (b.y - a.y) * (c.z - a.z) - (c.y - a.y) * (b.z - a.z);
		var pb = (b.z - a.z) * (c.x - a.x) - (c.z - a.z) * (b.x - a.x);
		var pc = (b.x - a.x) * (c.y - a.y) - (c.x - a.x) * (b.y - a.y);
		var pd = -(pa * a.x + pb * a.y + pc * a.z);
		plane.Set (pa, pb, pc, pd);
		return plane;
	};

	/**
	* Function: CoordPlaneSignedDirectionalDistance
	* Description: Calculates the signed distance of a coordinate and a plane along a direction vector.
	* Parameters:
	*	coord {Coord} the coordinate
	*	direction {Vector} the direction
	*	plane {Plane} the plane
	* Returns:
	*	{number} the result
	*/
	JSM.CoordPlaneSignedDirectionalDistance = function (coord, direction, plane)
	{
		var	normal = direction.Clone ().Normalize ();

		var x1 = coord.x;
		var y1 = coord.y;
		var z1 = coord.z;

		var x2 = coord.x + normal.x;
		var y2 = coord.y + normal.y;
		var z2 = coord.z + normal.z;

		var a = plane.a;
		var b = plane.b;
		var c = plane.c;
		var d = plane.d;

		var denom = (a * (x1 - x2) + b * (y1 - y2) + c * (z1 - z2));
		if (JSM.IsZero (denom)) {
			return 0.0;
		}

		var u = (a * x1 + b * y1 + c * z1 + d) / denom;
		normal.MultiplyScalar (u);
		var intersection = JSM.CoordAdd (coord, normal);
		var distance = coord.DistanceTo (intersection);
		var s = a * x1 + b * y1 + c * z1 + d;
		if (JSM.IsNegative (s)) {
			distance = -distance;
		}

		return distance;
	};

	/**
	* Function: CoordPlaneDirectionalDistance
	* Description: Calculates the distance of a coordinate and a plane along a direction vector.
	* Parameters:
	*	coord {Coord} the coordinate
	*	direction {Vector} the direction
	*	plane {Plane} the plane
	* Returns:
	*	{number} the result
	*/
	JSM.CoordPlaneDirectionalDistance = function (coord, direction, plane)
	{
		return Math.abs (JSM.CoordPlaneSignedDirectionalDistance (coord, direction, plane));
	};

	return JSM;
});

define('skylark-jsmodeler/geometry/projection',["../core/jsm"],function(JSM){
	/**
	* Function: MatrixView
	* Description: Creates a view matrix.
	* Parameters:
	*	eye {Coord} eye position
	*	center {Coord} center position
	*	up {Vector} up vector
	* Returns:
	*	{number[16]} the result matrix
	*/
	JSM.MatrixView = function (eye, center, up)
	{
		if (eye.IsEqual (center)) {
			return JSM.MatrixIdentity ();
		}
		
		var result = [];

		var d = JSM.CoordSub (eye, center).Normalize ();
		var v = JSM.VectorCross (up, d).Normalize ();
		var u = JSM.VectorCross (d, v).Normalize ();

		result[0] = v.x;
		result[1] = u.x;
		result[2] = d.x;
		result[3] = 0.0;
		result[4] = v.y;
		result[5] = u.y;
		result[6] = d.y;
		result[7] = 0.0;
		result[8] = v.z;
		result[9] = u.z;
		result[10] = d.z;
		result[11] = 0.0;
		result[12] = -JSM.VectorDot (v, eye);
		result[13] = -JSM.VectorDot (u, eye);
		result[14] = -JSM.VectorDot (d, eye);
		result[15] = 1.0;
		
		return result;
	};

	/**
	* Function: MatrixPerspective
	* Description: Creates a perspective matrix.
	* Parameters:
	*	fieldOfView {number} field of view
	*	aspectRatio {number} aspect ratio
	*	nearPlane {number} near clipping plane
	*	farPlane {number} far clipping plane
	* Returns:
	*	{number[16]} the result matrix
	*/
	JSM.MatrixPerspective = function (fieldOfView, aspectRatio, nearPlane, farPlane)
	{
		var result = [];
		
		var f = 1.0 / Math.tan (fieldOfView / 2.0);
		var nf = 1.0 / (nearPlane - farPlane);
		
		result[0] = f / aspectRatio;
		result[1] = 0.0;
		result[2] = 0.0;
		result[3] = 0.0;
		result[4] = 0.0;
		result[5] = f;
		result[6] = 0.0;
		result[7] = 0.0;
		result[8] = 0.0;
		result[9] = 0.0;
		result[10] = (farPlane + nearPlane) * nf;
		result[11] = -1.0;
		result[12] = 0.0;
		result[13] = 0.0;
		result[14] = (2.0 * farPlane * nearPlane) * nf;
		result[15] = 0.0;
		
		return result;
	};

	/**
	* Function: Project
	* Description: Projects a 3D coordinate to 2D.
	* Parameters:
	*	coord {Coord} the coordinate
	*	eye {Coord} the eye of the camera
	*	center {Coord} the center of the camera
	*	up {Vector} the up vector of the camera
	*	fieldOfView {number} camera field of view
	*	aspectRatio {number} aspect ratio of the desired image
	*	nearPlane {number} near cutting plane distance
	*	farPlane {number} far cutting plane distance
	*	viewPort {number[4]} view port coordinates in pixels
	* Returns:
	*	{Coord} the result
	*/
	JSM.Project = function (coord, eye, center, up, fieldOfView, aspectRatio, nearPlane, farPlane, viewPort)
	{
		var input = [
			coord.x,
			coord.y,
			coord.z,
			1.0
		];

		var viewMatrix = JSM.MatrixView (eye, center, up);
		var perspectiveMatrix = JSM.MatrixPerspective (fieldOfView, aspectRatio, nearPlane, farPlane);
		var projectionMatrix = JSM.MatrixMultiply (viewMatrix, perspectiveMatrix);
		var output = JSM.MatrixVectorMultiply (projectionMatrix, input);
		var denom = output[3];
		if (JSM.IsZero (denom)) {
			return null;
		}

		var result = new JSM.Coord (0.0, 0.0, 0.0);
		result.x = (output[0] / denom * 0.5 + 0.5) * viewPort[2] + viewPort[0];
		result.y = (output[1] / denom * 0.5 + 0.5) * viewPort[3] + viewPort[1];
		result.z = (output[2] / denom * 0.5 + 0.5);
		return result;	
	};

	/**
	* Function: Unproject
	* Description: Projects a 2D coordinate to 3D.
	* Parameters:
	*	coord {Coord} the coordinate (the z component can be zero)
	*	eye {Coord} the eye of the camera
	*	center {Coord} the center of the camera
	*	up {Vector} the up vector of the camera
	*	fieldOfView {number} camera field of view
	*	aspectRatio {number} aspect ratio of the desired image
	*	nearPlane {number} near cutting plane distance
	*	farPlane {number} far cutting plane distance
	*	viewPort {number[4]} view port coordinates in pixels
	* Returns:
	*	{Coord} the result
	*/
	JSM.Unproject = function (coord, eye, center, up, fieldOfView, aspectRatio, nearPlane, farPlane, viewPort)
	{
		var input = [
			(coord.x - viewPort[0]) / viewPort[2] * 2.0 - 1.0,
			(coord.y - viewPort[1]) / viewPort[3] * 2.0 - 1.0,
			2.0 * coord.z - 1,
			1.0
		];
		
		var viewMatrix = JSM.MatrixView (eye, center, up);
		var perspectiveMatrix = JSM.MatrixPerspective (fieldOfView, aspectRatio, nearPlane, farPlane);
		var projectionMatrix = JSM.MatrixMultiply (viewMatrix, perspectiveMatrix);
		var inverseMatrix = JSM.MatrixInvert (projectionMatrix);
		var output = JSM.MatrixVectorMultiply (inverseMatrix, input);
		var denom = output[3];
		if (JSM.IsZero (denom)) {
			return null;
		}

		var result = new JSM.Coord (0.0, 0.0, 0.0);
		result.x = (output[0] / output[3]);
		result.y = (output[1] / output[3]);
		result.z = (output[2] / output[3]);
		return result;
	};

	return JSM;
});

define('skylark-jsmodeler/geometry/convexhull',["../core/jsm"],function(JSM){
	/**
	* Function: ConvexHull2D
	* Description: Calculates the 2D convex hull from the given coordinates.
	* Parameters:
	*	coords {Coord2D[*]} the coordinate array
	* Returns:
	*	{Coord2D[*]} coordinate array of the convex hull
	*/
	JSM.ConvexHull2D = function (coords)
	{
		function FindLeftMostCoord (coords)
		{
			var count = coords.length;
			var minValue = JSM.Inf;
			var minIndex = -1;
		
			var i, current;
			for (i = 0; i < count; i++) {
				current = coords[i].x;
				if (JSM.IsLower (current, minValue)) {
					minValue = current;
					minIndex = i;
				}
			}
			
			return minIndex;
		}
		
		function FindNextCoord (coords, current)
		{
			var count = coords.length;
			var next = 0;
			
			var i;
			for (i = 1; i < count; i++) {
				if (current == next) {
					next = i;
				} else {
					if (JSM.CoordOrientation2D (coords[current], coords[next], coords[i]) == JSM.Orientation.Clockwise) {
						next = i;
					}
				}
			}
			
			return next;
		}

		var result = [];
		var count = coords.length;
		if (count < 3) {
			return result;
		}
		
		var first = FindLeftMostCoord (coords);
		var current = first;
		var next;
		
		do {
			result.push (current);
			next = FindNextCoord (coords, current);
			current = next;
		} while (next != first);
		
		return result;
	};

	/**
	* Function: ConvexHull3D
	* Description:
	*	Calculates the 3D convex hull from the given coordinates. The result defines
	*	convex hull triangles as an array of arrays with three coordinates.
	* Parameters:
	*	coords {Coord[*]} the coordinate array
	* Returns:
	*	{Coord[3][*]} the result
	*/
	JSM.ConvexHull3D = function (coords)
	{
		function Vertex ()
		{
			this.position = null;
		}
		
		function Edge ()
		{
			this.vert1 = null;
			this.vert2 = null;
			this.tri1 = null;
			this.tri2 = null;
		}

		function Triangle ()
		{
			this.vertices = null;
			this.edges = null;
			this.valid = null;
		}

		function Body ()
		{
			this.vertices = [];
			this.edges = [];
			this.triangles = [];
		}

		function AddVertex (body, coord)
		{
			var vertex = new Vertex ();
			vertex.position = coord;
			body.vertices.push (vertex);
			return body.vertices.length - 1;
		}

		function AddEdge (body, triangleIndex, a, b)
		{
			var edgeIndex = -1;
		
			var i, current;
			for (i = 0; i < body.edges.length; i++) {
				current = body.edges[i];
				if (current.vert1 == a && current.vert2 == b || current.vert1 == b && current.vert2 == a) {
					edgeIndex = i;
					break;
				}
			}
			
			if (edgeIndex == -1) {
				var newEdge = new Edge ();
				newEdge.vert1 = a;
				newEdge.vert2 = b;
				newEdge.tri1 = -1;
				newEdge.tri2 = -1;
				body.edges.push (newEdge);
				edgeIndex = body.edges.length - 1;
			}
			
			var edge = body.edges[edgeIndex];
			if (edge.tri1 != triangleIndex && edge.tri2 != triangleIndex) {
				if (edge.tri1 == -1) {
					edge.tri1 = triangleIndex;
				} else if (edge.tri2 == -1) {
					edge.tri2 = triangleIndex;
				}
			}
			
			return edgeIndex;
		}

		function AddTriangle (body, a, b, c)
		{
			var triangleIndex = body.triangles.length;
			var edge1 = AddEdge (body, triangleIndex, a, b);
			var edge2 = AddEdge (body, triangleIndex, b, c);
			var edge3 = AddEdge (body, triangleIndex, c, a);
			
			var triangle = new Triangle ();
			triangle.vertices = [a, b, c];
			triangle.edges = [edge1, edge2, edge3];
			triangle.valid = true;
			body.triangles.push (triangle);
			return body.triangles.length - 1;
		}

		function RemoveTriangleFromEdge (body, triangleIndex, edgeIndex)
		{
			var edge = body.edges[edgeIndex];
			if (edge.tri1 == triangleIndex) {
				edge.tri1 = -1;
			} else if (edge.tri2 == triangleIndex) {
				edge.tri2 = -1;
			}
		}

		function RemoveTriangle (body, triangleIndex)
		{
			var triangle = body.triangles[triangleIndex];
			if (!triangle.valid) {
				return;
			}
			
			RemoveTriangleFromEdge (body, triangleIndex, triangle.edges[0]);
			RemoveTriangleFromEdge (body, triangleIndex, triangle.edges[1]);
			RemoveTriangleFromEdge (body, triangleIndex, triangle.edges[2]);
			triangle.valid = false;
		}

		function GetTetrahedronVolume (body, a, b, c, d)
		{
			var aCoord = body.vertices[a].position;
			var bCoord = body.vertices[b].position;
			var cCoord = body.vertices[c].position;
			var dCoord = body.vertices[d].position;
			
			var adSub = JSM.CoordSub (aCoord, dCoord);
			var bdSub = JSM.CoordSub (bCoord, dCoord);
			var cdSub = JSM.CoordSub (cCoord, dCoord);
			
			return (JSM.VectorDot (adSub, JSM.VectorCross (bdSub, cdSub))) / 6.0;
		}
		
		function CheckTetrahedronOrientation (body, a, b, c, d)
		{
			if (JSM.IsLower (GetTetrahedronVolume (body, a, b, c, d), 0.0)) {
				return false;
			}
			return true;
		}
		
		function AddInitialTetrahedron (body)
		{
			var triangleIndex = -1;
			if (CheckTetrahedronOrientation (body, 0, 1, 2, 3)) {
				triangleIndex = AddTriangle (body, 0, 1, 2);
			} else {
				triangleIndex = AddTriangle (body, 0, 2, 1);
			}

			var triangle = body.triangles[triangleIndex];
			AddTriangle (body, triangle.vertices[0], triangle.vertices[2], 3);
			AddTriangle (body, triangle.vertices[2], triangle.vertices[1], 3);
			AddTriangle (body, triangle.vertices[1], triangle.vertices[0], 3);
		}

		function AddCoordToHull (body, index)
		{
			var visibleTriangles = [];
			
			var i, triangle;
			for (i = 0; i < body.triangles.length; i++) {
				triangle = body.triangles[i];
				if (!triangle.valid) {
					visibleTriangles.push (false);
					continue;
				}

				if (CheckTetrahedronOrientation (body, triangle.vertices[0], triangle.vertices[2], triangle.vertices[1], index)) {
					visibleTriangles.push (true);
				} else {
					visibleTriangles.push (false);
				}
			}
			
			var edge1, edge2, edge3, edge1Vis, edge2Vis, edge3Vis;
			var newTriangles = [];
			for (i = 0; i < visibleTriangles.length; i++) {
				if (!visibleTriangles[i]) {
					continue;
				}

				triangle = body.triangles[i];
				if (!triangle.valid) {
					continue;
				}
				
				edge1 = body.edges[triangle.edges[0]];
				edge2 = body.edges[triangle.edges[1]];
				edge3 = body.edges[triangle.edges[2]];

				edge1Vis = (edge1.tri1 == -1 || edge1.tri2 == -1 || visibleTriangles[edge1.tri1] != visibleTriangles[edge1.tri2]);
				edge2Vis = (edge2.tri1 == -1 || edge2.tri2 == -1 || visibleTriangles[edge2.tri1] != visibleTriangles[edge2.tri2]);
				edge3Vis = (edge3.tri1 == -1 || edge3.tri2 == -1 || visibleTriangles[edge3.tri1] != visibleTriangles[edge3.tri2]);
				
				if (edge1Vis) {
					newTriangles.push ([triangle.vertices[0], triangle.vertices[1], index]);
				}
				
				if (edge2Vis) {
					newTriangles.push ([triangle.vertices[1], triangle.vertices[2], index]);
				}
				
				if (edge3Vis) {
					newTriangles.push ([triangle.vertices[2], triangle.vertices[0], index]);
				}
			}

			for (i = 0; i < visibleTriangles.length; i++) {
				if (!visibleTriangles[i]) {
					continue;
				}
				
				triangle = body.triangles[i];
				if (!triangle.valid) {
					continue;
				}
				
				RemoveTriangle (body, i);
			}
			
			var newTriangle;
			for (i = 0; i < newTriangles.length; i++) {
				newTriangle = newTriangles[i];
				AddTriangle (body, newTriangle[0], newTriangle[1], newTriangle[2]);
			}
		}
		
		var result = [];
		var count = coords.length;
		if (count < 4) {
			return result;
		}

		var body = new Body ();
		
		var i;
		for (i = 0; i < count; i++) {
			AddVertex (body, coords[i]);
		}
		
		AddInitialTetrahedron (body);
		for (i = 4; i < count; i++) {
			AddCoordToHull (body, i);
		}
		
		var triangle;
		for (i = 0; i < body.triangles.length; i++) {
			triangle = body.triangles[i];
			if (triangle.valid) {
				result.push (triangle.vertices);
			}
		}
		return result;
	};

	return JSM;
});

define('skylark-jsmodeler/geometry/polygon2d',["../core/jsm"],function(JSM){
	/**
	* Enum: Complexity
	* Description: Complexity of a polygon.
	* Values:
	*	{Invalid} invalid polygon
	*	{Convex} convex polygon
	*	{Concave} concave polygon
	*	{Complex} complex polygon (contains holes)
	*/
	JSM.Complexity = {
		Invalid : 0,
		Convex : 1,
		Concave : 2,
		Complex : 3
	};

	/**
	* Enum: CoordPolygonPosition2D
	* Description: Position of a coordinate and a polygon.
	* Values:
	*	{OnVertex} coordinate lies on a vertex of the polygon
	*	{OnEdge} coordinate lies on an edge of the polygon
	*	{Inside} coordinate lies inside the polygon
	*	{Outside} coordinate lies outside of the polygon
	*/
	JSM.CoordPolygonPosition2D = {
		OnVertex : 0,
		OnEdge : 1,
		Inside : 2,
		Outside : 3
	};

	/**
	* Enum: SectorPolygonPosition2D
	* Description: Position of a sector and a polygon.
	* Values:
	*	{IntersectionOnePoint} sector intersects polygon
	*	{IntersectionCoincident} sector lies on an edge of the polygon
	*	{IntersectionOnVertex} sector intersects polygon on a vertex
	*	{NoIntersection} sector does not intersect polygon
	*/
	JSM.SectorPolygonPosition2D = {
		IntersectionOnePoint : 0,
		IntersectionCoincident : 1,
		IntersectionOnVertex : 2,
		NoIntersection : 3
	};

	/**
	* Class: Polygon2D
	* Description: Represents a 2D polygon.
	*/
	JSM.Polygon2D = function ()
	{
		this.vertices = null;
		this.cache = null;
		this.Clear ();
	};

	/**
	* Function: Polygon2D.AddVertex
	* Description: Adds a vertex to the polygon.
	* Parameters:
	*	x {number} the x coordinate of the vertex
	*	y {number} the y coordinate of the vertex
	*/
	JSM.Polygon2D.prototype.AddVertex = function (x, y)
	{
		this.AddVertexCoord (new JSM.Coord2D (x, y));
	};

	/**
	* Function: Polygon2D.AddVertexCoord
	* Description: Adds a vertex coordinate to the polygon.
	* Parameters:
	*	coord {Coord} the coordinate
	*/
	JSM.Polygon2D.prototype.AddVertexCoord = function (coord)
	{
		this.vertices.push (coord);
		this.ClearCache ();
	};

	/**
	* Function: Polygon2D.GetVertex
	* Description: Returns the vertex with the given index.
	* Parameters:
	*	index {integer} the index of the vertex
	* Returns:
	*	{Coord2D} the vertex
	*/
	JSM.Polygon2D.prototype.GetVertex = function (index)
	{
		return this.vertices[index];
	};

	/**
	* Function: Polygon2D.RemoveVertex
	* Description: Removes a vertex from the polygon.
	* Parameters:
	*	index {integer} the index of the vertex
	*/
	JSM.Polygon2D.prototype.RemoveVertex = function (index)
	{
		this.vertices.splice (index, 1);
	};

	/**
	* Function: Polygon2D.VertexCount
	* Description: Returns the vertex count of the polygon.
	* Returns:
	*	{integer} vertex count
	*/
	JSM.Polygon2D.prototype.VertexCount = function ()
	{
		return this.vertices.length;
	};

	/**
	* Function: Polygon2D.EnumerateVertices
	* Description:
	*	Enumerates the vertices of the polygon, and calls
	*	a function for each vertex.
	* Parameters:
	*	from {integer} the start vertex index
	*	to {integer} the end vertex index
	*	callback {function} the callback function
	*/
	JSM.Polygon2D.prototype.EnumerateVertices = function (from, to, callback)
	{
		var count = this.vertices.length;
		var index = from;
		callback (index);
		while (index != to) {
			index = (index + 1) % count;
			callback (index);
		}
	};

	/**
	* Function: Polygon2D.GetNextVertex
	* Description: Returns the vertex index after the given one.
	* Parameters:
	*	index {integer} the vertex index
	* Returns:
	*	{integer} the result
	*/
	JSM.Polygon2D.prototype.GetNextVertex = function (index)
	{
		return JSM.NextIndex (index, this.vertices.length);
	};

	/**
	* Function: Polygon2D.GetPrevVertex
	* Description: Returns the vertex index before the given one.
	* Parameters:
	*	index {integer} the vertex index
	* Returns:
	*	{integer} the result
	*/
	JSM.Polygon2D.prototype.GetPrevVertex = function (index)
	{
		return JSM.PrevIndex (index, this.vertices.length);
	};

	/**
	* Function: Polygon2D.ShiftVertices
	* Description: Shifts polygon vertices.
	* Parameters:
	*	count {integer} the number of shifts
	*/
	JSM.Polygon2D.prototype.ShiftVertices = function (count)
	{
		JSM.ShiftArray (this.vertices, count);
		this.ClearCache ();
	};

	/**
	* Function: Polygon2D.ReverseVertices
	* Description: Reverses the orientation of the vertices.
	*/
	JSM.Polygon2D.prototype.ReverseVertices = function ()
	{
		this.vertices.reverse ();
		this.ClearCache ();
	};

	/**
	* Function: Polygon2D.GetVertexAngle
	* Description: Returns the angle of the given vertex.
	* Parameters:
	*	index {integer} the vertex index
	* Returns:
	*	{number} the result
	*/
	JSM.Polygon2D.prototype.GetVertexAngle = function (index)
	{
		var prev = this.vertices[this.GetPrevVertex (index)];
		var curr = this.vertices[index];
		var next = this.vertices[this.GetNextVertex (index)];
		var prevDir = JSM.CoordSub2D (prev, curr);
		var nextDir = JSM.CoordSub2D (next, curr);
		return prevDir.AngleTo (nextDir);
	};

	/**
	* Function: Polygon2D.GetSignedArea
	* Description: Calculates the signed area of the polygon.
	* Returns:
	*	{number} the result
	*/
	JSM.Polygon2D.prototype.GetSignedArea = function ()
	{
		if (this.cache.signedArea !== null) {
			return this.cache.signedArea;
		}
		
		var count = this.vertices.length;
		var result = 0.0;
		if (count >= 3) {
			var i, current, next;
			for (i = 0; i < count; i++) {
				current = this.vertices[i];
				next = this.vertices[(i + 1) % count];
				result += current.x * next.y - next.x * current.y;
			}
			result *= 0.5;
		}
		
		this.cache.signedArea = result;
		return result;
	};

	/**
	* Function: Polygon2D.GetArea
	* Description: Calculates the area of the polygon.
	* Returns:
	*	{number} the result
	*/
	JSM.Polygon2D.prototype.GetArea = function ()
	{
		var signedArea = this.GetSignedArea ();
		return Math.abs (signedArea);
	};

	/**
	* Function: Polygon2D.GetOrientation
	* Description: Calculates the orientation of the polygon.
	* Returns:
	*	{Orientation} the result
	*/
	JSM.Polygon2D.prototype.GetOrientation = function ()
	{
		if (this.cache.orientation !== null) {
			return this.cache.orientation;
		}

		var result = JSM.Orientation.Invalid;
		if (this.vertices.length >= 3) {
			var signedArea = this.GetSignedArea ();
			if (JSM.IsPositive (signedArea)) {
				result = JSM.Orientation.CounterClockwise;
			} else if (JSM.IsNegative (signedArea)) {
				result = JSM.Orientation.Clockwise;
			}
		}
		
		this.cache.orientation = result;
		return result;
	};


	/**
	* Function: Polygon2D.GetComplexity
	* Description: Calculates the complexity of the polygon.
	* Returns:
	*	{Complexity} the result
	*/
	JSM.Polygon2D.prototype.GetComplexity = function ()
	{
		if (this.cache.complexity !== null) {
			return this.cache.complexity;
		}
		
		var count = this.vertices.length;
		if (count < 3) {
			return JSM.Complexity.Invalid;
		}
		
		var result = JSM.Complexity.Invalid;
		var polygonOrientain = this.GetOrientation ();
		if (polygonOrientain != JSM.Orientation.Invalid) {
			result = JSM.Complexity.Convex;
			var i;
			for (i = 0; i < count; i++) {
				if (this.IsConcaveVertex (i)) {
					result = JSM.Complexity.Concave;
					break;
				}
			}
		}
		
		this.cache.complexity = result;
		return result;
	};

	/**
	* Function: Polygon2D.GetVertexOrientation
	* Description: Calculates the orientation of the given vertex of the polygon.
	* Parameters:
	*	index {integer} the vertex index
	* Returns:
	*	{Orientation} the result
	*/
	JSM.Polygon2D.prototype.GetVertexOrientation = function (index)
	{
		if (this.cache.vertexOrientations[index] !== undefined) {
			return this.cache.vertexOrientations[index];
		}

		var prev = this.vertices[this.GetPrevVertex (index)];
		var curr = this.vertices[index];
		var next = this.vertices[this.GetNextVertex (index)];
		
		var result = JSM.CoordOrientation2D (prev, curr, next);
		this.cache.vertexOrientations[index] = result;
		return result;
	};

	/**
	* Function: Polygon2D.IsConvexVertex
	* Description: Returns if the given vertex is convex.
	* Parameters:
	*	index {integer} the vertex index
	* Returns:
	*	{boolean} the result
	*/
	JSM.Polygon2D.prototype.IsConvexVertex = function (index)
	{
		var orientation = this.GetOrientation ();
		var vertexOrientation = this.GetVertexOrientation (index);
		if (vertexOrientation == JSM.Orientation.Invalid) {
			return false;
		}
		return vertexOrientation == orientation;
	};

	/**
	* Function: Polygon2D.IsConcaveVertex
	* Description: Returns if the given vertex is concave.
	* Parameters:
	*	index {integer} the vertex index
	* Returns:
	*	{boolean} the result
	*/
	JSM.Polygon2D.prototype.IsConcaveVertex = function (index)
	{
		var orientation = this.GetOrientation ();
		var vertexOrientation = this.GetVertexOrientation (index);
		if (vertexOrientation == JSM.Orientation.Invalid) {
			return false;
		}
		return vertexOrientation != orientation;
	};

	/**
	* Function: Polygon2D.CoordPosition
	* Description: Calculates the position of a coordinate and the polygon.
	* Parameters:
	*	coord {Coord2D} the coordinate
	* Returns:
	*	{CoordPolygonPosition2D} the result
	*/
	JSM.Polygon2D.prototype.CoordPosition = function (coord)
	{
		function IntersectionCount (coord, beg, end)
		{
			function GetIntersection (coord, beg, end)
			{
				var result = new JSM.Coord2D (beg.x, coord.y);
				if (!JSM.IsEqual (beg.y, coord.y)) {
					var yMoveRatio = Math.abs ((beg.y - coord.y) / (end.y - beg.y));
					result.x = beg.x + (end.x - beg.x) * yMoveRatio;
				}
				return result;
			}

			var begYDist = beg.y - coord.y;
			var endYDist = end.y - coord.y;
			
			var begBelow = JSM.IsNegative (begYDist);
			var begAbove = JSM.IsPositive (begYDist);
			var endBelow = JSM.IsNegative (endYDist);
			var endAbove = JSM.IsPositive (endYDist);
			if ((begBelow && endBelow) || (begAbove && endAbove)) {
				return 0;
			}

			var begOnLine = !begBelow && !begAbove;
			var endOnLine = !endBelow && !endAbove;
			if (begOnLine && endOnLine) {
				return 0;
			}

			var intersection = GetIntersection (coord, beg, end);
			if (JSM.IsLower (intersection.x, coord.x)) {
				return 0;
			} else if (JSM.IsGreater (intersection.x, coord.x)) {
				if (begOnLine || endOnLine) {
					var upwardEdge = JSM.IsGreater (end.y, beg.y);
					if (begOnLine && upwardEdge || endOnLine && !upwardEdge) {
						return 1;
					}
					return 0;
				}
				return 1;
			}
			return 1;
		}
		
		var vertexCount = this.vertices.length;
		var intersections = 0;
		var i, edgeFrom, edgeTo, sector, position;
		for (i = 0; i < vertexCount; i++) {
			edgeFrom = this.vertices[i];
			edgeTo = this.vertices[(i + 1) % vertexCount];
			sector = new JSM.Sector2D (edgeFrom, edgeTo);
			position = sector.CoordPosition (coord);
			if (position == JSM.CoordSectorPosition2D.CoordInsideOfSector) {
				return JSM.CoordPolygonPosition2D.OnEdge;
			} else if (position == JSM.CoordSectorPosition2D.CoordOnSectorEndCoord) {
				return JSM.CoordPolygonPosition2D.OnVertex;
			}
			intersections += IntersectionCount (coord, edgeFrom, edgeTo);
		}
		
		if (intersections % 2 !== 0) {
			return JSM.CoordPolygonPosition2D.Inside;
		}
		return JSM.CoordPolygonPosition2D.Outside;
	};

	/**
	* Function: Polygon2D.SectorPosition
	* Description:
	*	Calculates the position of a sector and the polygon. The given begin and end
	*	vertex indices are omitted form intersection checking.
	* Parameters:
	*	sector {Sector2D} the sector
	*	begIndex {integer} begin vertex index
	*	endIndex {integer} end vertex index
	* Returns:
	*	{CoordSectorPosition2D} the result
	*/
	JSM.Polygon2D.prototype.SectorPosition = function (sector, begIndex, endIndex)
	{
		var result = JSM.SectorPolygonPosition2D.NoIntersection;
		var vertexCount = this.vertices.length;
		if (vertexCount < 3) {
			return result;
		}
		
		var i, edgeBegIndex, edgeEndIndex, edgeBeg, edgeEnd;
		var currentSector, position;
		for (i = 0; i < vertexCount; i++) {
			edgeBegIndex = i;
			edgeEndIndex = (i + 1) % vertexCount;
			edgeBeg = this.vertices[edgeBegIndex];
			edgeEnd = this.vertices[edgeEndIndex];
			if (edgeBegIndex == begIndex || edgeEndIndex == begIndex || edgeBegIndex == endIndex || edgeEndIndex == endIndex) {
				continue;
			}
			currentSector = new JSM.Sector2D (edgeBeg, edgeEnd);
			position = sector.SectorPosition (currentSector);
			if (position == JSM.SectorSectorPosition2D.SectorsIntersectOnePoint) {
				return JSM.SectorPolygonPosition2D.IntersectionOnePoint;
			} else if (position == JSM.SectorSectorPosition2D.SectorsIntersectCoincident) {
				return JSM.SectorPolygonPosition2D.IntersectionCoincident;
			} else if (position == JSM.SectorSectorPosition2D.SectorsIntersectEndPoint) {
				result = JSM.SectorPolygonPosition2D.IntersectionOnVertex;
			}
		}
		
		return result;
	};

	/**
	* Function: Polygon2D.IsDiagonal
	* Description: Returns if the sector between two vertices is diagonal.
	* Parameters:
	*	from {integer} begin vertex index
	*	to {integer} end vertex index
	* Returns:
	*	{boolean} the result
	*/
	JSM.Polygon2D.prototype.IsDiagonal = function (from, to)
	{
		function DiagonalIntersectsAnyEdges (polygon, from, to)
		{
			var fromVertex = polygon.GetVertex (from);
			var toVertex = polygon.GetVertex (to);
			var sector = new JSM.Sector2D (fromVertex, toVertex);
			var position = polygon.SectorPosition (sector, from, to);
			if (position != JSM.SectorPolygonPosition2D.NoIntersection) {
				return true;
			}
			return false;
		}
		
		function DiagonalInsideOfPolygon (polygon, from, to)
		{
			var fromVertex = polygon.GetVertex (from);
			var toVertex = polygon.GetVertex (to);
			var midCoord = new JSM.Coord2D (
				(fromVertex.x + toVertex.x) / 2.0,
				(fromVertex.y + toVertex.y) / 2.0
			);
			var position = polygon.CoordPosition (midCoord);
			return position == JSM.CoordPolygonPosition2D.Inside;
		}
		
		if (from == to) {
			return false;
		}

		if (this.GetPrevVertex (from) == to || this.GetNextVertex (from) == to) {
			return false;
		}

		var fromVertex = this.vertices[from];
		var toVertex = this.vertices[to];
		if (fromVertex.IsEqual (toVertex)) {
			return false;
		}

		if (DiagonalIntersectsAnyEdges (this, from, to)) {
			return false;
		}
		
		if (!DiagonalInsideOfPolygon (this, from, to)) {
			return false;
		}
		
		return true;
	};

	/**
	* Function: Polygon2D.ToArray
	* Description: Creates an array of vertices from polygon.
	* Returns:
	*	{Coord2D[*]} the result
	*/
	JSM.Polygon2D.prototype.ToArray = function ()
	{
		var vertices = [];
		var i, vertex;
		for (i = 0; i < this.vertices.length; i++) {
			vertex = this.vertices[i];
			vertices.push (vertex.Clone ());
		}
		return vertices;
	};

	/**
	* Function: Polygon2D.FromArray
	* Description: Creates the polygon from an array of vertices.
	* Parameters:
	*	vertices {Coord2D[*]} the array of vertices
	*/
	JSM.Polygon2D.prototype.FromArray = function (vertices)
	{
		this.Clear ();
		var i, vertex;
		for (i = 0; i < vertices.length; i++) {
			vertex = vertices[i];
			this.AddVertex (vertex.x, vertex.y);
		}
	};

	/**
	 * Function: Polygon2D.GetBoundingBox
	 * Description: Calculates the bounding box of the polygon.
	 * Returns:
	 *	{Box2D} the result
	 */
	JSM.Polygon2D.prototype.GetBoundingBox = function ()
	{
		if (this.cache.boundingBox !== null) {
			return this.cache.boundingBox;
		}

		var result = new JSM.Box2D (
			new JSM.Coord2D (JSM.Inf, JSM.Inf),
			new JSM.Coord2D (-JSM.Inf, -JSM.Inf)
		);

		var i, coord;
		for (i = 0; i < this.vertices.length; i++) {
			coord = this.vertices[i];
			result.min.x = JSM.Minimum (result.min.x, coord.x);
			result.min.y = JSM.Minimum (result.min.y, coord.y);
			result.max.x = JSM.Maximum (result.max.x, coord.x);
			result.max.y = JSM.Maximum (result.max.y, coord.y);
		}

		this.cache.boundingBox = result;
		return result;
	};

	/**
	* Function: Polygon2D.Clear
	* Description: Makes the polygon empty.
	*/
	JSM.Polygon2D.prototype.Clear = function ()
	{
		this.vertices = [];
		this.ClearCache ();
	};

	/**
	* Function: Polygon2D.ClearCache
	* Description: Clears stored values from the polygon.
	*/
	JSM.Polygon2D.prototype.ClearCache = function ()
	{
		this.cache = {
			signedArea : null,
			orientation : null,
			vertexOrientations : {},
			complexity : null,
			boundingBox : null
		};
	};

	/**
	* Function: Polygon2D.Clone
	* Description: Clones the polygon.
	* Returns:
	*	{Polygon2D} a cloned instance
	*/
	JSM.Polygon2D.prototype.Clone = function ()
	{
		var result = new JSM.Polygon2D ();
		var i, vertex;
		for (i = 0; i < this.vertices.length; i++) {
			vertex = this.vertices[i];
			result.AddVertexCoord (vertex.Clone ());
		}
		return result;
	};

	/**
	* Class: ContourPolygon2D
	* Description: Represents a 2D polygon with more contours.
	*/
	JSM.ContourPolygon2D = function ()
	{
		this.contours = null;
		this.Clear ();
	};

	/**
	* Function: ContourPolygon2D.AddVertex
	* Description: Adds a vertex to the last contour of the polygon.
	* Parameters:
	*	x {number} the x coordinate of the vertex
	*	y {number} the y coordinate of the vertex
	*/
	JSM.ContourPolygon2D.prototype.AddVertex = function (x, y)
	{
		this.lastContour.AddVertex (x, y);
	};

	/**
	* Function: ContourPolygon2D.AddVertexCoord
	* Description: Adds a vertex coordinate to the last contour of the polygon.
	* Parameters:
	*	coord {Coord2D} the coordinate
	*/
	JSM.ContourPolygon2D.prototype.AddVertexCoord = function (coord)
	{
		this.lastContour.AddVertexCoord (coord);
	};

	/**
	* Function: ContourPolygon2D.AddContourVertex
	* Description: Adds a vertex to the given contour of the polygon.
	* Parameters:
	*	contourIndex {integer} the index of the contour
	*	x {number} the x coordinate of the vertex
	*	y {number} the y coordinate of the vertex
	*/
	JSM.ContourPolygon2D.prototype.AddContourVertex = function (contourIndex, x, y)
	{
		return this.contours[contourIndex].AddVertex (x, y);
	};

	/**
	* Function: ContourPolygon2D.AddContourVertexCoord
	* Description: Adds a vertex coordinate to the given contour of the polygon.
	* Parameters:
	*	contourIndex {integer} the index of the contour
	*	coord {Coord2D} the coordinate
	*/
	JSM.ContourPolygon2D.prototype.AddContourVertexCoord = function (contourIndex, coord)
	{
		return this.contours[contourIndex].AddVertexCoord (coord);
	};

	/**
	* Function: ContourPolygon2D.VertexCount
	* Description: Returns the vertex count of the polygon.
	* Returns:
	*	{integer} vertex count
	*/
	JSM.ContourPolygon2D.prototype.VertexCount = function ()
	{
		var vertexCount = 0;
		var i;
		for (i = 0; i < this.contours.length; i++) {
			vertexCount += this.contours[i].VertexCount ();
		}
		return vertexCount;
	};

	/**
	* Function: ContourPolygon2D.ReverseVertices
	* Description: Reverses the orientation of the vertices.
	*/
	JSM.ContourPolygon2D.prototype.ReverseVertices = function ()
	{
		var i;
		for (i = 0; i < this.contours.length; i++) {
			this.contours[i].ReverseVertices ();
		}
	};

	/**
	* Function: ContourPolygon2D.ContourVertexCount
	* Description: Returns the vertex count of the given contour of the polygon.
	* Parameters:
	*	contourIndex {integer} the index of the contour
	* Returns:
	*	{integer} vertex count
	*/
	JSM.ContourPolygon2D.prototype.ContourVertexCount = function (contourIndex)
	{
		return this.contours[contourIndex].VertexCount ();
	};

	/**
	* Function: ContourPolygon2D.AddContour
	* Description:
	*	Adds a contour to the polygon. If the given contour is null,
	*	an empty contour is added to the polygon.
	* Parameters:
	*	contour {Polygon2D} the new contour
	*/
	JSM.ContourPolygon2D.prototype.AddContour = function (contour)
	{
		if (contour === undefined || contour === null) {
			this.lastContour = new JSM.Polygon2D ();
		} else {
			this.lastContour = contour;
		}
		this.contours.push (this.lastContour);
	};

	/**
	* Function: ContourPolygon2D.GetLastContour
	* Description: Returns the last contour of the polygon.
	* Returns:
	*	{Polygon2D} the result
	*/
	JSM.ContourPolygon2D.prototype.GetLastContour = function ()
	{
		return this.lastContour;
	};

	/**
	* Function: ContourPolygon2D.GetContourVertex
	* Description: Returns the vertex of the given contour with the given index.
	* Parameters:
	*	contourIndex {integer} the index of the contour
	*	vertexIndex {integer} the index of the vertex
	* Returns:
	*	{Coord2D} the vertex
	*/
	JSM.ContourPolygon2D.prototype.GetContourVertex = function (contourIndex, vertexIndex)
	{
		return this.contours[contourIndex].GetVertex (vertexIndex);
	};

	/**
	* Function: ContourPolygon2D.GetContour
	* Description: Returns the contour with the given index.
	* Parameters:
	*	contourIndex {integer} the index of the contour
	* Returns:
	*	{Polygon2D} the contour
	*/
	JSM.ContourPolygon2D.prototype.GetContour = function (index)
	{
		return this.contours[index];
	};

	/**
	* Function: ContourPolygon2D.ContourCount
	* Description: Returns the contour count of the polygon.
	* Returns:
	*	{integer} contour count
	*/
	JSM.ContourPolygon2D.prototype.ContourCount = function ()
	{
		return this.contours.length;
	};

	/**
	* Function: ContourPolygon2D.GetSignedArea
	* Description: Calculates the signed area of the polygon.
	* Returns:
	*	{number} the result
	*/
	JSM.ContourPolygon2D.prototype.GetSignedArea = function ()
	{
		var area = 0.0;
		var i;
		for (i = 0; i < this.contours.length; i++) {
			area += this.contours[i].GetSignedArea ();
		}
		return area;
	};

	/**
	* Function: ContourPolygon2D.GetArea
	* Description: Calculates the area of the polygon.
	* Returns:
	*	{number} the result
	*/
	JSM.ContourPolygon2D.prototype.GetArea = function ()
	{
		var signedArea = this.GetSignedArea ();
		return Math.abs (signedArea);
	};

	/**
	* Function: ContourPolygon2D.GetOrientation
	* Description: Calculates the orientation of the polygon.
	* Returns:
	*	{Orientation} the result
	*/
	JSM.ContourPolygon2D.prototype.GetOrientation = function ()
	{
		if (this.lastContour === null) {
			return JSM.Orientation.Invalid;
		}
		var orientation = this.contours[0].GetOrientation ();
		if (this.contours.length == 1) {
			return orientation;
		}
		if (orientation == JSM.Orientation.Invalid) {
			return JSM.Orientation.Invalid;
		}
		var i, contourOrientation;
		for (i = 1; i < this.contours.length; i++) {
			contourOrientation = this.contours[i].GetOrientation ();
			if (contourOrientation == JSM.Orientation.Invalid) {
				return JSM.Orientation.Invalid;
			}
			if (orientation == contourOrientation) {
				return JSM.Orientation.Invalid;
			}
		}
		return orientation;
	};

	/**
	* Function: ContourPolygon2D.GetComplexity
	* Description: Calculates the complexity of the polygon.
	* Returns:
	*	{Complexity} the result
	*/
	JSM.ContourPolygon2D.prototype.GetComplexity = function ()
	{
		if (this.lastContour === null) {
			return JSM.Complexity.Invalid;
		}
		if (this.contours.length == 1) {
			return this.contours[0].GetComplexity ();
		}
		var i, contourComplexity;
		for (i = 1; i < this.contours.length; i++) {
			contourComplexity = this.contours[i].GetComplexity ();
			if (contourComplexity == JSM.Complexity.Invalid) {
				return JSM.Complexity.Invalid;
			}
		}
		return JSM.Complexity.Complex;
	};

	/**
	* Function: ContourPolygon2D.ToArray
	* Description:
	*	Creates an array of vertices from polygon. The result contains
	*	null values between contours.
	* Returns:
	*	{Coord2D[*]} the result
	*/
	JSM.ContourPolygon2D.prototype.ToArray = function ()
	{
		var vertices = [];
		var i, j, contour, vertex;
		for (i = 0; i < this.contours.length; i++) {
			contour = this.contours[i];
			for (j = 0; j < contour.VertexCount (); j++) {
				vertex = contour.GetVertex (j);
				vertices.push (vertex.Clone ());
			}
			if (i < this.contours.length - 1) {
				vertices.push (null);
			}
		}
		return vertices;
	};

	/**
	* Function: ContourPolygon2D.FromArray
	* Description:
	*	Creates the polygon from an array of vertices. The input should contain
	*	null values between contours.
	* Parameters:
	*	vertices {Coord2D[*]} the array of vertices
	*/
	JSM.ContourPolygon2D.prototype.FromArray = function (vertices)
	{
		this.Clear ();
		this.AddContour ();
		var i, vertex;
		for (i = 0; i < vertices.length; i++) {
			vertex = vertices[i];
			if (vertex === null) {
				this.AddContour ();
			} else {
				this.AddVertex (vertex.x, vertex.y);
			}
		}
	};

	/**
	* Function: ContourPolygon2D.Clear
	* Description: Makes the polygon empty.
	*/
	JSM.ContourPolygon2D.prototype.Clear = function ()
	{
		this.contours = [];
		this.lastContour = null;
	};

	/**
	* Function: ContourPolygon2D.Clone
	* Description: Clones the polygon.
	* Returns:
	*	{ContourPolygon2D} a cloned instance
	*/
	JSM.ContourPolygon2D.prototype.Clone = function ()
	{
		var result = new JSM.ContourPolygon2D ();
		var i, contour;
		for (i = 0; i < this.contours.length; i++) {
			contour = this.contours[i];
			result.AddContour (contour.Clone ());
		}
		return result;
	};

	return JSM;
});

define('skylark-jsmodeler/geometry/polygon',["../core/jsm"],function(JSM){
	/**
	* Class: Polygon
	* Description: Represents a 3D polygon.
	*/
	JSM.Polygon = function ()
	{
		this.vertices = null;
		this.cache = null;
		this.Clear ();
	};

	/**
	* Function: Polygon.AddVertex
	* Description: Adds a vertex to the polygon.
	* Parameters:
	*	x {number} the x coordinate of the vertex
	*	y {number} the y coordinate of the vertex
	*	z {number} the z coordinate of the vertex
	*/
	JSM.Polygon.prototype.AddVertex = function (x, y, z)
	{
		this.AddVertexCoord (new JSM.Coord (x, y, z));
	};

	/**
	* Function: Polygon.AddVertexCoord
	* Description: Adds a vertex coordinate to the polygon.
	* Parameters:
	*	coord {Coord} the coordinate
	*/
	JSM.Polygon.prototype.AddVertexCoord = function (coord)
	{
		this.vertices.push (coord);
		this.ClearCache ();
	};

	/**
	* Function: Polygon.GetVertex
	* Description: Returns the vertex with the given index.
	* Parameters:
	*	index {integer} the index of the vertex
	* Returns:
	*	{Coord} the vertex
	*/
	JSM.Polygon.prototype.GetVertex = function (index)
	{
		return this.vertices[index];
	};

	/**
	* Function: Polygon.VertexCount
	* Description: Returns the vertex count of the polygon.
	* Returns:
	*	{integer} vertex count
	*/
	JSM.Polygon.prototype.VertexCount = function ()
	{
		return this.vertices.length;
	};

	/**
	* Function: Polygon.GetNextVertex
	* Description: Returns the vertex index after the given one.
	* Parameters:
	*	index {integer} the vertex index
	* Returns:
	*	{integer} the result
	*/
	JSM.Polygon.prototype.GetNextVertex = function (index)
	{
		return JSM.NextIndex (index, this.vertices.length);
	};

	/**
	* Function: Polygon.ReverseVertices
	* Description: Reverses the orientation of the vertices.
	*/
	JSM.Polygon.prototype.ReverseVertices = function ()
	{
		this.vertices.reverse ();
		this.ClearCache ();
	};

	/**
	* Function: Polygon.GetPrevVertex
	* Description: Returns the vertex index before the given one.
	* Parameters:
	*	index {integer} the vertex index
	* Returns:
	*	{integer} the result
	*/
	JSM.Polygon.prototype.GetPrevVertex = function (index)
	{
		return JSM.PrevIndex (index, this.vertices.length);
	};

	/**
	* Function: Polygon.GetVertexAngle
	* Description: Returns the angle of the given vertex.
	* Parameters:
	*	index {integer} the vertex index
	* Returns:
	*	{number} the result
	*/
	JSM.Polygon.prototype.GetVertexAngle = function (index)
	{
		var prev = this.vertices[this.GetPrevVertex (index)];
		var curr = this.vertices[index];
		var next = this.vertices[this.GetNextVertex (index)];
		var prevDir = JSM.CoordSub (prev, curr);
		var nextDir = JSM.CoordSub (next, curr);
		return prevDir.AngleTo (nextDir);
	};

	/**
	* Function: Polygon.GetNormal
	* Description: Calculates the normal vector of the polygon.
	* Returns:
	*	{Vector} the result
	*/
	JSM.Polygon.prototype.GetNormal = function ()
	{
		if (this.cache.normal !== null) {
			return this.cache.normal;
		}
		var result = JSM.CalculateNormal (this.vertices);
		this.cache.normal = result;
		return result;
	};

	/**
	* Function: Polygon.ToPolygon2D
	* Description: Converts the polygon to a 2D polygon.
	* Returns:
	*	{Polygon2D} the result
	*/
	JSM.Polygon.prototype.ToPolygon2D = function ()
	{
		var normal = this.GetNormal ();
		var result = new JSM.Polygon2D ();
		var i, vertex;
		for (i = 0; i < this.vertices.length; i++) {
			vertex = this.vertices[i].ToCoord2D (normal);
			result.AddVertex (vertex.x, vertex.y);
		}
		return result;
	};

	/**
	* Function: Polygon.ToArray
	* Description: Creates an array of vertices from polygon.
	* Returns:
	*	{Coord[*]} the result
	*/
	JSM.Polygon.prototype.ToArray = function ()
	{
		var vertices = [];
		var i, vertex;
		for (i = 0; i < this.vertices.length; i++) {
			vertex = this.vertices[i];
			vertices.push (vertex.Clone ());
		}
		return vertices;
	};

	/**
	* Function: Polygon.FromArray
	* Description: Creates the polygon from an array of vertices.
	* Parameters:
	*	vertices {Coord[*]} the array of vertices
	*/
	JSM.Polygon.prototype.FromArray = function (vertices)
	{
		this.Clear ();
		var i, vertex;
		for (i = 0; i < vertices.length; i++) {
			vertex = vertices[i];
			this.AddVertex (vertex.x, vertex.y, vertex.z);
		}
	};

	/**
	* Function: Polygon.Clear
	* Description: Makes the polygon empty.
	*/
	JSM.Polygon.prototype.Clear = function ()
	{
		this.vertices = [];
		this.ClearCache ();
	};

	/**
	* Function: Polygon.ClearCache
	* Description: Clears stored values from the polygon.
	*/
	JSM.Polygon.prototype.ClearCache = function ()
	{
		this.cache = {
			normal : null
		};
	};

	/**
	* Function: Polygon.Clone
	* Description: Clones the polygon.
	* Returns:
	*	{Polygon} a cloned instance
	*/
	JSM.Polygon.prototype.Clone = function ()
	{
		var result = new JSM.Polygon ();
		var i, vertex;
		for (i = 0; i < this.vertices.length; i++) {
			vertex = this.vertices[i];
			result.AddVertexCoord (vertex.Clone ());
		}
		return result;
	};

	/**
	* Class: ContourPolygon
	* Description: Represents a 3D polygon with more contours.
	*/
	JSM.ContourPolygon = function ()
	{
		this.contours = null;
		this.Clear ();
	};

	/**
	* Function: ContourPolygon.AddVertex
	* Description: Adds a vertex to the last contour of the polygon.
	* Parameters:
	*	x {number} the x coordinate of the vertex
	*	y {number} the y coordinate of the vertex
	*	z {number} the z coordinate of the vertex
	*/
	JSM.ContourPolygon.prototype.AddVertex = function (x, y, z)
	{
		this.lastContour.AddVertex (x, y, z);
	};

	/**
	* Function: ContourPolygon.AddVertexCoord
	* Description: Adds a vertex coordinate to the last contour of the polygon.
	* Parameters:
	*	coord {Coord} the coordinate
	*/
	JSM.ContourPolygon.prototype.AddVertexCoord = function (coord)
	{
		this.lastContour.AddVertexCoord (coord);
	};

	/**
	* Function: ContourPolygon.AddContourVertex
	* Description: Adds a vertex to the given contour of the polygon.
	* Parameters:
	*	contourIndex {integer} the index of the contour
	*	x {number} the x coordinate of the vertex
	*	y {number} the y coordinate of the vertex
	*	z {number} the z coordinate of the vertex
	*/
	JSM.ContourPolygon.prototype.AddContourVertex = function (contourIndex, x, y, z)
	{
		return this.contours[contourIndex].AddVertex (x, y, z);
	};

	/**
	* Function: ContourPolygon.AddContourVertexCoord
	* Description: Adds a vertex coordinate to the given contour of the polygon.
	* Parameters:
	*	contourIndex {integer} the index of the contour
	*	coord {Coord} the coordinate
	*/
	JSM.ContourPolygon.prototype.AddContourVertexCoord = function (contourIndex, coord)
	{
		return this.contours[contourIndex].AddVertexCoord (coord);
	};

	/**
	* Function: ContourPolygon.VertexCount
	* Description: Returns the vertex count of the polygon.
	* Returns:
	*	{integer} vertex count
	*/
	JSM.ContourPolygon.prototype.VertexCount = function ()
	{
		var vertexCount = 0;
		var i;
		for (i = 0; i < this.contours.length; i++) {
			vertexCount += this.contours[i].VertexCount ();
		}
		return vertexCount;
	};

	/**
	* Function: ContourPolygon.ContourVertexCount
	* Description: Returns the vertex count of the given contour of the polygon.
	* Parameters:
	*	contourIndex {integer} the index of the contour
	* Returns:
	*	{integer} vertex count
	*/
	JSM.ContourPolygon.prototype.ContourVertexCount = function (contourIndex)
	{
		return this.contours[contourIndex].VertexCount ();
	};

	/**
	* Function: ContourPolygon.AddContour
	* Description:
	*	Adds a contour to the polygon. If the given contour is null,
	*	an empty contour is added to the polygon.
	* Parameters:
	*	contour {Polygon} the new contour
	*/
	JSM.ContourPolygon.prototype.AddContour = function (contour)
	{
		if (contour === undefined || contour === null) {
			this.lastContour = new JSM.Polygon ();
		} else {
			this.lastContour = contour;
		}
		this.contours.push (this.lastContour);
	};

	/**
	* Function: ContourPolygon.GetLastContour
	* Description: Returns the last contour of the polygon.
	* Returns:
	*	{Polygon} the result
	*/
	JSM.ContourPolygon.prototype.GetLastContour = function ()
	{
		return this.lastContour;
	};

	/**
	* Function: ContourPolygon.GetContourVertex
	* Description: Returns the vertex of the given contour with the given index.
	* Parameters:
	*	contourIndex {integer} the index of the contour
	*	vertexIndex {integer} the index of the vertex
	* Returns:
	*	{Coord} the vertex
	*/
	JSM.ContourPolygon.prototype.GetContourVertex = function (contourIndex, vertexIndex)
	{
		return this.contours[contourIndex].GetVertex (vertexIndex);
	};

	/**
	* Function: ContourPolygon.GetContour
	* Description: Returns the contour with the given index.
	* Parameters:
	*	contourIndex {integer} the index of the contour
	* Returns:
	*	{Polygon} the contour
	*/
	JSM.ContourPolygon.prototype.GetContour = function (contourIndex)
	{
		return this.contours[contourIndex];
	};

	/**
	* Function: ContourPolygon.ContourCount
	* Description: Returns the contour count of the polygon.
	* Returns:
	*	{integer} contour count
	*/
	JSM.ContourPolygon.prototype.ContourCount = function ()
	{
		return this.contours.length;
	};

	/**
	* Function: ContourPolygon.ToContourPolygon2D
	* Description: Converts the polygon to a 2D polygon.
	* Returns:
	*	{ContourPolygon2D} the result
	*/
	JSM.ContourPolygon.prototype.ToContourPolygon2D = function ()
	{
		var normal = this.contours[0].GetNormal ();
		var result = new JSM.ContourPolygon2D ();
		var i, j, contour, vertex;
		for (i = 0; i < this.contours.length; i++) {
			result.AddContour ();
			contour = this.contours[i];
			for (j = 0; j < contour.VertexCount (); j++) {
				vertex = contour.GetVertex (j);
				result.AddVertexCoord (vertex.ToCoord2D (normal));
			}
		}
		return result;
	};

	/**
	* Function: ContourPolygon.ToArray
	* Description:
	*	Creates an array of vertices from polygon. The result contains
	*	null values between contours.
	* Returns:
	*	{Coord[*]} the result
	*/
	JSM.ContourPolygon.prototype.ToArray = function ()
	{
		var vertices = [];
		var i, j, contour, vertex;
		for (i = 0; i < this.contours.length; i++) {
			contour = this.contours[i];
			for (j = 0; j < contour.VertexCount (); j++) {
				vertex = contour.GetVertex (j);
				vertices.push (vertex.Clone ());
			}
			if (i < this.contours.length - 1) {
				vertices.push (null);
			}
		}
		return vertices;
	};

	/**
	* Function: ContourPolygon.FromArray
	* Description:
	*	Creates the polygon from an array of vertices. The input should contain
	*	null values between contours.
	* Parameters:
	*	vertices {Coord[*]} the array of vertices
	*/
	JSM.ContourPolygon.prototype.FromArray = function (vertices)
	{
		this.Clear ();
		this.AddContour ();
		var i, vertex;
		for (i = 0; i < vertices.length; i++) {
			vertex = vertices[i];
			if (vertex === null) {
				this.AddContour ();
			} else {
				this.AddVertex (vertex.x, vertex.y, vertex.z);
			}
		}
	};

	/**
	* Function: ContourPolygon.Clear
	* Description: Makes the polygon empty.
	*/
	JSM.ContourPolygon.prototype.Clear = function ()
	{
		this.contours = [];
		this.lastContour = null;
	};

	/**
	* Function: ContourPolygon.Clone
	* Description: Clones the polygon.
	* Returns:
	*	{ContourPolygon} a cloned instance
	*/
	JSM.ContourPolygon.prototype.Clone = function ()
	{
		var result = new JSM.ContourPolygon ();
		var i, contour;
		for (i = 0; i < this.contours.length; i++) {
			contour = this.contours[i];
			result.AddContour (contour.Clone ());
		}
		return result;

	};

	/**
	* Function: OffsetPolygonContour
	* Description: Offsets all vertices of a polygon.
	* Parameters:
	*	polygon {Polygon} the polygon
	*	width {number} the width of the offset
	* Returns:
	*	{Polygon} the result
	*/
	JSM.OffsetPolygonContour = function (polygon, width)
	{
		var count = polygon.VertexCount ();
		var normal = polygon.GetNormal ();

		var prev, curr, next;
		var prevVertex, currVertex, nextVertex;
		var prevDir, nextDir;
		var distance, offsetedCoord;
		
		var result = new JSM.Polygon ();
		
		var i, angle;
		for (i = 0; i < count; i++) {
			prev = polygon.GetPrevVertex (i);
			curr = i;
			next = polygon.GetNextVertex (i);
			
			prevVertex = polygon.GetVertex (prev);
			currVertex = polygon.GetVertex (curr);
			nextVertex = polygon.GetVertex (next);

			prevDir = JSM.CoordSub (prevVertex, currVertex);
			nextDir = JSM.CoordSub (nextVertex, currVertex);
			angle = prevDir.AngleTo (nextDir) / 2.0;
			if (JSM.CoordOrientation (prevVertex, currVertex, nextVertex, normal) == JSM.Orientation.Clockwise) {
				angle = Math.PI - angle;
			}

			distance = width / Math.sin (angle);
			offsetedCoord = currVertex.Clone ();
			offsetedCoord.Offset (nextDir, distance);
			offsetedCoord.Rotate (normal, angle, currVertex);
			result.AddVertex (offsetedCoord.x, offsetedCoord.y, offsetedCoord.z);
		}
		
		return result;
	};

	return JSM;
});

define('skylark-jsmodeler/geometry/cutpolygon',["../core/jsm"],function(JSM){
	JSM.CutVertexType = {
		Left : 1,
		Right : 2,
		Cut : 3
	};

	JSM.PolygonCutter = function (geometryInterface)
	{
		this.geometryInterface = geometryInterface;
		this.Reset ();
	};

	JSM.PolygonCutter.prototype.Cut = function (polygon, aSidePolygons, bSidePolygons, cutPolygons)
	{
		this.Reset ();
		
		var allVertexType = this.CalculateOriginalPolygonData (polygon);
		if (allVertexType !== null) {
			var cloned = polygon.Clone ();
			if (allVertexType == JSM.CutVertexType.Left) {
				aSidePolygons.push (cloned);
			} else if (allVertexType == JSM.CutVertexType.Right) {
				bSidePolygons.push (cloned);
			} else {
				cutPolygons.push (cloned);
			}
			return true;
		}
		
		if (!this.CalculateCutPolygonData ()) {
			return false;
		}
		
		if (!this.CalculateEntryVertices ()) {
			return false;
		}
		
		if (!this.CalculateCuttedPolygons (aSidePolygons, bSidePolygons)) {
			return false;
		}	
		
		return true;
	};

	JSM.PolygonCutter.prototype.Reset = function ()
	{
		this.originalPolygon = null;
		this.originalPolygonVertexTypes = null;
		this.cutPolygon = null;
		this.cutPolygonVertexTypes = null;
		this.cutPolygonVertexDistances = null;
		this.cutVertexIndices = null;
		this.entryVertices = null;
		this.entryVertexTypes = null;
	};

	JSM.PolygonCutter.prototype.CalculateOriginalPolygonData = function (polygon)
	{
		this.originalPolygon = polygon;
		this.originalPolygonVertexTypes = [];
		var aSideFound = false;
		var bSideFound = false;
		
		var i, vertex, type;
		for (i = 0; i < this.originalPolygon.VertexCount (); i++) {
			vertex = polygon.GetVertex (i);
			type = this.geometryInterface.getVertexSide (vertex);
			if (type == JSM.CutVertexType.Left) {
				aSideFound = true;
			} else if (type == JSM.CutVertexType.Right) {
				bSideFound = true;
			}
			this.originalPolygonVertexTypes.push (type);
		}
		
		if (aSideFound && bSideFound) {
			return null;
		}
		
		if (aSideFound) {
			return JSM.CutVertexType.Left;
		} else if (bSideFound) {
			return JSM.CutVertexType.Right;
		}
		
		return JSM.CutVertexType.Cut;
	};

	JSM.PolygonCutter.prototype.CalculateCutPolygonData = function ()
	{
		function IsIntersectionVertex (cutPolygonVertexTypes, originalType)
		{
			if (cutPolygonVertexTypes.length === 0) {
				return false;
			}
			var prevType = cutPolygonVertexTypes[cutPolygonVertexTypes.length - 1];
			if (prevType == JSM.CutVertexType.Cut || originalType == JSM.CutVertexType.Cut) {
				return false;
			}
			return prevType != originalType;
		}
		
		function AddCutVertexToPolygon (polygonCutter, vertex, type)
		{
			polygonCutter.cutPolygon.AddVertexCoord (vertex);
			polygonCutter.cutPolygonVertexTypes.push (type);
			if (type == JSM.CutVertexType.Cut) {
				polygonCutter.cutVertexIndices.push (polygonCutter.cutPolygonVertexTypes.length - 1);
			}
		}
		
		function AddIntersectionVertex (polygonCutter, originalIndex)
		{
			var prevIndex = polygonCutter.originalPolygon.GetPrevVertex (originalIndex);
			var prevVertex = polygonCutter.originalPolygon.GetVertex (prevIndex);
			var currVertex = polygonCutter.originalPolygon.GetVertex (originalIndex);
			var intersection = polygonCutter.geometryInterface.getIntersectionVertex (prevVertex, currVertex);
			if (intersection === null) {
				return false;
			}
			AddCutVertexToPolygon (polygonCutter, intersection, JSM.CutVertexType.Cut);
			return true;
		}
		
		function AddOriginalVertex (polygonCutter, originalIndex, originalType)
		{
			var vertex = polygonCutter.originalPolygon.GetVertex (originalIndex).Clone ();
			AddCutVertexToPolygon (polygonCutter, vertex, originalType);

			var vertexCount = polygonCutter.originalPolygon.VertexCount ();
			var prevType = polygonCutter.originalPolygonVertexTypes[JSM.PrevIndex (originalIndex, vertexCount)];
			var nextType = polygonCutter.originalPolygonVertexTypes[JSM.NextIndex (originalIndex, vertexCount)];
			if (originalType == JSM.CutVertexType.Cut && prevType == nextType) {
				AddCutVertexToPolygon (polygonCutter, vertex, originalType);
			}
			
			return true;
		}
		
		function SortCutVertices (cutPolygon, cutVertexIndices, cutPolygonVertexDistances)
		{
			if (cutVertexIndices.length < 2) {
				return false;
			}

			JSM.BubbleSort (cutVertexIndices,
				function (a, b) {
					var aDist = cutPolygonVertexDistances[a];
					var bDist = cutPolygonVertexDistances[b];
					return JSM.IsLower (aDist, bDist);
				},
				function (i, j) {
					JSM.SwapArrayValues (cutVertexIndices, i, j);
				}
			);
			
			return true;
		}	

		this.cutPolygon = this.geometryInterface.createPolygon ();
		this.cutPolygonVertexTypes = [];
		this.cutVertexIndices = [];
		
		var vertexCount = this.originalPolygon.VertexCount ();
		var i, lastVertex, originalIndex, originalType;
		for (i = 0; i <= vertexCount; i++) {
			lastVertex = (i === vertexCount);
			originalIndex = i;
			if (lastVertex) {
				originalIndex = 0;
			}
			
			originalType = this.originalPolygonVertexTypes[originalIndex];
			if (IsIntersectionVertex (this.cutPolygonVertexTypes, originalType)) {
				AddIntersectionVertex (this, originalIndex);
			}
			
			if (!lastVertex) {
				AddOriginalVertex (this, originalIndex, originalType);
			}
		}
		
		this.cutPolygonVertexDistances = this.geometryInterface.getVertexDistances (this.cutPolygon);
		if (!SortCutVertices (this.cutPolygon, this.cutVertexIndices, this.cutPolygonVertexDistances)) {
			return false;
		}
		
		return true;
	};

	JSM.PolygonCutter.prototype.CalculateEntryVertices = function ()
	{
		function GetEntryVertexType (cutPolygonVertexTypes, cutPolygonVertexDistances, currIndex)
		{
			var currSideType = cutPolygonVertexTypes[currIndex];
			if (currSideType != JSM.CutVertexType.Cut) {
				return 0;
			}
			
			var prevIndex = JSM.PrevIndex (currIndex, cutPolygonVertexTypes.length);
			var nextIndex = JSM.NextIndex (currIndex, cutPolygonVertexTypes.length);
			var prevSideType = cutPolygonVertexTypes[prevIndex];
			var nextSideType = cutPolygonVertexTypes[nextIndex];

			var currVertexDistance = cutPolygonVertexDistances[currIndex];
			var prevVertexDistance = cutPolygonVertexDistances[prevIndex];
			var nextVertexDistance = cutPolygonVertexDistances[nextIndex];
			
			if (prevSideType == JSM.CutVertexType.Right) {
				if (nextSideType == JSM.CutVertexType.Left) {
					return 1;
				} else if (nextSideType == JSM.CutVertexType.Cut) {
					if (JSM.IsLowerOrEqual (currVertexDistance, nextVertexDistance)) {
						return 1;
					}
				}
			} else if (prevSideType == JSM.CutVertexType.Left) {
				if (nextSideType == JSM.CutVertexType.Right) {
					return -1;
				} else if (nextSideType == JSM.CutVertexType.Cut) {
					if (JSM.IsGreaterOrEqual (currVertexDistance, nextVertexDistance)) {
						return -1;
					}
				}
			} else if (prevSideType == JSM.CutVertexType.Cut) {
				if (nextSideType == JSM.CutVertexType.Left) {
					if (JSM.IsLowerOrEqual (currVertexDistance, prevVertexDistance)) {
						return 1;
					}
				} else if (nextSideType == JSM.CutVertexType.Right) {
					if (JSM.IsGreaterOrEqual (currVertexDistance, prevVertexDistance)) {
						return -1;
					}
				}
			}
			
			return 0;
		}

		this.entryVertices = [];
		this.entryVertexTypes = [];
		var i, vertexIndex, vertexType;
		for (i = 0; i < this.cutVertexIndices.length; i++) {
			vertexIndex = this.cutVertexIndices[i];
			vertexType = GetEntryVertexType (this.cutPolygonVertexTypes, this.cutPolygonVertexDistances, vertexIndex);
			if (vertexType !== 0) {
				this.entryVertices.push (vertexIndex);
				this.entryVertexTypes.push (vertexType);
			}
		}
		
		if (this.entryVertices.length === 0 || this.entryVertices.length % 2 !== 0) {
			return false;
		}

		return true;
	};

	JSM.PolygonCutter.prototype.CalculateCuttedPolygons = function (aSidePolygons, bSidePolygons)
	{
		function AddOneSideCuttedPolygons (polygonCutter, aSidePolygons, bSidePolygons, reversed)
		{
			function AddEntryPairToArray (entryPairs, entryVertices, fromIndex, toIndex)
			{
				entryPairs[entryVertices[fromIndex]] = entryVertices[toIndex];
				entryPairs[entryVertices[toIndex]] = entryVertices[fromIndex];
			}

			function RemoveEntryPairFromArray (entryPairs, index)
			{
				entryPairs[entryPairs[index]] = -1;
				entryPairs[index] = -1;
			}

			function CreateEntryPairsArray (cutPolygon, entryVertices, entryVertexTypes)
			{
				function FindPairIndex (entryPairs, entryVertices, entryVertexTypes, startIndex)
				{
					var i;
					for (i = startIndex + 1; i < entryVertices.length; i++) {
						if (entryPairs[entryVertices[i]] != -1) {
							continue;
						}
						if (entryVertexTypes[startIndex] != entryVertexTypes[i]) {
							return i;
						}
					}
					return -1;
				}

				var entryPairs = [];
				var i;
				for (i = 0; i < cutPolygon.VertexCount (); i++) {
					entryPairs.push (-1);
				}

				var pairIndex;
				for (i = 0; i < entryVertices.length; i++) {
					if (entryPairs[entryVertices[i]] != -1) {
						continue;
					}
					pairIndex = FindPairIndex (entryPairs, entryVertices, entryVertexTypes, i);
					if (pairIndex == -1) {
						return null;
					}
					AddEntryPairToArray (entryPairs, entryVertices, i, pairIndex);
				}
				return entryPairs;
			}
			
			function GetNextVertex (currVertexIndex, cutPolygon, entryPairs)
			{
				if (entryPairs[currVertexIndex] != -1) {
					var nextVertex = entryPairs[currVertexIndex];
					RemoveEntryPairFromArray (entryPairs, currVertexIndex);
					return nextVertex;
				} else {
					return JSM.NextIndex (currVertexIndex, cutPolygon.VertexCount ());
				}				
			}

			function AddCutPolygon (polygonCutter, entryPairs, currEntryVertex, aSidePolygons, bSidePolygons)
			{
				function AddVertexIfNotDuplicated (polygon, vertex)
				{
					var vertexCount = polygon.VertexCount ();
					if (vertexCount > 0 && polygon.GetVertex (vertexCount - 1).IsEqual (vertex)) {
						return;
					}
					polygon.AddVertexCoord (vertex);
				}
				
				var startVertexIndex = polygonCutter.entryVertices[currEntryVertex];
				if (entryPairs[startVertexIndex] !== -1) {
					var currPolygon = polygonCutter.geometryInterface.createPolygon ();
					currPolygon.AddVertexCoord (polygonCutter.cutPolygon.GetVertex (startVertexIndex).Clone ());
					var currVertexIndex = GetNextVertex (startVertexIndex, polygonCutter.cutPolygon, entryPairs);
					var polygonSide = null;
					while (currVertexIndex != startVertexIndex) {
						if (polygonSide === null) {
							if (polygonCutter.cutPolygonVertexTypes[currVertexIndex] !== JSM.CutVertexType.Cut) {
								polygonSide = polygonCutter.cutPolygonVertexTypes[currVertexIndex];
							}
						}
						AddVertexIfNotDuplicated (currPolygon, polygonCutter.cutPolygon.GetVertex (currVertexIndex).Clone ());
						currVertexIndex = GetNextVertex (currVertexIndex, polygonCutter.cutPolygon, entryPairs);
					}
					if (currPolygon.VertexCount () > 2) {
						if (polygonSide == JSM.CutVertexType.Left) {
							aSidePolygons.push (currPolygon);
						} else if (polygonSide == JSM.CutVertexType.Right) {
							bSidePolygons.push (currPolygon);
						}
					}
				}				
				
			}
			
			var entryPairs = CreateEntryPairsArray (polygonCutter.cutPolygon, polygonCutter.entryVertices, polygonCutter.entryVertexTypes);
			if (entryPairs === null) {
				return false;
			}
			var currEntryVertex = reversed ? polygonCutter.entryVertices.length - 1 : 0;
			while (currEntryVertex >= 0 && currEntryVertex < polygonCutter.entryVertices.length) {
				AddCutPolygon (polygonCutter, entryPairs, currEntryVertex, aSidePolygons, bSidePolygons);
				currEntryVertex = reversed ? currEntryVertex - 1 : currEntryVertex + 1;
			}
			return true;
		}

		if (!AddOneSideCuttedPolygons (this, aSidePolygons, bSidePolygons, false)) {
			return false;
		}
		
		if (!AddOneSideCuttedPolygons (this, aSidePolygons, bSidePolygons, true)) {
			return false;
		}
		
		return true;
	};

	/**
	* Function: CutPolygon2DWithLine
	* Description:
	*	Cuts a polygon with a line. The result array contains cutted
	*	polygons grouped by their position to the line.
	* Parameters:
	*	polygon {Polygon2D} the polygon
	*	line {Line2D} the line
	*	leftPolygons {Polygon2D[*]} (out) polygons on the left of the line
	*	rightPolygons {Polygon2D[*]} (out) polygons on the right of the line
	*	cutPolygons {Polygon2D[*]} (out) polygons on the line
	* Returns:
	*	{boolean} success
	*/
	JSM.CutPolygon2DWithLine = function (polygon, line, leftPolygons, rightPolygons, cutPolygons)
	{
		var geometryInterface = {
			createPolygon : function () {
				return new JSM.Polygon2D ();
			},
			getVertexSide : function (vertex) {
				var position = line.CoordPosition (vertex);
				var type = JSM.CutVertexType.Cut;
				if (position == JSM.CoordLinePosition2D.CoordAtLineLeft) {
					type = JSM.CutVertexType.Left;
				} else if (position == JSM.CoordLinePosition2D.CoordAtLineRight) {
					type = JSM.CutVertexType.Right;
				}
				return type;
			},
			getIntersectionVertex : function (prevVertex, currVertex) {
				var edgeLine = new JSM.Line2D (currVertex, JSM.CoordSub2D (currVertex, prevVertex));
				var intersection = new JSM.Coord2D (0.0, 0.0);
				var lineLinePosition = line.LinePosition (edgeLine, intersection);
				if (lineLinePosition != JSM.LineLinePosition2D.LinesIntersectsOnePoint) {
					return null;
				}
				return intersection;
			},
			getVertexDistances : function (polygon) {
				var origo = new JSM.Coord2D (0.0, 0.0);
				var refLineStart = line.start.Clone ();
				var refLineDir = line.direction.Clone ().Rotate (-Math.PI / 2.0, origo);
				var refLine = new JSM.Line2D (refLineStart, refLineDir);
				var i, vertex;
				var distances = [];
				for (i = 0; i < polygon.VertexCount (); i++) {
					vertex = polygon.GetVertex (i);
					distances.push (refLine.CoordSignedDistance (vertex));
				}
				return distances;
			}
		};
		
		var cutter = new JSM.PolygonCutter (geometryInterface);
		return cutter.Cut (polygon, leftPolygons, rightPolygons, cutPolygons);
	};

	/**
	* Function: CutPolygonWithPlane
	* Description:
	*	Cuts a polygon with a plane. The result array contains cutted
	*	polygons grouped by their position to the plane.
	* Parameters:
	*	polygon {Polygon} the polygon
	*	plane {Plane} the plane
	*	frontPolygons {Polygon[*]} (out) polygons in front of the plane
	*	backPolygons {Polygon[*]} (out) polygons at the back of the plane
	*	cutPolygons {Polygon[*]} (out) polygons on the plane
	* Returns:
	*	{boolean} success
	*/
	JSM.CutPolygonWithPlane = function (polygon, plane, frontPolygons, backPolygons, cutPolygons)
	{
		var geometryInterface = {
			createPolygon : function () {
				return new JSM.Polygon ();
			},
			getVertexSide : function (vertex) {
				var position = plane.CoordPosition (vertex);
				var type = JSM.CutVertexType.Cut;
				if (position == JSM.CoordPlanePosition.CoordInFrontOfPlane) {
					type = JSM.CutVertexType.Left;
				} else if (position == JSM.CoordPlanePosition.CoordAtBackOfPlane) {
					type = JSM.CutVertexType.Right;
				}
				return type;
			},
			getIntersectionVertex : function (prevVertex, currVertex) {
				var line = new JSM.Line (currVertex, JSM.CoordSub (currVertex, prevVertex));
				var intersection = new JSM.Coord (0.0, 0.0, 0.0);
				var linePlanePosition = plane.LinePosition (line, intersection);
				if (linePlanePosition != JSM.LinePlanePosition.LineIntersectsPlane) {
					return null;
				}
				return intersection;
			},
			getVertexDistances : function (polygon) {
				var polygonNormal = polygon.GetNormal ();
				var planeNormal = new JSM.Vector (plane.a, plane.b, plane.c);
				var refPlaneNormal = JSM.VectorCross (planeNormal, polygonNormal);
				var refPlaneOrigin = polygon.GetVertex (0);
				var refPlane = JSM.GetPlaneFromCoordAndDirection (refPlaneOrigin, refPlaneNormal);
				var i, vertex;
				var distances = [];
				for (i = 0; i < polygon.VertexCount (); i++) {
					vertex = polygon.GetVertex (i);
					distances.push (refPlane.CoordSignedDistance (vertex));
				}
				return distances;
			}
		};
		
		var cutter = new JSM.PolygonCutter (geometryInterface);
		return cutter.Cut (polygon, frontPolygons, backPolygons, cutPolygons);
	};

	/**
	* Function: SegmentPolygon2D
	* Description: Segments up a polygon along x and y axis.
	* Parameters:
	*	polygon {Polygon2D} the polygon
	*	xSegments {integer} x segment number
	*	ySegments {integer} y segment number
	* Returns:
	*	{Polygon[*]} result polygons
	*/
	JSM.SegmentPolygon2D = function (polygon, xSegments, ySegments)
	{
		function CutPolygonsOneDirection (inputPolygons, resultPolygons, segmentCount, segmentSize, startCoordinate, segmentDir, cutDir)
		{
			function CutPolygon (polygon, line, leftPolygons, rightPolygons)
			{
				var left = [];
				var right = [];
				var cut = [];
				if (!JSM.CutPolygon2DWithLine (polygon, line, left, right, cut)) {
					return;
				}
				var i;
				for (i = 0; i < left.length; i++) {
					leftPolygons.push (left[i]);
				}
				for (i = 0; i < right.length; i++) {
					rightPolygons.push (right[i]);
				}
			}

			var polygonsToProcess = inputPolygons;
			var startCoord = startCoordinate.Clone ();
			var i, j, line, newPolygonsToProcess;
			for (i = 1; i < segmentCount; i++) {
				startCoord.Offset (segmentDir, segmentSize);
				line = new JSM.Line2D (startCoord, cutDir);
				newPolygonsToProcess = [];
				for (j = 0; j < polygonsToProcess.length; j++) {
					CutPolygon (polygonsToProcess[j], line, resultPolygons, newPolygonsToProcess);
				}
				polygonsToProcess = newPolygonsToProcess;
			}
			for (j = 0; j < polygonsToProcess.length; j++) {
				resultPolygons.push (polygonsToProcess[j]);
			}
		}

		var boundingBox = polygon.GetBoundingBox ();
		var xSize = boundingBox.max.x - boundingBox.min.x;
		var ySize = boundingBox.max.y - boundingBox.min.y;
		var xSegmentSize = xSize / xSegments;
		var ySegmentSize = ySize / ySegments;

		var originalPolygons = [polygon];
		var bottomLeft = new JSM.Coord2D (boundingBox.min.x, boundingBox.min.y);
		var topLeft = new JSM.Coord2D (boundingBox.min.x, boundingBox.max.y);

		var xCuttedPolygons = [];
		var yCuttedPolygons = [];
		CutPolygonsOneDirection (originalPolygons, xCuttedPolygons, xSegments, xSegmentSize, bottomLeft, new JSM.Vector2D (1.0, 0.0), new JSM.Vector2D (0.0, 1.0));
		CutPolygonsOneDirection (xCuttedPolygons, yCuttedPolygons, ySegments, ySegmentSize, topLeft, new JSM.Vector2D (0.0, -1.0), new JSM.Vector2D (1.0, 0.0));
		return yCuttedPolygons;
	};

	return JSM;
});

define('skylark-jsmodeler/geometry/triangulation',["../core/jsm"],function(JSM){
	JSM.ConvertContourPolygonToPolygon2D = function (inputPolygon, vertexMap)
	{
		function AddResultVertex (resultPolygon, vertex, vertexMap, originalContour, originalVertex)
		{
			resultPolygon.AddVertexCoord (vertex);
			if (vertexMap !== undefined && vertexMap !== null) {
				vertexMap.push ([originalContour, originalVertex]);
			}
		}
		
		function AddContour (inputPolygon, resultPolygon, holeIndex, vertexMap, conversionData)
		{
			function GetEntryPoint (inputPolygon, resultPolygon, holeIndex, conversionData)
			{
				function IsEntryPoint (inputPolygon, resultPolygon, resultVertex, holeVertex, conversionData)
				{
					function SegmentIntersectsPolygon (polygon, segmentBeg, segmentEnd)
					{
						var sector = new JSM.Sector2D (segmentBeg, segmentEnd);
						var position = polygon.SectorPosition (sector, -1, -1);
						if (position == JSM.SectorPolygonPosition2D.IntersectionOnePoint || position == JSM.SectorPolygonPosition2D.IntersectionCoincident) {
							return true;
						}
						return false;
					}

					if (SegmentIntersectsPolygon (resultPolygon, resultVertex, holeVertex)) {
						return false;
					}
					
					var i, hole;
					for (i = 1; i < inputPolygon.ContourCount (); i++) {
						if (conversionData.addedHoles[i] !== undefined) {
							continue;
						}
						hole = inputPolygon.GetContour (i);
						if (SegmentIntersectsPolygon (hole, resultVertex, holeVertex)) {
							return false;
						}
					}
					
					return true;
				}
				
				function IsExistingEntryPosition (coord, conversionData)
				{
					var i;
					for (i = 0; i < conversionData.entryPositions.length; i++) {
						if (coord.IsEqual (conversionData.entryPositions[i])) {
							return true;
						}
					}
					return false;
				}

				var holePolygon = inputPolygon.GetContour (holeIndex);
				var resultVertexIndex, holeVertexIndex, resultVertex, holeVertex;
				for (resultVertexIndex = 0; resultVertexIndex < resultPolygon.VertexCount (); resultVertexIndex++) {
					for (holeVertexIndex = 0; holeVertexIndex < holePolygon.VertexCount (); holeVertexIndex++) {
						resultVertex = resultPolygon.GetVertex (resultVertexIndex);
						holeVertex = holePolygon.GetVertex (holeVertexIndex);
						if (IsEntryPoint (inputPolygon, resultPolygon, resultVertex, holeVertex, conversionData)) {
							if (IsExistingEntryPosition (resultVertex, conversionData) || IsExistingEntryPosition (holeVertex, conversionData)) {
								continue;
							}
							conversionData.entryPositions.push (resultVertex.Clone ());
							conversionData.entryPositions.push (holeVertex.Clone ());
							return {
								beg : resultVertexIndex,
								end : holeVertexIndex
							};
						}
					}
				}
				return null;
			}
			
			function AddHole (resultPolygon, inputPolygon, holeIndex, entryPoint, vertexMap)
			{
				var holePolygon = inputPolygon.GetContour (holeIndex);
				var mainContourBeg = entryPoint.beg;
				var mainEntryVertex = resultPolygon.GetVertex (mainContourBeg).Clone ();
				resultPolygon.ShiftVertices (mainContourBeg + 1);

				var mainEntryContourIndex = 0;
				var mainEntryVertexIndex = 0;
				if (vertexMap !== undefined && vertexMap !== null) {
					mainEntryContourIndex = vertexMap[mainContourBeg][0];
					mainEntryVertexIndex = vertexMap[mainContourBeg][1];
					JSM.ShiftArray (vertexMap, mainContourBeg + 1);
				}

				var contourBeg = entryPoint.end;
				var contourEnd = holePolygon.GetPrevVertex (contourBeg);
				holePolygon.EnumerateVertices (contourBeg, contourEnd, function (index) {
					AddResultVertex (resultPolygon, holePolygon.GetVertex (index).Clone (), vertexMap, holeIndex, index);
				});
				AddResultVertex (resultPolygon, holePolygon.GetVertex (contourBeg).Clone (), vertexMap, holeIndex, contourBeg);
				AddResultVertex (resultPolygon, mainEntryVertex, vertexMap, mainEntryContourIndex, mainEntryVertexIndex);
			}
			
			var entryPoint = GetEntryPoint (inputPolygon, resultPolygon, holeIndex, conversionData);
			if (entryPoint === null) {
				return false;
			}

			AddHole (resultPolygon, inputPolygon, holeIndex, entryPoint, vertexMap);
			return true;
		}
		
		var contourCount = inputPolygon.ContourCount ();
		var mainContour = inputPolygon.GetContour (0);
		var resultPolygon = new JSM.Polygon2D ();
		var i, vertex;
		for (i = 0; i < mainContour.VertexCount (); i++) {
			vertex = mainContour.GetVertex (i);
			AddResultVertex (resultPolygon, vertex.Clone (), vertexMap, 0, i);
		}
		if (contourCount == 1) {
			return resultPolygon;
		}
		
		var holeQueue = [];
		var holeIndex;
		for (holeIndex = 1; holeIndex < contourCount; holeIndex++) {
			holeQueue.push (holeIndex);
		}
		
		var conversionData = {
			addedHoles : {},
			holeTryouts : {},
			entryPositions : []
		};
		
		while (holeQueue.length > 0) {
			holeIndex = holeQueue.shift ();
			if (AddContour (inputPolygon, resultPolygon, holeIndex, vertexMap, conversionData)) {
				conversionData.addedHoles[holeIndex] = true;
			} else {
				if (conversionData.holeTryouts[holeIndex] === undefined) {
					conversionData.holeTryouts[holeIndex] = 0;
				}
				conversionData.holeTryouts[holeIndex] += 1;
				if (conversionData.holeTryouts[holeIndex] > 10) {
					return null;
				}
				holeQueue.push (holeIndex);
			}
		}
		
		return resultPolygon;
	};

	JSM.TriangulateConvexPolygon = function (polygon)
	{
		var result = [];
		var i;
		for (i = 1; i < polygon.VertexCount () - 1; i++) {
			result.push ([0, i, i + 1]);
		}
		return result;
	};

	JSM.TriangulateConcavePolygon2D = function (inputPolygon)
	{
		function GetInitialVertexMap (count)
		{
			var result = [];
			var i;
			for (i = 0; i < count; i++) {
				result[i] = i;
			}
			return result;
		}
		
		function FindSplitDiagonal (polygon)
		{
			var count = polygon.VertexCount ();
			var i, j;
			for (i = 0; i < count; i++) {
				for (j = 0; j < count; j++) {
					if (i == j) {
						continue;
					}
					if (polygon.IsDiagonal (i, j)) {
						return {
							beg : i,
							end : j
						};
					}
				}
			}
			return null;
		}

		function SplitPolygon (polygonData, diagonal)
		{
			function AddVertex (polygonData, resultData, index)
			{
				resultData.polygon.AddVertexCoord (polygonData.polygon.GetVertex (index));
				resultData.map.push (polygonData.map[index]);
			}
			
			var resultData1 = {
				polygon : new JSM.Polygon2D (),
				map : []
			};
			var resultData2 = {
				polygon : new JSM.Polygon2D (),
				map : []
			};

			var beg, end;
			
			beg = diagonal.beg;
			end = polygonData.polygon.GetPrevVertex (diagonal.end);
			AddVertex (polygonData, resultData1, diagonal.end);
			polygonData.polygon.EnumerateVertices (beg, end, function (index) {
				AddVertex (polygonData, resultData1, index);
			});

			beg = diagonal.end;
			end = polygonData.polygon.GetPrevVertex (diagonal.beg);
			AddVertex (polygonData, resultData2, diagonal.beg);
			polygonData.polygon.EnumerateVertices (beg, end, function (index) {
				AddVertex (polygonData, resultData2, index);
			});
			
			return {
				resultData1 : resultData1,
				resultData2 : resultData2
			};
		}
		
		var polygonStack = [];
		var count = inputPolygon.VertexCount ();
		var inputMap = GetInitialVertexMap (count);
		polygonStack.push ({
			polygon : inputPolygon,
			map : inputMap
		});
		
		var result = [];
		var polygonData, vertexCount, diagonal, resultData;
		while (polygonStack.length > 0) {
			polygonData = polygonStack.pop ();
			vertexCount = polygonData.polygon.VertexCount ();
			if (vertexCount < 3) {
				continue;
			}
			if (vertexCount == 3) {
				result.push (polygonData.map);
				continue;
			}
			diagonal = FindSplitDiagonal (polygonData.polygon);
			if (diagonal === null) {
				return null;
			}
			resultData = SplitPolygon (polygonData, diagonal);
			polygonStack.push (resultData.resultData1);
			polygonStack.push (resultData.resultData2);
		}
		return result;
	};

	JSM.TriangulatePolygon2D = function (polygon)
	{
		if (polygon === null) {
			return null;
		}
		
		var vertexCount = polygon.VertexCount ();
		if (vertexCount < 3) {
			return null;
		}
		
		if (vertexCount == 3) {
			return [[0, 1, 2]];
		}
		
		var complexity = polygon.GetComplexity ();
		if (complexity === JSM.Complexity.Invalid) {
			return null;
		}
		
		if (complexity == JSM.Complexity.Convex) {
			return JSM.TriangulateConvexPolygon (polygon);
		}
		
		return JSM.TriangulateConcavePolygon2D (polygon);
	};

	/**
	* Function: TriangulatePolygon
	* Description:
	*	Triangulates a polygon. The result defines triangles as an
	*	array of arrays with three original vertex indices.
	* Parameters:
	*	polygon {Polygon} the polygon
	* Returns:
	*	{integer[3][*]} the result
	*/
	JSM.TriangulatePolygon = function (polygon)
	{
		var polygon2D = polygon.ToPolygon2D ();
		return JSM.TriangulatePolygon2D (polygon2D);
	};

	return JSM;
});

define('skylark-jsmodeler/geometry/octree',["../core/jsm"],function(JSM){
	/**
	* Function: TraverseOctreeNodes
	* Description:
	*	Traverses the nodes of the tree, and calls the given callback when a node found. The return value
	*	of the callback determines if we need to continue traverse along that given node.
	* Parameters:
	*	octree {Octree} the octree
	*	nodeFound {function} the callback
	*/
	JSM.TraverseOctreeNodes = function (octree, nodeFound)
	{
		function TraverseNode (node, nodeFound)
		{
			if (!nodeFound (node)) {
				return;
			}
			
			if (node.children === null) {
				return;
			}
			
			var i, child;
			for (i = 0; i < node.children.length; i++) {
				child = node.children[i];
				TraverseNode (child, nodeFound);
			}
		}

		TraverseNode (octree.root, nodeFound);
	};

	/**
	* Function: CreateOctreeChildNodes
	* Description:
	*	Create child nodes for an octree node. It calls a callback function
	*	which should create a new node element for the octree.
	* Parameters:
	*	originalBox {Box} the box of the original node
	*	createNodeCallback {function} the callback function
	* Returns:
	*	{object[*]} the result
	*/
	JSM.CreateOctreeChildNodes = function (originalBox, createNodeCallback)
	{
		function CreateNode (originalBox, createNodeCallback, dirX, dirY, dirZ)
		{
			var size = originalBox.GetSize ().Clone ();
			size.MultiplyScalar (0.5);
			var min = new JSM.Coord (
				originalBox.min.x + dirX * size.x,
				originalBox.min.y + dirY * size.y,
				originalBox.min.z + dirZ * size.z
			);
			var max = JSM.CoordAdd (min, size);
			var box = new JSM.Box (min, max);
			return createNodeCallback (box);
		}

		var size = originalBox.GetSize ();
		if (JSM.IsZero (size.x) && JSM.IsZero (size.y) && JSM.IsZero (size.z)) {
			return null;
		}
		
		var result = [
			CreateNode (originalBox, createNodeCallback, 0.0, 0.0, 0.0),
			CreateNode (originalBox, createNodeCallback, 1.0, 0.0, 0.0),
			CreateNode (originalBox, createNodeCallback, 1.0, 1.0, 0.0),
			CreateNode (originalBox, createNodeCallback, 0.0, 1.0, 0.0),
			CreateNode (originalBox, createNodeCallback, 0.0, 0.0, 1.0),
			CreateNode (originalBox, createNodeCallback, 1.0, 0.0, 1.0),
			CreateNode (originalBox, createNodeCallback, 1.0, 1.0, 1.0),
			CreateNode (originalBox, createNodeCallback, 0.0, 1.0, 1.0),
		];
		return result;
	};

	/**
	* Class: Octree
	* Description: Defines an octree. The octree contains each coordinate only once.
	* Parameters:
	*	box {Box} bounding box
	*	maxCoordNumInNodes {integer} maximum number of coordinates in a node
	*/
	JSM.Octree = function (box, maxCoordNumInNodes)
	{
		this.coords = [];
		this.root = this.CreateNewNode (null, box);
		this.maxCoordNumInNodes = maxCoordNumInNodes;
		if (this.maxCoordNumInNodes === undefined || this.maxCoordNumInNodes === null || this.maxCoordNumInNodes === 0) {
			this.maxCoordNumInNodes = 50;
		}
	};

	/**
	* Function: Octree.AddCoord
	* Description:
	*	Adds a coordinate to the octree. The return value is the stored index of the coordinate.
	*	If the coordinate was already in the octree, it returns the existing index.
	* Parameters:
	*	coord {Coord} the coordinate
	* Returns:
	*	{integer} the stored index of the coordinate
	*/
	JSM.Octree.prototype.AddCoord = function (coord)
	{
		return this.AddCoordToNode (coord, this.root);
	};

	/**
	* Function: Octree.FindCoord
	* Description:
	*	Finds a coordinate in the octree, and returns the stored index of it.
	*	The return value is -1 if the coordinate does not exist.
	* Parameters:
	*	coord {Coord} the coordinate
	* Returns:
	*	{integer} the stored index of the coordinate
	*/
	JSM.Octree.prototype.FindCoord = function (coord)
	{
		var node = this.FindNodeForCoord (coord, this.root);
		if (node === null) {
			return -1;
		}
		return this.FindCoordInNode (coord, node);
	};

	/**
	* Function: Octree.FindCoordInNode
	* Description: Finds a coordinate in a node.
	* Parameters:
	*	coord {Coord} the coordinate
	*	node {object} the node
	* Returns:
	*	{integer} the stored index of the coordinate
	*/
	JSM.Octree.prototype.FindCoordInNode = function (coord, node)
	{
		var i, current;
		for (i = 0; i < node.coords.length; i++) {
			current = node.coords[i];
			if (coord.IsEqual (this.coords[current])) {
				return current;
			}
		}
		return -1;
	};

	/**
	* Function: Octree.AddCoordToNode
	* Description: Adds a coordinate to a node.
	* Parameters:
	*	coord {Coord} the coordinate
	*	root {object} the root node
	* Returns:
	*	{integer} the stored index of the coordinate
	*/
	JSM.Octree.prototype.AddCoordToNode = function (coord, root)
	{
		var node = this.FindNodeForCoord (coord, root);
		if (node === null) {
			return -1;
		}
		
		var found = this.FindCoordInNode (coord, node);
		if (found != -1) {	
			return found;
		}
		
		if (node.coords.length >= this.maxCoordNumInNodes) {
			if (this.SplitNode (node)) {
				return this.AddCoordToNode (coord, node);
			}
		}
		
		var index = this.coords.length;
		this.coords.push (coord);
		node.coords.push (index);
		return index;
	};

	/**
	* Function: Octree.FindNodeForCoord
	* Description: Finds a node for a coordinate.
	* Parameters:
	*	coord {Coord} the coordinate
	*	node {object} the starting node
	* Returns:
	*	{object} the found node
	*/
	JSM.Octree.prototype.FindNodeForCoord = function (coord, node)
	{
		if (node.children === null) {
			return node;
		}
		
		var center = node.box.GetCenter ();
		var xGreater = coord.x > center.x;
		var yGreater = coord.y > center.y;
		var zGreater = coord.z > center.z;
		
		if (!xGreater && !yGreater && !zGreater) {
			return this.FindNodeForCoord (coord, node.children[0]);
		} else if (xGreater && !yGreater && !zGreater) {
			return this.FindNodeForCoord (coord, node.children[1]);
		} else if (xGreater && yGreater && !zGreater) {
			return this.FindNodeForCoord (coord, node.children[2]);
		} else if (!xGreater && yGreater && !zGreater) {
			return this.FindNodeForCoord (coord, node.children[3]);
		} else if (!xGreater && !yGreater && zGreater) {
			return this.FindNodeForCoord (coord, node.children[4]);
		} else if (xGreater && !yGreater && zGreater) {
			return this.FindNodeForCoord (coord, node.children[5]);
		} else if (xGreater && yGreater && zGreater) {
			return this.FindNodeForCoord (coord, node.children[6]);
		} else if (!xGreater && yGreater && zGreater) {
			return this.FindNodeForCoord (coord, node.children[7]);
		}
		
		return null;
	};

	/**
	* Function: Octree.SplitNode
	* Description: Splits a node to subnodes.
	* Parameters:
	*	node {object} the node
	* Returns:
	*	{boolean} success
	*/
	JSM.Octree.prototype.SplitNode = function (node)
	{
		var myThis = this;
		var children = JSM.CreateOctreeChildNodes (node.box, function (nodeBox) {
			return myThis.CreateNewNode (node, nodeBox);
		});
		
		if (children === null) {
			return false;
		}
		
		node.children = children;
		var nodeCoords = node.coords;
		node.coords = [];
		
		var i, newNode;
		for (i = 0; i < nodeCoords.length; i++) {
			newNode = this.FindNodeForCoord (this.coords[nodeCoords[i]], node);
			newNode.coords.push (nodeCoords[i]);
		}
		
		return true;
	};

	/**
	* Function: Octree.CreateNewNode
	* Description: Creates a new node.
	* Parameters:
	*	parent {object} the parent node
	*	box {Box} the box of the node
	* Returns:
	*	{object} the result
	*/
	JSM.Octree.prototype.CreateNewNode = function (parent, box)
	{
		var newNode = {
			parent : parent,
			box : box,
			coords : [],
			children : null
		};
		return newNode;	
	};

	/**
	* Class: TriangleOctree
	* Description:
	*	Defines an octree which stores triangles. Every triangle is placed in
	*	the smallest possible node which contains all of its vertices.
	* Parameters:
	*	box {Box} bounding box
	*/
	JSM.TriangleOctree = function (box)
	{
		this.root = this.CreateNewNode (null, box);
	};

	/**
	* Function: TriangleOctree.AddTriangle
	* Description: Adds a triangle to the octree.
	* Parameters:
	*	v0, v1, v2 {Coord} the vertices of the triangle
	*	userData {anything} user data for the triangle
	*/
	JSM.TriangleOctree.prototype.AddTriangle = function (v0, v1, v2, userData)
	{
		return this.AddTriangleToNode (v0, v1, v2, this.root, userData);
	};

	/**
	* Function: TriangleOctree.AddTriangleToNode
	* Description: Adds a coordinate to a node.
	* Parameters:
	*	v0, v1, v2 {Coord} the vertices of the triangle
	*	root {object} the root node
	* Returns:
	*	{boolean} success
	*/
	JSM.TriangleOctree.prototype.AddTriangleToNode = function (v0, v1, v2, root, userData)
	{
		function IsTriangleInNode (v0, v1, v2, node)
		{
			return node.box.IsCoordInside (v0) && node.box.IsCoordInside (v1) && node.box.IsCoordInside (v2);
		}
		
		if (!IsTriangleInNode (v0, v1, v2, root)) {
			return false;
		}
		
		if (root.children === null) {
			var myThis = this;
			root.children = JSM.CreateOctreeChildNodes (root.box, function (nodeBox) {
				return myThis.CreateNewNode (root, nodeBox);
			});
		}
		
		if (root.children !== null) {
			var i, node;
			for (i = 0; i < root.children.length; i++) {
				node = root.children[i];
				if (this.AddTriangleToNode (v0, v1, v2, node, userData)) {
					return true;
				}
			}
		}
		
		root.triangles.push ({
			v0 : v0,
			v1 : v1,
			v2 : v2,
			userData : userData
		});
		return true;
	};

	/**
	* Function: TriangleOctree.CreateNewNode
	* Description: Creates a new node.
	* Parameters:
	*	parent {object} the parent node
	*	box {Box} the box of the node
	* Returns:
	*	{object} the result
	*/
	JSM.TriangleOctree.prototype.CreateNewNode = function (parent, box)
	{
		var newNode = {
			parent : parent,
			box : box,
			triangles : [],
			children : null
		};
		return newNode;	
	};

	return JSM;
});

define('skylark-jsmodeler/geometry/bsptree',["../core/jsm"],function(JSM){
	/**
	* Class: BSPTree
	* Description: Defines a BSP tree.
	*/
	JSM.BSPTree = function ()
	{
		this.root = null;
	};

	/**
	* Function: BSPTree.AddPolygon
	* Description: Adds a polygon to the tree.
	* Parameters:
	*	polygon {Polygon} the polygon
	*	userData {anything} user data for polygon
	* Returns:
	*	{boolean} success
	*/
	JSM.BSPTree.prototype.AddPolygon = function (polygon, userData)
	{
		if (this.root === null) {
			this.root = this.CreateNewNode ();
		}
		
		return this.AddPolygonToNode (this.root, polygon, userData);
	};

	/**
	* Function: BSPTree.Traverse
	* Description: Traverses the tree and calls a function on node found.
	* Parameters:
	*	nodeFound {function} the callback function
	*/
	JSM.BSPTree.prototype.Traverse = function (nodeFound)
	{
		this.TraverseNode (this.root, nodeFound);
	};

	/**
	* Function: BSPTree.TraverseNode
	* Description: Traverses a node and its children and calls a function on node found.
	* Parameters:
	*	node {object} the node
	*	nodeFound {function} the callback function
	*/
	JSM.BSPTree.prototype.TraverseNode = function (node, nodeFound)
	{
		if (node !== null) {
			nodeFound (node);
			this.TraverseNode (node.inside, nodeFound);
			this.TraverseNode (node.outside, nodeFound);
		}
	};

	/**
	* Function: BSPTree.GetNodes
	* Description: Returns the nodes as an array.
	* Returns:
	*	{object[*]} the result
	*/
	JSM.BSPTree.prototype.GetNodes = function ()
	{
		var result = [];
		this.Traverse (function (node) {
			result.push (node);
		});
		return result;
	};

	/**
	* Function: BSPTree.GetNodes
	* Description: Count nodes.
	* Returns:
	*	{integer} the result
	*/
	JSM.BSPTree.prototype.NodeCount = function ()
	{
		var count = 0;
		this.Traverse (function () {
			count = count + 1;
		});
		return count;
	};

	/**
	* Function: BSPTree.AddPolygonToNode
	* Description: Adds a polygon to a node.
	* Parameters:
	*	node {object} the node
	*	polygon {Polygon} the polygon
	*	userData {anything} user data for polygon
	* Returns:
	*	{boolean} success
	*/
	JSM.BSPTree.prototype.AddPolygonToNode = function (node, polygon, userData)
	{
		if (polygon.VertexCount () < 3) {
			return false;
		}
		
		var normal;
		if (node.polygon === null) {
			normal = polygon.GetNormal ();
			var plane = JSM.GetPlaneFromCoordAndDirection (polygon.GetVertex (0), normal);
			node.polygon = polygon;
			if (userData !== undefined) {
				node.userData = userData;
			}
			node.plane = plane;
		} else {
			var backPolygons = [];
			var frontPolygons = [];
			var planePolygons = [];
			var cutSucceeded = JSM.CutPolygonWithPlane (polygon, node.plane, frontPolygons, backPolygons, planePolygons);
			if (cutSucceeded) {
				if (backPolygons.length > 0) {
					this.AddInsidePolygonsToNode (node, backPolygons, userData);
				}
				if (frontPolygons.length > 0) {
					this.AddOutsidePolygonsToNode (node, frontPolygons, userData);
				}
				if (planePolygons.length > 0) {
					normal = polygon.GetNormal ();
					if (JSM.VectorDot (normal, node.plane.GetNormal ()) > 0) {
						this.AddInsidePolygonsToNode (node, planePolygons, userData);
					} else {
						this.AddOutsidePolygonsToNode (node, planePolygons, userData);
					}
				}
			}
		}
		
		return true;
	};

	/**
	* Function: BSPTree.AddInsidePolygonsToNode
	* Description: Adds inside polygons to a node.
	* Parameters:
	*	node {object} the node
	*	polygon {Polygon[*]} the polygons
	*	userData {anything} user data for polygons
	*/
	JSM.BSPTree.prototype.AddInsidePolygonsToNode = function (node, polygons, userData)
	{
		if (node.inside === null) {
			node.inside = this.CreateNewNode ();
			node.inside.parent = node;
		}
		var i;
		for (i = 0; i < polygons.length; i++) {
			this.AddPolygonToNode (node.inside, polygons[i], userData);
		}
	};

	/**
	* Function: BSPTree.AddOutsidePolygonsToNode
	* Description: Adds outside polygons to a node.
	* Parameters:
	*	node {object} the node
	*	polygon {Polygon[*]} the polygons
	*	userData {anything} user data for polygons
	*/
	JSM.BSPTree.prototype.AddOutsidePolygonsToNode = function (node, polygons, userData)
	{
		if (node.outside === null) {
			node.outside = this.CreateNewNode ();
			node.outside.parent = node;
		}
		var i;
		for (i = 0; i < polygons.length; i++) {
			this.AddPolygonToNode (node.outside, polygons[i], userData);
		}
	};

	/**
	* Function: BSPTree.CreateNewNode
	* Description: Creates a new node.
	* Returns:
	*	{object} the result
	*/
	JSM.BSPTree.prototype.CreateNewNode = function ()
	{
		var node = {
			polygon : null,
			userData : null,
			plane : null,
			parent : null,
			inside : null,
			outside : null
		};
		return node;
	};

	/**
	* Function: ClipPolygonWithBSPTree
	* Description: Clips a polygon with a created BSP tree.
	* Parameters:
	*	polygon {Polygon} the polygon
	*	bspTree {BSPTree} the BSP tree
	*	frontPolygons {Polygon[*]} (out) polygons in front of the tree
	*	backPolygons {Polygon[*]} (out) polygons at the back of the tree
	*	planarFrontPolygons {Polygon[*]} (out) polygons on the tree looks front
	*	planarBackPolygons {Polygon[*]} (out) polygons on the tree looks back
	* Returns:
	*	{boolean} success
	*/
	JSM.ClipPolygonWithBSPTree = function (polygon, bspTree, frontPolygons, backPolygons, planarFrontPolygons, planarBackPolygons)
	{
		function CutPolygonWithNode (polygon, node, isPlanar)
		{
			if (node === null) {
				return;
			}
			
			var cutBackPolygons = [];
			var cutFrontPolygons = [];
			var cutPlanarPolygons = [];
			var cutSucceeded = JSM.CutPolygonWithPlane (polygon, node.plane, cutFrontPolygons, cutBackPolygons, cutPlanarPolygons);
			if (!cutSucceeded) {
				return;
			}

			if (cutBackPolygons.length > 0) {
				AddInsidePolygons (node, cutBackPolygons, isPlanar);
			}
			if (cutFrontPolygons.length > 0) {
				AddOutsidePolygons (node, cutFrontPolygons, isPlanar);
			}
			if (cutPlanarPolygons.length > 0) {
				var normal = polygon.GetNormal ();
				if (JSM.VectorDot (normal, node.plane.GetNormal ()) > 0) {
					AddInsidePolygons (node, cutPlanarPolygons, true);
				} else {
					AddOutsidePolygons (node, cutPlanarPolygons, true);
				}
			}
		}

		function CutPolygonsWithNode (polygons, node, isPlanar)
		{
			var i;
			for (i = 0; i < polygons.length; i++) {
				CutPolygonWithNode (polygons[i], node, isPlanar);
			}
		}

		function AddPolygonsToArray (polygons, polygonArray)
		{
			var i;
			for (i = 0; i < polygons.length; i++) {
				polygonArray.push (polygons[i]);
			}
		}

		function AddInsidePolygons (node, polygons, isPlanar)
		{
			if (node.inside !== null) {
				CutPolygonsWithNode (polygons, node.inside, isPlanar);
			} else {
				AddPolygonsToArray (polygons, isPlanar ? planarBackPolygons : backPolygons);
			}
		}
		
		function AddOutsidePolygons (node, polygons, isPlanar)
		{
			if (node.outside !== null) {
				CutPolygonsWithNode (polygons, node.outside, isPlanar);
			} else {
				AddPolygonsToArray (polygons, isPlanar ? planarFrontPolygons : frontPolygons);
			}
		}

		CutPolygonWithNode (polygon, bspTree.root, false);
		return true;
	};

	/**
	* Function: TraverseBSPTreeForEyePosition
	* Description: Traverses a BSP tree for a given eye position.
	* Parameters:
	*	bspTree {BSPTree} the BSP tree
	*	eyePosition {Coord} the eye position
	*	nodeFound {function} the callback function
	*/
	JSM.TraverseBSPTreeForEyePosition = function (bspTree, eyePosition, nodeFound)
	{
		function TraverseNode (node)
		{
			if (node !== null) {
				var coordPlanePosition = node.plane.CoordPosition (eyePosition);
				if (coordPlanePosition == JSM.CoordPlanePosition.CoordInFrontOfPlane) {
					TraverseNode (node.inside);
					nodeFound (node);
					TraverseNode (node.outside);
				} else if (coordPlanePosition == JSM.CoordPlanePosition.CoordAtBackOfPlane) {
					TraverseNode (node.outside);
					nodeFound (node);
					TraverseNode (node.inside);
				} else {
					TraverseNode (node.outside);
					TraverseNode (node.inside);
				}
			}
		}
		
		TraverseNode (bspTree.root);
	};

	return JSM;
});

define('skylark-jsmodeler/geometry/curves',["../core/jsm"],function(JSM){
	/**
	* Function: GenerateCubicBezierCurve
	* Description: Generates a bezier curve from the given points.
	* Parameters:
	*	p0 {Coord2D} point 1
	*	p1 {Coord2D} point 2
	*	p2 {Coord2D} point 3
	*	p3 {Coord2D} point 4
	*	segmentation {integer} the segmentation of the result curve
	* Returns:
	*	{Coord2D[]} the result
	*/
	JSM.GenerateCubicBezierCurve = function (p0, p1, p2, p3, segmentation)
	{
		function GetCubicBezierPoint (p0, p1, p2, p3, t)
		{
			var t2 = t * t;
			var t3 = t2 * t;
			var invT = 1.0 - t;
			var invT2 = invT * invT;
			var invT3 = invT2 * invT;
			var x = invT3 * p0.x + 3.0 * invT2 * t * p1.x  + 3.0 * invT * t2 * p2.x + t3 * p3.x;
			var y = invT3 * p0.y + 3.0 * invT2 * t * p1.y  + 3.0 * invT * t2 * p2.y + t3 * p3.y;
			return new JSM.Coord2D (x, y);
		}
		
		var result = [];
		var s = 1.0 / segmentation;
		var i, coord;
		for (i = 0; i <= segmentation; i++) {
			coord = GetCubicBezierPoint (p0, p1, p2, p3, i * s);
			result.push (coord);
		}
		return result;
	};

	/**
	* Function: BernsteinPolynomial
	* Description: Calculates the value of the Bernstein polynomial.
	* Parameters:
	*	k {integer} the start index
	*	n {integer} the end index
	*	x {number} the value
	* Returns:
	*	{number} the result
	*/
	JSM.BernsteinPolynomial = function (k, n, x)
	{
		function BinomialCoefficient (n, k)
		{
			var result = 1.0;
			var min = JSM.Minimum (k, n - k);
			var i;
			for (i = 0; i < min; i++) {
				result = result * (n - i);
				result = result / (i + 1);
			}
			return result;
		}

		var coefficient = BinomialCoefficient (n, k);
		return coefficient * Math.pow (x, k) * Math.pow (1.0 - x, n - k);
	};

	/**
	* Function: GenerateBezierCurve
	* Description: Generates a bezier curve from the given points.
	* Parameters:
	*	points {Coord2D[]} the points
	*	segmentation {integer} the segmentation of the result curve
	* Returns:
	*	{Coord2D[]} the result
	*/
	JSM.GenerateBezierCurve = function (points, segmentation)
	{
		var result = [];
		var n = points.length - 1;
		var s = 1.0 / segmentation;
		
		var i, j, t, point, bernstein, coord;
		for (i = 0; i <= segmentation; i++) {
			t = i * s;
			coord = new JSM.Coord2D (0.0, 0.0);
			for (j = 0; j <= n; j++) {
				point = points[j];
				bernstein = JSM.BernsteinPolynomial (j, n, t);
				coord.x += point.x * bernstein;
				coord.y += point.y * bernstein;
			}
			result.push (coord);
		}
		return result;
	};

	return JSM;
});

define('skylark-jsmodeler/geometry/utilities',["../core/jsm"],function(JSM){
	/**
	* Function: GetGaussianCParameter
	* Description:
	*	Calculates the gaussian functions c parameter which can be used
	*	for the gaussian function to reach epsilon at a given value.
	* Parameters:
	*	x {number} the value
	*	a {number} the a parameter of the function
	*	b {number} the b parameter of the function
	*	epsilon {number} the epsilon value
	* Returns:
	*	{number} the c parameter of the function
	*/
	JSM.GetGaussianCParameter = function (x, a, b, epsilon)
	{
		return Math.sqrt (-(Math.pow (x - b, 2.0) / (2.0 * Math.log (epsilon / Math.abs (a)))));
	};

	/**
	* Function: GetGaussianValue
	* Description: Calculates the gaussian functions value.
	* Parameters:
	*	x {number} the value
	*	a {number} the a parameter of the function
	*	b {number} the b parameter of the function
	*	c {number} the c parameter of the function
	* Returns:
	*	{number} the result
	*/
	JSM.GetGaussianValue = function (x, a, b, c)
	{
		return a * Math.exp (-(Math.pow (x - b, 2.0) / (2.0 * Math.pow (c, 2.0))));
	};

	/**
	* Function: GenerateCirclePoints
	* Description: Generates coordinates on circle.
	* Parameters:
	*	radius {number} the radius of the circle
	*	segmentation {number} the segmentation of the circle
	*	origo {Coord} the origo of the circle
	* Returns:
	*	{Coord[*]} the result
	*/
	JSM.GenerateCirclePoints = function (radius, segmentation, origo)
	{
		var result = [];
		var segments = segmentation;

		var theta = 2.0 * Math.PI;
		var step = 2.0 * Math.PI / segments;
		
		var i, coord;
		for (i = 0; i < segments; i++) {
			coord = JSM.CylindricalToCartesian (radius, 0.0, theta);
			if (origo !== undefined && origo !== null) {
				coord = JSM.CoordAdd (coord, origo);
			}
			result.push (coord);
			theta += step;
		}
		
		return result;
	};

	/**
	* Function: GetRuledMesh
	* Description:
	*	Generates ruled mesh coordinates and polygons between two coordinate array.
	*	The two arrays should have the same length. The result is a coordinate array
	*	and a polygon array which contains indices for vertices.
	* Parameters:
	*	aCoords {Coord[*]} the first coordinate array
	*	bCoords {Coord[*]} the second coordinate array
	*	segmentation {number} the segmentation of the mesh
	*	vertices {Coord[*]} (out) the vertices of the mesh
	*	polygons {integer[*][4]} (out) the polygons of the mesh
	*/
	JSM.GetRuledMesh = function (aCoords, bCoords, segmentation, vertices, polygons)
	{
		if (aCoords.length !== bCoords.length) {
			return;
		}

		var lineSegmentation = aCoords.length - 1;
		var meshSegmentation = segmentation;
		var directions = [];
		var lengths = [];

		var i, j;
		for (i = 0; i <= lineSegmentation; i++) {
			directions.push (JSM.CoordSub (bCoords[i], aCoords[i]));
			lengths.push (aCoords[i].DistanceTo (bCoords[i]));
		}

		var step, coord;
		for (i = 0; i <= lineSegmentation; i++) {
			step = lengths[i] / meshSegmentation;
			for (j = 0; j <= meshSegmentation; j++) {
				coord = aCoords[i].Clone ().Offset (directions[i], step * j);
				vertices.push (coord);
			}
		}

		var current, top, next, ntop, polygon;
		for (i = 0; i < lineSegmentation; i++) {
			for (j = 0; j < meshSegmentation; j++) {
				current = i * (meshSegmentation + 1) + j;
				top = current + meshSegmentation + 1;
				next = current + 1;
				ntop = top + 1;

				current = i * (meshSegmentation + 1) + j;
				top = current + 1;
				next = current + meshSegmentation + 1;
				ntop = next + 1;

				polygon = [current, next, ntop, top];
				polygons.push (polygon);
			}
		}
	};

	return JSM;
});

define('skylark-jsmodeler/geometry/ray',["../core/jsm"],function(JSM){
	/**
	* Class: Ray
	* Description: Represents a Ray.
	* Parameters:
	*	origin {Coord} the starting point of the ray
	*	direction {Vector} the direction of the ray
	*	length {number} the length of the ray, null means infinite ray
	*/
	JSM.Ray = function (origin, direction, length)
	{
		this.origin = origin;
		this.direction = direction.Normalize ();
		this.length = length;
	};

	/**
	* Function: Ray.Set
	* Description: Sets the ray.
	* Parameters:
	*	origin {Coord} the starting point of the ray
	*	direction {Vector} the direction of the ray
	*	length {number} the length of the ray, null means infinite ray
	*/
	JSM.Ray.prototype.Set = function (origin, direction, length)
	{
		this.origin = origin;
		this.direction = direction.Normalize ();
		this.length = length;
	};

	/**
	* Function: Ray.GetOrigin
	* Description: Returns the origin of the ray.
	* Returns:
	*	{Coord} the result
	*/
	JSM.Ray.prototype.GetOrigin = function ()
	{
		return this.origin;
	};

	/**
	* Function: Ray.GetDirection
	* Description: Returns the direction of the ray.
	* Returns:
	*	{Vector} the result
	*/
	JSM.Ray.prototype.GetDirection = function ()
	{
		return this.direction;
	};

	/**
	* Function: Ray.IsLengthReached
	* Description:
	*	Returns if the given length is greater than the length of the ray.
	*	Always return false in case of infinite ray.
	* Returns:
	*	{boolean} the result
	*/
	JSM.Ray.prototype.IsLengthReached = function (length)
	{
		if (this.length === undefined || this.length === null) {
			return false;
		}
		return JSM.IsGreater (length, this.length);
	};

	/**
	* Function: Ray.Clone
	* Description: Clones the ray.
	* Returns:
	*	{Ray} a cloned instance
	*/
	JSM.Ray.prototype.Clone = function ()
	{
		return new JSM.Ray (this.origin.Clone (), this.direction.Clone (), this.length);
	};

	return JSM;
});

define('skylark-jsmodeler/geometry/path',["../core/jsm"],function(JSM){
	/**
	* Class: Path2D
	* Description: Helper class for building polygons
	* Parameters:
	*	settings {object} path settings
	*/
	JSM.Path2D = function (settings)
	{
		this.settings = {
			segmentation : 10,
			offset : new JSM.Vector2D (0.0, 0.0),
			scale : new JSM.Coord2D (1.0, 1.0)
		};
		JSM.CopyObjectProperties (settings, this.settings, true);
		
		this.position = new JSM.Coord2D (0.0, 0.0);
		this.positionAdded = false;
		this.polygons = [];
		this.currentPolygon = null;
	};

	/**
	* Function: Path2D.MoveTo
	* Description: Moves the current position to the given position.
	* Parameters:
	*	x {number} new x position
	*	y {number} new y position
	*/
	JSM.Path2D.prototype.MoveTo = function (x, y)
	{
		this.Close ();
		this.position.Set (x, y);
		this.positionAdded = false;
	};

	/**
	* Function: Path2D.LineTo
	* Description: Draws a line from current position to the given position.
	* Parameters:
	*	x {number} line end x position
	*	y {number} line end y position
	*/
	JSM.Path2D.prototype.LineTo = function (x, y)
	{
		if (!this.positionAdded) {
			this.AddPolygonPoint (this.position.x, this.position.y);
		}
		this.AddPolygonPoint (x, y);
	};

	/**
	* Function: Path2D.CubicBezierTo
	* Description: Draws a cubic bezier curve from the current position to the given position.
	* Parameters:
	*	x {number} curve end x position
	*	y {number} curve end y position
	*	cp1x {number} first control point x position
	*	cp1y {number} first control point y position
	*	cp2x {number} second control point x position
	*	cp2y {number} second control point y position
	*/
	JSM.Path2D.prototype.CubicBezierTo = function (x, y, cp1x, cp1y, cp2x, cp2y)
	{
		var bezierPoints = JSM.GenerateCubicBezierCurve (
			new JSM.Coord2D (this.position.x, this.position.y),
			new JSM.Coord2D (cp1x, cp1y),
			new JSM.Coord2D (cp2x, cp2y),
			new JSM.Coord2D (x, y),
			this.settings.segmentation
		);
		var i;
		for (i = 1; i < bezierPoints.length; i++) {
			this.LineTo (bezierPoints[i].x, bezierPoints[i].y);
		}
	};

	/**
	* Function: Path2D.Close
	* Description: Closes the current polygon.
	*/
	JSM.Path2D.prototype.Close = function ()
	{
		function CheckAndCorrectPolygon (polygon)
		{
			if (polygon.VertexCount () === 0) {
				return false;
			}
			if (polygon.GetVertex (0).IsEqual (polygon.GetVertex (polygon.VertexCount () - 1))) {
				polygon.RemoveVertex (polygon.VertexCount () - 1);
			}
			if (polygon.VertexCount () < 3) {
				return false;
			}
			return true;
		}
		
		function FindBasePolygon (polygons, polygon)
		{
			function IsBasePolygon (basePolygon, polygon)
			{
				baseOrientation = baseContour.GetOrientation ();
				polygonOrientation = polygon.GetOrientation ();
				if (baseOrientation !== polygonOrientation) {
					var firstVertex = polygon.GetVertex (0);
					var firstVertexPosition = baseContour.CoordPosition (firstVertex);
					if (firstVertexPosition == JSM.CoordPolygonPosition2D.Inside) {
						return true;
					}
				}
				return false;
			}
			
			var i, baseContour, baseOrientation, polygonOrientation;
			for (i = polygons.length - 1; i >= 0; i--) {
				baseContour = polygons[i].GetContour (0);
				if (IsBasePolygon (baseContour, polygon)) {
					return polygons[i];
				}
			}
			return null;
		}

		if (this.currentPolygon !== null) {
			if (CheckAndCorrectPolygon (this.currentPolygon)) {
				var basePolygon = FindBasePolygon (this.polygons, this.currentPolygon);
				if (basePolygon === null) {
					var contourPolygon = new JSM.ContourPolygon2D ();
					contourPolygon.AddContour (this.currentPolygon);
					this.polygons.push (contourPolygon);
				} else {
					basePolygon.AddContour (this.currentPolygon);
				}
			}
			this.currentPolygon = null;
		}
	};			

	/**
	* Function: Path2D.PolygonCount
	* Description: Returns the polygon count of the path.
	* Returns:
	*	{integer} the result
	*/
	JSM.Path2D.prototype.PolygonCount = function ()
	{
		return this.polygons.length;
	};

	/**
	* Function: Path2D.GetPolygon
	* Description: Returns the polygons from the path at the given index.
	* Parameters:
	*	index {integer} the polygon index
	* Returns:
	*	{ContourPolygon2D} the result
	*/
	JSM.Path2D.prototype.GetPolygon = function (index)
	{
		return this.polygons[index];
	};

	/**
	* Function: Path2D.GetPolygons
	* Description: Returns the polygons from the path.
	* Returns:
	*	{ContourPolygon2D[*]} the result
	*/
	JSM.Path2D.prototype.GetPolygons = function ()
	{
		return this.polygons;
	};

	/**
	* Function: Path2D.GetCurrentPolygon
	* Description: Returns the current polygon.
	* Returns:
	*	{Polygon2D} the result
	*/
	JSM.Path2D.prototype.GetCurrentPolygon = function ()
	{
		if (this.currentPolygon === null) {
			this.currentPolygon = new JSM.Polygon2D ();
		}
		return this.currentPolygon;
	};		

	/**
	* Function: Path2D.AddPolygonPoint
	* Description: Adds a point to the current polygon.
	* Parameters:
	*	x {number} the x position of the point
	*	y {number} the y position of the point
	*/
	JSM.Path2D.prototype.AddPolygonPoint = function (x, y)
	{
		var polygon = this.GetCurrentPolygon ();
		var polygonX = this.settings.offset.x + x * this.settings.scale.x;
		var polygonY = this.settings.offset.y + y * this.settings.scale.y;
		polygon.AddVertex (polygonX, polygonY);
		this.position.Set (x, y);
		this.positionAdded = true;
	};

	return JSM;
});

define('skylark-jsmodeler/modeler/color',["../core/jsm"],function(JSM){
	/**
	* Function: HexColorToRGBComponents
	* Description: Converts hex color strings to RGB components.
	* Parameters:
	*	hexColor {string} the hex color
	* Returns:
	*	{integer[3]} the RGB components
	*/
	JSM.HexColorToRGBComponents = function (hexColor)
	{
		var hexString = hexColor.toString (16);
		while (hexString.length < 6) {
			hexString = '0' + hexString;
		}
		var r = parseInt (hexString.substr (0, 2), 16);
		var g = parseInt (hexString.substr (2, 2), 16);
		var b = parseInt (hexString.substr (4, 2), 16);
		return [r, g, b];
	};

	/**
	* Function: HexColorToNormalizedRGBComponents
	* Description: Converts hex color strings to normalized (between 0.0 and 1.0) RGB components.
	* Parameters:
	*	hexColor {string} the hex color
	* Returns:
	*	{number[3]} the RGB components
	*/
	JSM.HexColorToNormalizedRGBComponents = function (hexColor)
	{
		var rgb = JSM.HexColorToRGBComponents (hexColor);
		return [rgb[0] / 255.0, rgb[1] / 255.0, rgb[2] / 255.0];
	};

	/**
	* Function: HexColorToRGBColor
	* Description: Converts hex color strings to RGB color.
	* Parameters:
	*	hexColor {string} the hex color string
	* Returns:
	*	{integer} the RGB value
	*/
	JSM.HexColorToRGBColor = function (hexColor)
	{
		var hexString = '0x' + hexColor;
		return parseInt (hexString, 16);
	};

	/**
	* Function: RGBComponentsToHexColor
	* Description: Converts RGB components to hex color.
	* Parameters:
	*	red {integer} the red component
	*	green {integer} the green component
	*	blue {integer} the blue component
	* Returns:
	*	{integer} the hex value
	*/
	JSM.RGBComponentsToHexColor = function (red, green, blue)
	{
		function IntegerToHex (intString)
		{
			var result = parseInt (intString, 10).toString (16);
			while (result.length < 2) {
				result = '0' + result;
			}
			return result;
		}
		var r = IntegerToHex (red);
		var g = IntegerToHex (green);
		var b = IntegerToHex (blue);
		var hexString = '0x' + r + g + b;
		return parseInt (hexString, 16);
	};

	return JSM;
});

define('skylark-jsmodeler/modeler/material',["../core/jsm"],function(JSM){
	/**
	* Class: Material
	* Description:
	*	Defines a material. The parameter structure can contain the following values:
	*	ambient, diffuse, specular, shininess, opacity, texture, textureWidth, textureHeight.
	* Parameters:
	*	parameters {object} parameters of the material
	*/
	JSM.Material = function (parameters)
	{
		this.ambient = 0x00cc00;
		this.diffuse = 0x00cc00;
		this.specular = 0x000000;
		this.shininess = 0.0;
		this.opacity = 1.0;
		this.reflection = 0.0;
		this.singleSided = false;
		this.pointSize = 0.1;
		this.texture = null;
		this.textureWidth = 1.0;
		this.textureHeight = 1.0;
		JSM.CopyObjectProperties (parameters, this, true);
	};

	return JSM;
});

define('skylark-jsmodeler/modeler/materialset',["../core/jsm"],function(JSM){
	/**
	* Class: MaterialSet
	* Description: Defines a material container.
	*/
	JSM.MaterialSet = function ()
	{
		this.materials = [];
		this.defaultMaterial = new JSM.Material ();
	};

	/**
	* Function: MaterialSet.AddMaterial
	* Description: Adds a material to the container.
	* Parameters:
	*	material {Material} the material
	* Returns:
	*	{integer} the index of the newly added material
	*/
	JSM.MaterialSet.prototype.AddMaterial = function (material)
	{
		this.materials.push (material);
		return this.materials.length - 1;
	};

	/**
	* Function: MaterialSet.GetMaterial
	* Description: Returns a material from the container.
	* Parameters:
	*	index {integer} the index
	* Returns:
	*	{Material} the result
	*/
	JSM.MaterialSet.prototype.GetMaterial = function (index)
	{
		if (index < 0 || index >= this.materials.length) {
			return this.defaultMaterial;
		}
		return this.materials[index];
	};

	/**
	* Function: MaterialSet.GetDefaultMaterial
	* Description: Returns the default material from the container. It is always exists.
	* Returns:
	*	{Material} the result
	*/
	JSM.MaterialSet.prototype.GetDefaultMaterial = function ()
	{
		return this.defaultMaterial;
	};

	/**
	* Function: MaterialSet.Count
	* Description: Returns the material count of the container.
	* Returns:
	*	{integer} the result
	*/
	JSM.MaterialSet.prototype.Count = function ()
	{
		return this.materials.length;
	};

	return JSM;
});

define('skylark-jsmodeler/modeler/body',["../core/jsm"],function(JSM){

	/**
	* Class: BodyVertex
	* Description:
	*	Represents a vertex of a 3D body. The vertex contains
	*	only its position as a 3D coordinate.
	* Parameters:
	*	position {Coord} the position
	*/
	JSM.BodyVertex = function (position)
	{
		this.position = position;
	};

	/**
	* Function: BodyVertex.GetPosition
	* Description: Returns the position of the vertex.
	* Returns:
	*	{Coord} the result
	*/
	JSM.BodyVertex.prototype.GetPosition = function ()
	{
		return this.position;
	};

	/**
	* Function: BodyVertex.SetPosition
	* Description: Sets the position of the vertex.
	* Parameters:
	*	position {Coord} the position
	*/
	JSM.BodyVertex.prototype.SetPosition = function (position)
	{
		this.position = position;
	};

	/**
	* Function: BodyVertex.Clone
	* Description: Clones the vertex.
	* Returns:
	*	{BodyVertex} the cloned instance
	*/
	JSM.BodyVertex.prototype.Clone = function ()
	{
		return new JSM.BodyVertex (this.position.Clone ());
	};

	/**
	* Class: BodyPoint
	* Description:
	*	Represents a point in a 3D body. The point contains the vertex index stored in its 3D body,
	*	and a material index of a material defined outside of the body.
	* Parameters:
	*	index {integer} the vertex index stored in the body
	*/
	JSM.BodyPoint = function (index)
	{
		this.vertex = index;
		this.material = -1;
	};

	/**
	* Function: BodyPoint.GetVertexIndex
	* Description: Returns the body vertex index of the point.
	* Returns:
	*	{integer} the stored vertex index
	*/
	JSM.BodyPoint.prototype.GetVertexIndex = function ()
	{
		return this.vertex;
	};

	/**
	* Function: BodyPoint.SetVertexIndex
	* Description: Sets the vertex index of the point.
	* Parameters:
	*	index {integer} the vertex index
	*/
	JSM.BodyPoint.prototype.SetVertexIndex = function (index)
	{
		this.vertex = index;
	};

	/**
	* Function: BodyPoint.HasMaterialIndex
	* Description: Returns if the point has a material index.
	* Returns:
	*	{boolean} the result
	*/
	JSM.BodyPoint.prototype.HasMaterialIndex = function ()
	{
		return this.material !== -1;
	};

	/**
	* Function: BodyPoint.GetMaterialIndex
	* Description: Returns the point material index.
	* Returns:
	*	{integer} the result
	*/
	JSM.BodyPoint.prototype.GetMaterialIndex = function ()
	{
		return this.material;
	};

	/**
	* Function: BodyPoint.SetMaterialIndex
	* Description: Sets the point material index.
	* Parameters:
	*	material {integer} the material index
	*/
	JSM.BodyPoint.prototype.SetMaterialIndex = function (material)
	{
		this.material = material;
	};

	/**
	* Function: BodyPoint.InheritAttributes
	* Description: Inherits attributes (material) from an another point.
	* Parameters:
	*	source {BodyPoint} the source point
	*/
	JSM.BodyPoint.prototype.InheritAttributes = function (source)
	{
		this.material = source.material;
	};

	/**
	* Function: BodyPoint.Clone
	* Description: Clones the point.
	* Returns:
	*	{BodyPoint} the cloned instance
	*/
	JSM.BodyPoint.prototype.Clone = function ()
	{
		var result = new JSM.BodyPoint (this.vertex);
		result.material = this.material;
		return result;
	};

	/**
	* Class: BodyLine
	* Description:
	*	Represents a line in a 3D body. The line contains begin and end indices of vertices
	*	stored in its 3D body, and a material index of a material defined outside of the body.
	* Parameters:
	*	beg {integer} begin vertex index stored in the body
	*	end {integer} end vertex index stored in the body
	*/
	JSM.BodyLine = function (beg, end)	{
		this.beg = beg;
		this.end = end;
		this.material = -1;
	};

	/**
	* Function: BodyLine.GetBegVertexIndex
	* Description: Returns the body vertex index at the beginning of the line.
	* Returns:
	*	{integer} the stored vertex index
	*/
	JSM.BodyLine.prototype.GetBegVertexIndex = function ()	{
		return this.beg;
	};

	/**
	* Function: BodyLine.SetBegVertexIndex
	* Description: Sets the begin vertex index of the line.
	* Parameters:
	*	index {integer} the vertex index
	*/
	JSM.BodyLine.prototype.SetBegVertexIndex = function (index)	{
		this.beg = index;
	};

	/**
	* Function: BodyLine.GetEndVertexIndex
	* Description: Returns the body vertex index at the end of the line.
	* Returns:
	*	{integer} the stored vertex index
	*/
	JSM.BodyLine.prototype.GetEndVertexIndex = function ()	{
		return this.end;
	};

	/**
	* Function: BodyLine.SetEndVertexIndex
	* Description: Sets the end vertex index of the line.
	* Parameters:
	*	index {integer} the vertex index
	*/
	JSM.BodyLine.prototype.SetEndVertexIndex = function (index)	{
		this.end = index;
	};

	/**
	* Function: BodyLine.HasMaterialIndex
	* Description: Returns if the line has a material index.
	* Returns:
	*	{boolean} the result
	*/
	JSM.BodyLine.prototype.HasMaterialIndex = function (){
		return this.material !== -1;
	};

	/**
	* Function: BodyLine.GetMaterialIndex
	* Description: Returns the line material index.
	* Returns:
	*	{integer} the result
	*/
	JSM.BodyLine.prototype.GetMaterialIndex = function (){
		return this.material;
	};

	/**
	* Function: BodyLine.SetMaterialIndex
	* Description: Sets the line material index.
	* Parameters:
	*	material {integer} the material index
	*/
	JSM.BodyLine.prototype.SetMaterialIndex = function (material){
		this.material = material;
	};

	/**
	* Function: BodyLine.InheritAttributes
	* Description: Inherits attributes (material) from an another line.
	* Parameters:
	*	source {BodyLine} the source line
	*/
	JSM.BodyLine.prototype.InheritAttributes = function (source)
	{
		this.material = source.material;
	};

	/**
	* Function: BodyLine.Clone
	* Description: Clones the line.
	* Returns:
	*	{BodyLine} the cloned instance
	*/
	JSM.BodyLine.prototype.Clone = function ()
	{
		var result = new JSM.BodyLine (this.beg, this.end);
		result.material = this.material;
		return result;
	};

	/**
	* Class: BodyPolygon
	* Description:
	*	Represents a polygon in a 3D body. The polygon contains indices of vertices stored in its body.
	*	It also contains a material index of a material defined outside of the body, and a curve
	*	group index which defines its normal vector calculation in case of smooth surfaces.
	* Parameters:
	*	vertices {integer[*]} array of vertex indices stored in the body
	*/
	JSM.BodyPolygon = function (vertices)
	{
		this.vertices = vertices;
		this.material = -1;
		this.curved = -1;
	};

	/**
	* Function: BodyPolygon.AddVertexIndex
	* Description: Adds a vertex index to the polygon.
	* Parameters:
	*	index {integer} the vertex index
	*/
	JSM.BodyPolygon.prototype.AddVertexIndex = function (index)
	{
		this.vertices.push (index);
	};

	/**
	* Function: BodyPolygon.InsertVertexIndex
	* Description: Inserts a vertex index to given index in the polygon.
	* Parameters:
	*	vertexIndex {integer} the vertex index
	*	polygonIndex {integer} the index in the polygon
	*/
	JSM.BodyPolygon.prototype.InsertVertexIndex = function (vertexIndex, polygonIndex)
	{
		this.vertices.splice (polygonIndex, 0, vertexIndex);
	};

	/**
	* Function: BodyPolygon.GetVertexIndex
	* Description: Returns the body vertex index at the given polygon vertex index.
	* Parameters:
	*	index {integer} the polygon vertex index
	* Returns:
	*	{integer} the stored vertex index
	*/
	JSM.BodyPolygon.prototype.GetVertexIndex = function (index)
	{
		return this.vertices[index];
	};

	/**
	* Function: BodyPolygon.SetVertexIndex
	* Description: Sets the body vertex index at the given polygon vertex index.
	* Parameters:
	*	index {integer} the polygon vertex index
	*	vertIndex {integer} the body vertex index
	*/
	JSM.BodyPolygon.prototype.SetVertexIndex = function (index, vertIndex)
	{
		this.vertices[index] = vertIndex;
	};

	/**
	* Function: BodyPolygon.GetVertexIndices
	* Description: Returns an array of the body vertex indices in the polygon.
	* Returns:
	*	{integer[]} the stored vertex indices
	*/
	JSM.BodyPolygon.prototype.GetVertexIndices = function ()
	{
		return this.vertices;
	};

	/**
	* Function: BodyPolygon.SetVertexIndices
	* Description: Sets the vertex indices in the polygon.
	* Parameters:
	*	vertices {integer[]} the new vertex indices
	*/
	JSM.BodyPolygon.prototype.SetVertexIndices = function (vertices)
	{
		this.vertices = vertices;
	};

	/**
	* Function: BodyPolygon.VertexIndexCount
	* Description: Returns the vertex count of the polygon.
	* Returns:
	*	{integer} the result
	*/
	JSM.BodyPolygon.prototype.VertexIndexCount = function ()
	{
		return this.vertices.length;
	};

	/**
	* Function: BodyPolygon.HasMaterialIndex
	* Description: Returns if the polygon has a material index.
	* Returns:
	*	{boolean} the result
	*/
	JSM.BodyPolygon.prototype.HasMaterialIndex = function ()
	{
		return this.material !== -1;
	};

	/**
	* Function: BodyPolygon.GetMaterialIndex
	* Description: Returns the polygons material index.
	* Returns:
	*	{integer} the result
	*/
	JSM.BodyPolygon.prototype.GetMaterialIndex = function ()
	{
		return this.material;
	};

	/**
	* Function: BodyPolygon.SetMaterialIndex
	* Description: Sets the polygons material index.
	* Parameters:
	*	material {integer} the material index
	*/
	JSM.BodyPolygon.prototype.SetMaterialIndex = function (material)
	{
		this.material = material;
	};

	/**
	* Function: BodyPolygon.HasCurveGroup
	* Description: Returns if the polygon has a curve group index.
	* Returns:
	*	{boolean} the result
	*/
	JSM.BodyPolygon.prototype.HasCurveGroup = function ()
	{
		return this.curved !== -1;
	};

	/**
	* Function: BodyPolygon.GetCurveGroup
	* Description: Returns the polygons curve group index.
	* Returns:
	*	{integer} the result
	*/
	JSM.BodyPolygon.prototype.GetCurveGroup = function ()
	{
		return this.curved;
	};

	/**
	* Function: BodyPolygon.SetCurveGroup
	* Description: Sets the polygons curve group index.
	* Parameters:
	*	group {integer} the curve group index
	*/
	JSM.BodyPolygon.prototype.SetCurveGroup = function (group)
	{
		this.curved = group;
	};

	/**
	* Function: BodyPolygon.ReverseVertexIndices
	* Description: Reverses the order of vertex indices in the polygon.
	*/
	JSM.BodyPolygon.prototype.ReverseVertexIndices = function ()
	{
		this.vertices.reverse ();
	};

	/**
	* Function: BodyPolygon.InheritAttributes
	* Description: Inherits attributes (material and curve group index) from an another polygon.
	* Parameters:
	*	source {BodyPolygon} the source polygon
	*/
	JSM.BodyPolygon.prototype.InheritAttributes = function (source)
	{
		this.material = source.material;
		this.curved = source.curved;
	};

	/**
	* Function: BodyPolygon.Clone
	* Description: Clones the polygon.
	* Returns:
	*	{BodyPolygon} the cloned instance
	*/
	JSM.BodyPolygon.prototype.Clone = function ()
	{
		var result = new JSM.BodyPolygon ([]);
		var i;
		for (i = 0; i < this.vertices.length; i++) {
			result.vertices.push (this.vertices[i]);
		}
		result.material = this.material;
		result.curved = this.curved;
		return result;
	};

	/**
	* Enum: TextureProjectionType
	* Description: Texture projection type.
	* Values:
	*	{Planar} planar projection
	*	{Cubic} cubic projection
	*	{Cylindrical} cylindrical projection
	*/
	JSM.TextureProjectionType = {
		Planar : 0,
		Cubic : 1,
		Cylindrical : 2
	};

	/**
	* Class: BodyTextureProjection
	* Description:
	*	Represents the texture projection of the body. It contains a projection type,
	*	and a coordinate system for projection.
	*/
	JSM.BodyTextureProjection = function ()
	{
		this.type = null;
		this.coords = null;
		this.SetCubic (new JSM.Coord (0.0, 0.0, 0.0), new JSM.Coord (1.0, 0.0, 0.0), new JSM.Coord (0.0, 1.0, 0.0), new JSM.Coord (0.0, 0.0, 1.0));
	};

	/**
	* Function: BodyTextureProjection.GetType
	* Description: Returns the texture projection type.
	* Returns:
	*	{TextureProjectionType} the result
	*/
	JSM.BodyTextureProjection.prototype.GetType = function ()
	{
		return this.type;
	};

	/**
	* Function: BodyTextureProjection.GetCoords
	* Description: Returns the texture projection coordinate system.
	* Returns:
	*	{CoordSystem} the result
	*/
	JSM.BodyTextureProjection.prototype.GetCoords = function ()
	{
		return this.coords;
	};

	/**
	* Function: BodyTextureProjection.SetType
	* Description: Sets the texture projection type.
	* Parameters:
	*	type {TextureProjectionType} the type
	*/
	JSM.BodyTextureProjection.prototype.SetType = function (type)
	{
		this.type = type;
	};

	/**
	* Function: BodyTextureProjection.SetCoords
	* Description: Sets the texture projection coordinates.
	* Parameters:
	*	coords {CoordSystem} the coordinates
	*/
	JSM.BodyTextureProjection.prototype.SetCoords = function (coords)
	{
		this.coords = coords;
	};

	/**
	* Function: BodyTextureProjection.SetPlanar
	* Description: Sets the texture projection to planar with the given parameters.
	* Parameters:
	*	origo {Coord} origo of the projection
	*	xDirection {Vector} x direction of the projection plane
	*	yDirection {Vector} y direction of the projection plane
	*/
	JSM.BodyTextureProjection.prototype.SetPlanar = function (origo, xDirection, yDirection)
	{
		this.type = JSM.TextureProjectionType.Planar;
		this.coords = new JSM.CoordSystem (
			origo,
			xDirection,
			yDirection,
			new JSM.Coord (0.0, 0.0, 0.0)
		);
	};

	/**
	* Function: BodyTextureProjection.SetCubic
	* Description: Sets the texture projection to cubic with the given parameters.
	* Parameters:
	*	origo {Coord} origo of the projection
	*	xDirection {Vector} x direction (edge of the cube) of the projection
	*	yDirection {Vector} y direction (edge of the cube) of the projection
	*	zDirection {Vector} z direction (edge of the cube) of the projection
	*/
	JSM.BodyTextureProjection.prototype.SetCubic = function (origo, xDirection, yDirection, zDirection)
	{
		this.type = JSM.TextureProjectionType.Cubic;
		this.coords = new JSM.CoordSystem (
			origo,
			xDirection,
			yDirection,
			zDirection
		);
	};

	/**
	* Function: BodyTextureProjection.SetCylindrical
	* Description: Sets the texture projection to cylindrical with the given parameters.
	* Parameters:
	*	origo {Coord} origo of the projection
	*	radius {number} radius of the cylinder
	*	xDirection {Vector} x direction (start point along perimeter) of the projection
	*	zDirection {Vector} z direction (normal vector) of the projection
	*/
	JSM.BodyTextureProjection.prototype.SetCylindrical = function (origo, radius, xDirection, zDirection)
	{
		this.type = JSM.TextureProjectionType.Cylindrical;
		this.coords = new JSM.CoordSystem (
			origo,
			xDirection.Clone ().SetLength (radius),
			JSM.VectorCross (zDirection, xDirection).SetLength (radius),
			zDirection
		);
	};

	/**
	* Function: BodyTextureProjection.Transform
	* Description: Transforms the texture projection coordinate system.
	* Parameters:
	*	transformation {Transformation} the transformation
	*/
	JSM.BodyTextureProjection.prototype.Transform = function (transformation)
	{
		this.coords.ToAbsoluteCoords ();
		this.coords.origo = transformation.Apply (this.coords.origo);
		this.coords.e1 = transformation.Apply (this.coords.e1);
		this.coords.e2 = transformation.Apply (this.coords.e2);
		this.coords.e3 = transformation.Apply (this.coords.e3);
		this.coords.ToDirectionVectors ();
	};

	/**
	* Function: BodyTextureProjection.Clone
	* Description: Clones the texture projection.
	* Returns:
	*	{BodyTextureProjection} the cloned instance
	*/
	JSM.BodyTextureProjection.prototype.Clone = function ()
	{
		var result = new JSM.BodyTextureProjection ();
		result.SetType (this.type);
		result.SetCoords (this.coords.Clone ());
		return result;
	};

	/**
	* Class: Body
	* Description:
	*	Represents a 3D body. The body contains vertices, polygons,
	*	and a texture coordinate system.
	*/
	JSM.Body = function ()
	{
		this.Clear ();
	};

	/**
	* Function: Body.AddVertex
	* Description: Adds a vertex to the body.
	* Parameters:
	*	vertex {BodyVertex} the vertex
	* Returns:
	*	{integer} the index of the newly added vertex
	*/
	JSM.Body.prototype.AddVertex = function (vertex)
	{
		this.vertices.push (vertex);
		return this.vertices.length - 1;
	};

	/**
	* Function: Body.AddPoint
	* Description: Adds a point to the body.
	* Parameters:
	*	point {BodyPoint} the point
	* Returns:
	*	{integer} the index of the newly added point
	*/
	JSM.Body.prototype.AddPoint = function (point)
	{
		this.points.push (point);
		return this.points.length - 1;
	};

	/**
	* Function: Body.AddLine
	* Description: Adds a line to the body.
	* Parameters:
	*	line {BodyLine} the line
	* Returns:
	*	{integer} the index of the newly added line
	*/
	JSM.Body.prototype.AddLine = function (line)
	{
		this.lines.push (line);
		return this.lines.length - 1;
	};

	/**
	* Function: Body.AddPolygon
	* Description: Adds a polygon to the body.
	* Parameters:
	*	polygon {BodyPolygon} the polygon
	* Returns:
	*	{integer} the index of the newly added polygon
	*/
	JSM.Body.prototype.AddPolygon = function (polygon)
	{
		this.polygons.push (polygon);
		return this.polygons.length - 1;
	};

	/**
	* Function: Body.GetVertex
	* Description: Returns the vertex at the given index.
	* Parameters:
	*	index {integer} the vertex index
	* Returns:
	*	{BodyVertex} the result
	*/
	JSM.Body.prototype.GetVertex = function (index)
	{
		return this.vertices[index];
	};

	/**
	* Function: Body.GetVertexPosition
	* Description: Returns the position of the vertex at the given index.
	* Parameters:
	*	index {integer} the vertex index
	* Returns:
	*	{Coord} the result
	*/
	JSM.Body.prototype.GetVertexPosition = function (index)
	{
		return this.vertices[index].position;
	};

	/**
	* Function: Body.SetVertexPosition
	* Description: Sets the position of the vertex at the given index.
	* Parameters:
	*	index {integer} the vertex index
	*	position {Coord} the new position
	*/
	JSM.Body.prototype.SetVertexPosition = function (index, position)
	{
		this.vertices[index].position = position;
	};

	/**
	* Function: Body.GetPoint
	* Description: Returns the point at the given index.
	* Parameters:
	*	index {integer} the point index
	* Returns:
	*	{BodyPoint} the result
	*/
	JSM.Body.prototype.GetPoint = function (index)
	{
		return this.points[index];
	};

	/**
	* Function: Body.GetLine
	* Description: Returns the line at the given index.
	* Parameters:
	*	index {integer} the line index
	* Returns:
	*	{BodyLine} the result
	*/
	JSM.Body.prototype.GetLine = function (index)
	{
		return this.lines[index];
	};

	/**
	* Function: Body.GetPolygon
	* Description: Returns the polygon at the given index.
	* Parameters:
	*	index {integer} the polygon index
	* Returns:
	*	{BodyPolygon} the result
	*/
	JSM.Body.prototype.GetPolygon = function (index)
	{
		return this.polygons[index];
	};

	/**
	* Function: Body.SetPointsMaterialIndex
	* Description: Sets the material index for all points in the body.
	* Parameters:
	*	material {integer} the material index
	*/
	JSM.Body.prototype.SetPointsMaterialIndex = function (material)
	{
		var i;
		for (i = 0; i < this.points.length; i++) {
			this.points[i].SetMaterialIndex (material);
		}
	};

	/**
	* Function: Body.SetLinesMaterialIndex
	* Description: Sets the material index for all lines in the body.
	* Parameters:
	*	material {integer} the material index
	*/
	JSM.Body.prototype.SetLinesMaterialIndex = function (material)
	{
		var i;
		for (i = 0; i < this.lines.length; i++) {
			this.lines[i].SetMaterialIndex (material);
		}
	};

	/**
	* Function: Body.SetPolygonsMaterialIndex
	* Description: Sets the material index for all polygons in the body.
	* Parameters:
	*	material {integer} the material index
	*/
	JSM.Body.prototype.SetPolygonsMaterialIndex = function (material)
	{
		var i;
		for (i = 0; i < this.polygons.length; i++) {
			this.polygons[i].SetMaterialIndex (material);
		}
	};

	/**
	* Function: Body.SetPolygonsCurveGroup
	* Description: Sets the curve group index for all polygons in the body.
	* Parameters:
	*	group {integer} the curve group index
	*/
	JSM.Body.prototype.SetPolygonsCurveGroup = function (group)
	{
		var i;
		for (i = 0; i < this.polygons.length; i++) {
			this.polygons[i].SetCurveGroup (group);
		}
	};

	/**
	* Function: Body.RemoveVertex
	* Description: Removes a vertex from the body. It also removes connected polygons.
	* Parameters:
	*	index {integer} the index of the vertex
	*/
	JSM.Body.prototype.RemoveVertex = function (index)
	{
		var pointsToDelete = [];
		var linesToDelete = [];
		var polygonsToDelete = [];
		var i, j, point, line, polygon, bodyVertIndex;
		for (i = 0; i < this.points.length; i++) {
			point = this.points[i];
			if (point.GetVertexIndex () == index) {
				pointsToDelete.push (i);
			} else if (point.GetVertexIndex () >= index) {
				point.SetVertexIndex (point.GetVertexIndex () - 1);
			}
		}
		for (i = 0; i < this.lines.length; i++) {
			line = this.lines[i];
			if (line.GetBegVertexIndex () == index || line.GetEndVertexIndex () == index) {
				linesToDelete.push (i);
			} else {
				if (line.GetBegVertexIndex () >= index) {
					line.SetBegVertexIndex (line.GetBegVertexIndex () - 1);
				}
				if (line.GetEndVertexIndex () >= index) {
					line.SetEndVertexIndex (line.GetEndVertexIndex () - 1);
				}
			}
		}
		for (i = 0; i < this.polygons.length; i++) {
			polygon = this.polygons[i];
			for (j = 0; j < polygon.VertexIndexCount (); j++) {
				bodyVertIndex = polygon.GetVertexIndex (j);
				if (polygon.GetVertexIndex (j) == index) {
					polygonsToDelete.push (i);
					break;
				} else if (bodyVertIndex >= index) {
					polygon.SetVertexIndex (j, bodyVertIndex - 1);
				}
			}
		}
		for (i = 0; i < pointsToDelete.length; i++) {
			this.RemovePoint (pointsToDelete[i] - i);
		}
		for (i = 0; i < linesToDelete.length; i++) {
			this.RemoveLine (linesToDelete[i] - i);
		}
		for (i = 0; i < polygonsToDelete.length; i++) {
			this.RemovePolygon (polygonsToDelete[i] - i);
		}
		this.vertices.splice (index, 1);
	};

	/**
	* Function: Body.RemovePoint
	* Description: Removes a point from the body.
	* Parameters:
	*	index {integer} the index of the point
	*/
	JSM.Body.prototype.RemovePoint = function (index)
	{
		this.points.splice (index, 1);
	};

	/**
	* Function: Body.RemoveLine
	* Description: Removes a line from the body.
	* Parameters:
	*	index {integer} the index of the line
	*/
	JSM.Body.prototype.RemoveLine = function (index)
	{
		this.lines.splice (index, 1);
	};

	/**
	* Function: Body.RemovePolygon
	* Description: Removes a polygon from the body.
	* Parameters:
	*	index {integer} the index of the polygon
	*/
	JSM.Body.prototype.RemovePolygon = function (index)
	{
		this.polygons.splice (index, 1);
	};

	/**
	* Function: Body.VertexCount
	* Description: Returns the vertex count of the body.
	* Returns:
	*	{integer} the result
	*/
	JSM.Body.prototype.VertexCount = function ()
	{
		return this.vertices.length;
	};

	/**
	* Function: Body.PointCount
	* Description: Returns the point count of the body.
	* Returns:
	*	{integer} the result
	*/
	JSM.Body.prototype.PointCount = function ()
	{
		return this.points.length;
	};

	/**
	* Function: Body.LineCount
	* Description: Returns the line count of the body.
	* Returns:
	*	{integer} the result
	*/
	JSM.Body.prototype.LineCount = function ()
	{
		return this.lines.length;
	};

	/**
	* Function: Body.PolygonCount
	* Description: Returns the polygon count of the body.
	* Returns:
	*	{integer} the result
	*/
	JSM.Body.prototype.PolygonCount = function ()
	{
		return this.polygons.length;
	};

	/**
	* Function: Body.GetTextureProjection
	* Description: Returns the texture projection of the body.
	* Returns:
	*	{BodyTextureProjection} the result
	*/
	JSM.Body.prototype.GetTextureProjection = function ()
	{
		return this.projection;
	};

	/**
	* Function: Body.SetTextureProjection
	* Description: Sets the texture projection of the body.
	* Parameters:
	*	projection {BodyTextureProjection} the new texture projection
	*/
	JSM.Body.prototype.SetTextureProjection = function (projection)
	{
		this.projection = projection;
	};

	/**
	* Function: Body.SetPlanarTextureProjection
	* Description: Sets the texture projection to planar with the given parameters.
	* Parameters:
	*	origo {Coord} origo of the projection
	*	xDirection {Vector} x direction of the projection plane
	*	yDirection {Vector} y direction of the projection plane
	*/
	JSM.Body.prototype.SetPlanarTextureProjection = function (origo, xDirection, yDirection)
	{
		this.projection.SetPlanar (origo, xDirection, yDirection);
	};

	/**
	* Function: Body.SetCubicTextureProjection
	* Description: Sets the texture projection to cubic with the given parameters.
	* Parameters:
	*	origo {Coord} origo of the projection
	*	xDirection {Vector} x direction (edge of the cube) of the projection
	*	yDirection {Vector} y direction (edge of the cube) of the projection
	*	zDirection {Vector} z direction (edge of the cube) of the projection
	*/
	JSM.Body.prototype.SetCubicTextureProjection = function (origo, xDirection, yDirection, zDirection)
	{
		this.projection.SetCubic (origo, xDirection, yDirection, zDirection);
	};

	/**
	* Function: Body.SetCylindricalTextureProjection
	* Description: Sets the texture projection to cylindrical with the given parameters.
	* Parameters:
	*	origo {Coord} origo of the projection
	*	radius {number} radius of the cylinder
	*	xDirection {Vector} x direction (start point along perimeter) of the projection
	*	zDirection {Vector} z direction (normal vector) of the projection
	*/
	JSM.Body.prototype.SetCylindricalTextureProjection = function (origo, radius, xDirection, zDirection)
	{
		this.projection.SetCylindrical (origo, radius, xDirection, zDirection);
	};

	/**
	* Function: Body.Transform
	* Description: Transforms the body.
	* Parameters:
	*	transformation {Transformation} the transformation
	*/
	JSM.Body.prototype.Transform = function (transformation)
	{
		var i;
		for (i = 0; i < this.vertices.length; i++) {
			this.vertices[i].position = transformation.Apply (this.vertices[i].position);
		}
		this.projection.Transform (transformation);
	};

	/**
	* Function: Body.GetBoundingBox
	* Description: Returns the bounding box of the body.
	* Returns:
	*	{Box} the result
	*/
	JSM.Body.prototype.GetBoundingBox = function ()
	{
		var min = new JSM.Coord (JSM.Inf, JSM.Inf, JSM.Inf);
		var max = new JSM.Coord (-JSM.Inf, -JSM.Inf, -JSM.Inf);

		var i, coord;
		for (i = 0; i < this.vertices.length; i++) {
			coord = this.vertices[i].position;
			min.x = JSM.Minimum (min.x, coord.x);
			min.y = JSM.Minimum (min.y, coord.y);
			min.z = JSM.Minimum (min.z, coord.z);
			max.x = JSM.Maximum (max.x, coord.x);
			max.y = JSM.Maximum (max.y, coord.y);
			max.z = JSM.Maximum (max.z, coord.z);
		}
		
		return new JSM.Box (min, max);
	};

	/**
	* Function: Body.GetCenter
	* Description: Returns the center of the bounding box of the body.
	* Returns:
	*	{Coord} the result
	*/
	JSM.Body.prototype.GetCenter = function ()
	{
		var boundingBox = this.GetBoundingBox ();
		return boundingBox.GetCenter ();
	};

	/**
	* Function: Body.GetBoundingSphere
	* Description: Returns the bounding sphere of the body.
	* Returns:
	*	{Sphere} the result
	*/
	JSM.Body.prototype.GetBoundingSphere = function ()
	{
		var center = this.GetCenter ();
		var radius = 0.0;
		
		var i, current;
		for (i = 0; i < this.vertices.length; i++) {
			current = center.DistanceTo (this.vertices[i].position);
			if (JSM.IsGreater (current, radius)) {
				radius = current;
			}
		}
		
		var result = new JSM.Sphere (center, radius);
		return result;
	};

	/**
	* Function: Body.OffsetToOrigo
	* Description: Offsets the body to the origo.
	*/
	JSM.Body.prototype.OffsetToOrigo = function ()
	{
		var center = this.GetCenter ().Clone ();
		center.MultiplyScalar (-1.0);

		var i;
		for (i = 0; i < this.vertices.length; i++) {
			this.vertices[i].position = JSM.CoordAdd (this.vertices[i].position, center);
		}
	};

	/**
	* Function: Body.Merge
	* Description: Merges an existing body to the body.
	* Parameters:
	*	body {Body} the body to merge
	*/
	JSM.Body.prototype.Merge = function (body)
	{
		var oldVertexCount = this.vertices.length;
		
		var i, j;
		for (i = 0; i < body.VertexCount (); i++) {
			this.vertices.push (body.GetVertex (i).Clone ());
		}
		
		var newPoint;
		for (i = 0; i < body.PointCount (); i++) {
			newPoint = body.GetPoint (i).Clone ();
			newPoint.SetVertexIndex (newPoint.GetVertexIndex () + oldVertexCount);
			this.points.push (newPoint);
		}	
		
		var newLine;
		for (i = 0; i < body.LineCount (); i++) {
			newLine = body.GetLine (i).Clone ();
			newLine.SetBegVertexIndex (newLine.GetBegVertexIndex () + oldVertexCount);
			newLine.SetEndVertexIndex (newLine.GetEndVertexIndex () + oldVertexCount);
			this.lines.push (newLine);
		}

		var newPolygon;
		for (i = 0; i < body.PolygonCount (); i++) {
			newPolygon = body.GetPolygon (i).Clone ();
			for (j = 0; j < newPolygon.VertexIndexCount (); j++) {
				newPolygon.vertices[j] += oldVertexCount;
			}
			this.polygons.push (newPolygon);
		}
	};

	/**
	* Function: Body.Clear
	* Description: Makes the body empty.
	*/
	JSM.Body.prototype.Clear = function ()
	{
		this.vertices = [];
		this.points = [];
		this.lines = [];
		this.polygons = [];
		this.projection = new JSM.BodyTextureProjection ();
	};

	/**
	* Function: Body.Clone
	* Description: Clones the body.
	* Returns:
	*	{Body} the cloned instance
	*/
	JSM.Body.prototype.Clone = function ()
	{
		var result = new JSM.Body ();
		
		var i;
		for (i = 0; i < this.vertices.length; i++) {
			result.AddVertex (this.vertices[i].Clone ());
		}
		
		for (i = 0; i < this.points.length; i++) {
			result.AddPoint (this.points[i].Clone ());
		}

		for (i = 0; i < this.lines.length; i++) {
			result.AddLine (this.lines[i].Clone ());
		}

		for (i = 0; i < this.polygons.length; i++) {
			result.AddPolygon (this.polygons[i].Clone ());
		}

		result.SetTextureProjection (this.projection.Clone ());
		return result;
	};

	return JSM;
});

define('skylark-jsmodeler/modeler/model',["../core/jsm"],function(JSM){
	/**
	* Class: Model
	* Description: Represents a 3D model. The model contains bodies.
	*/
	JSM.Model = function ()
	{
		this.bodies = [];
		this.materials = new JSM.MaterialSet ();
	};

	/**
	* Function: Model.AddBody
	* Description: Adds a body to the model.
	* Parameters:
	*	body {Body} the body
	* Returns:
	*	{integer} the index of the newly added body
	*/
	JSM.Model.prototype.AddBody = function (body)
	{
		this.bodies.push (body);
		return this.bodies.length - 1;
	};

	/**
	* Function: Model.AddBodies
	* Description: Adds bodies to the model.
	* Parameters:
	*	bodies {Body[*]} the body
	*/
	JSM.Model.prototype.AddBodies = function (bodies)
	{
		var i, body;
		for (i = 0; i < bodies.length; i++) {
			body = bodies[i];
			this.AddBody (body);
		}
	};

	/**
	* Function: Model.GetBody
	* Description: Returns the stored body with the given index.
	* Parameters:
	*	index {integer} the index of the body
	* Returns:
	*	{Body} the result
	*/
	JSM.Model.prototype.GetBody = function (index)
	{
		return this.bodies[index];
	};

	/**
	* Function: Model.BodyCount
	* Description: Returns the body count of the model.
	* Returns:
	*	{integer} the result
	*/
	JSM.Model.prototype.BodyCount = function ()
	{
		return this.bodies.length;
	};

	/**
	* Function: Model.AddMaterial
	* Description: Adds a material to the mode.
	* Parameters:
	*	material {Material} the material
	* Returns:
	*	{integer} the index of the newly added material
	*/
	JSM.Model.prototype.AddMaterial = function (material)
	{
		return this.materials.AddMaterial (material);
	};

	/**
	* Function: Model.GetMaterial
	* Description: Returns a material from the model.
	* Parameters:
	*	index {integer} the index
	* Returns:
	*	{Material} the result
	*/
	JSM.Model.prototype.GetMaterial = function (index)
	{
		return this.materials.GetMaterial (index);
	};

	/**
	* Function: Model.GetDefaultMaterial
	* Description: Returns the default material from the model. It is always exists.
	* Returns:
	*	{Material} the result
	*/
	JSM.Model.prototype.GetDefaultMaterial = function ()
	{
		return this.materials.GetDefaultMaterial ();
	};

	/**
	* Function: Model.GetMaterialSet
	* Description: Returns the material set of the model.
	* Returns:
	*	{MaterialSet} the result
	*/
	JSM.Model.prototype.GetMaterialSet = function ()
	{
		return this.materials;
	};

	/**
	* Function: Model.Count
	* Description: Returns the material count of the model.
	* Returns:
	*	{integer} the result
	*/
	JSM.Model.prototype.MaterialCount = function ()
	{
		return this.materials.Count ();
	};

	/**
	* Function: Model.VertexCount
	* Description: Returns the vertex count of the model.
	* Returns:
	*	{integer} the result
	*/
	JSM.Model.prototype.VertexCount = function ()
	{
		var count = 0;
		var i;
		for (i = 0; i < this.bodies.length; i++) {
			count += this.bodies[i].VertexCount ();
		}
		return count;
	};

	/**
	* Function: Model.PolygonCount
	* Description: Returns the polygon count of the model.
	* Returns:
	*	{integer} the result
	*/
	JSM.Model.prototype.PolygonCount = function ()
	{
		var count = 0;
		var i;
		for (i = 0; i < this.bodies.length; i++) {
			count += this.bodies[i].PolygonCount ();
		}
		return count;
	};

	return JSM;
});

define('skylark-jsmodeler/modeler/adjacencyinfo',["../core/jsm"],function(JSM){

	/**
	* Class: VertInfo
	* Description:
	*	Contains adjacency information for a body vertex. Contains arrays
	*	with indices of connected edge and polygon info.
	*/
	JSM.VertInfo = function ()
	{
		this.edges = [];
		this.pgons = [];
	};

	/**
	* Class: EdgeInfo
	* Description:
	*	Contains adjacency information for a body edge. Contains indices
	*	of connected vertex and polygon info.
	*/
	JSM.EdgeInfo = function ()
	{
		this.vert1 = -1;
		this.vert2 = -1;
		this.pgon1 = -1;
		this.pgon2 = -1;
	};

	/**
	* Class: PolyEdgeInfo
	* Description:
	*	Contains adjacency information for a body polygon edge. Contains an index
	*	of an existing edge, and a flag which defines its direction.
	*/
	JSM.PolyEdgeInfo = function ()
	{
		this.index = -1;
		this.reverse = false;
	};

	/**
	* Class: PgonInfo
	* Description:
	*	Contains adjacency information for a body polygon. Contains arrays
	*	with indices of connected vertex and poly edge info.
	*/
	JSM.PgonInfo = function ()
	{
		this.verts = [];
		this.pedges = [];
	};

	/**
	* Class: AdjacencyInfo
	* Description:
	*	Contains adjacency information for a body. Contains arrays
	*	with vertex, edge and polygon info.
	* Parameters:
	*	body {Body} the body
	*/
	JSM.AdjacencyInfo = function (body)
	{
		this.verts = null;
		this.edges = null;
		this.pgons = null;
		this.Calculate (body);
	};

	/**
	* Function: AdjacencyInfo.Reset
	* Description: Calculates the adjacency information for a body.
	* Returns:
	*	body {Body} the body
	*/
	JSM.AdjacencyInfo.prototype.Calculate = function (body)
	{
		function AddVertex (adjacencyInfo)
		{
			var vert = new JSM.VertInfo ();
			adjacencyInfo.verts.push (vert);
		}
		
		function AddPolygon (adjacencyInfo, body, polygonIndex)
		{
			function AddEdge (adjacencyInfo, pgonInfo, fromVertexIndex, toVertexIndex, polygonIndex)
			{
				function ConnectEdge (adjacencyInfo, polygonIndex, fromVertexIndex, toVertexIndex, pedge, pgonInfo)
				{
					function ConnectPgonAndEdgeToVert (vert, pgonIndex, edgeIndex)
					{
						if (vert.edges.indexOf (edgeIndex) == -1) {
							vert.edges.push (edgeIndex);
						}
						if (vert.pgons.indexOf (pgonIndex) == -1) {
							vert.pgons.push (pgonIndex);
						}
					}
					
					pgonInfo.verts.push (fromVertexIndex);
					pgonInfo.pedges.push (pedge);
					ConnectPgonAndEdgeToVert (adjacencyInfo.verts[fromVertexIndex], polygonIndex, pedge.index);
					ConnectPgonAndEdgeToVert (adjacencyInfo.verts[toVertexIndex], polygonIndex, pedge.index);
				}
				
				var pedge = new JSM.PolyEdgeInfo ();
			
				var i, edge;
				for (i = 0; i < adjacencyInfo.edges.length; i++) {
					edge = adjacencyInfo.edges[i];
					if (edge.vert1 === fromVertexIndex && edge.vert2 === toVertexIndex) {
						pedge.index = i;
						pedge.reverse = false;
					} else if (edge.vert1 === toVertexIndex && edge.vert2 === fromVertexIndex) {
						pedge.index = i;
						pedge.reverse = true;
					}
				}

				if (pedge.index === -1) {
					var newEdge = new JSM.EdgeInfo ();
					newEdge.vert1 = fromVertexIndex;
					newEdge.vert2 = toVertexIndex;
					newEdge.pgon1 = polygonIndex;
					newEdge.pgon2 = -1;
					adjacencyInfo.edges.push (newEdge);
					
					pedge.index = adjacencyInfo.edges.length - 1;
					pedge.reverse = false;
				} else {
					var currEdge = adjacencyInfo.edges[pedge.index];
					if (currEdge.pgon1 === -1) {
						currEdge.pgon1 = polygonIndex;
					} else if (currEdge.pgon1 !== polygonIndex && currEdge.pgon2 === -1) {
						currEdge.pgon2 = polygonIndex;
					}
				}
				
				ConnectEdge (adjacencyInfo, polygonIndex, fromVertexIndex, toVertexIndex, pedge, pgonInfo);
			}

			var polygon = body.GetPolygon (polygonIndex);
			var pgon = new JSM.PgonInfo ();
			
			var i, curr, next;
			var count = polygon.VertexIndexCount ();
			for (i = 0; i < count; i++) {
				curr = polygon.GetVertexIndex (i);
				next = polygon.GetVertexIndex (i < count - 1 ? i + 1 : 0);
				AddEdge (adjacencyInfo, pgon, curr, next, polygonIndex);
			}
			adjacencyInfo.pgons.push (pgon);
		}

		this.verts = [];
		this.edges = [];
		this.pgons = [];	
		
		var i;
		for (i = 0; i < body.VertexCount (); i++) {
			AddVertex (this);
		}
		
		for (i = 0; i < body.PolygonCount (); i++) {
			AddPolygon (this, body, i);
		}
	};

	/**
	* Function: AdjacencyInfo.IsContourVertex
	* Description: Returns if the vertex has contour edge.
	* Parameters:
	*	vert {VertInfo} the vertex info
	* Returns:
	*	{boolean} the result
	*/
	JSM.AdjacencyInfo.prototype.IsContourVertex = function (vert)
	{
		var i, edge;
		for (i = 0; i < vert.edges.length; i++) {
			edge = vert.edges[i];
			if (this.IsContourEdge (this.edges[edge])) {
				return true;
			}
		}
		return false;
	};

	/**
	* Function: AdjacencyInfo.IsContourEdge
	* Description: Returns if the edge has only one polygon neighbour.
	* Parameters:
	*	edge {EdgeInfo} the edge info
	* Returns:
	*	{boolean} the result
	*/
	JSM.AdjacencyInfo.prototype.IsContourEdge = function (edge)
	{
		var pgonCount = this.GetEdgePolygonCount (edge);
		return pgonCount == 1;
	};

	/**
	* Function: AdjacencyInfo.GetEdgePolygonCount
	* Description: Returns the neighbour polygon count of the edge.
	* Parameters:
	*	edge {EdgeInfo} the edge info
	* Returns:
	*	{integer} the result
	*/
	JSM.AdjacencyInfo.prototype.GetEdgePolygonCount = function (edge)
	{
		var pgonCount = 0;
		if (edge.pgon1 != -1) {
			pgonCount += 1;
		}
		if (edge.pgon2 != -1) {
			pgonCount += 2;
		}
		return pgonCount;
	};

	/**
	* Function: AdjacencyInfo.GetAnotherPgonOfEdge
	* Description: Returns the polygon index which is next to the given polygon along an edge.
	* Parameters:
	*	edge {EdgeInfo} the edge info
	*	currentPgon {integer} the polygon index
	* Returns:
	*	{integer} the result
	*/
	JSM.AdjacencyInfo.prototype.GetAnotherPgonOfEdge = function (edge, pgon)
	{
		if (edge.pgon1 != -1 && edge.pgon1 != pgon) {
			return edge.pgon1;
		} else if (edge.pgon2 != -1 && edge.pgon2 != pgon) {
			return edge.pgon2;
		}
		return -1;
	};

	/**
	* Function: AdjacencyInfo.GetPolyEdgeStartVertex
	* Description: Returns the start vertex index of a polygon edge.
	* Parameters:
	*	polyEdge {PolyEdgeInfo} the polygon edge info
	* Returns:
	*	{integer} the result
	*/
	JSM.AdjacencyInfo.prototype.GetPolyEdgeStartVertex = function (polyEdge)
	{
		if (!polyEdge.reverse) {
			return this.edges[polyEdge.index].vert1;
		} else {
			return this.edges[polyEdge.index].vert2;
		}
	};

	/**
	* Function: AdjacencyInfo.GetPolyEdgeEndVertex
	* Description: Returns the end vertex index of a polygon edge.
	* Parameters:
	*	polyEdge {PolyEdgeInfo} the polygon edge info
	* Returns:
	*	{integer} the result
	*/
	JSM.AdjacencyInfo.prototype.GetPolyEdgeEndVertex = function (polyEdge)
	{
		if (!polyEdge.reverse) {
			return this.edges[polyEdge.index].vert2;
		} else {
			return this.edges[polyEdge.index].vert1;
		}
	};

	/**
	* Function: CalculateBodyVertexToPolygon
	* Description:
	*	Calculates an array which contains array of the connected polygon
	*	indices for all vertex indices in the body. The result is an
	*	array of array of polygon indices.
	* Parameters:
	*	body {Body} the body
	* Returns:
	*	{integer[*][*]} the result
	*/
	JSM.CalculateBodyVertexToPolygon = function (body)
	{
		var result = [];
		
		var i, j;
		for (i = 0; i < body.VertexCount (); i++) {
			result.push ([]);
		}
		
		var polygon;
		for (i = 0; i < body.PolygonCount (); i++) {
			polygon = body.GetPolygon (i);
			for (j = 0; j < polygon.VertexIndexCount (); j++) {
				result[polygon.GetVertexIndex (j)].push (i);
			}
		}
		
		return result;
	};

	/**
	* Function: IsSolidBody
	* Description:
	*	Returns if a given body is solid. It means that every
	*	edges of the body has two polygon neighbours.
	* Parameters:
	*	body {Body} the body
	* Returns:
	*	{boolean} the result
	*/
	JSM.IsSolidBody = function (body)
	{
		var adjacencyInfo = new JSM.AdjacencyInfo (body);
		if (adjacencyInfo.edges.length === 0) {
			return false;
		}
		
		var i, edge;
		for (i = 0; i < adjacencyInfo.edges.length; i++) {
			edge = adjacencyInfo.edges[i];
			if (edge.pgon1 === -1 || edge.pgon2 === -1) {
				return false;
			}
		}
		return true;
	};

	/**
	* Function: CheckSolidBody
	* Description:
	*	Returns if a given body solid body is correct. It means that every
	*	edges of the body has two polygon neighbours, and there are no edge
	*	in the body which appears twice with the same direction.
	* Parameters:
	*	body {Body} the body
	* Returns:
	*	{boolean} the result
	*/
	JSM.CheckSolidBody = function (body)
	{
		var adjacencyInfo = new JSM.AdjacencyInfo (body);
		var i, j, edge, pedge, found, pgon1, pgon2, pgon1Reverse, pgon2Reverse;
		for (i = 0; i < adjacencyInfo.edges.length; i++) {
			edge = adjacencyInfo.edges[i];
			if (edge.pgon1 === -1 || edge.pgon2 === -1) {
				return false;
			}
			
			pgon1 = adjacencyInfo.pgons[edge.pgon1];
			found = false;
			for (j = 0; j < pgon1.pedges.length; j++) {
				pedge = pgon1.pedges[j];
				if (pedge.index == i) {
					pgon1Reverse = pedge.reverse;
					found = true;
					break;
				}
			}
			if (!found) {
				return false;
			}
			
			pgon2 = adjacencyInfo.pgons[edge.pgon2];
			found = false;
			for (j = 0; j < pgon2.pedges.length; j++) {
				pedge = pgon2.pedges[j];
				if (pedge.index == i) {
					pgon2Reverse = pedge.reverse;
					found = true;
					break;
				}
			}
			if (!found) {
				return false;
			}
			
			if (pgon1Reverse == pgon2Reverse) {
				return false;
			}
		}
		return true;
	};

	/**
	* Function: TraversePgonsAlongEdges
	* Description:
	*	Traverses polygons along edges. The given callback function called on every
	*	found polygon. The return value of the callback means if the traverse should
	*	continue along the edges of the current polygon.
	* Parameters:
	*	pgonIndex {integer} the polygon index to start from
	*	adjacencyInfo {AdjacencyInfo} the adjacency info
	*	onPgonFound {function} the callback
	* Returns:
	*	{boolean} the result
	*/
	JSM.TraversePgonsAlongEdges = function (pgonIndex, adjacencyInfo, onPgonFound)
	{
		function AddNeighboursToStack (pgonIndex, adjacencyInfo, pgonStack)
		{
			var pgon = adjacencyInfo.pgons[pgonIndex];
			var i, edge, anotherPgon;
			for (i = 0; i < pgon.pedges.length; i++) {
				edge = adjacencyInfo.edges[pgon.pedges[i].index];
				anotherPgon = adjacencyInfo.GetAnotherPgonOfEdge (edge, pgonIndex);
				if (anotherPgon != -1) {
					pgonStack.push (anotherPgon);
				}
			}
		}

		var pgonIsProcessed = {};
		var pgonStack = [pgonIndex];
		var currentPgonIndex;
		while (pgonStack.length > 0) {
			currentPgonIndex = pgonStack.pop ();
			if (pgonIsProcessed[currentPgonIndex]) {
				continue;
			}
			
			pgonIsProcessed[currentPgonIndex] = true;
			if (onPgonFound (currentPgonIndex)) {
				AddNeighboursToStack (currentPgonIndex, adjacencyInfo, pgonStack);
			}
		}
	};

	return JSM;
});

define('skylark-jsmodeler/modeler/bodyutils',["../core/jsm"],function(JSM){
	/**
	* Function: AddVertexToBody
	* Description: Adds a vertex to an existing body.
	* Parameters:
	*	body {Body} the body
	*	x {number} the x coordinate of the vertex
	*	y {number} the y coordinate of the vertex
	*	z {number} the z coordinate of the vertex
	*/
	JSM.AddVertexToBody = function (body, x, y, z)
	{
		return body.AddVertex (new JSM.BodyVertex (new JSM.Coord (x, y, z)));
	};

	/**
	* Function: AddPointToBody
	* Description: Adds a point to an existing body.
	* Parameters:
	*	body {Body} the body
	*	vertex {integer} the vertex index stored in the body
	*/
	JSM.AddPointToBody = function (body, vertex)
	{
		return body.AddPoint (new JSM.BodyPoint (vertex));
	};

	/**
	* Function: AddLineToBody
	* Description: Adds a line to an existing body.
	* Parameters:
	*	body {Body} the body
	*	beg {integer} begin vertex index stored in the body
	*	end {integer} end vertex index stored in the body
	*/
	JSM.AddLineToBody = function (body, beg, end)
	{
		return body.AddLine (new JSM.BodyLine (beg, end));
	};

	/**
	* Function: AddPolygonToBody
	* Description: Adds a polygon to an existing body.
	* Parameters:
	*	body {Body} the body
	*	vertices {integer[*]} array of vertex indices stored in the body
	*/
	JSM.AddPolygonToBody = function (body, vertices)
	{
		return body.AddPolygon (new JSM.BodyPolygon (vertices));
	};

	/**
	* Function: CheckBody
	* Description:
	*	Checks if the body is correct. It means that every polygon has at least three
	*	vertices, and every point, line and polygon vertex index is valid.
	* Parameters:
	*	body {Body} the body
	* Returns:
	*	{boolean} the result
	*/
	JSM.CheckBody = function (body)
	{
		var vertexCount = body.VertexCount ();
		var i, j, point, line, polygon;
		for (i = 0; i < body.PointCount (); i++) {
			point = body.GetPoint (i);
			if (point.GetVertexIndex () < 0 || point.GetVertexIndex () >= vertexCount) {
				return false;
			}
		}
		for (i = 0; i < body.LineCount (); i++) {
			line = body.GetLine (i);
			if (line.GetBegVertexIndex () < 0 || line.GetBegVertexIndex () >= vertexCount) {
				return false;
			}
			if (line.GetEndVertexIndex () < 0 || line.GetEndVertexIndex () >= vertexCount) {
				return false;
			}
		}
		for (i = 0; i < body.PolygonCount (); i++) {
			polygon = body.GetPolygon (i);
			if (polygon.VertexIndexCount () < 3) {
				return false;
			}
			for (j = 0; j < polygon.VertexIndexCount (); j++) {
				if (polygon.GetVertexIndex (j) < 0 || polygon.GetVertexIndex (j) >= vertexCount) {
					return false;
				}
			}
		}
		return true;
	};

	/**
	* Function: CalculateBodyPolygonNormal
	* Description: Calculates a normal vector for a polygon stored in the body.
	* Parameters:
	*	body {Body} the body
	*	index {integer} the polygon index
	* Returns:
	*	{Vector} the result
	*/
	JSM.CalculateBodyPolygonNormal = function (body, index)
	{
		var polygon = body.GetPolygon (index);
		var count = polygon.VertexIndexCount ();

		var normal = new JSM.Vector (0.0, 0.0, 0.0);
		if (count >= 3) {
			var i, currentIndex, nextIndex, current, next;
			for (i = 0; i < count; i++) {
				currentIndex = i;
				nextIndex = (i + 1) % count;
		
				current = body.GetVertexPosition (polygon.GetVertexIndex (currentIndex));
				next = body.GetVertexPosition (polygon.GetVertexIndex (nextIndex));
		
				normal.x += (current.y - next.y) * (current.z + next.z);
				normal.y += (current.z - next.z) * (current.x + next.x);
				normal.z += (current.x - next.x) * (current.y + next.y);
			}
		}

		normal.Normalize ();
		return normal;
	};

	/**
	* Function: CalculateBodyPolygonNormals
	* Description: Calculates polygon normal vectors for all polygons stored in the body.
	* Parameters:
	*	body {Body} the body
	* Returns:
	*	{Vector[*]} the result
	*/
	JSM.CalculateBodyPolygonNormals = function (body)
	{
		var result = [];
		
		var i;
		for (i = 0; i < body.PolygonCount (); i++) {
			result.push (JSM.CalculateBodyPolygonNormal (body, i));
		}
		
		return result;
	};

	/**
	* Function: CalculateBodyVertexNormals
	* Description:
	*	Calculates vertex normal vectors for all vertices stored in the body.
	*	The result is an array of array with vertex normal vectors.
	* Parameters:
	*	body {Body} the body
	* Returns:
	*	{Vector[*][*]} the result
	*/
	JSM.CalculateBodyVertexNormals = function (body)
	{
		var result = [];
		var polygonNormals = JSM.CalculateBodyPolygonNormals (body);
		var vertexToPolygon = null;
		
		var i, j, k, polygon, normal;
		var average, count, neighbourPolygons, neighbourPolygon;
		for (i = 0; i < body.PolygonCount (); i++) {
			polygon = body.GetPolygon (i);
			result[i] = [];

			if (polygon.HasCurveGroup ()) {
				if (vertexToPolygon === null) {
					vertexToPolygon = JSM.CalculateBodyVertexToPolygon (body);
				}
				for (j = 0; j < polygon.VertexIndexCount (); j++) {
					average = new JSM.Vector (0.0, 0.0, 0.0);
					count = 0;
					
					neighbourPolygons = vertexToPolygon[polygon.GetVertexIndex (j)];
					for (k = 0; k < neighbourPolygons.length; k++) {
						neighbourPolygon = body.GetPolygon (neighbourPolygons[k]);
						if (neighbourPolygon.GetCurveGroup () === polygon.GetCurveGroup ()) {
							average = JSM.CoordAdd (average, polygonNormals[neighbourPolygons[k]]);
							count++;
						}
					}
					
					average.MultiplyScalar (1.0 / count);
					average.Normalize ();
					result[i].push (average);
				}
			} else {
				normal = polygonNormals[i];
				for (j = 0; j < polygon.VertexIndexCount (); j++) {
					result[i].push (new JSM.Vector (normal.x, normal.y, normal.z));
				}
			}
		}
		
		return result;
	};

	/**
	* Function: CalculatePolygonCurveGroups
	* Description: Calculates the curve groups for a given polygon.
	* Parameters:
	*	polygon {Polygon|Polygon2D} the polygon
	*	curveAngle {number} the curve angle
	* Returns:
	*	{integer[*]} the curve groups
	*/
	JSM.CalculatePolygonCurveGroups = function (polygon, curveAngle)
	{
		var curveGroups = [];
		var count = polygon.VertexCount ();

		var i, prev;
		for (i = 0; i < count; i++) {
			curveGroups.push (0);
		}

		for (i = 0; i < count; i++) {
			prev = curveGroups[polygon.GetPrevVertex (i)];
			if (polygon.GetVertexAngle (i) > curveAngle) {
				curveGroups[i] = prev;
			} else {
				curveGroups[i] = prev + 1;
			}
		}
		
		var firstGroup = curveGroups[0];
		var lastGroup = curveGroups[count - 1];
		if (firstGroup === 0 && firstGroup != lastGroup) {
			for (i = 0; curveGroups[i] == firstGroup; i++) {
				curveGroups[i] = lastGroup;
			}
		}
		
		return curveGroups;
	};


	/**
	* Function: CalculatePolygonCentroid
	* Description: Calculates the centroid of a polygon stored in the body.
	* Parameters:
	*	body {Body} the body
	*	index {integer} the polygon index
	* Returns:
	*	{Coord} the result
	*/
	JSM.CalculatePolygonCentroid = function (body, index)
	{
		var polygon = body.GetPolygon (index);
		var count = polygon.VertexIndexCount ();
		
		var result = new JSM.Coord (0.0, 0.0, 0.0);
		var i;
		for (i = 0; i < count; i++) {
			result = JSM.CoordAdd (result, body.GetVertexPosition (polygon.GetVertexIndex (i)));
		}
		
		result.MultiplyScalar (1.0 / count);
		return result;
	};

	/**
	* Function: MakeBodyInsideOut
	* Description: Reverses all polygons orientation in the body.
	* Parameters:
	*	body {Body} the body
	*/
	JSM.MakeBodyInsideOut = function (body)
	{
		var i, polygon;
		for (i = 0; i < body.PolygonCount (); i++) {
			polygon = body.GetPolygon (i);
			polygon.ReverseVertexIndices ();
		}
	};

	/**
	* Function: SoftMoveBodyVertex
	* Description: Moves a vertex and its nearby vertices depending on gaussian function.
	* Parameters:
	*	body {Body} the body
	*	index {integer} the vertex index to move
	*	radius {number} the radius of the movement
	*	direction {Vector} the direction of the movement
	*	distance {number} the distance of the movement
	*/
	JSM.SoftMoveBodyVertex = function (body, index, radius, direction, distance)
	{
		var referenceCoord = body.GetVertexPosition (index).Clone ();

		var eps = 0.00001;
		var a = distance;
		var b = 0.0;
		var c = JSM.GetGaussianCParameter (radius, a, b, eps);

		var i, currentDistance, newDistance;
		for (i = 0; i < body.VertexCount (); i++) {
			currentDistance = referenceCoord.DistanceTo (body.GetVertex (i).position);
			if (JSM.IsGreater (currentDistance, radius)) {
				continue;
			}

			newDistance = JSM.GetGaussianValue (currentDistance, distance, b, c);
			body.GetVertexPosition (i).Offset (direction, newDistance);
		}
	};

	/**
	* Function: GenerateWireBody
	* Description: Generates a body which contains only the lines from the given body.
	* Parameters:
	*	body {Body} the original body
	* Returns:
	*	{Body} the result
	*/
	JSM.GenerateWireBody = function (body)
	{
		var result = new JSM.Body ();
		
		var i;
		for (i = 0; i < body.VertexCount (); i++) {
			result.AddVertex (body.GetVertex (i).Clone ());
		}

		var adjacencyInfo = new JSM.AdjacencyInfo (body);
		var edge;
		for (i = 0; i < adjacencyInfo.edges.length; i++) {
			edge = adjacencyInfo.edges[i];
			JSM.AddLineToBody (result, edge.vert1, edge.vert2);
		}
		
		return result;
	};

	/**
	* Function: TriangulateWithCentroids
	* Description:
	*	Triangulates all polygons of the body by connecting all polygon
	*	vertices with the centroid vertex of the polygon.
	* Parameters:
	*	body {Body} the body
	*/
	JSM.TriangulateWithCentroids = function (body)
	{
		var oldPolygonCount = body.PolygonCount ();
		var i, j, centroidCoord, centroidIndex, oldPolygon, oldVertexCount, polygon, curr, next;
		for (i = 0; i < oldPolygonCount; i++) {
			centroidCoord = JSM.CalculatePolygonCentroid (body, i);
			centroidIndex = body.AddVertex (new JSM.BodyVertex (centroidCoord));
			oldPolygon = body.GetPolygon (i);
			oldVertexCount = oldPolygon.VertexIndexCount ();
			for (j = 0; j < oldVertexCount; j++) {
				curr = oldPolygon.GetVertexIndex (j);
				next = oldPolygon.GetVertexIndex (j < oldVertexCount - 1 ? j + 1 : 0);
				polygon = new JSM.BodyPolygon ([curr, next, centroidIndex]);
				polygon.InheritAttributes (oldPolygon);
				body.AddPolygon (polygon);
			}
		}
		for (i = 0; i < oldPolygonCount; i++) {
			body.RemovePolygon (0);
		}
	};

	/**
	* Function: TriangulatePolygons
	* Description: Triangulates all polygons of the body.
	* Parameters:
	*	body {Body} the body
	*/
	JSM.TriangulatePolygons = function (body)
	{
		var oldPolygonCount = body.PolygonCount ();
		var i, j, oldPolygon, polygon, coord, triangleIndices, triangle, bodyTriangle;
		for (i = 0; i < oldPolygonCount; i++) {
			oldPolygon = body.GetPolygon (i);
			polygon = new JSM.Polygon ();
			for (j = 0; j < oldPolygon.VertexIndexCount (); j++) {
				coord = body.GetVertexPosition (oldPolygon.GetVertexIndex (j));
				polygon.AddVertex (coord.x, coord.y, coord.z);
			}
			triangleIndices = JSM.TriangulatePolygon (polygon);
			if (triangleIndices !== null) {
				for (j = 0; j < triangleIndices.length; j++) {
					triangle = triangleIndices[j];
					bodyTriangle = new JSM.BodyPolygon ([
						oldPolygon.GetVertexIndex (triangle[0]),
						oldPolygon.GetVertexIndex (triangle[1]),
						oldPolygon.GetVertexIndex (triangle[2])
					]);
					bodyTriangle.InheritAttributes (oldPolygon);
					body.AddPolygon (bodyTriangle);
				}
			}
		}
		for (i = 0; i < oldPolygonCount; i++) {
			body.RemovePolygon (0);
		}
	};

	/**
	* Function: GenerateRandomMaterials
	* Description: Generates random materials for a body. A seed number can be specified.
	* Parameters:
	*	body {Body} the body
	*	materials {MaterialSet} the materials
	*	seeded {boolean} seeded random generation
	*/
	JSM.GenerateRandomMaterials = function (body, materials, seeded)
	{
		function GetRandomInt (seeded, seed)
		{
			var minColor = 0;
			var maxColor = 16777215;
			var color = 0;
			if (seeded !== undefined && seeded) {
				color = JSM.SeededRandomInt (minColor, maxColor, seed + 1);
			} else {
				color = JSM.RandomInt (minColor, maxColor);
			}
			return color;
		}
		
		var i, color, material;
		var seed = 0;
		for (i = 0; i < body.LineCount (); i++) {
			color = GetRandomInt (seeded, seed++);
			material = materials.AddMaterial (new JSM.Material ({ambient : color, diffuse : color}));
			body.GetLine (i).SetMaterialIndex (material);
		}
		for (i = 0; i < body.PointCount (); i++) {
			color = GetRandomInt (seeded, seed++);
			material = materials.AddMaterial (new JSM.Material ({ambient : color, diffuse : color}));
			body.GetPoint (i).SetMaterialIndex (material);
		}
		for (i = 0; i < body.PolygonCount (); i++) {
			color = GetRandomInt (seeded, seed++);
			material = materials.AddMaterial (new JSM.Material ({ambient : color, diffuse : color}));
			body.GetPolygon (i).SetMaterialIndex (material);
		}
	};

	/**
	* Function: AddBodyToBSPTree
	* Description: Adds a body to a BSP tree.
	* Parameters:
	*	body {Body} the body
	*	bspTree {BSPTree} the BSP tree
	*	id {anything} the id for added polygons
	*/
	JSM.AddBodyToBSPTree = function (body, bspTree, id)
	{
		function ConvertBodyPolygonToPolygon (body, index, userData)
		{
			var polygon = body.GetPolygon (index);
			userData.material = polygon.GetMaterialIndex ();
			var result = new JSM.Polygon ();
			var i, coord;
			for (i = 0; i < polygon.VertexIndexCount (); i++) {
				coord = body.GetVertexPosition (polygon.GetVertexIndex (i));
				result.AddVertex (coord.x, coord.y, coord.z);
			}
			return result;
		}

		var i, polygon, userData;
		for (i = 0; i < body.PolygonCount (); i++) {
			userData = {
				id : id,
				originalPolygon : i,
				material : -1
			};
			polygon = ConvertBodyPolygonToPolygon (body, i, userData);
			bspTree.AddPolygon (polygon, userData);
		}
	};

	return JSM;
});

define('skylark-jsmodeler/modeler/textureutils',["../core/jsm"],function(JSM){
	/**
	* Function: CalculatePlanarTextureCoord
	* Description: Calculates the planar texture coordinate for a coordinate.
	* Parameters:
	*	coord {Coord} the coordinate
	*	system {CoordSystem} the coordinate system
	* Returns:
	*	{Coord2D} the result
	*/
	JSM.CalculatePlanarTextureCoord = function (coord, system)
	{
		var result = new JSM.Coord2D (0.0, 0.0);

		var e1 = system.e1.Clone ().Normalize ();
		var e2 = system.e2.Clone ().Normalize ();
		var e3 = JSM.VectorCross (system.e1, system.e2);

		var xyPlane = JSM.GetPlaneFromCoordAndDirection (system.origo, e3);
		var xzPlane = JSM.GetPlaneFromCoordAndDirection (system.origo, e2);
		var yzPlane = JSM.GetPlaneFromCoordAndDirection (system.origo, e1);
		
		var projected = xyPlane.ProjectCoord (coord);
		result.x = yzPlane.CoordSignedDistance (projected);
		result.y = xzPlane.CoordSignedDistance (projected);

		return result;
	};

	/**
	* Function: CalculateCubicTextureCoord
	* Description: Calculates the cubic texture coordinate for a coordinate.
	* Parameters:
	*	coord {Coord} the coordinate
	*	normal {Vector} the normal vector for calculation
	*	system {CoordSystem} the coordinate system
	* Returns:
	*	{Coord2D} the result
	*/
	JSM.CalculateCubicTextureCoord = function (coord, normal, system)
	{
		var result = new JSM.Coord2D (0.0, 0.0);

		var e1 = system.e1.Clone ().Normalize ();
		var e2 = system.e2.Clone ().Normalize ();
		var e3 = system.e3.Clone ().Normalize ();

		var correctPlane = -1;
		var maxProduct = 0.0;
		
		var i, currentDirection, product;
		for (i = 0; i < 3; i++) {
			if (i === 0) {
				currentDirection = e1;
			} else if (i === 1) {
				currentDirection = e2;
			} else if (i === 2) {
				currentDirection = e3;
			}

			product = Math.abs (JSM.VectorDot (normal, currentDirection));
			if (JSM.IsGreater (product, maxProduct)) {
				correctPlane = i;
				maxProduct = product;
			}
		}

		if (correctPlane === -1) {
			return result;
		}

		var planeSystem = null;
		if (correctPlane === 0) {
			planeSystem = new JSM.CoordSystem (
				system.origo,
				e2,
				e3,
				new JSM.Coord (0.0, 0.0, 0.0)
			);
		} else if (correctPlane === 1) {
			planeSystem = new JSM.CoordSystem (
				system.origo,
				e1,
				e3,
				new JSM.Coord (0.0, 0.0, 0.0)
			);
		} else if (correctPlane === 2) {
			planeSystem = new JSM.CoordSystem (
				system.origo,
				e1,
				e2,
				new JSM.Coord (0.0, 0.0, 0.0)
			);
		}
		
		if (planeSystem === null) {
			return result;
		}

		return JSM.CalculatePlanarTextureCoord (coord, planeSystem);
	};

	/**
	* Function: CalculateCylindricalTextureCoord
	* Description: Calculates the cylindrical texture coordinate for a coordinate.
	* Parameters:
	*	coord {Coord} the coordinate
	*	normal {Vector} the normal vector for calculation
	*	system {CoordSystem} the coordinate system
	* Returns:
	*	{Coord2D} the result
	*/
	JSM.CalculateCylindricalTextureCoord = function (coord, normal, system)
	{
		var result = new JSM.Coord2D (0.0, 0.0);

		var e3Direction = system.e3.Clone ().Normalize ();
		if (e3Direction.IsCollinearWith (normal)) {
			result = JSM.CalculateCubicTextureCoord (coord, normal, system);
			return [result, 0.0];
		}

		var baseLine = new JSM.Line (system.origo, e3Direction);
		var projectedCoord = baseLine.ProjectCoord (coord);
		var projectedDistance = JSM.CoordSignedDistance (system.origo, projectedCoord, e3Direction);

		var e1Direction = system.e1.Clone ().Normalize ();
		var coordDirection = JSM.CoordSub (coord, projectedCoord);
		var angle = JSM.GetVectorsFullAngle (coordDirection, e1Direction, e3Direction);
		var radius = system.e1.Length ();

		result.x = angle * radius;
		result.y = projectedDistance;
		return [result, angle];
	};

	/**
	* Function: CalculatePolygonPlanarTextureCoords
	* Description: Calculates the planar texture coordinates for a polygon.
	* Parameters:
	*	body {Body} the body
	*	index {integer} the polygon index
	* Returns:
	*	{Coord2D[*]} the result
	*/
	JSM.CalculatePolygonPlanarTextureCoords = function (body, index)
	{
		var result = [];
		var polygon = body.GetPolygon (index);
		var system = body.GetTextureProjection ().GetCoords ();

		var i, coord;
		for (i = 0; i < polygon.VertexIndexCount (); i++) {
			coord = body.GetVertexPosition (polygon.GetVertexIndex (i));
			result.push (JSM.CalculatePlanarTextureCoord (coord, system));
		}
		
		return result;
	};

	/**
	* Function: CalculatePolygonCubicTextureCoords
	* Description: Calculates the cubic texture coordinates for a polygon.
	* Parameters:
	*	body {Body} the body
	*	index {integer} the polygon index
	*	normal {Vector} the normal vector for calculation
	* Returns:
	*	{Coord2D[*]} the result
	*/
	JSM.CalculatePolygonCubicTextureCoords = function (body, index, normal)
	{
		var result = [];
		var polygon = body.GetPolygon (index);
		var system = body.GetTextureProjection ().GetCoords ();

		var i, coord;
		for (i = 0; i < polygon.VertexIndexCount (); i++) {
			coord = body.GetVertexPosition (polygon.GetVertexIndex (i));
			result.push (JSM.CalculateCubicTextureCoord (coord, normal, system));
		}
		
		return result;
	};

	/**
	* Function: CalculatePolygonCylindricalTextureCoords
	* Description: Calculates the cylindrical texture coordinates for a polygon.
	* Parameters:
	*	body {Body} the body
	*	index {integer} the polygon index
	*	normal {Vector} the normal vector for calculation
	* Returns:
	*	{Coord2D[*]} the result
	*/
	JSM.CalculatePolygonCylindricalTextureCoords = function (body, index, normal)
	{
		var result = [];
		var angles = [];

		var polygon = body.GetPolygon (index);
		var system = body.GetTextureProjection ().GetCoords ();

		var i, j, coord, textureValues;
		for (i = 0; i < polygon.VertexIndexCount (); i++) {
			coord = body.GetVertexPosition (polygon.GetVertexIndex (i));
			textureValues = JSM.CalculateCylindricalTextureCoord (coord, normal, system);
			result.push (textureValues[0]);
			angles.push (textureValues[1]);
		}

		var e3Direction = system.e3.Clone ().Normalize ();
		if (e3Direction.IsCollinearWith (normal)) {
			return result;
		}
		
		var needRepair = false;
		for (i = 0; i < angles.length; i++) {
			for (j = i + 1; j < angles.length; j++) {
				if (JSM.IsGreater (Math.abs (angles[i] - angles[j]), Math.PI)) {
					needRepair = true;
					break;
				}
			}
			if (needRepair) {
				break;
			}
		}

		if (needRepair) {
			var radius = system.e1.Length ();
			for (i = 0; i < angles.length; i++) {
				if (JSM.IsLower (angles[i], Math.PI)) {
					result[i].x = radius * (angles[i] + 2.0 * Math.PI);
				}
			}
		}
		
		return result;
	};

	/**
	* Function: CalculateBodyPlanarTextureCoords
	* Description: Calculates the planar texture coordinates for a body.
	* Parameters:
	*	body {Body} the body
	* Returns:
	*	{Coord2D[*][*]} the result
	*/
	JSM.CalculateBodyPlanarTextureCoords = function (body)
	{
		var result = [];
		var i;
		for (i = 0; i < body.PolygonCount (); i++) {
			result.push (JSM.CalculatePolygonPlanarTextureCoords (body, i));
		}
		return result;
	};

	/**
	* Function: CalculateBodyCubicTextureCoords
	* Description: Calculates the cubic texture coordinates for a body.
	* Parameters:
	*	body {Body} the body
	* Returns:
	*	{Coord2D[*][*]} the result
	*/
	JSM.CalculateBodyCubicTextureCoords = function (body)
	{
		var result = [];
		var polygonNormals = JSM.CalculateBodyPolygonNormals (body);
		var i, normal;
		for (i = 0; i < body.PolygonCount (); i++) {
			normal = polygonNormals[i];
			result.push (JSM.CalculatePolygonCubicTextureCoords (body, i, normal));
		}
		return result;
	};

	/**
	* Function: CalculateBodyCylindricalTextureCoords
	* Description: Calculates the cylindrical texture coordinates for a body.
	* Parameters:
	*	body {Body} the body
	* Returns:
	*	{Coord2D[*][*]} the result
	*/
	JSM.CalculateBodyCylindricalTextureCoords = function (body)
	{
		var result = [];
		var polygonNormals = JSM.CalculateBodyPolygonNormals (body);
		var i, normal;
		for (i = 0; i < body.PolygonCount (); i++) {
			normal = polygonNormals[i];
			result.push (JSM.CalculatePolygonCylindricalTextureCoords (body, i, normal));
		}
		return result;
	};

	/**
	* Function: CalculateBodyTextureCoords
	* Description:
	*	Calculates the texture coordinates for a body. The result
	*	is an array of arrays of texture coordinates.
	* Parameters:
	*	body {Body} the body
	* Returns:
	*	{Coord2D[*][*]} the result
	*/
	JSM.CalculateBodyTextureCoords = function (body)
	{
		var result = [];
		var projection = body.GetTextureProjection ().GetType ();
		if (projection === JSM.TextureProjectionType.Planar) {
			result = JSM.CalculateBodyPlanarTextureCoords (body);
		} else if (projection === JSM.TextureProjectionType.Cubic) {
			result = JSM.CalculateBodyCubicTextureCoords (body);
		} else if (projection === JSM.TextureProjectionType.Cylindrical) {
			result = JSM.CalculateBodyCylindricalTextureCoords (body);
		}

		return result;
	};

	return JSM;
});

define('skylark-jsmodeler/modeler/cututils',["../core/jsm"],function(JSM){
	/**
	* Function: CutBodyByPlane
	* Description: Cuts a body by a plane.
	* Parameters:
	*	body {Body} the body
	*	plane {Plane} the plane
	* Returns:
	*	{Body} the result
	*/
	JSM.CutBodyByPlane = function (body, plane)
	{
		function CutBodyPolygonByPlane (polygon, plane, indexTable)
		{
			function AddOriginalVertex (index, vertex, rawResult, rawIndexTable)
			{
				rawResult.push (new JSM.Coord (vertex.x, vertex.y, vertex.z));
				rawIndexTable.push (index);
			}

			function AddIntersectionVertex (from, to, rawResult, rawIndexTable)
			{
				var direction = JSM.CoordSub (polygon[to], polygon[from]).Normalize ();
				var line = new JSM.Line (polygon[from], direction);
				var intersection = plane.LineIntersection (line);
				rawResult.push (new JSM.Coord (intersection.x, intersection.y, intersection.z));
				rawIndexTable.push (-1);
			}

			var hasIndexTable = (indexTable !== undefined && indexTable !== null);
			var count = polygon.length;
			var result = [];
			var front = [];
			
			var needCut = false;
			var i, position, vertex;
			for (i = 0; i < count; i++) {
				vertex = polygon[i];
				position = plane.CoordPosition (vertex);
				front.push (position !== JSM.CoordPlanePosition.CoordAtBackOfPlane);
				if (i > 0 && front[i - 1] !== front[i]) {
					needCut = true;
				}
			}
			
			if (!needCut) {
				if (front[0] === false) {
					return result;
				}
				
				for (i = 0; i < count; i++) {
					vertex = polygon[i];
					result.push (new JSM.Coord (vertex.x, vertex.y, vertex.z));
					if (hasIndexTable) {
						indexTable.push (i);
					}
				}
				return result;
			}
			
			var rawResult = [];
			var rawIndexTable = [];

			var from, to;
			for (i = 0; i < count; i++) {
				from = i - 1;
				to = i;
				if (i === 0) {
					from = count - 1;
				}

				vertex = polygon[to];
				if (front[to]) {
					if (!front[from]) {
						AddIntersectionVertex (from, to, rawResult, rawIndexTable);
					}
					AddOriginalVertex (to, vertex, rawResult, rawIndexTable);
				} else {
					if (front[from]) {
						AddIntersectionVertex (from, to, rawResult, rawIndexTable);
					}
				}
			}

			var currentVertex;
			var currentIndex;
			var lastVertex;
			var lastIndex;
			for (i = 0; i < rawResult.length; i++) {
				currentVertex = rawResult[i];
				lastVertex = result[result.length - 1];
				if (i === 0 || !lastVertex.IsEqual (currentVertex)) {
					result.push (new JSM.Coord (currentVertex.x, currentVertex.y, currentVertex.z));
					if (hasIndexTable) {
						currentIndex = rawIndexTable[i];
						indexTable.push (currentIndex);
					}
				} else {
					if (hasIndexTable) {
						currentIndex = rawIndexTable[i];
						lastIndex = rawIndexTable[i - 1];
						if (currentIndex !== -1) {
							indexTable[indexTable.length - 1] = currentIndex;
						} else if (lastIndex !== -1) {
							indexTable[indexTable.length - 1] = lastIndex;
						}
					}
				}
			}
			
			return result;
		}

		function GetInsertedVertexIndex (result, vertex, originalVertexCount)
		{
			var index = -1;
		
			var i;
			for (i = originalVertexCount; i < result.VertexCount (); i++) {
				if (vertex.IsEqual (result.GetVertexPosition (i))) {
					index = i;
					break;
				}
			}
			
			if (index === -1) {
				index = result.AddVertex (new JSM.BodyVertex (new JSM.Coord (vertex.x, vertex.y, vertex.z)));
			}
			
			return index;
		}

		var result = new JSM.Body ();

		var cuttedPolygons = [];
		var cuttedIndexTables = [];
		
		var remainsVertex = [];
		var originalOldToNewIndex = [];
		
		var i, j, polygon, polygon3D, vertexPosition;
		var cuttedPolygon, indexTable;
		for (i = 0; i < body.PolygonCount (); i++) {
			polygon = body.GetPolygon (i);
			
			polygon3D = [];
			for (j = 0; j < polygon.VertexIndexCount (); j++) {
				vertexPosition = body.GetVertexPosition (polygon.GetVertexIndex (j));
				polygon3D.push (new JSM.Coord (vertexPosition.x, vertexPosition.y, vertexPosition.z));
			}
			
			indexTable = [];
			cuttedPolygon = CutBodyPolygonByPlane (polygon3D, plane, indexTable);
			for (j = 0; j < indexTable.length; j++) {
				if (indexTable[j] !== -1) {
					remainsVertex[polygon.GetVertexIndex (indexTable[j])] = true;
				}
			}

			cuttedPolygons.push (cuttedPolygon);
			cuttedIndexTables.push (indexTable);
		}

		var vertex;
		for (i = 0; i < body.VertexCount (); i++) {
			if (remainsVertex[i]) {
				vertex = body.GetVertexPosition (i);
				originalOldToNewIndex[i] = result.AddVertex (new JSM.BodyVertex (new JSM.Coord (vertex.x, vertex.y, vertex.z)));
			}
		}

		var originalVertexCount = result.VertexCount ();

		var newPolygon, newPolygonVertices;
		for (i = 0; i < body.PolygonCount (); i++) {
			polygon = body.GetPolygon (i);
			cuttedPolygon = cuttedPolygons[i];
			indexTable = cuttedIndexTables[i];
			if (indexTable.length === 0) {
				continue;
			}

			newPolygonVertices = [];
			for (j = 0; j < indexTable.length; j++) {
				if (indexTable[j] !== -1) {
					newPolygonVertices.push (originalOldToNewIndex[polygon.GetVertexIndex (indexTable[j])]);
				} else {
					vertex = cuttedPolygon[j];
					newPolygonVertices.push (GetInsertedVertexIndex (result, vertex, originalVertexCount));
				}
			}
			
			newPolygon = new JSM.BodyPolygon (newPolygonVertices);
			newPolygon.InheritAttributes (polygon);
			result.AddPolygon (newPolygon);
		}

		return result;
	};

	return JSM;
});

define('skylark-jsmodeler/modeler/generator',["../core/jsm"],function(JSM){
	/**
	* Function: GenerateRectangle
	* Description: Generates a rectangle.
	* Parameters:
	*	xSize {number} x size
	*	ySize {number} y size
	* Returns:
	*	{Body} the result
	*/
	JSM.GenerateRectangle = function (xSize, ySize)
	{
		var result = new JSM.Body ();

		var x = xSize / 2.0;
		var y = ySize / 2.0;
		
		result.AddVertex (new JSM.BodyVertex (new JSM.Coord (-x, -y, 0.0)));
		result.AddVertex (new JSM.BodyVertex (new JSM.Coord (x, -y, 0.0)));
		result.AddVertex (new JSM.BodyVertex (new JSM.Coord (x, y, 0.0)));
		result.AddVertex (new JSM.BodyVertex (new JSM.Coord (-x, y, 0.0)));

		result.AddPolygon (new JSM.BodyPolygon ([0, 1, 2, 3]));

		result.SetCubicTextureProjection (new JSM.Coord (-x, -y, 0.0), new JSM.Coord (1.0, 0.0, 0.0), new JSM.Coord (0.0, 1.0, 0.0), new JSM.Coord (0.0, 0.0, 1.0));
		return result;
	};

	/**
	* Function: GenerateCuboid
	* Description: Generates a cuboid.
	* Parameters:
	*	xSize {number} x size
	*	ySize {number} y size
	*	zSize {number} z size
	* Returns:
	*	{Body} the result
	*/
	JSM.GenerateCuboid = function (xSize, ySize, zSize)
	{
		var result = new JSM.Body ();

		var x = xSize / 2.0;
		var y = ySize / 2.0;
		var z = zSize / 2.0;
		
		result.AddVertex (new JSM.BodyVertex (new JSM.Coord (-x, -y, -z)));
		result.AddVertex (new JSM.BodyVertex (new JSM.Coord (x, -y, -z)));
		result.AddVertex (new JSM.BodyVertex (new JSM.Coord (x, -y, z)));
		result.AddVertex (new JSM.BodyVertex (new JSM.Coord (-x, -y, z)));
		result.AddVertex (new JSM.BodyVertex (new JSM.Coord (-x, y, -z)));
		result.AddVertex (new JSM.BodyVertex (new JSM.Coord (x, y, -z)));
		result.AddVertex (new JSM.BodyVertex (new JSM.Coord (x, y, z)));
		result.AddVertex (new JSM.BodyVertex (new JSM.Coord (-x, y, z)));

		result.AddPolygon (new JSM.BodyPolygon ([0, 1, 2, 3]));
		result.AddPolygon (new JSM.BodyPolygon ([1, 5, 6, 2]));
		result.AddPolygon (new JSM.BodyPolygon ([5, 4, 7, 6]));
		result.AddPolygon (new JSM.BodyPolygon ([4, 0, 3, 7]));
		result.AddPolygon (new JSM.BodyPolygon ([0, 4, 5, 1]));
		result.AddPolygon (new JSM.BodyPolygon ([3, 2, 6, 7]));

		result.SetCubicTextureProjection (new JSM.Coord (-x, -y, -z), new JSM.Coord (1.0, 0.0, 0.0), new JSM.Coord (0.0, 1.0, 0.0), new JSM.Coord (0.0, 0.0, 1.0));
		return result;
	};

	/**
	* Function: GenerateCuboidSides
	* Description:
	*	Generates the specified sides of a cuboid. The last parameter is
	*	a boolean array which defines sides visibility.
	* Parameters:
	*	xSize {number} x size
	*	ySize {number} y size
	*	zSize {number} z size
	*	sides {boolean[]} sides visibility
	* Returns:
	*	{Body} the result
	*/
	JSM.GenerateCuboidSides = function (xSize, ySize, zSize, sides)
	{
		var result = new JSM.Body ();

		var x = xSize / 2.0;
		var y = ySize / 2.0;
		var z = zSize / 2.0;
		
		result.AddVertex (new JSM.BodyVertex (new JSM.Coord (-x, -y, -z)));
		result.AddVertex (new JSM.BodyVertex (new JSM.Coord (x, -y, -z)));
		result.AddVertex (new JSM.BodyVertex (new JSM.Coord (x, -y, z)));
		result.AddVertex (new JSM.BodyVertex (new JSM.Coord (-x, -y, z)));
		result.AddVertex (new JSM.BodyVertex (new JSM.Coord (-x, y, -z)));
		result.AddVertex (new JSM.BodyVertex (new JSM.Coord (x, y, -z)));
		result.AddVertex (new JSM.BodyVertex (new JSM.Coord (x, y, z)));
		result.AddVertex (new JSM.BodyVertex (new JSM.Coord (-x, y, z)));

		if (sides[0]) { result.AddPolygon (new JSM.BodyPolygon ([0, 1, 2, 3])); }
		if (sides[1]) { result.AddPolygon (new JSM.BodyPolygon ([1, 5, 6, 2])); }
		if (sides[2]) { result.AddPolygon (new JSM.BodyPolygon ([5, 4, 7, 6])); }
		if (sides[3]) { result.AddPolygon (new JSM.BodyPolygon ([4, 0, 3, 7])); }
		if (sides[4]) { result.AddPolygon (new JSM.BodyPolygon ([0, 4, 5, 1])); }
		if (sides[5]) { result.AddPolygon (new JSM.BodyPolygon ([3, 2, 6, 7])); }

		result.SetCubicTextureProjection (new JSM.Coord (-x, -y, -z), new JSM.Coord (1.0, 0.0, 0.0), new JSM.Coord (0.0, 1.0, 0.0), new JSM.Coord (0.0, 0.0, 1.0));
		return result;
	};

	/**
	* Function: GenerateSegmentedRectangle
	* Description:	Generates a segmented rectangle.
	* Parameters:
	*	xSize {number} x size
	*	ySize {number} y size
	*	xSegmentation {integer} segmentation along x side
	*	ySegmentation {integer} segmentation along y side
	* Returns:
	*	{Body} the result
	*/
	JSM.GenerateSegmentedRectangle = function (xSize, ySize, xSegmentation, ySegmentation)
	{
		function AddVertices ()
		{
			var i, j, coord;

			for (i = 0; i <= ySegmentation; i++) {
				for (j = 0; j <= xSegmentation; j++) {
					coord = new JSM.Coord (j * xSegment - xStart, i * ySegment - yStart, 0.0);
					result.AddVertex (new JSM.BodyVertex (coord));
				}
			}
		}

		function AddPolygons ()
		{
			var i, j;
			var current, next, top, ntop;
			
			for (j = 0; j < ySegmentation; j++) {
				for (i = 0; i < xSegmentation; i++) {
					current = j * (xSegmentation + 1) + i;
					next = current + 1;
					top = current + xSegmentation + 1;
					ntop = top + 1;
					result.AddPolygon (new JSM.BodyPolygon ([current, next, ntop, top]));
				}
			}
		}

		var result = new JSM.Body ();
		
		var xStart = xSize / 2.0;
		var yStart = ySize / 2.0;
		var xSegment = xSize / xSegmentation;
		var ySegment = ySize / ySegmentation;
		
		AddVertices ();
		AddPolygons ();

		return result;
	};

	/**
	* Function: GenerateSegmentedCuboid
	* Description:	Generates a segmented cuboid.
	* Parameters:
	*	xSize {number} x size
	*	ySize {number} y size
	*	zSize {number} z size
	*	segmentation {integer} segmentation of the sides
	* Returns:
	*	{Body} the result
	*/
	JSM.GenerateSegmentedCuboid = function (xSize, ySize, zSize, segmentation)
	{
		function GetLevelOffset (level)
		{
			var offset = 0;
			if (level > 0 && level <= segmentation) {
				offset = (segmentation + 1) * (segmentation + 1) + (level - 1) * (segmentation * 4);
			}
			return offset;
		}

		function GetLevelSideVertices (level)
		{
			var i;
			
			var vertices = [];
			var offset = GetLevelOffset (level);
			if (level === 0 || level === segmentation) {
				for (i = 0; i <= segmentation; i++) {
					vertices.push (offset + i);
				}
				for (i = 1; i <= segmentation; i++) {
					vertices.push (offset + (i + 1) * segmentation + i);
				}
				for (i = segmentation - 1; i >= 0; i--) {
					vertices.push (offset + (segmentation + 1) * segmentation + i);
				}
				for (i = segmentation - 1; i > 0; i--) {
					vertices.push (offset + i * (segmentation + 1));
				}
			} else if (level > 0 && level < segmentation) {
				for (i = 0; i <= segmentation; i++) {
					vertices.push (offset + i);
				}
				for (i = 1; i < segmentation; i++) {
					vertices.push (offset + segmentation + 2 * i);
				}
				for (i = segmentation; i >= 0; i--) {
					vertices.push (offset + (3 * segmentation) + i - 1);
				}
				for (i = segmentation - 1; i > 0; i--) {
					vertices.push (offset + segmentation + 2 * i - 1);
				}
			}
			
			return vertices;
		}

		function AddVertices (level)
		{
			var i, j, coord;

			var zCoord = level * zSegment;
			if (level === 0 || level === segmentation) {
				for (i = 0; i <= segmentation; i++) {
					for (j = 0; j <= segmentation; j++) {
						coord = new JSM.Coord (j * xSegment - xStart, i * ySegment - yStart, zCoord - zStart);
						result.AddVertex (new JSM.BodyVertex (coord));
					}
				}
			} else if (level > 0 && level < segmentation) {
				for (i = 0; i <= segmentation; i++) {
					for (j = 0; j <= segmentation; j++) {
						if (i === 0 || i === segmentation || j === 0 || j === segmentation) {
							coord = new JSM.Coord (j * xSegment - xStart, i * ySegment - yStart, zCoord - zStart);
							result.AddVertex (new JSM.BodyVertex (coord));
						}
					}
				}
			}
		}

		function AddPolygons (level)
		{
			var i, j;
			var current, next, top, ntop;
			
			if (level === 0 || level === segmentation) {
				var offset = GetLevelOffset (level);
				for (i = 0; i < segmentation; i++) {
					for (j = 0; j < segmentation; j++) {
						current = offset + i * (segmentation + 1) + j;
						next = current + 1;
						top = current + segmentation + 1;
						ntop = top + 1;
						if (level === 0) {
							result.AddPolygon (new JSM.BodyPolygon ([current, top, ntop, next]));
						} else {
							result.AddPolygon (new JSM.BodyPolygon ([current, next, ntop, top]));
						}
					}
				}
			}
			
			if (level > 0 && level <= segmentation) {
				var prevSideVertices = levelSideVertices [level - 1];
				var currSideVertices = levelSideVertices [level];
				for (i = 0; i < segmentation * 4; i++) {
					current = prevSideVertices[i];
					top = currSideVertices[i];
					if (i < segmentation * 4 - 1) {
						next = prevSideVertices[i + 1];
						ntop = currSideVertices[i + 1];
					} else {
						next = prevSideVertices[0];
						ntop = currSideVertices[0];
					}
					result.AddPolygon (new JSM.BodyPolygon ([current, next, ntop, top]));
				}
			}
		}

		var result = new JSM.Body ();

		var xStart = xSize / 2.0;
		var yStart = ySize / 2.0;
		var zStart = zSize / 2.0;
		
		var xSegment = xSize / segmentation;
		var ySegment = ySize / segmentation;
		var zSegment = zSize / segmentation;
		
		var i;
		for (i = 0; i <= segmentation; i++) {
			AddVertices (i);
		}
		
		var levelSideVertices = [];
		for (i = 0; i <= segmentation; i++) {
			levelSideVertices.push (GetLevelSideVertices (i));
		}

		for (i = 0; i <= segmentation; i++) {
			AddPolygons (i);
		}

		return result;
	};

	/**
	* Function: GenerateCircle
	* Description:	Generates a circle.
	* Parameters:
	*	radius {number} the radius of the circle
	*	segmentation {integer} the segmentation of the circle
	* Returns:
	*	{Body} the result
	*/
	JSM.GenerateCircle = function (radius, segmentation)
	{
		var result = new JSM.Body ();
		var segments = segmentation;

		var theta = 2.0 * Math.PI;
		var step = 2.0 * Math.PI / segments;
		
		var circlePoints = JSM.GenerateCirclePoints (radius, segmentation);
		var i;
		for (i = 0; i < circlePoints.length; i++) {
			result.AddVertex (new JSM.BodyVertex (circlePoints[i]));
			theta += step;
		}

		var topPolygon = new JSM.BodyPolygon ([]);
		for (i = 0; i < segments; i++) {
			topPolygon.AddVertexIndex (i);
		}
		result.AddPolygon (topPolygon);

		result.SetCylindricalTextureProjection (new JSM.Coord (0.0, 0.0, 0.0), radius, new JSM.Coord (1.0, 0.0, 0.0), new JSM.Coord (0.0, 0.0, 1.0));
		return result;
	};

	/**
	* Function: GenerateSphere
	* Description: Generates a sphere.
	* Parameters:
	*	radius {number} the radius of the sphere
	*	segmentation {integer} the segmentation of the sphere
	*	isCurved {boolean} create smooth surfaces
	* Returns:
	*	{Body} the result
	*/
	JSM.GenerateSphere = function (radius, segmentation, isCurved)
	{
		var result = new JSM.Body ();

		var segments = segmentation;
		var circle = segments * 2;

		var topIndex = result.AddVertex (new JSM.BodyVertex (JSM.SphericalToCartesian (radius, 0.0, 0.0)));
		var step = Math.PI / segments;
		var theta = step;
		
		var i, j, phi;
		for (i = 1; i < segments; i++) {
			phi = 0;
			for (j = 0; j < circle; j++) {
				result.AddVertex (new JSM.BodyVertex (JSM.SphericalToCartesian (radius, theta, phi)));
				phi += step;
			}
			theta += step;
		}
		var bottomIndex = result.AddVertex (new JSM.BodyVertex (JSM.SphericalToCartesian (-radius, 0.0, 0.0)));

		var offset, current, next, top, ntop, polygon;
		for (i = 1; i <= segments; i++) {
			if (i === 1) {
				offset = 1;
				for (j = 0; j < circle; j++) {
					current = offset + j;
					next = current + 1;
					if (j === circle - 1) {
						next = offset;
					}

					polygon = new JSM.BodyPolygon ([current, next, topIndex]);
					if (isCurved) {
						polygon.SetCurveGroup (0);
					}
					result.AddPolygon (polygon);
				}
			} else if (i < segments) {
				offset = (i - 1) * circle + 1;
				for (j = 0; j < circle; j++) {
					current = offset + j;
					next = current + 1;
					top = current - circle;
					ntop = top + 1;

					if (j === circle - 1) {
						next = offset;
						ntop = offset - circle;
					}
					
					polygon = new JSM.BodyPolygon ([current, next, ntop, top]);
					if (isCurved) {
						polygon.SetCurveGroup (0);
					}
					result.AddPolygon (polygon);
				}
			} else if (i === segments) {
				offset = (i - 2) * circle + 1;
				for (j = 0; j < circle; j++) {
					current = offset + j;
					next = current + 1;
					if (j === circle - 1) {
						next = offset;
					}
					
					polygon = new JSM.BodyPolygon ([current, bottomIndex, next]);
					if (isCurved) {
						polygon.SetCurveGroup (0);
					}
					result.AddPolygon (polygon);
				}
			}
		}

		result.SetCubicTextureProjection (new JSM.Coord (0.0, 0.0, 0.0), new JSM.Coord (1.0, 0.0, 0.0), new JSM.Coord (0.0, 1.0, 0.0), new JSM.Coord (0.0, 0.0, 1.0));
		return result;
	};

	/**
	* Function: GenerateTriangulatedSphere
	* Description: Generates a sphere from triangles.
	* Parameters:
	*	radius {number} the radius of the sphere
	*	iterations {integer} the iteration number
	*	isCurved {boolean} create smooth surfaces
	* Returns:
	*	{Body} the result
	*/
	JSM.GenerateTriangulatedSphere = function (radius, iterations, isCurved)
	{
		function GenerateIcosahedron () {
			var result = new JSM.Body ();

			var a = 1.0;
			var b = 0.0;
			var c = (1.0 + Math.sqrt (5.0)) / 2.0;

			JSM.AddVertexToBody (result, +b, +a, +c);
			JSM.AddVertexToBody (result, +b, +a, -c);
			JSM.AddVertexToBody (result, +b, -a, +c);
			JSM.AddVertexToBody (result, +b, -a, -c);

			JSM.AddVertexToBody (result, +a, +c, +b);
			JSM.AddVertexToBody (result, +a, -c, +b);
			JSM.AddVertexToBody (result, -a, +c, +b);
			JSM.AddVertexToBody (result, -a, -c, +b);

			JSM.AddVertexToBody (result, +c, +b, +a);
			JSM.AddVertexToBody (result, -c, +b, +a);
			JSM.AddVertexToBody (result, +c, +b, -a);
			JSM.AddVertexToBody (result, -c, +b, -a);

			JSM.AddPolygonToBody (result, [0, 2, 8]);
			JSM.AddPolygonToBody (result, [0, 4, 6]);
			JSM.AddPolygonToBody (result, [0, 6, 9]);
			JSM.AddPolygonToBody (result, [0, 8, 4]);
			JSM.AddPolygonToBody (result, [0, 9, 2]);
			JSM.AddPolygonToBody (result, [1, 3, 11]);
			JSM.AddPolygonToBody (result, [1, 4, 10]);
			JSM.AddPolygonToBody (result, [1, 6, 4]);
			JSM.AddPolygonToBody (result, [1, 10, 3]);
			JSM.AddPolygonToBody (result, [1, 11, 6]);
			JSM.AddPolygonToBody (result, [2, 5, 8]);
			JSM.AddPolygonToBody (result, [2, 7, 5]);
			JSM.AddPolygonToBody (result, [2, 9, 7]);
			JSM.AddPolygonToBody (result, [3, 5, 7]);
			JSM.AddPolygonToBody (result, [3, 7, 11]);
			JSM.AddPolygonToBody (result, [3, 10, 5]);
			JSM.AddPolygonToBody (result, [4, 8, 10]);
			JSM.AddPolygonToBody (result, [6, 11, 9]);
			JSM.AddPolygonToBody (result, [5, 10, 8]);
			JSM.AddPolygonToBody (result, [7, 9, 11]);

			return result;
		}

		var result = GenerateIcosahedron ();
		
		var currentRadius = result.GetVertexPosition (0).Length ();
		var scale = radius / currentRadius;

		var i, j, vertex;
		for (i = 0; i < result.VertexCount (); i++) {
			vertex = result.GetVertex (i);
			vertex.position.MultiplyScalar (scale);
		}
		
		var iteration, oldVertexCoord, oldBody, adjacencyInfo;
		var currentEdge, edgeVertexIndices;
		var currentPgon, polygonVertexIndices;
		var edgeCoord, currentPolyEdge;
		for (iteration = 0; iteration < iterations; iteration++) {
			oldBody = result;
			
			result = new JSM.Body ();
			adjacencyInfo = new JSM.AdjacencyInfo (oldBody);
			for (i = 0; i < adjacencyInfo.verts.length; i++) {
				oldVertexCoord = oldBody.GetVertexPosition (i);
				JSM.AddVertexToBody (result, oldVertexCoord.x, oldVertexCoord.y, oldVertexCoord.z);
			}
			
			edgeVertexIndices = [];
			for (i = 0; i < adjacencyInfo.edges.length; i++) {
				currentEdge = adjacencyInfo.edges[i];
				edgeCoord = JSM.MidCoord (oldBody.GetVertexPosition (currentEdge.vert1), oldBody.GetVertexPosition (currentEdge.vert2));
				edgeVertexIndices.push (result.AddVertex (new JSM.BodyVertex (edgeCoord.SetLength (radius))));
			}

			for (i = 0; i < adjacencyInfo.pgons.length; i++) {
				currentPgon = adjacencyInfo.pgons[i];
				polygonVertexIndices = [];
				for (j = 0; j < currentPgon.pedges.length; j++) {
					currentPolyEdge = currentPgon.pedges[j];
					polygonVertexIndices.push (adjacencyInfo.GetPolyEdgeStartVertex (currentPolyEdge));
					polygonVertexIndices.push (edgeVertexIndices[currentPolyEdge.index]);
				}

				JSM.AddPolygonToBody (result, [polygonVertexIndices[0], polygonVertexIndices[1], polygonVertexIndices[5]]);
				JSM.AddPolygonToBody (result, [polygonVertexIndices[1], polygonVertexIndices[2], polygonVertexIndices[3]]);
				JSM.AddPolygonToBody (result, [polygonVertexIndices[3], polygonVertexIndices[4], polygonVertexIndices[5]]);
				JSM.AddPolygonToBody (result, [polygonVertexIndices[1], polygonVertexIndices[3], polygonVertexIndices[5]]);
			}
		}

		if (isCurved) {
			for (i = 0; i < result.PolygonCount (); i++) {
				result.GetPolygon (i).SetCurveGroup (0);
			}
		}
		
		result.SetCubicTextureProjection (new JSM.Coord (0.0, 0.0, 0.0), new JSM.Coord (1.0, 0.0, 0.0), new JSM.Coord (0.0, 1.0, 0.0), new JSM.Coord (0.0, 0.0, 1.0));
		return result;
	};

	/**
	* Function: GenerateCylinder
	* Description: Generates a cylinder.
	* Parameters:
	*	radius {number} the radius of the cylinder
	*	height {number} the height of the cylinder
	*	segmentation {integer} the segmentation of the top and bottom polygons
	*	withTopAndBottom {boolean} generate top and bottom polygons
	*	isCurved {boolean} create smooth surfaces
	* Returns:
	*	{Body} the result
	*/
	JSM.GenerateCylinder = function (radius, height, segmentation, withTopAndBottom, isCurved)
	{
		var result = new JSM.Body ();
		var segments = segmentation;

		var theta = 2.0 * Math.PI;
		var step = 2.0 * Math.PI / segments;
		
		var i;
		for (i = 0; i < segments; i++) {
			result.AddVertex (new JSM.BodyVertex (JSM.CylindricalToCartesian (radius, height / 2.0, theta)));
			result.AddVertex (new JSM.BodyVertex (JSM.CylindricalToCartesian (radius, -height / 2.0, theta)));
			theta -= step;
		}

		var current, next, polygon;
		for (i = 0; i < segments; i++) {
			current = 2 * i;
			next = current + 2;
			if (i === segments - 1) {
				next = 0;
			}
			polygon = new JSM.BodyPolygon ([current, next, next + 1, current + 1]);
			if (isCurved) {
				polygon.SetCurveGroup (0);
			}
			result.AddPolygon (polygon);
		}

		if (withTopAndBottom) {
			var topPolygon = new JSM.BodyPolygon ([]);
			var bottomPolygon = new JSM.BodyPolygon ([]);
			for (i = 0; i < segments; i++) {
				topPolygon.AddVertexIndex (2 * (segments - i - 1));
				bottomPolygon.AddVertexIndex (2 * i + 1);
			}
			result.AddPolygon (topPolygon);
			result.AddPolygon (bottomPolygon);
		}

		result.SetCylindricalTextureProjection (new JSM.Coord (0.0, 0.0, -(height / 2.0)), radius, new JSM.Coord (1.0, 0.0, 0.0), new JSM.Coord (0.0, 0.0, 1.0));
		return result;
	};

	/**
	* Function: GeneratePie
	* Description: Generates a pie.
	* Parameters:
	*	radius {number} the radius of the pie
	*	height {number} the height of the pie
	*	angle {number} the angle of the pie
	*	segmentation {integer} the segmentation of the top and bottom polygons
	*	withTopAndBottom {boolean} generate top and bottom polygons
	*	isCurved {boolean} create smooth surfaces
	* Returns:
	*	{Body} the result
	*/
	JSM.GeneratePie = function (radius, height, angle, segmentation, withTopAndBottom, isCurved)
	{
		var result = new JSM.Body ();
		var segments = segmentation;

		var theta = angle;
		var step = angle / (segments - 1);
		
		var i;
		result.AddVertex (new JSM.BodyVertex (JSM.CylindricalToCartesian (0.0, height / 2.0, 0.0)));
		result.AddVertex (new JSM.BodyVertex (JSM.CylindricalToCartesian (0.0, -height / 2.0, 0.0)));
		for (i = 0; i < segments; i++) {
			result.AddVertex (new JSM.BodyVertex (JSM.CylindricalToCartesian (radius, height / 2.0, theta)));
			result.AddVertex (new JSM.BodyVertex (JSM.CylindricalToCartesian (radius, -height / 2.0, theta)));
			theta -= step;
		}

		var current, next, polygon;
		for (i = 0; i <= segments; i++) {
			current = 2 * i;
			next = current + 2;
			if (i === segments) {
				next = 0;
			}
			polygon = new JSM.BodyPolygon ([current, next, next + 1, current + 1]);
			if (isCurved && i > 0 && i < segments) {
				polygon.SetCurveGroup (0);
			}
			result.AddPolygon (polygon);
		}

		if (withTopAndBottom) {
			var topPolygon = new JSM.BodyPolygon ([]);
			var bottomPolygon = new JSM.BodyPolygon ([]);
			for (i = 0; i <= segments; i++) {
				topPolygon.AddVertexIndex (2 * (segments - i));
				bottomPolygon.AddVertexIndex (2 * i + 1);
			}
			result.AddPolygon (topPolygon);
			result.AddPolygon (bottomPolygon);
		}

		result.SetCylindricalTextureProjection (new JSM.Coord (0.0, 0.0, -(height / 2.0)), radius, new JSM.Coord (1.0, 0.0, 0.0), new JSM.Coord (0.0, 0.0, 1.0));
		return result;
	};

	/**
	* Function: GenerateCone
	* Description: Generates a cone.
	* Parameters:
	*	topRadius {number} the top radius of the cone
	*	bottomRadius {number} the bottom radius of the cone
	*	height {number} the height of the cone
	*	segmentation {integer} the segmentation of the top and bottom polygons
	*	withTopAndBottom {boolean} generate top and bottom polygons
	*	isCurved {boolean} create smooth surfaces
	* Returns:
	*	{Body} the result
	*/
	JSM.GenerateCone = function (topRadius, bottomRadius, height, segmentation, withTopAndBottom, isCurved)
	{
		var result = new JSM.Body ();
		var segments = segmentation;

		var topDegenerated = (JSM.IsZero (topRadius));
		var bottomDegenerated = (JSM.IsZero (bottomRadius));

		var theta = 2.0 * Math.PI;
		var step = 2.0 * Math.PI / segments;

		if (topDegenerated) {
			result.AddVertex (new JSM.BodyVertex (JSM.CylindricalToCartesian (0.0, height / 2.0, 0.0)));
		}
		
		var i;
		for (i = 0; i < segments; i++) {
			if (!topDegenerated) {
				result.AddVertex (new JSM.BodyVertex (JSM.CylindricalToCartesian (topRadius, height / 2.0, theta)));
			}
			if (!bottomDegenerated) {
				result.AddVertex (new JSM.BodyVertex (JSM.CylindricalToCartesian (bottomRadius, -height / 2.0, theta)));
			}
			theta -= step;
		}
		if (bottomDegenerated) {
			result.AddVertex (new JSM.BodyVertex (JSM.CylindricalToCartesian (0.0, -height / 2.0, 0.0)));
		}

		var current, next, polygon;
		for (i = 0; i < segments; i++) {
			if (topDegenerated) {
				current = i + 1;
				next = current + 1;
				if (i === segments - 1) {
					next = 1;
				}
				polygon = new JSM.BodyPolygon ([0, next, current]);
				if (isCurved) {
					polygon.SetCurveGroup (0);
				}
				result.AddPolygon (polygon);
			} else if (bottomDegenerated) {
				current = i;
				next = current + 1;
				if (i === segments - 1) {
					next = 0;
				}
				polygon = new JSM.BodyPolygon ([current, next, segments]);
				if (isCurved) {
					polygon.SetCurveGroup (0);
				}
				result.AddPolygon (polygon);
			} else {
				current = 2 * i;
				next = current + 2;
				if (i === segments - 1) {
					next = 0;
				}
				polygon = new JSM.BodyPolygon ([current, next, next + 1, current + 1]);
				if (isCurved) {
					polygon.SetCurveGroup (0);
				}
				result.AddPolygon (polygon);
			}
		}

		var topPolygon, bottomPolygon;
		if (withTopAndBottom) {
			if (topDegenerated) {
				bottomPolygon = new JSM.BodyPolygon ([]);
				for (i = 0; i < segments; i++) {
					bottomPolygon.AddVertexIndex (i + 1);
				}
				result.AddPolygon (bottomPolygon);
			} else if (bottomDegenerated) {
				topPolygon = new JSM.BodyPolygon ([]);
				for (i = 0; i < segments; i++) {
					topPolygon.AddVertexIndex (segments - i - 1);
				}
				result.AddPolygon (topPolygon);
			} else {
				topPolygon = new JSM.BodyPolygon ([]);
				bottomPolygon = new JSM.BodyPolygon ([]);
				for (i = 0; i < segments; i++) {
					topPolygon.AddVertexIndex (2 * (segments - i - 1));
					bottomPolygon.AddVertexIndex (2 * i + 1);
				}
				result.AddPolygon (topPolygon);
				result.AddPolygon (bottomPolygon);
			}
		}

		var avgRadius = (topRadius + bottomRadius) / 2.0;
		result.SetCylindricalTextureProjection (new JSM.Coord (0.0, 0.0, -(height / 2.0)), avgRadius, new JSM.Coord (1.0, 0.0, 0.0), new JSM.Coord (0.0, 0.0, 1.0));
		return result;
	};

	/**
	* Function: GeneratePrismGeometry
	* Description: Generates a prism defined by bottom and top vertices polygon.
	* Parameters:
	*	bottomVertices {Coord[*]} bottom vertices
	*	topVertices {Coord[*]} top vertices
	*	withTopAndBottom {boolean} generate top and bottom polygons
	* Returns:
	*	{Body} the result
	*/
	JSM.GeneratePrismGeometry = function (bottomVertices, topVertices, withTopAndBottom)
	{
		var result = new JSM.Body ();
		var count = bottomVertices.length;
		
		var i;
		for (i = 0; i < count; i++) {
			result.AddVertex (new JSM.BodyVertex (bottomVertices[i].Clone ()));
			result.AddVertex (new JSM.BodyVertex (topVertices[i].Clone ()));
		}

		var current, next, bodyPolygon;
		for (i = 0; i < count; i++) {
			current = 2 * i;
			next = current + 2;
			if (i === count - 1) {
				next = 0;
			}
			bodyPolygon = new JSM.BodyPolygon ([current, next, next + 1, current + 1]);
			result.AddPolygon (bodyPolygon);
		}

		if (withTopAndBottom) {
			var topPolygon = new JSM.BodyPolygon ([]);
			var bottomPolygon = new JSM.BodyPolygon ([]);
			for (i = 0; i < count; i++) {
				topPolygon.AddVertexIndex (2 * i + 1);
				bottomPolygon.AddVertexIndex (2 * (count - i - 1));
			}
			result.AddPolygon (topPolygon);
			result.AddPolygon (bottomPolygon);
		}
		
		return result;
	};

	/**
	* Function: GeneratePrismFromPolygon
	* Description: Generates a prism defined by a polygon.
	* Parameters:
	*	polygon {Polygon2D} the base polygon
	*	height {number} the height of the prism
	*	withTopAndBottom {boolean} generate top and bottom polygons
	*	curveAngle {number} if not null, defines the curve angle of the prism
	* Returns:
	*	{Body} the result
	*/
	JSM.GeneratePrismFromPolygon = function (polygon, height, withTopAndBottom, curveAngle)
	{
		var bottomVertices = [];
		var topVertices = [];
		var i, vertex;
		var count = polygon.VertexCount ();
		for (i = 0; i < count; i++) {
			vertex = polygon.GetVertex (i);
			bottomVertices.push (new JSM.Coord (vertex.x, vertex.y, 0.0));
			topVertices.push (new JSM.Coord (vertex.x, vertex.y, height));
		}

		var result = JSM.GeneratePrismGeometry (bottomVertices, topVertices, withTopAndBottom);
		if (curveAngle !== undefined && curveAngle !== null) {
			var curveGroups = JSM.CalculatePolygonCurveGroups (polygon, curveAngle);
			var bodyPolygon;
			for (i = 0; i < count; i++) {
				bodyPolygon = result.GetPolygon (i);
				bodyPolygon.SetCurveGroup (curveGroups[i]);
			}
		}
		
		var origo = bottomVertices[0].Clone ();
		var firtVertex = bottomVertices[1].Clone ();
		var firstDirection = JSM.CoordSub (firtVertex, origo).Normalize ();
		var e3 = new JSM.Vector (0.0, 0.0, 1.0);
		var e2 = JSM.VectorCross (e3, firstDirection);
		var e1 = JSM.VectorCross (e2, e3);

		result.SetCubicTextureProjection (origo, e1, e2, e3);
		return result;
	};

	/**
	* Function: GeneratePrism
	* Description:
	*	Generates a prism defined by a polygon. The base polygon is an array
	*	of coordinates which will be offseted in the given direction.
	* Parameters:
	*	basePolygon {Coord[*]} the base polygon
	*	direction {Vector} the vector of the offset
	*	height {number} the height of the prism
	*	withTopAndBottom {boolean} generate top and bottom polygons
	*	curveAngle {number} if not null, defines the curve angle of the prism
	* Returns:
	*	{Body} the result
	*/
	JSM.GeneratePrism = function (basePolygon, direction, height, withTopAndBottom, curveAngle)
	{
		var polygon = new JSM.Polygon ();
		polygon.FromArray (basePolygon);
		var count = polygon.VertexCount ();


		var bottomVertices = [];
		var topVertices = [];
		var i;
		for (i = 0; i < count; i++) {
			bottomVertices.push (polygon.GetVertex (i).Clone ());
			topVertices.push (polygon.GetVertex (i).Clone ().Offset (direction, height));
		}

		var result = JSM.GeneratePrismGeometry (bottomVertices, topVertices, withTopAndBottom);
		
		if (curveAngle !== undefined && curveAngle !== null) {
			var curveGroups = JSM.CalculatePolygonCurveGroups (polygon, curveAngle);
			var bodyPolygon;
			for (i = 0; i < count; i++) {
				bodyPolygon = result.GetPolygon (i);
				bodyPolygon.SetCurveGroup (curveGroups[i]);
			}
		}
		
		var origo = polygon.GetVertex (0).Clone ();
		var firtVertex = polygon.GetVertex (1).Clone ();
		var firstDirection = JSM.CoordSub (firtVertex, origo).Normalize ();
		var e3 = direction.Clone ().Normalize ();
		var e2 = JSM.VectorCross (e3, firstDirection);
		var e1 = JSM.VectorCross (e2, e3);

		result.SetCubicTextureProjection (origo, e1, e2, e3);
		return result;
	};

	/**
	* Function: GeneratePrismWithHole
	* Description:
	*	Generates a prism defined by a polygon. The polygon can contain null
	*	values which defines the end of the current contour. The holes have
	*	to be in reversed orientation than the main contour.
	* Parameters:
	*	basePolygon {Coord[*]} the base polygon which can contain null values
	*	direction {Vector} the vector of the offset
	*	height {number} the height of the prism
	*	withTopAndBottom {boolean} generate top and bottom polygons
	*	curveAngle {number} if not null, defines the curve angle of the prism
	* Returns:
	*	{Body} the result
	*/
	JSM.GeneratePrismWithHole = function (basePolygon, direction, height, withTopAndBottom, curveAngle)
	{
		function AddVertices (contourPolygon, direction, height, result)
		{
			var i, j, contour, vertex1, vertex2;
			for (i = 0; i < contourPolygon.ContourCount (); i++) {
				contour = contourPolygon.GetContour (i);
				for (j = 0; j < contour.VertexCount (); j++) {
					vertex1 = contour.GetVertex (j).Clone ();
					vertex2 = contour.GetVertex (j).Clone ().Offset (direction, height);
					result.AddVertex (new JSM.BodyVertex (vertex1));
					result.AddVertex (new JSM.BodyVertex (vertex2));
				}
			}
		}

		function AddContours (contourPolygon, contourOffsets, curveAngle, result)
		{
			var offset = 0;

			var i, j, contour, vertexCount, current, next, bodyPolygon, curveGroups;
			for (i = 0; i < contourPolygon.ContourCount (); i++) {
				contour = contourPolygon.GetContour (i);
				curveGroups = null;
				if (curveAngle !== undefined && curveAngle !== null) {
					curveGroups = JSM.CalculatePolygonCurveGroups (contour, curveAngle);
				}		
				vertexCount = contour.VertexCount ();
				contourOffsets.push (offset);
				for (j = 0; j < vertexCount; j++) {
					current = 2 * offset + 2 * j;
					next = current + 2;
					if (j == vertexCount - 1) {
						next = 2 *  offset;
					}
					bodyPolygon = new JSM.BodyPolygon ([current, next, next + 1, current + 1]);
					if (curveGroups !== null) {
						bodyPolygon.SetCurveGroup (curveGroups[j]);
					}
					result.AddPolygon (bodyPolygon);
				}
				offset += vertexCount;
			}
		}
		
		function AddTopBottomPolygons (contourPolygon, contourOffsets)
		{
			var vertexMap = [];
			var contourPolygon2D = contourPolygon.ToContourPolygon2D ();
			var simplePolygon = JSM.ConvertContourPolygonToPolygon2D (contourPolygon2D, vertexMap);
			if (simplePolygon === null) {
				return;
			}
			
			var triangles = JSM.TriangulatePolygon2D (simplePolygon);
			if (triangles === null) {
				return;
			}
			
			var i, j, triangle, mapValue;
			var topTriangle, bottomTriangle;
			for (i = 0; i < triangles.length; i++) {
				triangle = triangles[i];
				topTriangle = new JSM.BodyPolygon ([]);
				bottomTriangle = new JSM.BodyPolygon ([]);
				for (j = 0; j < 3; j++) {
					mapValue = vertexMap[triangle[j]];
					topTriangle.AddVertexIndex (2 * contourOffsets[mapValue[0]] + 2 * mapValue[1] + 1);
					mapValue = vertexMap[triangle[2 - j]];
					bottomTriangle.AddVertexIndex (2 * contourOffsets[mapValue[0]] + 2 * mapValue[1]);
				}
				result.AddPolygon (topTriangle);
				result.AddPolygon (bottomTriangle);
			}
		}

		var result = new JSM.Body ();
		var contourOffsets = [];
		var contourPolygon = new JSM.ContourPolygon ();
		contourPolygon.FromArray (basePolygon);
		AddVertices (contourPolygon, direction, height, result);
		AddContours (contourPolygon, contourOffsets, curveAngle, result);

		if (withTopAndBottom) {
			AddTopBottomPolygons (contourPolygon, contourOffsets);
		}

		var firstDirection = JSM.CoordSub (basePolygon[1], basePolygon[0]).Normalize ();
		var origo = new JSM.Coord (basePolygon[0].x, basePolygon[0].y, basePolygon[0].z);
		var e3 = direction.Clone ().Normalize ();
		var e2 = JSM.VectorCross (e3, firstDirection);
		var e1 = JSM.VectorCross (e2, e3);

		result.SetCubicTextureProjection (origo, e1, e2, e3);
		return result;
	};

	/**
	* Function: GeneratePrismsFromPath2D
	* Description: Generates a prism from the given path.
	* Parameters:
	*	path {Path2D} the path
	*	height {number} the height of the prism
	*	width {number} the width of the prism sides
	*	withTopAndBottom {boolean} generate top and bottom polygons
	* Returns:
	*	{Body[*]} the result
	*/
	JSM.GeneratePrismsFromPath2D = function (path, height, withTopAndBottom, curveAngle)
	{
		function GetPrismPolygon (polygon)
		{
			var result = [];
			var i, j, contour, vertex;
			for (i = 0; i < polygon.ContourCount (); i++) {
				contour = polygon.GetContour (i);
				for (j = 0; j < contour.VertexCount (); j++) {
					vertex = contour.GetVertex (j);
					result.push (new JSM.Coord (vertex.x, vertex.y, 0.0));
				}
				if (i < polygon.ContourCount () - 1) {
					result.push (null);
				}
			}
			return result;
		}

		var bodies = [];
		var polygons = path.GetPolygons ();
		var direction = new JSM.Vector (0.0, 0.0, 1.0);
		var i, polygon;
		for (i = 0; i < polygons.length; i++) {
			polygon = polygons[i];
			if (polygon.ContourCount () === 1) {
				bodies.push (JSM.GeneratePrism (GetPrismPolygon (polygon), direction, height, withTopAndBottom, curveAngle));
			} else if (polygon.ContourCount () > 1) {
				bodies.push (JSM.GeneratePrismWithHole (GetPrismPolygon (polygon), direction, height, withTopAndBottom, curveAngle));
			}
		}
		return bodies;
	};

	/**
	* Function: GeneratePrismShell
	* Description: Generates a prism with the given width of sides.
	* Parameters:
	*	basePolygon {Coord[*]} the base polygon
	*	direction {Vector} the vector of the offset
	*	height {number} the height of the prism
	*	width {number} the width of the prism sides
	*	withTopAndBottom {boolean} generate top and bottom polygons
	* Returns:
	*	{Body} the result
	*/
	JSM.GeneratePrismShell = function (basePolygon, direction, height, width, withTopAndBottom)
	{
		var result = new JSM.Body ();
		var count = basePolygon.length;

		var i;
		for (i = 0; i < count; i++) {
			result.AddVertex (new JSM.BodyVertex (basePolygon[i]));
		}

		var polygon = new JSM.Polygon ();
		polygon.vertices = basePolygon;
		var offsetedPolygon = JSM.OffsetPolygonContour (polygon, width);
		var innerBasePolygon = offsetedPolygon.vertices;
		for (i = 0; i < count; i++) {
			result.AddVertex (new JSM.BodyVertex (innerBasePolygon[i]));
		}

		var offseted;
		for (i = 0; i < count; i++) {
			offseted = basePolygon[i].Clone ().Offset (direction, height);
			result.AddVertex (new JSM.BodyVertex (offseted));
		}

		for (i = 0; i < count; i++) {
			offseted = innerBasePolygon[i].Clone ().Offset (direction, height);
			result.AddVertex (new JSM.BodyVertex (offseted));
		}

		var curr, next, top, ntop;
		for (i = 0; i < count; i++) {
			curr = i;
			next = curr + 1;
			top = curr + 2 * count;
			ntop = top + 1;
			if (i === count - 1) {
				next = 0;
				ntop = 2 * count;
			}
			result.AddPolygon (new JSM.BodyPolygon ([curr, next, ntop, top]));
			result.AddPolygon (new JSM.BodyPolygon ([curr + count, top + count, ntop + count, next + count]));
		}

		if (withTopAndBottom) {
			for (i = 0; i < count; i++) {
				curr = i;
				next = curr + 1;
				top = i + count;
				ntop = top + 1;
				if (i === count - 1) {
					next = 0;
					ntop = count;
				}
				result.AddPolygon (new JSM.BodyPolygon ([curr, top, ntop, next]));
				result.AddPolygon (new JSM.BodyPolygon ([curr + 2 * count, next + 2 * count, ntop + 2 * count, top + 2 * count]));
			}
		}

		var firstDirection = JSM.CoordSub (basePolygon[1], basePolygon[0]).Normalize ();
		var origo = new JSM.Coord (basePolygon[0].x, basePolygon[0].y, basePolygon[0].z);
		var e3 = direction.Clone ().Normalize ();
		var e2 = JSM.VectorCross (e3, firstDirection);
		var e1 = JSM.VectorCross (e2, e3);

		result.SetCubicTextureProjection (origo, e1, e2, e3);
		return result;
	};

	/**
	* Function: GenerateCylinderShell
	* Description: Generates a cylinder with the given width of sides.
	* Parameters:
	*	radius {number} the radius of the cylinder
	*	height {number} the height of the cylinder
	*	width {number} the width of the cylinder sides
	*	segmentation {integer} the segmentation of the top and bottom polygons
	*	withTopAndBottom {boolean} generate top and bottom polygons
	*	isCurved {boolean} create smooth surfaces
	* Returns:
	*	{Body} the result
	*/
	JSM.GenerateCylinderShell = function (radius, height, width, segmentation, withTopAndBottom, isCurved)
	{
		function GenerateCircle (radius, segmentation, bottom)
		{
			var result = [];
			var step = 2.0 * Math.PI / segmentation;
			var theta, cartesian;
			var i = 0;
			for (i = 0; i < segmentation; i++) {
				theta = i * step;
				cartesian = JSM.PolarToCartesian (radius, theta);
				result.push (new JSM.Coord (cartesian.x, cartesian.y, bottom));
			}
			return result;
		}

		var normal = new JSM.Vector (0.0, 0.0, 1.0);
		var circle = GenerateCircle (radius, segmentation, -height / 2.0);
		var result = JSM.GeneratePrismShell (circle, normal, height, width, withTopAndBottom);
		
		var i;
		if (isCurved) {
			for (i = 0; i < segmentation; i++) {
				result.GetPolygon (2 * i).SetCurveGroup (0);
				result.GetPolygon (2 * i + 1).SetCurveGroup (0);
			}
		}
		
		return result;
	};

	/**
	* Function: GenerateLineShell
	* Description: Generates a polyline with width and height.
	* Parameters:
	*	basePolyLine {Coord[*]} the base polyline
	*	direction {Vector} the vector of the offset
	*	height {number} the height of the shell
	*	width {number} the width of the shell
	*	withStartAndEnd {boolean} generate start and end polygons
	*	withTopAndBottom {boolean} generate top and bottom polygons
	* Returns:
	*	{Body} the result
	*/
	JSM.GenerateLineShell = function (basePolyLine, direction, height, width, withStartAndEnd, withTopAndBottom)
	{
		var result = new JSM.Body ();
		var count = basePolyLine.length;

		var angles = [];
		
		var i, prev, curr, next;
		var prevDir, nextDir, angle;
		for (i = 0; i < count; i++) {
			if (i === 0 || i === count - 1) {
				angle = Math.PI / 2.0;
			} else {
				prev = i - 1;
				curr = i;
				next = i + 1;

				nextDir = JSM.CoordSub (basePolyLine[next], basePolyLine[curr]);
				prevDir = JSM.CoordSub (basePolyLine[prev], basePolyLine[curr]);
				angle = nextDir.AngleTo (prevDir) / 2.0;
				if (JSM.CoordOrientation (basePolyLine[prev], basePolyLine[curr], basePolyLine[next], direction) == JSM.Orientation.Clockwise) {
					angle = Math.PI - angle;
				}
			}
			
			angles.push (angle);
		}

		var normal = new JSM.Vector (0, 0, 1);
		var innerBasePolyLine = [];
		var distance, innerCoord, offsetDirection;
		for (i = 0; i < count; i++) {
			curr = i;
			if (i === count - 1) {
				offsetDirection = JSM.CoordSub (basePolyLine[curr - 1], basePolyLine[curr]);
			} else {
				next = (i + 1) % count;
				offsetDirection = JSM.CoordSub (basePolyLine[curr], basePolyLine[next]);
			}

			angle = angles[curr];
			distance = width / Math.sin (angle);
			innerCoord = basePolyLine[curr].Clone ();
			innerCoord.Offset (offsetDirection, distance);
			innerCoord.Rotate (normal, -(Math.PI - angle), basePolyLine[curr]);
			innerBasePolyLine.push (innerCoord);
		}

		for (i = 0; i < count; i++) {
			result.AddVertex (new JSM.BodyVertex (basePolyLine[i]));
		}

		for (i = 0; i < count; i++) {
			result.AddVertex (new JSM.BodyVertex (innerBasePolyLine[i]));
		}

		var offseted;
		for (i = 0; i < count; i++) {
			offseted = basePolyLine[i].Clone ().Offset (direction, height);
			result.AddVertex (new JSM.BodyVertex (offseted));
		}

		for (i = 0; i < count; i++) {
			offseted = innerBasePolyLine[i].Clone ().Offset (direction, height);
			result.AddVertex (new JSM.BodyVertex (offseted));
		}

		var top, ntop;
		for (i = 0; i < count - 1; i++) {
			curr = i;
			next = curr + 1;
			top = curr + 2 * count;
			ntop = top + 1;
			result.AddPolygon (new JSM.BodyPolygon ([curr, next, ntop, top]));
			result.AddPolygon (new JSM.BodyPolygon ([curr + count, top + count, ntop + count, next + count]));
		}

		if (withStartAndEnd) {
			curr = 0;
			next = curr + count;
			top = curr + 2 * count;
			ntop = curr + 3 * count;
			result.AddPolygon (new JSM.BodyPolygon ([curr, top, ntop, next]));

			curr = count - 1;
			next = curr + count;
			top = curr + 2 * count;
			ntop = curr + 3 * count;
			result.AddPolygon (new JSM.BodyPolygon ([curr, next, ntop, top]));
		}

		if (withTopAndBottom) {
			for (i = 0; i < count - 1; i++) {
				curr = i;
				next = curr + 1;
				top = i + count;
				ntop = top + 1;
				result.AddPolygon (new JSM.BodyPolygon ([curr, top, ntop, next]));
				result.AddPolygon (new JSM.BodyPolygon ([curr + 2 * count, next + 2 * count, ntop + 2 * count, top + 2 * count]));
			}
		}

		var firstDirection = JSM.CoordSub (basePolyLine[1], basePolyLine[0]).Normalize ();
		var origo = new JSM.Coord (basePolyLine[0].x, basePolyLine[0].y, basePolyLine[0].z);
		var e3 = direction.Clone ().Normalize ();
		var e2 = JSM.VectorCross (e3, firstDirection);
		var e1 = JSM.VectorCross (e2, e3);

		result.SetCubicTextureProjection (origo, e1, e2, e3);
		return result;
	};

	/**
	* Function: GenerateTorus
	* Description: Generates a torus.
	* Parameters:
	*	outerRadius {number} the outer radius of the torus
	*	innerRadius {number} the inner radius of the torus
	*	outerSegmentation {integer} the outer segmentation of the torus
	*	innerSegmentation {integer} the inner segmentation of the torus
	*	isCurved {boolean} create smooth surfaces
	* Returns:
	*	{Body} the result
	*/
	JSM.GenerateTorus = function (outerRadius, innerRadius, outerSegmentation, innerSegmentation, isCurved)
	{
		var result = new JSM.Body ();
		
		var theta = 0.0;
		var step = 2.0 * Math.PI / innerSegmentation;
		
		var circle = [];
		
		var i, coord2D, coord;
		for (i = 0; i < innerSegmentation; i++) {
			coord2D = JSM.PolarToCartesian (innerRadius, theta);
			coord = new JSM.Coord (coord2D.x + outerRadius, 0.0, coord2D.y);
			circle.push (coord);
			theta += step;
		}

		var axisDir = new JSM.Coord (0.0, 0.0, 1.0);
		var origo = new JSM.Coord (0.0, 0.0, 0.0);
		
		step = (2.0 * Math.PI) / outerSegmentation;
		var j, rotated;
		for (i = 0; i < outerSegmentation; i++) {
			for (j = 0; j < innerSegmentation; j++) {
				rotated = circle[j].Clone ().Rotate (axisDir, i * step, origo);
				result.AddVertex (new JSM.BodyVertex (rotated));
			}
		}

		var polygon, current, top, next, ntop;
		for (i = 0; i < outerSegmentation; i++) {
			polygon = new JSM.BodyPolygon ([]);
			for (j = 0; j < innerSegmentation; j++) {
				current = i * innerSegmentation + j;
				next = current + innerSegmentation;
				top = current + 1;
				ntop = next + 1;
				
				if (j === innerSegmentation - 1) {
					top = (i * innerSegmentation);
					ntop = (i + 1) * innerSegmentation;
				}

				if (i === outerSegmentation - 1) {
					next = j;
					ntop = j + 1;
					if (j === innerSegmentation - 1) {
						ntop = 0;
					}
				}

				polygon = new JSM.BodyPolygon ([current, next, ntop, top]);
				if (isCurved) {
					polygon.SetCurveGroup (0);
				}
				result.AddPolygon (polygon);
			}
		}
		
		result.SetCubicTextureProjection (new JSM.Coord (0.0, 0.0, 0.0), new JSM.Coord (1.0, 0.0, 0.0), new JSM.Coord (0.0, 1.0, 0.0), new JSM.Coord (0.0, 0.0, 1.0));
		return result;
	};

	/**
	* Function: GeneratePolyTorus
	* Description: Generates a torus with a polygon cross section.
	* Parameters:
	*	basePolygon {Coord2D[*]} the cross section polygon of the torus
	*	outerRadius {number} the outer radius of the torus
	*	outerSegmentation {integer} the outer segmentation of the torus
	*	isCurved {boolean} create smooth surfaces
	* Returns:
	*	{Body} the result
	*/
	JSM.GeneratePolyTorus = function (basePolygon, outerRadius, outerSegmentation, isCurved)
	{
		var result = new JSM.Body ();
		
		var innerSegmentation = basePolygon.length;
		var theta = 2.0 * Math.PI;
		var step = 2.0 * Math.PI / innerSegmentation;
		
		var circle = [];
		
		var i, coord2D, coord;
		for (i = 0; i < innerSegmentation; i++) {
			coord2D = basePolygon[i];
			coord = new JSM.Coord (coord2D.x + outerRadius, 0.0, coord2D.y);
			circle.push (coord);
			theta -= step;
		}

		var axisDir = new JSM.Coord (0.0, 0.0, 1.0);
		var origo = new JSM.Coord (0.0, 0.0, 0.0);
		
		step = (2.0 * Math.PI) / outerSegmentation;
		var j, rotated;
		for (i = 0; i < outerSegmentation; i++) {
			for (j = 0; j < innerSegmentation; j++) {
				rotated = circle[j].Clone ().Rotate (axisDir, i * step, origo);
				result.AddVertex (new JSM.BodyVertex (rotated));
			}
		}

		var polygon, current, top, next, ntop;
		for (i = 0; i < outerSegmentation; i++) {
			polygon = new JSM.BodyPolygon ([]);
			for (j = 0; j < innerSegmentation; j++) {
				current = i * innerSegmentation + j;
				next = current + innerSegmentation;
				top = current + 1;
				ntop = next + 1;
				
				if (j === innerSegmentation - 1) {
					top = (i * innerSegmentation);
					ntop = (i + 1) * innerSegmentation;
				}

				if (i === outerSegmentation - 1) {
					next = j;
					ntop = j + 1;
					if (j === innerSegmentation - 1) {
						ntop = 0;
					}
				}

				polygon = new JSM.BodyPolygon ([current, next, ntop, top]);
				if (isCurved) {
					polygon.SetCurveGroup (j);
				}
				result.AddPolygon (polygon);
			}
		}
		
		result.SetCubicTextureProjection (new JSM.Coord (0.0, 0.0, 0.0), new JSM.Coord (1.0, 0.0, 0.0), new JSM.Coord (0.0, 1.0, 0.0), new JSM.Coord (0.0, 0.0, 1.0));
		return result;
	};

	/**
	* Function: GenerateRuledFromSectors
	* Description: Generates a ruled surface between two sectors.
	* Parameters:
	*	aSector {Sector} the first sector
	*	bSector {Sector} the second sector
	*	lineSegmentation {integer} the segmentation along sectors
	*	meshSegmentation {integer} the segmentation along surface
	*	isCurved {boolean} create smooth surfaces
	* Returns:
	*	{Body} the result
	*/
	JSM.GenerateRuledFromSectors = function (aSector, bSector, lineSegmentation, meshSegmentation, isCurved)
	{
		var result = new JSM.Body ();

		var aCoords = JSM.GetSectorSegmentation (aSector, lineSegmentation);
		var bCoords = JSM.GetSectorSegmentation (bSector, lineSegmentation);

		var vertices = [];
		var polygons = [];
		JSM.GetRuledMesh (aCoords, bCoords, meshSegmentation, vertices, polygons);

		var i;
		for (i = 0; i < vertices.length; i++) {
			result.AddVertex (new JSM.BodyVertex (vertices[i]));
		}

		var polygon, polygonVertexIndices;
		for (i = 0; i < polygons.length; i++) {
			polygonVertexIndices = polygons[i];
			polygon = new JSM.BodyPolygon (polygonVertexIndices);
			if (isCurved) {
				polygon.SetCurveGroup (0);
			}
			result.AddPolygon (polygon);
		}

		result.SetCubicTextureProjection (new JSM.Coord (0.0, 0.0, 0.0), new JSM.Coord (1.0, 0.0, 0.0), new JSM.Coord (0.0, 1.0, 0.0), new JSM.Coord (0.0, 0.0, 1.0));
		return result;
	};

	/**
	* Function: GenerateGrid
	* Description: Generates a planar grid.
	* Parameters:
	*	xSize {number} the x size
	*	ySize {number} the y size
	*	xSegmentation {integer} the segmentation along x axis
	*	ySegmentation {integer} the segmentation along y axis
	*	isCurved {boolean} create smooth surfaces
	* Returns:
	*	{Body} the result
	*/
	JSM.GenerateGrid = function (xSize, ySize, xSegmentation, ySegmentation, isCurved)
	{
		var xSector = new JSM.Sector (new JSM.Coord (0.0, 0.0, 0.0), new JSM.Coord (xSize, 0.0, 0.0));
		var ySector = new JSM.Sector (new JSM.Coord (0.0, ySize, 0.0), new JSM.Coord (xSize, ySize, 0.0));
		return JSM.GenerateRuledFromSectors (xSector, ySector, xSegmentation, ySegmentation, isCurved);
	};

	/**
	* Function: GenerateSquareGrid
	* Description: Generates a planar square grid.
	* Parameters:
	*	size {number} the size
	*	segmentation {integer} the segmentation
	*	isCurved {boolean} create smooth surfaces
	* Returns:
	*	{Body} the result
	*/
	JSM.GenerateSquareGrid = function (size, segmentation, isCurved)
	{
		return JSM.GenerateGrid (size, size, segmentation, segmentation, isCurved);
	};

	/**
	* Function: GenerateRuledFromSectorsWithHeight
	* Description: Generates a ruled surface with height between two sectors.
	* Parameters:
	*	aSector {Sector} the first sector
	*	bSector {Sector} the second sector
	*	lineSegmentation {integer} the segmentation along sectors
	*	meshSegmentation {integer} the segmentation along surface
	*	isCurved {boolean} create smooth surfaces
	*	height {height} the height
	* Returns:
	*	{Body} the result
	*/
	JSM.GenerateRuledFromSectorsWithHeight = function (aSector, bSector, lineSegmentation, meshSegmentation, isCurved, height)
	{
		var result = new JSM.Body ();

		var aCoords = JSM.GetSectorSegmentation (aSector, lineSegmentation);
		var bCoords = JSM.GetSectorSegmentation (bSector, lineSegmentation);

		var vertices = [];
		var polygons = [];
		JSM.GetRuledMesh (aCoords, bCoords, meshSegmentation, vertices, polygons);

		var i;
		for (i = 0; i < vertices.length; i++) {
			result.AddVertex (new JSM.BodyVertex (vertices[i]));
		}

		var polygon, polygonVertexIndices;
		for (i = 0; i < polygons.length; i++) {
			polygonVertexIndices = polygons[i];
			polygon = new JSM.BodyPolygon (polygonVertexIndices);
			if (isCurved) {
				polygon.SetCurveGroup (0);
			}
			result.AddPolygon (polygon);
		}
		
		var topVertexCount = result.VertexCount ();

		var newVertex, vertex;
		for (i = 0; i < vertices.length; i++) {
			vertex = vertices[i];
			newVertex = new JSM.Coord (vertex.x, vertex.y, vertex.z);
			newVertex.z -= height;
			result.AddVertex (new JSM.BodyVertex (newVertex));
		}

		var j, newpolygonVertexIndices;
		for (i = 0; i < polygons.length; i++) {
			polygonVertexIndices = polygons[i];
			newpolygonVertexIndices = [];
			for (j = polygonVertexIndices.length - 1; j >= 0; j--) {
				newpolygonVertexIndices.push (polygonVertexIndices[j] + topVertexCount);
			}
			polygon = new JSM.BodyPolygon (newpolygonVertexIndices);
			if (isCurved) {
				polygon.SetCurveGroup (0);
			}
			result.AddPolygon (polygon);
		}

		var current, next, top, ntop;
		
		for (i = 0; i < meshSegmentation; i++) {
			current = i + topVertexCount;
			next = current + 1;
			top = current - topVertexCount;
			ntop = top + 1;
			polygon = new JSM.BodyPolygon ([current, next, ntop, top]);
			result.AddPolygon (polygon);
		}

		for (i = 0; i < meshSegmentation; i++) {
			current = i + (lineSegmentation * (meshSegmentation + 1)) + topVertexCount;
			next = current + 1;
			top = current - topVertexCount;
			ntop = top + 1;
			polygon = new JSM.BodyPolygon ([current, top, ntop, next]);
			result.AddPolygon (polygon);
		}

		for (i = 0; i < lineSegmentation; i++) {
			current = i * (meshSegmentation + 1) + topVertexCount;
			next = current + meshSegmentation + 1;
			top = current - topVertexCount;
			ntop = top + meshSegmentation + 1;
			polygon = new JSM.BodyPolygon ([current, top, ntop, next]);
			result.AddPolygon (polygon);
		}

		for (i = 0; i < lineSegmentation; i++) {
			current = (i + 1) * meshSegmentation + i + topVertexCount;
			next = current + meshSegmentation + 1;
			top = current - topVertexCount;
			ntop = top + meshSegmentation + 1;
			polygon = new JSM.BodyPolygon ([current, next, ntop, top]);
			result.AddPolygon (polygon);
		}

		result.SetCubicTextureProjection (new JSM.Coord (0.0, 0.0, 0.0), new JSM.Coord (1.0, 0.0, 0.0), new JSM.Coord (0.0, 1.0, 0.0), new JSM.Coord (0.0, 0.0, 1.0));
		return result;
	};

	/**
	* Function: GenerateRuledFromCoords
	* Description:
	*	Generates a ruled surface between two coordinate arrays.
	*	The two arrays should have the same length.
	* Parameters:
	*	aCoords {Coord[*]} the first coordinate array
	*	bCoords {Coord[*]} the second coordinate array
	*	meshSegmentation {integer} the segmentation along surface
	*	isCurved {boolean} create smooth surfaces
	* Returns:
	*	{Body} the result
	*/
	JSM.GenerateRuledFromCoords = function (aCoords, bCoords, meshSegmentation, isCurved)
	{
		var result = new JSM.Body ();
		var vertices = [];
		var polygons = [];

		JSM.GetRuledMesh (aCoords, bCoords, meshSegmentation, vertices, polygons);

		var i;
		for (i = 0; i < vertices.length; i++) {
			result.AddVertex (new JSM.BodyVertex (vertices[i]));
		}

		var polygon;
		for (i = 0; i < polygons.length; i++) {
			vertices = polygons[i];
			polygon = new JSM.BodyPolygon (vertices);
			if (isCurved) {
				polygon.SetCurveGroup (0);
			}
			result.AddPolygon (polygon);
		}

		result.SetCubicTextureProjection (new JSM.Coord (0.0, 0.0, 0.0), new JSM.Coord (1.0, 0.0, 0.0), new JSM.Coord (0.0, 1.0, 0.0), new JSM.Coord (0.0, 0.0, 1.0));
		return result;
	};

	/**
	* Function: GenerateRevolved
	* Description:
	*	Generates a revolved surface by rotating a polyline around a given axis.
	*	If the angle is 360 degree, it can generate top and bottom polygons.
	* Parameters:
	*	polyLine {Coord[*]} the polyline
	*	axis {Sector} the axis
	*	angle {number} the angle
	*	segmentation {integer} the segmentation
	*	withTopAndBottom {boolean} generate top and bottom polygons
	*	curveMode {string} 'None', 'CurveSegments', or 'CurveAll'
	* Returns:
	*	{Body} the result
	*/
	JSM.GenerateRevolved = function (polyLine, axis, angle, segmentation, withTopAndBottom, curveMode)
	{
		var result = new JSM.Body ();
		var circular = JSM.IsEqual (angle, 2.0 * Math.PI);

		var count = polyLine.length;
		var step = angle / segmentation;
		var axisDir = JSM.CoordSub (axis.end, axis.beg);
		
		var i, j, rotated;
		for (i = 0; i < count; i++) {
			for (j = 0; j <= segmentation; j++) {
				if (circular && j === segmentation) {
					continue;
				}

				rotated = polyLine[i].Clone ().Rotate (axisDir, j * step, axis.beg);
				result.AddVertex (new JSM.BodyVertex (rotated));
			}
		}

		var curveModeFlag = 0;
		if (curveMode == 'CurveSegments') {
			curveModeFlag = 1;
		} else if (curveMode == 'CurveAll') {
			curveModeFlag = 2;
		}
		
		var current, top, next, ntop, polygon;
		for (i = 0; i < count - 1; i++) {
			for (j = 0; j < segmentation; j++) {
				current = i * (segmentation + 1) + j;
				top = current + segmentation + 1;
				next = current + 1;
				ntop = top + 1;

				if (circular) {
					current = i * segmentation + j;
					top = current + segmentation;
					next = current + 1;
					ntop = top + 1;
					if (j === segmentation - 1) {
						next = i * segmentation;
						ntop = (i + 1) * segmentation;
					}
				}

				polygon = new JSM.BodyPolygon ([current, next, ntop, top]);
				if (curveModeFlag == 1) {
					polygon.SetCurveGroup (i);
				} else if (curveModeFlag == 2) {
					polygon.SetCurveGroup (0);
				}
				result.AddPolygon (polygon);
			}
		}

		if (circular && withTopAndBottom) {
			var topPolygon = new JSM.BodyPolygon ([]);
			var bottomPolygon = new JSM.BodyPolygon ([]);
			for (i = 0; i < segmentation; i++) {
				topPolygon.AddVertexIndex (segmentation * (count - 1) + i);
				bottomPolygon.AddVertexIndex (segmentation - i - 1);
			}
			result.AddPolygon (topPolygon);
			result.AddPolygon (bottomPolygon);
		}

		var axisNormalDir = axisDir.Clone ().Normalize ();
		var axisLine = new JSM.Line (axis.beg, axisNormalDir);
		var avgRadius = 0.0;
		var projected;
		for (i = 0; i < count; i++) {
			projected = axisLine.ProjectCoord (polyLine[i]);
			avgRadius = avgRadius + projected.DistanceTo (polyLine[i]);
		}
		avgRadius = avgRadius / count;
		
		var origo = new JSM.Coord (axis.beg.x, axis.beg.y, axis.beg.z);
		var baseLine = new JSM.Line (origo, axisDir);
		var projectedToBaseLine = baseLine.ProjectCoord (polyLine[0]);
		var xDirection = JSM.CoordSub (polyLine[0], projectedToBaseLine).Normalize ();
		
		result.SetCylindricalTextureProjection (origo, avgRadius, xDirection, axisNormalDir);
		return result;
	};

	/**
	* Function: GenerateTube
	* Description:
	*	Generates a tube from a given array of polygons. All of the
	*	polygons should have same number of vertices.
	* Parameters:
	*	basePolygons {Coord[*][*]} the array of polygons
	*	withStartAndEnd {boolean} generate start and end polygons
	* Returns:
	*	{Body} the result
	*/
	JSM.GenerateTube = function (basePolygons, withStartAndEnd)
	{
		var result = new JSM.Body ();
		var contourCount = basePolygons.length;
		var count = basePolygons[0].length;

		var i, j;
		for (j = 0; j < count; j++) {
			for (i = 0; i < contourCount; i++) {
				result.AddVertex (new JSM.BodyVertex (basePolygons[i][j]));
			}
		}

		var current, next;
		for (j = 0; j < contourCount - 1; j++) {
			for (i = 0; i < count; i++) {
				current = j + contourCount * i;
				next = current + contourCount;
				if (i === count - 1) {
					next = j;
				}
				result.AddPolygon (new JSM.BodyPolygon ([current, next, next + 1, current + 1]));
			}
		}

		if (withStartAndEnd) {
			var topPolygon = new JSM.BodyPolygon ([]);
			var bottomPolygon = new JSM.BodyPolygon ([]);
			for (i = 0; i < count; i++) {
				topPolygon.AddVertexIndex (contourCount * i + contourCount - 1);
			}
			for (i = count - 1; i >= 0; i--) {
				bottomPolygon.AddVertexIndex (contourCount * i);
			}
			result.AddPolygon (topPolygon);
			result.AddPolygon (bottomPolygon);
		}

		result.SetCubicTextureProjection (new JSM.Coord (0.0, 0.0, 0.0), new JSM.Coord (1.0, 0.0, 0.0), new JSM.Coord (0.0, 1.0, 0.0), new JSM.Coord (0.0, 0.0, 1.0));
		return result;
	};

	/**
	* Function: GenerateFunctionSurface
	* Description: Generates the surface of a given function.
	* Parameters:
	*	function3D {function} the callback function for get surface point
	*	intervalMin {Coord2D} the minimum of the interval
	*	intervalMax {Coord2D} the maximum of the interval
	*	segmentation {integer} the segmentation
	*	isCurved {boolean} create smooth surfaces
	* Returns:
	*	{Body} the result
	*/
	JSM.GenerateFunctionSurface = function (function3D, intervalMin, intervalMax, segmentation, isCurved)
	{
		var aSector = new JSM.Sector (new JSM.Coord (intervalMin.x, intervalMin.y, 0.0), new JSM.Coord (intervalMax.x, intervalMin.y, 0.0));
		var bSector = new JSM.Sector (new JSM.Coord (intervalMin.x, intervalMax.y, 0.0), new JSM.Coord (intervalMax.x, intervalMax.y, 0.0));
		var result = JSM.GenerateRuledFromSectors (aSector, bSector, segmentation, segmentation, isCurved);

		var i, coord;
		for (i = 0; i < result.VertexCount (); i++) {
			coord = result.GetVertexPosition (i);
			coord.z = function3D (coord.x, coord.y);
		}

		result.SetCubicTextureProjection (new JSM.Coord (0.0, 0.0, 0.0), new JSM.Coord (1.0, 0.0, 0.0), new JSM.Coord (0.0, 1.0, 0.0), new JSM.Coord (0.0, 0.0, 1.0));
		return result;
	};

	/**
	* Function: GenerateFunctionSurfaceSolid
	* Description: Generates the surface of a given function with a solid body.
	* Parameters:
	*	function3D {function} the callback function for get surface point
	*	intervalMin {Coord2D} the minimum of the interval
	*	intervalMax {Coord2D} the maximum of the interval
	*	segmentation {integer} the segmentation
	*	isCurved {boolean} create smooth surfaces
	*	bottomZ {number} the bottom z coordinate of the solid
	* Returns:
	*	{Body} the result
	*/
	JSM.GenerateFunctionSurfaceSolid = function (function3D, intervalMin, intervalMax, segmentation, isCurved, bottomZ)
	{
		var aSector = new JSM.Sector (new JSM.Coord (intervalMax.x, intervalMin.y, 0.0), new JSM.Coord (intervalMin.x, intervalMin.y, 0.0));
		var bSector = new JSM.Sector (new JSM.Coord (intervalMax.x, intervalMax.y, 0.0), new JSM.Coord (intervalMin.x, intervalMax.y, 0.0));
		var result = JSM.GenerateRuledFromSectorsWithHeight (aSector, bSector, segmentation, segmentation, isCurved, bottomZ);

		var i, coord;
		var topVertexCount = (segmentation + 1) * (segmentation + 1);
		for (i = 0; i < topVertexCount; i++) {
			coord = result.GetVertexPosition (i);
			coord.z = function3D (coord.x, coord.y);
		}

		result.SetCubicTextureProjection (new JSM.Coord (0.0, 0.0, 0.0), new JSM.Coord (1.0, 0.0, 0.0), new JSM.Coord (0.0, 1.0, 0.0), new JSM.Coord (0.0, 0.0, 1.0));
		return result;
	};

	return JSM;
});

define('skylark-jsmodeler/modeler/camera',["../core/jsm"],function(JSM){
	/**
	* Class: Camera
	* Description: Represents a camera.
	* Parameters:
	*	eye {Coord} the eye position
	*	center {Coord} the center position
	*	up {Vector} the up vector
	*	fieldOfView {number} field of view in degree
	*	nearClippingPlane {number} near clipping plane distance
	*	farClippingPlane {number} far clipping plane distance
	*/
	JSM.Camera = function (eye, center, up, fieldOfView, nearClippingPlane, farClippingPlane)
	{
		this.eye = JSM.ValueOrDefault (eye, new JSM.Coord (1.0, 1.0, 1.0));
		this.center = JSM.ValueOrDefault (center, new JSM.Coord (0.0, 0.0, 0.0));
		this.up = JSM.ValueOrDefault (up, new JSM.Vector (0.0, 0.0, 1.0));
		this.fieldOfView = JSM.ValueOrDefault (fieldOfView, 45.0);
		this.nearClippingPlane = JSM.ValueOrDefault (nearClippingPlane, 0.1);
		this.farClippingPlane = JSM.ValueOrDefault (farClippingPlane, 1000.0);
	};

	/**
	* Function: Camera.Set
	* Description: Sets the camera.
	* Parameters:
	*	eye {Coord} the eye position
	*	center {Coord} the center position
	*	up {Vector} the up vector
	*	fieldOfView {number} field of view in degree
	*	nearClippingPlane {number} near clipping plane distance
	*	farClippingPlane {number} far clipping plane distance
	*/
	JSM.Camera.prototype.Set = function (eye, center, up, fieldOfView, nearClippingPlane, farClippingPlane)
	{
		this.eye = eye;
		this.center = center;
		this.up = up;
		this.fieldOfView = JSM.ValueOrDefault (fieldOfView, 45.0);
		this.nearClippingPlane = JSM.ValueOrDefault (nearClippingPlane, 0.1);
		this.farClippingPlane = JSM.ValueOrDefault (farClippingPlane, 1000.0);
	};

	/**
	* Function: Camera.Clone
	* Description: Clones the camera.
	* Returns:
	*	{Camera} a cloned instance
	*/
	JSM.Camera.prototype.Clone = function ()
	{
		var result = new JSM.Camera ();
		result.eye = this.eye;
		result.center = this.center;
		result.up = this.up;
		result.fieldOfView = this.fieldOfView;
		result.nearClippingPlane = this.nearClippingPlane;
		result.farClippingPlane = this.farClippingPlane;
		return result;
	};

	return JSM;
});

define('skylark-jsmodeler/modeler/explode',["../core/jsm"],function(JSM){
	/**
	* Function: ExplodeBody
	* Description:
	*	Explodes a body to primitives. The function calls callback functions
	*	on geometry start and end, and when a triangle or a line is created.
	* Parameters:
	*	body {Body} the body
	*	materials {MaterialSet} the materials
	*	explodeData {object} the parameters and callback functions of explode
	* Returns:
	*	{boolean} success
	*/
	JSM.ExplodeBody = function (body, materials, explodeData)
	{
		function SeparateByMaterial (materials, itemsByMaterial, itemsWithNoMaterial, callbacks)
		{
			var i;
			for (i = 0; i < materials.Count (); i++) {
				itemsByMaterial.push ([]);
			}

			var itemCount = callbacks.itemCount ();
			var material;
			for (i = 0; i < itemCount; i++) {
				material = callbacks.getMaterial (i);
				if (material !== -1) {
					itemsByMaterial[material].push (i);
				} else {
					itemsWithNoMaterial.push (i);
				}
			}		
		}
		
		function ExplodePoints (body, materials, explodeData)
		{
			function ExplodePointsByMaterial (pointIndices, materialIndex, explodeData)
			{
				if (pointIndices.length === 0) {
					return;
				}
				
				var material = materials.GetMaterial (materialIndex);
				if (explodeData.onPointGeometryStart !== undefined && explodeData.onPointGeometryStart !== null) {
					explodeData.onPointGeometryStart (material);
				}

				if (explodeData.onPoint !== undefined && explodeData.onPoint !== null) {
					var i, point, vertex;
					for (i = 0; i < pointIndices.length; i++) {
						point = body.GetPoint (pointIndices[i]);
						vertex = body.GetVertexPosition (point.GetVertexIndex ());
						explodeData.onPoint (vertex);
					}
				}

				if (explodeData.onPointGeometryEnd !== undefined && explodeData.onPointGeometryEnd !== null) {
					explodeData.onPointGeometryEnd (material);
				}
			}

			if (body.PointCount () === 0) {
				return;
			}

			var pointsByMaterial = [];
			var pointsWithNoMaterial = [];
			SeparateByMaterial (materials, pointsByMaterial, pointsWithNoMaterial, {
				itemCount : function () {
					return body.PointCount ();
				},
				getMaterial : function (index) {
					var point = body.GetPoint (index);
					return point.GetMaterialIndex ();
				}
			});
			
			var i;		
			for (i = 0; i < pointsByMaterial.length; i++) {
				ExplodePointsByMaterial (pointsByMaterial[i], i, explodeData);
			}
			ExplodePointsByMaterial (pointsWithNoMaterial, -1, explodeData);
		}

		function ExplodeLines (body, materials, explodeData)
		{
			function ExplodeLinesByMaterial (lineIndices, materialIndex, explodeData)
			{
				if (lineIndices.length === 0) {
					return;
				}
				
				var material = materials.GetMaterial (materialIndex);
				if (explodeData.onLineGeometryStart !== undefined && explodeData.onLineGeometryStart !== null) {
					explodeData.onLineGeometryStart (material);
				}

				if (explodeData.onLine !== undefined && explodeData.onLine !== null) {
					var i, line, beg, end;
					for (i = 0; i < lineIndices.length; i++) {
						line = body.GetLine (lineIndices[i]);
						beg = body.GetVertexPosition (line.GetBegVertexIndex ());
						end = body.GetVertexPosition (line.GetEndVertexIndex ());
						explodeData.onLine (beg, end);
					}
				}

				if (explodeData.onLineGeometryEnd !== undefined && explodeData.onLineGeometryEnd !== null) {
					explodeData.onLineGeometryEnd (material);
				}
			}

			if (body.LineCount () === 0) {
				return;
			}

			var linesByMaterial = [];
			var linesWithNoMaterial = [];
			SeparateByMaterial (materials, linesByMaterial, linesWithNoMaterial, {
				itemCount : function () {
					return body.LineCount ();
				},
				getMaterial : function (index) {
					var line = body.GetLine (index);
					return line.GetMaterialIndex ();
				}
			});
			
			var i;		
			for (i = 0; i < linesByMaterial.length; i++) {
				ExplodeLinesByMaterial (linesByMaterial[i], i, explodeData);
			}
			ExplodeLinesByMaterial (linesWithNoMaterial, -1, explodeData);
		}

		function ExplodePolygons (body, materials, explodeData)
		{
			function CalculatePolygonsDerivedData (body, materials)
			{
				var vertexNormals = JSM.CalculateBodyVertexNormals (body);

				var i, j;
				var hasTextureCoords = false;
				if (materials !== undefined && materials !== null) {
					for (i = 0; i < materials.Count (); i++) {
						if (materials.GetMaterial (i).texture !== null) {
							hasTextureCoords = true;
							break;
						}
					}
				}

				var textureCoords = null;
				var polygon, material;
				if (hasTextureCoords) {
					textureCoords = JSM.CalculateBodyTextureCoords (body);
					for (i = 0; i < textureCoords.length; i++) {
						polygon = body.GetPolygon (i);
						if (polygon.HasMaterialIndex ()) {
							material = materials.GetMaterial (polygon.GetMaterialIndex ());
							for (j = 0; j < textureCoords[i].length; j++) {
								textureCoords[i][j].x /= material.textureWidth;
								textureCoords[i][j].y /= -material.textureHeight;
							}
						}
					}
				}
				
				return {
					vertexNormals : vertexNormals,
					textureCoords : textureCoords
				};
			}
			
			function ExplodePolygonsByMaterial (polygonIndices, materialIndex, derivedData, explodeData)
			{
				function ExplodePolygon (index, derivedData, explodeData)
				{
					function CreateTriangle (vertex1, vertex2, vertex3, normal1, normal2, normal3, uv1, uv2, uv3)
					{
						if (explodeData.onTriangle !== undefined && explodeData.onTriangle !== null) {
							explodeData.onTriangle (vertex1, vertex2, vertex3, normal1, normal2, normal3, uv1, uv2, uv3);
						}
					}

					var polygon = body.GetPolygon (index);
					var count = polygon.VertexIndexCount ();
					if (count < 3) {
						JSM.Message ('Invalid polygon found.');
						return;
					}
					
					var vertex1, vertex2, vertex3;
					var normal1, normal2, normal3;
					var uv1, uv2, uv3;

					var convexPolygon = false;
					if (explodeData.hasConvexPolygons !== undefined && explodeData.hasConvexPolygons !== null) {
						convexPolygon = explodeData.hasConvexPolygons;
					}
					
					var i;
					if (count == 3 || convexPolygon) {
						for (i = 0; i < count - 2; i++) {
							vertex1 = body.GetVertexPosition (polygon.GetVertexIndex (0));
							vertex2 = body.GetVertexPosition (polygon.GetVertexIndex ((i + 1) % count));
							vertex3 = body.GetVertexPosition (polygon.GetVertexIndex ((i + 2) % count));
							normal1 = derivedData.vertexNormals[index][0];
							normal2 = derivedData.vertexNormals[index][(i + 1) % count];
							normal3 = derivedData.vertexNormals[index][(i + 2) % count];
							uv1 = null;
							uv2 = null;
							uv3 = null;
							if (derivedData.textureCoords !== null) {
								uv1 = derivedData.textureCoords[index][0];
								uv2 = derivedData.textureCoords[index][(i + 1) % count];
								uv3 = derivedData.textureCoords[index][(i + 2) % count];
							}
							
							CreateTriangle (vertex1, vertex2, vertex3, normal1, normal2, normal3, uv1, uv2, uv3);
						}
					} else {
						var polygon3D = new JSM.Polygon ();
						
						var vertex;
						for (i = 0; i < count; i++) {
							vertex = body.GetVertexPosition (polygon.vertices[i]);
							polygon3D.AddVertex (vertex.x, vertex.y, vertex.z);
						}
						
						var normal = JSM.CalculateBodyPolygonNormal (body, index);
						var triangles = JSM.TriangulatePolygon (polygon3D, normal);
						if (triangles !== null) {
							var triangle;
							for (i = 0; i < triangles.length; i++) {
								triangle = triangles[i];
								vertex1 = body.GetVertexPosition (polygon.GetVertexIndex (triangle[0]));
								vertex2 = body.GetVertexPosition (polygon.GetVertexIndex (triangle[1]));
								vertex3 = body.GetVertexPosition (polygon.GetVertexIndex (triangle[2]));
								normal1 = derivedData.vertexNormals[index][triangle[0]];
								normal2 = derivedData.vertexNormals[index][triangle[1]];
								normal3 = derivedData.vertexNormals[index][triangle[2]];
								uv1 = null;
								uv2 = null;
								uv3 = null;
								if (derivedData.textureCoords !== null) {
									uv1 = derivedData.textureCoords[index][triangle[0]];
									uv2 = derivedData.textureCoords[index][triangle[1]];
									uv3 = derivedData.textureCoords[index][triangle[2]];
								}
								
								CreateTriangle (vertex1, vertex2, vertex3, normal1, normal2, normal3, uv1, uv2, uv3);
							}
						} else {
							JSM.Message ('Triangulation failed.');
						}
					}
				}
				
				if (polygonIndices.length === 0) {
					return;
				}
				
				var material = materials.GetMaterial (materialIndex);
				if (explodeData.onGeometryStart !== undefined && explodeData.onGeometryStart !== null) {
					explodeData.onGeometryStart (material);
				}

				var i;
				for (i = 0; i < polygonIndices.length; i++) {
					ExplodePolygon (polygonIndices[i], derivedData, explodeData);
				}

				if (explodeData.onGeometryEnd !== undefined && explodeData.onGeometryEnd !== null) {
					explodeData.onGeometryEnd (material);
				}
			}

			if (body.PolygonCount () === 0) {
				return;
			}
			
			var polygonsByMaterial = [];
			var polygonsWithNoMaterial = [];
			SeparateByMaterial (materials, polygonsByMaterial, polygonsWithNoMaterial, {
				itemCount : function () {
					return body.PolygonCount ();
				},
				getMaterial : function (index) {
					var polygon = body.GetPolygon (index);
					return polygon.GetMaterialIndex ();
				}
			});
			
			var derivedData = CalculatePolygonsDerivedData (body, materials);
			var i;
			for (i = 0; i < polygonsByMaterial.length; i++) {
				ExplodePolygonsByMaterial (polygonsByMaterial[i], i, derivedData, explodeData);
			}
			ExplodePolygonsByMaterial (polygonsWithNoMaterial, -1, derivedData, explodeData);
		}

		if (explodeData === undefined || explodeData === null) {
			return false;
		}

		if (materials === undefined || materials === null) {
			materials = new JSM.MaterialSet ();
		}	
		
		ExplodePoints (body, materials, explodeData);
		ExplodeLines (body, materials, explodeData);
		ExplodePolygons (body, materials, explodeData);
		return true;
	};

	return JSM;
});

define('skylark-jsmodeler/modeler/exporter',["../core/jsm"],function(JSM){
	/**
	* Function: ExportBodyContentToStl
	* Description: Exports a body content to stl.
	* Parameters:
	*	body {Body} the body
	*	name {string} name the body
	*	hasConvexPolygons {boolean} the body has only convex polygons
	* Returns:
	*	{string} the result
	*/
	JSM.ExportBodyContentToStl = function (body, name, hasConvexPolygons)
	{
		function AddLineToContent (line)
		{
			stlContent += line + '\n';
		}

		function AddTriangleToContent (normal, vertex1, vertex2, vertex3)
		{
			AddLineToContent ('\tfacet normal ' + normal.x + ' ' + normal.y + ' ' + normal.z);
			AddLineToContent ('\t\touter loop');
			AddLineToContent ('\t\t\tvertex ' + vertex1.x + ' ' + vertex1.y + ' ' + vertex1.z);
			AddLineToContent ('\t\t\tvertex ' + vertex2.x + ' ' + vertex2.y + ' ' + vertex2.z);
			AddLineToContent ('\t\t\tvertex ' + vertex3.x + ' ' + vertex3.y + ' ' + vertex3.z);
			AddLineToContent ('\t\tendloop');
			AddLineToContent ('\tendfacet');
		}
		
		function AddPolygon (index)
		{
			var polygon = body.GetPolygon (index);
			var count = polygon.VertexIndexCount ();
			if (count < 3) {
				return;
			}
			
			var vertex1, vertex2, vertex3;
			var normal = null;
			if (count === 3) {
				normal = JSM.CalculateBodyPolygonNormal (body, index);
				vertex1 = body.GetVertex (polygon.GetVertexIndex (0)).position;
				vertex2 = body.GetVertex (polygon.GetVertexIndex (1)).position;
				vertex3 = body.GetVertex (polygon.GetVertexIndex (2)).position;
				AddTriangleToContent (normal, vertex1, vertex2, vertex3);
			} else {
				var useTriangulation = true;
				if (hasConvexPolygons !== undefined && hasConvexPolygons) {
					useTriangulation = false;
				}
			
				var i;
				normal = JSM.CalculateBodyPolygonNormal (body, index);
				if (useTriangulation) {
					var polygon3D = new JSM.Polygon ();
					
					var vertex;
					for (i = 0; i < count; i++) {
						vertex = body.GetVertex (polygon.vertices[i]);
						polygon3D.AddVertex (vertex.position.x, vertex.position.y, vertex.position.z);
					}
					
					var triangles = JSM.TriangulatePolygon (polygon3D, normal);
					if (triangles !== null) {
						var triangle;
						for (i = 0; i < triangles.length; i++) {
							triangle = triangles[i];
							vertex1 = body.GetVertex (polygon.GetVertexIndex (triangle[0])).position;
							vertex2 = body.GetVertex (polygon.GetVertexIndex (triangle[1])).position;
							vertex3 = body.GetVertex (polygon.GetVertexIndex (triangle[2])).position;
							AddTriangleToContent (normal, vertex1, vertex2, vertex3);
						}
					}
				} else {
					for (i = 0; i < count - 2; i++) {
						vertex1 = body.GetVertex (polygon.GetVertexIndex (0)).position;
						vertex2 = body.GetVertex (polygon.GetVertexIndex ((i + 1) % count)).position;
						vertex3 = body.GetVertex (polygon.GetVertexIndex ((i + 2) % count)).position;
						AddTriangleToContent (normal, vertex1, vertex2, vertex3);
					}
				}
			}
		}
		
		var stlContent = '';

		var i;
		for (i = 0; i < body.PolygonCount (); i++) {
			AddPolygon (i);
		}

		return stlContent;
	};

	/**
	* Function: ExportBodyToStl
	* Description: Exports a body to stl.
	* Parameters:
	*	body {Body} the body
	*	name {string} name the body
	*	hasConvexPolygons {boolean} the body has only convex polygons
	* Returns:
	*	{string} the result
	*/
	JSM.ExportBodyToStl = function (body, name, hasConvexPolygons)
	{
		function AddLineToContent (line)
		{
			stlContent += line + '\n';
		}

		var stlContent = '';
		
		AddLineToContent ('solid ' + name);
		stlContent += JSM.ExportBodyContentToStl (body, name, hasConvexPolygons);
		AddLineToContent ('endsolid ' + name);
		
		return stlContent;
	};

	/**
	* Function: ExportModelToStl
	* Description: Exports a model to stl.
	* Parameters:
	*	model {Model} the model
	*	name {string} name the model
	*	hasConvexPolygons {boolean} the model has only convex polygons
	* Returns:
	*	{string} the result
	*/
	JSM.ExportModelToStl = function (model, name, hasConvexPolygons)
	{
		function AddLineToContent (line)
		{
			stlContent += line + '\n';
		}

		var stlContent = '';

		AddLineToContent ('solid ' + name);
		var i, body;
		for (i = 0; i < model.BodyCount (); i++) {
			body = model.GetBody (i);
			stlContent += JSM.ExportBodyContentToStl (body, name + (i + 1).toString (), hasConvexPolygons);
		}
		AddLineToContent ('endsolid ' + name);

		return stlContent;
	};

	/**
	* Function: ExportBodyContentToObj
	* Description: Exports a body content to obj.
	* Parameters:
	*	body {Body} the body
	*	vertexOffset {integer} vertex index offset
	*	normalOffset {integer} normal index offset
	* Returns:
	*	{string} the result
	*/
	JSM.ExportBodyContentToObj = function (body, vertexOffset, normalOffset)
	{
		function AddToContent (line)
		{
			objContent += line;
		}

		function AddLineToContent (line)
		{
			objContent += line + '\n';
		}

		function AddVertex (index)
		{
			var vertCoord = body.GetVertex (index).position;
			AddLineToContent ('v ' + vertCoord.x + ' ' + vertCoord.y + ' ' + vertCoord.z);
		}

		function AddNormal (index)
		{
			var normalVector = JSM.CalculateBodyPolygonNormal (body, index);
			AddLineToContent ('vn ' + normalVector.x + ' ' + normalVector.y + ' ' + normalVector.z);
		}

		function AddPolygon (index)
		{
			var polygon = body.GetPolygon (index);
		
			AddToContent ('f ');
		
			var i;
			for (i = 0; i < polygon.VertexIndexCount (); i++) {
				AddToContent ((vertexOffset + polygon.GetVertexIndex (i) + 1) + '//' + (normalOffset + index + 1) + ' ');
			}
			
			AddLineToContent ('');
		}

		var objContent = '';
		
		var i;
		for (i = 0; i < body.VertexCount (); i++) {
			AddVertex (i);
		}
		
		for (i = 0; i < body.PolygonCount (); i++) {
			AddNormal (i);
		}

		for (i = 0; i < body.PolygonCount (); i++) {
			AddPolygon (i);
		}
		
		return objContent;
	};

	/**
	* Function: ExportBodyToObj
	* Description: Exports a body to obj.
	* Parameters:
	*	body {Body} the body
	* Returns:
	*	{string} the result
	*/
	JSM.ExportBodyToObj = function (body)
	{
		return JSM.ExportBodyContentToObj (body, 0, 0);
	};

	/**
	* Function: ExportModelToObj
	* Description: Exports a model to obj.
	* Parameters:
	*	model {Model} the model
	* Returns:
	*	{string} the result
	*/
	JSM.ExportModelToObj = function (model)
	{
		var objContent = '';
		
		var vertexOffset = 0;
		var normalOffset = 0;
		
		var i, body;
		for (i = 0; i < model.BodyCount (); i++) {
			body = model.GetBody (i);
			objContent += JSM.ExportBodyContentToObj (body, vertexOffset, normalOffset);
			vertexOffset += body.VertexCount ();
			normalOffset += body.PolygonCount ();
		}

		return objContent;
	};

	/**
	* Function: ExportMaterialsToGdl
	* Description: Exports a material container to gdl.
	* Parameters:
	*	materials {MaterialSet} the material container
	* Returns:
	*	{string} the result
	*/
	JSM.ExportMaterialsToGdl = function (materials)
	{
		function HexColorToRGBColorString (hexColor)
		{
			var rgb = JSM.HexColorToRGBComponents (hexColor);
			var result = rgb[0] / 255.0 + ',' + rgb[1] / 255.0 + ',' + rgb[2] / 255.0;
			return result;
		}

		function AddLineToContent (line)
		{
			gdlContent += line + '\n';
		}

		function AddMaterial (material, index)
		{
			var rgbString = HexColorToRGBColorString (material.diffuse);
			AddLineToContent ('define material "material' + index + '" 2, ' + rgbString + ' ! ' + index);
		}
		
		var gdlContent = '';
		var writeMaterials = false;
		if (materials !== undefined && materials !== null) {
			writeMaterials = true;
		}

		var i;
		if (writeMaterials) {
			AddMaterial (materials.GetDefaultMaterial (), 1);
			for (i = 0; i < materials.Count (); i++) {
				AddMaterial (materials.GetMaterial (i), i + 2);
			}
		}
		
		return gdlContent;
	};

	/**
	* Function: ExportBodyGeometryToGdl
	* Description: Exports a body geometry to gdl.
	* Parameters:
	*	body {Body} the body
	*	writeMaterials {boolean} write materials
	* Returns:
	*	{string} the result
	*/
	JSM.ExportBodyGeometryToGdl = function (body, writeMaterials)
	{
		function AddToContent (line)
		{
			var lineLengthLimit = 200;
			if (line.length > lineLengthLimit) {
				var current = 0;
				var i, character;
				for (i = 0; i < line.length; i++) {
					character = line[i];
					gdlContent += character;
					current++;
					if (current > lineLengthLimit && character == ',') {
						gdlContent += '\n';
						current = 0;
					}
				}
			} else {
				gdlContent += line;
			}
		}

		function AddLineToContent (line)
		{
			AddToContent (line + '\n');
		}

		function AddVertex (index)
		{
			var vertCoord = body.GetVertex (index).position;
			AddLineToContent ('vert ' + vertCoord.x + ', ' + vertCoord.y + ', ' + vertCoord.z + ' ! ' + (index + 1));
		}

		function AddEdge (adjacencyInfo, index)
		{
			var edge = adjacencyInfo.edges[index];
			var status = 0;
			if (edge.pgon1 != -1 && edge.pgon2 != -1) {
				if (body.GetPolygon (edge.pgon1).HasCurveGroup () && body.GetPolygon (edge.pgon2).HasCurveGroup ()) {
					if (body.GetPolygon (edge.pgon1).GetCurveGroup () == body.GetPolygon (edge.pgon2).GetCurveGroup ()) {
						status = 2;
					}
				}
			}
			AddLineToContent ('edge ' + (edge.vert1 + 1) + ', ' + (edge.vert2 + 1) + ', -1, -1, ' + status + ' ! ' + (index + 1));
		}

		function AddPolygon (adjacencyInfo, index, lastMaterialIndex)
		{
			var materialIndex = -1;
			if (writeMaterials) {
				materialIndex = body.GetPolygon (index).GetMaterialIndex () + 2;
				if (materialIndex != lastMaterialIndex) {
					AddLineToContent ('set material "material' + materialIndex + '"');
				}
			}
		
			var pgon = adjacencyInfo.pgons[index];
			var status = 0;
			if (body.GetPolygon (index).HasCurveGroup ()) {
				status = 2;
			}
			AddToContent ('pgon ' + pgon.pedges.length + ', 0, ' + status + ', ');
			var pedgeList = '';
			var i, pedge;
			for (i = 0; i < pgon.pedges.length; i++) {
				pedge = pgon.pedges[i];
				if (!pedge.reverse) {
					pedgeList += (pedge.index + 1);
				} else {
					pedgeList += (-(pedge.index + 1));
				}
				if (i < pgon.pedges.length - 1) {
					pedgeList += ', ';
				}
			}
			AddToContent (pedgeList);
			AddToContent (' ! ' + (index + 1));
			AddLineToContent ('');
			
			return materialIndex;
		}

		var gdlContent = '';

		AddLineToContent ('base');
		var adjacencyInfo = new JSM.AdjacencyInfo (body);
		
		var i;
		for (i = 0; i < adjacencyInfo.verts.length; i++) {
			AddVertex (i);
		}

		for (i = 0; i < adjacencyInfo.edges.length; i++) {
			AddEdge (adjacencyInfo, i);
		}
		
		var lastMaterialIndex = -1;
		for (i = 0; i < adjacencyInfo.pgons.length; i++) {
			lastMaterialIndex = AddPolygon (adjacencyInfo, i, lastMaterialIndex);
		}

		AddLineToContent ('body -1');
		return gdlContent;
	};

	/**
	* Function: ExportBodyToGdl
	* Description: Exports a body to gdl.
	* Parameters:
	*	body {Body} the body
	*	materials {MaterialSet} the material container
	* Returns:
	*	{string} the result
	*/
	JSM.ExportBodyToGdl = function (body, materials)
	{
		var gdlContent = '';

		var writeMaterials = false;
		if (materials !== undefined && materials !== null) {
			gdlContent += JSM.ExportMaterialsToGdl (materials);
			writeMaterials = true;
		}

		gdlContent += JSM.ExportBodyGeometryToGdl (body, writeMaterials);
		return gdlContent;
	};

	/**
	* Function: ExportModelToGdl
	* Description: Exports a model to gdl.
	* Parameters:
	*	model {Model} the model
	*	materials {MaterialSet} the material container
	* Returns:
	*	{string} the result
	*/
	JSM.ExportModelToGdl = function (model, materials)
	{
		var gdlContent = '';
		var writeMaterials = false;
		if (materials !== undefined && materials !== null) {
			gdlContent += JSM.ExportMaterialsToGdl (materials);
			writeMaterials = true;
		}
		
		var i, body;
		for (i = 0; i < model.BodyCount (); i++) {
			body = model.GetBody (i);
			gdlContent += JSM.ExportBodyGeometryToGdl (body, writeMaterials);
		}

		return gdlContent;
	};

	return JSM;
});

define('skylark-jsmodeler/modeler/trianglebody',["../core/jsm"],function(JSM){
	/**
	* Class: TriangleBody
	* Description: Represents a 3D body which contains only triangles.
	*/
	JSM.TriangleBody = function (name)
	{
		this.name = name;
		this.vertices = [];
		this.normals = [];
		this.uvs = [];
		this.triangles = [];
		this.defaultUVIndex = -1;
	};

	/**
	* Function: TriangleBody.SetName
	* Description: Sets the name of the body.
	* Parameters:
	*	name {string} the name
	*/
	JSM.TriangleBody.prototype.SetName = function (name)
	{
		this.name = name;
	};

	/**
	* Function: TriangleBody.GetName
	* Description: Returns the name of the body.
	* Returns:
	*	{string} the result
	*/
	JSM.TriangleBody.prototype.GetName = function ()
	{
		return this.name;
	};

	/**
	* Function: TriangleBody.AddVertex
	* Description: Adds a vertex to the body.
	* Parameters:
	*	x, y, z {number} the coordinates of the vertex
	* Returns:
	*	{integer} the index of the added vertex
	*/
	JSM.TriangleBody.prototype.AddVertex = function (x, y, z)
	{
		this.vertices.push (new JSM.Coord (x, y, z));
		return this.vertices.length - 1;
	};

	/**
	* Function: TriangleBody.GetVertex
	* Description: Returns the vertex at the given index.
	* Parameters:
	*	index {integer} the vertex index
	* Returns:
	*	{Coord} the result
	*/
	JSM.TriangleBody.prototype.GetVertex = function (index)
	{
		return this.vertices[index];
	};

	/**
	* Function: TriangleBody.SetVertex
	* Description: Sets the position of the vertex at the given index.
	* Parameters:
	*	index {integer} the vertex index
	*	x, y, z {number} the new coordinates of the vertex
	*/
	JSM.TriangleBody.prototype.SetVertex = function (index, x, y, z)
	{
		this.vertices[index] = new JSM.Coord (x, y, z);
	};

	/**
	* Function: TriangleBody.VertexCount
	* Description: Returns the vertex count of the body.
	* Returns:
	*	{integer} the result
	*/
	JSM.TriangleBody.prototype.VertexCount = function ()
	{
		return this.vertices.length;
	};

	/**
	* Function: TriangleBody.AddNormal
	* Description: Adds a normal vector to the body.
	* Parameters:
	*	x, y, z {number} the coordinates of the normal vector
	* Returns:
	*	{integer} the index of the added normal vector
	*/
	JSM.TriangleBody.prototype.AddNormal = function (x, y, z)
	{
		this.normals.push (new JSM.Vector (x, y, z));
		return this.normals.length - 1;
	};

	/**
	* Function: TriangleBody.GetNormal
	* Description: Returns the normal vector at the given index.
	* Parameters:
	*	index {integer} the normal vector index
	* Returns:
	*	{Vector} the result
	*/
	JSM.TriangleBody.prototype.GetNormal = function (index)
	{
		return this.normals[index];
	};


	/**
	* Function: TriangleBody.GetTriangleNormal
	* Description: Returns the normal vector of a triangle at the given position.
	* Parameters:
	*	triangleIndex {integer} the triangle index
	*	normalPosition {Coord} the position of the normal inside the triangle
	* Returns:
	*	{Vector} the result
	*/
	JSM.TriangleBody.prototype.GetTriangleNormal = function (triangleIndex, normalPosition)
	{
		var normal = null;
		var triangle = this.triangles[triangleIndex];
		if (triangle.curve == -1) {
			normal = this.GetNormal (triangle.n0);
		} else {
			var v0 = this.GetVertex (triangle.v0);
			var v1 = this.GetVertex (triangle.v1);
			var v2 = this.GetVertex (triangle.v2);
			var n0 = this.GetNormal (triangle.n0);
			var n1 = this.GetNormal (triangle.n1);
			var n2 = this.GetNormal (triangle.n2);
			normal = JSM.BarycentricInterpolation (v0, v1, v2, n0, n1, n2, normalPosition);
		}
		return normal;
	};

	/**
	* Function: TriangleBody.NormalCount
	* Description: Returns the normal vector count of the body.
	* Returns:
	*	{integer} the result
	*/
	JSM.TriangleBody.prototype.NormalCount = function ()
	{
		return this.normals.length;
	};

	/**
	* Function: TriangleBody.AddUV
	* Description: Adds a texture coordinate to the body.
	* Parameters:
	*	x, y {number} the coordinates of the texture coordinate
	* Returns:
	*	{integer} the index of the added texture coordinate
	*/
	JSM.TriangleBody.prototype.AddUV = function (x, y)
	{
		this.uvs.push (new JSM.Coord2D (x, y));
		return this.uvs.length - 1;
	};

	/**
	* Function: TriangleBody.AddDefaultUV
	* Description:
	*	Adds a default texture coordinate to the body.
	*	The default texture coordinate is stored only once.
	* Returns:
	*	{integer} the index of the default texture coordinate
	*/
	JSM.TriangleBody.prototype.AddDefaultUV = function ()
	{
		if (this.defaultUVIndex != -1) {
			return this.defaultUVIndex;
		}
		
		this.defaultUVIndex = this.AddUV (0.0, 0.0);
		return this.defaultUVIndex;
	};

	/**
	* Function: TriangleBody.GetUV
	* Description: Returns the texture coordinate at the given index.
	* Parameters:
	*	index {integer} the texture coordinate index
	* Returns:
	*	{Coord2D} the result
	*/
	JSM.TriangleBody.prototype.GetUV = function (index)
	{
		return this.uvs[index];
	};

	/**
	* Function: TriangleBody.UVCount
	* Description: Returns the texture coordinate count of the body.
	* Returns:
	*	{integer} the result
	*/
	JSM.TriangleBody.prototype.UVCount = function ()
	{
		return this.uvs.length;
	};

	/**
	* Function: TriangleBody.AddTriangle
	* Description: Adds a triangle to the body.
	* Parameters:
	*	v0, v1, v2 {integer} the vertex indices of the triangle
	*	n0, n1, n2 {integer} the normal vector indices of the triangle
	*	u0, u1, u2 {integer} the texture coordinate indices of the triangle
	*	mat {integer} the material index of the triangle
	*	curve {integer} the curve group index of the triangle
	* Returns:
	*	{integer} the index of the added triangle
	*/
	JSM.TriangleBody.prototype.AddTriangle = function (v0, v1, v2, n0, n1, n2, u0, u1, u2, mat, curve)
	{
		this.triangles.push ({
			v0 : v0,
			v1 : v1,
			v2 : v2,
			n0 : n0,
			n1 : n1,
			n2 : n2,
			u0 : u0,
			u1 : u1,
			u2 : u2,
			mat : mat,
			curve : curve
		});
		return this.triangles.length - 1;
	};

	/**
	* Function: TriangleBody.GetTriangle
	* Description: Returns the triangle at the given index.
	* Parameters:
	*	index {integer} the triangle index
	* Returns:
	*	{object} the result
	*/
	JSM.TriangleBody.prototype.GetTriangle = function (index)
	{
		return this.triangles[index];
	};

	/**
	* Function: TriangleBody.TriangleCount
	* Description: Returns the triangle count of the body.
	* Returns:
	*	{integer} the result
	*/
	JSM.TriangleBody.prototype.TriangleCount = function ()
	{
		return this.triangles.length;
	};

	/**
	* Function: TriangleBody.GetBoundingBox
	* Description: Returns the bounding box of the body.
	* Returns:
	*	{Box} the result
	*/
	JSM.TriangleBody.prototype.GetBoundingBox = function ()
	{
		var min = new JSM.Coord (JSM.Inf, JSM.Inf, JSM.Inf);
		var max = new JSM.Coord (-JSM.Inf, -JSM.Inf, -JSM.Inf);

		var i, coord;
		for (i = 0; i < this.vertices.length; i++) {
			coord = this.vertices[i];
			min.x = JSM.Minimum (min.x, coord.x);
			min.y = JSM.Minimum (min.y, coord.y);
			min.z = JSM.Minimum (min.z, coord.z);
			max.x = JSM.Maximum (max.x, coord.x);
			max.y = JSM.Maximum (max.y, coord.y);
			max.z = JSM.Maximum (max.z, coord.z);
		}
		
		return new JSM.Box (min, max);
	};

	/**
	* Function: TriangleBody.GetCenter
	* Description: Returns the center of the bounding box of the body.
	* Returns:
	*	{Coord} the result
	*/
	JSM.TriangleBody.prototype.GetCenter = function ()
	{
		var boundingBox = this.GetBoundingBox ();
		return boundingBox.GetCenter ();
	};

	/**
	* Function: TriangleBody.GetBoundingSphere
	* Description: Returns the bounding sphere of the body.
	* Returns:
	*	{Sphere} the result
	*/
	JSM.TriangleBody.prototype.GetBoundingSphere = function ()
	{
		var center = this.GetCenter ();
		var radius = 0.0;
		
		var i, current;
		for (i = 0; i < this.vertices.length; i++) {
			current = center.DistanceTo (this.vertices[i]);
			if (JSM.IsGreater (current, radius)) {
				radius = current;
			}
		}
		
		var result = new JSM.Sphere (center, radius);
		return result;
	};

	/**
	* Function: TriangleBody.Finalize
	* Description:
	*	Finalizes the body. This operation calculates normal vectors
	*	and fixes the body if some data is missing from it.
	* Parameters:
	*	model {TriangleModel} the triangle index
	*/
	JSM.TriangleBody.prototype.Finalize = function (model)
	{
		function FinalizeTriangle (body, triangleIndex, triangleNormals, vertexToTriangles)
		{
			function AddAverageNormal (body, vertexIndex, triangleIndex, triangleNormals, vertexToTriangles)
			{
				var averageNormal = new JSM.Vector (0.0, 0.0, 0.0);
				var averageCount = 0;
				
				var triangle = body.GetTriangle (triangleIndex);
				var neighbourTriangles = vertexToTriangles[vertexIndex];
				var i, neighbourTriangleIndex, neighbourTriangle;
				for (i = 0; i < neighbourTriangles.length; i++) {
					neighbourTriangleIndex = neighbourTriangles[i];
					neighbourTriangle = body.GetTriangle (neighbourTriangleIndex);
					if (triangle.curve == neighbourTriangle.curve) {
						averageNormal = JSM.CoordAdd (averageNormal, triangleNormals[neighbourTriangleIndex]);
						averageCount = averageCount + 1;
					}
				}
				
				averageNormal.MultiplyScalar (1.0 / averageCount);
				averageNormal.Normalize ();
				return body.AddNormal (averageNormal.x, averageNormal.y, averageNormal.z);
			}
		
			var triangle = body.triangles[triangleIndex];
			if (triangle.mat === undefined || triangle.mat < 0) {
				triangle.mat = model.GetDefaultMaterialIndex ();
			}
			
			var normal, normalIndex;
			if (triangle.n0 === undefined || triangle.n1 === undefined || triangle.n2 === undefined) {
				if (triangle.curve === undefined || triangle.curve < 0) {
					normal = triangleNormals[triangleIndex];
					normalIndex = body.AddNormal (normal.x, normal.y, normal.z);
					triangle.n0 = normalIndex;
					triangle.n1 = normalIndex;
					triangle.n2 = normalIndex;
					triangle.curve = -1;
				} else {
					triangle.n0 = AddAverageNormal (body, triangle.v0, triangleIndex, triangleNormals, vertexToTriangles);
					triangle.n1 = AddAverageNormal (body, triangle.v1, triangleIndex, triangleNormals, vertexToTriangles);
					triangle.n2 = AddAverageNormal (body, triangle.v2, triangleIndex, triangleNormals, vertexToTriangles);
				}
			}
			
			if (triangle.u0 === undefined || triangle.u1 === undefined || triangle.u2 === undefined) {
				triangle.u0 = body.AddDefaultUV ();
				triangle.u1 = body.AddDefaultUV ();
				triangle.u2 = body.AddDefaultUV ();
			}
		}

		var triangleNormals = [];
		var vertexToTriangles = {};

		var i;
		for (i = 0; i < this.vertices.length; i++) {
			vertexToTriangles[i] = [];
		}
		
		var triangle, normal;
		for (i = 0; i < this.triangles.length; i++) {
			triangle = this.triangles[i];
			normal = JSM.CalculateTriangleNormal (this.vertices[triangle.v0], this.vertices[triangle.v1], this.vertices[triangle.v2]);
			triangleNormals.push (normal);
			vertexToTriangles[triangle.v0].push (i);
			vertexToTriangles[triangle.v1].push (i);
			vertexToTriangles[triangle.v2].push (i);
		}

		for (i = 0; i < this.triangles.length; i++) {
			FinalizeTriangle (this, i, triangleNormals, vertexToTriangles);
		}
	};

	/**
	* Function: TriangleBody.Clone
	* Description: Clones the body.
	* Returns:
	*	{TriangleBody} a cloned instance
	*/
	JSM.TriangleBody.prototype.Clone = function ()
	{
		var result = new JSM.TriangleBody (this.name);
		
		var i, triangle;
		
		for (i = 0; i < this.vertices.length; i++) {
			result.vertices.push (this.vertices[i].Clone ());
		}
		
		for (i = 0; i < this.normals.length; i++) {
			result.normals.push (this.normals[i].Clone ());
		}
		
		for (i = 0; i < this.uvs.length; i++) {
			result.uvs.push (this.uvs[i].Clone ());
		}
		
		for (i = 0; i < this.triangles.length; i++) {
			triangle = this.triangles[i];
			result.triangles.push ({
				v0 : triangle.v0,
				v1 : triangle.v1,
				v2 : triangle.v2,
				n0 : triangle.n0,
				n1 : triangle.n1,
				n2 : triangle.n2,
				u0 : triangle.u0,
				u1 : triangle.u1,
				u2 : triangle.u2,
				mat : triangle.mat,
				curve : triangle.curve
			});
		}
		
		return result;
	};

	/**
	* Function: ConvertTriangleBodyToOctree
	* Description: Converts a triangle body to triangle octree.
	* Parameters:
	*	body {TriangleBody} the body
	* Returns:
	*	{TriangleOctree} the result
	*/
	JSM.ConvertTriangleBodyToOctree = function (body)
	{
		var result = new JSM.TriangleOctree (body.GetBoundingBox ());
		var i, triangle, v0, v1, v2;
		for (i = 0; i < body.TriangleCount (); i++) {
			triangle = body.GetTriangle (i);
			v0 = body.GetVertex (triangle.v0);
			v1 = body.GetVertex (triangle.v1);
			v2 = body.GetVertex (triangle.v2);
			result.AddTriangle (v0, v1, v2, {
				triangleIndex : i
			});
		}
		return result;
	};

	return JSM;
});

define('skylark-jsmodeler/modeler/trianglemodel',["../core/jsm"],function(JSM){
	/**
	* Class: TriangleModel
	* Description: Represents a 3D model which contains only triangles.
	*/
	JSM.TriangleModel = function ()
	{
		this.materials = [];
		this.bodies = [];
		this.defaultMaterial = -1;
	};

	/**
	* Function: TriangleModel.AddMaterial
	* Description: Adds a material to the model.
	* Parameters:
	*	material {material} the parameters of the material
	* Returns:
	*	{integer} the index of the added material
	*/
	JSM.TriangleModel.prototype.AddMaterial = function (material)
	{
		this.materials.push (material);
		return this.materials.length - 1;
	};

	/**
	* Function: TriangleModel.GetMaterial
	* Description: Returns the material at the given index.
	* Parameters:
	*	index {integer} the material index
	* Returns:
	*	{object} the result
	*/
	JSM.TriangleModel.prototype.GetMaterial = function (index)
	{
		return this.materials[index];
	};

	/**
	* Function: TriangleModel.AddDefaultMaterial
	* Description: Adds a default material to the model. The default material is stored only once.
	* Returns:
	*	{integer} the index of the default material
	*/
	JSM.TriangleModel.prototype.AddDefaultMaterial = function ()
	{
		if (this.defaultMaterial == -1) {
			this.defaultMaterial = this.AddMaterial ({});
		}
		return this.defaultMaterial;
	};

	/**
	* Function: TriangleModel.GetDefaultMaterialIndex
	* Description: Adds a default material, and returns the index of it.
	* Returns:
	*	{integer} the result
	*/
	JSM.TriangleModel.prototype.GetDefaultMaterialIndex = function ()
	{
		return this.AddDefaultMaterial ();
	};

	/**
	* Function: TriangleModel.MaterialCount
	* Description: Returns the material count of the model.
	* Returns:
	*	{integer} the result
	*/
	JSM.TriangleModel.prototype.MaterialCount = function ()
	{
		return this.materials.length;
	};

	/**
	* Function: TriangleModel.AddBody
	* Description: Adds a body to the model.
	* Parameters:
	*	body {TriangleBody} the body
	* Returns:
	*	{integer} the index of the added body
	*/
	JSM.TriangleModel.prototype.AddBody = function (body)
	{
		this.bodies.push (body);
		return this.bodies.length - 1;
	};

	/**
	* Function: TriangleModel.AddBodyToIndex
	* Description: Adds a body to the model to the given index.
	* Parameters:
	*	body {TriangleBody} the body
	*	index {integer} the index
	* Returns:
	*	{integer} the index of the added body
	*/
	JSM.TriangleModel.prototype.AddBodyToIndex = function (body, index)
	{
		this.bodies.splice (index, 0, body);
		return index;
	};

	/**
	* Function: TriangleModel.GetBody
	* Description: Returns the body at the given index.
	* Parameters:
	*	index {integer} the body index
	* Returns:
	*	{TriangleBody} the result
	*/
	JSM.TriangleModel.prototype.GetBody = function (index)
	{
		return this.bodies[index];
	};

	/**
	* Function: TriangleModel.VertexCount
	* Description: Returns the vertex count of the model.
	* Returns:
	*	{integer} the result
	*/
	JSM.TriangleModel.prototype.VertexCount = function ()
	{
		var result = 0;
		var i, body;
		for (i = 0; i < this.bodies.length; i++) {
			body = this.bodies[i];
			result += body.VertexCount ();
		}
		return result;
	};

	/**
	* Function: TriangleModel.TriangleCount
	* Description: Returns the triangle count of the model.
	* Returns:
	*	{integer} the result
	*/
	JSM.TriangleModel.prototype.TriangleCount = function ()
	{
		var result = 0;
		var i, body;
		for (i = 0; i < this.bodies.length; i++) {
			body = this.bodies[i];
			result += body.TriangleCount ();
		}
		return result;
	};

	/**
	* Function: TriangleModel.BodyCount
	* Description: Returns the body count of the model.
	* Returns:
	*	{integer} the result
	*/
	JSM.TriangleModel.prototype.BodyCount = function ()
	{
		return this.bodies.length;
	};

	/**
	* Function: TriangleModel.FinalizeMaterials
	* Description:
	*	Finalizes the materials in the model. This fill every not
	*	specified material parameter with default values.
	*/
	JSM.TriangleModel.prototype.FinalizeMaterials = function ()
	{
		var defaultMaterialData = {
			name : 'Default',
			ambient : [0.5, 0.5, 0.5],
			diffuse : [0.5, 0.5, 0.5],
			specular : [0.1, 0.1, 0.1],
			shininess : 0.0,
			opacity : 1.0,
			reflection : 0.0,
			texture : null,
			offset : null,
			scale : null,
			rotation : null
		};
		
		var i, material;
		for (i = 0; i < this.materials.length; i++) {
			material = this.materials[i];
			JSM.CopyObjectProperties (defaultMaterialData, material, false);
		}
	};

	/**
	* Function: TriangleModel.FinalizeBodies
	* Description: Finalizes all body in the model.
	*/
	JSM.TriangleModel.prototype.FinalizeBodies = function ()
	{
		var i, body;
		for (i = 0; i < this.bodies.length; i++) {
			body = this.bodies[i];
			body.Finalize (this);
		}
	};

	/**
	* Function: TriangleModel.Finalize
	* Description: Finalizes the model. It finalizes materials and bodies.
	*/
	JSM.TriangleModel.prototype.Finalize = function ()
	{
		this.FinalizeBodies ();
		this.FinalizeMaterials ();
	};

	return JSM;
});

define('skylark-jsmodeler/modeler/converter',["../core/jsm"],function(JSM){
	/**
	* Function: ConvertBodyToTriangleBody
	* Description: Converts a body to triangle body.
	* Parameters:
	*	body {Body} the body
	* Returns:
	*	{TriangleBody} the result
	*/
	JSM.ConvertBodyToTriangleBody = function (body)
	{
		function AddTriangle (result, polygon, v0, v1, v2)
		{
			var triangleIndex = result.AddTriangle (v0, v1, v2);
			var triangle = result.GetTriangle (triangleIndex);
			if (polygon.HasMaterialIndex ()) {
				triangle.mat = polygon.GetMaterialIndex ();
			}
			if (polygon.HasCurveGroup ()) {
				triangle.curve = polygon.GetCurveGroup ();
			}
		}
		
		var result = new JSM.TriangleBody ();
		
		var i, j, vertex;
		for (i = 0; i < body.VertexCount (); i++) {
			vertex = body.GetVertexPosition (i);
			result.AddVertex (vertex.x, vertex.y, vertex.z);
		}
		
		var polygon, vertexCount;
		var polygon3D, normal, triangle, triangles;
		var v0, v1, v2;
		for (i = 0; i < body.PolygonCount (); i++) {
			polygon = body.GetPolygon (i);
			vertexCount = polygon.VertexIndexCount ();
			if (vertexCount < 3) {
				continue;
			}
			if (vertexCount == 3) {
				v0 = polygon.GetVertexIndex (0);
				v1 = polygon.GetVertexIndex (1);
				v2 = polygon.GetVertexIndex (2);
				AddTriangle (result, polygon, v0, v1, v2);
			} else {
				polygon3D = new JSM.Polygon ();
				for (j = 0; j < vertexCount; j++) {
					vertex = body.GetVertexPosition (polygon.GetVertexIndex (j));
					polygon3D.AddVertex (vertex.x, vertex.y, vertex.z);
				}
				
				normal = JSM.CalculateBodyPolygonNormal (body, i);
				triangles = JSM.TriangulatePolygon (polygon3D, normal);
				if (triangles !== null) {
					for (j = 0; j < triangles.length; j++) {
						triangle = triangles[j];
						v0 = polygon.GetVertexIndex (triangle[0]);
						v1 = polygon.GetVertexIndex (triangle[1]);
						v2 = polygon.GetVertexIndex (triangle[2]);
						AddTriangle (result, polygon, v0, v1, v2);
					}
				}
			}
		}

		return result;
	};

	/**
	* Function: ConvertModelToTriangleModel
	* Description: Converts a model to triangle model.
	* Parameters:
	*	model {Model} the model
	* Returns:
	*	{TriangleModel} the result
	*/
	JSM.ConvertModelToTriangleModel = function (model)
	{
		var result = new JSM.TriangleModel ();
		var materials = model.GetMaterialSet ();
		var i, material;
		for (i = 0; i < materials.Count (); i++) {
			material = materials.GetMaterial (i);
			result.AddMaterial ({
				name : 'Material' + i,
				ambient : JSM.HexColorToNormalizedRGBComponents (material.ambient),
				diffuse : JSM.HexColorToNormalizedRGBComponents (material.diffuse),
				specular : JSM.HexColorToNormalizedRGBComponents (material.specular),
				shininess : material.shininess,
				opacity : material.opacity,
				reflection : material.reflection
			});
		}
		
		var body, triangleBody;
		for (i = 0; i < model.BodyCount (); i++) {
			body = model.GetBody (i);
			triangleBody = JSM.ConvertBodyToTriangleBody (body);
			result.AddBody (triangleBody);
		}
		result.Finalize ();
		return result;
	};

	/**
	* Function: ConvertTriangleModelToJsonData
	* Description: Converts a triangle model to json data.
	* Parameters:
	*	model {TriangleModel} the model
	* Returns:
	*	{object} the result data
	*/
	JSM.ConvertTriangleModelToJsonData = function (model)
	{
		function ConvertMaterials (model, materials)
		{
			var i, material, jsonMaterial;
			for (i = 0; i < model.MaterialCount (); i++) {
				material = model.GetMaterial (i);
				jsonMaterial = {
					name : JSM.ValueOrDefault (material.name, ''),
					ambient : material.ambient,
					diffuse : material.diffuse,
					specular : material.specular,
					shininess : material.shininess,
					opacity : material.opacity
				};
				if (material.texture !== undefined && material.texture !== null) {
					jsonMaterial.texture = JSM.ValueOrDefault (material.texture, null);
					jsonMaterial.offset = material.offset;
					jsonMaterial.scale = material.scale;
					jsonMaterial.rotation = material.rotation;
				}
				materials.push (jsonMaterial);
			}
		}

		function ConvertBody (model, body, mesh)
		{
			var trianglesByMaterial = [];
			var materialCount = model.MaterialCount ();
			
			var i, j, coord;
			for (i = 0; i < body.VertexCount (); i++) {
				coord = body.GetVertex (i);
				mesh.vertices.push (coord.x, coord.y, coord.z);
			}
			
			for (i = 0; i < body.NormalCount (); i++) {
				coord = body.GetNormal (i);
				mesh.normals.push (coord.x, coord.y, coord.z);
			}

			for (i = 0; i < body.UVCount (); i++) {
				coord = body.GetUV (i);
				mesh.uvs.push (coord.x, coord.y);
			}
			
			for (i = 0; i < materialCount; i++) {
				trianglesByMaterial.push ([]);
			}

			var triangle;
			for (i = 0; i < body.TriangleCount (); i++) {
				triangle = body.GetTriangle (i);
				if (triangle.mat === undefined || triangle.mat < 0 || triangle.mat >= materialCount) {
					continue;
				}
				trianglesByMaterial[triangle.mat].push (i);
			}

			var triangleCount = 0;
			var triangles, jsonTriangles;
			for (i = 0; i < trianglesByMaterial.length; i++) {
				triangles = trianglesByMaterial[i];
				if (triangles.length === 0) {
					continue;
				}
				
				jsonTriangles =  {
					material : i,
					parameters : []
				};
				for (j = 0; j < triangles.length; j++) {
					triangle = body.GetTriangle (triangles[j]);
					jsonTriangles.parameters.push (
						triangle.v0, triangle.v1, triangle.v2,
						triangle.n0, triangle.n1, triangle.n2,
						triangle.u0, triangle.u1, triangle.u2
					);
				}
				triangleCount = triangleCount + triangles.length;
				mesh.triangles.push (jsonTriangles);
			}
		}
		
		var result = {
			version : 1,
			materials : [],
			meshes : []
		};
		
		ConvertMaterials (model, result.materials);
		
		var i, body, mesh;
		for (i = 0; i < model.BodyCount (); i++) {
			body = model.GetBody (i);
			if (body.TriangleCount () === 0) {
				continue;
			}
			mesh = {
				name : body.GetName (),
				vertices : [],
				normals : [],
				uvs : [],
				triangles : []
			};
			ConvertBody (model, body, mesh);
			result.meshes.push (mesh);
		}
		
		return result;
	};

	/**
	* Function: MergeJsonDataMeshes
	* Description: Merges meshes in json data.
	* Parameters:
	*	jsonData {object} the original data
	* Returns:
	*	{object} the result data
	*/
	JSM.MergeJsonDataMeshes = function (jsonData)
	{
		function MergeMesh (mesh, currentMesh, materialToTriangles)
		{
			function MergeAttributes (mesh, currentMesh)
			{
				var i;
				for (i = 0; i < currentMesh.vertices.length; i++) {
					mesh.vertices.push (currentMesh.vertices[i]);
				}
				for (i = 0; i < currentMesh.normals.length; i++) {
					mesh.normals.push (currentMesh.normals[i]);
				}
				for (i = 0; i < currentMesh.uvs.length; i++) {
					mesh.uvs.push (currentMesh.uvs[i]);
				}
			}
		
			function MergeTriangles (mesh, currentTriangles, materialToTriangles, vertexOffset, normalOffset, uvOffset)
			{
				var material = currentTriangles.material;
				var trianglesIndex = materialToTriangles[material];
				if (trianglesIndex === undefined) {
					mesh.triangles.push ({
						material : material,
						parameters : []
					});
					trianglesIndex = mesh.triangles.length - 1;
					materialToTriangles[material] = trianglesIndex;
				}
				
				var triangles = mesh.triangles[trianglesIndex];
				var triangleParameters = triangles.parameters;
				var i;
				for (i = 0; i < currentTriangles.parameters.length; i = i + 9) {
					triangleParameters.push (
						currentTriangles.parameters[i] + vertexOffset,
						currentTriangles.parameters[i + 1] + vertexOffset,
						currentTriangles.parameters[i + 2] + vertexOffset,
						currentTriangles.parameters[i + 3] + normalOffset,
						currentTriangles.parameters[i + 4] + normalOffset,
						currentTriangles.parameters[i + 5] + normalOffset,
						currentTriangles.parameters[i + 6] + uvOffset,
						currentTriangles.parameters[i + 7] + uvOffset,
						currentTriangles.parameters[i + 8] + uvOffset
					);
				}
			}
		
			var vertexOffset = mesh.vertices.length / 3;
			var normalOffset = mesh.normals.length / 3;
			var uvOffset = mesh.uvs.length / 2;
			MergeAttributes (mesh, currentMesh);

			var i, currentTriangles;
			for (i = 0; i < currentMesh.triangles.length; i++) {
				currentTriangles = currentMesh.triangles[i];
				MergeTriangles (mesh, currentTriangles, materialToTriangles, vertexOffset, normalOffset, uvOffset);
			}
		}

		var result = {
			version : jsonData.version,
			materials : jsonData.materials,
			meshes : []
		};
		
		var mesh = {
			name : 'Merged',
			vertices : [],
			normals : [],
			uvs : [],
			triangles : []
		};
		
		var materialToTriangles = {};
		var i, currentMesh;
		for (i = 0; i < jsonData.meshes.length; i++) {
			currentMesh = jsonData.meshes[i];
			MergeMesh (mesh, currentMesh, materialToTriangles);
		}
		
		result.meshes.push (mesh);
		return result;
	};

	return JSM;
});

define('skylark-jsmodeler/modeler/rayutils',["../core/jsm"],function(JSM){
	/**
	* Function: RayTriangleIntersection
	* Description: Calculates intersection between a ray and a triangle.
	* Parameters:
	*	ray {Ray} the ray
	*	v0, v1, v2 {Coord} the vertices of the triangle
	* Returns:
	*	{object} the result data (position, distance) if intersection found, null otherwise
	*/
	JSM.RayTriangleIntersection = function (ray, v0, v1, v2)
	{
		var rayOrigin = ray.GetOrigin ();
		var rayDirection = ray.GetDirection ();

		var edgeDir1 = JSM.CoordSub (v1, v0);
		var edgeDir2 = JSM.CoordSub (v2, v0);
		var pVector = JSM.VectorCross (rayDirection, edgeDir2);

		var determinant = JSM.VectorDot (edgeDir1, pVector);
		if (JSM.IsZero (determinant)) {
			return null;
		}
		
		var isFrontFacing = JSM.IsPositive (determinant);
		if (!isFrontFacing) {
			return null;
		}

		var invDeterminant = 1.0 / determinant;

		var tVector = JSM.CoordSub (rayOrigin, v0);
		var u = JSM.VectorDot (tVector, pVector) * invDeterminant;
		if (JSM.IsLower (u, 0.0) || JSM.IsGreater (u, 1.0)) {
			return null;
		}

		var qVector = JSM.VectorCross (tVector, edgeDir1);
		var v = JSM.VectorDot (rayDirection, qVector) * invDeterminant;
		if (JSM.IsLower (v, 0.0) || JSM.IsGreater (u + v, 1.0)) {
			return null;
		}
	 
		var distance = JSM.VectorDot (edgeDir2, qVector) * invDeterminant;
		if (!JSM.IsPositive (distance)) {
			return null;
		}

		if (ray.IsLengthReached (distance)) {
			return null;
		}
		
		var scaledDirection = rayDirection.Clone ().MultiplyScalar (distance);
		var intersection = {
			position : JSM.CoordAdd (rayOrigin, scaledDirection),
			distance : distance
		};
		return intersection;
	};

	/**
	* Function: RayBoxIntersection
	* Description: Calculates intersection between a ray and a box.
	* Parameters:
	*	ray {Ray} the ray
	*	min, max {Coord} the minimum and maximum points of the box
	* Returns:
	*	{object} the result data (position, distance) if intersection found, null otherwise
	*/
	JSM.RayBoxIntersection = function (ray, min, max)
	{
		var rayOriginVec = ray.GetOrigin ();
		var rayDirectionVec = ray.GetDirection ();

		var rayOrigin = JSM.CoordToArray (rayOriginVec);
		var rayDirection = JSM.CoordToArray (rayDirectionVec);
		var minB = JSM.CoordToArray (min);
		var maxB = JSM.CoordToArray (max);
		var quadrant = [0, 0, 0];
		var candidatePlane = [0.0, 0.0, 0.0];

		var originInBox = true;
		var i;
		for (i = 0; i < 3; i++) {
			if (JSM.IsLower (rayOrigin[i], minB[i])) {
				quadrant[i] = -1; // left
				candidatePlane[i] = minB[i];
				originInBox = false;
			} else if (JSM.IsGreater (rayOrigin[i], maxB[i])) {
				quadrant[i] = 1; // right
				candidatePlane[i] = maxB[i];
				originInBox = false;
			} else {
				quadrant[i] = 0; // middle
			}
		}

		var intersection = null;
		if (originInBox) {
			intersection = {
				position : rayOriginVec,
				distance : 0.0
			};
			return intersection;
		}

		var maxT = [0.0, 0.0, 0.0];
		for (i = 0; i < 3; i++) {
			if (quadrant[i] !== 0 && !JSM.IsZero (rayDirection[i])) {
				maxT[i] = (candidatePlane[i] - rayOrigin[i]) / rayDirection[i];
			} else {
				maxT[i] = -1.0;
			}
		}

		var whichPlane = 0;
		for (i = 1; i < 3; i++) {
			if (JSM.IsLower (maxT[whichPlane], maxT[i])) {
				whichPlane = i;
			}
		}

		if (JSM.IsNegative (maxT[whichPlane])) {
			return null;
		}

		var xCoord = [0.0, 0.0, 0.0];
		for (i = 0; i < 3; i++) {
			if (whichPlane != i) {
				xCoord[i] = rayOrigin[i] + maxT[whichPlane] * rayDirection[i];
				if (JSM.IsLower (xCoord[i], minB[i]) || JSM.IsGreater (xCoord[i], maxB[i])) {
					return null;
				}
			} else {
				xCoord[i] = candidatePlane[i];
			}
		}

		var intersectionCoord = JSM.CoordFromArray (xCoord);
		var distance = rayOriginVec.DistanceTo (intersectionCoord);
		if (ray.IsLengthReached (distance)) {
			return null;
		}

		intersection = {
			position : intersectionCoord,
			distance : distance
		};
		return intersection;
	};

	/**
	* Function: RayOctreeIntersection
	* Description: Calculates the nearest intersection between a ray and an octree.
	* Parameters:
	*	ray {Ray} the ray
	*	octree {Octree} the octree
	*	intersection {object} the result data (position, distance, userData)
	* Returns:
	*	{boolean} true if found intersection, false otherwise
	*/
	JSM.RayOctreeIntersection = function (ray, octree, intersection)
	{
		var minIntersection = null;
		var foundIntersection = false;
		var calcMinIntersection = (intersection !== null && intersection !== undefined);

		JSM.TraverseOctreeNodes (octree, function (node) {
			if (!calcMinIntersection && foundIntersection) {
				return false;
			}
			if (!JSM.RayBoxIntersection (ray, node.box.min, node.box.max)) {
				return false;
			}
			var i;
			for (i = 0; i < node.triangles.length; i++) {
				var triangle = node.triangles[i];
				var v0 = triangle.v0;
				var v1 = triangle.v1;
				var v2 = triangle.v2;
				var currentIntersection = JSM.RayTriangleIntersection (ray, v0, v1, v2);
				if (currentIntersection !== null) {
					foundIntersection = true;
					if (!calcMinIntersection) {
						return false;
					}
					if (minIntersection === null || currentIntersection.distance < minIntersection.distance) {
						minIntersection = currentIntersection;
						minIntersection.userData = triangle.userData;
					}
				}
			}
			return true;
		});	

		if (calcMinIntersection && minIntersection !== null) {
			intersection.position = minIntersection.position;
			intersection.distance = minIntersection.distance;
			intersection.userData = minIntersection.userData;
		}
		return foundIntersection;
	};

	/**
	* Function: RayTriangleBodyIntersection
	* Description: Calculates the nearest intersection between a ray and a triangle body.
	* Parameters:
	*	ray {Ray} the ray
	*	body {TriangleBody} the triangle body
	*	intersection {object} the result data (position, distance, triangleIndex)
	* Returns:
	*	{boolean} true if found intersection, false otherwise
	*/
	JSM.RayTriangleBodyIntersection = function (ray, body, intersection)
	{
		var minIntersection = null;
		var foundIntersection = false;
		var calcMinIntersection = (intersection !== null && intersection !== undefined);
		
		var i, triangle, v0, v1, v2, currentIntersection;
		for (i = 0; i < body.TriangleCount (); i++) {
			triangle = body.GetTriangle (i);
			v0 = body.GetVertex (triangle.v0);
			v1 = body.GetVertex (triangle.v1);
			v2 = body.GetVertex (triangle.v2);
			currentIntersection = JSM.RayTriangleIntersection (ray, v0, v1, v2);
			if (currentIntersection !== null) {
				foundIntersection = true;
				if (!calcMinIntersection) {
					break;
				}
				if (minIntersection === null || currentIntersection.distance < minIntersection.distance) {
					minIntersection = currentIntersection;
					minIntersection.triangleIndex = i;
				}
			}
		}
		
		if (calcMinIntersection && minIntersection !== null) {
			intersection.position = minIntersection.position;
			intersection.distance = minIntersection.distance;
			intersection.triangleIndex = minIntersection.triangleIndex;
		}
		return foundIntersection;
	};

	/**
	* Function: RayTriangleModelIntersection
	* Description: Calculates the nearest intersection between a ray and a triangle model.
	* Parameters:
	*	ray {Ray} the ray
	*	model {TriangleModel} the triangle model
	*	intersection {object} the result data (position, distance, triangleIndex, bodyIndex)
	* Returns:
	*	{boolean} true if found intersection, false otherwise
	*/
	JSM.RayTriangleModelIntersection = function (ray, model, intersection)
	{
		var minIntersection = null;
		var foundIntersection = false;
		var calcMinIntersection = (intersection !== null && intersection !== undefined);
		var i, body, currentIntersection;
		for (i = 0; i < model.BodyCount (); i++) {
			body = model.GetBody (i);
			currentIntersection = calcMinIntersection ? {} : null;
			if (JSM.RayTriangleBodyIntersection (ray, body, currentIntersection)) {
				foundIntersection = true;
				if (!calcMinIntersection) {
					break;
				}
				if (minIntersection === null || currentIntersection.distance < minIntersection.distance) {
					minIntersection = currentIntersection;
					minIntersection.bodyIndex = i;
				}
			}
		}
		
		if (calcMinIntersection && minIntersection !== null) {
			intersection.position = minIntersection.position;
			intersection.distance = minIntersection.distance;
			intersection.triangleIndex = minIntersection.triangleIndex;
			intersection.bodyIndex = minIntersection.bodyIndex;
		}	
		return foundIntersection;
	};

	/**
	* Function: RayTriangleModelIntersectionWithOctree
	* Description:
	*	Calculates the nearest intersection between a ray and a triangle model.
	*	Caches the octrees for all bodies in the model.
	* Parameters:
	*	ray {Ray} the ray
	*	model {TriangleModel} the triangle model
	*	intersection {object} the result data (position, distance, triangleIndex, bodyIndex)
	* Returns:
	*	{boolean} true if found intersection, false otherwise
	*/
	JSM.RayTriangleModelIntersectionWithOctree = function (ray, model, intersection)
	{
		var minIntersection = null;
		var foundIntersection = false;
		var calcMinIntersection = (intersection !== null && intersection !== undefined);
		var i, body, hasIntersection, currentIntersection;
		for (i = 0; i < model.BodyCount (); i++) {
			body = model.GetBody (i);
			hasIntersection = false;
			currentIntersection = calcMinIntersection ? {} : null;
			if (body.TriangleCount () > 20) {
				if (body.octree === undefined) {
					body.octree = JSM.ConvertTriangleBodyToOctree (body);
				}
				hasIntersection = JSM.RayOctreeIntersection (ray, body.octree, currentIntersection);
			} else {
				hasIntersection = JSM.RayTriangleBodyIntersection (ray, body, currentIntersection);
			}
			
			if (hasIntersection) {
				foundIntersection = true;
				if (!calcMinIntersection) {
					break;
				}
				if (minIntersection === null || currentIntersection.distance < minIntersection.distance) {
					minIntersection = currentIntersection;
					if (currentIntersection.userData !== undefined) {
						minIntersection.triangleIndex = currentIntersection.userData.triangleIndex;
					}
					minIntersection.bodyIndex = i;
				}
			}
		}
		
		if (calcMinIntersection && minIntersection !== null) {
			intersection.position = minIntersection.position;
			intersection.distance = minIntersection.distance;
			intersection.triangleIndex = minIntersection.triangleIndex;
			intersection.bodyIndex = minIntersection.bodyIndex;
		}	
		return foundIntersection;
	};

	return JSM;
});

define('skylark-jsmodeler/import/binaryreader',["../core/jsm"],function(JSM){
	JSM.BinaryReader = function (arrayBuffer, isLittleEndian)
	{
		this.arrayBuffer = arrayBuffer;
		this.dataView = new DataView (arrayBuffer);
		this.isLittleEndian = isLittleEndian;
		this.position = 0;
	};

	JSM.BinaryReader.prototype.GetPosition = function ()
	{
		return this.position;
	};

	JSM.BinaryReader.prototype.GetByteLength = function ()
	{
		return this.arrayBuffer.byteLength;
	};

	JSM.BinaryReader.prototype.Skip = function (bytes)
	{
		this.position = this.position + bytes;
	};

	JSM.BinaryReader.prototype.End = function ()
	{
		return this.position >= this.arrayBuffer.byteLength;
	};

	JSM.BinaryReader.prototype.ReadBoolean = function ()
	{
		var result = this.dataView.getInt8 (this.position);
		this.position = this.position + 1;
		return result ? true : false;
	};

	JSM.BinaryReader.prototype.ReadCharacter = function ()
	{
		var result = this.dataView.getInt8 (this.position);
		this.position = this.position + 1;
		return result;
	};

	JSM.BinaryReader.prototype.ReadUnsignedCharacter = function ()
	{
		var result = this.dataView.getUint8 (this.position);
		this.position = this.position + 1;
		return result;
	};

	JSM.BinaryReader.prototype.ReadInteger16 = function ()
	{
		var result = this.dataView.getInt16 (this.position, this.isLittleEndian);
		this.position = this.position + 2;
		return result;
	};

	JSM.BinaryReader.prototype.ReadUnsignedInteger16 = function ()
	{
		var result = this.dataView.getUint16 (this.position, this.isLittleEndian);
		this.position = this.position + 2;
		return result;
	};

	JSM.BinaryReader.prototype.ReadInteger32 = function ()
	{
		var result = this.dataView.getInt32 (this.position, this.isLittleEndian);
		this.position = this.position + 4;
		return result;
	};

	JSM.BinaryReader.prototype.ReadUnsignedInteger32 = function ()
	{
		var result = this.dataView.getUint32 (this.position, this.isLittleEndian);
		this.position = this.position + 4;
		return result;
	};

	JSM.BinaryReader.prototype.ReadFloat32 = function ()
	{
		var result = this.dataView.getFloat32 (this.position, this.isLittleEndian);
		this.position = this.position + 4;
		return result;
	};

	JSM.BinaryReader.prototype.ReadDouble64 = function ()
	{
		var result = this.dataView.getFloat64 (this.position, this.isLittleEndian);
		this.position = this.position + 8;
		return result;
	};

	return JSM;
});

define('skylark-jsmodeler/import/importerutils',["../core/jsm"],function(JSM){
	JSM.GetArrayBufferFromURL = function (url, callbacks)
	{
		var request = new XMLHttpRequest ();
		request.open ('GET', url, true);
		request.responseType = 'arraybuffer';

		request.onload = function () {
			var arrayBuffer = request.response;
			if (arrayBuffer && callbacks.onReady) {
				callbacks.onReady (arrayBuffer);
			}
		};
		
		request.onerror = function () {
			if (callbacks.onError) {
				callbacks.onError ();
			}
		};

		request.send (null);
	};

	JSM.GetArrayBufferFromFile = function (file, callbacks)
	{
		var reader = new FileReader ();

		reader.onloadend = function (event) {
			if (event.target.readyState == FileReader.DONE && callbacks.onReady) {
				callbacks.onReady (event.target.result);
			}
		};
		
		reader.onerror = function () {
			if (callbacks.onError) {
				callbacks.onError ();
			}
		};

		reader.readAsArrayBuffer (file);
	};

	JSM.GetStringBufferFromURL = function (url, callbacks)
	{
		var request = new XMLHttpRequest ();
		request.open ('GET', url, true);
		request.responseType = 'text';

		request.onload = function () {
			var stringBuffer = request.response;
			if (stringBuffer && callbacks.onReady) {
				callbacks.onReady (stringBuffer);
			}
		};
		
		request.onerror = function () {
			if (callbacks.onError) {
				callbacks.onError ();
			}
		};

		request.send (null);
	};

	JSM.GetStringBufferFromFile = function (file, callbacks)
	{
		var reader = new FileReader ();

		reader.onloadend = function (event) {
			if (event.target.readyState == FileReader.DONE && callbacks.onReady) {
				callbacks.onReady (event.target.result);
			}
		};

		reader.onerror = function () {
			if (callbacks.onError) {
				callbacks.onError ();
			}
		};	
		
		reader.readAsText (file);
	};

	JSM.LoadMultipleBuffers = function (inputList, onReady)
	{
		function LoadMultipleBuffersInternal (inputList, index, result, onReady)
		{
			if (index >= inputList.length) {
				onReady (result);
				return;
			}
			
			var currentInput = inputList[index];
			var loaderFunction = null;
			if (currentInput.isFile) {
				if (currentInput.isArrayBuffer) {
					loaderFunction = JSM.GetArrayBufferFromFile;
				} else {
					loaderFunction = JSM.GetStringBufferFromFile;
				}
			} else {
				if (currentInput.isArrayBuffer) {
					loaderFunction = JSM.GetArrayBufferFromURL;
				} else {
					loaderFunction = JSM.GetStringBufferFromURL;
				}
			}
			
			loaderFunction (currentInput.originalObject, {
				onReady : function (resultBuffer) {
					result.push (resultBuffer);
					LoadMultipleBuffersInternal (inputList, index + 1, result, onReady);
				},
				onError : function () {
					result.push (null);
					LoadMultipleBuffersInternal (inputList, index + 1, result, onReady);
				}
			});
		}

		var result = [];
		LoadMultipleBuffersInternal (inputList, 0, result, function (result) {
			onReady (result);
		});
	};

	return JSM;
});

define('skylark-jsmodeler/import/importer3ds',["../core/jsm"],function(JSM){
	JSM.Read3dsFile = function (arrayBuffer, callbacks)
	{
		function OnLog (logText, logLevel)
		{
			if (callbacks.onLog !== undefined && callbacks.onLog !== null) {
				callbacks.onLog (logText, logLevel);
			}
		}

		function OnMaterial (material)
		{
			if (callbacks.onMaterial !== undefined && callbacks.onMaterial !== null) {
				callbacks.onMaterial (material);
			}
		}

		function OnMesh (objectName)
		{
			if (callbacks.onMesh !== undefined && callbacks.onMesh !== null) {
				callbacks.onMesh (objectName);
			}
		}

		function OnTransformation (matrix)
		{
			if (callbacks.onTransformation !== undefined && callbacks.onTransformation !== null) {
				callbacks.onTransformation (matrix);
			}
		}
		
		function OnObjectNode (objectNode)
		{
			if (callbacks.onObjectNode !== undefined && callbacks.onObjectNode !== null) {
				callbacks.onObjectNode (objectNode);
			}
		}

		function OnVertex (x, y, z)
		{
			if (callbacks.onVertex !== undefined && callbacks.onVertex !== null) {
				callbacks.onVertex (x, y, z);
			}
		}

		function OnTextureVertex (x, y)
		{
			if (callbacks.onTextureVertex !== undefined && callbacks.onTextureVertex !== null) {
				callbacks.onTextureVertex (x, y);
			}
		}

		function OnFace (v0, v1, v2, flags)
		{
			if (callbacks.onFace !== undefined && callbacks.onFace !== null) {
				callbacks.onFace (v0, v1, v2, flags);
			}
		}

		function OnFaceMaterial (faceIndex, materialName)
		{
			if (callbacks.onFaceMaterial !== undefined && callbacks.onFaceMaterial !== null) {
				callbacks.onFaceMaterial (faceIndex, materialName);
			}
		}

		function OnFaceSmoothingGroup (faceIndex, smoothingGroup)
		{
			if (callbacks.onFaceSmoothingGroup !== undefined && callbacks.onFaceSmoothingGroup !== null) {
				callbacks.onFaceSmoothingGroup (faceIndex, smoothingGroup);
			}
		}

		function ReadChunk (reader, onReady)
		{
			var chunkId = reader.ReadUnsignedInteger16 ();
			var chunkLength = reader.ReadUnsignedInteger32 ();
			onReady (chunkId, chunkLength);
		}
		
		function SkipChunk (reader, length)
		{
			reader.Skip (length - 6);
		}
		
		function GetChunkEnd (reader, length)
		{
			return reader.GetPosition () + length - 6;
		}
		
		function ReadName (reader)
		{
			var name = '';
			var letter = 0;
			var count = 0;
			while (count < 64) {
				letter = reader.ReadCharacter ();
				if (letter === 0) {
					break;
				}
				name = name + String.fromCharCode (letter);
				count = count + 1;
			}
			return name;
		}

		function ReadVector (reader)
		{
			var result = [];
			var i;
			for (i = 0; i < 3; i++) {
				result[i] = reader.ReadFloat32 ();
			}
			return result;
		}

		function ReadChunks (reader, endByte, onReady)
		{
			while (reader.GetPosition () <= endByte - 6) {
				ReadChunk (reader, onReady);
			}
		}

		function ReadFile (reader, chunks)
		{
			function ReadColorChunk (reader, id, length)
			{
				var color = [0.0, 0.0, 0.0];
				var endByte = GetChunkEnd (reader, length);
				var hasLinColor = false;
				ReadChunks (reader, endByte, function (chunkId, chunkLength) {
					if (chunkId == chunks.MAT_COLOR) {
						if (!hasLinColor) {
							color[0] = reader.ReadUnsignedCharacter () / 255.0;
							color[1] = reader.ReadUnsignedCharacter () / 255.0;
							color[2] = reader.ReadUnsignedCharacter () / 255.0;
						}
					} else if (chunkId == chunks.MAT_LIN_COLOR) {
						color[0] = reader.ReadUnsignedCharacter () / 255.0;
						color[1] = reader.ReadUnsignedCharacter () / 255.0;
						color[2] = reader.ReadUnsignedCharacter () / 255.0;
						hasLinColor = true;
					} else if (chunkId == chunks.MAT_COLOR_F) {
						if (!hasLinColor) {
							color[0] = reader.ReadFloat32 ();
							color[1] = reader.ReadFloat32 ();
							color[2] = reader.ReadFloat32 ();
						}
					} else if (chunkId == chunks.MAT_LIN_COLOR_F) {
						color[0] = reader.ReadFloat32 ();
						color[1] = reader.ReadFloat32 ();
						color[2] = reader.ReadFloat32 ();
						hasLinColor = true;
					} else {
						SkipChunk (reader, chunkLength);
					}
				});
				return color;
			}
			
			function ReadPercentageChunk (reader, id, length)
			{
				var percentage = 0.0;
				var endByte = GetChunkEnd (reader, length);
				ReadChunks (reader, endByte, function (chunkId, chunkLength) {
					if (chunkId == chunks.PERCENTAGE) {
						percentage = reader.ReadUnsignedInteger16 () / 100.0;
					} else if (chunkId == chunks.PERCENTAGE_F) {
						percentage = reader.ReadFloat32 ();
					} else {
						SkipChunk (reader, chunkLength);
					}
				});
				return percentage;
			}

			function ReadTextureMapChunk (reader, id, length, material)
			{
				material.texture = null;
				material.offset = [0.0, 0.0];
				material.scale = [1.0, 1.0];
				material.rotation = 0.0;
			
				var endByte = GetChunkEnd (reader, length);
				ReadChunks (reader, endByte, function (chunkId, chunkLength) {
					if (chunkId == chunks.MAT_TEXMAP_NAME) {
						material.texture = ReadName (reader);
					} else if (chunkId == chunks.MAT_TEXMAP_UOFFSET) {
						material.offset[0] = reader.ReadFloat32 ();
					} else if (chunkId == chunks.MAT_TEXMAP_VOFFSET) {
						material.offset[1] = reader.ReadFloat32 ();
					} else if (chunkId == chunks.MAT_TEXMAP_USCALE) {
						material.scale[0] = reader.ReadFloat32 ();
					} else if (chunkId == chunks.MAT_TEXMAP_VSCALE) {
						material.scale[1] = reader.ReadFloat32 ();
					} else if (chunkId == chunks.MAT_TEXMAP_ROTATION) {
						material.rotation = reader.ReadFloat32 ();
					} else {
						SkipChunk (reader, chunkLength);
					}
				});
			}

			function ReadMaterialChunk (reader, id, length)
			{
				OnLog ('Read material chunk (' + id.toString (16) + ', ' + length + ')', 2);
				
				var material = {};
				var endByte = GetChunkEnd (reader, length);
				ReadChunks (reader, endByte, function (chunkId, chunkLength) {
					if (chunkId == chunks.MAT_NAME) {
						OnLog ('Read material name chunk (' + id.toString (16) + ', ' + length + ')', 3);
						material.name = ReadName (reader);
					} else if (chunkId == chunks.MAT_AMBIENT) {
						OnLog ('Read material ambient chunk (' + id.toString (16) + ', ' + length + ')', 3);
						material.ambient = ReadColorChunk (reader, chunkId, chunkLength);
					} else if (chunkId == chunks.MAT_DIFFUSE) {
						OnLog ('Read material diffuse chunk (' + id.toString (16) + ', ' + length + ')', 3);
						material.diffuse = ReadColorChunk (reader, chunkId, chunkLength);
					} else if (chunkId == chunks.MAT_SPECULAR) {
						OnLog ('Read material specular chunk (' + id.toString (16) + ', ' + length + ')', 3);
						material.specular = ReadColorChunk (reader, chunkId, chunkLength);
					} else if (chunkId == chunks.MAT_SHININESS) {
						OnLog ('Read material shininess chunk (' + id.toString (16) + ', ' + length + ')', 3);
						material.shininess = ReadPercentageChunk (reader, chunkId, chunkLength);
					} else if (chunkId == chunks.MAT_SHININESS_STRENGTH) {
						OnLog ('Read material shininess strength chunk (' + id.toString (16) + ', ' + length + ')', 3);
						material.shininessStrength = ReadPercentageChunk (reader, chunkId, chunkLength);
					} else if (chunkId == chunks.MAT_TRANSPARENCY) {
						OnLog ('Read material transparency chunk (' + id.toString (16) + ', ' + length + ')', 3);
						material.transparency = ReadPercentageChunk (reader, chunkId, chunkLength);
					} else if (chunkId == chunks.MAT_TEXMAP) {
						OnLog ('Read material texture map chunk (' + id.toString (16) + ', ' + length + ')', 3);
						ReadTextureMapChunk (reader, chunkId, chunkLength, material);
					} else {
						OnLog ('Skip chunk (' + chunkId.toString (16) + ', ' + chunkLength + ')', 3);
						SkipChunk (reader, chunkLength);
					}
				});
				
				OnMaterial (material);
			}

			function ReadVerticesChunk (reader, id, length)
			{
				OnLog ('Read vertices chunk (' + id.toString (16) + ', ' + length + ')', 4);
				
				var vertexCount = reader.ReadUnsignedInteger16 ();
				var i, x, y, z;
				for (i = 0; i < vertexCount; i++) {
					x = reader.ReadFloat32 ();
					y = reader.ReadFloat32 ();
					z = reader.ReadFloat32 ();
					OnVertex (x, y, z);
				}
			}

			function ReadTextureVerticesChunk (reader, id, length)
			{
				OnLog ('Read texture vertices chunk (' + id.toString (16) + ', ' + length + ')', 4);
				
				var texVertexCount = reader.ReadUnsignedInteger16 ();
				var i, x, y;
				for (i = 0; i < texVertexCount; i++) {
					x = reader.ReadFloat32 ();
					y = reader.ReadFloat32 ();
					OnTextureVertex (x, y);
				}
			}

			function ReadFaceMaterialsChunk (reader, id, length)
			{
				OnLog ('Read face materials chunk (' + id.toString (16) + ', ' + length + ')', 5);
				
				var materialName = ReadName (reader);
				var faceCount = reader.ReadUnsignedInteger16 ();
				var i, faceIndex;
				for (i = 0; i < faceCount; i++) {
					faceIndex = reader.ReadUnsignedInteger16 ();
					OnFaceMaterial (faceIndex, materialName);
				}
			}
			
			function ReadFaceSmoothingGroupsChunk (reader, faceCount, id, length)
			{
				OnLog ('Read face smoothing groups chunk (' + id.toString (16) + ', ' + length + ')', 5);
				
				var i, smoothingGroup;
				for (i = 0; i < faceCount; i++) {
					smoothingGroup = reader.ReadUnsignedInteger32 ();
					OnFaceSmoothingGroup (i, smoothingGroup);
				}
			}

			function ReadFacesChunk (reader, id, length)
			{
				OnLog ('Read faces chunk (' + id.toString (16) + ', ' + length + ')', 4);
				
				var endByte = GetChunkEnd (reader, length);
				var faceCount = reader.ReadUnsignedInteger16 ();
				var i, v0, v1, v2, flags;
				for (i = 0; i < faceCount; i++) {
					v0 = reader.ReadUnsignedInteger16 ();
					v1 = reader.ReadUnsignedInteger16 ();
					v2 = reader.ReadUnsignedInteger16 ();
					flags = reader.ReadUnsignedInteger16 ();
					OnFace (v0, v1, v2, flags);
				}

				ReadChunks (reader, endByte, function (chunkId, chunkLength) {
					if (chunkId == chunks.TRI_MATERIAL) {
						ReadFaceMaterialsChunk (reader, chunkId, chunkLength);
					} else if (chunkId == chunks.TRI_SMOOTH) {
						ReadFaceSmoothingGroupsChunk (reader, faceCount,  chunkId, chunkLength);
					} else {
						OnLog ('Skip chunk (' + chunkId.toString (16) + ', ' + chunkLength + ')', 5);
						SkipChunk (reader, chunkLength);
					}
				});
			}

			function ReadTransformationChunk (reader, id, length)
			{
				OnLog ('Read transformation chunk (' + id.toString (16) + ', ' + length + ')', 4);
				var matrix = [];
				var i, j;
				for (i = 0; i < 4; i++) {
					for (j = 0; j < 3; j++) {
						matrix.push (reader.ReadFloat32 ());
					}
					if (i < 3) {
						matrix.push (0);
					} else {
						matrix.push (1);
					}
				}

				OnTransformation (matrix);
			}

			function ReadMeshChunk (reader, objectName, id, length)
			{
				OnLog ('Read mesh chunk (' + objectName + ', ' +  id.toString (16) + ', ' + length + ')', 3);

				OnMesh (objectName);
				var endByte = GetChunkEnd (reader, length);
				ReadChunks (reader, endByte, function (chunkId, chunkLength) {
					if (chunkId == chunks.TRI_VERTEX) {
						ReadVerticesChunk (reader, chunkId, chunkLength);
					} else if (chunkId == chunks.TRI_TEXVERTEX) {
						ReadTextureVerticesChunk (reader, chunkId, chunkLength);
					} else if (chunkId == chunks.TRI_FACE) {
						ReadFacesChunk (reader, chunkId, chunkLength);
					} else if (chunkId == chunks.TRI_TRANSFORMATION) {
						ReadTransformationChunk (reader, chunkId, chunkLength);
					} else {
						OnLog ('Skip chunk (' + chunkId.toString (16) + ', ' + chunkLength + ')', 4);
						SkipChunk (reader, chunkLength);
					}
				});
			}

			function ReadLightChunk (reader, objectName, id, length)
			{
				OnLog ('Skip light chunk (' + objectName + ', ' + id.toString (16) + ', ' + length + ')', 3);
				SkipChunk (reader, length);
			}

			function ReadCameraChunk (reader, objectName, id, length)
			{
				OnLog ('Skip camera chunk (' + objectName + ', ' +  id.toString (16) + ', ' + length + ')', 3);
				SkipChunk (reader, length);
			}

			function ReadObjectChunk (reader, id, length)
			{
				OnLog ('Read object chunk (' + id.toString (16) + ', ' + length + ')', 2);
				
				var endByte = GetChunkEnd (reader, length);
				var objectName = ReadName (reader);
				ReadChunks (reader, endByte, function (chunkId, chunkLength) {
					if (chunkId == chunks.OBJ_TRIMESH) {
						ReadMeshChunk (reader, objectName, chunkId, chunkLength);
					} else if (chunkId == chunks.OBJ_LIGHT) {
						ReadLightChunk (reader, objectName, chunkId, chunkLength);
					} else if (chunkId == chunks.OBJ_CAMERA) {
						ReadCameraChunk (reader, objectName, chunkId, chunkLength);
					} else {
						OnLog ('Skip chunk (' + chunkId.toString (16) + ', ' + chunkLength + ')', 3);
						SkipChunk (reader, chunkLength);
					}
				});
			}

			function ReadEditorChunk (reader, id, length)
			{
				OnLog ('Read editor chunk (' + id.toString (16) + ', ' + length + ')', 1);
				
				var endByte = GetChunkEnd (reader, length);
				ReadChunks (reader, endByte, function (chunkId, chunkLength) {
					if (chunkId == chunks.EDIT_MATERIAL) {
						ReadMaterialChunk (reader, chunkId, chunkLength);
					} else if (chunkId == chunks.EDIT_OBJECT) {
						ReadObjectChunk (reader, chunkId, chunkLength);
					} else {
						OnLog ('Skip chunk (' + chunkId.toString (16) + ', ' + chunkLength + ')', 2);
						SkipChunk (reader, chunkLength);
					}
				});
			}

			function ReadObjectNodeChunk (reader, id, length)
			{
				function ReadTrackVector (reader, type)
				{
					var result = [];
					reader.Skip (10);
					
					var i, flags, current, tmp;
					var keyNum = reader.ReadInteger32 ();
					for (i = 0; i < keyNum; i++) {
						reader.ReadInteger32 ();
						flags = reader.ReadUnsignedInteger16 ();
						if (flags !== 0) {
							reader.ReadFloat32 ();
						}
						
						current = null;
						if (type == chunks.OBJECT_ROTATION) {
							tmp = reader.ReadFloat32 ();
							current = ReadVector (reader);
							current[3] = tmp;
						} else {
							current = ReadVector (reader);
						}
						result.push (current);
					}

					return result;
				}
			
				OnLog ('Read object node chunk (' + id.toString (16) + ', ' + length + ')', 2);
				
				var objectNode = {
					name : '',
					nodeId : -1,
					flags : -1,
					userId : -1,
					pivot : [0.0, 0.0, 0.0],
					positions : [],
					rotations : [],
					scales : []
				};
				
				var endByte = GetChunkEnd (reader, length);
				ReadChunks (reader, endByte, function (chunkId, chunkLength) {
					if (chunkId == chunks.OBJECT_HIERARCHY) {
						objectNode.name = ReadName (reader);
						objectNode.flags = reader.ReadUnsignedInteger32 ();
						objectNode.userId = reader.ReadUnsignedInteger16 ();
					} else if (chunkId == chunks.OBJECT_PIVOT) {
						objectNode.pivot = ReadVector (reader);
					} else if (chunkId == chunks.OBJECT_POSITION) {
						objectNode.positions = ReadTrackVector (reader, chunks.OBJECT_POSITION);
					} else if (chunkId == chunks.OBJECT_ROTATION) {
						objectNode.rotations = ReadTrackVector (reader, chunks.OBJECT_ROTATION);
					} else if (chunkId == chunks.OBJECT_SCALE) {
						objectNode.scales = ReadTrackVector (reader, chunks.OBJECT_SCALE);
					} else if (chunkId == chunks.OBJECT_ID) {
						objectNode.nodeId = reader.ReadUnsignedInteger16 ();
					} else {
						OnLog ('Skip chunk (' + chunkId.toString (16) + ', ' + chunkLength + ')', 3);
						SkipChunk (reader, chunkLength);
					}
				});

				OnObjectNode (objectNode);
			}
			
			function ReadKeyFrameChunk (reader, id, length)
			{
				OnLog ('Read keyframe chunk (' + id.toString (16) + ', ' + length + ')', 1);
				
				var endByte = GetChunkEnd (reader, length);
				ReadChunks (reader, endByte, function (chunkId, chunkLength) {
					if (chunkId == chunks.OBJECT_NODE) {
						ReadObjectNodeChunk (reader, chunkId, chunkLength);
					} else {
						OnLog ('Skip chunk (' + chunkId.toString (16) + ', ' + chunkLength + ')', 2);
						SkipChunk (reader, chunkLength);
					}
				});
			}
			
			function ReadMainChunk (reader, id, length)
			{
				OnLog ('Read main chunk (' + id.toString (16) + ', ' + length + ')', 0);
				
				var endByte = GetChunkEnd (reader, length);
				ReadChunks (reader, endByte, function (chunkId, chunkLength) {
					if (chunkId == chunks.EDIT3DS) {
						ReadEditorChunk (reader, chunkId, chunkLength);
					} else if (chunkId == chunks.KF3DS) {
						ReadKeyFrameChunk (reader, chunkId, chunkLength);
					} else {
						OnLog ('Skip chunk (' + chunkId.toString (16) + ', ' + chunkLength + ')', 1);
						SkipChunk (reader, chunkLength);
					}
				});
			}
		
			var endByte = reader.GetByteLength ();
			ReadChunks (reader, endByte, function (chunkId, chunkLength) {
				if (chunkId == chunks.MAIN3DS) {
					ReadMainChunk (reader, chunkId, chunkLength);
				} else {
					OnLog ('Skip chunk (' + chunkId.toString (16) + ', ' + chunkLength + ')', 0);
					SkipChunk (reader, chunkLength);
				}
			});
		}
		
		if (callbacks === undefined || callbacks === null) {
			callbacks = {};
		}

		var chunks = {
			MAIN3DS : 0x4D4D,
			EDIT3DS : 0x3D3D,
			EDIT_MATERIAL : 0xAFFF,
			MAT_NAME : 0xA000,
			MAT_AMBIENT : 0xA010,
			MAT_DIFFUSE : 0xA020,
			MAT_SPECULAR : 0xA030,
			MAT_SHININESS : 0xA040,
			MAT_SHININESS_STRENGTH : 0xA041,
			MAT_TRANSPARENCY : 0xA050,
			MAT_COLOR_F : 0x0010,
			MAT_COLOR : 0x0011,
			MAT_LIN_COLOR : 0x0012,
			MAT_LIN_COLOR_F : 0x0013,
			MAT_TEXMAP : 0xA200,
			MAT_TEXMAP_NAME : 0xA300,
			MAT_TEXMAP_UOFFSET : 0xA358,
			MAT_TEXMAP_VOFFSET : 0xA35A,
			MAT_TEXMAP_USCALE : 0xA354,
			MAT_TEXMAP_VSCALE : 0xA356,
			MAT_TEXMAP_ROTATION : 0xA35C,
			PERCENTAGE : 0x0030,
			PERCENTAGE_F : 0x0031,
			EDIT_OBJECT : 0x4000,
			OBJ_TRIMESH : 0x4100,
			OBJ_LIGHT : 0x4600,
			OBJ_CAMERA : 0x4700,
			TRI_VERTEX : 0x4110,
			TRI_TEXVERTEX : 0x4140,
			TRI_FACE : 0x4120,
			TRI_TRANSFORMATION : 0x4160,
			TRI_MATERIAL : 0x4130,
			TRI_SMOOTH : 0x4150,
			KF3DS : 0xB000,
			OBJECT_NODE : 0xB002,
			OBJECT_HIERARCHY : 0xB010,
			OBJECT_PIVOT : 0xB013,
			OBJECT_POSITION : 0xB020,
			OBJECT_ROTATION : 0xB021,
			OBJECT_SCALE : 0xB022,
			OBJECT_ID : 0xB030
		};
		
		var reader = new JSM.BinaryReader (arrayBuffer, true);
		ReadFile (reader, chunks);
	};

	JSM.Convert3dsToJsonData = function (arrayBuffer, callbacks)
	{
		function OnFileRequested (fileName)
		{
			if (callbacks.onFileRequested !== undefined && callbacks.onFileRequested !== null) {
				return callbacks.onFileRequested (fileName);
			}
			return null;
		}

		function FinalizeMeshes (nodeHierarcy, triangleModel, materialNameToIndex)
		{
			function ApplyTransformation (body, node, nodeHierarcy)
			{
				function MatrixScale (matrix, scale)
				{
					var x = scale[0];
					var y = scale[1];
					var z = scale[2];
				
					var i;
					for (i = 0; i < 4; i++) {
						matrix[0 * 4 + i] *= x;
						matrix[1 * 4 + i] *= y;
						matrix[2 * 4 + i] *= z;
					}
					
					return matrix;
				}

				function MatrixTranslate (matrix, translation)
				{
					var x = translation[0];
					var y = translation[1];
					var z = translation[2];

					var i;
					for (i = 0; i < 3; i++) {
						matrix[3 * 4 + i] += matrix[0 * 4 + i] * x + matrix[1 * 4 + i] * y + matrix[2 * 4 + i] * z;
					}
					
					return matrix;
				}

				function MatrixRotate (matrix, quaternion)
				{
					var rotation = JSM.MatrixRotationQuaternion (quaternion);
					return JSM.MatrixMultiply (rotation, matrix);
				}

				function TransformBodyVertices (body, matrix)
				{
					var i, vertex, transformedVertex;
					for (i = 0; i < body.VertexCount (); i++) {
						vertex = body.GetVertex (i);
						transformedVertex = JSM.ApplyTransformation (matrix, vertex);
						body.SetVertex (i, transformedVertex.x, transformedVertex.y, transformedVertex.z);
					}			
				}
				
				function FlipByXCoordinates (body, matrix, invMatrix)	
				{
					var determinant = JSM.MatrixDeterminant (matrix);
					if (!JSM.IsNegative (determinant)) {
						return;
					}

					var flippedMatrix = JSM.MatrixClone (matrix);
					MatrixScale (flippedMatrix, [-1.0, 1.0, 1.0]);
					
					var finalMatrix = JSM.MatrixMultiply (invMatrix, flippedMatrix);
					TransformBodyVertices (body, finalMatrix);
				}

				function GetNodeTransformation (node, nodeHierarcy)
				{
					function GetNodePosition (node)
					{
						if (node.positions.length === 0) {
							return [0.0, 0.0, 0.0];
						}
						return node.positions[0];
					}
				
					function GetNodeRotation (node)
					{
						function GetQuatFromAxisAndAngle (quat)
						{
							var result = [0.0, 0.0, 0.0, 1.0];
							var length = Math.sqrt (quat[0] * quat[0] + quat[1] * quat[1] + quat[2] * quat[2]);
							if (JSM.IsPositive (length)) {
								var omega = quat[3] * -0.5;
								var si = Math.sin (omega) / length;
								result = [si * quat[0], si * quat[1], si * quat[2], Math.cos (omega)];
							}
							return result;
						}

						if (node.rotations.length === 0) {
							return [0.0, 0.0, 0.0, 0.0];
						}
						
						var quat = node.rotations[0];
						return GetQuatFromAxisAndAngle (quat);
					}

					function GetNodeScale (node)
					{
						if (node.scales.length === 0) {
							return [0.0, 0.0, 0.0, 0.0];
						}
						return node.scales[0];
					}
					
					if (node.matrix !== undefined) {
						return node.matrix;
					}
					
					var result = JSM.MatrixIdentity ();
					result = MatrixTranslate (result, GetNodePosition (node));
					result = MatrixRotate (result, GetNodeRotation (node));
					result = MatrixScale (result, GetNodeScale (node));
					
					if (node.userId != 65535) {
						var parentIndex = nodeHierarcy.nodeIdToIndex[node.userId];
						if (parentIndex !== undefined) {
							var parentNode = nodeHierarcy.nodes[parentIndex];
							var parentTransformation = GetNodeTransformation (parentNode, nodeHierarcy);
							result = JSM.MatrixMultiply (result, parentTransformation);
						}
					}
					
					node.matrix = result;
					return result;
				}
			
				function GetNodePivotPoint (node)
				{
					if (node === undefined || node === null) {
						return [0.0, 0.0, 0.0];
					}
					return node.pivot;
				}

				function GetMeshTransformation (mesh)
				{
					if (mesh === undefined || mesh === null) {
						return null;
					}
					return mesh.transformation;
				}
				
				var currentMeshData = body.meshData;
				var meshTransformation = GetMeshTransformation (currentMeshData);
				if (meshTransformation === null) {
					return;
				}
				
				var nodeTransformation = null;
				if (node !== null) {
					nodeTransformation = GetNodeTransformation (node, nodeHierarcy);
				} else {
					nodeTransformation = meshTransformation;
				}

				var matrix = JSM.MatrixClone (nodeTransformation);
				var meshMatrix = JSM.MatrixClone (meshTransformation);
				var invMeshMatrix = JSM.MatrixInvert (meshMatrix);
				if (invMeshMatrix === null) {
					return;
				}

				FlipByXCoordinates (body, meshMatrix, invMeshMatrix);

				var nodePivotPoint = GetNodePivotPoint (node);
				MatrixTranslate (matrix, [-nodePivotPoint[0], -nodePivotPoint[1], -nodePivotPoint[2]]);
				var finalMatrix = JSM.MatrixMultiply (invMeshMatrix, matrix);
				TransformBodyVertices (body, finalMatrix);
			}

			function FinalizeMaterials (body, materialNameToIndex)
			{
				var hasTextureCoordinates = (body.UVCount () == body.VertexCount ());
				var currentMeshData = body.meshData;
				var i, triangle, materialName, materialIndex, smoothingGroup;
				for (i = 0; i < body.TriangleCount (); i++) {
					triangle = body.GetTriangle (i);
					if (hasTextureCoordinates) {
						triangle.u0 = triangle.v0;
						triangle.u1 = triangle.v1;
						triangle.u2 = triangle.v2;
					}
					
					materialName = currentMeshData.faceToMaterial[i];
					if (materialName !== undefined) {
						materialIndex = materialNameToIndex[materialName];
						if (materialIndex !== undefined) {
							triangle.mat = materialIndex;
						}
					}
					
					smoothingGroup = currentMeshData.faceToSmoothingGroup[i];
					if (smoothingGroup !== undefined && smoothingGroup > 0) {
						triangle.curve = smoothingGroup;
					}
				}
			}

			function FinalizeMesh (body, node, materialNameToIndex, nodeHierarcy)
			{
				ApplyTransformation (body, node, nodeHierarcy);
				FinalizeMaterials (body, materialNameToIndex);		
			}
			
			function DuplicateBody (model, body, bodyIndex, instanceIndex)
			{
				var clonedBody = body.Clone ();
				clonedBody.SetName (clonedBody.GetName () + ' (' + instanceIndex + ')');
				if (bodyIndex < model.BodyCount ()) {
					model.AddBodyToIndex (clonedBody, bodyIndex);
				} else {
					model.AddBody (clonedBody);
				}
				return clonedBody;
			}

			var i, j, currentBody, currentMeshData, currentNode;
			var firstNode, addedBody;
			for (i = 0; i < triangleModel.BodyCount (); i++) {
				currentBody = triangleModel.GetBody (i);
				currentMeshData = currentBody.meshData;
				if (currentMeshData.objectNodes.length === 0) {
					FinalizeMesh (currentBody, null, materialNameToIndex, nodeHierarcy);
				} else {
					firstNode = nodeHierarcy.nodes[currentMeshData.objectNodes[0]];
					for (j = 1; j < currentMeshData.objectNodes.length; j++) {
						currentNode = nodeHierarcy.nodes[currentMeshData.objectNodes[j]];
						addedBody = DuplicateBody (triangleModel, currentBody, i + 1, j + 1);
						addedBody.meshData = currentBody.meshData;
						FinalizeMesh (addedBody, currentNode, materialNameToIndex, nodeHierarcy);
						i = i + 1;
					}
					FinalizeMesh (currentBody, firstNode, materialNameToIndex, nodeHierarcy);
				}
			}
		}

		if (callbacks === undefined || callbacks === null) {
			callbacks = {};
		}

		var triangleModel = new JSM.TriangleModel ();
		var currentBody = null;
		
		var materialNameToIndex = {};
		var bodyNameToIndex = {};

		var nodeHierarcy = {
			nodes : [],
			nodeIdToIndex : {}
		};
		
		JSM.Read3dsFile (arrayBuffer, {
			onMaterial : function (material) {
				function GetOpacity (transparency)
				{
					if (transparency === undefined || transparency === null) {
						return 1.0;
					}
					return 1.0 - transparency;
				}
				
				function GetShininess (shininess, shininessStrength)
				{
					if (shininess === undefined || shininess === null) {
						return 0.0;
					}
					if (shininessStrength === undefined || shininessStrength === null) {
						return 0.0;
					}
					return shininess * shininessStrength;
				}
				
				if (materialNameToIndex[material.name] !== undefined) {
					return;
				}
				
				var index = triangleModel.AddMaterial ({
					name : material.name,
					ambient : material.ambient,
					diffuse : material.diffuse,
					specular : material.specular,
					shininess : GetShininess (material.shininess, material.shininessStrength),
					opacity : GetOpacity (material.transparency)
				});
				
				var currentMaterial = triangleModel.GetMaterial (index);
				if (material.texture !== undefined && material.texture !== null) {
					var textureBuffer = OnFileRequested (material.texture);
					if (textureBuffer !== null) {
						var blob = new window.Blob ([textureBuffer]);
						var blobURL = window.URL.createObjectURL (blob);
						currentMaterial.texture = blobURL;
						currentMaterial.offset = material.offset;
						currentMaterial.scale = material.scale;
						currentMaterial.rotation = -material.rotation;
					}
				}

				materialNameToIndex[material.name] = index;
			},
			onMesh : function (meshName) {
				if (bodyNameToIndex[meshName] !== undefined) {
					return;
				}
			
				var index = triangleModel.AddBody (new JSM.TriangleBody (meshName));
				currentBody = triangleModel.GetBody (index);
				currentBody.meshData ={
					faceToMaterial : {},
					faceToSmoothingGroup : {},
					objectNodes : [],
					transformation : null
				};
				bodyNameToIndex[meshName] = index;
			},
			onTransformation : function (matrix) {
				if (currentBody === null) {
					return;
				}
				currentBody.meshData.transformation = matrix;
			},
			onObjectNode : function (objectNode) {
				var nodeIndex = nodeHierarcy.nodes.length;
				nodeHierarcy.nodes.push (objectNode);
				nodeHierarcy.nodeIdToIndex[objectNode.nodeId] = nodeIndex;

				var bodyIndex = bodyNameToIndex[objectNode.name];
				if (bodyIndex === undefined) {
					return;
				}
				var body = triangleModel.GetBody (bodyIndex);
				body.meshData.objectNodes.push (nodeIndex);
			},
			onVertex : function (x, y, z) {
				if (currentBody === null) {
					return;
				}
				currentBody.AddVertex (x, y, z);
			},
			onTextureVertex : function (x, y) {
				if (currentBody === null) {
					return;
				}
				currentBody.AddUV (x, y);
			},
			onFace : function (v0, v1, v2) {
				if (currentBody === null) {
					return;
				}
				currentBody.AddTriangle (v0, v1, v2);
			},
			onFaceMaterial : function (faceIndex, materialName) {
				if (currentBody === null) {
					return;
				}
				currentBody.meshData.faceToMaterial[faceIndex] = materialName;
			},
			onFaceSmoothingGroup : function (faceIndex, smoothingGroup) {
				if (currentBody === null) {
					return;
				}
				currentBody.meshData.faceToSmoothingGroup[faceIndex] = smoothingGroup;
			},
			onFileRequested : OnFileRequested
		});
		
		FinalizeMeshes (nodeHierarcy, triangleModel, materialNameToIndex);
		triangleModel.Finalize ();

		var jsonData = JSM.ConvertTriangleModelToJsonData (triangleModel);
		return jsonData;
	};

	return JSM;
});

define('skylark-jsmodeler/import/importerobj',["../core/jsm"],function(JSM){
	JSM.ReadObjFile = function (stringBuffer, callbacks)
	{
		function OnNewMaterial (name)
		{
			if (callbacks.onNewMaterial !== undefined && callbacks.onNewMaterial !== null) {
				callbacks.onNewMaterial (name);
			}
		}

		function OnMaterialComponent (name, red, green, blue)
		{
			if (callbacks.onMaterialComponent !== undefined && callbacks.onMaterialComponent !== null) {
				callbacks.onMaterialComponent (name, red, green, blue);
			}
		}

		function OnMaterialParameter (name, value)
		{
			if (callbacks.onMaterialParameter !== undefined && callbacks.onMaterialParameter !== null) {
				callbacks.onMaterialParameter (name, value);
			}
		}

		function OnMaterialTexture (textureName)
		{
			if (callbacks.onMaterialTexture !== undefined && callbacks.onMaterialTexture !== null) {
				callbacks.onMaterialTexture (textureName);
			}
		}
		
		function OnUseMaterial (name)
		{
			if (callbacks.onUseMaterial !== undefined && callbacks.onUseMaterial !== null) {
				callbacks.onUseMaterial (name);
			}
		}

		function OnMesh (meshName)
		{
			if (callbacks.onMesh !== undefined && callbacks.onMesh !== null) {
				callbacks.onMesh (meshName);
			}
		}
		
		function OnVertex (x, y, z)
		{
			if (callbacks.onVertex !== undefined && callbacks.onVertex !== null) {
				callbacks.onVertex (x, y, z);
			}
		}

		function OnNormal (x, y, z)
		{
			if (callbacks.onNormal !== undefined && callbacks.onNormal !== null) {
				callbacks.onNormal (x, y, z);
			}
		}

		function OnTexCoord (x, y)
		{
			if (callbacks.onTexCoord !== undefined && callbacks.onTexCoord !== null) {
				callbacks.onTexCoord (x, y);
			}
		}

		function OnFace (vertices, normals, uvs)
		{
			if (callbacks.onFace !== undefined && callbacks.onFace !== null) {
				callbacks.onFace (vertices, normals, uvs);
			}
		}

		function OnFileRequested (fileName)
		{
			if (callbacks.onFileRequested !== undefined && callbacks.onFileRequested !== null) {
				return callbacks.onFileRequested (fileName);
			}
			return null;
		}

		function ProcessLine (line, objectCounter)
		{
			function GetIndex (index, count)
			{
				if (index > 0) {
					return index - 1;
				} else {
					return count + index;
				}
			}

			function GetFileName (line, keyword)
			{
				var fileNameIndex = line.indexOf (keyword) + keyword.length;
				var fileName = line.substr (fileNameIndex, line.length - fileNameIndex);
				return fileName.trim ();
			}
		
			if (line.length === 0) {
				return;
			}
			
			if (line[0] == '#') {
				return;
			}

			var lineParts = line.split (/\s+/);
			if (lineParts.length === 0 || lineParts[0][0] == '#') {
				return;
			}

			var i, fileName;
			if (lineParts[0] == 'g') {
				if (lineParts.length < 2) {
					return;
				}
				var meshName = '';
				for (i = 1; i < lineParts.length; i++) {
					meshName += lineParts[i];
					if (i < lineParts.length - 1) {
						meshName += ' ';
					}
				}
				OnMesh (meshName);
			} else if (lineParts[0] == 'v') {
				if (lineParts.length < 4) {
					return;
				}
				objectCounter.vertexCount += 1;
				OnVertex (parseFloat (lineParts[1]), parseFloat (lineParts[2]), parseFloat (lineParts[3]));
			} else if (lineParts[0] == 'vn') {
				if (lineParts.length < 4) {
					return;
				}
				objectCounter.normalCount += 1;
				OnNormal (parseFloat (lineParts[1]), parseFloat (lineParts[2]), parseFloat (lineParts[3]));
			} else if (lineParts[0] == 'vt') {
				if (lineParts.length < 3) {
					return;
				}
				objectCounter.uvCount += 1;
				OnTexCoord (parseFloat (lineParts[1]), parseFloat (lineParts[2]));
			} else if (lineParts[0] == 'f') {
				if (lineParts.length < 4) {
					return;
				}
				
				var vertices = [];
				var normals = [];
				var uvs = [];
				
				var partSplitted;
				for (i = 1; i < lineParts.length; i++) {
					partSplitted = lineParts[i].split ('/');
					vertices.push (GetIndex (parseInt (partSplitted[0], 10), objectCounter.vertexCount));
					if (partSplitted.length > 1 && partSplitted[1].length > 0) {
						uvs.push (GetIndex (parseInt (partSplitted[1], 10), objectCounter.uvCount));
					}
					if (partSplitted.length > 2 && partSplitted[2].length > 0) {
						normals.push (GetIndex (parseInt (partSplitted[2], 10), objectCounter.normalCount));
					}
				}
				OnFace (vertices, normals, uvs);
			} else if (lineParts[0] == 'usemtl') {
				if (lineParts.length < 2) {
					return;
				}
				
				OnUseMaterial (lineParts[1]);
			} else if (lineParts[0] == 'newmtl') {
				if (lineParts.length < 2) {
					return;
				}
				
				OnNewMaterial (lineParts[1]);
			} else if (lineParts[0] == 'Ka' || lineParts[0] == 'Kd' || lineParts[0] == 'Ks') {
				if (lineParts.length < 4) {
					return;
				}
				
				OnMaterialComponent (lineParts[0], parseFloat (lineParts[1]), parseFloat (lineParts[2]), parseFloat (lineParts[3]));
			} else if (lineParts[0] == 'Ns' || lineParts[0] == 'Tr' || lineParts[0] == 'd') {
				if (lineParts.length < 2) {
					return;
				}

				OnMaterialParameter (lineParts[0], lineParts[1]);
			} else if (lineParts[0] == 'map_Kd') {
				if (lineParts.length < 2) {
					return;
				}
				
				fileName = GetFileName (line, 'map_Kd');
				OnMaterialTexture (fileName);
			} else if (lineParts[0] == 'mtllib') {
				if (lineParts.length < 2) {
					return;
				}

				fileName = GetFileName (line, 'mtllib');
				var fileStringBuffer = OnFileRequested (fileName.trim ());
				if (fileStringBuffer === null) {
					return;
				}
				ProcessFile (fileStringBuffer);
			}
		}
		
		function ProcessFile (stringBuffer, objectCounter)
		{
			var lines = stringBuffer.split ('\n');
			var i, line;
			for (i = 0; i < lines.length; i++) {
				line = lines[i].trim ();
				ProcessLine (line, objectCounter);
			}
		}
		
		if (callbacks === undefined || callbacks === null) {
			callbacks = {};
		}

		var objectCounter = {
			vertexCount : 0,
			normalCount : 0,
			uvCount : 0
		};

		ProcessFile (stringBuffer, objectCounter);
	};

	JSM.ConvertObjToJsonData = function (stringBuffer, callbacks)
	{
		function OnFileRequested (fileName)
		{
			if (callbacks.onFileRequested !== undefined && callbacks.onFileRequested !== null) {
				return callbacks.onFileRequested (fileName);
			}
			return null;
		}

		if (callbacks === undefined || callbacks === null) {
			callbacks = {};
		}

		var triangleModel = new JSM.TriangleModel ();
		var index = triangleModel.AddBody (new JSM.TriangleBody ('Default'));
		var currentBody = triangleModel.GetBody (index);
		
		var materialNameToIndex = {};
		var currentMaterial = null;
		var currentMaterialIndex = null;
		
		var globalVertices = [];
		var globalNormals = [];
		var globalUVs = [];
		
		var globalToLocalVertices = {};
		var globalToLocalNormals = {};
		var globalToLocalUVs = {};
		
		JSM.ReadObjFile (stringBuffer, {
			onNewMaterial : function (name) {
				var index = triangleModel.AddMaterial ({
					name : name
				});
				currentMaterial = triangleModel.GetMaterial (index);
				materialNameToIndex[name] = index;
			},
			onMaterialComponent : function (name, red, green, blue) {
				if (currentMaterial === null) {
					return;
				}
				if (name == 'Ka') {
					currentMaterial.ambient = [red, green, blue];
				} else if (name == 'Kd') {
					currentMaterial.diffuse = [red, green, blue];
				} else if (name == 'Ks') {
					currentMaterial.specular = [red, green, blue];
				}
			},
			onMaterialParameter : function (name, value) {
				if (currentMaterial === null) {
					return;
				}
				if (name == 'Ns') {
					currentMaterial.shininess = 0.0;
					if (JSM.IsPositive (value)) {
						currentMaterial.shininess = (Math.log2 (parseFloat (value)) - 1) / 10.0;
					}
				} else if (name == 'Tr') {
					currentMaterial.opacity = 1.0 - parseFloat (value);
				} else if (name == 'd') {
					currentMaterial.opacity = parseFloat (value);
				}			
			},
			onMaterialTexture : function (textureName) {
				if (currentMaterial === null) {
					return;
				}

				var textureBuffer = OnFileRequested (textureName);
				if (textureBuffer === null) {
					return;
				}
				
				var blob = new window.Blob ([textureBuffer]);
				var blobURL = window.URL.createObjectURL (blob);
				currentMaterial.texture = blobURL;
			},
			onUseMaterial : function (name) {
				var materialIndex = materialNameToIndex[name];
				if (materialIndex !== undefined) {
					currentMaterialIndex = materialIndex;
				}
			},
			onMesh : function (meshName) {
				var index = triangleModel.AddBody (new JSM.TriangleBody (meshName));
				currentBody = triangleModel.GetBody (index);
				globalToLocalVertices = {};
				globalToLocalNormals = {};
				globalToLocalUVs = {};
			},
			onVertex : function (x, y, z) {
				globalVertices.push (new JSM.Coord (x, y, z));
			},
			onNormal : function (x, y, z) {
				globalNormals.push (new JSM.Coord (x, y, z));
			},
			onTexCoord : function (x, y) {
				globalUVs.push (new JSM.Coord2D (x, y));
			},
			onFace : function (vertices, normals, uvs) {
				function GetLocalIndex (globalValueArray, globalToLocalIndices, globalIndex, valueAdderFunc)
				{
					if (globalIndex < 0 || globalIndex >= globalValueArray.length) {
						return undefined;
					}				
					var result = globalToLocalIndices[globalIndex];
					if (result === undefined) {
						var globalValue = globalValueArray[globalIndex];
						result = valueAdderFunc (globalValue);
						globalToLocalIndices[globalIndex] = result;
					}
					return result;
				}
				
				function GetLocalVertexIndex (triangleBody, globalValueArray, globalToLocalIndices, globalIndex)
				{
					return GetLocalIndex (globalValueArray, globalToLocalIndices, globalIndex, function (val) {
						return triangleBody.AddVertex (val.x, val.y, val.z);
					});
				}
				
				function GetLocalNormalIndex (triangleBody, globalValueArray, globalToLocalIndices, globalIndex)
				{
					return GetLocalIndex (globalValueArray, globalToLocalIndices, globalIndex, function (val) {
						return triangleBody.AddNormal (val.x, val.y, val.z);
					});
				}
				
				function GetLocalUVIndex (triangleBody, globalValueArray, globalToLocalIndices, globalIndex)
				{
					return GetLocalIndex (globalValueArray, globalToLocalIndices, globalIndex, function (val) {
						return triangleBody.AddUV (val.x, val.y);
					});
				}
				
				var i, v0, v1, v2, triangle, triangleIndex;
				var hasNormals = (normals.length == vertices.length);
				var hasUVs = (uvs.length == vertices.length);
				var count = vertices.length;
				for (i = 0; i < count - 2; i++) {
					v0 = GetLocalVertexIndex (currentBody, globalVertices, globalToLocalVertices, vertices[0]);
					v1 = GetLocalVertexIndex (currentBody, globalVertices, globalToLocalVertices, vertices[(i + 1) % count]);
					v2 = GetLocalVertexIndex (currentBody, globalVertices, globalToLocalVertices, vertices[(i + 2) % count]);
					triangleIndex = currentBody.AddTriangle (v0, v1, v2);
					triangle = currentBody.GetTriangle (triangleIndex);
					if (hasNormals) {
						triangle.n0 = GetLocalNormalIndex (currentBody, globalNormals, globalToLocalNormals, normals[0]);
						triangle.n1 = GetLocalNormalIndex (currentBody, globalNormals, globalToLocalNormals, normals[(i + 1) % count]);
						triangle.n2 = GetLocalNormalIndex (currentBody, globalNormals, globalToLocalNormals, normals[(i + 2) % count]);
					}
					if (hasUVs) {
						triangle.u0 = GetLocalUVIndex (currentBody, globalUVs, globalToLocalUVs, uvs[0]);
						triangle.u1 = GetLocalUVIndex (currentBody, globalUVs, globalToLocalUVs, uvs[(i + 1) % count]);
						triangle.u2 = GetLocalUVIndex (currentBody, globalUVs, globalToLocalUVs, uvs[(i + 2) % count]);
					}
					if (currentMaterialIndex !== null) {
						triangle.mat = currentMaterialIndex;
					}
				}
			},
			onFileRequested : OnFileRequested
		});

		triangleModel.Finalize ();
		
		var jsonData = JSM.ConvertTriangleModelToJsonData (triangleModel);
		return jsonData;
	};

	return JSM;
});

define('skylark-jsmodeler/import/importerstl',["../core/jsm"],function(JSM){
	JSM.ReadBinaryStlFile = function (arrayBuffer, callbacks)
	{
		function OnFace (v0, v1, v2, normal)
		{
			if (callbacks.onFace !== undefined && callbacks.onFace !== null) {
				callbacks.onFace (v0, v1, v2, normal);
			}
		}

		function ReadVector (reader)
		{
			var result = [];
			var i;
			for (i = 0; i < 3; i++) {
				result[i] = reader.ReadFloat32 ();
			}
			return result;
		}

		if (callbacks === undefined || callbacks === null) {
			callbacks = {};
		}

		var reader = new JSM.BinaryReader (arrayBuffer, true);
		reader.Skip (80);
		
		var triangleCount = reader.ReadUnsignedInteger32 ();
		var i, v0, v1, v2, normal;
		for (i = 0; i < triangleCount; i++) {
			normal = ReadVector (reader);
			v0 = ReadVector (reader);
			v1 = ReadVector (reader);
			v2 = ReadVector (reader);
			reader.Skip (2);
			OnFace (v0, v1, v2, normal);
		}
	};

	JSM.ReadAsciiStlFile = function (stringBuffer, callbacks)
	{
		function OnFace (v0, v1, v2, normal)
		{
			if (callbacks.onFace !== undefined && callbacks.onFace !== null) {
				callbacks.onFace (v0, v1, v2, normal);
			}
		}

		function ProcessLine (lines, lineIndex)
		{
			function GetLine (lines, lineIndex)
			{
				return lines[lineIndex].trim ();
			}
		
			function GetVertices (lines, lineIndex, vertices)
			{
				var currentLineIndex, currentLine, lineParts, vertex;
				for (currentLineIndex = lineIndex; currentLineIndex < lines.length && vertices.length < 3; currentLineIndex++) {
					currentLine = GetLine (lines, currentLineIndex);
					if (currentLine.length === 0) {
						continue;
					}
					
					lineParts = currentLine.split (/\s+/);
					if (lineParts.length === 0) {
						continue;
					}
					
					if (lineParts[0] == 'vertex') {
						if (lineParts.length < 4) {
							break;
						} else {
							vertex = [parseFloat (lineParts[1]), parseFloat (lineParts[2]), parseFloat (lineParts[3])];
							vertices.push (vertex);
						}
					}
				}
				return currentLineIndex + 1;
			}
		
			var line = GetLine (lines, lineIndex);
			if (line.length === 0) {
				return lineIndex + 1;
			}
			
			var lineParts = line.split (/\s+/);
			if (lineParts.length === 0) {
				return lineIndex + 1;
			}

			if (lineParts[0] == 'solid') {
				return lineIndex + 1;
			} else if (lineParts[0] == 'facet' && lineParts[1] == 'normal') {
				if (lineParts.length < 5) {
					return -1;
				}
				
				var normal = [parseFloat (lineParts[2]), parseFloat (lineParts[3]), parseFloat (lineParts[4])];
				var vertices = [];
				var nextLineIndex = GetVertices (lines, lineIndex + 1, vertices);
				if (vertices.length != 3) {
					return -1;
				}
				
				OnFace (vertices[0], vertices[1], vertices[2], normal);
				return nextLineIndex;
			}

			return lineIndex + 1;
		}
		
		if (callbacks === undefined || callbacks === null) {
			callbacks = {};
		}

		var lineIndex = 0;
		var lines = stringBuffer.split ('\n');
		while (lineIndex < lines.length && lineIndex != -1) {
			lineIndex = ProcessLine (lines, lineIndex);
		}
	};

	JSM.IsBinaryStlFile = function (arrayBuffer)
	{
		var byteLength = arrayBuffer.byteLength;
		if (byteLength < 84) {
			return false;
		}
		
		var reader = new JSM.BinaryReader (arrayBuffer, true);
		reader.Skip (80);
		
		var triangleCount = reader.ReadUnsignedInteger32 ();
		if (byteLength != triangleCount * 50 + 84) {
			return false;
		}
		
		return true;
	};

	JSM.ConvertStlToJsonData = function (arrayBuffer, stringBuffer)
	{
		var triangleModel = new JSM.TriangleModel ();
		var index = triangleModel.AddBody (new JSM.TriangleBody ('Default'));
		var currentBody = triangleModel.GetBody (index);

		if (arrayBuffer !== null) {
			JSM.ReadBinaryStlFile (arrayBuffer, {
				onFace : function (v0, v1, v2, normal) {
					var v0Index = currentBody.AddVertex (v0[0], v0[1], v0[2]);
					var v1Index = currentBody.AddVertex (v1[0], v1[1], v1[2]);
					var v2Index = currentBody.AddVertex (v2[0], v2[1], v2[2]);
					var triangleNormal = new JSM.Vector (normal[0], normal[1], normal[2]).Normalize ();
					var normalIndex = currentBody.AddNormal (triangleNormal.x, triangleNormal.y, triangleNormal.z);
					currentBody.AddTriangle (v0Index, v1Index, v2Index, normalIndex, normalIndex, normalIndex);
				}
			});
		} else if (stringBuffer !== null) {
			JSM.ReadAsciiStlFile (stringBuffer, {
				onFace : function (v0, v1, v2, normal) {
					var v0Index = currentBody.AddVertex (v0[0], v0[1], v0[2]);
					var v1Index = currentBody.AddVertex (v1[0], v1[1], v1[2]);
					var v2Index = currentBody.AddVertex (v2[0], v2[1], v2[2]);
					var triangleNormal = new JSM.Vector (normal[0], normal[1], normal[2]).Normalize ();
					var normalIndex = currentBody.AddNormal (triangleNormal.x, triangleNormal.y, triangleNormal.z);
					currentBody.AddTriangle (v0Index, v1Index, v2Index, normalIndex, normalIndex, normalIndex);
				}
			});
		}
		
		triangleModel.Finalize ();
		
		var jsonData = JSM.ConvertTriangleModelToJsonData (triangleModel);
		return jsonData;
	};

	return JSM;
});

define('skylark-jsmodeler/import/importeroff',["../core/jsm"],function(JSM){
	JSM.ReadOffFile = function (stringBuffer, callbacks)
	{
		function OnVertex (x, y, z)
		{
			if (callbacks.onVertex !== undefined && callbacks.onVertex !== null) {
				callbacks.onVertex (x, y, z);
			}
		}

		function OnFace (vertices)
		{
			if (callbacks.onFace !== undefined && callbacks.onFace !== null) {
				callbacks.onFace (vertices);
			}
		}

		function ProcessLine (line, readState)
		{
			if (line.length === 0) {
				return;
			}
			
			if (line[0] == '#') {
				return;
			}

			var lineParts = line.split (/\s+/);
			if (lineParts.length === 0 || lineParts[0][0] == '#') {
				return;
			}

			if (!readState.offHeaderFound) {
				if (lineParts.length == 1 && lineParts[0] == 'OFF') {
					readState.offHeaderFound = true;
				}
				return;
			}
			
			if (!readState.infoFound) {
				if (lineParts.length == 3) {
					readState.vertexCount = parseInt (lineParts[0]);
					readState.faceCount = parseInt (lineParts[1]);
					readState.infoFound = true;
				}
				return;
			}
			
			if (readState.readVertices < readState.vertexCount) {
				if (lineParts.length == 3) {
					OnVertex (parseFloat (lineParts[0]), parseFloat (lineParts[1]), parseFloat (lineParts[2]));
					readState.readVertices += 1;
				}
				return;
			}
			
			if (readState.readFaces < readState.faceCount) {
				var vertexCount = parseInt (lineParts[0]);
				if (lineParts.length >= vertexCount + 1) {
					var vertices = [];
					var i, vertex;
					for (i = 1; i < vertexCount + 1; i++) {
						vertex = parseInt (lineParts[i]);
						vertices.push (vertex);
					}
					OnFace (vertices);
					readState.readFaces += 1;
				}
				return;
			}
		}
		
		function ProcessFile (stringBuffer)
		{
			var readState = {
				offHeaderFound : false,
				infoFound : false,
				vertexCount : 0,
				faceCount : 0,
				readVertices : 0,
				readFaces : 0
			};
			
			var lines = stringBuffer.split ('\n');
			var i, line;
			for (i = 0; i < lines.length; i++) {
				line = lines[i].trim ();
				ProcessLine (line, readState);
			}
		}
		
		if (callbacks === undefined || callbacks === null) {
			callbacks = {};
		}

		ProcessFile (stringBuffer);
	};

	JSM.ConvertOffToJsonData = function (stringBuffer)
	{
		var triangleModel = new JSM.TriangleModel ();
		var index = triangleModel.AddBody (new JSM.TriangleBody ('Default'));
		var currentBody = triangleModel.GetBody (index);
		
		JSM.ReadOffFile (stringBuffer, {
			onVertex : function (x, y, z) {
				currentBody.AddVertex (x, y, z);
			},
			onFace : function (vertices) {
				var i, v0, v1, v2;
				var count = vertices.length;
				for (i = 0; i < count - 2; i++) {
					v0 = vertices[0];
					v1 = vertices[i + 1];
					v2 = vertices[i + 2];
					currentBody.AddTriangle (v0, v1, v2);
				}
			}
		});

		triangleModel.Finalize ();
		
		var jsonData = JSM.ConvertTriangleModelToJsonData (triangleModel);
		return jsonData;
	};

	return JSM;
});

define('skylark-jsmodeler/import/importercommon',["../core/jsm"],function(JSM){
	JSM.ImportFileList = function ()
	{
		this.descriptors = null;
		this.isFile = null;
	};

	JSM.ImportFileList.prototype.InitFromFiles = function (fileList)
	{
		this.descriptors = [];
		var i, file, descriptor;
		for (i = 0; i < fileList.length; i++) {
			file = fileList[i];
			descriptor = {
				originalObject : file,
				originalFileName : file.name,
				fileName : file.name.toUpperCase (),
				extension : this.GetFileExtension (file.name).toUpperCase ()
			};
			this.descriptors.push (descriptor);
		}
		this.isFile = true;
	};

	JSM.ImportFileList.prototype.InitFromURLs = function (urlList)
	{
		this.descriptors = [];
		var i, url, fileName, descriptor;
		for (i = 0; i < urlList.length; i++) {
			url = urlList[i];
			fileName = this.GetFileName (url);
			descriptor = {
				originalObject : url,
				originalFileName : fileName,
				fileName : fileName.toUpperCase (),
				extension : this.GetFileExtension (fileName).toUpperCase ()
			};
			this.descriptors.push (descriptor);
		}
		this.isFile = false;
	};

	JSM.ImportFileList.prototype.GetInputList = function ()
	{
		function IsArrayBuffer (descriptor)
		{
			if (descriptor.extension == '.OBJ' || descriptor.extension == '.MTL' || descriptor.extension == '.OFF') {
				return false;
			}
			return true;
		}

		var result = [];
		var i, descriptor, inputListElem;
		for (i = 0; i < this.descriptors.length; i++) {
			descriptor = this.descriptors[i];
			inputListElem = {
				originalObject : descriptor.originalObject,
				isFile : this.isFile,
				isArrayBuffer : IsArrayBuffer (descriptor)
			};
			result.push (inputListElem);
		}
		return result;
	};

	JSM.ImportFileList.prototype.GetFileName = function (fullFileName)
	{
		var splitted = fullFileName.split ('/');
		if (splitted.length == 1) {
			splitted = fullFileName.split ('\\');
		}
		if (splitted.length === 0) {
			return '';
		}
		var fileName = splitted[splitted.length - 1];
		return decodeURI (fileName);
	};

	JSM.ImportFileList.prototype.GetFileDescriptor = function (index)
	{
		return this.descriptors[index];
	};

	JSM.ImportFileList.prototype.GetMainFileIndex = function ()
	{
		var i, descriptor;
		for (i = 0; i < this.descriptors.length; i++) {
			descriptor = this.descriptors[i];
			if (this.IsSupportedExtension (descriptor.extension)) {
				return i;
			}
		}
		return -1;
	};

	JSM.ImportFileList.prototype.GetFileIndexByName = function (fileName)
	{
		var i, descriptor, currentFileName;
		for (i = 0; i < this.descriptors.length; i++) {
			descriptor = this.descriptors[i];
			currentFileName = this.GetFileName (fileName);
			if (descriptor.fileName == currentFileName.toUpperCase ()) {
				return i;
			}
		}
		return -1;
	};

	JSM.ImportFileList.prototype.IsSupportedExtension = function (extension)
	{
		if (extension == '.3DS' || extension == '.OBJ' || extension == '.STL' || extension == '.OFF') {
			return true;
		}
		return false;
	};

	JSM.ImportFileList.prototype.GetFileExtension = function (fileName)
	{
		var lastPoint = fileName.lastIndexOf ('.');
		if (lastPoint == -1) {
			return '';
		}
		var extension = fileName.substr (lastPoint);
		return extension;
	};

	JSM.ConvertImportFileListToJsonData = function (importFileList, callbacks)
	{
		function OnError ()
		{
			if (callbacks.onError !== undefined && callbacks.onError !== null) {
				callbacks.onError ();
			}
		}

		function OnReady (fileNames, jsonData)
		{
			if (callbacks.onReady !== undefined && callbacks.onReady !== null) {
				callbacks.onReady (fileNames, jsonData);
			}
		}
		
		function FileRequested (importFileList, resultBuffers, fileName, fileNames)
		{
			var requestedFileIndex = importFileList.GetFileIndexByName (fileName);
			var currentFileName = importFileList.GetFileName (fileName);
			if (requestedFileIndex == -1) {
				fileNames.missing.push (currentFileName);
				return null;
			}
			if (fileNames.requested.indexOf (currentFileName) == -1) {
				fileNames.requested.push (currentFileName);
			}
			return resultBuffers[requestedFileIndex];	
		}
		
		var mainFileIndex = importFileList.GetMainFileIndex ();
		if (mainFileIndex === -1) {
			OnError ();
			return;
		}
		
		var mainFile = importFileList.GetFileDescriptor (mainFileIndex);
		var fileNames = {
			main : mainFile.originalFileName,
			requested : [],
			missing : []
		};

		var inputList = importFileList.GetInputList ();
		try {
			if (mainFile.extension == '.3DS') {
				JSM.LoadMultipleBuffers (inputList, function (resultBuffers) {
					var mainFileBuffer = resultBuffers[mainFileIndex];
					if (mainFileBuffer === null) {
						OnError ();
					} else {
						var jsonData = JSM.Convert3dsToJsonData (mainFileBuffer, {
							onFileRequested : function (fileName) {
								return FileRequested (importFileList, resultBuffers, fileName, fileNames);
							}
						});
						OnReady (fileNames, jsonData);
					}
				});
			} else if (mainFile.extension == '.OBJ') {
				JSM.LoadMultipleBuffers (inputList, function (resultBuffers) {
					var mainFileBuffer = resultBuffers[mainFileIndex];
					if (mainFileBuffer === null) {
						OnError ();
					} else {
						var jsonData = JSM.ConvertObjToJsonData (mainFileBuffer, {
							onFileRequested : function (fileName) {
								return FileRequested (importFileList, resultBuffers, fileName, fileNames);
							}
						});
						OnReady (fileNames, jsonData);
					}
				});
			} else if (mainFile.extension == '.STL') {
				JSM.LoadMultipleBuffers (inputList, function (resultBuffers) {
					var mainFileBuffer = resultBuffers[mainFileIndex];
					if (mainFileBuffer === null) {
						OnError ();
					} else {
						if (JSM.IsBinaryStlFile (mainFileBuffer)) {
							var jsonData = JSM.ConvertStlToJsonData (mainFileBuffer, null);
							OnReady (fileNames, jsonData);
						} else {
							var i;
							for (i = 0; i < inputList.length; i++) {
								inputList[i].isArrayBuffer = false;
							}
							JSM.LoadMultipleBuffers (inputList, function (resultBuffers) {
								var mainFileBuffer = resultBuffers[mainFileIndex];
								if (mainFileBuffer === null) {
									OnError ();
								} else {
									var jsonData = JSM.ConvertStlToJsonData (null, mainFileBuffer);
									OnReady (fileNames, jsonData);
								}
							});
						}
					}
				});
			} else if (mainFile.extension == '.OFF') {
				JSM.LoadMultipleBuffers (inputList, function (resultBuffers) {
					var mainFileBuffer = resultBuffers[mainFileIndex];
					if (mainFileBuffer === null) {
						OnError ();
					} else {
						var jsonData = JSM.ConvertOffToJsonData (mainFileBuffer);
						OnReady (fileNames, jsonData);
					}
				});
			}
		} catch (exception) {
			OnError ();
			return;
		}
	};

	JSM.ConvertFileListToJsonData = function (fileList, callbacks)
	{
		var importFileList = new JSM.ImportFileList ();
		importFileList.InitFromFiles (fileList);
		JSM.ConvertImportFileListToJsonData (importFileList, callbacks);
	};

	JSM.ConvertURLListToJsonData = function (urlList, callbacks)
	{
		var importFileList = new JSM.ImportFileList ();
		importFileList.InitFromURLs (urlList);
		JSM.ConvertImportFileListToJsonData (importFileList, callbacks);
	};

	return JSM;
});

define('skylark-jsmodeler/renderer/webglutils',["../core/jsm"],function(JSM){
	JSM.IsPowerOfTwo = function (x)
	{
		return (x & (x - 1) === 0);
	};

	JSM.NextPowerOfTwo = function (x)
	{
		if (JSM.IsPowerOfTwo (x)) {
			return x;
		}

		var result = 1;
		while (result < x) {
			result *= 2;
		}
		return result;
	};

	JSM.ResizeImageToPowerOfTwoSides = function (image)
	{
		if (JSM.IsPowerOfTwo (image.width) && !JSM.IsPowerOfTwo (image.height)) {
			return image;
		}
		
		var width = JSM.NextPowerOfTwo (image.width);
		var height = JSM.NextPowerOfTwo (image.height);

		var canvas = document.createElement ('canvas');
		canvas.width = width;
		canvas.height = height;
		
		var context = canvas.getContext ('2d');
		context.drawImage (image, 0, 0, width, height);
		return context.getImageData (0, 0, width, height);
	};

	JSM.WebGLInitContext = function (canvas)
	{
		if (canvas === null) {
			return null;
		}
		
		if (canvas.getContext === undefined) {
			return null;
		}
		
		var context = canvas.getContext ('webgl') || canvas.getContext ('experimental-webgl');
		if (context === null) {
			return null;
		}
		
		context.viewport (0, 0, canvas.width, canvas.height);
		context.clearColor (1.0, 1.0, 1.0, 1.0);
		return context;
	};

	JSM.WebGLInitShaderProgram = function (context, vertexShader, fragmentShader, onError)
	{
		function CompileShader (context, script, type, onError)
		{
			var shader = context.createShader (type);
			context.shaderSource (shader, script);
			context.compileShader (shader);
			if (!context.getShaderParameter (shader, context.COMPILE_STATUS)) {
				if (onError !== undefined && onError !== null) {
					onError (context.getShaderInfoLog (shader));
				}
				return null;
			}
			return shader;
		}
		
		function CreateShader (context, fragmentShaderScript, vertexShaderScript, onError)
		{
			var fragmentShader = CompileShader (context, fragmentShaderScript, context.FRAGMENT_SHADER, onError);
			var vertexShader = CompileShader (context, vertexShaderScript, context.VERTEX_SHADER, onError);
			if (fragmentShader === null || vertexShader === null) {
				return null;
			}

			var shaderProgram = context.createProgram ();
			context.attachShader (shaderProgram, vertexShader);
			context.attachShader (shaderProgram, fragmentShader);
			context.linkProgram (shaderProgram);
			if (!context.getProgramParameter (shaderProgram, context.LINK_STATUS)) {
				return null;
			}
			
			return shaderProgram;
		}
		
		var shader = CreateShader (context, fragmentShader, vertexShader, onError);
		if (shader === null) {
			return null;
		}
		
		context.useProgram (shader);
		return shader;
	};

	JSM.WebGLGetFloatTextureBufferSize = function (array)
	{
		return JSM.NextPowerOfTwo (Math.ceil (Math.sqrt (array.length / 4.0)));
	};

	JSM.WebGLCreateFloatTextureBuffer = function (context, array, size)
	{
		var floatArray = null;
		if (array !== null) {
			while (array.length < size * size * 4) {
				array.push (0.0);
			}
			floatArray = new Float32Array (array);
		}
		var textureBuffer = context.createTexture ();
		context.bindTexture (context.TEXTURE_2D, textureBuffer);
		context.texParameteri (context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, context.NEAREST);
		context.texParameteri (context.TEXTURE_2D, context.TEXTURE_MAG_FILTER, context.NEAREST);
		context.texParameteri (context.TEXTURE_2D, context.TEXTURE_WRAP_S, context.CLAMP_TO_EDGE);
		context.texParameteri (context.TEXTURE_2D, context.TEXTURE_WRAP_T, context.CLAMP_TO_EDGE);
		context.texImage2D (context.TEXTURE_2D, 0, context.RGBA, size, size, 0, context.RGBA, context.FLOAT, floatArray);
		context.bindTexture (context.TEXTURE_2D, null);
		return textureBuffer;
	};

	return JSM;
});

define('skylark-jsmodeler/renderer/renderlight',["../core/jsm"],function(JSM){
	JSM.RenderAmbientLight = function (color)
	{
		this.color = JSM.HexColorToNormalizedRGBComponents (color);
	};

	JSM.RenderDirectionalLight = function (diffuse, specular, direction)
	{
		this.diffuse = JSM.HexColorToNormalizedRGBComponents (diffuse);
		this.specular = JSM.HexColorToNormalizedRGBComponents (specular);
		this.direction = direction.Clone ();
	};

	return JSM;
});

define('skylark-jsmodeler/renderer/rendermaterial',["../core/jsm"],function(JSM){
	JSM.RenderMaterialFlags = {
		Point : 1,
		Line : 2,
		Triangle : 4,
		Textured : 8,
		Transparent : 16
	};

	JSM.RenderMaterial = function (type, parameters)
	{
		this.type = type;
		this.ambient = [0.0, 0.8, 0.0];
		this.diffuse = [0.0, 0.8, 0.0];
		this.specular = [0.0, 0.0, 0.0];
		this.shininess = 0.0;
		this.opacity = 1.0;
		this.reflection = 0.0;
		this.singleSided = false;
		this.pointSize = 0.1;
		this.texture = null;
		JSM.CopyObjectProperties (parameters, this, true);
	};

	JSM.RenderMaterial.prototype.SetType = function (type)
	{
		this.type = type;
	};

	JSM.RenderMaterial.prototype.SetBuffers = function (textureBuffer, textureImage)
	{
		this.textureBuffer = textureBuffer;
		this.textureImage = textureImage;
	};

	return JSM;
});

define('skylark-jsmodeler/renderer/rendermesh',["../core/jsm"],function(JSM){
	JSM.RenderMesh = function (material)
	{
		this.material = material;
		
		this.vertexArray = null;
		this.normalArray = null;
		this.uvArray = null;
		
		this.vertexBuffer = null;
		this.normalBuffer = null;
		this.uvBuffer = null;
	};

	JSM.RenderMesh.prototype.SetMaterial = function (material)
	{
		this.material = material;
	};

	JSM.RenderMesh.prototype.GetMaterial = function ()
	{
		return this.material;
	};

	JSM.RenderMesh.prototype.SetVertexArray = function (vertices)
	{
		this.vertexArray = new Float32Array (vertices);
	};

	JSM.RenderMesh.prototype.SetNormalArray = function (normals)
	{
		this.normalArray = new Float32Array (normals);
	};

	JSM.RenderMesh.prototype.SetUVArray = function (uvs)
	{
		this.uvArray = new Float32Array (uvs);
	};

	JSM.RenderMesh.prototype.HasVertexArray = function ()
	{
		return this.vertexArray !== null;
	};

	JSM.RenderMesh.prototype.HasNormalArray = function ()
	{
		return this.normalArray !== null;
	};

	JSM.RenderMesh.prototype.HasUVArray = function ()
	{
		return this.uvArray !== null;
	};

	JSM.RenderMesh.prototype.GetVertexArray = function ()
	{
		return this.vertexArray;
	};

	JSM.RenderMesh.prototype.GetNormalArray = function ()
	{
		return this.normalArray;
	};

	JSM.RenderMesh.prototype.GetUVArray = function ()
	{
		return this.uvArray;
	};

	JSM.RenderMesh.prototype.SetBuffers = function (vertexBuffer, normalBuffer, uvBuffer)
	{
		this.vertexBuffer = vertexBuffer;
		this.normalBuffer = normalBuffer;
		this.uvBuffer = uvBuffer;
	};

	JSM.RenderMesh.prototype.GetVertexBuffer = function ()
	{
		return this.vertexBuffer;
	};

	JSM.RenderMesh.prototype.GetNormalBuffer = function ()
	{
		return this.normalBuffer;
	};

	JSM.RenderMesh.prototype.GetUVBuffer = function ()
	{
		return this.uvBuffer;
	};

	JSM.RenderMesh.prototype.VertexCount = function ()
	{
		return parseInt (this.vertexArray.length / 3, 10);
	};

	JSM.RenderMesh.prototype.NormalCount = function ()
	{
		return parseInt (this.normalArray.length / 3, 10);
	};

	JSM.RenderMesh.prototype.UVCount = function ()
	{
		return parseInt (this.uvArray.length / 2, 10);
	};

	JSM.RenderMesh.prototype.GetVertex = function (index)
	{
		return new JSM.Coord (this.vertexArray[3 * index], this.vertexArray[3 * index + 1], this.vertexArray[3 * index + 2]);
	};

	JSM.RenderMesh.prototype.GetTransformedVertex = function (index, transformation)
	{
		var vertex = this.GetVertex (index);
		return transformation.Apply (vertex);
	};

	return JSM;
});

define('skylark-jsmodeler/renderer/renderbody',["../core/jsm"],function(JSM){
	JSM.RenderBody = function ()
	{
		this.transformation = new JSM.Transformation ();
		this.meshes = {};
	};

	JSM.RenderBody.prototype.AddMesh = function (mesh)
	{
		if (this.meshes[mesh.material.type] === undefined) {
			this.meshes[mesh.material.type] = [];
		}
		this.meshes[mesh.material.type].push (mesh);
	};

	JSM.RenderBody.prototype.EnumerateMeshes = function (onMeshFound)
	{
		var meshType;
		for (meshType in this.meshes) {
			if (this.meshes.hasOwnProperty (meshType)) {
				this.EnumerateTypedMeshes (meshType, onMeshFound);
			}
		}
	};

	JSM.RenderBody.prototype.HasTypedMeshes = function (meshType)
	{
		return this.meshes[meshType] !== undefined;
	};

	JSM.RenderBody.prototype.EnumerateTypedMeshes = function (meshType, onMeshFound)
	{
		if (!this.HasTypedMeshes (meshType)) {
			return;
		}
		
		var typedMeshes = this.meshes[meshType];
		var	i, typedMesh;
		for	(i = 0; i < typedMeshes.length; i++) {
			typedMesh = typedMeshes[i];
			onMeshFound (typedMesh);
		}
	};

	JSM.RenderBody.prototype.EnumerateMeshesWithFlag = function (flag, onMeshFound)
	{
		var meshType;
		for (meshType in this.meshes) {
			if (this.meshes.hasOwnProperty (meshType) && (meshType & flag)) {
				this.EnumerateTypedMeshes (meshType, onMeshFound);
			}
		}
	};

	JSM.RenderBody.prototype.GetTransformation = function ()
	{
		return this.transformation;
	};

	JSM.RenderBody.prototype.GetTransformationMatrix = function ()
	{
		return this.transformation.matrix;
	};

	JSM.RenderBody.prototype.SetTransformation = function (transformation)
	{
		this.transformation = transformation;
	};

	JSM.RenderBody.prototype.AppendTransformation = function (transformation)
	{
		this.transformation.Append (transformation);
	};

	return JSM;
});

define('skylark-jsmodeler/renderer/shaderprogram',["../core/jsm"],function(JSM){
	JSM.ShaderType = {
		Point : 0,
		Line : 1,
		Triangle : 2,
		TexturedTriangle : 3
	};

	JSM.ShaderProgram = function (context)
	{
		this.context = context;
		this.globalParams = null;
		this.shaders = null;
		this.currentShader = null;
		this.currentType = null;
		this.cullEnabled = null;
	};

	JSM.ShaderProgram.prototype.Init = function ()
	{
		if (!this.InitGlobalParams ()) {
			return false;
		}
		
		if (!this.InitShaders ()) {
			return false;
		}
		
		return true;	
	};

	JSM.ShaderProgram.prototype.GetMaxLightCount = function ()
	{
		return this.globalParams.maxLightCount;
	};

	JSM.ShaderProgram.prototype.InitGlobalParams = function ()
	{
		var noDirectionalLight = new JSM.RenderDirectionalLight (0x000000, 0x000000, new JSM.Vector (0.0, 0.0, 0.0));
		this.globalParams = {
			noDirectionalLight : noDirectionalLight,
			maxLightCount : 4
		};
		return true;
	};

	JSM.ShaderProgram.prototype.InitShaders = function ()
	{
		function GetFragmentShaderScript (shaderType, globalParams)
		{
			var script = null;
			if (shaderType == JSM.ShaderType.Point || shaderType == JSM.ShaderType.Line) {
				script = [
					'#define MAX_LIGHTS ' + globalParams.maxLightCount,

					'struct Light',
					'{',
					'	mediump vec3 diffuseColor;',
					'};',

					'struct Material',
					'{',
					'	mediump vec3 ambientColor;',
					'	mediump vec3 diffuseColor;',
					'};',
					
					'uniform mediump vec3 uAmbientLightColor;',
					'uniform Light uLights[MAX_LIGHTS];',
					'uniform Material uMaterial;',
					
					'void main (void) {',
					'	mediump vec3 ambientComponent = uMaterial.ambientColor * uAmbientLightColor;',
					'	mediump vec3 diffuseComponent = vec3 (0.0, 0.0, 0.0);',
					'	for (int i = 0; i < MAX_LIGHTS; i++) {',
					'		diffuseComponent += uMaterial.diffuseColor * uLights[i].diffuseColor;',
					'	}',
					'	gl_FragColor = vec4 (ambientComponent + diffuseComponent, 1.0);',
					'}'
				].join ('\n');
			} else if (shaderType == JSM.ShaderType.Triangle || shaderType == JSM.ShaderType.TexturedTriangle) {
				script = [
					'#define ' + (shaderType == JSM.ShaderType.Triangle ? 'NOTEXTURE' : 'USETEXTURE'),
					'#define MAX_LIGHTS ' + globalParams.maxLightCount,
					
					'struct Light',
					'{',
					'	mediump vec3 diffuseColor;',
					'	mediump vec3 specularColor;',
					'	mediump vec3 direction;',
					'};',

					'struct Material',
					'{',
					'	mediump vec3 ambientColor;',
					'	mediump vec3 diffuseColor;',
					'	mediump vec3 specularColor;',
					'	mediump float shininess;',
					'	mediump float opacity;',
					'};',
					
					'uniform mediump vec3 uAmbientLightColor;',
					'uniform Light uLights[MAX_LIGHTS];',
					'uniform Material uMaterial;',

					'varying mediump vec3 vVertex;',
					'varying mediump vec3 vNormal;',
					
					'#ifdef USETEXTURE',
					'varying mediump vec2 vUV;',
					'uniform sampler2D uSampler;',
					'#endif',
					
					'void main (void) {',
					'	mediump vec3 N = normalize (vNormal);',
					'	if (!gl_FrontFacing) {',
					'		N = -N;',
					'	}',
					'	mediump vec3 ambientComponent = uMaterial.ambientColor * uAmbientLightColor;',
					'	mediump vec3 diffuseComponent = vec3 (0.0, 0.0, 0.0);',
					'	mediump vec3 specularComponent = vec3 (0.0, 0.0, 0.0);',
					'	mediump vec3 E = normalize (-vVertex);',

					'	for (int i = 0; i < MAX_LIGHTS; i++) {',
					'		mediump vec3 L = normalize (-uLights[i].direction);',
					'		mediump vec3 R = normalize (-reflect (L, N));',
					'		diffuseComponent += uMaterial.diffuseColor * uLights[i].diffuseColor * max (dot (N, L), 0.0);',
					'		specularComponent += uMaterial.specularColor * uLights[i].specularColor * pow (max (dot (R, E), 0.0), uMaterial.shininess);',
					'	}',
					
					'#ifdef USETEXTURE',
					'	mediump vec3 textureColor = texture2D (uSampler, vec2 (vUV.s, vUV.t)).xyz;',
					'	ambientComponent = ambientComponent * textureColor;',
					'	diffuseComponent = diffuseComponent * textureColor;',
					'	specularComponent = specularComponent * textureColor;',
					'#endif',
					
					'	ambientComponent = clamp (ambientComponent, 0.0, 1.0);',
					'	diffuseComponent = clamp (diffuseComponent, 0.0, 1.0);',
					'	specularComponent = clamp (specularComponent, 0.0, 1.0);',
					'	gl_FragColor = vec4 (ambientComponent + diffuseComponent + specularComponent, uMaterial.opacity);',
					'}'
				].join ('\n');
			}
			return script;
		}
		
		function GetVertexShaderScript (shaderType)
		{
			var script = null;
			if (shaderType == JSM.ShaderType.Triangle || shaderType == JSM.ShaderType.TexturedTriangle) {
				script = [
					'#define ' + (shaderType == JSM.ShaderType.Triangle ? 'NOTEXTURE' : 'USETEXTURE'),
					'attribute mediump vec3 aVertexPosition;',
					'attribute mediump vec3 aVertexNormal;',

					'uniform mediump mat4 uViewMatrix;',
					'uniform mediump mat4 uProjectionMatrix;',
					'uniform mediump mat4 uTransformationMatrix;',

					'varying mediump vec3 vVertex;',
					'varying mediump vec3 vNormal;',

					'#ifdef USETEXTURE',
					'attribute mediump vec2 aVertexUV;',
					'varying mediump vec2 vUV;',
					'#endif',

					'void main (void) {',
					'	mat4 modelViewMatrix = uViewMatrix * uTransformationMatrix;',
					'	vVertex = vec3 (modelViewMatrix * vec4 (aVertexPosition, 1.0));',
					'	vNormal = normalize (vec3 (modelViewMatrix * vec4 (aVertexNormal, 0.0)));',
					'#ifdef USETEXTURE',
					'	vUV = aVertexUV;',
					'#endif',
					'	gl_Position = uProjectionMatrix * vec4 (vVertex, 1.0);',
					'}'
				].join ('\n');
			} else if (shaderType == JSM.ShaderType.Point || shaderType == JSM.ShaderType.Line) {
				script = [
					'#define ' + (shaderType == JSM.ShaderType.Point ? 'POINT' : 'LINE'),
					'attribute mediump vec3 aVertexPosition;',
					
					'uniform mediump mat4 uViewMatrix;',
					'uniform mediump mat4 uProjectionMatrix;',
					'uniform mediump mat4 uTransformationMatrix;',
					'#ifdef POINT',
					'uniform mediump float uPointSize;',
					'#endif',

					'varying mediump vec3 vVertex;',

					'void main (void) {',
					'	mat4 modelViewMatrix = uViewMatrix * uTransformationMatrix;',
					'	vVertex = vec3 (modelViewMatrix * vec4 (aVertexPosition, 1.0));',
					'#ifdef POINT',
					'	const mediump float scale = 200.0;',
					'	gl_PointSize = uPointSize * (scale / length (vVertex));',
					'#endif',
					'	gl_Position = uProjectionMatrix * vec4 (vVertex, 1.0);',
					'}'
				].join ('\n');
			}
			return script;
		}

		function InitShaderParameters (context, shader, globalParams, shaderType)
		{
			if (shaderType == JSM.ShaderType.Triangle || shaderType == JSM.ShaderType.TexturedTriangle) {
				shader.vertexPositionAttribute = context.getAttribLocation (shader, 'aVertexPosition');
				shader.vertexNormalAttribute = context.getAttribLocation (shader, 'aVertexNormal');

				shader.ambientLightColorUniform = context.getUniformLocation (shader, 'uAmbientLightColor');
				shader.lightUniforms = [];
				var i;
				for (i = 0; i < globalParams.maxLightCount; i++) {
					shader.lightUniforms.push ({
						diffuseColor : context.getUniformLocation (shader, 'uLights[' + i + '].diffuseColor'),
						specularColor : context.getUniformLocation (shader, 'uLights[' + i + '].specularColor'),
						direction : context.getUniformLocation (shader, 'uLights[' + i + '].direction')
					});
				}
				
				shader.materialUniforms = {
					ambientColor : context.getUniformLocation (shader, 'uMaterial.ambientColor'),
					diffuseColor : context.getUniformLocation (shader, 'uMaterial.diffuseColor'),
					specularColor : context.getUniformLocation (shader, 'uMaterial.specularColor'),
					shininess : context.getUniformLocation (shader, 'uMaterial.shininess'),
					opacity : context.getUniformLocation (shader, 'uMaterial.opacity')
				};
				
				shader.vMatrixUniform = context.getUniformLocation (shader, 'uViewMatrix');
				shader.pMatrixUniform = context.getUniformLocation (shader, 'uProjectionMatrix');
				shader.tMatrixUniform = context.getUniformLocation (shader, 'uTransformationMatrix');

				if (shaderType == JSM.ShaderType.TexturedTriangle) {
					shader.vertexUVAttribute = context.getAttribLocation (shader, 'aVertexUV');
					shader.samplerUniform = context.getUniformLocation (shader, 'uSampler');
				}
			} else if (shaderType == JSM.ShaderType.Point || shaderType == JSM.ShaderType.Line) {
				shader.vertexPositionAttribute = context.getAttribLocation (shader, 'aVertexPosition');

				shader.ambientLightColorUniform = context.getUniformLocation (shader, 'uAmbientLightColor');
				shader.lightUniforms = [];
				for (i = 0; i < globalParams.maxLightCount; i++) {
					shader.lightUniforms.push ({
						diffuseColor : context.getUniformLocation (shader, 'uLights[' + i + '].diffuseColor')
					});
				}

				shader.materialUniforms = {
					ambientColor : context.getUniformLocation (shader, 'uMaterial.ambientColor'),
					diffuseColor : context.getUniformLocation (shader, 'uMaterial.diffuseColor'),
				};
				
				shader.vMatrixUniform = context.getUniformLocation (shader, 'uViewMatrix');
				shader.pMatrixUniform = context.getUniformLocation (shader, 'uProjectionMatrix');
				shader.tMatrixUniform = context.getUniformLocation (shader, 'uTransformationMatrix');

				if (shaderType == JSM.ShaderType.Point) {
					shader.pointSizeUniform = context.getUniformLocation (shader, 'uPointSize');
				}
			}
		}
		
		function InitShader (context, shaders, globalParams, shaderType)
		{
			var vertexShaderScript = GetVertexShaderScript (shaderType);
			var fragmentShaderScript = GetFragmentShaderScript (shaderType, globalParams);
			if (vertexShaderScript === null || fragmentShaderScript === null) {
				return false;
			}
			var shader = JSM.WebGLInitShaderProgram (context, vertexShaderScript, fragmentShaderScript, function (message) {
				JSM.Message (message);
			});
			if (shader === null) {
				return false;
			}
			
			context.useProgram (shader);
			InitShaderParameters (context, shader, globalParams, shaderType);
			shaders[shaderType] = shader;
			return true;
		}
		
		this.shaders = {};
		
		if (!InitShader (this.context, this.shaders, this.globalParams, JSM.ShaderType.Point)) {
			return false;
		}

		if (!InitShader (this.context, this.shaders, this.globalParams, JSM.ShaderType.Line)) {
			return false;
		}

		if (!InitShader (this.context, this.shaders, this.globalParams, JSM.ShaderType.Triangle)) {
			return false;
		}
		
		if (!InitShader (this.context, this.shaders, this.globalParams, JSM.ShaderType.TexturedTriangle)) {
			return false;
		}

		this.context.enable (this.context.DEPTH_TEST);
		this.context.depthFunc (this.context.LEQUAL);
		
		this.context.enable (this.context.BLEND);
		this.context.blendEquation (this.context.FUNC_ADD);
		this.context.blendFunc (this.context.SRC_ALPHA, this.context.ONE_MINUS_SRC_ALPHA);

		this.context.disable (this.context.CULL_FACE);
		this.cullEnabled = false;

		return true;
	};

	JSM.ShaderProgram.prototype.CompileMaterial = function (material, textureLoaded)
	{
		if (material.texture !== null) {
			var context = this.context;
			var textureBuffer = context.createTexture ();
			var textureImage = new Image ();
			textureImage.src = material.texture;
			textureImage.onload = function () {
				var resizedImage = JSM.ResizeImageToPowerOfTwoSides (textureImage);
				context.bindTexture (context.TEXTURE_2D, textureBuffer);
				context.texParameteri (context.TEXTURE_2D, context.TEXTURE_MAG_FILTER, context.LINEAR);
				context.texParameteri (context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, context.LINEAR_MIPMAP_LINEAR);
				context.texImage2D (context.TEXTURE_2D, 0, context.RGBA, context.RGBA, context.UNSIGNED_BYTE, resizedImage);
				context.generateMipmap (context.TEXTURE_2D);
				context.bindTexture (context.TEXTURE_2D, null);
				if (textureLoaded !== undefined && textureLoaded !== null) {
					textureLoaded ();
				}
			};
			material.SetBuffers (textureBuffer, textureImage);
		}
	};

	JSM.ShaderProgram.prototype.CompileMesh = function (mesh)
	{
		var context = this.context;
		var vertexBuffer = context.createBuffer ();
		context.bindBuffer (context.ARRAY_BUFFER, vertexBuffer);
		context.bufferData (context.ARRAY_BUFFER, mesh.GetVertexArray (), context.STATIC_DRAW);
		vertexBuffer.itemSize = 3;
		vertexBuffer.numItems = mesh.VertexCount ();

		var normalBuffer = null;
		if (mesh.HasNormalArray ()) {
			normalBuffer = context.createBuffer ();
			context.bindBuffer (context.ARRAY_BUFFER, normalBuffer);
			context.bufferData (context.ARRAY_BUFFER, mesh.GetNormalArray (), context.STATIC_DRAW);
			normalBuffer.itemSize = 3;
			normalBuffer.numItems = mesh.NormalCount ();
		}

		var uvBuffer = null;
		if (mesh.HasUVArray ()) {
			uvBuffer = context.createBuffer ();
			context.bindBuffer (context.ARRAY_BUFFER, uvBuffer);
			context.bufferData (context.ARRAY_BUFFER, mesh.GetUVArray (), context.STATIC_DRAW);
			uvBuffer.itemSize = 2;
			uvBuffer.numItems = mesh.UVCount ();
		}
		
		mesh.SetBuffers (vertexBuffer, normalBuffer, uvBuffer);
	};

	JSM.ShaderProgram.prototype.GetShader = function (shaderType)
	{
		return this.shaders[shaderType];
	};

	JSM.ShaderProgram.prototype.UseShader = function (shaderType)
	{
		this.currentShader = this.GetShader (shaderType);
		this.currentType = shaderType;
		this.context.useProgram (this.currentShader);
	};

	JSM.ShaderProgram.prototype.SetParameters = function (ambientLight, directionalLights, viewMatrix, projectionMatrix)
	{
		function GetLight (directionalLights, index, noDirectionalLight)
		{
			if (index < directionalLights.length) {
				return directionalLights[index];
			}

			return noDirectionalLight;
		}
		
		var context = this.context;
		var shader = this.currentShader;
		
		var i, light, lightDirection;
		if (this.currentType == JSM.ShaderType.Triangle || this.currentType == JSM.ShaderType.TexturedTriangle) {
			context.uniform3f (shader.ambientLightColorUniform, ambientLight.color[0], ambientLight.color[1], ambientLight.color[2]);
			for (i = 0; i < this.globalParams.maxLightCount; i++) {
				light = GetLight (directionalLights, i, this.globalParams.noDirectionalLight);
				lightDirection = JSM.ApplyRotation (viewMatrix, light.direction);
				context.uniform3f (shader.lightUniforms[i].diffuseColor, light.diffuse[0], light.diffuse[1], light.diffuse[2]);
				context.uniform3f (shader.lightUniforms[i].specularColor, light.specular[0], light.specular[1], light.specular[2]);
				context.uniform3f (shader.lightUniforms[i].direction, lightDirection.x, lightDirection.y, lightDirection.z);
			}
			context.uniformMatrix4fv (shader.pMatrixUniform, false, projectionMatrix);
			context.uniformMatrix4fv (shader.vMatrixUniform, false, viewMatrix);
		} else if (this.currentType == JSM.ShaderType.Point || this.currentType == JSM.ShaderType.Line) {
			context.uniform3f (shader.ambientLightColorUniform, ambientLight.color[0], ambientLight.color[1], ambientLight.color[2]);
			for (i = 0; i < this.globalParams.maxLightCount; i++) {
				light = GetLight (directionalLights, i, this.globalParams.noDirectionalLight);
				context.uniform3f (shader.lightUniforms[i].diffuseColor, light.diffuse[0], light.diffuse[1], light.diffuse[2]);
			}
			context.uniformMatrix4fv (shader.pMatrixUniform, false, projectionMatrix);
			context.uniformMatrix4fv (shader.vMatrixUniform, false, viewMatrix);
		}
	};

	JSM.ShaderProgram.prototype.SetCullEnabled = function (enable)
	{
		if (enable && !this.cullEnabled) {
			this.context.enable (this.context.CULL_FACE);
			this.cullEnabled = true;
		} else if (!enable && this.cullEnabled) {
			this.context.disable (this.context.CULL_FACE);
			this.cullEnabled = false;
		}
	};

	JSM.ShaderProgram.prototype.DrawArrays = function (material, matrix, vertexBuffer, normalBuffer, uvBuffer)
	{
		var context = this.context;
		var shader = this.currentShader;
		this.SetCullEnabled (material.singleSided);
		
		if (this.currentType == JSM.ShaderType.Triangle || this.currentType == JSM.ShaderType.TexturedTriangle) {
			context.uniform3f (shader.materialUniforms.ambientColor, material.ambient[0], material.ambient[1], material.ambient[2]);
			context.uniform3f (shader.materialUniforms.diffuseColor, material.diffuse[0], material.diffuse[1], material.diffuse[2]);
			context.uniform3f (shader.materialUniforms.specularColor, material.specular[0], material.specular[1], material.specular[2]);
			context.uniform1f (shader.materialUniforms.shininess, material.shininess);
			context.uniform1f (shader.materialUniforms.opacity, material.opacity);

			context.uniformMatrix4fv (shader.tMatrixUniform, false, matrix);

			context.bindBuffer (context.ARRAY_BUFFER, vertexBuffer);
			context.enableVertexAttribArray (shader.vertexPositionAttribute);
			context.vertexAttribPointer (shader.vertexPositionAttribute, vertexBuffer.itemSize, context.FLOAT, false, 0, 0);
			
			context.bindBuffer (context.ARRAY_BUFFER, normalBuffer);
			context.enableVertexAttribArray (shader.vertexNormalAttribute);
			context.vertexAttribPointer (shader.vertexNormalAttribute, normalBuffer.itemSize, context.FLOAT, false, 0, 0);

			if (this.currentType == JSM.ShaderType.TexturedTriangle) {
				context.activeTexture (context.TEXTURE0);
				context.bindTexture (context.TEXTURE_2D, material.textureBuffer);
				context.bindBuffer (context.ARRAY_BUFFER, uvBuffer);
				context.enableVertexAttribArray (shader.vertexUVAttribute);
				context.vertexAttribPointer (shader.vertexUVAttribute, uvBuffer.itemSize, context.FLOAT, false, 0, 0);
				context.uniform1i (shader.samplerUniform, 0);
			}
			
			context.drawArrays (context.TRIANGLES, 0, vertexBuffer.numItems);
		} else if (this.currentType == JSM.ShaderType.Point || this.currentType == JSM.ShaderType.Line) {
			context.uniform3f (shader.materialUniforms.ambientColor, material.ambient[0], material.ambient[1], material.ambient[2]);
			context.uniform3f (shader.materialUniforms.diffuseColor, material.diffuse[0], material.diffuse[1], material.diffuse[2]);
			
			context.uniformMatrix4fv (shader.tMatrixUniform, false, matrix);
			
			context.bindBuffer (context.ARRAY_BUFFER, vertexBuffer);
			context.enableVertexAttribArray (shader.vertexPositionAttribute);
			context.vertexAttribPointer (shader.vertexPositionAttribute, vertexBuffer.itemSize, context.FLOAT, false, 0, 0);
			
			if (this.currentType == JSM.ShaderType.Point) {
				context.uniform1f (shader.pointSizeUniform, material.pointSize);
				context.drawArrays (context.POINTS, 0, vertexBuffer.numItems);
			} else if (this.currentType == JSM.ShaderType.Line) {
				context.drawArrays (context.LINES, 0, vertexBuffer.numItems);
			}
		}
	};

	return JSM;
});

define('skylark-jsmodeler/renderer/renderer',["../core/jsm"],function(JSM){
	JSM.Renderer = function ()
	{
		this.canvas = null;
		this.context = null;
		this.shader = null;
		
		this.ambientLight = null;
		this.directionalLights = null;
		this.bodies = null;
	};

	JSM.Renderer.prototype.Init = function (canvas)
	{
		if (!JSM.IsWebGLEnabled ()) {
			return false;
		}

		if (!this.InitContext (canvas)) {
			return false;
		}

		if (!this.InitView ()) {
			return false;
		}

		if (!this.InitShaders ()) {
			return false;
		}

		if (!this.InitLights ()) {
			return false;
		}	
		
		if (!this.InitBodies ()) {
			return false;
		}

		return true;
	};

	JSM.Renderer.prototype.InitContext = function (canvas)
	{
		this.canvas = canvas;
		if (this.canvas === null) {
			return false;
		}
		
		if (this.canvas.getContext === undefined) {
			return false;
		}

		this.context = this.canvas.getContext ('webgl') || this.canvas.getContext ('experimental-webgl');
		if (this.context === null) {
			return false;
		}

		this.context = JSM.WebGLInitContext (canvas);
		if (this.context === null) {
			return false;
		}

		return true;
	};

	JSM.Renderer.prototype.InitShaders = function ()
	{
		this.shader = new JSM.ShaderProgram (this.context);
		return this.shader.Init ();
	};

	JSM.Renderer.prototype.InitLights = function ()
	{
		this.ambientLight = new JSM.RenderAmbientLight (0x000000);
		this.directionalLights = [];
		return true;
	};

	JSM.Renderer.prototype.InitBodies = function ()
	{
		this.bodies = [];
		return true;
	};

	JSM.Renderer.prototype.InitView = function ()
	{
		this.directionalLights = [];
		return true;
	};

	JSM.Renderer.prototype.SetClearColor = function (red, green, blue)
	{
		this.context.clearColor (red, green, blue, 1.0);
	};

	JSM.Renderer.prototype.SetAmbientLight = function (light)
	{
		this.ambientLight = light;
	};

	JSM.Renderer.prototype.AddLight = function (light)
	{
		var maxLightCount = this.shader.GetMaxLightCount ();
		if (this.directionalLights.length >= maxLightCount) {
			return -1;
		}
		this.directionalLights.push (light);
		return this.directionalLights.length - 1;
	};

	JSM.Renderer.prototype.RemoveLight = function (light)
	{
		var index = this.directionalLights.indexOf (light);
		if (index != -1) {
			this.directionalLights.splice (index, 1);
		}
	};

	JSM.Renderer.prototype.RemoveLights = function ()
	{
		this.directionalLights = [];
	};

	JSM.Renderer.prototype.GetLight = function (index)
	{
		return this.directionalLights[index];
	};

	JSM.Renderer.prototype.AddBody = function (renderBody, textureLoaded)
	{
		var shader = this.shader;
		renderBody.EnumerateMeshes (function (mesh) {
			shader.CompileMaterial (mesh.GetMaterial (), textureLoaded);
			shader.CompileMesh (mesh);
		});
		this.bodies.push (renderBody);
	};

	JSM.Renderer.prototype.AddBodies = function (renderBodies, textureLoaded)
	{
		var i, body;
		for (i = 0; i < renderBodies.length; i++) {
			body = renderBodies[i];
			this.AddBody (body, textureLoaded);
		}
	};

	JSM.Renderer.prototype.EnumerateBodies = function (onBodyFound)
	{
		var i;
		for (i = 0; i < this.bodies.length; i++) {
			onBodyFound (this.bodies[i]);
		}
	};

	JSM.Renderer.prototype.RemoveBody = function (body)
	{
		var index = this.bodies.indexOf (body);
		if (index != -1) {
			this.bodies.splice (index, 1);
		}
	};

	JSM.Renderer.prototype.RemoveBodies = function ()
	{
		this.bodies = [];
	};

	JSM.Renderer.prototype.GetBody = function (index)
	{
		return this.bodies[index];
	};

	JSM.Renderer.prototype.Resize = function ()
	{
		this.context.viewport (0, 0, this.canvas.width, this.canvas.height);
	};

	JSM.Renderer.prototype.FindObjects = function (camera, screenX, screenY)
	{
		var screenCoord = new JSM.Coord (screenX, this.canvas.height - screenY, 0.5);
		var aspectRatio = this.canvas.width / this.canvas.height;
		var viewPort = [0, 0, this.canvas.width, this.canvas.height];
		var unprojected = JSM.Unproject (screenCoord, camera.eye, camera.center, camera.up, camera.fieldOfView * JSM.DegRad, aspectRatio, camera.nearClippingPlane, camera.farClippingPlane, viewPort);
		var ray = new JSM.Ray (camera.eye, JSM.CoordSub (unprojected, camera.eye), null);
		
		var result = [];
		this.EnumerateBodies (function (body) {
			var transformation = body.GetTransformation ();
			body.EnumerateMeshesWithFlag (JSM.RenderMaterialFlags.Triangle, function (mesh) {
				var vertexCount = mesh.VertexCount ();
				var i, v0, v1, v2, intersection;
				for (i = 0; i < vertexCount; i += 3) {
					v0 = mesh.GetTransformedVertex (i + 0, transformation);
					v1 = mesh.GetTransformedVertex (i + 1, transformation);
					v2 = mesh.GetTransformedVertex (i + 2, transformation);
					intersection = JSM.RayTriangleIntersection (ray, v0, v1, v2);
					if (intersection !== null) {
						result.push ({
							renderBody : body,
							renderMesh : mesh,
							triangleIndex : parseInt (i / 3, 10),
							intersection : intersection
						});
					}
				}
			});
		});
		result.sort (function (a, b) {
			return a.intersection.distance - b.intersection.distance;
		});
		return result;
	};

	JSM.Renderer.prototype.Render = function (camera)
	{
		function DrawMeshes (renderer, materialType, viewMatrix, projectionMatrix)
		{
			function MaterialTypeToShaderType (materialType)
			{
				function HasFlag (type, flag)
				{
					return type & flag;
				}
				
				if (HasFlag (materialType, JSM.RenderMaterialFlags.Triangle)) {
					if (HasFlag (materialType, JSM.RenderMaterialFlags.Textured)) {
						return JSM.ShaderType.TexturedTriangle;
					} else if (!HasFlag (materialType, JSM.RenderMaterialFlags.Textured)) {
						return JSM.ShaderType.Triangle;
					}
				} else if (HasFlag (materialType, JSM.RenderMaterialFlags.Line)) {
					return JSM.ShaderType.Line;
				} else if (HasFlag (materialType, JSM.RenderMaterialFlags.Point)) {
					return JSM.ShaderType.Point;
				}
				
				return null;
			}

			var shaderType = null;
			renderer.EnumerateBodies (function (body) {
				if (body.HasTypedMeshes (materialType)) {
					var matrix = body.GetTransformationMatrix ();
					body.EnumerateTypedMeshes (materialType, function (mesh) {
						if (shaderType === null) {
							shaderType = MaterialTypeToShaderType (materialType);
							renderer.shader.UseShader (shaderType);
							renderer.shader.SetParameters (renderer.ambientLight, renderer.directionalLights, viewMatrix, projectionMatrix);
						}
						var material = mesh.GetMaterial ();
						var vertexBuffer = mesh.GetVertexBuffer ();
						var normalBuffer = mesh.GetNormalBuffer ();
						var uvBuffer = mesh.GetUVBuffer ();
						renderer.shader.DrawArrays (material, matrix, vertexBuffer, normalBuffer, uvBuffer);
					});
				}
			});
		}

		this.context.clear (this.context.COLOR_BUFFER_BIT | this.context.DEPTH_BUFFER_BIT);
		
		var viewMatrix = JSM.MatrixView (camera.eye, camera.center, camera.up);
		var projectionMatrix = JSM.MatrixPerspective (camera.fieldOfView * JSM.DegRad, this.canvas.width / this.canvas.height, camera.nearClippingPlane, camera.farClippingPlane);

		DrawMeshes (this, JSM.RenderMaterialFlags.Triangle, viewMatrix, projectionMatrix);
		DrawMeshes (this, JSM.RenderMaterialFlags.Triangle + JSM.RenderMaterialFlags.Textured, viewMatrix, projectionMatrix);
		DrawMeshes (this, JSM.RenderMaterialFlags.Line, viewMatrix, projectionMatrix);
		DrawMeshes (this, JSM.RenderMaterialFlags.Point, viewMatrix, projectionMatrix);
		DrawMeshes (this, JSM.RenderMaterialFlags.Triangle + JSM.RenderMaterialFlags.Transparent, viewMatrix, projectionMatrix);
		DrawMeshes (this, JSM.RenderMaterialFlags.Triangle + JSM.RenderMaterialFlags.Transparent + JSM.RenderMaterialFlags.Textured, viewMatrix, projectionMatrix);
	};

	return JSM;
});

define('skylark-jsmodeler/renderer/pointcloudrenderer',["../core/jsm"],function(JSM){
	JSM.PointCloudRenderer = function ()
	{
		this.canvas = null;
		this.context = null;
		this.shader = null;
		
		this.camera = null;
		this.points = null;
		this.pointSize = null;
	};

	JSM.PointCloudRenderer.prototype.Init = function (canvas, camera)
	{
		if (!JSM.IsWebGLEnabled ()) {
			return false;
		}

		if (!this.InitContext (canvas)) {
			return false;
		}

		if (!this.InitShaders ()) {
			return false;
		}

		if (!this.InitBuffers ()) {
			return false;
		}

		if (!this.InitView (camera)) {
			return false;
		}

		return true;
	};

	JSM.PointCloudRenderer.prototype.InitContext = function (canvas)
	{
		this.canvas = canvas;
		if (this.canvas === null) {
			return false;
		}
		
		if (this.canvas.getContext === undefined) {
			return false;
		}

		this.context = this.canvas.getContext ('experimental-webgl');
		if (this.context === null) {
			return false;
		}

		this.context.clearColor (1.0, 1.0, 1.0, 1.0);
		this.context.enable (this.context.DEPTH_TEST);

		return true;
	};

	JSM.PointCloudRenderer.prototype.InitShaders = function ()
	{
		function CreateShaderFromScript (context, script, type)
		{
			var shader = context.createShader (type);
			context.shaderSource (shader, script);
			context.compileShader (shader);
			if (!context.getShaderParameter (shader, context.COMPILE_STATUS)) {
				return null;
			}
			return shader;
		}

		var fragmentShaderScript = [
			'varying highp vec3 vColor;',
			'void main (void) {',
			'	gl_FragColor = vec4 (vColor, 1.0);',
			'}'
			].join('\n');
		
		var vertexShaderScript = [
			'attribute highp vec3 aVertexPosition;',
			'attribute highp vec3 aVertexColor;',

			'uniform highp mat4 uViewMatrix;',
			'uniform highp mat4 uProjectionMatrix;',

			'uniform highp float uPointSize;',
			
			'varying highp vec3 vColor;',
			
			'void main (void) {',
			'	vColor = aVertexColor;',
			'	gl_PointSize = uPointSize;',
			'	gl_Position = uProjectionMatrix * uViewMatrix * vec4 (aVertexPosition, 1.0);',
			'}'
			].join('\n');
		
		var fragmentShader = CreateShaderFromScript (this.context, fragmentShaderScript, this.context.FRAGMENT_SHADER);
		var vertexShader = CreateShaderFromScript (this.context, vertexShaderScript, this.context.VERTEX_SHADER);
		if (fragmentShader === null || vertexShader === null) {
			return false;
		}

		this.shader = this.context.createProgram ();
		this.context.attachShader (this.shader, vertexShader);
		this.context.attachShader (this.shader, fragmentShader);
		this.context.linkProgram (this.shader);
		if (!this.context.getProgramParameter (this.shader, this.context.LINK_STATUS)) {
			return false;
		}
		this.context.useProgram (this.shader);

		this.shader.vertexPositionAttribute = this.context.getAttribLocation (this.shader, 'aVertexPosition');
		this.context.enableVertexAttribArray (this.shader.vertexPositionAttribute);

		this.shader.vertexColorAttribute = this.context.getAttribLocation (this.shader, 'aVertexColor');
		this.context.enableVertexAttribArray (this.shader.vertexColorAttribute);

		this.shader.pMatrixUniform = this.context.getUniformLocation (this.shader, 'uProjectionMatrix');
		this.shader.vMatrixUniform = this.context.getUniformLocation (this.shader, 'uViewMatrix');
		
		this.shader.pointSizeUniform = this.context.getUniformLocation (this.shader, 'uPointSize');

		return true;
	};

	JSM.PointCloudRenderer.prototype.InitBuffers = function ()
	{
		this.points = [];
		this.pointSize = 1.0;
		return true;
	};

	JSM.PointCloudRenderer.prototype.InitView = function (camera)
	{
		this.camera = JSM.ValueOrDefault (camera, new JSM.Camera ());
		if (!this.camera) {
			return false;
		}

		return true;
	};

	JSM.PointCloudRenderer.prototype.SetClearColor = function (red, green, blue)
	{
		this.context.clearColor (red, green, blue, 1.0);
	};

	JSM.PointCloudRenderer.prototype.SetPointSize = function (pointSize)
	{
		this.pointSize = pointSize;
	};

	JSM.PointCloudRenderer.prototype.AddPoints = function (points, colors)
	{
		var pointBuffer = this.context.createBuffer ();
		var pointArray = new Float32Array (points);

		this.context.bindBuffer (this.context.ARRAY_BUFFER, pointBuffer);
		this.context.bufferData (this.context.ARRAY_BUFFER, pointArray, this.context.STATIC_DRAW);
		pointBuffer.itemSize = 3;
		pointBuffer.numItems = parseInt (pointArray.length / 3, 10);
		
		var colorBuffer = this.context.createBuffer ();
		var colorArray = new Float32Array (colors);

		this.context.bindBuffer (this.context.ARRAY_BUFFER, colorBuffer);
		this.context.bufferData (this.context.ARRAY_BUFFER, colorArray, this.context.STATIC_DRAW);
		colorBuffer.itemSize = 3;
		colorBuffer.numItems = parseInt (colorArray.length / 3, 10);

		this.points.push ({pointArray : pointArray, pointBuffer : pointBuffer, colorBuffer : colorBuffer});
	};

	JSM.PointCloudRenderer.prototype.RemovePoints = function ()
	{
		this.points = [];
	};

	JSM.PointCloudRenderer.prototype.Resize = function ()
	{
		this.context.viewport (0, 0, this.canvas.width, this.canvas.height);
	};

	JSM.PointCloudRenderer.prototype.Render = function ()
	{
		this.context.clear (this.context.COLOR_BUFFER_BIT | this.context.DEPTH_BUFFER_BIT);
		
		var projectionMatrix = JSM.MatrixPerspective (this.camera.fieldOfView * JSM.DegRad, this.canvas.width / this.canvas.height, this.camera.nearClippingPlane, this.camera.farClippingPlane);
		this.context.uniformMatrix4fv (this.shader.pMatrixUniform, false, projectionMatrix);

		var viewMatrix = JSM.MatrixView (this.camera.eye, this.camera.center, this.camera.up);
		this.context.uniformMatrix4fv (this.shader.vMatrixUniform, false, viewMatrix);

		this.context.uniform1f (this.shader.pointSizeUniform, this.pointSize);
		
		var i, pointBuffer, colorBuffer;
		for (i = 0; i < this.points.length; i++) {
			pointBuffer = this.points[i].pointBuffer;
			colorBuffer = this.points[i].colorBuffer;
			this.context.bindBuffer (this.context.ARRAY_BUFFER, pointBuffer);
			this.context.vertexAttribPointer (this.shader.vertexPositionAttribute, pointBuffer.itemSize, this.context.FLOAT, false, 0, 0);
			this.context.bindBuffer (this.context.ARRAY_BUFFER, colorBuffer);
			this.context.vertexAttribPointer (this.shader.vertexColorAttribute, colorBuffer.itemSize, this.context.FLOAT, false, 0, 0);
			this.context.drawArrays (this.context.POINTS, 0, pointBuffer.numItems);
		}
	};

	return JSM;
});

define('skylark-jsmodeler/renderer/renderconverter',["../core/jsm"],function(JSM){
	JSM.ConvertBodyToRenderBody = function (body, materials, parameters)
	{
		function MaterialToRenderMaterial (material, materialType)
		{
			var renderAmbient = JSM.HexColorToNormalizedRGBComponents (material.ambient);
			var renderDiffuse = JSM.HexColorToNormalizedRGBComponents (material.diffuse);
			var renderSpecular = JSM.HexColorToNormalizedRGBComponents (material.specular);
			var renderMaterial = new JSM.RenderMaterial (materialType, {
				ambient : renderAmbient,
				diffuse : renderDiffuse,
				specular : renderSpecular,
				shininess : material.shininess,
				opacity : material.opacity,
				singleSided : material.singleSided,
				pointSize : material.pointSize,
				texture : material.texture
			});
			return renderMaterial;
		}
		
		var hasConvexPolygons = false;
		if (parameters !== undefined && parameters !== null) {
			if (parameters.hasConvexPolygons !== undefined && parameters.hasConvexPolygons !== null) {
				hasConvexPolygons = parameters.hasConvexPolygons;
			}
		}
		
		var renderBody = new JSM.RenderBody ();
		
		var vertices = null;
		var normals = null;
		var uvs = null;
		
		var explodeData = {
			hasConvexPolygons : hasConvexPolygons,
			onPointGeometryStart : function () {
				vertices = [];
				normals = null;
				uvs = null;
			},		
			onPointGeometryEnd : function (material) {
				var materialType = JSM.RenderMaterialFlags.Point;
				var renderMaterial = MaterialToRenderMaterial (material, materialType);
				var mesh = new JSM.RenderMesh (renderMaterial);
				mesh.SetVertexArray (vertices);
				renderBody.AddMesh (mesh);
			},
			onPoint : function (vertex) {
				vertices.push (vertex.x, vertex.y, vertex.z);
			},		
			onLineGeometryStart : function () {
				vertices = [];
				normals = null;
				uvs = null;
			},
			onLineGeometryEnd : function (material) {
				var materialType = JSM.RenderMaterialFlags.Line;
				var renderMaterial = MaterialToRenderMaterial (material, materialType);
				var mesh = new JSM.RenderMesh (renderMaterial);
				mesh.SetVertexArray (vertices);
				renderBody.AddMesh (mesh);
			},
			onLine : function (begVertex, endVertex) {
				vertices.push (begVertex.x, begVertex.y, begVertex.z);
				vertices.push (endVertex.x, endVertex.y, endVertex.z);
			},		
			onGeometryStart : function () {
				vertices = [];
				normals = [];
				uvs = [];
			},
			onGeometryEnd : function (material) {
				var materialType = JSM.RenderMaterialFlags.Triangle;
				if (material.texture !== null) {
					materialType += JSM.RenderMaterialFlags.Textured;
				}
				if (material.opacity < 1.0) {
					materialType += JSM.RenderMaterialFlags.Transparent;
				}

				var renderMaterial = MaterialToRenderMaterial (material, materialType);
				var mesh = new JSM.RenderMesh (renderMaterial);
				mesh.SetVertexArray (vertices);
				mesh.SetNormalArray (normals);
				if (material.texture !== null) {
					mesh.SetUVArray (uvs);
				}

				renderBody.AddMesh (mesh);
			},
			onTriangle : function (vertex1, vertex2, vertex3, normal1, normal2, normal3, uv1, uv2, uv3) {
				vertices.push (vertex1.x, vertex1.y, vertex1.z);
				vertices.push (vertex2.x, vertex2.y, vertex2.z);
				vertices.push (vertex3.x, vertex3.y, vertex3.z);
				
				normals.push (normal1.x, normal1.y, normal1.z);
				normals.push (normal2.x, normal2.y, normal2.z);
				normals.push (normal3.x, normal3.y, normal3.z);
				
				if (uv1 !== null && uv2 !== null && uv3 !== null) {
					uvs.push (uv1.x, uv1.y);
					uvs.push (uv2.x, uv2.y);
					uvs.push (uv3.x, uv3.y);
				}
			}
		};
		
		JSM.ExplodeBody (body, materials, explodeData);
		return renderBody;
	};

	JSM.ConvertModelToRenderBodies = function (model, parameters)
	{
		var bodies = [];
		var materials = model.GetMaterialSet ();
		var i, body, renderBody;
		for (i = 0; i < model.BodyCount (); i++) {
			body = model.GetBody (i);
			renderBody = JSM.ConvertBodyToRenderBody (body, materials, parameters);
			bodies.push (renderBody);
		}
		return bodies;
	};

	JSM.ConvertJSONDataToRenderBodies = function (jsonData, asyncCallbacks)
	{
		function ConvertMeshToRenderBody (mesh, materials)
		{
			function ConvertTrianglesToRenderMesh (mesh, triangles, materials)
			{
				function GetTextureCoordinate (u, v, offset, scale, rotation)
				{
					var result = new JSM.Vector2D (u, v);
					if (!JSM.IsZero (rotation)) {
						var si = Math.sin (rotation * JSM.DegRad);
						var co = Math.cos (rotation * JSM.DegRad);
						result.x = co * u - si * v;
						result.y = si * u + co * v;
					}
					result.x = offset[0] + result.x * scale[0];
					result.y = offset[1] + result.y * scale[1];
					return result;
				}

				function AppendTriangleCoords (targetArray, sourceArray, indexArray, startIndex, componentCount)
				{
					var vertexIndex, sourceVertexIndex, componentIndex;
					for (vertexIndex = 0; vertexIndex < 3; vertexIndex++) {
						sourceVertexIndex = indexArray[startIndex + vertexIndex];
						for (componentIndex = 0; componentIndex < componentCount; componentIndex++) {
							targetArray.push (sourceArray[sourceVertexIndex * componentCount + componentIndex]);
						}
					}
				}
				
				var material = materials[triangles.material];
				var renderMaterial = new JSM.RenderMaterial (JSM.RenderMaterialFlags.Triangle, {
					ambient : material.ambient || [1.0, 1.0, 1.0],
					diffuse : material.diffuse || [1.0, 1.0, 1.0],
					specular : material.specular || [1.0, 1.0, 1.0],
					shininess : material.shininess || 0.0,
					opacity : material.opacity || 1.0,
				});
				
				var hasTexture = (material.texture !== undefined && material.texture !== null);
				if (hasTexture) {
					renderMaterial.SetType (JSM.RenderMaterialFlags.Triangle + JSM.RenderMaterialFlags.Textured);
					renderMaterial.texture = material.texture;
					renderMaterial.ambient = [1.0, 1.0, 1.0];
					renderMaterial.diffuse = [1.0, 1.0, 1.0];
				}
				
				var renderMesh = new JSM.RenderMesh (renderMaterial);
				var vertexArray = [];
				var normalArray = [];
				var uvArray = [];
				
				var i;
				for	(i = 0; i < triangles.parameters.length; i += 9) {
					AppendTriangleCoords (vertexArray, mesh.vertices, triangles.parameters, i, 3);
					AppendTriangleCoords (normalArray, mesh.normals, triangles.parameters, i + 3, 3);
					AppendTriangleCoords (uvArray, mesh.uvs, triangles.parameters, i + 6, 2);
				}

				if (hasTexture) {
					var offset = material.offset || [0.0, 0.0];
					var scale = material.scale || [1.0, 1.0];
					var rotation = material.rotation || 0.0;
					var transformedUV;
					for	(i = 0; i < uvArray.length; i += 2) {
						transformedUV = GetTextureCoordinate (uvArray[i + 0], uvArray[i + 1], offset, scale, rotation);
						uvArray[i + 0] = transformedUV.x;
						uvArray[i + 1] = -transformedUV.y;
					}
				}
				
				renderMesh.SetVertexArray (vertexArray);
				renderMesh.SetNormalArray (normalArray);
				renderMesh.SetUVArray (uvArray);
				return renderMesh;
			}
			
			var renderBody = new JSM.RenderBody ();
			var i, triangles, renderMesh;
			for (i = 0; i < mesh.triangles.length; i++) {
				triangles = mesh.triangles[i];
				renderMesh = ConvertTrianglesToRenderMesh (mesh, triangles, materials);
				renderBody.AddMesh (renderMesh);
			}
			return renderBody;
		}
		
		function AddMesh (meshes, materials, meshIndex, resultBodies)
		{
			var renderBody = ConvertMeshToRenderBody (meshes[meshIndex], materials);
			resultBodies.push (renderBody);
		}
		
		var resultBodies = [];

		var materials = jsonData.materials;
		if (materials === undefined) {
			return resultBodies;
		}
		
		var meshes = jsonData.meshes;
		if (meshes === undefined) {
			return resultBodies;
		}
		
		var meshIndex = 0;
		JSM.AsyncRunTask (
			function () {
				AddMesh (meshes, materials, meshIndex, resultBodies);
				meshIndex = meshIndex + 1;
				return true;
			},
			asyncCallbacks,
			meshes.length, 0, resultBodies
		);

		return resultBodies;
	};

	return JSM;
});

define('skylark-jsmodeler/viewer/mouse',["../core/jsm"],function(JSM){
	JSM.Mouse = function ()
	{
		this.down = false;
		this.button = 0;
		this.shift = false;
		this.ctrl = false;
		this.alt = false;
		this.prev = new JSM.Coord2D (0, 0);
		this.curr = new JSM.Coord2D (0, 0);
		this.diff = new JSM.Coord2D (0, 0);
	};

	JSM.Mouse.prototype.Down = function (event, div)
	{
		var eventParameters = event || window.event;

		this.down = true;
		this.button = event.which;
		this.shift = event.shiftKey;
		this.ctrl = event.ctrlKey;
		this.alt = event.altKey;
		
		this.SetCurrent (eventParameters, div);
		this.prev = this.curr.Clone ();
	};

	JSM.Mouse.prototype.Move = function (event, div)
	{
		var eventParameters = event || window.event;
		
		this.shift = event.shiftKey;
		this.ctrl = event.ctrlKey;
		this.alt = event.altKey;
		
		this.SetCurrent (eventParameters, div);
		this.diff = JSM.CoordSub2D (this.curr, this.prev);
		this.prev = this.curr.Clone ();
	};

	JSM.Mouse.prototype.Up = function (event, div)
	{
		var eventParameters = event || window.event;
		
		this.down = false;
		this.SetCurrent (eventParameters, div);
	};

	JSM.Mouse.prototype.Out = function (event, div)
	{
		var eventParameters = event || window.event;
		
		this.down = false;
		this.SetCurrent (eventParameters, div);
	};

	JSM.Mouse.prototype.SetCurrent = function (eventParameters, div)
	{
		var currX = eventParameters.clientX;
		var currY = eventParameters.clientY;
		if (div.getBoundingClientRect !== undefined) {
			var clientRect = div.getBoundingClientRect ();
			currX -= clientRect.left;
			currY -= clientRect.top;
		}
		if (window.pageXOffset !== undefined && window.pageYOffset !== undefined) {
			currX += window.pageXOffset;
			currY += window.pageYOffset;
		}
		this.curr = new JSM.Coord2D (currX, currY);
	};

	return JSM;
});

define('skylark-jsmodeler/viewer/touch',["../core/jsm"],function(JSM){
	JSM.Touch = function ()
	{
		this.down = false;
		this.fingers = 0;
		this.prev = new JSM.Coord2D ();
		this.curr = new JSM.Coord2D ();
		this.diff = new JSM.Coord2D ();
	};

	JSM.Touch.prototype.Start = function (event, div)
	{
		if (event.touches.length === 0) {
			return;
		}

		this.down = true;
		this.fingers = event.touches.length;

		this.SetCurrent (event, div);
		this.prev = this.curr.Clone ();
	};

	JSM.Touch.prototype.Move = function (event, div)
	{
		if (event.touches.length === 0) {
			return;
		}

		this.fingers = event.touches.length;

		this.SetCurrent (event, div);
		this.diff = JSM.CoordSub2D (this.curr, this.prev);
		this.prev = this.curr.Clone ();
	};

	JSM.Touch.prototype.End = function (event, div)
	{
		if (event.touches.length === 0) {
			return;
		}

		this.down = false;
		this.SetCurrent (event, div);
	};

	JSM.Touch.prototype.SetCurrent = function (event, div)
	{
		function GetEventCoord (touch, div)
		{
			var currX = touch.pageX;
			var currY = touch.pageY;
			if (div.getBoundingClientRect !== undefined) {
				var clientRect = div.getBoundingClientRect ();
				currX -= clientRect.left;
				currY -= clientRect.top;
			}
			if (window.pageXOffset !== undefined && window.pageYOffset !== undefined) {
				currX += window.pageXOffset;
				currY += window.pageYOffset;
			}
			return new JSM.Coord2D (currX, currY);
		}
		
		if (event.touches.length == 1 || event.touches.length == 3) {
			this.curr = GetEventCoord (event.touches[0], div);
		} else if (event.touches.length == 2) {
			var distance = GetEventCoord (event.touches[0], div).DistanceTo (GetEventCoord (event.touches[1], div));
			this.curr = new JSM.Coord2D (distance, distance);
		}
	};

	return JSM;
});

define('skylark-jsmodeler/viewer/painter',["../core/jsm"],function(JSM){
	/**
	* Function: OrderPolygons
	* Description: Order body polygons from front to back depending on the eye position.
	* Parameters:
	*	body {Body} the body
	*	eye {Coord} the camera eye position
	*	center {Coord} the camera center position
	* Returns:
	*	{integer[]} the ordered polygon indices
	*/
	JSM.OrderPolygons = function (body, eye, center)
	{
		function SwapArrayValues (array, from, to)
		{
			var temp = array[from];
			array[from] = array[to];
			array[to] = temp;
		}

		function GetPolygonCenter (p)
		{
			var polygon = body.GetPolygon (p);
			var result = new JSM.Coord (0.0, 0.0, 0.0);

			var i, coord;
			for (i = 0; i < polygon.VertexIndexCount (); i++) {
				coord = body.GetVertexPosition (polygon.GetVertexIndex (i));
				result = JSM.CoordAdd (result, coord);
			}
			
			result.MultiplyScalar (1.0 / polygon.VertexIndexCount ());
			return result;
		}
		
		function CalculatePolygonValues ()
		{
			var viewDirection = JSM.CoordSub (center, eye).Normalize ();
			var cameraPlane = JSM.GetPlaneFromCoordAndDirection (eye, viewDirection);
			
			var i, j, polygon, coord, distance, minDistance, maxDistance;
			var polygonCenter, polygonCenterDistance;
			var polygonNormal, polygonViewVector, polygonDirection, polygonPlane;
			for (i = 0; i < body.PolygonCount (); i++) {
				minDistance = JSM.Inf;
				maxDistance = -JSM.Inf;
				polygon = body.GetPolygon (i);
				for (j = 0; j < polygon.VertexIndexCount (); j++) {
					coord = body.GetVertexPosition (polygon.GetVertexIndex (j));
					distance = cameraPlane.CoordDistance (coord);
					if (JSM.IsLower (distance, minDistance)) {
						minDistance = distance;
					}
					if (JSM.IsGreater (distance, maxDistance)) {
						maxDistance = distance;
					}
				}

				minViewDistances.push (minDistance);
				maxViewDistances.push (maxDistance);
				
				polygonCenter = GetPolygonCenter (i);
				polygonCenterDistance = cameraPlane.CoordDistance (polygonCenter);
				polygonCenters.push (polygonCenter);
				polygonCenterDistances.push (polygonCenterDistance);

				polygonNormal = JSM.CalculateBodyPolygonNormal (body, i);
				polygonViewVector = JSM.CoordSub (polygonCenter, eye).Normalize ();
				polygonDirection = JSM.VectorDot (polygonNormal, polygonViewVector);
				if (JSM.IsGreaterOrEqual (polygonDirection, 0.0)) {
					polygonNormal.MultiplyScalar (-1);
				}

				polygonPlane = JSM.GetPlaneFromCoordAndDirection (polygonCenter, polygonNormal);
				polygonPlanes.push (polygonPlane);
			}
		}
		
		function PolygonViewOverlap (s, p)
		{
			return JSM.IsLowerOrEqual (minViewDistances[s], maxViewDistances[p]);
		}

		function PolygonIsFrontOfPlane (s, p)
		{
			var sPlane = polygonPlanes[s];
			var pPlane = polygonPlanes[p];

			var i, coord;

			var isSBehindP = true;
			var sPolygon = body.GetPolygon (s);
			for (i = 0; i < sPolygon.VertexIndexCount (); i++) {
				coord = body.GetVertexPosition (sPolygon.GetVertexIndex (i));
				if (pPlane.CoordPosition (coord) === JSM.CoordPlanePosition.CoordInFrontOfPlane) {
					isSBehindP = false;
					break;
				}
			}
			
			if (isSBehindP) {
				return false;
			}

			var isPFrontOfS = true;
			var pPolygon = body.GetPolygon (p);
			for (i = 0; i < pPolygon.VertexIndexCount (); i++) {
				coord = body.GetVertexPosition (pPolygon.GetVertexIndex (i));
				if (sPlane.CoordPosition (coord) === JSM.CoordPlanePosition.CoordAtBackOfPlane) {
					isPFrontOfS = false;
					break;
				}
			}
			
			if (isPFrontOfS) {
				return false;
			}
			
			return true;
		}

		function HasLowerDistance (s, p)
		{
			if (JSM.IsLower (maxViewDistances[s], maxViewDistances[p])) {
				return true;
			} else if (JSM.IsEqual (maxViewDistances[s], maxViewDistances[p])) {
				if (JSM.IsLower (polygonCenterDistances[s], polygonCenterDistances[p])) {
					return true;
				}
			}
			
			return false;
		}
		
		function OrderPolygonsByMaxViewDistance ()
		{
			var count = ordered.length;
			
			var i, j;
			for (i = 0; i < count - 1; i++) {
				for (j = 0; j < count - i - 1; j++) {
					if (HasLowerDistance (ordered[j], ordered[j + 1])) {
						SwapArrayValues (ordered, j, j + 1);
					}
				}
			}
		}

		function NeedToChangeOrder (s, p)
		{
			if (needToChangeOrderCache[s][p] !== null) {
				return needToChangeOrderCache[s][p];
			}

			if (PolygonViewOverlap (s, p)) {
				if (PolygonIsFrontOfPlane (s, p)) {
					needToChangeOrderCache[s][p] = true;
					return true;
				}
			}

			needToChangeOrderCache[s][p] = false;
			return false;
		}
		
		function ReorderPolygons ()
		{
			var count = ordered.length;

			var i, j;
			for (i = 0; i < count - 1; i++) {
				for (j = 0; j < count - i - 1; j++) {
					if (NeedToChangeOrder (ordered[j], ordered[j + 1])) {
						SwapArrayValues (ordered, j, j + 1);
					}
				}
			}
		}
		
		var result = [];
		
		var minViewDistances = [];
		var maxViewDistances = [];
		var polygonCenters = [];
		var polygonCenterDistances = [];
		var polygonPlanes = [];
		
		var ordered = [];
		var needToChangeOrderCache = [];
		var count = body.PolygonCount ();
		
		var i, j;
		for (i = 0; i < count; i++) {
			ordered.push (i);
			needToChangeOrderCache.push ([]);
			for (j = 0; j < count; j++) {
				needToChangeOrderCache[i].push (null);
			}
		}

		CalculatePolygonValues ();
		OrderPolygonsByMaxViewDistance ();
		ReorderPolygons ();
		
		result = ordered;
		return result;
	};

	return JSM;
});

define('skylark-jsmodeler/viewer/drawing',["../core/jsm"],function(JSM){
	/**
	* Class: CanvasDrawer
	* Description: Represents an object which can draw primitives to a canvas.
	* Parameters:
	*	canvas {html canvas element} the destination element
	*/
	JSM.CanvasDrawer = function (canvas)
	{
		this.canvas = canvas;
		this.context = this.canvas.getContext ('2d');
	};

	/**
	* Function: CanvasDrawer.GetWidth
	* Description: Returns the width of the target.
	* Returns:
	*	{integer} the result
	*/
	JSM.CanvasDrawer.prototype.GetWidth = function ()
	{
		return this.canvas.width;
	};

	/**
	* Function: CanvasDrawer.GetHeight
	* Description: Returns the height of the target.
	* Returns:
	*	{integer} the result
	*/
	JSM.CanvasDrawer.prototype.GetHeight = function ()
	{
		return this.canvas.height;
	};

	/**
	* Function: CanvasDrawer.Clear
	* Description: Clears the target.
	*/
	JSM.CanvasDrawer.prototype.Clear = function ()
	{
		this.context.clearRect (0, 0, this.canvas.width, this.canvas.height);
		this.context.fillStyle = '#ffffff';
		this.context.fillRect (0, 0, this.canvas.width, this.canvas.height);
	};

	/**
	* Function: CanvasDrawer.DrawLine
	* Description: Draws a line to the target.
	* Parameters:
	*	from {Coord2D} the start of the line
	*	to {Coord2D} the end of the line
	*/
	JSM.CanvasDrawer.prototype.DrawLine = function (from, to)
	{
		this.context.beginPath ();
		this.context.moveTo (from.x, this.canvas.height - from.y);
		this.context.lineTo (to.x, this.canvas.height - to.y);
		this.context.stroke ();
	};

	/**
	* Function: CanvasDrawer.DrawPolygon
	* Description: Draws a polygon to the target.
	* Parameters:
	*	polygon {Polygon2D} the polygon
	*	color {string} the hex color string
	*	contour {boolean} need to draw contour
	*/
	JSM.CanvasDrawer.prototype.DrawPolygon = function (polygon, color, contour)
	{
		function HexColorToHTMLColor (hexColor)
		{
			var rgb = JSM.HexColorToRGBComponents (hexColor);
			var result = 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
			return result;
		}
		
		this.context.fillStyle = HexColorToHTMLColor (color);
		this.context.beginPath ();

		var i, vertex, nextVertex;
		for (i = 0; i < polygon.VertexCount (); i++) {
			vertex = polygon.GetVertex (i);
			if (i === 0) {
				this.context.moveTo (vertex.x, this.canvas.height - vertex.y);
			} else {
				this.context.lineTo (vertex.x, this.canvas.height - vertex.y);
			}
		}

		this.context.closePath ();
		this.context.fill ();

		if (contour) {
			for (i = 0; i < polygon.VertexCount (); i++) {
				vertex = polygon.GetVertex (i);
				nextVertex = polygon.GetVertex (i < polygon.VertexCount () - 1 ? i + 1 : 0);
				this.DrawLine (vertex, nextVertex);
			}
		}
	};

	/**
	* Class: SVGDrawer
	* Description: Represents an object which can draw primitives to an svg.
	* Parameters:
	*	svgObject {html svg element} the destination element
	*/
	JSM.SVGDrawer = function (svgObject)
	{
		this.svgObject = svgObject;
		this.svgNameSpace = 'http://www.w3.org/2000/svg';
	};

	/**
	* Function: SVGDrawer.GetWidth
	* Description: Returns the width of the target.
	* Returns:
	*	{integer} the result
	*/
	JSM.SVGDrawer.prototype.GetWidth = function ()
	{
		return this.svgObject.getAttribute ('width');
	};

	/**
	* Function: SVGDrawer.GetHeight
	* Description: Returns the height of the target.
	* Returns:
	*	{integer} the result
	*/
	JSM.SVGDrawer.prototype.GetHeight = function ()
	{
		return this.svgObject.getAttribute ('height');
	};

	/**
	* Function: SVGDrawer.Clear
	* Description: Clears the target.
	*/
	JSM.SVGDrawer.prototype.Clear = function ()
	{
		while (this.svgObject.lastChild) {
			this.svgObject.removeChild (this.svgObject.lastChild);
		}
	};

	/**
	* Function: SVGDrawer.DrawLine
	* Description: Draws a line to the target.
	* Parameters:
	*	from {Coord2D} the start of the line
	*	to {Coord2D} the end of the line
	*/
	JSM.SVGDrawer.prototype.DrawLine = function (from, to)
	{
		var svgLine = document.createElementNS (this.svgNameSpace, 'line');
		var height = this.GetHeight ();
		svgLine.setAttributeNS (null, 'stroke', 'black');
		svgLine.setAttributeNS (null, 'x1', from.x);
		svgLine.setAttributeNS (null, 'y1', height - from.y);
		svgLine.setAttributeNS (null, 'x2', to.x);
		svgLine.setAttributeNS (null, 'y2', height - to.y);
		this.svgObject.appendChild (svgLine);
	};

	/**
	* Function: SVGDrawer.DrawPolygon
	* Description: Draws a polygon to the target.
	* Parameters:
	*	polygon {Polygon2D} the polygon
	*	color {string} the hex color string
	*	contour {boolean} need to draw contour
	*/
	JSM.SVGDrawer.prototype.DrawPolygon = function (polygon, color/*, contour*/)
	{
		function HexColorToHTMLColor (hexColor)
		{
			var rgb = JSM.HexColorToRGBComponents (hexColor);
			var result = 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
			return result;
		}

		var pointsString = '';
		var height = this.GetHeight ();
		
		var i, vertex;
		for (i = 0; i < polygon.VertexCount (); i++) {
			vertex = polygon.GetVertex (i);
			pointsString = pointsString + vertex.x + ', ' + (height - vertex.y);
			if (i < polygon.VertexCount () - 1) {
				pointsString = pointsString + ', ';
			}
		}
		
		var svgPolyon = document.createElementNS (this.svgNameSpace, 'polygon');
		svgPolyon.setAttributeNS (null, 'points', pointsString);
		svgPolyon.setAttributeNS (null, 'fill', HexColorToHTMLColor (color));
		svgPolyon.setAttributeNS (null, 'fill-opacity', '1.0');
		svgPolyon.setAttributeNS (null, 'stroke', 'black');
		this.svgObject.appendChild (svgPolyon);
	};

	/**
	* Function: DrawProjectedBody
	* Description: Draws a projected body.
	* Parameters:
	*	body {Body} the body
	*	materials {MaterialSet} the material container
	*	camera {Camera} the camera for projection
	*	drawMode {string} draw mode ('HiddenLinePainter', 'HiddenLineFrontFacing' or 'Wireframe')
	*	needClear {boolean} clear the display before draw
	*	drawer {drawer object} the drawer object
	*/
	JSM.DrawProjectedBody = function (body, materials, camera, drawMode, needClear, drawer)
	{
		function AddProjectedCoord (projectedPolygon, coord)
		{
			var projected = JSM.Project (coord, eye, center, up, fieldOfView * JSM.DegRad, aspectRatio, nearPlane, farPlane, viewPort);
			projectedPolygon.AddVertex (projected.x, projected.y);
		}

		function GetProjectedPolygonFromBody (polygon)
		{
			var projectedPolygon = new JSM.Polygon2D ();
			var i, coord;
			for (i = 0; i < polygon.VertexIndexCount (); i++) {
				coord = body.GetVertexPosition (polygon.GetVertexIndex (i));
				AddProjectedCoord (projectedPolygon, coord);
			}
			return projectedPolygon;
		}

		function GetProjectedPolygonFromPolygon (polygon)
		{
			var projectedPolygon = new JSM.Polygon2D ();
			var i, coord;
			for (i = 0; i < polygon.VertexCount (); i++) {
				coord = polygon.GetVertex (i);
				AddProjectedCoord (projectedPolygon, coord);
			}
			return projectedPolygon;
		}

		if (needClear) {
			drawer.Clear ();
		}

		var width = drawer.GetWidth ();
		var height = drawer.GetHeight ();
		
		var eye = camera.eye;
		var center = camera.center;
		var up = camera.up;
		var fieldOfView = camera.fieldOfView;
		var aspectRatio = width / height;
		var nearPlane = camera.nearClippingPlane;
		var farPlane = camera.farClippingPlane;
		var viewPort = [0, 0, width, height];

		var i, j, polygon, coord, projected, materialIndex, color;
		if (drawMode == 'HiddenLinePainter') {
			var orderedPolygons = JSM.OrderPolygons (body, eye, center);
			if (materials === undefined || materials === null) {
				materials = new JSM.MaterialSet ();
			}
			for (i = 0; i < orderedPolygons.length; i++) {
				polygon = body.GetPolygon (orderedPolygons[i]);
				projected = GetProjectedPolygonFromBody (polygon);
				materialIndex = polygon.GetMaterialIndex ();
				color = materials.GetMaterial (materialIndex).diffuse;
				drawer.DrawPolygon (projected, color, true);
			}
		} else if (drawMode == 'HiddenLineBSPTree') {
			if (materials === undefined || materials === null) {
				materials = new JSM.MaterialSet ();
			}

			var bspTree = new JSM.BSPTree ();
			JSM.AddBodyToBSPTree (body, bspTree);

			JSM.TraverseBSPTreeForEyePosition (bspTree, camera.eye, function (node) {
				projected = GetProjectedPolygonFromPolygon (node.polygon);
				polygon = body.GetPolygon (node.userData.originalPolygon);
				materialIndex = polygon.GetMaterialIndex ();
				color = materials.GetMaterial (materialIndex).diffuse;
				drawer.DrawPolygon (projected, color, true);
			});		
		} else if (drawMode == 'HiddenLineFrontFacing') {
			if (materials === undefined || materials === null) {
				materials = new JSM.MaterialSet ();
			}
			
			for (i = 0; i < body.PolygonCount (); i++) {
				polygon = body.GetPolygon (i);
				projected = GetProjectedPolygonFromBody (polygon);
				if (projected.GetOrientation () == JSM.Orientation.CounterClockwise) {
					materialIndex = polygon.GetMaterialIndex ();
					color = materials.GetMaterial (materialIndex).diffuse;
					drawer.DrawPolygon (projected, color, true);
				}
			}
		} else if (drawMode == 'Wireframe') {
			var vertexCount, currentCoord, currentVertex, vertex;
			var drawedLines = [];
			for (i = 0; i < body.PolygonCount (); i++) {
				currentCoord = null;
				currentVertex = null;
				polygon = body.GetPolygon (i);
				vertexCount = polygon.VertexIndexCount ();
				for (j = 0; j <= vertexCount; j++) {
					vertex = polygon.GetVertexIndex (j % vertexCount);
					coord = body.GetVertexPosition (vertex);
					projected = JSM.Project (coord, eye, center, up, fieldOfView * JSM.DegRad, aspectRatio, nearPlane, farPlane, viewPort);
					if (currentCoord !== null && currentVertex !== null && drawedLines[[currentVertex, vertex]] === undefined) {
						drawer.DrawLine (currentCoord, projected);
						drawedLines[[currentVertex, vertex]] = true;
						drawedLines[[vertex, currentVertex]] = true;
					}
					currentVertex = vertex;
					currentCoord = projected;
				}
			}
		}

		return true;
	};

	return JSM;
});

define('skylark-jsmodeler/viewer/navigation',["../core/jsm"],function(JSM){
	JSM.Navigation = function ()
	{
		this.canvas = null;
		this.camera = null;
		this.drawCallback = null;
		this.resizeCallback = null;
		
		this.mouse = null;
		this.touch = null;
		
		this.cameraFixUp = null;
		this.cameraEnableOrbit = null;
		this.cameraEnablePan = null;
		this.cameraEnableZoom = null;
		this.cameraNearDistanceLimit = null;
		this.cameraFarDistanceLimit = null;
		
		this.orbitCenter = null;
		this.fullscreen = null;
	};

	JSM.Navigation.prototype.Init = function (canvas, camera, drawCallback, resizeCallback)
	{
		this.canvas = canvas;
		this.camera = camera;
		this.drawCallback = drawCallback;
		this.resizeCallback = resizeCallback;

		this.mouse = new JSM.Mouse ();
		this.touch = new JSM.Touch ();
		
		this.cameraFixUp = true;
		this.cameraEnableOrbit = true;
		this.cameraEnablePan = true;
		this.cameraEnableZoom = true;
		
		this.orbitCenter = this.camera.center.Clone ();
		this.fullscreen = false;

		var myThis = this;
		if (document.addEventListener) {
			document.addEventListener ('mousemove', function (event) {myThis.OnMouseMove (event);});
			document.addEventListener ('mouseup', function (event) {myThis.OnMouseUp (event);});
		}
		if (this.canvas.addEventListener) {
			this.canvas.addEventListener ('mousedown', function (event) {myThis.OnMouseDown (event);}, false);
			this.canvas.addEventListener ('DOMMouseScroll', function (event) {myThis.OnMouseWheel (event);}, false);
			this.canvas.addEventListener ('mousewheel', function (event) {myThis.OnMouseWheel (event);}, false);
			this.canvas.addEventListener ('touchstart', function (event) {myThis.OnTouchStart (event);}, false);
			this.canvas.addEventListener ('touchmove', function (event) {myThis.OnTouchMove (event);}, false);
			this.canvas.addEventListener ('touchend', function (event) {myThis.OnTouchEnd (event);}, false);
			this.canvas.addEventListener ('contextmenu', function (event) {myThis.OnContextMenu (event);}, false);
		}
		if (window.addEventListener) {
			window.addEventListener ('resize', function (event) {myThis.OnResize (event);}, false);
		}
		
		return true;
	};

	JSM.Navigation.prototype.SetCamera = function (eye, center, up)
	{
		this.camera.Set (eye, center, up);
		this.orbitCenter = this.camera.center.Clone ();
	};

	JSM.Navigation.prototype.EnableFixUp = function (enable)
	{
		this.cameraFixUp = enable;
	};

	JSM.Navigation.prototype.EnableOrbit = function (enable)
	{
		this.cameraEnableOrbit = enable;
	};

	JSM.Navigation.prototype.EnablePan = function (enable)
	{
		this.cameraEnablePan = enable;
	};

	JSM.Navigation.prototype.EnableZoom = function (enable)
	{
		this.cameraEnableZoom = enable;
	};

	JSM.Navigation.prototype.SetNearDistanceLimit = function (limit)
	{
		this.cameraNearDistanceLimit = limit;
	};

	JSM.Navigation.prototype.SetFarDistanceLimit = function (limit)
	{
		this.cameraFarDistanceLimit = limit;
	};

	JSM.Navigation.prototype.SetOrbitCenter = function (orbitCenter)
	{
		this.orbitCenter = orbitCenter;
	};

	JSM.Navigation.prototype.FitInWindow = function (center, radius)
	{
		if (JSM.IsZero (radius)) {
			return;
		}
		
		var offsetToOrigo = JSM.CoordSub (this.camera.center, center);
		this.camera.center = center;
		this.camera.eye = JSM.CoordSub (this.camera.eye, offsetToOrigo);
		
		var centerEyeDirection = JSM.CoordSub (this.camera.eye, this.camera.center).Normalize ();
		var fieldOfView = this.camera.fieldOfView / 2.0;
		if (this.canvas.width < this.canvas.height) {
			fieldOfView = fieldOfView * this.canvas.width / this.canvas.height;
		}
		var distance = radius / Math.sin (fieldOfView * JSM.DegRad);
		
		this.camera.eye = this.camera.center.Clone ().Offset (centerEyeDirection, distance);
		this.orbitCenter = this.camera.center.Clone ();
	};

	JSM.Navigation.prototype.SetFullscreen = function (fullscreen)
	{
		this.fullscreen = fullscreen;
		this.ResizeCallback ();
	};

	JSM.Navigation.prototype.Orbit = function (angleX, angleY)
	{
		var radAngleX = angleX * JSM.DegRad;
		var radAngleY = angleY * JSM.DegRad;
		
		var viewDirection = JSM.CoordSub (this.camera.center, this.camera.eye).Normalize ();
		var horizontalDirection = JSM.VectorCross (viewDirection, this.camera.up).Normalize ();
		var differentCenter = !this.orbitCenter.IsEqual (this.camera.center);
		
		if (this.cameraFixUp) {
			var originalAngle = viewDirection.AngleTo (this.camera.up);
			var newAngle = originalAngle + radAngleY;
			if (JSM.IsGreater (newAngle, 0.0) && JSM.IsLower (newAngle, Math.PI)) {
				this.camera.eye.Rotate (horizontalDirection, -radAngleY, this.orbitCenter);
				if (differentCenter) {
					this.camera.center.Rotate (horizontalDirection, -radAngleY, this.orbitCenter);
				}
			}
			this.camera.eye.Rotate (this.camera.up, -radAngleX, this.orbitCenter);
			if (differentCenter) {
				this.camera.center.Rotate (this.camera.up, -radAngleX, this.orbitCenter);
			}
		} else {
			var verticalDirection = JSM.VectorCross (horizontalDirection, viewDirection).Normalize ();
			this.camera.eye.Rotate (horizontalDirection, -radAngleY, this.orbitCenter);
			this.camera.eye.Rotate (verticalDirection, -radAngleX, this.orbitCenter);
			if (differentCenter) {
				this.camera.center.Rotate (horizontalDirection, -radAngleY, this.orbitCenter);
				this.camera.center.Rotate (verticalDirection, -radAngleX, this.orbitCenter);
			}
			this.camera.up = verticalDirection;
		}
	};

	JSM.Navigation.prototype.Pan = function (moveX, moveY)
	{
		var viewDirection = JSM.CoordSub (this.camera.center, this.camera.eye).Normalize ();
		var horizontalDirection = JSM.VectorCross (viewDirection, this.camera.up).Normalize ();
		var verticalDirection = JSM.VectorCross (horizontalDirection, viewDirection).Normalize ();
		
		this.camera.eye.Offset (horizontalDirection, -moveX);
		this.camera.center.Offset (horizontalDirection, -moveX);

		this.camera.eye.Offset (verticalDirection, moveY);
		this.camera.center.Offset (verticalDirection, moveY);
	};

	JSM.Navigation.prototype.Zoom = function (ratio)
	{
		var direction = JSM.CoordSub (this.camera.center, this.camera.eye);
		var distance = direction.Length ();
		var zoomIn = ratio > 0;
		if (zoomIn && this.cameraNearDistanceLimit !== null && distance < this.cameraNearDistanceLimit) {
			return 0;
		} else if (!zoomIn && this.cameraFarDistanceLimit !== null && distance > this.cameraFarDistanceLimit) {
			return 0;
		}

		var move = distance * ratio;
		this.camera.eye.Offset (direction, move);
	};

	JSM.Navigation.prototype.DrawCallback = function ()
	{
		if (this.drawCallback !== undefined && this.drawCallback !== null) {
			this.drawCallback ();
		}
	};

	JSM.Navigation.prototype.ResizeCallback = function ()
	{
		if (this.resizeCallback !== undefined && this.resizeCallback !== null) {
			if (this.fullscreen) {
				this.canvas.width = window.innerWidth;
				this.canvas.height = window.innerHeight;
			}
			this.resizeCallback ();
		}
	};

	JSM.Navigation.prototype.OnMouseDown = function (event)
	{
		event.preventDefault ();
		this.mouse.Down (event, this.canvas);
	};

	JSM.Navigation.prototype.OnMouseMove = function (event)
	{
		event.preventDefault ();
		this.mouse.Move (event, this.canvas);
		if (!this.mouse.down) {
			return;
		}

		var ratio = 0.0;
		if (this.mouse.button == 1) {
			if (!this.cameraEnableOrbit) {
				return;
			}		
			ratio = 0.5;
			this.Orbit (this.mouse.diff.x * ratio, this.mouse.diff.y * ratio);
		} else if (this.mouse.button == 3) {
			if (!this.cameraEnablePan) {
				return;
			}
			var eyeCenterDistance = this.camera.eye.DistanceTo (this.camera.center);
			ratio = 0.001 * eyeCenterDistance;
			this.Pan (this.mouse.diff.x * ratio, this.mouse.diff.y * ratio);
		}
		this.DrawCallback ();
	};

	JSM.Navigation.prototype.OnMouseUp = function (event)
	{
		event.preventDefault ();
		this.mouse.Up (event, this.canvas);
	};

	JSM.Navigation.prototype.OnMouseOut = function (event)
	{
		event.preventDefault ();
		this.mouse.Out (event, this.canvas);
	};

	JSM.Navigation.prototype.OnMouseWheel = function (event)
	{
		event.preventDefault ();
		if (!this.cameraEnableZoom) {
			return;
		}

		var eventParameters = event;
		if (eventParameters === null) {
			eventParameters = window.event;
		}
		
		var delta = 0;
		if (eventParameters.detail) {
			delta = -eventParameters.detail;
		} else if (eventParameters.wheelDelta) {
			delta = eventParameters.wheelDelta / 40;
		}

		var ratio = 0.1;
		if (delta < 0) {
			ratio = ratio * -1.0;
		}

		this.Zoom (ratio);
		this.DrawCallback ();
	};

	JSM.Navigation.prototype.OnTouchStart = function (event)
	{
		event.preventDefault ();
		this.touch.Start (event, this.canvas);
	};

	JSM.Navigation.prototype.OnTouchMove = function (event)
	{
		event.preventDefault ();
		this.touch.Move (event, this.canvas);
		if (!this.touch.down) {
			return;
		}

		var ratio = 0.0;
		if (this.touch.fingers == 1) {
			if (!this.cameraEnableOrbit) {
				return;
			}
			ratio = 0.5;
			this.Orbit (this.touch.diff.x * ratio, this.touch.diff.y * ratio);
		} else if (this.touch.fingers == 2) {
			if (!this.cameraEnableZoom) {
				return;
			}
			ratio = 0.005;
			this.Zoom (this.touch.diff.x * ratio);
		} else if (this.touch.fingers == 3) {
			if (!this.cameraEnablePan) {
				return;
			}
			var eyeCenterDistance = this.camera.eye.DistanceTo (this.camera.center);
			ratio = 0.001 * eyeCenterDistance;
			this.Pan (this.touch.diff.x * ratio, this.touch.diff.y * ratio);
		}
		this.DrawCallback ();
	};

	JSM.Navigation.prototype.OnTouchEnd = function (event)
	{
		event.preventDefault ();
		this.touch.End (event, this.canvas);
	};

	JSM.Navigation.prototype.OnContextMenu = function (event)
	{
		event.preventDefault ();
	};

	JSM.Navigation.prototype.OnResize = function (event)
	{
		event.preventDefault ();
		this.ResizeCallback ();
	};

	return JSM;
});

define('skylark-jsmodeler/viewer/softwareviewer',["../core/jsm"],function(JSM){
	JSM.SoftwareViewer = function ()
	{
		this.canvas = null;
		this.camera = null;
		this.bodies = null;
		this.drawer = null;
		this.drawMode = null;
		this.navigation = null;
	};

	JSM.SoftwareViewer.prototype.Start = function (canvas, camera)
	{
		if (!this.InitCanvas (canvas)) {
			return false;
		}

		if (!this.InitCamera (camera)) {
			return false;
		}

		return true;
	};

	JSM.SoftwareViewer.prototype.InitCanvas = function (canvas)
	{
		this.bodies = [];
		this.canvas = canvas;
		if (!this.canvas) {
			return false;
		}
		
		if (this.canvas instanceof (HTMLCanvasElement)) {
			this.drawer = new JSM.CanvasDrawer (this.canvas);
		} else if (this.canvas instanceof (SVGSVGElement)) {
			this.drawer = new JSM.SVGDrawer (this.canvas);
		}
		
		if (!this.drawer) {
			return false;
		}
		
		this.drawMode = 'Wireframe';
		return true;
	};

	JSM.SoftwareViewer.prototype.InitCamera = function (camera)
	{
		this.camera = JSM.ValueOrDefault (camera, new JSM.Camera ());
		if (!this.camera) {
			return false;
		}

		this.navigation = new JSM.Navigation ();
		if (!this.navigation.Init (this.canvas, this.camera, this.Draw.bind (this), this.Resize.bind (this))) {
			return false;
		}

		return true;
	};

	JSM.SoftwareViewer.prototype.AddBody = function (body, materials)
	{
		this.bodies.push ([body, materials]);
	};

	JSM.SoftwareViewer.prototype.RemoveBodies = function ()
	{
		this.bodies = [];
	};

	JSM.SoftwareViewer.prototype.FitInWindow = function ()
	{
		var sphere = this.GetBoundingSphere ();
		this.navigation.FitInWindow (sphere.GetCenter (), sphere.GetRadius ());
		this.Draw ();
	};

	JSM.SoftwareViewer.prototype.GetCenter = function ()
	{
		var boundingBox = this.GetBoundingBox ();
		return boundingBox.GetCenter ();
	};

	JSM.SoftwareViewer.prototype.GetBoundingBox = function ()
	{
		var min = new JSM.Coord (JSM.Inf, JSM.Inf, JSM.Inf);
		var max = new JSM.Coord (-JSM.Inf, -JSM.Inf, -JSM.Inf);
		
		var i, j, body, vertex;
		for (i = 0; i < this.bodies.length; i++) {
			body = this.bodies[i][0];
			for (j = 0; j < body.VertexCount (); j++) {
				vertex = body.GetVertex (j);
				min.x = JSM.Minimum (min.x, vertex.position.x);
				min.y = JSM.Minimum (min.y, vertex.position.y);
				min.z = JSM.Minimum (min.z, vertex.position.z);
				max.x = JSM.Maximum (max.x, vertex.position.x);
				max.y = JSM.Maximum (max.y, vertex.position.y);
				max.z = JSM.Maximum (max.z, vertex.position.z);
			}
		}

		return new JSM.Box (min, max);
	};

	JSM.SoftwareViewer.prototype.GetBoundingSphere = function ()
	{
		var center = this.GetCenter ();
		var radius = 0.0;

		var i, j, body, vertex, distance;
		for (i = 0; i < this.bodies.length; i++) {
			body = this.bodies[i][0];
			for (j = 0; j < body.VertexCount (); j++) {
				vertex = body.GetVertex (j);
				distance = center.DistanceTo (vertex.position);
				if (JSM.IsGreater (distance, radius)) {
					radius = distance;
				}
			}
		}

		var sphere = new JSM.Sphere (center, radius);
		return sphere;
	};

	JSM.SoftwareViewer.prototype.Resize = function ()
	{
		this.Draw ();
	};

	JSM.SoftwareViewer.prototype.Draw = function ()
	{
		var i, bodyAndMaterials;
		this.drawer.Clear ();
		
		for (i = 0; i < this.bodies.length; i++) {
			bodyAndMaterials = this.bodies[i];
			JSM.DrawProjectedBody (bodyAndMaterials[0], bodyAndMaterials[1], this.camera, this.drawMode, false, this.drawer);
		}

		return true;
	};

	return JSM;
});

define('skylark-jsmodeler/viewer/spriteviewer',["../core/jsm"],function(JSM){
	JSM.SpriteViewer = function ()
	{
		this.canvas = null;
		this.camera = null;
		this.callbacks = null;
		this.points = null;
		this.projected = null;
		this.navigation = null;
	};

	JSM.SpriteViewer.prototype.Start = function (canvas, camera, callbacks)
	{
		if (!this.InitCanvas (canvas)) {
			return false;
		}

		if (!this.InitCamera (camera)) {
			return false;
		}

		if (!this.InitCallbacks (callbacks)) {
			return false;
		}
		
		return true;
	};

	JSM.SpriteViewer.prototype.InitCanvas = function (canvas)
	{
		this.points = [];
		this.canvas = canvas;
		if (!this.canvas) {
			return false;
		}
		
		return true;
	};

	JSM.SpriteViewer.prototype.InitCamera = function (camera)
	{
		this.camera = JSM.ValueOrDefault (camera, new JSM.Camera ());
		if (!this.camera) {
			return false;
		}

		this.navigation = new JSM.Navigation ();
		if (!this.navigation.Init (this.canvas, this.camera, this.Draw.bind (this))) {
			return false;
		}

		return true;
	};

	JSM.SpriteViewer.prototype.InitCallbacks = function (callbacks)
	{
		this.callbacks = {
			onPointDraw : null
		};

		if (callbacks !== undefined) {
			if (callbacks.onDrawStart !== undefined) { this.callbacks.onDrawStart = callbacks.onDrawStart; }
			if (callbacks.onPointDraw !== undefined) { this.callbacks.onPointDraw = callbacks.onPointDraw; }
			if (callbacks.onDrawEnd !== undefined) { this.callbacks.onDrawEnd = callbacks.onDrawEnd; }
		}

		return true;
	};

	JSM.SpriteViewer.prototype.AddPoint = function (point)
	{
		this.points.push (point);
	};

	JSM.SpriteViewer.prototype.RemovePoints = function ()
	{
		this.points = [];
	};

	JSM.SpriteViewer.prototype.Resize = function ()
	{
		this.Draw ();
	};

	JSM.SpriteViewer.prototype.NearestPointUnderPosition = function (maxDistance, x, y)
	{
		var position = new JSM.Coord2D (x, y);
		
		var minIndex = -1;
		var minDistance = JSM.Inf;
		var i, projected, distance;
		for (i = 0; i < this.projected.length; i++) {
			projected = this.projected[i];
			distance = position.DistanceTo (new JSM.Coord2D (projected.position.x, projected.position.y));
			if (JSM.IsLower (distance, maxDistance) && JSM.IsLower (distance, minDistance)) {
				minIndex = projected.originalIndex;
				minDistance = distance;
			}
		}
		
		return minIndex;
	};

	JSM.SpriteViewer.prototype.NearestPointUnderMouse = function (maxDistance)
	{
		return this.NearestPointUnderPosition (maxDistance, this.navigation.mouse.curr.x, this.navigation.mouse.curr.y);
	};

	JSM.SpriteViewer.prototype.NearestPointUnderTouch = function (maxDistance)
	{
		return this.NearestPointUnderPosition (maxDistance, this.navigation.touch.curr.x, this.navigation.touch.curr.y);
	};

	JSM.SpriteViewer.prototype.FitInWindow = function ()
	{
		var sphere = this.GetBoundingSphere ();
		this.navigation.FitInWindow (sphere.GetCenter (), sphere.GetRadius ());
		this.Draw ();
	};

	JSM.SpriteViewer.prototype.GetCenter = function ()
	{
		var boundingBox = this.GetBoundingBox ();
		return boundingBox.GetCenter ();
	};

	JSM.SpriteViewer.prototype.GetBoundingBox = function ()
	{
		var min = new JSM.Coord (JSM.Inf, JSM.Inf, JSM.Inf);
		var max = new JSM.Coord (-JSM.Inf, -JSM.Inf, -JSM.Inf);
		
		var i, coord;
		for (i = 0; i < this.points.length; i++) {
			coord = this.points[i];
			min.x = JSM.Minimum (min.x, coord.x);
			min.y = JSM.Minimum (min.y, coord.y);
			min.z = JSM.Minimum (min.z, coord.z);
			max.x = JSM.Maximum (max.x, coord.x);
			max.y = JSM.Maximum (max.y, coord.y);
			max.z = JSM.Maximum (max.z, coord.z);
		}

		return new JSM.Box (min, max);
	};

	JSM.SpriteViewer.prototype.GetBoundingSphere = function ()
	{
		var center = this.GetCenter ();
		var radius = 0.0;

		var i, coord, distance;
		for (i = 0; i < this.points.length; i++) {
			coord = this.points[i];
			distance = center.DistanceTo (coord);
			if (JSM.IsGreater (distance, radius)) {
				radius = distance;
			}
		}

		var sphere = new JSM.Sphere (center, radius);
		return sphere;
	};

	JSM.SpriteViewer.prototype.Draw = function ()
	{
		if (this.callbacks.onDrawStart !== null) {
			this.callbacks.onDrawStart (this.canvas);
		}

		var aspectRatio = this.canvas.width / this.canvas.height;
		var viewPort = [0, 0, this.canvas.width, this.canvas.height];
		this.projected = [];
		
		var i, coord, projected;
		for (i = 0; i < this.points.length; i++) {
			coord = this.points[i];
			projected = JSM.Project (coord, this.camera.eye, this.camera.center, this.camera.up, this.camera.fieldOfView * JSM.DegRad, aspectRatio, this.camera.nearClippingPlane, this.camera.farClippingPlane, viewPort);
			projected.y = this.canvas.height - projected.y;
			if (projected !== null) {
				this.projected.push ({position : projected, originalIndex : i});
			}
		}

		this.projected.sort (function (a, b) {
			if (a.position.z > b.position.z) {
				return -1;
			} else if (a.position.z < b.position.z) {
				return 1;
			}
			return 0;
		});
		
		for (i = 0; i < this.projected.length; i++) {
			if (this.callbacks.onPointDraw !== null) {
				this.callbacks.onPointDraw (this.canvas, this.projected[i].originalIndex, this.projected[i].position);
			}
		}

		if (this.callbacks.onDrawEnd !== null) {
			this.callbacks.onDrawEnd (this.canvas);
		}
		return true;
	};

	return JSM;
});

define('skylark-jsmodeler/viewer/viewer',["../core/jsm"],function(JSM){
	JSM.Viewer = function ()
	{
		this.camera = null;
		this.renderer = null;
		this.navigation = null;
		this.cameraLight = null;
	};

	JSM.Viewer.prototype.Init = function (canvas, camera)
	{
		if (!this.InitRenderer (canvas)) {
			return false;
		}

		if (!this.InitNavigation (camera)) {
			return false;
		}

		if (!this.InitLights ()) {
			return false;
		}

		return true;
	};

	JSM.Viewer.prototype.Reset = function ()
	{
		this.RemoveBodies ();
		this.RemoveLights ();
		this.SetAmbientLight (new JSM.RenderAmbientLight (0x7f7f7f));
		this.EnableCameraLight ();
	};

	JSM.Viewer.prototype.InitRenderer = function (canvas)
	{
		this.renderer = new JSM.Renderer ();
		if (!this.renderer.Init (canvas)) {
			return false;
		}
		return true;
	};

	JSM.Viewer.prototype.InitNavigation = function (camera)
	{
		this.camera = JSM.ValueOrDefault (camera, new JSM.Camera ());
		if (!this.camera) {
			return false;
		}

		this.navigation = new JSM.Navigation ();
		if (!this.navigation.Init (this.renderer.canvas, this.camera, this.Draw.bind (this), this.Resize.bind (this))) {
			return false;
		}

		return true;
	};

	JSM.Viewer.prototype.InitLights = function ()
	{
		this.SetAmbientLight (new JSM.RenderAmbientLight (0x7f7f7f));
		this.EnableCameraLight ();
		return true;
	};

	JSM.Viewer.prototype.SetClearColor = function (red, green, blue)
	{
		this.renderer.SetClearColor (red, green, blue);
	};

	JSM.Viewer.prototype.EnableCameraLight = function ()
	{
		if (this.cameraLight !== null) {
			return;
		}
		this.cameraLight = new JSM.RenderDirectionalLight (0x7f7f7f, 0xffffff, new JSM.Vector (1.0, 0.0, 0.0));
		this.AddLight (this.cameraLight);
	};

	JSM.Viewer.prototype.DisableCameraLight = function ()
	{
		if (this.cameraLight === null) {
			return;
		}
		this.RemoveLight (this.cameraLight);
		this.cameraLight = null;
	};

	JSM.Viewer.prototype.GetCameraLight = function ()
	{
		return this.cameraLight;
	};

	JSM.Viewer.prototype.SetAmbientLight = function (light)
	{
		this.renderer.SetAmbientLight (light);
	};

	JSM.Viewer.prototype.AddLight = function (light)
	{
		this.renderer.AddLight (light);
	};

	JSM.Viewer.prototype.RemoveLight = function (light)
	{
		this.renderer.RemoveLight (light);
	};

	JSM.Viewer.prototype.RemoveLights = function ()
	{
		this.renderer.RemoveLights ();
		this.cameraLight = null;
	};

	JSM.Viewer.prototype.AddBody = function (renderBody)
	{
		this.renderer.AddBody (renderBody, this.Draw.bind (this));
	};

	JSM.Viewer.prototype.AddBodies = function (renderBodies)
	{
		this.renderer.AddBodies (renderBodies, this.Draw.bind (this));
	};

	JSM.Viewer.prototype.RemoveBody = function (body)
	{
		this.renderer.RemoveBody (body);
	};

	JSM.Viewer.prototype.RemoveBodies = function ()
	{
		this.renderer.RemoveBodies ();
	};

	JSM.Viewer.prototype.FitInWindow = function ()
	{
		var sphere = this.GetBoundingSphere ();
		this.navigation.FitInWindow (sphere.GetCenter (), sphere.GetRadius ());
	};

	JSM.Viewer.prototype.SetFullscreen = function (fullscreen)
	{
		this.navigation.SetFullscreen (fullscreen);
	};

	JSM.Viewer.prototype.GetCenter = function ()
	{
		var boundingBox = this.GetBoundingBox ();
		return boundingBox.GetCenter ();
	};

	JSM.Viewer.prototype.GetBoundingBox = function ()
	{
		var min = new JSM.Coord (JSM.Inf, JSM.Inf, JSM.Inf);
		var max = new JSM.Coord (-JSM.Inf, -JSM.Inf, -JSM.Inf);
		
		this.renderer.EnumerateBodies (function (body) {
			var transformation = body.GetTransformation ();
			body.EnumerateMeshes (function (mesh) {
				var i, vertex;
				for (i = 0; i < mesh.VertexCount (); i++) {
					vertex = mesh.GetTransformedVertex (i, transformation);
					min.x = JSM.Minimum (min.x, vertex.x);
					min.y = JSM.Minimum (min.y, vertex.y);
					min.z = JSM.Minimum (min.z, vertex.z);
					max.x = JSM.Maximum (max.x, vertex.x);
					max.y = JSM.Maximum (max.y, vertex.y);
					max.z = JSM.Maximum (max.z, vertex.z);
				}
			});
		});

		return new JSM.Box (min, max);
	};

	JSM.Viewer.prototype.GetBoundingSphere = function ()
	{
		var center = this.GetCenter ();
		var radius = 0.0;

		this.renderer.EnumerateBodies (function (body) {
			var transformation = body.GetTransformation ();
			body.EnumerateMeshes (function (mesh) {
				var i, vertex, distance;
				for (i = 0; i < mesh.VertexCount (); i++) {
					vertex = mesh.GetTransformedVertex (i, transformation);
					distance = center.DistanceTo (vertex);
					if (JSM.IsGreater (distance, radius)) {
						radius = distance;
					}
				}
			});
		});
		
		var sphere = new JSM.Sphere (center, radius);
		return sphere;
	};

	JSM.Viewer.prototype.FindObjects = function (screenX, screenY)
	{
		return this.renderer.FindObjects (this.camera, screenX, screenY);
	};

	JSM.Viewer.prototype.Resize = function ()
	{
		this.renderer.Resize ();
		this.Draw ();
	};

	JSM.Viewer.prototype.Draw = function ()
	{
		var camera = this.camera;
		var cameraLight = this.GetCameraLight ();
		if (cameraLight !== null) {
			cameraLight.direction = JSM.CoordSub (camera.center, camera.eye).Normalize ();
		}
		this.renderer.Render (camera);
	};

	return JSM;
});

define('skylark-jsmodeler/viewer/pointcloudviewer',["../core/jsm"],function(JSM){
	JSM.PointCloudViewer = function ()
	{
		this.canvas = null;
		this.renderer = null;
		this.navigation = null;
	};

	JSM.PointCloudViewer.prototype.Init = function (canvas, camera)
	{
		if (!this.InitRenderer (canvas, camera)) {
			return false;
		}

		if (!this.InitNavigation ()) {
			return false;
		}

		return true;
	};

	JSM.PointCloudViewer.prototype.InitRenderer = function (canvas, camera)
	{
		this.renderer = new JSM.PointCloudRenderer ();
		if (!this.renderer.Init (canvas, camera)) {
			return false;
		}
		return true;
	};

	JSM.PointCloudViewer.prototype.InitNavigation = function ()
	{
		this.navigation = new JSM.Navigation ();
		if (!this.navigation.Init (this.renderer.canvas, this.renderer.camera, this.Draw.bind (this), this.Resize.bind (this))) {
			return false;
		}
		return true;
	};

	JSM.PointCloudViewer.prototype.SetClearColor = function (red, green, blue)
	{
		this.renderer.SetClearColor (red, green, blue);
	};

	JSM.PointCloudViewer.prototype.SetPointSize = function (pointSize)
	{
		this.renderer.SetPointSize (pointSize);
	};

	JSM.PointCloudViewer.prototype.AddPoints = function (points, colors)
	{
		this.renderer.AddPoints (points, colors);
	};

	JSM.PointCloudViewer.prototype.RemovePoints = function ()
	{
		this.renderer.RemovePoints ();
	};

	JSM.PointCloudViewer.prototype.FitInWindow = function ()
	{
		var sphere = this.GetBoundingSphere ();
		this.navigation.FitInWindow (sphere.GetCenter (), sphere.GetRadius ());
		this.Draw ();
	};

	JSM.PointCloudViewer.prototype.GetCenter = function ()
	{
		var boundingBox = this.GetBoundingBox ();
		return boundingBox.GetCenter ();
	};

	JSM.PointCloudViewer.prototype.GetBoundingBox = function ()
	{
		var min = new JSM.Coord (JSM.Inf, JSM.Inf, JSM.Inf);
		var max = new JSM.Coord (-JSM.Inf, -JSM.Inf, -JSM.Inf);
		
		var i, j, points, point;
		for (i = 0; i < this.renderer.points.length; i++) {
			points = this.renderer.points[i].pointArray;
			for (j = 0; j < points.length; j = j + 3) {
				point = new JSM.Coord (points[j], points[j + 1], points[j + 2]);
				min.x = JSM.Minimum (min.x, point.x);
				min.y = JSM.Minimum (min.y, point.y);
				min.z = JSM.Minimum (min.z, point.z);
				max.x = JSM.Maximum (max.x, point.x);
				max.y = JSM.Maximum (max.y, point.y);
				max.z = JSM.Maximum (max.z, point.z);
			}
		}

		return new JSM.Box (min, max);
	};

	JSM.PointCloudViewer.prototype.GetBoundingSphere = function ()
	{
		var center = this.GetCenter ();
		var radius = 0.0;

		var i, j, points, point, distance;
		for (i = 0; i < this.renderer.points.length; i++) {
			points = this.renderer.points[i].pointArray;
			for (j = 0; j < points.length; j = j + 3) {
				point = new JSM.Coord (points[j], points[j + 1], points[j + 2]);
				distance = center.DistanceTo (point);
				if (JSM.IsGreater (distance, radius)) {
					radius = distance;
				}
			}
		}

		var sphere = new JSM.Sphere (center, radius);
		return sphere;
	};

	JSM.PointCloudViewer.prototype.Resize = function ()
	{
		this.renderer.Resize ();
		this.Draw ();
	};

	JSM.PointCloudViewer.prototype.Draw = function ()
	{
		this.renderer.Render ();
	};

	return JSM;
});

define('skylark-jsmodeler/extras/solidgenerator',["../core/jsm"],function(JSM){
	/**
	* Function: GenerateSolidWithRadius
	* Description: Generates a special solid with the given radius.
	* Parameters:
	*	solidName {string} the name of the solid
	*	radius {number} the radius of the solid
	* Returns:
	*	{Body} the result
	*/
	JSM.GenerateSolidWithRadius = function (solidName, radius)
	{
		var result = new JSM.Body ();
		var equalRadius = true;
		
		if (solidName === 'Tetrahedron') {
			result = JSM.GenerateTetrahedron ();
		} else if (solidName === 'Hexahedron') {
			result = JSM.GenerateHexahedron ();
		} else if (solidName === 'Octahedron') {
			result = JSM.GenerateOctahedron ();
		} else if (solidName === 'Dodecahedron') {
			result = JSM.GenerateDodecahedron ();
		} else if (solidName === 'Icosahedron') {
			result = JSM.GenerateIcosahedron ();
		} else if (solidName === 'TruncatedTetrahedron') {
			result = JSM.GenerateTruncatedTetrahedron ();
		} else if (solidName === 'Cuboctahedron') {
			result = JSM.GenerateCuboctahedron ();
		} else if (solidName === 'TruncatedCube') {
			result = JSM.GenerateTruncatedCube ();
		} else if (solidName === 'TruncatedOctahedron') {
			result = JSM.GenerateTruncatedOctahedron ();
		} else if (solidName === 'Rhombicuboctahedron') {
			result = JSM.GenerateRhombicuboctahedron ();
		} else if (solidName === 'TruncatedCuboctahedron') {
			result = JSM.GenerateTruncatedCuboctahedron ();
		} else if (solidName === 'SnubCube') {
			result = JSM.GenerateSnubCube ();
		} else if (solidName === 'Icosidodecahedron') {
			result = JSM.GenerateIcosidodecahedron ();
		} else if (solidName === 'TruncatedDodecahedron') {
			result = JSM.GenerateTruncatedDodecahedron ();
		} else if (solidName === 'TruncatedIcosahedron') {
			result = JSM.GenerateTruncatedIcosahedron ();
		} else if (solidName === 'Rhombicosidodecahedron') {
			result = JSM.GenerateRhombicosidodecahedron ();
		} else if (solidName === 'TruncatedIcosidodecahedron') {
			result = JSM.GenerateTruncatedIcosidodecahedron ();
		} else if (solidName === 'SnubDodecahedron') {
			result = JSM.GenerateSnubDodecahedron ();
		} else if (solidName === 'TetrakisHexahedron') {
			result = JSM.GenerateTetrakisHexahedron ();
			equalRadius = false;
		} else if (solidName === 'RhombicDodecahedron') {
			result = JSM.GenerateRhombicDodecahedron ();
			equalRadius = false;
		} else if (solidName === 'PentakisDodecahedron') {
			result = JSM.GeneratePentakisDodecahedron ();
			equalRadius = false;
		} else if (solidName === 'SmallStellatedDodecahedron') {
			result = JSM.GenerateSmallStellatedDodecahedron ();
			equalRadius = false;
		} else if (solidName === 'GreatDodecahedron') {
			result = JSM.GenerateGreatDodecahedron ();
			equalRadius = false;
		} else if (solidName === 'SmallTriambicIcosahedron') {
			result = JSM.GenerateSmallTriambicIcosahedron ();
			equalRadius = false;
		} else if (solidName === 'GreatStellatedDodecahedron') {
			result = JSM.GenerateGreatStellatedDodecahedron ();
			equalRadius = false;
		} else if (solidName === 'SmallTriakisOctahedron') {
			result = JSM.GenerateSmallTriakisOctahedron ();
			equalRadius = false;
		} else if (solidName === 'StellaOctangula') {
			result = JSM.GenerateStellaOctangula ();
			equalRadius = false;
		} else if (solidName === 'TriakisTetrahedron') {
			result = JSM.GenerateTriakisTetrahedron ();
			equalRadius = false;
		}

		if (result.VertexCount () > 0) {
			var i;
		
			var maxRadius = 0.0;
			if (equalRadius) {
				maxRadius = result.GetVertexPosition (0).Length ();
			} else {
				var currentRadius;
				for (i = 0; i < result.VertexCount (); i++) {
					currentRadius = result.GetVertexPosition (i).Length ();
					if (JSM.IsGreater (currentRadius, maxRadius)) {
						maxRadius = currentRadius;
					}
				}
			}
			
			var scale = radius / maxRadius;
			
			var vertex;
			for (i = 0; i < result.VertexCount (); i++) {
				vertex = result.GetVertex (i);
				vertex.position.MultiplyScalar (scale);
			}
		}
		
		return result;
	};

	/**
	* Function: GenerateTetrahedron
	* Description: Generates a tetrahedron.
	* Returns:
	*	{Body} the result
	*/
	JSM.GenerateTetrahedron = function ()
	{
		var result = new JSM.Body ();

		var a = 1.0;

		result.AddVertex (new JSM.BodyVertex (new JSM.Coord (+a, +a, +a)));
		result.AddVertex (new JSM.BodyVertex (new JSM.Coord (-a, -a, +a)));
		result.AddVertex (new JSM.BodyVertex (new JSM.Coord (-a, +a, -a)));
		result.AddVertex (new JSM.BodyVertex (new JSM.Coord (+a, -a, -a)));

		result.AddPolygon (new JSM.BodyPolygon ([0, 1, 3]));
		result.AddPolygon (new JSM.BodyPolygon ([0, 2, 1]));
		result.AddPolygon (new JSM.BodyPolygon ([0, 3, 2]));
		result.AddPolygon (new JSM.BodyPolygon ([1, 2, 3]));
		
		return result;
	};

	/**
	* Function: GenerateHexahedron
	* Description: Generates a hexahedron.
	* Returns:
	*	{Body} the result
	*/
	JSM.GenerateHexahedron = function ()
	{
		var result = new JSM.Body ();

		var a = 1.0;

		JSM.AddVertexToBody (result, +a, +a, +a);
		JSM.AddVertexToBody (result, +a, +a, -a);
		JSM.AddVertexToBody (result, +a, -a, +a);
		JSM.AddVertexToBody (result, +a, -a, -a);
		JSM.AddVertexToBody (result, -a, +a, +a);
		JSM.AddVertexToBody (result, -a, +a, -a);
		JSM.AddVertexToBody (result, -a, -a, +a);
		JSM.AddVertexToBody (result, -a, -a, -a);

		JSM.AddPolygonToBody (result, [0, 1, 5, 4]);
		JSM.AddPolygonToBody (result, [0, 2, 3, 1]);
		JSM.AddPolygonToBody (result, [0, 4, 6, 2]);
		JSM.AddPolygonToBody (result, [1, 3, 7, 5]);
		JSM.AddPolygonToBody (result, [2, 6, 7, 3]);
		JSM.AddPolygonToBody (result, [4, 5, 7, 6]);

		return result;
	};

	/**
	* Function: GenerateOctahedron
	* Description: Generates an octahedron.
	* Returns:
	*	{Body} the result
	*/
	JSM.GenerateOctahedron = function ()
	{
		var result = new JSM.Body ();

		var a = 1.0;
		var b = 0.0;

		JSM.AddVertexToBody (result, +a, +b, +b);
		JSM.AddVertexToBody (result, -a, +b, +b);
		JSM.AddVertexToBody (result, +b, +a, +b);
		JSM.AddVertexToBody (result, +b, -a, +b);
		JSM.AddVertexToBody (result, +b, +b, +a);
		JSM.AddVertexToBody (result, +b, +b, -a);

		JSM.AddPolygonToBody (result, [0, 2, 4]);
		JSM.AddPolygonToBody (result, [0, 3, 5]);
		JSM.AddPolygonToBody (result, [0, 4, 3]);
		JSM.AddPolygonToBody (result, [0, 5, 2]);
		JSM.AddPolygonToBody (result, [1, 2, 5]);
		JSM.AddPolygonToBody (result, [1, 3, 4]);
		JSM.AddPolygonToBody (result, [1, 4, 2]);
		JSM.AddPolygonToBody (result, [1, 5, 3]);

		return result;
	};

	/**
	* Function: GenerateDodecahedron
	* Description: Generates a dodecahedron.
	* Returns:
	*	{Body} the result
	*/
	JSM.GenerateDodecahedron = function ()
	{
		var result = new JSM.Body ();

		var a = 1.0;
		var b = 0.0;
		var c = (1.0 + Math.sqrt (5.0)) / 2.0;
		var d = 1.0 / c;

		JSM.AddVertexToBody (result, +a, +a, +a);
		JSM.AddVertexToBody (result, +a, +a, -a);
		JSM.AddVertexToBody (result, +a, -a, +a);
		JSM.AddVertexToBody (result, -a, +a, +a);
		
		JSM.AddVertexToBody (result, +a, -a, -a);
		JSM.AddVertexToBody (result, -a, +a, -a);
		JSM.AddVertexToBody (result, -a, -a, +a);
		JSM.AddVertexToBody (result, -a, -a, -a);

		JSM.AddVertexToBody (result, +b, +d, +c);
		JSM.AddVertexToBody (result, +b, +d, -c);
		JSM.AddVertexToBody (result, +b, -d, +c);
		JSM.AddVertexToBody (result, +b, -d, -c);

		JSM.AddVertexToBody (result, +d, +c, +b);
		JSM.AddVertexToBody (result, +d, -c, +b);
		JSM.AddVertexToBody (result, -d, +c, +b);
		JSM.AddVertexToBody (result, -d, -c, +b);

		JSM.AddVertexToBody (result, +c, +b, +d);
		JSM.AddVertexToBody (result, -c, +b, +d);
		JSM.AddVertexToBody (result, +c, +b, -d);
		JSM.AddVertexToBody (result, -c, +b, -d);

		JSM.AddPolygonToBody (result, [0, 8, 10, 2, 16]);
		JSM.AddPolygonToBody (result, [0, 16, 18, 1, 12]);
		JSM.AddPolygonToBody (result, [0, 12, 14, 3, 8]);
		JSM.AddPolygonToBody (result, [1, 9, 5, 14, 12]);
		JSM.AddPolygonToBody (result, [1, 18, 4, 11, 9]);
		JSM.AddPolygonToBody (result, [2, 10, 6, 15, 13]);
		JSM.AddPolygonToBody (result, [2, 13, 4, 18, 16]);
		JSM.AddPolygonToBody (result, [3, 14, 5, 19, 17]);
		JSM.AddPolygonToBody (result, [3, 17, 6, 10, 8]);
		JSM.AddPolygonToBody (result, [4, 13, 15, 7, 11]);
		JSM.AddPolygonToBody (result, [5, 9, 11, 7, 19]);
		JSM.AddPolygonToBody (result, [6, 17, 19, 7, 15]);

		return result;
	};

	/**
	* Function: GenerateIcosahedron
	* Description: Generates an icosahedron.
	* Returns:
	*	{Body} the result
	*/
	JSM.GenerateIcosahedron = function ()
	{
		var result = new JSM.Body ();

		var a = 1.0;
		var b = 0.0;
		var c = (1.0 + Math.sqrt (5.0)) / 2.0;

		JSM.AddVertexToBody (result, +b, +a, +c);
		JSM.AddVertexToBody (result, +b, +a, -c);
		JSM.AddVertexToBody (result, +b, -a, +c);
		JSM.AddVertexToBody (result, +b, -a, -c);

		JSM.AddVertexToBody (result, +a, +c, +b);
		JSM.AddVertexToBody (result, +a, -c, +b);
		JSM.AddVertexToBody (result, -a, +c, +b);
		JSM.AddVertexToBody (result, -a, -c, +b);

		JSM.AddVertexToBody (result, +c, +b, +a);
		JSM.AddVertexToBody (result, +c, +b, -a);
		JSM.AddVertexToBody (result, -c, +b, +a);
		JSM.AddVertexToBody (result, -c, +b, -a);

		JSM.AddPolygonToBody (result, [0, 2, 8]);
		JSM.AddPolygonToBody (result, [0, 4, 6]);
		JSM.AddPolygonToBody (result, [0, 6, 10]);
		JSM.AddPolygonToBody (result, [0, 8, 4]);
		JSM.AddPolygonToBody (result, [0, 10, 2]);
		JSM.AddPolygonToBody (result, [1, 3, 11]);
		JSM.AddPolygonToBody (result, [1, 4, 9]);
		JSM.AddPolygonToBody (result, [1, 6, 4]);
		JSM.AddPolygonToBody (result, [1, 9, 3]);
		JSM.AddPolygonToBody (result, [1, 11, 6]);
		JSM.AddPolygonToBody (result, [2, 5, 8]);
		JSM.AddPolygonToBody (result, [2, 7, 5]);
		JSM.AddPolygonToBody (result, [2, 10, 7]);
		JSM.AddPolygonToBody (result, [3, 5, 7]);
		JSM.AddPolygonToBody (result, [3, 7, 11]);
		JSM.AddPolygonToBody (result, [3, 9, 5]);
		JSM.AddPolygonToBody (result, [4, 8, 9]);
		JSM.AddPolygonToBody (result, [5, 9, 8]);
		JSM.AddPolygonToBody (result, [6, 11, 10]);
		JSM.AddPolygonToBody (result, [7, 10, 11]);

		return result;
	};

	/**
	* Function: GenerateTruncatedTetrahedron
	* Description: Generates a truncated tetrahedron.
	* Returns:
	*	{Body} the result
	*/
	JSM.GenerateTruncatedTetrahedron = function ()
	{
		var result = new JSM.Body ();

		var a = 1.0;
		var b = 3.0;

		JSM.AddVertexToBody (result, +a, +a, +b);
		JSM.AddVertexToBody (result, +a, -a, -b);
		JSM.AddVertexToBody (result, -a, -a, +b);
		JSM.AddVertexToBody (result, -a, +a, -b);

		JSM.AddVertexToBody (result, +a, +b, +a);
		JSM.AddVertexToBody (result, +a, -b, -a);
		JSM.AddVertexToBody (result, -a, -b, +a);
		JSM.AddVertexToBody (result, -a, +b, -a);

		JSM.AddVertexToBody (result, +b, +a, +a);
		JSM.AddVertexToBody (result, +b, -a, -a);
		JSM.AddVertexToBody (result, -b, -a, +a);
		JSM.AddVertexToBody (result, -b, +a, -a);

		JSM.AddPolygonToBody (result, [0, 8, 4]);
		JSM.AddPolygonToBody (result, [1, 9, 5]);
		JSM.AddPolygonToBody (result, [2, 10, 6]);
		JSM.AddPolygonToBody (result, [3, 11, 7]);

		JSM.AddPolygonToBody (result, [0, 2, 6, 5, 9, 8]);
		JSM.AddPolygonToBody (result, [0, 4, 7, 11, 10, 2]);
		JSM.AddPolygonToBody (result, [1, 3, 7, 4, 8, 9]);
		JSM.AddPolygonToBody (result, [1, 5, 6, 10, 11, 3]);

		return result;
	};

	/**
	* Function: GenerateCuboctahedron
	* Description: Generates a cuboctahedron.
	* Returns:
	*	{Body} the result
	*/
	JSM.GenerateCuboctahedron = function ()
	{
		var result = new JSM.Body ();

		var a = 1.0;
		var b = 0.0;

		JSM.AddVertexToBody (result, +a, +a, +b);
		JSM.AddVertexToBody (result, +a, -a, +b);
		JSM.AddVertexToBody (result, -a, -a, +b);
		JSM.AddVertexToBody (result, -a, +a, +b);

		JSM.AddVertexToBody (result, +a, +b, +a);
		JSM.AddVertexToBody (result, +a, +b, -a);
		JSM.AddVertexToBody (result, -a, +b, +a);
		JSM.AddVertexToBody (result, -a, +b, -a);

		JSM.AddVertexToBody (result, +b, +a, +a);
		JSM.AddVertexToBody (result, +b, -a, -a);
		JSM.AddVertexToBody (result, +b, -a, +a);
		JSM.AddVertexToBody (result, +b, +a, -a);

		JSM.AddPolygonToBody (result, [0, 5, 11]);
		JSM.AddPolygonToBody (result, [0, 8, 4]);
		JSM.AddPolygonToBody (result, [1, 4, 10]);
		JSM.AddPolygonToBody (result, [1, 9, 5]);
		JSM.AddPolygonToBody (result, [2, 7, 9]);
		JSM.AddPolygonToBody (result, [2, 10, 6]);
		JSM.AddPolygonToBody (result, [3, 6, 8]);
		JSM.AddPolygonToBody (result, [3, 11, 7]);

		JSM.AddPolygonToBody (result, [0, 4, 1, 5]);
		JSM.AddPolygonToBody (result, [0, 11, 3, 8]);
		JSM.AddPolygonToBody (result, [1, 10, 2, 9]);
		JSM.AddPolygonToBody (result, [2, 6, 3, 7]);
		JSM.AddPolygonToBody (result, [4, 8, 6, 10]);
		JSM.AddPolygonToBody (result, [5, 9, 7, 11]);

		return result;
	};

	/**
	* Function: GenerateTruncatedCube
	* Description: Generates a truncated cube.
	* Returns:
	*	{Body} the result
	*/
	JSM.GenerateTruncatedCube = function ()
	{
		var result = new JSM.Body ();

		var a = 1.0;
		var b = Math.sqrt (2.0) - 1.0;

		JSM.AddVertexToBody (result, +a, +a, +b);
		JSM.AddVertexToBody (result, +a, +a, -b);
		JSM.AddVertexToBody (result, +a, -a, +b);
		JSM.AddVertexToBody (result, -a, +a, +b);
		JSM.AddVertexToBody (result, +a, -a, -b);
		JSM.AddVertexToBody (result, -a, +a, -b);
		JSM.AddVertexToBody (result, -a, -a, +b);
		JSM.AddVertexToBody (result, -a, -a, -b);

		JSM.AddVertexToBody (result, +a, +b, +a);
		JSM.AddVertexToBody (result, +a, +b, -a);
		JSM.AddVertexToBody (result, +a, -b, +a);
		JSM.AddVertexToBody (result, -a, +b, +a);
		JSM.AddVertexToBody (result, +a, -b, -a);
		JSM.AddVertexToBody (result, -a, +b, -a);
		JSM.AddVertexToBody (result, -a, -b, +a);
		JSM.AddVertexToBody (result, -a, -b, -a);

		JSM.AddVertexToBody (result, +b, +a, +a);
		JSM.AddVertexToBody (result, +b, +a, -a);
		JSM.AddVertexToBody (result, +b, -a, +a);
		JSM.AddVertexToBody (result, -b, +a, +a);
		JSM.AddVertexToBody (result, +b, -a, -a);
		JSM.AddVertexToBody (result, -b, +a, -a);
		JSM.AddVertexToBody (result, -b, -a, +a);
		JSM.AddVertexToBody (result, -b, -a, -a);

		JSM.AddPolygonToBody (result, [0, 16, 8]);
		JSM.AddPolygonToBody (result, [1, 9, 17]);
		JSM.AddPolygonToBody (result, [2, 10, 18]);
		JSM.AddPolygonToBody (result, [3, 11, 19]);
		JSM.AddPolygonToBody (result, [4, 20, 12]);
		JSM.AddPolygonToBody (result, [5, 21, 13]);
		JSM.AddPolygonToBody (result, [6, 22, 14]);
		JSM.AddPolygonToBody (result, [7, 15, 23]);

		JSM.AddPolygonToBody (result, [0, 1, 17, 21, 5, 3, 19, 16]);
		JSM.AddPolygonToBody (result, [0, 8, 10, 2, 4, 12, 9, 1]);
		JSM.AddPolygonToBody (result, [2, 18, 22, 6, 7, 23, 20, 4]);
		JSM.AddPolygonToBody (result, [3, 5, 13, 15, 7, 6, 14, 11]);
		JSM.AddPolygonToBody (result, [8, 16, 19, 11, 14, 22, 18, 10]);
		JSM.AddPolygonToBody (result, [9, 12, 20, 23, 15, 13, 21, 17]);

		return result;
	};

	/**
	* Function: GenerateTruncatedOctahedron
	* Description: Generates a truncated octahedron.
	* Returns:
	*	{Body} the result
	*/
	JSM.GenerateTruncatedOctahedron = function ()
	{
		var result = new JSM.Body ();

		var a = 1.0;
		var b = 0.0;
		var c = 2.0;

		JSM.AddVertexToBody (result, +b, +a, +c);
		JSM.AddVertexToBody (result, +b, +a, -c);
		JSM.AddVertexToBody (result, +b, -a, +c);
		JSM.AddVertexToBody (result, +b, -a, -c);

		JSM.AddVertexToBody (result, +b, +c, +a);
		JSM.AddVertexToBody (result, +b, -c, +a);
		JSM.AddVertexToBody (result, +b, +c, -a);
		JSM.AddVertexToBody (result, +b, -c, -a);

		JSM.AddVertexToBody (result, +a, +b, +c);
		JSM.AddVertexToBody (result, +a, +b, -c);
		JSM.AddVertexToBody (result, -a, +b, +c);
		JSM.AddVertexToBody (result, -a, +b, -c);

		JSM.AddVertexToBody (result, +a, +c, +b);
		JSM.AddVertexToBody (result, +a, -c, +b);
		JSM.AddVertexToBody (result, -a, +c, +b);
		JSM.AddVertexToBody (result, -a, -c, +b);

		JSM.AddVertexToBody (result, +c, +b, +a);
		JSM.AddVertexToBody (result, -c, +b, +a);
		JSM.AddVertexToBody (result, +c, +b, -a);
		JSM.AddVertexToBody (result, -c, +b, -a);

		JSM.AddVertexToBody (result, +c, +a, +b);
		JSM.AddVertexToBody (result, -c, +a, +b);
		JSM.AddVertexToBody (result, +c, -a, +b);
		JSM.AddVertexToBody (result, -c, -a, +b);

		JSM.AddPolygonToBody (result, [0, 10, 2, 8]);
		JSM.AddPolygonToBody (result, [1, 9, 3, 11]);
		JSM.AddPolygonToBody (result, [4, 12, 6, 14]);
		JSM.AddPolygonToBody (result, [5, 15, 7, 13]);
		JSM.AddPolygonToBody (result, [16, 22, 18, 20]);
		JSM.AddPolygonToBody (result, [17, 21, 19, 23]);

		JSM.AddPolygonToBody (result, [0, 4, 14, 21, 17, 10]);
		JSM.AddPolygonToBody (result, [0, 8, 16, 20, 12, 4]);
		JSM.AddPolygonToBody (result, [1, 6, 12, 20, 18, 9]);
		JSM.AddPolygonToBody (result, [1, 11, 19, 21, 14, 6]);
		JSM.AddPolygonToBody (result, [2, 5, 13, 22, 16, 8]);
		JSM.AddPolygonToBody (result, [2, 10, 17, 23, 15, 5]);
		JSM.AddPolygonToBody (result, [3, 7, 15, 23, 19, 11]);
		JSM.AddPolygonToBody (result, [3, 9, 18, 22, 13, 7]);

		return result;
	};

	/**
	* Function: GenerateRhombicuboctahedron
	* Description: Generates a rhombicuboctahedron.
	* Returns:
	*	{Body} the result
	*/
	JSM.GenerateRhombicuboctahedron = function ()
	{
		var result = new JSM.Body ();

		var a = 1.0;
		var b = 1.0 + Math.sqrt (2.0);

		JSM.AddVertexToBody (result, +a, +a, +b);
		JSM.AddVertexToBody (result, +a, +a, -b);
		JSM.AddVertexToBody (result, +a, -a, +b);
		JSM.AddVertexToBody (result, -a, +a, +b);
		JSM.AddVertexToBody (result, +a, -a, -b);
		JSM.AddVertexToBody (result, -a, +a, -b);
		JSM.AddVertexToBody (result, -a, -a, +b);
		JSM.AddVertexToBody (result, -a, -a, -b);

		JSM.AddVertexToBody (result, +a, +b, +a);
		JSM.AddVertexToBody (result, +a, +b, -a);
		JSM.AddVertexToBody (result, +a, -b, +a);
		JSM.AddVertexToBody (result, -a, +b, +a);
		JSM.AddVertexToBody (result, +a, -b, -a);
		JSM.AddVertexToBody (result, -a, +b, -a);
		JSM.AddVertexToBody (result, -a, -b, +a);
		JSM.AddVertexToBody (result, -a, -b, -a);

		JSM.AddVertexToBody (result, +b, +a, +a);
		JSM.AddVertexToBody (result, +b, +a, -a);
		JSM.AddVertexToBody (result, +b, -a, +a);
		JSM.AddVertexToBody (result, -b, +a, +a);
		JSM.AddVertexToBody (result, +b, -a, -a);
		JSM.AddVertexToBody (result, -b, +a, -a);
		JSM.AddVertexToBody (result, -b, -a, +a);
		JSM.AddVertexToBody (result, -b, -a, -a);

		JSM.AddPolygonToBody (result, [0, 16, 8]);
		JSM.AddPolygonToBody (result, [1, 9, 17]);
		JSM.AddPolygonToBody (result, [2, 10, 18]);
		JSM.AddPolygonToBody (result, [3, 11, 19]);
		JSM.AddPolygonToBody (result, [4, 20, 12]);
		JSM.AddPolygonToBody (result, [5, 21, 13]);
		JSM.AddPolygonToBody (result, [6, 22, 14]);
		JSM.AddPolygonToBody (result, [7, 15, 23]);

		JSM.AddPolygonToBody (result, [0, 2, 18, 16]);
		JSM.AddPolygonToBody (result, [0, 3, 6, 2]);
		JSM.AddPolygonToBody (result, [0, 8, 11, 3]);
		JSM.AddPolygonToBody (result, [1, 4, 7, 5]);
		JSM.AddPolygonToBody (result, [1, 5, 13, 9]);
		JSM.AddPolygonToBody (result, [1, 17, 20, 4]);
		JSM.AddPolygonToBody (result, [2, 6, 14, 10]);
		JSM.AddPolygonToBody (result, [3, 19, 22, 6]);
		JSM.AddPolygonToBody (result, [4, 12, 15, 7]);
		JSM.AddPolygonToBody (result, [5, 7, 23, 21]);
		JSM.AddPolygonToBody (result, [8, 9, 13, 11]);
		JSM.AddPolygonToBody (result, [8, 16, 17, 9]);
		JSM.AddPolygonToBody (result, [10, 12, 20, 18]);
		JSM.AddPolygonToBody (result, [10, 14, 15, 12]);
		JSM.AddPolygonToBody (result, [11, 13, 21, 19]);
		JSM.AddPolygonToBody (result, [14, 22, 23, 15]);
		JSM.AddPolygonToBody (result, [16, 18, 20, 17]);
		JSM.AddPolygonToBody (result, [19, 21, 23, 22]);

		return result;
	};

	/**
	* Function: GenerateTruncatedCuboctahedron
	* Description: Generates a truncated cuboctahedron.
	* Returns:
	*	{Body} the result
	*/
	JSM.GenerateTruncatedCuboctahedron = function ()
	{
		var result = new JSM.Body ();

		var a = 1.0;
		var b = 1.0 + Math.sqrt (2.0);
		var c = 1.0 + 2.0 * Math.sqrt (2.0);

		JSM.AddVertexToBody (result, +a, +b, +c);
		JSM.AddVertexToBody (result, +a, +b, -c);
		JSM.AddVertexToBody (result, +a, -b, +c);
		JSM.AddVertexToBody (result, -a, +b, +c);
		JSM.AddVertexToBody (result, +a, -b, -c);
		JSM.AddVertexToBody (result, -a, +b, -c);
		JSM.AddVertexToBody (result, -a, -b, +c);
		JSM.AddVertexToBody (result, -a, -b, -c);

		JSM.AddVertexToBody (result, +a, +c, +b);
		JSM.AddVertexToBody (result, +a, -c, +b);
		JSM.AddVertexToBody (result, +a, +c, -b);
		JSM.AddVertexToBody (result, -a, +c, +b);
		JSM.AddVertexToBody (result, +a, -c, -b);
		JSM.AddVertexToBody (result, -a, -c, +b);
		JSM.AddVertexToBody (result, -a, +c, -b);
		JSM.AddVertexToBody (result, -a, -c, -b);

		JSM.AddVertexToBody (result, +b, +a, +c);
		JSM.AddVertexToBody (result, +b, +a, -c);
		JSM.AddVertexToBody (result, -b, +a, +c);
		JSM.AddVertexToBody (result, +b, -a, +c);
		JSM.AddVertexToBody (result, -b, +a, -c);
		JSM.AddVertexToBody (result, +b, -a, -c);
		JSM.AddVertexToBody (result, -b, -a, +c);
		JSM.AddVertexToBody (result, -b, -a, -c);

		JSM.AddVertexToBody (result, +b, +c, +a);
		JSM.AddVertexToBody (result, +b, -c, +a);
		JSM.AddVertexToBody (result, -b, +c, +a);
		JSM.AddVertexToBody (result, +b, +c, -a);
		JSM.AddVertexToBody (result, -b, -c, +a);
		JSM.AddVertexToBody (result, +b, -c, -a);
		JSM.AddVertexToBody (result, -b, +c, -a);
		JSM.AddVertexToBody (result, -b, -c, -a);

		JSM.AddVertexToBody (result, +c, +a, +b);
		JSM.AddVertexToBody (result, -c, +a, +b);
		JSM.AddVertexToBody (result, +c, +a, -b);
		JSM.AddVertexToBody (result, +c, -a, +b);
		JSM.AddVertexToBody (result, -c, +a, -b);
		JSM.AddVertexToBody (result, -c, -a, +b);
		JSM.AddVertexToBody (result, +c, -a, -b);
		JSM.AddVertexToBody (result, -c, -a, -b);

		JSM.AddVertexToBody (result, +c, +b, +a);
		JSM.AddVertexToBody (result, -c, +b, +a);
		JSM.AddVertexToBody (result, +c, -b, +a);
		JSM.AddVertexToBody (result, +c, +b, -a);
		JSM.AddVertexToBody (result, -c, -b, +a);
		JSM.AddVertexToBody (result, -c, +b, -a);
		JSM.AddVertexToBody (result, +c, -b, -a);
		JSM.AddVertexToBody (result, -c, -b, -a);

		JSM.AddPolygonToBody (result, [0, 8, 11, 3]);
		JSM.AddPolygonToBody (result, [1, 5, 14, 10]);
		JSM.AddPolygonToBody (result, [2, 6, 13, 9]);
		JSM.AddPolygonToBody (result, [4, 12, 15, 7]);
		JSM.AddPolygonToBody (result, [16, 19, 35, 32]);
		JSM.AddPolygonToBody (result, [17, 34, 38, 21]);
		JSM.AddPolygonToBody (result, [18, 33, 37, 22]);
		JSM.AddPolygonToBody (result, [23, 39, 36, 20]);
		JSM.AddPolygonToBody (result, [24, 40, 43, 27]);
		JSM.AddPolygonToBody (result, [25, 29, 46, 42]);
		JSM.AddPolygonToBody (result, [26, 30, 45, 41]);
		JSM.AddPolygonToBody (result, [28, 44, 47, 31]);

		JSM.AddPolygonToBody (result, [0, 16, 32, 40, 24, 8]);
		JSM.AddPolygonToBody (result, [1, 10, 27, 43, 34, 17]);
		JSM.AddPolygonToBody (result, [2, 9, 25, 42, 35, 19]);
		JSM.AddPolygonToBody (result, [3, 11, 26, 41, 33, 18]);
		JSM.AddPolygonToBody (result, [4, 21, 38, 46, 29, 12]);
		JSM.AddPolygonToBody (result, [5, 20, 36, 45, 30, 14]);
		JSM.AddPolygonToBody (result, [6, 22, 37, 44, 28, 13]);
		JSM.AddPolygonToBody (result, [7, 15, 31, 47, 39, 23]);

		JSM.AddPolygonToBody (result, [0, 3, 18, 22, 6, 2, 19, 16]);
		JSM.AddPolygonToBody (result, [1, 17, 21, 4, 7, 23, 20, 5]);
		JSM.AddPolygonToBody (result, [8, 24, 27, 10, 14, 30, 26, 11]);
		JSM.AddPolygonToBody (result, [9, 13, 28, 31, 15, 12, 29, 25]);
		JSM.AddPolygonToBody (result, [32, 35, 42, 46, 38, 34, 43, 40]);
		JSM.AddPolygonToBody (result, [33, 41, 45, 36, 39, 47, 44, 37]);

		return result;
	};

	/**
	* Function: GenerateSnubCube
	* Description: Generates a snub cube.
	* Returns:
	*	{Body} the result
	*/
	JSM.GenerateSnubCube = function ()
	{
		var result = new JSM.Body ();

		var a = 1.0;
		var b = (1.0 / 3.0) * (Math.pow (17 + 3.0 * Math.sqrt (33.0), 1.0 / 3.0) - Math.pow (-17 + 3.0 * Math.sqrt (33.0), 1.0 / 3.0) - 1.0);
		var c = 1.0 / b;

		JSM.AddVertexToBody (result, +a, +b, -c);
		JSM.AddVertexToBody (result, +a, -b, +c);
		JSM.AddVertexToBody (result, -a, +b, +c);
		JSM.AddVertexToBody (result, -a, -b, -c);

		JSM.AddVertexToBody (result, +b, -c, +a);
		JSM.AddVertexToBody (result, -b, +c, +a);
		JSM.AddVertexToBody (result, +b, +c, -a);
		JSM.AddVertexToBody (result, -b, -c, -a);

		JSM.AddVertexToBody (result, -c, +a, +b);
		JSM.AddVertexToBody (result, +c, +a, -b);
		JSM.AddVertexToBody (result, +c, -a, +b);
		JSM.AddVertexToBody (result, -c, -a, -b);

		JSM.AddVertexToBody (result, +a, +c, +b);
		JSM.AddVertexToBody (result, +a, -c, -b);
		JSM.AddVertexToBody (result, -a, +c, -b);
		JSM.AddVertexToBody (result, -a, -c, +b);

		JSM.AddVertexToBody (result, +b, +a, +c);
		JSM.AddVertexToBody (result, -b, +a, -c);
		JSM.AddVertexToBody (result, -b, -a, +c);
		JSM.AddVertexToBody (result, +b, -a, -c);

		JSM.AddVertexToBody (result, +c, +b, +a);
		JSM.AddVertexToBody (result, -c, -b, +a);
		JSM.AddVertexToBody (result, +c, -b, -a);
		JSM.AddVertexToBody (result, -c, +b, -a);

		JSM.AddPolygonToBody (result, [0, 6, 9]);
		JSM.AddPolygonToBody (result, [0, 9, 22]);
		JSM.AddPolygonToBody (result, [0, 17, 6]);
		JSM.AddPolygonToBody (result, [0, 22, 19]);
		JSM.AddPolygonToBody (result, [1, 4, 10]);
		JSM.AddPolygonToBody (result, [1, 10, 20]);
		JSM.AddPolygonToBody (result, [1, 18, 4]);
		JSM.AddPolygonToBody (result, [1, 20, 16]);
		JSM.AddPolygonToBody (result, [2, 5, 8]);
		JSM.AddPolygonToBody (result, [2, 8, 21]);
		JSM.AddPolygonToBody (result, [2, 16, 5]);
		JSM.AddPolygonToBody (result, [2, 21, 18]);
		JSM.AddPolygonToBody (result, [3, 7, 11]);
		JSM.AddPolygonToBody (result, [3, 11, 23]);
		JSM.AddPolygonToBody (result, [3, 19, 7]);
		JSM.AddPolygonToBody (result, [3, 23, 17]);
		JSM.AddPolygonToBody (result, [4, 13, 10]);
		JSM.AddPolygonToBody (result, [4, 18, 15]);
		JSM.AddPolygonToBody (result, [5, 14, 8]);
		JSM.AddPolygonToBody (result, [5, 16, 12]);
		JSM.AddPolygonToBody (result, [6, 12, 9]);
		JSM.AddPolygonToBody (result, [6, 17, 14]);
		JSM.AddPolygonToBody (result, [7, 15, 11]);
		JSM.AddPolygonToBody (result, [7, 19, 13]);
		JSM.AddPolygonToBody (result, [8, 14, 23]);
		JSM.AddPolygonToBody (result, [9, 12, 20]);
		JSM.AddPolygonToBody (result, [10, 13, 22]);
		JSM.AddPolygonToBody (result, [11, 15, 21]);
		JSM.AddPolygonToBody (result, [12, 16, 20]);
		JSM.AddPolygonToBody (result, [13, 19, 22]);
		JSM.AddPolygonToBody (result, [14, 17, 23]);
		JSM.AddPolygonToBody (result, [15, 18, 21]);

		JSM.AddPolygonToBody (result, [0, 19, 3, 17]);
		JSM.AddPolygonToBody (result, [1, 16, 2, 18]);
		JSM.AddPolygonToBody (result, [4, 15, 7, 13]);
		JSM.AddPolygonToBody (result, [5, 12, 6, 14]);
		JSM.AddPolygonToBody (result, [8, 23, 11, 21]);
		JSM.AddPolygonToBody (result, [9, 20, 10, 22]);

		return result;
	};

	/**
	* Function: GenerateIcosidodecahedron
	* Description: Generates an icosidodecahedron.
	* Returns:
	*	{Body} the result
	*/
	JSM.GenerateIcosidodecahedron = function ()
	{
		var result = new JSM.Body ();

		var a = 0.0;
		var b = (1.0 + Math.sqrt (5.0)) / 2.0;
		var c = 1.0 / 2.0;
		var d = b / 2.0;
		var e = (1.0 + b) / 2.0;

		JSM.AddVertexToBody (result, +a, +a, +b);
		JSM.AddVertexToBody (result, +a, +a, -b);
		JSM.AddVertexToBody (result, +a, +b, +a);
		JSM.AddVertexToBody (result, +a, -b, +a);
		JSM.AddVertexToBody (result, +b, +a, +a);
		JSM.AddVertexToBody (result, -b, +a, +a);

		JSM.AddVertexToBody (result, +c, +d, +e);
		JSM.AddVertexToBody (result, +c, +d, -e);
		JSM.AddVertexToBody (result, +c, -d, +e);
		JSM.AddVertexToBody (result, -c, +d, +e);
		JSM.AddVertexToBody (result, +c, -d, -e);
		JSM.AddVertexToBody (result, -c, +d, -e);
		JSM.AddVertexToBody (result, -c, -d, +e);
		JSM.AddVertexToBody (result, -c, -d, -e);

		JSM.AddVertexToBody (result, +d, +e, +c);
		JSM.AddVertexToBody (result, +d, -e, +c);
		JSM.AddVertexToBody (result, -d, +e, +c);
		JSM.AddVertexToBody (result, +d, +e, -c);
		JSM.AddVertexToBody (result, -d, -e, +c);
		JSM.AddVertexToBody (result, +d, -e, -c);
		JSM.AddVertexToBody (result, -d, +e, -c);
		JSM.AddVertexToBody (result, -d, -e, -c);

		JSM.AddVertexToBody (result, +e, +c, +d);
		JSM.AddVertexToBody (result, -e, +c, +d);
		JSM.AddVertexToBody (result, +e, +c, -d);
		JSM.AddVertexToBody (result, +e, -c, +d);
		JSM.AddVertexToBody (result, -e, +c, -d);
		JSM.AddVertexToBody (result, -e, -c, +d);
		JSM.AddVertexToBody (result, +e, -c, -d);
		JSM.AddVertexToBody (result, -e, -c, -d);

		JSM.AddPolygonToBody (result, [0, 6, 9]);
		JSM.AddPolygonToBody (result, [0, 12, 8]);
		JSM.AddPolygonToBody (result, [1, 10, 13]);
		JSM.AddPolygonToBody (result, [1, 11, 7]);
		JSM.AddPolygonToBody (result, [2, 14, 17]);
		JSM.AddPolygonToBody (result, [2, 20, 16]);
		JSM.AddPolygonToBody (result, [3, 18, 21]);
		JSM.AddPolygonToBody (result, [3, 19, 15]);
		JSM.AddPolygonToBody (result, [4, 22, 25]);
		JSM.AddPolygonToBody (result, [4, 28, 24]);
		JSM.AddPolygonToBody (result, [5, 26, 29]);
		JSM.AddPolygonToBody (result, [5, 27, 23]);
		JSM.AddPolygonToBody (result, [6, 22, 14]);
		JSM.AddPolygonToBody (result, [7, 17, 24]);
		JSM.AddPolygonToBody (result, [8, 15, 25]);
		JSM.AddPolygonToBody (result, [9, 16, 23]);
		JSM.AddPolygonToBody (result, [10, 28, 19]);
		JSM.AddPolygonToBody (result, [11, 26, 20]);
		JSM.AddPolygonToBody (result, [12, 27, 18]);
		JSM.AddPolygonToBody (result, [13, 21, 29]);

		JSM.AddPolygonToBody (result, [0, 8, 25, 22, 6]);
		JSM.AddPolygonToBody (result, [0, 9, 23, 27, 12]);
		JSM.AddPolygonToBody (result, [1, 7, 24, 28, 10]);
		JSM.AddPolygonToBody (result, [1, 13, 29, 26, 11]);
		JSM.AddPolygonToBody (result, [2, 16, 9, 6, 14]);
		JSM.AddPolygonToBody (result, [2, 17, 7, 11, 20]);
		JSM.AddPolygonToBody (result, [3, 15, 8, 12, 18]);
		JSM.AddPolygonToBody (result, [3, 21, 13, 10, 19]);
		JSM.AddPolygonToBody (result, [4, 24, 17, 14, 22]);
		JSM.AddPolygonToBody (result, [4, 25, 15, 19, 28]);
		JSM.AddPolygonToBody (result, [5, 23, 16, 20, 26]);
		JSM.AddPolygonToBody (result, [5, 29, 21, 18, 27]);

		return result;
	};

	/**
	* Function: GenerateTruncatedDodecahedron
	* Description: Generates a truncated dodecahedron.
	* Returns:
	*	{Body} the result
	*/
	JSM.GenerateTruncatedDodecahedron = function ()
	{
		var result = new JSM.Body ();

		var a = 0.0;
		var b = 2.0;
		var c = (1.0 + Math.sqrt (5.0)) / 2.0;
		var d = 1.0 / c;
		var e = 2.0 + c;
		var f = 2.0 * c;
		var g = Math.pow (c, 2.0);

		JSM.AddVertexToBody (result, +a, +d, +e);
		JSM.AddVertexToBody (result, +a, +d, -e);
		JSM.AddVertexToBody (result, +a, -d, +e);
		JSM.AddVertexToBody (result, +a, -d, -e);

		JSM.AddVertexToBody (result, +e, +a, +d);
		JSM.AddVertexToBody (result, -e, +a, +d);
		JSM.AddVertexToBody (result, +e, +a, -d);
		JSM.AddVertexToBody (result, -e, +a, -d);

		JSM.AddVertexToBody (result, +d, +e, +a);
		JSM.AddVertexToBody (result, +d, -e, +a);
		JSM.AddVertexToBody (result, -d, +e, +a);
		JSM.AddVertexToBody (result, -d, -e, +a);

		JSM.AddVertexToBody (result, +d, +c, +f);
		JSM.AddVertexToBody (result, +d, +c, -f);
		JSM.AddVertexToBody (result, +d, -c, +f);
		JSM.AddVertexToBody (result, -d, +c, +f);
		JSM.AddVertexToBody (result, +d, -c, -f);
		JSM.AddVertexToBody (result, -d, +c, -f);
		JSM.AddVertexToBody (result, -d, -c, +f);
		JSM.AddVertexToBody (result, -d, -c, -f);

		JSM.AddVertexToBody (result, +f, +d, +c);
		JSM.AddVertexToBody (result, +f, +d, -c);
		JSM.AddVertexToBody (result, +f, -d, +c);
		JSM.AddVertexToBody (result, -f, +d, +c);
		JSM.AddVertexToBody (result, +f, -d, -c);
		JSM.AddVertexToBody (result, -f, +d, -c);
		JSM.AddVertexToBody (result, -f, -d, +c);
		JSM.AddVertexToBody (result, -f, -d, -c);

		JSM.AddVertexToBody (result, +c, +f, +d);
		JSM.AddVertexToBody (result, +c, +f, -d);
		JSM.AddVertexToBody (result, +c, -f, +d);
		JSM.AddVertexToBody (result, -c, +f, +d);
		JSM.AddVertexToBody (result, +c, -f, -d);
		JSM.AddVertexToBody (result, -c, +f, -d);
		JSM.AddVertexToBody (result, -c, -f, +d);
		JSM.AddVertexToBody (result, -c, -f, -d);

		JSM.AddVertexToBody (result, +c, +b, +g);
		JSM.AddVertexToBody (result, +c, +b, -g);
		JSM.AddVertexToBody (result, +c, -b, +g);
		JSM.AddVertexToBody (result, -c, +b, +g);
		JSM.AddVertexToBody (result, +c, -b, -g);
		JSM.AddVertexToBody (result, -c, +b, -g);
		JSM.AddVertexToBody (result, -c, -b, +g);
		JSM.AddVertexToBody (result, -c, -b, -g);

		JSM.AddVertexToBody (result, +g, +c, +b);
		JSM.AddVertexToBody (result, +g, +c, -b);
		JSM.AddVertexToBody (result, +g, -c, +b);
		JSM.AddVertexToBody (result, -g, +c, +b);
		JSM.AddVertexToBody (result, +g, -c, -b);
		JSM.AddVertexToBody (result, -g, +c, -b);
		JSM.AddVertexToBody (result, -g, -c, +b);
		JSM.AddVertexToBody (result, -g, -c, -b);

		JSM.AddVertexToBody (result, +b, +g, +c);
		JSM.AddVertexToBody (result, +b, +g, -c);
		JSM.AddVertexToBody (result, +b, -g, +c);
		JSM.AddVertexToBody (result, -b, +g, +c);
		JSM.AddVertexToBody (result, +b, -g, -c);
		JSM.AddVertexToBody (result, -b, +g, -c);
		JSM.AddVertexToBody (result, -b, -g, +c);
		JSM.AddVertexToBody (result, -b, -g, -c);

		JSM.AddPolygonToBody (result, [0, 12, 15]);
		JSM.AddPolygonToBody (result, [1, 17, 13]);
		JSM.AddPolygonToBody (result, [2, 18, 14]);
		JSM.AddPolygonToBody (result, [3, 16, 19]);
		JSM.AddPolygonToBody (result, [4, 20, 22]);
		JSM.AddPolygonToBody (result, [5, 26, 23]);
		JSM.AddPolygonToBody (result, [6, 24, 21]);
		JSM.AddPolygonToBody (result, [7, 25, 27]);
		JSM.AddPolygonToBody (result, [8, 28, 29]);
		JSM.AddPolygonToBody (result, [9, 32, 30]);
		JSM.AddPolygonToBody (result, [10, 33, 31]);
		JSM.AddPolygonToBody (result, [11, 34, 35]);
		JSM.AddPolygonToBody (result, [36, 44, 52]);
		JSM.AddPolygonToBody (result, [37, 53, 45]);
		JSM.AddPolygonToBody (result, [38, 54, 46]);
		JSM.AddPolygonToBody (result, [39, 55, 47]);
		JSM.AddPolygonToBody (result, [40, 48, 56]);
		JSM.AddPolygonToBody (result, [41, 49, 57]);
		JSM.AddPolygonToBody (result, [42, 50, 58]);
		JSM.AddPolygonToBody (result, [43, 59, 51]);

		JSM.AddPolygonToBody (result, [0, 2, 14, 38, 46, 22, 20, 44, 36, 12]);
		JSM.AddPolygonToBody (result, [0, 15, 39, 47, 23, 26, 50, 42, 18, 2]);
		JSM.AddPolygonToBody (result, [1, 3, 19, 43, 51, 27, 25, 49, 41, 17]);
		JSM.AddPolygonToBody (result, [1, 13, 37, 45, 21, 24, 48, 40, 16, 3]);
		JSM.AddPolygonToBody (result, [4, 6, 21, 45, 53, 29, 28, 52, 44, 20]);
		JSM.AddPolygonToBody (result, [4, 22, 46, 54, 30, 32, 56, 48, 24, 6]);
		JSM.AddPolygonToBody (result, [5, 7, 27, 51, 59, 35, 34, 58, 50, 26]);
		JSM.AddPolygonToBody (result, [5, 23, 47, 55, 31, 33, 57, 49, 25, 7]);
		JSM.AddPolygonToBody (result, [8, 10, 31, 55, 39, 15, 12, 36, 52, 28]);
		JSM.AddPolygonToBody (result, [8, 29, 53, 37, 13, 17, 41, 57, 33, 10]);
		JSM.AddPolygonToBody (result, [9, 11, 35, 59, 43, 19, 16, 40, 56, 32]);
		JSM.AddPolygonToBody (result, [9, 30, 54, 38, 14, 18, 42, 58, 34, 11]);

		return result;
	};

	/**
	* Function: GenerateTruncatedIcosahedron
	* Description: Generates a truncated icosahedron.
	* Returns:
	*	{Body} the result
	*/
	JSM.GenerateTruncatedIcosahedron = function ()
	{
		var result = new JSM.Body ();

		var a = 0.0;
		var b = 1.0;
		var c = 2.0;
		var d = (1.0 + Math.sqrt (5.0)) / 2.0;
		var e = 3.0 * d;
		var f = 1.0 + 2.0 * d;
		var g = 2.0 + d;
		var h = 2.0 * d;

		JSM.AddVertexToBody (result, +a, +b, +e);
		JSM.AddVertexToBody (result, +a, +b, -e);
		JSM.AddVertexToBody (result, +a, -b, +e);
		JSM.AddVertexToBody (result, +a, -b, -e);

		JSM.AddVertexToBody (result, +b, +e, +a);
		JSM.AddVertexToBody (result, +b, -e, +a);
		JSM.AddVertexToBody (result, -b, +e, +a);
		JSM.AddVertexToBody (result, -b, -e, +a);

		JSM.AddVertexToBody (result, +e, +a, +b);
		JSM.AddVertexToBody (result, -e, +a, +b);
		JSM.AddVertexToBody (result, +e, +a, -b);
		JSM.AddVertexToBody (result, -e, +a, -b);

		JSM.AddVertexToBody (result, +c, +f, +d);
		JSM.AddVertexToBody (result, +c, +f, -d);
		JSM.AddVertexToBody (result, +c, -f, +d);
		JSM.AddVertexToBody (result, -c, +f, +d);
		JSM.AddVertexToBody (result, +c, -f, -d);
		JSM.AddVertexToBody (result, -c, +f, -d);
		JSM.AddVertexToBody (result, -c, -f, +d);
		JSM.AddVertexToBody (result, -c, -f, -d);

		JSM.AddVertexToBody (result, +f, +d, +c);
		JSM.AddVertexToBody (result, +f, -d, +c);
		JSM.AddVertexToBody (result, -f, +d, +c);
		JSM.AddVertexToBody (result, +f, +d, -c);
		JSM.AddVertexToBody (result, -f, -d, +c);
		JSM.AddVertexToBody (result, +f, -d, -c);
		JSM.AddVertexToBody (result, -f, +d, -c);
		JSM.AddVertexToBody (result, -f, -d, -c);

		JSM.AddVertexToBody (result, +d, +c, +f);
		JSM.AddVertexToBody (result, -d, +c, +f);
		JSM.AddVertexToBody (result, +d, +c, -f);
		JSM.AddVertexToBody (result, +d, -c, +f);
		JSM.AddVertexToBody (result, -d, +c, -f);
		JSM.AddVertexToBody (result, -d, -c, +f);
		JSM.AddVertexToBody (result, +d, -c, -f);
		JSM.AddVertexToBody (result, -d, -c, -f);

		JSM.AddVertexToBody (result, +b, +g, +h);
		JSM.AddVertexToBody (result, +b, +g, -h);
		JSM.AddVertexToBody (result, +b, -g, +h);
		JSM.AddVertexToBody (result, -b, +g, +h);
		JSM.AddVertexToBody (result, +b, -g, -h);
		JSM.AddVertexToBody (result, -b, +g, -h);
		JSM.AddVertexToBody (result, -b, -g, +h);
		JSM.AddVertexToBody (result, -b, -g, -h);

		JSM.AddVertexToBody (result, +g, +h, +b);
		JSM.AddVertexToBody (result, +g, -h, +b);
		JSM.AddVertexToBody (result, -g, +h, +b);
		JSM.AddVertexToBody (result, +g, +h, -b);
		JSM.AddVertexToBody (result, -g, -h, +b);
		JSM.AddVertexToBody (result, +g, -h, -b);
		JSM.AddVertexToBody (result, -g, +h, -b);
		JSM.AddVertexToBody (result, -g, -h, -b);

		JSM.AddVertexToBody (result, +h, +b, +g);
		JSM.AddVertexToBody (result, -h, +b, +g);
		JSM.AddVertexToBody (result, +h, +b, -g);
		JSM.AddVertexToBody (result, +h, -b, +g);
		JSM.AddVertexToBody (result, -h, +b, -g);
		JSM.AddVertexToBody (result, -h, -b, +g);
		JSM.AddVertexToBody (result, +h, -b, -g);
		JSM.AddVertexToBody (result, -h, -b, -g);

		JSM.AddPolygonToBody (result, [0, 28, 36, 39, 29]);
		JSM.AddPolygonToBody (result, [1, 32, 41, 37, 30]);
		JSM.AddPolygonToBody (result, [2, 33, 42, 38, 31]);
		JSM.AddPolygonToBody (result, [3, 34, 40, 43, 35]);
		JSM.AddPolygonToBody (result, [4, 12, 44, 47, 13]);
		JSM.AddPolygonToBody (result, [5, 16, 49, 45, 14]);
		JSM.AddPolygonToBody (result, [6, 17, 50, 46, 15]);
		JSM.AddPolygonToBody (result, [7, 18, 48, 51, 19]);
		JSM.AddPolygonToBody (result, [8, 20, 52, 55, 21]);
		JSM.AddPolygonToBody (result, [9, 24, 57, 53, 22]);
		JSM.AddPolygonToBody (result, [10, 25, 58, 54, 23]);
		JSM.AddPolygonToBody (result, [11, 26, 56, 59, 27]);

		JSM.AddPolygonToBody (result, [0, 2, 31, 55, 52, 28]);
		JSM.AddPolygonToBody (result, [0, 29, 53, 57, 33, 2]);
		JSM.AddPolygonToBody (result, [1, 3, 35, 59, 56, 32]);
		JSM.AddPolygonToBody (result, [1, 30, 54, 58, 34, 3]);
		JSM.AddPolygonToBody (result, [4, 6, 15, 39, 36, 12]);
		JSM.AddPolygonToBody (result, [4, 13, 37, 41, 17, 6]);
		JSM.AddPolygonToBody (result, [5, 7, 19, 43, 40, 16]);
		JSM.AddPolygonToBody (result, [5, 14, 38, 42, 18, 7]);
		JSM.AddPolygonToBody (result, [8, 10, 23, 47, 44, 20]);
		JSM.AddPolygonToBody (result, [8, 21, 45, 49, 25, 10]);
		JSM.AddPolygonToBody (result, [9, 11, 27, 51, 48, 24]);
		JSM.AddPolygonToBody (result, [9, 22, 46, 50, 26, 11]);
		JSM.AddPolygonToBody (result, [12, 36, 28, 52, 20, 44]);
		JSM.AddPolygonToBody (result, [13, 47, 23, 54, 30, 37]);
		JSM.AddPolygonToBody (result, [14, 45, 21, 55, 31, 38]);
		JSM.AddPolygonToBody (result, [15, 46, 22, 53, 29, 39]);
		JSM.AddPolygonToBody (result, [16, 40, 34, 58, 25, 49]);
		JSM.AddPolygonToBody (result, [17, 41, 32, 56, 26, 50]);
		JSM.AddPolygonToBody (result, [18, 42, 33, 57, 24, 48]);
		JSM.AddPolygonToBody (result, [19, 51, 27, 59, 35, 43]);

		return result;
	};

	/**
	* Function: GenerateRhombicosidodecahedron
	* Description: Generates a rhombicosidodecahedron.
	* Returns:
	*	{Body} the result
	*/
	JSM.GenerateRhombicosidodecahedron = function ()
	{
		var result = new JSM.Body ();

		var a = 0.0;
		var b = 1.0;
		var c = (1.0 + Math.sqrt (5.0)) / 2.0;
		var d = Math.pow (c, 2.0);
		var e = Math.pow (c, 3.0);
		var f = 2.0 * c;
		var g = 2.0 + c;

		JSM.AddVertexToBody (result, +b, +b, +e);
		JSM.AddVertexToBody (result, +b, +b, -e);
		JSM.AddVertexToBody (result, +b, -b, +e);
		JSM.AddVertexToBody (result, -b, +b, +e);
		JSM.AddVertexToBody (result, +b, -b, -e);
		JSM.AddVertexToBody (result, -b, +b, -e);
		JSM.AddVertexToBody (result, -b, -b, +e);
		JSM.AddVertexToBody (result, -b, -b, -e);

		JSM.AddVertexToBody (result, +e, +b, +b);
		JSM.AddVertexToBody (result, +e, +b, -b);
		JSM.AddVertexToBody (result, +e, -b, +b);
		JSM.AddVertexToBody (result, -e, +b, +b);
		JSM.AddVertexToBody (result, +e, -b, -b);
		JSM.AddVertexToBody (result, -e, +b, -b);
		JSM.AddVertexToBody (result, -e, -b, +b);
		JSM.AddVertexToBody (result, -e, -b, -b);

		JSM.AddVertexToBody (result, +b, +e, +b);
		JSM.AddVertexToBody (result, +b, +e, -b);
		JSM.AddVertexToBody (result, +b, -e, +b);
		JSM.AddVertexToBody (result, -b, +e, +b);
		JSM.AddVertexToBody (result, +b, -e, -b);
		JSM.AddVertexToBody (result, -b, +e, -b);
		JSM.AddVertexToBody (result, -b, -e, +b);
		JSM.AddVertexToBody (result, -b, -e, -b);

		JSM.AddVertexToBody (result, +d, +c, +f);
		JSM.AddVertexToBody (result, +d, +c, -f);
		JSM.AddVertexToBody (result, +d, -c, +f);
		JSM.AddVertexToBody (result, -d, +c, +f);
		JSM.AddVertexToBody (result, +d, -c, -f);
		JSM.AddVertexToBody (result, -d, +c, -f);
		JSM.AddVertexToBody (result, -d, -c, +f);
		JSM.AddVertexToBody (result, -d, -c, -f);

		JSM.AddVertexToBody (result, +f, +d, +c);
		JSM.AddVertexToBody (result, +f, +d, -c);
		JSM.AddVertexToBody (result, +f, -d, +c);
		JSM.AddVertexToBody (result, -f, +d, +c);
		JSM.AddVertexToBody (result, +f, -d, -c);
		JSM.AddVertexToBody (result, -f, +d, -c);
		JSM.AddVertexToBody (result, -f, -d, +c);
		JSM.AddVertexToBody (result, -f, -d, -c);

		JSM.AddVertexToBody (result, +c, +f, +d);
		JSM.AddVertexToBody (result, +c, +f, -d);
		JSM.AddVertexToBody (result, +c, -f, +d);
		JSM.AddVertexToBody (result, -c, +f, +d);
		JSM.AddVertexToBody (result, +c, -f, -d);
		JSM.AddVertexToBody (result, -c, +f, -d);
		JSM.AddVertexToBody (result, -c, -f, +d);
		JSM.AddVertexToBody (result, -c, -f, -d);

		JSM.AddVertexToBody (result, +g, +a, +d);
		JSM.AddVertexToBody (result, +g, +a, -d);
		JSM.AddVertexToBody (result, -g, +a, +d);
		JSM.AddVertexToBody (result, -g, +a, -d);

		JSM.AddVertexToBody (result, +d, +g, +a);
		JSM.AddVertexToBody (result, -d, +g, +a);
		JSM.AddVertexToBody (result, +d, -g, +a);
		JSM.AddVertexToBody (result, -d, -g, +a);

		JSM.AddVertexToBody (result, +a, +d, +g);
		JSM.AddVertexToBody (result, +a, -d, +g);
		JSM.AddVertexToBody (result, +a, +d, -g);
		JSM.AddVertexToBody (result, +a, -d, -g);

		JSM.AddPolygonToBody (result, [0, 56, 3]);
		JSM.AddPolygonToBody (result, [1, 5, 58]);
		JSM.AddPolygonToBody (result, [2, 6, 57]);
		JSM.AddPolygonToBody (result, [4, 59, 7]);
		JSM.AddPolygonToBody (result, [8, 48, 10]);
		JSM.AddPolygonToBody (result, [9, 12, 49]);
		JSM.AddPolygonToBody (result, [11, 14, 50]);
		JSM.AddPolygonToBody (result, [13, 51, 15]);
		JSM.AddPolygonToBody (result, [16, 52, 17]);
		JSM.AddPolygonToBody (result, [18, 20, 54]);
		JSM.AddPolygonToBody (result, [19, 21, 53]);
		JSM.AddPolygonToBody (result, [22, 55, 23]);
		JSM.AddPolygonToBody (result, [24, 32, 40]);
		JSM.AddPolygonToBody (result, [25, 41, 33]);
		JSM.AddPolygonToBody (result, [26, 42, 34]);
		JSM.AddPolygonToBody (result, [27, 43, 35]);
		JSM.AddPolygonToBody (result, [28, 36, 44]);
		JSM.AddPolygonToBody (result, [29, 37, 45]);
		JSM.AddPolygonToBody (result, [30, 38, 46]);
		JSM.AddPolygonToBody (result, [31, 47, 39]);

		JSM.AddPolygonToBody (result, [0, 3, 6, 2]);
		JSM.AddPolygonToBody (result, [0, 24, 40, 56]);
		JSM.AddPolygonToBody (result, [1, 4, 7, 5]);
		JSM.AddPolygonToBody (result, [1, 58, 41, 25]);
		JSM.AddPolygonToBody (result, [2, 57, 42, 26]);
		JSM.AddPolygonToBody (result, [3, 56, 43, 27]);
		JSM.AddPolygonToBody (result, [4, 28, 44, 59]);
		JSM.AddPolygonToBody (result, [5, 29, 45, 58]);
		JSM.AddPolygonToBody (result, [6, 30, 46, 57]);
		JSM.AddPolygonToBody (result, [7, 59, 47, 31]);
		JSM.AddPolygonToBody (result, [8, 10, 12, 9]);
		JSM.AddPolygonToBody (result, [8, 32, 24, 48]);
		JSM.AddPolygonToBody (result, [9, 49, 25, 33]);
		JSM.AddPolygonToBody (result, [10, 48, 26, 34]);
		JSM.AddPolygonToBody (result, [11, 13, 15, 14]);
		JSM.AddPolygonToBody (result, [11, 50, 27, 35]);
		JSM.AddPolygonToBody (result, [12, 36, 28, 49]);
		JSM.AddPolygonToBody (result, [13, 37, 29, 51]);
		JSM.AddPolygonToBody (result, [14, 38, 30, 50]);
		JSM.AddPolygonToBody (result, [15, 51, 31, 39]);
		JSM.AddPolygonToBody (result, [16, 17, 21, 19]);
		JSM.AddPolygonToBody (result, [16, 40, 32, 52]);
		JSM.AddPolygonToBody (result, [17, 52, 33, 41]);
		JSM.AddPolygonToBody (result, [18, 22, 23, 20]);
		JSM.AddPolygonToBody (result, [18, 54, 34, 42]);
		JSM.AddPolygonToBody (result, [19, 53, 35, 43]);
		JSM.AddPolygonToBody (result, [20, 44, 36, 54]);
		JSM.AddPolygonToBody (result, [21, 45, 37, 53]);
		JSM.AddPolygonToBody (result, [22, 46, 38, 55]);
		JSM.AddPolygonToBody (result, [23, 55, 39, 47]);

		JSM.AddPolygonToBody (result, [0, 2, 26, 48, 24]);
		JSM.AddPolygonToBody (result, [1, 25, 49, 28, 4]);
		JSM.AddPolygonToBody (result, [3, 27, 50, 30, 6]);
		JSM.AddPolygonToBody (result, [5, 7, 31, 51, 29]);
		JSM.AddPolygonToBody (result, [8, 9, 33, 52, 32]);
		JSM.AddPolygonToBody (result, [10, 34, 54, 36, 12]);
		JSM.AddPolygonToBody (result, [11, 35, 53, 37, 13]);
		JSM.AddPolygonToBody (result, [14, 15, 39, 55, 38]);
		JSM.AddPolygonToBody (result, [16, 19, 43, 56, 40]);
		JSM.AddPolygonToBody (result, [17, 41, 58, 45, 21]);
		JSM.AddPolygonToBody (result, [18, 42, 57, 46, 22]);
		JSM.AddPolygonToBody (result, [20, 23, 47, 59, 44]);

		return result;
	};

	/**
	* Function: GenerateTruncatedIcosidodecahedron
	* Description: Generates a truncated icosidodecahedron.
	* Returns:
	*	{Body} the result
	*/
	JSM.GenerateTruncatedIcosidodecahedron = function ()
	{
		var result = new JSM.Body ();

		var a = 2.0;
		var b = (1.0 + Math.sqrt (5.0)) / 2.0;
		var c = 1.0 / b;
		var d = 3.0 + b;
		var e = 2.0 / b;
		var f = 1 + 2.0 * b;
		var g = Math.pow (b, 2.0);
		var h = -1.0 + 3.0 * b;
		var i = -1.0 + 2.0 * b;
		var j = 2.0 + b;
		var k = 3.0;
		var l = 2.0 * b;

		JSM.AddVertexToBody (result, +c, +c, +d);
		JSM.AddVertexToBody (result, +c, +c, -d);
		JSM.AddVertexToBody (result, +c, -c, +d);
		JSM.AddVertexToBody (result, -c, +c, +d);
		JSM.AddVertexToBody (result, +c, -c, -d);
		JSM.AddVertexToBody (result, -c, +c, -d);
		JSM.AddVertexToBody (result, -c, -c, +d);
		JSM.AddVertexToBody (result, -c, -c, -d);

		JSM.AddVertexToBody (result, +c, +d, +c);
		JSM.AddVertexToBody (result, +c, -d, +c);
		JSM.AddVertexToBody (result, -c, +d, +c);
		JSM.AddVertexToBody (result, +c, +d, -c);
		JSM.AddVertexToBody (result, -c, -d, +c);
		JSM.AddVertexToBody (result, +c, -d, -c);
		JSM.AddVertexToBody (result, -c, +d, -c);
		JSM.AddVertexToBody (result, -c, -d, -c);

		JSM.AddVertexToBody (result, +d, +c, +c);
		JSM.AddVertexToBody (result, -d, +c, +c);
		JSM.AddVertexToBody (result, +d, +c, -c);
		JSM.AddVertexToBody (result, +d, -c, +c);
		JSM.AddVertexToBody (result, -d, +c, -c);
		JSM.AddVertexToBody (result, -d, -c, +c);
		JSM.AddVertexToBody (result, +d, -c, -c);
		JSM.AddVertexToBody (result, -d, -c, -c);

		JSM.AddVertexToBody (result, +e, +b, +f);
		JSM.AddVertexToBody (result, +e, +b, -f);
		JSM.AddVertexToBody (result, +e, -b, +f);
		JSM.AddVertexToBody (result, -e, +b, +f);
		JSM.AddVertexToBody (result, +e, -b, -f);
		JSM.AddVertexToBody (result, -e, +b, -f);
		JSM.AddVertexToBody (result, -e, -b, +f);
		JSM.AddVertexToBody (result, -e, -b, -f);

		JSM.AddVertexToBody (result, +b, +f, +e);
		JSM.AddVertexToBody (result, +b, -f, +e);
		JSM.AddVertexToBody (result, -b, +f, +e);
		JSM.AddVertexToBody (result, +b, +f, -e);
		JSM.AddVertexToBody (result, -b, -f, +e);
		JSM.AddVertexToBody (result, +b, -f, -e);
		JSM.AddVertexToBody (result, -b, +f, -e);
		JSM.AddVertexToBody (result, -b, -f, -e);

		JSM.AddVertexToBody (result, +f, +e, +b);
		JSM.AddVertexToBody (result, -f, +e, +b);
		JSM.AddVertexToBody (result, +f, +e, -b);
		JSM.AddVertexToBody (result, +f, -e, +b);
		JSM.AddVertexToBody (result, -f, +e, -b);
		JSM.AddVertexToBody (result, -f, -e, +b);
		JSM.AddVertexToBody (result, +f, -e, -b);
		JSM.AddVertexToBody (result, -f, -e, -b);

		JSM.AddVertexToBody (result, +c, +g, +h);
		JSM.AddVertexToBody (result, +c, +g, -h);
		JSM.AddVertexToBody (result, +c, -g, +h);
		JSM.AddVertexToBody (result, -c, +g, +h);
		JSM.AddVertexToBody (result, +c, -g, -h);
		JSM.AddVertexToBody (result, -c, +g, -h);
		JSM.AddVertexToBody (result, -c, -g, +h);
		JSM.AddVertexToBody (result, -c, -g, -h);

		JSM.AddVertexToBody (result, +g, +h, +c);
		JSM.AddVertexToBody (result, +g, -h, +c);
		JSM.AddVertexToBody (result, -g, +h, +c);
		JSM.AddVertexToBody (result, +g, +h, -c);
		JSM.AddVertexToBody (result, -g, -h, +c);
		JSM.AddVertexToBody (result, +g, -h, -c);
		JSM.AddVertexToBody (result, -g, +h, -c);
		JSM.AddVertexToBody (result, -g, -h, -c);

		JSM.AddVertexToBody (result, +h, +c, +g);
		JSM.AddVertexToBody (result, -h, +c, +g);
		JSM.AddVertexToBody (result, +h, +c, -g);
		JSM.AddVertexToBody (result, +h, -c, +g);
		JSM.AddVertexToBody (result, -h, +c, -g);
		JSM.AddVertexToBody (result, -h, -c, +g);
		JSM.AddVertexToBody (result, +h, -c, -g);
		JSM.AddVertexToBody (result, -h, -c, -g);

		JSM.AddVertexToBody (result, +i, +a, +j);
		JSM.AddVertexToBody (result, +i, +a, -j);
		JSM.AddVertexToBody (result, +i, -a, +j);
		JSM.AddVertexToBody (result, -i, +a, +j);
		JSM.AddVertexToBody (result, +i, -a, -j);
		JSM.AddVertexToBody (result, -i, +a, -j);
		JSM.AddVertexToBody (result, -i, -a, +j);
		JSM.AddVertexToBody (result, -i, -a, -j);

		JSM.AddVertexToBody (result, +a, +j, +i);
		JSM.AddVertexToBody (result, +a, -j, +i);
		JSM.AddVertexToBody (result, -a, +j, +i);
		JSM.AddVertexToBody (result, +a, +j, -i);
		JSM.AddVertexToBody (result, -a, -j, +i);
		JSM.AddVertexToBody (result, +a, -j, -i);
		JSM.AddVertexToBody (result, -a, +j, -i);
		JSM.AddVertexToBody (result, -a, -j, -i);

		JSM.AddVertexToBody (result, +j, +i, +a);
		JSM.AddVertexToBody (result, -j, +i, +a);
		JSM.AddVertexToBody (result, +j, +i, -a);
		JSM.AddVertexToBody (result, +j, -i, +a);
		JSM.AddVertexToBody (result, -j, +i, -a);
		JSM.AddVertexToBody (result, -j, -i, +a);
		JSM.AddVertexToBody (result, +j, -i, -a);
		JSM.AddVertexToBody (result, -j, -i, -a);

		JSM.AddVertexToBody (result, +b, +k, +l);
		JSM.AddVertexToBody (result, +b, +k, -l);
		JSM.AddVertexToBody (result, +b, -k, +l);
		JSM.AddVertexToBody (result, -b, +k, +l);
		JSM.AddVertexToBody (result, +b, -k, -l);
		JSM.AddVertexToBody (result, -b, +k, -l);
		JSM.AddVertexToBody (result, -b, -k, +l);
		JSM.AddVertexToBody (result, -b, -k, -l);

		JSM.AddVertexToBody (result, +k, +l, +b);
		JSM.AddVertexToBody (result, +k, -l, +b);
		JSM.AddVertexToBody (result, -k, +l, +b);
		JSM.AddVertexToBody (result, +k, +l, -b);
		JSM.AddVertexToBody (result, -k, -l, +b);
		JSM.AddVertexToBody (result, +k, -l, -b);
		JSM.AddVertexToBody (result, -k, +l, -b);
		JSM.AddVertexToBody (result, -k, -l, -b);

		JSM.AddVertexToBody (result, +l, +b, +k);
		JSM.AddVertexToBody (result, -l, +b, +k);
		JSM.AddVertexToBody (result, +l, +b, -k);
		JSM.AddVertexToBody (result, +l, -b, +k);
		JSM.AddVertexToBody (result, -l, +b, -k);
		JSM.AddVertexToBody (result, -l, -b, +k);
		JSM.AddVertexToBody (result, +l, -b, -k);
		JSM.AddVertexToBody (result, -l, -b, -k);

		JSM.AddPolygonToBody (result, [0, 3, 6, 2]);
		JSM.AddPolygonToBody (result, [1, 4, 7, 5]);
		JSM.AddPolygonToBody (result, [8, 11, 14, 10]);
		JSM.AddPolygonToBody (result, [9, 12, 15, 13]);
		JSM.AddPolygonToBody (result, [16, 19, 22, 18]);
		JSM.AddPolygonToBody (result, [17, 20, 23, 21]);
		JSM.AddPolygonToBody (result, [24, 72, 96, 48]);
		JSM.AddPolygonToBody (result, [25, 49, 97, 73]);
		JSM.AddPolygonToBody (result, [26, 50, 98, 74]);
		JSM.AddPolygonToBody (result, [27, 51, 99, 75]);
		JSM.AddPolygonToBody (result, [28, 76, 100, 52]);
		JSM.AddPolygonToBody (result, [29, 77, 101, 53]);
		JSM.AddPolygonToBody (result, [30, 78, 102, 54]);
		JSM.AddPolygonToBody (result, [31, 55, 103, 79]);
		JSM.AddPolygonToBody (result, [32, 80, 104, 56]);
		JSM.AddPolygonToBody (result, [33, 57, 105, 81]);
		JSM.AddPolygonToBody (result, [34, 58, 106, 82]);
		JSM.AddPolygonToBody (result, [35, 59, 107, 83]);
		JSM.AddPolygonToBody (result, [36, 84, 108, 60]);
		JSM.AddPolygonToBody (result, [37, 85, 109, 61]);
		JSM.AddPolygonToBody (result, [38, 86, 110, 62]);
		JSM.AddPolygonToBody (result, [39, 63, 111, 87]);
		JSM.AddPolygonToBody (result, [40, 88, 112, 64]);
		JSM.AddPolygonToBody (result, [41, 65, 113, 89]);
		JSM.AddPolygonToBody (result, [42, 66, 114, 90]);
		JSM.AddPolygonToBody (result, [43, 67, 115, 91]);
		JSM.AddPolygonToBody (result, [44, 92, 116, 68]);
		JSM.AddPolygonToBody (result, [45, 93, 117, 69]);
		JSM.AddPolygonToBody (result, [46, 94, 118, 70]);
		JSM.AddPolygonToBody (result, [47, 71, 119, 95]);

		JSM.AddPolygonToBody (result, [0, 24, 48, 51, 27, 3]);
		JSM.AddPolygonToBody (result, [1, 5, 29, 53, 49, 25]);
		JSM.AddPolygonToBody (result, [2, 6, 30, 54, 50, 26]);
		JSM.AddPolygonToBody (result, [4, 28, 52, 55, 31, 7]);
		JSM.AddPolygonToBody (result, [8, 32, 56, 59, 35, 11]);
		JSM.AddPolygonToBody (result, [9, 13, 37, 61, 57, 33]);
		JSM.AddPolygonToBody (result, [10, 14, 38, 62, 58, 34]);
		JSM.AddPolygonToBody (result, [12, 36, 60, 63, 39, 15]);
		JSM.AddPolygonToBody (result, [16, 40, 64, 67, 43, 19]);
		JSM.AddPolygonToBody (result, [17, 21, 45, 69, 65, 41]);
		JSM.AddPolygonToBody (result, [18, 22, 46, 70, 66, 42]);
		JSM.AddPolygonToBody (result, [20, 44, 68, 71, 47, 23]);
		JSM.AddPolygonToBody (result, [72, 112, 88, 104, 80, 96]);
		JSM.AddPolygonToBody (result, [73, 97, 83, 107, 90, 114]);
		JSM.AddPolygonToBody (result, [74, 98, 81, 105, 91, 115]);
		JSM.AddPolygonToBody (result, [75, 99, 82, 106, 89, 113]);
		JSM.AddPolygonToBody (result, [76, 118, 94, 109, 85, 100]);
		JSM.AddPolygonToBody (result, [78, 117, 93, 108, 84, 102]);
		JSM.AddPolygonToBody (result, [79, 103, 87, 111, 95, 119]);
		JSM.AddPolygonToBody (result, [86, 101, 77, 116, 92, 110]);

		JSM.AddPolygonToBody (result, [0, 2, 26, 74, 115, 67, 64, 112, 72, 24]);
		JSM.AddPolygonToBody (result, [1, 25, 73, 114, 66, 70, 118, 76, 28, 4]);
		JSM.AddPolygonToBody (result, [3, 27, 75, 113, 65, 69, 117, 78, 30, 6]);
		JSM.AddPolygonToBody (result, [5, 7, 31, 79, 119, 71, 68, 116, 77, 29]);
		JSM.AddPolygonToBody (result, [8, 10, 34, 82, 99, 51, 48, 96, 80, 32]);
		JSM.AddPolygonToBody (result, [9, 33, 81, 98, 50, 54, 102, 84, 36, 12]);
		JSM.AddPolygonToBody (result, [11, 35, 83, 97, 49, 53, 101, 86, 38, 14]);
		JSM.AddPolygonToBody (result, [13, 15, 39, 87, 103, 55, 52, 100, 85, 37]);
		JSM.AddPolygonToBody (result, [16, 18, 42, 90, 107, 59, 56, 104, 88, 40]);
		JSM.AddPolygonToBody (result, [17, 41, 89, 106, 58, 62, 110, 92, 44, 20]);
		JSM.AddPolygonToBody (result, [19, 43, 91, 105, 57, 61, 109, 94, 46, 22]);
		JSM.AddPolygonToBody (result, [21, 23, 47, 95, 111, 63, 60, 108, 93, 45]);

		return result;
	};

	/**
	* Function: GenerateSnubDodecahedron
	* Description: Generates a snub dodecahedron.
	* Returns:
	*	{Body} the result
	*/
	JSM.GenerateSnubDodecahedron = function ()
	{
		var result = new JSM.Body ();

		var a = 2.0;
		var b = (1.0 + Math.sqrt (5.0)) / 2.0;
		var c = Math.pow (b / 2.0 + (1.0 / 2.0) * Math.sqrt (b - (5.0 / 27.0)), 1.0 / 3.0) + Math.pow (b / 2.0 - (1.0 / 2.0) * Math.sqrt (b - (5.0 / 27.0)), 1.0 / 3.0);
		var d = c - (1.0 / c);
		var e = c * b + Math.pow (b, 2.0) + b / c;
		var f = 2.0 * d;
		var g = 2.0 * e;
		var h = d + (e / b) + b;
		var i = -(d * b) + e + (1.0 / b);
		var j = (d / b) + (e * b) - 1.0;
		var k = -(d / b) + (e * b) + 1.0;
		var l = -d + (e / b) - b;
		var m = (d * b) + e - (1.0 / b);
		var n = -(d / b) + (e * b) - 1.0;
		var o = d - (e / b) - b;
		var p = (d * b) + e + (1.0 / b);
		var q = d + (e / b) - b;
		var r = (d * b) - e + (1.0 / b);
		var s = (d / b) + (e * b) + 1.0;

		JSM.AddVertexToBody (result, +f, +a, -g);
		JSM.AddVertexToBody (result, +f, -a, +g);
		JSM.AddVertexToBody (result, -f, +a, +g);
		JSM.AddVertexToBody (result, -f, -a, -g);

		JSM.AddVertexToBody (result, +a, -g, +f);
		JSM.AddVertexToBody (result, -a, +g, +f);
		JSM.AddVertexToBody (result, +a, +g, -f);
		JSM.AddVertexToBody (result, -a, -g, -f);

		JSM.AddVertexToBody (result, -g, +f, +a);
		JSM.AddVertexToBody (result, +g, +f, -a);
		JSM.AddVertexToBody (result, +g, -f, +a);
		JSM.AddVertexToBody (result, -g, -f, -a);

		JSM.AddVertexToBody (result, +h, +i, -j);
		JSM.AddVertexToBody (result, +h, -i, +j);
		JSM.AddVertexToBody (result, -h, +i, +j);
		JSM.AddVertexToBody (result, -h, -i, -j);

		JSM.AddVertexToBody (result, +i, -j, +h);
		JSM.AddVertexToBody (result, -i, +j, +h);
		JSM.AddVertexToBody (result, +i, +j, -h);
		JSM.AddVertexToBody (result, -i, -j, -h);

		JSM.AddVertexToBody (result, -j, +h, +i);
		JSM.AddVertexToBody (result, +j, +h, -i);
		JSM.AddVertexToBody (result, +j, -h, +i);
		JSM.AddVertexToBody (result, -j, -h, -i);

		JSM.AddVertexToBody (result, +k, +l, -m);
		JSM.AddVertexToBody (result, +k, -l, +m);
		JSM.AddVertexToBody (result, -k, +l, +m);
		JSM.AddVertexToBody (result, -k, -l, -m);

		JSM.AddVertexToBody (result, +l, -m, +k);
		JSM.AddVertexToBody (result, -l, +m, +k);
		JSM.AddVertexToBody (result, +l, +m, -k);
		JSM.AddVertexToBody (result, -l, -m, -k);

		JSM.AddVertexToBody (result, -m, +k, +l);
		JSM.AddVertexToBody (result, +m, +k, -l);
		JSM.AddVertexToBody (result, +m, -k, +l);
		JSM.AddVertexToBody (result, -m, -k, -l);

		JSM.AddVertexToBody (result, +n, +o, -p);
		JSM.AddVertexToBody (result, +n, -o, +p);
		JSM.AddVertexToBody (result, -n, +o, +p);
		JSM.AddVertexToBody (result, -n, -o, -p);

		JSM.AddVertexToBody (result, +o, -p, +n);
		JSM.AddVertexToBody (result, -o, +p, +n);
		JSM.AddVertexToBody (result, +o, +p, -n);
		JSM.AddVertexToBody (result, -o, -p, -n);

		JSM.AddVertexToBody (result, -p, +n, +o);
		JSM.AddVertexToBody (result, +p, +n, -o);
		JSM.AddVertexToBody (result, +p, -n, +o);
		JSM.AddVertexToBody (result, -p, -n, -o);

		JSM.AddVertexToBody (result, +q, +r, -s);
		JSM.AddVertexToBody (result, +q, -r, +s);
		JSM.AddVertexToBody (result, -q, +r, +s);
		JSM.AddVertexToBody (result, -q, -r, -s);

		JSM.AddVertexToBody (result, +r, -s, +q);
		JSM.AddVertexToBody (result, -r, +s, +q);
		JSM.AddVertexToBody (result, +r, +s, -q);
		JSM.AddVertexToBody (result, -r, -s, -q);

		JSM.AddVertexToBody (result, -s, +q, +r);
		JSM.AddVertexToBody (result, +s, +q, -r);
		JSM.AddVertexToBody (result, +s, -q, +r);
		JSM.AddVertexToBody (result, -s, -q, -r);

		JSM.AddPolygonToBody (result, [0, 3, 51]);
		JSM.AddPolygonToBody (result, [0, 30, 12]);
		JSM.AddPolygonToBody (result, [0, 48, 3]);
		JSM.AddPolygonToBody (result, [0, 51, 30]);
		JSM.AddPolygonToBody (result, [1, 2, 50]);
		JSM.AddPolygonToBody (result, [1, 28, 13]);
		JSM.AddPolygonToBody (result, [1, 49, 2]);
		JSM.AddPolygonToBody (result, [1, 50, 28]);
		JSM.AddPolygonToBody (result, [2, 29, 14]);
		JSM.AddPolygonToBody (result, [2, 49, 29]);
		JSM.AddPolygonToBody (result, [3, 31, 15]);
		JSM.AddPolygonToBody (result, [3, 48, 31]);
		JSM.AddPolygonToBody (result, [4, 7, 55]);
		JSM.AddPolygonToBody (result, [4, 34, 16]);
		JSM.AddPolygonToBody (result, [4, 52, 7]);
		JSM.AddPolygonToBody (result, [4, 55, 34]);
		JSM.AddPolygonToBody (result, [5, 6, 54]);
		JSM.AddPolygonToBody (result, [5, 32, 17]);
		JSM.AddPolygonToBody (result, [5, 53, 6]);
		JSM.AddPolygonToBody (result, [5, 54, 32]);
		JSM.AddPolygonToBody (result, [6, 33, 18]);
		JSM.AddPolygonToBody (result, [6, 53, 33]);
		JSM.AddPolygonToBody (result, [7, 35, 19]);
		JSM.AddPolygonToBody (result, [7, 52, 35]);
		JSM.AddPolygonToBody (result, [8, 11, 59]);
		JSM.AddPolygonToBody (result, [8, 26, 20]);
		JSM.AddPolygonToBody (result, [8, 56, 11]);
		JSM.AddPolygonToBody (result, [8, 59, 26]);
		JSM.AddPolygonToBody (result, [9, 10, 58]);
		JSM.AddPolygonToBody (result, [9, 24, 21]);
		JSM.AddPolygonToBody (result, [9, 57, 10]);
		JSM.AddPolygonToBody (result, [9, 58, 24]);
		JSM.AddPolygonToBody (result, [10, 25, 22]);
		JSM.AddPolygonToBody (result, [10, 57, 25]);
		JSM.AddPolygonToBody (result, [11, 27, 23]);
		JSM.AddPolygonToBody (result, [11, 56, 27]);
		JSM.AddPolygonToBody (result, [12, 18, 21]);
		JSM.AddPolygonToBody (result, [12, 21, 24]);
		JSM.AddPolygonToBody (result, [12, 30, 18]);
		JSM.AddPolygonToBody (result, [13, 16, 22]);
		JSM.AddPolygonToBody (result, [13, 22, 25]);
		JSM.AddPolygonToBody (result, [13, 28, 16]);
		JSM.AddPolygonToBody (result, [14, 17, 20]);
		JSM.AddPolygonToBody (result, [14, 20, 26]);
		JSM.AddPolygonToBody (result, [14, 29, 17]);
		JSM.AddPolygonToBody (result, [15, 19, 23]);
		JSM.AddPolygonToBody (result, [15, 23, 27]);
		JSM.AddPolygonToBody (result, [15, 31, 19]);
		JSM.AddPolygonToBody (result, [16, 34, 22]);
		JSM.AddPolygonToBody (result, [17, 32, 20]);
		JSM.AddPolygonToBody (result, [18, 33, 21]);
		JSM.AddPolygonToBody (result, [19, 35, 23]);
		JSM.AddPolygonToBody (result, [24, 58, 36]);
		JSM.AddPolygonToBody (result, [25, 57, 37]);
		JSM.AddPolygonToBody (result, [26, 59, 38]);
		JSM.AddPolygonToBody (result, [27, 56, 39]);
		JSM.AddPolygonToBody (result, [28, 50, 40]);
		JSM.AddPolygonToBody (result, [29, 49, 41]);
		JSM.AddPolygonToBody (result, [30, 51, 42]);
		JSM.AddPolygonToBody (result, [31, 48, 43]);
		JSM.AddPolygonToBody (result, [32, 54, 44]);
		JSM.AddPolygonToBody (result, [33, 53, 45]);
		JSM.AddPolygonToBody (result, [34, 55, 46]);
		JSM.AddPolygonToBody (result, [35, 52, 47]);
		JSM.AddPolygonToBody (result, [36, 43, 48]);
		JSM.AddPolygonToBody (result, [36, 46, 43]);
		JSM.AddPolygonToBody (result, [36, 58, 46]);
		JSM.AddPolygonToBody (result, [37, 41, 49]);
		JSM.AddPolygonToBody (result, [37, 45, 41]);
		JSM.AddPolygonToBody (result, [37, 57, 45]);
		JSM.AddPolygonToBody (result, [38, 40, 50]);
		JSM.AddPolygonToBody (result, [38, 47, 40]);
		JSM.AddPolygonToBody (result, [38, 59, 47]);
		JSM.AddPolygonToBody (result, [39, 42, 51]);
		JSM.AddPolygonToBody (result, [39, 44, 42]);
		JSM.AddPolygonToBody (result, [39, 56, 44]);
		JSM.AddPolygonToBody (result, [40, 47, 52]);
		JSM.AddPolygonToBody (result, [41, 45, 53]);
		JSM.AddPolygonToBody (result, [42, 44, 54]);
		JSM.AddPolygonToBody (result, [43, 46, 55]);

		JSM.AddPolygonToBody (result, [0, 12, 24, 36, 48]);
		JSM.AddPolygonToBody (result, [1, 13, 25, 37, 49]);
		JSM.AddPolygonToBody (result, [2, 14, 26, 38, 50]);
		JSM.AddPolygonToBody (result, [3, 15, 27, 39, 51]);
		JSM.AddPolygonToBody (result, [4, 16, 28, 40, 52]);
		JSM.AddPolygonToBody (result, [5, 17, 29, 41, 53]);
		JSM.AddPolygonToBody (result, [6, 18, 30, 42, 54]);
		JSM.AddPolygonToBody (result, [7, 19, 31, 43, 55]);
		JSM.AddPolygonToBody (result, [8, 20, 32, 44, 56]);
		JSM.AddPolygonToBody (result, [9, 21, 33, 45, 57]);
		JSM.AddPolygonToBody (result, [10, 22, 34, 46, 58]);
		JSM.AddPolygonToBody (result, [11, 23, 35, 47, 59]);

		return result;
	};

	/**
	* Function: AddCumulatedPolygonToBody
	* Description: Adds polygons to a body by cumulating the original polygons vertex index array.
	* Parameters:
	*	body {Body} the body
	*	vertices {integer[*]} the vertices of the original polygon
	*	height {number} the height of the cumulation
	*/
	JSM.AddCumulatedPolygonToBody = function (body, vertices, height)
	{
		function CalculatePolygonCentroidAndNormal (vertices, centroidCoord, normalVector)
		{
			var vertexCoords = [];
			
			var i;
			for (i = 0; i < vertices.length; i++) {
				vertexCoords.push (body.GetVertexPosition (vertices[i]));
			}
			
			var centroid = JSM.CalculateCentroid (vertexCoords);
			var normal = JSM.CalculateNormal (vertexCoords);

			centroidCoord.Set (centroid.x, centroid.y, centroid.z);
			normalVector.Set (normal.x, normal.y, normal.z);
		}

		var centroidCoord = new JSM.Coord (0.0, 0.0, 0.0);
		var normalVector = new JSM.Vector (0.0, 0.0, 0.0);
		CalculatePolygonCentroidAndNormal (vertices, centroidCoord, normalVector);
		centroidCoord.Offset (normalVector, height);
		
		var centroid = body.VertexCount ();
		JSM.AddVertexToBody (body, centroidCoord.x, centroidCoord.y, centroidCoord.z);

		var count = vertices.length;

		var i, curr, next;
		for (i = 0; i < count; i++) {
			curr = vertices[i];
			next = vertices [i < count - 1 ? i + 1 : 0];
			JSM.AddPolygonToBody (body, [curr, next, centroid]);
		}
	};

	/**
	* Function: GenerateCumulatedTetrahedron
	* Description: Generates a cumulated tetrahedron.
	* Parameters:
	*	pyramidUnitHeight {number} the unit height of pyramids
	* Returns:
	*	{Body} the result
	*/
	JSM.GenerateCumulatedTetrahedron = function (pyramidUnitHeight)
	{
		var result = new JSM.Body ();

		var a = 1.0;

		result.AddVertex (new JSM.BodyVertex (new JSM.Coord (+a, +a, +a)));
		result.AddVertex (new JSM.BodyVertex (new JSM.Coord (-a, -a, +a)));
		result.AddVertex (new JSM.BodyVertex (new JSM.Coord (-a, +a, -a)));
		result.AddVertex (new JSM.BodyVertex (new JSM.Coord (+a, -a, -a)));

		var edgeLength = 2.0 * Math.sqrt (2.0);
		var height = edgeLength * pyramidUnitHeight;
		
		JSM.AddCumulatedPolygonToBody (result, [0, 1, 3], height);
		JSM.AddCumulatedPolygonToBody (result, [0, 2, 1], height);
		JSM.AddCumulatedPolygonToBody (result, [0, 3, 2], height);
		JSM.AddCumulatedPolygonToBody (result, [1, 2, 3], height);

		return result;
	};

	/**
	* Function: GenerateCumulatedHexahedron
	* Description: Generates a cumulated hexahedron.
	* Parameters:
	*	pyramidUnitHeight {number} the unit height of pyramids
	* Returns:
	*	{Body} the result
	*/
	JSM.GenerateCumulatedHexahedron = function (pyramidUnitHeight)
	{
		var result = new JSM.Body ();

		var a = 1.0;

		JSM.AddVertexToBody (result, +a, +a, +a);
		JSM.AddVertexToBody (result, +a, +a, -a);
		JSM.AddVertexToBody (result, +a, -a, +a);
		JSM.AddVertexToBody (result, -a, +a, +a);
		JSM.AddVertexToBody (result, +a, -a, -a);
		JSM.AddVertexToBody (result, -a, +a, -a);
		JSM.AddVertexToBody (result, -a, -a, +a);
		JSM.AddVertexToBody (result, -a, -a, -a);

		var edgeLength = 2.0;
		var height = edgeLength * pyramidUnitHeight;
		
		JSM.AddCumulatedPolygonToBody (result, [0, 1, 5, 3], height);
		JSM.AddCumulatedPolygonToBody (result, [0, 2, 4, 1], height);
		JSM.AddCumulatedPolygonToBody (result, [0, 3, 6, 2], height);
		JSM.AddCumulatedPolygonToBody (result, [1, 4, 7, 5], height);
		JSM.AddCumulatedPolygonToBody (result, [2, 6, 7, 4], height);
		JSM.AddCumulatedPolygonToBody (result, [3, 5, 7, 6], height);

		return result;
	};

	/**
	* Function: GenerateCumulatedOctahedron
	* Description: Generates a cumulated octahedron.
	* Parameters:
	*	pyramidUnitHeight {number} the unit height of pyramids
	* Returns:
	*	{Body} the result
	*/
	JSM.GenerateCumulatedOctahedron = function (pyramidUnitHeight)
	{
		var result = new JSM.Body ();

		var a = 1.0;
		var b = 0.0;

		JSM.AddVertexToBody (result, +a, +b, +b);
		JSM.AddVertexToBody (result, -a, +b, +b);
		JSM.AddVertexToBody (result, +b, +a, +b);
		JSM.AddVertexToBody (result, +b, -a, +b);
		JSM.AddVertexToBody (result, +b, +b, +a);
		JSM.AddVertexToBody (result, +b, +b, -a);

		var edgeLength = Math.sqrt (2.0);
		var height = edgeLength * pyramidUnitHeight;
		
		JSM.AddCumulatedPolygonToBody (result, [0, 2, 4], height);
		JSM.AddCumulatedPolygonToBody (result, [0, 3, 5], height);
		JSM.AddCumulatedPolygonToBody (result, [0, 4, 3], height);
		JSM.AddCumulatedPolygonToBody (result, [0, 5, 2], height);
		JSM.AddCumulatedPolygonToBody (result, [1, 2, 5], height);
		JSM.AddCumulatedPolygonToBody (result, [1, 3, 4], height);
		JSM.AddCumulatedPolygonToBody (result, [1, 4, 2], height);
		JSM.AddCumulatedPolygonToBody (result, [1, 5, 3], height);

		return result;
	};

	/**
	* Function: GenerateCumulatedDodecahedron
	* Description: Generates a cumulated dodecahedron.
	* Parameters:
	*	pyramidUnitHeight {number} the unit height of pyramids
	* Returns:
	*	{Body} the result
	*/
	JSM.GenerateCumulatedDodecahedron = function (pyramidUnitHeight)
	{
		var result = new JSM.Body ();

		var a = 1.0;
		var b = 0.0;
		var c = (1.0 + Math.sqrt (5.0)) / 2.0;
		var d = 1.0 / c;

		JSM.AddVertexToBody (result, +a, +a, +a);
		JSM.AddVertexToBody (result, +a, +a, -a);
		JSM.AddVertexToBody (result, +a, -a, +a);
		JSM.AddVertexToBody (result, -a, +a, +a);
		JSM.AddVertexToBody (result, +a, -a, -a);
		JSM.AddVertexToBody (result, -a, +a, -a);
		JSM.AddVertexToBody (result, -a, -a, +a);
		JSM.AddVertexToBody (result, -a, -a, -a);

		JSM.AddVertexToBody (result, +b, +d, +c);
		JSM.AddVertexToBody (result, +b, +d, -c);
		JSM.AddVertexToBody (result, +b, -d, +c);
		JSM.AddVertexToBody (result, +b, -d, -c);

		JSM.AddVertexToBody (result, +d, +c, +b);
		JSM.AddVertexToBody (result, +d, -c, +b);
		JSM.AddVertexToBody (result, -d, +c, +b);
		JSM.AddVertexToBody (result, -d, -c, +b);

		JSM.AddVertexToBody (result, +c, +b, +d);
		JSM.AddVertexToBody (result, -c, +b, +d);
		JSM.AddVertexToBody (result, +c, +b, -d);
		JSM.AddVertexToBody (result, -c, +b, -d);

		var edgeLength = Math.sqrt (5.0) - 1.0;
		var height = edgeLength * pyramidUnitHeight;
		
		JSM.AddCumulatedPolygonToBody (result, [0, 8, 10, 2, 16], height);
		JSM.AddCumulatedPolygonToBody (result, [0, 16, 18, 1, 12], height);
		JSM.AddCumulatedPolygonToBody (result, [0, 12, 14, 3, 8], height);
		JSM.AddCumulatedPolygonToBody (result, [1, 9, 5, 14, 12], height);
		JSM.AddCumulatedPolygonToBody (result, [1, 18, 4, 11, 9], height);
		JSM.AddCumulatedPolygonToBody (result, [2, 10, 6, 15, 13], height);
		JSM.AddCumulatedPolygonToBody (result, [2, 13, 4, 18, 16], height);
		JSM.AddCumulatedPolygonToBody (result, [3, 14, 5, 19, 17], height);
		JSM.AddCumulatedPolygonToBody (result, [3, 17, 6, 10, 8], height);
		JSM.AddCumulatedPolygonToBody (result, [4, 13, 15, 7, 11], height);
		JSM.AddCumulatedPolygonToBody (result, [5, 9, 11, 7, 19], height);
		JSM.AddCumulatedPolygonToBody (result, [6, 17, 19, 7, 15], height);

		return result;
	};

	/**
	* Function: GenerateCumulatedIcosahedron
	* Description: Generates a cumulated icosahedron.
	* Parameters:
	*	pyramidUnitHeight {number} the unit height of pyramids
	* Returns:
	*	{Body} the result
	*/
	JSM.GenerateCumulatedIcosahedron = function (pyramidUnitHeight)
	{
		var result = new JSM.Body ();

		var a = 1.0;
		var b = 0.0;
		var c = (1.0 + Math.sqrt (5.0)) / 2.0;

		JSM.AddVertexToBody (result, +b, +a, +c);
		JSM.AddVertexToBody (result, +b, +a, -c);
		JSM.AddVertexToBody (result, +b, -a, +c);
		JSM.AddVertexToBody (result, +b, -a, -c);

		JSM.AddVertexToBody (result, +a, +c, +b);
		JSM.AddVertexToBody (result, +a, -c, +b);
		JSM.AddVertexToBody (result, -a, +c, +b);
		JSM.AddVertexToBody (result, -a, -c, +b);

		JSM.AddVertexToBody (result, +c, +b, +a);
		JSM.AddVertexToBody (result, -c, +b, +a);
		JSM.AddVertexToBody (result, +c, +b, -a);
		JSM.AddVertexToBody (result, -c, +b, -a);

		var edgeLength = 2;
		var height = edgeLength * pyramidUnitHeight;

		JSM.AddCumulatedPolygonToBody (result, [0, 2, 8], height);
		JSM.AddCumulatedPolygonToBody (result, [0, 4, 6], height);
		JSM.AddCumulatedPolygonToBody (result, [0, 6, 9], height);
		JSM.AddCumulatedPolygonToBody (result, [0, 8, 4], height);
		JSM.AddCumulatedPolygonToBody (result, [0, 9, 2], height);
		JSM.AddCumulatedPolygonToBody (result, [1, 3, 11], height);
		JSM.AddCumulatedPolygonToBody (result, [1, 4, 10], height);
		JSM.AddCumulatedPolygonToBody (result, [1, 6, 4], height);
		JSM.AddCumulatedPolygonToBody (result, [1, 10, 3], height);
		JSM.AddCumulatedPolygonToBody (result, [1, 11, 6], height);
		JSM.AddCumulatedPolygonToBody (result, [2, 5, 8], height);
		JSM.AddCumulatedPolygonToBody (result, [2, 7, 5], height);
		JSM.AddCumulatedPolygonToBody (result, [2, 9, 7], height);
		JSM.AddCumulatedPolygonToBody (result, [3, 5, 7], height);
		JSM.AddCumulatedPolygonToBody (result, [3, 7, 11], height);
		JSM.AddCumulatedPolygonToBody (result, [3, 10, 5], height);
		JSM.AddCumulatedPolygonToBody (result, [4, 8, 10], height);
		JSM.AddCumulatedPolygonToBody (result, [6, 11, 9], height);
		JSM.AddCumulatedPolygonToBody (result, [5, 10, 8], height);
		JSM.AddCumulatedPolygonToBody (result, [7, 9, 11], height);

		return result;
	};

	/**
	* Function: GenerateTetrakisHexahedron
	* Description: Generates a tetrakis hexahedron.
	* Returns:
	*	{Body} the result
	*/
	JSM.GenerateTetrakisHexahedron = function ()
	{
		var pyramidUnitHeight = 1.0 / 4.0;
		return JSM.GenerateCumulatedHexahedron (pyramidUnitHeight);
	};

	/**
	* Function: GenerateRhombicDodecahedron
	* Description: Generates a rhombic dodecahedron.
	* Returns:
	*	{Body} the result
	*/
	JSM.GenerateRhombicDodecahedron = function ()
	{
		var pyramidUnitHeight = 1.0 / 2.0;
		return JSM.GenerateCumulatedHexahedron (pyramidUnitHeight);
	};

	/**
	* Function: GeneratePentakisDodecahedron
	* Description: Generates a pentakis dodecahedron.
	* Returns:
	*	{Body} the result
	*/
	JSM.GeneratePentakisDodecahedron = function ()
	{
		var pyramidUnitHeight = Math.sqrt ((65.0 + 22.0 * Math.sqrt (5.0)) / 5.0) / 19.0;
		return JSM.GenerateCumulatedDodecahedron (pyramidUnitHeight);
	};

	/**
	* Function: GenerateSmallStellatedDodecahedron
	* Description: Generates a small stellated dodecahedron.
	* Returns:
	*	{Body} the result
	*/
	JSM.GenerateSmallStellatedDodecahedron = function ()
	{
		var pyramidUnitHeight = Math.sqrt ((5.0 + 2.0 * Math.sqrt (5.0)) / 5.0);
		return JSM.GenerateCumulatedDodecahedron (pyramidUnitHeight);
	};

	/**
	* Function: GenerateGreatDodecahedron
	* Description: Generates a great dodecahedron.
	* Returns:
	*	{Body} the result
	*/
	JSM.GenerateGreatDodecahedron = function ()
	{
		var pyramidUnitHeight = (Math.sqrt (3.0) * (Math.sqrt (5.0) - 3.0)) / 6.0;
		return JSM.GenerateCumulatedIcosahedron (pyramidUnitHeight);
	};

	/**
	* Function: GenerateSmallTriambicIcosahedron
	* Description: Generates a small triambic icosahedron.
	* Returns:
	*	{Body} the result
	*/
	JSM.GenerateSmallTriambicIcosahedron = function ()
	{
		var pyramidUnitHeight = Math.sqrt (15.0) / 15.0;
		return JSM.GenerateCumulatedIcosahedron (pyramidUnitHeight);
	};

	/**
	* Function: GenerateGreatStellatedDodecahedron
	* Description: Generates a great stellated dodecahedron.
	* Returns:
	*	{Body} the result
	*/
	JSM.GenerateGreatStellatedDodecahedron = function ()
	{
		var pyramidUnitHeight = (Math.sqrt (3.0) * (3.0 + Math.sqrt (5.0))) / 6.0;
		return JSM.GenerateCumulatedIcosahedron (pyramidUnitHeight);
	};

	/**
	* Function: GenerateSmallTriakisOctahedron
	* Description: Generates a small triakis octahedron.
	* Returns:
	*	{Body} the result
	*/
	JSM.GenerateSmallTriakisOctahedron = function ()
	{
		var pyramidUnitHeight = Math.sqrt (3.0) - 2.0 * Math.sqrt (6.0) / 3.0;
		return JSM.GenerateCumulatedOctahedron (pyramidUnitHeight);
	};

	/**
	* Function: GenerateStellaOctangula
	* Description: Generates a stella octangula.
	* Returns:
	*	{Body} the result
	*/
	JSM.GenerateStellaOctangula = function ()
	{
		var pyramidUnitHeight = Math.sqrt (6.0) / 3.0;
		return JSM.GenerateCumulatedOctahedron (pyramidUnitHeight);
	};

	/**
	* Function: GenerateTriakisTetrahedron
	* Description: Generates a triakis tetrahedron.
	* Returns:
	*	{Body} the result
	*/
	JSM.GenerateTriakisTetrahedron = function ()
	{
		var pyramidUnitHeight = Math.sqrt (6.0) / 15.0;
		return JSM.GenerateCumulatedTetrahedron (pyramidUnitHeight);
	};

	return JSM;
});

define('skylark-jsmodeler/extras/extgenerator',["../core/jsm"],function(JSM){
	/**
	* Class: LegoDimensions
	* Description: Class that contains lego brick dimensions.
	*/
	JSM.LegoDimensions = function ()
	{
		this.legoWidth = 0.78;
		this.legoSmallHeight = 0.32;
		this.legoLargeHeight = 0.96;
		this.legoWallWidth = 0.16;
		this.legoCylinderWidth = 0.5;
		this.legoCylinderHeight = 0.17;
		this.legoBottomSmallCylinderWidth = 0.3;
		this.legoBottomLargeCylinderWidth = 0.6;
		this.legoBottomLargeCylinderWallWidth = 0.1;
	};

	/**
	* Function: GenerateLegoBrick
	* Description: Generates a lego brick.
	* Parameters:
	*	rows {integer} the row count
	*	columns {integer} the columns count
	*	isLarge {boolean} the brick is large
	*	hasTopCylinders {boolean} the brick has top cylinders
	*	hasBottomCylinders {boolean} the brick has bottom cylinders
	*	segmentation {integer} the segmentation of cylinders
	*	isCurved {boolean} create smooth surfaces
	* Returns:
	*	{Body} the result
	*/
	JSM.GenerateLegoBrick = function (rows, columns, isLarge, hasTopCylinders, hasBottomCylinders, segmentation, isCurved)
	{
		function OffsetBody (body, offset)
		{
			var i, vertex;
			for (i = 0; i < body.VertexCount (); i++) {
				vertex = body.GetVertex (i);
				vertex.position = JSM.CoordAdd (vertex.position, offset);
			}
		}
		
		var legoDimensions = new JSM.LegoDimensions ();

		var normal = new JSM.Vector (0.0, 0.0, 1.0);
		var unitWidth = legoDimensions.legoWidth;
		var unitHeight = legoDimensions.legoLargeHeight;
		if (!isLarge) {
			unitHeight = legoDimensions.legoSmallHeight;
		}
		var wallWidth = legoDimensions.legoWallWidth;
		var topCylinderWidth = legoDimensions.legoCylinderWidth;
		var topCylinderHeight = legoDimensions.legoCylinderHeight;
		var bottomSmallCylinderWidth = legoDimensions.legoBottomSmallCylinderWidth;
		var bottomLargeCylinderWidth = legoDimensions.legoBottomLargeCylinderWidth;
		var bottomLargeCylinderWallWidth = legoDimensions.legoBottomLargeCylinderWallWidth;

		var basePolygon = [];
		basePolygon.push (new JSM.Coord (0.0, 0.0, 0.0));
		basePolygon.push (new JSM.Coord (unitWidth * rows, 0.0, 0.0));
		basePolygon.push (new JSM.Coord (unitWidth * rows, unitWidth * columns, 0.0));
		basePolygon.push (new JSM.Coord (0.0, unitWidth * columns, 0.0));

		var result = new JSM.Body ();
		
		var walls = JSM.GeneratePrismShell (basePolygon, normal, unitHeight - wallWidth, wallWidth, true);
		result.Merge (walls);
			
		var i, j;
		for (i = 0; i < 4; i++) {
			basePolygon[i].z = unitHeight - wallWidth;
		}
		
		var top = JSM.GeneratePrism (basePolygon, normal, wallWidth, true, null);
		result.Merge (top);
		
		var cylinderCenter, cylinder;
		if (hasTopCylinders) {
			for (i = 0; i < rows; i++) {
				for (j = 0; j < columns; j++) {
					cylinderCenter = new JSM.Coord (unitWidth * i + unitWidth / 2.0, unitWidth * j + unitWidth / 2.0, unitHeight + topCylinderHeight / 2.0);
					cylinder = JSM.GenerateCylinder (topCylinderWidth / 2.0, topCylinderHeight, segmentation, true, isCurved);
					OffsetBody (cylinder, cylinderCenter);
					result.Merge (cylinder);
				}
			}
		}
		
		if (hasBottomCylinders) {
			var circle, bigger, columnWise;
			if ((rows === 1 && columns > 1) || (columns === 1 && rows > 1)) {
				bigger = columns;
				columnWise = true;
				if (rows > columns) {
					bigger = rows;
					columnWise = false;
				}
				for (i = 0; i < bigger - 1; i++) {
					if (columnWise) {
						cylinderCenter = new JSM.Coord (unitWidth / 2.0, unitWidth * (i + 1), (unitHeight - wallWidth) / 2.0);
					} else {
						cylinderCenter = new JSM.Coord (unitWidth * (i + 1), unitWidth / 2.0, (unitHeight - wallWidth) / 2.0);
					}
					cylinder = JSM.GenerateCylinder (bottomSmallCylinderWidth / 2.0, unitHeight - wallWidth, segmentation, true, isCurved);
					OffsetBody (cylinder, cylinderCenter);
					result.Merge (cylinder);
				}
			} else if (rows > 1 && columns > 1) {
				for (i = 0; i < rows - 1; i++) {
					for (j = 0; j < columns - 1; j++) {
						circle = [];
						cylinderCenter = new JSM.Coord (unitWidth * (i + 1), unitWidth * (j + 1), (unitHeight - wallWidth) / 2.0);
						cylinder = JSM.GenerateCylinderShell (bottomLargeCylinderWidth / 2.0, unitHeight - wallWidth, bottomLargeCylinderWallWidth, segmentation, true, isCurved);
						OffsetBody (cylinder, cylinderCenter);
						result.Merge (cylinder);
					}
				}
			}
		}

		result.SetCubicTextureProjection (new JSM.Coord (0.0, 0.0, 0.0), new JSM.Coord (1.0, 0.0, 0.0), new JSM.Coord (0.0, 1.0, 0.0), new JSM.Coord (0.0, 0.0, 1.0));
		return result;
	};

	/**
	* Function: GenerateConvexHullBody
	* Description: Generates a convex hull body from the given coordinates.
	* Parameters:
	*	coord {Coord[*]} the coordinates
	* Returns:
	*	{Body} the result
	*/
	JSM.GenerateConvexHullBody = function (coords)
	{
		var result = new JSM.Body ();
		var convexHull = JSM.ConvexHull3D (coords);
		
		var oldToNewIndexTable = {};
		var i, j, current, index;
		for (i = 0; i < convexHull.length; i++) {
			current = convexHull[i];
			for (j = 0; j < current.length; j++) {
				index = current[j];
				if (!(index in oldToNewIndexTable)) {
					oldToNewIndexTable[index] = result.VertexCount ();
					result.AddVertex (new JSM.BodyVertex (coords[index]));
				}
			}
		}
		
		var newPolygon;
		for (i = 0; i < convexHull.length; i++) {
			current = convexHull[i];
			newPolygon = [];
			for (j = 0; j < current.length; j++) {
				index = current[j];
				newPolygon.push (oldToNewIndexTable[index]);
			}
			result.AddPolygon (new JSM.BodyPolygon (newPolygon));
		}

		return result;
	};

	/**
	* Function: GenerateSuperShape
	* Description: Generates a supershape.
	* Parameters:
	*	parameters {12 numbers} the supershape parameters
	*	segmentation {integer} the segmentation
	*	isCurved {boolean} create smooth surfaces
	* Returns:
	*	{Body} the result
	*/
	JSM.GenerateSuperShape = function (	aLon, bLon, mLon, n1Lon, n2Lon, n3Lon,
										aLat, bLat, mLat, n1Lat, n2Lat, n3Lat,
										segmentation, isCurved)
	{
		function CartesianToSpherical (coord)
		{
			var radius = Math.sqrt (coord.x * coord.x + coord.y * coord.y + coord.z * coord.z);
			var phi = Math.asin (coord.z / radius);
			var theta = Math.atan2 (coord.y, coord.x);
			return [radius, phi, theta];
		}

		function CalculateSuperFormula (p, a, b, m, n1, n2, n3)
		{
			var abs1 = Math.abs (Math.cos (m * p / 4.0) / a);
			var abs2 = Math.abs (Math.sin (m * p / 4.0) / b);
			return Math.pow (Math.pow (abs1, n2) + Math.pow (abs2, n3), -1.0 / n1);
		}

		function CalculateSuperFormulaCoordinate (phi, theta)
		{
			var coord = new JSM.Coord (0.0, 0.0, 0.0);
			var rPhi = CalculateSuperFormula (phi, aLat, bLat, mLat, n1Lat, n2Lat, n3Lat);
			var rTheta = CalculateSuperFormula (theta, aLon, bLon, mLon, n1Lon, n2Lon, n3Lon);
			coord.x = rTheta * Math.cos (theta) * rPhi * Math.cos (phi);
			coord.y = rTheta * Math.sin (theta) * rPhi * Math.cos (phi);
			coord.z = rPhi * Math.sin (phi);
			return coord;
		}

		var result = JSM.GenerateSphere (1.0, segmentation, isCurved);

		var i, vertex, coord, spherical, newCoord;
		for (i = 0; i < result.VertexCount (); i++) {
			vertex = result.GetVertex (i);
			coord = vertex.position;
			spherical = CartesianToSpherical (coord);
			newCoord = CalculateSuperFormulaCoordinate (spherical[1], spherical[2]);
			vertex.SetPosition (newCoord);
		}
		
		return result;
	};

	return JSM;
});

define('skylark-jsmodeler/extras/subdivision',["../core/jsm"],function(JSM){
	/**
	* Function: CatmullClarkSubdivisionOneIteration
	* Description: Runs one iteration of Catmull-Clark subdivision on a body.
	* Parameters:
	*	body {Body} the body
	* Returns:
	*	{Body} the result
	*/
	JSM.CatmullClarkSubdivisionOneIteration = function (body)
	{
		function AddOriginalVertices (body, result, adjacencyInfo)
		{
			var i, vertCoord;
			for (i = 0; i < adjacencyInfo.verts.length; i++) {
				vertCoord = body.GetVertexPosition (i);
				result.AddVertex (new JSM.BodyVertex (vertCoord.Clone ()));
			}
		}

		function AddPolygonVertices (body, result, adjacencyInfo, pgonVertices)
		{
			var i, j, pgon, vertCoord, pgonCoord;
			for (i = 0; i < adjacencyInfo.pgons.length; i++) {
				pgon = adjacencyInfo.pgons[i];
				pgonCoord = new JSM.Coord (0.0, 0.0, 0.0);
				for (j = 0; j < pgon.verts.length; j++) {
					vertCoord = body.GetVertexPosition (pgon.verts[j]);
					pgonCoord = JSM.CoordAdd (pgonCoord, vertCoord);
				}

				pgonCoord.MultiplyScalar (1.0 / pgon.verts.length);
				pgonVertices.push (result.AddVertex (new JSM.BodyVertex (pgonCoord)));
			}
		}
		
		function AddEdgeVertices (body, result, adjacencyInfo, pgonVertices, edgeVertices)
		{
			var i, j, edge, edgeCoord1, edgeCoord2, edgeCoord, pgonIndex, pgonCoord;
			for (i = 0; i < adjacencyInfo.edges.length; i++) {
				edge = adjacencyInfo.edges[i];
				edgeCoord1 = body.GetVertexPosition (edge.vert1);
				edgeCoord2 = body.GetVertexPosition (edge.vert2);
				if (adjacencyInfo.IsContourEdge (edge)) {
					edgeCoord = JSM.MidCoord (edgeCoord1, edgeCoord2);
				} else {
					edgeCoord = JSM.CoordAdd (edgeCoord1, edgeCoord2);
					for (j = 0; j < 2; j++) {
						pgonIndex = (j === 0 ? edge.pgon1 : edge.pgon2);
						pgonCoord = result.GetVertexPosition (pgonVertices[pgonIndex]);
						edgeCoord = JSM.CoordAdd (edgeCoord, pgonCoord);
					}
					edgeCoord.MultiplyScalar (1.0 / 4.0);
				}
				edgeVertices.push (result.AddVertex (new JSM.BodyVertex (edgeCoord)));
			}
		}

		function MoveOriginalVertices (body, result, adjacencyInfo, pgonVertices)
		{
			function MoveContourVertex (newVertCoord, vertCoord)
			{
				vertCoord.x = newVertCoord.x;
				vertCoord.y = newVertCoord.y;
				vertCoord.z = newVertCoord.z;
			}		
			
			function MoveVertex (pgonAverage, edgeAverage, vertEdgeCount, vertCoord)
			{
				vertCoord.x = (pgonAverage.x + 2.0 * edgeAverage.x + (vertEdgeCount - 3) * vertCoord.x) / vertEdgeCount;
				vertCoord.y = (pgonAverage.y + 2.0 * edgeAverage.y + (vertEdgeCount - 3) * vertCoord.y) / vertEdgeCount;
				vertCoord.z = (pgonAverage.z + 2.0 * edgeAverage.z + (vertEdgeCount - 3) * vertCoord.z) / vertEdgeCount;
			}
		
			var edgeMidCoords = [];
			
			var edge, edgeCoord;
			var i, j;
			for (i = 0; i < adjacencyInfo.edges.length; i++) {
				edge = adjacencyInfo.edges[i];
				edgeCoord = JSM.MidCoord (body.GetVertexPosition (edge.vert1), body.GetVertexPosition (edge.vert2));
				edgeMidCoords.push (edgeCoord);
			}
		
			var vert, pgon, vertCoord, currentVertCoord;
			var pgonAverage, edgeAverage, edgeCountForAverage;
			for (i = 0; i < adjacencyInfo.verts.length; i++) {
				vert = adjacencyInfo.verts[i];
				vertCoord = result.GetVertexPosition (i);
				if (adjacencyInfo.IsContourVertex (vert)) {
					edgeCountForAverage = 0;
					edgeAverage = new JSM.Coord (0.0, 0.0, 0.0);
					for (j = 0; j < vert.edges.length; j++) {
						edge = vert.edges[j];
						if (adjacencyInfo.IsContourEdge (adjacencyInfo.edges[edge])) {
							edgeCoord = edgeMidCoords [vert.edges[j]];
							edgeAverage.Add (edgeCoord);
							edgeCountForAverage++;
						}
					}
					edgeAverage.Add (vertCoord);
					edgeCountForAverage++;
					edgeAverage.MultiplyScalar (1.0 / edgeCountForAverage);
					MoveContourVertex (edgeAverage, vertCoord);
				} else {
					pgonAverage = new JSM.Coord (0.0, 0.0, 0.0);
					edgeAverage = new JSM.Coord (0.0, 0.0, 0.0);
					
					for (j = 0; j < vert.pgons.length; j++) {
						pgon = vert.pgons[j];
						currentVertCoord = result.GetVertexPosition (pgonVertices[pgon]);
						pgonAverage.Add (currentVertCoord);
					}
					pgonAverage.MultiplyScalar (1.0 / vert.pgons.length);

					for (j = 0; j < vert.edges.length; j++) {
						edge = vert.edges[j];
						edgeCoord = edgeMidCoords [edge];
						edgeAverage.Add (edgeCoord);
					}
					edgeAverage.MultiplyScalar (1.0 / vert.edges.length);
					MoveVertex (pgonAverage, edgeAverage, vert.edges.length, vertCoord);
				}
			}
		}
		
		function AddNewPolygons (body, result, adjacencyInfo, pgonVertices, edgeVertices)
		{
			var edgeCount, currentEdge, nextEdge;
			var centroid, currentEdgeVertex, originalVertex, nextEdgeVertex;
			var polygon, oldPolygon;
			var i, j, pgon;
			for (i = 0; i < adjacencyInfo.pgons.length; i++) {
				pgon = adjacencyInfo.pgons[i];
				edgeCount = pgon.verts.length;
				for (j = 0; j < edgeCount; j++) {
					currentEdge = pgon.pedges[j];
					nextEdge = pgon.pedges[(j + 1) % edgeCount];

					centroid = pgonVertices[i];
					currentEdgeVertex = edgeVertices[currentEdge.index];
					originalVertex = adjacencyInfo.GetPolyEdgeStartVertex (nextEdge);
					nextEdgeVertex = edgeVertices[nextEdge.index];
					
					polygon = new JSM.BodyPolygon ([centroid, currentEdgeVertex, originalVertex, nextEdgeVertex]);
					oldPolygon = body.GetPolygon (i);
					polygon.material = oldPolygon.material;
					polygon.curved = oldPolygon.curved;
					result.AddPolygon (polygon);
				}
			}
		}

		var result = new JSM.Body ();
		var adjacencyInfo = new JSM.AdjacencyInfo (body);

		var pgonVertices = [];
		var edgeVertices = [];

		AddOriginalVertices (body, result, adjacencyInfo);
		AddPolygonVertices (body, result, adjacencyInfo, pgonVertices);
		AddEdgeVertices (body, result, adjacencyInfo, pgonVertices, edgeVertices);

		MoveOriginalVertices (body, result, adjacencyInfo, pgonVertices);
		AddNewPolygons (body, result, adjacencyInfo, pgonVertices, edgeVertices);
		
		return result;
	};

	/**
	* Function: CatmullClarkSubdivision
	* Description: Runs multiple iterations of Catmull-Clark subdivision on a body.
	* Parameters:
	*	body {Body} the body
	*	iterations {integer} the iteration number
	* Returns:
	*	{Body} the result
	*/
	JSM.CatmullClarkSubdivision = function (body, iterations)
	{
		var result = body;
		
		var i;
		for (i = 0; i < iterations; i++) {
			result = JSM.CatmullClarkSubdivisionOneIteration (result);
		}
		
		return result;
	};

	return JSM;
});

define('skylark-jsmodeler/extras/csg',["../core/jsm"],function(JSM){
	/**
	* Function: BooleanOperation
	* Description: Makes a boolean operation on the given bodies.
	* Parameters:
	*	operation {string} the operation ('Union', 'Difference', or 'Intersection')
	*	aBody {Body} the first body
	*	bBody {Body} the second body
	* Returns:
	*	{Body} the result
	*/
	JSM.BooleanOperation = function (operation, aBody, bBody)
	{
		function AddPolygonToBody (polygon, body, octree, reversed)
		{
			function AddBodyVertex (coord, octree)
			{
				var merge = false;
				if (merge) {
					var index = octree.FindCoord (coord);
					if (index == -1) {
						index = body.AddVertex (new JSM.BodyVertex (coord));
						octree.AddCoord (coord);
					}
					return index;
				}
				
				return body.AddVertex (new JSM.BodyVertex (coord));
			}

			var bodyPolygon = new JSM.BodyPolygon ([]);

			var i, vertexIndex;
			if (!reversed) {
				for (i = 0; i < polygon.VertexCount (); i++) {
					vertexIndex = AddBodyVertex (polygon.GetVertex (i), octree);
					bodyPolygon.AddVertexIndex (vertexIndex);
				}
			} else {
				for (i = polygon.VertexCount () - 1; i >= 0; i--) {
					vertexIndex = AddBodyVertex (polygon.GetVertex (i), octree);
					bodyPolygon.AddVertexIndex (vertexIndex);
				}
			}
			
			if (polygon.userData !== undefined) {
				bodyPolygon.SetMaterialIndex (polygon.userData.material);
			}
			body.AddPolygon (bodyPolygon);
		}

		function AddPolygonsToBody (polygons, body, octree, reversed)
		{
			var i;
			for (i = 0; i < polygons.length; i++) {
				AddPolygonToBody (polygons[i], body, octree, reversed);
			}
		}
		
		function ClipNodePolygonsWithTree (nodes, tree, frontPolygons, backPolygons, planarFrontPolygons, planarBackPolygons)
		{
			function SetPolygonsUserData (polygons, userData)
			{
				var i, polygon;
				for (i = 0; i < polygons.length; i++) {
					polygon = polygons[i];
					if (polygon.userData === undefined) {
						polygon.userData = userData;
					}
				}
			}
		
			var i, node;
			for (i = 0; i < nodes.length; i++) {
				node = nodes[i];
				JSM.ClipPolygonWithBSPTree (node.polygon, tree, frontPolygons, backPolygons, planarFrontPolygons, planarBackPolygons);
				SetPolygonsUserData (frontPolygons, node.userData);
				SetPolygonsUserData (backPolygons, node.userData);
				SetPolygonsUserData (planarFrontPolygons, node.userData);
				SetPolygonsUserData (planarBackPolygons, node.userData);
			}
		}

		var aTree = new JSM.BSPTree ();
		var bTree = new JSM.BSPTree ();
		JSM.AddBodyToBSPTree (aBody, aTree, 'a');
		JSM.AddBodyToBSPTree (bBody, bTree, 'b');

		var aFrontPolygons = [];
		var aBackPolygons = [];
		var aPlanarFrontPolygons = [];
		var aPlanarBackPolygons = [];
		ClipNodePolygonsWithTree (aTree.GetNodes (), bTree, aFrontPolygons, aBackPolygons, aPlanarFrontPolygons, aPlanarBackPolygons);

		var bFrontPolygons = [];
		var bBackPolygons = [];
		var bPlanarFrontPolygons = [];
		var bPlanarBackPolygons = [];
		ClipNodePolygonsWithTree (bTree.GetNodes (), aTree, bFrontPolygons, bBackPolygons, bPlanarFrontPolygons, bPlanarBackPolygons);

		var result = new JSM.Body ();
		var resultOctree = new JSM.Octree (JSM.BoxUnion (aBody.GetBoundingBox (), bBody.GetBoundingBox ()));
		
		if (operation == 'Union') {
			AddPolygonsToBody (aFrontPolygons, result, resultOctree, false);
			AddPolygonsToBody (aPlanarFrontPolygons, result, resultOctree, false);
			AddPolygonsToBody (aPlanarBackPolygons, result, resultOctree, false);
			AddPolygonsToBody (bFrontPolygons, result, resultOctree, false);
			AddPolygonsToBody (bPlanarFrontPolygons, result, resultOctree, false);
		} else if (operation == 'Difference') {
			AddPolygonsToBody (aFrontPolygons, result, resultOctree, false);
			AddPolygonsToBody (aPlanarFrontPolygons, result, resultOctree, false);
			AddPolygonsToBody (bBackPolygons, result, resultOctree, true);
		} else if (operation == 'Intersection') {
			AddPolygonsToBody (aBackPolygons, result, resultOctree, false);
			AddPolygonsToBody (aPlanarBackPolygons, result, resultOctree, false);
			AddPolygonsToBody (bBackPolygons, result, resultOctree, false);
		}

		return result;
	};

	return JSM;
});

define('skylark-jsmodeler/extras/surfaces',["../core/jsm"],function(JSM){
	/**
	* Function: GenerateSurface
	* Description: Generates a parametric surface.
	* Parameters:
	*	xRange {number[2]} the from-to range on x axis
	*	yRange {number[2]} the from-to range on y axis
	*	xSegmentation {integer} the segmentation along the x axis
	*	ySegmentation {integer} the segmentation along the y axis
	*	useTriangles {boolean} generate triangles instead of quadrangles
	*	isCurved {boolean} create smooth surfaces
	*	getPointCallback {function} callback function which returns the point for a position
	*	userData {anything} user data which will be passed to getPointCallback
	* Returns:
	*	{Body} the result
	*/
	JSM.GenerateSurface = function (xRange, yRange, xSegmentation, ySegmentation, useTriangles, isCurved, getPointCallback, userData)
	{
		function AddVertices (result, xStart, yStart, xSegment, ySegment)
		{
			var i, j, u, v, coord;
			for (i = 0; i <= ySegmentation; i++) {
				for (j = 0; j <= xSegmentation; j++) {
					u = xStart + j * xSegment;
					v = yStart + i * ySegment;
					coord = getPointCallback (i, j, u, v, userData);
					result.AddVertex (new JSM.BodyVertex (coord));
				}
			}
		}

		function AddPolygons (result)
		{
			var i, j;
			var current, next, top, ntop;
			var polygon;
			
			for (j = 0; j < ySegmentation; j++) {
				for (i = 0; i < xSegmentation; i++) {
					current = j * (xSegmentation + 1) + i;
					next = current + 1;
					top = current + xSegmentation + 1;
					ntop = top + 1;
					
					if (useTriangles) {
						polygon = new JSM.BodyPolygon ([current, next, ntop]);
						if (isCurved) {
							polygon.SetCurveGroup (0);
						}
						result.AddPolygon (polygon);
						polygon = new JSM.BodyPolygon ([current, ntop, top]);
						if (isCurved) {
							polygon.SetCurveGroup (0);
						}
						result.AddPolygon (polygon);
					} else {
						polygon = new JSM.BodyPolygon ([current, next, ntop, top]);
						if (isCurved) {
							polygon.SetCurveGroup (0);
						}
						result.AddPolygon (polygon);
					}
				}
			}
		}

		var result = new JSM.Body ();
		
		var xStart = xRange[0];
		var yStart = yRange[0];
		var xDiff = xRange[1] - xRange[0];
		var yDiff = yRange[1] - yRange[0];
		var xSegment = xDiff / xSegmentation;
		var ySegment = yDiff / ySegmentation;
		
		AddVertices (result, xStart, yStart, xSegment, ySegment);
		AddPolygons (result);

		return result;
	};

	/**
	* Class: SurfaceControlPoints
	* Description: Represents control points for surface generation.
	* Parameters:
	*	n {integer} the first dimension
	*	m {integer} the second dimension
	*/
	JSM.SurfaceControlPoints = function (n, m)
	{
		this.n = n;
		this.m = m;
		this.points = [];
		
		var i, j;
		for (i = 0; i <= this.n; i++) {
			this.points.push ([]);
			for (j = 0; j <= this.m; j++) {
				this.points[i].push (new JSM.Coord (0.0, 0.0, 0.0));
			}
		}
	};

	/**
	* Function: SurfaceControlPoints.GetNValue
	* Description: Returns the n value.
	* Returns:
	*	{integer} the result
	*/
	JSM.SurfaceControlPoints.prototype.GetNValue = function ()
	{
		return this.n;
	};

	/**
	* Function: SurfaceControlPoints.GetMValue
	* Description: Returns the m value.
	* Returns:
	*	{integer} the result
	*/
	JSM.SurfaceControlPoints.prototype.GetMValue = function ()
	{
		return this.m;
	};

	/**
	* Function: SurfaceControlPoints.GetControlPoint
	* Description: Returns a control point.
	* Parameters:
	*	i {integer} the first dimension
	*	j {integer} the second dimension
	* Returns:
	*	{Coord} the result
	*/
	JSM.SurfaceControlPoints.prototype.GetControlPoint = function (i, j)
	{
		return this.points[i][j];
	};

	/**
	* Function: SurfaceControlPoints.InitPlanar
	* Description: Inits planar control points.
	* Parameters:
	*	xSize {number} the x size
	*	xSize {number} the y size
	*/
	JSM.SurfaceControlPoints.prototype.InitPlanar = function (xSize, ySize)
	{
		var iStep = xSize / this.n;
		var jStep = ySize / this.m;

		var i, j, point;
		for (i = 0; i <= this.n; i++) {
			for (j = 0; j <= this.m; j++) {
				point = this.points[i][j];
				point.x = i * iStep;
				point.y = j * jStep;
			}
		}
	};

	/**
	* Function: GenerateBezierSurface
	* Description: Generates a bezier surface base on the given control points.
	* Parameters:
	*	surfaceControlPoints {SurfaceControlPoints} the control points
	*	xSegmentation {integer} the segmentation along the x axis
	*	ySegmentation {integer} the segmentation along the y axis
	*	isCurved {boolean} create smooth surfaces
	* Returns:
	*	{Body} the result
	*/
	JSM.GenerateBezierSurface = function (surfaceControlPoints, xSegmentation, ySegmentation, isCurved)
	{
		function GetBezierSurfacePoint (uIndex, vIndex, u, v, surfaceControlPoints)
		{
			var i, j, result, tmp1, tmp2, scalar;
			var n = surfaceControlPoints.GetNValue ();
			var m = surfaceControlPoints.GetMValue ();
			
			result = new JSM.Coord (0.0, 0.0, 0.0);
			for (i = 0; i <= n; i++) {
				tmp1 = new JSM.Coord (0.0, 0.0, 0.0);
				for (j = 0; j <= m; j++) {
					scalar = JSM.BernsteinPolynomial (i, n, u) * JSM.BernsteinPolynomial (j, m, v);
					tmp2 = surfaceControlPoints.GetControlPoint (i, j).Clone ().MultiplyScalar (scalar);
					tmp1 = JSM.CoordAdd (tmp1, tmp2);
				}
				result = JSM.CoordAdd (result, tmp1);
			}
			return result;
		}

		var body = JSM.GenerateSurface ([0, 1], [0, 1], xSegmentation, ySegmentation, false, isCurved, GetBezierSurfacePoint, surfaceControlPoints);
		return body;
	};

	return JSM;
});

define('skylark-jsmodeler/extensions/svgtomodel/svgtomodel',["../../core/jsm"],function(JSM){
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

	return JSM;
});

define('skylark-jsmodeler/extensions/textgenerator/textgenerator',["../../core/jsm"],function(JSM){
	/**
	* Function: GenerateText
	* Description:
	*	Generates 3D model from the given text. It should get a font
	*	specification object created with facetype.js.
	* Parameters:
	*	text {string} the text
	*	fontSpec {object} the font specification object generated with facetype.js
	*	fontScale {number} the scale of the generated model
	*	fontHeight {number} the height of the generated model
	*	fontSegmentation {integer} the segmentation of font glyphs
	* Returns:
	*	{Model} the result
	*/
	JSM.GenerateText = function (text, fontSpec, fontScale, fontHeight, fontSegmentation)
	{
		function CreatePathFromSpecification (commands, segmentation, offset, scale)
		{
			function Num (str)
			{
				return parseFloat (str);
			}
		
			var path = new JSM.Path2D ({
				segmentation : segmentation,
				offset : offset,
				scale : scale
			});
			
			var parts = commands.split (' ');
			var index = 0;
			var current;
			while (index < parts.length) {
				current = parts[index++];
				if (current.length === 0) {
					continue;
				}
				if (current == 'm') {
					path.MoveTo (Num (parts[index + 0]), Num (parts[index + 1]));
					index += 2;
				} else if (current == 'l') {
					path.LineTo (Num (parts[index + 0]), Num (parts[index + 1]));
					index += 2;
				} else if (current == 'b') {
					path.CubicBezierTo (Num (parts[index + 0]), Num (parts[index + 1]), Num (parts[index + 2]), Num (parts[index + 3]), Num (parts[index + 4]), Num (parts[index + 5]));
					index += 6;
				} else if (current == 'z') {
					path.Close ();
				} else {
					JSM.Message ('Invalid path command found: ' + current);
				}
			}
			return path;
		}

		var model = new JSM.Model ();
		var offset = new JSM.Vector2D (0.0, 0.0);
		var scale = new JSM.Coord2D (fontScale, fontScale);
		var i, character, glyphs, path, bodies;
		for (i = 0; i < text.length; i++) {
			character = text[i];
			glyphs = fontSpec.glyphs[character];
			if (glyphs === undefined) {
				continue;
			}
			path = CreatePathFromSpecification (glyphs.o, fontSegmentation, offset, scale);
			bodies = JSM.GeneratePrismsFromPath2D (path, fontHeight, true, 160 * JSM.DegRad);
			model.AddBodies (bodies);
			offset.x += glyphs.ha * scale.x;
		}
		return model;
	};

	return JSM;
});

define('skylark-jsmodeler/extensions/threeviewer/threeconverter',["../../core/jsm"],function(JSM){
	JSM.ConvertBodyToThreeMeshes = function (body, materials, conversionData)
	{
		var theConversionData = {
			textureLoadedCallback : null,
			hasConvexPolygons : false
		};

		if (conversionData !== undefined && conversionData !== null) {
			theConversionData.textureLoadedCallback = JSM.ValueOrDefault (conversionData.textureLoadedCallback, theConversionData.textureLoadedCallback);
			theConversionData.hasConvexPolygons = JSM.ValueOrDefault (conversionData.hasConvexPolygons, theConversionData.hasConvexPolygons);
		}
		
		var meshes = [];
		var threeGeometry = null;
		var threeMaterial = null;

		var explodeData = {
			hasConvexPolygons : theConversionData.hasConvexPolygons,
			onPointGeometryStart : function (material) {
					threeMaterial = new JSM.THREE.PointsMaterial ({
						color : material.diffuse,
						size: material.pointSize
					});
					threeGeometry = new JSM.THREE.Geometry ();
			},
			onPointGeometryEnd : function () {
				var points = new JSM.THREE.Points (threeGeometry, threeMaterial);
				meshes.push (points);
			},
			onPoint : function (vertex)	{
				threeGeometry.vertices.push (new JSM.THREE.Vector3 (vertex.x, vertex.y, vertex.z));
			},
			onLineGeometryStart : function (material) {
				threeGeometry = new JSM.THREE.Geometry ();
				threeMaterial = new JSM.THREE.LineBasicMaterial ({
					color : material.diffuse
				});
			},
			onLineGeometryEnd : function () {
				var lines = new JSM.THREE.LineSegments (threeGeometry, threeMaterial);
				meshes.push (lines);
			},
			onLine : function (begVertex, endVertex) {
				threeGeometry.vertices.push (new JSM.THREE.Vector3 (begVertex.x, begVertex.y, begVertex.z));
				threeGeometry.vertices.push (new JSM.THREE.Vector3 (endVertex.x, endVertex.y, endVertex.z));
			},
			onGeometryStart : function (material) {
				var hasTexture = (material.texture !== null);
				var hasOpacity = (material.opacity !== 1.0);

				var diffuse = material.diffuse;
				var specular = material.specular;
				var shininess = material.shininess;
				if (shininess === 0.0) {
					specular = 0x000000;
					shininess = 1;
				}

				threeMaterial = new JSM.THREE.MeshPhongMaterial ({
					color : diffuse,
					specular : specular,
					shininess : shininess
				});

				if (!material.singleSided) {
					threeMaterial.side = JSM.THREE.DoubleSide;
				}
				
				if (hasOpacity) {
					threeMaterial.opacity = material.opacity;
					threeMaterial.transparent = true;
				}
				
				if (hasTexture) {
					var theMaterial = threeMaterial;
					var textureName = material.texture;
					var loader = new JSM.THREE.TextureLoader ();
					loader.load (textureName, function (texture) {
						texture.image = JSM.ResizeImageToPowerOfTwoSides (texture.image);
						texture.wrapS = JSM.THREE.RepeatWrapping;
						texture.wrapT = JSM.THREE.RepeatWrapping;
						theMaterial.map = texture;
						theMaterial.needsUpdate = true;
						if (theConversionData.textureLoadedCallback !== null) {
							theConversionData.textureLoadedCallback ();
						}
					});
				}
				
				threeGeometry = new JSM.THREE.Geometry ();
			},
			onGeometryEnd : function () {
				threeGeometry.computeFaceNormals ();
				var mesh = new JSM.THREE.Mesh (threeGeometry, threeMaterial);
				meshes.push (mesh);
			},
			onTriangle : function (vertex1, vertex2, vertex3, normal1, normal2, normal3, uv1, uv2, uv3) {
				var lastVertexIndex = threeGeometry.vertices.length;
				threeGeometry.vertices.push (new JSM.THREE.Vector3 (vertex1.x, vertex1.y, vertex1.z));
				threeGeometry.vertices.push (new JSM.THREE.Vector3 (vertex2.x, vertex2.y, vertex2.z));
				threeGeometry.vertices.push (new JSM.THREE.Vector3 (vertex3.x, vertex3.y, vertex3.z));
				var face = new JSM.THREE.Face3 (lastVertexIndex + 0, lastVertexIndex + 1, lastVertexIndex + 2);
				threeGeometry.faces.push (face);
				
				if (normal1 !== null && normal2 !== null && normal3 !== null) {
					var normalArray = [];
					normalArray.push (new JSM.THREE.Vector3 (normal1.x, normal1.y, normal1.z));
					normalArray.push (new JSM.THREE.Vector3 (normal2.x, normal2.y, normal2.z));
					normalArray.push (new JSM.THREE.Vector3 (normal3.x, normal3.y, normal3.z));
					threeGeometry.faces[threeGeometry.faces.length - 1].vertexNormals = normalArray;
				}

				if (uv1 !== null && uv2 !== null && uv3 !== null) {
					var uvArray = [];
					uvArray.push (new JSM.THREE.Vector2 (uv1.x, -uv1.y));
					uvArray.push (new JSM.THREE.Vector2 (uv2.x, -uv2.y));
					uvArray.push (new JSM.THREE.Vector2 (uv3.x, -uv3.y));
					threeGeometry.faceVertexUvs[0].push (uvArray);
				}
			}
		};

		JSM.ExplodeBody (body, materials, explodeData);
		return meshes;
	};

	JSM.ConvertModelToThreeMeshes = function (model, conversionData)
	{
		var meshes = [];
		var materials = model.GetMaterialSet ();
		
		var i, j, body, currentMeshes;
		for (i = 0; i < model.BodyCount (); i++) {
			body = model.GetBody (i);
			currentMeshes = JSM.ConvertBodyToThreeMeshes (body, materials, conversionData);
			for (j = 0; j < currentMeshes.length; j++) {
				meshes.push (currentMeshes[j]);
			}
		}

		return meshes;
	};

	JSM.ConvertJSONDataToThreeMeshes = function (jsonData, textureLoadedCallback, asyncCallbacks)
	{
		function AddMesh (mesh, meshIndex, materials, resultMeshes)
		{
			function AddTriangles (currentTriangles, vertices, normals, uvs, materials, resultMeshes)
			{
				function GetTextureCoordinate (u, v, offset, scale, rotation)
				{
					var result = new JSM.THREE.Vector2 (u, v);
					if (!JSM.IsZero (rotation)) {
						var si = Math.sin (rotation * JSM.DegRad);
						var co = Math.cos (rotation * JSM.DegRad);
						result.x = co * u - si * v;
						result.y = si * u + co * v;
					}
					result.x = offset[0] + result.x * scale[0];
					result.y = offset[1] + result.y * scale[1];
					return result;
				}
			
				var materialIndex = currentTriangles.material;
				var parameters = currentTriangles.parameters;
				var materialData = materials[materialIndex];
				
				var textureName = materialData.texture;
				var textureOffset = materialData.offset;
				var textureScale = materialData.scale;
				var textureRotation = materialData.rotation;
				
				var diffuseColor = new JSM.THREE.Color ();
				var specularColor = new JSM.THREE.Color ();
				var shininess = materialData.shininess || 0.0;

				diffuseColor.setRGB (materialData.diffuse[0], materialData.diffuse[1], materialData.diffuse[2]);
				specularColor.setRGB (materialData.specular[0], materialData.specular[1], materialData.specular[2]);

				if (textureName !== undefined && textureName !== null) {
					diffuseColor.setRGB (1.0, 1.0, 1.0);
					specularColor.setRGB (1.0, 1.0, 1.0);
					
					if (textureOffset === undefined || textureOffset === null) {
						textureOffset = [0.0, 0.0];
					}
					if (textureScale === undefined || textureScale === null) {
						textureScale = [1.0, 1.0];
					}
					if (textureRotation === undefined || textureRotation === null) {
						textureRotation = 0.0;
					}
				}

				if (shininess === 0.0) {
					specularColor.setRGB (0.0, 0.0, 0.0);
					shininess = 1;
				}
				
				var material = new JSM.THREE.MeshPhongMaterial ({
						color : diffuseColor.getHex (),
						specular : specularColor.getHex (),
						shininess : shininess,
						side : JSM.THREE.DoubleSide
					}
				);

				if (materialData.opacity !== 1.0) {
					material.opacity = materialData.opacity;
					material.transparent = true;
				}
				
				if (textureName !== undefined && textureName !== null) {
					var loader = new JSM.THREE.TextureLoader ();
					var theMaterial = material;
					loader.load (textureName, function (texture) {
						texture.image = JSM.ResizeImageToPowerOfTwoSides (texture.image);
						texture.wrapS = JSM.THREE.RepeatWrapping;
						texture.wrapT = JSM.THREE.RepeatWrapping;
						theMaterial.map = texture;
						theMaterial.needsUpdate = true;
						if (textureLoadedCallback !== undefined && textureLoadedCallback !== null) {
							textureLoadedCallback ();
						}
					});
				}
				
				var geometry = new JSM.THREE.Geometry ();

				var v1, v2, v3, n1, n2, n3, u1, u2, u3;
				var lastVertex, lastFace, vertexNormals, textureUVs;
				var j;
				for (j = 0; j < parameters.length; j += 9) {
					v1 = 3 * parameters[j + 0];
					v2 = 3 * parameters[j + 1];
					v3 = 3 * parameters[j + 2];
					n1 = 3 * parameters[j + 3];
					n2 = 3 * parameters[j + 4];
					n3 = 3 * parameters[j + 5];
					u1 = 2 * parameters[j + 6];
					u2 = 2 * parameters[j + 7];
					u3 = 2 * parameters[j + 8];
					
					lastVertex = geometry.vertices.length;
					lastFace = geometry.faces.length;
					
					geometry.vertices.push (new JSM.THREE.Vector3 (vertices[v1 + 0], vertices[v1 + 1], vertices[v1 + 2]));
					geometry.vertices.push (new JSM.THREE.Vector3 (vertices[v2 + 0], vertices[v2 + 1], vertices[v2 + 2]));
					geometry.vertices.push (new JSM.THREE.Vector3 (vertices[v3 + 0], vertices[v3 + 1], vertices[v3 + 2]));
					geometry.faces.push (new JSM.THREE.Face3 (lastVertex + 0, lastVertex + 1, lastVertex + 2));

					vertexNormals = [];
					vertexNormals.push (new JSM.THREE.Vector3 (normals[n1 + 0], normals[n1 + 1], normals[n1 + 2]));
					vertexNormals.push (new JSM.THREE.Vector3 (normals[n2 + 0], normals[n2 + 1], normals[n2 + 2]));
					vertexNormals.push (new JSM.THREE.Vector3 (normals[n3 + 0], normals[n3 + 1], normals[n3 + 2]));
					geometry.faces[lastFace].vertexNormals = vertexNormals;

					if (textureName !== undefined && textureName !== null) {
						textureUVs = [];
						textureUVs.push (GetTextureCoordinate (uvs[u1 + 0], uvs[u1 + 1], textureOffset, textureScale, textureRotation));
						textureUVs.push (GetTextureCoordinate (uvs[u2 + 0], uvs[u2 + 1], textureOffset, textureScale, textureRotation));
						textureUVs.push (GetTextureCoordinate (uvs[u3 + 0], uvs[u3 + 1], textureOffset, textureScale, textureRotation));
						geometry.faceVertexUvs[0].push (textureUVs);
					}
				}

				var mesh = new JSM.THREE.Mesh (geometry, material);
				mesh.originalJsonMaterialIndex = materialIndex;
				mesh.originalJsonMeshIndex = meshIndex;
				resultMeshes.push (mesh);
			}

			var vertices = mesh.vertices;
			if (vertices === undefined) {
				return;
			}

			var normals = mesh.normals;
			if (normals === undefined) {
				return;
			}

			var uvs = mesh.uvs;
			if (uvs === undefined) {
				return;
			}
		
			var triangles = mesh.triangles;
			var i;
			for (i = 0; i < triangles.length; i++) {
				AddTriangles (triangles[i], vertices, normals, uvs, materials, resultMeshes);
			}
		}

		var resultMeshes = [];

		var materials = jsonData.materials;
		if (materials === undefined) {
			return resultMeshes;
		}
		
		var meshes = jsonData.meshes;
		if (meshes === undefined) {
			return resultMeshes;
		}
		
		var i = 0;
		JSM.AsyncRunTask (
			function () {
				AddMesh (meshes[i], i, materials, resultMeshes);
				i = i + 1;
				return true;
			},
			asyncCallbacks,
			meshes.length, 0, resultMeshes
		);

		return resultMeshes;
	};

	return JSM;
});

define('skylark-jsmodeler/extensions/threeviewer/threeviewer',["../../core/jsm"],function(JSM){
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

		this.scene = new JSM.THREE.Scene();
		if (!this.scene) {
			return false;
		}

		var parameters = {
			canvas : this.canvas,
			antialias : true
		};
		this.renderer = new JSM.THREE.WebGLRenderer (parameters);
		if (!this.renderer) {
			return false;
		}
		
		this.renderer.setClearColor (new JSM.THREE.Color (0xffffff));
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
		
		this.camera = new JSM.THREE.PerspectiveCamera (this.cameraMove.fieldOfView, this.canvas.width / this.canvas.height, this.cameraMove.nearClippingPlane, this.cameraMove.farClippingPlane);
		if (!this.camera) {
			return false;
		}
		
		this.scene.add (this.camera);
		return true;
	};

	JSM.ThreeViewer.prototype.InitLights = function ()
	{
		var ambientColor = new JSM.THREE.Color ();
		var diffuseColor = new JSM.THREE.Color ();
		ambientColor.setRGB (this.settings.lightAmbientColor[0], this.settings.lightAmbientColor[1], this.settings.lightAmbientColor[2]);
		diffuseColor.setRGB (this.settings.lightDiffuseColor[0], this.settings.lightDiffuseColor[1], this.settings.lightDiffuseColor[2]);

		this.ambientLight = new JSM.THREE.AmbientLight (ambientColor.getHex ());
		if (!this.ambientLight) {
			return false;
		}

		this.scene.add (this.ambientLight);
		
		this.directionalLight = new JSM.THREE.DirectionalLight (diffuseColor.getHex ());
		if (!this.directionalLight) {
			return false;
		}
		
		var lightPosition = new JSM.THREE.Vector3 ().subVectors (this.cameraMove.eye, this.cameraMove.center);
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
		this.renderer.setClearColor (new JSM.THREE.Color (color));
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
			if (current instanceof JSM.THREE.Mesh) {
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
		var vector = new JSM.THREE.Vector3 (mouseX, mouseY, 0.5);
		vector.unproject (this.camera);
		vector.sub (cameraPosition);
		vector.normalize ();

		var ray = new JSM.THREE.Raycaster (cameraPosition, vector);
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

		var vector = new JSM.THREE.Vector3 (x, y, z);
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
		this.camera.lookAt (new JSM.THREE.Vector3 (this.cameraMove.center.x, this.cameraMove.center.y, this.cameraMove.center.z));

		var lightPosition = new JSM.THREE.Vector3 ().subVectors (this.cameraMove.eye, this.cameraMove.center);
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
		return (threeObj instanceof JSM.THREE.Mesh || threeObj instanceof JSM.THREE.LineSegments || threeObj instanceof JSM.THREE.Points);
	};

	JSM.ThreeViewer.prototype.IsVisibleObject = function (threeObj)
	{
		return this.IsRelevantObject (threeObj) && threeObj.visible;
	};

	return JSM;
});

define('skylark-jsmodeler/main',[
	"skylark-langx/skylark",
	"./core/jsm",
	"./core/timer",
	"./core/algorithm",
	"./core/async",
	"./core/check",
	"./core/jsonloader",
	"./geometry/definitions",
	"./geometry/coord2d",
	"./geometry/coord",
	"./geometry/determinant",
	"./geometry/coordutils",
	"./geometry/matrix",
	"./geometry/coordsystem",
	"./geometry/sector",
	"./geometry/line",
	"./geometry/box",
	"./geometry/sphere",
	"./geometry/transformation",
	"./geometry/plane",
	"./geometry/projection",
	"./geometry/convexhull",
	"./geometry/polygon2d",
	"./geometry/polygon",
	"./geometry/cutpolygon",
	"./geometry/triangulation",
	"./geometry/octree",
	"./geometry/bsptree",
	"./geometry/curves",
	"./geometry/utilities",
	"./geometry/ray",
	"./geometry/path",
	"./modeler/color",
	"./modeler/material",
	"./modeler/materialset",
	"./modeler/body",
	"./modeler/model",
	"./modeler/adjacencyinfo",
	"./modeler/bodyutils",
	"./modeler/textureutils",
	"./modeler/cututils",
	"./modeler/generator",
	"./modeler/camera",
	"./modeler/explode",
	"./modeler/exporter",
	"./modeler/trianglebody",
	"./modeler/trianglemodel",
	"./modeler/converter",
	"./modeler/rayutils",
	"./import/binaryreader",
	"./import/importerutils",
	"./import/importer3ds",
	"./import/importerobj",
	"./import/importerstl",
	"./import/importeroff",
	"./import/importercommon",
	"./renderer/webglutils",
	"./renderer/renderlight",
	"./renderer/rendermaterial",
	"./renderer/rendermesh",
	"./renderer/renderbody",
	"./renderer/shaderprogram",
	"./renderer/renderer",
	"./renderer/pointcloudrenderer",
	"./renderer/renderconverter",
	"./viewer/mouse",
	"./viewer/touch",
	"./viewer/painter",
	"./viewer/drawing",
	"./viewer/navigation",
	"./viewer/softwareviewer",
	"./viewer/spriteviewer",
	"./viewer/viewer",
	"./viewer/pointcloudviewer",
	"./extras/solidgenerator",
	"./extras/extgenerator",
	"./extras/subdivision",
	"./extras/csg",
	"./extras/surfaces",
	"./extensions/svgtomodel/svgtomodel",
	"./extensions/textgenerator/textgenerator",
	"./extensions/threeviewer/threeconverter",
	"./extensions/threeviewer/threeviewer"

],function(skylark,jsm){
	return skylark.attach("intg.jsmodeler",jsm);
});
define('skylark-jsmodeler', ['skylark-jsmodeler/main'], function (main) { return main; });


},this);