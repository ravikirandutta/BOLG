# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'NotificationSettings'
        db.create_table(u'takeaway_notificationsettings', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('user', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['auth.User'])),
            ('mail_settings', self.gf('django.db.models.fields.IntegerField')(default=2)),
            ('mail_when_newuser', self.gf('django.db.models.fields.BooleanField')(default=True)),
            ('mail_when_takeaway', self.gf('django.db.models.fields.BooleanField')(default=True)),
            ('mail_when_rated', self.gf('django.db.models.fields.BooleanField')(default=True)),
        ))
        db.send_create_signal(u'takeaway', ['NotificationSettings'])


    def backwards(self, orm):
        # Deleting model 'NotificationSettings'
        db.delete_table(u'takeaway_notificationsettings')


    models = {
        u'auth.group': {
            'Meta': {'object_name': 'Group'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '80'}),
            'permissions': ('django.db.models.fields.related.ManyToManyField', [], {'to': u"orm['auth.Permission']", 'symmetrical': 'False', 'blank': 'True'})
        },
        u'auth.permission': {
            'Meta': {'ordering': "(u'content_type__app_label', u'content_type__model', u'codename')", 'unique_together': "((u'content_type', u'codename'),)", 'object_name': 'Permission'},
            'codename': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'content_type': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['contenttypes.ContentType']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50'})
        },
        u'auth.user': {
            'Meta': {'object_name': 'User'},
            'date_joined': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            'email': ('django.db.models.fields.EmailField', [], {'max_length': '75', 'blank': 'True'}),
            'first_name': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'groups': ('django.db.models.fields.related.ManyToManyField', [], {'symmetrical': 'False', 'related_name': "u'user_set'", 'blank': 'True', 'to': u"orm['auth.Group']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'is_active': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'is_staff': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'is_superuser': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'last_login': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            'last_name': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'password': ('django.db.models.fields.CharField', [], {'max_length': '128'}),
            'user_permissions': ('django.db.models.fields.related.ManyToManyField', [], {'symmetrical': 'False', 'related_name': "u'user_set'", 'blank': 'True', 'to': u"orm['auth.Permission']"}),
            'username': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '30'})
        },
        u'contenttypes.contenttype': {
            'Meta': {'ordering': "('name',)", 'unique_together': "(('app_label', 'model'),)", 'object_name': 'ContentType', 'db_table': "'django_content_type'"},
            'app_label': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'model': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'})
        },
        u'takeaway.comment': {
            'Meta': {'object_name': 'Comment'},
            'average_rating': ('django.db.models.fields.FloatField', [], {'default': '0'}),
            'created_dt': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'notes': ('django.db.models.fields.TextField', [], {}),
            'tags': ('django.db.models.fields.related.ManyToManyField', [], {'to': u"orm['takeaway.Tag']", 'symmetrical': 'False'}),
            'takeaway': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['takeaway.TakeAway']"}),
            'total_raters': ('django.db.models.fields.IntegerField', [], {'default': '0'}),
            'updated_dt': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'blank': 'True'}),
            'user': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['auth.User']"}),
            'vote_count': ('django.db.models.fields.IntegerField', [], {'default': '0'})
        },
        u'takeaway.contactus': {
            'Meta': {'object_name': 'ContactUs'},
            'cc_myself': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'message': ('django.db.models.fields.TextField', [], {}),
            'sender': ('django.db.models.fields.EmailField', [], {'max_length': '75'}),
            'subject': ('django.db.models.fields.CharField', [], {'max_length': '100'})
        },
        u'takeaway.course': {
            'Meta': {'object_name': 'Course'},
            'course_desc': ('django.db.models.fields.TextField', [], {}),
            'course_name': ('django.db.models.fields.CharField', [], {'max_length': '400'}),
            'created_by': ('django.db.models.fields.CharField', [], {'max_length': '400'}),
            'created_dt': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'school': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['takeaway.School']"}),
            'updated_dt': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'blank': 'True'})
        },
        u'takeaway.courseinstance': {
            'Meta': {'object_name': 'CourseInstance'},
            'batch': ('django.db.models.fields.IntegerField', [], {'max_length': '100'}),
            'course': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['takeaway.Course']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'program': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['takeaway.Program']"}),
            'section': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['takeaway.Section']"}),
            'status': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['takeaway.Status']"}),
            'term': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['takeaway.Term']"}),
            'year': ('django.db.models.fields.IntegerField', [], {'max_length': '100'})
        },
        u'takeaway.enrollment': {
            'Meta': {'object_name': 'Enrollment'},
            'course': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['takeaway.Course']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'student': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['auth.User']"})
        },
        u'takeaway.favorite': {
            'Meta': {'object_name': 'Favorite'},
            'courseInstance': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['takeaway.CourseInstance']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'takeaway': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['takeaway.TakeAway']"}),
            'user': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['auth.User']"})
        },
        u'takeaway.notificationsettings': {
            'Meta': {'object_name': 'NotificationSettings'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'mail_settings': ('django.db.models.fields.IntegerField', [], {'default': '2'}),
            'mail_when_newuser': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'mail_when_rated': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'mail_when_takeaway': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'user': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['auth.User']"})
        },
        u'takeaway.program': {
            'Meta': {'object_name': 'Program'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'school': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['takeaway.School']"})
        },
        u'takeaway.rating': {
            'Meta': {'object_name': 'Rating'},
            'already_rated': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'rating_value': ('django.db.models.fields.FloatField', [], {'default': '0'}),
            'takeaway': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['takeaway.TakeAway']"}),
            'user': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['auth.User']"})
        },
        u'takeaway.school': {
            'Meta': {'object_name': 'School'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'school_name': ('django.db.models.fields.CharField', [], {'max_length': '400'})
        },
        u'takeaway.section': {
            'Meta': {'object_name': 'Section'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'school': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['takeaway.School']"})
        },
        u'takeaway.session': {
            'Meta': {'object_name': 'Session'},
            'courseInstance': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['takeaway.CourseInstance']"}),
            'created_dt': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'session_dt': ('django.db.models.fields.DateField', [], {}),
            'session_name': ('django.db.models.fields.CharField', [], {'max_length': '1000'}),
            'updated_dt': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'blank': 'True'})
        },
        u'takeaway.status': {
            'Meta': {'object_name': 'Status'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'school': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['takeaway.School']"}),
            'value': ('django.db.models.fields.CharField', [], {'max_length': '100'})
        },
        u'takeaway.tag': {
            'Meta': {'object_name': 'Tag'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'})
        },
        u'takeaway.takeaway': {
            'Meta': {'object_name': 'TakeAway'},
            'average_rating': ('django.db.models.fields.FloatField', [], {'default': '0'}),
            'courseInstance': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['takeaway.CourseInstance']"}),
            'created_dt': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'is_public': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'notes': ('django.db.models.fields.TextField', [], {}),
            'session': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['takeaway.Session']"}),
            'tags': ('django.db.models.fields.related.ManyToManyField', [], {'to': u"orm['takeaway.Tag']", 'symmetrical': 'False'}),
            'total_raters': ('django.db.models.fields.IntegerField', [], {'default': '0'}),
            'updated_dt': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'blank': 'True'}),
            'user': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['auth.User']"}),
            'vote_count': ('django.db.models.fields.IntegerField', [], {'default': '0'})
        },
        u'takeaway.takeawayprofile': {
            'Meta': {'object_name': 'TakeAwayProfile'},
            'batch': ('django.db.models.fields.CharField', [], {'default': "'2016'", 'max_length': '200'}),
            'courseInstances': ('django.db.models.fields.related.ManyToManyField', [], {'related_name': "'students'", 'symmetrical': 'False', 'to': u"orm['takeaway.CourseInstance']"}),
            'email': ('django.db.models.fields.EmailField', [], {'unique': 'True', 'max_length': '75'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'program': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['takeaway.Program']"}),
            'school': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['takeaway.School']"}),
            'takeaway_count': ('django.db.models.fields.IntegerField', [], {'default': '0'}),
            'user': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['auth.User']", 'unique': 'True'})
        },
        u'takeaway.term': {
            'Meta': {'object_name': 'Term'},
            'description': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'school': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['takeaway.School']"})
        },
        u'takeaway.vote': {
            'Meta': {'object_name': 'Vote'},
            'already_voted': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'takeaway': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['takeaway.TakeAway']"}),
            'user': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['auth.User']"}),
            'vote_value': ('django.db.models.fields.IntegerField', [], {'default': '0'})
        }
    }

    complete_apps = ['takeaway']