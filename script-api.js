/* ============================================
   Gameopolis - Board Game Cafe Website Scripts (API Version)
   ============================================ */

// ============================================
   // API Configuration
   // ============================================

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
   // Data Loading Functions
   // ============================================

// Load events from API
async function loadEventsFromAdmin() {
    const eventsContainer = document.getElementById('events-container');
    if (!eventsContainer) return;

    try {
        const data = await apiRequest('/events?status=active');
        const events = data.events || [];

        if (events.length === 0) {
            eventsContainer.innerHTML = `
                <div class="no-events">
                    <i class="fas fa-calendar-times"></i>
                    <p>No upcoming events at the moment. Check back soon!</p>
                </div>
            `;
            return;
        }

        eventsContainer.innerHTML = events.map(event => {
            const eventDate = new Date(event.date);
            const month = eventDate.toLocaleString('en-US', { month: 'short' }).toUpperCase();
            const day = eventDate.getDate();
            const timeFormatted = formatTime(event.time);

            return `
                <div class="event-card" data-type="${event.type}">
                    <div class="event-image">
                        <img src="${event.image}" alt="${event.name} Event at Gameopolis" loading="lazy" crossorigin="anonymous">
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
                        <button class="btn btn-primary event-register" data-event-id="${event._id}">Register Now</button>
                    </div>
                </div>
            `;
        }).join('');

        // Re-attach event listeners to new register buttons
        attachEventRegisterListeners();
    } catch (error) {
        console.error('Error loading events:', error);
        eventsContainer.innerHTML = `
            <div class="no-events">
                <i class="fas fa-exclamation-circle"></i>
                <p>Unable to load events. Please try again later.</p>
            </div>
        `;
    }
}

// Load gallery from API
async function loadGalleryFromAdmin() {
    const galleryGrid = document.querySelector('.gallery-grid');
    if (!galleryGrid) return;

    try {
        const data = await apiRequest('/gallery');
        const galleryImages = data.gallery || [];

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
                <img src="${image.url}" alt="${image.alt}" loading="lazy" crossorigin="anonymous">
                <div class="gallery-overlay">
                    <i class="fas fa-search-plus"></i>
                </div>
            </div>
        `).join('');

        // Re-attach lightbox functionality
        attachLightboxListeners();
    } catch (error) {
        console.error('Error loading gallery:', error);
        galleryGrid.innerHTML = `
            <div class="no-gallery">
                <i class="fas fa-exclamation-circle"></i>
                <p>Unable to load gallery. Please try again later.</p>
            </div>
        `;
    }
}

// Load menu from API
async function loadMenuFromAdmin() {
    const menuContainer = document.querySelector('.menu-container');
    if (!menuContainer) return;

    try {
        const data = await apiRequest('/menu');
        const menu = data.menu || {};
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
    } catch (error) {
        console.error('Error loading menu:', error);
        menuContainer.innerHTML = `
            <div class="no-menu">
                <i class="fas fa-exclamation-circle"></i>
                <p>Unable to load menu. Please try again later.</p>
            </div>
        `;
    }
}

// Save booking to API
async function saveBookingToAdmin(bookingData) {
    try {
        const data = await apiRequest('/bookings', {
            method: 'POST',
            body: JSON.stringify(bookingData)
        });

        return data.booking.bookingId;
    } catch (error) {
        console.error('Error saving booking:', error);
        throw error;
    }
}

// ============================================
   // Utility Functions
   // ============================================

// Format time to 12-hour format
function formatTime(time24) {
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
}

// ============================================
   // Event Listeners
   // ============================================

// Attach event register listeners
function attachEventRegisterListeners() {
    const registerButtons = document.querySelectorAll('.event-register');

    registerButtons.forEach(btn => {
        btn.addEventListener('click', async function() {
            const eventId = this.getAttribute('data-event-id');

            try {
                const data = await apiRequest(`/events/${eventId}`);
                const event = data.event;

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
            } catch (error) {
                console.error('Error loading event details:', error);
                alert('Unable to load event details. Please try again.');
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

// ============================================
   // DOM Content Loaded
   // ============================================

document.addEventListener('DOMContentLoaded', function() {

    // Load dynamic content from API
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
       // Smooth Scroll
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
       // Price Calculator
       // ============================================
    const priceCalculator = document.getElementById('price-calculator');
    if (priceCalculator) {
        const durationInput = document.getElementById('duration');
        const playersInput = document.getElementById('players');
        const daySelect = document.getElementById('day-select');
        const calculateBtn = document.getElementById('calculate-btn');
        const priceResult = document.getElementById('price-result');

        calculateBtn.addEventListener('click', function() {
            const duration = parseInt(durationInput.value) || 0;
            const players = parseInt(playersInput.value) || 0;
            const day = daySelect.value;

            let hourlyRate = 120; // Default weekday rate

            if (day === 'wednesday') {
                hourlyRate = 99;
            } else if (day === 'weekend') {
                hourlyRate = 140;
            }

            const total = duration * players * hourlyRate;

            priceResult.innerHTML = `
                <div class="price-breakdown">
                    <p><strong>Hourly Rate:</strong> ₹${hourlyRate}/hour</p>
                    <p><strong>Duration:</strong> ${duration} hours</p>
                    <p><strong>Players:</strong> ${players}</p>
                    <p class="total-price"><strong>Total:</strong> ₹${total}</p>
                </div>
            `;
        });
    }

    // ============================================
       // Booking Form
       // ============================================
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const email = document.getElementById('email').value.trim();
            const date = document.getElementById('date').value;
            const time = document.getElementById('time').value;
            const players = document.getElementById('players').value;
            const notes = document.getElementById('notes').value.trim();

            // Validation
            if (!name || !phone || !email || !date || !time || !players) {
                alert('Please fill in all required fields.');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address.');
                return;
            }

            // Phone validation (10 digits)
            const phoneRegex = /^[6-9]\d{9}$/;
            if (!phoneRegex.test(phone)) {
                alert('Please enter a valid 10-digit phone number.');
                return;
            }

            const bookingData = {
                name,
                phone,
                email,
                date,
                time,
                players: parseInt(players),
                notes
            };

            try {
                const bookingId = await saveBookingToAdmin(bookingData);
                alert(`Booking submitted successfully! Your booking ID is ${bookingId}. We will contact you shortly to confirm.`);
                bookingForm.reset();
            } catch (error) {
                alert('Failed to submit booking. Please try again or contact us directly.');
            }
        });
    }

    // ============================================
       // Quick Booking Buttons
       // ============================================
    const quickBookingBtns = document.querySelectorAll('.quick-booking-btn');
    quickBookingBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const players = this.getAttribute('data-players');
            const playersInput = document.getElementById('players');
            if (playersInput) {
                playersInput.value = players;
            }

            const bookingFormSection = document.querySelector('.booking-form-section');
            if (bookingFormSection) {
                const navbar = document.getElementById('navbar');
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = bookingFormSection.offsetTop - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================
       // Gallery Filter
       // ============================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');

            const filter = this.getAttribute('data-filter');
            const galleryItems = document.querySelectorAll('.gallery-item');

            galleryItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });

            // Re-attach lightbox listeners after filtering
            attachLightboxListeners();
        });
    });

    // ============================================
       // Back to Top Button
       // ============================================
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 500) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ============================================
       // FAQ Accordion
       // ============================================
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const answer = this.nextElementSibling;
            const isActive = this.classList.contains('active');

            // Close all other FAQs
            faqQuestions.forEach(q => {
                q.classList.remove('active');
                q.nextElementSibling.classList.remove('active');
            });

            // Toggle current FAQ
            if (!isActive) {
                this.classList.add('active');
                answer.classList.add('active');
            }
        });
    });
});
