$(function() {
  pubnub = PUBNUB({
    subscribe_key: 'sub-c-34be47b2-f776-11e4-b559-0619f8945a4f',
    publish_key: 'pub-c-f83b8b34-5dbc-4502-ac34-5073f2382d96'
  });

  history = pubnub.history({
  		channel: "timer",
    	callback: function(m){
        	var now = new Date(m[0]);
        	var currentDate = Date.now();
      		var endDate = new Date((now.getFullYear() + 10) + '/01/01');
      		console.log(m[0]);
      		var $days = $('.days'),
			 	$hours = $('.hours'),
			    $mins = $('.minutes'),
			    $secs = $('.seconds');
			  
			function format(v) {
				return (v.toString().length == 1) ? '0' + v : v;
			}
			
			setInterval(function() {
				currentDate = Date.now();
				//console.log(currentDate);
			    //console.log(endDate);

			    if (currentDate < endDate) {

			    	var time = endDate - currentDate;
			    	
			    	var seconds = Math.floor((time / 1000) % 60);
			    	var minutes = Math.floor((time / 60000) % 60);
			    	var hours = Math.floor((time / 3600000) % 24);
			    	var days = Math.floor((time / 86400000));
			    
			    	$secs.text( format(seconds) );
			    	$mins.text( format(minutes) );
			    	$hours.text( format(hours) );
			    	$days.text( days );  
			   }
   				console.log(seconds);
  			}, 100);  
    	},
   		count: 1,
   		reverse: false // false is the default
   });
});
