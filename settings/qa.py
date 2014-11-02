import os

DEBUG = False
DEBUG = os.environ['DEBUG']
TEMPLATE_DEBUG = False
TEMPLATE_DEBUG = os.environ['DEBUG']
ALLOWED_HOSTS = ['takeawayhub.herokuapp.com']

AUTO_LOGOUT_DELAY = 30
SERVER_EMAIL='takeawayhub@heroku.com'
import sys

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format' : "[%(asctime)s] %(levelname)s [%(name)s:%(lineno)s] %(message)s",
            'datefmt' : "%d/%b/%Y %H:%M:%S"
        },
        'simple': {
            'format': '%(levelname)s %(message)s'
        },
    },
    'handlers': {
       'console':{
            'level':'INFO',
            'class':'logging.StreamHandler',
            'stream': sys.stdout
        },
    },
    'loggers': {
        # 'django': {
        #     'handlers':['file'],
        #     'propagate': True,
        #     'level':'INFO',
        # },
        'takeaway': {
            'handlers': ['console'],
            'level': 'DEBUG',
        },
    }
}

# EMAIL_USE_TLS = True
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_HOST_USER = "mbatakeaway@gmail.com"
EMAIL_HOST_PASSWORD = "getabillion101"
DEFAULT_FROM_EMAIL = 'mbatakeaway@gmail.com'
DEFAULT_TO_EMAIL = 'suresh.atluri@gmail.com'

INSTANT_TAKEAWAY_NOTIFICATION_TURNED_ON = True
