var checkerBoard = "";
var cTurn = "";
var notCTurn = "";
$(document).ready(function(){

  $(".votingMain").on('click', '.votingLink', function(){
    //NEED TO ADD VOTES TO THE VOTING OBJECT ON PUBNUB
    console.log(movesVotedFor);
    console.log($(this)[0].firstChild.firstElementChild.innerText);
    var foundIt = 0;
    for(var k = 0; k < movesVotedFor.length; k++){
      if(movesVotedFor[k] == $(this)[0].firstChild.firstElementChild.innerText){
          foundIt = 1;
      }
    }
    if(!foundIt){
      $(".votingLink").remove();
      var boardJson = JSON.parse(boardString);
      MovesMap[$(this)[0].firstChild.firstElementChild.innerText]['count']++;
      var stringofboard = $(this)[0].firstChild.firstElementChild.innerText;
      var vote_obj = {
        board_as_long_ass_string: $(this)[0].firstChild.firstElementChild.innerText,
        formatted_move_start: MovesMap[$(this)[0].firstChild.firstElementChild.innerText]['start_move'],
        formatted_move_end: MovesMap[$(this)[0].firstChild.firstElementChild.innerText]['end_move'],
        user_uuid: uniqueID
      };

      if(boardJson["turn"] == "black"){
        boardJson["moves"]["black"].push(vote_obj);
      }
      else{
        boardJson["moves"]["red"].push(vote_obj);
      }
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
      var sortable = [];
      for (var move in MovesMap){
        sortable.push([move, MovesMap[move]['count'],MovesMap[move]['start_move'], MovesMap[move]['end_move'] ]);
      }
      sortable.sort(function(a, b) {return b[1] - a[1]})
      for(var i = 0; i < sortable.length; i++){
            $(".votingMain").append("<a class= 'a"+ stringofboard+" votingLink mdl-button mdl-js-button mdl-js-ripple-effect' href='#'><div class='votingInner'>" +sortable[i][2] +" To "+ sortable[i][3]+ "<span class='boardInner'>" +sortable[i][0]+ "</span>"+"<span class ='voteCount'>"+ "<i class='fa fa-thumbs-o-up' style='font-size: 20px;'></i>   " + sortable[i][1]+"</span></div></a>");
      }
    }
    
  });

	$(".votingMain").on('mouseover', '.votingInner', function(){
    if($(".currentTurn").hasClass("black")){
      cTurn = "black";
      notCTurn = "red";
    }
    else{
      cTurn = "red";
      notCTurn = "black";
    }
		checkerBoard = $(".checkerBoard");
		$(".checkerBoard").children().remove();
		for (var i=0;i<8;i++){
        $('.checkerBoard').append('<tr row="'+i+'"></tr>');
        for (var j=0;j<8;j++){
          var color = 'black';
          if ((i+j)%2 == 0){color = 'white'};
          $('.checkerBoard tr[row='+i+']').append('<td class="cell '+color+'" row="'+i+'" col="'+j+'"></td>');
        }
      }
      var board = $(this)[0].firstElementChild.innerText;
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
      $(".piece." + cTurn).addClass("currentTurn");
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

      var startspace = MovesMap[board]['start_move'];
      var endspace = MovesMap[board]['end_move'];
      startspace = startspace.split(',');
      endspace = endspace.split(',');
      var col1 = $("td[row='"+ endspace[1]+"']td[col='"+ endspace[0]+"']");
      var col2 = $("td[row='"+ startspace[1]+"']td[col='"+ startspace[0]+"']");
      var piece = $("td[row='"+ endspace[1]+"']td[col='"+ endspace[0]+"'] .piece");
      var mypiece = piece.clone();
      col2.append(mypiece);
      mypiece.addClass("animate-flickertwo");
      piece.addClass("animate-flicker");
      if (Math.abs(startspace[1]-endspace[1]) == 2 || Math.abs(startspace[0]-endspace[0]) == 2){
           var middleRow = (parseInt(startspace[1]) + parseInt(endspace[1]))/2;
           var middleCol = (parseInt(startspace[0]) + parseInt(endspace[0]))/2;
           var jumpedCol = $("td[row='"+ middleRow+"']td[col='"+ middleCol+"']");
           var jumpedpiece = mypiece.clone();
           jumpedpiece.removeClass(cTurn);
           jumpedpiece.removeClass("currentTurn");
           jumpedpiece.addClass(notCTurn);
           jumpedCol.append(jumpedpiece);           
           jumpedpiece.addClass("animate-flickerjumped");
      }
	});

	$(".votingMain").on('mouseout', '.votingLink', function(){
    if($(".currentTurn").hasClass("black")){
      cTurn = "black";
      notCTurn = "red";
    }
    else{
      cTurn = "red";
      notCTurn = "black";
    }
		checkerBoard = $(".checkerBoard");
		$(".checkerBoard").children().remove();
		for (var i=0;i<8;i++){
        $('.checkerBoard').append('<tr row="'+i+'"></tr>');
        for (var j=0;j<8;j++){
          var color = 'black';
          if ((i+j)%2 == 0){color = 'white'};
          $('.checkerBoard tr[row='+i+']').append('<td class="cell '+color+'" row="'+i+'" col="'+j+'"></td>');
        }
      }
      var board = votingsimulationBoard;
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

      // $('.piece.'+startingColor).draggable('disable');
      $(".piece." + cTurn).addClass("currentTurn");

	});
});




