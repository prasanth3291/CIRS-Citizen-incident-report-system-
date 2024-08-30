# Generated by Django 5.0.4 on 2024-08-15 20:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('acounts', '0008_otp'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='user_type',
            field=models.CharField(choices=[('citizen', 'Citizen'), ('station_admin', 'Station Admin'), ('state_admin', 'State Admin')], default='citizen', max_length=20),
        ),
    ]
