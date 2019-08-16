export default class Physics {
	constructor(cfg) {
		this._cfg = cfg;
		this._objects = [];
	}

	addBoundingBox(bbox) {
		this._bbox = bbox;
	}

	addObject(obj) {
		this._objects.push(obj);
		obj.yvel     = 0;
		obj.xvel     = 0;
		obj.momentum = false;
		obj.freeFall = false;
	}

	update() {
		let obj;
		const cfg = this._cfg,
			bbox = this._bbox;

		for (let i = 0; i < this._objects.length; i++) {
			obj = this._objects[i];
			if (!obj.momentum) {
				continue;
			}

			obj.y += obj.yvel;
			if (obj.bottom <= bbox.bottom) {
				obj.yvel += cfg.gravity;
			} else {
				obj.y -= obj.bottom - bbox.bottom;
				obj.yvel *= -cfg.groundFriction;
				if (obj.yvel > -cfg.vSpeedThreshold) {
					obj.y = bbox.bottom - obj.height;
					obj.freeFall = false;
					obj.yvel = 0;
				}
			}

			obj.x += obj.xvel;
			obj.xvel *= cfg.drag;
			if (obj.x < bbox.left) {
				obj.x += bbox.left - obj.x;
				obj.xvel *= -cfg.wallFriction;
			} else if (obj.right > bbox.right) {
				obj.x -= obj.right - bbox.right;
				obj.xvel *= -cfg.wallFriction;
			}
			if (Math.abs(obj.xvel) < cfg.hSpeedThreshold) {
				obj.xvel = 0;
			}

			if (obj.xvel !== 0) {
				obj.rotation += obj.xvel * 2;
			}

			if (obj.yvel === 0 && obj.xvel === 0 && !obj.freeFall) {
				obj.momentum = false;
			}
		}
	}
}
