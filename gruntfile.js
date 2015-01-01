module.exports = function(grunt) {
	grunt.initConfig({
		jshint: {
			// define the files to lint
			files: ['gruntfile.js', 'app/controllers/*.js', 'app/services/*.js', 'app.js', 'app/app.js', 'api/**/*.js', 'app/test/**/*.js'],
			// configure JSHint (documented at http://www.jshint.com/docs/)
			options: {
				// more options here if you want to override JSHint defaults
				smarttabs:true,
				"-W099": true,
				node: true,
				globals: {
					jQuery: true,
					console: true,
					module: true,
					describe: true,
					xdescribe: true,
					beforeEach: true,
					afterEach: true,
					it: true,
					xit: true
				},
				reporter: require("jshint-stylish")
			},
		},

		concat: {
			options: {

			},
			javascripts: {
				src: ['app/libs/**/*.js','app/controllers/*.js','app/services/*.js'],
				dest: 'app/compiled/all.js'
			},
			css: {
				src: ['app/css/flatly.css','app/css/spinner.css', 'app/css/font-awesome.min.css', 'app/libs/**/*.css', 'app/css/guitarjournal.css'],
				dest: 'app/compiled/all.css'
			}
		},

		mocha: {
			testapp: {
				src: ['app/test/unit/*.html'],
				options: {
					run: true,
					log: true,
					logErrors: true,
					reporter: 'Spec'
				}
			}
		},

		mochaTest: {
			testapi: {
				src: ['api/test/unit/**/*.js'],
				options: {
					run: true,
					log: true,
					logErrors: true,
					reporter: 'spec'
				}
			}
		},

		watch: {
			jsandcss: {
				files: ['app/controllers/*.js','app/services/*.js','app/libs/**/*.js', 'app/js/*.js', 'app/css/flatly.css','app/css/font-awesome.min.css', 'app/css/guitarjournal.css', 'app/libs/**/*.css'],
				tasks: ['concat', 'test', 'mochaTest']
			},
			tests: {
				files: ['app/tests/**/.js','api/tests/**/*.js'],
				tasks: ['test', 'mochaTest']
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
			      cache: [
					"http://ajax.googleapis.com/ajax/libs/angularjs/1.2.8/angular.min.js",
  					"http://ajax.googleapis.com/ajax/libs/angularjs/1.2.8/angular-route.min.js",
					"http://ajax.googleapis.com/ajax/libs/angularjs/1.2.8/angular-animate.min.js",
					"http://ajax.googleapis.com/ajax/libs/angularjs/1.2.8/angular-cookies.min.js"
			      ]
			    },
			    src: [
			        "home.html",
			        "compiled/*.js",
			        "compiled/*.css",
			        "img/*.png",
			        "font/**.*"
			    ],
			    dest: "app/manifest.appcache"
			}
		},
		
		secret: grunt.file.exists('secret.json') ? grunt.file.readJSON('secret.json') : '',
		
		sftp: {
			deploy: {
			    files: {
			      "./": ["app.js", "newrelic.js", "package.json", "Procfile", "admin/dist/**", "about/**", "api/*.js", "api/images/undefined.jpg", "app/*", "app/compiled/*", "app/css/*", "app/font/*", "app/img/*", "app/touch-icons/*"]
			    },
			    options: {
			      path: '/var/journal',
			      createDirectories: true,
			      host: '<%= secret.host %>',
			      username: '<%= secret.username %>',
			      password: '<%= secret.password %>',
			      showProgress: true
			    }
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
	grunt.loadNpmTasks('grunt-ssh');
	grunt.loadNpmTasks('grunt-mocha');
	grunt.loadNpmTasks('grunt-mocha-test');


	grunt.registerTask('test', ['jshint', 'mocha', 'mochaTest']);
	grunt.registerTask('default', ['jshint', 'concat', 'manifest', 'mocha', 'mochaTest', 'watch']);
	grunt.registerTask('deploy', ['jshint', 'concat', 'manifest', 'mocha', 'mochaTest', 'sftp:deploy']);
};