# Generated by Django 3.1.13 on 2022-05-10 14:46

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0032_auto_20220325_1801'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='projectmember',
            name='ranking_score',
        ),
        migrations.RemoveField(
            model_name='projectmember',
            name='recent_score',
        ),
    ]
