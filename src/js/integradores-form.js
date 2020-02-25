$('.multiple-contact-forms').submit(function(ev) {
    // Prevent the form from actually submitting
    ev.preventDefault();

    $('.form-loader').css('display','block');
    //Send it to the server
    $.post({
        url: '/',
        dataType: 'json',
        data: $(this).serialize(),
        success: function(response) {
            if (response.success) {
                ga("send", {
                    hitType: "pageview",
                    page: "/mapa-formulario-integradores",
                    title: "Mapa Formulario Integradores"
                });

                $('.form-loader-message').html('Ya recibimos tu información!');
                $('.form-loader-message').addClass('bg-success');
                $('.integrador-contactData').removeClass('d-none');
            } else {
                $('.form-loader-message').html('Ocurrió un error, intenta de nuevo.');
                $('.form-loader-message').addClass('bg-danger');
            }
            $('.form-loader').css('display','none');
            setTimeout(function(){
                $('.form-loader-message').removeClass('bg-success');
                $('.form-loader-message').removeClass('bg-danger');
                $('.form-loader-message').html('');

            },4000);
        }
    });
});