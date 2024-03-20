SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- Base de datos: `datos`

-- --------------------------------------------------------

-- Estructura de tabla para la tabla `alumnos`

CREATE TABLE `datoscurso` (
  `nombre` varchar(115) NOT NULL,
  `apellido` varchar(115) NOT NULL,
  `dni` varchar(9),
  `curso` int(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

-- Estructura de tabla para la tabla `cursos`

CREATE TABLE `cursos` (
  `nombre` varchar(255) NOT NULL,
  `año` int(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Indices de la tabla `alumnos`

ALTER TABLE `datoscurso`
  ADD KEY `datoscurso_ibfk_1` (`curso`);


-- Indices de la tabla `cursos`

ALTER TABLE `cursos`
  ADD PRIMARY KEY (`nombre`);

-- Filtros para la tabla `alumnos`

ALTER TABLE `datoscurso`
  ADD CONSTRAINT `datoscurso_ibfk_1` FOREIGN KEY (`curso`) REFERENCES `cursos` (`nombre`);
COMMIT;