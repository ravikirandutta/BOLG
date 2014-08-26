from django.contrib import admin

# Register your models here.
from takeaway.models import Course
from takeaway.models import Session
from takeaway.models import TakeAway
from takeaway.models import School
from takeaway.models import Enrollment
from takeaway.models import *
from takeaway.models import TakeAwayProfile


admin.site.register(School)
admin.site.register(Course)
admin.site.register(Session)
admin.site.register(TakeAway)
admin.site.register(Enrollment)
admin.site.register(Tag)
admin.site.register(TakeAwayProfile)
admin.site.register(Term)
admin.site.register(Program)
admin.site.register(Section)
admin.site.register(Status)
admin.site.register(CourseInstance)
