module.exports = function(grunt) {
    var pkg = grunt.file.readJSON('package.json');
    // http://havelog.ayumusato.com/develop/javascript/e580-own_concat_pattern.html
    grunt.initConfig({
        concat: {
            options: {
                stripBanners: false,
                banner: [
                    '(function() {',
                    '"use strict";',
                    '',
                    ''
                ].join('\n'),
                footer: ['',
                    '}).call(this);'
                ].join('\n')
            },
            files: {
                // 元ファイルの指定
                src: [
                    'bower_components/jquery/dist/jquery.js',
                    'bower_components/underscore/underscore.js',
                    'bower_components/backbone/backbone.js',
                    'js/jquery.animate-colors-min.js',
                    'js/shortcut.js',
                    'js/utils.js',
                    'js/latlng.js',
                    'js/searcher.js',
                    'js/view.search.js',
                    'js/bookmarks.js',
                    'js/view.bookmark.js',
                    'js/view.info.js',
                    'js/view.address.js',
                    'js/view.map.js',
                    'js/view.map.google.js',
                    'js/view.map.leaflet.js',
                    'js/model.bookmark.js',
                    'js/model.position.js',
                    'js/model.address.js',
                    'js/app.js',
                ],
                // 出力ファイルの指定
                dest: 'js/dist/concat.js'
            }
        },
        uglify: {
            dist: {
                files: {
                    // 出力ファイル: 元ファイル
                    'js/dist/app-min.js': 'js/dist/concat.js'
                }
            }
        },
        watch: {
            js: {
                files: 'js/*.js',
                tasks: ['concat', 'uglify']
            }
        }
    });

    // プラグインのロード・デフォルトタスクの登録
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.registerTask('default', ['concat', 'uglify']);

    // 更新監視は grunt watch でスタート
};