import QingTingSpider from "./dl";

var args = {};

process.argv.forEach(function (val, index, array) {

  switch(index){
    case 2:
      args.folderName = val;
      break;
    case 3:
      args.channel = val;
      break;
    case 4:
      args.page = val;
      break;
    default:
      break;
    }
});

var qt = new QingTingSpider(args.folderName, args.channel, args.page);

qt.mainLoop();
