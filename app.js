/*
oriconCast
==========

A video builder out of kickstarter's most popular technology videos.

Tools:
- node
- x-ray (variant from 54chi because the crawler doesn't work in the main x-ray branch yet)
- [download](https://github.com/kevva/download) to get the video files
- [ffmpeg](https://ffmpeg.org/download.html) to manipulate the videos (merging)
- [fluent-ffmpeg](https://github.com/fluent-ffmpeg/node-fluent-ffmpeg) for node support. Read the project's readme for info on how to set it properly
*/

function complete(err,files){
	//merge videos
//https://github.com/fluent-ffmpeg/node-fluent-ffmpeg
/*
	var fluent_ffmpeg = require("fluent-ffmpeg");

	var mergedVideo = fluent_ffmpeg();
	var videoNames = ['./download/video/video-619755-h264_high.mp4', './download/video/video-637420-h264_high.mp4'];

	videoNames.forEach(function(videoName){
	    mergedVideo = mergedVideo.addInput(videoName);
	});

	mergedVideo.mergeToFile('./download/video/mergedVideo.mp4', './tmp/')
	.on('error', function(err) {
	    console.log('Error ' + err.message);
	})
	.on('end', function() {
	    console.log('Finished!');
	});
*/

	console.log("\n * OPERATION COMPLETE \n");
}

// Downloader function
function downloadStuff(results){
	//dependencies
	var Download = require('download'),
			maxDownload=2,
			downloadVideos="download/videos",
			download = new Download({mode:755});

	download.dest(downloadVideos);
	var contents = JSON.stringify(results,null,'\t');

	// if you prefer to download from a file instead, you can use the following code:
	// var contents = fs.readFileSync(downloadResults);

	var jsonContent = JSON.parse(contents);
	console.log("\n * DOWNLOADING FILES:");

	for(var index in jsonContent){
		if ((index)>maxDownload-1) break;
		console.log("     "+index+": "+jsonContent[index].project+": "+jsonContent[index].video);
		download.get(jsonContent[index].video);
	}
	download.run(complete);
}

//Screen-scrapping+crawling
//KS doesn't have a straight way to get the video URL, so we'll screen scrape the following page and get the video link from there

//dependencies
var Xray= require ("x-ray"),
		x = Xray(),
		html='https://www.kickstarter.com/discover/categories/technology?ref=category_modal&sort=popularity',
		fs = require('fs'),
		downloadResults="download/results.json";

console.log("\n * GETTING DATA ");

//x-ray code

x(html,'#projects_list .project-card', [{
	project: '.project-title',
	by: '.project-byline',
	details: '.project-blurb',
	img: '.project-thumbnail  img@src',
	link: '.project-title a@href',
	video: x('.project-title a@href', '#video_pitch@data-video-url')	//crawl for the video URL
}])(function (err, results) {
  if (err) {
    console.log(err)
    return
  }
	//write results file
	fs.writeFile(downloadResults, JSON.stringify(results,null,'\t'));
	console.log("     Data fetched! JSON FILE: '"+downloadResults+"' generated!");

	//download files
	downloadStuff(results);
});


//complete();
