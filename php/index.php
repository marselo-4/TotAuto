<?php
// Llama a los dos controladores
require_once("controllers/CursosController.php");
require_once("controllers/AlumnosController.php");

// Y crea una variable con su clase
$cursos_controller = new CursosController();
$alumnos_controller = new AlumnosController();

// Si la petición es POST y addCursos

if (isset($_POST['addCursos'])) {
    $cursos_controller->addCursos();

// Si es un GET y showCursos
} elseif (isset($_GET['showCursos'])) {
    $cursos_controller->mostrarCursos();

// Si es un POST y addAlumnos
} elseif (isset($_POST['addAlumnos']))  {
    $alumnos_controller->addAlumnos();

// Si es un GET y showAlumnos
} elseif (isset($_GET['showAlumnos'])) {
    $alumnos_controller->mostrarAlumnos();

// Si es un POST y deleteCurso
} elseif (isset($_POST['deleteCurso'])) {
    $cursos_controller->deleteCurso();

// Si no es ninguno, muestra el formulario
} else {
    $cursos_controller->mostrarFormulario();
}


?>