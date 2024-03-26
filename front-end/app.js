const url = "wss://netwerkenbasis.com:8884";

//random client ID aanmaken
const clientId = 'user-' + Math.random().toString(16).substr(2, 7);

var select_input = document.getElementById('input-field');
select_input.select();

const options = {
	clean: true,
	connectTimeout: 4000,
	clientId: clientId,
	username: 'student',
	password: 'welkom01'
};

//mqtt client aanmaken
const client = mqtt.connect(url, options);

//eventhandler voor wanneer client verbinding maakt met broker
client.on("connect", () => {
	console.log('Connected');
	client.subscribe("chat/message", (err) => {
	  	if (err) {
			console.log("Error: ", err);
	  	}
	});
});

//checken of clientID voldoet aan format van mogelijke IDs
function isValidClientId(clientId) {
    const botRegex = /^BOT-\w{7}$/;
    const userRegex = /^user-\w{7}$/;
    const studentRegex = /^student-\w{4}$/;

    return botRegex.test(clientId) || userRegex.test(clientId) || studentRegex.test(clientId);
}

//eventhandler voor wanneer berichten worden ontvangen
client.on('message', function (topic, message) {
    var otherClientId = message.toString().substring(0, 11);
    var receivedMessage = message.toString().substring(11);

    if (isValidClientId(otherClientId)) {
        appendMessage(otherClientId, receivedMessage);
    } else {
        appendMessage("System", otherClientId + receivedMessage);
    }
});

//eventlistener voor enter knop indrukken
document.getElementById('input-field').addEventListener('keydown', function(event) {
	if (event.key == 'Enter') {
		event.preventDefault();
		send();
	}
});

//eventlistener voor klikken op send knop
document.getElementById('send-button').addEventListener('click', send)	

//bericht versturen
function send() {
    if (select_input.value) {
        const messageText = select_input.value;
        appendMessage(clientId, messageText);
        client.publish('chat/message', messageText);
        select_input.value = '';
    }
}

//functie voor sneltoets om bot prefix te plakken
select_input.addEventListener('keydown', function(event) {
    if (event.key === 'Tab') {
        event.preventDefault();
        insertTextAtCursor(select_input, 'BOT-1060024: ');
    }
});

//functie om tekst te plakken in input field
function insertTextAtCursor(select_input, text) {
    const start = select_input.selectionStart;
    const end = select_input.selectionEnd;

    const textBefore = select_input.value.substring(0, start);
    const textAfter = select_input.value.substring(end, select_input.value.length);

    select_input.value = textBefore + text + textAfter;

    select_input.selectionStart = select_input.selectionEnd = start + text.length;
}

//functie om berichten aan UI toe te voegen
function appendMessage(clientId, messageText) {
    //checken of clientID voldoet aan format
    if (isValidBotClientId(clientId)) {
        return;
    }

    const messageContainer = document.createElement('li');
    messageContainer.classList.add('message-container');

    const clientIdElement = document.createElement('div');
    clientIdElement.classList.add('client-id');
    clientIdElement.textContent = clientId;
    
    const messageTextElement = document.createElement('div');
    messageTextElement.classList.add('message-text');
    messageTextElement.textContent = messageText;

    messageContainer.appendChild(clientIdElement);
    messageContainer.appendChild(messageTextElement);
    
    messages.appendChild(messageContainer);
}

//checken of clientId voldoet aan format van bot ID
function isValidBotClientId(clientId) {
    const botRegex = /^BOT-\d{7}$/;
    return botRegex.test(clientId);
}
