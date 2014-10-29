import sys

DEBUG = False
TEMPLATE_DEBUG = False
ALLOWED_HOSTS = ['www.mbatakeaways.com']

AUTO_LOGOUT_DELAY = 750

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

EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_HOST_USER = "mbatakeaway@gmail.com"
EMAIL_HOST_PASSWORD = "getabillion101"
DEFAULT_FROM_EMAIL = 'mbatakeaway@gmail.com'
DEFAULT_TO_EMAIL = 'suresh.atluri@gmail.com'


