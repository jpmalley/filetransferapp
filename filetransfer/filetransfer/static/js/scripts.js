// Copy button

$(document).ready(function () {
    $('#copyButton').on('click', function (e) {
        e.preventDefault;
        var el = $(this);
        el.html('<i class="fas fa-check" style="color: #ffffff"></i>')
        el.toggleClass('btn-success')
        setTimeout(function () {
            el.html('Copy');
            el.toggleClass('btn-success')
        }, 2000);

        copyToClipboard();
    })
});

function copyToClipboard() {
    var copyText = $('#downloadUrl').val();
    navigator.clipboard.writeText(copyText);
};


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