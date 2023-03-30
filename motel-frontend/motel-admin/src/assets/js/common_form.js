$(document).ready(function () {
    $("#customFile").change(function () {
        if (!checkFileSize(this)) {
            return;
        }
        showImageThumbnail(this)
    });
})
function showImageThumbnail(fileInput) {
    var file = fileInput.files[0];
    var reader = new FileReader();
    reader.onload = function (e) {
        $("#thumbnail").attr("src", e.target.result);
    }
    reader.readAsDataURL(file);
}

function checkFileSize(fileInput) {
    fileSize = fileInput.files[0].size;
    if (fileSize > 5242880) {
        fileInput.setCustomValidity("You must choose an image less than 5MB");
        fileInput.reportValidity();
        return false
    } else {
        fileInput.setCustomValidity("");
        return true;
    }
}