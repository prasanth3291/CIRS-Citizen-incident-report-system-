from django.shortcuts import redirect, get_object_or_404, render
from rest_framework.views import APIView, Response, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.decorators import login_required
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from dj_rest_auth.registration.views import SocialLoginView
from socialauth.adpaters import CustomGoogleOAuth2Adapter, CustomOAuth2Client

# Email Verification
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator

# Activation
from django.contrib.auth import get_user_model,login
import random
from django.http import JsonResponse

# For Nearest Police Station
import requests

# Profile
from .models import User, Otp, Profile
from .serializers import UserSerializer, ProfileSerializer
from .forms import ProfileForm
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
import os
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import AllowAny
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token
from django.contrib.auth import load_backend
import time


class GoogleLogin(SocialLoginView): # if you want to use Authorization Code Grant, use this
    adapter_class = GoogleOAuth2Adapter
    callback_url = 'http://localhost:3000'   


class customeGoogleLogin(GoogleLogin):
    adapter_class =CustomGoogleOAuth2Adapter  
    client_class=CustomOAuth2Client    

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims
        token['first_name'] = user.first_name
        token['email']=user.email   
        token['username']=user.username    
        # ...
        return token
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer    

class loginView(APIView):
    def post(self,request):
        print('is it ok')
        username = request.data['username']
        password = request.data['password']      
        user_type = request.data['user_type']  
        if user_type=='staff':
            user_type=['state_admin','station_admin']
        else:
            user_type=[user_type]
        user=User.objects.filter(username=username,user_type__in=user_type).first()
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
            print('ivide varuu')
            obj=MyTokenObtainPairSerializer()
            token=obj.get_token(user)                   
            access_token = str(token.access_token)
            refresh_token  =str(token)
            return Response({
                'access': access_token,
                'refresh': refresh_token,
                'user': {
                'id': user.id,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
            }
            }, status=status.HTTP_200_OK)
        else:
            raise AuthenticationFailed('Invalid credentials')       


class RegisterView(APIView):
    def post(self,request):      
        print('inside register')
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
    if created:        
        try:
            # Here need to provide two conditions 
            # 1). If instance is created by Google then No email verification else provide email verification
            if instance.auth_provider == 'google':
                instance.is_active = True
                instance.save()
            else:
            # if the instance created manually
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
        otp=request.data.get('otp')
        try:
            user=User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=400)
            
        #verify otp
        try:          
            user_otp=Otp.objects.get(user=user)
            if str(user_otp)==str(otp):
                password=request.data.get('password')
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


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile_detail(request):
    profile = get_object_or_404(Profile, user=request.user)
    serializer = ProfileSerializer(profile)
    return Response(serializer.data)
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def profile_update(request):
    profile = get_object_or_404(Profile, user=request.user)

    # Extract user-related data
    user_data = {
        'first_name': request.data.get('first_name'),
        'last_name': request.data.get('last_name')
    }

    profile_data = request.data.copy()
    profile_data.pop('first_name', None)
    profile_data.pop('last_name', None)

    # Update Profile serializer
    serializer = ProfileSerializer(profile, data=profile_data, partial=True)
    
    if serializer.is_valid():
        # Save the profile changes
        serializer.save()

        # Update the User instance
        user = profile.user
        user.first_name = user_data.get('first_name', user.first_name)
        user.last_name = user_data.get('last_name', user.last_name)
        user.save()

        return Response(serializer.data)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)    



def refresh_google_token(request):
    # Assuming the refresh token is sent in the body of a POST request
    refresh_token = request.POST.get('refresh_token')

    if not refresh_token:
        return JsonResponse({'error': 'Refresh token is required'}, status=400)

    try:
        # Load credentials from the refresh token
        credentials = Credentials(None, refresh_token=refresh_token, token_uri='https://oauth2.googleapis.com/token',
                                  client_id=os.environ.get('GOOGLE_CLIENT_ID'),
                                  client_secret=os.environ.get('GOOGLE_CLIENT_SECRET'))

        # Refresh the access token
        request = Request()
        credentials.refresh(request)

        # Return the new access token and refresh token
        return JsonResponse({
            'access_token': credentials.token,
            'refresh_token': credentials.refresh_token,
            'expires_in': credentials.expiry
        }, status=200)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    
@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def google_login(request):
    code = request.data.get('code')

    if not code:
        return JsonResponse({'error': 'No authorization code provided'}, status=400)

    token_url = 'https://oauth2.googleapis.com/token'
    data = {
        'code': code,
        'client_id': settings.GOOGLE_CLIENT_ID,
        'client_secret': settings.CLIENT_SECRET,
        'redirect_uri': 'http://localhost:3000',  # Ensure this matches exactly with the frontend
        'grant_type': 'authorization_code'
    }

    token_response = requests.post(token_url, data=data)
    token_data = token_response.json()

    if token_response.status_code != 200:
        return JsonResponse(token_data, status=token_response.status_code)

    id_token_str = token_data.get('id_token')
    if not id_token_str:
        return JsonResponse({'error': 'No ID token in response'}, status=400)

    try:
        id_info = id_token.verify_oauth2_token(id_token_str, google_requests.Request(),
                                               settings.GOOGLE_CLIENT_ID)
        if id_info['aud'] != settings.GOOGLE_CLIENT_ID:
            return JsonResponse({'error': 'Invalid audience'}, status=400)

        if id_info.get('exp') < time.time():
            return JsonResponse({'error': 'Token has expired'}, status=400)

        email = id_info['email']
        first_name = id_info.get('given_name', '')  # Get the user's first name from Google info
        last_name = id_info.get('family_name', '')  # Get the user's last name from Google info

        User = get_user_model()
        user, created = User.objects.get_or_create(email=email, defaults={'username': email, 'first_name': first_name, 'last_name': last_name, 'auth_provider': 'google'})
        
        # Update the user's first and last name if the user already exists
        if not created:
            user.first_name = first_name
            user.last_name = last_name
            user.auth_provider = 'google'
            user.save()
      
        # Specify the backend explicitly
        backend = settings.AUTHENTICATION_BACKENDS[0]  # Use the first backend or specify the one you need
        backend_instance = load_backend(backend)
        user.backend = f'{backend_instance.__module__}.{backend_instance.__class__.__name__}'
        
        # Issue Django JWT tokens
        refresh = RefreshToken.for_user(user)
        access = refresh.access_token
        login(request, user, backend=user.backend)

        return Response({
            'access': str(access),
            'refresh': str(refresh),
            'user': {
                'id': user.id,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
            }
        })
    except ValueError as e:
        print("Invalid token:", e)
        return JsonResponse({'error': 'Invalid token'}, status=400)



    
    



    