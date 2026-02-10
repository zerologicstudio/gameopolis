/* ============================================
   Admin Panel JavaScript - Gameopolis
   ============================================ */

// Admin credentials (in production, this should be server-side)
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'gameopolis123'
};

// Data storage (using localStorage for demo purposes)
let adminData = {
    events: [],
    bookings: [],
    menu: {
        'hot-beverages': [
            { id: 1, name: 'Filter Coffee', price: 40 },
            { id: 2, name: 'Cappuccino', price: 60 },
            { id: 3, name: 'Masala Chai', price: 30 },
            { id: 4, name: 'Hot Chocolate', price: 50 }
        ],
        'cold-beverages': [
            { id: 5, name: 'Fresh Lime Soda', price: 40 },
            { id: 6, name: 'Iced Tea', price: 50 },
            { id: 7, name: 'Milkshake (Chocolate/Vanilla)', price: 80 },
            { id: 8, name: 'Soft Drinks', price: 40 }
        ],
        'snacks': [
            { id: 9, name: 'French Fries', price: 80 },
            { id: 10, name: 'Samosa (2 pcs)', price: 40 },
            { id: 11, name: 'Sandwich', price: 70 },
            { id: 12, name: 'Nachos with Cheese', price: 100 }
        ],
        'quick-meals': [
            { id: 13, name: 'Maggi Noodles', price: 50 },
            { id: 14, name: 'Pasta', price: 120 },
            { id: 15, name: 'Mini Pizza', price: 150 }
        ]
    },
    gallery: [],
    settings: {
        phone: '+91 98765 43210',
        email: 'info@gameopolis.in',
        address: '123, Usman Road, T-Nagar, Chennai, Tamil Nadu 600017',
        openingTime: '11:00',
        closingTime: '22:00'
    }
};

// Initialize sample data
function initializeSampleData() {
    // Sample events
    adminData.events = [
        
    ];

    // Sample bookings
    adminData.bookings = [
        
    ];

    // Sample gallery images
    adminData.gallery = [
        {
            id: 1,
            url: 'https://images.unsplash.com/photo-1610890716271-e2fe9e9c0c6d?w=400&h=300&fit=crop',
            category: 'interior',
            alt: 'Gameopolis Cafe Interior'
        },
        {
            id: 2,
            url: 'https://images.unsplash.com/photo-1611371805429-8b5961bef381?w=400&h=300&fit=crop',
            category: 'games',
            alt: 'Board Game Collection'
        },
        {
            id: 3,
            url: 'https://images.unsplash.com/photo-1632501641765-e568d28b0015?w=400&h=300&fit=crop',
            category: 'tables',
            alt: 'Gaming Tables'
        },
        {
            id: 4,
            url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=300&fit=crop',
            category: 'experience',
            alt: 'Customer Experience'
        }
    ];

    saveData();
}

// Load data from localStorage
function loadData() {
    const savedData = localStorage.getItem('gameopolisAdminData');
    if (savedData) {
        adminData = JSON.parse(savedData);
    } else {
        initializeSampleData();
    }
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('gameopolisAdminData', JSON.stringify(adminData));
}

// Check if user is logged in
function isLoggedIn() {
    return sessionStorage.getItem('adminLoggedIn') === 'true';
}

// DOM Elements
const loginModal = document.getElementById('login-modal');
const adminPanel = document.getElementById('admin-panel');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const logoutBtn = document.getElementById('logout-btn');
const sidebarToggle = document.getElementById('sidebar-toggle');
const adminSidebar = document.querySelector('.admin-sidebar');
const navLinks = document.querySelectorAll('.sidebar-nav .nav-link');
const adminSections = document.querySelectorAll('.admin-section');
const pageTitle = document.getElementById('page-title');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    
    // Check login status
    if (isLoggedIn()) {
        showAdminPanel();
    }
    
    // Login form submission
    loginForm.addEventListener('submit', handleLogin);
    
    // Logout button
    logoutBtn.addEventListener('click', handleLogout);
    
    // Sidebar toggle
    sidebarToggle.addEventListener('click', toggleSidebar);
    
    // Navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', handleNavigation);
    });
    
    // Initialize modals
    initializeModals();
    
    // Initialize forms
    initializeForms();
    
    // Initialize filter buttons
    initializeFilters();
    
    // Load dashboard data
    if (isLoggedIn()) {
        loadDashboard();
    }
});

// Handle login
function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('admin-username').value;
    const password = document.getElementById('admin-password').value;
    
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        sessionStorage.setItem('adminLoggedIn', 'true');
        showAdminPanel();
        showToast('Login successful!', 'success');
    } else {
        loginError.textContent = 'Invalid username or password';
    }
}

// Handle logout
function handleLogout() {
    sessionStorage.removeItem('adminLoggedIn');
    loginModal.style.display = 'flex';
    adminPanel.style.display = 'none';
    showToast('Logged out successfully', 'info');
}

// Show admin panel
function showAdminPanel() {
    loginModal.style.display = 'none';
    adminPanel.style.display = 'flex';
    loadDashboard();
}

// Toggle sidebar
function toggleSidebar() {
    adminSidebar.classList.toggle('active');
}

// Handle navigation
function handleNavigation(e) {
    e.preventDefault();
    
    const section = e.currentTarget.getAttribute('data-section');
    
    // Update active link
    navLinks.forEach(link => link.classList.remove('active'));
    e.currentTarget.classList.add('active');
    
    // Show corresponding section
    adminSections.forEach(sec => sec.classList.remove('active'));
    document.getElementById(`${section}-section`).classList.add('active');
    
    // Update page title
    pageTitle.textContent = e.currentTarget.textContent.trim();
    
    // Load section data
    loadSectionData(section);
    
    // Close sidebar on mobile
    if (window.innerWidth <= 1024) {
        adminSidebar.classList.remove('active');
    }
}

// Load section data
function loadSectionData(section) {
    switch(section) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'events':
            loadEvents();
            break;
        case 'bookings':
            loadBookings();
            break;
        case 'menu':
            loadMenu();
            break;
        case 'gallery':
            loadGallery();
            break;
        case 'settings':
            loadSettings();
            break;
    }
}

// Load dashboard
function loadDashboard() {
    // Update stats
    document.getElementById('total-events').textContent = adminData.events.length;
    document.getElementById('total-bookings').textContent = adminData.bookings.length;
    document.getElementById('pending-bookings').textContent = adminData.bookings.filter(b => b.status === 'pending').length;
    document.getElementById('total-images').textContent = adminData.gallery.length;
    
    // Load recent bookings
    const recentBookingsList = document.getElementById('recent-bookings-list');
    const recentBookings = adminData.bookings.slice(0, 5);
    
    if (recentBookings.length === 0) {
        recentBookingsList.innerHTML = '<p class="no-data">No recent bookings</p>';
    } else {
        recentBookingsList.innerHTML = recentBookings.map(booking => `
            <div class="booking-item">
                <div class="booking-info">
                    <h4>${booking.name}</h4>
                    <p>${booking.date} at ${booking.time} • ${booking.players} players</p>
                </div>
                <span class="booking-status status-${booking.status}">${booking.status}</span>
            </div>
        `).join('');
    }
    
    // Load upcoming events
    const upcomingEventsList = document.getElementById('upcoming-events-list');
    const upcomingEvents = adminData.events.filter(e => e.status === 'active').slice(0, 5);
    
    if (upcomingEvents.length === 0) {
        upcomingEventsList.innerHTML = '<p class="no-data">No upcoming events</p>';
    } else {
        upcomingEventsList.innerHTML = upcomingEvents.map(event => `
            <div class="event-item">
                <div class="event-info">
                    <h4>${event.name}</h4>
                    <p>${event.date} at ${event.time} • ${event.registered}/${event.capacity} registered</p>
                </div>
                <span class="event-status status-confirmed">Active</span>
            </div>
        `).join('');
    }
}

// Load events
function loadEvents() {
    const eventsTableBody = document.getElementById('events-table-body');
    
    if (adminData.events.length === 0) {
        eventsTableBody.innerHTML = '<tr><td colspan="8" class="no-data">No events found</td></tr>';
        return;
    }
    
    eventsTableBody.innerHTML = adminData.events.map(event => `
        <tr>
            <td>${event.name}</td>
            <td>${event.date}</td>
            <td>${event.time}</td>
            <td>${event.type}</td>
            <td>₹${event.price}</td>
            <td>${event.registered}/${event.capacity}</td>
            <td><span class="booking-status status-${event.status === 'active' ? 'confirmed' : 'cancelled'}">${event.status}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn edit" onclick="editEvent(${event.id})"><i class="fas fa-edit"></i></button>
                    <button class="action-btn delete" onclick="deleteEvent(${event.id})"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Load bookings
function loadBookings(filter = 'all') {
    const bookingsTableBody = document.getElementById('bookings-table-body');
    let filteredBookings = adminData.bookings;
    
    if (filter !== 'all') {
        filteredBookings = adminData.bookings.filter(b => b.status === filter);
    }
    
    if (filteredBookings.length === 0) {
        bookingsTableBody.innerHTML = '<tr><td colspan="8" class="no-data">No bookings found</td></tr>';
        return;
    }
    
    bookingsTableBody.innerHTML = filteredBookings.map(booking => `
        <tr>
            <td>${booking.id}</td>
            <td>${booking.name}</td>
            <td>${booking.phone}</td>
            <td>${booking.date}</td>
            <td>${booking.time}</td>
            <td>${booking.players}</td>
            <td><span class="booking-status status-${booking.status}">${booking.status}</span></td>
            <td>
                <div class="action-buttons">
                    ${booking.status === 'pending' ? `
                        <button class="action-btn approve" onclick="updateBookingStatus('${booking.id}', 'confirmed')"><i class="fas fa-check"></i></button>
                        <button class="action-btn reject" onclick="updateBookingStatus('${booking.id}', 'cancelled')"><i class="fas fa-times"></i></button>
                    ` : ''}
                    <button class="action-btn delete" onclick="deleteBooking('${booking.id}')"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Load menu
function loadMenu() {
    const categories = ['hot-beverages', 'cold-beverages', 'snacks', 'quick-meals'];
    
    categories.forEach(category => {
        const listElement = document.getElementById(`${category}-list`);
        const items = adminData.menu[category];
        
        if (items.length === 0) {
            listElement.innerHTML = '<p class="no-data">No items</p>';
            return;
        }
        
        listElement.innerHTML = items.map(item => `
            <div class="menu-item-row">
                <span class="menu-item-name">${item.name}</span>
                <span class="menu-item-price">₹${item.price}</span>
                <div class="action-buttons">
                    <button class="action-btn edit" onclick="editMenuItem(${item.id}, '${category}')"><i class="fas fa-edit"></i></button>
                    <button class="action-btn delete" onclick="deleteMenuItem(${item.id}, '${category}')"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `).join('');
    });
}

// Load gallery
function loadGallery() {
    const galleryGrid = document.getElementById('admin-gallery-grid');
    
    if (adminData.gallery.length === 0) {
        galleryGrid.innerHTML = '<p class="no-data">No images in gallery</p>';
        return;
    }
    
    galleryGrid.innerHTML = adminData.gallery.map(image => `
        <div class="gallery-item">
            <img src="${image.url}" alt="${image.alt}">
            <div class="gallery-item-actions">
                <button class="action-btn delete" onclick="deleteGalleryImage(${image.id})"><i class="fas fa-trash"></i></button>
            </div>
        </div>
    `).join('');
}

// Load settings
function loadSettings() {
    document.getElementById('contact-phone').value = adminData.settings.phone;
    document.getElementById('contact-email').value = adminData.settings.email;
    document.getElementById('contact-address').value = adminData.settings.address;
    document.getElementById('opening-time').value = adminData.settings.openingTime;
    document.getElementById('closing-time').value = adminData.settings.closingTime;
}

// Initialize modals
function initializeModals() {
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.modal-close, .modal-cancel');
    
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            modals.forEach(modal => modal.classList.remove('active'));
        });
    });
    
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
}

// Initialize forms
function initializeForms() {
    // Event form
    document.getElementById('add-event-btn').addEventListener('click', () => {
        document.getElementById('event-modal-title').textContent = 'Add New Event';
        document.getElementById('event-form').reset();
        document.getElementById('event-id').value = '';
        document.getElementById('event-modal').classList.add('active');
    });
    
    document.getElementById('event-form').addEventListener('submit', handleEventSubmit);
    
    // Menu form
    document.getElementById('add-menu-item-btn').addEventListener('click', () => {
        document.getElementById('menu-modal-title').textContent = 'Add Menu Item';
        document.getElementById('menu-form').reset();
        document.getElementById('menu-item-id').value = '';
        document.getElementById('menu-modal').classList.add('active');
    });
    
    document.getElementById('menu-form').addEventListener('submit', handleMenuSubmit);
    
    // Image form
    document.getElementById('add-image-btn').addEventListener('click', () => {
        document.getElementById('image-form').reset();
        document.getElementById('image-modal').classList.add('active');
    });
    
    document.getElementById('image-form').addEventListener('submit', handleImageSubmit);
    
    // Settings forms
    document.getElementById('admin-credentials-form').addEventListener('submit', handlePasswordUpdate);
    document.getElementById('contact-info-form').addEventListener('submit', handleContactInfoUpdate);
    document.getElementById('hours-form').addEventListener('submit', handleHoursUpdate);
}

// Initialize filters
function initializeFilters() {
    const filterButtons = document.querySelectorAll('.filter-buttons .btn');
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('btn-primary'));
            filterButtons.forEach(b => b.classList.add('btn-secondary'));
            btn.classList.remove('btn-secondary');
            btn.classList.add('btn-primary');
            
            const filter = btn.getAttribute('data-filter');
            loadBookings(filter);
        });
    });
}

// Handle event submit
function handleEventSubmit(e) {
    e.preventDefault();
    
    const eventId = document.getElementById('event-id').value;
    const eventData = {
        id: eventId ? parseInt(eventId) : Date.now(),
        name: document.getElementById('event-name').value,
        date: document.getElementById('event-date').value,
        time: document.getElementById('event-time').value,
        duration: parseInt(document.getElementById('event-duration').value),
        type: document.getElementById('event-type').value,
        price: parseInt(document.getElementById('event-price').value),
        capacity: parseInt(document.getElementById('event-capacity').value),
        description: document.getElementById('event-description').value,
        image: document.getElementById('event-image').value || 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400&h=200&fit=crop',
        status: 'active',
        registered: 0
    };
    
    if (eventId) {
        // Update existing event
        const index = adminData.events.findIndex(e => e.id === parseInt(eventId));
        if (index !== -1) {
            eventData.registered = adminData.events[index].registered;
            adminData.events[index] = eventData;
        }
        showToast('Event updated successfully!', 'success');
    } else {
        // Add new event
        adminData.events.push(eventData);
        showToast('Event added successfully!', 'success');
    }
    
    saveData();
    document.getElementById('event-modal').classList.remove('active');
    loadEvents();
    loadDashboard();
}

// Handle menu submit
function handleMenuSubmit(e) {
    e.preventDefault();
    
    const itemId = document.getElementById('menu-item-id').value;
    const category = document.getElementById('menu-item-category').value;
    const itemData = {
        id: itemId ? parseInt(itemId) : Date.now(),
        name: document.getElementById('menu-item-name').value,
        price: parseInt(document.getElementById('menu-item-price').value)
    };
    
    if (itemId) {
        // Update existing item
        const index = adminData.menu[category].findIndex(i => i.id === parseInt(itemId));
        if (index !== -1) {
            adminData.menu[category][index] = itemData;
        }
        showToast('Menu item updated successfully!', 'success');
    } else {
        // Add new item
        adminData.menu[category].push(itemData);
        showToast('Menu item added successfully!', 'success');
    }
    
    saveData();
    document.getElementById('menu-modal').classList.remove('active');
    loadMenu();
}

// Handle image submit
function handleImageSubmit(e) {
    e.preventDefault();
    
    const imageData = {
        id: Date.now(),
        url: document.getElementById('image-url').value,
        category: document.getElementById('image-category').value,
        alt: document.getElementById('image-alt').value || 'Gallery image'
    };
    
    adminData.gallery.push(imageData);
    saveData();
    
    showToast('Image added successfully!', 'success');
    document.getElementById('image-modal').classList.remove('active');
    loadGallery();
    loadDashboard();
}

// Handle password update
function handlePasswordUpdate(e) {
    e.preventDefault();
    
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    if (currentPassword !== ADMIN_CREDENTIALS.password) {
        showToast('Current password is incorrect', 'error');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        showToast('New passwords do not match', 'error');
        return;
    }
    
    ADMIN_CREDENTIALS.password = newPassword;
    showToast('Password updated successfully!', 'success');
    document.getElementById('admin-credentials-form').reset();
}

// Handle contact info update
function handleContactInfoUpdate(e) {
    e.preventDefault();
    
    adminData.settings.phone = document.getElementById('contact-phone').value;
    adminData.settings.email = document.getElementById('contact-email').value;
    adminData.settings.address = document.getElementById('contact-address').value;
    
    saveData();
    showToast('Contact information updated successfully!', 'success');
}

// Handle hours update
function handleHoursUpdate(e) {
    e.preventDefault();
    
    adminData.settings.openingTime = document.getElementById('opening-time').value;
    adminData.settings.closingTime = document.getElementById('closing-time').value;
    
    saveData();
    showToast('Operating hours updated successfully!', 'success');
}

// Edit event
function editEvent(id) {
    const event = adminData.events.find(e => e.id === id);
    if (!event) return;
    
    document.getElementById('event-modal-title').textContent = 'Edit Event';
    document.getElementById('event-id').value = event.id;
    document.getElementById('event-name').value = event.name;
    document.getElementById('event-date').value = event.date;
    document.getElementById('event-time').value = event.time;
    document.getElementById('event-duration').value = event.duration;
    document.getElementById('event-type').value = event.type;
    document.getElementById('event-price').value = event.price;
    document.getElementById('event-capacity').value = event.capacity;
    document.getElementById('event-description').value = event.description;
    document.getElementById('event-image').value = event.image;
    
    document.getElementById('event-modal').classList.add('active');
}

// Delete event
function deleteEvent(id) {
    if (!confirm('Are you sure you want to delete this event?')) return;
    
    adminData.events = adminData.events.filter(e => e.id !== id);
    saveData();
    showToast('Event deleted successfully!', 'success');
    loadEvents();
    loadDashboard();
}

// Update booking status
function updateBookingStatus(id, status) {
    const booking = adminData.bookings.find(b => b.id === id);
    if (!booking) return;
    
    booking.status = status;
    saveData();
    showToast(`Booking ${status}!`, 'success');
    loadBookings();
    loadDashboard();
}

// Delete booking
function deleteBooking(id) {
    if (!confirm('Are you sure you want to delete this booking?')) return;
    
    adminData.bookings = adminData.bookings.filter(b => b.id !== id);
    saveData();
    showToast('Booking deleted successfully!', 'success');
    loadBookings();
    loadDashboard();
}

// Edit menu item
function editMenuItem(id, category) {
    const item = adminData.menu[category].find(i => i.id === id);
    if (!item) return;
    
    document.getElementById('menu-modal-title').textContent = 'Edit Menu Item';
    document.getElementById('menu-item-id').value = item.id;
    document.getElementById('menu-item-name').value = item.name;
    document.getElementById('menu-item-price').value = item.price;
    document.getElementById('menu-item-category').value = category;
    
    document.getElementById('menu-modal').classList.add('active');
}

// Delete menu item
function deleteMenuItem(id, category) {
    if (!confirm('Are you sure you want to delete this menu item?')) return;
    
    adminData.menu[category] = adminData.menu[category].filter(i => i.id !== id);
    saveData();
    showToast('Menu item deleted successfully!', 'success');
    loadMenu();
}

// Delete gallery image
function deleteGalleryImage(id) {
    if (!confirm('Are you sure you want to delete this image?')) return;
    
    adminData.gallery = adminData.gallery.filter(i => i.id !== id);
    saveData();
    showToast('Image deleted successfully!', 'success');
    loadGallery();
    loadDashboard();
}

// Show toast notification
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Make functions globally accessible
window.editEvent = editEvent;
window.deleteEvent = deleteEvent;
window.updateBookingStatus = updateBookingStatus;
window.deleteBooking = deleteBooking;
window.editMenuItem = editMenuItem;
window.deleteMenuItem = deleteMenuItem;
window.deleteGalleryImage = deleteGalleryImage;
