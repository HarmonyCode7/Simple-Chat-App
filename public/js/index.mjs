import { dom } from './dom.mjs';


function makeMessage(message, type) {
    let messageElement = dom.makeHTMLElement('li', {class: `message ${type === 'recieved' ? 'reciepient': 'sent'}`});
    messageElement.innerText = message;
    return messageElement;
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
        const socket = io();
        let send_button = dom.query(".send-message-btn");
        let message_input = dom.query(".message-input");
        let messages = dom.query(".messages-timeline");
        socket.on('user-connected', msg => {
            console.log('user connected')
            let connectionMessage = dom.makeHTMLElement('li', {
                class: 'message user-connected'
            });
            connectionMessage.innerText = 'new user connnected';
            messages.appendChild(connectionMessage);
        })

        socket.on('user-disconnected', msg => {
            console.log('user connected')
            let connectionMessage = dom.makeHTMLElement('li', {
                class: 'message user-connected'
            });
            connectionMessage.innerText = 'new user connnected';
            messages.appendChild(connectionMessage);
        })
        
        send_button.addEventListener('click', () => {
            messages.appendChild(makeMessage(message_input.value, 'sent'));
            socket.emit('message', message_input.value);
            message_input.value = "";

        });
    }
}




let app = new App();