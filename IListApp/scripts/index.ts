// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397705
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.

class AppSettings {
    public static browser: InAppBrowser;
}
module IListApp {
    "use strict";

    export module Application {
        export function initialize() {
            document.addEventListener('deviceready', onDeviceReady, false);
        }

        function onDeviceReady() {

            // Handle the Cordova pause and resume events
            document.addEventListener('pause', onPause, false);
            document.addEventListener('resume', onResume, false);

          //  navigator.splashscreen.show();

            var iframe = document.createElement('iframe');
          

            iframe.src = "http://192.168.1.11:9876/default.aspx";
            iframe.width = "100%";//window.outerWidth.toString();
            iframe.height = "100%";//window.outerHeight.toString();
            iframe.scrolling = "no";
            iframe.vspace = 0;
            iframe.border = "0px";
            iframe.frameBorder = "0";
            iframe.frameSpacing = "0";
            iframe.style.overflow = "hiddden";
            iframe.style.border = "none";
            iframe.style.margin = "0px";
            iframe.style.padding = "0px";
            iframe.style.backgroundColor = "red";
            iframe.id = "iframe";
            iframe.vspace = 0;
            iframe.marginHeight = "0px";
            iframe.scrolling = "false";
            iframe.id = "iframe";
           document.body.appendChild(iframe);
     
 
           var win = iframe.contentWindow;


            var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
            var eventer = window[eventMethod];
            var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";
            
            // Listen to message from child window
            eventer(messageEvent, (e: MessageEvent) => {
              
                var crossDoaminMessage = <CrossDoaminMessage>e.data;
                 console.log('parent received message!:  ', e.data);
                 
                if (crossDoaminMessage.messageType == MessageType.WhatsUpShare)
                    (<any>(window.plugins)).socialsharing.share('*****************************\n*****************************\nhttp://ynet.co.il\n*****************************\n*****************************');
                else if (crossDoaminMessage.messageType == MessageType.DocumentLoaded ) {
                    win.postMessage(CrossDoaminMessage.CreateMessageWithoutContent(MessageType.IsHostedInApp), "*");
                    navigator.splashscreen.hide();
                }
                else if (crossDoaminMessage.messageType == MessageType.FacebookLogin) {
                    FacebookHelper.login();
                }
            }, false);
            
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

    }


    declare var facebookConnectPlugin: any;

    class FacebookHelper {


        public static getLoginStatus() {
            if (!FacebookHelper.checkSimulator()) {
                facebookConnectPlugin.getLoginStatus(function (response) {
                    if (response.status === "connected") {
                        alert("You are logged in, details:\n\n" + JSON.stringify(response.authResponse));
                    } else {
                        alert("You are not logged in");
                    }
                });
            }
        }

        public static login() {
            facebookConnectPlugin.login(["email"], function (response) { // do not retrieve the 'user_likes' permissions from FB as it will break the app
                alert(response.status);
                if (response.status === "connected") {
                    // contains the 'status' - bool, 'authResponse' - object with 'session_key', 'accessToken', 'expiresIn', 'userID'
                    alert("You are: " + response.status + ", details:\n\n" + JSON.stringify(response));
                } else {
                    alert("You are not logged in");
                }
            }, function (response) {
                alert(JSON.stringify(response));

            });

        }

        public static getUserData() {
            if (!FacebookHelper.checkSimulator()) {
                var graphPath = "me/?fields=id,email";
                facebookConnectPlugin.api(graphPath, [],
                    function (response) {
                        if (response.error) {
                            alert("Uh-oh! " + JSON.stringify(response.error));
                        } else {
                            alert(JSON.stringify(response));
                        }
                    });
            }
        }

        public static getNrOfFriends() {
            if (!FacebookHelper.checkSimulator()) {
                var graphPath = "/me/friends";
                var permissions = ["user_friends"];
                facebookConnectPlugin.api(graphPath, permissions,
                    function (response) {
                        if (response.error) {
                            alert(JSON.stringify(response.error));
                        } else {
                            alert(JSON.stringify(response.summary.total_count + " friends"));
                        }
                    });
            }
        }

        public static logout() {
            if (!FacebookHelper.checkSimulator()) {
                facebookConnectPlugin.logout(function (response) {
                    alert("You were logged out");
                });
            }
        }

        public static getApplicationSignature() {
            if (!FacebookHelper.checkSimulator()) {
                facebookConnectPlugin.getApplicationSignature(function (response) {
                    console.log("Signature: " + response);
                    alert("Signature: " + response);
                });
            }
        }

        public static checkSimulator() {
            if ((<any>window.navigator).simulator === true) {
                alert('This plugin is not available in the simulator.');
                return true;
            } else if (facebookConnectPlugin === undefined) {
                alert('Plugin not found. Maybe you are running in AppBuilder Companion app which currently does not support this plugin.');
                return true;
            } else {
                return false;
            }
        }
    }

    enum MessageType {
        DocumentLoaded = 1,
        IsHostedInApp = 2,
        WhatsUpShare = 3,
        FacebookLogin = 4,
    }

    class CrossDoaminMessage {
        public messageType: MessageType;

        public content: any;

        constructor(messageType: MessageType) {
            this.messageType = messageType;
        }
        public static CreateMessageWithoutContent(messageType: MessageType): CrossDoaminMessage {
            return new CrossDoaminMessage(messageType);
        }
        public static CreateMessageContent(messageType: MessageType, content: any): CrossDoaminMessage {
            var crossDoaminMessage = new CrossDoaminMessage(messageType);
            crossDoaminMessage.content = content;
            return crossDoaminMessage;
        }

    }


    window.onload = function () {
        Application.initialize();
    }
}
