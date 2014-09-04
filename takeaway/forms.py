from django.forms import ModelForm
from takeaway.models import TakeAway
from takeaway.models import TakeAwayProfile,ContactUs
from django import forms
from django.core.exceptions import ValidationError
from registration.forms import RegistrationForm,RegistrationFormUniqueEmail

# Create the form class
class TakeawayForm(ModelForm):
    class Meta:
        model=TakeAway
        fields=['notes']


class ChoiceFieldNoValidation(forms.ChoiceField):
    def validate(self, value):
        pass

class ProgramChoiceField(forms.ChoiceField):
    def validate(self, value):
        pass


class TakeawayProfileRegistrationForm(RegistrationFormUniqueEmail):


    CLASS_2014 = '2014'
    CLASS_2015 = '2015'
    CLASS_2016 = '2016'
    CLASS_2017 = '2017'
    YEAR_IN_SCHOOL_CHOICES = (
       (CLASS_2014, 'Class of 2014'),
       (CLASS_2015, 'Class of 2015'),
       (CLASS_2016, 'Class of 2016'),
       (CLASS_2017, 'Class of 2017'),
    )
    # FULL_TIME = 'FULL_TIME'
    # EVENING = 'EVENING'
    # PART_TIME = 'PART_TIME'
    # PROGRAM_CHOICES = (
    #    (FULL_TIME, 'Full Time MBA'),
    #    (EVENING, 'Evening MBA'),
    #    (PART_TIME, 'Part Time MBA'),
    # )
    # MONDAY = 'MONDAY'
    # WEDNESDAY = 'WEDNESDAY'
    # WEEKEND = 'Weekend'
    # SECTION_CHOICES = (
    #    (MONDAY, 'Monday'),
    #    (WEDNESDAY, 'Wednesday'),
    #    (WEEKEND, 'Weekend'),
    # )


    # batch = forms.CharField(max_length=200,choices=YEAR_IN_SCHOOL_CHOICES,
    #                                   default=CLASS_2016)
    # program = models.CharField(max_length=500,choices=PROGRAM_CHOICES,
    #                                  default=EVENING)
    # section = models.CharField(max_length=500,choices=SECTION_CHOICES,
    #                                  default=WEEKEND)

    school = forms.CharField()
    # email = forms.CharField()
    firstname = forms.CharField()
    lastname = forms.CharField()
    batch = forms.ChoiceField(choices=YEAR_IN_SCHOOL_CHOICES,)
    program = ProgramChoiceField()

    # class Meta:
    #     model=TakeAwayProfile
    #     fields=['email','school','batch','program','section']


class ContactForm(forms.ModelForm):

    subject = forms.CharField(max_length=100,help_text="Subject")
    message = forms.CharField(help_text="Message")
    sender = forms.EmailField(help_text="Your email")
    cc_myself = forms.BooleanField(help_text="cc_myself",required=False)

    # An inline class to provide additional information on the form.
    class Meta:
        # Provide an association between the ModelForm and a model
        model = ContactUs
