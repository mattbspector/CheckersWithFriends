$(document).ready(function()
{
      $(".mybtn").click(function()
      {
      		$(".overlay-main").slideUp(1000);
      		if($(this).hasClass("btn-danger"))
                  {
      				team = "red";
      				$('.piece.black').draggable('disable');
      				$('header').text("You are on the Red Team");
      				$('header').css("background-color", "#c31b3b");
      				$('header').css("font-size", "50px");
      				$('header').css("color", "white");
      		}
                  else
                  {
      				team = "black";
      				$('.piece.red').draggable('disable');
      				$('header').text("You are on the Grey Team");
      				$('header').css("background-color", "#787a7d");
      				$('header').css("font-size", "50px");
      				$('header').css("color", "white");


      		}
      		$("#turn_display").css("display", "");
                  history = pubnub.history({
                       channel: team,
                       callback: function(m){
                              for (var i = 0; i < 100; i++) {

                                    var messageDiv = document.createElement('div');

                                    if (m[0][i]["MyUuid"] == uniqueID) {
                                          messageDiv.className = "message me";
                                    }
                                    else{
                                          messageDiv.className = "message";
                                    };

                                    var messageImage = document.createElement('img');
                                    messageImage.src = "http://api.randomuser.me/portraits/med/women/36.jpg";
                                    messageDiv.appendChild(messageImage);

                                    var innerMessageDiv = document.createElement('div');
                                    var innerMessageDivP = document.createElement('p');
                                    innerMessageDivP.innerHTML = m[0][i]["text"];

                                    innerMessageDiv.appendChild(innerMessageDivP);
                                    messageDiv.appendChild(innerMessageDiv);

                                    var chatBox = document.getElementById('chatbox');
                                    chatBox.appendChild(messageDiv);
                              };
                              $('#chatbox').animate({"scrollTop": $('#chatbox')[0].scrollHeight}, "fast");
                        },
                       count: 100, // 100 is the default
                       reverse: false // false is the default
                      });


                  subscribe = pubnub.subscribe({
                        channel: team,
                        presence: function(m){
                              console.log(m["occupancy"]);
                              var bar = document.getElementById('presenceBar');
                              bar.innerHTML = "There are " + m["occupancy"] + " memebers on your team";

                        },
                        message: function(m){
                              // <div class="chat">
                              //       <div class="message me">
                              //             <img src="http://api.randomuser.me/portraits/med/women/36.jpg" />
                              //             <div><p>Curabitur feugiat libero sed lacinia sollicitudin.</p></div>
                              //       </div>
                              // </div>
                              
                              var messageDiv = document.createElement('div');

                              if (m["MyUuid"] == uniqueID) {
                                    messageDiv.className = "message me";
                              }
                              else{
                                    messageDiv.className = "message";
                              };

                              var messageImage = document.createElement('img');
                              messageImage.src = "http://api.randomuser.me/portraits/med/women/36.jpg";
                              messageDiv.appendChild(messageImage);

                              var innerMessageDiv = document.createElement('div');
                              var innerMessageDivP = document.createElement('p');
                              innerMessageDivP.innerHTML = m["text"];

                              innerMessageDiv.appendChild(innerMessageDivP);
                              messageDiv.appendChild(innerMessageDiv);

                              var chatBox = document.getElementById('chatbox');
                              chatBox.appendChild(messageDiv);
                              $('#chatbox').animate({"scrollTop": $('#chatbox')[0].scrollHeight}, "fast");


                        },
                        error: function (error) {
                              // Handle error here
                        }
                  });
      });
});
function process(e) {
    var code = (e.keyCode ? e.keyCode : e.which);
    if (code == 13) { //Enter keycode
     if (!(document.getElementById('input').value == "")) {
            var obj = {text:document.getElementById('input').value, MyUuid: uniqueID};
            var jsonString= JSON.stringify(obj);
            pubnub.publish({
                channel: team,        
                message: obj,
                callback : function(m){
                  document.getElementById("input").value = "";                   
                }
            });
     }
     else{
            document.getElementById("input").value = "";                   
     }; 
    }
}
