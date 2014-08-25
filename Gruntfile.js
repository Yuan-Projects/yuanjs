module.exports = function (grunt) {

  var srcFiles = [
    'src/open.js',
    'src/debugger.js',
    'src/deferred.js',
    'src/helper.js',
    'src/ajax.js',
    'src/dom.js',
    'src/events.js',
    'src/domEvents.js',
    'src/close.js'
  ];

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      options: {
        newcap:false
      },
      all: ['build/yuan.js']
    },
    concat: {
      dist: {
        src: srcFiles,
        dest: 'build/yuan.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'build/yuan.js',
        dest: 'build/yuan.min.js'
      }
    }
  });

  // Load all the plugins.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // Tasks
  grunt.registerTask('default', ['concat', 'jshint', 'uglify']);
};