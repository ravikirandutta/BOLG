from django.forms import ModelForm
from takeaway.models import TakeAway
from django import forms
from registration.forms import RegistrationForm

# Create the form class
class TakeawayForm(ModelForm):
    class Meta:
        model=TakeAway
        fields=['notes']




class TakeawayProfileRegistrationForm(RegistrationForm):
    school =forms.CharField(widget=forms.TextInput(),label=(u'school'))



