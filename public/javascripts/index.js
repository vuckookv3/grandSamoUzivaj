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

     
        if (!picture && !video) {
            alert('Morate izabrati file');
            return;
        }
     
        if(!$('#checkBoxPrijava2')[0].checked) {
            alert('Prihvatite pravila privatnosti');
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
            alert('Veličina fajlova je veća od dozvoljenog limita (200MB). Postavite manji fajl.');
            return;
        }

        this.submit();
        return true;
    });
});

$('.hamburger').on('click', function () {
    $("#navbarBox").toggleClass("closed");
    $("#navbarBackground").toggleClass("closed-nav_back");
    $("#navbarWrapper").toggleClass("navbar_box_open_mobile");
    document.body.classList.toggle('lock-scroll');
    
});

$('#navbarBackground').on('click', function() {
    $("#navbarBox").toggleClass("closed");
    $("#navbarBackground").toggleClass("closed-nav_back");
    $("#navbarWrapper").toggleClass("navbar_box_open_mobile");
    document.body.classList.toggle('lock-scroll');

});



// $('#pictureInput').on('change', function(){
//     if (this.files && this.files[0]) {
//         var reader = new FileReader();
//         var previewImg = $('#previewImage')
//         reader.onload = function(e) {
//           previewImg.attr('src', e.target.result);
//         }
//         reader.readAsDataURL(this.files[0]);

//         previewImg.addClass('loaded_img')
//       }

// });

$('#videoInput').on('change', function(e){
    if (this.files && this.files[0]) {
        var reader = new FileReader();
        var previewVid = $('#videoPreview')
        var placeholderVid = $('#videoPlaceholder')
        var videoSource = $('#videoSource')

        reader.onload = function(e) {
            videoSource.attr('src', e.target.result);
        }
        reader.readAsDataURL(this.files[0]);

        //css things
        placeholderVid.css("display", "none");
        previewVid.css("height", "100%");
        previewVid.css("width", "100%");
        previewVid.css("display", "block");
      }

});


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