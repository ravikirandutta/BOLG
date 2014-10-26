from __future__ import absolute_import
import os
from celery import Celery
from django.conf import settings

# Indicate Celery to use the default Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'settings')

#BROKER_URL = 'amqp://test:test@localhost:5672/test'

#app = Celery('takeaway.tasks',backend='amqp',broker='amqp://test:**@localhost:5672/test')
app = Celery()
app.config_from_object('django.conf:settings')
# This line will tell Celery to autodiscover all your tasks.py that are in your app folders
app.autodiscover_tasks(lambda: settings.INSTALLED_APPS)
