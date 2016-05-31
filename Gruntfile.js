module.exports = function(grunt) {

grunt.initConfig({
   concat: {
      options: {
         separator: ';',
      },
      js: {
         src: ['dist/js/app.js', 'dist/js/data.js', 'dist/js/fastclick.js', 'dist/js/foundation.min.js'],
         dest: 'dist/js/app.js'
      },
      css: {
         src: ['dist/css/app.css', 'dist/css/animate.css'],
         dest: 'dist/css/app.css'
      }
   },
   uglify: {
      my_target: {
         files: {
           'dist/js/app.js': ['dist/js/app.js']
         }
      }
   },
   replace: {
      cssandjs: {
         src: ['dist/*.htm'],
         dest: 'dist/',
         replacements: [{
            from: /<!-- startbuild:css (.*) -->/,
            to: '<link rel="stylesheet" href="$1"><!-- startbuild:css'
         }, {
            from: /<!-- startbuild:js (.*) -->/,
            to: '<script src="$1"></script><!-- startbuild:js'
         }, {
            from: /<!-- endbuild -->/,
            to: 'endbuild-->'
         }]
      }
   },
   htmlmin: {
      dist: {
         options: {
            removeComments: true,
            collapseWhitespace: true
         },
         files: [{
            expand: true,
            cwd: 'dist',
            src: '**/*.htm',
            dest: 'dist/'
         }]
      }
   },
   clean: ['dist/js/data.js', 'dist/js/fastclick.js']
});


grunt.loadNpmTasks('grunt-contrib-htmlmin');
grunt.loadNpmTasks('grunt-contrib-concat');
grunt.loadNpmTasks('grunt-text-replace');
grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.loadNpmTasks('grunt-contrib-clean');

grunt.registerTask('default', [
   'concat',
   'uglify',
   'replace',
   'htmlmin',
   'clean'
]);








};
