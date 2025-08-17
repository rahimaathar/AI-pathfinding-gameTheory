// Main JavaScript for AI Algorithms Demo
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM loaded, initializing JavaScript...');
    // Smooth scrolling for navigation links (only navbar links)
    document.querySelectorAll('.navbar-nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add debugging for main buttons
    document.querySelectorAll('.hero-section .btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            console.log('Button clicked:', this.textContent.trim(), 'href:', this.getAttribute('href'));
        });
    });

    // Algorithm tab functionality
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const algorithm = this.dataset.algorithm;
            const card = this.closest('.algorithm-detail-card');

            // Update active tab
            card.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // Update description (you can add more detailed descriptions here)
            const descriptions = {
                'dfs': 'Depth-First Search explores as far as possible along each branch before backtracking. It uses a stack data structure and is memory efficient but may not find the shortest path.',
                'bfs': 'Breadth-First Search explores all nodes at the current depth before moving to nodes at the next depth level. It uses a queue and guarantees the shortest path.',
                'astar': 'A* Search is an informed search algorithm that uses heuristic functions to estimate the cost to reach the goal. It combines the benefits of both uniform-cost search and greedy best-first search.',
                'arc': 'Arc Consistency is a constraint propagation technique that removes inconsistent values from variable domains. It\'s a preprocessing step that can significantly reduce the search space.',
                'backtracking': 'DFS Backtracking is a systematic search through the space of possible assignments. When a constraint violation is detected, the algorithm backtracks to the previous decision point and tries a different assignment.'
            };

            const descriptionEl = card.querySelector('.algorithm-description');
            if (descriptionEl && descriptions[algorithm]) {
                descriptionEl.innerHTML = `<p><strong>${algorithm.toUpperCase()}:</strong> ${descriptions[algorithm]}</p>`;
            }
        });
    });

    // Add hover effects to demo cards
    document.querySelectorAll('.demo-card').forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) scale(1)';
        });

        // Add click debugging
        card.addEventListener('click', function (e) {
            console.log('Demo card clicked:', this.querySelector('h4').textContent);
        });
    });

    // Add animation to feature cards on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    // Observe feature cards and demo cards
    document.querySelectorAll('.feature-card, .demo-card, .algorithm-detail-card').forEach(card => {
        observer.observe(card);
    });

    // Add parallax effect to hero section
    window.addEventListener('scroll', function () {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero-section');
        if (hero) {
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        }
    });

    // Add typing effect to hero title
    const heroTitle = document.querySelector('.hero-section h1');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        heroTitle.style.borderRight = '2px solid white';

        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            } else {
                heroTitle.style.borderRight = 'none';
            }
        };

        // Start typing effect after a short delay
        setTimeout(typeWriter, 500);
    }

    // Add counter animation to statistics
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);

        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(start);
            }
        }, 16);
    }

    // Animate counters when they come into view
    const counterObserver = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.textContent);
                animateCounter(entry.target, target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    // Observe all number elements for animation
    document.querySelectorAll('h4, h5').forEach(el => {
        if (!isNaN(parseInt(el.textContent))) {
            counterObserver.observe(el);
        }
    });

    // Add loading animation for buttons
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function () {
            if (!this.disabled) {
                const originalText = this.innerHTML;
                this.innerHTML = '<span class="loading"></span> Loading...';
                this.disabled = true;

                // Re-enable after a delay (for demo purposes)
                setTimeout(() => {
                    this.innerHTML = originalText;
                    this.disabled = false;
                }, 2000);
            }
        });
    });

    // Add tooltip functionality
    document.querySelectorAll('[data-tooltip]').forEach(element => {
        element.addEventListener('mouseenter', function () {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = this.dataset.tooltip;
            tooltip.style.cssText = `
                position: absolute;
                background: rgba(0,0,0,0.8);
                color: white;
                padding: 5px 10px;
                border-radius: 5px;
                font-size: 12px;
                z-index: 1000;
                pointer-events: none;
            `;

            document.body.appendChild(tooltip);

            const rect = this.getBoundingClientRect();
            tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 5 + 'px';

            this.tooltip = tooltip;
        });

        element.addEventListener('mouseleave', function () {
            if (this.tooltip) {
                this.tooltip.remove();
                this.tooltip = null;
            }
        });
    });

    // Add responsive navigation toggle
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');

    if (navbarToggler && navbarCollapse) {
        navbarToggler.addEventListener('click', function () {
            navbarCollapse.classList.toggle('show');
        });
    }

    // Add scroll-based navbar background
    window.addEventListener('scroll', function () {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Add CSS for scrolled navbar
    const navbarStyle = document.createElement('style');
    navbarStyle.textContent = `
        .navbar.scrolled {
            background: rgba(33, 37, 41, 0.95) !important;
            backdrop-filter: blur(10px);
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .tooltip {
            animation: fadeIn 0.3s ease-in;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(navbarStyle);

    // Add keyboard navigation
    document.addEventListener('keydown', function (e) {
        // Escape key to close modals or tooltips
        if (e.key === 'Escape') {
            document.querySelectorAll('.tooltip').forEach(tooltip => tooltip.remove());
        }

        // Arrow keys for demo navigation
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
            const activeTab = document.querySelector('.tab-btn.active');
            if (activeTab) {
                const tabs = Array.from(activeTab.parentElement.querySelectorAll('.tab-btn'));
                const currentIndex = tabs.indexOf(activeTab);
                let newIndex;

                if (e.key === 'ArrowRight') {
                    newIndex = (currentIndex + 1) % tabs.length;
                } else {
                    newIndex = (currentIndex - 1 + tabs.length) % tabs.length;
                }

                tabs[newIndex].click();
            }
        }
    });

    // Add performance monitoring
    if ('performance' in window) {
        window.addEventListener('load', function () {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            console.log(`Page loaded in ${loadTime}ms`);
        });
    }

    // Add error handling for failed API calls
    window.addEventListener('error', function (e) {
        console.error('JavaScript error:', e.error);
    });

    // Add unhandled promise rejection handling
    window.addEventListener('unhandledrejection', function (e) {
        console.error('Unhandled promise rejection:', e.reason);
    });
});
