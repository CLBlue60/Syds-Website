$(document).ready(function() {
    console.log('Silver Effects Beauty - Initializing...');
    
    // Configuration
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
    let currentMobilePage = 1;
    let touchStartY = 0;
    
    // Initialize
    checkMobileView();
    initializeBook();
    
    // Event Listeners
    $(window).on('resize', function() {
        checkMobileView();
        initializeBook();
    });
    
    // Touch event prevention for pull-to-refresh
    document.addEventListener('touchmove', function(e) {
        if (isMobileView) {
            const target = e.target.closest('.page-content');
            if (target) {
                const scrollTop = target.scrollTop;
                const scrollHeight = target.scrollHeight;
                const clientHeight = target.clientHeight;
                
                if ((scrollTop <= 0 && e.touches[0].clientY > touchStartY) || 
                    (scrollTop + clientHeight >= scrollHeight && e.touches[0].clientY < touchStartY)) {
                    e.preventDefault();
                }
            }
        }
    }, { passive: false });
    
    $(document).on('touchstart', function(e) {
        touchStartY = e.originalEvent.touches[0].clientY;
    });
    
    // Navigation
    $('.toc-item, .nav-link, .nav-dot').click(function() {
        const targetSpread = $(this).attr('data-spread');
        if (targetSpread) {
            if (isMobileView) {
                currentMobilePage = targetSpread == 1 ? 1 : (parseInt(targetSpread) * 2) - 1;
                updateMobilePageDisplay();
            } else {
                goToSpread(parseInt(targetSpread));
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
    
    // Keyboard navigation
    $(document).keydown(function(e) {
        if (e.keyCode === 37) {
            $('#prev-page').click();
            e.preventDefault();
        } else if (e.keyCode === 39) {
            $('#next-page').click();
            e.preventDefault();
        } else if (e.keyCode === 32) {
            e.preventDefault();
        }
    });
    
    // Portfolio lightbox
    $('.portfolio-item').click(function() {
        const title = $(this).find('h5').text();
        const description = $(this).find('p').text();
        const imgSrc = $(this).find('img').attr('src');
        
        $('#modal-title').text(title);
        $('#modal-description').text(description);
        $('#modal-image').attr('src', imgSrc);
        $('#image-modal').addClass('active');
        $('body').css('overflow', 'hidden');
    });
    
    $('.modal-close, #image-modal').click(function(e) {
        if (e.target === this || $(e.target).hasClass('modal-close')) {
            $('#image-modal').removeClass('active');
            $('body').css('overflow', '');
        }
    });
    
    $(document).keydown(function(e) {
        if (e.keyCode === 27) {
            $('#image-modal').removeClass('active');
            $('body').css('overflow', '');
        }
    });
    
    // Contact form character counter
    $('#message').on('input', function() {
        const charCount = $(this).val().length;
        $('#char-count').text(charCount);
    });
    
    // Functions
    function checkMobileView() {
        isMobileView = $(window).width() <= 768;
    }
    
    function initializeBook() {
        if (isMobileView) {
            currentMobilePage = 1;
            updateMobilePageDisplay();
            
            $('body').css({
                'overscroll-behavior': 'none'
            });
            
            $('.book-container').css({
                'height': '100vh',
                'overflow': 'hidden'
            });
        } else {
            goToSpread(1);
        }
        
        // Reset scroll positions
        $('.page-content').scrollTop(0);
        updateButtonStates();
    }
    
    function goToSpread(spreadNum) {
        currentSpread = spreadNum;
        $('.page-spread').removeClass('active mobile-show-right');
        $(`#spread-${spreadNum}`).addClass('active');
        updatePageIndicator();
        $('.page-content').scrollTop(0);
        updateButtonStates();
    }
    
    function updateMobilePageDisplay() {
        $('.page-spread').removeClass('active mobile-show-right');
        
        if (currentMobilePage === 1) {
            $('#spread-1').addClass('active');
        } else {
            const spreadNum = Math.ceil((currentMobilePage - 1) / 2) + 1;
            $(`#spread-${spreadNum}`).addClass('active');
            
            if (currentMobilePage % 2 === 1) {
                $(`#spread-${spreadNum}`).addClass('mobile-show-right');
            }
        }
        
        updatePageIndicator();
        $('.page-content').scrollTop(0);
        updateButtonStates();
    }
    
    function updatePageIndicator() {
        if (isMobileView) {
            $('#current-pages').text(`Page ${currentMobilePage}`);
        } else {
            $('#current-pages').text(pageConfig[currentSpread] || `Spread ${currentSpread}`);
        }
    }
    
    function updateButtonStates() {
        if (isMobileView) {
            // Update Previous button
            if (currentMobilePage <= 1) {
                $('#prev-page').prop('disabled', true);
                $('#prev-page').html('<i class="fas fa-chevron-left"></i> Beginning');
            } else {
                $('#prev-page').prop('disabled', false);
                $('#prev-page').html('<i class="fas fa-chevron-left"></i> Previous');
            }
            
            // Update Next button
            if (currentMobilePage >= 13) {
                $('#next-page').prop('disabled', true);
                $('#next-page').html('End <i class="fas fa-chevron-right"></i>');
            } else {
                $('#next-page').prop('disabled', false);
                $('#next-page').html('Next <i class="fas fa-chevron-right"></i>');
            }
        } else {
            // Desktop view
            if (currentSpread <= 1) {
                $('#prev-page').prop('disabled', true);
                $('#prev-page').html('<i class="fas fa-chevron-left"></i> Beginning');
            } else {
                $('#prev-page').prop('disabled', false);
                $('#prev-page').html('<i class="fas fa-chevron-left"></i> Previous');
            }
            
            if (currentSpread >= totalSpreads) {
                $('#next-page').prop('disabled', true);
                $('#next-page').html('End <i class="fas fa-chevron-right"></i>');
            } else {
                $('#next-page').prop('disabled', false);
                $('#next-page').html('Next <i class="fas fa-chevron-right"></i>');
            }
        }
    }
});