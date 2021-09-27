# Generated by Django 3.1.4 on 2021-09-27 10:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0023_projectmember_contact_status'),
    ]

    operations = [
        migrations.AddField(
            model_name='projectonboarding',
            name='contact_status',
            field=models.CharField(default='not check', help_text='Represents contact status of member', max_length=32),
        ),
        migrations.AlterField(
            model_name='projectmember',
            name='contact_status',
            field=models.CharField(help_text='Represents contact status of project members in project', max_length=32, null=True, verbose_name='contact status'),
        ),
    ]