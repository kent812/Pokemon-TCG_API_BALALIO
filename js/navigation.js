// Navigation Module
const NavigationModule = {
    // Initialize navigation
    init: function() {
        this.setupEventListeners();
    },
    
    // Setup event listeners
    setupEventListeners: function() {
        const navLinks = document.querySelectorAll('.nav-link');
        const userAvatar = document.getElementById('userAvatar');
        const submitBtn = document.querySelector('.submit-btn');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.getAttribute('data-page');
                this.navigateToPage(page);
            });
        });
        
        // User avatar click navigates to profile
        userAvatar.addEventListener('click', () => {
            this.navigateToPage('profile');
        });
        
        // Contact form submission
        if (submitBtn) {
            submitBtn.addEventListener('click', () => this.handleContactSubmit());
        }
    },
    
    // Navigate to page
    navigateToPage: function(page) {
        const navLinks = document.querySelectorAll('.nav-link');
        const pageSections = document.querySelectorAll('.page-section');
        
        // Update active nav link
        navLinks.forEach(nav => nav.classList.remove('active'));
        const activeLink = document.querySelector(`.nav-link[data-page="${page}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
        
        // Show selected page
        pageSections.forEach(section => {
            section.classList.remove('active');
            if (section.id === page) {
                section.classList.add('active');
                
                // Update profile if navigating to profile page
                if (page === 'profile' && window.ProfileModule) {
                    ProfileModule.updateProfile();
                }
            }
        });
    },
    
    // Handle contact form submission
    handleContactSubmit: function() {
        const name = SecurityUtils.sanitizeInput(document.getElementById('name').value);
        const email = SecurityUtils.sanitizeInput(document.getElementById('email').value);
        const subject = SecurityUtils.sanitizeInput(document.getElementById('subject').value);
        const message = SecurityUtils.sanitizeInput(document.getElementById('message').value);
        
        if (!name || !email || !subject || !message) {
            alert('Please fill in all fields before submitting.');
            return;
        }
        
        if (!SecurityUtils.validateEmail(email)) {
            alert('Please enter a valid email address.');
            return;
        }
        
        // In a real application, you would send this data to a server
        alert('Thank you for your message! We will get back to you soon.');
        
        // Clear the form
        document.getElementById('name').value = '';
        document.getElementById('email').value = '';
        document.getElementById('subject').value = '';
        document.getElementById('message').value = '';
    }
};