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
from rest_framework.decorators import *
from decimal import *


@api_view(['POST','GET'])
@permission_classes(())
def send_email_thali(request):


    email = request.QUERY_PARAMS.get('email', None)
    result = 'SUCCESS'
    recipients = ['ravi.dutta@gmail.com','suresh.atluri@gmail.com','nagarajarao.daivam@gmail.com','f2003484@gmail.com']

    if email :
    	print 'HOMTHALI CUSTOMER' + str(email )
    	print recipients
    	send_mail('HOMTHALI CUSTOMER', email , 'support@mbatakeaways.com', recipients)
    else :
    	print 'HOMTHALI WRONG WRONG' + str(email )
    	print recipients
    	send_mail('HOMTHALI BADNESS HAPPENNEDDD', 'Something Very very Bad Happened' , 'support@mbatakeaways.com', recipients)
    	result = 'FAIL'

    return Response({"result": result })

