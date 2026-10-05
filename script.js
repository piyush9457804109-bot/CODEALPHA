document.addEventListener('DOMContentLoaded', function() {
    
    // grab DOM elements
    const tgs = document.querySelectorAll('.btn');
    const cards = document.querySelectorAll('.pic-box');
    const popup = document.getElementById('gallery-popup');
    const popupImg = document.getElementById('popup-img');
    
    let activeIndex = 0;
    let currentPool = []; // tracks what's currently filtered for the slider

    // set up initial pool of pictures
    refreshPool();

    // --- Category Filters ---
    tgs.forEach(button => {
        button.addEventListener('click', () => {
            // toggle active class on tabs
            document.querySelector('.btn.active').classList.remove('active');
            button.classList.add('active');

            let category = button.getAttribute('data-cat');

            cards.forEach(card => {
                if(category === 'all' || card.classList.contains(category)) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });

            refreshPool(); // update slider array layout
        });
    });

    function refreshPool() {
        currentPool = Array.from(cards).filter(item => !item.classList.contains('hidden'));
    }

    // --- Lightbox Trigger ---
    cards.forEach(card => {
        card.addEventListener('click', () => {
            activeIndex = currentPool.indexOf(card);
            let srcStr = card.querySelector('img').src;
            
            popupImg.src = srcStr;
            popup.classList.add('show');
        });
    });

    // Close controls
    document.querySelector('.close-popup').addEventListener('click', () => {
        popup.classList.remove('show');
    });

    popup.addEventListener('click', (e) => {
        if(e.target === popup) {
            popup.classList.remove('show');
        }
    });

    // --- Next / Prev Slider Logic ---
    function shiftSlide(step) {
        if (currentPool.length === 0) return;

        activeIndex += step;

        // handle boundary loops
        if (activeIndex >= currentPool.length) {
            activeIndex = 0;
        } else if (activeIndex < 0) {
            activeIndex = currentPool.length - 1;
        }

        // update image source
        popupImg.src = currentPool[activeIndex].querySelector('img').src;
    }

    document.querySelector('.right-arrow').addEventListener('click', () => shiftSlide(1));
    document.querySelector('.left-arrow').addEventListener('click', () => shiftSlide(-1));

    // hotkeys for lazy users
    document.addEventListener('keydown', (event) => {
        if (!popup.classList.contains('show')) return;
        
        if (event.key === 'ArrowRight') shiftSlide(1);
        if (event.key === 'ArrowLeft') shiftSlide(-1);
        if (event.key === 'Escape') popup.classList.remove('show');
    });
});