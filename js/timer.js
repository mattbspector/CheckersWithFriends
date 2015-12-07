$(function() {
  
  var now = new Date();
  
  var currentDate = Date.now(),
      endDate = new Date((now.getFullYear() + 1) + '/01/01');
  
  var $days = $('.days'),
      $hours = $('.hours'),
      $mins = $('.minutes'),
      $secs = $('.seconds');
  
  function format(v) {
    return (v.toString().length == 1) ? '0' + v : v;
  }
  
  setInterval(function() {
    
    currentDate = Date.now();
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
    
  }, 100);
  
});



function timeUp(){
  pubnub = PUBNUB({
    subscribe_key: 'sub-c-34be47b2-f776-11e4-b559-0619f8945a4f',
    publish_key: 'pub-c-f83b8b34-5dbc-4502-ac34-5073f2382d96'
  });
    //Query History and set Board String
    history = pubnub.history({
     channel: 'general_channel',
     callback: function(m){
       
      },
     count: 1, // 100 is the default
     reverse: false // false is the default
    });
}