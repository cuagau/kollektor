var panel;
function showPanel(panelId) {
  panel = panelId;
  $(".panel").hide();
  $("#" + panelId).show();
}
showPanel('connecting')

function openMedia(hash) {
  var media = data.medias[hash];
  console.log(media);
  console.log(data);
  if (media) {
    $('#largeImage').attr("src", thumbnailSrc(hash));
    var tagString = '';
    for (var tag in media.tags) {
      tagString += tag;
    }
    $('#tags').html(tagString);
  }
  showPanel('media');
}

function thumbnailSrc(hash, count) {
  var src = 'cache/' + hash;
  if (count !== undefined) {
    src += '.' + count;
  }
  src += '.jpg';
  return src;
}

//make sure everything is cleared
//set up connection
var socket = io.connect();
socket.on('connect', function () {
  showPanel('search');
  socket.emit('refresh');
});

//handle server disconnects
socket.on('disconnect', function () {
  $("#connecting-message").text('Connection Lost...Trying to Reconnect...');
  showPanel('connecting')
});

var data; //stores all media and tag data

socket.on('refreshed', function (newData) {
  data = newData;
  var html = '';
  for (var id in data.medias) {
    var result = data.medias[id];
    console.log(result);
    html += '<div class="media"><span class="title">' + result.tags.title + '</span><span class="rating">';
    for(var j = 0; j < result.tags.rating; j++) {
      html += '<i class="glyphicon glyphicon-star" aria-hidden="true"></i>';
    }
    var imgSrc = thumbnailSrc(id);
    html += '</span><div class="thumb" data-media-id="' + id + '"><img src="' + imgSrc + '"></div></div>';
  }
  $('#searchResults').html(html);
  $('.thumb').click(function () {
    openMedia($(this).data('media-id'));
  })
});

$('#closeMedia').click(function () {
  showPanel('search');
})

$(document).keyup(function (e) {
  if (e.which == 37) { //left arrow
  }
});