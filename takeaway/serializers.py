from django.contrib.auth.models import User, Group
from rest_framework import serializers
from takeaway.models import *


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ( 'username', 'email', 'groups')
        #fields = ('username')



class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ('url', 'name')

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ('id', 'course_name', 'course_desc', 'students','session_set')


class TakeAwaySerializer(serializers.ModelSerializer):
    username = serializers.Field(source='user.username')

    class Meta:
        model = TakeAway
        fields = ('id','notes', 'user','course','session','is_public','username', 'tags','created_dt')
        #depth = 1

class TakeAwayFullSerializer(serializers.ModelSerializer):
    username = serializers.Field(source='user.username')

    class Meta:
        model = TakeAway
        fields = ('id','notes', 'user','course','session','is_public','username', 'tags','created_dt')
        depth = 1

class SessionSerializer(serializers.ModelSerializer):
    takeaway_set = TakeAwayFullSerializer(source='takeaway_set')

    class Meta:
        model = Session
        fields = ('id','session_name', 'session_dt','course','takeaway_set')
        depth = 1

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ('id', 'name')


