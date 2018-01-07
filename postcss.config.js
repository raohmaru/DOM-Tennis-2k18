module.exports = (ctx) => {
	const isProd = ctx.env === 'production';
	return Object.assign({}, ctx.options, {
		map: !isProd,
		plugins: [
			require('postcss-import')(),
			require('postcss-cssnext')(),
			require('css-mqpacker')()
		]
	});
}
