
// - - - - - - - - - - Configuration - - - - - - - - - -
/**
 * If you want to make the app high-res mode for your app.
 * It could mess up when you dynamically assigns the resolution!
 */
var highDPI = true;
/**
 * Assign your server URL address here!
 */
var webSocketAddress = "ws://192.168.1.200:8080";

/**
 * GMClient JavaScript
 * By SysError99
 * 
 * Released under GPLv3 License.
 */ 
/**
 * Audio variable
 */
var audio = null;
/**
 * Network events
 */
 var events = [];
/**
 * Full screen parameter.
 */
var fullScreenObj = {lock: false};
/**
 * Network socket
 */
var network = null;
/**
 * Touch events.
 */
 var touch = {
	canvas: undefined,
	roomWidth: 1,
	roomHeight: 1,
	loop: -1
};
var touches = [];
var touch_log = {};

// - - - - - - - - - - Audio - - - - - - - - - -
/**
 * Play audio file.
 * @param {string} file Audio file location.
 */
 function audioPlay(file) {
	audio = new Audio(file);
	audio.loop = true;
	audio.play();
}

/**
 * Stop audio play.
 */
function audioStop() {
	if (audio!=null) {
		audio.pause();
		audio.currentTime = 0;
	}
}

// - - - - - - - - - - Browser - - - - - - - - - -
/**
 * Reload the page
 */
 function browserReload() {
	window.location.reload();
}

/**
 * Show system alert dialog
 * @param {string} str text string
 */
 function dialogAlert(str) {
	if (isApp() === 0) {
		fullScreenObj.lock = true;
		closeFullScreen();
		alert(str);
		fullScreenObj.lock = false;
		fullScreen();
	} else
		App.alert(str);
}

/**
 * Show confirmation dialog
 * @param {string} name Name of data to be returned.
 * @param {string} str String of hint text
 */
function dialogConfirm(name,str) {
	var input;

	if (isApp() === 0) {
		fullScreenObj.lock = true;
		closeFullScreen();

		input = prompt(str);

		fullScreenObj.lock = false;
		fullScreen();
	} else {
		App.confirm(name,str);
		input = "";
	}
}

/**
 * Show system prompt dialog.
 * @returns String of result or empty string.
 */
function dialogPrompt(name, str) {
	var input;

	if (isApp() === 0) {
		fullScreenObj.lock = true;
		closeFullScreen();
		input = prompt(str);
		fullScreenObj.lock = false;
		fullScreen();
	} else {
		App.prompt(name,str);
		input = "";
	}

	return input;
}

/**
 * Go fullscreen!
 * @returns {number} is it fullscreen?
 */
 function fullScreen() {
	if (isApp() === 0) {
		if (!fullScreenObj.lock) {
			var canvas = document.getElementById("canvas");

			if (canvas.requestFullscreen)
				canvas.requestFullscreen();
			else if (canvas.mozRequestFullScreen)
				canvas.mozRequestFullScreen();
			else if (canvas.webkitRequestFullscreen)
				canvas.webkitRequestFullscreen();
			else if (canvas.msRequestFullscreen)
				canvas.msRequestFullscreen();

            return isFullScreen();
		} else
            return 1;
	}

    return 1;
}

/**
 * Exit full screen
 */
function closeFullScreen() {
	if (document.exitFullscreen)
		document.exitFullscreen();
	else if (document.mozCancelFullScreen)
		document.mozCancelFullScreen();
	else if (document.webkitExitFullscreen)
		document.webkitExitFullscreen();
	else if (document.msExitFullscreen)
		document.msExitFullscreen();
}

/**
 * Check fullscreen status.
 * @returns {number} is it fullscreen?
 */
function isFullScreen() {
	return window.innerWidth / screen.width > 0.975 && window.innerHeight / screen.height > 0.975;
}

// - - - - - - - - - - Local Storage - - - - - - - - - -
/**
 * Load data stored on device. (string only)
 * @param {string} loc Data location.
 * @returns {string} Data received.
 */
 function loadData(loc) {
	var dt = "";

	if (isApp()===0){
		var d=localStorage.getItem(loc)

		if (d!=null)
			dt=d;
	} else
		dt=App.loadData(loc);

	return dt;
}

/**
 * Save data to device.
 * @param {string} loc Data location.
 * @param {string} data Data to be saved.
 */
function saveData(loc,data) {
	if (isApp() === 0)
		localStorage.setItem(loc,data);
	else
		App.saveData(loc,data);
}

// - - - - - - - - - - Networking - - - - - - - - - -

/**
 * Connect to server.
 */
function networkOpen(){
	network = new WebSocket(webSocketAddress);
	network.addEventListener("open", function(){
		events.push("connected");
	});
	network.addEventListener("message", function(e){
		events.push(e.data);
	});
	network.addEventListener("error",function(){
		events.push("error");
		network.close();
	});
	network.addEventListener("close", function(){
		events.push("close");
	});
}

/**
 * Get a network event.
 */
function networkReceive() {
	if (events.length > 0)
		return events.shift();
	else
		return "";
}

/**
 * Send a message to the server.
 * @param {string} data JSON string
 */
function networkSend(data) {
	if (network !== null)
		if (network.readyState === 1)
			network.send(data);
}

// - - - - - - - - - - SysError99's WebApp check - - - - - - - - - -
/**
 * Is this app?
 * @returns {number} Is is an application, or browser (0)
 */
 function isApp() {
	if (typeof App !== "undefined")
		return 1; 

	return 0;
}

// - - - - - - - - - - Multi-Touch - - - - - - - - - -
/**
 * Start Touch API.
 * @param {number} roomwidth Room width.
 * @param {number} roomheight Room Height.
 */
function touchInvoke(roomwidth,roomheight) {
    if (typeof touch.canvas === "undefined") {
        touch.canvas = document.getElementById("canvas");
        touch.canvas.addEventListener("touchstart", function(touchEvent) {
            var rect = touch.canvas.getBoundingClientRect();

            for (var touchIndex = 0; touchIndex < touchEvent.changedTouches.length; touchIndex++) {
                var touchObj = touchEvent.changedTouches[touchIndex];

                touches.push({
                    id: touchObj.identifier,
                    start: false,
                    left: rect.left,
                    top: rect.top,
                    right: rect.right,
                    bottom: rect.bottom,
                    x: touchObj.clientX,
                    y: touchObj.clientY,
                    end: false,
                    clean: false,
                });
            }

            touchEvent.preventDefault();
        }, false);
        touch.canvas.addEventListener("touchmove", function(touchEvent) {
            var rect = touch.canvas.getBoundingClientRect();

            for (var touchIndex = 0; touchIndex < touchEvent.changedTouches.length; touchIndex++) {
                var touchObj = touchEvent.changedTouches[touchIndex];

                for (var activeTouchObjectIndex = 0; activeTouchObjectIndex < touches.length; activeTouchObjectIndex++) {
                    if (touches[activeTouchObjectIndex].id === touchObj.identifier) {
                        touches[activeTouchObjectIndex].left = rect.left;
                        touches[activeTouchObjectIndex].top = rect.top;
                        touches[activeTouchObjectIndex].right = rect.right;
                        touches[activeTouchObjectIndex].bottom = rect.bottom;
                        touches[activeTouchObjectIndex].x = touchObj.clientX;
                        touches[activeTouchObjectIndex].y = touchObj.clientY;
                        activeTouchObjectIndex = touches.length;
                    }
                }
            }

            touchEvent.preventDefault();
        }, false);
        touch.canvas.addEventListener("touchend", function(touchEvent) {
            for (var touchIndex = 0; touchIndex < touchEvent.changedTouches.length; touchIndex++) {
                var touchObj = touchEvent.changedTouches[touchIndex];

                for (var activeTouchObjectIndex = 0; activeTouchObjectIndex < touches.length; activeTouchObjectIndex++) {
                    if (touches[activeTouchObjectIndex].id === touchObj.identifier) {
                        touches[activeTouchObjectIndex].end = true;
                        break;
                    }
                }
            }

            touchEvent.preventDefault();
        }, false);
    }
	touch.roomWidth = Math.floor(roomwidth);
	touch.roomHeight = Math.floor(roomheight);
}

/**
 * Retreive a touch event.
 */
function touchStart() {
	var touchId = -1;

	for (var touchIndex = 0; touchIndex < touches.length; touchIndex++) {
		if (touches[touchIndex].start === false) {
			touches[touchIndex].start = true;
			touchId = touchIndex;
			break;
		}
	}

	return touchId;
}

/**
 * Retreive a continuous touch event.
 */
function touchMove() {
    if (touches.length > 0) {
        if (touch.loop < touches.length - 1)
            touch.loop++;
        else
            touch.loop = -1;
    } else
		touch.loop = -1;

	return touch.loop;
}

/**
 * Retreive a touch end event.
 */
function touchEnd() {
	var touchId = -1;

	for (var touchIndex = 0; touchIndex < touches.length; touchIndex++) {
        var touchObj = touches[touchIndex];

		if (touchObj.end === true && touchObj.clean === false) {
            touchObj.clean = true;
			touchId = touchIndex;
			break;
		}
	}

	return touchId;
}

/**
 * Retreive X-coordinate of a touch.
 * @param {number} touchId ID of a touch.
 * @returns {number} X-coordinate of a touch.
 */
function touchX(touchId) {
    var touchObj = touches[touchId];
    var touchResult = -1;

	if (typeof touchObj !== "object")
        touchObj = null;

    if (touchObj !== null)
        touchResult = Math.floor((touchObj.x - touchObj.left) / (touchObj.right - touchObj.left) * touch.roomWidth);

    return touchResult;
}

/**
 * Retreive Y-coordinate of a touch.
 * @param {number} touchId ID of a touch.
 * @returns {number} Y-coordinate of a touch.
 */
function touchY(touchId) {
	var touchObj = touches[touchId];
    var touchResult = -1;

	if (typeof touchObj !== "object")
        touchObj = null;

    if (touchObj !== null)
        touchResult = Math.floor((touchObj.y - touchObj.top) / (touchObj.bottom - touchObj.top) * touch.roomHeight);

    return touchResult;
}

/**
 * Cleanup touch API.
 */
function touchClean() {
    for (var touchIndex = 0; touchIndex < touches.length; touchIndex++) {
        var touchObj = touches[touchIndex];

		if (touchObj.clean === true) {
            touches.splice(touchIndex,1);
            touchIndex--;
        }
    }
}

// - - - - - - - - - configure DPI - - - - - - - - -
if (highDPI) {
	var viewport = document.querySelector("meta[name=viewport]");

	viewport.setAttribute("content", "user-scalable=no, initial-scale=0.75, maximum-scale=1, minimum-scale=0.75, width=device-width, height=device-height, target-densitydpi=device-dpi");
}