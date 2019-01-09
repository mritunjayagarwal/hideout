
$(document).ready(function(){
    var socket = io();
    var senderName = $('#senderName').val();
    var senderImage = $('#senderImage').val();

    socket.on('connect', () => {
        console.log('User Connected');
    });

    $('#sendTweet').on('click', function(e){

        var tweet = $('#tweet').val();

        if(tweet != ''){

        e.preventDefault();

        socket.emit('tweet', {
            tweet: tweet,
            sender: senderName
        }, function(){
            console.log('Tweeted Successfully');
            $('#tweet').val('');
        });

        var tweetName = $('#tweet').val();

        $.ajax({
            url: '/home',
            type: 'POST',
            data: {
                tweetName: tweetName
            },success: function(){
                console.log('dataTransferred');
            }
        })
      }
    });

    socket.on('newTweet', (data) => {
        var html = '';
        html += '<div class="media">';
        html += '<div class="media-body" id = "post-container">';
        html += ' <h4 class="media-heading" id = "post"> <a href = "/user/"><img id = "post-img" class="media-object" src="https://hidingout.herokuapp.com/profile/default.png" /></a>' + data.sender + '<span id = "twee">posted</span></h4>';
        html += '<h6 class = "media-heading" id = "post" style = "margin-left:55px;margin-bottom:20px;font-size:5px;margin-top:-17px;">just now</h6>'
        html += '<p class = "media-oject" id = "post-content">' + data.tweet +'</p>';
        html += '</div></div>';
        $('#tweets').prepend(html);
    });
})