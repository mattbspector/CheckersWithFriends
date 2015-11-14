var team = "";
$(document).ready(function() {
      $(".mybtn").click(function(){
      		$(".overlay-main").slideUp(1000);
      		if($(this).hasClass("btn-danger")){
      				team = "red";
      			}
      		else{
      				team = "black";
      		}

      });
 
});
