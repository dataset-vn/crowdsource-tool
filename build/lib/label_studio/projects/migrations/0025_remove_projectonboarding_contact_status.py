# Generated by Django 3.1.4 on 2021-09-27 10:11

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0024_auto_20210927_1009'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='projectonboarding',
            name='contact_status',
        ),
    ]