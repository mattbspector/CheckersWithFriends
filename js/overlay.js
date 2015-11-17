$(document).ready(function() {
      $(".mybtn").click(function(){
      		$(".overlay-main").slideUp(1000);
      		if($(this).hasClass("btn-danger")){
      				team = "red";
      				$('.piece.black').draggable('disable');

      			}
      		else{
      				team = "black";
      				$('.piece.red').draggable('disable');

      		}

      });
});
