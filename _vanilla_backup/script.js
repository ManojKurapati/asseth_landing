// Modern Scroll Animations using Intersection Observer as an alternative to Scroll Timeline
// since scroll-timeline is still experimental in some browsers.

document.addEventListener('DOMContentLoaded', () => {
    // 1. Fade up elements on scroll
    const sections = document.querySelectorAll('section, .step-card, .asset-card');
    
    // Add fade-up class
    sections.forEach(sec => {
        sec.classList.add('fade-up');
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: stop observing once visible
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    sections.forEach(sec => {
        observer.observe(sec);
    });

    // 2. Simple number ticker for portfolio value in hero if desired
    // (A premium touch would be to animate these numbers from 0 on load)
    const animValue = (elem, endVal, duration) => {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            // Easy out function
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(easeOut * endVal);
            elem.innerHTML = `$${current.toLocaleString()}.00`;
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                elem.innerHTML = `$${endVal.toLocaleString()}.00`;
            }
        };
        window.requestAnimationFrame(step);
    };

    const volumeTicker = document.querySelector('.volume-ticker');
    if (volumeTicker) {
        // Delay slighty for hero load effect
        setTimeout(() => {
            animValue(volumeTicker, 142450, 2000);
        }, 500);
    }
});
