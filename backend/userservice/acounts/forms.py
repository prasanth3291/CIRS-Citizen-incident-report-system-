from django import forms
from .models import Profile

class ProfileForm(forms.ModelForm):
    class Meta:
        model = Profile
        fields = [
            'profile_pic', 
            'address_field_1', 
            'address_field_2', 
            'phone', 
            'pin', 
            'district', 
            'state'
        ]
        widgets = {
            'profile_pic': forms.FileInput(attrs={'accept': 'image/*'}),
        }
