# Generated by Django 4.0.5 on 2024-02-28 14:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('acounts', '0002_alter_user_managers_alter_user_date_joined_and_more'),
    ]

    operations = [
        migrations.AlterModelManagers(
            name='user',
            managers=[
            ],
        ),
        migrations.AddField(
            model_name='user',
            name='username',
            field=models.CharField(default='pk', max_length=50, unique=True),
            preserve_default=False,
        ),
    ]
