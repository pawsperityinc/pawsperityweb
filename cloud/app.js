// this code is run when pawsperity.org spins up

// with any request that comes into the app, express examines its path and handles the routing before any code is executed that is waiting on the response

var express = require('express'); // load express

// load all dependencies for express
var parseExpressHttpsRedirect = require('parse-express-https-redirect'); // by nature express does not follow requests that come in, but instead hears nothing until .navigate()
var parseExpressCookieSession = require('parse-express-cookie-session'); // we will store the user in the cookie
var parseFacebookUserSession = require('cloud/parse-facebook-user-session'); // we will integrate with facebook in the cloud at times

var appLinks = require('applinks-metatag'); // for instance, we may want to support multiplatform use with app links, which only need to be called when navigating to a page

var app = express(); // initialize express middleware to allow for dynamically returning content by listening to different types of incoming requests and pathing them differently

// set global configurations
app.set('views', 'cloud/views'); // all the views are in the cloud/views folder
app.set('view engine', 'ejs'); // we use ejs as the templates
app.use(parseExpressHttpsRedirect());  // Require user to be on HTTPS when talking.
app.use(express.bodyParser()); // turn requests into JSON if parseable
app.use(express.cookieParser('its-all-because-we-asked-why-not')); // cookies are signed with a secret to ensure requests are intended
app.use(parseExpressCookieSession({ cookie: { maxAge: 3600000 } })); // cookies expire when not updated for awhile

// pawsperity.org currently has two apps
// www.pawsperity.org -- the world wide website
// pawson.pawsperity.org -- the volunteering companion

// we rely on parse for our user authentication
var basicAuth = express.basicAuth(function(user, pass, callback){
    Parse.User.logIn(user, pass).then(
        function () {
            if (Parse.User.current()) {
                return Parse.User.current().fetch().then(function(user){
                    callback(null, user); //returns user as req.user
                });
            } else {
                callback(null, false); //returns no errors and no user
            }
        },
        function (error) {
            callback(error, false); //returns a parse login error and no user
        }
    );
});

// right from the beginning we treat users differently if they're are identified

// first we have initial load / request to www.pawsperity.org

// if the user was here doing something set their role's perspective, resume their session

// while examining, display the splash page background, think of it as a loading screen for all pawsperity

// once examined report to all listening that the page is initialized and ready to start

// GET https://www.pawsperity.org/
app.get('/', function(req,res) {
    
    Parse.Config.get().then(function(config) {
  var splashBackground = config.get("splashbackground");
  var splashTitle = config.get("splashtitle");
  console.log(splashTitle);
        return "splash loaded as " + splashTitle;
}, function(error) {
  // Something went wrong (e.g. request timed out);
        return error;
}).then(function() {
        var currentUser = Parse.User.current();
        var promise = Parse.Promise(); // set up loading promise
if (currentUser) {
    // identifying as already logged in user, check for the user's role and set the role's perspective, if  resume user's last session, if no session take the user to their home page
    promise.resolve();
} else {
    // recognized as a web guest until proven otherwise, take the user to the splash page
    // the goal of the page is to be like an ad for pawsperity
    res.render('splash.ejs', function () {
        console.log("splash loaded and displayed, queue any animations");
    });
    promise.resolve()
}
        return promise;
    }).then(function(){
        console.log("begin animations");
    });
    
});
 

/*
// then do something like this for admins
 
app.get('/admin', basicAuth, function (req, res) {
    var user = req.user;
    app.locals.username = user.get('username');
    res.render('admin');
});
        
// You could have a "Log In" link on your website pointing to this.
app.get('/login', function(req, res) {
        // Renders the login form asking for username and password.
        res.render('login.ejs');
        });

// Clicking submit on the login form triggers this.
app.post('/login', function(req, res) {
         Parse.User.logIn(req.body.username, req.body.password).then(function() {
                                                                     // Login succeeded, redirect to homepage.
                                                                     // parseExpressCookieSession will automatically set cookie.
                                                                     res.redirect('/');
                                                                     },
                                                                     function(error) {
                                                                     // Login failed, redirect back to login form.
                                                                     res.redirect('/login');
                                                                     });
         });

// You could have a "Log Out" link on your website pointing to this.
app.get('/logout', function(req, res) {
        Parse.User.logOut();
        res.redirect('/');
        });

// The homepage renders differently depending on whether user is logged in.
app.get('/home', function(req, res) {
        if (Parse.User.current()) {
        // No need to fetch the current user for querying Note objects.
        var Note = Parse.Object.extend("Note");
        var query = new Parse.Query(Note);
        query.find().then(function(results) {
                          // Render the notes that the current user is allowed to see.
                          },
                          function(error) {
                          // Render error page.
                          });
        } else {
        // Render a public welcome page, with a link to the '/login' endpoint.
        }
        });

// You could have a "Profile" link on your website pointing to this.
app.get('/profile', function(req, res) {
        // Display the user profile if user is logged in.
        if (Parse.User.current()) {
        // We need to fetch because we need to show fields on the user object.
        Parse.User.current().fetch().then(function(user) {
                                          // Render the user profile information (e.g. email, phone, etc).
                                          },
                                          function(error) {
                                          // Render error page.
                                          });
        } else {
        // User not logged in, redirect to login form.
        res.redirect('/login');
        }
        });
*/
app.listen();