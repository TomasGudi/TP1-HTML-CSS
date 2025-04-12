// js/dark-mode.js

// Wait for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;
    const storageKey = 'darkModeEnabled';
    const htmlElement = document.documentElement; // Target the <html> element

    // Function to enable dark mode
    const enableDarkMode = () => {
        body.classList.add('dark-mode');
        localStorage.setItem(storageKey, 'true');
        if (darkModeToggle) { // Check if button exists
            darkModeToggle.textContent = '☀️'; // Change icon to sun
            darkModeToggle.setAttribute('aria-label', 'Switch to light mode');
        }
        htmlElement.classList.remove('dark-mode-preload'); // Remove preload class
    };

    // Function to disable dark mode
    const disableDarkMode = () => {
        body.classList.remove('dark-mode');
        localStorage.setItem(storageKey, 'false');
        if (darkModeToggle) { // Check if button exists
            darkModeToggle.textContent = '🌙'; // Change icon to moon
            darkModeToggle.setAttribute('aria-label', 'Switch to dark mode');
        }
        htmlElement.classList.remove('dark-mode-preload'); // Remove preload class
    };

    // --- Initial Theme Setup ---
    // This part runs after the DOM is loaded, ensuring the button state is correct
    // The core FOUC prevention is handled by the inline script in <head>

    const storedPreference = localStorage.getItem(storageKey);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Check if dark mode should be enabled based on storage or preference
    let darkModeInitiallyEnabled = false;
    if (storedPreference === 'true') {
        darkModeInitiallyEnabled = true;
    } else if (storedPreference === null && prefersDark) {
        darkModeInitiallyEnabled = true;
    }

    // Apply the correct class to body and set button state
    if (darkModeInitiallyEnabled) {
        // Ensure body class is added (might have only been on html initially by preload script)
        if (!body.classList.contains('dark-mode')) {
            body.classList.add('dark-mode');
        }
        if (darkModeToggle) {
            darkModeToggle.textContent = '☀️';
            darkModeToggle.setAttribute('aria-label', 'Switch to light mode');
        }
    } else {
        // Ensure body class is removed
        if (body.classList.contains('dark-mode')) {
            body.classList.remove('dark-mode');
        }
        if (darkModeToggle) {
            darkModeToggle.textContent = '🌙';
            darkModeToggle.setAttribute('aria-label', 'Switch to dark mode');
        }
    }

    // Remove preload class safely after styles are likely applied and JS has run
    // Use requestAnimationFrame for better timing after render
    requestAnimationFrame(() => {
        htmlElement.classList.remove('dark-mode-preload');
    });


    // --- Event Listeners ---

    // Add event listener to the toggle button (only if it exists)
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            if (body.classList.contains('dark-mode')) {
                disableDarkMode();
            } else {
                enableDarkMode();
            }
        });
    } else {
        console.warn("Dark mode toggle button with ID 'darkModeToggle' not found.");
    }


    // Optional: Listen for changes in system preference
    try {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        // Check if addEventListener is supported (newer method)
        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', event => {
                // Only automatically change if the user hasn't manually set a preference
                if (localStorage.getItem(storageKey) === null) {
                    if (event.matches) {
                        enableDarkMode();
                    } else {
                        disableDarkMode();
                    }
                }
            });
        }
        // Fallback for older browsers (like Safari < 14)
        else if (mediaQuery.addListener) {
             mediaQuery.addListener(event => {
                if (localStorage.getItem(storageKey) === null) {
                    if (event.matches) {
                        enableDarkMode();
                    } else {
                        disableDarkMode();
                    }
                }
            });
        }
    } catch (e) {
        console.error("Error setting up media query listener for dark mode:", e);
    }
});
