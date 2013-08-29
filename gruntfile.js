module.exports = function(grunt) {
	grunt.initConfig({
		jshint: {
			// define the files to lint
			files: ['gruntfile.js', 'app/**/*.js', 'test/**/*.js'],
			// configure JSHint (documented at http://www.jshint.com/docs/)
			options: {
				// more options here if you want to override JSHint defaults
				globals: {
					jQuery: true,
					console: true,
					module: true
				}
			}
		},

		concat: {
			options: {

			},
			javascripts: {
				src: ['app/controllers/*.js','app/services/*.js','app/libs/**/*.js', 'app/js/*.js'],
				dest: 'app/all.js'
			},
			css: {
				src: ['app/css/bootstrap.min.css','app/css/guitarjournal.css', 'app/libs/**.css'],
				dest: 'app/all.css'
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');
};