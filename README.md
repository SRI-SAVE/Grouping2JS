# Grouping2JS (G2JS)

Convert COLLADA (dae) scene to grouping JavaScript and s3d xml. Convert source s3d grouping xml to a javascript object.

# Install
```
$ git clone https://github.com/SRI-SAVE/Grouping2JS.git
$ npm install
```

# Build (Browser)
```
$ npm run build => minified and map source (g2js.min.js and g2js.js.map)
$ npm run source => source bundle (g2js.bundle.js)
```

# JSHint
```
$ npm run lint
```

# Test
```
$ npm run test
```

# Usage
```
Browser:
<script src="dist/g2js.min.js"></script>

Nodejs:
$ node -e "var G2JS = require('./index'), groupingObj = G2JS.g2js('<grouping name=\"asset\"/>'); console.log(groupingObj);"
// => { name: 'asset' }

or

var G2JS = require('Grouping2JS'); // once cloned to your node_modules or installed
console.log(G2JS.g2js('<grouping name="asset"/>'));
// => { name: 'asset' }
```
