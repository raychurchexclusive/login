// Initialize default users if not already in localStorage
if (!localStorage.getItem('users')) {
    const defaultUsers = {
        'admin': { password: 'adminpass', role: 'admin' },
        'seller': { password: 'sellerpass', role: 'seller' }
    };
    localStorage.setItem('users', JSON.stringify(defaultUsers));
}

// Initialize events if not already in localStorage
if (!localStorage.getItem('events')) {
    localStorage.setItem('events', JSON.stringify([]));
}

// Handle login
function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    const users = JSON.parse(localStorage.getItem('users'));

    if (users && users[username] && users[username].password === password) {
        const role = users[username].role;
        localStorage.setItem('currentUser', JSON.stringify({ username, role }));
        
        if (role === 'admin') {
            window.location.href = 'admin.html';
        } else if (role === 'seller') {
            window.location.href = 'member.html';
        }
    } else {
        alert('Invalid username or password');
    }
}

// Handle logout
function handleLogout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// Add event
function addEvent(event) {
    event.preventDefault();
    
    const eventName = document.getElementById('eventName').value;
    const eventDate = document.getElementById('eventDate').value;
    const eventTime = document.getElementById('eventTime').value;
    
    const events = JSON.parse(localStorage.getItem('events'));
    events.push({ name: eventName, date: eventDate, time: eventTime });
    localStorage.setItem('events', JSON.stringify(events));

    alert('Event added successfully');
    window.location.href = 'admin.html';
}

// Display events on admin page
function displayEvents() {
    const events = JSON.parse(localStorage.getItem('events'));
    const eventsContainer = document.getElementById('eventsContainer');
    
    if (events.length === 0) {
        eventsContainer.innerHTML = '<p>You need to <a href="addevent.html">add an event</a>.</p>';
    } else {
        eventsContainer.innerHTML = '';
        events.forEach((event, index) => {
            const button = document.createElement('button');
            button.className = 'event-button';
            button.textContent = `${event.name}`;
            button.onclick = () => showEventDetails(index);
            eventsContainer.appendChild(button);
        });
    }
}

// Show event details in a popup
function showEventDetails(index) {
    const events = JSON.parse(localStorage.getItem('events'));
    const event = events[index];
    
    const popup = document.getElementById('popup');
    const popupContent = document.getElementById('popupContent');
    
    popupContent.innerHTML = `
        <h2>${event.name}</h2>
        <p>Date: ${event.date}</p>
        <p>Time: ${event.time}</p>
        <button onclick="closePopup()">Close</button>
    `;
    popup.style.display = 'block';
}

// Close the popup
function closePopup() {
    document.getElementById('popup').style.display = 'none';
}

// Add ticket seller
function addTicketSeller(event) {
    event.preventDefault();
    
    const sellerName = document.getElementById('sellerName').value;
    const sellerLoginID = document.getElementById('sellerLoginID').value;
    const sellerPassword = document.getElementById('sellerPassword').value;
    const employeeNumber = document.getElementById('employeeNumber').value;
    const eventDropdown = document.getElementById('eventDropdown');
    const selectedEvent = eventDropdown.options[eventDropdown.selectedIndex].value;
    
    if (!selectedEvent) {
        alert('Please select an event');
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('users'));
    users[sellerLoginID] = { password: sellerPassword, role: 'seller' };
    localStorage.setItem('users', JSON.stringify(users));

    alert('Ticket seller added successfully');
    window.location.href = 'admin.html';
}

// Populate event dropdown in add seller form
function populateEventDropdown() {
    const events = JSON.parse(localStorage.getItem('events'));
    const eventDropdown = document.getElementById('eventDropdown');
    
    if (events.length === 0) {
        eventDropdown.innerHTML = '<option value="">No events available</option>';
    } else {
        eventDropdown.innerHTML = '';
        events.forEach((event) => {
            const option = document.createElement('option');
            option.value = event.name;
            option.textContent = `${event.name} - ${event.date} ${event.time}`;
            eventDropdown.appendChild(option);
        });
    }
}

// Call populateEventDropdown when the add seller page is loaded
if (document.getElementById('eventDropdown')) {
    populateEventDropdown();
}

// Event listeners
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
}
if (document.getElementById('addEventForm')) {
    document.getElementById('addEventForm').addEventListener('submit', addEvent);
}
if (document.getElementById('addSellerForm')) {
    document.getElementById('addSellerForm').addEventListener('submit', addTicketSeller);
}
if (document.getElementById('logoutButton')) {
    document.getElementById('logoutButton').addEventListener('click', handleLogout);
}
if (document.getElementById('displayEvents')) {
    displayEvents();
}
