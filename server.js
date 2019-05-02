var express = require('express');
var path = require('path');
var ytdl = require('ytdl-core')
var fs = require('fs');
var ytPlaylist = require('youtube-playlist')
var ytThumb = require('youtube-thumbnail')

app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.get('/pesquisar', (req, res) => {
    var id_playlist = req.query.playlistID
    const url_playlist = 'https://www.youtube.com/playlist?list=' + id_playlist
    
    getInfoPlaylist(url_playlist)
    .then(infoVideos => res.send(infoVideos))
})

app.get('/downloadVideo', (req, res) => {
    var id_video = req.query.id_video;
    baixarVideo(id_video)
})

app.get('/downloadPlaylist', (req, res) => {
    var id_playlist = req.query.id_playlist;
    baixarPlaylist(id_playlist)
})

app.listen(3000, function () {
    console.log('esperando solicitações...');
});

async function getInfoPlaylist(url_playlist) {
    infos = await ytPlaylist(url_playlist, ['id', 'name', 'url'])
    
    infoVideos = infos.data.playlist
    infoVideos.forEach(videoInfo => {
        urlThumb = ytThumb('https://www.youtube.com/watch?v=' + videoInfo.id).default.url
        videoInfo.urlthumb = urlThumb
    })
    return infoVideos
}

async function baixarPlaylist(id_playlist) {
    const url_playlist = 'https://www.youtube.com/playlist?list=' + id_playlist;

    info_playlist = await ytPlaylist(url_playlist, 'id')
    id_videos = info_playlist.data.playlist
    id_videos.forEach(videoID => baixarVideo(videoID))
}

async function baixarVideo(id_video) {
    var url_video = 'http://www.youtube.com/watch?v=' + id_video;

    info_video = await ytdl.getInfo(id_video)
    console.log('baixando... ', info_video.title)
    if (!fs.existsSync(path.join(__dirname, 'musicas'))) {
        fs.mkdirSync(path.join(__dirname, 'musicas'))
    }
    fileMp3 = fs.createWriteStream(path.join(__dirname, 'musicas', info_video.title + '.mp3')).
    stream = ytdl(url_video, { filter: 'audioonly' })
    stream.pipe(fileMp3)

    stream.on('data', function(){
        console.log(fileMp3.bytesWritten)
    })
}
