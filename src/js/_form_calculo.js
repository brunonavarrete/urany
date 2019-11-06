$('#form_calculo').submit(function(ev) {
    // Prevent the form from actually submitting
    ev.preventDefault();

    // Send it to the server
    
    $.post({
        url: '/',
        dataType: 'json',
        data: $(this).serialize(),
        success: function(response) {
            if (response.success) {
                $('#thanks').fadeIn();
                console.log("mensaje enviado alv");
            } else {
                // response.error will be an object containing any validation errors that occurred, indexed by field name
                // e.g. response.error.fromName => ['From Name is required']
                console.log("no se pudo krnal más suerte pa la próxima");
            }
        }
    });
    
});