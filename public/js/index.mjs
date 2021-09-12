import { dom } from './dom.mjs';

class ChatApp {
    constructor(socket = io()) {
        this.socket = socket;
    }

    send(message) {
        this.socket.emit('message', message);
    }

    recieve(callback) {
        this.socket.on('message', msg => {
            callback(msg);
        })
    }

    disconnect() {
        console.log('disconnecting from server');
        this.socket.emit('disconnect');
    }
    onDisconnect(callback) {
        this.socket.on('disconnect', msg => {
            callback(msg);
        })
    }
}

class ChatUi {
    static MESSAGE_SENT = 'sent';
    static MESSAGE_RECIEVED = 'recieved';
    static DISCONNECTED = 'disconnected';
    static CONNECTED = 'connected';

    constructor() {

    }
    static isValidType(type) {
        let valid_types = [ ChatUi.MESSAGE_RECIEVED, ChatUi.MESSAGE_SENT, ChatUi.CONNECTED, ChatUi.DISCONNECTED ];
        return valid_types.find( t => t === type);
    }

    chatMessage(message, type=ChatUi.MESSAGE_SENT) {
        if(!ChatUi.isValidType(type)) {
            throw new Error('Failed to create chat message invalid message type: '+ type);
        }
        let chatElement = dom.makeHTMLElement('li', 
        {class: `message ${type}`});
        let timeElement = dom.makeHTMLElement('span', {class: 'time'});
        let d = new Date();
        timeElement.innerText = `${d.getHours()}:${d.getMinutes()}`;
        chatElement.innerText = message;
        chatElement.appendChild(timeElement);
        return chatElement;
    }
}




class App {
    constructor() {
        if (document.addEventListener) {
            document.addEventListener('DOMContentLoaded', this.main, true);
        } else if (document.attachEvent) {
            document.attachEvent('onreadystatechange', this.main);
        } else window.onload = this.main;
    }

    main() {
        let chatApp = new ChatApp();
        let chatUi = new ChatUi();

        let messages = dom.query('.messages-timeline');
        let message_input = dom.query('.message-input');
        let send_message_btn = dom.query('.send-message-btn');

        let sendMessage = () => {
            let message = message_input.value;
            if(message.length < 1)
                return;
            message_input.value = "";
            chatApp.send(message);
            let uiMessage = chatUi.chatMessage(message, ChatUi.MESSAGE_SENT);
            messages.appendChild(uiMessage);
        }

        chatApp.recieve(message => {
            let uiMessage = chatUi.chatMessage(message, ChatUi.MESSAGE_RECIEVED);
            messages.appendChild(uiMessage);
        });

        send_message_btn.addEventListener('click', sendMessage);

        message_input.addEventListener('keypress', event => {
            let isEnterKey = event.key.toLowerCase() === 'Enter'.toLowerCase();
            if(isEnterKey) {
                sendMessage();
            }
        })

    }
}




let app = new App();