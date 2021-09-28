# Generated by Django 3.1.12 on 2021-09-27 15:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0025_remove_projectonboarding_contact_status'),
    ]

    operations = [
        migrations.AlterField(
            model_name='projectmember',
            name='contact_status',
            field=models.CharField(default='not check', help_text='Represents contact status of member', max_length=32),
        ),
    ]
