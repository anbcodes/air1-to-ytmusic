from ytmusicapi import YTMusic
import json
import random

data = {}


def save():
    with open('data.json', 'w') as fp:
        json.dump(data, fp)


air1songs = {}
with open('air1songlist.json', 'r') as fp:
    air1songs = json.load(fp)

# YTMusic.setup(filepath="headers_auth.json")
ytmusic = YTMusic('headers_auth.json')

playlistTitle = "Air1 Worship Radio 2021"

playlists = ytmusic.get_library_playlists(25)

playlistId = None
playlist = None

for item in playlists:
    if item['title'] == playlistTitle:
        playlistId = item['playlistId']
        playlist = ytmusic.get_playlist(playlistId, limit=500)

if playlistId is None:
    playlistId = ytmusic.create_playlist("Air1 Worship Radio 2021", "")
elif len(playlist['tracks']) > 0:
    ytmusic.remove_playlist_items(playlistId, playlist['tracks'])

# oldestTime = 1614712800000
oldestTime = 0

cache = {}
with open('songcache.json', 'r') as fp:
    cache = json.load(fp)

songsToAdd = []

for song in air1songs['songs']:
    recentPlayedAts = [x for x in song['playedAt'] if x > oldestTime]
    query = song['name'] + " by " + song['artist']

    item = None
    if query in cache:
        item = cache[query]
    else:
        search_results = ytmusic.search(query)
        cache[query] = search_results[0]['videoId']
        item = cache[query]

    print('Adding song', song['name'], len(recentPlayedAts), 'times')
    for time in recentPlayedAts:
        songsToAdd.append(item)
        # print(time)


with open('songcache.json', 'w') as fp:
    json.dump(cache, fp)

random.shuffle(songsToAdd)

ytmusic.add_playlist_items(
    playlistId, songsToAdd, duplicates=True)
