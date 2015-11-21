$(document).ready(function() {
      $(".mybtn").click(function(){
      		$(".overlay-main").slideUp(1000);
      		if($(this).hasClass("btn-danger")){
      				team = "red";
      				$('.piece.black').draggable('disable');
      				$('header').text("You are on the Red Team");
      				$('header').css("background-color", "#c31b3b");
      				$('header').css("font-size", "50px");
      				$('header').css("color", "white");
      			}
      		else{
      				team = "black";
      				$('.piece.red').draggable('disable');
      				$('header').text("You are on the Grey Team");
      				$('header').css("background-color", "#787a7d");
      				$('header').css("font-size", "50px");
      				$('header').css("color", "white");
      		}

      });
});
