export default class {
	constructor(view) {
		// view
		this.view      = view;
		// props
		this.top    = view.clientTop;
		this.left   = view.clientLeft;
		this.width  = view.clientWidth;
		this.height = view.clientHeight;
		this.bottom = this.top + this.height;
		this.right  = this.left + this.width;
	}
};
