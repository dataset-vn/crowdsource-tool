# Generated by Django 3.1.12 on 2022-03-25 10:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0030_auto_20220325_1724'),
    ]

    operations = [
        migrations.AlterField(
            model_name='project',
            name='auto_approval',
            field=models.IntegerField(default=0, verbose_name='auto_approval'),
        ),
    ]
