import boto3, os

s3 = boto3.resource("s3")
s3_client = boto3.client("s3",
            aws_access_key_id = os.environ.get("aws_access_key_id"),
            aws_secret_access_key = os.environ.get("aws_secret_access_key")
            )

def Upload_file(file, file_name:str) -> None:
    try:    
        s3_client.upload_fileobj(file, "picboard-bucket", file_name)
    except Exception as error:
        print("Failed to upload file: ", error)

def Delete_file(filename: str) -> None:
    try:
        s3_client.delete_object(Bucket="picboard-bucket", Key=filename)
    except Exception as error:
        print("Failed to delete file: ", error)