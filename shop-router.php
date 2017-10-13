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
                    'slug' => $row['item_slug'],
                    'count' => $row['item_count'],
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
                    'slug' => 'post-not-found',
                    'count' => 0,
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
                    'slug' => $row['item_slug'],
                    'count' => $row['item_count'],
                    'in_stock' => $row['in_stock']
            );
        }
        
        header ("Content-type: application/json");
        echo json_encode($item_data);
    }
}

$ShopRouter = new shopRouter();

$ShopRouter->runRoute($_REQUEST['route']);

?>