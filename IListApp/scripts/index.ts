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
};
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

    }

    class App {
        public static win: Window;
        public static init() {
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
            eventer(messageEvent, (e: MessageEvent) => {
                CrossDomainCommunicationMgr.receiveMessage(e);
            }, false);
        }
    }

    //#region Facebook
    declare var facebookConnectPlugin: any;

    class FacebookLoginResponse {
        public status: string;
        public authResponse: FacebookAuthResponse;

    }

    class FacebookAuthResponse {
        public userID: string;
        public accessToken: string;
        public expiresIn: number;
    }

    class FacebookNative {
        public static getLoginStatus() {
            if (!FacebookNative.checkSimulator()) {
                facebookConnectPlugin.getLoginStatus(function (response) {
                    CrossDomainCommunicationMgr.sendMessageWithContent(MessageType.FacebookStatusResponse, response);
                });
            }
        }

        public static login() {
            facebookConnectPlugin.login(["public_profile", "email"], function (response) { // do not retrieve the 'user_likes' permissions from FB as it will break the app
                CrossDomainCommunicationMgr.sendMessageWithContent(MessageType.FacebookLoginResponse, response);
            }, function (response) {
                alert(JSON.stringify(response));
            });

        }

        public static getUserData() {
            if (!FacebookNative.checkSimulator()) {
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
            if (!FacebookNative.checkSimulator()) {
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
            if (!FacebookNative.checkSimulator()) {
                facebookConnectPlugin.logout(function (response) {
                    alert("You were logged out");
                });
            }
        }

        public static getApplicationSignature() {
            if (!FacebookNative.checkSimulator()) {
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

    //#endregion
 
    //#region Messaging
    
    enum MessageType {
        DocumentLoaded = 1,
        IsHostedInApp = 2,
        Socialsharing = 3,
        FacebookLoginRequest = 4,
        FacebookLoginResponse = 5,
        FacebookStatusRequest = 6,
        FacebookStatusResponse = 7,
    }

    class CrossDomainCommunicationMgr {

        public static FacebookStatusResponse: (facebookLoginResponse: FacebookLoginResponse) => void;

        public static FacebookLoginResponse: (facebookLoginResponse: FacebookLoginResponse) => void;

        public static sendMessage(messageType: MessageType) {
            App.win.postMessage(CrossDomainMessage.CreateMessageWithoutContent(messageType), "*");
        }

        public static sendMessageWithContent(messageType: MessageType, msg: any) {
            App.win.postMessage(CrossDomainMessage.CreateMessageContent(messageType, msg), "*");
        }

        public static receiveMessage(event: MessageEvent) {
            var crossDomainMessage = <CrossDomainMessage>event.data;
            switch (crossDomainMessage.messageType) {
                case MessageType.Socialsharing:
                    var data = <SharingInfo>crossDomainMessage.content;
                    (<any>(window.plugins)).socialsharing.share(data.body,  data.title, null, null);
                    break;
                case MessageType.DocumentLoaded:
                    CrossDomainCommunicationMgr.sendMessage(MessageType.IsHostedInApp);
                    navigator.splashscreen.hide();
                    break;
                case MessageType.FacebookStatusRequest:
                    FacebookNative.getLoginStatus();
                    break;
                case MessageType.FacebookLoginRequest:
                    FacebookNative.login();
                    break;
            }

        }
    }

    class CrossDomainMessage {
        public messageType: MessageType;

        public content: any;

        constructor(messageType: MessageType) {
            this.messageType = messageType;
        }
        public static CreateMessageWithoutContent(messageType: MessageType): CrossDomainMessage {
            return new CrossDomainMessage(messageType);
        }
        public static CreateMessageContent(messageType: MessageType, content: any): CrossDomainMessage {
            var crossDoaminMessage = new CrossDomainMessage(messageType);
            crossDoaminMessage.content = content;
            return crossDoaminMessage;
        }

    }

    class SharingInfo {
        public title: string;
        public body: string;
    }
    //#endregion

    window.onload = function () {
        Application.initialize();
    }
}
