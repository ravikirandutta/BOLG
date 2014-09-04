import os

DEBUG = False
DEBUG = os.environ['DEBUG']
TEMPLATE_DEBUG = False
TEMPLATE_DEBUG = os.environ['DEBUG']
ALLOWED_HOSTS = ['takeawayhub.herokuapp.com']

AUTO_LOGOUT_DELAY = 5
SERVER_EMAIL='takeawayhub@heroku.com'


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
        'django': {
            'handlers':['file'],
            'propagate': True,
            'level':'INFO',
        },
        'takeaway': {
            'handlers': ['console'],
            'level': 'DEBUG',
        },
    }
}
