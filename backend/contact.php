<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Collect and sanitize input
    $name = strip_tags(trim($_POST["name"] ?? 'Unknown'));
    $message = strip_tags(trim($_POST["message"] ?? ''));

    // Simulate processing
    $response = [
        "status" => "success",
        "message" => "Thank you, $name. Your message has been received.",
        "timestamp" => date('Y-m-d H:i:s')
    ];

    echo json_encode($response);
} else {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Method not allowed"]);
}
?>
