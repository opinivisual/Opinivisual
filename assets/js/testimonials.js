/* ==========================================================
   TESTIMONIALS.JS
   Opini Visual
   Version 1.0

   Slider testimonial ringan tanpa dependency luar.

   Struktur HTML yang diharapkan:
   <div class="testimonial-slider" data-autoplay="6000">
       <div class="testimonial-track">
           <div class="testimonial-slide"><div class="card card-testimonial">...</div></div>
           <div class="testimonial-slide"><div class="card card-testimonial">...</div></div>
       </div>
       <div class="testimonial-nav">
           <button class="testimonial-prev" aria-label="Sebelumnya">‹</button>
           <div class="testimonial-dots"></div>
           <button class="testimonial-next" aria-label="Berikutnya">›</button>
       </div>
   </div>

   - data-autoplay : jeda autoplay dalam ms (opsional, hilangkan
                     atribut untuk menonaktifkan autoplay)
========================================================== */

(function(){
    "use strict";

    const sliders = document.querySelectorAll(".testimonial-slider");
    if(!sliders.length) return;

    sliders.forEach(function(slider){
        initSlider(slider);
    });

    function initSlider(slider){

        const track = slider.querySelector(".testimonial-track");
        const slides = Array.from(slider.querySelectorAll(".testimonial-slide"));
        const prevBtn = slider.querySelector(".testimonial-prev");
        const nextBtn = slider.querySelector(".testimonial-next");
        const dotsContainer = slider.querySelector(".testimonial-dots");

        if(!track || !slides.length) return;

        let currentIndex = 0;
        let autoplayTimer = null;
        const autoplayDelay = parseInt(slider.getAttribute("data-autoplay"), 10) || 0;


        /* --------------------------------------------
           Build Dots
        -------------------------------------------- */

        const dots = [];

        if(dotsContainer){
            slides.forEach(function(_, index){
                const dot = document.createElement("button");
                dot.className = "testimonial-dot";
                dot.setAttribute("aria-label", "Kesaksian " + (index + 1));
                dot.addEventListener("click", function(){
                    goToSlide(index);
                    resetAutoplay();
                });
                dotsContainer.appendChild(dot);
                dots.push(dot);
            });
        }


        /* --------------------------------------------
           Core Navigation
        -------------------------------------------- */

        function updateUI(){
            track.style.transform = "translateX(-" + (currentIndex * 100) + "%)";

            dots.forEach(function(dot, index){
                dot.classList.toggle("is-active", index === currentIndex);
            });
        }

        function goToSlide(index){
            currentIndex = (index + slides.length) % slides.length;
            updateUI();
        }

        function nextSlide(){
            goToSlide(currentIndex + 1);
        }

        function prevSlide(){
            goToSlide(currentIndex - 1);
        }


        /* --------------------------------------------
           Buttons
        -------------------------------------------- */

        if(nextBtn){
            nextBtn.addEventListener("click", function(){
                nextSlide();
                resetAutoplay();
            });
        }

        if(prevBtn){
            prevBtn.addEventListener("click", function(){
                prevSlide();
                resetAutoplay();
            });
        }


        /* --------------------------------------------
           Swipe Support (mobile)
        -------------------------------------------- */

        let touchStartX = 0;
        let touchEndX = 0;

        track.addEventListener("touchstart", function(e){
            touchStartX = e.changedTouches[0].screenX;
        }, { passive:true });

        track.addEventListener("touchend", function(e){
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive:true });

        function handleSwipe(){
            const delta = touchEndX - touchStartX;
            const SWIPE_THRESHOLD = 50;

            if(delta > SWIPE_THRESHOLD){
                prevSlide();
                resetAutoplay();
            }else if(delta < -SWIPE_THRESHOLD){
                nextSlide();
                resetAutoplay();
            }
        }


        /* --------------------------------------------
           Autoplay
        -------------------------------------------- */

        function startAutoplay(){
            if(autoplayDelay > 0){
                autoplayTimer = setInterval(nextSlide, autoplayDelay);
            }
        }

        function stopAutoplay(){
            clearInterval(autoplayTimer);
        }

        function resetAutoplay(){
            stopAutoplay();
            startAutoplay();
        }

        /* Jeda autoplay saat pointer di atas slider */
        slider.addEventListener("mouseenter", stopAutoplay);
        slider.addEventListener("mouseleave", startAutoplay);


        /* --------------------------------------------
           Init
        -------------------------------------------- */

        updateUI();
        startAutoplay();

    }

})();
