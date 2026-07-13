/* ==========================================================
   FORM.JS
   Opini Visual
   Version 1.0

   Menangani validasi & submit form (mis. contact.html).

   Struktur HTML yang diharapkan:
   <form class="js-form" data-endpoint="https://formspree.io/f/xxxx" novalidate>
       <div class="form-group">
           <label class="form-label" for="name">Nama<span class="required">*</span></label>
           <input class="form-input" type="text" id="name" name="name" required>
           <span class="form-error-message"></span>
       </div>
       ...
       <button type="submit" class="btn btn-primary">Kirim Pesan</button>
   </form>
   <div class="form-success" hidden>...</div>

   - data-endpoint : URL tujuan submit (mis. Formspree/Getform/API sendiri).
                     Jika tidak diisi, form hanya divalidasi tanpa dikirim
                     (mode demo/development).
========================================================== */

(function(){
    "use strict";

    const forms = document.querySelectorAll(".js-form");
    if(!forms.length) return;

    forms.forEach(function(form){
        initForm(form);
    });

    function initForm(form){

        const submitBtn = form.querySelector('button[type="submit"]');
        const successPanel = document.querySelector(
            form.getAttribute("data-success-target") || ".form-success"
        );

        /* Bersihkan pesan error saat user mulai mengetik ulang */
        form.querySelectorAll(".form-input, .form-textarea, .form-select").forEach(function(field){
            field.addEventListener("input", function(){
                clearFieldError(field);
            });
        });

        form.addEventListener("submit", function(e){
            e.preventDefault();

            const isValid = validateForm(form);
            if(!isValid) return;

            submitForm(form, submitBtn, successPanel);
        });

    }


    /* ------------------------------------------------
       Validation
    ------------------------------------------------ */

    function validateForm(form){
        let isValid = true;
        const fields = form.querySelectorAll("[required]");

        fields.forEach(function(field){
            const fieldValid = validateField(field);
            if(!fieldValid) isValid = false;
        });

        return isValid;
    }

    function validateField(field){
        const value = field.value.trim();
        let errorMessage = "";

        if(field.hasAttribute("required") && !value){
            errorMessage = "Kolom ini wajib diisi.";
        }else if(field.type === "email" && value && !isValidEmail(value)){
            errorMessage = "Format email tidak valid.";
        }else if(field.type === "tel" && value && !isValidPhone(value)){
            errorMessage = "Format nomor telepon tidak valid.";
        }else if(field.hasAttribute("minlength") && value.length < parseInt(field.getAttribute("minlength"), 10)){
            errorMessage = "Minimal " + field.getAttribute("minlength") + " karakter.";
        }

        if(errorMessage){
            showFieldError(field, errorMessage);
            return false;
        }

        clearFieldError(field);
        return true;
    }

    function isValidEmail(value){
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    function isValidPhone(value){
        return /^[0-9+\-\s()]{8,}$/.test(value);
    }

    function showFieldError(field, message){
        field.classList.add("is-error");
        field.setAttribute("aria-invalid", "true");

        const group = field.closest(".form-group");
        const errorEl = group ? group.querySelector(".form-error-message") : null;

        if(errorEl){
            errorEl.textContent = message;
        }
    }

    function clearFieldError(field){
        field.classList.remove("is-error");
        field.removeAttribute("aria-invalid");

        const group = field.closest(".form-group");
        const errorEl = group ? group.querySelector(".form-error-message") : null;

        if(errorEl){
            errorEl.textContent = "";
        }
    }


    /* ------------------------------------------------
       Submit
    ------------------------------------------------ */

    function setLoading(button, isLoading){
        if(!button) return;

        if(isLoading){
            button.dataset.originalText = button.innerHTML;
            button.innerHTML = '<span class="spinner"></span> Mengirim...';
            button.disabled = true;
        }else{
            button.innerHTML = button.dataset.originalText || button.innerHTML;
            button.disabled = false;
        }
    }

    function submitForm(form, submitBtn, successPanel){
        const endpoint = form.getAttribute("data-endpoint");

        setLoading(submitBtn, true);

        /* Mode demo — tidak ada endpoint, langsung tampilkan sukses */
        if(!endpoint){
            setTimeout(function(){
                setLoading(submitBtn, false);
                showSuccess(form, successPanel);
            }, 600);
            return;
        }

        const formData = new FormData(form);

        fetch(endpoint, {
            method:"POST",
            body:formData,
            headers:{ "Accept":"application/json" }
        })
        .then(function(response){
            if(!response.ok) throw new Error("Submit gagal, status " + response.status);
            setLoading(submitBtn, false);
            showSuccess(form, successPanel);
        })
        .catch(function(err){
            console.error("[form.js]", err);
            setLoading(submitBtn, false);
            showSubmitError(form);
        });
    }

    function showSuccess(form, successPanel){
        form.reset();

        if(successPanel){
            form.hidden = true;
            successPanel.hidden = false;
            successPanel.scrollIntoView({ behavior:"smooth", block:"center" });
        }else{
            alert("Pesan berhasil dikirim. Terima kasih!");
        }
    }

    function showSubmitError(form){
        let banner = form.querySelector(".form-submit-error");

        if(!banner){
            banner = document.createElement("p");
            banner.className = "form-submit-error form-error-message";
            form.prepend(banner);
        }

        banner.textContent = "Terjadi kesalahan saat mengirim. Silakan coba lagi atau hubungi kami langsung lewat email.";
    }

})();
