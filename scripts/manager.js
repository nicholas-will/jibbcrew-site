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
            content: $('#post-content').val(),
            description: $('#post-description').val(),
            type: $('#post-type').val(),
            title: $('#post-title').val(),
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

    $('#post-description').val("");
    $('#post-content').val("");
    $('#post-title').val("");
}

function addVideoCode()
{
	
	$('#post-content').val( $('#post-content').val() + '<div class="video-container"></div>');
}

function addImageCode()
{
	
	$('#post-content').val( $('#post-content').val() + '<img class="img-responsive center-block" src="" />');
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
            title: $('#post-title').val(),
            description: $('#post-description').val(),
            content: $('#post-content').val(),
            date: formattedDate,
            id: id
        }
    }).done(function(result) {

        $("#result").html(""); //clear div
        $("#result").append("<div class='alert alert-success' role='alert'>"+result+"</div>");
        getPostsToEdit();
    }).fail(function(result) {

        $("#result").html(""); //clear div
        $("#result").append("<div class='alert alert-danger' role='alert'>"+result+"</div>");
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

		var scrollable_div = document.createElement('div');
		scrollable_div.style = "overflow-y: scroll; height: 600px;";
		
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
            td3.innerHTML = posts[i].stripped_content.substr(0,90); //may have to change

            var td4 = document.createElement('td');
            td4.innerHTML = "<button type='button' class='btn btn-default edit_modal' data-toggle='modal' data-target='#editModal' data-id='"+posts[i].id+"'>Edit</button>&nbsp&nbsp<button id='delete_"+posts[i].id+"' type='button' class='btn btn-danger' onclick='deletePost("+posts[i].id+")'>Delete</button>";

            row.appendChild(td1);
            row.appendChild(td2);
            row.appendChild(td3);
            row.appendChild(td4);

            tbody.appendChild(row);
        }

        table.appendChild(tbody);
		
		scrollable_div.appendChild(table);

        $('#posts').append(scrollable_div);
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
        
        $("#post-title").val('');
        
        $("#post-title").val(post.title);
        
        $("#post-description").val('');
        
        $("#post-description").val(post.description);
        
        $("#post-content").val('');
        
        $("#post-content").val(post.content);
        
//        $('.modal-body #edit_post').append(post);
    }).fail(function() {
        
        $('.modal-body #edit-post').html(""); //clear div
        $('.modal-body #edit-post').append("<div>Error</div>");
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
		
		var scrollable_div = document.createElement('div');
		scrollable_div.style = "overflow-y: scroll; height: 600px;";

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

		scrollable_div.appendChild(table);
		
        $('#users').append(scrollable_div);
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
        
        $("#user-username").val(user.name);
        
        $("#user-type").val(user.type);
        
        $("#user-status").val(user.status);
        
//        $('.modal-body #edit_user').append(div);
    }).fail(function() {
        
        $('.modal-body #edit-user').html(""); //clear div
        $('.modal-body #edit-user').append("<div>Error</div>");
    });
}

function updateUser(id)
{
    
    $.ajax({
        method: 'POST',
        url: '/router.php',
        data: {
            route: 'update-user',
            name: $('#user-username').val(),
            type: $('#user-type').val(),
            status: $('#user-status').val(),
            id: id
        }
    }).done(function(result) {
        
        $("#result").html(""); //clear div
        $("#result").append("<div class='alert alert-success' role='alert'>"+result+"</div>");
        getUsers();
    }).fail(function(result) {
        
        $("#result").html(""); //clear div
        $("#result").append("<div class='alert alert-danger' role='alert'>"+result+"</div>");
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
		
		var scrollable_div = document.createElement('div');
		scrollable_div.style = "overflow-y: scroll; height: 538px;";

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
		
		scrollable_div.appendChild(table);

        $('#items').append(scrollable_div);
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
        
        $("#item-name").val('');
        
        $("#item-name").val(item.name);
        
        $("#item-description").val('');
        
        $("#item-description").val(item.description);
        
        $("#item-price").val('');
        
        $("#item-price").val(item.price);
        
        $("#item-type").val(item.type);
        
        $("#item-count").val('');
        
        $("#item-count").val(item.count);
        
        $("#item-remaining").val('');
        
        $("#item-remaining").val(item.remaining);
        
        $("#item-available").val(item.in_stock);
        
//        $('.modal-body #edit_user').append(div);
    }).fail(function() {
        
        $('.modal-body #edit-item').html(""); //clear div
        $('.modal-body #edit-item').append("<div>Error</div>");
    });
}

function addItem()
{
    
    $.ajax({
        method: 'POST',
        url: '/shop-router.php',
        data: {
            route: 'add-item',
            name: $('#add-item-name').val(),
            description: $("#add-item-description").val(),
            image_path: $("#add-item-image-path").val(),
            price: $("#add-item-price").val(),
            type: $('#add-item-type').val(),
            options: $('#add-item-options').val(),
            count: $("#add-item-count").val(),
            remaining: $("#add-item-remaining").val(),
            in_stock: $("#add-item-available").val()
        }
    }).done(function(result) {
        
        $("#result").html(""); //clear div
        $("#result").append("<div class='alert alert-success' role='alert'>"+result+"</div>");
        getShopItems();
    }).fail(function(result) {
        
        $("#result").html(""); //clear div
        $("#result").append("<div class='alert alert-danger' role='alert'>"+result+"</div>");
    });
}

function updateItem(id)
{
    
    $.ajax({
        method: 'POST',
        url: '/shop-router.php',
        data: {
            route: 'update-item',
            name: $('#item-name').val(),
            description: $("#item-description").val(),
            price: $("#item-price").val(),
            type: $('#item-type').val(),
            count: $("#item-count").val(),
            remaining: $("#item-remaining").val(),
            in_stock: $("#item-available").val(),
            id: id
        }
    }).done(function(result) {
        
        $("#result").html(""); //clear div
        $("#result").append("<div class='alert alert-success' role='alert'>"+result+"</div>");
        getShopItems();
    }).fail(function(result) {
        
        $("#result").html(""); //clear div
        $("#result").append("<div class='alert alert-danger' role='alert'>"+result+"</div>");
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
		
		var scrollable_div = document.createElement('div');
		scrollable_div.style = "overflow-y: scroll; height: 600px;";

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

		scrollable_div.appendChild(table);
		
        $('#orders').append(scrollable_div);
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

		$("#order-number").html("");

		$("#order-number").html("#" + order[0].order_number);

//		$("#order-date").html("");
//
//		$("#order-date").html(order[0].order_date.substr(0,10));

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
		$('#items-table').html(""); //clear div

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

		//probably get from call in future
		var shipping_amount = 7;
		
		//sub total
		var trow2 = document.createElement('tr');

		var tt2d1 = document.createElement('td');
		tt2d1.innerHTML = "";

		var tt2d2 = document.createElement('td');
		tt2d2.innerHTML = "";

		var tt2d3 = document.createElement('td');
		tt2d3.innerHTML = "<span style='float:right;'>subtotal: </span>";

		var tt2d4 = document.createElement('td');
		tt2d4.innerHTML = '$' + (Number(order[0].order_total) - shipping_amount).toFixed(2); 

		trow2.appendChild(tt2d1);
		trow2.appendChild(tt2d2);
		trow2.appendChild(tt2d3);
		trow2.appendChild(tt2d4);

		tbody.appendChild(trow2);
		
		//shipping
		var trow1 = document.createElement('tr');

		var tt1d1 = document.createElement('td');
		tt1d1.innerHTML = "";

		var tt1d2 = document.createElement('td');
		tt1d2.innerHTML = "";

		var tt1d3 = document.createElement('td');
		tt1d3.innerHTML = "<span style='float:right;'>shipping: </span>";

		var tt1d4 = document.createElement('td');
		tt1d4.innerHTML = '$' + Number(shipping_amount).toFixed(2); 

		trow1.appendChild(tt1d1);
		trow1.appendChild(tt1d2);
		trow1.appendChild(tt1d3);
		trow1.appendChild(tt1d4);

		tbody.appendChild(trow1);
		
		//total
		var trow3 = document.createElement('tr');

		var tt3d1 = document.createElement('td');
		tt3d1.innerHTML = "";

		var tt3d2 = document.createElement('td');
		tt3d2.innerHTML = "";

		var tt3d3 = document.createElement('td');
		tt3d3.innerHTML = "<span style='float:right;'>total: </span>";

		var tt3d4 = document.createElement('td');
		tt3d4.innerHTML = '<strong>$' + order[0].order_total + '</strong>'; 

		trow3.appendChild(tt3d1);
		trow3.appendChild(tt3d2);
		trow3.appendChild(tt3d3);
		trow3.appendChild(tt3d4);

		tbody.appendChild(trow3);
		
        table.appendChild(tbody);

        $('#items-table').append(table);
		
//		$("#order_total").html("");
//
//		$("#order_total").html("$" + order[0].order_total);

		$("#notes").html("");

		$("#notes").html(order[0].notes);

		$("#shipping-date").val('');

		$("#shipping-date").val(order[0].shipping_date);

		$("#tracking").val('');

		$("#tracking").val(order[0].tracking);

//        $('.modal-body #edit_user').append(div);
	}).fail(function() {

			$('.modal-body #view-order').html(""); //clear div
			$('.modal-body #view-order').append("<div>Error</div>");
		});
	
}

function updateOrder(order_number)
{
	
	$.ajax({
        method: 'POST',
        url: '/shop-router.php',
        data: {
            route: 'update-order',
            shipping_date: $("#shipping-date").val(),
            tracking: $("#tracking").val(),
            order_number: order_number
        }
    }).done(function(result) {
        
        $("#result").html(""); //clear div
        $("#result").append("<div class='alert alert-success' role='alert'>"+result+"</div>");
        getOrders();
    }).fail(function(result) {
        
        $("#result").html(""); //clear div
        $("#result").append("<div class='alert alert-danger' role='alert'>"+result+"</div>");
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
            
            $('#user-name').empty(); //clear div
            $('#user-name').append(data.name);
        }
        else
        {
            
            console.log("logged out");
            
            location.replace("/#login");
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
        
        location.replace("/#login");
    });
}
