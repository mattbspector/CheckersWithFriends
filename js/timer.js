$(function() {
  pubnub = PUBNUB({
    subscribe_key: 'sub-c-34be47b2-f776-11e4-b559-0619f8945a4f',
    publish_key: 'pub-c-f83b8b34-5dbc-4502-ac34-5073f2382d96',
    heartbeat: 31,
    heartbeat_interval: 30  
  });

  history = pubnub.history({
  		channel: "timer",
    	callback: function(m){
        	var now = new Date(m[0]);
        	var currentDate = Date.now();
      		var endDate = new Date((now.getFullYear() + 10) + '/01/01');
      		var $secs = $('.seconds');
      		var time = endDate - currentDate;
			var seconds = Math.floor((time / 1000) % 60);
			if(seconds >= 30){
				seconds -= 30;
			}
      		window.setTimeout(executeFunction, (seconds * 1000));
			  
			function format(v) {
				return (v.toString().length == 1) ? '0' + v : v;
			}
			function executeFunction(){
				exec();
				setTimeout(executeFunction, 30000);
			}
			setInterval(function() {

				currentDate = Date.now();
			    if (currentDate < endDate) {
			    	var time = endDate - currentDate;
			    	var seconds = Math.floor((time / 1000) % 60);
			    	if (seconds >= 30) {
			    		seconds -= 30;
			    	}
			    	var minutes = Math.floor((time / 60000) % 60);
			    	var hours = Math.floor((time / 3600000) % 24);
			    	var days = Math.floor((time / 86400000));
			    	console.log(seconds);

			    	$secs.text( format(seconds) );
			   }
  			}, 100);  
    	},
   		count: 1,
   		reverse: false // false is the default
   });
});
