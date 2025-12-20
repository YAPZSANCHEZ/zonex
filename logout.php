<?php
session_start();

// Clear PHP session
$_SESSION = array();
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params['path'], $params['domain'],
        $params['secure'], $params['httponly']
    );
}
session_destroy();

// Emit page that clears client-side storage and redirects to login
?>
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="x-ua-compatible" content="ie=edge">
  <title>Logging out</title>
</head>
<body>
  <script>
    try { localStorage.removeItem('loggedInUser'); } catch(e){}
    // small delay then redirect
    setTimeout(function(){ window.location.href = 'login.html'; }, 200);
  </script>
</body>
</html>
