// Accordion toggle with smooth scroll to expanded card (accounts for fixed header)
document.addEventListener('DOMContentLoaded', () => {
    const triggers = document.querySelectorAll('.project-header-trigger');
    const header = document.querySelector('header');

    const headerHeight = () => (header ? header.getBoundingClientRect().height : 0);

    triggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            const parent = trigger.parentElement;

            // Collapse other accordions
            document.querySelectorAll('.project-accordion').forEach(item => {
                if (item !== parent) item.classList.remove('active');
            });

            // Toggle current
            const isActive = parent.classList.toggle('active');

            // If activated, wait for the expand animation to start then scroll into view
            if (isActive) {
                // Allow layout to update so max-height begins increasing, then scroll
                requestAnimationFrame(() => {
                    // small timeout to let CSS transition kick in for smoother perception
                    setTimeout(() => {
                        const rect = parent.getBoundingClientRect();
                        const scrollTop = window.pageYOffset + rect.top - headerHeight() - 16;
                        window.scrollTo({ top: scrollTop, behavior: 'smooth' });
                    }, 60);
                });
            }
        });

        // Allow keyboard access: Enter / Space toggles
        trigger.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                trigger.click();
            }
        });
    });
});
