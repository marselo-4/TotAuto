<?php
  if(isset( $_POST['name']))
  $name = $_POST['name'];
  if(isset( $_POST['email']))
  $email = $_POST['email'];
  if(isset( $_POST['telefono']))
  $telefono = $_POST['telefono'];
  if(isset( $_POST['empresa']))
  $empresa = $_POST['empresa'];
  if(isset( $_POST['message']))
  $message = $_POST['message'];
  if(isset( $_POST['subject']))
  $subject = $_POST['subject'];

  $content="De: $name \n Email: $email \n Telefono: $telefono \n Empresa: $empresa \n Mensaje: $message";
  $recipient = "info@totauto";
  $mailheader = "De: $email \r\n";
  mail($recipient, $subject, $content, $mailheader) or die("Error!");
  echo "Email enviado!";
  <script>
  function enviado() {
    Swal.fire({
        title: "Mensaje Enviado!",
        icon: "success"
      });
}
  </script>
?>