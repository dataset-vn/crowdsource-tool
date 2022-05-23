# Generated by Django 3.1.13 on 2022-05-19 07:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0005_auto_20220123_2353'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='ranking_tier',
            field=models.CharField(default='Unranked', help_text='The tiers based on ranking points of users', max_length=256, verbose_name='ranking_tier'),
        ),
    ]
