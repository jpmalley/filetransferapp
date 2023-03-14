from django.shortcuts import render

# Create your views here.
def home(request, resource=None):
    return render(request, "home/home.html", {"name": resource or 'World'})