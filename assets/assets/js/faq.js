/* ==========================================================
   FAQ.JS
   Opini Visual
   Version 1.0

   Menangani:
   1. Fetch data dari data/faq.json lalu render ke .faq-list
      menggunakan struktur .faq-item dari sections.css
   2. Toggle buka/tutup accordion (hanya satu terbuka
      dalam satu waktu, opsional lewat data-single-open)

   Format data/faq.json yang diharapkan:
   [
     { "question": "Bagaimana proses onboarding-nya?",
       "answer": "Kamu upload footage lewat Google Drive atau Dropbox..." }
   ]

   Jika .faq-list tidak ditemukan, script akan tetap mencoba
   mengaktifkan .faq-item yang sudah ditulis manual di HTML
   (fallback progressive enhancement).
========================================================== */

(function(){
    "use strict";

    const faqList = document.querySelector(".faq-list");
    const dataUrl = faqList ? (faqList.getAttribute("data-source") || "data/faq.json") : null;
    const singleOpen = faqList ? faqList.hasAttribute("data-single-open") : false;


    /* ------------------------------------------------
       1. Render dari JSON (jika .faq-list tersedia)
    ------------------------------------------------ */

    function renderFAQ(items){
        faqList.innerHTML = "";

        items.forEach(function(item, index){
            const faqItem = document.createElement("div");
            faqItem.className = "faq-item";
            faqItem.innerHTML =
                '<button class="faq-question" aria-expanded="false" aria-controls="faq-answer-' + index + '">' +
                    '<span>' + item.question + '</span>' +
                    '<span class="faq-icon"></span>' +
                '</button>' +
                '<div class="faq-answer" id="faq-answer-' + index + '">' +
                    '<div class="faq-answer-inner"><p>' + item.answer + '</p></div>' +
                '</div>';
            faqList.appendChild(faqItem);
        });

        bindAccordion();
    }

    function loadFAQ(){
        fetch(dataUrl)
            .then(function(response){
                if(!response.ok) throw new Error("Gagal memuat " + dataUrl);
                return response.json();
            })
            .then(function(data){
                renderFAQ(data);
            })
            .catch(function(err){
                console.error("[faq.js]", err);
                faqList.innerHTML = '<p class="text-muted">FAQ belum bisa dimuat saat ini.</p>';
            });
    }


    /* ------------------------------------------------
       2. Accordion Toggle
    ------------------------------------------------ */

    function bindAccordion(){
        const items = document.querySelectorAll(".faq-item");

        items.forEach(function(item){
            const question = item.querySelector(".faq-question");
            const answer = item.querySelector(".faq-answer");

            if(!question || !answer) return;

            question.addEventListener("click", function(){
                const isOpen = item.classList.contains("is-open");

                if(singleOpen){
                    items.forEach(function(other){
                        other.classList.remove("is-open");
                        const otherAnswer = other.querySelector(".faq-answer");
                        const otherQuestion = other.querySelector(".faq-question");
                        if(otherAnswer) otherAnswer.style.maxHeight = null;
                        if(otherQuestion) otherQuestion.setAttribute("aria-expanded", "false");
                    });
                }

                if(isOpen){
                    item.classList.remove("is-open");
                    answer.style.maxHeight = null;
                    question.setAttribute("aria-expanded", "false");
                }else{
                    item.classList.add("is-open");
                    answer.style.maxHeight = answer.scrollHeight + "px";
                    question.setAttribute("aria-expanded", "true");
                }
            });
        });
    }


    /* ------------------------------------------------
       Init
    ------------------------------------------------ */

    if(faqList && dataUrl){
        loadFAQ();
    }else{
        /* Tidak ada .faq-list — aktifkan accordion untuk markup statis di HTML */
        bindAccordion();
    }

})();
