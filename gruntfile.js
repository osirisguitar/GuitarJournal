module.exports = function(grunt) {
	grunt.initConfig({
		jshint: {
			// define the files to lint
			files: ['gruntfile.js', 'api/**/*.js'],
			// configure JSHint (documented at http://www.jshint.com/docs/)
			options: {
				// more options here if you want to override JSHint defaults
				smarttabs:true,
				'-W099': true,
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
				reporter: require('jshint-stylish')
			},
		},

		mochaTest: {
			testapi: {
				src: ['api/test/unit/**/*.js'],
				options: {
					run: true,
					log: true,
					logErrors: true/*,
					reporter: 'Spec'*/
				}
			}
		},

		watch: {
			tests: {
				files: ['api/tests/**/*.js'],
				tasks: ['test', 'mochaTest']
			}
		},
		
		secret: grunt.file.exists('secret.json') ? grunt.file.readJSON('secret.json') : {},
		
		sftp: {
			deploy: {
			    files: {
			      './': ['package.json', 'node_modules/**/**', 'api/**/**.js', 'api/images/undefined.jpg']
			    },
			    options: {
			      path: '/var/api',
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
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-ssh');
	grunt.loadNpmTasks('grunt-mocha');
	grunt.loadNpmTasks('grunt-mocha-test');


	grunt.registerTask('test', ['jshint', 'mochaTest']);
	grunt.registerTask('default', ['jshint', 'mochaTest', 'watch']);
	grunt.registerTask('deploy', ['jshint', /*'mochaTest',*/ 'sftp:deploy']);
};