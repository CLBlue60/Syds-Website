$(document).ready(function() {
    console.log('≡ƒôû Silver Effects Beauty - Initializing...');
    
    const pageConfig = {
        1: "Cover",
        2: "Pages 1 and 2",
        3: "Pages 3 and 4",
        4: "Pages 5 and 6",
        5: "Pages 7 and 8",
        6: "Pages 9 and 10",
        7: "Pages 11 and 12"
    };
    
    const totalSpreads = 7;
    let currentSpread = 1;
    let isMobileView = false;
    let currentMobilePage = 0;
    
    function checkMobileView() {
        isMobileView = $(window).width() <= 768;
    }
    
    checkMobileView();
    $(window).on('resize', function() {
        checkMobileView();
        initializeBook();
    });
    
    $('#toc-dropdown').on('change', function() {
        const targetSpread = $(this).val();
        if (targetSpread) {
            goToSpread(parseInt(targetSpread));
            $(this).val('');
        }
    });
    
    // Make TOC items clickable
    $('.toc-item').click(function() {
        const targetSpread = $(this).attr('data-spread');
        if (targetSpread) {
            goToSpread(parseInt(targetSpread));
        }
    });
    
  
    $('.nav-link').click(function(e) {
        e.preventDefault();
        const targetSpread = $(this).attr('data-spread');
        if (targetSpread) {
            goToSpread(parseInt(targetSpread));
        }
    });
    
    initializeBook();
    
    $('.portfolio-item').click(function() {
        const title = $(this).find('h5').text();
        const description = $(this).find('p').text();
        const imgSrc = $(this).find('img').attr('src');
        
        $('#modal-title').text(title);
        $('#modal-description').text(description);
        $('#modal-image').attr('src', imgSrc);
        $('#image-modal').addClass('active');
    });
    
    $('.modal-close').click(function() {
        $('#image-modal').removeClass('active');
    });
    
    $('#image-modal').click(function(e) {
        if (e.target === this) {
            $(this).removeClass('active');
        }
    });
    
    $(document).keydown(function(e) {
        if (e.keyCode === 27) {
            $('#image-modal').removeClass('active');
        }
    });
    
    $('#next-page').click(function() {
        if (isMobileView) {
            if (currentMobilePage < 13) {
                currentMobilePage++;
                updateMobilePageDisplay();
            }
        } else {
            if (currentSpread < totalSpreads) {
                goToSpread(currentSpread + 1);
            }
        }
    });
    
    $('#prev-page').click(function() {
        if (isMobileView) {
            if (currentMobilePage > 1) {
                currentMobilePage--;
                updateMobilePageDisplay();
            }
        } else {
            if (currentSpread > 1) {
                goToSpread(currentSpread - 1);
            }
        }
    });
    
    $(document).keydown(function(e) {
        if (e.keyCode === 37) {
            $('#prev-btn').click();
            e.preventDefault();
        } else if (e.keyCode === 39) {
            $('#next-btn').click();
            e.preventDefault();
        }
    });
    
    function initializeBook() {
        console.log('Setting up book layout...');
        
        if (isMobileView) {
            currentMobilePage = 1;
            updateMobilePageDisplay();
        } else {
            goToSpread(1);
        }
        
        setTimeout(function() {
            $('.site-title').css('animation', 'title-glow 3s ease-in-out infinite alternate');
            $('.cover-ornament').css('animation', 'gentle-float 4s ease-in-out infinite');
        }, 500);
    }
    
    function goToSpread(spreadNum) {
        console.log('Navigating to spread:', spreadNum);
        
        currentSpread = spreadNum;
        $('.page-spread').removeClass('active mobile-show-right');
        $(`#spread-${spreadNum}`).addClass('active');
        updatePageIndicator();
        $('.page-content').scrollTop(0);
    }
    
    function updateMobilePageDisplay() {
        $('.page-spread').removeClass('active mobile-show-right');
        
        // Formula accounts for cover being 1 page, then 2 pages per spread
        // Page 1 = Spread 1, Pages 2-3 = Spread 2, Pages 4-5 = Spread 3, etc.
        const spreadNum = Math.ceil((currentMobilePage + 1) / 2);
        $(`#spread-${spreadNum}`).addClass('active');
        
        // Show right page if currentMobilePage is even (and not the cover)
        if (currentMobilePage > 1 && currentMobilePage % 2 === 0) {
            $(`#spread-${spreadNum}`).addClass('mobile-show-right');
        }
        
        updatePageIndicator();
        $('.page-content').scrollTop(0);
    }
    
    function updatePageIndicator() {
        let displayText = '';
        
        if (isMobileView) {
            if (currentMobilePage === 1) {
                displayText = 'Cover';
            } else {
                displayText = `Page ${currentMobilePage} of 13`;
            }
            $('#prev-page').prop('disabled', currentMobilePage === 1);
            $('#next-page').prop('disabled', currentMobilePage === 13);

            // change prev button text on cover (page 1)
            if (currentMobilePage === 1) {
                $('#prev-page').html('<i class="fas fa-chevron-left"></i> Beginning');
            } else {
                $('#prev-page').html('<i class="fas fa-chevron-left"></i> Previous');
            }

            // change next button text only on page 13 (last mobile page)
            if (currentMobilePage === 13) {
                $('#next-page').html('The End');
            } else {
                $('#next-page').html('Next <i class="fas fa-chevron-right"></i>');
            }
        } else {
            displayText = pageConfig[currentSpread];
            $('#prev-page').prop('disabled', currentSpread === 1);
            $('#next-page').prop('disabled', currentSpread === totalSpreads);

            // change prev button text on cover (spread 1)
            if (currentSpread === 1) {
                $('#prev-page').html('<i class="fas fa-chevron-left"></i> Beginning');
            } else {
                $('#prev-page').html('<i class="fas fa-chevron-left"></i> Previous');
            }

            // change next button text on last spread (pages 11-12)
            if (currentSpread === totalSpreads) {
                $('#next-page').html('The End');
            } else {
                $('#next-page').html('Next <i class="fas fa-chevron-right"></i>');
            }
        }
        
        $('#current-pages').text(displayText);
        updateNavigationDots();
        
        if (currentSpread > 1 || currentMobilePage > 1) {
            $('#next-page').removeClass('pulse');
        }
    }
    
    function updateNavigationDots() {
        $('.nav-dot').removeClass('active');
        
        if (isMobileView) {
            $(`.nav-dot:eq(${currentMobilePage - 1})`).addClass('active');
        } else {
            $(`.nav-dot[data-spread="${currentSpread}"]`).addClass('active');
        }
    }
});

$(document).ready(function() {
    console.log('≡ƒôº Contact form loading...');
    
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
    
    $('#email').on('blur', function() {
        $('#reply-to').val($(this).val());
    });
    
    $('#contact-form').submit(function(e) {
        e.preventDefault();
        
        const form = $(this);
        const submitBtn = $('#submit-btn');
        const spinner = $('#loading-spinner');
        const formData = new FormData(form[0]);
        
        $('.form-message').remove();
        
        if (!validateForm()) {
            return false;
        }
        
        submitBtn.prop('disabled', true);
        spinner.show();
        submitBtn.find('i').hide();
        
        fetch(form.attr('action'), {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                showFormMessage('success', `
                    <i class="fas fa-check-circle"></i>
                    <h4>Message Sent Successfully!</h4>
                    <p>Thank you for your inquiry. I'll respond within 1-2 business days.</p>
                `);
                
                form[0].reset();
                $('#char-count').text('0').css('color', '#c9a227');
                $('#consent').prop('checked', false);
            } else {
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
            showFormMessage('error', `
                <i class="fas fa-exclamation-circle"></i>
                <h4>Network Error</h4>
                <p>Unable to send message. Please check your connection and try again.</p>
            `);
        })
        .finally(() => {
            submitBtn.prop('disabled', false);
            spinner.hide();
            submitBtn.find('i').show();
        });
        
        return false;
    });
    
    function showFormMessage(type, content) {
        const message = $(`<div class="form-message ${type}"></div>`);
        message.html(content);
        message.hide();
        
        $('#contact-form').before(message);
        message.fadeIn(300);
        
        $('html, body').animate({
            scrollTop: message.offset().top - 100
        }, 500);
        
        const timeout = type === 'success' ? 10000 : 8000;
        setTimeout(() => {
            message.fadeOut(300, () => {
                message.remove();
            });
        }, timeout);
    }
    
    function validateForm() {
        let isValid = true;
        const form = $('#contact-form');
        
        form.find('.error').removeClass('error');
        $('.form-message').remove();
        
        form.find('[required]').each(function() {
            if (!$(this).val().trim()) {
                $(this).addClass('error');
                isValid = false;
            }
        });
        
        const email = $('#email').val();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email && !emailRegex.test(email)) {
            $('#email').addClass('error');
            isValid = false;
        }
        
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

$(window).on('load', function() {
    console.log('Γ£à Website fully loaded');
    $('.book-container').css('opacity', '1');
    $('#next-page').addClass('pulse');
});

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
