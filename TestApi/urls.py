from django.conf.urls import patterns, include, url
from rest_framework import routers,generics
from takeaway import views
from takeaway.views import *
from takeaway.models import *

from django.contrib import admin
admin.autodiscover()

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'groups', views.GroupViewSet)
router.register(r'courses', views.CourseViewSet)
router.register(r'sessions', views.SessionViewSet)
#router.register(r'takeaways', views.TakeAwayViewSet)

urlpatterns = patterns('',
    # Examples:
    url(r'^$', 'takeaway.views.home', name='home'),
    url(r'^login/$', 'takeaway.views.home', name='login'),
    url(r'^handlelogin/$', 'takeaway.views.handlelogin', name='handlelogin'),
    url(r'^logout/$', 'takeaway.views.logoutuser', name='logoutuser'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),
	url(r'^', include(router.urls)),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
	#url(r'^takeaways/$', views.TakeAwayList.as_view()),
    url(r'^takeaways/(?P<pk>[0-9]+)/$', TakeAwayDetail.as_view(),name='takeaway-detail'),
	url(r'^takeaways/$', TakeAwayList.as_view(), name='takeaway-list'),
	   url(r'^takeaways/test', 'takeaway.views.test', name='test'),
       url(r'^takeaways/index', 'takeaway.views.index', name='index'),
    url(r'^takeaway/initload', 'takeaway.views.initload', name='initload'),
)
