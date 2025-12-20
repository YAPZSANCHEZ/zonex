<?php
// Get form data
$fullname  = $_POST['fullname'];
$email     = $_POST['email'];
$password  = $_POST['password'];
$cpassword = $_POST['cpassword'];

// Empty check
if (empty($fullname) || empty($email) || empty($password) || empty($cpassword)) {
    die("All fields are required");
}

// Password match check
if ($password !== $cpassword) {
    die("Passwords do not match");
}

// Hash password
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// DB connection
$conn = new mysqli("localhost", "root", "", "nelson");

if ($conn->connect_error) {
    die("Connection Failed: " . $conn->connect_error);
}

// Insert query
$stmt = $conn->prepare(
    "INSERT INTO data1 (fullname, email, password) VALUES (?, ?, ?)"
);
$stmt->bind_param("sss", $fullname, $email, $hashedPassword);

if ($stmt->execute()) {
    // Redirect to login page
    header("Location: login.html");
    exit();
} else {
    echo "Email already registered";
}

$stmt->close();
$conn->close();
?>
