DEBUG = False
TEMPLATE_DEBUG = True
ALLOWED_HOSTS = ['localhost']

AUTO_LOGOUT_DELAY = 5


CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.dummy.DummyCache',
    }
}
