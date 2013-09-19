module.exports = function(grunt) {
	grunt.initConfig({
		jshint: {
			// define the files to lint
			files: ['gruntfile.js', 'app/controllers/*.js', 'app/services.js', 'app.js', '/app/app.js'],
			// configure JSHint (documented at http://www.jshint.com/docs/)
			options: {
				// more options here if you want to override JSHint defaults
				smarttabs:true,
				"-W099": true,
				globals: {
					jQuery: true,
					console: true,
					module: true,
				}
			}
		},

		concat: {
			options: {

			},
			javascripts: {
				src: ['app/libs/**/*.js','app/controllers/*.js','app/services/*.js',/*, 'app/js/*.js'*/],
				dest: 'app/compiled/all.js'
			},
			css: {
				src: ['app/css/bootstrap.min.css','app/css/font-awesome.min.css', 'app/css/guitarjournal.css', 'app/libs/**/*.css'],
				dest: 'app/compiled/all.css'
			}
		},

		watch: {
			jsandcss: {
				files: ['app/controllers/*.js','app/services/*.js','app/libs/**/*.js', 'app/js/*.js', 'app/css/bootstrap.min.css','app/css/font-awesome.min.css', 'app/css/guitarjournal.css', 'app/libs/**/*.css'],
				tasks: ['concat']
			},
			less: {
				files: ['app/css/*.less'],
				tasks: ['less']
			}
		},

		less: {
			src: 'app/css/*.less',
			dest: 'app/css/bootstrap.min.css'
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-less');
};