from django.db import models
from django.contrib.auth.models import UserManager

# Create your models here.
from django.contrib.auth.models import AbstractBaseUser,BaseUserManager

class MyacountManager(BaseUserManager):
    def create_user(self, first_name, last_name, username, email, password=None):
        if not email:
            raise ValueError("User must have an Email adress")
        if not username:
            raise ValueError("User must have a username")
        user = self.model(
            email=self.normalize_email(email),
            username=username,
            first_name=first_name,
            last_name=last_name,
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, first_name, last_name, username, email, password=None):
        user = self.create_user(
            email=self.normalize_email(email),
            username=username,
            password=password,
            first_name=first_name,
            last_name=last_name,
        )

        user.is_admin = True
        user.is_active = True
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user
    

AUTH_PROVIDERS={'email':'email','google':'google'}

class User(AbstractBaseUser):    
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