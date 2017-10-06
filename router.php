<?php

require('config.php');

class router
{
    
    var $dbh;
    
    public function runRoute($route)
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
                
            case 'get-posts' :
                $this->getPosts();
                break;
                
            case 'get-post' :
                $this->getPost();
                break;
                
            case 'add-post' :
                $this->addPost();
                break;
                
            case 'delete-post' :
                $this->deletePost();
                break;
                
            case 'update-post' :
                $this->updatePost();
                break;
                
            case 'get-posts-to-edit' :
                $this->getPostsToEdit();
                break;
                
            case 'get-post-to-edit' :
                $this->getPostToEdit();
                break;
                
            case 'get-users' :
                $this->getUsers();
                break;
                
            case 'get-user' :
                $this->getUser();
                break;
                
            case 'update-user' :
                $this->updateUser();
                break;
                
            case 'delete-user' :
                $this->deleteUser();
                break;
                
            case 'check-login' :
                $this->checkLogin();
                break;
                
            case 'logout' :
                $this->logout();
                break;
        }
        
         //close connection
        $this->dbh = null;
    }
    
    private function getPosts()
    {

        $start = $_POST['start'];
        $type = $_POST['type'];

        $this->dbh->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);

        //build post
        switch($type)
        {

            case 'video' :
                $query = $this->dbh->prepare("SELECT * FROM `postings` WHERE `type` = 'video' ORDER BY `id` DESC LIMIT :start, 5");
                $query->bindParam(':start', intval(trim($start)));
                break;
                
            case 'gallery' :
                $query = $this->dbh->prepare("SELECT * FROM `postings` WHERE `type` = 'gallery' ORDER BY `id` DESC LIMIT :start, 5");
                $query->bindParam(':start', intval(trim($start)));
                break;
                
            case 'all' :
                $query = $this->dbh->prepare("SELECT * FROM `postings` ORDER BY `id` DESC LIMIT :start, 5");
                $query->bindParam(':start', intval(trim($start)));
                break;
                
            default :
                $query = $this->dbh->prepare("SELECT * FROM `postings` ORDER BY `id` DESC LIMIT :start, 5");
                $query->bindParam(':start', intval(trim($start)));
        }

        $query->execute();

        $query->setFetchMode(PDO::FETCH_ASSOC);

        while($row = $query->fetch()) 
        {

            $post_data[] = array(
                    'id' => $row['id'],
                    'slug' => $row['slug'],
                    'title' => $row['title'],
                    'description' => (!$row['description'] ? "" : $row['description']),
                    'content' => $row['content'],
                    'type' => $row['type'],
                    'timestamp' => $row['timestamp']
            );
        }
        
        header ("Content-type: application/json");
        echo json_encode($post_data);
    }
    
    private function getPost()
    {
        
        $slug = $_POST['slug'];

        //build post
        $query = $this->dbh->prepare("SELECT * FROM `postings` WHERE `slug` = :slug ");
        $query->bindParam(':slug', $slug);
        $query->execute();

        $count = $query->rowCount();

        $query->setFetchMode(PDO::FETCH_ASSOC);

        $row = array();

        if($count != 1)
        {
            
            $post_data = array(
                    'id' => '0',
                    'slug' => 'post-not-found',
                    'title' => '404',
                    'description' => "your content could not be located",
                    'content' => '',
                    'type' => 'error',
                    'timestamp' => date('Y-m-d H:i:s')
            );
        }
        else
        {

            $row = $query->fetch();
            
            $post_data = array(
                    'id' => $row['id'],
                    'slug' => $row['slug'],
                    'title' => $row['title'],
                    'description' => (!$row['description'] ? "" : $row['description']),
                    'content' => $row['content'],
                    'type' => $row['type'],
                    'timestamp' => $row['timestamp']
            );
        }
        
        header ("Content-type: application/json");
        echo json_encode($post_data);
    }
    
    private function addPost()
    {
        
        session_start();

        //$user = $_POST['user'];
        $content = $_POST['content'];
        $description = $_POST['description'];
        $type = $_POST['type'];
        $date = date('Y-m-d H:i:s');
        $title = $_POST['title'];
        $slug = $this->slug($title);

        $name = $this->getUserName($this->dbh);

        $query = $this->dbh->prepare("INSERT INTO postings (name, title, type, content, slug, timestamp, description)
        VALUES (:name, :title, :type, :content, :slug, :date, :description)");

        $query->bindParam(':name', $name);
        $query->bindParam(':title', $title);
        $query->bindParam(':type', $type);
        $query->bindParam(':content', $content);
        $query->bindParam(':slug', $slug);
        $query->bindParam(':date', $date);
        $query->bindParam(':description', $description);

        if($query->execute())
        {
            
            echo "successfully added post.";
        }
        else 
        {
            
            echo "error - something went wrong.";
        }
    }
    
    private function deletePost()
    {
        
        $id = $_POST['id'];

        $this->dbh->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);

        $query = $this->dbh->prepare("DELETE FROM `postings` WHERE `id` = :id LIMIT 1");
        
        $query->bindParam(':id', intval(trim($id)));

        if(!$query->execute())
        {

            echo "error - something went wrong.";  
        }
        else
        {

            echo "successfully deleted post.";
        }
    }
    
    private function updatePost()
    {
        
        $content = $_POST['content'];
        //$type = $_POST['type'];
        $date = date('Y-m-d H:i:s');
        $title = $_POST['title'];
        $description = $_POST['description'];
        //$slug = slug($title);
        //$name = getUserName($dbh);
        $id = $_POST['id'];

        $this->dbh->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);

        $query = $this->dbh->prepare("UPDATE `postings` SET `title` = :title, `content` = :content, `timestamp` = :date, `description` = :description WHERE `id` = :id LIMIT 1");

        //$query->bindParam(':name', $name);
        $query->bindParam(':title', $title);
        $query->bindParam(':description', $description);
        //$query->bindParam(':type', $type);
        $query->bindParam(':content', $content);
        //$query->bindParam(':slug', $slug);
        $query->bindParam(':date', $date);
        $query->bindParam(':id', intval(trim($id)));

        if(!$query->execute())
        {

            echo "error - something went wrong.";  
        }
        else
        {

            echo "successfully updated post.";
        }
    }
    
    private function getPostsToEdit()
    {
        
        $start = $_GET['start'];
        $type = $_GET['type'];

        $this->dbh->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);

        //build post
        switch($type)
        {
                
            case 'all' :
                $query = $this->dbh->prepare("SELECT * FROM `postings` ORDER BY `id` DESC LIMIT :start, 1000");
                $query->bindParam(':start', intval(trim($start)));
                break;
                
            default :
                $query = $this->dbh->prepare("SELECT * FROM `postings` ORDER BY `id` DESC LIMIT :start, 1000");
                $query->bindParam(':start', intval(trim($start)));
        }

        $query->execute();

        $query->setFetchMode(PDO::FETCH_ASSOC);

        while($row = $query->fetch()) 
        {
            
            $post_data[] = array(
                    'id' => $row['id'],
                    'slug' => $row['slug'],
                    'title' => $row['title'],
                    'description' => (!$row['description'] ? "" : $row['description']),
                    'stripped_content' => str_replace(array("<", "</", ">"), " ", $row['content']),
                    'content' => $row['content'],
                    'type' => $row['type'],
                    'timestamp' => $row['timestamp']
            );
        }
        
        header ("Content-type: application/json");
        echo json_encode($post_data);
    }
    
    private function getPostToEdit()
    {
        
        $id = $_POST['id'];

        $this->dbh->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);

        //build post
        $query = $this->dbh->prepare("SELECT * FROM `postings` WHERE `id` = :id LIMIT 1");
        
        $query->bindParam(':id', intval(trim($id)));

        $query->execute();
        
        $query->setFetchMode(PDO::FETCH_ASSOC);
        
        $row = $query->fetch(); 

        echo "<div>";
        echo "<input type='text' class='form-control' id='title' value='".$row['title']."'>";
        echo "<br/>";
        echo "<input type='text' class='form-control' id='description' value='".$row['description']."'>";
        echo "<br/>";
        echo "<textarea class='form-control' rows='14' id='content' name='content'>".$row['content']."</textarea>";
        echo "</div>";
    }
    
    private function getUsers()
    {
        
        $start = $_GET['start'];
        $type = $_GET['type'];

        $this->dbh->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);

        //build post
        switch($type)
        {
                
            case 'all' :
                $query = $this->dbh->prepare("SELECT * FROM `users` ORDER BY `id` LIMIT :start, 1000");
                $query->bindParam(':start', intval(trim($start)));
                break;
                
            default :
                $query = $this->dbh->prepare("SELECT * FROM `users` ORDER BY `id` LIMIT :start, 1000");
                $query->bindParam(':start', intval(trim($start)));
        }

        $query->execute();

        $query->setFetchMode(PDO::FETCH_ASSOC);

        while($row = $query->fetch()) 
        {
            
            $post_data[] = array(
                    'id' => $row['id'],
                    'name' => $row['name'],
                    'email' => $row['email'],
                    'type' => $row['type'],
                    'status' => $row['active']
            );
        }
        
        header ("Content-type: application/json");
        echo json_encode($post_data);
    }
    
    private function getUser()
    {
        
        $id = $_POST['id'];

        $this->dbh->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);

        //get user info
        $query = $this->dbh->prepare("SELECT * FROM `users` WHERE `id` = :id LIMIT 1");
        
        $query->bindParam(':id', intval(trim($id)));

        $query->execute();
        
        $query->setFetchMode(PDO::FETCH_ASSOC);
        
        $row = $query->fetch(); 
        
        $user_data = array(
                    'id' => $row['id'],
                    'name' => $row['name'],
                    'email' => $row['email'],
                    'type' => $row['type'],
                    'status' => $row['active']
            );
        
        header ("Content-type: application/json");
        echo json_encode($user_data);
    }
    
    private function updateUser()
    {
        
        $id = $_POST['id'];
        $name = $_POST['name'];
        $type = $_POST['type'];
        $status = $_POST['status'];

        $this->dbh->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);

        $query = $this->dbh->prepare("UPDATE `users` SET `name` = :name, `type` = :type, `active` = :status WHERE `id` = :id LIMIT 1");

        $query->bindParam(':name', $name);
        $query->bindParam(':type', $type);
        $query->bindParam(':status', $status);
        $query->bindParam(':id', intval(trim($id)));

        if(!$query->execute())
        {

            echo "error - something went wrong.";  
        }
        else
        {

            echo "successfully updated user.";
        }
    }
    
    private function deleteUser()
    {
        
        $id = $_POST['id'];

        $this->dbh->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);

        $query = $this->dbh->prepare("DELETE FROM `users` WHERE `id` = :id LIMIT 1");
        
        $query->bindParam(':id', intval(trim($id)));

        if(!$query->execute())
        {

            echo "error - something went wrong.";  
        }
        else
        {

            echo "successfully deleted user.";
        }
    }
    
    private function slug($string)
    { 
       //Lower case everything
        $string = strtolower($string);
        //Make alphanumeric (removes all other characters)
        $string = preg_replace("/[^a-z0-9_\s-]/", "", $string);
        //Clean up multiple dashes or whitespaces
        $string = preg_replace("/[\s-]+/", " ", $string);
        //Convert whitespaces and underscore to dash
        $string = preg_replace("/[\s_]/", "-", $string);
        return $string;
    }

    private function getUserName($dbh)
    {
        $query = $dbh->prepare("SELECT `name` FROM `users` WHERE `email` = :email ");
        $query->bindParam(':email', $_SESSION['user_id']);

        $query->execute();
        $query->setFetchMode(PDO::FETCH_ASSOC);
        $query->execute();

        $row = $query->fetch();
        $username = $row['name'];

        return $username;
    }
    
    private function checkLogin()
    {
        
        session_start();
        
        if (isset($_COOKIE['user_id']))
        {
            
            $data = array(
                'resp' => true,
                'email' => $_SESSION['user_id'],
                'name' => $_SESSION['user_name']
            );
            
        }
        else
        {
            
            $data = array(
                'resp' => false
            );
        }
        
        header ("Content-type: application/json");
        echo json_encode($data);
    }
    
    private function logout()
    {
        
        if(isset($_COOKIE['user_id'])) 
        {
            unset($_COOKIE['user_id']);
            setcookie('user_id', '', time() - 9999999); // empty value and old timestamp
        }

        header("Location: /login.html"); // Redirecting To Home Page
    }
}

$Router = new router();

$Router->runRoute($_REQUEST['route']);

?>