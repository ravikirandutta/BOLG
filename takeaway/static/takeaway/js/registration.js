$(document).ready(function(){
    var school_id ;

    $('#id_email').blur(function(){
        $("#id_username").val($("#id_email").val());
    });
    $('#id_school').focus(function(){
      $("#school_error").remove();
    });
   // $('#id_school').blur(function(){

        $("#id_program").find('option').remove();
        $("#id_section").find('option').remove();
        $("#id_term").find('option').remove();

        var school = new School();
            school.fetch({data: {school_name: $('#id_school').val().toUpperCase()},success:function(response){
                   school_id = response.id;

                   if(school_id){
                   var program = new Program();
                   program.fetch({data: {school:school_id},success:function(response){
                        var programs = {};

                                programs = response.attributes;
                                _.each(programs, function(program){
                                    var option = '<option value='+program.id+'>'+program.name+'</option>';
                                    $("#id_program").append(option);
                                });
                   }});
                   }else{
                       var html = "<ul id='school_error' class='errolist'><li>School "+$('#id_school').val()+" not supported right now. Please check the spelling</li></ul>"
                       $("#school").prepend(html);
                   }
            }, error: function(){

            }});
   // });



$("#registration-form").on('submit',function(e){

    if(!$("#id_program").val()){
        return false;
    }
});


});
