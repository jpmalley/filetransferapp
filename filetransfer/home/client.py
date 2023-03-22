import boto3
from botocore.exceptions import ClientError
import filetransfer.settings as settings


def s3_get_client():
    return boto3.client(
        service_name="s3",
        aws_access_key_id=settings.AWS_ACCESS_KEY,
        aws_secret_access_key=settings.AWS_SECRET_KEY,
        region_name=settings.AWS_REGION_NAME
    )


def s3_generate_presigned_post(file_path: str, file_type: str):
    s3_client = s3_get_client()

    acl = "private"
    expires_in = 30

    presigned_data = s3_client.generate_presigned_post(
        settings.AWS_BUCKET_NAME,
        file_path,
        Fields={
            "acl": acl,
            "Content-Type": file_type
        },
        Conditions=[
            {"acl": acl},
            {"Content-Type": file_type}
        ],
        ExpiresIn=expires_in,
    )

    return presigned_data


def s3_generate_presigned_url(object_key, expires_in):
    s3_client = s3_get_client()
    try:
        presigned_url = s3_client.generate_presigned_url(
            'get_object',
            Params={
                'Bucket': settings.AWS_BUCKET_NAME,
                'Key': object_key
            },
            ExpiresIn=expires_in)
    except ClientError as e:
        print(e)
        return None
    
    return presigned_url