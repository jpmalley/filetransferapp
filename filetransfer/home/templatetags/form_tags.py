from django import template

from ..forms import UploadForm

register = template.Library()

@register.inclusion_tag("forms/upload_form.html")
def upload_form():
    return {"upload_form": UploadForm}