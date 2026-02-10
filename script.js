/* ============================================
   Gameopolis - Board Game Cafe Website Scripts
   ============================================ */

// ============================================
// Admin Data Integration
// ============================================

// Global admin data variable (will be loaded on page load)
let adminData = null;

// Load admin data from localStorage
function loadAdminData() {
    const savedData = localStorage.getItem('gameopolisAdminData');
    if (savedData) {
        return JSON.parse(savedData);
    }
    return null;
}

// Initialize default data if no admin data exists
function initializeDefaultData() {
    const defaultData = {
        events: [
            
        ],
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
        gallery: [
            {
                id: 1,
                url: 'https://images.unsplash.com/photo-1610890716271-e2fe9e9c0c6d?w=400&h=300&fit=crop',
                category: 'interior',
                alt: 'Gameopolis Cafe Interior - Board game cafe atmosphere in T-Nagar Chennai'
            },
            {
                id: 2,
                url: 'https://images.unsplash.com/photo-1611371805429-8b5961bef381?w=400&h=300&fit=crop',
                category: 'games',
                alt: 'Board Game Collection - Extensive library of board games at Gameopolis'
            },
            {
                id: 3,
                url: 'https://images.unsplash.com/photo-1632501641765-e568d28b0015?w=400&h=300&fit=crop',
                category: 'tables',
                alt: 'Gaming Tables - Comfortable gaming tables for board game sessions'
            },
            {
                id: 4,
                url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=300&fit=crop',
                category: 'experience',
                alt: 'Group Gaming - Friends enjoying board games together at Gameopolis'
            },
            {
                id: 5,
                url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop',
                category: 'interior',
                alt: 'Cafe Seating Area - Comfortable seating at Gameopolis board game cafe'
            },
            {
                id: 6,
                url: 'https://images.unsplash.com/photo-1640537908168-a5d4d4e9e6e5?w=400&h=300&fit=crop',
                category: 'games',
                alt: 'Strategy Board Games - Collection of strategy games available at Gameopolis'
            },
            {
                id: 7,
                url: 'https://images.unsplash.com/photo-1605901309584-818e25960b8f?w=400&h=300&fit=crop',
                category: 'tables',
                alt: 'Board Game Setup - Gaming table with board game ready to play'
            },
            {
                id: 8,
                url: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=400&h=300&fit=crop',
                category: 'experience',
                alt: 'Customer Experience - Social gaming experience at Gameopolis'
            }
        ],
        bookings: [],
        settings: {
            phone: '+91 98765 43210',
            email: 'info@gameopolis.in',
            address: '123, Usman Road, T-Nagar, Chennai, Tamil Nadu 600017',
            openingTime: '11:00',
            closingTime: '22:00'
        }
    };
    
    localStorage.setItem('gameopolisAdminData', JSON.stringify(defaultData));
    return defaultData;
}

// Save booking to admin data
function saveBookingToAdmin(bookingData) {
    // Reload data to ensure we have the latest
    adminData = loadAdminData() || initializeDefaultData();
    
    if (!adminData.bookings) {
        adminData.bookings = [];
    }
    
    // Generate booking ID
    const bookingId = 'BK' + String(adminData.bookings.length + 1).padStart(3, '0');
    bookingData.id = bookingId;
    bookingData.status = 'pending';
    bookingData.createdAt = new Date().toISOString();
    
    adminData.bookings.push(bookingData);
    localStorage.setItem('gameopolisAdminData', JSON.stringify(adminData));
    
    return bookingId;
}

// Reload admin data from localStorage (call this when data might have changed)
function reloadAdminData() {
    adminData = loadAdminData() || initializeDefaultData();
    return adminData;
}

// ============================================
// Dynamic Content Loading
// ============================================

// Load events from admin data
function loadEventsFromAdmin() {
    // Reload data to ensure we have the latest
    reloadAdminData();
    
    const eventsContainer = document.getElementById('events-container');
    if (!eventsContainer) return;
    
    const activeEvents = adminData.events ? adminData.events.filter(e => e.status === 'active') : [];
    
    if (activeEvents.length === 0) {
        eventsContainer.innerHTML = `
            <div class="no-events">
                <i class="fas fa-calendar-times"></i>
                <p>No upcoming events at the moment. Check back soon!</p>
            </div>
        `;
        return;
    }
    
    eventsContainer.innerHTML = activeEvents.map(event => {
        const eventDate = new Date(event.date);
        const month = eventDate.toLocaleString('en-US', { month: 'short' }).toUpperCase();
        const day = eventDate.getDate();
        const timeFormatted = formatTime(event.time);
        
        return `
            <div class="event-card" data-type="${event.type}">
                <div class="event-image">
                    <img src="${event.image}" alt="${event.name} Event at Gameopolis" loading="lazy">
                    <div class="event-date">
                        <span class="event-month">${month}</span>
                        <span class="event-day">${day}</span>
                    </div>
                </div>
                <div class="event-content">
                    <h3>${event.name}</h3>
                    <div class="event-meta">
                        <span><i class="fas fa-clock"></i> ${timeFormatted}</span>
                        <span><i class="fas fa-hourglass-half"></i> ${event.duration} Hours</span>
                    </div>
                    <p class="event-description">${event.description}</p>
                    <div class="event-details">
                        <span class="event-capacity">
                            <i class="fas fa-users"></i> ${event.registered}/${event.capacity} Spots
                        </span>
                        <span class="event-price">₹${event.price}/person</span>
                    </div>
                    <button class="btn btn-primary event-register" data-event-id="${event.id}">Register Now</button>
                </div>
            </div>
        `;
    }).join('');
    
    // Re-attach event listeners to new register buttons
    attachEventRegisterListeners();
}

// Load gallery from admin data
function loadGalleryFromAdmin() {
    // Reload data to ensure we have the latest
    reloadAdminData();
    
    const galleryGrid = document.querySelector('.gallery-grid');
    if (!galleryGrid) return;
    
    const galleryImages = adminData.gallery || [];
    
    if (galleryImages.length === 0) {
        galleryGrid.innerHTML = `
            <div class="no-gallery">
                <i class="fas fa-images"></i>
                <p>No images in gallery yet.</p>
            </div>
        `;
        return;
    }
    
    galleryGrid.innerHTML = galleryImages.map(image => `
        <div class="gallery-item" data-category="${image.category}">
            <img src="${image.url}" alt="${image.alt}" loading="lazy">
            <div class="gallery-overlay">
                <i class="fas fa-search-plus"></i>
            </div>
        </div>
    `).join('');
    
    // Re-attach lightbox functionality
    attachLightboxListeners();
}

// Load menu from admin data
function loadMenuFromAdmin() {
    // Reload data to ensure we have the latest
    reloadAdminData();
    
    const menuContainer = document.querySelector('.menu-container');
    if (!menuContainer) return;
    
    const menu = adminData.menu || {};
    const categories = {
        'hot-beverages': { icon: 'fa-coffee', title: 'Hot Beverages' },
        'cold-beverages': { icon: 'fa-glass-water', title: 'Cold Beverages' },
        'snacks': { icon: 'fa-cookie-bite', title: 'Snacks' },
        'quick-meals': { icon: 'fa-pizza-slice', title: 'Quick Meals' }
    };
    
    let menuHTML = '';
    
    for (const [categoryKey, categoryInfo] of Object.entries(categories)) {
        const items = menu[categoryKey] || [];
        
        menuHTML += `
            <div class="menu-category">
                <h4><i class="fas ${categoryInfo.icon}"></i> ${categoryInfo.title}</h4>
                <ul class="menu-items">
                    ${items.map(item => `
                        <li class="menu-item-row">
                            <span class="item-name">${item.name}</span>
                            <span class="item-price">₹${item.price}</span>
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;
    }
    
    menuContainer.innerHTML = menuHTML;
}

// Format time to 12-hour format
function formatTime(time24) {
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
}

// Attach event register listeners
function attachEventRegisterListeners() {
    const registerButtons = document.querySelectorAll('.event-register');
    
    registerButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const eventId = this.getAttribute('data-event-id');
            const event = adminData.events.find(e => e.id === parseInt(eventId));
            
            if (event) {
                const eventDate = new Date(event.date);
                const month = eventDate.toLocaleString('en-US', { month: 'short' }).toUpperCase();
                const day = eventDate.getDate();
                
                // Scroll to booking form
                const bookingFormSection = document.querySelector('.booking-form-section');
                const notesInput = document.getElementById('notes');
                
                if (bookingFormSection && notesInput) {
                    const navbar = document.getElementById('navbar');
                    const navbarHeight = navbar.offsetHeight;
                    const targetPosition = bookingFormSection.offsetTop - navbarHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Pre-fill notes with event information
                    notesInput.value = `Event Registration: ${event.name} on ${month} ${day}`;
                    
                    // Focus on first input
                    setTimeout(() => {
                        document.getElementById('name').focus();
                    }, 500);
                }
            }
        });
    });
}

// Attach lightbox listeners
function attachLightboxListeners() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    
    let currentImageIndex = 0;
    let visibleGalleryItems = [];
    
    // Open lightbox
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            visibleGalleryItems = Array.from(document.querySelectorAll('.gallery-item:not([style*="display: none"])'));
            currentImageIndex = visibleGalleryItems.indexOf(item);
            const imgSrc = this.querySelector('img').src;
            const imgAlt = this.querySelector('img').alt;
            
            lightboxImg.src = imgSrc;
            lightboxImg.alt = imgAlt;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Close lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    lightboxClose.addEventListener('click', closeLightbox);
    
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Navigate images
    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % visibleGalleryItems.length;
        updateLightboxImage();
    }
    
    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + visibleGalleryItems.length) % visibleGalleryItems.length;
        updateLightboxImage();
    }
    
    function updateLightboxImage() {
        const item = visibleGalleryItems[currentImageIndex];
        const img = item.querySelector('img');
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
    }
    
    lightboxNext.addEventListener('click', showNextImage);
    lightboxPrev.addEventListener('click', showPrevImage);
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowRight') {
            showNextImage();
        } else if (e.key === 'ArrowLeft') {
            showPrevImage();
        }
    });
}

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Reload admin data from localStorage to ensure we have the latest changes
    reloadAdminData();
    
    // Load dynamic content from admin data
    loadEventsFromAdmin();
    loadGalleryFromAdmin();
    loadMenuFromAdmin();
    
    // ============================================
    // Loading Animation
    // ============================================
    const loadingAnimation = document.getElementById('loading-animation');
    
    window.addEventListener('load', function() {
        setTimeout(function() {
            loadingAnimation.classList.add('hidden');
        }, 500);
    });
    
    // ============================================
    // Cookie Consent Banner
    // ============================================
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookies = document.getElementById('accept-cookies');
    const declineCookies = document.getElementById('decline-cookies');
    
    // Check if user has already made a choice
    if (!localStorage.getItem('cookieConsent')) {
        setTimeout(function() {
            cookieBanner.classList.add('show');
        }, 2000);
    }
    
    acceptCookies.addEventListener('click', function() {
        localStorage.setItem('cookieConsent', 'accepted');
        cookieBanner.classList.remove('show');
    });
    
    declineCookies.addEventListener('click', function() {
        localStorage.setItem('cookieConsent', 'declined');
        cookieBanner.classList.remove('show');
    });
    
    // ============================================
    // Mobile Menu Toggle
    // ============================================
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close mobile menu when clicking on a nav link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // ============================================
    // Sticky Navigation & Active Link Highlighting
    // ============================================
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section[id]');
    
    // Sticky navbar on scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Active link highlighting
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
    
    // ============================================
    // Smooth Scroll Navigation
    // ============================================
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = targetSection.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ============================================
    // Back to Top Button
    // ============================================
    const backToTop = document.getElementById('back-to-top');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });
    
    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // ============================================
    // Gallery Lightbox
    // ============================================
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    
    let currentImageIndex = 0;
    let visibleGalleryItems = [];
    
    // Open lightbox
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            visibleGalleryItems = Array.from(document.querySelectorAll('.gallery-item:not([style*="display: none"])'));
            currentImageIndex = visibleGalleryItems.indexOf(item);
            const imgSrc = this.querySelector('img').src;
            const imgAlt = this.querySelector('img').alt;
            
            lightboxImg.src = imgSrc;
            lightboxImg.alt = imgAlt;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Close lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    lightboxClose.addEventListener('click', closeLightbox);
    
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Navigate images
    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % visibleGalleryItems.length;
        updateLightboxImage();
    }
    
    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + visibleGalleryItems.length) % visibleGalleryItems.length;
        updateLightboxImage();
    }
    
    function updateLightboxImage() {
        const item = visibleGalleryItems[currentImageIndex];
        const img = item.querySelector('img');
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
    }
    
    lightboxNext.addEventListener('click', showNextImage);
    lightboxPrev.addEventListener('click', showPrevImage);
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowRight') {
            showNextImage();
        } else if (e.key === 'ArrowLeft') {
            showPrevImage();
        }
    });
    
    // ============================================
    // Gallery Filter
    // ============================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            galleryItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                    item.style.animation = 'fadeIn 0.5s ease';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
    
    // ============================================
    // Event Filter
    // ============================================
    const eventFilterBtns = document.querySelectorAll('.event-filter-btn');
    const eventCards = document.querySelectorAll('.event-card');
    
    eventFilterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active button
            eventFilterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            eventCards.forEach(card => {
                const type = card.getAttribute('data-type');
                
                if (filter === 'all' || type === filter) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeIn 0.5s ease';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
    
    // ============================================
    // Price Calculator
    // ============================================
    const calcDay = document.getElementById('calc-day');
    const calcDuration = document.getElementById('calc-duration');
    const calcPlayers = document.getElementById('calc-players');
    const calcTotal = document.getElementById('calc-total');
    
    function calculatePrice() {
        const rate = parseInt(calcDay.value);
        const duration = parseInt(calcDuration.value) || 0;
        const players = parseInt(calcPlayers.value) || 0;
        
        const total = rate * duration;
        calcTotal.textContent = total;
    }
    
    calcDay.addEventListener('change', calculatePrice);
    calcDuration.addEventListener('input', calculatePrice);
    calcPlayers.addEventListener('input', calculatePrice);
    
    // ============================================
    // FAQ Accordion
    // ============================================
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            // Close other open items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
    
    // ============================================
    // Booking Form Validation
    // ============================================
    const bookingForm = document.getElementById('booking-form');
    
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            
            // Get form fields
            const name = document.getElementById('name');
            const phone = document.getElementById('phone');
            const email = document.getElementById('email');
            const date = document.getElementById('date');
            const time = document.getElementById('time');
            const players = document.getElementById('players');
            
            // Reset errors
            clearErrors();
            
            // Validate name
            if (!name.value.trim()) {
                showError(name, 'Please enter your name');
                isValid = false;
            } else if (name.value.trim().length < 2) {
                showError(name, 'Name must be at least 2 characters');
                isValid = false;
            }
            
            // Validate phone
            if (!phone.value.trim()) {
                showError(phone, 'Please enter your phone number');
                isValid = false;
            } else if (!/^[0-9]{10}$/.test(phone.value.trim())) {
                showError(phone, 'Please enter a valid 10-digit phone number');
                isValid = false;
            }
            
            // Validate email
            if (!email.value.trim()) {
                showError(email, 'Please enter your email address');
                isValid = false;
            } else if (!isValidEmail(email.value.trim())) {
                showError(email, 'Please enter a valid email address');
                isValid = false;
            }
            
            // Validate date
            if (!date.value) {
                showError(date, 'Please select a preferred date');
                isValid = false;
            } else {
                const selectedDate = new Date(date.value);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                
                if (selectedDate < today) {
                    showError(date, 'Please select a future date');
                    isValid = false;
                }
            }
            
            // Validate time
            if (!time.value) {
                showError(time, 'Please select a time slot');
                isValid = false;
            }
            
            // Validate players
            if (!players.value) {
                showError(players, 'Please enter the number of players');
                isValid = false;
            } else if (parseInt(players.value) < 1) {
                showError(players, 'Minimum 1 player required');
                isValid = false;
            } else if (parseInt(players.value) > 20) {
                showError(players, 'Maximum 20 players allowed');
                isValid = false;
            }
            
            // If valid, submit form
            if (isValid) {
                // Collect booking data
                const bookingData = {
                    name: name.value.trim(),
                    phone: phone.value.trim(),
                    email: email.value.trim(),
                    date: date.value,
                    time: time.value,
                    players: parseInt(players.value),
                    notes: document.getElementById('notes').value.trim()
                };
                
                // Save booking to admin data
                const bookingId = saveBookingToAdmin(bookingData);
                
                // Show success message with booking ID
                showSuccessMessage(bookingId);
                
                // Reset form
                bookingForm.reset();
                
                console.log('Booking submitted successfully! ID:', bookingId);
            }
        });
    }
    
    function showError(input, message) {
        const formGroup = input.closest('.form-group');
        const errorElement = formGroup.querySelector('.error-message');
        
        input.classList.add('error');
        errorElement.textContent = message;
    }
    
    function clearErrors() {
        const inputs = bookingForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.classList.remove('error');
            const formGroup = input.closest('.form-group');
            const errorElement = formGroup.querySelector('.error-message');
            if (errorElement) {
                errorElement.textContent = '';
            }
        });
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function showSuccessMessage(bookingId = null) {
        // Create success message element
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        
        const message = bookingId 
            ? `Thank you! Your booking request (ID: ${bookingId}) has been submitted successfully. We will contact you shortly to confirm your reservation.`
            : `Thank you! Your booking request has been submitted successfully. We will contact you shortly to confirm your reservation.`;
        
        successDiv.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <p>${message}</p>
        `;
        successDiv.style.cssText = `
            background: #d4edda;
            color: #155724;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            animation: fadeIn 0.5s ease;
        `;
        
        // Insert before form
        bookingForm.parentNode.insertBefore(successDiv, bookingForm);
        
        // Remove after 5 seconds
        setTimeout(() => {
            successDiv.style.animation = 'fadeOut 0.5s ease';
            setTimeout(() => {
                successDiv.remove();
            }, 500);
        }, 5000);
    }
    
    // ============================================
    // Newsletter Form
    // ============================================
    const newsletterForm = document.getElementById('newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (isValidEmail(email)) {
                // Show success message
                const successDiv = document.createElement('div');
                successDiv.className = 'newsletter-success';
                successDiv.innerHTML = `
                    <i class="fas fa-check-circle"></i>
                    <p>Thank you for subscribing! You'll receive updates about our latest events and offers.</p>
                `;
                successDiv.style.cssText = `
                    background: #d4edda;
                    color: #155724;
                    padding: 1rem;
                    border-radius: 8px;
                    margin-top: 1rem;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    animation: fadeIn 0.5s ease;
                `;
                
                newsletterForm.appendChild(successDiv);
                emailInput.value = '';
                
                // Remove after 5 seconds
                setTimeout(() => {
                    successDiv.style.animation = 'fadeOut 0.5s ease';
                    setTimeout(() => {
                        successDiv.remove();
                    }, 500);
                }, 5000);
            } else {
                emailInput.style.borderColor = '#dc3545';
                setTimeout(() => {
                    emailInput.style.borderColor = '';
                }, 2000);
            }
        });
    }
    
    // ============================================
    // Quick Booking Options
    // ============================================
    const bookingOptions = document.querySelectorAll('.booking-option');
    
    bookingOptions.forEach(option => {
        const btn = option.querySelector('button');
        const players = option.getAttribute('data-players');
        
        btn.addEventListener('click', function() {
            // Scroll to booking form
            const bookingFormSection = document.querySelector('.booking-form-section');
            const playersInput = document.getElementById('players');
            
            if (bookingFormSection && playersInput) {
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = bookingFormSection.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Set players value based on selection
                if (players === '2-4') {
                    playersInput.value = 4;
                } else if (players === '5-8') {
                    playersInput.value = 6;
                } else if (players === '9+') {
                    playersInput.value = 10;
                }
                
                // Focus on first input
                setTimeout(() => {
                    document.getElementById('name').focus();
                }, 500);
            }
        });
    });
    
    // ============================================
    // Event Registration Buttons
    // ============================================
    const eventRegisterBtns = document.querySelectorAll('.event-register');
    
    eventRegisterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const eventCard = this.closest('.event-card');
            const eventName = eventCard.querySelector('h3').textContent;
            const eventDate = eventCard.querySelector('.event-day').textContent + ' ' + eventCard.querySelector('.event-month').textContent;
            
            // Scroll to booking form
            const bookingFormSection = document.querySelector('.booking-form-section');
            const notesInput = document.getElementById('notes');
            
            if (bookingFormSection && notesInput) {
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = bookingFormSection.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Pre-fill notes with event information
                notesInput.value = `Event Registration: ${eventName} on ${eventDate}`;
                
                // Focus on first input
                setTimeout(() => {
                    document.getElementById('name').focus();
                }, 500);
            }
        });
    });
    
    // ============================================
    // Set Minimum Date for Booking Form
    // ============================================
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const minDate = tomorrow.toISOString().split('T')[0];
        dateInput.setAttribute('min', minDate);
    }
    
    // ============================================
    // Intersection Observer for Animations
    // ============================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.pricing-card, .service-item, .value-card, .team-card, .event-card, .gallery-item');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });
    
    // ============================================
    // Add CSS animation keyframes dynamically
    // ============================================
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    `;
    document.head.appendChild(styleSheet);
    
    // ============================================
    // Console Welcome Message
    // ============================================
    console.log('%c🎲 Welcome to Gameopolis! 🎲', 'font-size: 20px; font-weight: bold; color: #D2691E;');
    console.log('%cYour Ultimate Board Game Cafe in T-Nagar, Chennai', 'font-size: 14px; color: #8B4513;');
    console.log('%cBuilt with ❤️ for board game enthusiasts', 'font-size: 12px; color: #6B4423;');
});

// ============================================
// Utility Functions
// ============================================

// Debounce function for performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Format currency
function formatCurrency(amount) {
    return '₹' + amount.toLocaleString('en-IN');
}

// Get day of week from date
function getDayOfWeek(dateString) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const date = new Date(dateString);
    return days[date.getDay()];
}

// Check if date is weekend
function isWeekend(dateString) {
    const day = getDayOfWeek(dateString);
    return day === 'Saturday' || day === 'Sunday';
}

// Check if date is Wednesday
function isWednesday(dateString) {
    return getDayOfWeek(dateString) === 'Wednesday';
}

// Get price based on day of week
function getPriceForDay(dateString) {
    if (isWednesday(dateString)) {
        return 99;
    } else if (isWeekend(dateString)) {
        return 140;
    } else {
        return 120;
    }
}
