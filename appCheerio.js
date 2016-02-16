//http://maxogden.com/scraping-with-node.html
var cheerio = require('cheerio')
var fs = require('fs')
var request = require('request');
var iconv = require('iconv-lite');
var encoding = 'shift-jis';


var jsonArray = []; // load JSON file here!
var title, artist, ranking;
/*
function gotHTML(err, resp, html) {
  if (err) return console.error(err)
  var parsedHTML = $.load(html)
  // get all img tags and loop over them
  parsedHTML('.box-rank-entry .inner a').map(function(i, song) {
    song = { title : "", artist : "", ranking : ""};
    title = iconv.decode($(".title", this).text(),"shift-jis");
    artist = $(".name", this).text();
    song.title = title;
    song.artist = artist;
    song.ranking = index+1;
    jsonArray.push(song)
  })
}
*/
var theUrl = 'http://www.oricon.co.jp/rank/is/w/2016-01-25/'
//request(theUrl, gotHTML);

/*
request.get({
    url: theUrl,
    encoding:null
}, function(err, res, body) {
  if (err) return console.error(err)
  html = iconv.decode(new Buffer(body, 'shift-jis'),'shift-jis')
  var parsedHTML = $.load(html)
  parsedHTML('.box-rank-entry .inner a').map(function(i, song) {
    song = { title : "", artist : "", ranking : ""};
    title = iconv.decode($(".title", this).text(),"shift-jis");
    artist = $(".name", this).text();
    song.title = title;
    song.artist = artist;
    song.ranking = index+1;
    jsonArray.push(song)
  })


//    enc = charset(res.headers, body)
  //  enc = enc || jchardet.detect(body).encoding.toLowerCase()
  //  if enc != 'utf-8'
        //iconv = new Iconv(enc, 'UTF-8//TRANSLIT//IGNORE')
        //html = iconv.convert(new Buffer(body, 'binary')).toString('utf-8')
//    console.log(html);

//    var chunks = [];
//     res.on('data', function(chunk) {
//       chunks.push(chunk);
//     });
//     res.on('end', function() {
//       var decodedBody = iconv.decode(Buffer.concat(chunks), 'UTF8');
//       console.log(decodedBody);
//     });
//
});
*/


//var htmlString = fs.readFileSync('oriconsample.html').toString()
//var $ = cheerio.load(iconv.decode(htmlString,"BINARY"))
//var $ = cheerio.load(htmlString)


//var data = JSON.parse(jsonString); // turn JSON string into an actual object
//var song = { title : "", artist : "", ranking : ""};
/*
$('.box-rank-entry .inner a').each(function(index, value){
    song = { title : "", artist : "", ranking : ""};
    title = iconv.decode($(".title", this).text(),"shift-jis");
    artist = $(".name", this).text();
    song.title = title;
    song.artist = artist;
    song.ranking = index+1;
    //self.thejson[index] = song;
    jsonArray.push(song);
});
*/

/*$('.box-rank-entry .inner a').each(function(i,data){
     //var data = $(data);
//     data = $(data)
     title = $(".title", this).text();
     artist = $(".name", this).text();
     json.title = title;
     json.artist = artist;
     json.ranking = i;
     jsonArray.push(json);
 })
*/
// To write to the system we will use the built in 'fs' library.
// In this example we will pass 3 parameters to the writeFile function
// Parameter 1 :  output.json - this is what the created filename will be called
// Parameter 2 :  JSON.stringify(json, null, 4) - the data to write, here we do an extra step by calling JSON.stringify to make our JSON easier to read
// Parameter 3 :  callback function - a callback function to let us know the status of our function
fs.writeFile('output2.json', JSON.stringify(jsonArray, null, 4), function(err){
   console.log('File successfully written! - Check your project directory for the output.json file');
})
