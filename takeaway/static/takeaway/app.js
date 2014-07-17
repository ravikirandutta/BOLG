$( document ).ready(function() {


$("#notifications").click(function (){
  var notifications_div = $("#user_notifications");
  notifications_div.toggle();
});

$("#mark_read").click(function (){
    $.get( "/takeaway/notifications/delete/", function( data ) {
  $( "#mark_as_read" ).html( "  success" );
});

});



});
