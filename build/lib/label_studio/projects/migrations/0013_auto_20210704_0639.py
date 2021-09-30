# Generated by Django 3.1.12 on 2021-07-04 06:39

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('projects', '0012_projectleader'),
    ]

    operations = [
        migrations.CreateModel(
            name='ProjectOwner',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('enabled', models.BooleanField(default=True, help_text='Project owner is enabled')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='created at')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='updated at')),
                ('project', models.ForeignKey(help_text='Project ID', on_delete=django.db.models.deletion.CASCADE, related_name='owners', to='projects.project')),
                ('user', models.ForeignKey(help_text='User ID', on_delete=django.db.models.deletion.CASCADE, related_name='project_ownerships', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='projectmember',
            name='role',
            field=models.IntegerField(default=1, help_text='Represents role of member in project'),
        ),
        migrations.DeleteModel(
            name='ProjectLeader',
        ),
    ]
