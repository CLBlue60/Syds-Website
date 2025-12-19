// ===== BOOK FUNCTIONALITY =====
$(document).ready(function() {
    console.log('📖 Silver Effects Beauty - Initializing...');
    
    // Page display configuration
    const pageConfig = {
        1: "Page 1",                    // Cover (single page)
        2: "Pages 2-3",                 // TOC + About
        3: "Pages 4-5",                 // About + Portfolio Intro
        4: "Pages 6-7",                 // Portfolio
        5: "Pages 8-9",                 // Commission
        6: "Pages 10-11"                // Contact
    };
    
    const totalSpreads = 6;
    let currentSpread = 1;
    
    // Initialize the book
    initializeBook();
    
    // Portfolio item click functionality
    $('.portfolio-item').click(function() {
        const title = $(this).find('h5').text();
        alert(`✨ ${title} ✨\n\nThis would open a detailed view with more images and information about this piece.\n\n(Feature to be implemented)`);
    });
    
    // Table of Contents navigation
    $('.toc-item').click(function() {
        const targetSpread = $(this).data('spread');
        goToSpread(targetSpread);
    });
    
    // Navigation buttons
    $('#prev-page').click(function() {
        if (currentSpread > 1) {
            goToSpread(currentSpread - 1);
        }
    });
    
    $('#next-page').click(function() {
        if (currentSpread < totalSpreads) {
            goToSpread(currentSpread + 1);
        }
    });
    
    // Navigation dots
    $('.nav-dot').click(function() {
        const targetSpread = $(this).data('spread');
        goToSpread(targetSpread);
    });
    
    // Keyboard navigation
    $(document).keydown(function(e) {
        if (e.keyCode == 37 && currentSpread > 1) { // Left arrow
            goToSpread(currentSpread - 1);
            e.preventDefault();
        } else if (e.keyCode == 39 && currentSpread < totalSpreads) { // Right arrow
            goToSpread(currentSpread + 1);
            e.preventDefault();
        }
    });
    
    // Initialize the book
    function initializeBook() {
        console.log('Setting up book layout...');
        
        // Show first spread (cover)
        goToSpread(1);
        
        // Initial animations
        setTimeout(function() {
            $('.site-title').css('animation', 'title-glow 3s ease-in-out infinite alternate');
            $('.cover-ornament').css('animation', 'gentle-float 4s ease-in-out infinite');
        }, 500);
    }
    
    // Navigate to specific spread
    function goToSpread(spreadNumber) {
        console.log('Navigating to spread:', spreadNumber);
        
        // Update current spread
        currentSpread = spreadNumber;
        
        // Hide all spreads
        $('.page-spread').removeClass('active');
        
        // Show the target spread
        $(`#spread-${spreadNumber}`).addClass('active');
        
        // Update navigation indicators
        updatePageIndicator(spreadNumber);
        
        // Smooth scroll to top of page content
        $('.page-content').scrollTop(0);
    }
    
    // Update page indicator
    function updatePageIndicator(spreadNumber) {
        // Update page numbers display
        $('#current-pages').text(pageConfig[spreadNumber]);
        
        // Update button states
        $('#prev-page').prop('disabled', spreadNumber === 1);
        $('#next-page').prop('disabled', spreadNumber === totalSpreads);
        
        // Update button text for better UX
        if (spreadNumber === 1) {
            $('#prev-page').html('<i class="fas fa-chevron-left"></i> Cover');
        } else {
            $('#prev-page').html('<i class="fas fa-chevron-left"></i> Previous');
        }
        
        if (spreadNumber === totalSpreads) {
            $('#next-page').html('End <i class="fas fa-chevron-right"></i>');
            $('#next-page').prop('disabled', true);
        } else {
            $('#next-page').html('Next <i class="fas fa-chevron-right"></i>');
        }
        
        // Update nav dots
        updateNavDots(spreadNumber);
        
        // Remove pulse animation from next button after first turn
        if (spreadNumber > 1) {
            $('#next-page').removeClass('pulse');
        }
    }
    
    // Update navigation dots
    function updateNavDots(spreadNumber) {
        $('.nav-dot').removeClass('active');
        $(`.nav-dot[data-spread="${spreadNumber}"]`).addClass('active');
    }
});

// ===== CONTACT FORM FUNCTIONALITY =====
$(document).ready(function() {
    console.log('📧 Contact form loading...');
    
    // Character counter
    $('#message').on('input', function() {
        const length = $(this).val().length;
        $('#char-count').text(length);
        
        if (length > 700) {
            $('#char-count').css('color', '#DC143C');
        } else if (length > 600) {
            $('#char-count').css('color', '#FF8C00');
        } else {
            $('#char-count').css('color', '#c9a227');
        }
    });
    
    // Set reply-to email automatically
    $('#email').on('blur', function() {
        $('#reply-to').val($(this).val());
    });
    
    // Form submission handler
    $('#contact-form').submit(function(e) {
        e.preventDefault();
        
        const form = $(this);
        const submitBtn = $('#submit-btn');
        const spinner = $('#loading-spinner');
        const formData = new FormData(form[0]);
        
        // Remove any existing messages
        $('.form-message').remove();
        
        // Validate form
        if (!validateForm()) {
            return false;
        }
        
        // Show loading state
        submitBtn.prop('disabled', true);
        spinner.show();
        submitBtn.find('i').hide();
        
        // Submit to Formspree using Fetch API
        fetch(form.attr('action'), {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                // Success
                showFormMessage('success', `
                    <i class="fas fa-check-circle"></i>
                    <h4>Message Sent Successfully!</h4>
                    <p>Thank you for your inquiry. I'll respond within 1-2 business days.</p>
                `);
                
                // Reset form
                form[0].reset();
                $('#char-count').text('0').css('color', '#c9a227');
                $('#consent').prop('checked', false);
            } else {
                // Formspree error
                response.json().then(data => {
                    if (data.errors) {
                        showFormMessage('error', `
                            <i class="fas fa-exclamation-circle"></i>
                            <h4>Form Error</h4>
                            <p>${data.errors.map(err => err.message).join(', ')}</p>
                        `);
                    } else {
                        showFormMessage('error', `
                            <i class="fas fa-exclamation-circle"></i>
                            <h4>Submission Failed</h4>
                            <p>There was an error sending your message. Please try again.</p>
                        `);
                    }
                });
            }
        })
        .catch(error => {
            // Network error
            showFormMessage('error', `
                <i class="fas fa-exclamation-circle"></i>
                <h4>Network Error</h4>
                <p>Unable to send message. Please check your connection and try again.</p>
            `);
        })
        .finally(() => {
            // Reset button state
            submitBtn.prop('disabled', false);
            spinner.hide();
            submitBtn.find('i').show();
        });
        
        return false;
    });
    
    // Helper function to show form messages
    function showFormMessage(type, content) {
        const message = $(`<div class="form-message ${type}"></div>`);
        message.html(content);
        message.hide();
        
        $('#contact-form').before(message);
        message.fadeIn(300);
        
        // Scroll to message
        $('html, body').animate({
            scrollTop: message.offset().top - 100
        }, 500);
        
        // Remove message after timeout
        const timeout = type === 'success' ? 10000 : 8000;
        setTimeout(() => {
            message.fadeOut(300, () => {
                message.remove();
            });
        }, timeout);
    }
    
    // Form validation
    function validateForm() {
        let isValid = true;
        const form = $('#contact-form');
        
        // Remove previous error styles
        form.find('.error').removeClass('error');
        $('.form-message').remove();
        
        // Check required fields
        form.find('[required]').each(function() {
            if (!$(this).val().trim()) {
                $(this).addClass('error');
                isValid = false;
            }
        });
        
        // Check email format
        const email = $('#email').val();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email && !emailRegex.test(email)) {
            $('#email').addClass('error');
            isValid = false;
        }
        
        // Check consent
        if (!$('#consent').is(':checked')) {
            $('#consent').addClass('error');
            isValid = false;
        }
        
        if (!isValid) {
            showFormMessage('error', `
                <i class="fas fa-exclamation-circle"></i>
                <h4>Please check all fields</h4>
                <ul style="text-align: left; margin: 10px auto; display: inline-block;">
                    <li>Fill in all required fields</li>
                    <li>Enter a valid email address</li>
                    <li>Agree to the consent terms</li>
                </ul>
            `);
        }
        
        return isValid;
    }
});

// Page load completion
$(window).on('load', function() {
    console.log('✅ Website fully loaded');
    $('.book-container').css('opacity', '1');
    
    // Add pulse animation to next button on cover
    $('#next-page').addClass('pulse');
});

// Add pulse animation CSS
$('<style>').text(`
    .pulse {
        animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
        0% { box-shadow: 0 0 0 0 rgba(201, 162, 39, 0.4); }
        70% { box-shadow: 0 0 0 15px rgba(201, 162, 39, 0); }
        100% { box-shadow: 0 0 0 0 rgba(201, 162, 39, 0); }
    }
`).appendTo('head');