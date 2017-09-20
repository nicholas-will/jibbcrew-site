function createUser()
{
    
    var fullname = $('#fullname').val();
    
    if(validate($('#email1').val(), $('#email2').val()))
    {
        
        var email = validate($('#email1').val(), $('#email2').val());
        
        if(validate($('#password1').val(), $('#password2').val()))
        {
        
            var password = validate($('#password1').val(), $('#password2').val());
            
            $.ajax({
                method: 'POST',
                url: 'login-router.php',
                data: {
                    route: 'create-user',
                    fullname: fullname,
                    email: email,
                    password: password
                }
            }).done(function(data) {

                if(data.resp)
                {
                            
                     location.replace("login.html");
                }
                else
                {
                    
                    $('#error').html(""); //clear div
                    $('#error').append("<div class='alert alert-danger' role='alert'>"+data.message+"</div>");
                }
            });
        }
        else
        {
        
            $('#error').html(""); //clear div
            $('#error').append("<div class='alert alert-danger' role='alert'>password does not match.</div>");
        }
    }
    else
    {
        
        $('#error').html(""); //clear div
        $('#error').append("<div class='alert alert-danger' role='alert'>email does not match.</div>");
    }
    
}

function validate(value_1, value_2)
{
    
    if(value_1 && value_2)
    {
        
        if(value_1 == value_2)
        {
        
            return value_1;
        }
    }
    
    
    return false;
}