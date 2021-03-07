# Air1 To Youtube Music

Takes Air1's songs and adds them to a youtube music playlist. Use `upload.py --help` for usage.

## Setup & Running
Run `npm install` to install the dependencies for the javascript. You will also need to do `pip install ytmusicapi`.

To build the typescript run `npm run build`. To run the scrapper use `node dist/main.js`. To see a summary of the data run `node dist/viewdata.js`. Use `upload.py` to upload the songs to youtube.

> On ubuntu you can do `watch -n1500 node dist/main.js` to scrape the songs every 25 minutes (about the amount of time it takes for them to cycle)
