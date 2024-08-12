import boto3, os

s3 = boto3.resource("s3")
s3_client = boto3.client("s3",
            aws_access_key_id = os.environ.get("aws_access_key_id"),
            aws_secret_access_key = os.environ.get("aws_secret_access_key")
            )

def Upload_file(file: bytes, filename:str) -> None:
    try:    
        s3_client.upload_fileobj(file, "picboard-bucket", filename)
    except Exception as error:
        print("Failed to execute Upload_file: ", error)

def Delete_file(filename: str) -> None:
    try:
        s3_client.delete_object(Bucket="picboard-bucket", Key=filename)
    except Exception as error:
        print("Failed to execute Delete_file: ", error)

def List_all_files() -> list:
    try:
        return s3_client.list_objects(Bucket="picboard-bucket")["Contents"]
    except Exception as error:
        print("Failed to execute List_all_files: ", error)

def Find_files(email: str) -> list:
    try:
        prefix = f"roadbuddy_avatar_{email}"
        return s3_client.list_objects(Bucket="picboard-bucket", Prefix=prefix).get("Contents")
    except Exception as error:
        print("Failed to execute Find_files: ", error)

def Update_file(email: str, file_to_update: bytes, filename_to_update: str) -> None:
    try:
        user_files = Find_files(email)
        if user_files != None:
            for file in user_files:
                Delete_file(file.get("Key"))
        Upload_file(file_to_update, filename_to_update)
    except Exception as error:
        print("Failed to execute Update_file: ", error)

    
if __name__ == "__main__":
    for object in Find_files(6, "test1@mail"):
        Delete_file(object.get("Key"))
    print(Find_files(6, "test1@mail"))
