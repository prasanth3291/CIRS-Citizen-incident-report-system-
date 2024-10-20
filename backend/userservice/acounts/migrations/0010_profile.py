# Generated by Django 5.0.4 on 2024-08-22 13:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('acounts', '0009_user_user_type'),
    ]

    operations = [
        migrations.CreateModel(
            name='Profile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('profile_pic', models.ImageField(null=True, upload_to='images/')),
                ('adress_feild_1', models.TextField(null=True)),
                ('adress_feild_2', models.TextField(null=True)),
                ('phone', models.IntegerField(null=True)),
                ('pin', models.IntegerField(null=True)),
                ('district', models.CharField(max_length=250, null=True)),
                ('state', models.CharField(max_length=250, null=True)),
            ],
        ),
    ]
