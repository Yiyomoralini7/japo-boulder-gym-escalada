-- ========================================
-- BASE DE DATOS JAPO BOULDER
-- ========================================

CREATE DATABASE IF NOT EXISTS japo_boulder;
USE japo_boulder;

-- Tabla de clientes/usuarios
CREATE TABLE clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de reservas
CREATE TABLE reservas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT,
    servicio ENUM('1vez', '2veces', 'libreuso', 'consulta') NOT NULL,
    mensaje TEXT,
    estado ENUM('pendiente', 'confirmada', 'cancelada') DEFAULT 'pendiente',
    fecha_reserva TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE,
    INDEX idx_estado (estado),
    INDEX idx_fecha (fecha_reserva)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de pagos
CREATE TABLE pagos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reserva_id INT,
    monto DECIMAL(10, 2) NOT NULL,
    metodo_pago VARCHAR(50),
    estado ENUM('pendiente', 'completado', 'rechazado') DEFAULT 'pendiente',
    fecha_pago TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    comprobante VARCHAR(255),
    FOREIGN KEY (reserva_id) REFERENCES reservas(id) ON DELETE CASCADE,
    INDEX idx_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de contactos (para el formulario)
CREATE TABLE contactos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    servicio VARCHAR(50),
    mensaje TEXT,
    leido BOOLEAN DEFAULT FALSE,
    fecha_contacto TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_leido (leido),
    INDEX idx_fecha (fecha_contacto)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de horarios
CREATE TABLE horarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    dia_semana ENUM('Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo') NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    cupos_disponibles INT DEFAULT 10,
    activo BOOLEAN DEFAULT TRUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar datos de ejemplo
INSERT INTO contactos (nombre, email, telefono, servicio, mensaje) VALUES
('Juan Pérez', 'juan@example.com', '+56912345678', '2veces', 'Quiero empezar a escalar'),
('María González', 'maria@example.com', '+56987654321', '1vez', 'Consulta sobre clases para niños');

-- Insertar horarios de ejemplo
INSERT INTO horarios (dia_semana, hora_inicio, hora_fin, cupos_disponibles) VALUES
('Lunes', '15:00:00', '22:00:00', 10),
('Martes', '15:00:00', '22:00:00', 10),
('Miércoles', '15:00:00', '22:00:00', 10),
('Jueves', '15:00:00', '22:00:00', 10),
('Viernes', '15:00:00', '22:00:00', 10),
('Sábado', '10:00:00', '20:00:00', 15);

-- Vista para reportes de reservas
CREATE VIEW vista_reservas AS
SELECT 
    r.id,
    c.nombre,
    c.email,
    c.telefono,
    r.servicio,
    CASE 
        WHEN r.servicio = '1vez' THEN 30000
        WHEN r.servicio = '2veces' THEN 48000
        ELSE 0
    END AS monto,
    r.estado,
    r.fecha_reserva
FROM reservas r
JOIN clientes c ON r.cliente_id = c.id;

-- Vista para contactos no leídos
CREATE VIEW vista_contactos_pendientes AS
SELECT 
    id,
    nombre,
    email,
    telefono,
    servicio,
    fecha_contacto
FROM contactos
WHERE leido = FALSE
ORDER BY fecha_contacto DESC;

-- Procedimiento almacenado para crear reserva
DELIMITER //
CREATE PROCEDURE crear_reserva(
    IN p_nombre VARCHAR(100),
    IN p_email VARCHAR(100),
    IN p_telefono VARCHAR(20),
    IN p_servicio VARCHAR(50),
    IN p_mensaje TEXT
)
BEGIN
    DECLARE v_cliente_id INT;
    
    -- Insertar o obtener cliente
    INSERT INTO clientes (nombre, email, telefono)
    VALUES (p_nombre, p_email, p_telefono)
    ON DUPLICATE KEY UPDATE
        nombre = p_nombre,
        telefono = p_telefono;
    
    SET v_cliente_id = LAST_INSERT_ID();
    
    -- Crear reserva
    INSERT INTO reservas (cliente_id, servicio, mensaje)
    VALUES (v_cliente_id, p_servicio, p_mensaje);
    
    -- Registrar en contactos
    INSERT INTO contactos (nombre, email, telefono, servicio, mensaje)
    VALUES (p_nombre, p_email, p_telefono, p_servicio, p_mensaje);
    
    SELECT 'Reserva creada exitosamente' AS resultado;
END //
DELIMITER ;
