// Show upload form

$(document).ready(function showForm() {
    var tl = gsap.timeline()
    tl
    .set("#uploadFormContainer", {
        className:"-=d-none",
    })
    .from("#uploadHeading", {
        autoAlpha: 0,
        y: 50,
        ease: "power1.inOut",
        duration: .6,
    })
    .from("#uploadForm", {
        autoAlpha: 0,
        y: 50,
        ease: "power1.inOut",
        duration: .6,
    }, "-=.4")
    .from("#description", {
        autoAlpha: 0,
        y: 50,
        ease: "power1.inOut",
        duration: .6,
    }, "-=.4")
});


// Enable button after input

$(document).ready(function() {
    $("#id_file, #id_expiration").on("change", function() {
        let empty = false;
        $("#uploadForm input, #uploadForm select").each(function() {
            empty = $(this).val().length == 0;
        });
        if (empty)
            $("#uploadButton").attr("disabled", "disabled");
        else
            $("#uploadButton").attr("disabled", false);
    });
});

// On upload click

$(document).ready(function () {
    $('#uploadButton').on('click', function (e) {
        e.preventDefault;
        var file = $('#id_file').prop('files')[0];
        var expiresIn = $('#id_expiration').val();
        var tl = gsap.timeline()
        tl
        .set("#uploadForm", {
            className:"d-none",
        })
        .set("#progressBar", {
            className:"-=d-none",
        })
        .from("#progressBar", {
            autoAlpha: 0,
            duration: .6
        })
        getSignedRequest(file, expiresIn);
    })
});


// Functions

function getSignedRequest(file, expiresIn) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", presignUploadUrl+"?file_name="+file.name+"&file_type="+file.type+"&expires_in="+expiresIn);
    xhr.onreadystatechange = function(){
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                uploadFile(file, response, expiresIn);
            } else {
                console.log("Could not get signed URL.");
            }
        }
    };
    xhr.send();
};

function uploadFile(file, presignedData, expiresIn) {
    var xhr = new XMLHttpRequest();
    var objectKey = presignedData.fields["key"];
    var fileId = presignedData.id;
    var postData = new FormData();
    xhr.open("POST", presignedData.url);
    for (key in presignedData.fields) {
        postData.append(key, presignedData.fields[key]);
    }
    postData.append('file', file);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200 || xhr.status === 204) {
                getDownloadUrl(fileId, objectKey, expiresIn);
            } else {
                console.log("Could not upload file.");
            }
        }
    };
    xhr.send(postData);
};

function getDownloadUrl(fileId, object, expiresIn) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", presignDownloadUrl+"?file_id="+fileId+"&object="+object+"&expires_in="+expiresIn);
    xhr.onreadystatechange = function(){
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                console.log(response.url);
                var redirect = "/success/?download_url="+encodeURIComponent(response.url);
                $(location).attr("href", redirect);
            } else {
                console.log("Could not get signed download URL.");
            }
        }
    };
    xhr.send();
};