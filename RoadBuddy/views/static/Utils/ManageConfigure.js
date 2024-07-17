
export function PreviewAvatar(){
    const//
        avatarImg = document.querySelector("input#avatar").files[0],
        imagePreview = document.querySelector(".configure-outer .image"),
        fileReader = new FileReader();
    
    fileReader.onload = () =>{
        imagePreview.style.backgroundImage = `url(${fileReader.result})`;
    }
    fileReader.readAsDataURL(avatarImg)
}