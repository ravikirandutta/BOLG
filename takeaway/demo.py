
from takeaway.models import *
from django.shortcuts import render,render_to_response,redirect,RequestContext, HttpResponseRedirect, HttpResponse

def create_play_ground(request):


    School(school_name="Demo").save()
    school1= School.objects.get(school_name="Demo")

    Program(name="Full Time MBA",school=school1).save()
    Program(name="Evening MBA",school=school1).save()
    Program(name="Part Time MBA",school=school1).save()

    program1 = Program.objects.get(name='Part Time MBA', school=school1)
    program2 = Program.objects.get(name='Evening MBA', school=school1)

    Section(name="Monday",school=school1).save()
    Section(name="Wednesday",school=school1).save()
    Section(name="Weekend",school=school1).save()

    section1 = Section.objects.get(name='Monday',school=school1)
    section2 = Section.objects.get(name='Wednesday',school=school1)

    Term(description="Ist Semester",school=school1).save()
    Term(description="IInd Semester",school=school1).save()

    term1 = Term.objects.get(description="Ist Semester",school=school1)
    Status(value="Active",school=school1).save()
    status1 = Status.objects.get(value="Active",school=school1)

    Course(school=school1,course_name="Demo Course 1",created_by="admin", course_desc="").save()
    course1 = Course.objects.filter(course_name__startswith="Demo Course")[0]

    CourseInstance(course=course1,section=section1,program = program2,batch="2014",year="2014",status=status1,term= term1 ).save()


    courseInstance1 = CourseInstance.objects.filter(program=program2,section=section1,course=course1)[0]

    Session(courseInstance=courseInstance1,session_name="Week 1 : Course Introduction",session_dt="2014-06-21").save()
    Session(courseInstance=courseInstance1,session_name="Week 2 : Competitor Dynamics",session_dt="2014-06-22").save()
    Session(courseInstance=courseInstance1,session_name="Week 3 : Industry Analysis",session_dt="2014-06-23").save()
    Session(courseInstance=courseInstance1,session_name="Week 4 : Industry Analysis",session_dt="2014-06-24").save()
    Session(courseInstance=courseInstance1,session_name="Week 5 : Competitive Advantage",session_dt="2014-06-25").save()
    Session(courseInstance=courseInstance1,session_name="Week 6 : Industry Evolution and Revolution",session_dt="2014-06-26").save()
    Session(courseInstance=courseInstance1,session_name="Week 7 : Managing Human Assets F0r Competitive Advantage",session_dt="2014-06-27").save()
    Session(courseInstance=courseInstance1,session_name="Week 8 : Business Model Innovation",session_dt="2014-06-28").save()
    Session(courseInstance=courseInstance1,session_name="Week 9 : Corporate-Level Strategy: Diversification & Vertical Integration",session_dt="2014-06-29").save()
    Session(courseInstance=courseInstance1,session_name="Week 10 : Strategy Implementation",session_dt="2014-06-30").save()
    return HttpResponse("Demo playground created")
