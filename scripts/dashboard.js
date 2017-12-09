$(document).ready(function() {

    checkLogin();
});

function addPost()
{

    var now = new Date();
    var formattedDate = (now.getMonth()+1)+"-"+now.getDate()+"-"+now.getFullYear();

    $.ajax({
        method: 'POST',
        url: '/router.php',
        data: {
            route: 'add-post',
            //user: '',
            content: $('#content').val(),
            description: $('#description').val(),
            type: $('#type').val(),
            title: $('#title').val(),
            date: formattedDate
        }
    }).done(function(result) {

        $("#result").html(""); //clear div
        $("#result").append("<div class='alert alert-success' role='alert'>"+result+"</div>");
        clearTextboxes();
    }).fail(function(result) {

        $("#result").html(""); //clear div
        $("#result").append("<div class='alert alert-danger' role='alert'>"+result+"</div>");
    });
}

function clearTextboxes()
{

    $('#description').val("");
    $('#content').val("");
    $('#title').val("");
}

function uploadFile()
{

    //var url = 'upload.php'
    var fileInput = document.getElementById('fileInput');
    var file = fileInput.files[0];
    var form_data = new FormData();
    form_data.append('fileInput', file);

    //alert(form_data);

    $.ajax({
        method: 'POST',
        url: '/upload.php', // point to server-side PHP script 
        data: form_data,   
        processData: false,
        contentType: false,
        success: function(msg){
            
            alert(msg); // display response from the PHP script, if any
        }
    });
}

function updatePost(id)
{

    var now = new Date();
    var formattedDate = (now.getMonth()+1)+"-"+now.getDate()+"-"+now.getFullYear();
    //alert(formattedDate);
    $.ajax({
        method: 'POST',
        url: '/router.php',
        data: {
            route: 'update-post',
            //user: '',
            title: $('#post_title').val(),
            description: $('#post_description').val(),
            content: $('#post_content').val(),
            date: formattedDate,
            id: id
        }
    }).done(function(result) {

        $("#update_result").html(""); //clear div
        $("#update_result").append("<div class='alert alert-success' role='alert'>"+result+"</div>");
        getPostsToEdit();
    }).fail(function(result) {

        $("#update_result").html(""); //clear div
        $("#update_result").append("<div class='alert alert-danger' role='alert'>"+result+"</div>");
    });
}

function deletePost(id)
{

    $.ajax({
        method: 'POST',
        url: '/router.php',
        dataType: 'html',
        data: {
            route: 'delete-post',
            id: id
        },
    }).done(function(result) {
        
        $("#result").html(""); //clear div
        $("#result").append("<div class='alert alert-success' role='alert'>"+result+"</div>");
        getPostsToEdit();
    });
}

function getPostsToEdit()
{

    $.ajax({
        method: 'GET',
        url: '/router.php',
        dataType: 'json',
        data: {
            route: 'get-posts-to-edit',
            start: 0,
            type: 'all'
        },
    }).done(function(posts) {
        
        $('#posts').html(""); //clear div

        var table = document.createElement('table');
        table.className = 'table dataTable no-footer';
        table.style = "table-layout:fixed";

        var thead = document.createElement('thead');
        var tr = document.createElement('tr');

        var th1 = document.createElement('th');
        th1.style = "width:20%";
        th1.innerHTML = "title";
        
        var th2 = document.createElement('th');
        th2.style = "width:25%";
        th2.innerHTML = "description";
        
        var th3 = document.createElement('th');
        th3.style = "width:40%";
        th3.innerHTML = "content";
        
        var th4 = document.createElement('th');
        th4.style = "width:15%";

        tr.appendChild(th1);
        tr.appendChild(th2);
        tr.appendChild(th3);
        tr.appendChild(th4);
        thead.appendChild(tr);
        table.appendChild(thead);

        var tbody = document.createElement('tbody')

        for(var i = 0; i < posts.length; i++)
        {

            var row = document.createElement('tr');
            //row.className = '';

            var td1 = document.createElement('td');
            td1.innerHTML = posts[i].title;

            var td2 = document.createElement('td');
            td2.innerHTML = posts[i].description;

            var td3 = document.createElement('td');
            td3.innerHTML = posts[i].stripped_content.substr(0,100); //may have to change

            var td4 = document.createElement('td');
            td4.innerHTML = "<button type='button' class='btn btn-default edit_modal' data-toggle='modal' data-target='#editModal' data-id='"+posts[i].id+"'>Edit</button>&nbsp&nbsp<button id='delete_"+posts[i].id+"' type='button' class='btn btn-danger' onclick='deletePost("+posts[i].id+")'>Delete</button>";

            row.appendChild(td1);
            row.appendChild(td2);
            row.appendChild(td3);
            row.appendChild(td4);

            tbody.appendChild(row);
        }

        table.appendChild(tbody);

        $('#posts').append(table);
    }).fail(function() {
        
        $('#posts').html(""); //clear div
        $('#posts').append("<table class='table'><thead><tr><th>Error</th></tr></thead></table>");
    });
}

function getPostToEdit(id)
{

    $.ajax({
        method: 'POST',
        url: '/router.php',
        dataType: 'json',
        data: {
            route: 'get-post-to-edit',
            id: id
        },
    }).done(function(post) {
//        $('.modal-body #edit_post').html(""); //clear div
        
        $("#post_title").val('');
        
        $("#post_title").val(post.title);
        
        $("#post_description").val('');
        
        $("#post_description").val(post.description);
        
        $("#post_content").val('');
        
        $("#post_content").val(post.content);
        
//        $('.modal-body #edit_post').append(post);
    }).fail(function() {
        
        $('.modal-body #edit_post').html(""); //clear div
        $('.modal-body #edit_post').append("<div>Error</div>");
    });
}

function getUsers()
{
    
    $.ajax({
        method: 'GET',
        url: '/router.php',
        dataType: 'json',
        data: {
            route: 'get-users',
            start: 0,
            type: 'all'
        },
    }).done(function(users) {
        
        $('#users').html(""); //clear div

        var table = document.createElement('table');
        table.className = 'table dataTable no-footer';
        table.style = "table-layout:fixed";

        var thead = document.createElement('thead');
        var tr = document.createElement('tr');

        var th1 = document.createElement('th');
        th1.style = "width:20%";
        th1.innerHTML = "name";
        
        var th2 = document.createElement('th');
        th2.style = "width:35%";
        th2.innerHTML = "email";
        
        var th3 = document.createElement('th');
        th3.style = "width:15%";
        th3.innerHTML = "type";
        
        var th4 = document.createElement('th');
        th4.style = "width:15%; text-align: center;";
        th4.innerHTML = "status";
        
        var th5 = document.createElement('th');
        th5.style = "width:15%";

        tr.appendChild(th1);
        tr.appendChild(th2);
        tr.appendChild(th3);
        tr.appendChild(th4);
        tr.appendChild(th5);
        thead.appendChild(tr);
        table.appendChild(thead);

        var tbody = document.createElement('tbody')

        for(var i = 0; i < users.length; i++)
        {

            var row = document.createElement('tr');
            //row.className = '';

            var td1 = document.createElement('td');
            td1.innerHTML = users[i].name;

            var td2 = document.createElement('td');
            td2.innerHTML = users[i].email;

            var td3 = document.createElement('td');
            td3.innerHTML = users[i].type; 
            
            var td4 = document.createElement('td');
            td4.style = "text-align:center";
            td4.innerHTML = (users[i].status == 1 ? "<p class='alert-success' style='border-radius:10px;'>active</p>" : "<p class='alert-danger' style='border-radius:10px;'>inactive</p>");

            var td5 = document.createElement('td');
            td5.innerHTML = "<button type='button' class='btn btn-default edit_modal' data-toggle='modal' data-target='#editModal' data-id='"+users[i].id+"'>Edit</button>&nbsp&nbsp<button id='delete_"+users[i].id+"' type='button' class='btn btn-danger' onclick='deleteUser("+users[i].id+")'>Delete</button>";

            row.appendChild(td1);
            row.appendChild(td2);
            row.appendChild(td3);
            row.appendChild(td4);
            row.appendChild(td5);

            tbody.appendChild(row);
        }

        table.appendChild(tbody);

        $('#users').append(table);
    }).fail(function() {
        
        $('#users').html(""); //clear div
        $('#users').append("<table class='table'><thead><tr><th>Error</th></tr></thead></table>");
    });
}

function getUser(id)
{
    
    $.ajax({
        method: 'POST',
        url: '/router.php',
        dataType: 'json',
        data: {
            route: 'get-user',
            id: id
        },
    }).done(function(user) {
//        $('.modal-body #edit_user').html(""); //clear div
        
        $("#user_name").val('');
        
        $("#user_name").val(user.name);
        
        $("#user_type").val(user.type);
        
        $("#user_status").val(user.status);
        
//        $('.modal-body #edit_user').append(div);
    }).fail(function() {
        
        $('.modal-body #edit_user').html(""); //clear div
        $('.modal-body #edit_user').append("<div>Error</div>");
    });
}

function updateUser(id)
{
    
    $.ajax({
        method: 'POST',
        url: '/router.php',
        data: {
            route: 'update-user',
            name: $('#user_name').val(),
            type: $('#user_type').val(),
            status: $('#user_status').val(),
            id: id
        }
    }).done(function(result) {
        
        $("#update_result").html(""); //clear div
        $("#update_result").append("<div class='alert alert-success' role='alert'>"+result+"</div>");
        getUsers();
    }).fail(function(result) {
        
        $("#update_result").html(""); //clear div
        $("#update_result").append("<div class='alert alert-danger' role='alert'>"+result+"</div>");
    });
}

function deleteUser(id)
{
    
    if(confirm("are you sure you want to delete this user?"))    
    {
        
        $.ajax({
            method: 'POST',
            url: '/router.php',
            dataType: 'html',
            data: {
                route: 'delete-user',
                id: id
            },
        }).done(function(result) {

            $("#result").html(""); //clear div
            $("#result").append("<div class='alert alert-success' role='alert'>"+result+"</div>");
            getUsers();
        });
    }
}

function getShopItems()
{
    
    $.ajax({
        method: 'GET',
        url: '/shop-router.php',
        dataType: 'json',
        data: {
            route: 'get-items',
            start: 0
        },
    }).done(function(items) {
        
        $('#items').html(""); //clear div

        var table = document.createElement('table');
        table.className = 'table dataTable no-footer';
        table.style = "table-layout:fixed";

        var thead = document.createElement('thead');
        var tr = document.createElement('tr');

        var th1 = document.createElement('th');
        th1.style = "width:20%";
        th1.innerHTML = "name";
        
        var th2 = document.createElement('th');
        th2.style = "width:10%";
        th2.innerHTML = "price";
        
        var th3 = document.createElement('th');
        th3.style = "width:10%";
        th3.innerHTML = "type";
        
        var th4 = document.createElement('th');
        th4.style = "width:15%";
        th4.innerHTML = "count";
        
        var th5 = document.createElement('th');
        th5.style = "width:10%";
        th5.innerHTML = "remaining";
        
        var th6 = document.createElement('th');
        th6.style = "width:15%; text-align: center;";
        th6.innerHTML = "avaliable";
        
        var th7 = document.createElement('th');
        th7.style = "width:20%";

        tr.appendChild(th1);
        tr.appendChild(th2);
        tr.appendChild(th3);
        tr.appendChild(th4);
        tr.appendChild(th5);
        tr.appendChild(th6);
        tr.appendChild(th7);
        thead.appendChild(tr);
        table.appendChild(thead);

        var tbody = document.createElement('tbody')

        for(var i = 0; i < items.length; i++)
        {

            var row = document.createElement('tr');
            //row.className = '';

            var td1 = document.createElement('td');
            td1.innerHTML = items[i].name;

            var td2 = document.createElement('td');
            td2.innerHTML = '$' + items[i].price;

            var td3 = document.createElement('td');
            td3.innerHTML = items[i].type; 
            
            var td4 = document.createElement('td');
            td4.innerHTML = items[i].count; 
            
            var td5 = document.createElement('td');
            td5.innerHTML = items[i].remaining; 
            
            var td6 = document.createElement('td');
            td6.style = "text-align:center";
            td6.innerHTML = (items[i].in_stock == 1 ? "<p class='alert-success' style='border-radius:10px;'>in stock</p>" : "<p class='alert-danger' style='border-radius:10px;'>out of stock</p>");

            var td7 = document.createElement('td');
            td7.innerHTML = "<button type='button' class='btn btn-default edit_modal' data-toggle='modal' data-target='#editModal' data-id='"+items[i].id+"'>Edit</button>&nbsp&nbsp<button id='delete_"+items[i].id+"' type='button' class='btn btn-danger' onclick='deleteItem("+items[i].id+")'>Delete</button>";

            row.appendChild(td1);
            row.appendChild(td2);
            row.appendChild(td3);
            row.appendChild(td4);
            row.appendChild(td5);
            row.appendChild(td6);
            row.appendChild(td7);

            tbody.appendChild(row);
        }

        table.appendChild(tbody);

        $('#items').append(table);
    }).fail(function() {
        
        $('#items').html(""); //clear div
        $('#items').append("<table class='table'><thead><tr><th>Error</th></tr></thead></table>");
    });
}

function getShopItemById(id)
{
    
    $.ajax({
        method: 'POST',
        url: '/shop-router.php',
        dataType: 'json',
        data: {
            route: 'get-item-by-id',
            id: id
        },
    }).done(function(item) {
//        $('.modal-body #edit_user').html(""); //clear div
        
        $("#item_name").val('');
        
        $("#item_name").val(item.name);
        
        $("#item_description").val('');
        
        $("#item_description").val(item.description);
        
        $("#item_price").val('');
        
        $("#item_price").val(item.price);
        
        $("#item_type").val(item.type);
        
        $("#item_count").val('');
        
        $("#item_count").val(item.count);
        
        $("#item_remaining").val('');
        
        $("#item_remaining").val(item.remaining);
        
        $("#item_available").val(item.in_stock);
        
//        $('.modal-body #edit_user').append(div);
    }).fail(function() {
        
        $('.modal-body #edit_item').html(""); //clear div
        $('.modal-body #edit_item').append("<div>Error</div>");
    });
}

function addItem()
{
    
    $.ajax({
        method: 'POST',
        url: '/shop-router.php',
        data: {
            route: 'add-item',
            name: $('#add_item_name').val(),
            description: $("#add_item_description").val(),
            image_path: $("#add_item_image_path").val(),
            price: $("#add_item_price").val(),
            type: $('#add_item_type').val(),
            options: $('#add_item_options').val(),
            count: $("#add_item_count").val(),
            remaining: $("#add_item_remaining").val(),
            in_stock: $("#add_item_available").val()
        }
    }).done(function(result) {
        
        $("#update_result").html(""); //clear div
        $("#update_result").append("<div class='alert alert-success' role='alert'>"+result+"</div>");
        getShopItems();
    }).fail(function(result) {
        
        $("#update_result").html(""); //clear div
        $("#update_result").append("<div class='alert alert-danger' role='alert'>"+result+"</div>");
    });
}

function updateItem(id)
{
    
    $.ajax({
        method: 'POST',
        url: '/shop-router.php',
        data: {
            route: 'update-item',
            name: $('#item_name').val(),
            description: $("#item_description").val(),
            price: $("#item_price").val(),
            type: $('#item_type').val(),
            count: $("#item_count").val(),
            remaining: $("#item_remaining").val(),
            in_stock: $("#item_available").val(),
            id: id
        }
    }).done(function(result) {
        
        $("#update_result").html(""); //clear div
        $("#update_result").append("<div class='alert alert-success' role='alert'>"+result+"</div>");
        getShopItems();
    }).fail(function(result) {
        
        $("#update_result").html(""); //clear div
        $("#update_result").append("<div class='alert alert-danger' role='alert'>"+result+"</div>");
    });
}

function deleteItem(id)
{
    
    if(confirm("are you sure you want to delete this item?"))    
    {
        
        $.ajax({
            method: 'POST',
            url: '/shop-router.php',
            dataType: 'html',
            data: {
                route: 'delete-item',
                id: id
            },
        }).done(function(result) {
        
            $("#result").html(""); //clear div
            $("#result").append("<div class='alert alert-success' role='alert'>"+result+"</div>");
            getShopItems();
        });
    }
}

function getOrders()
{

	$.ajax({
        method: 'GET',
        url: '/shop-router.php',
        dataType: 'json',
        data: {
            route: 'get-orders',
            start: 0
        },
    }).done(function(orders) {
        
        $('#orders').html(""); //clear div

        var table = document.createElement('table');
        table.className = 'table dataTable no-footer';
        table.style = "table-layout:fixed";

        var thead = document.createElement('thead');
        var tr = document.createElement('tr');

        var th1 = document.createElement('th');
        th1.style = "width:20%";
        th1.innerHTML = "order number";
        
        var th2 = document.createElement('th');
        th2.style = "width:10%";
        th2.innerHTML = "order date";
        
        var th3 = document.createElement('th');
        th3.style = "width:10%";
        th3.innerHTML = "order total";
        
        var th4 = document.createElement('th');
        th4.style = "width:20%";
        th4.innerHTML = "shipping date";
        
        var th5 = document.createElement('th');
        th5.style = "width:20%";
        th5.innerHTML = "tracking";
        
        var th6 = document.createElement('th');
        th6.style = "width:20%;";

        tr.appendChild(th1);
        tr.appendChild(th2);
        tr.appendChild(th3);
        tr.appendChild(th4);
        tr.appendChild(th5);
        tr.appendChild(th6);
        thead.appendChild(tr);
        table.appendChild(thead);

        var tbody = document.createElement('tbody')

        for(var i = 0; i < orders.length; i++)
        {

            var row = document.createElement('tr');
            //row.className = '';

            var td1 = document.createElement('td');
            td1.innerHTML = '#' + orders[i].order_number;

            var td2 = document.createElement('td');
            td2.innerHTML = orders[i].order_date.substr(0,10);

            var td3 = document.createElement('td');
            td3.innerHTML = '$' + orders[i].order_total; 
            
            var td4 = document.createElement('td');
            td4.innerHTML = (orders[i].shipping_date ? orders[i].shipping_date.substr(0,10) : 'not shipped yet'); 
            
            var td5 = document.createElement('td');
            td5.innerHTML = orders[i].tracking; 
            
            var td6 = document.createElement('td');
            td6.innerHTML = "<button type='button' class='btn btn-default view_modal' data-toggle='modal' data-target='#viewModal' data-id='"+orders[i].order_number+"'>View</button>&nbsp&nbsp<button id='delete_"+orders[i].order_number+"' type='button' class='btn btn-danger' onclick='deleteOrder("+orders[i].order_number+")'>Delete</button>";

            row.appendChild(td1);
            row.appendChild(td2);
            row.appendChild(td3);
            row.appendChild(td4);
            row.appendChild(td5);
            row.appendChild(td6);

            tbody.appendChild(row);
        }

        table.appendChild(tbody);

        $('#orders').append(table);
    }).fail(function() {
        
        $('#orders').html(""); //clear div
        $('#orders').append("<table class='table'><thead><tr><th>Error</th></tr></thead></table>");
    });
}

function getOrderByOrderNumber(order_number)
{
	
	$.ajax({
        method: 'POST',
        url: '/shop-router.php',
        dataType: 'json',
        data: {
            route: 'get-order-by-order-number',
            order_number: order_number
        },
	}).done(function(order) {
//        $('.modal-body #edit_user').html(""); //clear div

		$("#order_number").html("");

		$("#order_number").html("#" + order[0].order_number);

		$("#order_date").html("");

		$("#order_date").html(order[0].order_date.substr(0,10));

		$("#name").html("");

		$("#name").html(order[0].first_name + " " + order[0].last_name);

		$("#email").html("");

		$("#email").html(order[0].email);

		$("#address").html("");

		$("#address").html(order[0].address + " " + order[0].address_2);

		$("#city").html("");

		$("#city").html(order[0].city);

		$("#state").html("");

		$("#state").html(order[0].state);

		$("#zip").html("");

		$("#zip").html(order[0].zip);
		
		//build table
		$('#items_table').html(""); //clear div

        var table = document.createElement('table');
        table.className = 'table dataTable no-footer';
        table.style = "table-layout:fixed";

        var thead = document.createElement('thead');
        var tr = document.createElement('tr');
        
        var th1 = document.createElement('th');
        th1.style = "width:40%";
        th1.innerHTML = "item name";
        
        var th2 = document.createElement('th');
        th2.style = "width:20%";
        th2.innerHTML = "item option";
        
        var th3 = document.createElement('th');
        th3.style = "width:20%";
        th3.innerHTML = "item quantity";
        
		var th4 = document.createElement('th');
        th4.style = "width:20%";
        th4.innerHTML = "item price";
		
        tr.appendChild(th1);
        tr.appendChild(th2);
        tr.appendChild(th3);
        tr.appendChild(th4);
        thead.appendChild(tr);
        table.appendChild(thead);

        var tbody = document.createElement('tbody')

        for(var i = 0; i < order.length; i++)
        {

            var row = document.createElement('tr');
            //row.className = '';

            var td1 = document.createElement('td');
            td1.innerHTML = order[i].item_name;
			
			var td2 = document.createElement('td');
            td2.innerHTML = order[i].item_option;

            var td3 = document.createElement('td');
            td3.innerHTML = 'x' + order[i].item_quantity;

            var td4 = document.createElement('td');
            td4.innerHTML = '$' + order[i].item_price; 
            
            row.appendChild(td1);
            row.appendChild(td2);
            row.appendChild(td3);
            row.appendChild(td4);

            tbody.appendChild(row);
        }

        table.appendChild(tbody);

        $('#items_table').append(table);
		
		$("#order_total").html("");

		$("#order_total").html("$" + order[0].order_total);

		$("#notes").html("");

		$("#notes").html(order[0].notes);

		$("#shipping_date").val('');

		$("#shipping_date").val(order[0].shipping_date);

		$("#tracking").val('');

		$("#tracking").val(order[0].tracking);

//        $('.modal-body #edit_user').append(div);
	}).fail(function() {

			$('.modal-body #view_order').html(""); //clear div
			$('.modal-body #view_order').append("<div>Error</div>");
		});
	
}

function updateOrder(order_number)
{
	
	$.ajax({
        method: 'POST',
        url: '/shop-router.php',
        data: {
            route: 'update-order',
            shipping_date: $("#shipping_date").val(),
            tracking: $("#tracking").val(),
            order_number: order_number
        }
    }).done(function(result) {
        
        $("#update_result").html(""); //clear div
        $("#update_result").append("<div class='alert alert-success' role='alert'>"+result+"</div>");
        getOrders();
    }).fail(function(result) {
        
        $("#update_result").html(""); //clear div
        $("#update_result").append("<div class='alert alert-danger' role='alert'>"+result+"</div>");
    });
}

function deleteOrder(order_number)
{
	
	if(confirm("are you sure you want to delete this order?"))    
    {
        
        $.ajax({
            method: 'POST',
            url: '/shop-router.php',
            dataType: 'html',
            data: {
                route: 'delete-order',
                order_number: order_number
            },
        }).done(function(result) {
        
            $("#result").html(""); //clear div
            $("#result").append("<div class='alert alert-success' role='alert'>"+result+"</div>");
            getOrders();
        });
    }
}

function checkLogin()
{
    
    $.ajax({
        method: 'POST',
        url: '/router.php',
        data: {
            route: 'check-login'
        },
        async: false
    }).done(function(data) {

        if(data.resp)
        {
            console.log("logged in");
            
            $('#user-name').html(""); //clear div
            $('#user-name').append(data.name);
        }
        else
        {
            
            console.log("logged out");
            
            location.replace("/login.html");
        }
    });
}

function logout()
{
    
    $.ajax({
        method: 'POST',
        url: '/router.php',
        data: {
            route: 'logout'
        },
        async: false
    }).done(function(data) {
        
        console.log("logged out");
        
        location.replace("/login.html");
    });
}
