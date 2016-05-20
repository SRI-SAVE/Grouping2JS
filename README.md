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

# Reference
COLLADA represents a 3D scene(s) in a XML hierarchy. G2JS is used to convert the COLLADA scene into a grouping XML hierarchy for the semantic 3D (S3D) format. The SAVE tooling uses this format on the server in the SAVE backend. The S3D format is documented in the SAVE documentation; However, it primarily maps 3D objects to semantic objects. Examples of the files are included below.

The G2JS module can convert the COLLADA scene into an XML grouping hierarchy which the SAVE tooling uses. The SAVE tooling needs the static mesh pieces of the scene and their names. This is so the annotation tool can display a list of names for mapping to semantic objects. It also is used in the client for parenting parts of the scene or re-parenting a mesh into a group. The need arises when a semantic object is mapped to a group of objects rather than a single mesh or node.

First the COLLADA scene from the DAE is converted into a grouping XML object.

COLLADA library_scene node Example:
```
<library_visual_scenes>\
    <visual_scene id="VisualSceneNode" name="ShootingRange_05">
        <node id="enviroment" name="enviroment" type="NODE">
            <node id="grass" name="grass" type="NODE">
            </node>
            <node id="tree_line" name="tree_line" type="NODE">
            </node>
            <node id="e" name="e" type="NODE">
                <node id="g" name="g" type="NODE">
                </node>
                <node id="t" name="t" type="NODE">
                </node>
            </node>
        </node>
        <node id="aaa" name="aaa" type="NODE">
        </node>
        <node id="bbb" name="bbb" type="NODE">
        </node>
        <node id="zzz" name="zzz" type="NODE">
            <node id="xxx" name="xxx" type="NODE">
            </node>
            <node id="yyy" name="yyy" type="NODE">
            </node>
        </node>
    </visual_scene>
</library_visual_scenes>
```
S3D Grouping Example:
```
<grouping name="ShootingRange">
    <group name="environment" node="environment">
        <part node="grass"/>
        <part node="tree_line"/>
    </group>
    <group name="environment">
        <part node="grass"/>
        <part node="tree_line"/>
    </group>
</grouping>
```
The grouping is a structure with group and part elements. Each has attributes for node and name. Name is a custom name if desired and the annotation tool is used to edit the name. Note this is a feature that has not been implemented. The node attribute comes from the source DAE. Group and part represent tree branches and leafs.

Either a group or a part can be mapped to a semantic object. The mapping is maintained in the semantic_mapping element of the S3D.

Complete S3D example:
```
<?xml version="1.0" encoding="utf-8"?>
<!-- Copyright 2015, SRI International -->
<S3D>
    <head>
        <description>Semantic 3D mapping file for: Shooting Range environment</description>
        <author>cgreuel</author>
        <created>2014-08-13</created>
        <modified>2014-11-13</modified> <!-- John Pywtorak -->
    </head>
    <flora_base id="M4_ont" uri="../../../knowledge/weapons/M4/m4.flr" />
    <semantic_mapping>
        <asset name="ShootingRange" uri="/SAVE/models/environments/range/ShootingRange.dae" sid="M4_ont" flora_ref="ShootingRange">
            <group name="environment" node="environment" sid="M4_ont" flora_ref="BoltCarrierGroup" />
            <group name="Meta Group" sid="M4_ont" flora_ref="Meta" />
            <object name="targets" node="targets" sid="M4_ont" flora_ref="ShootingTarget" />
            <object name="grass" node="grass" sid="M4_ont" flora_ref="Grass" />
        </asset>
    </semantic_mapping>
    <grouping name="ShootingRange">
        <group name="environment" node="environment">
            <group name="Meta Group"/>
            <part node="targets"/>
            <part node="grass"/>
        </group>
    </grouping>
</S3D>
```

G2JS has a number of utility functions.

```
var g2js = require('../index.js'),
    grouping2js = g2js.g2js, // converts grouping to json
    dae2grouping = g2js.dae2g, // converts COLLADA DAE to goruping XML
    grouping2html = g2js.g2html, // converts grouping to html for easy reading and debugging
    groupingObj2html = g2js.go2html, // converts json goruping object to html
    groupingObj2xml = g2js.go2xml, // converts json grouping to XML grouping
    groupingXml2html = g2js.gx2html, // converts grouping XML to HTML
    semantic2js = g2js.s2js, // converts S3D to json
    semanticObj2xml = g2js.so2xml, // converts json semantic object to XML
    semanticObj2html = g2js.so2html, // converts json semantic object to HTML
    semanticXml2html = g2js.sx2html, // converts semantic XML to HTML
    s3dp = g2js.s3dParser, // semantic parser api access
    daep = g2js.daeParser; // COLLADA DAE parser api access
```
NOTE: Parser access could be used to set an error callback or changing the SAX handlers for attributes or tags, etc.
