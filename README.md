# HSLayers-NG examples
Repository containing general examples on how to use hslayers-ng.

Each folder contains one standalone example.

Examples listed in index.html can be viewed online at http://ng.hslayers.org/examples/

Examples for HSLayers-NG version 1 are in branch 'hsl1':
`git checkout hsl1`

Examples for HSLayers-NG version >2 are in branch 'master':
`git checkout master`

The current development version which is not yet published is in 'develop':
`git checkout develop` The version number lags behind in this case because it is incremented on publish only. 


## Proxy

To be able to access services on other domains you need a proxy. You can use hslayers-server for that.
To prepare environment variables for proxy run `make prepare-server` or `cp node_modules/hslayers-server/.env.example node_modules/hslayers-server/.env` directly and edit the .env file contents accordingly if needed.

To run launch: `npm run start-server`
