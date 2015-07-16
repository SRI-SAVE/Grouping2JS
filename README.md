# Grouping2JS (G2JS)

Convert COLLADA (dae) scene to grouping JavaScript and s3d xml. Convert source s3d grouping xml to a javascript object.

# Install
```
$ git clone https://github.com/SRI-SAVE/Grouping2JS.git
$ npm install
```

# Build (Browser)
```
$ build.sh

or

node_modules/.bin/browserify index.js -o dist/g2js.bundle.js
```

# Test
```
$ node test/test-nodejs.js
```

# Usage
```
Browser:
<script src="dist/g2js.bundle.js"></script>

Nodejs:
$ node -e "var G2JS = require('./index'), groupingObj = G2JS.g2js('<grouping name=\"asset\"/>'); console.log(groupingObj);"
// => { name: 'asset' }

or

var G2JS = require('Grouping2JS'); // once placed in your node_modules
console.log(G2JS.g2js('<grouping name="asset"/>'));
// => { name: 'asset' }
```
