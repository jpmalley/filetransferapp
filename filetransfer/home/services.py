from django.conf import settings
from django.db import transaction
from django.utils import timezone

from .models import File
from .client import s3_generate_presigned_post, s3_generate_presigned_url
from .utils import file_generate_name, file_generate_upload_path

import mimetypes


class FileDirectUploadService:
    @transaction.atomic
    def start(self, file_name, file_type, expires_in, *args, **kwargs):
        file = File(
            original_file_name=file_name,
            file_name=file_generate_name(file_name),
            file_type=file_type,
            file=None
        )
        file.full_clean()
        file.save()

        upload_path = file_generate_upload_path(file, file.file_name)

        """
        We are doing this in order to have an associated file for the field.
        """
        file.file = file.file.field.attr_class(file, file.file.field, upload_path)
        file.save()

        presigned_data = {}

        presigned_data = s3_generate_presigned_post(
            file_path = upload_path, 
            file_type = file.file_type,
            expires_in = expires_in
        )

        return {"id": file.id, **presigned_data}

    @transaction.atomic
    def finish(self, file: File, object_key, expires_in) -> File:
        file.upload_finished_at = timezone.now()
        presigned_url = s3_generate_presigned_url(object_key, expires_in)
        file.full_clean()
        file.save()

        return {"url": presigned_url}
    
class FileStandardUploadService:
    def __init__(self, file_obj):
        self.file_obj = file_obj

    def _infer_file_name_and_type(self, file_name: str = "", file_type: str = ""):
        if not file_name:
            file_name = self.file_obj.name

        if not file_type:
            guessed_file_type, encoding = mimetypes.guess_type(file_name)

            if guessed_file_type is None:
                file_type = ""
            else:
                file_type = guessed_file_type

        return file_name, file_type

    @transaction.atomic
    def create(self, file_name: str = "", file_type: str = "") -> File:
        file_name, file_type = self._infer_file_name_and_type(file_name, file_type)

        obj = File(
            file=self.file_obj,
            original_file_name=file_name,
            file_name=file_generate_name(file_name),
            file_type=file_type,
            upload_finished_at=timezone.now()
        )

        obj.full_clean()
        obj.save()

        return obj

    @transaction.atomic
    def update(self, file: File, file_name: str = "", file_type: str = "") -> File:
        file_name, file_type = self._infer_file_name_and_type(file_name, file_type)

        file.file = self.file_obj
        file.original_file_name = file_name
        file.file_name = file_generate_name(file_name)
        file.file_type = file_type
        file.upload_finished_at = timezone.now()

        file.full_clean()
        file.save()

        return file