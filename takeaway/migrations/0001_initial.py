# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'School'
        db.create_table(u'takeaway_school', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('school_name', self.gf('django.db.models.fields.CharField')(max_length=400)),
        ))
        db.send_create_signal(u'takeaway', ['School'])

        # Adding model 'Course'
        db.create_table(u'takeaway_course', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('school', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['takeaway.School'])),
            ('course_name', self.gf('django.db.models.fields.CharField')(max_length=400)),
            ('course_desc', self.gf('django.db.models.fields.TextField')()),
            ('created_by', self.gf('django.db.models.fields.CharField')(max_length=400)),
            ('created_dt', self.gf('django.db.models.fields.DateTimeField')(auto_now_add=True, blank=True)),
            ('updated_dt', self.gf('django.db.models.fields.DateTimeField')(auto_now=True, blank=True)),
        ))
        db.send_create_signal(u'takeaway', ['Course'])

        # Adding M2M table for field students on 'Course'
        m2m_table_name = db.shorten_name(u'takeaway_course_students')
        db.create_table(m2m_table_name, (
            ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True)),
            ('course', models.ForeignKey(orm[u'takeaway.course'], null=False)),
            ('user', models.ForeignKey(orm[u'auth.user'], null=False))
        ))
        db.create_unique(m2m_table_name, ['course_id', 'user_id'])

        # Adding model 'Session'
        db.create_table(u'takeaway_session', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('course', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['takeaway.Course'])),
            ('session_name', self.gf('django.db.models.fields.CharField')(max_length=1000)),
            ('session_dt', self.gf('django.db.models.fields.DateField')()),
            ('created_dt', self.gf('django.db.models.fields.DateTimeField')(auto_now_add=True, blank=True)),
            ('updated_dt', self.gf('django.db.models.fields.DateTimeField')(auto_now=True, blank=True)),
        ))
        db.send_create_signal(u'takeaway', ['Session'])

        # Adding model 'Enrollment'
        db.create_table(u'takeaway_enrollment', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('student', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['auth.User'])),
            ('course', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['takeaway.Course'])),
        ))
        db.send_create_signal(u'takeaway', ['Enrollment'])

        # Adding model 'Tag'
        db.create_table(u'takeaway_tag', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=100)),
        ))
        db.send_create_signal(u'takeaway', ['Tag'])

        # Adding model 'TakeAway'
        db.create_table(u'takeaway_takeaway', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('course', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['takeaway.Course'])),
            ('session', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['takeaway.Session'])),
            ('notes', self.gf('django.db.models.fields.TextField')()),
            ('created_dt', self.gf('django.db.models.fields.DateTimeField')(auto_now_add=True, blank=True)),
            ('updated_dt', self.gf('django.db.models.fields.DateTimeField')(auto_now=True, blank=True)),
            ('user', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['auth.User'])),
            ('is_public', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('vote_count', self.gf('django.db.models.fields.IntegerField')(default=0)),
        ))
        db.send_create_signal(u'takeaway', ['TakeAway'])

        # Adding M2M table for field tags on 'TakeAway'
        m2m_table_name = db.shorten_name(u'takeaway_takeaway_tags')
        db.create_table(m2m_table_name, (
            ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True)),
            ('takeaway', models.ForeignKey(orm[u'takeaway.takeaway'], null=False)),
            ('tag', models.ForeignKey(orm[u'takeaway.tag'], null=False))
        ))
        db.create_unique(m2m_table_name, ['takeaway_id', 'tag_id'])

        # Adding model 'Rating'
        db.create_table(u'takeaway_rating', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('takeaway', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['takeaway.TakeAway'])),
            ('user', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['auth.User'])),
            ('rating_value', self.gf('django.db.models.fields.FloatField')(default=0)),
            ('already_rated', self.gf('django.db.models.fields.BooleanField')(default=False)),
        ))
        db.send_create_signal(u'takeaway', ['Rating'])

        # Adding model 'TakeAwayProfile'
        db.create_table(u'takeaway_takeawayprofile', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('user', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['auth.User'], unique=True)),
            ('email', self.gf('django.db.models.fields.EmailField')(unique=True, max_length=75)),
            ('school', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['takeaway.School'])),
            ('batch', self.gf('django.db.models.fields.CharField')(default='2016', max_length=200)),
            ('program', self.gf('django.db.models.fields.CharField')(default='EVENING', max_length=500)),
            ('section', self.gf('django.db.models.fields.CharField')(default='Weekend', max_length=500)),
            ('takeaway_count', self.gf('django.db.models.fields.IntegerField')(default=0)),
        ))
        db.send_create_signal(u'takeaway', ['TakeAwayProfile'])

        # Adding model 'Vote'
        db.create_table(u'takeaway_vote', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('takeaway', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['takeaway.TakeAway'])),
            ('user', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['auth.User'])),
            ('vote_value', self.gf('django.db.models.fields.IntegerField')(default=0)),
            ('already_voted', self.gf('django.db.models.fields.BooleanField')(default=True)),
        ))
        db.send_create_signal(u'takeaway', ['Vote'])


    def backwards(self, orm):
        # Deleting model 'School'
        db.delete_table(u'takeaway_school')

        # Deleting model 'Course'
        db.delete_table(u'takeaway_course')

        # Removing M2M table for field students on 'Course'
        db.delete_table(db.shorten_name(u'takeaway_course_students'))

        # Deleting model 'Session'
        db.delete_table(u'takeaway_session')

        # Deleting model 'Enrollment'
        db.delete_table(u'takeaway_enrollment')

        # Deleting model 'Tag'
        db.delete_table(u'takeaway_tag')

        # Deleting model 'TakeAway'
        db.delete_table(u'takeaway_takeaway')

        # Removing M2M table for field tags on 'TakeAway'
        db.delete_table(db.shorten_name(u'takeaway_takeaway_tags'))

        # Deleting model 'Rating'
        db.delete_table(u'takeaway_rating')

        # Deleting model 'TakeAwayProfile'
        db.delete_table(u'takeaway_takeawayprofile')

        # Deleting model 'Vote'
        db.delete_table(u'takeaway_vote')


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
        u'takeaway.course': {
            'Meta': {'object_name': 'Course'},
            'course_desc': ('django.db.models.fields.TextField', [], {}),
            'course_name': ('django.db.models.fields.CharField', [], {'max_length': '400'}),
            'created_by': ('django.db.models.fields.CharField', [], {'max_length': '400'}),
            'created_dt': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'school': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['takeaway.School']"}),
            'students': ('django.db.models.fields.related.ManyToManyField', [], {'to': u"orm['auth.User']", 'symmetrical': 'False'}),
            'updated_dt': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'blank': 'True'})
        },
        u'takeaway.enrollment': {
            'Meta': {'object_name': 'Enrollment'},
            'course': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['takeaway.Course']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'student': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['auth.User']"})
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
        u'takeaway.session': {
            'Meta': {'object_name': 'Session'},
            'course': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['takeaway.Course']"}),
            'created_dt': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'session_dt': ('django.db.models.fields.DateField', [], {}),
            'session_name': ('django.db.models.fields.CharField', [], {'max_length': '1000'}),
            'updated_dt': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'blank': 'True'})
        },
        u'takeaway.tag': {
            'Meta': {'object_name': 'Tag'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'})
        },
        u'takeaway.takeaway': {
            'Meta': {'object_name': 'TakeAway'},
            'course': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['takeaway.Course']"}),
            'created_dt': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'is_public': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'notes': ('django.db.models.fields.TextField', [], {}),
            'session': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['takeaway.Session']"}),
            'tags': ('django.db.models.fields.related.ManyToManyField', [], {'to': u"orm['takeaway.Tag']", 'symmetrical': 'False'}),
            'updated_dt': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'blank': 'True'}),
            'user': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['auth.User']"}),
            'vote_count': ('django.db.models.fields.IntegerField', [], {'default': '0'})
        },
        u'takeaway.takeawayprofile': {
            'Meta': {'object_name': 'TakeAwayProfile'},
            'batch': ('django.db.models.fields.CharField', [], {'default': "'2016'", 'max_length': '200'}),
            'email': ('django.db.models.fields.EmailField', [], {'unique': 'True', 'max_length': '75'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'program': ('django.db.models.fields.CharField', [], {'default': "'EVENING'", 'max_length': '500'}),
            'school': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['takeaway.School']"}),
            'section': ('django.db.models.fields.CharField', [], {'default': "'Weekend'", 'max_length': '500'}),
            'takeaway_count': ('django.db.models.fields.IntegerField', [], {'default': '0'}),
            'user': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['auth.User']", 'unique': 'True'})
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