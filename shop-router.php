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

            $item_data[] = array(
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
    
    private function getItem()
    {
        
        //to do
    }
}

$ShopRouter = new shopRouter();

$ShopRouter->runRoute($_REQUEST['route']);

?>