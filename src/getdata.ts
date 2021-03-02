import fs from 'fs'

const data = JSON.parse(fs.readFileSync('./air1songlist.json').toString());

const oldestTime = 0;

console.log('Songs [Name] [Artist] ([Times Seen] / [Recent Times Seen])')

for (let i = 0; i < data.songs.length; i++) {
  console.log(`  ${data.songs[i].name} by ${data.songs[i].artist.replace('&amp;', '&')} (${data.songs[i].playedAt.length}/${data.songs[i].playedAt.filter((v2: any) => v2 > oldestTime).length})`)
}

const totalNumberOfSongs = data.songs.length;

const totalNumberOfSongsWithDuplicates = data.songs.map((v: any) => v.playedAt.filter((v2: any) => v2 > oldestTime).length).reduce((t: number, v: number) => t + v, 0)

console.log(`There are ${totalNumberOfSongs} songs.`)
console.log(`With duplicates there are ${totalNumberOfSongsWithDuplicates} songs.`)