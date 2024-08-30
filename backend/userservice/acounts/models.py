from django.db import models
from django.contrib.auth.models import UserManager
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils.translation import gettext_lazy as _
# Create your models here.
from django.contrib.auth.models import AbstractBaseUser,BaseUserManager
# 
from allauth.socialaccount.models import SocialAccount

class MyacountManager(BaseUserManager):
    def create_user(self, first_name, last_name, username, email, password=None, user_type='citizen',auth_provider=None):
        print("auth1",auth_provider)
        print('sample')
        if not email:
            raise ValueError("User must have an Email adress")
        if not username:
            raise ValueError("User must have a username")
        user = self.model(
            email=self.normalize_email(email),
            username=username,
            first_name=first_name,
            last_name=last_name,
            user_type=user_type, 
            # auth_provider=auth_provider
            
        )

        user.set_password(password)
        user.is_active = True  # Default to inactive until email verification
        user.save(using=self._db)
        return user
    def create_google_user(self, first_name, last_name, username, email):
        print('creating google uyser 2')
        return self.create_user(
            first_name=first_name,
            last_name=last_name,
            username=username,
            email=email,
            auth_provider='google'
        )
    def create_station_admin(self, first_name, last_name, username, email, password=None,auth_provider=None):
        print("auth1",auth_provider)

        user = self.create_user(
        first_name=first_name,
        last_name=last_name,
        username=username,
        email=email,
        password=password,
        user_type='station_admin',  # Set user type to station_admin
        )
        return user
    def create_state_admin(self, first_name, last_name, username, email, password=None,auth_provider=None):
        user = self.create_user(
        first_name=first_name,
        last_name=last_name,
        username=username,
        email=email,
        password=password,
        user_type='state_admin',  # Set user type to state_admin
        )
        return user
    



    def create_superuser(self, first_name, last_name, username, email, password=None):
        user = self.create_user(
            email=self.normalize_email(email),
            username=username,
            password=password,
            first_name=first_name,
            last_name=last_name,
            user_type='state_admin'  # Superusers are also state admins by default
        )

        user.is_admin = True
        user.is_active = True
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user
    

AUTH_PROVIDERS={'email':'email','google':'google'}

class User(AbstractBaseUser):    
    USER_TYPE_CHOICES = (
        ('citizen', 'Citizen'),
        ('station_admin', 'Station Admin'),
        ('state_admin', 'State Admin'),
    )
    email=models.EmailField(max_length=255,unique=True)
    username = models.CharField(max_length=50, unique=True)
    first_name=models.CharField( max_length=100)
    last_name=models.CharField(max_length=100)
    is_staff=models.BooleanField(default=False)
    is_superuser=models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)
    is_verified=models.BooleanField(default=False)
    is_active=models.BooleanField(default=False)
    date_joined=models.DateTimeField(auto_now_add=True)
    last_login=models.DateTimeField(auto_now=True)
    auth_provider = models.CharField(max_length=50, default=AUTH_PROVIDERS.get("email"))
    email_verification_token=models.CharField(max_length=200,null=True,blank=True)
    user_type = models.CharField(max_length=20, choices=USER_TYPE_CHOICES, default='citizen') 
    USERNAME_FIELD='username'
    REQUIRED_FIELDS=['email','first_name','last_name']

    objects = MyacountManager()

    

    def __str__(self):
        return self.email
    
    def get_full_name(self):
        return f"{self.first_name} {self.last_name}"
    
    def has_perm(self, perm, object=None):
        return self.is_admin

    def has_module_perms(self, add_label):
        return True
    
class Otp(models.Model):
    user=models.ForeignKey(User,on_delete=models.CASCADE)    
    otp=models.CharField( max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.otp
class Profile(models.Model):
    user = models.OneToOneField(User, verbose_name=_("User"), on_delete=models.CASCADE)
    profile_pic = models.ImageField(upload_to='images/', null=True, blank=True)
    address_field_1 = models.TextField(null=True, blank=True)
    address_field_2 = models.TextField(null=True, blank=True)
    phone = models.CharField(max_length=20, null=True, blank=True)
    pin = models.CharField(max_length=10, null=True, blank=True)
    district = models.CharField(max_length=250, null=True, blank=True)
    state = models.CharField(max_length=250, null=True, blank=True)

    def __str__(self):
        return self.user.get_full_name()


    
@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    try:
        instance.profile.save()
    except Profile.DoesNotExist:
        Profile.objects.create(user=instance)
    
