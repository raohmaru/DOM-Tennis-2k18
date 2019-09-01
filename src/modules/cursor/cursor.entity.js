export class Cursor {
	constructor(view, gameboard) {
		// view
		this.view   = view;
		this.offset = gameboard.offset;
		this.tid = undefined;
		this.visible = true;
		// props
		this.y      = 0;
		this.x      = 0;
		// cached props
		this._y     = 0;
		this._x     = 0;

		window.addEventListener('mousemove', this.mouseMoveHandler.bind(this));
	}

	render() {
		if (this.x !== this._x || this.y !== this._y) {
			this._y = this.y;
			this._x = this.x;
			this.view.style.cssText = `transform: translate3d(${this.x}px, ${this.y}px, 0);`;
		} else {
			if (!this.tid) {
				this.tid = window.setTimeout(this.fadeOut.bind(this), 100);
			}
		}
	}

	mouseMoveHandler(e) {
		this.x = e.clientX - this.offset.left;
		this.y = e.clientY - this.offset.top;
		if (this.tid) {
			window.clearTimeout(this.tid);
			this.tid = undefined;
		}
		if (!this.visible) {
			this.fadeIn();
		}
	}

	fadeOut() {
		this.view.classList.add('cursor--fadeout');
		this.visible = false;
	}

	fadeIn() {
		this.view.classList.remove('cursor--fadeout');
		this.visible = true;
	}
};
