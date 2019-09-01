import * as env  from '../../js/env.js';
import * as CNT from '../../js/const.js';

const
	DURATION     = 45,
	OPACITY_INCR = 0.02,
	SCALE_INCR   = 0.05,
	SCALE_MULT   = 200;

export function Score(view, core) {
	// props
	let _current = 0,
		_last = core.st.getItem(CNT.LS_TOP_SCORE) || 0,
		_visible = false,
		_timer   = 0,
		_opacity = 0,
		_scale   = 0,
		_dur;

	core.v.on(clear, CNT.EV_CLEAR_RANKING);

	function render() {
		if (_visible) {
			if (_timer++ < _dur) {
				let cssStr = 'display: block;';

				if (_scale < 1) {
					_scale += SCALE_INCR;
				}
				cssStr += `transform: perspective(500px) translateZ(${_scale * SCALE_MULT}px);`;

				if (!env.isTouch) {
					if (_opacity < 1) {
						_opacity += OPACITY_INCR;
					}
					cssStr += `opacity: ${_opacity};`;
				}

				view.style.cssText = cssStr;
			} else {
				view.style.display = 'none';
				_visible = false;
			}
		}
		return this;
	}

	function update(txt, style, newDur) {
		if (style) {
			const html = `<span class="score--${style}">${txt}</span>`;
			view.innerHTML = html;
		} else {
			view.textContent = txt || _current;
		}

		_dur = newDur || DURATION;
		_timer   = 0;
		_opacity = 0;
		_scale   = 0;
		_visible = true;
		return this;
	}

	function add(num) {
		_current += num;
		return this;
	}

	function reset() {
		if (_current > _last) {
			update('Top!');
			_last = _current;
		} else if (_current) {
			update('ohh');
		}
		_current = 0;
	}

	function clear() {
		_last = 0;
	}

	return {
		reset,
		add,
		update,
		render,
		getCurrent() {
			return _current;
		}
	};
};
