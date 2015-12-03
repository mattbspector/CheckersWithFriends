var checkerBoard = "";
var cTurn = "";
$(document).ready(function(){
	$(".votingMain").on('mouseover', '.votingLink', function(){

    if($(".currentTurn").hasClass("black")){
      cTurn = "black";
    }
    else{
      cTurn = "red";
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
      var board = $(this)[0].innerText;
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


      // $('.piece.'+startingColor).draggable('disable');

	});


	$(".votingMain").on('mouseout', '.votingLink', function(){
    if($(".currentTurn").hasClass("black")){
      cTurn = "black";
    }
    else{
      cTurn = "red";
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