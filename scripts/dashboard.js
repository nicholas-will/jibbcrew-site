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
            content: $('#content').val(),
            //type: $('#type').val(),
            title: $('#title').val(),
            date: formattedDate,
            id: id
        }
    }).done(function(result) {
        //alert("content posted");
        $("#update_result").html(""); //clear div
        $("#update_result").append("<div class='alert alert-success' role='alert'>"+result+"</div>");
        getPostsToEdit();
    }).fail(function(result) {
        //alert("error");
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
        th1.style = "width:200px";
        th1.innerHTML = "title";
        var th2 = document.createElement('th');
        th2.style = "width:200px";
        th2.innerHTML = "description";
        var th3 = document.createElement('th');
        th3.style = "width:380px";
        th3.innerHTML = "content";
        var th4 = document.createElement('th');

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
            td3.innerHTML = posts[i].stripped_content;

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

    //console.log("id in getPostToEdit "+id);

    $.ajax({
        method: 'POST',
        url: '/router.php',
        dataType: 'html',
        data: {
            route: 'get-post-to-edit',
            id: id
        },
    }).done(function(post) {
        $('.modal-body #edit_post').html(""); //clear div
        $('.modal-body #edit_post').append(post);
    }).fail(function() {
        $('.modal-body #edit_post').html(""); //clear div
        $('.modal-body #edit_post').append("<div>Error</div>");
    });
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
