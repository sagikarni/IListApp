
declare var facebookConnectPlugin: any;
module IListApp {
    export class FacebookLoginResponse {
        public status: string;
        public authResponse: FacebookAuthResponse;

    }

    export class FacebookAuthResponse {
        public userID: string;
        public accessToken: string;
        public expiresIn: number;
    }

    export class FacebookNative {
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
}