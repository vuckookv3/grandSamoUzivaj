$(function () {

    // close alerts
    setTimeout(function () {
        $('.alert').fadeTo(500, 0).slideUp(500, function () {
            $(this).remove();
        });
    }, 1000);

    $('#prijave thead tr:eq(1) th').each(function () {
        var title = $(this).text();
        if (title === 'Status') {
            $(this).html('<select id="status_search"><option value="ALL">Sve</option><option value="UNAUTHORIZED">PENDING</option><option value="DENIED">ODBIJENO</option><option value="AUTHORIZED">ODOBRENO</option><option value="WINNER">POBEDNIK</option></select>');
        } else if (title === 'Email') {
            $(this).html('<input id="email_search" placeholder="Email" />');
        } else if (title === 'Kod') {
            $(this).html('<input id="kod_search" placeholder="Kod" />');
        } else {
            $(this).html('');
        }
    });

    // serverRender
    var table = $('#prijave').DataTable({
        dom: 'lrtip',
        ordering: false,
    });


    $('#status_search').on('change', function () {
        if (this.value === 'ALL') {
            table.columns().search('').draw();
        } else {
            table.column(9).search('^' + this.value + '$', true, false).draw();

        }
    });

    $('#email_search').on('keyup', function () {
        table.column(1).search(this.value).draw();
    });

    $('#kod_search').on('keyup', function () {
        table.column(2).search(this.value).draw();
    });


    $('td select').on('change', function () {
        var value = this.value;
        var id = this.form.dataset.id;
        // $(this).closest('td').attr('data-search', value);

        if (value === 'WINNER') {
            $('#winnerModal form').attr('action', '/admin/api/prijave/' + id + '/status/winner');
            $('#winnerModal').modal();
            return null;
        }

        $.ajax({
            url: '/admin/api/prijave/' + id + '/status',
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({ status: value }),
            complete: function (xhr, textStatus) {
                var res = xhr.responseJSON;
            }
        });
    });

    $('.deleteForm').on('submit', function () {
        return confirm('Jeste li sigurni da zelite da obrisete ovu prijavu?');
    });
});