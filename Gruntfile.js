module.exports = function (grunt) {
	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		page: {
			title: '<%= pkg.title %>',
			description: '<%= pkg.description %>',
			keywords: '<%= pkg.keywords.join(\', \') %>',
			author: '<%= pkg.author.name %>'
		},

		imagemin: {
			images: {
				files: [{
					expand: true,
					cwd: 'src/img',
					src: ['**/*.{png,jpg,gif}'],
					dest: 'dev/img'
				}]
			}
		},

		stylus: {
			options: {
				compress: false
			},
			compile: {
				files: [{
					cwd: 'src/stylus',
					src: 'main.styl',
					dest: 'dev/css',
					expand: true,
					ext: '.css'
				}, {
					cwd: 'src/stylus',
					src: 'main.styl',
					dest: 'public/css',
					expand: true,
					ext: '.min.css'
				}]
			}
		},

		autoprefixer: {
			options: {
				browsers: [
					'ie 9',
					'ff 27',
					'opera 12',
					'safari 6',
					'chrome 32',
					'android 4',
					'ios 5'
				]
			},
			main: {
				src: ['dev/css/main.css', 'public/css/main.min.css']
			}
		},

		cssbeautifier: {
			files : 'dev/css/**/*.css'
		},

		cssmin: {
			public: {
				files: {
					'public/css/main.min.css': 'public/css/main.min.css'
				}
			}
		},

		jade: {
			dev: {
				options: {
					data: {
						isDev: true,
						page: '<%= page %>'
					}
				},
				files: [{
					cwd: 'src/jade',
					src: ['**/*.jade', '!inc/**/*'],
					dest: 'dev',
					expand: true,
					ext: '.html'
				}]
			},
			public: {
				options: {
					data: {
						page: '<%= page %>'
					}
				},
				files: [{
					cwd: 'src/jade',
					src: ['**/*.jade', '!inc/**/*'],
					dest: 'public',
					expand: true,
					ext: '.html'
				}]
			}
		},

		prettify: {
			options: {
				brace_style: 'expand',
				indent: 1,
				indent_char: '	',
				condense: true,
				indent_inner_html: true
			},
			all: {
				expand: true,
				cwd: 'dev',
				ext: '.html',
				src: ['**/*.html'],
				dest: 'dev'
			},
		},

		jshint: {
			options: {
				curly: true,
				eqeqeq: true,
				eqnull: true,
				browser: true,
				force: true,
				globals: {
					jQuery: true
				}
			},
			all: [
				'Gruntfile.js',
				'src/js/libs/jquery.jelect.js',
				'!src/js/libs/jquery-2.*.*.min.js',
			]
		},

		concat: {
			options: {
				separator: ';'
			},
			public: {
				files: [{
					src: [
						'src/js/libs/jquery-2.1.1.min.js',
						'src/js/libs/jquery.jelect.js',
						'src/js/libs/**/*.js',
						'src/js/main.js'
					],
					dest: 'public/js/main.min.js'
				}]
			}
		},

		uglify: {
			options: {
				report: 'min',
				mangle: {
					except: ['jQuery']
				}
			},
			build: {
				src: 'public/js/main.min.js',
				dest: 'public/js/main.min.js'
			},
			jelect: {
				options: {
					banner: '/*! <%= pkg.name %> v<%= pkg.version %> | <%= pkg.author.name %> | MIT License | <%= pkg.homepage %> */\n'
				},
				files: [{
					src: 'src/js/libs/jquery.jelect.js',
					dest: 'jquery.jelect.min.js'
				}]
			}
		},

		copy: {
			fonts: {
				files: [{
					expand: true,
					cwd: 'src/fonts',
					src: '*',
					dest: 'public/fonts',
					filter: 'isFile'
				}, {
					expand: true,
					cwd: 'src/fonts',
					src: '*',
					dest: 'dev/fonts',
					filter: 'isFile'
				}]
			},
			js: {
				files: [{
					expand: true,
					cwd: 'src/js',
					src: '**/*.js',
					dest: 'dev/js',
					filter: 'isFile'
				}, {
					src: 'src/js/libs/jquery.jelect.js',
					dest: 'jquery.jelect.js'
				}]
			},
			svg: {
				files: [{
					expand: true,
					cwd: 'src/img/svg',
					src: '**/*.svg',
					dest: 'dev/img',
					filter: 'isFile'
				}]
			},
			img: {
				files: [{
					expand: true,
					cwd: 'dev/img',
					src: '**/*',
					dest: 'public/img',
					filter: 'isFile'
				}]
			},
			favicon: {
				files: [{
					expand: true,
					cwd: 'src',
					src: 'favicon.ico',
					dest: 'dev',
					filter: 'isFile'
				}, {
					expand: true,
					cwd: 'src',
					src: 'favicon.ico',
					dest: 'public',
					filter: 'isFile'
				}]
			}
		},

		connect: {
			public: {
				options: {
					port: 3000,
					base: 'public'
				}
			},
			dev: {
				options: {
					port: 4000,
					base: 'dev'
				}
			}
		},

		watch: {
			imagemin: {
				files: ['src/img/**/*.{png,jpg,gif}'],
				tasks: ['newer:imagemin']
			},
			stylus: {
				files: ['src/stylus/**/*.styl'],
				tasks: ['stylus', 'autoprefixer', 'cssbeautifier', 'cssmin']
			},
			jade: {
				files: ['src/jade/**/*.jade', '!src/jade/inc/**/*'],
				tasks: ['newer:jade', 'newer:prettify']
			},
			jadeInc: {
				files: ['src/jade/inc/**/*.jade'],
				tasks: ['jade', 'prettify']
			},
			js: {
				files: ['src/js/**/*.js'],
				tasks: ['jshint', 'concat', 'uglify', 'copy:js']
			},
			copyFonts: {
				files: ['src/fonts/**/*'],
				tasks: ['newer:copy:fonts']
			},
			copySvg: {
				files: ['src/img/svg/**/*.svg'],
				tasks: ['newer:copy:svg']
			},
			copyImg: {
				files: ['dev/img/**/*'],
				tasks: ['newer:copy:img']
			},
			copyFavicon: {
				files: ['src/favicon.ico'],
				tasks: ['copy:favicon']
			},
			livereload: {
				options: {
					livereload: true
				},
				files: ['public/**/*']
			}
		}

	});

	function loadNpmTasks(tasks) {
		tasks.forEach(function (task, i) {
			grunt.loadNpmTasks(task);
		});
	}

	loadNpmTasks([
		'grunt-contrib-imagemin',
		'grunt-contrib-stylus',
		'grunt-autoprefixer',
		'grunt-cssbeautifier',
		'grunt-contrib-cssmin',
		'grunt-contrib-jade',
		'grunt-prettify',
		'grunt-contrib-jshint',
		'grunt-contrib-concat',
		'grunt-contrib-uglify',
		'grunt-contrib-copy',
		'grunt-newer',
		'grunt-contrib-connect',
		'grunt-contrib-watch'
	]);

	grunt.registerTask('default', [
		'imagemin',
		'stylus',
		'autoprefixer',
		'cssbeautifier',
		'cssmin',
		'jade',
		'prettify',
		'jshint',
		'concat',
		'uglify',
		'copy',
		'connect',
		'watch'
	]);
};
