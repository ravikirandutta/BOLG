from __future__ import absolute_import

from celery import shared_task
import logging
logger = logging.getLogger(__name__)

from django.core.mail import send_mail,mail_admins
from notifications import notify
from takeaway.models import Course, EmailSettings


@shared_task
def mail_new_takeaway(takeaway):

    recipients = takeaway.courseInstance.students.all()
    logger.info('recipient size ::'+ str(len(recipients)))
    for recipient in recipients:

        recipient_user = recipient.user
        curr_user = takeaway.user
        if recipient_user.id <> curr_user.id:
            message =  str(takeaway.courseInstance )
            notify.send(takeaway.user,recipient=recipient_user, verb='NEW_TAKEAWAY',description= message)
            try:
                email_settings = EmailSettings.objects.get(user=takeaway.user)
            except EmailSettings.DoesNotExist :
                email_settings = EmailSettings.objects.create(user=takeaway.user)
            if email_settings.mail_when_takeaway == 1 :
                logger.info('sending mail to:'+str(recipient_user.id))
                recipients = [recipient_user.email]
                user_message = 'Hi ' +  recipient_user.first_name + '\n'
                message = 'A new public takeaway is posted in course ' + takeaway.courseInstance.course.course_name + ' by one of your classmate.\nView this takeaway by logging into www.mbatakeaways.com and rate it.'
                footer = '\nThanks and stay tuned.\nTeam MBA Takeaways.'
                footer= footer + '\nIf you want instant email when new takeaways are posted or daily report or do not wish an email at all, please change your settings in your profile on www.mbatakeaways.com'

                final_message = user_message + message + footer
                        #print final_message
                send_mail('MBATAKEAWAYS [New TakeAway posted]', final_message, 'support@mbatakeaways.com', recipients)


    return 'instant mail sent for takeaway:'+ str(takeaway.id)
