# Generated by Django 3.1.12 on 2022-03-25 10:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0029_project_auto_approval'),
    ]

    operations = [
        migrations.AlterField(
            model_name='project',
            name='auto_approval',
            field=models.BooleanField(default=False, verbose_name='auto_approval'),
        ),
    ]
