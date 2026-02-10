# Gameopolis Website - Development Plan

## Project Overview
A complete, modern, and professional single-page website for Gameopolis - a board game cafe located in T-Nagar, Chennai, India.

## Brand Identity
- **Business Name:** Gameopolis
- **Location:** T-Nagar, Chennai, India
- **Theme:** Modern gaming cafe with warm, social, and welcoming vibes
- **Color Palette:** Warm earth tones mixed with gaming-inspired accents

## Color Palette
```css
--primary-color: #D2691E;      /* Warm Orange/Brown */
--secondary-color: #8B4513;    /* Saddle Brown */
--accent-color: #FFA500;       /* Orange */
--background-light: #FFF8DC;   /* Cream */
--background-dark: #2C1810;    /* Dark Brown */
--text-primary: #2C1810;       /* Dark Brown */
--text-secondary: #6B4423;     /* Medium Brown */
--white: #FFFFFF;
--success: #28a745;
--error: #dc3545;
```

## File Structure
```
Gameopolis/
├── index.html          # Main HTML file
├── styles.css          # External CSS stylesheet
├── script.js           # JavaScript for interactivity
└── plan.md            # This planning document
```

## HTML Structure (index.html)

### 1. Document Head
- Meta tags for SEO (description, keywords, viewport)
- Title tag
- Link to external CSS
- Font imports (Google Fonts: Poppins for headings, Open Sans for body)
- Font Awesome CDN for icons

### 2. Navigation Bar (Sticky)
- Logo/Brand name
- Navigation links: Home, About Us, Services & Pricing, Gallery, Events, Contact & Booking
- Mobile hamburger menu
- Book Now CTA button

### 3. Home Section (#home)
- Hero banner with gradient overlay
- Main heading: "Gameopolis"
- Subtitle: "Your Ultimate Board Game Cafe in T-Nagar, Chennai"
- CTA buttons: "Book Now", "Explore Games"
- Brief introduction text
- Featured game categories section (Strategy, Party Games, Family Games, Card Games)

### 4. About Us Section (#about)
- Company story
- Mission statement
- Cafe environment description
- Values section
- Team/Owner information

### 5. Services & Pricing Section (#pricing)
- Pricing table with three tiers:
  - Wednesday: ₹99/hour (special offer)
  - Weekdays: ₹120/hour (Mon, Tue, Thu, Fri)
  - Weekends: ₹140/hour (Sat, Sun)
- Included services list
- Food & beverages menu placeholder ("Coming Soon")
- Group packages placeholder
- Booking process explanation
- Price calculator tool

### 6. Gallery Section (#gallery)
- Grid layout (responsive: 1 col mobile, 2 col tablet, 3-4 col desktop)
- Image categories: Cafe Interior, Board Games, Gaming Tables, Customer Experience
- Lazy loading images
- Lightbox functionality for enlarged view

### 7. Events Section (#events)
- Filter buttons: All, Tournaments, Casual Nights, Themed Events
- Event cards with:
  - Event name and date
  - Time and duration
  - Description
  - Registration button
  - Capacity indicator
- Sample events: "New Year Game Party", "Strategy Night"
- "Add New Event" admin placeholder
- Newsletter signup form

### 8. Contact & Booking Section (#contact)
- Contact information (address, phone, email, hours)
- Embedded Google Map (T-Nagar, Chennai)
- Contact form with fields:
  - Name
  - Phone number
  - Email
  - Preferred date
  - Preferred time slot
  - Number of players
  - Additional notes
- Quick booking options (2-4, 5-8, 9+ players)
- Social media links
- FAQ accordion

### 9. Footer
- Quick links
- Contact info
- Social media icons
- Copyright notice

### 10. Additional Elements
- Back-to-top button
- Loading animation overlay
- Cookie consent banner (optional)

## CSS Structure (styles.css)

### 1. CSS Variables & Reset
- Color variables
- Font variables
- Spacing variables
- CSS reset

### 2. Global Styles
- Body styling
- Typography
- Container classes
- Utility classes

### 3. Navigation Bar
- Sticky positioning
- Logo styling
- Menu items styling
- Mobile menu styling
- Hamburger animation

### 4. Hero Section
- Background image with overlay
- Text styling
- CTA buttons
- Featured categories

### 5. About Section
- Story layout
- Mission statement styling
- Values grid
- Team section

### 6. Pricing Section
- Pricing table design
- Card styling
- Price calculator styling
- Menu placeholder

### 7. Gallery Section
- Grid layout
- Image styling
- Lightbox modal
- Hover effects

### 8. Events Section
- Filter buttons
- Event card design
- Newsletter form
- Add event button

### 9. Contact Section
- Contact info layout
- Map container
- Form styling
- Quick booking cards
- FAQ accordion
- Social media links

### 10. Footer
- Layout
- Link styling
- Social icons

### 11. Additional Components
- Back-to-top button
- Loading animation
- Cookie banner

### 12. Media Queries
- Mobile (max-width: 768px)
- Tablet (768px - 1024px)
- Desktop (min-width: 1024px)

## JavaScript Functionality (script.js)

### 1. Mobile Menu Toggle
- Open/close mobile menu
- Smooth animation
- Close on link click

### 2. Smooth Scroll Navigation
- Smooth scrolling to sections
- Active link highlighting
- Offset for sticky header

### 3. Form Validation
- Contact form validation
- Error messages
- Success feedback

### 4. Gallery Lightbox
- Open lightbox on image click
- Navigate between images
- Close lightbox
- Keyboard navigation

### 5. Price Calculator
- Calculate total cost based on:
  - Day of week selection
  - Duration (hours)
  - Number of players
- Display result dynamically

### 6. Back-to-Top Button
- Show/hide based on scroll position
- Smooth scroll to top

### 7. Loading Animation
- Show on page load
- Hide after content loads

### 8. Event Filtering
- Filter events by category
- Smooth transitions

### 9. FAQ Accordion
- Expand/collapse functionality
- Smooth animation

### 10. Cookie Consent Banner
- Show on first visit
- Accept/Decline options
- Store preference

## Image Placeholders
Use placeholder images from services like:
- Unsplash (board game cafe, gaming tables, cafe interior)
- Placeholder.com for generic placeholders
- Local images when available

## Accessibility Features
- ARIA labels for interactive elements
- Keyboard navigation support
- Alt text for all images
- Proper heading hierarchy
- Focus states for all interactive elements
- Color contrast compliance (WCAG AA)

## SEO Optimization
- Meta description
- Meta keywords
- Open Graph tags
- Twitter Card tags
- Semantic HTML structure
- Proper heading hierarchy
- Alt text for images

## Performance Optimization
- Lazy loading images
- Minified CSS/JS (in production)
- Optimized image sizes
- CSS animations instead of JavaScript where possible
- Efficient DOM manipulation

## Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Graceful degradation for older browsers
- Vendor prefixes where needed

## Contact Information (T-Nagar, Chennai)
- Address: Placeholder address in T-Nagar
- Phone: +91 XXXXX XXXXX
- Email: info@gameopolis.in
- Hours: Mon-Sun, 11:00 AM - 10:00 PM

## Google Map Location
- T-Nagar, Chennai, Tamil Nadu, India
- Coordinates: ~13.0400° N, 80.2330° E

## Implementation Order
1. Create HTML structure with all sections
2. Add CSS styling with responsive design
3. Implement JavaScript functionality
4. Add placeholder images
5. Test all features
6. Optimize for performance
7. Verify accessibility compliance
