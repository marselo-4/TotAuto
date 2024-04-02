<?php

class database {
    public function conectarBD() {
        // Credenciales
        $server = "localhost";
        $user = "root";
        $pass = "";
        $bd = "daw2";

        $con = new mysqli($server, $user, $pass, $bd);

        // Retorna la base de datos
        if ($con) {
            return $con;
        } else {
            die('No se ha podido conectar a la base de datos');
        }
    }

}


?>