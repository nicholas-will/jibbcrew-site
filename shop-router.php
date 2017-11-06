<?php

require('config.php');

class shopRouter
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
                
            case 'get-items' :
                $this->getItems();
                break;
                
            case 'get-item' :
                $this->getItem();
                break;
                
            case 'get-item-by-id' :
                $this->getItemById();
                break;
                
            case 'update-item' :
                $this->updateItem();
                break;
                
            case 'add-item' :
                $this->addItem();
                break;
                
            case 'delete-item' :
                $this->deleteItem();
                break;
        }
        
         //close connection
        $this->dbh = null;
    }
    
    private function getItems()
    {
        
        $start = $_POST['start'];

        $this->dbh->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);  

        $query = $this->dbh->prepare("SELECT * FROM `shop` ORDER BY `id` DESC LIMIT :start, 20");
        $query->bindParam(':start', intval(trim($start)));

        $query->execute();

        $query->setFetchMode(PDO::FETCH_ASSOC);

        while($row = $query->fetch()) 
        {

            $items_data[] = array(
                    'id' => $row['id'],
                    'name' => $row['item_name'],
                    'description' => $row['item_description'],
                    'image_path' => $row['item_image_path'],
                    'price' => $row['item_price'],
                    'type' => $row['item_type'],
                    'slug' => $row['item_slug'],
                    'count' => $row['item_total_count'],
                    'remaining' => $row['item_remaining'],
                    'in_stock' => $row['in_stock']
            );
        }
        
        header ("Content-type: application/json");
        echo json_encode($items_data);
    }
    
    private function getItem()
    {
        
        $slug = $_POST['slug'];

        //build post
        $query = $this->dbh->prepare("SELECT * FROM `shop` WHERE `item_slug` = :slug ");
        $query->bindParam(':slug', $slug);
        $query->execute();

        $count = $query->rowCount();

        $query->setFetchMode(PDO::FETCH_ASSOC);

        $row = array();

        if($count != 1)
        {
            
            $item_data = array(
                    'id' => '0',
                    'name' => '404',
                    'description' => 'your content could not be located',
                    'image_path' => '',
                    'price' => 0,
                    'type' => '',
                    'slug' => 'post-not-found',
                    'count' => 0,
                    'remaining' => 0,
                    'in_stock' => 0
            );
        }
        else
        {

            $row = $query->fetch();
            
            $item_data = array(
                    'id' => $row['id'],
                    'name' => $row['item_name'],
                    'description' => $row['item_description'],
                    'image_path' => $row['item_image_path'],
                    'price' => $row['item_price'],
                    'type' => $row['item_type'],
                    'slug' => $row['item_slug'],
                    'count' => $row['item_total_count'],
                    'remaining' => $row['item_remaining'],
                    'in_stock' => $row['in_stock']
            );
        }
        
        header ("Content-type: application/json");
        echo json_encode($item_data);
    }
    
    private function getItemById()
    {
        
        $id = $_POST['id'];

        $this->dbh->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);

        //build post
        $query = $this->dbh->prepare("SELECT * FROM `shop` WHERE `id` = :id LIMIT 1");
        
        $query->bindParam(':id', intval(trim($id)));

        $query->execute();
        
        $query->setFetchMode(PDO::FETCH_ASSOC);
        
        $row = $query->fetch(); 
        
        $item_data = array(
                    'id' => $row['id'],
                    'name' => $row['item_name'],
                    'description' => $row['item_description'],
                    'image_path' => $row['item_image_path'],
                    'price' => $row['item_price'],
                    'type' => $row['item_type'],
                    'slug' => $row['item_slug'],
                    'count' => $row['item_total_count'],
                    'remaining' => $row['item_remaining'],
                    'in_stock' => $row['in_stock']
            );
        
        header ("Content-type: application/json");
        echo json_encode($item_data);
    }
    
    private function updateItem()
    {
        
        
        $name = $_POST['name'];
        $description = $_POST['description'];
        $price = $_POST['price'];
        $type = $_POST['type'];
        $count = $_POST['count'];
        $remaining = $_POST['remaining'];
        $in_stock = $_POST['in_stock'];
        $id = $_POST['id'];

        $this->dbh->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);

        $query = $this->dbh->prepare("UPDATE `shop` SET `item_name` = :name, `item_description` = :description, `item_price` = :price, `item_type` = :type, `item_total_count` = :count, `item_remaining` = :remaining, `in_stock` = :in_stock WHERE `id` = :id LIMIT 1");

        $query->bindParam(':name', $name);
        $query->bindParam(':description', $description);
        $query->bindParam(':price', $price);
        $query->bindParam(':type', $type);
        $query->bindParam(':count', $count);
        $query->bindParam(':remaining', $remaining);
        $query->bindParam(':in_stock', $in_stock);
        $query->bindParam(':id', intval(trim($id)));

        if(!$query->execute())
        {

            echo "error - something went wrong.";  
        }
        else
        {

            echo "successfully updated item.";
        }
    }
    
    private function addItem()
    {
        
        $name = $_POST['name'];
        $description = $_POST['description'];
        $image_path = $_POST['image_path'];
        $price = $_POST['price'];
        $type = $_POST['type'];
        $count = $_POST['count'];
        $remaining = $_POST['remaining'];
        $in_stock = $_POST['in_stock'];
        $slug = $this->slug($name);

        $query = $this->dbh->prepare("INSERT INTO shop (item_name, item_description, item_image_path, item_price, item_type, item_total_count, item_remaining, item_slug, in_stock)
        VALUES (:name, :description, :image_path, :price, :type, :count, :remaining, :slug, :in_stock)");

        $query->bindParam(':name', $name);
        $query->bindParam(':description', $description);
        $query->bindParam(':image_path', $image_path);
        $query->bindParam(':price', $price);
        $query->bindParam(':type', $type);
        $query->bindParam(':count', $count);
        $query->bindParam(':remaining', $remaining);
        $query->bindParam(':slug', $slug);
        $query->bindParam(':in_stock', $in_stock);

        if($query->execute())
        {
            
            echo "successfully added item.";
        }
        else 
        {
            
            echo "error - something went wrong.";
        }
    }
    
    private function deleteItem()
    {
        
        $id = $_POST['id'];

        $this->dbh->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);

        $query = $this->dbh->prepare("DELETE FROM `shop` WHERE `id` = :id LIMIT 1");
        
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
}

$ShopRouter = new shopRouter();

$ShopRouter->runRoute($_REQUEST['route']);

?>