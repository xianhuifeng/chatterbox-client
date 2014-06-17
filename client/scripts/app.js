  var app = {
    server : 'https://api.parse.com/1/classes/chatterbox',

    init : function(){
      $("#submit").on('click', function(e) {
        e.preventDefault();
        app.send(app.getMessage());
      });

      $('#submitRoom').on('click', function(e) {
        e.preventDefault();
        app.addRoom($(".newRoom").val());
      });

      $('#roomSelect').on('click','.roomNumber', function(e){
        $(this).css('color','orange');
        $('.selectedRoom').empty();
        app.clearMessages();
        $('.selectedRoom').append($(this).text());
      });

      $('#chats').on('click', ".username", function(){
        var context = this;
        app.addFriend(context);
      });
    },

    send: function(message) {
      $.ajax({
        url: this.server,
        type: 'POST',
        data: JSON.stringify(message),
        contentType: 'application/json',
        success: function (data) {
          console.log('chatterbox: Message sent', message);
          app.fetch();
        },
        error: function (data) {
          console.error('chatterbox: Failed to send message');
        }
      });
    },
    fetch: function() {
      $.ajax({
        url: this.server,
        type: 'GET',
        data: {order: "-createdAt"},
        dataType: 'json',
        success: function (data) {
          console.log('chatterbox: Message fetched');
          console.log(data);
          app.clearMessages();
          data['results'].sort(function(a, b) {
            return a.createdAt < b.createdAt ?-1:1;
          });
          for(var i = 0; i < data['results'].length; i++) {
              app.addMessage(data['results'][i]);
          }
        },
        error: function (data) {
          console.error('chatterbox: Failed to send message');
        }
      });
    },

    getMessage: function(){
      var usernameArr = window.location.href.split('username=');
      var username = usernameArr[1];
      var newChat = $('.newChat').val();
      var newRoom = $('.selectedRoom').text().substr(6);
      var chatObj = {
        username: username,
        text: newChat,
        roomname: newRoom,
        friendname: undefined
      };
      return chatObj;
    },
    clearMessages: function() {
      $('#chats').empty();
    },
    addMessage: function(message){
      var textEscape = _.escape(message.text || message.message);
      var userEscape = _.escape(message.username);
      $('#chats').prepend("<li class='chat'>" + "<span class = 'username'>" +
       userEscape + "</span>" + ":"+ textEscape +"...sent from room: " +
       message.roomname + "</li>");
    },

    addRoom: function(roomName) {
      $('#roomSelect').append("<div class='roomNumber'>" + 'Room: ' + roomName + "</div>");
    },
    addFriend: function(self){
      var friendName = $(self).text();
      $('.chat:contains(' + friendName + ')').addClass('friend');
    }
  };
$(document).ready(function() {
  app.init();
  setInterval(function(){
    app.fetch();
  },3000);
});

