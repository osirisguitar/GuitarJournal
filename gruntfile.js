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
		}

		concat: {
			files: [  ],
			options: {

			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
};