from django.forms import ModelForm
from takeaway.models import TakeAway

# Create the form class
class TakeawayForm(ModelForm):
    class Meta:
        model=TakeAway
        fields=['notes']
        
        
