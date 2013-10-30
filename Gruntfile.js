var path = require('path');

module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-test');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      options: {
        '-W097': true
      },
      files: [
        '*.js',
        'examples/**/*.js',
        'test/**/*.js',
      ]
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    }
  });

  // Default task(s).
  grunt.registerTask('lint', ['jshint']);
  grunt.registerTask('test', ['mochaTest']);

  grunt.registerTask('default', ['lint', 'test']);

};
