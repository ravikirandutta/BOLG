  var EmailSettings = Backbone.Model.extend({
    urlRoot:'/emailSettings/'
  });


  var emailSettings = null;

  function loadSettings(){

  	emailSettings = new EmailSettings();

    emailSettings.fetch({data: {user: $.cookie('userid')},success:function(collection, response){

    	var mail_when_takeaway =2;
    	var mail_when_newuser =2;
    	var mail_when_rated =2;

		
        if(collection.attributes.results.length > 0){
			var settingsObj = collection.attributes.results[0];
			updateEmailSettings.set({'id': emailSettings.attributes.results[0].id});
			updateEmailSettings.set({'user': emailSettings.attributes.results[0].user});

			if(settingsObj.mail_when_takeaway >= 0){
				updateEmailSettings.set({'mail_when_takeaway': settingsObj.mail_when_takeaway});
				mail_when_takeaway = settingsObj.mail_when_takeaway;
			}
			
			if(settingsObj.mail_when_newuser >= 0){
				updateEmailSettings.set({'mail_when_newuser': settingsObj.mail_when_newuser});
				mail_when_newuser = settingsObj.mail_when_newuser;	
			}
			
			if(settingsObj.mail_when_rated >= 0){
				updateEmailSettings.set({'mail_when_rated': settingsObj.mail_when_rated});
				mail_when_rated = settingsObj.mail_when_rated;
			}


        }

		$("input[name=newTakeaway][value=" + mail_when_takeaway + "]").prop('checked', true);	
		$("input[name=newUser][value=" + mail_when_newuser + "]").prop('checked', true);	
		$("input[name=ratedTakeaway][value=" + mail_when_rated + "]").prop('checked', true);	
    }});
  }


  var updateEmailSettings = new EmailSettings();
  function changeNewTakeawaySettings(rThis){
	updateEmailSettings.set({'mail_when_takeaway': rThis.value});
  	updateEmailSettings.save({}, {success :function(model, response){
    	updateEmailSettings = model;
    }});
  }

  function changeNewUserSettings(rThis){
	updateEmailSettings.set({'mail_when_newuser': rThis.value});
  	updateEmailSettings.save({}, {success :function(model, response){
    	updateEmailSettings = model;
    }});
  }

  function changeRatedSettings(rThis){
	updateEmailSettings.set({'mail_when_rated': rThis.value});
  	updateEmailSettings.save({}, {success :function(model, response){
    	updateEmailSettings = model;
    }});
  }