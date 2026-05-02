$(document).ready(function () {

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

        document.querySelectorAll('.counter .box span[data-count]').forEach(function (el) {
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
        document.querySelectorAll('.counter .box span[data-count]').forEach(function (el) {
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

    // ========== Footer year ==========
    $('#year').text(new Date().getFullYear());

});
