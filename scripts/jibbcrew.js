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
        
        $("#load-more").show();
		
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

        $("#load-more").show();
        
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
        
        //getInstagramPosts(10);

        $("#load-more").show();
        
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
        
        $("#load-more").hide();
        
        $("#comments").remove();
    },
    'shop': function() {
        //ga('set', 'page', '/' + window.location.hash);
        //ga('send', 'pageview');

        $("#title").html("");
        
        $("#title").html('shop');
        
        $("#load-more").hide();
        
        $("#comments").remove();
        
        getShop();
        
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
        
        $("#load-more").hide();
        
        $("#comments").remove();
        
        getCart();
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

function getInstagramPosts(limit)
{
    
    var carousel = buildCarousel();
    
    $('#posts').html(""); //clear div
    
    $('#posts').append(carousel);
    
    var userFeed = new Instafeed({
        get: 'user',
        userId: '4629847913',
        limit: limit,
        clientId: 'f4001fdcf1574ee6a47b248fc54ae4e6',
        accessToken: '4629847913.1677ed0.647cfc4ef7a64a2680ea99f42f1e5078',
        resolution: 'standard_resolution',
        template: '<div class="item"><a href="{{link}}"><img class="img-responsive center-block" src="{{image}}" /></a></div>' //height="{{height}}" width="{{width}}"
    });
    userFeed.run();
    
    setTimeout(function(){
        $('#instafeed .item:nth-child(1)').addClass('active');
    }, 1000); //1 sec
}

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
        
            $("#load-more").hide();
    
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
        
            $("#load-more").hide();
        
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
            
			var select = document.createElement('select');
		
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
				console.log(item.id);
				
				//todo add number of items dropdown and pass to addToCart
				addToCart(item.id, number_of_items, option_selected);
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

            $('#posts').append(div);
        });
}

function getCart()
{
	
	$('#posts').html(""); //clear div
	
	//todo
}

var loaded = 5;

window.onload = function() {
    document.getElementById("load-more").onclick = function() {loadMore();};
};

function loadMore() {
    
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
};