export default class {
	constructor(fps, cb) {
		this._fps = fps;
		this._cb = cb;
		
		this._fpsInterval = 1000 / fps;
		this._frameCount = 0;
		this._currentTime = 0;
		this._prevTime = 0;
	}
	
	get currentFps() {
		return 1000 / (this._currentTime - this._prevTime);
	}

	start() {
		let me = this;
		
		this._startTime = window.performance.now();
		this._then = this._startTime;
		this._onFrame = (currentTime) => me.frame(currentTime);
		this.frame();
	}

	stop() {
		window.cancelAnimationFrame(this._timerID);
		this._cb = null;
		this._onFrame = null;
	}

	frame(currentTime) {
		// calc elapsed time since last loop
		let elapsed = currentTime - this._then;
		this._currentTime = currentTime;
		// if enough time has elapsed, draw the next frame
		if (elapsed > this._fpsInterval) {
			// Get ready for next frame by setting then=currentTime, but...
			// Also, adjust for fpsInterval not being multiple of 16.67
			this._then = currentTime - (elapsed % this._fpsInterval);
			this._cb(currentTime);
			
			this._frameCount++;
			this._prevTime = currentTime;
		}
		
		this._timerID = window.requestAnimationFrame(this._onFrame);
	}
};
