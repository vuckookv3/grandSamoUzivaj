$(function () {

    // $('#prijave thead tr:eq(1) th').each(function () {
    //     var title = $(this).text();
    //     if (title === 'Status') {
    //         $(this).html('<select id="status_search"><option value="ALL">Sve</option><option value="UNAUTHORIZED">PENDING</option><option value="AUTHORIZED">ODOBRENO</option><option value="WINNER">POBEDNIK</option></select>');
    //     } else {
    //         $(this).html('')
    //     }
    // });
    // serverRender
    var table = $('#prijave').DataTable({
        dom: 'lrtip',
        ordering: false,
    });

    console.log(table);


    $('#status_search').on('change', function () {
        console.log(this.value)
        if(this.value === 'ALL') {
            table.columns().search('').draw();
        } else {
            table.column(6).search(this.value).draw();

        }
    });


    $('td select').on('change', function () {
        var value = this.value;
        var id = this.form.dataset.id;

        $.ajax({
            url: '/admin/api/prijave/' + id + '/status',
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({ status: value }),
            complete: function (xhr, textStatus) {
                var res = xhr.responseJSON;
            }
        })
    });

});