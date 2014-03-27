#!/usr/bin/env node

var pkg = require('./package.json');
var fs = require('fs');
var hint = require("jshint").JSHINT;
var uglify = require('uglify-js');

var banner = '/* YuanJS v' + pkg.version + ' ~ (c) 2013-' + (new Date().getFullYear()) + ' Kang CHEN */\n';

var releases = {

  yuanjs: {
    files: [
      'deferred.js',
      'helper.js',
      'ajax.js',
      'dom.js',
      'events.js'
    ],
  },

};

var args = process.argv.slice(2);
if ( !args.length ) {
  args = ['yuanjs'];
}

args.forEach(function (release) {
  if ( !(release in releases) ) {
    console.log('Unrecognized release: ' + release);
    return;
  }

  console.log('Building release: ' + release);
  build(release);
});

function build (release) {
  console.log('release:', release);
  var out = '';
  var fileList = ['open.js'];
  fileList = fileList.concat(releases[release].files);
  fileList.push('close.js');
  
  out = banner + fileList.map(function(filePath){
    return fs.readFileSync('src/' + filePath, 'utf-8');
  }).join('');
  
  // Update version
  out = out.replace('/* VERSION */', pkg.version);
  
  // Write build file
  var buildFile = './build/yuan.js';
  fs.writeFileSync(buildFile, out);
  
  // Write dist file
  var distFile = buildFile.replace('/build/', '/dist/').replace('.js', '-min.js');
  out = uglify.minify(out, { fromString: true });
  fs.writeFileSync(distFile, banner + out.code);
}