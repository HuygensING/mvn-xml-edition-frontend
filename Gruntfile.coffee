module.exports = (grunt) ->
	grunt.initConfig
		pkg: grunt.file.readJSON 'package.json'
		uglify:
			options:
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
			build:
				src: 'src/<%= pkg.name %>.js',
				dest: 'build/<%= pkg.name %>.min.js'

		less:
			development:
				options:
					paths: ['css']
				files:
					'css/styles.css': 'css/styles.less'
			production:
				options:
					paths: ['css']
					yuicompress: true
				files:
					'css/styles.css': 'css/styles.less'
		watch:
			styles:
				files: ['**/*.less']
				tasks: ['less']

	grunt.loadNpmTasks 'grunt-contrib-uglify'
	grunt.loadNpmTasks 'grunt-contrib-less'
	grunt.loadNpmTasks 'grunt-contrib-watch'

