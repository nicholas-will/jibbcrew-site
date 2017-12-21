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
	var key_id = (item.id + ":" + item.name + ":" + item.slug + ":" + option + ":" + item.price);
	
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
		
		if(window.sessionStorage.getItem('total') == 0)
		{
			
			emptyCart();
		}
	}
}

function emptyCart()
{
	
	window.sessionStorage.clear();
	getCart();
}

function updateCart(key, qty)
{
	
	//todo
}

function getCart()
{
	
	$('#posts').html(""); //clear div
    
	var div = document.createElement('div');
	div.className = "news-item";
	
	if(window.sessionStorage.length == 0)
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

		var total = 0;
		
		for(var i = 0; i<window.sessionStorage.length; i++)
		{

			//split key id : name : slug : option : price = qty
			var cart_item = window.sessionStorage.key(i).split(":");
			
			if(window.sessionStorage.key(i) == 'total')
			{
				continue;
			}

			var row = document.createElement('tr');
			//row.className = '';

			var td1 = document.createElement('td');
			td1.innerHTML = cart_item[1];
			
			var td2 = document.createElement('td');
			td2.innerHTML = cart_item[3];

			var td3 = document.createElement('td');
			td3.innerHTML = 'x'+ window.sessionStorage.getItem(window.sessionStorage.key(i));

			var td4 = document.createElement('td');
			td4.innerHTML = '$' + cart_item[4]; 

			var td5 = document.createElement('td');
			td5.innerHTML = "<strong><a id='remove-"+cart_item[0]+"' style='text-decoration: none; cursor: pointer; float: right; padding-right: 20px; font-size: large;' onclick='removeFromCart(&quot;"+window.sessionStorage.key(i)+"&quot;)'>&times;</a></strong>";

			row.appendChild(td1);
			row.appendChild(td2);
			row.appendChild(td3);
			row.appendChild(td4);
			row.appendChild(td5);

			tbody.appendChild(row);
			
			total += parseFloat(cart_item[4]) * parseInt(window.sessionStorage.getItem(window.sessionStorage.key(i)));
		}
		
		//should over write every time func called
		window.sessionStorage.setItem('total', total);
		
		//add total row to bottom of cart
		var total_row = document.createElement('tr');
		
		var ttd1 = document.createElement('td');
		var ttd2 = document.createElement('td');
		var ttd3 = document.createElement('td');
		ttd3.innerHTML = "<p style='float: right;'>total: </p>";
		var ttd4 = document.createElement('td');
		ttd4.innerHTML = '<strong>$' + total.toFixed(2) + '</strong>';
		var ttd5 = document.createElement('td');
		
		total_row.appendChild(ttd1);
		total_row.appendChild(ttd2);
		total_row.appendChild(ttd3);
		total_row.appendChild(ttd4);
		total_row.appendChild(ttd5);

		tbody.appendChild(total_row);

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
	
	var states = [
    {
        "name": "Alabama",
        "abbreviation": "AL"
    },
    {
        "name": "Alaska",
        "abbreviation": "AK"
    },
    {
        "name": "Arizona",
        "abbreviation": "AZ"
    },
    {
        "name": "Arkansas",
        "abbreviation": "AR"
    },
    {
        "name": "California",
        "abbreviation": "CA"
    },
    {
        "name": "Colorado",
        "abbreviation": "CO"
    },
    {
        "name": "Connecticut",
        "abbreviation": "CT"
    },
    {
        "name": "Delaware",
        "abbreviation": "DE"
    },
    {
        "name": "District Of Columbia",
        "abbreviation": "DC"
    },
    {
        "name": "Florida",
        "abbreviation": "FL"
    },
    {
        "name": "Georgia",
        "abbreviation": "GA"
    },
    {
        "name": "Guam",
        "abbreviation": "GU"
    },
    {
        "name": "Hawaii",
        "abbreviation": "HI"
    },
    {
        "name": "Idaho",
        "abbreviation": "ID"
    },
    {
        "name": "Illinois",
        "abbreviation": "IL"
    },
    {
        "name": "Indiana",
        "abbreviation": "IN"
    },
    {
        "name": "Iowa",
        "abbreviation": "IA"
    },
    {
        "name": "Kansas",
        "abbreviation": "KS"
    },
    {
        "name": "Kentucky",
        "abbreviation": "KY"
    },
    {
        "name": "Louisiana",
        "abbreviation": "LA"
    },
    {
        "name": "Maine",
        "abbreviation": "ME"
    },
    {
        "name": "Maryland",
        "abbreviation": "MD"
    },
    {
        "name": "Massachusetts",
        "abbreviation": "MA"
    },
    {
        "name": "Michigan",
        "abbreviation": "MI"
    },
    {
        "name": "Minnesota",
        "abbreviation": "MN"
    },
    {
        "name": "Mississippi",
        "abbreviation": "MS"
    },
    {
        "name": "Missouri",
        "abbreviation": "MO"
    },
    {
        "name": "Montana",
        "abbreviation": "MT"
    },
    {
        "name": "Nebraska",
        "abbreviation": "NE"
    },
    {
        "name": "Nevada",
        "abbreviation": "NV"
    },
    {
        "name": "New Hampshire",
        "abbreviation": "NH"
    },
    {
        "name": "New Jersey",
        "abbreviation": "NJ"
    },
    {
        "name": "New Mexico",
        "abbreviation": "NM"
    },
    {
        "name": "New York",
        "abbreviation": "NY"
    },
    {
        "name": "North Carolina",
        "abbreviation": "NC"
    },
    {
        "name": "North Dakota",
        "abbreviation": "ND"
    },
    {
        "name": "Ohio",
        "abbreviation": "OH"
    },
    {
        "name": "Oklahoma",
        "abbreviation": "OK"
    },
    {
        "name": "Oregon",
        "abbreviation": "OR"
    },
    {
        "name": "Pennsylvania",
        "abbreviation": "PA"
    },
    {
        "name": "Rhode Island",
        "abbreviation": "RI"
    },
    {
        "name": "South Carolina",
        "abbreviation": "SC"
    },
    {
        "name": "South Dakota",
        "abbreviation": "SD"
    },
    {
        "name": "Tennessee",
        "abbreviation": "TN"
    },
    {
        "name": "Texas",
        "abbreviation": "TX"
    },
    {
        "name": "Utah",
        "abbreviation": "UT"
    },
    {
        "name": "Vermont",
        "abbreviation": "VT"
    },
    {
        "name": "Virginia",
        "abbreviation": "VA"
    },
    {
        "name": "Washington",
        "abbreviation": "WA"
    },
    {
        "name": "West Virginia",
        "abbreviation": "WV"
    },
    {
        "name": "Wisconsin",
        "abbreviation": "WI"
    },
    {
        "name": "Wyoming",
        "abbreviation": "WY"
    }
];
	
	$('#posts').html(""); //clear div
    
	var div = document.createElement('div');
	div.className = "news-item";
	
	var outer_div = document.createElement('div');
	//outer_div.className = 'form-group';
	outer_div.id = "checkout-container";
	outer_div.style = "padding-top: 40px; padding-right: 20px; padding-left: 20px;";
	
	var section_1 = document.createElement('div');
	section_1.id = "section-1";
	
	var row_div_1 = document.createElement('div');
	row_div_1.className = 'form-row';
	var row_div_2 = document.createElement('div');
	row_div_2.className = 'form-row';
	var col_div_1 = document.createElement('div');
	col_div_1.className = 'form-group col-sm-6';
	var col_div_2 = document.createElement('div');
	col_div_2.className = 'form-group col-sm-6';
	var col_div_3 = document.createElement('div');
	col_div_3.className = 'form-group col-sm-12';
	
	//buyer info
	var firstname_textbox = document.createElement('input');
	firstname_textbox.setAttribute('type', "text");
	firstname_textbox.setAttribute('placeholder', "first name");
	firstname_textbox.id = "first-name";
	firstname_textbox.className = 'form-control';
	
	col_div_1.appendChild(firstname_textbox);
	row_div_1.appendChild(col_div_1);
	
	var lastname_textbox = document.createElement('input');
	lastname_textbox.setAttribute('type', "text");
	lastname_textbox.setAttribute('placeholder', "last name");
	lastname_textbox.id = "last-name";
	lastname_textbox.className = 'form-control';
	
	col_div_2.appendChild(lastname_textbox);
	row_div_1.appendChild(col_div_2);
	section_1.appendChild(row_div_1);
	//outer_div.appendChild(row_div_1);
	
	var email_textbox = document.createElement('input');
	email_textbox.setAttribute('type', "text");
	email_textbox.setAttribute('placeholder', "email");
	email_textbox.id = "email";
	email_textbox.className = 'form-control';
	
	col_div_3.appendChild(email_textbox);
	row_div_2.appendChild(col_div_3);
	section_1.appendChild(row_div_2);
	
	var validation_row_div_1 = document.createElement('div');
	validation_row_div_1.className = 'form-row';
	
	var validation_div_1 = document.createElement('div');
	validation_div_1.id = "validation-section-1";
	validation_div_1.className = "form-group col-sm-12";
	//outer_div.appendChild(row_div_2);
	
	validation_row_div_1.appendChild(validation_div_1);
	section_1.appendChild(validation_row_div_1);
	
	outer_div.appendChild(section_1);
	
	//next section button
	var next_section_div_1 = document.createElement('div');
	next_section_div_1.style = "text-align: center; padding: 20px;";
	next_section_div_1.id = "next-section-1";
	
	var next_section_button_1 = document.createElement('input');
	next_section_button_1.setAttribute("type", "button");
	next_section_button_1.className = 'btn outline';
	next_section_button_1.setAttribute('value', 'next');

	next_section_button_1.onclick = function(){

		//un hide shipping info
		//validate fields
		
		if(isEmpty($('#first-name').val()))
		{
			
			//console.log('missing field: first-name');
			var notification_div = document.createElement('div');
			//notification_div.id = "notification";
			notification_div.className = "alert alert-danger alert-dismissable";
			//notification_div.style = "display:none;";

			var close = document.createElement('a');
			close.className = "close";
			close.setAttribute('data-dismiss', "alert");
			close.setAttribute('aria-label', "close");
			close.innerHTML = "&times;";

			notification_div.appendChild(close);

			var notification_mess = document.createElement('p');
			notification_mess.innerHTML = "missing first name";
			notification_div.appendChild(notification_mess);
			
			document.getElementById('validation-section-1').appendChild(notification_div);
		}
		else if(isEmpty($('#last-name').val()))
		{
			
			//console.log('missing field: last-name');
			var notification_div = document.createElement('div');
			//notification_div.id = "notification";
			notification_div.className = "alert alert-danger alert-dismissable";
			//notification_div.style = "display:none;";

			var close = document.createElement('a');
			close.className = "close";
			close.setAttribute('data-dismiss', "alert");
			close.setAttribute('aria-label', "close");
			close.innerHTML = "&times;";

			notification_div.appendChild(close);

			var notification_mess = document.createElement('p');
			notification_mess.innerHTML = "missing last name";
			notification_div.appendChild(notification_mess);
			
			document.getElementById('validation-section-1').appendChild(notification_div);
		}
		else if(isEmpty($('#email').val()))
		{
				
			//console.log('missing field: email');
			var notification_div = document.createElement('div');
			//notification_div.id = "notification";
			notification_div.className = "alert alert-danger alert-dismissable";
			//notification_div.style = "display:none;";

			var close = document.createElement('a');
			close.className = "close";
			close.setAttribute('data-dismiss', "alert");
			close.setAttribute('aria-label', "close");
			close.innerHTML = "&times;";

			notification_div.appendChild(close);

			var notification_mess = document.createElement('p');
			notification_mess.innerHTML = "missing email";
			notification_div.appendChild(notification_mess);
			
			document.getElementById('validation-section-1').appendChild(notification_div);
		}
		else
		{
			
			$('#next-section-1').hide();
			$('#validation-section-1').html("");
		
			$('#section-2').show();
			$('#next-section-2').show();
		}
	}
	
	next_section_div_1.appendChild(next_section_button_1);
	outer_div.appendChild(next_section_div_1);
	
	var section_2 = document.createElement('div');
	section_2.id = "section-2";
	section_2.style = "display: none;";
	
	var row_div_3 = document.createElement('div');
	row_div_3.className = 'form-row';
	var row_div_4 = document.createElement('div');
	row_div_4.className = 'form-row';
	var row_div_5 = document.createElement('div');
	row_div_5.className = 'form-row';
	var row_div_6 = document.createElement('div');
	row_div_6.className = 'form-row';
	
	var col_div_4 = document.createElement('div');
	col_div_4.className = 'form-group col-sm-12';
	var col_div_5 = document.createElement('div');
	col_div_5.className = 'form-group col-sm-12';
	var col_div_6 = document.createElement('div');
	col_div_6.className = 'form-group col-sm-6';
	var col_div_7 = document.createElement('div');
	col_div_7.className = 'form-group col-sm-6';
	var col_div_8 = document.createElement('div');
	col_div_8.className = 'form-group col-sm-6';
	var col_div_9 = document.createElement('div');
	col_div_9.className = 'form-group col-sm-6';
	
	//shipping info
	//address address 2 city state zip country
	var address_1_textbox = document.createElement('input');
	address_1_textbox.setAttribute('type', "text");
	address_1_textbox.setAttribute('placeholder', "address");
	address_1_textbox.id = "address-1";
	address_1_textbox.className = 'form-control';
	
	col_div_4.appendChild(address_1_textbox);
	row_div_3.appendChild(col_div_4);
	section_2.appendChild(row_div_3);
	//outer_div.appendChild(row_div_3);
	
	var address_2_textbox = document.createElement('input');
	address_2_textbox.setAttribute('type', "text");
	address_2_textbox.setAttribute('placeholder', "address 2");
	address_2_textbox.id = "address-2";
	address_2_textbox.className = 'form-control';
	
	col_div_5.appendChild(address_2_textbox);
	row_div_4.appendChild(col_div_5);
	section_2.appendChild(row_div_4);
	//outer_div.appendChild(row_div_4);
	
	var city_textbox = document.createElement('input');
	city_textbox.setAttribute('type', "text");
	city_textbox.setAttribute('placeholder', "city");
	city_textbox.id = "city";
	city_textbox.className = 'form-control';
	
	col_div_6.appendChild(city_textbox);
	row_div_5.appendChild(col_div_6);
	
	//state
	var state_select = document.createElement('select');
	state_select.id = "state-select";
	state_select.className = 'form-control';
	
	col_div_7.appendChild(state_select);
	row_div_5.appendChild(col_div_7);
	section_2.appendChild(row_div_5);
	//outer_div.appendChild(row_div_5);
	
	//zip
	var zipcode_textbox = document.createElement('input');
	zipcode_textbox.setAttribute('type', "text");
	zipcode_textbox.setAttribute('placeholder', "zip code");
	zipcode_textbox.id = "zipcode";
	zipcode_textbox.className = 'form-control';
	
	col_div_8.appendChild(zipcode_textbox);
	row_div_6.appendChild(col_div_8);
	
	//country US
	var country_select = document.createElement('select');
	country_select.id = "country-select";
	country_select.className = 'form-control';
	
	col_div_9.appendChild(country_select);
	row_div_6.appendChild(col_div_9);
	section_2.appendChild(row_div_6);
	//outer_div.appendChild(row_div_6);
	
	var validation_row_div_2 = document.createElement('div');
	validation_row_div_2.className = 'form-row';
	
	var validation_div_2 = document.createElement('div');
	validation_div_2.id = "validation-section-2";
	validation_div_2.className = "form-group col-sm-12";
	//outer_div.appendChild(row_div_2);
	
	validation_row_div_2.appendChild(validation_div_2);
	section_2.appendChild(validation_row_div_2);
	
	outer_div.appendChild(section_2);
	
	//next section button
	var next_section_div_2 = document.createElement('div');
	next_section_div_2.style = "text-align: center; padding: 20px; display: none;";
	next_section_div_2.id = "next-section-2";
	
	var next_section_button_2 = document.createElement('input');
	next_section_button_2.setAttribute("type", "button");
	next_section_button_2.className = 'btn outline';
	next_section_button_2.setAttribute('value', 'next');

	next_section_button_2.onclick = function(){

		if(isEmpty($('#address-1').val()))
		{
			
			//console.log('missing field: address');
			var notification_div = document.createElement('div');
			//notification_div.id = "notification";
			notification_div.className = "alert alert-danger alert-dismissable";
			//notification_div.style = "display:none;";

			var close = document.createElement('a');
			close.className = "close";
			close.setAttribute('data-dismiss', "alert");
			close.setAttribute('aria-label', "close");
			close.innerHTML = "&times;";

			notification_div.appendChild(close);

			var notification_mess = document.createElement('p');
			notification_mess.innerHTML = "missing address";
			notification_div.appendChild(notification_mess);
			
			document.getElementById('validation-section-2').appendChild(notification_div);
		}
		else if(isEmpty($('#city').val()))
		{
				
			//console.log('missing field: city');
			var notification_div = document.createElement('div');
			//notification_div.id = "notification";
			notification_div.className = "alert alert-danger alert-dismissable";
			//notification_div.style = "display:none;";

			var close = document.createElement('a');
			close.className = "close";
			close.setAttribute('data-dismiss', "alert");
			close.setAttribute('aria-label', "close");
			close.innerHTML = "&times;";

			notification_div.appendChild(close);

			var notification_mess = document.createElement('p');
			notification_mess.innerHTML = "missing city";
			notification_div.appendChild(notification_mess);
			
			document.getElementById('validation-section-2').appendChild(notification_div);
		}
		else if(isEmpty($('#zipcode').val()))
		{
				
			//console.log('missing field: city');
			var notification_div = document.createElement('div');
			//notification_div.id = "notification";
			notification_div.className = "alert alert-danger alert-dismissable";
			//notification_div.style = "display:none;";

			var close = document.createElement('a');
			close.className = "close";
			close.setAttribute('data-dismiss', "alert");
			close.setAttribute('aria-label', "close");
			close.innerHTML = "&times;";

			notification_div.appendChild(close);

			var notification_mess = document.createElement('p');
			notification_mess.innerHTML = "missing zip code";
			notification_div.appendChild(notification_mess);
			
			document.getElementById('validation-section-2').appendChild(notification_div);
		}
		else
		{
			
			$('#next-section-2').hide();
			$('#validation-section-2').html("");
		
			$('#section-3').show();
			//$('#next-section-3').show();
		}
	}
	
	next_section_div_2.appendChild(next_section_button_2);
	outer_div.appendChild(next_section_div_2);
	
	var section_3 = document.createElement('div');
	section_3.id = "section-3";
	section_3.style = "display: none;";
	
	//payment (paypal)
	var pp_button_div = document.createElement('div');
	pp_button_div.id = "paypal-button-div";
	pp_button_div.style = "padding: 20px; text-align: center;";
	
	var pp_button = document.createElement('div');
	pp_button.id = "paypal-button";
	
	pp_button_div.appendChild(pp_button);
	
	section_3.appendChild(pp_button_div);
	
	outer_div.appendChild(section_3);
	
	//summary maybe eventually
	//totals maybe eventually
	
	//paypal message
	var section_4 = document.createElement('div');
	section_4.id = "section-4";

	var pp_message_div = document.createElement('div');
	pp_message_div.id = "paypal-message";
	
	section_4.appendChild(pp_message_div);
	
	outer_div.appendChild(section_4);
	
	div.appendChild(outer_div);
	
	$('#posts').append(div);
	
	addPayPalButton();
	
	//add state values
	$.each(states, function (key, value) {
		$('<option>').val(value.abbreviation).text(value.name).appendTo("#state-select");
	});
	
	//add country value
	$('<option>').val('US').text('United States').appendTo("#country-select");
}

function isEmpty(value)
{
	
//    return ((value !== '') && (value !== undefined) && (value.length > 0) && (value !== null));
	
	if(jQuery.trim(value).length > 0)
	{
	   
		return false;
	}

	return true;
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

function addPayPalButton()
{
	
	if(document.getElementById('paypal-button'))
   	{
		
	   paypal.Button.render({

		env: 'sandbox', // Or 'sandbox', production
		   
	   client: {
            sandbox:    'AcuRDLytnBkUVIPd9r-sITwtKVxSFVo-as8SjXzCds3Nsy8co03OQP_R3Q3uzdgnE6jE0e-3ubnbJg8v',
            production: 'ATyWF7wMmiK0jOIP80WxE9WNyO4PycP9k3bmicFRusluHLV3nXAswZpJc-3KiZCX-crgyoBVJeu-fDCS'
        },

		commit: true, // Show a 'Pay Now' button

		style: {
            label: 'paypal',  // checkout | credit | pay | buynow | generic
            size:  'small', // small | medium | large | responsive
            shape: 'pill',   // pill | rect
            color: 'black'   // gold | blue | silver | black
        },

		payment: function(data, actions) {
			
			console.log("payment");
			
			//build item list made up of items and shipping address
			var item_list = {};
			var items = [];
			
			for(var i = 0; i<window.sessionStorage.length; i++)
			{

				//split key id : name : slug : option : price = qty
				var cart_item = window.sessionStorage.key(i).split(":");
			
				if(window.sessionStorage.key(i) == 'total')
				{
					continue;
				}
				
				items.push({
					name: cart_item[1],
					description: cart_item[3],
					quantity: window.sessionStorage.getItem(window.sessionStorage.key(i)),
					price: cart_item[4],
					sku: cart_item[0],
					currency: "USD"
				});
			}
			
			item_list.items = items;
			item_list.shipping_address = {
				  recipient_name: $('#first-name').val() + " " + $('#last-name').val(),
				  line1: $('#address-1').val(),
				  line2: $('#address-2').val(),
				  city: $('#city').val(),
				  country_code: $('#country-select').val(),
				  postal_code: $('#zipcode').val(),
				  state: $('#state-select').val()
			};
			
			//console.log(item_list);
			
			//create invoice number
			var invoice_number = Math.floor((Math.random() * 1000000) + 1);
			
			return actions.payment.create({
				payment: {
					transactions: [{
						amount: {
							total: Number(window.sessionStorage.getItem('total')).toFixed(2), 
							currency: 'USD' 
						},
						description: "Purchased from jibbcrew.com",
						invoice_number: invoice_number,
						item_list: item_list
					}]
				}
			});
    	},

		onAuthorize: function(data, actions) {
			
			console.log('onAuthorize');
			
//			var payment = {
//					  "id":"PAY-0WE61920H6707341VLIVB5AA",
//					  "intent":"sale",
//					  "state":"approved",
//					  "cart":"4Y476081UC542354U",
//					  "create_time":"2017-12-08T05:15:11Z",
//					  "payer":{
//						  "payment_method":"paypal",
//						  "status":"VERIFIED",
//						  "payer_info":{
//							  "email":"jibbcrewatl-buyer@gmail.com",
//							  "first_name":"test",
//							  "middle_name":"test",
//							  "last_name":"buyer",
//							  "payer_id":"ZSBJPRYJTLCZJ",
//							  "country_code":"US",
//							  "shipping_address":{
//								  "recipient_name":"testy testerson",
//								  "line1":"880 glendale ter ne",
//								  "city":"atlanta",
//								  "state":"GA",
//								  "postal_code":"30308",
//								  "country_code":"US"
//							  }
//						  }
//					  },
//					  "transactions":[{
//						  "invoice_number":"304454",
//						  "amount":{
//							  "total":"33.00",
//							  "currency":"USD",
//							  "details":{}
//						  },
//						  "item_list":{
//							  "items":[{
//								  "name":"test 2",
//								  "sku":"2",
//								  "price":"15.00",
//								  "currency":"USD",
//								  "quantity":2,
//								  "description":"L"
//						  		},
//							   {
//								   "name":"blahhhshd 3",
//								   "sku":"5",
//								   "price":"1.00",
//								   "currency":"USD",
//								   "quantity":3,
//								   "description":""
//							   }]
//						  },
//						  "related_resources":[{
//							  "sale":{
//								  "id":"5WR73135LJ5390746",
//								  "state":"completed",
//								  "payment_mode":"INSTANT_TRANSFER",
//								  "protection_eligibility":"ELIGIBLE",
//								  "parent_payment":"PAY-0WE61920H6707341VLIVB5AA",
//								  "create_time":"2017-12-08T05:15:11Z",
//								  "update_time":"2017-12-08T05:15:11Z",
//								  "amount":{
//									  "total":"33.00",
//									  "currency":"USD",
//									  "details":{
//										  "subtotal":"33.00"
//									  }
//								  }
//							  }
//						  }]
//					  }]
//				  };
			
				
		  return actions.payment.execute().then(function(payment) {
			  	
			  	//build order
			  	for(var i = 0; i < payment.transactions[0].item_list.items.length; i++)
				{

					$.ajax({
					method: 'POST',
					url: 'shop-router.php',
					dataType: 'json',
					data: {
							route: 'add-item-to-order',
							first_name: payment.payer.payer_info.first_name,
							last_name: payment.payer.payer_info.last_name,
							email: payment.payer.payer_info.email,
							address: payment.payer.payer_info.shipping_address.line1,
							address_2: (payment.payer.payer_info.shipping_address.line2 || ''),
							city: payment.payer.payer_info.shipping_address.city,
							state: payment.payer.payer_info.shipping_address.state,
							zip_code: payment.payer.payer_info.shipping_address.postal_code,
							country: payment.payer.payer_info.country_code,
							order_number: payment.transactions[0].invoice_number,
							order_date: payment.transactions[0].related_resources[0].sale.create_time,
							order_total: payment.transactions[0].amount.total,
							item_price: payment.transactions[0].item_list.items[i].price,
							item_name: payment.transactions[0].item_list.items[i].name,
							item_option: payment.transactions[0].item_list.items[i].description,
							item_quantity: payment.transactions[0].item_list.items[i].quantity,
							item_id: payment.transactions[0].item_list.items[i].sku
						},
					}).done(function(data) {

						if(data.resp)
						{

							console.log('added item to order');
						}
						
					});
				}
			  
			  	buildPPNotification("checkout success", 'success');
			  
			  //todo build success page then empty cart
			  	emptyCart();
		  });
		},

		onCancel: function(data, actions) {
			/* 
			 * Buyer cancelled the payment 
			 */
			
			buildPPNotification("checkout cancelled", 'warning');
		},

		onError: function(err) {
			
			console.log('onError');
				
			if(err)
		   	{
				
				buildPPNotification('PayPal error, check address and user information is correct', 'error');
		   	}
			
		}

		}, '#paypal-button');
   	}
}

function buildPPNotification(message, type)
{
	
	//add paypal message
	var notification_div = document.createElement('div');
	//notification_div.id = "notification";
	
	switch(type)
	{
			
		case 'error' :
			notification_div.className = "alert alert-danger alert-dismissable";
			break;
			
		case 'success' :
			notification_div.className = "alert alert-success alert-dismissable";
			break;
			
		case 'warning' :
			notification_div.className = "alert alert-warning alert-dismissable";
			break;		
	}	

	var close = document.createElement('a');
	close.className = "close";
	close.setAttribute('data-dismiss', "alert");
	close.setAttribute('aria-label', "close");
	close.innerHTML = "&times;";

	notification_div.appendChild(close);

	var notification_mess = document.createElement('p');
	notification_mess.innerHTML = message;

	notification_div.appendChild(notification_mess);

	$('#paypal-message').append(notification_div);
}

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