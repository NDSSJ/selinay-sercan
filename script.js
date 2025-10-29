// Zugangscode (Demo)
const SECRET = "14122020";

// Elemente für Login (nur vorhanden auf login.html)
const accessInput = document.getElementById("accessCode");
const enterBtn = document.getElementById("enterBtn");
const loginMsg = document.getElementById("loginMsg");

// Wenn wir auf login.html sind:
if (enterBtn) {
    enterBtn.addEventListener("click", () => {
        const typed = accessInput.value.trim();
        if (typed === SECRET) {
            // Code korrekt → Weiterleitung auf home.html
            window.location.href = "home.html";
        } else {
            loginMsg.textContent = "Falscher Code. Bitte erneut versuchen.";
            accessInput.style.borderColor = "#000000ff";
        }
    });

    // Enter-Taste aktiv
    accessInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") enterBtn.click();
    });
}

const sidebar = document.getElementById("sidebar");
const globalToggle = document.getElementById("sidebarToggle");
if (globalToggle && sidebar) {
    globalToggle.addEventListener("click", () => {
        sidebar.classList.toggle("collapsed");
    });
}



/* === Panels wechseln (wie Tabs) === */
const menuItems = document.querySelectorAll(".menu-item");
const panels = document.querySelectorAll(".panel");

menuItems.forEach((item) => {
    item.addEventListener("click", () => {
        // aktives Menü markieren
        menuItems.forEach((i) => i.classList.remove("active"));
        item.classList.add("active");

        // Panels umschalten
        const target = item.getAttribute("data-target");
        panels.forEach((p) => p.classList.remove("active"));
        document.getElementById(target).classList.add("active");
    });
});

// ===== Slideshow-Referenzen (falls noch nicht vorhanden) =====
// ===== Referenzen =====
const slides = document.querySelectorAll(".slide");
let current = 0;

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const rightTitle = document.getElementById("rightTitle");
const rightBody = document.getElementById("rightBody");

// ===== Funktion: nur rechter Text wechselt =====
function updateRightText(index) {
    const s = slides[index];
    if (!s) return;

    rightTitle.textContent = s.dataset.rightTitle || "Zusatzinfo";
    rightBody.textContent = s.dataset.right || "";
}

// ===== Slideshow-Funktionen =====
function showSlide(index) {
    slides.forEach(sl => sl.classList.remove("active"));
    slides[index].classList.add("active");
    updateRightText(index);   // <- nur rechte Seite aktualisieren
}

function goNext() {
    current = (current + 1) % slides.length;
    showSlide(current);
}

function goPrev() {
    current = (current - 1 + slides.length) % slides.length;
    showSlide(current);
}

// ===== Buttons =====
if (nextBtn) nextBtn.addEventListener("click", goNext);
if (prevBtn) prevBtn.addEventListener("click", goPrev);

// ===== Tastatursteuerung (optional) =====
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") goNext();
    if (e.key === "ArrowLeft") goPrev();
});

// ===== Startzustand =====
updateRightText(current);

// ----------------------------------------------------- AB HIER IST PLATZHALTER 2 DAS HERZ ----------------------------------------------

// ===== Herz-„Fäden“-Animation (Platzhalter 2) =====
(() => {
    const panel = document.getElementById("panel-platzhalter2");
    const canvas = document.getElementById("heartCanvas");
    if (!panel || !canvas) return;

    const ctx = canvas.getContext("2d");
    let rafId = null;
    let running = false;

    const W = canvas.width;
    const H = canvas.height;
    const CX = W / 2;
    const CY = H / 2;

    // Herz-Parameterkurve (klassisch)
    function hx(k) { return 16 * Math.pow(Math.sin(k), 3); }
    function hy(k) {
        return 13 * Math.cos(k) - 5 * Math.cos(2 * k) - 2 * Math.cos(3 * k) - Math.cos(4 * k);
    }

    // Einstellungen für den Look
    const scale = 20;   // Größe des Herzens
    const rays = 128;     // wie viele Fäden pro Frame
    const speed = 0.00018;  // wie schnell die Fäden wachsen / Phasenrotation
    let t = 0;      // Zeit/Phase
    let grow = 0;      // Wachstum von 0->1 (Herz „entsteht“)

    // weiches Ausfaden: halbtransparent übermalen statt hard clear
    function fadeBackground() {
        ctx.fillStyle = "rgba(83, 60, 72, 0.38)";
        // je kleiner, desto längere Spuren
    }

    function drawFrame() {
        fadeBackground();

        ctx.save();
        // (0,0) in die Mitte und y-Achse invertieren (wie bei Turtle)
        ctx.translate(CX, CY - 40);
        ctx.scale(1, -1);

        // „Strahlen“ zeichnen
        ctx.lineCap = "round";
        ctx.shadowColor = "rgba(230, 22, 84, 0.75)";
        ctx.shadowBlur = 12;

        for (let i = 0; i < rays; i++) {
            // fächerförmig gleichmäßig über die Kurve verteilt
            const k = (i / rays) * Math.PI * 2 + t;

            const x = hx(k) * scale;
            const y = hy(k) * scale;

            // Länge des Fadens (0..1). Erst wächst alles (grow), dann „atmet“ leicht
            const pulse = 0.03 * Math.sin(t * 4);
            const len = Math.max(0, Math.min(1, grow + pulse));

            ctx.beginPath();
            ctx.strokeStyle = "rgba(214, 36, 95, 0.86)";  // Rot
            ctx.lineWidth = 2;

            // vom Zentrum bis zu einem Anteil der Zielposition
            ctx.moveTo(0, 0);
            ctx.lineTo(x * len, y * len);
            ctx.stroke();
        }

        ctx.restore();

        // Zeit voranschreiten lassen
        t += speed;
        // Herz wachsen lassen bis voll (1)
        if (grow < 1) grow = Math.min(1, grow + 0.012);

        rafId = requestAnimationFrame(drawFrame);
    }

    function start() {
        if (running) return;
        running = true;
        // Reset für neuen Eintritt – Herz „entsteht“ jedes Mal neu
        ctx.clearRect(0, 0, W, H);
        t = 0;
        grow = 0;
        rafId = requestAnimationFrame(drawFrame);
    }

    function stop() {
        running = false;
        if (rafId) cancelAnimationFrame(rafId);
    }

    // Start/Stop abhängig davon, ob das Panel sichtbar (active) ist
    const obs = new MutationObserver(() => {
        if (panel.classList.contains("active")) start();
        else stop();
    });
    obs.observe(panel, { attributes: true, attributeFilter: ["class"] });

    // Falls „Platzhalter 2“ schon aktiv ist (z. B. beim Reload)
    if (panel.classList.contains("active")) start();
})();

// ===== Eingabe -> Popup =====-----------------------------------------------------------

// 1) Hier definierst du, WAS gelten soll.
//    Groß/Kleinschreibung egal (wir vergleichen in lowercase).
// ===== Eingabe -> Popup + Loader =====
const SECRET_A = "sercan";   // dein Name 1
const SECRET_B = "selinay";     // dein Name 2

const form = document.getElementById("heartForm");
const fieldA = document.getElementById("fieldA");
const fieldB = document.getElementById("fieldB");
const modal = document.getElementById("loveModal");
const closeBt = document.getElementById("closeModal");
const loader = document.getElementById("loader");

function openModal() { modal.classList.remove("hidden"); }
function closeModal() { modal.classList.add("hidden"); }
function showLoader() { loader.classList.remove("hidden"); }
function hideLoader() { loader.classList.add("hidden"); }

function matchesSecret() {
    const a = (fieldA.value || "").trim().toLowerCase();
    const b = (fieldB.value || "").trim().toLowerCase();
    return a === SECRET_A && b === SECRET_B;
}

// Eingabe überwachen
[fieldA, fieldB].forEach(inp => {
    inp.addEventListener("input", () => {
        if (matchesSecret()) startLoveSequence();
    });
});

if (form) {
    form.addEventListener("submit", e => {
        e.preventDefault();
        if (matchesSecret()) startLoveSequence();
    });
}

function startLoveSequence() {
    showLoader();

    const bar = document.getElementById("progressBar");
    const txt = document.getElementById("progressText");
    let percent = 1;
    bar.style.width = "1%";
    txt.textContent = "1%";

    // Fortschrittsanimation – ca. 5 Sekunden bis 99 %
    const duration = 5000;      // ms
    const interval = 50;        // alle 50 ms aktualisieren
    const steps = duration / interval;
    const increment = 98 / steps; // von 1 % → 99 %

    const timer = setInterval(() => {
        percent += increment;
        if (percent >= 99) {
            percent = 99;
            clearInterval(timer);
            setTimeout(() => {
                hideLoader();
                openModal();
            }, 400); // kleine Verzögerung nach 99 %
        }
        bar.style.width = percent.toFixed(0) + "%";
        txt.textContent = Math.floor(percent) + "%";
    }, interval);
}


// Modal schließen
if (closeBt) closeBt.addEventListener("click", closeModal);
modal?.addEventListener("click", e => { if (e.target === modal) closeModal(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

// ========================================================= Glücksrad ==========================================================
const wheelCanvas = document.getElementById("wheelCanvas");
const ctx = wheelCanvas.getContext("2d");
const spinBtn = document.getElementById("spinBtn");
const result = document.getElementById("wheelResult");

// 12 Felder – kannst du beliebig umbenennen
let sectors = [
    "Sercan kriegt Kuss 😘",
    "Umarmunggggg 🤗",
    "Massage for you 💆",
    "Filmabend 🎬",
    "Selis kriegt Kuss 😘",
    "Kriegst ein Matcha 🥤",
    "Du wirst gekitzelt 😂",
    "Date dieses Wochenende 👩‍❤️‍👨",
    "EIN ALTIN 🥇",
    "Du schuldest mir was 😉",
    "Ich singe für dich 🎤",
    "Dummes Foto für Sticker 🤳"
];

const numSectors = sectors.length;
const arc = (2 * Math.PI) / numSectors;
let currentAngle = 0;
let spinning = false;

// Farben abwechselnd
function randomColor(i) {
    return i % 2 === 0 ? "#ff1e6a" : "#ff4d8f";
}

function drawWheel() {
    const w = wheelCanvas.width;
    const h = wheelCanvas.height;
    const cx = w / 2 - 40; // Rad leicht nach links verschieben!
    const cy = h / 2;
    const r = Math.min(cx, cy) - 20; // kleiner Radius für Abstand

    ctx.clearRect(0, 0, w, h);


    // Segmente zeichnen
    for (let i = 0; i < numSectors; i++) {
        const angle = currentAngle + i * arc;
        ctx.beginPath();
        ctx.fillStyle = i % 2 === 0 ? "#ff1e6a" : "#ff4d8f";
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, r, angle, angle + arc);
        ctx.fill();

        // Text
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(angle + arc / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "#fff";
        ctx.font = "18px sans-serif";
        ctx.fillText(sectors[i], r - 20, 6);
        ctx.restore();
    }

    // Mittelpunktpunkt
    ctx.beginPath();
    ctx.arc(cx, cy, 8, 0, 2 * Math.PI);
    ctx.fillStyle = "#fff";
    ctx.fill();

    // ==== Pfeil außerhalb rechts mittig ====
    const arrowDist = r + 45; // Abstand des Pfeils vom Rad
    const arrowWidth = 28;
    const arrowHeight = 40;

    ctx.beginPath();
    ctx.moveTo(cx + arrowDist - arrowHeight, cy);                  // Spitze links
    ctx.lineTo(cx + arrowDist, cy - arrowWidth / 2);
    ctx.lineTo(cx + arrowDist, cy + arrowWidth / 2);
    ctx.closePath();
    ctx.fillStyle = "#10a329";
    ctx.shadowColor = "#10a329";
    ctx.shadowBlur = 12;
    ctx.fill();
    ctx.shadowBlur = 0;

}



drawWheel();

function spinWheel() {
    if (spinning) return;
    spinning = true;
    result.textContent = "Dreht...";

    // Zufällige Endrotation
    const extraSpins = 3 + Math.random() * 3; // 3–6 Runden
    const targetAngle = currentAngle + extraSpins * 2 * Math.PI + Math.random() * 2 * Math.PI;

    const duration = 4000; // 4 Sekunden
    const start = performance.now();

    function animate(time) {
        const elapsed = time - start;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3); // smooth
        currentAngle = targetAngle * ease;
        drawWheel();

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            spinning = false;
            // Ergebnis berechnen
            const deg = ((currentAngle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
            const index = Math.floor(numSectors - (deg / arc)) % numSectors;
            result.textContent = "→ " + sectors[index];
        }
    }

    requestAnimationFrame(animate);
}

spinBtn.addEventListener("click", spinWheel);

