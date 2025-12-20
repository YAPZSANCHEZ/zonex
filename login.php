<?php
session_start();

if (!isset($_POST['login'])) {
    die("Form not submitted");
}

$email    = $_POST['email'];
$password = $_POST['password'];

$conn = new mysqli("localhost", "root", "", "nelson");
if ($conn->connect_error) {
    die("Database connection failed");
}

$stmt = $conn->prepare("SELECT id, fullname, email, password FROM data1 WHERE email=?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
        $row = $result->fetch_assoc();

        if (password_verify($password, $row['password'])) {

                $_SESSION['user_id'] = $row['id'];

                // prefer fullname if available
                $fullname = !empty($row['fullname']) ? $row['fullname'] : null;

                // create username fallback from email (before @)
                $username = explode('@', $row['email'])[0];

                // store in session
                if ($fullname) {
                        $_SESSION['fullname'] = $fullname;
                }
                $_SESSION['username'] = $username;

                // Emit a small page that stores the user in localStorage (so the existing index UI can read it)
                $safeEmail = htmlspecialchars($row['email'], ENT_QUOTES, 'UTF-8');
                $safeUsername = htmlspecialchars($username, ENT_QUOTES, 'UTF-8');
                $safeFullname = $fullname ? htmlspecialchars($fullname, ENT_QUOTES, 'UTF-8') : '';

                echo "<!doctype html><html><head><meta charset=\"utf-8\"><title>Logging in...</title></head><body>
                <script>
                    try {
                        var user = { email: '". $safeEmail ."', username: '". $safeUsername ."', fullname: '". $safeFullname ."' };
                        localStorage.setItem('loggedInUser', JSON.stringify(user));
                    } catch(e) {}
                    window.location.href = 'index.html';
                </script>
                </body></html>";
                exit();

    } else {
                echo "<script>alert('❌ Invalid password'); history.back();</script>";
    }
} else {
    echo "<script>alert('❌ Email not registered'); history.back();</script>";
}

$stmt->close();
$conn->close();
?>
