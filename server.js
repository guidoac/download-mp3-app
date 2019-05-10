var express = require('express');
var path = require('path');
var ytdl = require('ytdl-core')
var fs = require('fs');
var ytPlaylist = require('youtube-playlist')
var ytThumb = require('youtube-thumbnail')

app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.get('/pesquisar', (req, res) => {
    let id_playlist = req.query.playlistID
    let url_playlist = 'https://www.youtube.com/playlist?list=' + id_playlist
    
    getInfoPlaylist(url_playlist)
    .then(infoVideos => res.send(infoVideos))
})

app.get('/downloadVideo', (req, res) => {
    var id_video = req.query.id_video; 
    baixarVideo(id_video, res)
})

app.get('/downloadPlaylist', (req, res) => {
    var id_playlist = req.query.id_playlist;
    var url_playlist = 'https://www.youtube.com/playlist?list=' + id_playlist;

    ytPlaylist(url_playlist, 'id')
    .then(info_playlist => {
        id_videos = info_playlist.data.playlist
        id_videos.forEach(videoID => baixarVideo(videoID, res))
    })
})

app.listen(3000, function () {
    console.log('esperando solicitações...');
});

async function getInfoPlaylist(url_playlist) {
    let infos = await ytPlaylist(url_playlist, ['id', 'name', 'url'])
    
    let infoVideos = infos.data.playlist
    infoVideos.forEach(videoInfo => {
        urlThumb = ytThumb('https://www.youtube.com/watch?v=' + videoInfo.id).default.url
        videoInfo.urlthumb = urlThumb
    })
    return infoVideos
}

async function baixarVideo(id_video, res) {
    var url_video = 'http://www.youtube.com/watch?v=' + id_video 
    
    var info_video = await ytdl.getInfo(url_video)  
    console.log('baixando... ', info_video.title)
    
    var regex = /[^a-z0-9]/
    // var regex = /[\?\*\>\<\|\:\*\/\"+]/
    var nomeArquivo = info_video.title.replace(regex, '') + '.mp3'
    
    res.set('content-disposition', 'attachment; filename=' + nomeArquivo);
    ytdl(url_video, { filter: 'audioonly' }).pipe(res)
}