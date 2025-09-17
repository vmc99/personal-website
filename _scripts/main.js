$(function() {
  // Prevent auto-scroll restoration on page refresh
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  // Force scroll to top on page load/refresh
  window.scrollTo(0, 0);

  // Loading animation with better error handling
  const loadingScreen = document.getElementById('loading-screen');
  const introVisual = document.getElementById('intro-visual');

  // Fallback to hide loading screen if something goes wrong
  const hideLoadingScreen = function() {
    if (loadingScreen) {
      loadingScreen.classList.add('fade-out');
      setTimeout(function() {
        loadingScreen.style.display = 'none';
        // Show intro visual elements after loading completes
        if (introVisual) {
          introVisual.classList.add('loaded');
        }
      }, 500); // Match the transition duration
    }
  };

  // Hide loading screen after page loads
  window.addEventListener('load', function() {
    setTimeout(hideLoadingScreen, 2500); // Reduced from 2000 to 2500ms
  });

  // Emergency fallback - hide loading screen after 5 seconds no matter what
  setTimeout(hideLoadingScreen, 5000);

  const body = document.querySelector('body');

  // Get all toggle elements (both original and navbar)
  const toggles = document.querySelectorAll('[id="toggle"]');
  const inputs = document.querySelectorAll('[id="switch"]');

  // Set initial state to dark mode by default
  inputs.forEach((input) => (input.checked = true));
  body.classList.add('night');

  // Function to toggle theme
  function toggleTheme() {
    const isNight = body.classList.contains('night');
    if (isNight) {
      body.classList.remove('night');
      inputs.forEach((input) => (input.checked = false));
    } else {
      body.classList.add('night');
      inputs.forEach((input) => (input.checked = true));
    }
  }

  // Add event listeners to all toggle buttons
  toggles.forEach((toggle) => {
    toggle.addEventListener('click', function(e) {
      e.preventDefault(); // Prevent the default label click behavior
      toggleTheme();
    });
  });

  // Also add listeners to the inputs themselves to sync
  inputs.forEach(input => {
    input.addEventListener('change', function(e) {
      // Sync all other inputs to match this one
      const isChecked = this.checked;
      inputs.forEach(inp => {
        if (inp !== this) {
          inp.checked = isChecked;
        }
      });
      
      // Update theme based on the new state
      if (isChecked) {
        body.classList.add('night');
      } else {
        body.classList.remove('night');
      }
    });
  });

  const introHeight = document.querySelector('.intro').offsetHeight;
  const topButton = document.getElementById('top-button');
  const $topButton = $('#top-button');
  const navbar = document.getElementById('navbar');
  
  let lastScrollY = window.scrollY;
  let isScrollingUp = false;

  window.addEventListener(
    'scroll',
    function() {
      const currentScrollY = window.scrollY;
      
      // Determine scroll direction
      isScrollingUp = currentScrollY < lastScrollY;
      lastScrollY = currentScrollY;
      
      // Show/hide top button
      if (currentScrollY > introHeight) {
        $topButton.fadeIn();
      } else {
        $topButton.fadeOut();
      }
      
      if (currentScrollY > 100) {
        // Start showing after scrolling 100px
        if (isScrollingUp) {
          navbar.classList.add('visible');
          body.classList.add('navbar-visible');
        } else {
          navbar.classList.remove('visible');
          body.classList.remove('navbar-visible');
        }
      } else {
        navbar.classList.remove('visible');
        body.classList.remove('navbar-visible');
      }
    },
    false
  );

  topButton.addEventListener('click', function() {
    $('html, body').animate({ scrollTop: 0 }, 500);
  });

  const hand = document.querySelector('.emoji.wave-hand');

  function waveOnLoad() {
    hand.classList.add('wave');
    setTimeout(function() {
      hand.classList.remove('wave');
    }, 2000);
  }

  setTimeout(function() {
    waveOnLoad();
  }, 1000);

  hand.addEventListener('mouseover', function() {
    hand.classList.add('wave');
  });

  hand.addEventListener('mouseout', function() {
    hand.classList.remove('wave');
  });

  window.sr = ScrollReveal({
    reset: false,
    duration: 600,
    easing: 'cubic-bezier(.694,0,.335,1)',
    scale: 1,
    viewFactor: 0.3,
  });

  sr.reveal('.background');
  sr.reveal('.skills');
  sr.reveal('.experience', { viewFactor: 0.05 });
  sr.reveal('.featured-projects', { viewFactor: 0.1 });
  sr.reveal('.other-projects', { viewFactor: 0.05 });
});

// Global function for navbar logo scroll to top
function scrollToTop() {
  $('html, body').animate({ scrollTop: 0 }, 500);
  return false;
}

// Toggle job description function
function toggleJobDescription(toggleElement) {
  const description = toggleElement.nextElementSibling;
  const icon = toggleElement.querySelector('.toggle-icon');
  const text = toggleElement.querySelector('.toggle-text');
  
  if (description.classList.contains('collapsed')) {
    // Expand
    description.classList.remove('collapsed');
    icon.classList.add('rotated');
    text.textContent = 'Hide Details';
  } else {
    // Collapse
    description.classList.add('collapsed');
    icon.classList.remove('rotated');
    text.textContent = 'More Details';
  }
}

// Mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const navbarMenu = document.getElementById('navbar-menu');
  
  if (mobileMenuToggle && navbarMenu) {
    mobileMenuToggle.addEventListener('click', function() {
      mobileMenuToggle.classList.toggle('active');
      navbarMenu.classList.toggle('mobile-menu-open');
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
      if (!mobileMenuToggle.contains(event.target) && !navbarMenu.contains(event.target)) {
        mobileMenuToggle.classList.remove('active');
        navbarMenu.classList.remove('mobile-menu-open');
      }
    });
    
    // Close mobile menu when clicking on social links
    const socialLinks = navbarMenu.querySelectorAll('.social a');
    socialLinks.forEach(link => {
      link.addEventListener('click', function() {
        mobileMenuToggle.classList.remove('active');
        navbarMenu.classList.remove('mobile-menu-open');
      });
    });
  }
});
