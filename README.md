# oriconCast

Experimental project to automate ~~podcast~~videocast creations based on available info.

### About OriconCast:

Oricon provides music rankings for the Japanese market. Unfortunately, the jpop music is not popular outside of Asia, which makes it very difficult for fans in other countries (like myself) to stay up to date.

There are many projects out there that downloads a ~~podcast~~video from a site, and split it into separate files. This project is basically the reverse of it (concept wise at least): The idea is to create a big ~~podcast~~video containing samples of the top ~~10 songs~~5 videos based on this ranking (or whatever could be found).

UPDATE: I'll be using kickstarter's most popular technology campaigns, because I like that stuff.

### To run:

node app.js

### Techniques:

- Screen scrapping and link crawling
- Media download
- Media manipulation
- CSS Selectors, Pattern match

### Disclaimer:

This is a research project for future applications. If you plan to use this for actual/similar services, make sure you are informed re:copyrights.

#### Tools:

1. For scrapping, let's use the "upgraded" version of cheerio (x-ray), by the same author: https://github.com/lapwinglabs/x-ray . I'm actually using a variant from 54chi because the crawler doesn't work in the main x-ray branch yet (git+ssh://git@github.com/54chi/x-ray.git#bugfix/nested-crawling)
2. Downloading files using the [download plugin](https://github.com/kevva/download)
3. [ffmpeg](https://ffmpeg.org/download.html) to manipulate the videos (merging, cover titles) as well as  [fluent-ffmpeg](https://github.com/fluent-ffmpeg/node-fluent-ffmpeg) for node support. Read the project's readme for info on how to set it properly
4. Uploading to youtube
