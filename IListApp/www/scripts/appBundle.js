var IListApp;
(function (IListApp) {
    var FacebookLoginResponse = (function () {
        function FacebookLoginResponse() {
        }
        return FacebookLoginResponse;
    }());
    IListApp.FacebookLoginResponse = FacebookLoginResponse;
    var FacebookAuthResponse = (function () {
        function FacebookAuthResponse() {
        }
        return FacebookAuthResponse;
    }());
    IListApp.FacebookAuthResponse = FacebookAuthResponse;
    var FacebookNative = (function () {
        function FacebookNative() {
        }
        FacebookNative.getLoginStatus = function () {
            if (!FacebookNative.checkSimulator()) {
                facebookConnectPlugin.getLoginStatus(function (response) {
                    IListApp.CrossDomainCommunicationMgr.sendMessageWithContent(IListApp.MessageType.FacebookStatusResponse, response);
                });
            }
        };
        FacebookNative.login = function () {
            facebookConnectPlugin.login(["public_profile", "email"], function (response) {
                IListApp.CrossDomainCommunicationMgr.sendMessageWithContent(IListApp.MessageType.FacebookLoginResponse, response);
            }, function (response) {
                alert(JSON.stringify(response));
            });
        };
        FacebookNative.getUserData = function () {
            if (!FacebookNative.checkSimulator()) {
                var graphPath = "me/?fields=id,email";
                facebookConnectPlugin.api(graphPath, [], function (response) {
                    if (response.error) {
                        alert("Uh-oh! " + JSON.stringify(response.error));
                    }
                    else {
                        alert(JSON.stringify(response));
                    }
                });
            }
        };
        FacebookNative.getNrOfFriends = function () {
            if (!FacebookNative.checkSimulator()) {
                var graphPath = "/me/friends";
                var permissions = ["user_friends"];
                facebookConnectPlugin.api(graphPath, permissions, function (response) {
                    if (response.error) {
                        alert(JSON.stringify(response.error));
                    }
                    else {
                        alert(JSON.stringify(response.summary.total_count + " friends"));
                    }
                });
            }
        };
        FacebookNative.logout = function () {
            if (!FacebookNative.checkSimulator()) {
                facebookConnectPlugin.logout(function (response) {
                    alert("You were logged out");
                });
            }
        };
        FacebookNative.getApplicationSignature = function () {
            if (!FacebookNative.checkSimulator()) {
                facebookConnectPlugin.getApplicationSignature(function (response) {
                    console.log("Signature: " + response);
                    alert("Signature: " + response);
                });
            }
        };
        FacebookNative.checkSimulator = function () {
            if (window.navigator.simulator === true) {
                alert('This plugin is not available in the simulator.');
                return true;
            }
            else if (facebookConnectPlugin === undefined) {
                alert('Plugin not found. Maybe you are running in AppBuilder Companion app which currently does not support this plugin.');
                return true;
            }
            else {
                return false;
            }
        };
        return FacebookNative;
    }());
    IListApp.FacebookNative = FacebookNative;
})(IListApp || (IListApp = {}));
// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397705
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
// If you need to access Cordova functions inside this function, make sure 'deviceready' has fired
function handleOpenURL(url) {
    // Wrapping in a little timeout, so it doesn't interfere with other app setup stuff
    setTimeout(function () {
        // The url will include your URL scheme.
        // Extract the path and params like you'd do with any other URL.
        alert("App launch URL:\n" + url);
    }, 300);
}
;
var IListApp;
(function (IListApp) {
    var Application;
    (function (Application) {
        function initialize() {
            document.addEventListener('deviceready', onDeviceReady, false);
        }
        Application.initialize = initialize;
        function onDeviceReady() {
            // Handle the Cordova pause and resume events
            document.addEventListener('pause', onPause, false);
            document.addEventListener('resume', onResume, false);
            App.init();
            // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
            //AppSettings.browser = window.open('http://192.168.1.11:9876/default.aspx', '_blank', 'titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no');
            //navigator.splashscreen.show();
            //AppSettings.browser.addEventListener("loadstop", function () {
            //    navigator.splashscreen.hide();
            //    pollForSocialShare();
            //});
        }
        function onPause() {
            // TODO: This application has been suspended. Save application state here.
        }
        function onResume() {
            // TODO: This application has been reactivated. Restore application state here.
        }
    })(Application = IListApp.Application || (IListApp.Application = {}));
    var App = (function () {
        function App() {
        }
        App.init = function () {
            var iframe = document.createElement('iframe');
            iframe.src = "http://192.168.1.11:9876/default.aspx";
            iframe.width = "100%"; //window.outerWidth.toString();
            iframe.height = "100%"; //window.outerHeight.toString();
            iframe.scrolling = "no";
            iframe.vspace = 0;
            iframe.border = "0px";
            iframe.frameBorder = "0";
            iframe.frameSpacing = "0";
            iframe.style.overflow = "hiddden";
            iframe.style.border = "none";
            iframe.style.margin = "0px";
            iframe.style.padding = "0px";
            iframe.id = "iframe";
            iframe.vspace = 0;
            iframe.marginHeight = "0px";
            iframe.scrolling = "false";
            iframe.id = "iframe";
            document.body.appendChild(iframe);
            App.win = iframe.contentWindow;
            var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
            var eventer = window[eventMethod];
            var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";
            // Listen to message from child window
            eventer(messageEvent, function (e) {
                IListApp.CrossDomainCommunicationMgr.receiveMessage(e);
            }, false);
        };
        return App;
    }());
    IListApp.App = App;
    window.onload = function () {
        Application.initialize();
    };
})(IListApp || (IListApp = {}));
/// <reference path="index.ts" />
var IListApp;
(function (IListApp) {
    (function (MessageType) {
        MessageType[MessageType["DocumentLoaded"] = 1] = "DocumentLoaded";
        MessageType[MessageType["IsHostedInApp"] = 2] = "IsHostedInApp";
        MessageType[MessageType["Socialsharing"] = 3] = "Socialsharing";
        MessageType[MessageType["FacebookLoginRequest"] = 4] = "FacebookLoginRequest";
        MessageType[MessageType["FacebookLoginResponse"] = 5] = "FacebookLoginResponse";
        MessageType[MessageType["FacebookStatusRequest"] = 6] = "FacebookStatusRequest";
        MessageType[MessageType["FacebookStatusResponse"] = 7] = "FacebookStatusResponse";
    })(IListApp.MessageType || (IListApp.MessageType = {}));
    var MessageType = IListApp.MessageType;
    var CrossDomainCommunicationMgr = (function () {
        function CrossDomainCommunicationMgr() {
        }
        CrossDomainCommunicationMgr.sendMessage = function (messageType) {
            IListApp.App.win.postMessage(CrossDomainMessage.CreateMessageWithoutContent(messageType), "*");
        };
        CrossDomainCommunicationMgr.sendMessageWithContent = function (messageType, msg) {
            IListApp.App.win.postMessage(CrossDomainMessage.CreateMessageContent(messageType, msg), "*");
        };
        CrossDomainCommunicationMgr.receiveMessage = function (event) {
            var crossDomainMessage = event.data;
            switch (crossDomainMessage.messageType) {
                case MessageType.Socialsharing:
                    var data = crossDomainMessage.content;
                    (window.plugins).socialsharing.share(data.body, data.title, null, null);
                    break;
                case MessageType.DocumentLoaded:
                    CrossDomainCommunicationMgr.sendMessage(MessageType.IsHostedInApp);
                    navigator.splashscreen.hide();
                    break;
                case MessageType.FacebookStatusRequest:
                    IListApp.FacebookNative.getLoginStatus();
                    break;
                case MessageType.FacebookLoginRequest:
                    IListApp.FacebookNative.login();
                    break;
            }
        };
        return CrossDomainCommunicationMgr;
    }());
    IListApp.CrossDomainCommunicationMgr = CrossDomainCommunicationMgr;
    var CrossDomainMessage = (function () {
        function CrossDomainMessage(messageType) {
            this.messageType = messageType;
        }
        CrossDomainMessage.CreateMessageWithoutContent = function (messageType) {
            return new CrossDomainMessage(messageType);
        };
        CrossDomainMessage.CreateMessageContent = function (messageType, content) {
            var crossDoaminMessage = new CrossDomainMessage(messageType);
            crossDoaminMessage.content = content;
            return crossDoaminMessage;
        };
        return CrossDomainMessage;
    }());
    IListApp.CrossDomainMessage = CrossDomainMessage;
    var SharingInfo = (function () {
        function SharingInfo() {
        }
        return SharingInfo;
    }());
    IListApp.SharingInfo = SharingInfo;
})(IListApp || (IListApp = {}));
//# sourceMappingURL=appBundle.js.map