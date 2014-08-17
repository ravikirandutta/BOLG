from django.db import models
from django.utils.encoding import smart_unicode
from django.contrib.auth.models import User
# Create your models here.

class School(models.Model):
    school_name = models.CharField(max_length=400)

    def __unicode__(self):
        return smart_unicode(self.school_name)

class Course(models.Model):
     school = models.ForeignKey(School)
     course_name = models.CharField(max_length=400)
     course_desc = models.TextField()
     created_by = models.CharField(max_length=400)
     students = models.ManyToManyField(User)
     created_dt = models.DateTimeField(auto_now_add=True,auto_now=False)
     updated_dt = models.DateTimeField(auto_now_add=False,auto_now=True)

     # Maybe try file field and Image field here to associate a pdf/rtf/txt file for each course and maybe an image for each course
     # models.FileField(upload_to='documents/%Y/%m/%d')

     def  __unicode__(self):
        return smart_unicode(self.course_name)

     def get_enrolled_students(self):
        return self.students


class Session(models.Model):
    course = models.ForeignKey(Course)
    session_name = models.CharField(max_length=1000)
    session_dt = models.DateField()
    created_dt = models.DateTimeField(auto_now_add=True,auto_now=False)
    updated_dt = models.DateTimeField(auto_now_add=False,auto_now=True)

    def __unicode__(self):
        return smart_unicode(self.session_name)


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
    name = models.CharField(max_length=100)
    def __unicode__(self):
        return smart_unicode(self.name)


class TakeAway(models.Model):
    course = models.ForeignKey(Course)
    session = models.ForeignKey(Session)
    notes = models.TextField()
    created_dt = models.DateTimeField(auto_now_add=True,auto_now=False)
    updated_dt = models.DateTimeField(auto_now_add=False,auto_now=True)
    user = models.ForeignKey(User)
    is_public = models.BooleanField(default=False)
    vote_count = models.IntegerField(default=0)

    tags = models.ManyToManyField(Tag)

    def __unicode__(self):
        return smart_unicode(self.notes[:400])
    def toggle_public(self):
        if self.is_public:
            self.is_public = False
        else:
            self.is_public = True


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
    FULL_TIME = 'FULL_TIME'
    EVENING = 'EVENING'
    PART_TIME = 'PART_TIME'
    PROGRAM_CHOICES = (
       (FULL_TIME, 'Full Time MBA'),
       (EVENING, 'Evening MBA'),
       (PART_TIME, 'Part Time MBA'),
    )
    MONDAY = 'MONDAY'
    WEDNESDAY = 'WEDNESDAY'
    WEEKEND = 'Weekend'
    SECTION_CHOICES = (
       (MONDAY, 'Monday'),
       (WEDNESDAY, 'Wednesday'),
       (WEEKEND, 'Weekend'),
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
    program = models.CharField(max_length=500,choices=PROGRAM_CHOICES,
                                     default=EVENING)
    section = models.CharField(max_length=500,choices=SECTION_CHOICES,
                                     default=WEEKEND)
   #password = models.CharField(max_length=500)



   # Not necessary right away
    takeaway_count = models.IntegerField(default=0)

    def __unicode__(self):
        return unicode(self.user.username)

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


from registration.signals import user_registered
import pdb
def user_registered_callback(sender, user, request, **kwargs):
    profile = TakeAwayProfile(user = user)
    profile.email = request.POST["email"]
    profile.school =School.objects.get(school_name=(request.POST["school"]))
    profile.batch = request.POST["batch"]
    profile.program = request.POST["program"]
    profile.section = request.POST["section"]

    profile.save()

user_registered.connect(user_registered_callback)


