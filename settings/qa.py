import os

DEBUG = False
DEBUG = os.environ['DEBUG']
TEMPLATE_DEBUG = False
TEMPLATE_DEBUG = os.environ['DEBUG']
ALLOWED_HOSTS = ['takeawayhub.herokuapp.com']

AUTO_LOGOUT_DELAY = 5
SERVER_EMAIL='takeawayhub@heroku.com'
