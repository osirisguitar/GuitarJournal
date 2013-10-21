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
				src: ['app/libs/**/*.js','app/controllers/*.js','app/services/*.js', 'app/js/nonbounce.js'],
				dest: 'app/compiled/all.js'
			},
			css: {
				src: ['app/css/flatly.css','app/css/font-awesome.min.css', 'app/libs/**/*.css', 'app/css/guitarjournal.css'],
				dest: 'app/compiled/all.css'
			}
		},

		watch: {
			jsandcss: {
				files: ['app/controllers/*.js','app/services/*.js','app/libs/**/*.js', 'app/js/*.js', 'app/css/flatly.css','app/css/font-awesome.min.css', 'app/css/guitarjournal.css', 'app/libs/**/*.css'],
				tasks: ['concat']
			},
			less: {
				files: ['app/css/*.less'],
				tasks: ['less']
			},
			bootswatch: {
				files: ['bootswatch/flatly/bootstrap.css'],
				tasks: ['copy:flatly']
			},
			manifest: {
				files: ['app/compiled/*.*', 'app/home.html'],
				tasks: ['manifest']
			}
		},

		copy: {
			flatly: {
				src: 'bootswatch/flatly/bootstrap.css',
				dest: 'app/css/flatly.css'
			}
		},

		/*less: {
			src: 'app/css/*.less',
			dest: 'app/css/bootstrap.min.css'
		},*/

		manifest: {
  			generate: {
			    options: {
			      basePath: "app/",
			      network: ["*"],
			      preferOnline: false,
			      timestamp: true,
			      hash: false,
			      cache: ["http://ajax.googleapis.com/ajax/libs/angularjs/1.1.5/angular.min.js",
			      	"http://ajax.googleapis.com/ajax/libs/angularjs/1.1.5/angular-cookies.min.js"]
			    },
			    src: [
			        "home.html",
			        "compiled/*.js",
			        "compiled/*.css",
			        "img/*.png",
			        "font/**.*",
			    ],
			    dest: "app/manifest.appcache"
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-manifest');
	grunt.loadNpmTasks('grunt-recess');
};