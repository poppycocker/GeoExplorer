module.exports = function(grunt) {
    var pkg = grunt.file.readJSON('package.json');
    // http://havelog.ayumusato.com/develop/javascript/e580-own_concat_pattern.html
    grunt.initConfig({
        copy: {
            css_leaflet: {
                expand: true,
                cwd: 'bower_components/leaflet/dist/',
                src: 'leaflet.css',
                dest: 'css/',
            },
            img_leaflet: {
                expand: true,
                cwd: 'bower_components/leaflet/dist/images',
                src: '*',
                dest: 'images/'
            },
            css_typicons: {
                expand: true,
                cwd: 'bower_components/typicons/src/font',
                src: [
                    'typicons.eot',
                    'typicons.min.css',
                    'typicons.svg',
                    'typicons.ttf',
                    'typicons.woff',
                ],
                dest: 'css/dist/typicons/'
            }
        },
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
                    'bower_components/leaflet/dist/leaflet-src.js',
                    'js/jquery.animate-colors-min.js',
                    'js/shortcut.js',
                    'js/definitions.js',
                    'js/utils.js',
                    'js/latlng.js',
                    'js/searcher.js',
                    'js/searcher.google.js',
                    'js/searcher.nominatim.js',
                    'js/view.search.js',
                    'js/bookmarks.js',
                    'js/view.bookmark.js',
                    'js/view.mapSwitch.js',
                    'js/view.info.js',
                    'js/view.address.js',
                    'js/view.map.js',
                    'js/view.map.google.js',
                    'js/view.map.leaflet.js',
                    'js/model.bookmark.js',
                    'js/model.mapSwitch.js',
                    'js/model.position.js',
                    'js/model.address.js',
                    'js/model.address.google.js',
                    'js/model.address.nominatim.js',
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
        cssmin: {
            target: {
                files: {
                    'css/dist/min.css': [
                        'css/reset.css',
                        'css/leaflet.css',
                        'css/style.css'
                    ]
                }
            }
        },
        watch: {
            js: {
                files: 'js/*.js',
                tasks: ['concat', 'uglify']
            },
            css: {
                files: 'css/*.css',
                tasks: ['cssmin']
            }
        }
    });

    // プラグインのロード・デフォルトタスクの登録
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.registerTask('default', ['copy', 'concat', 'uglify', 'cssmin']);

    // 更新監視は grunt watch でスタート
};