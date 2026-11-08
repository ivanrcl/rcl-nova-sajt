// Email na koji stižu upiti sa kontakt forme (prikazuje se korisniku ako slanje ne uspe)
const CONTACT_EMAIL = "ivan.gvozdenovic@rcl-group.com";
// Web3Forms pristupni ključ (https://web3forms.com) — vezan za CONTACT_EMAIL
const WEB3FORMS_KEY = "OVDE_UNESITE_WEB3FORMS_KLJUC";

// Mobilni meni
document.querySelector(".nav-toggle")?.addEventListener("click", (e) => {
  const menu = document.querySelector(".menu");
  const open = menu.classList.toggle("open");
  e.currentTarget.setAttribute("aria-expanded", open);
});

// Godina u footeru
document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));

// WarehouseMobile — trenutne verzije (aplikacija i web servis izlaze zajedno).
// Kod novog izdanja promenite samo ove vrednosti; prikazuju se svuda na sajtu.
const WAREHOUSE_MOBILE = {
  app: "1.7.33",      // verzija aplikacije (.NET MAUI)
  service: "3.26",    // verzija web servisa
  apk: "",            // putanja do .apk fajla, npr. "downloads/WarehouseMobile-1.7.33.apk" (prazno = dugme samo vizuelno)
};
document.querySelectorAll("[data-wm]").forEach((el) => (el.textContent = WAREHOUSE_MOBILE[el.dataset.wm]));
document.querySelectorAll("[data-wm-apk]").forEach((a) => {
  if (WAREHOUSE_MOBILE.apk) {
    a.href = WAREHOUSE_MOBILE.apk;
    a.setAttribute("download", "");
    a.removeAttribute("aria-disabled");
  } else {
    a.addEventListener("click", (e) => e.preventDefault());
  }
});

// Kontakt forma -> Web3Forms šalje upit na email vezan za WEB3FORMS_KEY
const form = document.querySelector("#lead-form");
if (form) {
  // Predizbor oblasti interesovanja iz URL-a, npr. kontakt.html?interes=warehouse
  const pre = new URLSearchParams(location.search).get("interes");
  if (pre) form.querySelectorAll(`input[name="Oblast interesovanja"][value="${pre}" i]`).forEach((c) => (c.checked = true));

  const status = form.querySelector(".form-status");
  const btn = form.querySelector("button[type=submit]");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    status.className = "form-status";

    // Validacija
    let valid = true;
    form.querySelectorAll("[required]").forEach((input) => {
      const field = input.closest(".field");
      const ok = input.type === "checkbox" ? input.checked : input.value.trim() !== "" && input.checkValidity();
      field?.classList.toggle("invalid", !ok);
      if (!ok) valid = false;
    });
    if (!valid) {
      status.textContent = "Molimo popunite sva obavezna polja (označena *) i prihvatite saglasnost.";
      status.classList.add("err");
      return;
    }

    const data = new FormData(form);
    const interes = data.getAll("Oblast interesovanja");
    data.delete("Oblast interesovanja");
    data.set("Oblast interesovanja", interes.length ? interes.join(", ") : "Nije navedeno");
    data.set("access_key", WEB3FORMS_KEY);
    data.set("subject", `Novi upit sa sajta: ${data.get("Kompanija") || data.get("Ime i prezime")}`);
    data.set("from_name", "Sajt RCL Nova");
    data.set("replyto", data.get("Email"));

    btn.disabled = true;
    btn.textContent = "Šaljem...";
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json.success !== true) throw new Error(json.message || res.statusText);
      form.reset();
      status.textContent = "Hvala! Vaš upit je poslat. Naš tim će vas kontaktirati u najkraćem roku.";
      status.classList.add("ok");
    } catch (err) {
      status.innerHTML = `Slanje nije uspelo. Pokušajte ponovo ili nam pišite direktno na <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a>.`;
      status.classList.add("err");
      console.error(err);
    } finally {
      btn.disabled = false;
      btn.textContent = "Potvrdi i pošalji";
    }
  });
}
