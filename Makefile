link-all:
	npm link hslayers-ng --force && npm link hslayers-ng-app --force && npm link hslayers-cesium --force && npm link hslayers-cesium-app --force

prepare-server:
	cp node_modules/hslayers-server/.env.example node_modules/hslayers-server/.env