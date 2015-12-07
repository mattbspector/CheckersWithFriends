var MovesMap = new Object();
var image_int = Math.floor((Math.random() * 12) + 1);

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
                       channel: 'general_channel',
                       callback: function(m){
                           boardString = JSON.stringify(m[0][0]);
                           if(team == "black"){
                              for(var i = 0; i < m[0][0]["moves"]["black"].length; i++){
                                    if(!(m[0][0]["moves"]["black"][i]['board_as_long_ass_string'] in MovesMap)){
                                          MovesMap[m[0][0]["moves"]["black"][i]['board_as_long_ass_string']] = {'count':1, 'start_move': m[0][0]["moves"]["black"][i]['formatted_move_start'], 'end_move': m[0][0]["moves"]["black"][i]['formatted_move_end']};
                                    }
                                    else{
                                          MovesMap[m[0][0]["moves"]["black"][i]['board_as_long_ass_string']]['count']++;
                                    }
                              }
                              var sortable = [];
                              for (var move in MovesMap){
                                    sortable.push([move, MovesMap[move]['count'],MovesMap[move]['start_move'], MovesMap[move]['end_move'] ]);
                              }
                              sortable.sort(function(a, b) {return b[1] - a[1]})
                              console.log(sortable);
                              for(var i = 0; i < sortable.length; i++){
                                    $(".votingMain").append("<a class='votingLink' href='#'><div class='votingInner'>" +sortable[i][2] +" to "+ sortable[i][3]+ "<span class='boardInner'>" +sortable[i][0]+ "</span>"+ "</div></a>" )
                              }
                           }
                           else{
                               for(var i = 0; i < m[0][0]["moves"]["red"].length; i++){
                                    if(!(m[0][0]["moves"]["red"][i]['board_as_long_ass_string'] in MovesMap)){
                                          MovesMap[m[0][0]["moves"]["red"][i]['board_as_long_ass_string']] = {'count':1, 'start_move': m[0][0]["moves"]["red"][i]['formatted_move_start'], 'end_move': m[0][0]["moves"]["red"][i]['formatted_move_end']};
                                    }
                                    else{
                                          MovesMap[m[0][0]["moves"]["red"][i]['board_as_long_ass_string']]['count']++;
                                    }
                              }
                              var sortable = [];
                              for (var move in MovesMap){
                                    sortable.push([move, MovesMap[move]['count'],MovesMap[move]['start_move'], MovesMap[move]['end_move'] ]);
                              }
                              sortable.sort(function(a, b) {return b[1] - a[1]})
                              console.log(sortable);
                              for(var i = 0; i < sortable.length; i++){
                                    $(".votingMain").append("<a class='votingLink' href='#'><div class='votingInner'>" +sortable[i][2] +" to "+ sortable[i][3]+ "<span class='boardInner'>" +sortable[i][0]+ "</span>"+ "</div></a>" )
                              }
                                  
                           }     
          //Setup the board and choose the starting color
                        },
                 count: 1, // 100 is the default
                 reverse: false // false is the default
                });

                 subscribe = pubnub.subscribe({
                    channel: 'general_channel',
                    message: function(m){
                        boardString = JSON.stringify(m);
                        $(".votingLink").remove();
                        MovesMap = new Object();
                            if(team == "black"){
                              for(var i = 0; i < m["moves"]["black"].length; i++){
                                    if(!(m["moves"]["black"][i]['board_as_long_ass_string'] in MovesMap)){
                                          MovesMap[m["moves"]["black"][i]['board_as_long_ass_string']] = {'count':1, 'start_move': m["moves"]["black"][i]['formatted_move_start'], 'end_move': m["moves"]["black"][i]['formatted_move_end']};
                                    }
                                    else{
                                          MovesMap[m["moves"]["black"][i]['board_as_long_ass_string']]['count']++;
                                    }
                              }
                              var sortable = [];
                              for (var move in MovesMap){
                                    sortable.push([move, MovesMap[move]['count'],MovesMap[move]['start_move'], MovesMap[move]['end_move'] ]);
                              }
                              sortable.sort(function(a, b) {return b[1] - a[1]})
                              console.log(sortable);
                              for(var i = 0; i < sortable.length; i++){
                                    $(".votingMain").append("<a class='votingLink' href='#'><div class='votingInner'>" +sortable[i][2] +" to "+ sortable[i][3]+ "<span class='boardInner'>" +sortable[i][0]+ "</span>"+ "</div></a>" )
                              }
                           }
                           else{
                                for(var i = 0; i < m["moves"]["red"].length; i++){
                                    if(!(m["moves"]["red"][i]['board_as_long_ass_string'] in MovesMap)){
                                          MovesMap[m["moves"]["red"][i]['board_as_long_ass_string']] = {'count':1, 'start_move': m["moves"]["red"][i]['formatted_move_start'], 'end_move': m["moves"]["red"][i]['formatted_move_end']};
                                    }
                                    else{
                                          MovesMap[m["moves"]["red"][i]['board_as_long_ass_string']]['count']++;
                                    }
                              }
                              var sortable = [];
                              for (var move in MovesMap){
                                    sortable.push([move, MovesMap[move]['count'],MovesMap[move]['start_move'], MovesMap[move]['end_move'] ]);
                              }
                              sortable.sort(function(a, b) {return b[1] - a[1]})
                              console.log(sortable);
                              for(var i = 0; i < sortable.length; i++){
                                    $(".votingMain").append("<a class='votingLink' href='#'><div class='votingInner'>" +sortable[i][2] +" to "+ sortable[i][3]+ "<span class='boardInner'>" +sortable[i][0]+ "</span>"+ "</div></a>" )
                              }
                                  
                           }  
                    },
                    error: function (error) {
                        // Handle error here
                    }
                });

                  history = pubnub.history({
                       channel: team+"_chat",
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
                                    messageImage.src = "img/" + m[0][i]["img"]+".png";
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
                        channel: team+"_chat",
                        presence: function(m){
                              console.log(m["occupancy"]);
                              var bar = document.getElementById('presenceBar');
                              var icon = document.createElement('i');
                              icon.className = "fa fa-users";
                              icon.style.marginLeft = "10px";
                              icon.style.fontSize = "16px";
                              bar.innerHTML =  "There are " + m["occupancy"] + " memebers on your team";
                              bar.className = "logo smallest";
                              bar.appendChild(icon);

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
                              messageImage.src = "img/" + m["img"]+ ".png";
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
            var obj = {
              text:document.getElementById('input').value, 
              MyUuid: uniqueID,
              img: image_int
            };
            var jsonString= JSON.stringify(obj);
            pubnub.publish({
                channel: team+"_chat",        
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
