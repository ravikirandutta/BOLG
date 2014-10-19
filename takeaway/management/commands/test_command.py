from django.shortcuts import render,render_to_response,redirect,RequestContext, HttpResponseRedirect, HttpResponse
from django.core.context_processors import request
from takeaway.models import *
from django.contrib.auth.models import User
from django.core.management.base import BaseCommand, CommandError,NoArgsCommand
from datetime import datetime, timedelta
from notifications.models import Notification
from django.db.models import Sum,Count
from django.core.mail import send_mail

class Command(NoArgsCommand):
    help = 'Send aggregated mail for each course'

    def add_arguments(self, parser):
        #name = 'mbatakeaways'
        parser.add_argument('poll_id', nargs='+', type=int)

    def handle(self, *args, **options):
    	user_list = EmailSettings.objects.filter(mail_when_takeaway=2)
        for setting in user_list:
            user= setting.user
            timestamp_to = datetime.now().date() - timedelta(days=2)
            notif_list =Notification.objects.filter(recipient=user).filter(verb='NEW_TAKEAWAY') #.filter(timestamp__gte = timestamp_to)
            agg_list = notif_list.order_by().values('description').annotate(takeaway_count= Count('id'))
            email_subject = " TEST : MBATakeaways Digest for " + str(datetime.now().date())
            
            email_message = []
            email_message .append("Hi " + user.first_name)
            for summary in agg_list:
                email_message .append( 'There are ' + str(summary['takeaway_count'])  + ' takeaways in the course ' + summary['description'] )
            email_message.append(' If you want instant email when new takeaways are posted or donot wish an email at all please change your settings in your profile on www.mbatakeaways.com')
            final_message = "\n".join(item for item in email_message)
            print final_message
            recipients = ['ravi.dutta@gmail.com','suresh.atluri@gmail.com','f2003484@gmail.com']
            send_mail(email_subject, final_message, 'support@mbatakeaways.com', recipients)

        return HttpResponse( final_message )




