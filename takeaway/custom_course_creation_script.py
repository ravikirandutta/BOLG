# Creating 2014 Fall Courses
from takeaway.models import *
from django.shortcuts import render,render_to_response,redirect,RequestContext, HttpResponseRedirect, HttpResponse



def load_courses(request):

	courses = [
	# 2017 core courses
	{'course_name':"BUS 500P Management Practice" , 'year':"2017" , 'section' : "Weekend",'batch':"2017" , 'code':"BUS 500P"},
	{'course_name':"BUS 540P Marketing Management" , 'year':"2017" , 'section' : "Monday",'batch':"2017", 'code':"BUS 540P"},
	{'course_name':"BUS 540P Marketing Management" , 'year':"2017" , 'section' : "Wednesday",'batch':"2017", 'code':"BUS 540P"},
	{'course_name':"BUS 550P Data & Decision Analytics" , 'year':"2017" , 'section' : "Monday",'batch':"2017", 'code':"BUS 550P"},
	{'course_name':"BUS 550P Data & Decision Analytics" , 'year':"2017" , 'section' : "Wednesday",'batch':"2017", 'code':"BUS 550P"},
	# Electives
	{ 'course_name':"BUS 506P Strategy&Org Hlth Care Sector",'code':"BUS 506P",'year':"2014",'batch':"2014",'section':"Wednesday"},
	{ 'course_name':"BUS 524P Sports Finance",'code':"BUS 524P",'year':"2014",'batch':"2014",'section':"Monday"},
	{ 'course_name':"BUS 532P Business and Society",'code':"BUS 532P",'year':"2014",'batch':"2014",'section':"Wednesday"},
	{ 'course_name':"BUS 537P Managing Groups & Teams",'code':"BUS 537P",'year':"2014",'batch':"2014",'section':"Monday"},
	{ 'course_name':"BUS 545P Predictive Sports Analytics",'code':"BUS 545P",'year':"2014",'batch':"2014",'section':"Wednesday"},
	{ 'course_name':"BUS 547P Product & Brand Management",'code':"BUS 547P",'year':"2014",'batch':"2014",'section':"Tuesday"},
	{ 'course_name':"BUS 548P Sales & Business Development",'code':"BUS 548P",'year':"2014",'batch':"2014",'section':"Monday"},
	{ 'course_name':"BUS 555P Appcology: New Commerce Infra",'code':"BUS 555P",'year':"2014",'batch':"2014",'section':"Monday"},
	{ 'course_name':"BUS 563P The Business of Sport",'code':"BUS 563P",'year':"2014",'batch':"2014",'section':"Weekend"},
	{ 'course_name':"BUS 623P Security Analy&Portfolio Mgmt",'code':"BUS 623P",'year':"2014",'batch':"2014",'section':"Wednesday"},
	{ 'course_name':"BUS 628P Investment Banking",'code':"BUS 628P",'year':"2014",'batch':"2014",'section':"Thursday"},
	{ 'course_name':"BUS 629P Fixed Income Portfolio Mgt",'code':"BUS 629P",'year':"2014",'batch':"2014",'section':"Monday"},
	{ 'course_name':"BUS 632P Negotiations",'code':"BUS 632P",'year':"2014",'batch':"2014",'section':"Tuesday"},
	{ 'course_name':"BUS 651P Strategic Decision Analysis",'code':"BUS 651P",'year':"2014",'batch':"2014",'section':"Wednesday"},
	{ 'course_name':"BUS 653P Operations Strategy",'code':"BUS 632PBUS",'year':"2014",'batch':"2014",'section':"Monday"},
	{ 'course_name':"BUS 659P Process Analysis & Six Sigma",'code':"BUS 659P",'year':"2014",'batch':"2014",'section':"Monday"},
	{ 'course_name':"BUS 661P Applied Entrepreneurship",'code':"BUS 661P",'year':"2014",'batch':"2014",'section':"Monday"},
	{ 'course_name':"BUS 680P Illiquid Alternt. Investments",'code':"BUS 680P",'year':"2014",'batch':"2014",'section':"Monday"},
	{ 'course_name':"BUS 685P Private Equity Investing",'code':"BUS 685P",'year':"2014",'batch':"2014",'section':"Monday"},
	{ 'course_name':"BUS 688P Real Estate Devpt & Invest",'code':"BUS 688P",'year':"2014",'batch':"2014",'section':"Monday"},
	]


	sessions = [	
	{'session_name':"Week 1" , 'session_dt':"2014-08-01"},
	{'session_name':"Week 2" , 'session_dt':'2014-08-02'},
	{'session_name':"Week 3" , 'session_dt':'2014-08-03'},
	{'session_name':"Week 4" , 'session_dt':'2014-08-04'},
	{'session_name':"Week 5" , 'session_dt':'2014-08-05'},
	{'session_name':"Week 6" , 'session_dt':'2014-08-06'},
	{'session_name':"Week 7" , 'session_dt':'2014-08-07'},
	{'session_name':"Week 8" , 'session_dt':'2014-08-08'},
	{'session_name':"Week 9" , 'session_dt':'2014-08-09'},
	{'session_name':"Week 10" , 'session_dt':'2014-08-10'},
	{'session_name':"Week 11" , 'session_dt':'2014-08-11'},
	]

	admin = User.objects.all()[0]
	school = School.objects.get(school_name='EMORY')
	program = Program.objects.get(name='Evening MBA')
	term = Term.objects.get(description='Ist Semester')
	status = Status.objects.all()[0]
	batch = 2017
	year = 2017

    # creating main courses first. Selecting unique values from the course instances
	main_courses = {v['course_name']:v for v in courses}.values()

	for course in main_courses:
		c = Course(school= school, course_name=course['course_name'], course_desc = course['course_name'], created_by = admin)
		c.save()

	for course in courses:
		main_course =  Course.objects.get(course_name = course['course_name'])
		c = CourseInstance(course= main_course,section = Section.objects.get(name= course['section']), program = program, batch = batch,year = year,status = status,term= term)
		c.save()
		# creating sessions for the course instances
		for session in sessions:
			session_name = session['session_name'] + '  (' + course['code'] + ')'
			s = Session(courseInstance=c,session_name = session_name,session_dt = session['session_dt'])
			s.save()

		


	return HttpResponse( "Successfully Loaded  2017 core courses")



		
