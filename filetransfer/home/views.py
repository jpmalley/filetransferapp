from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse

from .models import File
from .forms import UploadForm
from .services import FileDirectUploadService

# import urllib.parse


def home(request):
    form = UploadForm()
    context = {}
    context["form"] = form

    return render(request, "home/home.html", context)


def success(request):
    encoded_url = request.GET.get("download_url")
    # download_url = urllib.parse.unquote(encoded_url)
    context = {}
    context["download_url"] = encoded_url
    
    return render(request, "home/success.html", context)


def presignUpload(request):
    file_name = request.GET.get("file_name")
    file_type = request.GET.get("file_type")
    expires_in = request.GET.get("expires_in")
    service = FileDirectUploadService
    presigned_data = service.start(service, file_name=file_name, file_type=file_type, expires_in=expires_in)
    response = presigned_data

    return JsonResponse(response)


def presignDownload(request):
    file_id = request.GET.get("file_id")
    object_key = request.GET.get("object")
    expires_in = request.GET.get("expires_in")
    file = get_object_or_404(File, id=file_id)
    service = FileDirectUploadService
    presigned_url = service.finish(service, file, object_key, expires_in)
    response = presigned_url

    return JsonResponse(response)