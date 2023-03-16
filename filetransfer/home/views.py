from django.shortcuts import render
from .forms import UploadForm

# Create your views here.
def home(request, resource=None):
    if request.method == "POST":
        form = UploadForm(request.POST, request.FILES)
        if form.is_valid():
            pass 
    else:
        form = UploadForm()

    context = {}

    return render(request, "home/home.html", context)