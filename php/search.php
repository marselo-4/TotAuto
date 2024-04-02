<?php
// Llamada al modelo
require_once('models/persona_model.php');

class CursosController {
    private $model;
    private $con;

    public function __construct() {
        $this->model = new Model();
        $this->con = $this->model->getDatabase();
    }


    // Llama al modelo para mostrar el formulario
    public function mostrarFormulario() {
        $this->model->mostrarFormulario();
    }

    // Añade cursos a la base de datos
    public function addCursos() {
        // Selecciona los campos del formulario
        $nombre = $_POST['name'];
        $year = $_POST['year'];

            // Si no existe hace el query del insert
            $sql = 'INSERT INTO cursos VALUES ("'. $nombre .'", '. $year . ')';
            $query = mysqli_query($this->con, $sql);

            // Comprueba si se ha hecho el query
            if ($query) {
                // Si se ha hecho muestra que se han hecho correctamente
                echo 'Curso Añadido';
            } else {
                // Si no, muestra error
                echo 'Error';
                $this->model->mostrarBotonVolver();
            }
    }

    // Selecciona todos los cursos y las manda al modelo para mostrarlas
    
    public function mostrarCursos() {
        // Hace un select de todos los cursos para mostrarlos
        $sql = 'SELECT * FROM cursos';
        $query = mysqli_query($this->con, $sql);

        // Y las pasa al modelo para mostrarlos
        $this->model->mostrarCursos($query);
    }

    // Elimina los cursos y sus alumnos
    public function deleteCurso() {
        // Selecciona los campos del formulario
        $nombre = $_POST['nameDelete'];

            // Si existe, elimina los alumnos
            $sql = 'DELETE FROM datoscurso WHERE curso = "' . $nombre .'"';
            $query1 = mysqli_query($this->con, $sql);

            // Y elimina el curso
            $sql = 'DELETE FROM cursos WHERE nombre = "' . $nombre .'"';
            $query2 = mysqli_query($this->con, $sql);

            // Comprueba si ha salido bien los dos querys
            if ($query1 && $query2) {
                $this->model->mostrarDatosEliminados();
            } else {
                // Si ha salido mal, muestra que ha habido un error.
                echo '<h1>Ha ocurrido un error al borrar / El curso no existe</h1>';
            $this->model->mostrarBotonVolver();
            }
    }
}
?>