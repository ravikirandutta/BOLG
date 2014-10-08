# Creating 2014 Fall Courses
from takeaway.models import *
from django.shortcuts import render,render_to_response,redirect,RequestContext, HttpResponseRedirect, HttpResponse


def load_wharton_data(request):

	user = request.user

	if user.is_superuser  and user.is_authenticated()  :
		school = School(school_name='WHARTON',image_url='http://mbatakeaways.com/static/takeaway/img/wharton.jpg').save()
		school = School.objects.get(school_name='WHARTON')
		email_format = EmailFormat(format='@wharton.upenn.edu',school=school).save()

		
		program1 = Program(school=school,name='Executive MBA').save()
		program1 = Program.objects.get(school=school,name='Executive MBA')
		program2 = Program(school=school,name='Fulltime MBA').save()
		program2 = Program.objects.get(school=school,name='Fulltime MBA')
	

		term1= Term(school=school,description='I Semester').save()
		term= Term.objects.get(school=school,description='I Semester')
		term2= Term(school=school,description='II Semester').save()

		section_monday = Section(school=school,name='Monday').save()
		section_tuesday = Section(school=school,name='Tuesday').save()
		section_wednesday = Section(school=school,name='Wednesday').save()
		section_thursday = Section(school=school,name='Thursday').save()
		section_friday = Section(school=school,name='Friday').save()
		section_weekend = Section(school=school,name='Weekend').save()

		status_active = Status(school=school,value='Active').save()
		status = Status.objects.get(school=school,value='Active')
		status_inactive = Status(school=school,value='Inactive').save()




 



		courses = [
		# 2017 core courses
		{'course_name':"Financial Derivatives (FNCE 717)" , 'year':"2016" , 'section' : 'Weekend' ,'batch':"2016" , 'code':"FNCE 717",'program':program1},
		{'course_name':"Advanced Corporate Finance (FNCE 726)" , 'year':"2016" , 'section' : 'Weekend','batch':"2016", 'code':"FNCE 726",'program':program1},
		{'course_name':"Strategy & Competitive Advantage (MGMT 701)" , 'year':"2016" , 'section' : 'Weekend' ,'batch':"2016", 'code':"MGMT 701",'program':program1},
		# Electives
		{ 'course_name':"Managing Organizational Change (MGMT 773)",'code':"MGMT 773",'year':"2016",'batch':"2016",'section':"Weekend",'program':program1},
		{ 'course_name':"Investment Management (FNCE 720)",'code':"FNCE 720",'year':"2016",'batch':"2016",'section':"Weekend",'program':program1},
		{ 'course_name':"Negotiations (MGMT 691)",'code':"MGMT 691",'year':"2016",'batch':"2016",'section':"Weekend",'program':program1},
		{ 'course_name':"Product Design and Development (OPIM 654)",'code':"OPIM 654",'year':"2016",'batch':"2016",'section':"Weekend",'program':program1},
		{ 'course_name':"Entrepreneurship through Acquisition (MGMT 811)",'code':"MGMT 811",'year':"2016",'batch':"2016",'section':"Weekend",'program':program1},
		{ 'course_name':"Corporate Development: Mergers and Acquisitions (MGMT 721)",'code':"MGMT 721",'year':"2016",'batch':"2016",'section':"Weekend",'program':program1},
		{ 'course_name':"Digital Marketing (MKTG 730)",'code':"MKTG 730",'year':"2016",'batch':"2016",'section':"Weekend",'program':program1},
		{ 'course_name':"Pricing Policy (MKTG 754)",'code':"MKTG 754",'year':"2016",'batch':"2016",'section':"Weekend",'program':program1},
		
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
		#school = School.objects.get(school_name='EMORY')
		#program = Program.objects.get(name='Evening MBA')
		#term = Term.objects.get(description='Ist Semester')
		#status = Status.objects.all()[0]
		batch = 2016
		year = 2016
	
	    # creating main courses first. Selecting unique values from the course instances
		main_courses = {v['course_name']:v for v in courses}.values()
	
		for course in main_courses:
			c_list= Course.objects.filter(course_name=course['course_name'],school=school)
			if c_list.count() == 0 :
				c = Course(school= school, course_name=course['course_name'], course_desc = course['course_name'], created_by = admin)
				c.save()
	
		for course in courses:
			main_course =  Course.objects.get(course_name = course['course_name'],school=school)
			section = Section.objects.get_or_create(name= course['section'],school=school)[0]
			c_list= CourseInstance.objects.filter(course= main_course,section=section)
			if c_list.count()  == 0 :
				c = CourseInstance(course= main_course,section = Section.objects.get_or_create(name= course['section'],school=school)[0], 
					program = course['program'], batch = batch,year = year,
					status = status,term= term)
				c.save()
			# creating sessions for the course instances
				for session in sessions:
					session_name = session['session_name'] + '  (' + course['code'] + ')'
					s = Session(courseInstance=c,session_name = session_name,session_dt = session['session_dt'])
					s.save()

		return HttpResponse( "Successfully Loaded  ISB core courses")


	return HttpResponse( "You are not admin")


def load_isb_data(request):

	user = request.user

	if user.is_superuser  and user.is_authenticated()  :
		school = School(school_name='ISB',image_url='http://www.isb.edu/sites/default/files/EPS-Format.jpg').save()
		school = School.objects.get(school_name='ISB')
		email_format = EmailFormat(format='@isb.edu',school=school).save()
		program1 = Program(school=school,name='PGP in Management').save()
		program1 = Program.objects.get(school=school,name='PGP in Management')
		program2 = Program(school=school,name='PGP in Management Senior Exec').save()
		program2 = Program.objects.get(school=school,name='PGP in Management Senior Exec')
		program3 = Program(school=school,name='Fellow Programme in Management').save()
		program4 = Program(school=school,name='Management Programme for FamilyBusiness').save()

		term1= Term(school=school,description='I Semester').save()
		term= Term.objects.get(school=school,description='I Semester')
		term2= Term(school=school,description='II Semester').save()

		section_monday = Section(school=school,name='Monday').save()
		section_tuesday = Section(school=school,name='Tuesday').save()
		section_wednesday = Section(school=school,name='Wednesday').save()
		section_thursday = Section(school=school,name='Thursday').save()
		section_friday = Section(school=school,name='Friday').save()
		section_weekend = Section(school=school,name='Weekend').save()

		status_active = Status(school=school,value='Active').save()
		status = Status.objects.get(school=school,value='Active')
		status_inactive = Status(school=school,value='Inactive').save()




		courses = [
		# 2017 core courses
		{'course_name':"Financial Decision Making for Managers" , 'year':"2016" , 'section' : 'Monday' ,'batch':"2016" , 'code':"FDMM",'program':program2},
		{'course_name':"Management of Organisations and Leading for change" , 'year':"2016" , 'section' : 'Monday','batch':"2016", 'code':"MOLC",'program':program2},
		{'course_name':"Marketing Management" , 'year':"2016" , 'section' : 'Wednesday' ,'batch':"2016", 'code':"MKT MGMT",'program':program2},
		# Electives
		{ 'course_name':"FINANCIAL ACCOUNTING AND DECISION MAKING",'code':"Fin Acct",'year':"2016",'batch':"2016",'section':"Wednesday",'program':program1},
		{ 'course_name':"MANAGERIAL ECONOMICS",'code':"Mgm Acc",'year':"2016",'batch':"2016",'section':'Wednesday','program':program1},
		
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
		#school = School.objects.get(school_name='EMORY')
		#program = Program.objects.get(name='Evening MBA')
		#term = Term.objects.get(description='Ist Semester')
		#status = Status.objects.all()[0]
		batch = 2016
		year = 2016
	
	    # creating main courses first. Selecting unique values from the course instances
		main_courses = {v['course_name']:v for v in courses}.values()
	
		for course in main_courses:
			c_list= Course.objects.filter(course_name=course['course_name'],school=school)
			if c_list.count() == 0 :
				c = Course(school= school, course_name=course['course_name'], course_desc = course['course_name'], created_by = admin)
				c.save()
	
		for course in courses:
			main_course =  Course.objects.get(course_name = course['course_name'],school=school)
			section = Section.objects.get_or_create(name= course['section'],school=school)[0]
			c_list= CourseInstance.objects.filter(course= main_course,section=section)
			if c_list.count()  == 0 :
				c = CourseInstance(course= main_course,section = Section.objects.get_or_create(name= course['section'],school=school)[0], 
					program = course['program'], batch = batch,year = year,
					status = status,term= term)
				c.save()
			# creating sessions for the course instances
				for session in sessions:
					session_name = session['session_name'] + '  (' + course['code'] + ')'
					s = Session(courseInstance=c,session_name = session_name,session_dt = session['session_dt'])
					s.save()

		return HttpResponse( "Successfully Loaded  ISB core courses")


	return HttpResponse( "You are not admin")



		
