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

function refreshSessionlistView(){
    $("#takeaway-container").append(sessionListView.render().el);
}

});
