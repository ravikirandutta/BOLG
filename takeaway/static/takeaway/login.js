 $(document).ready(function(){
$("#new_user").click(function(){
  if ($('#new_user').val() == 'Register') {
    $('#mode').val ("Register") ;
    
    $("#login_form").submit();
  } else {
  $('#sync').addClass('registerMode');
  var speed=220;
   $(' .email').animate({top:'13px'},speed);
  $('#sync .new_user').animate({top:'70px'},speed);
  $('#sync .password').animate({top:'43px'},speed);
  $('#sync .spinner').animate({top:'370px'},speed);
  $('#sync > span').animate({top:'125px'},speed);
  $('#new_user').val ("Register") ;
  $('#mode').val ("Register") ;
  
}
});

});
 
 function show_register(){
  $("#login").hide();
  $("#register").show();
 }
 
  function show_login(){
  $("#login").show();
  $("#register").hide();
 }

