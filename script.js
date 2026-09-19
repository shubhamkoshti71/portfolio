// Rotating role title: type a role, pause, erase it, move on to the next one, forever
(function () {
    const roles = ["Data Engineer", "Analytics Engineer", "Developer"];
    const output = document.getElementById("typed-output");
    if (!output) return;

    const TYPE_MS = 70;
    const ERASE_MS = 40;
    const HOLD_MS = 1600;   // how long a finished role stays on screen
    const GAP_MS = 350;     // pause before the next role starts typing

    // Reduced motion: no typing, just swap the role every few seconds
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        let n = 0;
        output.textContent = roles[0];
        setInterval(function () {
            n = (n + 1) % roles.length;
            output.textContent = roles[n];
        }, 2500);
        return;
    }

    let roleIndex = 0;
    let charCount = 0;
    let erasing = false;

    function tick() {
        const role = roles[roleIndex];
        charCount += erasing ? -1 : 1;
        output.textContent = role.slice(0, charCount);

        let delay = erasing ? ERASE_MS : TYPE_MS;
        if (!erasing && charCount === role.length) {
            erasing = true;
            delay = HOLD_MS;
        } else if (erasing && charCount === 0) {
            erasing = false;
            roleIndex = (roleIndex + 1) % roles.length;
            delay = GAP_MS;
        }
        setTimeout(tick, delay);
    }

    tick();
})();


let bar = document.querySelector(".bars .fa-bars");
let menu = document.querySelector(".menu");

bar.addEventListener("click", function () {
    menu.classList.toggle("show_menu");
});

AOS.init();


// Scroll reveal and stat count-up
(function () {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const reveals = document.querySelectorAll(".reveal");
    const counters = document.querySelectorAll(".stat-num[data-count]");

    if (!("IntersectionObserver" in window) || reduceMotion) {
        reveals.forEach(function (el) { el.classList.add("in"); });
        return;
    }

    // Only hide the cards once we know the script is running
    document.documentElement.classList.add("js-reveal");

    const revealObserver = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("in");
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.15 });
    reveals.forEach(function (el) { revealObserver.observe(el); });

    function countUp(el) {
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || "";
        const duration = 1200;
        const start = performance.now();

        function frame(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(target * eased) + suffix;
            if (progress < 1) requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
    }

    const countObserver = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            countUp(entry.target);
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { countObserver.observe(el); });
})();


// Projects: category filter and architecture popup
(function () {
    const buttons = document.querySelectorAll(".filter-btn");
    const cards = document.querySelectorAll(".project-card[data-cat]");

    buttons.forEach(function (button) {
        button.addEventListener("click", function () {
            const filter = button.dataset.filter;
            buttons.forEach(function (other) {
                const active = other === button;
                other.classList.toggle("is-active", active);
                other.setAttribute("aria-pressed", active ? "true" : "false");
            });
            cards.forEach(function (card) {
                card.hidden = !(filter === "all" || card.dataset.cat === filter);
            });
        });
    });

    const dialog = document.getElementById("arch-dialog");
    const openButton = document.querySelector("[data-open-arch]");
    if (!openButton) return;

    if (dialog && typeof dialog.showModal === "function") {
        openButton.addEventListener("click", function () { dialog.showModal(); });
        // Close on the close button or a click on the backdrop
        dialog.addEventListener("click", function (event) {
            if (event.target === dialog || event.target.hasAttribute("data-close")) dialog.close();
        });
    } else {
        // Very old browsers: just open the diagram in a new tab
        openButton.addEventListener("click", function () {
            window.open("img/fema_architecture.png", "_blank", "noopener");
        });
    }
})();


// Contact: copy email button, footer year and New York local time
(function () {
    const copyButton = document.querySelector("[data-copy-email]");
    if (copyButton) {
        const label = copyButton.querySelector("span");
        const original = label.textContent;

        function showCopied() {
            label.textContent = "Copied!";
            copyButton.classList.add("is-done");
            setTimeout(function () {
                label.textContent = original;
                copyButton.classList.remove("is-done");
            }, 2000);
        }

        function fallbackCopy(text) {
            const field = document.createElement("textarea");
            field.value = text;
            field.setAttribute("readonly", "");
            field.style.position = "fixed";
            field.style.opacity = "0";
            document.body.appendChild(field);
            field.select();
            try { document.execCommand("copy"); showCopied(); } catch (error) { /* nothing to do */ }
            document.body.removeChild(field);
        }

        copyButton.addEventListener("click", function () {
            const email = copyButton.dataset.copyEmail;
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(email).then(showCopied, function () { fallbackCopy(email); });
            } else {
                fallbackCopy(email);
            }
        });
    }

    const year = document.getElementById("footer-year");
    if (year) year.textContent = new Date().getFullYear();

    const clock = document.getElementById("ny-time");
    if (clock) {
        const format = new Intl.DateTimeFormat("en-US", {
            timeZone: "America/New_York",
            hour: "numeric",
            minute: "2-digit"
        });
        function updateClock() {
            clock.textContent = format.format(new Date()) + " in New York";
        }
        updateClock();
        setInterval(updateClock, 30000);
    }
})();
