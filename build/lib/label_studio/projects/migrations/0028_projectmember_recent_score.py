# Generated by Django 3.1.13 on 2021-12-31 09:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0027_projectmember_ranking_score'),
    ]

    operations = [
        migrations.AddField(
            model_name='projectmember',
            name='recent_score',
            field=models.IntegerField(default=0, help_text='Represents the recent score of each project member', verbose_name='recent score'),
        ),
    ]