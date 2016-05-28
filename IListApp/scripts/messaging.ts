/// <reference path="index.ts" />
module IListApp {
    export enum MessageType {
        DocumentLoaded = 1,
        IsHostedInApp = 2,
        Socialsharing = 3,
        FacebookLoginRequest = 4,
        FacebookLoginResponse = 5,
        FacebookStatusRequest = 6,
        FacebookStatusResponse = 7,
    }

    export class CrossDomainCommunicationMgr {

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
                    (<any>(window.plugins)).socialsharing.share(data.body, data.title, null, null);
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

    export class CrossDomainMessage {
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

    export class SharingInfo {
        public title: string;
        public body: string;
    }
}