module.exports = function(grunt) {

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
		},

		watch: {
			scripts: {
				files: [
					'*.js',
					'examples/**/*.js',
					'test/**/*.js',
				],
				tasks: ['lint', 'test'],
			},
		}
	});

	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	// Default task(s).
	grunt.registerTask('lint', ['jshint']);
	grunt.registerTask('test', ['mochaTest']);

	grunt.registerTask('default', ['lint', 'test']);
};
