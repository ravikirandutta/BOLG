import sys

DEBUG = False
TEMPLATE_DEBUG = False
ALLOWED_HOSTS = ['www.mbatakeaways.com']

AUTO_LOGOUT_DELAY = 15

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




