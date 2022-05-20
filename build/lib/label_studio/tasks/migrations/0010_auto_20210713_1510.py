# Generated by Django 3.1.12 on 2021-07-13 15:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tasks', '0009_auto_20210713_1508'),
    ]

    operations = [
        migrations.AlterField(
            model_name='annotation',
            name='lead_time',
            field=models.FloatField(default=None, help_text='How much time it took to annotate the task', null=True, verbose_name='lead time'),
        ),
    ]
