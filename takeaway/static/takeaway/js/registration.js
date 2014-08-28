$(document).ready(function(){
    var school_id ;

    $('#id_email').blur(function(){
        $("#id_username").val($("#id_email").val());
    });
    $('#id_school').blur(function(){

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
                   }
            }});



    });


});
