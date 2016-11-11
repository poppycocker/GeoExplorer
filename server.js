/* Webコンテンツ開発用 Node.js簡易Webサーバーサンプル */
// Web サーバーが Listen する IP アドレス
var LISTEN_IP = process.argv[2 + 0] || '127.0.0.1';
// Web サーバーが Listen する ポート
var LISTEN_PORT = 8086;
// ファイル名が指定されない場合に返す既定のファイル名
var DEFAULT_FILE = "index.html";
// ルートとして扱うディレクトリ名
var ROOT_DIR = '/';

var http = require('http'),
    fs = require('fs');

// 拡張子を抽出
function getExtension(fileName) {
    var fileNameLength = fileName.length;
    var dotPoint = fileName.indexOf('.', fileNameLength - 5);
    var extn = fileName.substring(dotPoint + 1, fileNameLength);
    return extn;
}

// content-typeを指定
function getContentType(fileName) {
    var extentsion = getExtension(fileName).toLowerCase();
    var contentType = {
        'html': 'text/html',
        'htm': 'text/htm',
        'css': 'text/css',
        'js': 'text/javaScript; charset=utf-8',
        'json': 'application/json; charset=utf-8',
        'xml': 'application/xml; charset=utf-8',
        'jpeg': 'image/jpeg',
        'jpg': 'image/jpg',
        'gif': 'image/gif',
        'png': 'image/png',
        'mp3': 'audio/mp3',
    };
    var contentType_value = contentType[extentsion];
    if (contentType_value === undefined) {
        contentType_value = 'text/plain';
    }
    return contentType_value;
}

// Webサーバーのロジック
var server = http.createServer();
server.on('request', function(request, response) {
    var requestedFile = ROOT_DIR + request.url + (request.url === '/' ? DEFAULT_FILE : '');
    console.log('Requested Url:' + request.url);
    console.log('Handle Url:' + requestedFile);
    console.log('File Extention:' + getExtension(requestedFile));
    console.log('Content-Type:' + getContentType(requestedFile));
    fs.readFile('.' + requestedFile, 'binary', function(err, data) {
        if (err) {
            response.writeHead(404, {
                'Content-Type': 'text/plain'
            });
            response.write('not found\n');
            response.end();
        } else {
            response.writeHead(200, {
                'Content-Type': getContentType(requestedFile)
            });
            response.write(data, "binary");
            response.end();
        }
    });
});

server.listen(LISTEN_PORT, LISTEN_IP);
console.log('Server running at http://' + LISTEN_IP + ':' + LISTEN_PORT);