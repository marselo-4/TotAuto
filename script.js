function validateForm() {
    var name =  document.getElementById('name').value;
    if (name == "") {
        document.querySelector('.status').innerHTML = "Nombre no puede estar vacio";
        return false;
    }
    var email =  document.getElementById('email').value;
    if (email == "") {
        document.querySelector('.status').innerHTML = "Email no puede estar vacio";
        return false;
    } else {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(!re.test(email)){
            document.querySelector('.status').innerHTML = "Email format invalid";
            return false;
        }
    }
    var tlf =  document.getElementById('tlf').value;
    if (tlf == "") {
        document.querySelector('.status').innerHTML = "Telefono no puede estar vacio";
        return false;
    }
    var subject =  document.getElementById('subject').value;
    if (subject == "") {
        document.querySelector('.status').innerHTML = "Asunto no puede estar vacio";
        return false;
    }
    var message =  document.getElementById('message').value;
    if (message == "") {
        document.querySelector('.status').innerHTML = "Mensaje no puede estar vacio";
        return false;
    }
    document.querySelector('.status').innerHTML = "Enviando...";

  }

    document.getElementById('status').innerHTML = "enviando...";
    formData = {
      'name': $('input[name=name]').val(),
      'email': $('input[name=email]').val(),
      'tlf' : $('input[name=tlf]').val(),
      'empresa': $('input[name=empresa]').val(),
      'subject': $('input[name=subject]').val(),
      'message': $('textarea[name=message]').val()
    };


    $.ajax({
      url: "mail.php",
      type: "POST",
      data: formData,
      success: function (data, textStatus, jqXHR) {

        $('#status').text(data.message);
        if (data.code) //If mail was sent successfully, reset the form.
          $('#contact-form').closest('form').find("input[type=text], textarea").val("");
      },
      error: function (jqXHR, textStatus, errorThrown) {
        $('#status').text(jqXHR);
      }
    });

function submit() {
    Swal.fire({
        title: "Mensaje Enviado!",
        icon: "success"
      });
}

function error() {
    Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Algo ha salido mal!",
      });
}