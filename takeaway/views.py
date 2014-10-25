from django.shortcuts import render,render_to_response,redirect,RequestContext, HttpResponseRedirect, HttpResponse
from django.core.context_processors import request
from django.views.decorators.csrf import requires_csrf_token
from django.contrib.auth import authenticate,login,logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User,Group
from rest_framework import viewsets
from takeaway.serializers import *
from takeaway.models import Course,Session,TakeAway,School,Enrollment,Vote,CourseInstance,Program,Term,Status,Section,TakeAwayProfile,Comment
from rest_framework import permissions
from rest_framework import generics
from rest_framework import filters
from takeaway.permissions import IsOwnerOrReadOnly
from takeaway.forms import *
from rest_framework.mixins import *
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum
import pdb
from settings import *
import math
from django.db.models import Sum,Count
from datetime import datetime, timedelta
from django.core.mail import send_mail
from registration.backends.simple.views import RegistrationView
from forms import TakeawayProfileRegistrationForm
from notifications.models import Notification

def test(request):
    user_list = EmailSettings.objects.all() #filter(mail_when_takeaway=2)
    for setting in user_list:
        user= setting.user
        timestamp_to = datetime.now().date() - timedelta(days=6)
        notif_list =Notification.objects.filter(recipient=user).filter(verb='NEW_TAKEAWAY') #.filter(timestamp__gte = timestamp_to)
        agg_list = notif_list.order_by().values('description').annotate(takeaway_count= Count('id'))
        email_subject = " MBATakeaways Digest for " + str(datetime.now().date())

        email_message = []
        email_message .append("Hi " + user.first_name)
        for summary in agg_list:
            email_message .append( 'There are ' + str(summary['takeaway_count'])  + ' takeaways in the course ' + summary['description'] )
        email_message.append(' If you want instant email when new takeaways are posted or donot wish an email at all please change your settings in your profile on www.mbatakeaways.com')
        final_message = "\n".join(item for item in email_message)
        print final_message
        recipients = [user.email]
        #send_mail(email_subject, final_message, 'support@mbatakeaways.com', recipients)


    return HttpResponse( final_message )
# Create your views here.

from rest_framework.decorators import *
from decimal import *
@api_view(['GET'])
@permission_classes((IsAuthenticated, ))
def can_user_post(request):

    minimum_rating_pct = 0.25
    can_post = True
    course_id = request.QUERY_PARAMS.get('course_id', None)
    if not course_id:
        return Response({"detail": "Course not passed."});
    #user = User.objects.get(pk=3)
    user = request.user
    ci = CourseInstance.objects.get(pk=course_id)
    entire_takeaways = TakeAway.objects.filter(courseInstance=ci).filter(is_public=True)

    exclude_takeaways_from_user = entire_takeaways.exclude(user=user)
    other_takeaway_count = exclude_takeaways_from_user.count()
    takeaway_count = entire_takeaways.count()
    rating_count = Rating.objects.filter(takeaway = entire_takeaways).filter(user=user).count()

    if  other_takeaway_count > 0 :
        if Decimal(rating_count)/Decimal(other_takeaway_count) < RATING_THRESHOLD_FOR_CREATE :
            can_post = False
    remaining_rating_count = math.ceil((other_takeaway_count*0.25)-rating_count)
    return Response({"user":user.id,"takeaway_count": takeaway_count,"remaining_rating_count_till_create":remaining_rating_count, "rating_count": rating_count , "can_post" : can_post,"other_takeaway_count":other_takeaway_count})

import logging
logger = logging.getLogger(__name__)

def home(request):
    #course = Course.objects.create(course_name="MARKETING" , created_by="ravid")
    #course_instance_list = Course.objects.filter(students=request.user)

    return render_to_response("landing.html",RequestContext(request))


def error(request):
    return render_to_response("error.html", RequestContext(request))

@login_required
def index(request):
    #course = Course.objects.create(course_name="MARKETING" , created_by="ravid")


    # course_instance_list = CourseInstance.objects.filter(students=user)
    userid = request.session.get('userid','0')
    print 'userid  is :' + str(userid)
    response = render_to_response("index.html",{},RequestContext(request))
    if userid is not '0':
        response.set_cookie(key='userid',value=userid)
    user = User.objects.get(pk=userid)
    takeAwayProfile = TakeAwayProfile.objects.filter(user=user)[0];
    if len(takeAwayProfile.courseInstances.all())==0:
        return redirect('profile')
    return response

def profile(request):
    userid = request.session.get('userid','0')
    response = render_to_response("profile.html",{},RequestContext(request))
    if userid is not '0':
        response.set_cookie(key='userid',value=userid)
    return response

def handlelogin(request):

    mode = request.POST.get('Mode')
    username = request.POST.get('Username')



    if mode == "Register" :
        if User.objects.filter(username=username).count():
            user = authenticate(username=username, password=request.POST.get('Password'))

            message =  "User already exists."
            return render_to_response("login.html",{ 'error_message': message },RequestContext(request))
        else :
            User.objects.create_user(username, username,  request.POST.get('Password'))
            newuser = authenticate(username=username, password=request.POST.get('Password'))
            login(request,newuser)
            Course.objects.all()[0].students.add(newuser)
            Course.objects.all()[1].students.add(newuser)
            # course_instance_list = Course.objects.filter(students=newuser)
            logged_user = User.objects.get(username=request.POST.get('Username'))
            request.session['userid'] = logged_user.id

            response  = render_to_response("index.html",{})
            return redirect('index')

    else:
        user = authenticate(username=request.POST.get('Username'), password=request.POST.get('Password'))
        course_obj = None

        if user is not None:
            # the password verified for the user
            if user.is_active:
                message = "User is valid, active and authenticated"
                login(request,user)
                logged_user = User.objects.get(username=request.POST.get('Username'))
                # course_instance_list = CourseInstance.objects.filter(students=logged_user)
                notifications = logged_user.notifications.unread()
                request.session['userid'] = logged_user.id

                response  = render_to_response("index.html",{})
                return redirect('index')
                #return render_to_response("index.html",{'course_instance_list':course_instance_list,'logged_user':logged_user,'notifications':notifications},RequestContext(request))
                #return render_to_response("coursedetail.html",{'course':course_obj,'course_sessions_list':course_sessions_list,'userid':request.user},RequestContext(request))

            else:

                message =  "The password is valid, but the account has been disabled!"
                return render_to_response("registration/registration_complete.html",{})
        else:
            # the authentication system was unable to verify the username and password
            message =  "The username/password is incorrect."
            #message=""
            return render_to_response("landing.html",{ 'error_message': message },RequestContext(request))


    #return HttpResponse( request.POST.get('Mode'))
    #return render_to_response("coursedetail.html",{'course':course_obj,'course_sessions_list':course_sessions_list},RequestContext(request))

def logoutuser(request):
    if request.session.get('play',False):
        request.user.delete()
    logout(request)
    return render_to_response("landing.html",RequestContext(request))



################################  APIS are defined here #####################################

class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,IsOwnerOrReadOnly,)

class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer

class SchoolViewSet(viewsets.ModelViewSet):
        queryset = School.objects.all()
        serializer_class = SchoolSerializer
        filter_backends = (filters.DjangoFilterBackend,)
        filter_fields = ('school_name',)
        permission_classes = (permissions.IsAuthenticatedOrReadOnly,IsOwnerOrReadOnly,)

from datetime import datetime,timedelta


class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,IsOwnerOrReadOnly,)
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('course_name','school')
    paginate_by = 100

    def pre_save(self, obj):
        """
        Set the object's owner, based on the incoming request.
        """
        obj.created_by = self.request.user.username




class SessionList(generics.ListCreateAPIView):
    queryset = Session.objects.all()
    serializer_class = SessionSerializer
    filter_backends = (filters.DjangoFilterBackend,filters.OrderingFilter)
    filter_fields = ('session_name','courseInstance',)
    ordering_fields = ('session_dt','created_dt')
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,IsOwnerOrReadOnly,)
    paginate_by = 100

class SessionDetail(generics.RetrieveUpdateDestroyAPIView):
        queryset = Session.objects.all()
        serializer_class = SessionDetailSerializer
        permission_classes = (permissions.IsAuthenticatedOrReadOnly,IsOwnerOrReadOnly)

        def post_save(self, obj, created=False):
            if not created :
                event = PointEvent.objects.get_or_create(event='CREATED_SESSION',points=5)
                UserEventLog(user=self.request.user,course_instance=obj.courseInstance,session=obj,event=event[0],points=event[0].points).save()



class TagViewSet(viewsets.ModelViewSet):
        queryset = Tag.objects.all()
        serializer_class = TagSerializer
        filter_backends = (filters.DjangoFilterBackend,)
        filter_fields = ('name',)
        permission_classes = (permissions.IsAuthenticatedOrReadOnly,IsOwnerOrReadOnly,)
        paginate_by = 100
        def get_queryset(self):

            queryset = Tag.objects.all()
            starts_with  = self.request.QUERY_PARAMS.get('starts_with', None)
            if starts_with:
                queryset = queryset.filter(name__startswith=starts_with)
            return queryset

class RatingViewSet(viewsets.ModelViewSet):
        queryset = Rating.objects.all()
        serializer_class = RatingSerializer
        filter_backends = (filters.DjangoFilterBackend,)
        filter_fields = ('user', 'takeaway',)
        permission_classes = (permissions.IsAuthenticated,)
        paginate_by = 100

class TakeAwayCreateModelMixin(CreateModelMixin):
    # def post(self, request, *args, **kwargs):
    #     pdb.set_trace()

    #     return super(TakeAwayCreateModelMixin, self).post(request, *args, **kwargs)
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.DATA, files=request.FILES)
        if serializer.is_valid():
            self.pre_save(serializer.object)
            self.object = serializer.save(force_insert=True)
            self.post_save(self.object, created=True)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED,
                            headers=headers)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TakeAwayList(TakeAwayCreateModelMixin,generics.ListCreateAPIView):

    queryset = TakeAway.objects.all()
    serializer_class = TakeAwaySerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('user', 'is_public',)
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,IsOwnerOrReadOnly,)
    paginate_by = 100

    def get_queryset(self):

            queryset = TakeAway.objects.all()
            school  = self.request.QUERY_PARAMS.get('school', None)
            if school > 0:
                queryset = queryset.filter(courseInstance = CourseInstance.objects.filter(course= Course.objects.filter(school=School.objects.get(id=school))))

            return queryset


	           	# def get_queryset(self):

				#	user = self.request.user
				#	if user.is_authenticated():
				#			return TakeAway.objects.filter(user=user,is_public=True)

				#	return TakeAway.objects.filter(user=None)




class TakeAwayDetail(generics.RetrieveUpdateDestroyAPIView):
		queryset = TakeAway.objects.all()
		serializer_class = TakeAwaySerializer
		permission_classes = (permissions.IsAuthenticatedOrReadOnly,IsOwnerOrReadOnly,)




class TakeAwayRegistrationView(RegistrationView):
    form_class = TakeawayProfileRegistrationForm
    #success_url = '/takeaways/index'
    def get_success_url(self, request, user):
        login(request,user)
        request.session['userid'] = user.id
        return ('/takeaways/index', (), {})



class NotificationViewSet(viewsets.ModelViewSet):
        """
        API endpoint that allows groups to be viewed or edited.
        """

        queryset = Notification.objects.all()
        serializer_class = NotificationSerializer
        filter_backends = (filters.DjangoFilterBackend,)
        filter_fields = ('recipient','verb','unread')
        permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
        paginate_by = 100

        def get_queryset(self):

            queryset = Notification.objects.all()
            mark_all_as_read  = self.request.QUERY_PARAMS.get('mark_all_as_read', None)
            if mark_all_as_read == "True":
                user = self.request.user
                if user.is_authenticated:
                    user.notifications.mark_all_as_read()

            return queryset

class CourseInstanceCreateViewSet(viewsets.ModelViewSet):
        """
        API endpoint that allows groups to be viewed or edited.
        """
        queryset = CourseInstance.objects.all()
        serializer_class = CourseInstanceCreateSerializer
        filter_backends = (filters.DjangoFilterBackend,)
        filter_fields = ('course','program','batch','year',)
        permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
        paginate_by = 100

        def post_save(self, obj, created=False):
            if created :
                s1 = Session(courseInstance=obj,session_name = 'Week 1',session_dt = datetime.now()).save()
                s2 = Session(courseInstance=obj,session_name = 'Week 2',session_dt = datetime.now()+timedelta(1)).save()
                s3 = Session(courseInstance=obj,session_name = 'Week 3',session_dt = datetime.now()+timedelta(2)).save()
                s4 = Session(courseInstance=obj,session_name = 'Week 4',session_dt = datetime.now()+timedelta(3)).save()
                s5 = Session(courseInstance=obj,session_name = 'Week 5',session_dt = datetime.now()+timedelta(4)).save()
                s6 = Session(courseInstance=obj,session_name = 'Week 6',session_dt = datetime.now()+timedelta(5)).save()
                s7 = Session(courseInstance=obj,session_name = 'Week 7',session_dt = datetime.now()+timedelta(6)).save()
                s8 = Session(courseInstance=obj,session_name = 'Week 8',session_dt = datetime.now()+timedelta(7)).save()
                s9 = Session(courseInstance=obj,session_name = 'Week 9',session_dt = datetime.now()+timedelta(8)).save()
                s10 = Session(courseInstance=obj,session_name = 'Week 10',session_dt = datetime.now()+timedelta(9)).save()
                s11 = Session(courseInstance=obj,session_name = 'Week 11',session_dt = datetime.now()+timedelta(10)).save()
                s12 = Session(courseInstance=obj,session_name = 'Week 12',session_dt = datetime.now()+timedelta(11)).save()



class CourseInstanceViewSet(viewsets.ModelViewSet):
        """
        API endpoint that allows groups to be viewed or edited.
        """
        queryset = CourseInstance.objects.all()
        serializer_class = CourseInstanceSerializer
        filter_backends = (filters.DjangoFilterBackend,)
        filter_fields = ('course','program','batch','year',)
        permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
        paginate_by = 100

        def get_queryset(self):
            """
            Optionally returns just the course Instances related to a particular school
            """
            queryset = CourseInstance.objects.all()
            school_id = self.request.QUERY_PARAMS.get('school_id', None)
            student_id = self.request.QUERY_PARAMS.get('students', None)
            if school_id is not None:
                queryset = queryset.filter(course__in=Course.objects.filter(school=School.objects.get(id=school_id)) )
            if student_id is not None:
                queryset = queryset.filter(students__in=TakeAwayProfile.objects.filter(user=User.objects.get(id=student_id)))
            return queryset

class ProgramViewSet(viewsets.ModelViewSet):
        """
        API endpoint that allows groups to be viewed or edited.
        """
        queryset = Program.objects.all()
        serializer_class = ProgramSerializer
        filter_backends = (filters.DjangoFilterBackend,)
        filter_fields = ('school',)
        permission_classes = (permissions.IsAuthenticatedOrReadOnly,IsOwnerOrReadOnly,)

class SectionViewSet(viewsets.ModelViewSet):
        """
        API endpoint that allows groups to be viewed or edited.
        """
        queryset = Section.objects.all()
        serializer_class = SectionSerializer
        filter_backends = (filters.DjangoFilterBackend,)
        filter_fields = ('school',)
        permission_classes = (permissions.IsAuthenticatedOrReadOnly,IsOwnerOrReadOnly,)

class StatusViewSet(viewsets.ModelViewSet):
        """
        API endpoint that allows groups to be viewed or edited.
        """
        queryset = Status.objects.all()
        serializer_class = StatusSerializer
        filter_backends = (filters.DjangoFilterBackend,)
        filter_fields = ('school',)
        permission_classes = (permissions.IsAuthenticatedOrReadOnly,IsOwnerOrReadOnly,)

class TermViewSet(viewsets.ModelViewSet):
        """
        API endpoint that allows groups to be viewed or edited.
        """
        queryset = Term.objects.all()
        serializer_class = TermSerializer
        filter_backends = (filters.DjangoFilterBackend,)
        filter_fields = ('school',)
        permission_classes = (permissions.IsAuthenticatedOrReadOnly,IsOwnerOrReadOnly,)

class TakeAwayProfileViewSet(viewsets.ModelViewSet):
        """
        API endpoint that allows groups to be viewed or edited.
        """
        queryset = TakeAwayProfile.objects.all()
        serializer_class = TakeAwayProfileSerializer
        filter_backends = (filters.DjangoFilterBackend,)
        filter_fields = ('id','user','school')
        permission_classes = (permissions.IsAuthenticatedOrReadOnly,IsOwnerOrReadOnly,)

        def post_save(self, obj, created=False):
            # check to see if any new courses are added. If so send the new course list in the request object
            if not created:
                actual = TakeAwayProfile.objects.get(pk=obj.id)
                new = obj
                #new_courses = list (set(new.courseInstances.all()) - set(actual.courseInstances.all()))
                #print 'old courses'
                #print actual.courseInstances.all()
                #print 'new courses'
                #print obj.courseInstances.all()
                course_id = self.request.QUERY_PARAMS.get('course_id', None)

                if course_id:
                    courseinstance = CourseInstance.objects.get(pk=course_id)
                    recipients = courseinstance.students.all()
                    for recipient in recipients:
                        recipient_user = recipient.user
                        curr_user = obj.user
                        if recipient_user.id <> curr_user.id:

                            message = curr_user.username + ' joined ' + str(courseinstance)
                            notify.send(curr_user,recipient=recipient_user, verb='NEW_COURSEMATE',description= message)


        # def post_save(self, obj, created=False):
        #     # check to see if any new courses are added. If so send the new course list in the request object
        #     if not created:
        #         new_courses = self.request.get('new_courses')
        #         for courseinstance in new_courses:
        #             recipients = courseinstance.students.all()
        #             for recipient in recipients:
        #                 recipient_user = recipient.user
        #                 curr_user = obj.user
        #                 if recipient_user.id <> curr_user.id:

        #                     message =  curr_user.username + ' joined ' + str(courseinstance)
        #                     notify.send(curr_user,recipient=recipient_user, verb='NEW_COURSEMATE',description= message)



class FavoriteViewSet(viewsets.ModelViewSet):
        queryset = Favorite.objects.all()
        serializer_class = FavoriteSerializer
        filter_backends = (filters.DjangoFilterBackend,)
        filter_fields = ('user','courseInstance')
        permission_classes = (permissions.IsAuthenticatedOrReadOnly,IsOwnerOrReadOnly,)

class CommentViewSet(viewsets.ModelViewSet):
        queryset = Comment.objects.all()
        serializer_class = CommentSerializer
        filter_backends = (filters.DjangoFilterBackend,)
        filter_fields = ('takeaway','user')
        permission_classes = (permissions.IsAuthenticatedOrReadOnly,IsOwnerOrReadOnly,)

class EmailSettingsViewSet(viewsets.ModelViewSet):
        queryset = EmailSettings.objects.all()
        serializer_class = EmailSettingsSerializer
        filter_backends = (filters.DjangoFilterBackend,)
        filter_fields = ('user',)
        permission_classes = (permissions.IsAuthenticatedOrReadOnly,IsOwnerOrReadOnly,)

class ClosedGroupViewSet(viewsets.ModelViewSet):
        queryset = ClosedGroup.objects.all()
        serializer_class = ClosedGroupSerializer
        filter_backends = (filters.DjangoFilterBackend,)
        filter_fields = ('members','course_instance')
        permission_classes = (permissions.IsAuthenticatedOrReadOnly,IsOwnerOrReadOnly,)

class SharedTakeawayViewSet(viewsets.ModelViewSet):
        queryset = SharedTakeaway.objects.all()
        serializer_class = SharedTakeawaySerializer
        filter_backends = (filters.DjangoFilterBackend,)
        filter_fields = ('takeaway','shared_type','group','shared_by')
        permission_classes = (permissions.IsAuthenticatedOrReadOnly,IsOwnerOrReadOnly,)

class ContactUsViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = ContactUs.objects.all()
    serializer_class = ContactUsSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,IsOwnerOrReadOnly,)

    def post_save(self, obj, created=False):
        """
        Set the object's owner, based on the incoming request.
        """
        if created :
            recipients = ['support@mbatakeaways.com']

            if obj.cc_myself:
                recipients.append(obj.sender)


            prefix_message = "This message is sent by " + obj.sender
            send_mail(obj.subject, prefix_message + '\n' + obj.message, 'support@mbatakeaways.com', recipients)

            # Response to the one who submitted the feedback.
            response_message = 'Hi' + '\n' + 'Thanks for your interest in our application' + '\n' + 'Our team will get back to you soon with an update.' + '\n' + ' Have a good day' + '\n' + 'Takeaway Team :)'
            send_mail('MBATakeaways : Thanks for your feedback', response_message, 'support@mbatakeaways.com', [obj.sender])




from django.core.mail import send_mail
def ContactUs(request):
    # Get the context from the request.
    context = RequestContext(request)

    # A HTTP POST?
    if request.method == 'POST':
        form = ContactForm(request.POST)

        # Have we been provided with a valid form?
        if form.is_valid():
            # Save the new category to the database.
            form.save(commit=True)

            subject = form.cleaned_data['subject']
            message = form.cleaned_data['message']
            sender = form.cleaned_data['sender']

            cc_myself = form.cleaned_data['cc_myself']

            recipients = ['support@mbatakeaways.com']

            if cc_myself:
                recipients.append(sender)

            prefix_message = "This message is sent by " + sender
            send_mail(subject, prefix_message + '\n' + message, 'support@mbatakeaways.com', recipients)

            # Response to the one who submitted the feedback.
            response_message = 'Hi' + '\n' + 'Thanks for your interest in our application' + '\n' + 'Our team will get back to you soon with an update.' + '\n' + ' Have a good day' + '\n' + 'Takeaway Team :)'
            send_mail('MBATakeaways : Thanks for your feedback', response_message, 'support@mbatakeaways.com', [sender])


            # Now call the index() view.
            # The user will be shown the homepage.
            return render_to_response('contact_us.html', {'form': form,'message':'Thanks for reaching out. Your message has been sent.'}, context)
        else:
            # The supplied form contained errors - just print them to the terminal.
            print form.errors
    else:
        # If the request was not a POST, display the form to enter details.
        form = ContactForm()


    # Bad form (or form details), no form supplied...
    # Render the form with error messages (if any).

    return render_to_response('contact_us.html', {'form': form}, context)



def ContactUsLogin(request):
    # Get the context from the request.
    context = RequestContext(request)

    # A HTTP POST?
    if request.method == 'POST':
        form = ContactForm(request.POST)

        # Have we been provided with a valid form?
        if form.is_valid():
            # Save the new category to the database.
            form.save(commit=True)

            subject = form.cleaned_data['subject']
            message = form.cleaned_data['message']
            sender = form.cleaned_data['sender']
            cc_myself = form.cleaned_data['cc_myself']

            recipients = ['support@mbatakeaways.com']
            recipients.append('ravik.227@gmail.com')

            if cc_myself:
                recipients.append(sender)

            prefix_message = "This message is sent by " + sender
            #sender = 'support@mbatakeaways.com'



            send_mail(subject, prefix_message + '\n' + message, 'support@mbatakeaways.com', recipients)

            response_message = 'Hi' + '\n' + 'Thanks for your interest in our application' + '\n' + 'Our team will get back to you soon with an update.' + '\n' + ' Have a good day' + '\n' + 'Takeaway Team :)'
            send_mail('MBATakeaways : Thanks for your feedback', response_message, 'support@mbatakeaways.com', [sender])

            # Now call the index() view.
            # The user will be shown the homepage.
            return render_to_response('contact_us.html', {'form': form,'message':'Thanks for reaching out. Your message has been sent.'}, context)
        else:
            # The supplied form contained errors - just print them to the terminal.
            print form.errors
    else:
        # If the request was not a POST, display the form to enter details.
        form = ContactForm()


    # Bad form (or form details), no form supplied...
    # Render the form with error messages (if any).

    return render_to_response('contact_us_login.html', {'form': form}, context)

@api_view(['GET'])
@permission_classes((IsAuthenticated, ))
def get_leader_board(request):


    user_id = request.QUERY_PARAMS.get('user_id', None)
    course_id = request.QUERY_PARAMS.get('course_id', None)

    if not course_id and not user_id :
        return Response({"detail": "Course not passed."});
    #user = User.objects.get(pk=3)
    if user_id:

        try:
            user = User.objects.get(pk=user_id)
            points = UserEventLog.objects.filter(user=user)
            leader_board = points.values('user').annotate(score=Sum('points'))

            return Response({"points": leader_board})
        except User.DoesNotExist :
            return Response({"detail": "No user with id : " + str(user_id)});
    #user = request.user
    ci = CourseInstance.objects.get(pk=course_id)
    points = UserEventLog.objects.filter(course_instance=ci)
    leader_board = points.values('user').annotate(score=Sum('points')).order_by('-score')

    leader_dict ={}
    leader_records = []

    for leader in leader_board :
        user = User.objects.get(pk=leader['user'])
        user_name = user.username
        first_name = user.first_name
        user_email = user.email
        record = {"user_id":leader['user'], "user_name":user_name,"first_name":first_name,"user_email":user_email,"score":leader['score']}
        leader_records.append(record)




    return Response({"points": leader_records})


def initload(request):
    User.objects.create_user(username="atluri",password="abc123").save()
    User.objects.create_user(username="ravi",password="abc123").save()

    user1=User.objects.get(username="atluri")
    user2=User.objects.get(username="ravi")
    School(school_name="EMORY").save()
    School(school_name="WHARTON").save()
    School(school_name="COX").save()
    school1= School.objects.get(school_name="EMORY")
    school2= School.objects.get(school_name="WHARTON")
    school3= School.objects.get(school_name="COX")

    Program(name="Full Time MBA",school=school1).save()
    Program(name="Evening MBA",school=school1).save()
    Program(name="Part Time MBA",school=school1).save()

    program1 = Program.objects.get(name='Part Time MBA')
    program2 = Program.objects.get(name='Evening MBA')

    Section(name="Monday",school=school1).save()
    Section(name="Wednesday",school=school1).save()
    Section(name="Weekend",school=school1).save()

    section1 = Section.objects.get(name='Monday')
    section2 = Section.objects.get(name='Wednesday')

    Term(description="Ist Semester",school=school1).save()
    Term(description="IInd Semester",school=school1).save()

    term1 = Term.objects.get(description="Ist Semester")


    Status(value="Active",school=school1).save()
    status1 = Status.objects.get(value="Active")
    Course(school=school1,course_name="BUS 634P Strategic Management",created_by="admin", course_desc="Today's corporate leaders must be able to account for and leverage digital technology and novel operating practices. By studying systems and processes that define the operating and information practices in firms, markets and society, Goizueta students will have the tools to manage as globalization and emerging digital technologies continue to transform the structure, form and governance of these systems and processes.").save()
    Course(school=school1,course_name="BUS 520P Managerial Finance",created_by="admin", course_desc="This course develops a market-oriented framework for analyzing the investment decisions made by corporations. Lectures and readings will provide an introduction to iscounted cash flow techniques, capital budgeting principles and problems, financial security and project valuation, capital structure, capital market efficiency and portfolio theory.").save()
    Course(school=school1,course_name="MARKETING",created_by="admin", course_desc="Today's corporate leaders must be able to account for and leverage digital technology and novel operating practices. By studying systems and processes that define the operating and information practices in firms, markets and society, Goizueta students will have the tools to manage as globalization and emerging digital technologies continue to transform the structure, form and governance of these systems and processes.").save()
    course1 = Course.objects.filter(course_name__startswith="BUS 634P")[0]
    course2 = Course.objects.filter(course_name__startswith="BUS 520P")[0]
    course3 = Course.objects.get(course_name="MARKETING")


    CourseInstance(course=course1,section=section1,program = program2,batch="2014",year="2014",status=status1,term= term1 ).save()

    CourseInstance(course=course2,section=section2,program = program2,batch="2014",year="2014",status=status1,term= term1 ).save()
    courseInstance1 = CourseInstance.objects.filter(program=program2,section=section1,course=course1)[0]
    courseInstance2 = CourseInstance.objects.filter(program=program2,section=section2,course=course2)[0]



    # courseInstance1.students.add(user1,user2)
    # courseInstance2.students.add(user1,user2)
    # courseInstance3.students.add(user1,user2)

    courseInstance1.save()
    courseInstance2.save()








    #BUS 634P Strategic Management
    Session(courseInstance=courseInstance1,session_name="Week 1 : Course Introduction",session_dt="2014-06-21").save()
    Session(courseInstance=courseInstance1,session_name="Week 2 : Competitor Dynamics",session_dt="2014-06-22").save()
    Session(courseInstance=courseInstance1,session_name="Week 3 : Industry Analysis",session_dt="2014-06-23").save()
    Session(courseInstance=courseInstance1,session_name="Week 4 : Industry Analysis",session_dt="2014-06-24").save()
    Session(courseInstance=courseInstance1,session_name="Week 5 : Competitive Advantage",session_dt="2014-06-25").save()
    Session(courseInstance=courseInstance1,session_name="Week 6 : Industry Evolution and Revolution",session_dt="2014-06-26").save()
    Session(courseInstance=courseInstance1,session_name="Week 7 : Managing Human Assets F0r Competitive Advantage",session_dt="2014-06-27").save()
    Session(courseInstance=courseInstance1,session_name="Week 8 : Business Model Innovation",session_dt="2014-06-28").save()
    Session(courseInstance=courseInstance1,session_name="Week 9 : Corporate-Level Strategy: Diversification & Vertical Integration",session_dt="2014-06-29").save()
    Session(courseInstance=courseInstance1,session_name="Week 10 : Strategy Implementation",session_dt="2014-06-30").save()


    #  BUS 520P Managerial Finance  complete session list loaded.
    Session(courseInstance=courseInstance2,session_name="I. Financial Decision Making (week 1)",session_dt="2014-06-21").save()
    Session(courseInstance=courseInstance2,session_name="II. Time Value of Money, Annuities and Perpetuities (week 2)",session_dt="2014-08-22").save()
    Session(courseInstance=courseInstance2,session_name="III. Fundamentals of Capital Budgeting (week 3)",session_dt="2014-09-23").save()
    Session(courseInstance=courseInstance2,session_name="IV. Investment Decision Rules (week 4) ",session_dt="2014-09-24").save()
    Session(courseInstance=courseInstance2,session_name="V. Interest Rates (week 4) ",session_dt="2014-09-25").save()
    Session(courseInstance=courseInstance2,session_name="VI. Valuing Bonds (week 5)",session_dt="2014-09-26").save()
    Session(courseInstance=courseInstance2,session_name="VII. Valuing Stocks (weeks 6-8)",session_dt="2014-09-27").save()
    Session(courseInstance=courseInstance2,session_name="VIII. Capital Markets and the Pricing of Risk (week 8)",session_dt="2014-09-28").save()
    Session(courseInstance=courseInstance2,session_name="IX. Estimating the Cost of Capital ( week 8) ",session_dt="2014-09-29").save()
    Session(courseInstance=courseInstance2,session_name="X. Capital Structure, Perfect Markets, and Corporate Taxes (week 9)",session_dt="2014-09-30").save()
    Session(courseInstance=courseInstance2,session_name="XI. Capital Budgeting and Valuation with Leverage (week 9)",session_dt="2014-10-01").save()




    Tag(name="theory").save()
    Tag(name="application").save()
    Tag(name="example").save()
    Tag(name="case").save()



    TakeAwayProfile(user=user1,email="sureshatluri@gmail.com",school=school1,batch="2014",program=program2).save()
    TakeAwayProfile(user=user2,email="ravidutta@gmail.com",school=school1,batch="2014",program=program2).save()
    #session1 = Session.objects.get(session_name__contains="Week 1",course=course1)
    #session2 = Session.objects.get(session_name__contains="Week 1",course=course1)
    #session3 = Session.objects.get(session_name="Week 3 : Mastering Strategic Planning",course=course1)
    #session4 = Session.objects.get(session_dt="2014-06-23",course=course2)

    #takeaway1 = TakeAway(course=course1,session=session1,user=user1,notes="This is a long long long long long long long long long long long long long long long long long long TAKEAWAY").save()
    #takeaway2 = TakeAway(course=course1,session=session2,user=user1,notes="This is a long long long long long long long long long long long long long long long long long long TAKEAWAY").save()
    #takeaway3 = TakeAway(course=course1,session=session3,user=user2,notes="This is Ravi's long long long long long long long long long long long long long long long long long long TAKEAWAY").save()
    #takeaway4 = TakeAway(course=course2,session=session4,user=user2,notes="This is Ravi's long long long long long long long long long long long long long long long long long long TAKEAWAY").save()
    #
    #Enrollment(student=user1,course=course1).save()
    #Enrollment(student=user1,course=course2).save()
    #Enrollment(student=user2,course=course2).save()
    #Enrollment(student=user2,course=course3).save()

    EmailFormat(format="@emory.edu",school=school1).save()
    EmailFormat(format="@wharton.edu",school=school2).save()
    EmailFormat(format="@wharton.upenn.edu",school=school2).save()

    return HttpResponse( "Successfully Loaded init data")

from random import randrange

def play(request):
    if request.user.is_authenticated():
        return render_to_response("play.html",RequestContext(request))

    rand = randrange(10000)
    username = "demouser"+str(rand)
    User.objects.create_user(username=username,password="abc123").save()
    user =authenticate(username=username, password="abc123")

    login(request,user)
    school1= School.objects.get(school_name="Demo")
    program1 = Program.objects.get(name='Part Time MBA',school=school1)
    tp = TakeAwayProfile(user=user,email="demo_takeaways"+str(rand)+"@gmail.com",school=school1,batch="2014",program=program1).save()
    course1 = Course.objects.filter(course_name__startswith="Demo Course")[0]
    courseInstance1 = CourseInstance.objects.filter(course=course1)[0]
    tp = TakeAwayProfile.objects.get(user=user)
    tp.courseInstances.add(courseInstance1)
    response = render_to_response("play.html",{},RequestContext(request))
    response.set_cookie(key='userid',value=user.id)
    request.session['userid'] = user.id
    request.session['play'] = True
    return response

@login_required
def Chat(request):
    user = request.user
    takeAwayProfile = TakeAwayProfile.objects.filter(user=user)[0];
    school = takeAwayProfile.school.school_name
    batch = takeAwayProfile.batch
    return render_to_response('chat.html',RequestContext(request),{school:school, batch:batch})

