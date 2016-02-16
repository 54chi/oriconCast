/*
x-ray version
I had to replace the original x-ray with a fork that supports pre-formatting (from cbou)

-- npm install -i --save git+https://git@github.com/cbou/x-ray.git
*/


//dependencies
var xray= require ("x-ray"),
		fs = require('fs'),
		encoding = require('encoding-japanese');
		//Download = require('download'),

//source url
var html='http://www.jpopasia.com/charts/'

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
		  to: 'SJIS',
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
    $root: '.wrapper ul.chart li',
    title: '.chart-title|japanese',
		details: 'a.openvideo[href]',
		desc: 'img[alt]|japanese',
    artist: '.chart-artist|japanese'
  }])
//.write('results.json');
  .run(function(err, results) {
		//alternative to the "write" method from xray, in case you need more control on the output file
		fs.writeFile("results.json", JSON.stringify(results,null,'\t'));



	//Any function you may like to run after the scrapping is done
	//e.g. downloading stuff
	/*
    var download = new Download();
    results = results.filter(function(image) {
        return image.width > 100;
    }).forEach(function(image) {
        download.get(image.src);
    });
    download.dest('./images');
    download.run();
	fs.writeFile("results.json", JSON.stringify(results,null,'\t'));
	*/
	console.log("Operation completed");
	})
