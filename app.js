/*
x-ray version
I had to replace the original x-ray with a fork that supports pre-formatting.
However, it didn't do much (assuming this is actually pre-formatting).
Here is a working code, but it looks like the Shif-JIS conversion is stuck with the Katakana stuff.
Going to try with the old known cheerio next
*/

//dependencies
var xray= require ("x-ray"),
		fs = require('fs'),
		encoding = require('encoding-japanese');
		//Download = require('download'),

//source url
var html ='http://www.oricon.co.jp/rank/is/w/2016-01-04/';

//function to convert a string to an array (required for the encoding function)
var str2array = function(str) {
    var array = [],i,il=str.length;
    for(i=0;i<il;i++) array.push(str.charCodeAt(i));
    return array;
};

//pre-formatting functions
var prepare = {
  uppercase: function (str) {
    return str.toUpperCase();
  },
	japanese: function(str) {
		array = str2array(str),
		sjis_array = encoding.convert(array, {
		  to: 'UNICODE',
		  from: 'SJIS'
		});
		sjis= encoding.codeToString( sjis_array );
		return sjis;
	}
}

//screen-scrapping function
xray(html)
	.prepare(prepare)
  .select([{
    $root: '.box-rank-entry .inner a',
    title: '.title',
    artist: '.name'
  }])
  .write('results.json');
/*
(function(err, results) {
	//Any function you may like to run after the scrapping is done
	//e.g. downloading stuff
//    var download = new Download();
//    results = results.filter(function(image) {
//        return image.width > 100;
//    }).forEach(function(image) {
//        download.get(image.src);
//    });
//    download.dest('./images');
//    download.run();
//	fs.writeFile("results.json", JSON.stringify(results,null,'\t'));
})
*/
console.log("Operation completed");
