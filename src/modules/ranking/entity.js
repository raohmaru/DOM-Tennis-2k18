export default class {
	constructor(view) {
		// view
		this.view      = view;
		this.viewItems = [].slice.apply(view.querySelectorAll('.ranking__list li'));
		// props
		this.items = [];
	}

	update(count) {
		if ((count && !this.items[0]) || count > this.items[0]) {
			this.items.unshift(count);
			for (let i = 0; i < this.items.length; i++) {
				this.viewItems[i].innerHTML = this.items[i];
			}
		}
	}

	clear() {
		this.items.length = 0;
		this.viewItems.forEach(item => {
			item.innerHTML = '';
		});
	}
};
