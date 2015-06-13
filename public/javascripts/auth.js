$(document).ready(function () {
   /*
    Background slide show
     */
    $.backstretch([
        "/images/food.jpg",
        "/images/tokyoRestaurant.jpg",
        "/images/music.jpg"
    ], {duration: 3000, fade: 750});

    /*
    Tooltips
    TEMPORARY
     */
    $('.links a.home').tooltip();
    $('.links a.business').tooltip();

    /*
    Form Validation for registration
     */
    $('.register form').submit(function () {
        $(this).find("label[for='email']").html('Email');
        $(this).find("label[for='username']").html('Username')
        $(this).find("label[for='password']").html('Password')
        $(this).find("label[for='confirm']").html('Confirm Password')

        var email = $(this).find('input#email').val();
        var username = $(this).find('input#username').val();
        var password = $(this).find('input#password').val();
        var confirm = $(this).find('input#confirm').val();
        if (email == '') {
            $(this).find("label[for='email']").append("<span style='display:none' class='red'> - Please enter a valid email");
            $(this).find("label[for='email'] span").fadeIn('medium');
            return false;
        }
        if (username == '') {
            $(this).find("label[for='username']").append("<span style='display:none' class='red'> - Please enter a username");
            $(this).find("label[for='username'] span").fadeIn('medium');
            return false;
        }
        if (password == '') {
            $(this).find("label[for='password']").append("<span style='display:none' class='red'> - Please enter a password");
            $(this).find("label[for='password'] span").fadeIn('medium');
            return false;
        }
        if (confirm == '') { // TODO: Check if field matches password field!
            $(this).find("label[for='confirm']").append("<span style='display:none' class='red'> - Please confirm password");
            $(this).find("label[for='confirm'] span").fadeIn('medium');
            return false;
        }
    });

    /*
     Form Validation for login
     */
    $('.login form').submit(function () {
        $(this).find("label[for='usernameLogin']").html('Username')
        $(this).find("label[for='passwordLogin']").html('Password')

        var username = $(this).find('input#usernameLogin').val();
        var password = $(this).find('input#passwordLogin').val();
        // TODO: Confirm if correct credentials
        if (username == '') {
            $(this).find("label[for='usernameLogin']").append("<span style='display:none' class='red'> - Please enter a username");
            $(this).find("label[for='usernameLogin'] span").fadeIn('medium');
            return false;
        }
        if (password == '') {
            $(this).find("label[for='passwordLogin']").append("<span style='display:none' class='red'> - Please enter a password");
            $(this).find("label[for='passwordLogin'] span").fadeIn('medium');
            return false;
        }
    });
});