<?php
// Llama al modelo y al controlador de cursos
require_once('models/persona_model.php');
require_once('CursosController.php');

class AlumnosController {
    private $model;
    private $con;
    private $curso_controller;

    // Inicializa las variables/clases que se usarán más adelante
    public function __construct() {
        $this->model = new Model();
        $this->curso_controller = new CursosController();
        $this->con = $this->model->getDatabase();
    }

    // Añade los alumnos
    public function addAlumnos() {
        // Selecciona los campos del formulario
        $nombre = $_POST['name'];
        $apellidos = $_POST['apellidos'];
        $dni = $_POST['dni'];
        $curso = $_POST['curso'];

            // Hace el insert
            $sql = 'INSERT INTO datoscurso VALUES ("'. $nombre .'", "'. $apellidos . '", "' . $dni . '","' . $curso . '")';
            $query = mysqli_query($this->con, $sql);

            if ($query) {
                // Si se ha hecho el insert, muestra que se han añadido
                echo 'Usuario Añadido';
            } else {
                // Si no, salta error
                echo 'Error el curso no existe';
                $this->model->mostrarBotonVolver();
            }        
    }

    // Muestra todos los alumnos
    public function mostrarAlumnos() {
        // Hace un query de todos los alumnos
        $sql = 'SELECT * FROM datoscurso';
        $query = mysqli_query($this->con, $sql);

        // Y los pasa al modelo para mostrarlos en la vista
        $this->model->mostrarAlumnos($query);
    }
}
?>