<?php
header('Content-Type: application/json');

// 1. DADOS DA CONEXÃO AWS (Substitua pelos seus dados do RDS)
$host = "ecoroute-db.c4l0m13gb9vw.us-east-1.rds.amazonaws.com"; // Seu Endpoint
$user = "admin"; // Usuário mestre criado na AWS
$pass = "ecoroute"; // Senha Aws
$dbname = "ecoroute"; // Nome do banco que criamos no Workbench

$conn = new mysqli($host, $user, $pass, $dbname);

// Verifica a conexão
if ($conn->connect_error) {
    echo json_encode([
        "status" => "erro",
        "message" => "Erro de conexão: " . $conn->connect_error
    ]);
    exit;
}

// 2. CAPTURA DOS DADOS (Ajustado para bater com o name="" do seu index.html)
$nome  = $_POST['nome'] ?? '';      // name="nome"
$tel   = $_POST['telefone'] ?? '';  // name="telefone"[cite: 1]
$email = $_POST['email'] ?? '';     // name="email"[cite: 1]
$obs   = $_POST['observacoes'] ?? ''; // Ajustado de 'observacao' para 'observacoes' para bater com o HTML

// Validação básica
if (empty($nome)) {
    echo json_encode([
        "status" => "erro",
        "message" => "O nome da empresa é obrigatório."
    ]);
    exit;
}

// 3. PREPARAÇÃO E EXECUÇÃO
$sql = "INSERT INTO empresas (nome, telefone, email, observacao) VALUES (?, ?, ?, ?)";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode([
        "status" => "erro",
        "message" => "Erro na preparação do SQL: " . $conn->error
    ]);
    exit;
}

$stmt->bind_param("ssss", $nome, $tel, $email, $obs);

if ($stmt->execute()) {
    echo json_encode([
        "status" => "sucesso",
        "message" => "Cadastro realizado com sucesso na nuvem!"
    ]);
} else {
    echo json_encode([
        "status" => "erro",
        "message" => "Erro ao salvar: " . $stmt->error
    ]);
}

$stmt->close();
$conn->close();
?>
