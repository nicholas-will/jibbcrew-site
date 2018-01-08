<?php

require('config.php');

class loginRouter
{
    
    var $dbh;
    
    function runRoute($route)
    {
        
        try
        {
            //PDO
            $this->dbh = new PDO("mysql:host=".CONFIG::SERVER.";dbname=".CONFIG::DB_NAME, CONFIG::DB_USER, CONFIG::DB_PASS);
        }
        catch(PDOException $e)
        {
            echo $e->getMessage();
        }
        
        switch($route)
        {
                
            case 'create-user' :
                $this->createUser();
                break;
                
            case 'login' :
                $this->login();
                break;
        }
        
         //close connection
        $this->dbh = null;
    }
    
    private function createUser()
    {
        
        $fullname = $_POST['fullname'];
        $email = $_POST['email'];
        $password = $_POST['password'];
        $type = 'user';
        
        $hash = password_hash($password, PASSWORD_DEFAULT);

        $query = $this->dbh->prepare("INSERT INTO users (name, email, password, type) VALUES (:name, :email, :password, :type) ");
        $query->bindParam(':name', $fullname);
        $query->bindParam(':email', $email);
        $query->bindParam(':password', $hash);
        $query->bindParam(':type', $type);
        
        if($query->execute())
        {
            
            $data = array(
                'resp' => true,
                'message' => "user type: ".$type." added."
            );
        }
        else
        {
            
            $data = array(
                'resp' => false,
                'message' => "failed to add user."
            );
        }
        
        header ("Content-type: application/json");
        echo json_encode($data);
    }
    
    private function login()
    {

        $email = $_POST['email'];
        $password = $_POST['password'];

        $query = $this->dbh->prepare("SELECT * FROM users WHERE email = :email AND active = 1");
        $query->bindParam(':email', $email);
        $query->execute();

        $query->setFetchMode(PDO::FETCH_ASSOC);

        $hash = $query->fetch();

        //if ($hash['password'] == md5($password)) 
        if(password_verify($password, $hash['password']))
        {

            $this->_sec_session_start($email);
            
            $_SESSION['user_name'] = $hash['name'];
            
            header("Location: manager/dashboard.html");
        } 
        else 
        {	
            
            header("Location: /#login");
            
//            $data = array(
//                'resp' => false,
//                'message' => "failed to login."
//            );
            
//            header ("Content-type: application/json");
//            echo json_encode($data);
        } 
    }
    
    private function _sec_session_start($username) 
    {

        $cookie_name = 'user_id'; // Set a custom session name

        //$secure = true; // Set to true if using https.

        //$httponly = true; // This stops javascript being able to access the session id. 

        //ini_set('session.use_only_cookies', 1); // Forces sessions to only use cookies. 

        //$cookieParams = session_get_cookie_params(); // Gets current cookies params.
        $time = 9999999;

        //session_set_cookie_params($time);

        //session_name($session_name); // Sets the session name to the one set above.

        session_start(); // Start the php session

        $_SESSION['user_id'] = $username;

        //session_regenerate_id(true); // regenerated the session, delete the old one.

        //setcookie('USER',$username, $time);

        // Reset the expiration time upon page load
        //if (!isset($_COOKIE[$session_name]))

        setcookie($cookie_name, md5($username . "!23J7i8b"), time() + $time, "/"); //$_COOKIE[$session_name]
    }
}

$LoginRouter = new loginRouter();

$LoginRouter->runRoute($_REQUEST['route']);

?>