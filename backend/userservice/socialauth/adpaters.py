# adapters.py
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.models import SocialAccount
from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client

class CustomGoogleOAuth2Adapter(GoogleOAuth2Adapter):
       
       def crete_new_user(self,data):
            print('i am called') 

       def complete_login(self, request, app, token, response, **kwargs):            
            data = None
            id_token = response.get("id_token")
            if id_token:
                
                data = self._decode_id_token(app, id_token)
                self.crete_new_user(data)
                if self.fetch_userinfo and "picture" not in data:
                    info = self._fetch_user_info(token.token)   
                    picture = info.get("picture")
                    if picture:
                        data["picture"] = picture
            else:
                data = self._fetch_user_info(token.token)
            login = self.get_provider().sociallogin_from_response(request, data)            
            return login

class CustomOAuth2Client(OAuth2Client):
    pass