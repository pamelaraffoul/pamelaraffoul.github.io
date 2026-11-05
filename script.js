/* ==========================================================================
   Pamela Raffoul – Portfolio
   Behaviour: mobile menu, scroll animations, back-to-top button
   and the Pixel chatbot.
   ========================================================================== */

"use strict";

// Lets the CSS know JavaScript is running, so content stays visible without it.
document.documentElement.classList.add("js");

/* --------------------------------------------------------------------------
   Chatbot content
   Edit the questions and answers here. Each key is a button label shown to
   visitors, each value is Pixel's reply.
   -------------------------------------------------------------------------- */
const CHATBOT_GREETING = "Hi there! 👋 I'm Pixel, Pamela's little assistant. What would you like to know?";

const CHATBOT_ANSWERS = {
  "👩‍💻 Who is Pamela?":
    "Pamela Raffoul is a computer scientist (BSc, Lebanese University) and Techno-Functional Salesforce " +
    "Consultant at EI-Technologies MENA, with nearly 3 years of experience in development, integrations " +
    "and business analysis. She is a Salesforce Certified Administrator and speaks Arabic, English and French.",

  "🛠️ Her skills":
    "Apex, Java, C, JavaScript, HTML5, CSS3, SQL and SOQL; Lightning Web Components; Salesforce Sales, " +
    "Service and Experience Cloud; REST APIs, Data Loader, VS Code and Jira; plus Power Apps, " +
    "Power Automate and SharePoint.",

  "📁 Her experience":
    "She joined EI-Technologies MENA in Jan 2024 as a Junior Salesforce Consultant, building LWCs, Apex and " +
    "integrations, and was promoted to Confirmed Consultant in Jan 2026, working on techno-functional " +
    "consulting and integration business analysis. Scroll to the Experience section for details!",

  "🎯 Open to work?":
    "Yes! Pamela is open to roles in software development, data engineering, business analysis and " +
    "CRM/IT consulting. She is based in Dbayeh, Lebanon.",

  "📬 Contact her":
    "You can email her at pamelaraffoul1@gmail.com or connect on LinkedIn. " +
    "The buttons are in the Contact section below 👇",
};

const CHATBOT_REPLY_DELAY_MS = 450;
const CHATBOT_HINT_DURATION_MS = 8000;
const BACK_TO_TOP_THRESHOLD_PX = 500;


/* --------------------------------------------------------------------------
   Setup
   -------------------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  setCurrentYear();
  initMobileMenu();
  initRevealOnScroll();
  initBackToTop();
  initChatbot();
});


/** Keeps the footer year up to date. */
function setCurrentYear() {
  const yearElement = document.getElementById("current-year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}


/** Opens and closes the navigation menu on small screens. */
function initMobileMenu() {
  const toggle = document.querySelector(".nav__toggle");
  const links = document.getElementById("nav-links");
  if (!toggle || !links) return;

  const setOpen = (isOpen) => {
    links.classList.toggle("is-open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  };

  toggle.addEventListener("click", () => {
    setOpen(!links.classList.contains("is-open"));
  });

  // Close the menu after choosing a section
  links.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setOpen(false));
  });
}


/** Fades sections in the first time they scroll into view. */
function initRevealOnScroll() {
  const sections = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    sections.forEach((section) => section.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  sections.forEach((section) => observer.observe(section));
}


/** Shows a button to scroll back to the top once the visitor scrolls down. */
function initBackToTop() {
  const button = document.querySelector(".back-to-top");
  if (!button) return;

  const updateVisibility = () => {
    button.classList.toggle("is-visible", window.scrollY > BACK_TO_TOP_THRESHOLD_PX);
  };

  window.addEventListener("scroll", updateVisibility, { passive: true });
  updateVisibility();

  button.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}


/** Pixel: a scripted chatbot with ready-made questions. */
function initChatbot() {
  const launcher = document.querySelector(".chatbot__launcher");
  const panel = document.getElementById("chatbot-panel");
  const closeButton = document.querySelector(".chatbot__close");
  const hint = document.querySelector(".chatbot__hint");
  const messages = document.querySelector(".chatbot__messages");
  const questions = document.querySelector(".chatbot__questions");
  const headerAvatar = document.querySelector(".chatbot__avatar");
  const robot = document.querySelector(".chatbot__robot");
  if (!launcher || !panel || !messages || !questions) return;

  let hasGreeted = false;

  // Reuse the launcher's robot drawing in the chat header
  if (headerAvatar && robot) {
    headerAvatar.appendChild(robot.cloneNode(true));
  }

  const hideHint = () => {
    if (hint) hint.hidden = true;
  };

  const addMessage = (text, sender) => {
    const message = document.createElement("p");
    message.className = `chatbot__message chatbot__message--${sender}`;
    message.textContent = text;
    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight;
  };

  const setOpen = (isOpen) => {
    panel.hidden = !isOpen;
    launcher.setAttribute("aria-expanded", String(isOpen));
    hideHint();

    if (isOpen && !hasGreeted) {
      hasGreeted = true;
      addMessage(CHATBOT_GREETING, "bot");
    }
  };

  // One button per question
  Object.entries(CHATBOT_ANSWERS).forEach(([question, answer]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "chatbot__question";
    button.textContent = question;
    button.addEventListener("click", () => {
      addMessage(question, "user");
      setTimeout(() => addMessage(answer, "bot"), CHATBOT_REPLY_DELAY_MS);
    });
    questions.appendChild(button);
  });

  launcher.addEventListener("click", () => setOpen(panel.hidden));
  closeButton?.addEventListener("click", () => setOpen(false));

  // Close with the Escape key
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !panel.hidden) {
      setOpen(false);
      launcher.focus();
    }
  });

  setTimeout(hideHint, CHATBOT_HINT_DURATION_MS);
}
