# Generated by Django 3.1.4 on 2021-05-05 20:37

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0009_project_evaluate_predictions_automatically'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='project',
            name='template_used',
        ),
        migrations.DeleteModel(
            name='ProjectTemplate',
        ),
    ]
