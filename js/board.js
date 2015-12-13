//DEFINE NEW_BOARD_STRING = "1010003001000303101000300100030310100030010003031010003001000303"  
//{"board":"1010003001000303101000300100030310100030010003031010003001000303","turn":"red"}
var boardString = "";
var votingsimulationBoard = "";
var setup = "";
var history = "";
var subscribe = "";
var pubnub = "";
var turn = "black";
var team = "";
var votingTeamTurn = "";
var uniqueID;
var exec = ""
var myNewBoard = "";
$(window).ready(function() {
  pubnub = PUBNUB({
    subscribe_key: 'sub-c-34be47b2-f776-11e4-b559-0619f8945a4f',
    publish_key: 'pub-c-f83b8b34-5dbc-4502-ac34-5073f2382d96',
    heartbeat: 31,
    heartbeat_interval: 30  
  });

  uniqueID = PUBNUB.uuid();

    //Query History and set Board String
    history = pubnub.history({
     channel: 'general_channel',
     callback: function(m){
         boardString = JSON.stringify(m[0][0]);

         if(m[0][0]["turn"] == "black"){
                //NotTurnButTeam
                $( ".checkerBoard" ).children().remove();
                setup('red');
                 $('header').text("It is Grey's Turn");
                 $('header').css("background-color", "#787a7d");
                 $('header').css("color", "white");
                $(".piece.black").addClass("currentTurn");

          }
          else{
                //NotTurnButTeam
                $( ".checkerBoard" ).children().remove();
                setup('black');
                $('header').text("It is Red's Turn");
                $('header').css("background-color", "#c31b3b");
                $('header').css("color", "white");
                $(".piece.red").addClass("currentTurn");
          }
          //Setup the board and choose the starting color
      },
     count: 1, // 100 is the default
     reverse: false // false is the default
    });
    //NOT SURE IF IT DOES ANYTHING

     
    });
 

   setup = function setup(startingColor){
      //Lay down the checkerboard
      for (var i=0;i<8;i++){
        $('.checkerBoard').append('<tr row="'+i+'"></tr>');
        for (var j=0;j<8;j++){
          var color = 'black';
          if ((i+j)%2 == 0){color = 'white'};
          $('.checkerBoard tr[row='+i+']').append('<td class="cell '+color+'" row="'+i+'" col="'+j+'"></td>');
        }
      }

      var boardJson = JSON.parse(boardString);
      var board = boardJson["board"];
      votingsimulationBoard = board;
      //Create the pieces for a new game
        //"1010003001000303101000300100030310100030010003031010003001000303"  
      for (var i=0;i<8;i++){
        for (var j=0;j<8;j++){
            if(board[(8 * i) + j] == 1){
                 $('.checkerBoard [row='+i+'][col='+j+']').append('<div class="piece black"><div class="kingCenter">&#9812;</div></div>');
            }
            else if(board[(8 * i) + j] == 2){
                 $('.checkerBoard [row='+i+'][col='+j+']').append('<div class="piece black king"><div class="kingCenter">&#9812;</div></div>');
            }
            else if(board[(8 * i) + j] == 3){
                 $('.checkerBoard [row='+i+'][col='+j+']').append('<div class="piece red"><div class="kingCenter">&#9812;</div></div>');
            }
            else if(board[(8 * i) + j] == 4){
                 $('.checkerBoard [row='+i+'][col='+j+']').append('<div class="piece red king"><div class="kingCenter">&#9812;</div></div>');
            }
        }
      }
      //give the pieces draggablility
      $('.piece').draggable({
          containment: '.checkerBoard',
          cursor: 'move',
          revert: true,
          start: findCells,
          stop: removeActive,
          helper: myHelper
        });


      if(team == "black"){
        $('.piece.red').draggable('disable');
      }
      else if(team == "red"){
        $('.piece.black').draggable('disable');
      }

      $('.piece.'+startingColor).draggable('disable');

    }

    function findCells(event, ui){
      //When a piece is picked up, find the possible moves
      var row = parseInt($(this).parent().attr('row'));
      var col = parseInt($(this).parent().attr('col'));
      var dir = 1;
      var color = 'black';
      if ($(this).hasClass('red')){
        dir = -1;
        color = 'red';
      }
      piece = $(this);
      checkCells(piece,row,col,dir,color,0);
    }

    function checkCells(piece,row,col,dir,color,double){
      if (piece.hasClass('king')){
        checkCell(row,col,1,dir*-1,color,double);
        checkCell(row,col,-1,dir*-1,color,double);
      }
      checkCell(row,col,1,dir,color,double);
      checkCell(row,col,-1,dir,color,double);
    }

    function checkCell(row,col,step,dir,color,double){
      if ($('.cell[row='+(row+step)+'][col='+(col+dir)+'] .piece').length > 0){
        if (!$('.cell[row='+(row+step)+'][col='+(col+dir)+'] .piece').hasClass(color)){
          if ($('.cell[row='+(row+step*2)+'][col='+(col+dir*2)+'] .piece').length == 0){
            $('.cell[row='+(row+step*2)+'][col='+(col+dir*2)+']').addClass('activeCell');
          }
        }
      }
      else if (double == 0){
        $('.cell[row='+(row+step)+'][col='+(col+dir)+']').addClass('activeCell');
      }
      $('.activeCell').droppable({
        accept: '.piece',
        hoverClass: 'hovered',
        drop: proposeNewMove
      });
    }
    String.prototype.replaceAt=function(index, character) {
        return this.substr(0, index) + character + this.substr(index+character.length);
    }

    function changJsonString(piece, oldcol, oldrow, newcol, newrow, activecells){
        var newindex = (8 * newrow) + newcol;        
        var oldindex = (8 * oldrow) + oldcol;
        
        var boardJson = JSON.parse(boardString);
        boardJson["board"] = boardJson["board"].replaceAt(oldindex, '0');
        if(piece.hasClass('red')){
            if(piece.hasClass('king')){
                boardJson["board"] = boardJson["board"].replaceAt(newindex, '4');
            }
            else{
                boardJson["board"] = boardJson["board"].replaceAt(newindex, '3');
            }
            boardJson["turn"] = "black";
        }
        else{
            if(piece.hasClass('king')){
                 boardJson["board"] = boardJson["board"].replaceAt(newindex, '2');
            }
            else{
                 boardJson["board"] = boardJson["board"].replaceAt(newindex, '1');
            }
            boardJson["turn"] = "red";

        }
        // $(".lefty").append("<div>" + boardJson["board"] + "</div>");

        if (Math.abs(oldrow-newrow) == 2 || Math.abs(oldcol-newcol) == 2){
            var middleRow = (oldrow + newrow)/2;
            var middleCol = (oldcol + newcol)/2;
            var middleIndex = (8 * middleRow) + middleCol;
            boardJson["board"] = boardJson["board"].replaceAt(middleIndex, '0');
            
            //Handling Double Jumps
            if(piece.hasClass('red') && activecells){
                boardJson["turn"] = "red";
            }
            else if(activecells){
                boardJson["turn"] = "black";
            }

        }
        //Publish boardJSON
        boardJson['moves'] = {'black' : [], 'red' : []};
        var pubnub = PUBNUB({
          subscribe_key: 'sub-c-34be47b2-f776-11e4-b559-0619f8945a4f',
          publish_key: 'pub-c-f83b8b34-5dbc-4502-ac34-5073f2382d96',
          heartbeat: 31,
          heartbeat_interval: 30  
        });
        pubnub.publish({
            channel: 'general_channel',        
            message: boardJson,
            callback : function(m){}
        });
    }
    function proposeNewMove(event, ui){
      var oldrow = parseInt(ui.draggable.parent().attr('row'));
      var oldcol = parseInt(ui.draggable.parent().attr('col'));
      console.log(oldcol + " " + oldrow);
      var newcol = parseInt($(this).attr('col'));
      var newrow = parseInt($(this).attr('row'));
      var newindex = (8 * newrow) + newcol;
      console.log(newcol + " " + newrow);      

        var oldindex = (8 * oldrow) + oldcol;
        
        var boardJson = JSON.parse(boardString);
        var myNewBoard = boardJson["board"];
        myNewBoard = myNewBoard.replaceAt(oldindex, '0');
        if(piece.hasClass('red')){
            if(piece.hasClass('king')){
                myNewBoard = myNewBoard.replaceAt(newindex, '4');
            }
            else{
                myNewBoard = myNewBoard.replaceAt(newindex, '3');
            }
        }
        else{
            if(piece.hasClass('king')){
                 myNewBoard = myNewBoard.replaceAt(newindex, '2');
            }
            else{
                 myNewBoard = myNewBoard.replaceAt(newindex, '1');
            }
        }

        var middleRow = -1;
        var middleCol = -1;
        if (Math.abs(oldrow-newrow) == 2 || Math.abs(oldcol-newcol) == 2){
            middleRow = (oldrow + newrow)/2;
            middleCol = (oldcol + newcol)/2;
            var middleIndex = (8 * middleRow) + middleCol;
            myNewBoard = myNewBoard.replaceAt(middleIndex, '0');
        }
        
        var vote_obj = {
            board_as_long_ass_string: myNewBoard,
            formatted_move_start: oldcol+","+oldrow,
            formatted_move_end: newcol+","+newrow,
            user_uuid: uniqueID
        };

        if(boardJson["turn"] == "black"){
          boardJson["moves"]["black"].push(vote_obj);
        }
        else{
          boardJson["moves"]["red"].push(vote_obj);
        }

        //Publish boardJSON
        var   pubnub = PUBNUB({
          subscribe_key: 'sub-c-34be47b2-f776-11e4-b559-0619f8945a4f',
          publish_key: 'pub-c-f83b8b34-5dbc-4502-ac34-5073f2382d96',
          heartbeat: 31,
          heartbeat_interval: 30  
        });
        pubnub.publish({
            channel: 'general_channel',        
            message: boardJson,
            callback : function(m){}
        });
    }
    exec = function executeMove(){
      history = pubnub.history({
             channel: 'general_channel',
             callback: function(m){
                 boardString = JSON.stringify(m[0][0]);
                 var boardJson = JSON.parse(boardString);
                var board = boardJson["board"];




                 MovesMap = new Object();
                 if(m[0][0]['turn'] == "black"){
                  if(m[0][0]["moves"]["black"].length == 0){
                    return false;
                  }
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
                    myNewBoard =  sortable[0][0];
                 }
                 else{
                  if(m[0][0]["moves"]["red"].length == 0){
                    return false;
                  }
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
                    myNewBoard =  sortable[0][0];    
                 }
                 var startspot = MovesMap[myNewBoard]['start_move'];
                 var endspot = MovesMap[myNewBoard]['end_move'];
                 startspot = startspot.split(',');
                 endspot = endspot.split(',');
                 var piece1 = $("td[row='"+ endspot[1]+"']td[col='"+ endspot[0]+"']");
                 var piece2 = $("td[row='"+ startspot[1]+"']td[col='"+ startspot[0]+"']");
                 var mypiece = "";

                 if(piece1[0].children.length > 0){
                    mypiece = $("td[row='"+ endspot[1]+"']td[col='"+ endspot[0]+"'] .piece")
                 }else{
                    mypiece = $("td[row='"+ startspot[1]+"']td[col='"+ startspot[0]+"'] .piece");
                 }
                var boardJson = JSON.parse(boardString);
                MovesMap = new Object();
                boardJson['moves'] = {'black' : [], 'red' : []};
                var pubnub = PUBNUB({
                    subscribe_key: 'sub-c-34be47b2-f776-11e4-b559-0619f8945a4f',
                    publish_key: 'pub-c-f83b8b34-5dbc-4502-ac34-5073f2382d96',
                    heartbeat: 31,
                    heartbeat_interval: 30  
                });

                  pubnub.publish({
                      channel: 'general_channel',        
                      message: boardJson,
                      callback : function(m){
                         handlePieceDrop(mypiece, startspot, endspot);
                      }
                  });
                
                 votingsimulationBoard = myNewBoard;

              },
       count: 1, // 100 is the default
       reverse: false // false is the default
      });
    }
    
    function handlePieceDrop(mypiece, startspot, endspot){
      console.log($(this));
      var oldRow = parseInt(startspot[1]);
      var oldCol = parseInt(startspot[0]);
      var newCol = parseInt(endspot[0]);
      var newRow = parseInt(endspot[1]);
      removeActive();
      $('#draggableHelper').remove();
      var color = 'black';
      if (mypiece.hasClass('red')){color = 'red';}

      if (Math.abs(oldRow-newRow) == 2 || Math.abs(oldCol-newCol) == 2){
        jumpPiece(mypiece,color,oldRow,oldCol,newRow,newCol);
      }

      if (color == 'black' && newCol == 7){mypiece.addClass('king');}
      else if (color == 'red' && newCol == 0){mypiece.addClass('king');}

      if ($('.activeCell').length == 0){
        if (mypiece.hasClass('red')){
          $('.piece.red').draggable('disable');
          $('.piece.black').draggable('enable');
          $('header').text("It is Grey's Turn");
          $('header').css("background-color", "#787a7d");
          $('header').css("color", "white");
          turn = "red";
        }
        else{
          $('.piece.black').draggable('disable');
          $('.piece.red').draggable('enable');
          turn = "black";
          $('header').text("It is Red's Turn");
          $('header').css("background-color", "#c31b3b");
          $('header').css("color", "white");
        }
        changJsonString(mypiece, oldCol, oldRow, newCol, newRow, 0);
      }
      else {
          $('.piece').draggable('disable');
          ui.draggable.draggable('enable');
          changJsonString(mypiece, oldCol, oldRow, newCol, newRow, 1);
      }
        
    }

    function jumpPiece(piece,color,oldRow,oldCol,newRow,newCol){
      $('.cell[row='+(oldRow+(newRow-oldRow)/2)+'][col='+(oldCol+(newCol-oldCol)/2)+'] .piece').remove();
      checkCells(piece,newRow,newCol,(newCol-oldCol)/2,color,1);

      if ($('.piece').length - $('.piece.'+color).length == 0){victory(color);}
    }

    function removeActive(event, ui){
      $('.activeCell').droppable('destroy');
      $('.activeCell').removeClass('activeCell');
    }

    function myHelper( event ) {
      if (turn == "black") {
        return '<div id="draggableHelper" class="piece" style="background: #c31b3b" ></div>';
      }
      else
        return '<div id="draggableHelper" class="piece" style="background: #787a7d" ></div>';

    }
    function reset(){
      MovesMap = new Object();
        //Publish boardJSON
        var   pubnub = PUBNUB({
          subscribe_key: 'sub-c-34be47b2-f776-11e4-b559-0619f8945a4f',
          publish_key: 'pub-c-f83b8b34-5dbc-4502-ac34-5073f2382d96',
          heartbeat: 31,
          heartbeat_interval: 30  
        });

        pubnub.publish({
            channel: 'general_channel',        
            message: {"board":"1010003001000303101000300100030310100030010003031010003001000303","turn":"black", "moves":{"black" : [], "red" : []}},
            callback : function(m){}
        });
    }

    function victory(color){
      //Publish : boardString = '{"board" : "101000301000303010100030100030301010003010003030101000301000303"}'
      //if (color == 'black'){$('.victory').html('Black Winnnnnnssssss!!!!!');}
      //else{$('.victory').html('Red Winnnnnnssssss!!!!!');}
        
      $('.piece').draggable('disable');
      reset();
    }