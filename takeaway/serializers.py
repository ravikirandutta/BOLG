from django.contrib.auth.models import User, Group
from rest_framework import serializers
from takeaway.models import *
from notifications.models import Notification
from django.db.models import Q


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ( 'username', 'email','first_name','last_name')
        #fields = ('username')



class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ('url', 'name')

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ('id', 'course_name', 'course_desc','school')


class EmailFormatSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmailFormat
        fields= ('format',)

class SchoolSerializer(serializers.ModelSerializer):
    emailformat_set = EmailFormatSerializer(source='emailformat_set')
    class Meta:
        model = School
        fields = ('id', 'school_name','emailformat_set','image_url')


class SharedTakeawaySerializer(serializers.ModelSerializer):

    class Meta:
        model = SharedTakeaway

class TakeAwaySerializer(serializers.ModelSerializer):
    username = serializers.Field(source='user.username')
    comment_count = serializers.Field(source='comment_set.count')
    class Meta:
        model = TakeAway
        fields = ('id','notes', 'user','courseInstance','session','is_public','username', 'tags','created_dt','average_rating','total_raters','comment_count')
        #depth = 1


class TakeAwayFullSerializer(serializers.ModelSerializer):
    username = serializers.Field(source='user.username')
    created_dt = serializers.DateTimeField(format='%Y-%m-%d %H:%MZ')
    comment_count = serializers.Field(source='comment_set.count')
    shared_takeaways = SharedTakeawaySerializer(source='shared_info')
    class Meta:
        model = TakeAway
        fields = ('id','notes', 'user','courseInstance','session','is_public','username', 'tags','created_dt','average_rating','total_raters','comment_count', 'shared_takeaways')
        depth = 1


# class SessionWithTakeAwaysSinceLastLoginSerializer(serializers.ModelSerializer):
#     takeaway_set = TakeAwayFullSerializer(source='takeaway_set')

#     takeaway_set_since_last_login = serializers.SerializerMethodField('takeaways_since_lastLogin')

#     def takeaways_since_lastLogin(self, obj):

#         takeaways = obj.takeaway_set.filter(created_dt__gte=self.context['request'].user.last_login)
#         return takeaways
#     class Meta:
#         model = Session
#         fields = ('id','session_name', 'session_dt','takeaway_set','courseInstance','takeaway_set_since_last_login')
#         depth = 1

import pdb
class SessionSerializer(serializers.ModelSerializer):
    takeaway_set = TakeAwayFullSerializer(source='takeaway_set')

    class Meta:
        model = Session
        fields = ('id','session_name', 'session_dt','takeaway_set','courseInstance')
        depth = 2


class SessionWithTakeAwaySinceLastLoginSerializer(serializers.ModelSerializer):
    #takeaway_set_since_last_login = serializers.SerializerMethodField('takeaways_since_lastLogin')
    takeaway_set = serializers.SerializerMethodField('takeaways_since_lastLogin')


    def takeaways_since_lastLogin(self, obj):
        takeaways = obj.takeaway_set.filter(created_dt__gte=self.context['request'].user.last_login).exclude(user = self.context['request'].user)
        #takeaways = obj.takeaway_set.all()
        return TakeAwayFullSerializer(takeaways).data

    class Meta:
        model = Session
        fields = ('id','session_name', 'session_dt','courseInstance','takeaway_set')
        depth = 2



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

class CourseInstanceCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = CourseInstance

class TakeAwayProfileSerializer(serializers.ModelSerializer):
    username = serializers.Field(source='user.username')
    class Meta:
        model=TakeAwayProfile


class CourseInstanceSerializer(serializers.ModelSerializer):
    school_id = serializers.RelatedField(source='course.school.id')
    students = serializers.RelatedField(many=True)
    students = TakeAwayProfileSerializer(source='students')

    class Meta:
        model = CourseInstance
        fields = ('id','course','section','batch','program','year','status','term','school_id','students',)
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



class CommentSerializer(serializers.ModelSerializer):
    username = serializers.Field(source='user.username')
    class Meta:
        model=Comment

class ContactUsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactUs

class EmailSettingsSerializer(serializers.ModelSerializer):
    daily_digest = serializers.SerializerMethodField('have_daily_digest')

    class Meta:
        model = EmailSettings


    def have_daily_digest(self, obj):
        if obj.mail_when_newuser == 2 or obj.mail_when_takeaway == 2 or obj.mail_when_rated == 2 :
            return True
        return False


class ClosedGroupSerializer(serializers.ModelSerializer):

    class Meta:
        model = ClosedGroup




