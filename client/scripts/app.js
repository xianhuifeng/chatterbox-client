  var app = {
    server : 'https://api.parse.com/1/classes/chatterbox',
    init : function(){
      $("#submit").on('click', function(e) {
        e.preventDefault();
        app.send(app.getMessage());
      });
      $('#chats').on('click', ".username", function(){
        var context = this;
        app.addFriend(context);
      });
      app.fetch();
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
            // console.log(data['results'][i]);
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
      var chatObj = {
        username: username,
        text: newChat,
        roomname: "AppleTree"
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
      console.log(message.username);
    },

    addRoom: function(roomName) {
      $('#roomSelect').append("<div>" + roomName + "</div>");
    },
    addFriend: function(self){
      $(self).addClass('friend');
      for()
    },
    // getFriendMessages : function(self, message){
    //   var friendName = $(self).text();
    //   // console.log($(self));

    // }
  };
$(document).ready(function() {
  app.init();
});

