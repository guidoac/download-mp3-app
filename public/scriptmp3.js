$('#btn-pesquisar').on('click', function () {
    $('ul').empty()
    let url_input = $('input')[0].value
    let playlistID = formatarPesquisa(url_input)
    $("#btn-download-playlist").attr("playlist-ID", playlistID)
    pesquisarPlaylist(playlistID)
})

$("#btn-download-playlist").on('click', function () {
    let playlistID = $(this).attr('playlist-ID')
    $.get('/downloadPlaylist', { id_playlist: playlistID })
})

$(document).on('click', '.btn-download', function () {
    let id = $(this).attr('video-id')
    $.get('/downloadVideo', { id_video: id });
})

$(document).on('click', 'li', function () {
    urlVideo = $(this).attr('video-url')
    $('#video-principal').attr('src', urlVideo)
})

function formatarPesquisa(urlInput) {
    try {
        let urlObjeto = new URL(urlInput)
        let playlistId = urlObjeto.searchParams.get('list')
        return playlistId
    } catch (TypeError) {
        console.log('Insira uma URL válida')
    }
}

async function pesquisarPlaylist(id) {
    info_playlist = await $.get('/pesquisar', { playlistID: id })
    info_playlist.forEach(adicionarItemLista);

    id_primeiro_video = info_playlist[0].id
    url_primeiro_video = 'http://www.youtube.com/embed/' + id_primeiro_video
    $('#video-principal').attr('src', url_primeiro_video)
}

function adicionarItemLista(item) {
    let titulo_video = item.name;
    let url_thumb = item.urlthumb;
    let id_video = item.id;
    let url_video = 'http://www.youtube.com/embed/' + id_video

    let str_item_lista =
        '<li class="list-group-item align-itens-center py-1" video-url=' + url_video + '>\
            <div class="row">\
                <div id="thumb-lista-playlist" class="img-thumbnail">\
                    <img src=' + url_thumb + ' alt="thumb">\
                </div>\
                <div id="coluna-lista-playlist" class="col-7 p-0 text-center">\
                    <div id="titulo-video-lista">' + titulo_video + '</div>\
                    <div class="btn-download" video-id=' + id_video + '><i class="far fa-arrow-alt-circle-down"></i></div>\
                </div>\
            </div>\
        </li>'

    $('ul').append(str_item_lista)
}

