module.exports = function(grunt) {
  var port = grunt.option('port') || 3000;
	var base = grunt.option('base') || '.';
  grunt.initConfig({
    includes: {
      files:{
        src: ['playground-raw.js'],
        dest: 'public/build/',
        cwd: 'public/src/js'
      }
    },
    less: {
      development: {
        options: {
          compress: true,
          yuicompress: true,
          optimization: 2
        },
        files: {
          "public/build/playground.css": "public/src/less/main.less" // destination file and source file
        }
      }
    },
    watch: {
      styles: {
        files: ['public/src/less/**/*.less','public/src/js/**/*.js', 'public/src/partials/**/*.jsx'], // which files to watch
        tasks: ['includes', 'babel', 'less', 'express'],
        options: {
          nospawn: true,
          livereload: true
        }
      },
      views: {
        files: ['public/views/**/*.html'],
        options: {
          nospawn: true,
          livereload: true
        }
      }
    },
    express: {
			prod: {
				options: {
					script: "server.js"
				}
			}
		},
    babel: {
  		options: {
  			sourceMap: false,
  			presets: ['babel-preset-es2015','react']
  		},
  		dist: {
  			files: {
  				'public/build/playground.js': 'public/build/playground-raw.js'
  			}
  		}
  	}
  });
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-includes');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-express-server');
  grunt.loadNpmTasks('grunt-babel');
  grunt.registerTask('default', ['includes', 'babel', 'less', 'express', 'watch' ] );
};
