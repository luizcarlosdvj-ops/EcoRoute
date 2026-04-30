<?php
header('Content-Type: application/json');

$host = "localhost";
$user = "root";
$pass = "";
$dbname = "ecoroute";

$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
    echo json_encode([
        "status" => "erro",
        "message" => "Erro de conexão: " . $conn->connect_error
    ]);
    exit;
}

$nome = $_POST['nome'] ?? '';
$tel  = $_POST['telefone'] ?? '';
$email = $_POST['email'] ?? '';
$obs  = $_POST['observacao'] ?? '';

if (empty($nome)) {
    echo json_encode([
        "status" => "erro",
        "message" => "Dados não chegaram"
    ]);
    exit;
}

$sql = "INSERT INTO empresas (nome, telefone, email, observacao) VALUES (?, ?, ?, ?)";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode([
        "status" => "erro",
        "message" => "Erro SQL: " . $conn->error
    ]);
    exit;
}

$stmt->bind_param("ssss", $nome, $tel, $email, $obs);

if ($stmt->execute()) {
    echo json_encode([
        "status" => "sucesso",
        "message" => "Salvou!"
    ]);
} else {
    echo json_encode([
        "status" => "erro",
        "message" => $stmt->error
    ]);
}

$stmt->close();
$conn->close();
