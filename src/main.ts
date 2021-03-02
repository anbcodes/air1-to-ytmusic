import fetch from 'node-fetch'
import { JSDOM } from 'jsdom';
import fs from 'fs';

async function main() {
  let data = await (await fetch("https://www.air1.com/music/songs")).text()
  let dom = new JSDOM(data);
  let songList = JSON.parse(fs.readFileSync("air1songlist.json").toString());
  let songs: Array<{ name: string, artist: string }> = [];
  dom.window.document.querySelectorAll(".card-body").forEach(v => {
    songs.push({
      name: v.querySelector("h5")?.innerHTML.trim() || '',
      artist: v.querySelector("p > span")?.innerHTML.trim() || '',
    })
  })
  console.log(songs);
  songs.forEach((song, i) => {
    if (!songList.previousSongs.filter((v: any) => song.name == v.name && song.artist == v.artist)[0]) {
      let existingSong = songList.songs.filter((v: any) => song.name == v.name && song.artist == v.artist)[0];
      if (existingSong) {
        existingSong.playedAt.push(+(new Date()));
      } else {
        songList.songs.push({
          playedAt: [+(new Date())],
          ...song,
        })
      }
    }
  })
  songList.previousSongs = songs;
  fs.writeFileSync("air1songlist.json", JSON.stringify(songList));
}

main()