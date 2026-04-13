<?php
// ========================================
// CONFIGURACIÓN
// ========================================
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Configuración de base de datos
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "japo_boulder";

// ========================================
// CONEXIÓN A BASE DE DATOS
// ========================================
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    die(json_encode([
        'success' => false, 
        'message' => 'Error de conexión a la base de datos'
    ]));
}

// Configurar charset
$conn->set_charset("utf8mb4");

// ========================================
// PROCESAR DATOS
// ========================================
$data = json_decode(file_get_contents('php://input'), true);

// Validar datos requeridos
if (empty($data['nombre']) || empty($data['email']) || empty($data['telefono']) || empty($data['servicio'])) {
    echo json_encode([
        'success' => false,
        'message' => 'Todos los campos obligatorios deben estar completos'
    ]);
    exit;
}

// Sanitizar datos
$nombre = $conn->real_escape_string(trim($data['nombre']));
$email = $conn->real_escape_string(trim($data['email']));
$telefono = $conn->real_escape_string(trim($data['telefono']));
$servicio = $conn->real_escape_string(trim($data['servicio']));
$mensaje = isset($data['mensaje']) ? $conn->real_escape_string(trim($data['mensaje'])) : '';

// Validar email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode([
        'success' => false,
        'message' => 'Email inválido'
    ]);
    exit;
}

// ========================================
// INSERTAR EN BASE DE DATOS
// ========================================
$sql = "INSERT INTO contactos (nombre, email, telefono, servicio, mensaje) 
        VALUES (?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);
$stmt->bind_param("sssss", $nombre, $email, $telefono, $servicio, $mensaje);

if ($stmt->execute()) {
    // Éxito
    echo json_encode([
        'success' => true, 
        'message' => 'Reserva guardada exitosamente',
        'id' => $stmt->insert_id
    ]);
    
    // Opcional: Enviar email de confirmación
    // mail($email, "Confirmación de Reserva - Japo Boulder", "Gracias por tu reserva...");
    
} else {
    // Error
    echo json_encode([
        'success' => false, 
        'message' => 'Error al guardar: ' . $conn->error
    ]);
}

// ========================================
// CERRAR CONEXIONES
// ========================================
$stmt->close();
$conn->close();
?>
