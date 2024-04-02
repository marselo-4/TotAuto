<?php
//Llamada a la vista y a la bbdd
require_once("views/view.php");
require_once("db/db.php");

class Model {
    private $view;
    private $db;

    public function __construct() {
        $this->view = new view();
        $this->db = new database();
    }

    // Inicializa la base de datos y la retorna
    public function getDatabase() {
        return $this->db->conectarBD();
    }

    // Llama a la vista para mostrar el formulario
    public function mostrarFormulario() {
        $this->view->mostrarFormulario();
    }

    // Muestra los cursos en forma de tabla
    public function mostrarCursos($query) {
        $this->view->mostrarTablaCursos($query);
    }

    // Muestra los alumnos en forma de tabla
    public function mostrarAlumnos($query) {
        $this->view->mostrarTablaAlumnos($query);
    }

    // Muestra un botón para vovler a la pagina principal
    public function mostrarBotonVolver() {
        $this->view->mostrarBotonVolver();
    }

    // Llama a la vista para mostrar que los datos han sido eliminados
    public function mostrarDatosEliminados() {
        $this->view->mostrarDatosEliminados();
    }
}
?>