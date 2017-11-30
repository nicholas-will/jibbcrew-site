var post_type = 'all';

//router
routie({
    '': function() {
        //console.log(window.location.hash);
        
        ga('set', 'page', '/' + window.location.hash);
        ga('send', 'pageview');
               
        post_type = 'all';
        
        $("#title").html("");

        $("#title").html('news');

        getPosts(post_type);
		
		$("#comments").remove();
    },
    'videos': function() {
        //console.log(window.location.hash);
        
        ga('set', 'page', '/' + window.location.hash);
        ga('send', 'pageview');
        
        //set post_type
        post_type = 'video';

        $("#title").html("");

        $("#title").html('videos');
        
        getPosts(post_type);
        
        $("#comments").remove();
    },
    'gallery': function() {
        //console.log(window.location.hash);
        
        ga('set', 'page', '/' + window.location.hash);
        ga('send', 'pageview');
                    
        //set post_type
        post_type = 'gallery';

        $("#title").html("");
        
        $("#title").html('gallery');

        getPosts(post_type);
        
        $("#comments").remove();
    },
    'contact': function() {
        //console.log(window.location.hash);
        
        ga('set', 'page', '/' + window.location.hash);
        ga('send', 'pageview');
                    
        //set post_type
        post_type = 'contact';

        $("#title").html("");
        
        $("#title").html('contact');
        
        getContact();
        
        $("#load-more-button").remove();
        
        $("#comments").remove();
    },
    'shop': function() {
        //ga('set', 'page', '/' + window.location.hash);
        //ga('send', 'pageview');

        $("#title").html("");
        
        $("#title").html('shop');
		
		getShop();
        
        $("#load-more-button").remove();
        
        $("#comments").remove(); 
    },
    'shop/:item': function(item_slug) {
		
        //ga('set', 'page', '/' + window.location.hash);
        //ga('send', 'pageview');
        
        getShopItem(item_slug);   
        
    },
    'post/:slug': function(slug) {
        //console.log(window.location.hash);
        
        ga('set', 'page', '/' + window.location.hash);
        ga('send', 'pageview');
    
        getPost(slug);
    },
	'cart': function() {
		
		//ga('set', 'page', '/' + window.location.hash);
        //ga('send', 'pageview');
		
		$("#title").html("");
        
        $("#title").html('cart');
		
		getCart();
        
        $("#load-more-button").remove();
        
        $("#comments").remove();        
	},
	'checkout': function() {
	
		//ga('set', 'page', '/' + window.location.hash);
        //ga('send', 'pageview');
		
		$("#title").html("");
        
        $("#title").html('checkout');
		
		getCheckout();
        
        $("#load-more-button").remove();
        
        $("#comments").remove();
	},
    'login': function() {
        
        window.location.href = "login.html";
    }
});

function buildCarousel()
{
    
    var div = document.createElement('div');
    div.className = "news-item";
    
    var heading = document.createElement('h4');
    heading.className = "news-item-title";
    heading.innerHTML = "recent instagram feed";
    
    var outerdiv  = document.createElement('div');
    outerdiv.id = "jibb-carousel";
    outerdiv.className = "carousel center-block img-responsive"; //slide taken out
    outerdiv.style.width = "640px";
    
    var innerdiv  = document.createElement('div');
    innerdiv.id = "instafeed";
    innerdiv.className = "carousel-inner";
    innerdiv.setAttribute("role", "listbox");

    outerdiv.appendChild(innerdiv);
    
    //controls
    var lefta  = document.createElement('a');
    lefta.className = "left carousel-control";
    lefta.href = "#jibb-carousel";
    lefta.setAttribute("role", "button");
    lefta.setAttribute("data-slide", "prev");
    lefta.innerHTML = "<span class='glyphicon glyphicon-chevron-left' aria-hidden='true'></span><span class='sr-only'>Previous</span>";
    
    var righta  = document.createElement('a');
    righta.className = "right carousel-control";
    righta.href = "#jibb-carousel";
    righta.setAttribute("role", "button");
    righta.setAttribute("data-slide", "next");
    righta.innerHTML = "<span class='glyphicon glyphicon-chevron-right' aria-hidden='true'></span><span class='sr-only'>Next</span>";
    
    outerdiv.appendChild(lefta);
    outerdiv.appendChild(righta);
    
    div.appendChild(heading);
    
    div.appendChild(outerdiv);
    
    return div;
}

//function getInstagramPosts(limit)
//{
//    
//    var carousel = buildCarousel();
//    
//    $('#posts').html(""); //clear div
//    
//    $('#posts').append(carousel);
//    
//    var userFeed = new Instafeed({
//        get: 'user',
//        userId: '4629847913',
//        limit: limit,
//        clientId: 'f4001fdcf1574ee6a47b248fc54ae4e6',
//        accessToken: '4629847913.1677ed0.647cfc4ef7a64a2680ea99f42f1e5078',
//        resolution: 'standard_resolution',
//        template: '<div class="item"><a href="{{link}}"><img class="img-responsive center-block" src="{{image}}" /></a></div>' //height="{{height}}" width="{{width}}"
//    });
//    userFeed.run();
//    
//    setTimeout(function(){
//        $('#instafeed .item:nth-child(1)').addClass('active');
//    }, 1000); //1 sec
//}

function getPosts(post_type)
{
    
    $.ajax({
            method: 'POST',
            url: 'router.php',
            dataType: 'json',
            data: {
                route: 'get-posts',
                start: 0,
                type: post_type
            },
        }).done(function(posts) {
        
            $('#posts').html(""); //clear div
    
            for(var i = 0; i < posts.length; i++)
            {

                var div = document.createElement('div');
                div.className = "news-item";

                var heading = document.createElement('h4');
                heading.className = "news-item-title";
                //heading.innerHTML = posts[i].title;

                var a = document.createElement('a');
                a.href = "#post/" + posts[i].slug;
                a.innerHTML = posts[i].title;

                heading.appendChild(a);

                var paragraph = document.createElement('p');
                paragraph.className = "news-item-desc";
                paragraph.innerHTML = posts[i].description;

                var content = document.createElement("div");
                content.innerHTML = posts[i].content;

                div.appendChild(heading);
                div.appendChild(paragraph);
                div.appendChild(content);

                //console.log(posts[i].post.id);
                $('#posts').append(div);
            }
		
			addLoadMoreButton();

        }).fail(function() {
            $('#posts').html(""); //clear div

            var now = new Date();
            var formattedDate = (now.getMonth()+1)+"-"+now.getDate()+"-"+now.getFullYear();

            $('#posts').append("<div class='news-item'><h4 class='news-item-title'>error</h4><p class='news-item-desc'>"+formattedDate+"</p>site down :(</div>");
        });
}

function getPost(slug)
{
    
    $.ajax({
            method: 'POST',
            url: 'router.php',
            dataType: 'json',
            data: {
                route: 'get-post',
                slug: slug
            },
        }).done(function(post) {
            //console.log(post);
    
            $('#posts').html(""); //clear div
        
            $("#load-more-button").remove();
    
            var div = document.createElement('div');
            div.className = "news-item";

            var heading = document.createElement('h4');
            heading.className = "news-item-title";

            var a = document.createElement('a');
            a.setAttribute('href', "#post/"+post.slug);
            a.innerHTML = post.title;

            heading.appendChild(a);

            var paragraph = document.createElement('p');
            paragraph.className = "news-item-desc";
            paragraph.innerHTML = post.description;

            var content = document.createElement("div");
            content.innerHTML = post.content;

            div.appendChild(heading);
            div.appendChild(paragraph);
            div.appendChild(content);

            $('#posts').append(div);
        
            //fb comments
            var fbdiv = document.createElement('div');
            fbdiv.id = "comments"
            fbdiv.className = "fb-comments";
            fbdiv.setAttribute("data-href", "http://www.jibbcrew.com/#post/"+post.slug);
            fbdiv.setAttribute("data-width", "100%"); 
            fbdiv.setAttribute("data-numposts", "5");
        
            document.getElementById('main-row').appendChild(fbdiv);

            FB.XFBML.parse();

        });
//        .fail(function() {
//            $('#posts').html(""); //clear div
//
//            var now = new Date();
//            var formattedDate = (now.getMonth()+1)+"-"+now.getDate()+"-"+now.getFullYear();
//
//            $('#posts').append("<div class='news-item'><h4 class='news-item-title'>error</h4><p class='news-item-desc'>"+formattedDate+"</p>site down :(</div>");
//        });
}

function getContact()
{
    
    $('#posts').html(""); //clear div
    
    var div = document.createElement('div');
    div.className = "news-item";
    
    var heading = document.createElement('h4');
    heading.className = "news-item-title";
    heading.innerHTML = "<br />";
    
    var paragraph1 = document.createElement('p');
    paragraph1.className = "news-item-desc";
    
    var a1 = document.createElement('a');
    a1.setAttribute('href', "mailto:jibbcrewatl@gmail.com");
    a1.innerHTML = "email";
    
    var paragraph2 = document.createElement('p');
    paragraph2.className = "news-item-desc";
    
    var a2 = document.createElement('a');
    a2.setAttribute('href', "https://www.instagram.com/jibbcrew/");
    a2.innerHTML = "instagram";
    
    paragraph1.appendChild(a1);
    paragraph2.appendChild(a2);
    
    var content = document.createElement("div");
    content.innerHTML = "<img class='img-responsive center-block' src='uploads/jibbjam_group.JPG' />";
    
    div.appendChild(heading);
    div.appendChild(paragraph1);
    div.appendChild(paragraph2);
    div.appendChild(content);
    
    $('#posts').append(div);
}

function getShop()
{
    
    var div = document.createElement('div');
    div.className = "news-item";
    
    $.ajax({
            method: 'POST',
            url: 'shop-router.php',
            dataType: 'json',
            data: {
                route: 'get-items',
                start: 0
            },
        }).done(function(items) {
        
            $('#posts').html(""); //clear div
    
            for(var i = 0; i < items.length; i++)
            {

                var inner_div = document.createElement('div');
                inner_div.className = 'responsive-card-row';
                
                var card = document.createElement('div');
                card.className = 'card jibb-card';
                
                var a = document.createElement('a');
                a.href = '#shop/' + items[i].slug;
                a.style = 'text-decoration:none';
                
                var img = document.createElement('img');
                img.className = 'card-img-top';
                img.src = items[i].image_path;
                img.style = 'width: 100%; height: 200px;';
                
                var card_body = document.createElement('div');
                card_body.className = 'card-body';
                
                var paragraph = document.createElement('p');
                paragraph.className = "card-text";
                paragraph.innerHTML = items[i].name + " - $" + items[i].price;

                card_body.appendChild(paragraph);
                
                card.appendChild(img);
                card.appendChild(card_body);
                
                a.appendChild(card);
                
                inner_div.appendChild(a);
                
                div.appendChild(inner_div);
                $('#posts').append(div);
            }

        }).fail(function() {
            $('#posts').html(""); //clear div

            var now = new Date();
            var formattedDate = (now.getMonth()+1)+"-"+now.getDate()+"-"+now.getFullYear();

            $('#posts').append(
                "<div class='news-item'><div class='card jibb-card'><img class='card-img-top' src='' height='120' width='120' alt='error'><div class='card-body'><p class='card-text'>"+formattedDate+"<p>site down :(</p></div></div></div>");
        
        });
}

function getShopItem(item_slug)
{
    
    $.ajax({
            method: 'POST',
            url: 'shop-router.php',
            dataType: 'json',
            data: {
                route: 'get-item',
                slug: item_slug
            },
        }).done(function(item) {
            //console.log(item);
    
            $('#posts').html(""); //clear div
        
            $("#load-more-button").remove();
        
            $("#comments").remove();
    
            var div = document.createElement('div');
            div.className = "news-item";

            var media_div = document.createElement('div');
            media_div.className = "media";
            media_div.style = 'padding-top: 20px';
        
            var media_left = document.createElement('div');
            media_left.className = 'media-left';
        
            var img = document.createElement('img');
            img.className = 'media-object';
            img.src = item.image_path;
            img.style = 'width: 200px; height: 200px;';
        
            var media_body = document.createElement('div');
            media_body.className = 'media-body';
            media_body.style = 'padding-left: 20px';
                
            var paragraph1 = document.createElement('p');
            paragraph1.innerHTML = item.description;
        
            var paragraph2 = document.createElement('p');
            paragraph2.innerHTML = (item.in_stock == 1 ? 'item in stock - ' + item.count + ' available' : 'item out of stock');
		
//			var textbox = document.createElement('input');
//			textbox.value = "1";
//			textbox.id = "item-qty";
//			textbox.style = "width: 40px;"
//		
//			var paragraph5 = document.createElement('p');
//			paragraph5.appendChild(textbox);
            
			var select = document.createElement('select');
			select.id = "item-options";
		
			if(item.options != "")
			{
				
				var opts = item.options.split(",");
				
				for(var i = 0; i < opts.length; i++) 
				{
    				var opt = opts[i];
    				var el = document.createElement("option");
    				el.textContent = opt;
    				el.value = opt;
    				select.appendChild(el);
				}
				
				var paragraph4 = document.createElement('p');
				paragraph4.appendChild(select);
			}
		
            var paragraph3 = document.createElement('p');
            paragraph3.innerHTML = "<strong>$" + item.price + "</strong>";
		
			var hr = document.createElement('hr');
		
			var button = document.createElement('input');
			button.setAttribute("type", "button");
			button.className = 'btn outline';
			button.setAttribute('value', 'add to cart');
		
			button.onclick = function(){
				
				var selected_option = "";
				
				if(item.options != "")
				{
					
					selected_option = document.getElementById('item-options').value;
				}	
				
				var item_qty = 1;
				
				//console.log(item.id + " " + selected_option + " " + item_qty);
				
				addToCart(item, item_qty, selected_option);
			}
        
            var media_heading = document.createElement('h4');
            media_heading.className = "media-heading";

            var a = document.createElement('a');
            a.setAttribute('href', "#shop/"+item.slug);
            a.innerHTML = item.name;

            media_heading.appendChild(a);

            media_body.appendChild(media_heading);
            media_body.appendChild(paragraph1);
            media_body.appendChild(paragraph2);
//            media_body.appendChild(paragraph5);
		
			if(item.options != "")
			{
				
				media_body.appendChild(paragraph4);
			}
		
            media_body.appendChild(paragraph3);
            media_body.appendChild(hr);
            media_body.appendChild(button);
        
            media_left.appendChild(img);
        
            media_div.appendChild(media_left);
            media_div.appendChild(media_body);
        
            div.appendChild(media_div);
		
			div.appendChild(document.createElement('br'));

            $('#posts').append(div);
        });
}

function addToCart(item, qty, option)
{
	
	//look at
	var key_id = (item.id + ":" + item.name + ":" + option + ":" + item.price);
	
	if(window.sessionStorage.getItem(key_id))
	{
		
		window.sessionStorage.setItem(key_id, Number(window.sessionStorage.getItem(key_id)) + qty);
	}
	else
	{
		
		window.sessionStorage.setItem(key_id, qty);
	}
	
	//for add to cart notification
	var notification_div = document.createElement('div');
	notification_div.id = "notification";
	notification_div.className = "alert alert-success alert-dismissable";
	//notification_div.style = "display:none;";

	var close = document.createElement('a');
	close.className = "close";
	close.setAttribute('data-dismiss', "alert");
	close.setAttribute('aria-label', "close");
	close.innerHTML = "&times;";

	notification_div.appendChild(close);

	var notification_mess = document.createElement('p');
	notification_mess.innerHTML = "added to cart";
	notification_div.appendChild(notification_mess);

	//div.appendChild(notification_div);

	$('#posts').append(notification_div);
}

function removeFromCart(key)
{
	
	
	if(window.sessionStorage.getItem(key))
	{
		
		window.sessionStorage.removeItem(key);
		getCart();
	}
}

function emptyCart()
{
	
	window.sessionStorage.clear();
	getCart();
}

function updateCart(id, qty, option)
{
	
	//todo
}

function getCart()
{
	
	$('#posts').html(""); //clear div
    
	var div = document.createElement('div');
	div.className = "news-item";
	
	if(sessionStorage.length == 0)
	{
		
		//check if cart is empty - display message
		var message = document.createElement('p');
		message.innerHTML = "<h4>cart is empty</h4>";
		
		div.appendChild(message);
	}
	else
	{
		
		var table = document.createElement('table');
		table.className = 'table dataTable no-footer';
		table.style = "table-layout:fixed";

		var thead = document.createElement('thead');
		var tr = document.createElement('tr');

		var th1 = document.createElement('th');
		th1.style = "width:20%";
		th1.innerHTML = "name";
		
		var th2 = document.createElement('th');
		th2.style = "width:15%";
		th2.innerHTML = "option";
		
		var th3 = document.createElement('th');
		th3.style = "width:15%";
		th3.innerHTML = "quantity";

		var th4 = document.createElement('th');
		th4.style = "width:10%";
		th4.innerHTML = "price";

		var th5 = document.createElement('th');
		th5.style = "width:20%";

		tr.appendChild(th1);
		tr.appendChild(th2);
		tr.appendChild(th3);
		tr.appendChild(th4);
		tr.appendChild(th5);

		thead.appendChild(tr);
		table.appendChild(thead);

		var tbody = document.createElement('tbody')

		for(var key in window.sessionStorage) 
		{

			//split key id : name : option : price = qty
			var cart_item = key.split(":");

			var row = document.createElement('tr');
			//row.className = '';

			var td1 = document.createElement('td');
			td1.innerHTML = cart_item[1];
			
			var td2 = document.createElement('td');
			td2.innerHTML = cart_item[2];

			var td3 = document.createElement('td');
			td3.innerHTML = 'x'+ window.sessionStorage.getItem(key);

			var td4 = document.createElement('td');
			td4.innerHTML = '$' + cart_item[3]; 

			var td5 = document.createElement('td');
			td5.innerHTML = "<button id='delete_"+cart_item[1]+"' type='button' class='btn btn-danger' onclick='removeFromCart(&quot;"+key+"&quot;)'>remove item</button>";

			row.appendChild(td1);
			row.appendChild(td2);
			row.appendChild(td3);
			row.appendChild(td4);
			row.appendChild(td5);

			tbody.appendChild(row);
		}
		
		//todo add total row

		table.appendChild(tbody);

		div.appendChild(table);
	}
	
	var empty_button = document.createElement('input');
	empty_button.setAttribute("type", "button");
	empty_button.className = 'btn';
	empty_button.setAttribute('value', 'empty cart');

	empty_button.onclick = function(){

		emptyCart();
	}
	
	var checkout_button = document.createElement('a');
	
	if(sessionStorage.length == 0)
    {
	   checkout_button.className = 'btn outline disabled';
    }
	else
	{
		checkout_button.className = 'btn outline';
	}
	
	checkout_button.innerHTML = 'checkout';
	checkout_button.style = "margin-right:10px;";
	checkout_button.href = "#checkout";
	
	var button_div = document.createElement('div');
	button_div.style = "float: right;";
	
	button_div.appendChild(checkout_button);
	button_div.appendChild(empty_button);
	
	div.appendChild(button_div);
	
	$('#posts').append(div);
}

function getCheckout()
{
	
	$('#posts').html(""); //clear div
    
	var div = document.createElement('div');
	div.className = "news-item";
	
	//todo
	
	$('#posts').append(div);
}

var loaded = 5;

function addLoadMoreButton()
{
	
	if(!document.getElementById('load-more-button'))
	{
		
		var button = document.createElement('input');
		button.setAttribute("type", "button");
		button.setAttribute("data-num-loaded", "5");
		button.setAttribute('value', 'show more');
		button.className = 'btn outline';
		button.id = "load-more-button";

		button.onclick = function(){
			$.ajax({
			method: 'POST',
			url: 'router.php',
			dataType: 'json',
			data: {
				route: 'get-posts',
				start: loaded,
				type: post_type
			},
			}).done(function(posts) {

				for(var i = 0; i < posts.length; i++)
				{

					var div = document.createElement('div');
					div.className = "news-item";

					var heading = document.createElement('h4');
					heading.className = "news-item-title";
					//heading.innerHTML = posts[i].title;

					var a = document.createElement('a');
					a.setAttribute('href', "#post/"+posts[i].slug);
					a.innerHTML = posts[i].title;

					heading.appendChild(a);

					var paragraph = document.createElement('p');
					paragraph.className = "news-item-desc";
					paragraph.innerHTML = posts[i].description;

					var content = document.createElement("div");
					content.innerHTML = posts[i].content;

					div.appendChild(heading);
					div.appendChild(paragraph);
					div.appendChild(content);

					//console.log(posts[i].id);
					$('#posts').append(div);
				}

				loaded += 5;
			});
		}

		$('#load-more').append(button);
	}	
}