var express = require('express');
var path = require('path');
var ytdl = require('ytdl-core')
var fs = require('fs');
var ytPlaylist = require('youtube-playlist')

app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.get('/downloadVideo', (req, res) => {
    var id_video = req.query.id_video; 
    baixarVideo(id_video)   
})

app.get('/downloadPlaylist', (req, res) => {
    var id_playlist = req.query.id_playlist;
    baixarPlaylist(id_playlist)
})

app.listen(3000, function () {
    console.log('esperando solicitações');
});

function baixarPlaylist(id_playlist){
    const url_playlist = 'https://www.youtube.com/playlist?list=' + id_playlist;
    ytPlaylist(url_playlist, 'id')
    .then(res => {
        videosURL = res.data.playlist

        videosURL.forEach((videoID) => {
            baixarVideo(videoID)
        })
    })
    .catch(err => console.log(err))
}

function baixarVideo(id_video){
    var url_video = 'http://www.youtube.com/watch?v=' + id_video;
    
    ytdl.getInfo(id_video)
    .then(res => {
        console.log('baixando... ', res.title)
        fileMp3 = fs.createWriteStream(res.title.toString() + '.mp3')
        stream = ytdl(url_video, {filter: 'audioonly'})
        stream.pipe(fileMp3);
    })
    .catch(err => console.log(err))
}
