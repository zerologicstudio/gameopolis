/* ============================================
   Admin Panel JavaScript - Gameopolis (API Version)
   ============================================ */

// API Base URL - Change this to your deployed backend URL
const API_BASE_URL = 'https://gameopolis-api.onrender.com/api';
// For production, use your actual backend URL:
// const API_BASE_URL = 'https://gameopolis-api.onrender.com/api';

// ============================================
   // API Helper Functions
   // ============================================

// Generic API request function
async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    // Add auth token if available
    const token = localStorage.getItem('adminToken');
    if (token) {
        defaultOptions.headers['Authorization'] = `Bearer ${token}`;
    }

    const mergedOptions = { ...defaultOptions, ...options };

    try {
        const response = await fetch(url, mergedOptions);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'API request failed');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// ============================================
   // Authentication
   // ============================================

// Check if user is logged in
function isLoggedIn() {
    return localStorage.getItem('adminLoggedIn') === 'true';
}

// Handle login
async function handleLogin(e) {
    e.preventDefault();

    const username = document.getElementById('admin-username').value;
    const password = document.getElementById('admin-password').value;

    try {
        const data = await apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password })
        });

        // Store token and login status
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminLoggedIn', 'true');

        showAdminPanel();
        showToast('Login successful!', 'success');
    } catch (error) {
        document.getElementById('login-error').textContent = error.message || 'Invalid username or password';
    }
}

// Handle logout
function handleLogout() {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminLoggedIn');
    document.getElementById('login-modal').style.display = 'flex';
    document.getElementById('admin-panel').style.display = 'none';
    showToast('Logged out successfully', 'info');
}

// Show admin panel
function showAdminPanel() {
    document.getElementById('login-modal').style.display = 'none';
    document.getElementById('admin-panel').style.display = 'flex';
    loadDashboard();
}

// ============================================
   // Navigation
   // ============================================

function toggleSidebar() {
    document.querySelector('.admin-sidebar').classList.toggle('active');
}

function handleNavigation(e) {
    e.preventDefault();
    const targetSection = this.getAttribute('data-section');

    if (!targetSection) return;

    // Update active link
    document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => {
        link.classList.remove('active');
    });
    this.classList.add('active');

    // Show target section
    document.querySelectorAll('.admin-section').forEach(section => {
        section.classList.remove('active');
    });
    const targetElement = document.getElementById(targetSection);
    if (targetElement) {
        targetElement.classList.add('active');
    }

    // Update page title
    const sectionTitle = this.textContent.trim();
    const pageTitleElement = document.getElementById('page-title');
    if (pageTitleElement) {
        pageTitleElement.textContent = sectionTitle;
    }

    // Load section data
    switch(targetSection) {
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

    // Close sidebar on mobile
    if (window.innerWidth <= 768) {
        document.querySelector('.admin-sidebar').classList.remove('active');
    }
}

// ============================================
   // Dashboard
   // ============================================

async function loadDashboard() {
    try {
        // Load stats
        const [eventsData, bookingsData, menuData, galleryData] = await Promise.all([
            apiRequest('/events'),
            apiRequest('/bookings'),
            apiRequest('/menu'),
            apiRequest('/gallery')
        ]);

        const activeEvents = eventsData.events ? eventsData.events.filter(e => e.status === 'active').length : 0;
        const pendingBookings = bookingsData.bookings ? bookingsData.bookings.filter(b => b.status === 'pending').length : 0;
        const totalMenuItems = menuData.menu ? Object.values(menuData.menu).flat().length : 0;
        const totalGalleryImages = galleryData.gallery ? galleryData.gallery.length : 0;

        // Update stat elements with safety checks
        const totalEventsEl = document.getElementById('total-events');
        const totalBookingsEl = document.getElementById('total-bookings');
        const pendingBookingsEl = document.getElementById('pending-bookings');
        const totalImagesEl = document.getElementById('total-images');

        if (totalEventsEl) totalEventsEl.textContent = activeEvents;
        if (totalBookingsEl) totalBookingsEl.textContent = bookingsData.bookings ? bookingsData.bookings.length : 0;
        if (pendingBookingsEl) pendingBookingsEl.textContent = pendingBookings;
        if (totalImagesEl) totalImagesEl.textContent = totalGalleryImages;

        // Load recent bookings
        const recentBookings = bookingsData.bookings ? bookingsData.bookings.slice(0, 5) : [];
        const recentBookingsList = document.getElementById('recent-bookings-list');

        if (recentBookingsList) {
            if (recentBookings.length === 0) {
                recentBookingsList.innerHTML = '<p class="no-data">No recent bookings</p>';
            } else {
                recentBookingsList.innerHTML = recentBookings.map(booking => `
                    <div class="booking-item">
                        <div class="booking-info">
                            <h4>${booking.name}</h4>
                            <p><strong>ID:</strong> ${booking.bookingId}</p>
                            <p><strong>Date:</strong> ${booking.date}</p>
                            <p><strong>Players:</strong> ${booking.players}</p>
                        </div>
                        <div class="booking-status">
                            <span class="status-badge status-${booking.status}">${booking.status}</span>
                        </div>
                    </div>
                `).join('');
            }
        }

        // Load upcoming events
        const upcomingEvents = eventsData.events
            ? eventsData.events
                .filter(e => e.status === 'active' && new Date(e.date) >= new Date())
                .sort((a, b) => new Date(a.date) - new Date(b.date))
                .slice(0, 5)
            : [];

        const upcomingEventsList = document.getElementById('upcoming-events-list');

        if (upcomingEventsList) {
            if (upcomingEvents.length === 0) {
                upcomingEventsList.innerHTML = '<p class="no-data">No upcoming events</p>';
            } else {
                upcomingEventsList.innerHTML = upcomingEvents.map(event => `
                    <div class="event-item">
                        <div class="event-info">
                            <h4>${event.name}</h4>
                            <p><strong>Date:</strong> ${new Date(event.date).toLocaleDateString()}</p>
                            <p><strong>Registered:</strong> ${event.registered}/${event.capacity}</p>
                            <p><strong>Price:</strong> ₹${event.price}</p>
                        </div>
                    </div>
                `).join('');
            }
        }
    } catch (error) {
        console.error('Error loading dashboard:', error);
        showToast('Error loading dashboard data', 'error');
    }
}

// ============================================
   // Events
   // ============================================

async function loadEvents() {
    try {
        const data = await apiRequest('/events');
        const events = data.events || [];
        const eventsTable = document.getElementById('events-table-body');

        if (!eventsTable) {
            console.error('Events table body not found');
            return;
        }

        if (events.length === 0) {
            eventsTable.innerHTML = '<tr><td colspan="7">No events found</td></tr>';
            return;
        }

        eventsTable.innerHTML = events.map(event => `
            <tr>
                <td>${event.name}</td>
                <td>${new Date(event.date).toLocaleDateString()}</td>
                <td>${event.time}</td>
                <td><span class="status-badge status-${event.status}">${event.status}</span></td>
                <td>${event.registered}/${event.capacity}</td>
                <td>₹${event.price}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="editEvent('${event._id}')">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteEvent('${event._id}')">Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading events:', error);
        showToast('Error loading events', 'error');
    }
}

async function handleEventSubmit(e) {
    e.preventDefault();

    const eventId = document.getElementById('event-id').value;
    const eventData = {
        name: document.getElementById('event-name').value,
        date: document.getElementById('event-date').value,
        time: document.getElementById('event-time').value,
        duration: parseInt(document.getElementById('event-duration').value),
        description: document.getElementById('event-description').value,
        type: document.getElementById('event-type').value,
        price: parseInt(document.getElementById('event-price').value),
        capacity: parseInt(document.getElementById('event-capacity').value),
        image: document.getElementById('event-image').value,
        status: document.getElementById('event-status').value
    };

    try {
        if (eventId) {
            await apiRequest(`/events/${eventId}`, {
                method: 'PUT',
                body: JSON.stringify(eventData)
            });
            showToast('Event updated successfully!', 'success');
        } else {
            await apiRequest('/events', {
                method: 'POST',
                body: JSON.stringify(eventData)
            });
            showToast('Event added successfully!', 'success');
        }

        document.getElementById('event-modal').classList.remove('active');
        loadEvents();
        loadDashboard();
    } catch (error) {
        console.error('Error saving event:', error);
        showToast('Error saving event', 'error');
    }
}

async function editEvent(id) {
    try {
        const data = await apiRequest(`/events/${id}`);
        const event = data.event;

        document.getElementById('event-modal-title').textContent = 'Edit Event';
        document.getElementById('event-id').value = event._id;
        document.getElementById('event-name').value = event.name;
        document.getElementById('event-date').value = event.date.split('T')[0];
        document.getElementById('event-time').value = event.time;
        document.getElementById('event-duration').value = event.duration;
        document.getElementById('event-description').value = event.description;
        document.getElementById('event-type').value = event.type;
        document.getElementById('event-price').value = event.price;
        document.getElementById('event-capacity').value = event.capacity;
        document.getElementById('event-image').value = event.image;
        document.getElementById('event-status').value = event.status;

        document.getElementById('event-modal').classList.add('active');
    } catch (error) {
        console.error('Error loading event:', error);
        showToast('Error loading event details', 'error');
    }
}

async function deleteEvent(id) {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
        await apiRequest(`/events/${id}`, { method: 'DELETE' });
        showToast('Event deleted successfully!', 'success');
        loadEvents();
        loadDashboard();
    } catch (error) {
        console.error('Error deleting event:', error);
        showToast('Error deleting event', 'error');
    }
}

// ============================================
   // Bookings
   // ============================================

async function loadBookings() {
    try {
        const data = await apiRequest('/bookings');
        const bookings = data.bookings || [];
        const bookingsTable = document.getElementById('bookings-table-body');

        if (!bookingsTable) {
            console.error('Bookings table body not found');
            return;
        }

        if (bookings.length === 0) {
            bookingsTable.innerHTML = '<tr><td colspan="8">No bookings found</td></tr>';
            return;
        }

        bookingsTable.innerHTML = bookings.map(booking => `
            <tr>
                <td>${booking.bookingId}</td>
                <td>${booking.name}</td>
                <td>${booking.phone}</td>
                <td>${booking.date}</td>
                <td>${booking.time}</td>
                <td>${booking.players}</td>
                <td><span class="status-badge status-${booking.status}">${booking.status}</span></td>
                <td>
                    <button class="btn btn-sm btn-success" onclick="updateBookingStatus('${booking.bookingId}', 'confirmed')">Confirm</button>
                    <button class="btn btn-sm btn-danger" onclick="updateBookingStatus('${booking.bookingId}', 'cancelled')">Cancel</button>
                    <button class="btn btn-sm btn-secondary" onclick="deleteBooking('${booking.bookingId}')">Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading bookings:', error);
        showToast('Error loading bookings', 'error');
    }
}

async function updateBookingStatus(bookingId, status) {
    try {
        await apiRequest(`/bookings/${bookingId}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status })
        });
        showToast(`Booking ${status}!`, 'success');
        loadBookings();
        loadDashboard();
    } catch (error) {
        console.error('Error updating booking:', error);
        showToast('Error updating booking', 'error');
    }
}

async function deleteBooking(bookingId) {
    if (!confirm('Are you sure you want to delete this booking?')) return;

    try {
        await apiRequest(`/bookings/${bookingId}`, { method: 'DELETE' });
        showToast('Booking deleted successfully!', 'success');
        loadBookings();
        loadDashboard();
    } catch (error) {
        console.error('Error deleting booking:', error);
        showToast('Error deleting booking', 'error');
    }
}

// ============================================
   // Menu
   // ============================================

async function loadMenu() {
    try {
        const data = await apiRequest('/menu');
        const menu = data.menu || {};
        const categories = {
            'hot-beverages': { listId: 'hot-beverages-list', icon: 'fa-coffee', title: 'Hot Beverages' },
            'cold-beverages': { listId: 'cold-beverages-list', icon: 'fa-glass-water', title: 'Cold Beverages' },
            'snacks': { listId: 'snacks-list', icon: 'fa-cookie-bite', title: 'Snacks' },
            'quick-meals': { listId: 'quick-meals-list', icon: 'fa-pizza-slice', title: 'Quick Meals' }
        };

        for (const [categoryKey, categoryInfo] of Object.entries(categories)) {
            const listElement = document.getElementById(categoryInfo.listId);
            if (!listElement) {
                console.error(`Menu list not found: ${categoryInfo.listId}`);
                continue;
            }

            const items = menu[categoryKey] || [];

            if (items.length === 0) {
                listElement.innerHTML = '<p class="no-data">No items</p>';
                continue;
            }

            listElement.innerHTML = items.map(item => `
                <div class="menu-item-card">
                    <div class="menu-item-info">
                        <h5>${item.name}</h5>
                        <p class="menu-item-price">₹${item.price}</p>
                    </div>
                    <div class="menu-item-actions">
                        <button class="btn btn-sm btn-primary" onclick="editMenuItem('${item._id}', '${categoryKey}')">Edit</button>
                        <button class="btn btn-sm btn-danger" onclick="deleteMenuItem('${item._id}', '${categoryKey}')">Delete</button>
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading menu:', error);
        showToast('Error loading menu', 'error');
    }
}

async function handleMenuSubmit(e) {
    e.preventDefault();

    const itemId = document.getElementById('menu-item-id').value;
    const category = document.getElementById('menu-item-category').value;
    const itemData = {
        name: document.getElementById('menu-item-name').value,
        price: parseInt(document.getElementById('menu-item-price').value),
        category: category
    };

    try {
        if (itemId) {
            await apiRequest(`/menu/${itemId}`, {
                method: 'PUT',
                body: JSON.stringify(itemData)
            });
            showToast('Menu item updated successfully!', 'success');
        } else {
            await apiRequest('/menu', {
                method: 'POST',
                body: JSON.stringify(itemData)
            });
            showToast('Menu item added successfully!', 'success');
        }

        document.getElementById('menu-modal').classList.remove('active');
        loadMenu();
    } catch (error) {
        console.error('Error saving menu item:', error);
        showToast('Error saving menu item', 'error');
    }
}

async function editMenuItem(id, category) {
    try {
        const data = await apiRequest(`/menu/${id}`);
        const item = data.menuItem;

        document.getElementById('menu-modal-title').textContent = 'Edit Menu Item';
        document.getElementById('menu-item-id').value = item._id;
        document.getElementById('menu-item-name').value = item.name;
        document.getElementById('menu-item-price').value = item.price;
        document.getElementById('menu-item-category').value = category;

        document.getElementById('menu-modal').classList.add('active');
    } catch (error) {
        console.error('Error loading menu item:', error);
        showToast('Error loading menu item', 'error');
    }
}

async function deleteMenuItem(id, category) {
    if (!confirm('Are you sure you want to delete this menu item?')) return;

    try {
        await apiRequest(`/menu/${id}`, { method: 'DELETE' });
        showToast('Menu item deleted successfully!', 'success');
        loadMenu();
    } catch (error) {
        console.error('Error deleting menu item:', error);
        showToast('Error deleting menu item', 'error');
    }
}

// ============================================
   // Gallery
   // ============================================

async function loadGallery() {
    try {
        const data = await apiRequest('/gallery');
        const gallery = data.gallery || [];
        const galleryGrid = document.getElementById('admin-gallery-grid');

        if (!galleryGrid) {
            console.error('Gallery grid not found');
            return;
        }

        if (gallery.length === 0) {
            galleryGrid.innerHTML = '<p class="no-data">No images in gallery</p>';
            return;
        }

        galleryGrid.innerHTML = gallery.map(image => `
            <div class="gallery-item-card">
                <img src="${image.url}" alt="${image.alt}">
                <div class="gallery-item-overlay">
                    <span class="gallery-category">${image.category}</span>
                    <div class="gallery-item-actions">
                        <button class="btn btn-sm btn-danger" onclick="deleteGalleryImage('${image._id}')">Delete</button>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading gallery:', error);
        showToast('Error loading gallery', 'error');
    }
}

async function handleImageSubmit(e) {
    e.preventDefault();

    const imageData = {
        url: document.getElementById('image-url').value,
        category: document.getElementById('image-category').value,
        alt: document.getElementById('image-alt').value || 'Gallery image'
    };

    try {
        await apiRequest('/gallery', {
            method: 'POST',
            body: JSON.stringify(imageData)
        });

        showToast('Image added successfully!', 'success');
        document.getElementById('image-modal').classList.remove('active');
        loadGallery();
        loadDashboard();
    } catch (error) {
        console.error('Error adding image:', error);
        showToast('Error adding image', 'error');
    }
}

async function deleteGalleryImage(id) {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
        await apiRequest(`/gallery/${id}`, { method: 'DELETE' });
        showToast('Image deleted successfully!', 'success');
        loadGallery();
        loadDashboard();
    } catch (error) {
        console.error('Error deleting image:', error);
        showToast('Error deleting image', 'error');
    }
}

// ============================================
   // Settings
   // ============================================

async function loadSettings() {
    try {
        const data = await apiRequest('/settings');
        const settings = data.settings;

        // Contact Information
        const contactPhone = document.getElementById('contact-phone');
        const contactEmail = document.getElementById('contact-email');
        const contactAddress = document.getElementById('contact-address');

        if (contactPhone) contactPhone.value = settings.phone || '+91 98765 43210';
        if (contactEmail) contactEmail.value = settings.email || 'info@gameopolis.in';
        if (contactAddress) contactAddress.value = settings.address || '123, Usman Road, T-Nagar, Chennai, Tamil Nadu 600017';

        // Operating Hours
        const openingTime = document.getElementById('opening-time');
        const closingTime = document.getElementById('closing-time');

        if (openingTime) openingTime.value = settings.openingTime || '11:00';
        if (closingTime) closingTime.value = settings.closingTime || '22:00';
    } catch (error) {
        console.error('Error loading settings:', error);
        showToast('Error loading settings', 'error');
    }
}

async function handleSettingsSubmit(e) {
    e.preventDefault();

    // Get the form that was submitted
    const form = e.target;
    const formId = form.id;

    let settingsData = {};

    // Handle different forms based on form ID
    if (formId === 'contact-info-form') {
        settingsData = {
            phone: document.getElementById('contact-phone').value,
            email: document.getElementById('contact-email').value,
            address: document.getElementById('contact-address').value
        };
    } else if (formId === 'hours-form') {
        settingsData = {
            openingTime: document.getElementById('opening-time').value,
            closingTime: document.getElementById('closing-time').value
        };
    } else if (formId === 'admin-credentials-form') {
        // Handle password change separately
        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        if (newPassword !== confirmPassword) {
            showToast('Passwords do not match', 'error');
            return;
        }

        // Password change would need a separate API endpoint
        showToast('Password change feature coming soon', 'info');
        return;
    }

    try {
        await apiRequest('/settings', {
            method: 'PUT',
            body: JSON.stringify(settingsData)
        });

        showToast('Settings updated successfully!', 'success');
        form.reset();
    } catch (error) {
        console.error('Error updating settings:', error);
        showToast('Error updating settings', 'error');
    }
}

// ============================================
   // UI Helpers
   // ============================================

function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ============================================
   // Initialize
   // ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Check login status
    if (isLoggedIn()) {
        showAdminPanel();
    }

    // Login form submission
    document.getElementById('login-form').addEventListener('submit', handleLogin);

    // Logout button
    document.getElementById('logout-btn').addEventListener('click', handleLogout);

    // Sidebar toggle
    document.getElementById('sidebar-toggle').addEventListener('click', toggleSidebar);

    // Navigation links
    document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => {
        link.addEventListener('click', handleNavigation);
    });

    // Initialize modals
    initializeModals();

    // Initialize forms
    initializeForms();

    // Initialize filter buttons
    initializeFilters();
});

function initializeModals() {
    // Event modal
    document.getElementById('add-event-btn').addEventListener('click', function() {
        document.getElementById('event-modal-title').textContent = 'Add New Event';
        document.getElementById('event-form').reset();
        document.getElementById('event-id').value = '';
        document.getElementById('event-modal').classList.add('active');
    });

    document.getElementById('event-modal-close').addEventListener('click', function() {
        document.getElementById('event-modal').classList.remove('active');
    });

    // Menu modal
    document.getElementById('add-menu-item-btn').addEventListener('click', function() {
        document.getElementById('menu-modal-title').textContent = 'Add New Menu Item';
        document.getElementById('menu-form').reset();
        document.getElementById('menu-item-id').value = '';
        document.getElementById('menu-modal').classList.add('active');
    });

    document.getElementById('menu-modal-close').addEventListener('click', function() {
        document.getElementById('menu-modal').classList.remove('active');
    });

    // Image modal
    document.getElementById('add-image-btn').addEventListener('click', function() {
        document.getElementById('image-form').reset();
        document.getElementById('image-modal').classList.add('active');
    });

    document.getElementById('image-modal-close').addEventListener('click', function() {
        document.getElementById('image-modal').classList.remove('active');
    });
}

function initializeForms() {
    document.getElementById('event-form').addEventListener('submit', handleEventSubmit);
    document.getElementById('menu-form').addEventListener('submit', handleMenuSubmit);
    document.getElementById('image-form').addEventListener('submit', handleImageSubmit);

    // Settings forms
    const adminCredentialsForm = document.getElementById('admin-credentials-form');
    const contactInfoForm = document.getElementById('contact-info-form');
    const hoursForm = document.getElementById('hours-form');

    if (adminCredentialsForm) {
        adminCredentialsForm.addEventListener('submit', handleSettingsSubmit);
    }
    if (contactInfoForm) {
        contactInfoForm.addEventListener('submit', handleSettingsSubmit);
    }
    if (hoursForm) {
        hoursForm.addEventListener('submit', handleSettingsSubmit);
    }
}

function initializeFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const filter = this.getAttribute('data-filter');
            const rows = document.querySelectorAll('#bookings-table-body tr');

            rows.forEach(row => {
                if (filter === 'all' || row.querySelector(`.status-${filter}`)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    });
}

// Make functions globally accessible
window.editEvent = editEvent;
window.deleteEvent = deleteEvent;
window.updateBookingStatus = updateBookingStatus;
window.deleteBooking = deleteBooking;
window.editMenuItem = editMenuItem;
window.deleteMenuItem = deleteMenuItem;
window.deleteGalleryImage = deleteGalleryImage;
