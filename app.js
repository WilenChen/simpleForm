/**
 * Created by HoraceChan on 2015/8/23.
 */
var http = require('http');
var fs = require('fs');
var path = require('path');
//var mime = require('mime');
var jade = require("jade");
var querystring = require('querystring');
var cache = {};

var config = {
    port:3000
}

//function send404(response) {
//    response.writeHead(404, {'Content-Type': 'text/plain'});
//    response.write('Error 404: resource not found.');
//    response.end();
//}
//
//function sendFile(response, filePath, fileContents) {
//    response.writeHead(
//        200,
//        {"content-type": mime.lookup(path.basename(filePath))}
//    );
//    response.end(fileContents);
//}
//
//function serveStatic(response, cache, absPath) {
//    if (cache[absPath]) {
//        sendFile(response, absPath, cache[absPath]);
//    } else {
//        fs.exists(absPath, function(exists) {
//            if (exists) {
//                fs.readFile(absPath, function(err, data) {
//                    if (err) {
//                        send404(response);
//                    } else {
//                        cache[absPath] = data;
//                        sendFile(response, absPath, data);
//                    }
//                });
//            } else {
//                send404(response);
//            }
//        });
//    }
//}

function jadeRender(res , pubFilePath , dataOption){
    jade.renderFile('public/' + pubFilePath, dataOption, function(err, html){
        // 这里的options是可选的
        // 回调函数可以作为第二个参数
        res.writeHead(
            200,{"content-type":"text/html"}
        );
        res.end(html);
    });
};

function resAdd(res, req){
    var postData = '';
    // 设置接收数据格式为 UTF-8
    req.setEncoding('utf8');
    // 接收数据块并将其赋值给 postData
    req.addListener('data', function(postDataChunk) {
        postData += postDataChunk;
    });
    req.addListener('end', function() {
        // 数据接收完毕，执行回调
        var param = querystring.parse(postData);
        console.log(postData);
        console.log(param);
        //下面照样可以用jadeRender函数渲染前端视图，不想写了，好累
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('success');
    });
}

var server = http.createServer(function(req ,res) {
    var filePath = false;
    var dataOption = {};
    if(req.url == '/'){         //jade渲染静态页面例子
        filePath = 'index.jade';
        dataOption.options = 'lalalala';
        jadeRender(res , filePath , dataOption);
    }else if(req.url == '/login'){      //post处理例子，往这里post数据，输出会在console台中输出，具体例子就不写了，好累。你试试，不行再来找我。
        resAdd(res, req);
    }else {                                 //404处理
        filePath = '404page.jade';
        dataOption.options = req.url;
        jadeRender(res , filePath , dataOption);
    }
});

server.listen(config.port, function(){
    console.log("Sever listening on port " + config.port);
});