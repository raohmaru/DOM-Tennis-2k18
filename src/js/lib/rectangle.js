export default class Rectangle {
	constructor(width, height, x, y) {
		this.update(width, height, x, y);
	}

	get width() {
		return this._width;
	}

	get height() {
		return this._height;
	}

	get top() {
		return this._y;
	}

	get right() {
		return this._x + this._width;
	}

	get bottom() {
		return this._y + this._height;
	}

	get left() {
		return this._y;
	}

	get area() {
		const a = this._width * this._height;
		return a > 0 ? a : 0;
	}

	update(width, height, x = 0, y = 0) {
		this._width  = width;
		this._height = height;
		this._x      = x;
		this._y      = y;
	}

	clone() {
		return new Rectangle(this._width, this._height, this._x, this._y);
	}
}
