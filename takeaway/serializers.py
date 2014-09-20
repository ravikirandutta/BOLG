from django.contrib.auth.models import User, Group
from rest_framework import serializers
from takeaway.models import *
from notifications.models import Notification


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
        fields = ('id', 'course_name', 'course_desc','school')

class SchoolSerializer(serializers.ModelSerializer):
    class Meta:
        model = School
        fields = ('id', 'school_name',)



class TakeAwaySerializer(serializers.ModelSerializer):
    username = serializers.Field(source='user.username')
    class Meta:
        model = TakeAway
        fields = ('id','notes', 'user','courseInstance','session','is_public','username', 'tags','created_dt','average_rating','total_raters')
        #depth = 1


class TakeAwayFullSerializer(serializers.ModelSerializer):
    username = serializers.Field(source='user.username')
    created_dt = serializers.DateTimeField(format='%m/%d/%y %H:%M')
    class Meta:
        model = TakeAway
        fields = ('id','notes', 'user','courseInstance','session','is_public','username', 'tags','created_dt','average_rating','total_raters')
        depth = 1

class SessionSerializer(serializers.ModelSerializer):
    takeaway_set = TakeAwayFullSerializer(source='takeaway_set')

    class Meta:
        model = Session
        fields = ('id','session_name', 'session_dt','takeaway_set','courseInstance')
        depth = 1

class SessionDetailSerializer(serializers.ModelSerializer):
    

    class Meta:
        model = Session
        fields = ('id','session_name', 'session_dt')
        

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ('id', 'name')


class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = ('id', 'user','takeaway','rating_value')

class FavoriteSerializer(serializers.ModelSerializer):
    takeaway = serializers.PrimaryKeyRelatedField()
    #takeaway = TakeAwayFullSerializer(source='takeaway')
    is_takeaway_public = serializers.Field(source='takeaway.is_public')
    class Meta:
        model = Favorite



class NotificationSerializer(serializers.ModelSerializer):
    actor_username = serializers.SerializerMethodField('get_actor_username')
    class Meta:
        model = Notification

    def get_actor_username(self, obj):
        try:
            actor = User.objects.get(pk=obj.actor_object_id)
        except User.DoesNotExist :
            actor = None

        if actor:
            return actor.username
        return None    

class CourseInstanceSerializer(serializers.ModelSerializer):
    school_id = serializers.RelatedField(source='course.school.id')
    students = serializers.RelatedField(many=True)

    class Meta:
        model = CourseInstance
        fields = ('id','course','section','batch','program','year','status','school_id','students',)
        depth = 1

class ProgramSerializer(serializers.ModelSerializer):
    class Meta:
        model = Program


class SectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Section


class StatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Status


class TermSerializer(serializers.ModelSerializer):
    class Meta:
        model = Term

class TakeAwayProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model=TakeAwayProfile



