var fs = require('fs');
var path = require('path');
var util = require('util');

var request = require('request');
var ProgressBar = require('progress');

const apiUrl = "http://i.qingting.fm/wapi/channels/";


class QingTingSpider {

  constructor(channel, page) {
    this.baseUrl = apiUrl + channel + "/programs/page/"
    this.page = page
    // this.folderName = folderName
  }

  getJSON(url){
    request(url, this.reqCallback);
  }

  reqCallback(error, response, body){
    var dlUrl = "http://od.qingting.fm/"
    var items = JSON.parse(body).data;
    for (var index in items) {
      var dlInfo = {
        name: items[index].name + ".m4a",
        path: dlUrl + items[index].file_path
      };
      var options = {
          url:  dlInfo.path,
          timeout: 1200000
      };
      request.get(options)
        .on(
            'error', function(err) {
              console.log("cach err", err);
            }
        ).on(
          'response', function(response){
            var len = parseInt(response.headers['content-length'], 10);
            var helpMsg = util.format("downloading %s [:bar] :rate/bps :percent :etas", dlInfo.name);
            var bar = new ProgressBar(helpMsg, {
               complete: '=',
               incomplete: ' ',
               width: 20,
               total: len
            })
            this.bar = bar
          }
        ).on(
          'data', function(chunk){
            this.bar.tick(chunk.length);
          }
        ).on(
          'end', function(){
            console.log('\n');
          }
        ).pipe(
          // fs.createWriteStream(path.join(
          //   this.folderName, dlInfo.name
          // )
          fs.createWriteStream(path.join(
            "audio", dlInfo.name
          )
        )
      )
    }
  }

  // folderHandle(){
  //   if (!fs.existsSync(this.folderName)) {
  //     fs.mkdirSync(this.folderName);
  //   }
  // }


  mainLoop(){
    var pagesRange = new Array(this.page + 1);
    var ret = [];
    // this.folderHandle();
    for(var i=1; i < pagesRange.length; i++){
      var url = this.baseUrl + i;
      this.getJSON(url)
    }
  }
}


var qt = new QingTingSpider(166308, 4);

qt.mainLoop();
