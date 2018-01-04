const now = Date.now;

const throttle = (func, wait) => {
	let lastCallTime = 0,
		timerId;
	
	const newFunc = (...args) => {
		const time = now();
		
		if(time > lastCallTime + wait) {
			func(...args);
			lastCallTime = time;
		}
	}
	
	return newFunc;
};

export default {
	throttle
};
