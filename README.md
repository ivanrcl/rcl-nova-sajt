# RCL Nova d.o.o. — sajt

Statičan sajt (HTML/CSS/JS), bez instalacije dodatnih alata.

## Stranice
- `index.html` — Početna
- `o-nama.html` — O nama
- `erp.html` — ERP rešenje (MS Dynamics 365 Business Central)
- `warehouse.html` — Warehouse rešenje
- `integracije.html` — Integracije
- `kontakt.html` — Kontakt sa formom

Stil je u `css/style.css`, a logika forme i menija u `js/main.js`.

## Pokretanje lokalno
```
python -m http.server 8080
```
Zatim otvorite http://localhost:8080

## Kontakt forma
Forma šalje upite preko besplatnog servisa [Web3Forms](https://web3forms.com).
Upiti stižu na email za koji je napravljen pristupni ključ (`ivan.gvozdenovic@rcl-group.com`).

**Podešavanje:**
1. Na https://web3forms.com unesite email na koji treba da stižu upiti i kliknite „Create Access Key“.
2. Ključ stiže na taj email.
3. U `js/main.js` ključ upišite u `WEB3FORMS_KEY`.

Da biste promenili email primaoca, napravite novi ključ za novu adresu i zamenite ga u `js/main.js`.

Ključ nije tajna: Web3Forms je predviđen za javne sajtove i ključ samo prosleđuje upite na vaš email.

Formu testirajte preko `http://localhost` ili objavljenog sajta, ne otvaranjem fajla duplim klikom (`file://`).
