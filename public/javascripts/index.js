$(function () {

    // close alerts
    setTimeout(function () {
        $('.alert').fadeTo(500, 0).slideUp(500, function () {
            $(this).remove();
        });
    }, 3000);

    $('#pictureInput').on('change', function () {
        console.log(this);
        console.log(this.files[0]);
    });

    $('#videoInput').on('change', function () {
        console.log(this);
        console.log(this.files[0].size / 1024 / 1024);
    });

    $('#prijava2').on('submit', function (e) {
        e.preventDefault();
        var picture = $('#pictureInput')[0].files[0];
        var video = $('#videoInput')[0].files[0];
        
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