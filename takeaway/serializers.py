from django.contrib.auth.models import User, Group
from rest_framework import serializers
from takeaway.models import *


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('url', 'username', 'email', 'groups')


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ('url', 'name')

class CourseSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Course
        fields = ('id', 'course_name', 'course_desc', 'students','session_set')


class SessionSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Session
        fields = ('id','session_name', 'session_dt','course','takeaway_set')
		
class TakeAwaySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = TakeAway
        fields = ('id','notes', 'user','course','session','is_public')