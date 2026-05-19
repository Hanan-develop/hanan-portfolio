/* =========================================================
   HANAN PORTFOLIO - DYNAMIC DATA LOADER v3
   Smart Auto-Detect — No HTML editing required

   - Detects existing hardcoded sections by their class names
   - Replaces inner content with data from Google Sheet
   - Falls back to hardcoded content if Sheet has no data
   - Matches existing HTML structure (preserves styling)

   USAGE: Just add ONE script tag before </body>:
   <script src="JS/portfolio.js"></script>
   ========================================================= */

(function () {
    'use strict';

    var API_URL = 'https://script.google.com/macros/s/AKfycbx2sQwvMTOCeNdiE255oLaoqXUHvdsKrcn423nUIqrwqRtcWTdUL6LPm9VJjVz4M6dE/exec';
    var CACHE_KEY = 'hanan_portfolio_cache';
    var CACHE_DURATION = 2 * 60 * 1000; /* 2 minutes */

    function esc(str) {
        if (str === null || str === undefined) return '';
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;')
            .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    function getCache() {
        try {
            var raw = localStorage.getItem(CACHE_KEY);
            if (!raw) return null;
            var c = JSON.parse(raw);
            if (Date.now() - c.timestamp > CACHE_DURATION) return null;
            return c.data;
        } catch (e) { return null; }
    }

    function setCache(d) {
        try { localStorage.setItem(CACHE_KEY, JSON.stringify({ data: d, timestamp: Date.now() })); } catch (e) {}
    }

    function dedupe(items, nameField) {
        var seen = {};
        return items.filter(function (item) {
            var key = (item[nameField] || '').toLowerCase().trim();
            if (!key) return false;
            if (seen[key]) return false;
            seen[key] = true;
            return true;
        });
    }

    function getIconClass(icon) {
        if (!icon) return 'fa-solid fa-code';
        if (icon.indexOf('fa-') !== 0) return icon;
        /* Brand icons */
        var brands = ['wordpress', 'shopify', 'html5', 'css3-alt', 'js', 'bootstrap', 'php', 'github', 'git-alt', 'linkedin', 'youtube', 'whatsapp', 'facebook', 'instagram', 'twitter', 'figma', 'node', 'react'];
        for (var i = 0; i < brands.length; i++) {
            if (icon.indexOf(brands[i]) !== -1) return 'fa-brands ' + icon;
        }
        return 'fa-solid ' + icon;
    }

    /* =========================================================
       RENDER SKILLS — replaces .skills-bars content
       ========================================================= */
    function renderSkills(skills) {
        if (!skills || !skills.length) return;
        var container = document.querySelector('.skills-bars');
        if (!container) return;

        skills = dedupe(skills, 'name');
        skills.sort(function (a, b) { return (parseInt(b.percent) || 0) - (parseInt(a.percent) || 0); });

        var heading = container.querySelector('.skills-heading');
        var headingHtml = heading ? heading.outerHTML : '<h3 class="skills-heading">Technical proficiency</h3>';

        var html = headingHtml + skills.map(function (s) {
            var ic = getIconClass(s.icon || 'fa-code');
            var p = parseInt(s.percent) || 50;
            return '<div class="skill" data-percent="' + p + '">' +
                '<div class="skill-top">' +
                    '<span><i class="' + ic + '"></i> ' + esc(s.name) + '</span>' +
                    '<span class="skill-pct">' + p + '%</span>' +
                '</div>' +
                '<div class="skill-bar"><span style="width:' + p + '%"></span></div>' +
            '</div>';
        }).join('');

        container.innerHTML = html;
        /* Re-trigger any IntersectionObserver animations */
        container.classList.add('reveal', 'visible');
    }

    /* =========================================================
       RENDER SERVICES — replaces .services-grid content
       ========================================================= */
    function renderServices(services) {
        if (!services || !services.length) return;
        var container = document.querySelector('.services-grid');
        if (!container) return;

        services = services.filter(function (s) { return s.visible !== 'no'; });
        services = dedupe(services, 'title');
        services.sort(function (a, b) { return (parseInt(a.orderNum) || 99) - (parseInt(b.orderNum) || 99); });

        var html = services.map(function (s, i) {
            var ic = getIconClass(s.icon || 'fa-briefcase');
            var features = (s.features || '').split('\n').filter(function (f) { return f.trim(); });
            var fhtml = features.length ? '<ul>' + features.map(function (f) { return '<li>' + esc(f.trim()) + '</li>'; }).join('') + '</ul>' : '';
            var num = String(i + 1).padStart(2, '0');
            var isFeatured = s.tag === 'featured' || s.tag === 'popular';
            var badge = isFeatured ? '<span class="feature-badge">' + esc(s.tag === 'featured' ? 'Most loved' : s.tag.toUpperCase()) + '</span>' : '';
            var cls = 'service-card reveal' + (isFeatured ? ' feature' : '');
            return '<div class="' + cls + '" data-delay="' + (i * 100) + '" style="--service-color:' + esc(s.color || '#f9ca24') + ';">' +
                '<div class="service-num">' + num + '</div>' +
                '<i class="' + ic + ' service-icon"></i>' +
                '<h3>' + esc(s.title) + '</h3>' +
                '<p>' + esc(s.description) + '</p>' +
                fhtml + badge +
            '</div>';
        }).join('');

        container.innerHTML = html;
    }

    /* =========================================================
       RENDER ACHIEVEMENTS — replaces .achievements-grid content
       ========================================================= */
    function renderAchievements(items) {
        if (!items || !items.length) return;
        var container = document.querySelector('.achievements-grid');
        if (!container) return;

        items = items.filter(function (a) { return a.visible !== 'no'; });
        items = dedupe(items, 'title');
        items.sort(function (a, b) { return (parseInt(a.orderNum) || 99) - (parseInt(b.orderNum) || 99); });

        var html = items.map(function (a, i) {
            var ic = getIconClass(a.icon || 'fa-trophy');
            return '<div class="achievement-card reveal" data-delay="' + (i * 100) + '">' +
                '<div class="ach-icon" style="--ach-color:' + esc(a.color || '#f9ca24') + ';">' +
                    '<i class="' + ic + '"></i>' +
                '</div>' +
                '<div class="ach-content">' +
                    '<span class="ach-year">' + esc(a.year || '2025') + '</span>' +
                    '<h3>' + esc(a.title) + '</h3>' +
                    '<p>' + esc(a.description || '') + '</p>' +
                '</div>' +
            '</div>';
        }).join('');

        container.innerHTML = html;
    }

    /* =========================================================
       RENDER WHATSNEW — replaces .changelog-wrap content
       ========================================================= */
    function renderWhatsNew(items) {
        if (!items || !items.length) return;
        var container = document.querySelector('.changelog-wrap');
        if (!container) return;

        items = dedupe(items, 'title');
        items.sort(function (a, b) { return new Date(b.date || 0) - new Date(a.date || 0); });

        var html = items.map(function (u, i) {
            var d = u.date ? new Date(u.date) : null;
            var dateStr = d ? formatRelDate(d) : '';
            var tagClass = (u.tag || 'UPDATE').toLowerCase();
            var isLast = i === items.length - 1;
            return '<div class="changelog-item">' +
                '<div class="cl-marker">' +
                    '<span class="cl-dot"></span>' +
                    '<span class="cl-line' + (isLast ? ' last' : '') + '"></span>' +
                '</div>' +
                '<div class="cl-content">' +
                    '<div class="cl-head">' +
                        '<span class="cl-tag ' + esc(tagClass) + '">' + esc(u.tag || 'UPDATE') + '</span>' +
                        '<span class="cl-date">' + esc(dateStr) + '</span>' +
                    '</div>' +
                    '<h3>' + esc(u.title) + '</h3>' +
                    '<p>' + esc(u.description || '') + '</p>' +
                '</div>' +
            '</div>';
        }).join('');

        container.innerHTML = html;
    }

    function formatRelDate(d) {
        var diff = (Date.now() - d.getTime()) / 1000;
        if (diff < 86400) return 'Today';
        if (diff < 86400 * 7) return 'This week';
        if (diff < 86400 * 14) return 'Last week';
        if (diff < 86400 * 30) return Math.floor(diff / 86400 / 7) + ' weeks ago';
        if (diff < 86400 * 60) return 'Last month';
        if (diff < 86400 * 365) return Math.floor(diff / 86400 / 30) + ' months ago';
        return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    }

    /* =========================================================
       RENDER PROJECTS — replaces .portfolio-grid or auto-finds
       ========================================================= */
    function renderProjects(projects) {
        if (!projects || !projects.length) return;

        var container = document.querySelector('.portfolio-grid') ||
                        document.querySelector('#projectsContainer') ||
                        document.querySelector('.projects-grid');

        /* If no container found, try to find #portfolio section and inject */
        if (!container) {
            var portfolioSection = document.querySelector('#portfolio');
            if (portfolioSection) {
                /* Look for any direct child grid/wrap */
                container = portfolioSection.querySelector('.portfolio-wrap, .portfolio-items, .grid');
            }
        }
        if (!container) return;

        projects = dedupe(projects, 'title');

        var html = projects.map(function (p, i) {
            return '<div class="portfolio-card reveal" data-delay="' + (i * 100) + '" style="--card-color:' + esc(p.color || '#f9ca24') + ';">' +
                '<div class="portfolio-img-wrap">' +
                    (p.imageUrl ?
                        '<img src="' + esc(p.imageUrl) + '" alt="' + esc(p.title) + '" loading="lazy" />' :
                        '<div class="portfolio-img-placeholder" style="background:' + esc(p.color || '#f9ca24') + '22;">' +
                            '<i class="fa-solid fa-folder-open" style="color:' + esc(p.color || '#f9ca24') + ';"></i>' +
                        '</div>') +
                    '<div class="portfolio-overlay">' +
                        (p.liveUrl ? '<a href="' + esc(p.liveUrl) + '" target="_blank" rel="noopener" class="portfolio-link"><i class="fa-solid fa-arrow-up-right-from-square"></i> View Live</a>' : '') +
                    '</div>' +
                '</div>' +
                '<div class="portfolio-info">' +
                    '<span class="portfolio-category" style="color:' + esc(p.color || '#f9ca24') + ';">' + esc(p.category || 'Project') + '</span>' +
                    '<h3>' + esc(p.title) + '</h3>' +
                    '<p>' + esc(p.description || '') + '</p>' +
                    (p.tech ? '<div class="portfolio-tech">' + p.tech.split(',').map(function (t) { return '<span>' + esc(t.trim()) + '</span>'; }).join('') + '</div>' : '') +
                '</div>' +
            '</div>';
        }).join('');

        container.innerHTML = html;
    }

    /* =========================================================
       RENDER TESTIMONIALS
       ========================================================= */
    function renderTestimonials(items) {
        if (!items || !items.length) return;

        var container = document.querySelector('.testimonials-grid') ||
                        document.querySelector('#testimonialsContainer') ||
                        document.querySelector('.reviews-grid');

        if (!container) {
            var testiSection = document.querySelector('#testimonials');
            if (testiSection) {
                container = testiSection.querySelector('.testi-wrap, .testi-grid, .reviews');
            }
        }
        if (!container) return;

        items = dedupe(items, 'name');

        var html = items.map(function (t, i) {
            var stars = '';
            var rating = parseInt(t.rating) || 5;
            for (var j = 0; j < 5; j++) stars += j < rating ? '<i class="fa-solid fa-star"></i>' : '<i class="fa-regular fa-star"></i>';
            var initials = (t.name || '?').split(' ').map(function (n) { return n.charAt(0); }).slice(0, 2).join('').toUpperCase();
            var feat = (t.featured === true || t.featured === 'yes') ? ' featured' : '';

            return '<div class="testimonial-card reveal' + feat + '" data-delay="' + (i * 100) + '">' +
                '<div class="testi-stars">' + stars + '</div>' +
                '<p class="testi-text">"' + esc(t.message) + '"</p>' +
                '<div class="testi-author">' +
                    (t.avatar ?
                        '<img src="' + esc(t.avatar) + '" alt="' + esc(t.name) + '" class="testi-avatar" />' :
                        '<div class="testi-avatar-fallback">' + esc(initials) + '</div>') +
                    '<div class="testi-info">' +
                        '<h4>' + esc(t.name) + '</h4>' +
                        '<p>' + esc(t.role || '') + (t.company ? ' · ' + esc(t.company) : '') + '</p>' +
                    '</div>' +
                '</div>' +
            '</div>';
        }).join('');

        container.innerHTML = html;
    }

    /* =========================================================
       APPLY SETTINGS — update name, tagline, contact info
       ========================================================= */
    function applySettings(settings) {
        if (!settings) return;

        /* Hero name — finds <h1>I'M <span>Abdul Hanan</span></h1> */
        if (settings.hero_name) {
            document.querySelectorAll('.home h1 span, [data-hero-name]').forEach(function (el) {
                el.textContent = settings.hero_name;
            });
            /* Update sidebar name too */
            document.querySelectorAll('header .name, .user .name').forEach(function (el) {
                el.textContent = settings.hero_name;
            });
        }

        /* Hero tagline */
        if (settings.hero_tagline) {
            document.querySelectorAll('.home-tagline, [data-hero-tagline]').forEach(function (el) {
                /* Preserve <em> styling: split on " & " */
                var parts = settings.hero_tagline.split(/\s*&\s*/);
                if (parts.length === 2) {
                    el.innerHTML = esc(parts[0]) + ' <em>&amp;</em> ' + esc(parts[1]);
                } else {
                    el.textContent = settings.hero_tagline;
                }
            });
        }

        /* About counters */
        if (settings.about_years) updateCounter('Years Experience', settings.about_years);
        if (settings.about_projects) updateCounter('Projects Completed', settings.about_projects);
        if (settings.about_clients) updateCounter('Happy Clients', settings.about_clients);
        if (settings.about_satisfaction) updateCounter('Awards Won', settings.about_satisfaction);

        /* Social links */
        if (settings.social_github) updateSocialLink('github', settings.social_github);
        if (settings.social_linkedin) updateSocialLink('linkedin', settings.social_linkedin);
        if (settings.social_youtube) updateSocialLink('youtube', settings.social_youtube);
        if (settings.social_twitter) updateSocialLink('twitter', settings.social_twitter);
        if (settings.social_instagram) updateSocialLink('instagram', settings.social_instagram);
        if (settings.social_facebook) updateSocialLink('facebook', settings.social_facebook);

        /* WhatsApp links */
        if (settings.contact_whatsapp) {
            var wa = settings.contact_whatsapp.replace(/\D/g, '');
            document.querySelectorAll('a[href*="wa.me"]').forEach(function (a) {
                a.setAttribute('href', 'https://wa.me/' + wa);
            });
        }

        /* Email links */
        if (settings.contact_email) {
            document.querySelectorAll('a[href^="mailto:"]').forEach(function (a) {
                a.setAttribute('href', 'mailto:' + settings.contact_email);
            });
        }

        /* Phone links */
        if (settings.contact_phone) {
            var phoneClean = settings.contact_phone.replace(/\s/g, '');
            document.querySelectorAll('a[href^="tel:"]').forEach(function (a) {
                a.setAttribute('href', 'tel:' + phoneClean);
            });
        }

        /* Status bar / Available badge */
        if (settings.contact_availability) {
            var labels = {
                available: 'Available for new projects',
                busy: 'Currently busy — booking next month',
                unavailable: 'Not accepting new projects'
            };
            var label = labels[settings.contact_availability] || 'Available';
            document.querySelectorAll('#statusLabel, .home-badge span:last-child').forEach(function (el) {
                el.textContent = label;
            });
        }
    }

    function updateCounter(label, value) {
        document.querySelectorAll('.counter .box').forEach(function (box) {
            var h3 = box.querySelector('h3');
            if (h3 && h3.textContent.trim().toLowerCase() === label.toLowerCase()) {
                var span = box.querySelector('span[data-count]');
                if (span) {
                    span.setAttribute('data-count', value);
                    span.textContent = value;
                }
            }
        });
    }

    function updateSocialLink(platform, url) {
        document.querySelectorAll('a[href*="' + platform + '"]').forEach(function (a) {
            a.setAttribute('href', url);
        });
    }

    /* =========================================================
       APPLY VISIBILITY — hide/show sections
       ========================================================= */
    function applyVisibility(visibility) {
        if (!visibility) return;
        Object.keys(visibility).forEach(function (key) {
            var sectionId = key.replace('section_', '');
            var el = document.getElementById(sectionId);
            if (el) el.style.display = visibility[key] === 'off' ? 'none' : '';
        });
    }

    /* =========================================================
       MAIN RENDER
       ========================================================= */
    function renderAll(data) {
        try { if (data.settings) applySettings(data.settings); } catch (e) { console.warn('settings:', e); }
        try { if (data.visibility) applyVisibility(data.visibility); } catch (e) { console.warn('visibility:', e); }
        try { if (data.skills) renderSkills(data.skills); } catch (e) { console.warn('skills:', e); }
        try { if (data.services) renderServices(data.services); } catch (e) { console.warn('services:', e); }
        try { if (data.achievements) renderAchievements(data.achievements); } catch (e) { console.warn('achievements:', e); }
        try { if (data.whatsnew || data.updates) renderWhatsNew(data.whatsnew || data.updates); } catch (e) { console.warn('whatsnew:', e); }
        try { if (data.projects) renderProjects(data.projects); } catch (e) { console.warn('projects:', e); }
        try { if (data.testimonials) renderTestimonials(data.testimonials); } catch (e) { console.warn('testimonials:', e); }
    }

    function fetchData() {
        fetch(API_URL + '?action=getAllData')
            .then(function (r) { return r.json(); })
            .then(function (data) {
                if (data && data.ok !== false) {
                    setCache(data);
                    renderAll(data);
                }
            })
            .catch(function (err) {
                console.warn('Portfolio data fetch failed (offline?):', err.message);
            });
    }

    function trackVisit() {
        try {
            var ua = navigator.userAgent;
            var device = /Mobile|Android|iPhone|iPad/.test(ua) ? 'mobile' : 'desktop';
            var browser = /Edg/.test(ua) ? 'Edge' :
                          /Chrome/.test(ua) ? 'Chrome' :
                          /Firefox/.test(ua) ? 'Firefox' :
                          /Safari/.test(ua) ? 'Safari' : 'Other';
            var os = /Windows/.test(ua) ? 'Windows' :
                     /Mac/.test(ua) ? 'Mac' :
                     /Linux/.test(ua) ? 'Linux' :
                     /Android/.test(ua) ? 'Android' :
                     /iOS|iPhone|iPad/.test(ua) ? 'iOS' : 'Other';

            var session = sessionStorage.getItem('visitor_session');
            if (!session) {
                session = 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 8);
                sessionStorage.setItem('visitor_session', session);
            }

            var fd = new FormData();
            fd.append('action', 'trackVisit');
            fd.append('page', window.location.pathname);
            fd.append('device', device);
            fd.append('browser', browser);
            fd.append('os', os);
            fd.append('referrer', document.referrer || 'direct');
            fd.append('session', session);

            fetch(API_URL, { method: 'POST', body: fd }).catch(function () {});
        } catch (e) {}
    }

    /* =========================================================
       INIT
       ========================================================= */
    function init() {
        var cached = getCache();
        if (cached) {
            /* Show cached data immediately for fast load */
            renderAll(cached);
            /* Then refresh in background */
            setTimeout(fetchData, 2000);
        } else {
            fetchData();
        }
        trackVisit();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    /* Expose helper */
    window.HananPortfolio = {
        refresh: function () {
            try { localStorage.removeItem(CACHE_KEY); } catch (e) {}
            fetchData();
        },
        version: '3.0'
    };
})();
