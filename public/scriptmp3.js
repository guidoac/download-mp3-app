var API_URL = 'https://www.googleapis.com/youtube/v3/playlistItems';
var API_KEY = 'AIzaSyD7Bf0qZbBWlV_r9iNHvc5HZdqk2Ya8LCc';

// https://www.youtube.com/playlist?list=PLEE-L5Au_XzcTtkFvGmQOAjVPcDVqYw5I



$('#btn-pesquisar').on('click', function () {
    $('li').remove()
    let url_input = $('input')[0].value
    let playlistID = formatarPesquisa(url_input)
    $("#btn-download-playlist").attr("playlist-ID", playlistID)
    pesquisarPlaylist(playlistID)
})

$("#btn-download-playlist").on('click', function () {
    let playlistID = $(this).attr('playlist-ID')

    $.get('/downloadPlaylist', { id_playlist: playlistID })
})

function formatarPesquisa(url_input) {
    let urlObjeto = new URL(url_input)
    let playlistId = urlObjeto.searchParams.get('list')
    return playlistId
}

function pesquisarPlaylist(id) {
    var param_busca = {
        key: API_KEY,
        part: 'snippet',
        playlistId: id,
        maxResults: 50
    }

    $.getJSON(API_URL, param_busca)

        .then((data) => {
            console.log(data)
            var videos_playlists = data['items'];

            var id_primeiro_video = videos_playlists[0].snippet.resourceId.videoId
            var url = 'http://www.youtube.com/embed/' + id_primeiro_video
            $('#video-principal').attr('src', url)

            videos_playlists.forEach(adicionarItemLista);
        })
}
function adicionarItemLista(item) {
    var titulo_video = item.snippet.title;
    var url_thumb = item.snippet.thumbnails.default.url;
    const id_video = item.snippet.resourceId.videoId;
    var url_video = 'http://www.youtube.com/embed/' + id_video

    var str_item_lista =
        '<li class="list-group-item align-itens-center py-1">\
            <div id="item_lista" class="row">\
                <div id="thumb-lista-playlist" class="img-thumbnail">\
                    <img src=' + url_thumb + ' alt="thumb">\
                </div>\
                <div id="coluna-lista-playlist" class="col-7 p-0 text-center">\
                    <div id="titulo-video-lista">' + titulo_video + '</div>\
                    <div id="btn-download" video-id=' + id_video + '><i class="far fa-arrow-alt-circle-down"></i></div>\
                </div>\
            </div>\
        </li>'

    $('ul').append(str_item_lista);
    $('#btn-download').on('click', function () {
        var id = $(this).attr("video-id");
        $.get('/downloadVideo', { id_video: id });
    })
    $('#item_lista').on('click', function () {
        $('#video-principal').attr('src', url_video)
    })

}

