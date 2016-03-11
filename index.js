/*
Copyright 2016 SRI International

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

'use strict'; // jshint node: true

var g2js = require('./lib/grouping2js')({ strict: true }),
    dae2g = require('./lib/dae2grouping')({ strict: true }),
    s2js = require('./lib/semantic2js')({ strict: true }),
    pretty = require('js-object-pretty-print').pretty,
    beautify_html = require('js-beautify').html;

// public via module.exports
var grouping2html = function(sourceXml) {
    var groupingObj = g2js.grouping2js(sourceXml);

    return groupingObj2html(groupingObj);
};

var groupingObj2html = function(groupingObj) {
    var text = pretty(groupingObj),
        html = simpleText2html(text);

    return { html: html, text: text };
};

var groupingXml2html = function(sourceXml) {
    var text =  beautify_html(sourceXml),
        html = simpleText2html(text);

    return { html: html, text: text };
};

var groupingObj2xml = function(groupingObj) {
    groupingObj = groupingObj || { };

    var groupingXml = '<grouping name="' + groupingObj.name + '">';

    groupingXml = groupsparts2xml(groupingObj, groupingXml);
    return groupingXml + '</grouping>';
};

var semantic2html = function(sourceXml) {
    var semanticObj = g2js.grouping2js(sourceXml);

    return semanticObj2html(semanticObj);
};

var semanticObj2html = function(semanticObj) {
    var text = pretty(semanticObj),
        html = simpleText2html(text);

    return { html: html, text: text };
};

var semanticXml2html = function(sourceXml) {
    var text =  beautify_html(sourceXml),
        html = simpleText2html(text);

    return { html: html, text: text };
};

var semanticObj2xml = function(semanticObj, groupingObj) {
    semanticObj = semanticObj || { };

    var semanticXml = '<?xml version="1.0" encoding="utf-8"?><S3D>',
        eachGroup = function(group) {
            var node = group.node === undefined? '' : ' node="' + group.node + '"';

            semanticXml += '<group name="' + group.name + '"' + node + ' sid="' + group.sid + '" flora_ref="' + group.flora_ref + '"/>';
        },
        eachAssetObj = function(obj) {
            semanticXml += '<object name="' + obj.name + '" node="' + obj.node + '" sid="' + obj.sid + '" flora_ref="' + obj.flora_ref + '"/>';
        };

    for (var p in semanticObj) {
        if (p == 'head') {
            semanticXml += '<head>';
            semanticXml += '<description>' + semanticObj.head.description + '</description>';
            semanticXml += '<author>' + semanticObj.head.author + '</author>';
            semanticXml += '<created>' + semanticObj.head.created + '</created>';
            semanticXml += '<modified>' + semanticObj.head.modified + '</modified>';
            semanticXml += '</head>';
        } else if (p == 'flora_base') {
            semanticXml += '<flora_base id="' + semanticObj.flora_base.id  + '" uri="' + semanticObj.flora_base.uri + '"/>';
        } else if (p == 'semantic_mapping') {
            var assetObj = semanticObj.semantic_mapping.asset;

            semanticXml += '<semantic_mapping>';
            semanticXml += '<asset name="' + assetObj.name + '" uri="' + assetObj.uri + '" sid="' + assetObj.sid + '" flora_ref="' + assetObj.flora_ref + '">';
            assetObj.groups.forEach(eachGroup);
            assetObj.objs.forEach(eachAssetObj);
            semanticXml += '</asset>';
            semanticXml += '</semantic_mapping>';

            if (groupingObj) semanticXml += groupingObj2xml(groupingObj);
        }
    }

    return semanticXml + '</S3D>';
};

// private
var simpleText2html = function(text) {
    var html;

    html =  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>').replace(/\s/g, '&nbsp;');
    return html;
};

var groupsparts2xml = function(groupingObj, groupingXml) {
    var eachGroup = function(group) {
        groupingXml += '<group name="' + group.name + '"';

        if (group.node) {
            groupingXml += ' node="' + group.node + '">';
        } else {
            groupingXml += '>';
        }

        groupingXml = groupsparts2xml(group, groupingXml);
        groupingXml += '</group>';
    },
    eachPart = function(part) {
        groupingXml += '<part node="' + part + '"/>';
    };

    for (var p in groupingObj) {
        if (p == 'groups') {
            groupingObj.groups.forEach(eachGroup);
        } else if (p == 'parts') {
            groupingObj.parts.forEach(eachPart);
        }
    }

    return groupingXml;
};

module.exports = {
    g2js: g2js.grouping2js,
    g2html: grouping2html,
    go2html: groupingObj2html,
    go2xml: groupingObj2xml,
    gx2html: groupingXml2html,
    dae2g: dae2g.dae2grouping,
    s2js: s2js.semantic2js,
    s2html: semantic2html,
    so2html: semanticObj2html,
    so2xml: semanticObj2xml,
    sx2html: semanticXml2html,
    emptySjs: {
        head: {
            description: undefined,
            author: undefined,
            created: undefined,
            modified: undefined
        },
        flora_base: {
            id: undefined,
            uri: undefined
        },
        semantic_mapping: {
            asset: {
                name: undefined,
                uri: undefined,
                sid: undefined,
                flora_ref: undefined,
                groups: [ ], // { name:, node:, sid:, flora_ref: }, ...
                objs: [ ] // { name:, node:, sid:, flora_ref: }, ...
            }
        }
    },
    s3dParser: g2js.parser,
    daeParser: dae2g.parser
};

if (typeof window !== 'undefined') {
  window.G2JS = module.exports; // jshint undef: false
}
