const nikkahTime = new Date("2026-07-05T11:30:00+05:30").getTime();
const calendarButton = document.getElementById("calendarButton");
const nameForm = document.getElementById("nameForm");
const guestNameInput = document.getElementById("guestName");
const welcomeScreen = document.getElementById("welcomeScreen");
const letterScreen = document.getElementById("letterScreen");
const mainWebsite = document.getElementById("mainWebsite");
const letterTitle = document.getElementById("letterTitle");
const letterText = document.getElementById("letterText");
const letterEnd = document.getElementById("letterEnd");
const enterButton = document.getElementById("enterButton");
const flowerContainer = document.querySelector(".flower-container");
const musicToggle = document.getElementById("musicToggle");
const bgMusic = document.getElementById("bgMusic");

let flowerInterval;
let typingTimer;
let revealObserver;
let isMusicPlaying = false;

function twoDigits(value) {
  return String(value).padStart(2, "0");
}

function updateCountdown() {
  const distance = nikkahTime - Date.now();
  const countdown = document.getElementById("countdown");

  if (distance <= 0) {
    countdown.textContent = "The blessed Nikkah day has arrived.";
    return;
  }

  const days = Math.floor(distance / 86400000);
  const hours = Math.floor((distance % 86400000) / 3600000);
  const minutes = Math.floor((distance % 3600000) / 60000);
  const seconds = Math.floor((distance % 60000) / 1000);

  document.getElementById("days").textContent = twoDigits(days);
  document.getElementById("hours").textContent = twoDigits(hours);
  document.getElementById("minutes").textContent = twoDigits(minutes);
  document.getElementById("seconds").textContent = twoDigits(seconds);
}

function typeText(element, text, speed, done) {
  let index = 0;
  element.textContent = "";

  function step() {
    element.textContent += text.charAt(index);
    index += 1;

    if (index < text.length) {
      typingTimer = window.setTimeout(step, speed);
      return;
    }

    done?.();
  }

  step();
}

function showLetter(name) {
  window.clearTimeout(typingTimer);
  welcomeScreen.hidden = true;
  letterScreen.hidden = false;
  document.body.classList.add("locked");
  startBackgroundMusic();

  letterTitle.textContent = `Dear ${name},`;
  letterText.textContent = "";
  letterEnd.textContent = "";

  const message = "With the blessing of Almighty, we warmly invite you and your family to the Nikkah ceremony of Mohammed Harish and Regina Begam. Your presence and prayers will make this blessed occasion complete.";

  typeText(letterText, message, 34, () => {
    typeText(letterEnd, "With love, Harish, Regina & Family", 72);
  });
}

function enterWebsite() {
  letterScreen.hidden = true;
  mainWebsite.hidden = false;
  document.body.classList.remove("locked");
  startFlowers();
  startSectionAnimations();
  updateCountdown();
  window.scrollTo({ top: 0, behavior: "instant" });
}

function prepareRevealElement(element, delay = 0) {
  element.classList.add("reveal");
  element.style.setProperty("--reveal-delay", `${delay}ms`);
}

function startSectionAnimations() {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealTargets = [
    ...document.querySelectorAll(".hero .arabic, .hero .eyebrow, .hero h1, .hero-copy, .hero-facts, .hero-actions"),
    ...document.querySelectorAll(".countdown-copy, .countdown div"),
    ...document.querySelectorAll(".details-section .section-heading, .detail-card"),
    ...document.querySelectorAll(".schedule-section .section-heading, .timeline article"),
    ...document.querySelectorAll(".tamil-copy"),
    ...document.querySelectorAll(".family-section .section-heading, .family-grid article"),
    ...document.querySelectorAll(".site-footer")
  ];

  revealTargets.forEach((element, index) => {
    if (!element.classList.contains("reveal")) {
      prepareRevealElement(element, Math.min(index % 6, 5) * 90);
    }
  });

  if (prefersReducedMotion) {
    revealTargets.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  revealObserver?.disconnect();
  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  }, {
    threshold: 0.16,
    rootMargin: "0px 0px -8% 0px"
  });

  revealTargets.forEach((element) => revealObserver.observe(element));

  window.requestAnimationFrame(() => {
    revealTargets.forEach((element) => {
      const rect = element.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        element.classList.add("is-visible");
        revealObserver.unobserve(element);
      }
    });
  });
}

function startFlowers() {
  if (!flowerContainer || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  window.clearInterval(flowerInterval);

  flowerInterval = window.setInterval(() => {
    const flower = document.createElement("span");
    flower.className = "flower";
    flower.textContent = "✿";
    flower.style.left = `${Math.random() * 100}vw`;
    flower.style.animationDuration = `${5 + Math.random() * 5}s`;
    flower.style.color = Math.random() > 0.5 ? "#f7d993" : "#f3a8c6";
    flowerContainer.appendChild(flower);

    window.setTimeout(() => flower.remove(), 10000);
  }, 450);
}

function startBackgroundMusic() {
  if (!bgMusic || isMusicPlaying) {
    return;
  }

  bgMusic.volume = 0.42;
  const playPromise = bgMusic.play();

  if (playPromise?.then) {
    playPromise
      .then(() => {
        isMusicPlaying = true;
        updateMusicToggle();
      })
      .catch(() => {
        isMusicPlaying = false;
        updateMusicToggle();
      });
    return;
  }

  isMusicPlaying = true;
  updateMusicToggle();
}

function stopBackgroundMusic() {
  if (!bgMusic) {
    return;
  }

  bgMusic.pause();
  isMusicPlaying = false;
  updateMusicToggle();
}

function updateMusicToggle() {
  if (!musicToggle) {
    return;
  }

  musicToggle.textContent = isMusicPlaying ? "Music On" : "Music Off";
  musicToggle.setAttribute("aria-pressed", String(isMusicPlaying));
  musicToggle.setAttribute("aria-label", isMusicPlaying ? "Pause background music" : "Play background music");
}

function downloadCalendarInvite() {
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Harish Regina Nikkah//Invitation//EN",
    "BEGIN:VEVENT",
    "UID:harish-regina-nikkah-20260705@example.local",
    "DTSTAMP:20260502T000000Z",
    "DTSTART:20260705T060000Z",
    "DTEND:20260705T073000Z",
    "SUMMARY:Nikkah - Mohammed Harish and Regina Begam",
    "LOCATION:Arraheemiya Nikkah Mahal, Therizhandur",
    "DESCRIPTION:Nikkah ceremony at 11:30 AM IST, followed by lunch reception at 12:30 PM.",
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.download = "harish-regina-nikkah.ics";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

nameForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = guestNameInput.value.trim();

  if (!name) {
    guestNameInput.focus();
    return;
  }

  showLetter(name);
});

enterButton?.addEventListener("click", enterWebsite);
calendarButton?.addEventListener("click", downloadCalendarInvite);
musicToggle?.addEventListener("click", () => {
  if (isMusicPlaying) {
    stopBackgroundMusic();
    return;
  }

  startBackgroundMusic();
});
updateCountdown();
updateMusicToggle();
setInterval(updateCountdown, 1000);
