
(() => {
    "use strict";

    const init = () => {
        const header = document.getElementById("fpHeader");
        const progress = document.querySelector(".fp-progress");
        const backTop = document.getElementById("fpBackTop");
        const navLinks = document.querySelectorAll(".fp-nav-links .nav-link");
        const sections = document.querySelectorAll("main section[id]");
        const year = document.getElementById("fpYear");
        const form = document.getElementById("fpContactForm");

        if (year) year.textContent = new Date().getFullYear();

        const updateScroll = () => {
            const scrollY = window.scrollY;
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

            header?.classList.toggle("scrolled", scrollY > 50);
            backTop?.classList.toggle("show", scrollY > 450);

            if (progress) {
                progress.style.width = `${maxScroll > 0 ? scrollY / maxScroll * 100 : 0}%`;
            }

            let current = "home";

            sections.forEach(section => {
                if (scrollY >= section.offsetTop - 180) {
                    current = section.id;
                }
            });

            navLinks.forEach(link => {
                const isActive = link.getAttribute("href") === `#${current}`;
                link.classList.toggle("active", isActive);

                if (isActive) {
                    link.setAttribute("aria-current", "page");
                } else {
                    link.removeAttribute("aria-current");
                }
            });
        };

        window.addEventListener("scroll", updateScroll, { passive: true });
        window.addEventListener("resize", updateScroll);
        updateScroll();

        backTop?.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });

        const navbar = document.getElementById("fpNavbar");

        if (navbar && window.bootstrap) {
            navLinks.forEach(link => {
                link.addEventListener("click", () => {
                    if (navbar.classList.contains("show")) {
                        bootstrap.Collapse.getOrCreateInstance(navbar).hide();
                    }
                });
            });
        }

        if (typeof AOS !== "undefined") {
            AOS.init({
                duration: 850,
                easing: "ease-out-cubic",
                once: true,
                offset: 70,
                disable: window.matchMedia("(prefers-reduced-motion: reduce)").matches
            });
        }

        if (typeof Swiper !== "undefined") {
            new Swiper(".fp-gallery-swiper", {
                slidesPerView: 1.15,
                spaceBetween: 18,
                speed: 800,
                loop: true,
                grabCursor: true,
                autoplay: {
                    delay: 3500,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true
                },
                navigation: {
                    nextEl: ".fp-gallery-next",
                    prevEl: ".fp-gallery-prev"
                },
                pagination: {
                    el: ".fp-gallery-pagination",
                    clickable: true
                },
                breakpoints: {
                    576: {
                        slidesPerView: 1.7,
                        spaceBetween: 20
                    },
                    768: {
                        slidesPerView: 2,
                        spaceBetween: 22
                    },
                    1200: {
                        slidesPerView: 3,
                        spaceBetween: 25
                    }
                }
            });
        }

        const counters = document.querySelectorAll(".fp-count");

        const animateCounter = element => {
            const target = Number(element.dataset.target);

            if (!Number.isFinite(target)) return;

            if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
                element.textContent = target.toLocaleString("ar-SA");
                return;
            }

            const duration = 1600;
            const start = performance.now();

            const update = now => {
                const progress = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                const value = Math.round(target * eased);

                element.textContent = value.toLocaleString("ar-SA");

                if (progress < 1) requestAnimationFrame(update);
            };

            requestAnimationFrame(update);
        };

        if ("IntersectionObserver" in window) {
            const counterObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;

                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                });
            }, { threshold: 0.4 });

            counters.forEach(counter => counterObserver.observe(counter));
        } else {
            counters.forEach(animateCounter);
        }

        if (form) {
            form.addEventListener("submit", event => {
                event.preventDefault();

                if (!form.reportValidity()) return;

                const name = document.getElementById("fpName").value.trim();
                const phone = document.getElementById("fpPhone").value.trim();
                const service = document.getElementById("fpService").value;
                const message = document.getElementById("fpMessage").value.trim();

                if (!name || !phone || !service || !message) {
                    alert("يرجى استكمال جميع البيانات المطلوبة.");
                    return;
                }

                if (!/^\+?[\d\s-]{8,18}$/.test(phone)) {
                    alert("يرجى إدخال رقم جوال صحيح.");
                    return;
                }

                const whatsappNumber = "966532488202";

                const whatsappMessage = [
                    "طلب خدمة جديد - سباك المستقبل",
                    "",
                    `الاسم: ${name}`,
                    `رقم الجوال: ${phone}`,
                    `الخدمة المطلوبة: ${service}`,
                    "",
                    "تفاصيل الطلب:",
                    message,
                    "",
                    "تم إرسال الطلب من موقع سباك المستقبل"
                ].join("\n");

                const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

                const newWindow = window.open(url, "_blank", "noopener,noreferrer");

                if (newWindow) {
                    form.reset();
                } else {
                    const fallback = document.createElement("a");
                    fallback.href = url;
                    fallback.target = "_blank";
                    fallback.rel = "noopener noreferrer";
                    fallback.textContent = "اضغط هنا لفتح واتساب وإرسال الطلب";
                    fallback.style.display = "block";
                    fallback.style.marginTop = "15px";
                    fallback.style.color = "#087E9B";
                    fallback.style.fontWeight = "800";

                    form.querySelector(".fp-whatsapp-fallback")?.remove();
                    fallback.className = "fp-whatsapp-fallback";
                    form.appendChild(fallback);
                }
            });
        }
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
