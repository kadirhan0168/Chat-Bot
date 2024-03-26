const url = "wss://netwerkenbasis.com:8884";
// const url = "https://localhost:1884";

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

function isValidClientId(clientId) {
    // Regular expressions to match the specified formats
    const botRegex = /^BOT-\w{7}$/;
    const userRegex = /^user-\w{7}$/;
    const studentRegex = /^student-\w{4}$/;

    // Check if the clientId matches any of the regular expressions
    return botRegex.test(clientId) || userRegex.test(clientId) || studentRegex.test(clientId);
}

//eventhandler voor wanneer berichten worden ontvangen
client.on('message', function (topic, message) {
    var otherClientId = message.toString().substring(0, 11); // Extracting potential client IDs
    var receivedMessage = message.toString().substring(11);

    // Check if otherClientId matches any of the specified formats
    if (isValidClientId(otherClientId)) {
        appendMessage(otherClientId, receivedMessage); // If valid, append with the extracted client ID
    } else {
        appendMessage("System", otherClientId + receivedMessage); // If not valid, use "System" as client ID
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

// const input = document.getElementById('input-field');

select_input.addEventListener('keydown', function(event) {
    if (event.key === 'Tab') {
        event.preventDefault(); // Prevent default tab behavior
        insertTextAtCursor(select_input, 'BOT-1060024: '); // Insert text at cursor position
    }
});

function insertTextAtCursor(select_input, text) {
    const start = select_input.selectionStart;
    const end = select_input.selectionEnd;

    const textBefore = select_input.value.substring(0, start);
    const textAfter = select_input.value.substring(end, select_input.value.length);

    select_input.value = textBefore + text + textAfter;

    // Move the cursor to the end of the inserted text
    select_input.selectionStart = select_input.selectionEnd = start + text.length;
}

//functie om berichten aan UI toe te voegen
function appendMessage(clientId, messageText) {
    // Check if the client ID matches the specified format
    if (isValidBotClientId(clientId)) {
        // If the client ID matches, don't append the message
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

// Function to check if a client ID matches the specified format
function isValidBotClientId(clientId) {
    const botRegex = /^BOT-\d{7}$/;
    return botRegex.test(clientId);
}
