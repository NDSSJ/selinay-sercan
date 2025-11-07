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

// ===================== "Wer hat das gesagt?" =====================
(() => {
    const textEl = document.getElementById("quizText");
    const resultEl = document.getElementById("quizResult");
    const yearInput = document.getElementById("guessYear");
    const checkBtn = document.getElementById("checkQuote");
    const nextBtn = document.getElementById("nextQuote");

    if (!textEl) return;

    // HIER deine Karten – jetzt MIT note 👇
    const quotes = [
        {
            text: "Rate mal wer etwas zu spät kommt",
            author: "selinay",
            year: "2019",
            note: "Das hast zwar du geschrieben, aber meine Antwort war: Du kannst direkt auch raten haha"
        },
        {
            text: "Die Aufgaben die ich kann wirst du schon abschreiben können",
            author: "selinay",
            year: "2019",
            note: "Ich hatte Angst in Chemie nicht abschreiben zu können"
        },
        {
            text: "Guten Morgen willst du vorbei kommen?",
            author: "selinay",
            year: "2019",
            note: "Ich wünschte es wäre in einem anderen Kontext, aber du hast mich nur zum lernen gerufen"
        },
        {
            text: "Hast du irgendwas wichtiges aufgeschrieben",
            author: "sercan",
            year: "2019",
            note: "Hab dich wieder mal nach Schulstoff gefragt weil ich nicht da war"
        },
        {
            text: "Schön positiv denken",
            author: "selinay",
            year: "2020",
            note: "Eine Selinay die versucht mich aufzumuntern nach einer schlechten Chemie Klausur"
        },
        {
            text: "Ich bewerbe mich auch für Jura undso einfach hahaha",
            author: "sercan",
            year: "2020",
            note: "Bewerbungen für Uni Studiengang (Hab mich niemals für Jura beworben leider)"
        },
        {
            text: "Egal ich schenke dir einfach wieder ein Ring aus einem Radiergummi und einer Büroklammer",
            author: "sercan",
            year: "2020",
            note: "Du hast mir zu spät gesagt dass es sich bei dem Treffen in deinem Garten um deinen Geburtstag handelt. Meine Spontane Idee war dann das"
        },
        {
            text: "Das ist echt Dorf türkisch was die sprechen",
            author: "selinay",
            year: "2019",
            note: "DAS HAST DU ZU DEINER EIGENEN MAMA GESAGT!!!! DU HAST ANGEFANGEN"
        },
        {
            text: "Jetzt haben wir genuuuuug Bilder",
            author: "selinay",
            year: "2020",
            note: "JAAA DU HAST ES SELBER GESAGT! Das war nachdem wir zusammen Bilder in deinem Garten gemacht haben"
        },
        {
            text: "2 Tonnen Makeup klärt schon",
            author: "selinay",
            year: "2020",
            note: "Wir hatten damals den Plan dich mit Cagatay Ulusoy zu verkuppeln. Jetzt ist dein Freund sogar noch geiler"
        },
        {
            text: "Ok reicht von mir aus genug genervt du tust mir auch leid grad",
            author: "selinay",
            year: "2020",
            note: "Da waren wir noch nicht zusammen, jetzt hör ich sowas niemals HAHAHAHHA"
        },
        {
            text: "Wenn du morgen nicht kommst, bin ich auch nicht dabei",
            author: "sercan",
            year: "2020",
            note: "Anca Beraber kanca beraber. Ich bin nirgendwo wo meine süße Maus nicht auch ist!"
        },
        {
            text: "Ich hasse niemanden, hass ist ein starker Begriff",
            author: "sercan",
            year: "2020",
            note: "Will den Kontext nicht geben, aber ich bin NICHT Goethe. Ich hasse z.B. Ju..."
        },
        {
            text: "Merk dir eins, wenn ich dich jemals anlügen sollte, allah belami versin",
            author: "sercan",
            year: "2020",
            note: "Du hast gefragt ob Berkant Gefühle für Kaley hat und ich meinte nein HAHAHAHHA, daraufhin hast du mir erstmal nicht geglaubt"
        },
        {
            text: "Ich weiß wann du Geburtstag hast, soll ich aus Favoriten raus tun als Beweis?",
            author: "sercan",
            year: "2020",
            note: "Ich hab safe nur gehofft dass du nein sagst, konnte mir niemals deinen Geburtstag merken HAHAHAHA"
        },
        {
            text: "Wichtige Sachen haben einen extra Platz in meinem Hirn",
            author: "sercan",
            year: "2020",
            note: "Habe mich an deinen Geburtstag erinnert + daran, dass ich dir den Radiergummi Ring schenken wollte (Hab es aber am Ende nicht getan HAHAHAH)"
        },
        {
            text: "Du hast mich echt zum Lachen gebracht",
            author: "sercan",
            year: "2020",
            note: "Kann sein erstes Mal dass ich wegen dir gelacht habe HAHAHAHHA, wir waren Supernatural am gucken und du hast nen Witz gebracht"
        },
        {
            text: "Ich will dich noch behalten",
            author: "selinay",
            year: "2020",
            note: "Du hast mich behalten... Du hast was süßes gesagt, ich meinte mein Herz schmilzt. Daraufhin hast du gesagt dass du mich noch behalten willst"
        },
        {
            text: "NEINNNN Was mache ich ohne dich",
            author: "selinay",
            year: "2020",
            note: "Du warst schon flirty. Das war so mitte Oktober, da stand jemand schon bisschen auf mich, du hast das öfter gesagt zu der Zeit"
        },
        {
            text: "Ey ohne witz mach nicht so... ich will dich nicht verlieren...",
            author: "sercan",
            year: "2020",
            note: "Hatten gestritten wegen etwas kleinem, wir waren zu süß damals"
        },
        {
            text: "Ich kann es nicht glauben dass ich es dir gerade geschickt habe",
            author: "selinay",
            year: "2020",
            note: "Du hast mir Editierte Fotos geschickt wie du mit kurzen Haaren aussehen würdest, du meintest das ist komisch das einem Jungen zu schicken. Ich war so verliebt, die Fotos waren wow"
        },
        {
            text: "Wir werden alt",
            author: "sercan",
            year: "2021",
            note: "schon vor 4 Jahren gesagt weil wir morgens noch müde waren nach dem aufstehen HAHAHAHHA guck uns heute mal an 24/7 müde"
        },
        {
            text: "Ich will Lasagne",
            author: "selinay",
            year: "2021",
            note: "Was für Kontext, du hast das einfach so um 0Uhr rausgehauen HAHAHAHAHHA"
        },
        {
            text: "Sana ceza vermek istiyorum",
            author: "selinay",
            year: "2022",
            note: "Mommy? HAHAHAHHA Ich war lange draußen und hab nicht geantwortet dann warst du unnormal sauer, hat was wenn ich das gerade so wieder lese oh"
        },
        {
            text: "Dann gucken wir Saw 1",
            author: "selinay",
            year: "2022",
            note: " JA DAS HAST DU GESAGT!!!! Mit 20 warst du weniger schisser als jetzt!"
        },
        {
            text: "Ich würde kein Tattoo machen wenn wir nur ein Paar sind",
            author: "sercan",
            year: "2021",
            note: "Ja guuuut, die Meinung hat sich geändert HAHAHAH"
        },
        {
            text: "Komm Discord",
            author: "sercan",
            year: "2019",
            note: "Ganz frühe Gaming-Zeit 😎"
        },
        {
            text: "Komm Discord",
            author: "sercan",
            year: "2019",
            note: "Ganz frühe Gaming-Zeit 😎"
        },
    ];

    let order = quotes.map((_, i) => i).sort(() => Math.random() - 0.5);
    let pos = 0;

    function loadCurrent() {
        const card = quotes[order[pos]];
        textEl.textContent = card.text;
        resultEl.innerHTML = ""; // wichtig: leeren
        yearInput.value = "";
        document
            .querySelectorAll("input[name='guessPerson']")
            .forEach(r => (r.checked = false));
    }

    loadCurrent();

    checkBtn.addEventListener("click", () => {
        const card = quotes[order[pos]];
        const chosenRadio = document.querySelector("input[name='guessPerson']:checked");
        const guessedYear = (yearInput.value || "").trim();

        if (!chosenRadio || !guessedYear) {
            resultEl.textContent = "Erst Person UND Jahr wählen 🥺";
            resultEl.style.color = "#ffb4c7";
            return;
        }

        const okPerson = chosenRadio.value === card.author;
        const okYear = guessedYear === card.year;

        let message = "";
        if (okPerson && okYear) {
            message = "Richtiiiig 🥳";
            resultEl.style.color = "#10a329";
        } else if (okPerson && !okYear) {
            message = `Person stimmt ✅, Jahr war ${card.year}.`;
            resultEl.style.color = "#fbbf24";
        } else if (!okPerson && okYear) {
            message = `Jahr stimmt ✅, aber das war ${card.author === "selinay" ? "Selinay" : "Sercan"}.`;
            resultEl.style.color = "#fbbf24";
        } else {
            message = `Beides falsch 😅 → richtig: ${card.author === "selinay" ? "Selinay" : "Sercan"} (${card.year})`;
            resultEl.style.color = "#ffb4c7";
        }

        // hier packen wir den Kontext drunter
        resultEl.innerHTML = `
      <div>${message}</div>
      <div style="margin-top:.4rem; color:#ddd; font-size:.85rem;">
        Kontext: ${card.note}
      </div>
    `;
    });

    nextBtn.addEventListener("click", () => {
        pos++;
        if (pos >= order.length) {
            order = quotes.map((_, i) => i).sort(() => Math.random() - 0.5);
            pos = 0;
        }
        loadCurrent();
    });
})();
