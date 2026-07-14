/* ==========================================================
   PORTFOLIO.JS
   Opini Visual
   Version 1.1

   Menangani:
   1. Fetch data dari data/portfolio.json lalu render ke
      .portfolio-grid menggunakan struktur .card-portfolio
   2. Filter berdasarkan kategori (mis. "Cinematic", "Candid",
      "Highlight Reel")
   3. Lightbox untuk memutar video — mendukung dua sumber:
      - "youtube"  : ID atau URL video YouTube (disarankan,
                     tidak perlu hosting file video sendiri)
      - "video"    : path ke file video self-hosted (mp4)

   Format data/portfolio.json yang diharapkan:
   [
     {
       "id": "wedding-01",
       "title": "Amara & Rian — Bali",
       "category": "Cinematic",
       "thumbnail": "assets/images/portfolio/wedding-01.jpg",
       "youtube": "dQw4w9WgXcQ"
     }
   ]

   Catatan thumbnail:
   Kolom "thumbnail" boleh dikosongkan/dihapus jika "youtube"
   diisi — sistem akan otomatis memakai thumbnail resmi dari
   YouTube (tidak perlu upload gambar thumbnail manual).

   Nilai "youtube" boleh berupa salah satu dari:
   - ID video saja                → "dQw4w9WgXcQ"
   - Link youtu.be                → "https://youtu.be/dQw4w9WgXcQ"
   - Link youtube.com/watch?v=... → "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
========================================================== */

(function(){
    "use strict";

    const grid = document.querySelector(".portfolio-grid");
    if(!grid) return;

    const filterButtons = document.querySelectorAll("[data-filter]");
    const dataUrl = grid.getAttribute("data-source") || "data/portfolio.json";

    let allItems = [];


    /* ------------------------------------------------
       Helper: Ekstrak ID video YouTube dari berbagai
       format link, atau kembalikan apa adanya jika
       sudah berupa ID murni.
    ------------------------------------------------ */

    function extractYouTubeId(value){
        if(!value) return "";

        const patterns = [
            /youtu\.be\/([a-zA-Z0-9_-]{11})/,
            /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
            /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
            /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/
        ];

        for(let i = 0; i < patterns.length; i++){
            const match = value.match(patterns[i]);
            if(match) return match[1];
        }

        /* Jika bukan URL dan panjangnya sesuai ID YouTube, anggap sudah ID */
        if(/^[a-zA-Z0-9_-]{11}$/.test(value)) return value;

        return "";
    }

    function getYouTubeThumbnail(youtubeId){
        return "https://img.youtube.com/vi/" + youtubeId + "/hqdefault.jpg";
    }


    /* ------------------------------------------------
       1. Fetch & Render
    ------------------------------------------------ */

    function renderItems(items){
        grid.innerHTML = "";

        if(!items.length){
            grid.innerHTML = '<p class="text-muted">Belum ada portfolio untuk kategori ini.</p>';
            return;
        }

        items.forEach(function(item){
            const card = document.createElement("article");
            card.className = "card card-portfolio reveal-scale";
            card.setAttribute("data-category", item.category || "");

            const youtubeId = extractYouTubeId(item.youtube);
            const thumbnail = item.thumbnail || (youtubeId ? getYouTubeThumbnail(youtubeId) : "");

            card.innerHTML =
                '<button class="card-portfolio-trigger" data-youtube="' + youtubeId + '" data-video="' + (item.video || "") + '" data-title="' + (item.title || "") + '" aria-label="Putar ' + (item.title || "video") + '">' +
                    '<div class="card-portfolio-media">' +
                        '<img src="' + thumbnail + '" alt="' + (item.title || "") + '" loading="lazy">' +
                        '<div class="card-portfolio-overlay"></div>' +
                    '</div>' +
                    '<div class="card-portfolio-body">' +
                        '<p class="card-portfolio-tag">' + (item.category || "") + '</p>' +
                        '<h4>' + (item.title || "") + '</h4>' +
                    '</div>' +
                '</button>';

            grid.appendChild(card);
        });

        attachTriggerEvents();
    }

    function loadPortfolio(){
        fetch(dataUrl)
            .then(function(response){
                if(!response.ok) throw new Error("Gagal memuat " + dataUrl);
                return response.json();
            })
            .then(function(data){
                allItems = data;
                renderItems(allItems);
            })
            .catch(function(err){
                console.error("[portfolio.js]", err);
                grid.innerHTML = '<p class="text-muted">Portfolio belum bisa dimuat saat ini.</p>';
            });
    }


    /* ------------------------------------------------
       2. Filter
    ------------------------------------------------ */

    if(filterButtons.length){
        filterButtons.forEach(function(btn){
            btn.addEventListener("click", function(){
                filterButtons.forEach(function(b){ b.classList.remove("is-active"); });
                btn.classList.add("is-active");

                const filterValue = btn.getAttribute("data-filter");

                if(filterValue === "all" || !filterValue){
                    renderItems(allItems);
                }else{
                    renderItems(allItems.filter(function(item){
                        return item.category === filterValue;
                    }));
                }
            });
        });
    }


    /* ------------------------------------------------
       3. Lightbox (mendukung YouTube embed & video mp4)
    ------------------------------------------------ */

    let lightbox = document.querySelector(".portfolio-lightbox");

    if(!lightbox){
        lightbox = document.createElement("div");
        lightbox.className = "portfolio-lightbox";
        lightbox.innerHTML =
            '<button class="portfolio-lightbox-close" aria-label="Tutup">&times;</button>' +
            '<div class="portfolio-lightbox-content"></div>';
        document.body.appendChild(lightbox);
    }

    const lightboxContent = lightbox.querySelector(".portfolio-lightbox-content");
    const lightboxClose = lightbox.querySelector(".portfolio-lightbox-close");

    function openLightbox(youtubeId, videoSrc, title){

        lightboxContent.innerHTML = "";

        if(youtubeId){
            const iframe = document.createElement("iframe");
            iframe.className = "portfolio-lightbox-video";
            iframe.setAttribute("src", "https://www.youtube.com/embed/" + youtubeId + "?autoplay=1&rel=0&modestbranding=1");
            iframe.setAttribute("title", title || "Portfolio video");
            iframe.setAttribute("frameborder", "0");
            iframe.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture");
            iframe.setAttribute("allowfullscreen", "");
            lightboxContent.appendChild(iframe);
        }else if(videoSrc){
            const video = document.createElement("video");
            video.className = "portfolio-lightbox-video";
            video.setAttribute("controls", "");
            video.setAttribute("playsinline", "");
            video.setAttribute("src", videoSrc);
            lightboxContent.appendChild(video);
            video.play().catch(function(){ /* butuh interaksi user, abaikan */ });
        }else{
            return;
        }

        lightbox.classList.add("is-open");
        document.body.style.overflow = "hidden";
    }

    function closeLightbox(){
        lightbox.classList.remove("is-open");
        document.body.style.overflow = "";
        lightboxContent.innerHTML = "";
    }

    function attachTriggerEvents(){
        const triggers = grid.querySelectorAll(".card-portfolio-trigger");
        triggers.forEach(function(trigger){
            trigger.addEventListener("click", function(){
                openLightbox(
                    trigger.getAttribute("data-youtube"),
                    trigger.getAttribute("data-video"),
                    trigger.getAttribute("data-title")
                );
            });
        });

        /* Card portfolio dibuat secara dinamis (setelah fetch async),
           sehingga observer global di animation.js sudah lewat duluan
           dan tidak sempat mendata elemen ini. Kita jalankan observer
           terpisah khusus untuk card di dalam grid ini supaya animasi
           reveal tetap jalan dan card tidak nyangkut transparan. */
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const cardsInGrid = grid.querySelectorAll(".reveal-scale");

        if(prefersReducedMotion){
            cardsInGrid.forEach(function(el){ el.classList.add("is-visible"); });
            return;
        }

        if("IntersectionObserver" in window){
            const localObserver = new IntersectionObserver(function(entries){
                entries.forEach(function(entry){
                    if(entry.isIntersecting){
                        entry.target.classList.add("is-visible");
                        localObserver.unobserve(entry.target);
                    }
                });
            }, { threshold:0.1, rootMargin:"0px 0px -40px 0px" });

            cardsInGrid.forEach(function(el){ localObserver.observe(el); });
        }else{
            /* Fallback jika browser sangat lama tanpa dukungan IntersectionObserver */
            cardsInGrid.forEach(function(el){ el.classList.add("is-visible"); });
        }
    }

    lightboxClose.addEventListener("click", closeLightbox);

    lightbox.addEventListener("click", function(e){
        if(e.target === lightbox){
            closeLightbox();
        }
    });

    document.addEventListener("keydown", function(e){
        if(e.key === "Escape" && lightbox.classList.contains("is-open")){
            closeLightbox();
        }
    });


    /* ------------------------------------------------
       Init
    ------------------------------------------------ */

    loadPortfolio();

})();
