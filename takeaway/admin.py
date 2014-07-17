from django.contrib import admin

# Register your models here.
from takeaway.models import Course
from takeaway.models import Session
from takeaway.models import TakeAway
from takeaway.models import School
from takeaway.models import Enrollment


admin.site.register(School)
admin.site.register(Course)
admin.site.register(Session)
admin.site.register(TakeAway)
admin.site.register(Enrollment)