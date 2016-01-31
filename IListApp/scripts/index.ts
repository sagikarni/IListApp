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

            navigator.splashscreen.show();

            var iframe = document.createElement('iframe');
            iframe.src = "http://192.168.1.11:9876/default.aspx";
            iframe.width = window.outerWidth.toString();
            iframe.height = window.outerHeight.toString();
            iframe.id = "iframe";

            document.body.appendChild(iframe);


            var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
            var eventer = window[eventMethod];
            var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

            // Listen to message from child window
            eventer(messageEvent, function (e) {
                console.log('parent received message!:  ', e.data);
                if (e.data == "share")
                    (<any>(window.plugins)).socialsharing.share('My message');
                else
                    navigator.splashscreen.hide();
            }, false);
            // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
            //AppSettings.browser = window.open('http://192.168.1.11:9876/default.aspx', '_blank', 'titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no');
            //navigator.splashscreen.show();
            //AppSettings.browser.addEventListener("loadstop", function () {
            //    navigator.splashscreen.hide();
            //    pollForSocialShare();
            //});
        }

        function pollForSocialShare() {
            AppSettings.browser.executeScript({ code: "localStorage.setItem( 'doShare', '' );" }, null);
            var loop = setInterval(function () {
                AppSettings.browser.executeScript(
                    {
                        code: "localStorage.getItem( 'doShare' )"
                    },
                    function (values) {
                        var name = values[0];
                        if (name) {
                            AppSettings.browser.executeScript(
                                {
                                    code: "localStorage.setItem( 'doShare', '' );"
                                } , null);
                            clearInterval(loop);
                            (<any>(window.plugins)).socialsharing.share('My message');
                        }
                    }
                );
            }, 500);
        }

        function onPause() {
            // TODO: This application has been suspended. Save application state here.
        }

        function onResume() {
            // TODO: This application has been reactivated. Restore application state here.
            pollForSocialShare();
        }

    }

    window.onload = function () {
        Application.initialize();
    }
}
