export default class Signal {
	constructor() {
		this._listeners = [];
		this._namedListeners = {};
	}

	then(callback) {
		this._listeners.push(callback);
	}

	on(callback, name) {
		if (!this._namedListeners[name]) {
			this._namedListeners[name] = [];
		}
		this._namedListeners[name].push(callback);
	}

	emit(...args) {
		let i = this._listeners.length;
		while (i-- > 0) {
			this._listeners[i](...args);
		}
		if (this._namedListeners[args[0]]) {
			let cbs = this._namedListeners[args[0]];
			i = cbs.length;
			while (i-- > 0) {
				cbs[i](...args.slice(1));
			}
		}
	}

	remove(callback) {
		this._listeners = this._listeners.filter((func) => func !== callback);
		for (var name in this._namedListeners) {
			if (Object.prototype.hasOwnProperty(this._namedListeners, name)) {
				this._namedListeners[name] = this._namedListeners[name].filter((func) => func !== callback);
			}
		}
	}

	clear() {
		this._listeners.length = 0;
		this._namedListeners = {};
	}
};
