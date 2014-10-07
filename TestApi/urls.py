from django.conf.urls import patterns, include, url
from rest_framework import routers,generics
from takeaway import views
from takeaway.views import *
from takeaway.models import *
from takeaway.forms import *
from django.views.generic.base import TemplateView


from django.contrib import admin
from django.contrib.auth.views import password_change
admin.autodiscover()

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'groups', views.GroupViewSet)
router.register(r'schools', views.SchoolViewSet)
router.register(r'courses', views.CourseViewSet)
#router.register(r'sessions', views.SessionViewSet)
router.register(r'tags', views.TagViewSet)
router.register(r'ratings', views.RatingViewSet)
router.register(r'notifications', views.NotificationViewSet)
router.register(r'courseInstances', views.CourseInstanceViewSet)
router.register(r'courseInstancesCreate', views.CourseInstanceCreateViewSet)
router.register(r'programs', views.ProgramViewSet)
router.register(r'sections', views.SectionViewSet)
router.register(r'status', views.StatusViewSet)
router.register(r'terms', views.TermViewSet)
router.register(r'takeawayprofiles', views.TakeAwayProfileViewSet)
router.register(r'favorites', views.FavoriteViewSet)
router.register(r'comments', views.CommentViewSet)
router.register(r'contactus', views.ContactUsViewSet)
router.register(r'emailSettings', views.EmailSettingsViewSet)

handler404 = 'takeaway.views.error'

urlpatterns = patterns('',
    # Examples:
    url(r'^$', 'takeaway.views.home', name='home'),
    url(r'^login/$', 'takeaway.views.home', name='login'),
    url(r'^profile/$', 'takeaway.views.profile', name='profile'),
    url(r'^handlelogin/$', 'takeaway.views.handlelogin', name='handlelogin'),
    url(r'^logout/$', 'takeaway.views.logoutuser', name='logoutuser'),
    url(r'^user/password/reset/$',
        'django.contrib.auth.views.password_reset',
        {'post_reset_redirect' : '/user/password/reset/done/'},
        name="password_reset"),
    (r'^user/password/reset/done/$',
        'django.contrib.auth.views.password_reset_done'),
    (r'^user/password/reset/(?P<uidb64>[0-9A-Za-z]+)-(?P<token>.+)/$',
        'django.contrib.auth.views.password_reset_confirm',
        {'post_reset_redirect' : '/user/password/done/'}),
    (r'^user/password/done/$',
        'django.contrib.auth.views.password_reset_complete'),

    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),
	url(r'^', include(router.urls)),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
	url(r'^sessions/(?P<pk>-?[0-9]+)/$', SessionDetail.as_view(),name='session-detail'),
    url(r'^takeaways/(?P<pk>-?[0-9]+)/$', TakeAwayDetail.as_view(),name='takeaway-detail'),
	url(r'^takeaways/$', TakeAwayList.as_view(), name='takeaway-list'),
    url(r'^sessions/$', SessionList.as_view(), name='session-list'),

       url(r'^takeaways/index', 'takeaway.views.index', name='index'),
    url(r'^takeaway/initload', 'takeaway.views.initload', name='initload'),
     url(r'accounts/register/$',
       TakeAwayRegistrationView.as_view(),
        name = 'registration_register'),
    url(r'^accounts/', include('registration.backends.default.urls')),
    url(r'^passwordchange/', include('django.contrib.auth.urls')),
    url(r'^load_courses/',  'takeaway.custom_school_data_load.load_isb_data', name='load_courses'),
    url(r'^load_wharton_courses/',  'takeaway.custom_school_data_load.load_wharton_data', ),

    # url(r'^contact/thankyou/', 'takeaway.views.thankyou'),
    # url(r'^contact/', 'takeaway.views.contactview'),
    url(r'^contact/', 'takeaway.views.ContactUs', name='contact_us'),
    url(r'^contact_login/','takeaway.views.ContactUsLogin',name='contact_us_login'),
    url(r'^landing/',TemplateView.as_view(template_name="landing.html")),
    url(r'^demo/',TemplateView.as_view(template_name="demo.html")),
    url(r'^rating/',TemplateView.as_view(template_name="rating.html")),
    url(r'^can_user_post/','takeaway.views.can_user_post',),
    url(r'^play/','takeaway.views.play',name="play"),
    url(r'^load_demo/','takeaway.demo.create_play_ground', name='load_demo'),
    url(r'^test/','takeaway.views.test',),
    url(r'^get_leader_board/','takeaway.views.get_leader_board',),
    url(r'^chat/','takeaway.views.Chat',name='chat'),


)



