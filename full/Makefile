serve:
	../node_modules/.bin/webpack-dev-server --config webpack.dev.js --progress --watch

build:
	../node_modules/.bin/webpack --config webpack.prod.js --progress

build-dev:
	../node_modules/.bin/webpack --config webpack.dev.js --progress --watch

proxy:
	node ../node_modules/hslayers-ng/lib/proxy.js

bootstrap-isolate:
	cd ../ && node node_modules/hslayers-ng/scripts/bootstrap-isolate.js