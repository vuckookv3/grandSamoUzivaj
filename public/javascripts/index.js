$(function () {

    // close alerts
    setTimeout(function () {
        $('.alert').fadeTo(500, 0).slideUp(500, function () {
            $(this).remove();
        });
    }, 3000);

    $('#prijava2').on('submit', function (e) {
        e.preventDefault();
        var picture = $('#pictureInput')[0].files[0];
        var video = $('#videoInput')[0].files[0];

        var customAlert = $('#customAlert');

        if (!picture && !video) {
            customAlert.toggleClass('custom_alert_hide');
            customAlert.css('opacity', '1');
            customAlert.html('Morate izabrati file');
            setTimeout(function () {
                customAlert.fadeTo(500, 0, function () {
                    customAlert.toggleClass('custom_alert_hide');
                });
            }, 3000);
            return;
        }

        var totalMb = 0;

        if (picture) {
            totalMb += picture.size;
        }

        if (video) {
            totalMb += video.size;
        }

        if (totalMb > 200 * 1024 * 1024) {
            customAlert.toggleClass('custom_alert_hide');
            customAlert.css('opacity', '1');
            customAlert.html('Veličina fajlova je veća od dozvoljenog limita (200MB). Postavite manji fajl');
            setTimeout(function () {
                customAlert.fadeTo(500, 0, function () {
                    customAlert.toggleClass('custom_alert_hide');
                });
            }, 3000);

            return;
        }
        // HERE
        $(this).css('display', 'none');
        $('#loadIndicator').css('display', 'flex');
        this.submit();
        return true;
    });


    $('.hamburger').on('click', function () {
        $("#navbarBox").toggleClass("closed");
        $("#navbarBackground").toggleClass("closed-nav_back");
        $("#navbarWrapper").toggleClass("navbar_box_open_mobile");
        document.body.classList.toggle('lock-scroll');
    
    })
    $('#navbarBackground').on('click', function () {
        $("#navbarBox").toggleClass("closed");
        $("#navbarBackground").toggleClass("closed-nav_back");
        $("#navbarWrapper").toggleClass("navbar_box_open_mobile");
        document.body.classList.toggle('lock-scroll');
    
    });
    
    
    $('#pictureInput').on('change', function () {
        if (this.files && this.files[0]) {
            var reader = new FileReader();
            var previewImg = $('#previewImage')
            reader.onload = function (e) {
                previewImg.attr('src', e.target.result);
            }
            reader.readAsDataURL(this.files[0]);
    
            previewImg.addClass('loaded_img')
        }
    
    });

});


// $('#videoInput').on('change', function(e){
//     if (this.files && this.files[0]) {
//         var reader = new FileReader();
//         var previewVid = $('#videoPreview')
//         var placeholderVid = $('#videoPlaceholder')
//         var videoSource = $('#videoSource')

//         reader.onload = function(e) {
//             videoSource.attr('src', e.target.result);
//         }
//         reader.readAsDataURL(this.files[0]);

//         //css things
//         placeholderVid.css("display", "none");
//         previewVid.css("height", "100%");
//         previewVid.css("width", "100%");
//         previewVid.css("display", "block");
//       }

// });


// $('#prijava2').on('submit', function (e) {
//     e.preventDefault();
//     var picture = $('#pictureInput')[0].files[0];
//     var video = $('#videoInput')[0].files[0];

//     var totalMb = 0;
//     var formdata = new FormData();

//     if (picture) {
//         totalMb += picture.size;
//         formdata.append('picture', picture);
//         // formdata.append('pictureDescription', 'ee');
//     }

//     if (video) {
//         totalMb += video.size;
//         formdata.append('video', video);
//         // formdata.append('videoDescription', 'ee');
//     }

//     if (totalMb > 200 * 1024 * 1024) {
//         alert('Veličina fajlova je veća od dozvoljenog limita (200MB). Postavite manji fajl.');
//         return;
//     }

//     console.log(formdata);
//     $.ajax({
//         xhr: function () {
//             var xhr = new window.XMLHttpRequest();

//             xhr.upload.addEventListener("progress", function (evt) {
//                 if (evt.lengthComputable) {
//                     var percentComplete = evt.loaded / evt.total;
//                     percentComplete = parseInt(percentComplete * 100);
//                     console.log(percentComplete);

//                     if (percentComplete === 100) {

//                     }

//                 }
//             }, false);

//             return xhr;
//         },
//         url: '/prijava/2',
//         type: "POST",
//         data: formdata,
//         processData: false,
//         contentType: false,
//         success: function (result) {
//             console.log(result);
//         }
//     });
// });