from django.shortcuts import render,HttpResponse,redirect
from rest_framework.views import APIView,Response,status
from .serializers import UserSerializer
from .models import User,Otp
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
# from rest_framework_simplejwt.tokens import RefreshToken
# from rest_framework.permissions import IsAuthenticated
# from allauth.account.views import LogoutView as AllauthLogoutView

from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView
from socialauth.adpaters import CustomGoogleOAuth2Adapter,CustomOAuth2Client

# email verification
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.sites.shortcuts import get_current_site
from django.template.loader import render_to_string
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator

#activation
from django.utils.http import urlsafe_base64_decode
from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view

import random
from django.http import JsonResponse

# for nearest police station
import requests



class GoogleLogin(SocialLoginView): # if you want to use Authorization Code Grant, use this

    adapter_class = GoogleOAuth2Adapter
    callback_url = 'http://localhost:3000'
    # client_class = OAuth2Client
    # def post(self,request,*args, **kwargs):
        
    #     print('its called dude')
    #     return Response(status=status.HTTP_201_CREATED)  
class customeGoogleLogin(GoogleLogin):
    adapter_class =CustomGoogleOAuth2Adapter  
    client_class=CustomOAuth2Client

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims
        token['first name'] = user.first_name
        token['email']=user.email   
        token['username']=user.username    
        # ...
        return token
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer    

class loginView(APIView):
    def post(self,request):
        username = request.data['username']
        password = request.data['password']          
        user=User.objects.filter(username=username).first()
        print(user) 
        if user is None:
            raise AuthenticationFailed('user not found')
        #check user is active or not
        if not user.is_active:
            raise AuthenticationFailed('user not activated')  
              
        if not user.check_password(password):
            raise AuthenticationFailed('Incorrect password')
        print('successfull login')
        
        # return Response('login successfull', status=status.HTTP_201_CREATED)
    
        if user is not None:
            obj=MyTokenObtainPairSerializer()
            token=obj.get_token(user)                   
            access_token = str(token.access_token)
            refresh_token  =str(token)
            return Response({
                'access_token': access_token,
                'refresh_token': refresh_token,
            }, status=status.HTTP_200_OK)
        else:
            raise AuthenticationFailed('Invalid credentials')    
    


class RegisterView(APIView):
    def post(self,request):      
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            success_message="an verification email send to your email"
            # return Response({'status':200,'message':'an verification email send to your email'})
            return Response(success_message, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        


@receiver(post_save,sender=User)
def send_email_token(sender,instance,created,**kwargs):
    print('its ok')
    if created:
        print('created')
        try:
            print('instance=',instance)
            subject='Your email is to be verified'
            token=default_token_generator.make_token(instance)
            message = render_to_string("acounts/email_verification.html", {
                'user': instance,
                'domain': '127.0.0.1:8000',
                "uid": urlsafe_base64_encode(force_bytes(instance)),  
                'token':token,
            })
            email_from=settings.EMAIL_HOST_USER
            recipient_list=[instance.email]
            print('here')
            send_mail(subject,message,email_from,recipient_list)
        except Exception as e:
            print(e)

        
# activate
def activate(request, uidb64, token):    
    try:
        uid=urlsafe_base64_decode(uidb64).decode()
        User = get_user_model()
        user = User.objects.get(email=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None    
    if user is not None and default_token_generator.check_token(user, token):
        user.is_active = True
        user.is_validated = True
        user.save()
    return redirect('http://localhost:3000/login')


@api_view(['POST'])
def forgot_password(request):
    if request.method=='POST':
        email=request.data.get('email')
        #verify email
        try:
            user=User.objects.get(email=email)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            user=None
        if user is not None:
            subject='Reset password'    
            otp = ''.join(random.choices('0123456789', k=6))    
            try:
                otp_instances=Otp.objects.filter(user=user)
            except Exception as e:
                print('an error occured',str(e))    
            if otp_instances.exists():
                otp_instances.delete()

            otp_instance=Otp(
                user=user,
                otp=otp
            )
            otp_instance.save()
            message = otp
            email_from=settings.EMAIL_HOST_USER
            recipient_list=[user.email]
            send_mail(subject,message,email_from,recipient_list) 
            success_message="an verification email send to your email"
            return Response(success_message, status=status.HTTP_201_CREATED)
        else:
            print('this mail doesnt exist')
            error_message="This email doesnt exist"
            return Response(error_message, status=400)


@api_view(['POST'])
def resest_password(request):
    if request.method=='POST':
        email=request.data.get('verified_email')
        print('email=',email)
        otp=request.data.get('otp')
        try:
            user=User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=400)
            
        #verify otp
        try:          
            user_otp=Otp.objects.get(user=user)
            print('otp',user_otp)
            print(otp)
            if str(user_otp)==str(otp):
                password=request.data.get('password')
                print('password')
                user.set_password(password)
                user.save()
                return Response({'success': 'Password changed successfully'}, status=200)
            else:
                return Response({'error': 'Please enter a valid OTP'}, status=400)
        except Otp.DoesNotExist:
            return Response({'error': 'OTP not found'}, status=400)
        

def get_nearby_police_station(request):     
    latitude = request.GET.get('latitude')
    longitude = request.GET.get('longitude')
    api_key = 'AIzaSyBcTjbgvSoIXc7Qb4F-TIFx_AM70rrhVD0'
    url = f'https://maps.googleapis.com/maps/api/place/nearbysearch/json?keyword=police+station&location={latitude},{longitude}&radius=10500&type=police+station&key={api_key}'

    response = requests.get(url)
    data = response.json()

    return JsonResponse(data)

            

       






    
    



    