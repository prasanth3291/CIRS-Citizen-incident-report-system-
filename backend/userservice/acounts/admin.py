from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User,Otp,Profile

class userAdmin(admin.ModelAdmin):
        # List the fields you want to display in the list view
    list_display = (
          'username',
          'email', 
          'first_name', 
          'last_name', 
          'is_staff', 
          'is_active',
          'user_type'
      
    )
 

admin.site.register(User,userAdmin)
admin.site.register(Otp)
admin.site.register(Profile)


