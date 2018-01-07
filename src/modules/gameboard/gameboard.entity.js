export default class {
	constructor(view) {
		// view
		this.view   = view;
	}
	
	get width() {
		return this.view.clientWidth;
	}
	
	get height() {
		return this.view.clientHeight;
	}
	
	get top() {
		return this.view.clientTop;
	}
	
	get right() {
		return this.left + this.width;
	}
	
	get bottom() {
		return this.top + this.height;
	}
	
	get left() {
		return this.view.clientLeft;
	}
	
	get offsetTop() {
		return this.view.offsetTop;
	}
	
	get offsetLeft() {
		return this.view.offsetLeft;
	}
};
