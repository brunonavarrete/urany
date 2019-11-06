var validate = require("validate.js");
import $ from "jquery";
window.jQuery = $;
window.$ = $;

(function() {
  // These are the constraints used to validate the form
  var notEmpty_msg    = "^Por favor llena este campo";
  var notValid_msg    = "^Ingresa un correo válido";
  var notNumber_msg   = "^Ingresa un teléfono válido";
  var notSelected_msg = "^Selecciona una opción";

  var constraints = {
    fromName: {
        presence: {
            message: notEmpty_msg,
        }
    },
    "message[Teléfono][]": {
        presence: {
            message: notEmpty_msg,
        },
    },
    "message[Extensión][]": {
        presence: {
            message: notEmpty_msg,
        },
    },
    "message[Empresa][]": {
        presence: {
            message: notEmpty_msg,
        },
    },
    "message[Ciudad y Estado][]": {
        presence: {
            message: notEmpty_msg,
        },
    },

    fromEmail: {
        presence: {
            message: notEmpty_msg,
        },
        email: {
            message: notValid_msg,
        }
    }
};

    
    /*
    /////////////////////////////////////////////////
        PARA CADA TECLEO EN LOS CAMPOS DE MAIL
    /////////////////////////////////////////////////
    */
    $('.floating-select').on('change', function(){
        var formGroup = closestParent(this.parentNode, "form-group");
        resetFormGroup(formGroup);

        var id = $(this).attr('id');
        var val = $(this).val(); 
        var cur_val = $('#'+id+'Hidden').val(val);

        var valid = validate.single(cur_val, {
            presence: { message: notSelected_msg }, 
            } 
        );

        try{
            var messages = formGroup.querySelector(".messages");
        }catch(exc){}
        
        if (valid) addError(messages, valid[0]);
    });

    $('input').on('change paste keyup',function(){
        var formGroup = closestParent(this.parentNode, "form-group");
        resetFormGroup(formGroup);

        var input_type = $(this).attr('type');

        if (input_type == 'email') {
            var valid = validate.single($(this).val(), {
                presence: { message: notEmpty_msg }, 
                email: { message: notValid_msg }, 
                }
            );
        }
        if (input_type == 'text') {
            var valid = validate.single($(this).val(), {
                presence: { message: notEmpty_msg }, 
                }
            );
        }

        if (input_type == 'tel') {
            var valid = validate.single($(this).val(), {
                presence: { message: notEmpty_msg }, 
                }
            );
        }

        try{
            var messages = formGroup.querySelector(".messages");
        }catch(exc){
            //
        }
        
        if (!valid) {
            //valid here because var valid returns nothing
            //console.log("valid");
        }else{
            //not valid here because var valid returns something
            addError(messages, valid[0]);
        }
    });


    /*
    /////////////////////////////////////////////////
        PARA CADA SUBMIT DE LOS FORMS
    /////////////////////////////////////////////////
    */
  // Hook up the form so we can prevent it from being posted
    var form = document.querySelector("form.form_calculo");
        form.addEventListener("submit", function(ev) {
            ev.preventDefault();
            handleFormSubmit(this, '.form_calculo');
        });


  function handleFormSubmit(form, formName) {
    // First we gather the values from the form
    var values = validate.collectFormValues(form);
    // then we validate them against the constraints
    var errors = validate(values, constraints);
    // then we update the form to reflect the results
    showErrors(form, errors || {});
    // And if all constraints pass we let the user know
    if (!errors) {
      showSuccess(formName);
  }
}

  // Updates the inputs with the validation errors
  function showErrors(form, errors) {
    // We loop through all the inputs and show the errors for that input
    $.each(form.querySelectorAll("input[name]"), function(input) {
        // Since the errors can be null if no errors were found we need to handle
        // that
        showErrorsForInput(this, errors && errors[this.name]);
  });
}

  // Shows the errors for a specific input
  function showErrorsForInput(input, errors) {
    // This is the root of the input
    var formGroup = closestParent(input.parentNode, "form-group")
      // Find where the error messages will be insert into
      , messages = formGroup.querySelector(".messages");
    // First we remove any old messages and resets the classes
    resetFormGroup(formGroup);
    // If we have errors
    if (errors) {
        // we first mark the group has having errors
        formGroup.classList.add("has-error");
        // then we append all the errors
        $.each(errors, function(error) {
            addError(messages, errors[0]);
        });
    } else {
        // otherwise we simply mark it as success
        formGroup.classList.add("has-success");
    }
}

  // Recusively finds the closest parent that has the specified class
    function closestParent(child, className) {
        if (!child || child == document) {
            return null;
        }
        if (child.classList.contains(className)) {
            return child;
        } else {
            return closestParent(child.parentNode, className);
        }
    }

function resetFormGroup(formGroup) {
    // Remove the success and error classes
    try{
        formGroup.classList.remove("has-error");
        formGroup.classList.remove("has-success");
    }catch(exc){ 
        //nothing to reset 
    }
    try{
        // and remove any old messages
        $.each(formGroup.querySelectorAll(".help-block.error"), function(el) {
            this.remove();
        });
    }catch(exc){ 
        //nothing to remove
    }
}

  // Adds the specified error with the following markup
  // <p class="help-block error">[message]</p>
  function addError(messages, error) {
    var block = document.createElement("p");
    block.classList.add("help-block");
    block.classList.add("error");
    block.innerHTML = error;
    messages.appendChild(block);
}

function showSuccess(formName) {

    $(".form-alert").html('<i class="fa fa-spinner fa-spin fa-2x fa-fw float-right text-white"></i>');
    $(".form-alert").fadeIn();
    var data = $(formName).serialize();

    // Send it to the server
    $.post({
        url: '/',
        dataType: 'json',
        data: data,
        success: function(response) {
            if (response.success) {
                console.log("mensaje enviado");
                $(".form-alert").html("<strong>¡Gracias!</strong> Recibimos tu mensaje.");
                $(".form-alert").removeClass("fadeOut alert-danger alert");
                $(".form-alert").addClass("alert-success fadeIn alert");
                $('#submit-button').attr('disabled', true);

                $(".form-alert").fadeIn();
                setTimeout(function() {
                    $(".form-alert").fadeOut();
                    $(".form-alert").removeClass("fadeOut alert-danger alert alert-success");
                }, 4000);

                // incluir aquí el objetivo de google

            } else {
                console.log(response);
                //alert('An error occurred. Please try again.');
                $(".form-alert").html(
                    "<strong>¡Ocurrió un error!</strong> Inténtalo de nuevo."
                  );
                $(".form-alert").removeClass("fadeOut alert-success alert");
                $(".form-alert").addClass("alert-danger fadeIn alert");
                $(".form-alert").fadeIn();
                setTimeout(function() {
                    $(".form-alert").fadeOut();
                    $(".form-alert").removeClass("fadeOut alert-danger alert alert-success");
                }, 4000);
            }
        }
    });
}
    
})();