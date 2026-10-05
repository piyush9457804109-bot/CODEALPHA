document.addEventListener('DOMContentLoaded', function() {
    
    const mobileMenuBtn = document.getElementById('mobile-menu');
    const navLinksList = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links a');

    // Toggle the mobile drawer overlay layout
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            navLinksList.classList.toggle('active');
        });
    }

    // Shut drawer down when clicking items 
    links.forEach(link => {
        link.addEventListener('click', () => {
            // Check if drawer is wide open before hiding it
            if (navLinksList.classList.contains('active')) {
                mobileMenuBtn.classList.remove('active');
                navLinksList.classList.remove('active');
            }
        });
    });
    
});