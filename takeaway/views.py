from django.shortcuts import render,render_to_response,redirect,RequestContext, HttpResponseRedirect, HttpResponse
from django.core.context_processors import request
from django.views.decorators.csrf import requires_csrf_token
from django.contrib.auth import authenticate,login,logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User,Group
from rest_framework import viewsets
from takeaway.serializers import *
from takeaway.models import Course,Session,TakeAway,School,Enrollment,Vote
from rest_framework import permissions
from rest_framework import generics
from rest_framework import filters
from takeaway.permissions import IsOwnerOrReadOnly


# Create your views here.

def home(request):
    #course = Course.objects.create(course_name="MARKETING" , created_by="ravid")
    #course_instance_list = Course.objects.filter(students=request.user)

    return render_to_response("login.html",RequestContext(request))

@login_required
def index(request):
    #course = Course.objects.create(course_name="MARKETING" , created_by="ravid")
    user = authenticate(username=request.POST.get('Username'), password=request.POST.get('Password'))
    course_instance_list = Course.objects.filter(students=user)
    userid = request.session.get('userid','0')
    response = render_to_response("index.html",{})
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
            course_instance_list = Course.objects.filter(students=newuser)
            logged_user = User.objects.get(username=request.POST.get('Username'))
            request.session['userid'] = logged_user.id
            response  = render_to_response("index.html",{})
            return redirect('index')

    else:
        user = authenticate(username=request.POST.get('Username'), password=request.POST.get('Password'))
        course_obj = None
        course_sessions_list = Session.objects.filter(course=course_obj)
        if user is not None:
            # the password verified for the user
            if user.is_active:
                message = "User is valid, active and authenticated"
                login(request,user)
                logged_user = User.objects.get(username=request.POST.get('Username'))
                course_instance_list = Course.objects.filter(students=logged_user)
                notifications = logged_user.notifications.unread()
                request.session['userid'] = logged_user.id
                response  = render_to_response("index.html",{})
                return redirect('index')
                #return render_to_response("index.html",{'course_instance_list':course_instance_list,'logged_user':logged_user,'notifications':notifications},RequestContext(request))
                #return render_to_response("coursedetail.html",{'course':course_obj,'course_sessions_list':course_sessions_list,'userid':request.user},RequestContext(request))

            else:

                message =  "The password is valid, but the account has been disabled!"
                return render_to_response("coursedetail.html",{'course':course_obj,'course_sessions_list':[]},RequestContext(request))
        else:
            # the authentication system was unable to verify the username and password
            message =  "The username/password is incorrect."
            #message=""
            return render_to_response("login.html",{ 'error_message': message },RequestContext(request))


    #return HttpResponse( request.POST.get('Mode'))
    #return render_to_response("coursedetail.html",{'course':course_obj,'course_sessions_list':course_sessions_list},RequestContext(request))

def logoutuser(request):
    logout(request)
    return render_to_response("login.html",RequestContext(request))


def initload(request):
    User.objects.create_user(username="atluri",password="abc123").save()
    User.objects.create_user(username="ravi",password="abc123").save()

    user1=User.objects.get(username="atluri")
    user2=User.objects.get(username="ravi")
    School(school_name="EMORY").save()
    School(school_name="STANFORD").save()
    School(school_name="COX").save()
    school1= School.objects.get(school_name="EMORY")
    school1= School.objects.get(school_name="STANFORD")
    school1= School.objects.get(school_name="COX")

    Course(school=school1,course_name="BUS 634P Strategic Management",created_by="admin", course_desc="Today's corporate leaders must be able to account for and leverage digital technology and novel operating practices. By studying systems and processes that define the operating and information practices in firms, markets and society, Goizueta students will have the tools to manage as globalization and emerging digital technologies continue to transform the structure, form and governance of these systems and processes.").save()
    Course(school=school1,course_name="BUS 520P Managerial Finance",created_by="admin", course_desc="This course develops a market-oriented framework for analyzing the investment decisions made by corporations. Lectures and readings will provide an introduction to iscounted cash flow techniques, capital budgeting principles and problems, financial security and project valuation, capital structure, capital market efficiency and portfolio theory.").save()
    Course(school=school1,course_name="MARKETING",created_by="admin", course_desc="Today's corporate leaders must be able to account for and leverage digital technology and novel operating practices. By studying systems and processes that define the operating and information practices in firms, markets and society, Goizueta students will have the tools to manage as globalization and emerging digital technologies continue to transform the structure, form and governance of these systems and processes.").save()
    course1 = Course.objects.filter(course_name__startswith="BUS 634P")[0]
    course2 = Course.objects.filter(course_name__startswith="BUS 520P")[0]
    course3 = Course.objects.get(course_name="MARKETING")
    course1.students.add(user1,user2)
    course2.students.add(user1,user2)
    course1.save()
    course2.save()

    #BUS 634P Strategic Management
    Session(course=course1,session_name="Week 1 : Course Introduction",session_dt="2014-06-21").save()
    Session(course=course1,session_name="Week 2 : Competitor Dynamics",session_dt="2014-06-22").save()
    Session(course=course1,session_name="Week 3 : Industry Analysis",session_dt="2014-06-23").save()
    Session(course=course1,session_name="Week 4 : Industry Analysis",session_dt="2014-06-24").save()
    Session(course=course1,session_name="Week 5 : Competitive Advantage",session_dt="2014-06-25").save()
    Session(course=course1,session_name="Week 6 : Industry Evolution and Revolution",session_dt="2014-06-26").save()
    Session(course=course1,session_name="Week 7 : Managing Human Assets F0r Competitive Advantage",session_dt="2014-06-27").save()
    Session(course=course1,session_name="Week 8 : Business Model Innovation",session_dt="2014-06-28").save()
    Session(course=course1,session_name="Week 9 : Corporate-Level Strategy: Diversification & Vertical Integration",session_dt="2014-06-29").save()
    Session(course=course1,session_name="Week 10 : Strategy Implementation",session_dt="2014-06-30").save()


    #  BUS 520P Managerial Finance  complete session list loaded.
    Session(course=course2,session_name="I. Financial Decision Making (week 1)",session_dt="2014-06-21").save()
    Session(course=course2,session_name="II. Time Value of Money, Annuities and Perpetuities (week 2)",session_dt="2014-08-22").save()
    Session(course=course2,session_name="III. Fundamentals of Capital Budgeting (week 3)",session_dt="2014-09-23").save()
    Session(course=course2,session_name="IV. Investment Decision Rules (week 4) ",session_dt="2014-09-24").save()
    Session(course=course2,session_name="V. Interest Rates (week 4) ",session_dt="2014-09-25").save()
    Session(course=course2,session_name="VI. Valuing Bonds (week 5)",session_dt="2014-09-26").save()
    Session(course=course2,session_name="VII. Valuing Stocks (weeks 6-8)",session_dt="2014-09-27").save()
    Session(course=course2,session_name="VIII. Capital Markets and the Pricing of Risk (week 8)",session_dt="2014-09-28").save()
    Session(course=course2,session_name="IX. Estimating the Cost of Capital ( week 8) ",session_dt="2014-09-29").save()
    Session(course=course2,session_name="X. Capital Structure, Perfect Markets, and Corporate Taxes (week 9)",session_dt="2014-09-30").save()
    Session(course=course2,session_name="XI. Capital Budgeting and Valuation with Leverage (week 9)",session_dt="2014-10-01").save()


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
    return HttpResponse( "Successfully Loaded init data")


################################  APIS are defined here #####################################

class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer

class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer

class CourseViewSet(viewsets.ModelViewSet):
		"""
		API endpoint that allows groups to be viewed or edited.
		"""
		queryset = Course.objects.all()
		serializer_class = CourseSerializer
		permission_classes = (permissions.IsAuthenticatedOrReadOnly,IsOwnerOrReadOnly,)
		filter_backends = (filters.DjangoFilterBackend,)
		filter_fields = ('course_name','students')

class SessionViewSet(viewsets.ModelViewSet):
		"""
		API endpoint that allows groups to be viewed or edited.
		"""
		queryset = Session.objects.all()
		serializer_class = SessionSerializer
		filter_backends = (filters.DjangoFilterBackend,)
		filter_fields = ('course','session_name')
		permission_classes = (permissions.IsAuthenticatedOrReadOnly,IsOwnerOrReadOnly,)




class TakeAwayList(generics.ListCreateAPIView):
		queryset = TakeAway.objects.all()
		serializer_class = TakeAwaySerializer
		filter_backends = (filters.DjangoFilterBackend,)
		filter_fields = ('user', 'is_public')
		permission_classes = (permissions.IsAuthenticatedOrReadOnly,IsOwnerOrReadOnly,)

		#def get_queryset(self):

				#	user = self.request.user
				#	if user.is_authenticated():
				#			return TakeAway.objects.filter(user=user,is_public=True)

				#	return TakeAway.objects.filter(user=None)




class TakeAwayDetail(generics.RetrieveUpdateDestroyAPIView):
		queryset = TakeAway.objects.all()
		serializer_class = TakeAwaySerializer
		permission_classes = (permissions.IsAuthenticatedOrReadOnly,IsOwnerOrReadOnly,)
