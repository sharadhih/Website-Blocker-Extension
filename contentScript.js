const restricted_sites = new Set();

chrome.storage.sync.get("blockedWebsitesArray", function (data) {
  const blockedWebsitesArray = data.blockedWebsitesArray || [];
  if (blockedWebsitesArray && blockedWebsitesArray.length > 0) {
    blockedWebsitesArray.forEach((item) => {
      restricted_sites.add(item.toLowerCase());
      restricted_sites.add(normalizeURL(item.toLowerCase()));
    });

    // Call the function to check if the website should be blocked
    check_if_restricted();
  }
});

function normalizeURL(url) {
  return url.replace(/^www\./i, "");
}

function shouldBlockWebsite() {
  const currentHostname = normalizeURL(window.location.hostname);
  return restricted_sites.has(currentHostname);
}

const quotes = [
  "Your future is created by what you do today, not tomorrow.",
  "Success is not about working harder, but working smarter.",
  "Stay focused. The distractions you avoid today will reward you tomorrow.",
  "Don't let short-term comfort steal long-term success.",
  "Discipline is choosing between what you want now and what you want most.",
  "Small consistent efforts lead to big results over time.",
  "Manage your time, or distractions will manage you.",
  "Work now, scroll later. Your goals deserve your full attention.",
  "Time is your most valuable asset—spend it wisely.",
  "The secret to success is staying consistent, even when you don’t feel like it.",
  "Great things happen when you step away from distractions and take action.",
  "Productivity is never an accident; it's the result of commitment and planning.",
  "Dreams don’t work unless you do. Stay focused!",
  "Every minute you spend distracted is a minute you lose on your goals.",
  "A goal without a plan is just a wish—start acting on it now!",
  "Social media can wait. Your future can't.",
  "Work hard in silence, let your success make the noise.",
  "Time lost is never found again. Use it wisely!",
  "You don’t need more time—you need better priorities.",
  "Eliminate distractions. Focus on what truly matters."
];

function getRandomQuote() {
  return quotes[Math.floor(Math.random() * quotes.length)];
}

function createBlockedPage() {
  const blockedPage = generateHTML(getRandomQuote());
  const style = generateSTYLING();
  
  // Inject styles
  const head = document.head || document.getElementsByTagName("head")[0];
  head.insertAdjacentHTML("beforeend", style);
  
  document.body.innerHTML = blockedPage;

  document.getElementById("new-quote-btn").addEventListener("click", function () {
    let newQuote;
    do {
      newQuote = getRandomQuote();
    } while (newQuote === document.getElementById("quote").innerText); // Ensure a different quote
    document.getElementById("quote").innerText = newQuote;
  });
}

function check_if_restricted() {
  if (shouldBlockWebsite()) {
    createBlockedPage();
  }
}

function generateSTYLING() {
  return `
    <style>
      body {
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: center !important;
        height: 100vh !important;
        margin: 0 !important;
        background-color: #27445D !important;
        font-family: 'Noto Serif', serif !important;
        text-align: center !important;
        color: white !important;
      }
      h1 {
        font-size: 3em !important;
        margin-bottom: 20px !important;
      }
      #quote {
        font-size: 1.8em !important;
        max-width: 80% !important;
        line-height: 1.5 !important;
        background: rgba(255, 255, 255, 0.1) !important;
        padding: 15px 20px !important;
        border-radius: 10px !important;
      }
      #new-quote-btn {
        margin-top: 15px;
        padding: 10px 15px;
        font-size: 1em;
        border: none;
        border-radius: 5px;
        background: #f39c12;
        color: white;
        cursor: pointer;
      }
      #new-quote-btn:hover {
        background: #e67e22;
      }
    </style>
  `;
}

const generateHTML = (quote) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Site Blocked</title>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Serif&display=swap" rel="stylesheet">
    </head>
    <body>
      <h1>Site Blocked</h1>
      <div id="quote">${quote}</div>
      <button id="new-quote-btn">New Quote</button>
    </body>
    </html>
  `;
};
