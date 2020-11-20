$(function () {

    // close alerts
    setTimeout(function () {
        $('.alert').fadeTo(500, 0).slideUp(500, function () {
            $(this).remove();
        });
    }, 7000);

    // open code modal
    $.urlParam = function (name) {
        var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.search);
        return (results !== null) ? results[1] || 0 : false;
    }

    if ($.urlParam('modalUspesno')) {
        var file_c = $.urlParam('file_content')
        gtag('event', 'send_content', { file_type: file_c });
        window.history.replaceState(null, null, window.location.pathname);
        $('#modalUspesno').modal('show');
    }

    if ($.urlParam('gRegistration')) {
        window.history.replaceState(null, null, window.location.pathname);
        gtag('event', 'registration');
        console.log('zz');
    }

    var check = $('#checkBoxPrijava2');
    $('#prijava2').on('submit', function (e) {
        e.preventDefault();
        var picture = $('#pictureInput')[0].files[0];
        var video = $('#videoInput')[0].files[0];

        if (!check.is(':checked')) {
            check[0].setCustomValidity('Neophodno je da štiklirate ovo polje kako bi nastavili dalje.');
            check[0].reportValidity();
            return;
        }

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
        $(this).css('display', 'none');
        $('#loadIndicator').css('display', 'flex');
        gtag_report_conversion();
        this.submit();
        return true;
    });

    check.on('change', function () {
        this.setCustomValidity('');
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
    $('#videoInput').on('change', function () {
        if (this.files && this.files[0]) {
            console.log(this.files[0].name);
            var previewText = $('#previewText');
            var videoPlaceholder = $('#videoPlaceholder');
            previewText.html(this.files[0].name);
            previewText.css("display", "flex");

        }

    });

    $('#fhareIcon').on('click', function () {
        url = `https://www.facebook.com/dialog/share?app_id=3328292687219046&display=popup&href=` + window.location.href + `&redirect_uri=`;
        options = 'toolbar=0,status=0,resizable=1,width=626,height=436';
        window.open(url, 'sharer', options);
    })

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