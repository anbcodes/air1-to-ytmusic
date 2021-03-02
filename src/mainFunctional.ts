import fetch from 'node-fetch'
import { JSDOM } from 'jsdom';
import fs from 'fs';

interface Song {
  name: string,
  artist: string,
}

interface SongWithFrequency extends Song {
  playedAt: number[],
}

interface State {
  previousSongs: Song[];
  songs: SongWithFrequency[];
}

type Impure<T> = T;
type Pure<T> = T;

let main: () => Promise<void>; {
  main = async () => {
    let state = getState();
    let newSongs: Song[] = extractNewSongs(await getAir1Document());
    console.log(newSongs);

    mergeSongsWith(state.songs, newSongs, state.previousSongs);

    state.previousSongs = newSongs;

    saveState(state);
  }

  let getAir1Document: () => Promise<Impure<Readonly<JSDOM>>>; {
    getAir1Document = async () => new JSDOM(await getAir1PageText());

    let getAir1PageText: () => Promise<Impure<string>>;
    getAir1PageText = async () => await (await fetch("https://www.air1.com/music/songs")).text();
  }

  let getState: () => Impure<Readonly<State>>;
  getState = () => JSON.parse(fs.readFileSync("air1songlist.json").toString());

  let saveState: (data: Readonly<State>) => Impure<void>;
  saveState = (data) => fs.writeFileSync("air1songlist.json", JSON.stringify(data));

  let extractNewSongs: (dom: Readonly<JSDOM>) => Pure<Song[]>; {
    extractNewSongs = (dom) => Array.from(dom.window.document.querySelectorAll(".card-body")).map(elementToSong)

    let elementToSong: (el: Readonly<Element>) => Pure<Song>;
    elementToSong = (el) => ({
      name: el.querySelector("h5")?.innerHTML.trim() || '',
      artist: el.querySelector("p > span")?.innerHTML.trim() || '',
    });
  }

  let findSongIn: <T extends Song>(arr: T[], song: Song) => T | undefined; {
    findSongIn = (arr, song) => arr.find((v) => songsAreEqual(song, v))

    let songsAreEqual: (a: Song, b: Song) => boolean;
    songsAreEqual = (a, b) => a.name == b.name && a.artist == b.artist;
  }

  let mergeSongsWith: (arr: SongWithFrequency[], songs: Song[], filter: Song[]) => void; {
    mergeSongsWith = (arr, songs, filter) => songs.forEach(song => mergeOneSongWith(arr, song, filter));

    let mergeOneSongWith: (arr: SongWithFrequency[], song: Song, filter: Song[]) => void; {
      mergeOneSongWith = (arr, song, filter) => !findSongIn(filter, song)
        ? addOneSongTo(arr, song)
        : null;

      let addOneSongTo: (arr: SongWithFrequency[], song: Song) => void; {
        addOneSongTo = (arr, song) => findSongIn(arr, song)
          ? addPlayedAtTime(arr, song)
          : createSongWithFreqencyInFromSong(arr, song);

        let createSongWithFreqencyInFromSong: (arr: SongWithFrequency[], song: Song) => void; {
          createSongWithFreqencyInFromSong = (arr, song) => arr.push(newSongWithFrequency(song))

          let newSongWithFrequency: (song: Song) => SongWithFrequency;
          newSongWithFrequency = song => ({
            playedAt: [+(new Date())],
            ...song,
          });
        }

        let addPlayedAtTime: (arr: SongWithFrequency[], song: Song) => void;
        addPlayedAtTime = (arr, song) => findSongIn(arr, song)?.playedAt.push(+(new Date()))
      }
    }
  }
};

main();