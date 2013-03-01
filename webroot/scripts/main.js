(function($){
    var practice = {
        completed:[],
        correct:0,
        attempted:0,
        getInt: function(){
          return Math.floor(Math.random() * this.content.length);
        },
        init: function(data){
            // load cookie
            var context = this;
            context.content = data;
            context.$audio = $("<audio>", {
                id: "pronunciation",
                preload: "auto"
            }).appendTo("body");
            $("<audio>", {
                id: "bell",
                preload: "auto",
                src: "/sounds/bell.mp3"
            }).appendTo("body");
            $("<audio>", {
                id: "buzz",
                preload: "auto",
                src: "/sounds/buzzer.mp3"
            }).appendTo("body");
            context.$msg = $("<div>", {
                id: "msg"
            }).appendTo("body")
                .append(
                    $("<p>", {
                        click: function(e){
                            e.preventDefault();
                            context.quiz();
                        }
                    })
                    .append($("<i>", {"class":"icon-refresh"}))
                    .append($("<span>", {id: "positive", "class": "feedback", text: "correct"}))
                    .append($("<span>", {id: "negative", "class": "feedback", text: "wrong"}))
                );
            context.$status = $("<div>", {
                id: "status",
                html: 'Attempted: <span id="attempted">0</span> Correct: <span id="correct">0</span>'
            }).appendTo("body");
            context.$q = $("<p>", {
                id: "q"
            }).appendTo("body");
            context.$text = $("<span>").appendTo(context.$q);
            context.$listen = $("<i>", {
                "class": "icon-play-circle",
                click: function(){
                    var audio = document.getElementById("pronunciation");
                    audio.currentTime = 0;
                    audio.play();
                }
            }).prependTo(context.$q);
            context.$a = $("<ul>", {
                id: "a"
            }).appendTo("body");
            context.quiz();
        },
        reset: function(){
            var context = this;
            context.$msg.removeAttr("class");
            context.$text.empty();
            context.$a.removeAttr("class").empty();
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
            context.$audio.attr("src", item.pronunciation);
            list.push(item.translated);
            for(var i=0; i<3; i++){
                list.push(context.content[context.getInt()].translated);
            }
            $.each(list.shuffle(), function(i,v){
                $("<li>", {
                    html: v,
                    click: function(e){
                        var $this = $(this);
                        e.preventDefault();
                        if(!context.$a.hasClass("answered")){
                            context.$a.addClass("answered");
                            context.attempted++;
                            var audio;
                            if($this.data("answer")){
                                context.completed.push(index);
                                context.correct++;
                                $this.addClass("correct");
                                context.feedback("correct");
                                audio = document.getElementById("bell");
                                audio.currentTime = 0;
                                audio.play();
                            } else {
                                audio = document.getElementById("buzz");
                                audio.currentTime = 0;
                                audio.play();
                                $this.addClass("chosen").siblings().each(function(){
                                    $(this).addClass($(this).data("answer")? "correct" : "unchosen" );
                                });
                                context.feedback("incorrect");
                            }
                        }
                    }
                }).data("answer", v === item.translated).appendTo(context.$a);
            });
        },
        feedback: function(type){
            var context = this;
            context.$msg.addClass(type);
            $('#attempted').text(context.attempted);
            $('#correct').text(context.correct);
            context.updateCookie();
        },
        updateCookie: function(){
            //update cookie;
        }
    };
    $.getJSON("/languages/espanol.json", function(data){
        (function(debug){
            if(debug){
                console.dir(data);
            }
        })(false);
        $("#loading").hide();
        practice.init(data);
    });
})(jQuery);
