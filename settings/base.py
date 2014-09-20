"""
Django settings for TestApi project.

For more information on this file, see
https://docs.djangoproject.com/en/1.6/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.6/ref/settings/
"""

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import os
BASE_DIR = os.path.dirname(os.path.dirname(__file__))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.6/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'wbp9#x=oa)8ioxh668kk+pe2fhg-=$w8^wbtrq*$a&^7^mp7c@'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

TEMPLATE_DEBUG = True

ADMINS = (
      ('RAVI', 'ravi.dutta@gmail.com'),
      ('Sagar','f2003484@gmail.com')
)


MANAGERS = ADMINS

ALLOWED_HOSTS = []


# Application definition

INSTALLED_APPS = (

    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
     'django.contrib.humanize',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'takeaway',
    'rest_framework',
    'south',
    'notifications',
    'registration',
    'django.contrib.admin',
)

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'takeaway.middleware.AutoLogout',
)

#session auto timeout
AUTO_LOGOUT_DELAY = 1
SESSION_SERIALIZER = 'django.contrib.sessions.serializers.PickleSerializer'


ROOT_URLCONF = 'TestApi.urls'

WSGI_APPLICATION = 'TestApi.wsgi.application'

REST_FRAMEWORK = {
    'DEFAULT_FILTER_BACKENDS': ('rest_framework.filters.DjangoFilterBackend',)
}

# Database
# https://docs.djangoproject.com/en/1.6/ref/settings/#databases


import dj_database_url
DATABASES = {
         'default': dj_database_url.config()
}

# Internationalization
# https://docs.djangoproject.com/en/1.6/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True

ACCOUNT_ACTIVATION_DAYS=7

#Email Settings
# EMAIL_USE_TLS = True
# EMAIL_HOST = 'smtp.gmail.com'
# EMAIL_PORT = 587
# EMAIL_HOST_USER = "mbatakeaway@gmail.com"
# EMAIL_HOST_PASSWORD = "getabillion101"
# DEFAULT_FROM_EMAIL = 'mbatakeaway@gmail.com'
# DEFAULT_TO_EMAIL = 'suresh.atluri@gmail.com'

EMAIL_USE_TLS = True
EMAIL_HOST = 'smtp.office365.com'
EMAIL_PORT = 587
EMAIL_HOST_USER = "support@mbatakeaways.com"
EMAIL_HOST_PASSWORD = "Pakodi123!"
DEFAULT_FROM_EMAIL = 'support@mbatakeaways.com'
DEFAULT_TO_EMAIL = 'suresh.atluri@gmail.com'



# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.6/howto/static-files/

STATIC_URL = '/static/'

REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': ('rest_framework.permissions.IsAdminUser',),
    'PAGINATE_BY': 10
}

# LOGIN Pge STuff

LOGIN_URL = '/login/'

LOGOUT_URL = '/logout/'

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.6/howto/static-files/


STATIC_URL = '/static/'


#Template Location
TEMPLATE_DIRS =(
                os.path.join(os.path.dirname(os.path.dirname(__file__)),"static","templates")
                )

if DEBUG:
    MEDIA_URL = '/media/'
    STATIC_ROOT = os.path.join(os.path.dirname(os.path.dirname(__file__)),"static","static")
    MEDIA_ROOT = os.path.join(os.path.dirname(os.path.dirname(__file__)),"static","media")
    STATICFILE_DIRS = os.path.join(os.path.dirname(os.path.dirname(__file__)),"static","static")

