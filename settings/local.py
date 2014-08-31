DEBUG = True
TEMPLATE_DEBUG = True
ALLOWED_HOSTS = ['localhost']

AUTO_LOGOUT_DELAY = 5

if DEBUG:
    MEDIA_URL = '/media/'
    STATIC_ROOT = os.path.join(os.path.dirname(os.path.dirname(__file__)),"static","static")
    MEDIA_ROOT = os.path.join(os.path.dirname(os.path.dirname(__file__)),"static","media")
    STATICFILE_DIRS = os.path.join(os.path.dirname(os.path.dirname(__file__)),"static","static")




