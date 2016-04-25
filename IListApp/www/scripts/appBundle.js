// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397705
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
var AppSettings = (function () {
    function AppSettings() {
    }
    return AppSettings;
}());
var IListApp;
(function (IListApp) {
    "use strict";
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
            //  navigator.splashscreen.show();
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
            eventer(messageEvent, function (e) {
                alert(e.data);
                console.log('parent received message!:  ', e.data);
                if (e.data == "share")
                    (window.plugins).socialsharing.share('*****************************\n*****************************\nhttp://ynet.co.il\n*****************************\n*****************************');
                else if (e.data == "loaded") {
                    win.postMessage("hostedInApp", "*");
                    navigator.splashscreen.hide();
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
    })(Application = IListApp.Application || (IListApp.Application = {}));
    window.onload = function () {
        Application.initialize();
    };
})(IListApp || (IListApp = {}));
//# sourceMappingURL=appBundle.js.map