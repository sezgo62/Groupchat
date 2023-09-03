setURL('https://sezgin-guendogdu.developerakademie.net/MyPracticeProjects/smallest_backend_ever_Groupchat');

let users = [{}];
let conversations = [{}];
let onlineUsers = [{}];
let reportedUsers = [{}];
let currentUser;

let user = {

}

async function load() {
    await downloadFromServer();
    users = await JSON.parse(backend.getItem('users')) || [];
    console.log('user array geladen');

    user = await JSON.parse(backend.getItem('chatUser')) || [];
    console.log('user geladen');

    conversations = await JSON.parse(backend.getItem('conversations')) || [];


    onlineUsers = await JSON.parse(backend.getItem('onlineUsers')) || [];

    reportedUsers = await JSON.parse(backend.getItem('reportedUsers')) || [];


    showOnlineUsers();
    renderChat();
    renderReportedUsers();
    onPageLoad();
}

function loadChatBoxContainer() {
    document.getElementById('contentChatBox').innerHTML =
        `
    <div onclick="logOut()" class="logOut" id="logOut"><h3>Logout</h3></div>

    <div onclick="showAllOnlineUsers()" class="showAllOnlineUsers" id="showAllOnlineUsers"><h3>Online-Users</h3></div>


    <div class="onlineContainer d-none" id="onlineContainer"></div>
    
<div class="chatBoxContainer" id="chatBoxContainer">
    <div class="chatBox" id="chatBox">
    
           
    
    </div>

    <div class="inputBar">
    <input class="chatButton" id="chatButton" type="text" placeholder="Type your text">
    <button onclick="sendChat()" class="chatButton">Send</button>
</div>
    
</div>

    
    `;
}

async function showOnlineUsers() {

    onlineUsers = users.filter(u => u['online'] == true);
    console.log('Alle online User:,', onlineUsers)

    //let onlineUserserAsString = JSON.stringify(onlineUsers);
    //await backend.setItem('onlineUsers', onlineUserserAsString);
    await backend.setItem('onlineUsers', JSON.stringify(onlineUsers));

    onlineUsers = await JSON.parse(backend.getItem('onlineUsers')) || [];


    let singleOnlineUser = document.getElementById('onlineContainer');

    for (let i = 0; i < onlineUsers.length; i++) {
        const user = onlineUsers[i];

        singleOnlineUser.innerHTML += `
        <div class="onlineUserContainer" id="onlineUserContainer">${user['user']}<img class="lightGreen"src="img/onlineGreen.png"></div>
        `;
    }
}



function showAllOnlineUsers() {
    document.getElementById('onlineContainer').classList.remove('d-none');
    document.getElementById('popup').classList.remove('d-none');
}

function closePopup() {
    document.getElementById('onlineContainer').classList.add('d-none');
    document.getElementById('popup').classList.add('d-none')
}




///////////////////////////////This Area manages the Access/////////////////////////////////////////////////////////



async function register() {

    let user = document.getElementById('userInput');
    let email = document.getElementById('emailInput');
    let password = document.getElementById('PasswordInput');

    let userObject = {
        'user': user.value,
        'email': email.value,
        'password': password.value,
        'online': false
    }

    users.push(userObject);

    /*localStorage.setItem('chatUsers', JSON.stringify(users)); 
    Es wird nicht empfohlen es im setitem Befehl zu stringyfiyen, sondern eher wie unten drunter demonstriert
    */

    //let allUsersAsString = JSON.stringify(users);
    //await backend.setItem('users', allUsersAsString);

    await backend.setItem('users', JSON.stringify(users));


    window.location.href = 'index.html?msg=Du hast dich erfolgreich angemeldet';
}

async function login() {

    let email = document.getElementById('emailLogin');
    let password = document.getElementById('passwordLogin');
    user = users.find(u => u.email == email.value && u.password == password.value);
    if (user) {
        console.log('User gefunden');

        await localStorage.setItem('chatUser', JSON.stringify(user));
        console.log('Der User wurde gespeichert');

        currentUser = JSON.parse(localStorage.getItem('chatUser'));
        currentUser['online'] = true;

        users.forEach(singleUser => {
            if (currentUser['user'] == singleUser['user']) {
                singleUser['online'] = true;
            }
        });

        //let allUsersAsString = JSON.stringify(users);
        //await backend.setItem('users', allUsersAsString);
        await localStorage.setItem('chatUser', JSON.stringify(currentUser));

        await backend.setItem('users', JSON.stringify(users));

        window.location.href = 'chatbox.html?msg=Du hast dich erfolgreich angemeldet';
    }
}

///////////////////////////////This Area manages the messages that want be send/////////////////////////////////////////////////////////

async function sendChat() {

    let text = document.getElementById('chatButton').value; // Getting the text
    let today = new Date();
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds(); // Getting the time
    console.log(time);




    let chatBox = document.getElementById('chatBox');
    chatBox.innerHTML += `<div id="message$" class="textBox"><h6 class="user">${user['user']}</h6> <h6 class="text">${text}</h6> <h6 class="time">${time}</h6> <h6 class="reportText" id="reportText">report</h6></div>`;

    currentUser = JSON.parse(localStorage.getItem('chatUser'));

    let message = {
        'user': currentUser['user'],
        'text': text,
        'time': time
    }

    conversations.push(message);

    //let allConversations = JSON.stringify(conversations);
    //await backend.setItem('conversations', allConversations);
    await backend.setItem('conversations', JSON.stringify(conversations));

    renderChat();

}


async function renderChat() {


    console.log('Konversationen geladen');
    document.getElementById('chatBox').innerHTML = '';
    for (let i = 0; i < conversations.length; i++) {
        const element = conversations[i];

        let chatBox = document.getElementById('chatBox');
        chatBox.innerHTML += `<div id="message${i}"class="textBox"> <h6 class="user">${element['user']}</h6> <h6 class="text">${element['text']}</h6> <h6 class="time">${element['time']}</h6> 
    <h6 onclick="reportMessage('${element['user']}', '${element['text']}', '${element['time']}')" class="reportText" id="reportText">report</h6></div>`;
    }
}

async function reportMessage(user, text, time) {



    let reportedUser = {
        'user': user,
        'text': text,
        'time': time
    }

    console.log(reportedUsers);

    reportedUsers.push(reportedUser);

    await backend.setItem('reportedUsers', JSON.stringify(reportedUsers));
}




/**
 * Wenn Seite Geladen ist dann zeige unsere Chart
 */
function onPageLoad() {
    var popoverTriggerList = [].slice.call(
        document.querySelectorAll('[data-bs-toggle="popover"]')
    );
    var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });


    // showGraph();
}


function renderReportedUsers() {

    let mainContainer = document.getElementById('mainContainer');
    for (let i = 0; i < reportedUsers.length; i++) {
        const element = reportedUsers[i];

        mainContainer.innerHTML += `
    
        <div class="reportedUserContainer" id="reportedUserContainer${i}">
        <h4 class="reportConsoleUser">User-Name: ${element['user']} </h4>  <h4 class="reportConsoleText">Text: ${element['text']} </h4>  <h4 class="reportConsoleTime">Time: ${element['time']} </h4> <button class="actionButton" type="button" data-bs-toggle="popover" data-bs-title="Popover title" data-bs-content="<a href=>delete</a>">Action</button>
        </div>
        `;
    }
}

const list = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
list.map((el) => {
  let opts = {
    animation: false,
  }
  if (el.hasAttribute('data-bs-content-id')) {
    opts.content = document.getElementById(el.getAttribute('data-bs-content-id')).innerHTML;
    opts.html = true;
  }
  new bootstrap.Popover(el, opts);
})

async function logOut() {
    currentUser = JSON.parse(localStorage.getItem('chatUser'));

    if (currentUser) {
        users.forEach(user => {
            if (currentUser['user'] == user['user']) {
                user['online'] = false;
            }
        });

        //let allUsersAsString = JSON.stringify(users);
        //await backend.setItem('users', allUsersAsString);
        await backend.setItem('users', JSON.stringify(users));


        await localStorage.removeItem('chatUser');

        window.location.href = 'index.html?msg=Du hast dich erfolgreich angemeldet';
    } else {
        window.location.href = 'index.html?msg=Du hast dich erfolgreich angemeldet';
    }

    /*setTimeout(function() {
                  
       
       
      }, 1500);*/

}