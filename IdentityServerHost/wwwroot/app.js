/// <reference path="lib/oidc-client.js" />

var config = {
    authority: "http://localhost:5000/",
    client_id: "spa",
    redirect_uri: window.location.origin + "/callback.html",
    post_logout_redirect_uri: window.location.origin + "/index.html",

    // these two will be done dynamically from the buttons clicked, but are
    // needed if you want to use the silent_renew
    response_type: "code",
    scope: "openid profile email IdentityServerApi",

    // this will toggle if profile endpoint is used
    loadUserInfo: true,

    // silent renew will get a new access_token via an iframe 
    // just prior to the old access_token expiring (60 seconds prior)
    silent_redirect_uri: window.location.origin + "/silent.html",
    automaticSilentRenew: true
};
Oidc.Log.logger = window.console;
Oidc.Log.level = Oidc.Log.INFO;

var mgr = new Oidc.UserManager(config);

mgr.events.addUserLoaded(function (user) {
    log("User loaded");
    showTokens();
});
mgr.events.addUserUnloaded(function () {
    log("User logged out locally");
    showTokens();
});
mgr.events.addAccessTokenExpiring(function () {
    log("Access token expiring...");
});
mgr.events.addSilentRenewError(function (err) {
    log("Silent renew error: " + err.message);
});
mgr.events.addUserSignedOut(function () {
    log("User signed out of OP");
});

function login() {
    mgr.signinRedirect();
}

function logout() {
    mgr.signoutRedirect();
}

function callApi() {
    mgr.getUser().then(function (user) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function (e) {
            if (xhr.status >= 400) {
                display("#ajax-result", {
                    status: xhr.status,
                    statusText: xhr.statusText,
                    wwwAuthenticate: xhr.getResponseHeader("WWW-Authenticate")
                });
            }
            else {
                display("#ajax-result", xhr.response);
            }
        };
        xhr.open("GET", "http://localhost:5000/test", true);
        xhr.setRequestHeader("Authorization", "Bearer " + user.access_token);
        xhr.send();
    });
}

if (window.location.hash) {
    handleCallback();
}

document.querySelector(".login").addEventListener("click", login, false);
document.querySelector(".call").addEventListener("click", callApi, false);
document.querySelector(".logout").addEventListener("click", logout, false);


function log(data) {
    document.getElementById('response').innerText = '';

    Array.prototype.forEach.call(arguments, function (msg) {
        if (msg instanceof Error) {
            msg = "Error: " + msg.message;
        }
        else if (typeof msg !== 'string') {
            msg = JSON.stringify(msg, null, 2);
        }
        document.getElementById('response').innerHTML += msg + '\r\n';
    });
}

function display(selector, data) {
    if (data && typeof data === 'string') {
        try {
            data = JSON.parse(data);
        }
        catch (e) { }
    }
    if (data && typeof data !== 'string') {
        data = JSON.stringify(data, null, 2);
    }
    document.querySelector(selector).textContent = data;
}

function showTokens() {
    mgr.getUser().then(function (user) {
        if (user) {
            display("#id-token", user);
        }
        else {
            log("Not logged in");
        }
    });
}
showTokens();

function handleCallback() {
    mgr.signinRedirectCallback().then(function (user) {
        var hash = window.location.hash.substr(1);
        var result = hash.split('&').reduce(function (result, item) {
            var parts = item.split('=');
            result[parts[0]] = parts[1];
            return result;
        }, {});

        log(result);
        showTokens();

        window.history.replaceState({},
            window.document.title,
            window.location.origin + window.location.pathname);

    }, function (error) {
        log(error);
    });
}