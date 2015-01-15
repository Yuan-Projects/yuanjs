module.exports = function (grunt) {

  var srcFiles = [
    'src/open.js',
    'src/debugger.js',
    'src/deferred.js',
    'src/helper.js',
    'src/ajax.js',
    'src/dom.js',
    'src/events.js',
    'src/fixup.js',
    'src/data.js',
    'src/domEvents.js',
    'src/css.js',
    'src/close.js'
  ];

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      files: srcFiles,
      tasks: ['default']
    },
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
        banner: '/*! <%= pkg.name %> v<%= pkg.version %> */\n'
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
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Tasks
  grunt.registerTask('default', ['concat', 'jshint', 'uglify']);
};
