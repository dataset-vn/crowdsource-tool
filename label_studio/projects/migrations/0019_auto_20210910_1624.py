# Generated by Django 3.1.12 on 2021-09-10 16:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0018_project_status'),
    ]

    operations = [
        migrations.AlterField(
            model_name='project',
            name='status',
            field=models.CharField(blank=True, default='hello', help_text='Project status', max_length=20, null=True, verbose_name='status'),
        ),
    ]
