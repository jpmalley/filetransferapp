$(document).ready(function () {
    $('#uploadButton').on('click', function (e) {
        e.preventDefault;
        var file = $('#id_file').prop('files')[0];
        var expiresIn = $('#id_expiration').val();
        getSignedRequest(file, expiresIn);
    })
});

function getSignedRequest(file, expiresIn){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", presignUploadUrl+"?file_name="+file.name+"&file_type="+file.type);
    xhr.onreadystatechange = function(){
        if(xhr.readyState === 4){
            if(xhr.status === 200){
                var response = JSON.parse(xhr.responseText);
                uploadFile(file, response, expiresIn);
            }
            else{
                console.log("Could not get signed URL.");
            }
        }
    };
    xhr.send();
};

function uploadFile(file, presignedData, expiresIn){
    var xhr = new XMLHttpRequest();
    var objectKey = presignedData.fields["key"];
    var fileId = presignedData.id;
    var postData = new FormData();
    xhr.open("POST", presignedData.url);
    for(key in presignedData.fields){
        postData.append(key, presignedData.fields[key]);
    }
    postData.append('file', file);
    xhr.onreadystatechange = function() {
        if(xhr.readyState === 4){
            if(xhr.status === 200 || xhr.status === 204){
                getDownloadUrl(fileId, objectKey, expiresIn);
            }
            else{
                console.log("Could not upload file.");
            }
        }
    };
    xhr.send(postData);
};

function getDownloadUrl(fileId, object, expiresIn){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", presignDownloadUrl+"?file_id="+fileId+"&object="+object+"&expires_in="+expiresIn);
    xhr.onreadystatechange = function(){
        if(xhr.readyState === 4){
            if(xhr.status === 200){
                var response = JSON.parse(xhr.responseText);
                var redirect = "/success/?download_url="+encodeURIComponent(response.url);
                $(location).attr("href", redirect);
            }
            else{
                console.log("Could not get signed download URL.");
            }
        }
    };
    xhr.send();
};


$(document).ready(function () {
    $('#copyButton').on('click', function (e) {
        e.preventDefault;
        copyToClipboard();
    })
});

function copyToClipboard() {
    var copyText = $('#downloadUrl').val();
    // Select the text field
    console.log(copyText)
    
  
     // Copy the text inside the text field
    navigator.clipboard.writeText(copyText);
  
  }


// function getSignedRequest(file) {
//     $.ajax({
//         type: 'GET',
//         url: presignUploadUrl,
//         data: {
//             "file_name": file.name,
//             "file_type": file.type
//         },
//         success: function (response) {
//             console.log(response)
//             uploadFile(file, response)
//         },
//         error: function (response) {
//             // alert the error if any error occured
//             alert(response.error);
//         }
//     })
// }

// function uploadFile(file, presignedData) {
//     var postData = new FormData();
//     for (key in presignedData.fields) {
//         postData.append(key, presignedData.fields[key]);
//     }
//     postData.append('file', file);
//     console.log(postData.type)
    
//     $.ajax({
//         type: 'POST',
//         url: presignedData.url,
//         data: postData,
//         processData: false,
//         contentType: 'multipart/form-data',
//         success: function (response) {
//             console.log(response)
//             console.log("uploaded?")
//         },
//         error: function (response) {
//             // alert the error if any error occured
//             console.log(response);
//         }
//     })
// }