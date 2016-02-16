# oriconCast

Experimental project to automate podcast creations based on available info.

### About OriconCast:

Oricon provides music rankings for the Japanese market. Unfortunately, the jpop music is not popular outside of Asia, which makes it very difficult for fans in other countries (like myself) to stay up to date.

There are many projects out there that takes a podcast from a site, and split it into separate files. This project is basically the reverse of it (concept wise at least).

The idea is to create a basic podcast containing samples of the top 10 songs based on this ranking (or whatever could be found).

UPDATE: I'm going to use jpopasia to keep things simple (no need to update the URL every week, search for the video links, convert the language encoding, etc.), but you should get the gist from the code

### To run:

node app.js


### Techniques:

- Screen scrapping
- Media scrapping
- CSS Selectors, Pattern match

### Disclaimer:

This is a research project for future applications. If you plan to use this for actual podcasts/similar service, make sure you are informed re:copyrights.

#### References:

1. For scrapping, let's use the "upgraded" version of cheerio (x-ray), by the same author: https://github.com/lapwinglabs/x-ray
2. An additional challenge is that the screens will be in a different UTF encoding (in this case japanese). If the page is not properly encoded, the generated json will need to adapt to them. To accomplish that, I can use the following:
  - X-Ray request: https://www.npmjs.com/package/x-ray-request
  - Iconv-lite: https://github.com/ashtuchkin/iconv-lite/ - There is a full version of Iconv, but the python support in my environment is dated, and I have no plans to update it (at least not for this project)  
3. Using TBD search APIs to get the music videos: http://nobodyknows
4. Converting the music videos into mp3s: http://nobodyknows
5. Creating a large podcast file from smaller audio ones:  http://blog.ragingflame.co.za/2013/5/31/using-nodejs-to-join-audio-files
