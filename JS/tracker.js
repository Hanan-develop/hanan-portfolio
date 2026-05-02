/* =========================================================
   PORTFOLIO TRACKER
   Sends visitor behavior to the admin dashboard.
   ---------------------------------------------------------
   👉 IMPORTANT: Update ADMIN_API to your dashboard URL.

   Since the website and dashboard live on SEPARATE repos /
   hosting, ADMIN_API must be the FULL URL (with https://)
   pointing to the dashboard's /api folder.

   Examples:
   - Dashboard on subdomain:
       'https://dashboard.abdulhanan.com/api'
   - Dashboard on subfolder:
       'https://abdulhanan.com/admin/api'
   - Dashboard on a different host:
       'https://hanan-admin.netlify.app/api'

   For LOCAL TESTING (PHP server running on port 8000):
       'http://localhost:8000/api'
   ========================================================= */
(function () {
    'use strict';

    // 🔧 CONFIG — change this to point to your dashboard's API URL
    const ADMIN_API = 'http://localhost:8000/api';   // <-- update after deployment

    // Generate / reuse a session id (per-tab via sessionStorage)
    let sessionId = sessionStorage.getItem('p_sid');
    if (!sessionId) {
        sessionId = 's_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 10);
        sessionStorage.setItem('p_sid', sessionId);
    }

    // POST helper — uses sendBeacon when available (more reliable on unload)
    function send(endpoint, payload) {
        try {
            const url = ADMIN_API + '/' + endpoint;
            const data = JSON.stringify(Object.assign({ session_id: sessionId }, payload));

            if (navigator.sendBeacon && endpoint === 'track.php') {
                const blob = new Blob([data], { type: 'application/json' });
                return navigator.sendBeacon(url, blob);
            }

            return fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: data,
                keepalive: true,
                credentials: 'omit'
            }).catch(() => { /* swallow errors silently */ });
        } catch (e) { /* fail silently — never block UI */ }
    }

    function trackVisit() {
        send('track.php', {
            type: 'visit',
            page: location.pathname || '/',
            referrer: document.referrer || '',
            screen: window.innerWidth + 'x' + window.innerHeight,
            language: navigator.language || ''
        });
    }

    function trackEvent(type, target, value) {
        send('track.php', {
            type: type,
            target: String(target || '').substring(0, 200),
            value: value != null ? String(value).substring(0, 500) : ''
        });
    }

    // ---------- Visit ----------
    if (document.readyState === 'complete') {
        trackVisit();
    } else {
        window.addEventListener('load', trackVisit);
    }

    // ---------- Click tracking ----------
    document.addEventListener('click', function (e) {
        const link = e.target.closest('a, button');
        if (!link) return;

        let label = '';
        let value = '';

        // Nav links
        if (link.matches('.nav-link, header .navbar a, .dash-nav-item')) {
            label = 'nav: ' + (link.textContent || '').trim();
            value = link.getAttribute('href') || '';
        }
        // Social
        else if (link.matches('.social-links a, .sidebar-social a')) {
            const i = link.querySelector('i');
            label = 'social';
            value = i ? (i.className.match(/fa-(github|linkedin|youtube|whatsapp|twitter|instagram|facebook)/) || ['', 'unknown'])[1] : 'unknown';
        }
        // CV download
        else if (link.matches('a[href*="Hanan.pdf"], a[href*=".pdf"]')) {
            trackEvent('cv_download', 'CV', link.getAttribute('href') || '');
            return;
        }
        // WhatsApp button
        else if (link.matches('.wa-float, .wa-action, a[href*="wa.me"]')) {
            label = 'whatsapp';
            value = link.getAttribute('href') || '';
        }
        // Hire / About / CTA buttons
        else if (link.matches('.btn, .home-cta a')) {
            label = 'button: ' + (link.textContent || '').trim();
        }
        // Project cards
        else if (link.matches('.portfolio .box, .project-card')) {
            const title = link.querySelector('h3');
            label = 'project';
            value = title ? title.textContent.trim() : '';
        }
        // Skill tile
        else if (link.matches('.skill-tile')) {
            const h4 = link.querySelector('h4');
            label = 'skill';
            value = h4 ? h4.textContent.trim() : '';
        }
        else {
            // Generic link/button — only track if it has meaningful text
            const text = (link.textContent || '').trim();
            if (text && text.length < 60) {
                label = link.tagName.toLowerCase() + ': ' + text;
            } else {
                return; // skip
            }
        }

        if (label) trackEvent('click', label, value);
    }, { passive: true });

    // ---------- Section view tracking (IntersectionObserver) ----------
    if ('IntersectionObserver' in window) {
        const seen = new Set();
        const sectionObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting && entry.intersectionRatio > 0.4) {
                    const id = entry.target.id || 'unknown';
                    if (!seen.has(id)) {
                        seen.add(id);
                        trackEvent('section_view', id);
                    }
                }
            });
        }, { threshold: [0.4] });

        // Wait for DOM ready, then observe sections
        function observeSections() {
            document.querySelectorAll('section[id]').forEach(function (s) {
                sectionObserver.observe(s);
            });
        }
        if (document.readyState !== 'loading') observeSections();
        else document.addEventListener('DOMContentLoaded', observeSections);
    }

    // ---------- Scroll depth tracking ----------
    const scrollMarks = [25, 50, 75, 100];
    const scrollSeen = new Set();

    function checkScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

        scrollMarks.forEach(function (mark) {
            if (pct >= mark && !scrollSeen.has(mark)) {
                scrollSeen.add(mark);
                trackEvent('scroll', mark + '%');
            }
        });
    }

    let scrollTimer;
    window.addEventListener('scroll', function () {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(checkScroll, 200);
    }, { passive: true });

    // ---------- Expose for form submission ----------
    window.PortfolioTracker = {
        track: trackEvent,
        sessionId: sessionId,
        api: ADMIN_API
    };

})();
