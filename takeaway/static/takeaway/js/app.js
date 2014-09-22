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
  data: {"subject":"bug","message":$('#bug').val(),"sender":"varrekeerthi@gmail.com"}
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
