// oriconCast
// by 54chi
// TODO: better async/sync manipulation
// there should be a btter way to do this in a synch way. pull requests welcomed :)

// *** DEPENDENCIES AND SETTINGS ***
// Alt. you could put these settings within the functions, whatever you fancy
var Xray= require ('x-ray'),
		fs = require('fs'),
		Download = require('download'),
		fluent_ffmpeg = require('fluent-ffmpeg'),
		path=require('path'),
		probe = require('node-ffprobe'),
		// location settings
		html='https://www.kickstarter.com/discover/categories/technology?ref=category_modal&sort=popularity',
		downloadLog='asset/results.json',
		downloadVideos='asset/videos',
		downloadResult='./asset/KSTopTechCampaigns.mp4',
		coverVideo='./asset/cover640s.mp4',
		coverFont='./asset/fonts/OpenSans-Regular.ttf',
		// starting values
		x = Xray(),
		maxDownload=5, //number of videos to download
		download = new Download({mode:755}),
		mergedVideo = fluent_ffmpeg(),
		clips=[],
 		clips2scale=[],
		clips2merge=[],
 		completionCheck=0,
 		videoWidth=640,
 		videoHeight=360;

		download.dest(downloadVideos);

// *** SUPPORTING FUNCTIONS ***
String.prototype.replaceAll = function(search, replacement) {
		//replace all occurences of a character in a particular string
		//http://stackoverflow.com/questions/1144783/replacing-all-occurrences-of-a-string-in-javascript
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

var uploadToYouTube = function(){
	// upload video to your youtube channel
	console.log('Future functionality');
};

var mergeVideo = function(){
	console.log('\n * MERGE VIDEO FILES:');
	// big final merge
	// sort names
	clips2merge.sort();
	// add videos to download to the mergedVideo object
	clips2merge.forEach(function(videoName){
		console.log('     Final Merging file: '+downloadVideos+'/'+videoName);
		mergedVideo = mergedVideo.addInput(videoName);
	});

	mergedVideo.mergeToFile(downloadResult,'./tmp/')
		.on('error', function(err) {
			console.log('     Error ' + err.message);
		}).on('end', function() {
			// uploadToYouTube()
			console.log('\n *** OPERATION COMPLETE ***\n');
		});
};

var resizeVideo = function(){
	console.log('\n * RESIZE VIDEO FILES:');
	completionCheck=0;
	clips2scale.forEach(function(videoName){
		//rescale the video if size is not correct
		fluent_ffmpeg(downloadVideos+'/'+videoName).size(videoWidth+'x'+videoHeight).autopad().save(downloadVideos+'/'+path.basename(videoName,'.mp4')+'-zz.mp4')
		.on('error', function(err) {
			console.log('     Error ' + err.message);
		}).on('end', function() {
			completionCheck++;
			console.log('     Resizing file:'+ videoName);
			if (completionCheck>clips2scale.length-1){
				mergeVideo(); //merge the videos
			}
		});
	});
};

var addAndProbeVideo = function(videoName){
	// checks for the video size and mark them for resize as needed. Populates the final merge list
	probe(downloadVideos+'/'+videoName, function(err, probeData) {
		if (probeData.streams[0].width!=videoWidth||probeData.streams[0].height!=videoHeight){
			console.log('     Probing video: '+videoName);
			// add video to resizing list
			clips2scale.push(videoName);
			// rename with future video name
			videoName=path.basename(videoName,'.mp4')+'-0.mp4';
		}else{
			console.log('     Merging file: '+downloadVideos+'/'+videoName);
		};
		// add video (and some future name) to merge list
		clips2merge.push(downloadVideos+'/'+videoName);
		completionCheck++;
		if (completionCheck>clips.length-1) {
			//exit and call the next function
			clips2scale.length>0?resizeVideo():mergeVideo();
		}
	});
};

var createBigVideo = function(){
	// merge everything in one big video
	console.log('\n * PREPARING FOR MERGE:');
	clips = fs.readdirSync(downloadVideos);
	completionCheck=0;
	// sort names descending
	clips.sort(function (a, b) {
		// at least in windows, this doesn't seem to work. Just sort your folder with Explorer the way you want it
	    return b-a;
	});
	// add videos to download to the mergedVideo object
	clips.forEach(function(videoName){
		//rescale the video if size is not correct
		addAndProbeVideo(videoName);
	});
};

var createCoverVideos = function(){
	// create cover videos
	console.log('\n * CREATING COVER VIDEOS:');
	var contents = fs.readFileSync(downloadLog),
			jsonContent = JSON.parse(contents);
	completionCheck=0;
	// read the json file contents
	for(var index in jsonContent){
		if ((index)>maxDownload-1) break;
		// create the cover page on top of generic cover video
		fluent_ffmpeg(coverVideo).videoFilters({
				filter: 'drawbox',
				options: {
					y:'ih/PHI',
					color:'black@0.4',
					width:'iw',
					height:48,
					t:'max'
				}
			},{
				filter: 'drawtext',
			  options: {
			    fontfile:coverFont,
			    text: (jsonContent[index].project).replaceAll(':', '-').replaceAll("\'", "\\\\\\\\\\\\'"),
			    fontsize: 18,
			    fontcolor: 'white',
			    x: '(main_w/2-text_w/2)',
			    y: '(h/PHI)+th'
				}
		}).on('end', function() {
				console.log('     Cover for '+jsonContent[completionCheck].project+' : '+path.basename(jsonContent[completionCheck].video,'.mp4')+'-cover.mp4');
				completionCheck++;
				// when completing all covers, continue to create the big video
				if (completionCheck>maxDownload-1) createBigVideo();
	  })
		.on('error', function(err, stdout, stderr) {
				console.log('error: ' + err.message);
				console.log('stdout: ' + stdout);
				console.log('stderr: ' + stderr);
		})
	  // save the cover videos to file
	  .save(downloadVideos+'/'+path.basename(jsonContent[index].video, '.mp4')+'-cover.mp4');
	};
};

var downloadStuff = function(results){
	// Downloader function
	console.log('\n * DOWNLOADING FILES:');
	// if you prefer to download from a file instead, you can use the following code:
	// var contents = fs.readFileSync(downloadLog);
	var contents = JSON.stringify(results,null,'\t'),
			jsonContent = JSON.parse(contents);
	// add files to get to the download object
	for(var index in jsonContent){
		if ((index)>maxDownload-1) break;
		videoIndex=index;
		console.log('     '+index+': '+jsonContent[index].project+': '+jsonContent[index].video);
		download.get(jsonContent[index].video);
	};
	// download files and upon completion, call the video merger function
	download.run(createCoverVideos);
};

//*** MAIN CALL ***//
console.log('\n *** GETTING THE DATA ***');

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
	fs.writeFile(downloadLog, JSON.stringify(results,null,'\t'));
	console.log('     Data fetched! JSON FILE: '+downloadLog+' generated!');
	//continue with downloading files
	downloadStuff(results);
});

//test
//createBigVideo();;
