
// These two lines are required to initialize Express in Cloud Code.
var express = require('express');
var app = express();

// Global app configuration section
app.set('views', 'cloud/views');  // Specify the folder to find templates
app.set('view engine', 'ejs');    // Set the template engine
app.use(express.bodyParser());    // Middleware for reading request body

// This is an example of hooking up a request handler with a specific request
// path and HTTP verb using the Express routing API.
app.get('/', function(req, res) {
  res.render('home', { message: 'Congrats, you just set up your app!' });
});

app.get('/signup', function(req, res) {
        res.render('signup', {});
        });

==========
<div id="fb-root"></div>
<script>
    window.fbAsyncInit = function() {
        Parse.FacebookUtils.init({
            appId      : '254642391362596',
            status     : true,
            xfbml      : true
        });
    };
 
    (function(d, s, id){
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {return;}
        js = d.createElement(s); js.id = id;
        js.src = "//connect.facebook.net/en_US/all.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
 
function fLogin() {
 
    Parse.FacebookUtils.logIn(null, {
        success: function (user) {
            alert("login success with user " + JSON.stringify(user));
            if (!user.existed()) {
                alert("User signed up and logged in through Facebook!");
                //I need something similar to this? --- this.post('/login', JSON.stringify({ foo : null }));
 
            } else {
                alert("User logged in through Facebook!");
            }
            //FB.api('/me', function(response) {
              //alert("got fb me api=" + JSON.stringify(response));
               // window.location.href = '/i/Latest';
            //});
 
        },
        error: function (user, error) {
            alert("User cancelled the Facebook login or did not fully authorize.");
        }
    });
 
    }
 
 /*   function fLogout() {
        Parse.User.logOut();
        alert("logout success with user ");
        window.location.href = '/i/Latest';
    };
*/
</script>
 
<p><Strong>Login With Facebook</Strong></p>
<button class="submit" onclick="fLogin();"><img src="./images/FB-f-Logo__blue_58.png"> <span class="btn-facebook-text">Login with Facebook</span></button>

In user.js:
==========

/*// Logs in the user
  app.post('/login', function(req, res) {
     //does not work  res.render('home', { images: objects });
    Parse.User.logIn(req.body.username, req.body.password).then(function(user) {
      valid = true;
      //res.redirect('/');
       res.send();
    }, function(error) {
      // Show the error message and let the user try again
      res.render('login', { flash: error.message });
    });
  });*/
 
    // Login with FB (trying this out, no luck)
    app.post('/login', function(req, res){
        Parse.User.logIn();
        res.redirect('/');
    });


// // Example reading from the request query string of an HTTP get request.
// app.get('/test', function(req, res) {
//   // GET http://example.parseapp.com/test?message=hello
//   res.send(req.query.message);
// });

// // Example reading from the request  body of an HTTP post request.
// app.post('/test', function(req, res) {
//   // POST http://example.parseapp.com/test (with request body "message=hello")
//   res.send(req.body.message);
// });

// Attach the Express app to Cloud Code.
app.listen();
