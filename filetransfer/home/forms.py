from django import forms

EXP_CHOICES = (
    ("", "Expiration"),
    ("3600", "1 Hour"),
    ("10800", "3 Hours"),
    ("43200", "12 Hours"),
    ("86400", "1 Day"),
    ("604800", "1 Week"),
)

class UploadForm(forms.Form):
    file = forms.FileField(
        required=True,
    )
    expiration = forms.ChoiceField(
        required=True,
        choices=EXP_CHOICES,
    )