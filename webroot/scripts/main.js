(function($){
  var practice = {
    completed:[],
    cookieName: "1kwords_espanol",
    correct:0,
    attempted:0,
    getInt: function(){
      return Math.floor(Math.random() * this.content.length);
    },
    init: function(data){
      var context = this;
      context.content = data;
      $.cookie.json = true;
      context.loadCookie();
      context.ui();
      context.quiz();
    },
    play: function(id){
      var audio = document.getElementById(id);
      audio.currentTime = 0;
      audio.play();
    },
    reset: function(){
      var context = this;
      context.$msg.removeAttr("class");
      context.$text.empty();
      context.$a.removeAttr("class").empty();
      return context;
    },
    ui: function(){
      var context = this;
      context.$pronunciation = context.build.audio({id: "pronunciation"});
      context.$success = context.build.audio({ id: "bell", src: "/sounds/bell.mp3" });
      context.$fail = context.build.audio({ id: "buzz", src: "/sounds/buzzer.mp3" });
      context.$msg = $("<div>", { id: "msg" }).appendTo("body")
        .append(
          $("<p>", {
            click: function(e){
              e.preventDefault();
              context.quiz();
            }
          })
          .append($("<i>", {"class":"icon-repeat"}))
          .append($("<span>", {id: "positive", "class": "feedback", text: "correct"}))
          .append($("<span>", {id: "negative", "class": "feedback", text: "wrong"}))
        );
      context.$status = $("<div>", {
        id: "status",
        html: '<p>Attempted: <span id="attempted">'+context.attempted+'</span></p> <p>Correct: <span id="correct">'+context.correct+'</span></p>'
      }).appendTo("body");
      context.$clear = $("<span>", {
        id:"clear",
        html: 'Clear Progress <i class="icon-remove-sign"></i>',
        click: function(e){
          e.preventDefault();
          context.clearCookie();
        }
      }).appendTo(context.$status);
      context.$q = $("<p>", { id: "q" }).appendTo("body");
      context.$text = $("<span>").appendTo(context.$q);
      context.$listen = $("<i>", {
        "class": "icon-play-circle",
        click: function(){
          context.play(context.$pronunciation.attr('id'));
        }
      }).prependTo(context.$q);
      context.$a = $("<ul>", { id: "a" }).appendTo("body");
      return context;
    },
    quiz: function(){
      var context = this.reset();
      var index;
      var list = [];
      do {
        index=context.getInt();
      } while ($.inArray(index, context.completed) !== -1);
      var item = context.content[index];
      context.$text.html(item.untranslated);
      context.$pronunciation.attr("src", item.pronunciation);
      list.push(item.translated);
      for(var i=0; i<3; i++){
        var text;
        do {
          text = context.content[context.getInt()].translated;
        } while ($.inArray(text, list) !== -1);
        list.push(text);
      }
      $.each(list.shuffle(), function(i,v){
        $("<li>", {
          html: '<i class="icon-check-empty"></i>'+v,
          click: function(e){
            var $this = $(this);
            e.preventDefault();
            if(!context.$a.hasClass("answered")){
              context.$a.addClass("answered");
              $("i", this).attr("class", "icon-check");
              if($this.data("answer")){
                context.completed.push(index);
                $this.addClass("correct").siblings().addClass("unchosen");
                context.feedback("correct");
              } else {
                $this.addClass("chosen").siblings().each(function(){
                  $(this).addClass($(this).data("answer")? "correct" : "unchosen" );
                });
                context.feedback("incorrect");
              }
            }
          }
        }).data("answer", v === item.translated).appendTo(context.$a);
      });
      return context;
    },
    feedback: function(type){
      var context = this;
      context.attempted++;
      context.$msg.addClass(type);
      if (type === "correct"){
        context.play(context.$success.attr("id"));
        context.correct++;
      }else{
        context.play(context.$fail.attr("id"));
      }
      $('#attempted').text(context.attempted);
      $('#correct').text(context.correct);
      context.setCookie();
      return context;
    },
    clearCookie: function(){
      var context = this;
      context.completed = [];
      context.attempted = 0;
      $("#attempted").add("#correct").text(0);
      context.correct = 0;
      $.cookie(this.cookieName, null);
      context.quiz();
    },
    loadCookie: function(){
      var context = this;
      var cookie = $.cookie(context.cookieName);
      return $.extend(true, context, cookie);
    },
    setCookie: function(){
      var context = this;
      return $.cookie(context.cookieName, {
        "completed": context.completed,
        "attempted": context.attempted,
        "correct": context.correct
      });
    },
    build: {
      audio: function(attr){
        return $("<audio>", {
          preload: "auto",
          id: attr.id || "",
          src: attr.src || ""
        }).appendTo("body");
      }
    }
  };
  $.getJSON("/languages/espanol.json", function(data){
    $("#loading").hide();
    practice.init(data);
  });
})(jQuery);
