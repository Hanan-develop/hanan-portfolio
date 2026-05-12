$(document).ready(function () {

    // ========== Page Loader (hide after content loads) ==========
    var $loader = $('#pageLoader');
    if ($loader.length) {
        $(window).on('load', function () {
            setTimeout(function () {
                $loader.addClass('loaded');
                setTimeout(function () { $loader.remove(); }, 700);
            }, 600);
        });
        // Fallback: hide loader after 3 seconds max
        setTimeout(function () {
            if (!$loader.hasClass('loaded')) {
                $loader.addClass('loaded');
                setTimeout(function () { $loader.remove(); }, 700);
            }
        }, 3000);
    }

    // ========== CONFIG ==========
    var CONFIG = {
        whatsappNumber: '923254145534',
        phoneNumber: '+923254145534',
        mobileBreakpoint: 991,
        // Words for the typing effect under the avatar
        typedWords: [
            'WordPress Developer',
            'Shopify Designer',
            'Frontend Developer'
        ]
    };

    // ========== Mobile menu toggle ==========
    $("#menu").click(function () {
        $(this).toggleClass('fa-times fa-bars');
        $("header").toggleClass('toggle');
    });

    // ========== Scroll handlers ==========
    $(window).on('scroll load', function () {
        // Scroll progress bar
        var scrollTop = $(window).scrollTop();
        var docHeight = $(document).height() - $(window).height();
        var scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        $('#scrollProgress').css('width', scrollPercent + '%');

        // Close mobile menu if open + scroll
        if (scrollTop > 0) {
            $('.top').fadeIn(200);
        } else {
            $('.top').fadeOut(200);
        }

        // Active nav link based on scroll position
        var scrollPos = scrollTop + 200;
        $('header .navbar ul li a').each(function () {
            var hash = $(this).attr('href');
            if (hash && hash.charAt(0) === '#' && hash.length > 1) {
                var target = $(hash);
                if (target.length) {
                    if (target.position().top <= scrollPos &&
                        target.position().top + target.outerHeight() > scrollPos) {
                        $('header .navbar ul li a').removeClass('active');
                        $(this).addClass('active');
                    }
                }
            }
        });
    });

    // ========== Smooth scrolling ==========
    $('a[href*="#"]').on('click', function (e) {
        var hash = $(this).attr('href');
        if (hash.length > 1 && hash.charAt(0) === '#') {
            var target = $(hash);
            if (target.length) {
                e.preventDefault();
                $('html, body').animate({
                    scrollTop: target.offset().top - 20
                }, 600, "swing");

                // Close mobile menu after click
                $("#menu").removeClass('fa-times').addClass('fa-bars');
                $("header").removeClass('toggle');
            }
        }
    });

    // ========== Typing effect under avatar ==========
    var typedEl = $('.typed-text');
    if (typedEl.length) {
        var wordIdx = 0;
        var charIdx = 0;
        var isDeleting = false;
        var word = '';

        function tick() {
            word = CONFIG.typedWords[wordIdx];
            if (isDeleting) {
                charIdx--;
            } else {
                charIdx++;
            }
            typedEl.text(word.substring(0, charIdx));

            var speed = isDeleting ? 50 : 95;
            if (!isDeleting && charIdx === word.length) {
                speed = 1600;
                isDeleting = true;
            } else if (isDeleting && charIdx === 0) {
                isDeleting = false;
                wordIdx = (wordIdx + 1) % CONFIG.typedWords.length;
                speed = 400;
            }
            setTimeout(tick, speed);
        }
        tick();
    }

    // ========== Reveal-on-scroll (IntersectionObserver) ==========
    if ('IntersectionObserver' in window) {
        var revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var el = entry.target;
                    var delay = parseInt(el.getAttribute('data-delay'), 10) || 0;
                    setTimeout(function () {
                        el.classList.add('in-view');
                    }, delay);
                    revealObserver.unobserve(el);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        document.querySelectorAll('.reveal').forEach(function (el) {
            revealObserver.observe(el);
        });

        // ========== Skill bar fill on scroll ==========
        var skillObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var s = entry.target;
                    var pct = s.getAttribute('data-percent');
                    s.style.setProperty('--w', pct + '%');
                    s.classList.add('in-view');
                    skillObserver.unobserve(s);
                }
            });
        }, { threshold: 0.4 });

        document.querySelectorAll('.skill').forEach(function (s) {
            skillObserver.observe(s);
        });

        // ========== Counter animation ==========
        var counterObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var el = entry.target;
                    var target = parseInt(el.getAttribute('data-count'), 10);
                    var duration = 1800;
                    var startTime = performance.now();

                    function tickCount(now) {
                        var t = Math.min((now - startTime) / duration, 1);
                        var eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
                        el.textContent = Math.round(target * eased);
                        if (t < 1) {
                            requestAnimationFrame(tickCount);
                        } else {
                            el.textContent = target;
                        }
                    }
                    requestAnimationFrame(tickCount);
                    counterObserver.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        document.querySelectorAll('.counter .box span[data-count], .impact-number span[data-count]').forEach(function (el) {
            counterObserver.observe(el);
        });
    } else {
        // Fallback: if no IntersectionObserver, just show everything
        document.querySelectorAll('.reveal').forEach(function (el) {
            el.classList.add('in-view');
        });
        document.querySelectorAll('.skill').forEach(function (s) {
            s.style.setProperty('--w', s.getAttribute('data-percent') + '%');
            s.classList.add('in-view');
        });
        document.querySelectorAll('.counter .box span[data-count], .impact-number span[data-count]').forEach(function (el) {
            el.textContent = el.getAttribute('data-count');
        });
    }

    // ========== WhatsApp floating button ==========
    var $waFloat = $('#waFloat');
    var $waPopup = $('#waPopup');

    function isMobileView() {
        return window.innerWidth <= CONFIG.mobileBreakpoint || ('ontouchstart' in window);
    }

    $waFloat.on('click', function () {
        if (isMobileView()) {
            $waPopup.addClass('open').attr('aria-hidden', 'false');
            $('body').css('overflow', 'hidden');
        } else {
            window.open('https://wa.me/' + CONFIG.whatsappNumber, '_blank', 'noopener');
        }
    });

    function closeWaPopup() {
        $waPopup.removeClass('open').attr('aria-hidden', 'true');
        $('body').css('overflow', '');
    }

    $('[data-close]').on('click', closeWaPopup);
    $(document).on('keydown', function (e) {
        if (e.key === 'Escape' && $waPopup.hasClass('open')) closeWaPopup();
    });

    // ========== Contact form — AJAX submit to admin API ==========
    $('#contactForm').on('submit', function (e) {
        e.preventDefault();

        var $form = $(this);
        var $note = $('#formNote');
        var $btn = $form.find('button[type="submit"]');
        var originalBtnHtml = $btn.html();

        var name = $form.find('input[name="name"]').val().trim();
        var email = $form.find('input[name="email"]').val().trim();
        var mobile = $form.find('input[name="mobile"]').val().trim();
        var project = $form.find('input[name="project"]').val().trim();
        var message = $form.find('textarea[name="message"]').val().trim();

        $note.css('color', '').text('');

        // Basic validation
        if (!name || !email || !message) {
            $note.css('color', '#ef4444').text('Please fill in all required fields.');
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            $note.css('color', '#ef4444').text('Please enter a valid email address.');
            return;
        }

        // Get admin API URL from tracker (or fallback)
        var apiBase = (window.PortfolioTracker && window.PortfolioTracker.api) || '/admin/api';

        $btn.prop('disabled', true).html('<i class="fas fa-circle-notch fa-spin"></i> Sending...');

        $.ajax({
            url: apiBase + '/submit.php',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                name: name, email: email, mobile: mobile,
                project: project, message: message
            }),
            crossDomain: true,
            xhrFields: { withCredentials: false }
        }).done(function (res) {
            if (res && res.ok) {
                $note.css('color', '#22c55e').text('✓ ' + (res.message || 'Message sent! I will reply soon.'));
                $form[0].reset();
                // Track form submit event
                if (window.PortfolioTracker) {
                    window.PortfolioTracker.track('form_submit', 'contact', email);
                }
                setTimeout(function () { $note.text(''); }, 6000);
            } else {
                $note.css('color', '#ef4444').text((res && res.error) || 'Could not send. Try again.');
            }
        }).fail(function (xhr) {
            var msg = 'Network error. Please try again.';
            try {
                var resp = JSON.parse(xhr.responseText);
                if (resp.error) msg = resp.error;
            } catch (e) { }
            $note.css('color', '#ef4444').text(msg);
        }).always(function () {
            $btn.prop('disabled', false).html(originalBtnHtml);
        });
    });

    // ========== Custom Cursor (desktop only) ==========
    var isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (isFinePointer) {
        var $ring = $('.cursor-ring');
        var $dot = $('.cursor-dot');
        var mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

        $(document).on('mousemove', function (e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
            $dot.css('transform', 'translate(' + mouseX + 'px, ' + mouseY + 'px) translate(-50%, -50%)');
        });

        // Smooth ring follow
        (function animateRing() {
            ringX += (mouseX - ringX) * 0.18;
            ringY += (mouseY - ringY) * 0.18;
            $ring.css('transform', 'translate(' + ringX + 'px, ' + ringY + 'px) translate(-50%, -50%)');
            requestAnimationFrame(animateRing);
        })();

        // Hover state on interactive elements
        var interactiveSelector = 'a, button, input, textarea, .box, .skill-tile, .process-step, .service-card, .testimonial-card, .faq-q, .about-card, .filter-btn';
        $(document).on('mouseenter', interactiveSelector, function () {
            $ring.addClass('hover');
        }).on('mouseleave', interactiveSelector, function () {
            $ring.removeClass('hover');
        });

        // Click state
        $(document).on('mousedown', function () {
            $ring.addClass('click');
        }).on('mouseup', function () {
            $ring.removeClass('click');
        });

        // Hide cursor when leaving window
        $(document).on('mouseleave', function () {
            $ring.css('opacity', 0);
            $dot.css('opacity', 0);
        }).on('mouseenter', function () {
            $ring.css('opacity', 1);
            $dot.css('opacity', 1);
        });
    }

    // ========== Portfolio Filter ==========
    $('.filter-btn').on('click', function () {
        var $btn = $(this);
        var filter = $btn.data('filter');

        // Update active button
        $('.filter-btn').removeClass('active');
        $btn.addClass('active');

        // Filter cards with stagger
        $('.portfolio .box-container .box').each(function (i, el) {
            var $card = $(el);
            var cat = $card.data('cat');
            var show = (filter === 'all' || cat === filter);

            setTimeout(function () {
                if (show) {
                    $card.removeClass('hidden');
                } else {
                    $card.addClass('hidden');
                }
            }, i * 40);
        });
    });

    // ========== FAQ Accordion ==========
    $('.faq-q').on('click', function () {
        var $item = $(this).closest('.faq-item');
        var wasActive = $item.hasClass('active');

        // Close all
        $('.faq-item').removeClass('active');

        // Open clicked one (if not already open)
        if (!wasActive) {
            $item.addClass('active');
        }
    });

    // ========== Testimonials Auto-Slider ==========
    var $sliderWrap = $('.testimonials-wrap');
    if ($sliderWrap.length) {
        var $slider = $sliderWrap.find('.testimonials-slider');
        var $track = $('#tSliderTrack');
        var $slides = $track.find('.t-slide');
        var $dotsWrap = $('#tDots');
        var $progressFill = $('.t-progress-fill');
        var totalSlides = $slides.length;
        var currentSlide = 0;
        var autoPlayDelay = 5000; // 5 seconds per slide
        var autoPlayInterval = null;
        var progressInterval = null;
        var progressValue = 0;

        // Build dots
        for (var i = 0; i < totalSlides; i++) {
            $dotsWrap.append('<button class="t-dot' + (i === 0 ? ' active' : '') + '" data-index="' + i + '" aria-label="Slide ' + (i + 1) + '"></button>');
        }

        function goToSlide(index) {
            currentSlide = (index + totalSlides) % totalSlides;
            $track.css('transform', 'translateX(-' + (currentSlide * 100) + '%)');
            $dotsWrap.find('.t-dot').removeClass('active').eq(currentSlide).addClass('active');
            resetProgress();
        }

        function nextSlide() { goToSlide(currentSlide + 1); }
        function prevSlide() { goToSlide(currentSlide - 1); }

        function resetProgress() {
            progressValue = 0;
            $progressFill.css('width', '0%');
        }

        function startAutoPlay() {
            stopAutoPlay();
            // Progress fill animation
            progressInterval = setInterval(function () {
                progressValue += (100 / (autoPlayDelay / 100));
                if (progressValue >= 100) progressValue = 100;
                $progressFill.css('width', progressValue + '%');
            }, 100);
            // Slide change
            autoPlayInterval = setTimeout(function () {
                nextSlide();
                startAutoPlay();
            }, autoPlayDelay);
        }

        function stopAutoPlay() {
            if (autoPlayInterval) { clearTimeout(autoPlayInterval); autoPlayInterval = null; }
            if (progressInterval) { clearInterval(progressInterval); progressInterval = null; }
        }

        // Arrows
        $('.t-next').on('click', function () {
            nextSlide();
            startAutoPlay();
        });
        $('.t-prev').on('click', function () {
            prevSlide();
            startAutoPlay();
        });

        // Dots
        $dotsWrap.on('click', '.t-dot', function () {
            var idx = parseInt($(this).data('index'), 10);
            goToSlide(idx);
            startAutoPlay();
        });

        // Pause on hover (desktop only)
        $sliderWrap.on('mouseenter', function () {
            stopAutoPlay();
            $sliderWrap.addClass('paused');
        }).on('mouseleave', function () {
            $sliderWrap.removeClass('paused');
            startAutoPlay();
        });

        // Touch swipe (mobile)
        var touchStartX = 0;
        var touchEndX = 0;
        $track.on('touchstart', function (e) {
            touchStartX = e.originalEvent.touches[0].clientX;
            stopAutoPlay();
        });
        $track.on('touchend', function (e) {
            touchEndX = e.originalEvent.changedTouches[0].clientX;
            var diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) nextSlide();
                else prevSlide();
            }
            startAutoPlay();
        });

        // Pause when section is out of view (save resources)
        if ('IntersectionObserver' in window) {
            var sliderObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        startAutoPlay();
                    } else {
                        stopAutoPlay();
                    }
                });
            }, { threshold: 0.3 });
            sliderObserver.observe($sliderWrap[0]);
        } else {
            startAutoPlay();
        }
    }

    // ========== Live Clock (Lahore time) ==========
    function updateClock() {
        var now = new Date();
        // Convert to Pakistan time (UTC+5)
        var utc = now.getTime() + (now.getTimezoneOffset() * 60000);
        var pkTime = new Date(utc + (3600000 * 5));
        var hours = pkTime.getHours();
        var minutes = pkTime.getMinutes();
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        var display = hours + ':' + (minutes < 10 ? '0' + minutes : minutes) + ' ' + ampm;
        $('#liveClock').text(display);

        // Update status based on time (working hours 9 AM - 11 PM PKT)
        var $statusLabel = $('#statusLabel');
        var $statusLed = $('.status-led');
        if (pkTime.getHours() >= 9 && pkTime.getHours() < 23) {
            $statusLabel.text('Available for new projects');
            $statusLed.css('background', '#22c55e').css('box-shadow', '0 0 8px rgba(34, 197, 94, 0.6)');
        } else {
            $statusLabel.text('Working hours: 9 AM - 11 PM PKT');
            $statusLed.css('background', '#f59e0b').css('box-shadow', '0 0 8px rgba(245, 158, 11, 0.6)');
        }
    }
    updateClock();
    setInterval(updateClock, 30000); // update every 30s

    // ========== Status Bar — hide on scroll down, show on scroll up ==========
    var $statusBar = $('#statusBar');
    var lastScroll = 0;
    $(window).on('scroll', function () {
        var currentScroll = $(window).scrollTop();
        if (currentScroll > 100 && currentScroll > lastScroll) {
            $statusBar.addClass('hidden');
        } else {
            $statusBar.removeClass('hidden');
        }
        lastScroll = currentScroll;
    });

    // ========== Section Indicator Dots ==========
    var $siDots = $('.si-dot');
    $(window).on('scroll', function () {
        var scrollPos = $(window).scrollTop() + window.innerHeight / 3;
        $siDots.each(function () {
            var hash = $(this).attr('href');
            if (hash && hash.length > 1) {
                var $target = $(hash);
                if ($target.length) {
                    if ($target.offset().top <= scrollPos &&
                        $target.offset().top + $target.outerHeight() > scrollPos) {
                        $siDots.removeClass('active');
                        $(this).addClass('active');
                    }
                }
            }
        });
    });

    // ========== Sound System (Web Audio API) ==========
    var audioCtx = null;
    var soundEnabled = localStorage.getItem('hananSound') !== 'off'; // default ON
    if (!soundEnabled) {
        $('body').addClass('sound-muted');
    }

    function initAudio() {
        if (!audioCtx) {
            try {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            } catch (e) {
                audioCtx = null;
            }
        }
        // Resume if suspended (browsers require user interaction first)
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    }

    // Generate different sounds programmatically (no audio files needed)
    function playSound(type) {
        if (!soundEnabled) return;
        initAudio();
        if (!audioCtx) return;

        var sounds = {
            click: { freq: 800, duration: 0.05, vol: 0.08, type: 'sine' },
            tap: { freq: 1200, duration: 0.04, vol: 0.06, type: 'sine' },
            success: { freq: 880, duration: 0.15, vol: 0.1, type: 'triangle', endFreq: 1320 },
            toggle: { freq: 600, duration: 0.08, vol: 0.08, type: 'sine', endFreq: 900 },
            pop: { freq: 1000, duration: 0.06, vol: 0.07, type: 'sine', endFreq: 400 },
            hover: { freq: 1400, duration: 0.03, vol: 0.03, type: 'sine' }
        };

        var s = sounds[type] || sounds.click;
        var oscillator = audioCtx.createOscillator();
        var gainNode = audioCtx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.type = s.type;
        oscillator.frequency.setValueAtTime(s.freq, audioCtx.currentTime);

        // Frequency sweep if endFreq specified
        if (s.endFreq) {
            oscillator.frequency.exponentialRampToValueAtTime(s.endFreq, audioCtx.currentTime + s.duration);
        }

        // Smooth volume envelope
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(s.vol, audioCtx.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + s.duration);

        oscillator.start(audioCtx.currentTime);
        oscillator.stop(audioCtx.currentTime + s.duration);
    }

    // Attach click sound to interactive elements
    $(document).on('click', 'a, button, .filter-btn, .nav-link, .skill-tile, .tech-logo, .faq-q, .si-dot, .t-arrow, .t-dot', function (e) {
        // Different sounds for different element types
        var $el = $(this);
        if ($el.hasClass('fab-trigger')) {
            playSound('pop');
        } else if ($el.hasClass('faq-q')) {
            playSound('toggle');
        } else if ($el.hasClass('si-dot') || $el.hasClass('t-dot')) {
            playSound('tap');
        } else if ($el.hasClass('filter-btn')) {
            playSound('toggle');
        } else {
            playSound('click');
        }
    });

    // Sound toggle button
    $('#soundToggle').on('click', function (e) {
        e.stopPropagation();
        soundEnabled = !soundEnabled;
        $('body').toggleClass('sound-muted');
        localStorage.setItem('hananSound', soundEnabled ? 'on' : 'off');
        if (soundEnabled) {
            playSound('success');
            showToast('Sound enabled 🔊', 'info');
        } else {
            showToast('Sound muted 🔇', 'info');
        }
    });

    // ========== FAB Menu Toggle ==========
    var $fab = $('#fab');
    var fabBadgeCleared = localStorage.getItem('hananFabBadge');
    if (fabBadgeCleared === 'cleared') {
        $('#fabBadge').addClass('hidden');
    }

    $('#fabTrigger').on('click', function (e) {
        e.stopPropagation();
        $fab.toggleClass('open');
        // Clear badge on first open
        if (!fabBadgeCleared) {
            $('#fabBadge').addClass('hidden');
            localStorage.setItem('hananFabBadge', 'cleared');
        }
    });

    // Close FAB when clicking outside
    $(document).on('click', function (e) {
        if (!$(e.target).closest('#fab').length) {
            $fab.removeClass('open');
        }
    });

    // ========== Toast Notifications ==========
    function showToast(message, type) {
        type = type || 'info';
        var iconMap = {
            success: 'fa-check',
            info: 'fa-circle-info',
            error: 'fa-circle-exclamation'
        };
        var $toast = $('<div class="toast ' + type + '"><i class="fa-solid ' + iconMap[type] + '"></i><span>' + message + '</span></div>');
        $('#toastContainer').append($toast);
        setTimeout(function () { $toast.remove(); }, 3000);
    }

    // ========== Copy Email Button ==========
    $('#copyEmailBtn').on('click', function () {
        var email = 'abdulhanan4145534@gmail.com';
        if (navigator.clipboard) {
            navigator.clipboard.writeText(email).then(function () {
                showToast('Email copied to clipboard!', 'success');
                playSound('success');
            }).catch(function () {
                showToast('Could not copy. Try manually.', 'error');
            });
        } else {
            // Fallback for older browsers
            var $temp = $('<input>');
            $('body').append($temp);
            $temp.val(email).select();
            try {
                document.execCommand('copy');
                showToast('Email copied to clipboard!', 'success');
                playSound('success');
            } catch (e) {
                showToast('Could not copy. Try manually.', 'error');
            }
            $temp.remove();
        }
        $fab.removeClass('open');
    });

    // ========== Theme Toggle ==========
    var savedTheme = localStorage.getItem('hananTheme');
    if (savedTheme === 'light') {
        $('body').addClass('light-theme');
    }

    $('#themeToggle').on('click', function () {
        $('body').toggleClass('light-theme');
        var isLight = $('body').hasClass('light-theme');
        localStorage.setItem('hananTheme', isLight ? 'light' : 'dark');
        showToast(isLight ? 'Light mode activated ☀️' : 'Dark mode activated 🌙', 'info');
        playSound('toggle');
        $fab.removeClass('open');
    });

    // ========== Easter Egg — Konami Code ==========
    var konami = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight'];
    var konamiIdx = 0;
    var gPressed = false; // for "g then t/b" shortcut

    $(document).on('keydown', function (e) {
        // Don't trigger shortcuts when user is typing in input/textarea
        var tag = (e.target.tagName || '').toLowerCase();
        if (tag === 'input' || tag === 'textarea') return;

        // Konami code
        if (e.key === konami[konamiIdx]) {
            konamiIdx++;
            if (konamiIdx === konami.length) {
                $('#easterModal').addClass('open').attr('aria-hidden', 'false');
                $('body').css('overflow', 'hidden');
                playSound('success');
                konamiIdx = 0;
            }
        } else if (konami.indexOf(e.key) === -1) {
            // Reset konami only if non-arrow key pressed
            konamiIdx = 0;
        }

        // Close any modal on Escape
        if (e.key === 'Escape') {
            if ($('#easterModal').hasClass('open')) {
                $('#easterModal').removeClass('open').attr('aria-hidden', 'true');
                $('body').css('overflow', '');
                playSound('pop');
            }
            if ($('#shortcutsModal').hasClass('open')) {
                $('#shortcutsModal').removeClass('open').attr('aria-hidden', 'true');
                $('body').css('overflow', '');
                playSound('pop');
            }
            if ($('#waPopup').hasClass('open')) {
                closeWaPopup();
            }
        }

        // Keyboard shortcuts (single keys)
        var key = e.key.toLowerCase();

        // ? — Show shortcuts help
        if (key === '?' || (e.shiftKey && key === '/')) {
            e.preventDefault();
            $('#shortcutsModal').addClass('open').attr('aria-hidden', 'false');
            playSound('toggle');
            return;
        }

        // T — Toggle theme
        if (key === 't' && !gPressed && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
            $('#themeToggle').trigger('click');
            return;
        }

        // M — Toggle mute / sound
        if (key === 'm' && !e.ctrlKey && !e.metaKey) {
            $('#soundToggle').trigger('click');
            return;
        }

        // C — Open contact section
        if (key === 'c' && !e.ctrlKey && !e.metaKey) {
            $('html, body').animate({
                scrollTop: $('#contact').offset().top - 20
            }, 600);
            playSound('click');
            return;
        }

        // G — start of "go to" combo
        if (key === 'g' && !e.ctrlKey && !e.metaKey) {
            gPressed = true;
            setTimeout(function () { gPressed = false; }, 1500);
            return;
        }

        // G + T = Go to top
        if (key === 't' && gPressed) {
            $('html, body').animate({ scrollTop: 0 }, 600);
            gPressed = false;
            playSound('tap');
            return;
        }

        // G + B = Go to bottom
        if (key === 'b' && gPressed) {
            $('html, body').animate({ scrollTop: $(document).height() }, 600);
            gPressed = false;
            playSound('tap');
            return;
        }
    });

    // Close shortcuts modal
    $('[data-shortcut-close]').on('click', function () {
        $('#shortcutsModal').removeClass('open').attr('aria-hidden', 'true');
        $('body').css('overflow', '');
    });

    // Close easter modal
    $('#easterModal [data-close]').on('click', function () {
        $('#easterModal').removeClass('open').attr('aria-hidden', 'true');
        $('body').css('overflow', '');
    });

    // ========== Show welcome toast after page load ==========
    setTimeout(function () {
        showToast('Welcome! Press ? for keyboard shortcuts', 'success');
    }, 2000);

    // ========== Footer year ==========
    $('#year').text(new Date().getFullYear());

});
