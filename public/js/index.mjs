import { dom } from './dom.mjs';

function commandToEmoji(message) {
    let emojiCommands = [
        {command: ':smile', emoji: '😁'},
        {command: ":shock", emoji: '😱'},
        {command: ":laugh", emoji: '😂'},
        {command: ':love', emoji: '🥰'},
        {command: ':upset', emoji: '😫'},
        {command: ':wink', emoji: '😉'}
    ]

    emojiCommands.forEach(command => {
        message = message.replaceAll(command.command, command.emoji);
        console.log(message);
    })
    console.log(message);
    return message;
}

function makeLink(message, condition) {
    return message.replace(condition, "<a href='' class='links'>&nbsp;$&&nbsp;</a>");
}

class ChatApp {
    constructor(socket = io()) {
        this.socket = socket;
    }

    send(message, message_event='message') {
        this.socket.emit(message_event, message);
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
        if(message.length < 1)
            return;
        if(!ChatUi.isValidType(type)) {
            throw new Error('Failed to create chat message invalid message type: '+ type);
        }
        //change emoji commands to actual emojis
        message = commandToEmoji(message);
        //transform links with https 
        let http_link = new RegExp(/http:\/\/(?:\S)+/, 'g');
        message = makeLink(message, http_link);
        let https_link = new RegExp(/https:\/\/(?:\S)+/, 'g');
        message = makeLink(message, http_link);
        //transform @tags to links using achor tags
        message = makeLink(message, /@(?:\S)+/g);
        
        let chatElement = dom.makeHTMLElement('li', 
        {class: `chatroom-message ${type}`});
        let timeElement = dom.makeHTMLElement('span', {class: 'time'});
        let d = new Date();
        console.log(d.getHours());
        console.log(d.getHours() < 10);
        let hour = Number(d.getHours()) < 10 ? `0${d.getHours()}` : d.getHours();
        let minute = Number(d.getMinutes()) < 10 ? `0${d.getMinutes()}` : d.getMinutes();

        timeElement.innerText = `${hour}:${minute}`;
        chatElement.innerHTML = message;
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
        let chatUI = new ChatUi();
        let chatinput_message = dom.query('.chatinput-message');
        let chatroom_messages = dom.query('.chatroom-messages'); //the timeline for chat messages
        let chatroom_message = dom.query('.chatroom-message');
        let chatbutton_send_message = dom.query('.chatbutton-send-message');

        
        //send message when we click send
        chatbutton_send_message.addEventListener('click', function () {
            let message = chatinput_message.value;
            if(message.length < 1)
                return;
            chatApp.send(message);
            chatinput_message.value = ""; //clear input
            let uiMessage = chatUI.chatMessage(message);
            chatroom_messages.appendChild(uiMessage);
        })

        chatinput_message.addEventListener('keypress', event => {
            if(event.key.toLowerCase() !== 'enter')
                chatApp.send('name of user typing','istyping');
            else {
                let message = chatinput_message.value;
                let uiMessage = chatUI.chatMessage(message, ChatUi.MESSAGE_SENT);
                chatroom_messages.appendChild(uiMessage);
                chatApp.send(message);
                chatinput_message.value = "";
            }

        })

        //listen for incomming messages
        chatApp.recieve(message => {
            if(message.length < 1)
                return;
            let uiMessage = chatUI.chatMessage(message, ChatUi.MESSAGE_RECIEVED);
            chatroom_messages.appendChild(uiMessage);
        });

    }
}




let app = new App();