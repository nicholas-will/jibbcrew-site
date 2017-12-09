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
				
			case 'get-orders' :
				$this->getOrders();
				break;
				
			case 'get-order-by-order-number' :
				$this->getOrderByOrderNumber();
				break;
				
			case 'update-order' :
				$this->updateOrder();
				break;
				
			case 'delete-order' :
				$this->deleteOrder();
				break;
				
			case 'add-item-to-order' :
				$this->addItemToOrder();
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
                    'options' => ($row['item_options'] ?: ""),
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
					'options' => '',
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
					'options' => ($row['item_options'] ?: ""),
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

        //select item
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
					'options' => ($row['item_options'] ?: ""),
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
		$slug = $this->slug($name);

        $this->dbh->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);

        $query = $this->dbh->prepare("UPDATE `shop` SET `item_name` = :name, `item_description` = :description, `item_price` = :price, `item_type` = :type, `item_total_count` = :count, `item_remaining` = :remaining, `item_slug` = :slug, `in_stock` = :in_stock WHERE `id` = :id LIMIT 1");

        $query->bindParam(':name', $name);
        $query->bindParam(':description', $description);
        $query->bindParam(':price', $price);
        $query->bindParam(':type', $type);
        $query->bindParam(':count', $count);
        $query->bindParam(':remaining', $remaining);
        $query->bindParam(':slug', $slug);
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
        $options = $_POST['options'];
        $count = $_POST['count'];
        $remaining = $_POST['remaining'];
        $in_stock = $_POST['in_stock'];
        $slug = $this->slug($name);

        $query = $this->dbh->prepare("INSERT INTO shop (item_name, item_description, item_image_path, item_price, item_type, item_options, item_total_count, item_remaining, item_slug, in_stock)
        VALUES (:name, :description, :image_path, :price, :type, :options, :count, :remaining, :slug, :in_stock)");

        $query->bindParam(':name', $name);
        $query->bindParam(':description', $description);
        $query->bindParam(':image_path', $image_path);
        $query->bindParam(':price', $price);
        $query->bindParam(':type', $type);
        $query->bindParam(':options', $options);
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

            echo "successfully deleted item.";
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
	
	private function getOrders()
	{
		
		$start = $_POST['start'];

        $this->dbh->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);  

        $query = $this->dbh->prepare("SELECT `order_total` as `order_total`, `order_number` as `order_number`, `order_date` as `order_date`, `shipping_date` as `shipping_date`, `tracking_number` as `tracking_number` FROM `orders` GROUP BY `order_number` DESC LIMIT :start, 20");
		
        $query->bindParam(':start', intval(trim($start)));

        $query->execute();

        $query->setFetchMode(PDO::FETCH_ASSOC);

        while($row = $query->fetch()) 
        {

            $orders_data[] = array(
                    'order_number' => $row['order_number'],
                    'order_date' => $row['order_date'],
					'order_total' => $row['order_total'],
                    'shipping_date' => $row['shipping_date'],
                    'tracking' => $row['tracking_number']
            );
        }
        
        header ("Content-type: application/json");
        echo json_encode($orders_data);
	}
	
	private function getOrderByOrderNumber()
	{
		
		$order_number = $_POST['order_number'];

        $this->dbh->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);

        //select order
        $query = $this->dbh->prepare("SELECT * FROM `orders` WHERE `order_number` = :order_number");
        
        $query->bindParam(':order_number', $order_number);

        $query->execute();
        
        $query->setFetchMode(PDO::FETCH_ASSOC);
		
		//select total
//        $query2 = $this->dbh->prepare("SELECT SUM(`item_price`) as `order_total` FROM `orders` WHERE `order_number` = :order_number");
//        
//        $query2->bindParam(':order_number', $order_number);
   
        while($row = $query->fetch()) 
        {
        
//			$query2->execute();
//        
//        	$query2->setFetchMode(PDO::FETCH_ASSOC);
		
//			$row2 = $query2->fetch(); 
			
        	$order_data[] = array(
                    'id' => $row['id'],
                    'first_name' => $row['first_name'],
                    'last_name' => $row['last_name'],
                    'email' => $row['email'],
                    'address' => $row['address'],
                    'address_2' => ($row['address_2'] ?: ""),
                    'city' => $row['city'],
                    'state' => $row['state'],
                    'zip' => $row['zip_code'],
                    'country' => $row['country'],
                    'notes' => ($row['order_notes'] ?: ""),
                    'order_number' => $row['order_number'],
                    'order_date' => $row['order_date'],
					'order_total' => $row['order_total'],
                    'item_price' => $row['item_price'],
					'item_name' => $row['item_name'],
					'item_option' => ($row['item_option'] ?: ""),
					'item_quantity' => $row['item_quantity'],
					'item_id' => $row['item_id'],
                    'shipping_date' => $row['shipping_date'],
                    'tracking' => $row['tracking_number']
            );	
		}
        
        header ("Content-type: application/json");
        echo json_encode($order_data);
	}
	
	private function updateOrder()
	{
		
		$shipping_date = $_POST['shipping_date'];
        $tracking = $_POST['tracking'];
        $order_number = $_POST['order_number'];

        $this->dbh->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);

        $query = $this->dbh->prepare("UPDATE `orders` SET `shipping_date` = :shipping_date, `tracking_number` = :tracking WHERE `order_number` = :order_number");

        $query->bindParam(':shipping_date', $shipping_date);
        $query->bindParam(':tracking', $tracking);
        $query->bindParam(':order_number', $order_number);

        if(!$query->execute())
        {

            echo "error - something went wrong.";  
        }
        else
        {

            echo "successfully updated order.";
        }
	}
	
	private function deleteOrder()
	{
		
		$order_number = $_POST['order_number'];
		
		$this->dbh->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);

        $query = $this->dbh->prepare("DELETE FROM `orders` WHERE `order_number` = :order_number");
        
        $query->bindParam(':order_number', $order_number);

        if(!$query->execute())
        {

            echo "error - something went wrong.";  
        }
        else
        {

            echo "successfully deleted order.";
        }
	}
	
	private function addItemToOrder()
	{
		
		$first_name = $_POST['first_name'];
		$last_name = $_POST['last_name'];
		$email = $_POST['email'];
		$address = $_POST['address'];
		$address_2 = $_POST['address_2'];
		$city = $_POST['city'];
		$state = $_POST['state'];
		$zip_code = $_POST['zip_code'];
		$country = $_POST['country'];
		$order_number = $_POST['order_number'];
		$order_date = date('Y-m-d H:i:s', strtotime($_POST['order_date']));
		$order_total = $_POST['order_total'];
		$item_price = $_POST['item_price'];
		$item_name = $_POST['item_name'];
		$item_option = $_POST['item_option'];
		$item_quantity = $_POST['item_quantity'];
		$item_id = $_POST['item_id'];
		
		$query = $this->dbh->prepare("INSERT INTO orders (first_name, last_name, email, address, address_2, city, state, zip_code, country, order_number, order_date, order_total, item_price, item_name, item_option, item_quantity, item_id ) VALUES (:first_name, :last_name, :email, :address, :address_2, :city, :state, :zip_code, :country, :order_number, :order_date, :order_total, :item_price, :item_name, :item_option, :item_quantity, :item_id)");

        $query->bindParam(':first_name', $first_name);
        $query->bindParam(':last_name', $last_name);
		$query->bindParam(':email', $email);
        $query->bindParam(':address', $address);
        $query->bindParam(':address_2', $address_2);
        $query->bindParam(':city', $city);
        $query->bindParam(':state', $state);
        $query->bindParam(':zip_code', $zip_code);
        $query->bindParam(':country', $country);
        $query->bindParam(':order_number', $order_number);
        $query->bindParam(':order_date', $order_date);
        $query->bindParam(':order_total', $order_total);
        $query->bindParam(':item_price', $item_price);
        $query->bindParam(':item_name', $item_name);
        $query->bindParam(':item_option', $item_option);
        $query->bindParam(':item_quantity', $item_quantity);
        $query->bindParam(':item_id', $item_id);

        if($query->execute())
        {
            
            $data = array(
				'resp' => true
			);
        }
        else 
        {
            
			$arr = $query->errorInfo();
			
            $data = array(
				'resp' => false,
				'message' => "error execute failed: " . $arr[2]
			);
        }
		
		header ("Content-type: application/json");
        echo json_encode($data);
	}
}

$ShopRouter = new shopRouter();

$ShopRouter->runRoute($_REQUEST['route']);

?>