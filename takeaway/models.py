from django.db import models
from django.utils.encoding import smart_unicode
from django.contrib.auth.models import User
from django import forms
# Create your models here.

import logging
logger = logging.getLogger(__name__)

class School(models.Model):
    school_name = models.CharField(max_length=400)

    def __unicode__(self):
        return smart_unicode(self.school_name)

class Course(models.Model):
     school = models.ForeignKey(School)
     course_name = models.CharField(max_length=400)
     course_desc = models.TextField()
     created_by = models.CharField(max_length=400)
     created_dt = models.DateTimeField(auto_now_add=True,auto_now=False)
     updated_dt = models.DateTimeField(auto_now_add=False,auto_now=True)

     # Maybe try file field and Image field here to associate a pdf/rtf/txt file for each course and maybe an image for each course
     # models.FileField(upload_to='documents/%Y/%m/%d')

     def  __unicode__(self):
        return smart_unicode(self.course_name)

     def get_enrolled_students(self):
        return self.students




#class EnrollmentManager(models.Manager):
#
#    def get_enrolled_students(course_obj):
#        return self.filter(course=course_obj)
#
#    def get_enrolled_courses(user):
#        return self.filter(student=user)

class Enrollment(models.Model):
    student = models.ForeignKey(User)
    course = models.ForeignKey(Course)
    #objects = EnrollmentManager()

    #def __unicode__(self):
    #    return smart_unicode(self.student + self.course)


class Tag(models.Model):
    name = models.CharField(max_length=100,unique=True)
    def __unicode__(self):
        return smart_unicode(self.name)



class Program(models.Model):
    school = models.ForeignKey(School)
    name= models.CharField(max_length=100)
    def __unicode__(self):
        return smart_unicode(self.name)


class Term(models.Model):
    school = models.ForeignKey(School)
    description= models.CharField(max_length=100)
    def __unicode__(self):
        return smart_unicode(self.description)


class Section(models.Model):
    school = models.ForeignKey(School)
    name= models.CharField(max_length=100)
    def  __unicode__(self):
        return smart_unicode(self.name)




class Status(models.Model):
    school = models.ForeignKey(School)
    value= models.CharField(max_length=100)
    def __unicode__(self):
        return smart_unicode(self.value)


class CourseInstance(models.Model):
    course = models.ForeignKey(Course)
    section =  models.ForeignKey(Section)
    # students = models.ManyToManyField(TakeAwayProfile)
    program = models.ForeignKey(Program)
    batch = models.IntegerField(max_length=100)
    year = models.IntegerField(max_length=100)
    status = models.ForeignKey(Status)
    term = models.ForeignKey(Term)
    def  __unicode__(self):
        return smart_unicode(self.course.course_name)


class Session(models.Model):
    courseInstance = models.ForeignKey(CourseInstance)
    session_name = models.CharField(max_length=1000)
    session_dt = models.DateField()
    created_dt = models.DateTimeField(auto_now_add=True,auto_now=False)
    updated_dt = models.DateTimeField(auto_now_add=False,auto_now=True)

    def __unicode__(self):
        return smart_unicode(self.session_name)


class TakeAway(models.Model):
    courseInstance = models.ForeignKey(CourseInstance)
    session = models.ForeignKey(Session)
    notes = models.TextField()
    created_dt = models.DateTimeField(auto_now_add=True,auto_now=False)
    updated_dt = models.DateTimeField(auto_now_add=False,auto_now=True)
    user = models.ForeignKey(User)
    is_public = models.BooleanField(default=False)
    vote_count = models.IntegerField(default=0)
    average_rating = models.FloatField(default=0)
    total_raters = models.IntegerField(default=0)

    tags = models.ManyToManyField(Tag)

    def __unicode__(self):
        return smart_unicode(self.notes[:400])
    def toggle_public(self):
        if self.is_public:
            self.is_public = False
        else:
            self.is_public = True

class Comment(models.Model):
    takeaway = models.ForeignKey(TakeAway)
    notes = models.TextField()
    created_dt = models.DateTimeField(auto_now_add=True,auto_now=False)
    updated_dt = models.DateTimeField(auto_now_add=False,auto_now=True)
    user = models.ForeignKey(User)
    vote_count = models.IntegerField(default=0)
    average_rating = models.FloatField(default=0)
    total_raters = models.IntegerField(default=0)
    tags = models.ManyToManyField(Tag)

class Rating(models.Model):

    takeaway = models.ForeignKey(TakeAway)
    user = models.ForeignKey(User)
    rating_value = models.FloatField(default=0)
    already_rated = models.BooleanField(default=False) # If already rated then nothing can be changed.

    def __unicode__(self):
        return smart_unicode(self.rating_value)

    def set_rating(self,value):
        if self.already_rated :
            pass# do nothing as user is trying to double vote

        else :
            rating_value = value

class TakeAwayProfile(models.Model):
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

    user = models.ForeignKey(User, unique=True)
   #avatar = models.ImageField("Profile Pic", upload_to="images/", blank=True, null=True)
   # first_name = models.CharField(max_length=200,blank = True)
   # last_name = models.CharField(max_length=200,blank = True)
   # username = models.CharField(max_length=200,unique= True)
    email = models.EmailField(unique= True)
    school =  models.ForeignKey(School)
    batch = models.CharField(max_length=200,choices=YEAR_IN_SCHOOL_CHOICES,
                                      default=CLASS_2016)
    program = models.ForeignKey(Program)
    courseInstances = models.ManyToManyField(CourseInstance,related_name='students')
   #password = models.CharField(max_length=500)



   # Not necessary right away
    takeaway_count = models.IntegerField(default=0)

    def __unicode__(self):
        return unicode(self.user.id)

class Vote(models.Model):

    VOTE_VALUES = (
    (1, 'UpVote'),
    (0, 'Nuetral'),
    (-1, 'DownVote'),
    )
    takeaway = models.ForeignKey(TakeAway)
    user = models.ForeignKey(User)
    vote_value = models.IntegerField(choices=VOTE_VALUES, default=0)
    already_voted = models.BooleanField(default=True) # If already voted then can only change the vote . Cannot stack on votes. Possible values 1 or -1 as of now

    def __unicode__(self):
        return smart_unicode(self.vote_value)

    def set_vote(self,value):
        if self.already_voted and vote_value == value :
            pass# do nothing as user is trying to double vote

        elif self.already_voted and vote_value <> value and (value == 1 or value == 0 or value == -1) :
            vote_value = value
        elif not self.already_voted and  (value == 1 or value == 0 or value == -1) :
            vote_value = value

class Favorite(models.Model):

    takeaway = models.ForeignKey(TakeAway)
    user = models.ForeignKey(User)
    courseInstance = models.ForeignKey(CourseInstance)

    def __unicode__(self):
        return smart_unicode(self.user)

class NotificationSettings(models.Model):

    EmailSettings = (
    (0, 'NoEMail'),
    (1, 'Instant'),
    (2, 'Daily'),
    )
    user = models.ForeignKey(User)
    mail_settings = models.IntegerField(choices=EmailSettings, default=2)
    mail_when_newuser = models.BooleanField(default=True)
    mail_when_takeaway = models.BooleanField(default=True)
    mail_when_rated = models.BooleanField(default=True)
    mail_when_rated = models.BooleanField(default=True)

    def __unicode__(self):
        return smart_unicode(self.user)

from registration.signals import user_registered

def user_registered_callback(sender, user, request, **kwargs):
    logger.info("REGISTERED callback for user: "+user.email)
    profile = TakeAwayProfile(user = user)
    profile.email = request.POST["email"]
    profile.school =School.objects.get(school_name=(request.POST["school"].upper()))
    profile.batch = request.POST["batch"]
    profile.program = Program.objects.get(pk=(request.POST["program"]))
    user.first_name = request.POST["firstname"]
    user.last_name = request.POST["lastname"]
    user.save()
    profile.save()
    logger.info("Takeaway profile successfully created for user: "+user.email)

from django.dispatch import receiver
from django.db.models.signals import post_save,pre_save
@receiver(post_save,sender=Rating)
def update_takeaway_on_rating_save(sender, **kwargs):
    if kwargs.get('created',False):
        rating = kwargs.get("instance")
        takeaway = TakeAway.objects.get(pk=rating.takeaway.id)
        rating_value = rating.rating_value
        total_raters = takeaway.total_raters +1
        average_rating = ((takeaway.average_rating * takeaway.total_raters)+rating_value)/total_raters

        takeaway.average_rating = average_rating
        takeaway.total_raters = total_raters
        takeaway.save()

user_registered.connect(user_registered_callback)

# import pdb

# @receiver(pre_save,sender=TakeAwayProfile)
# def update_courseInstance_with_students(sender,**kwargs):
#     pdb.set_trace()
#     if not kwargs.get('created',False):
#         takeAwayProfilePayload = kwargs.get("instance")
#         courseInstances = takeAwayProfile.courseInstances.all()
#         user = takeAwayProfile.user
#         actualTakeAwayProfile = TakeAwayProfile.object.filter(user=user)[0]

#         for courseInstance in courseInstances:
#             courseInstance.students.add(user)


@receiver(pre_save,sender=Tag)
def convert_tag_to_lowercase(sender, **kwargs):
    if kwargs.get('created',True):
        tag = kwargs.get("instance")
        tag.name = tag.name.lower()


from notifications import notify
@receiver(post_save,sender=TakeAway)
def create_notifications_on_takeaway(sender, **kwargs):


    takeaway = kwargs.get("instance")
    #pdb.set_trace()
    if kwargs.get('created',False):
        if takeaway.is_public == True :
            logger.info("public takeaway created by "+takeaway.user.username+" in courseInstance "+takeaway.courseInstance.course.course_name)
            recipients = takeaway.courseInstance.students.all()


            #pdb.set_trace()
            for recipient in recipients:
                recipient_user = recipient.user
                curr_user = takeaway.user
                if recipient_user.id <> curr_user.id:

                    message =  str(takeaway.courseInstance )
                    notify.send(takeaway.user,recipient=recipient_user, verb='NEW_TAKEAWAY',description= message)
                    #pdb.set_trace()
        else:
            logger.info("private takeaway created by "+takeaway.user.username+" in courseInstance "+takeaway.courseInstance.course.course_name)
    else:
        logger.info("takeaway "+str(takeaway.id)+" updated by "+takeaway.user.username+" in courseInstance "+takeaway.courseInstance.course.course_name)


# Contact us model so that we save all the feedback sent to us in DB
class ContactUs(models.Model):


    subject = models.CharField(max_length=100)
    message = models.TextField()
    sender = models.EmailField()
    cc_myself = models.BooleanField(default=False)

#     # user = models.ForeignKey(User)    Need a user model so that we can track registered users and anonymous users

    def __unicode__(self):
        return smart_unicode(self.subject)

# # A simple contact form with four fields.
# class ContactForm(forms.Form):
#     name = forms.CharField()
#     email = forms.EmailField()
#     topic = forms.CharField()
#     message = forms.CharField(widget=forms.Textarea)
