$(document).ready(function(){


$('input').on('itemAdded',function(event){
       searchTag = event.item;
        $('#results-indicator').append("Showing results for "+event.item);
        refreshSessionlistView();
});

$('input').on('itemRemoved',function(event){
       searchTag = null;
        $('#results-indicator').html("");
        refreshSessionlistView();
});

$('#reportBug').click(function()
{
    $.ajax({
  type: "POST",
  url: "/contactus/",
  data: {"subject":"bug","message":$('#bug').val(),"sender":"varrekeerthi@gmail.com"},
  success: function(){
    $.gritter.add({
                    title: 'Bug Reported',
                    sticky: false,
                    time: '0.0001'
                });
  }
});
});


$('#contactUs').click(function()
{
    $.ajax({
  type: "POST",
  url: "/contact_login/",
  data: {"subject":"contact","message":$('#contact').val(),"sender":"varrekeerthi@gmail.com"},
  success: function(){
    $.gritter.add({
                    title: 'Contact us',
                    sticky: false,
                    time: '0.0001'
                });
  }
});
});



});




function refreshSessionlistView(){
    $("#takeaway-container").append(sessionListView.render().el);
}

function changeVisibility(id){
    var takeaway = new Takeaway();
    takeaway.set({'id':id});
    takeaway.fetch();
}

