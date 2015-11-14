//DEFINE NEW_BOARD_STRING = "1010003001000303101000300100030310100030010003031010003001000303"  
//{"board":"1010003001000303101000300100030310100030010003031010003001000303","turn":"red"}
var boardString = "";
var turn = "black";
$(window).ready(function() {

      var pubnub = PUBNUB({
        subscribe_key: 'sub-c-34be47b2-f776-11e4-b559-0619f8945a4f',
        publish_key: 'pub-c-f83b8b34-5dbc-4502-ac34-5073f2382d96'
      });
    
    //Query History and set Board String
    pubnub.history({
     channel: 'general_channel',
     callback: function(m){
         boardString = JSON.stringify(m[0][0]);
          //Setup the board and choose the starting color
          setup('red');
          $("#turn_display").html("Gray's Turn");
     },
     count: 1, // 100 is the default
     reverse: false // false is the default
    });
    
     pubnub.subscribe({
        channel: 'general_channel',
        message: function(m){
            boardString = JSON.stringify(m);
            if(m["turn"] == "black"){
                $( ".checkerBoard" ).children().remove();
                setup('red');
                $("#turn_display").html("Gray's Turn");
            }
            else{
                $( ".checkerBoard" ).children().remove();
                setup('black');
                $("#turn_display").html("Red's Turn");
            }
        },
        error: function (error) {
            // Handle error here
        }
    });
    
     
    }); 

    function setup(startingColor){
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
      else{
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
        drop: handlePieceDrop
      });
    }
    String.prototype.replaceAt=function(index, character) {
        return this.substr(0, index) + character + this.substr(index+character.length);
    }

    function changJsonString(piece, oldcol, oldrow, newcol, newrow){
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
        if (Math.abs(oldrow-newrow) == 2 || Math.abs(oldcol-newcol) == 2){
            var middleRow = (oldrow + newrow)/2;
            var middleCol = (oldcol + newcol)/2;
            var middleIndex = (8 * middleRow) + middleCol;
            boardJson["board"] = boardJson["board"].replaceAt(middleIndex, '0');
        }
        
        //Publish boardJSON
        var pubnub = PUBNUB({
            subscribe_key: 'sub-c-34be47b2-f776-11e4-b559-0619f8945a4f',
            publish_key: 'pub-c-f83b8b34-5dbc-4502-ac34-5073f2382d96'
        });
        pubnub.publish({
            channel: 'general_channel',        
            message: boardJson,
            callback : function(m){}
        });
    }
        
    function handlePieceDrop(event, ui){
      var oldRow = parseInt(ui.draggable.parent().attr('row'));
      var oldCol = parseInt(ui.draggable.parent().attr('col'));
      var newCol = parseInt($(this).attr('col'));
      var newRow = parseInt($(this).attr('row'));
      removeActive();
      $(this).append(ui.draggable);
      $('#draggableHelper').remove();

      var color = 'black';
      if (ui.draggable.hasClass('red')){color = 'red';}

      if (Math.abs(oldRow-newRow) == 2 || Math.abs(oldCol-newCol) == 2){
        jumpPiece(ui.draggable,color,oldRow,oldCol,newRow,newCol);}

      if (color == 'black' && newCol == 7){ui.draggable.addClass('king');}
      else if (color == 'red' && newCol == 0){ui.draggable.addClass('king');}

      if ($('.activeCell').length == 0){
        if (ui.draggable.hasClass('red')){
          $('.piece.red').draggable('disable');
          $('.piece.black').draggable('enable');
          
          ///
          $("#turn_display").html("Gray's Turn");
          turn = "red";

        }
        else{
          $('.piece.black').draggable('disable');
          $('.piece.red').draggable('enable');
        
          ///
          $("#turn_display").html("Red's Turn");
          turn = "black";

        }
      }
      else {
          $('.piece').draggable('disable');
          ui.draggable.draggable('enable');
      }
        
      changJsonString(ui.draggable, oldCol, oldRow, newCol, newRow);
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

    function myHelper( event ) {return '<div id="draggableHelper" class="piece"></div>';}

    function reset(){
        //Publish boardJSON
        var pubnub = PUBNUB({
            subscribe_key: 'sub-c-34be47b2-f776-11e4-b559-0619f8945a4f',
            publish_key: 'pub-c-f83b8b34-5dbc-4502-ac34-5073f2382d96'
        });
        pubnub.publish({
            channel: 'general_channel',        
            message: {"board":"1010003001000303101000300100030310100030010003031010003001000303","turn":"black"},
            callback : function(m){}
        });
    }

    function victory(color){
      //Publish : boardString = '{"board" : "101000301000303010100030100030301010003010003030101000301000303"}'
      if (color == 'black'){$('.victory').html('Black Winnnnnnssssss!!!!!');}
      else{$('.victory').html('Red Winnnnnnssssss!!!!!');}

      $('.piece').draggable('disable');
    }