(function () {
  var toggle = document.querySelector(".menu-toggle");
  var nav = document.getElementById("site-nav");
  var header = document.querySelector(".site-header");
  var form = document.getElementById("contact-form");
  var confirmBox = document.getElementById("form-confirm");
  var desktop = window.matchMedia("(min-width: 1000px)");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.documentElement.classList.add("js");

  function closeMenu() {
    if (!toggle || !nav) return;
    toggle.setAttribute("aria-expanded", "false");
    nav.classList.remove("is-open");
    document.body.classList.remove("nav-open");
    if (header) header.classList.remove("is-open");
  }

  function openMenu() {
    toggle.setAttribute("aria-expanded", "true");
    nav.classList.add("is-open");
    document.body.classList.add("nav-open");
    if (header) header.classList.add("is-open");
    var first = nav.querySelector("a");
    if (first) first.focus();
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      if (open) {
        closeMenu();
        toggle.focus();
      } else {
        openMenu();
      }
    });

    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) closeMenu();
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        closeMenu();
        toggle.focus();
      }
    });

    if (typeof desktop.addEventListener === "function") {
      desktop.addEventListener("change", function (event) {
        if (event.matches) closeMenu();
      });
    }
  }

  var reveals = document.querySelectorAll(".reveal");
  if (reduce || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -6% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
    window.setTimeout(function () {
      reveals.forEach(function (el) { el.classList.add("is-in"); });
    }, 2200);
  }

  var parallax = document.querySelectorAll(".parallax");
  var ticking = false;

  function paint() {
    var y = window.scrollY || window.pageYOffset || 0;
    if (header) header.classList.toggle("is-stuck", y > 20);
    if (!reduce) {
      parallax.forEach(function (img) {
        var rect = img.getBoundingClientRect();
        if (rect.bottom < -80 || rect.top > window.innerHeight + 80) return;
        var shift = (rect.top - window.innerHeight * 0.45) * -0.06;
        shift = Math.max(-36, Math.min(36, shift));
        img.style.setProperty("--py", shift.toFixed(1) + "px");
      });
    }
    ticking = false;
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(paint);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  paint();

  var services = document.querySelectorAll(".service");
  services.forEach(function (service) {
    var toggleBtn = service.querySelector(".service-toggle");
    var panel = service.querySelector(".service-desc");
    if (!toggleBtn || !panel) return;

    toggleBtn.addEventListener("click", function () {
      var open = toggleBtn.getAttribute("aria-expanded") === "true";
      services.forEach(function (other) {
        var otherBtn = other.querySelector(".service-toggle");
        var otherPanel = other.querySelector(".service-desc");
        if (!otherBtn || !otherPanel) return;
        otherBtn.setAttribute("aria-expanded", "false");
        otherPanel.hidden = true;
        other.classList.remove("is-open");
      });
      if (!open) {
        toggleBtn.setAttribute("aria-expanded", "true");
        panel.hidden = false;
        service.classList.add("is-open");
      }
    });
  });

  if (!form || !confirmBox) return;

  var preview = document.getElementById("note-preview");
  var mailLink = document.getElementById("mailto-link");
  var copyBtn = document.getElementById("copy-note");

  form.querySelectorAll("input, textarea").forEach(function (field) {
    field.addEventListener("input", function () {
      field.setCustomValidity("");
    });
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var nameField = form.querySelector("#full-name");
    var emailField = form.querySelector("#email");
    var messageField = form.querySelector("#message");
    var name = nameField.value.trim();
    var email = emailField.value.trim();
    var message = messageField.value.trim();

    nameField.setCustomValidity(name ? "" : "Enter your name.");
    emailField.setCustomValidity(email ? "" : "Enter your email.");
    messageField.setCustomValidity(message ? "" : "Write a short note.");

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    var text = ["Name: " + name, "Email: " + email, "", message].join("\n");
    var href =
      "mailto:camacho.jp@gmail.com?subject=" +
      encodeURIComponent("Cocomailo inquiry from " + name) +
      "&body=" +
      encodeURIComponent(text);

    if (preview) preview.textContent = text;
    if (mailLink) mailLink.setAttribute("href", href);
    if (copyBtn) {
      copyBtn.textContent = "Copy note";
      copyBtn.onclick = function () {
        if (!navigator.clipboard || !navigator.clipboard.writeText) {
          copyBtn.textContent = "Select the note to copy";
          return;
        }
        navigator.clipboard.writeText(text).then(
          function () { copyBtn.textContent = "Copied"; },
          function () { copyBtn.textContent = "Select the note to copy"; }
        );
      };
    }

    confirmBox.hidden = false;
    var heading = document.getElementById("confirm-title");
    if (heading) heading.focus();
  });
})();
