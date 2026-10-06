/**
 * BANGLADESH LEGAL AI - CORE CONTROLLER
 * Features:
 * - Subtle Bangladesh Flag Bangla Character Matrix Background
 * - Centered Scales of Justice Emblem
 * - Full English & Bengali Bilingual Language System
 * - High-performance RAG Q&A with statute citations
 * - Realtime Act Directory search & citation viewer
 * - API Key & LLM model management
 */

const I18N = {
  bn: {
    brandName: "বাংলাদেশ আইন",
    actsBtn: "আইন সূচি",
    settingsBtn: "সেটিংস",
    themeBtn: "থিম পরিবর্তন",
    heroTitle: "বাংলাদেশ আইন অনুসন্ধান ও অধিকার বিশ্লেষণ",
    heroSubtitle: "বাংলাদেশের সংবিধান, দণ্ডবিধি, শ্রম আইন, দেওয়ানি ও ফৌজদারি বিধান এবং সুনির্দিষ্ট প্রতিকার সম্পর্কে প্রশ্ন করুন",
    placeholder: "একটি আইনগত ধারা বা অধিকার সংক্রান্ত প্রশ্ন লিখুন...",
    sendTitle: "অনুসন্ধান ও বিশ্লেষণ",
    settingsTitle: "⚙️ সেটিংস",
    apiKeyLabel: "হাগিং ফেস এক্সেস টোকেন (hf_token)",
    apiKeyHint: "আপনার ব্রাউজারে সুরক্ষিত থাকবে। ফাঁকা রাখলে .env এর hf_token ব্যবহৃত হবে।",
    modelLabel: "Hugging Face মডেল",
    topKLabel: "আইনি ধারা উদ্ধৃতি সংখ্যা (Top-K)",
    topKHint: "প্রতিটি জবাবে সর্বোচ্চ কয়টি আইনি ধারা বিশ্লেষণ করা হবে (১ থেকে ২০)।",
    saveSettings: "সেটিংস সংরক্ষণ",
    actsTitle: "📜 বাংলাদেশ আইন সূচী",
    actsSearchPlaceholder: "শিরোনাম বা বর্ষ দিয়ে আইন অনুসন্ধান করুন...",
    citationTitle: "📜 সংবিধিবদ্ধ আইনি বিধান",
    loadingText: "প্রাসঙ্গিক আইন ও অধিকার বিশ্লেষণ করা হচ্ছে...",
    assistantIdentity: "⚖️ বাংলাদেশ আইন AI",
    citationsLabel: "উদ্ধৃত সংবিধিবদ্ধ আইন",
    copyBtn: "📋 অনুলিপি",
    copiedText: "✓ সম্পন্ন",
    secBadge: "ধারা",
    yearLabel: "বর্ষ:",
    actNoLabel: "নং:",
    relevanceLabel: "প্রাসঙ্গিকতা মিল:",
    footnotesLabel: "আইনি ফুটনোট ও সংশোধন নির্দেশিকা:",
    noActsFound: "কোনো আইন খুঁজে পাওয়া যায়নি।",
    actsLoadError: "আইন সূচি লোড করতে ত্রুটি।",
    presets: [
      {
        text: "সংবিধান ও মৌলিক অধিকার",
        prompt: "বাংলাদেশের সংবিধানে নাগরিকদের কি কি মৌলিক অধিকার নিশ্চিত করা হয়েছে এবং এদের প্রতিকার কি?"
      },
      {
        text: "দণ্ডবিধি ও অপরাধ",
        prompt: "বাংলাদেশ দণ্ডবিধির আওতায় অপরাধের সংজ্ঞা, অনধিকার প্রবেশ ও শাস্তির মূল বিধানসমূহ কি কি?"
      },
      {
        text: "শ্রম আইন ও কর্মঘণ্টা",
        prompt: "বাংলাদেশ শ্রম আইন অনুযায়ী দৈনিক কর্মঘণ্টা, ওভারটাইম এবং ছুটির নিয়মাবলি বুঝিয়ে বলুন।"
      },
      {
        text: "জমি হস্তান্তর ও রেজিস্ট্রেশন",
        prompt: "বাংলাদেশে জমি ক্রয়-বিক্রয়, হস্তান্তর ও রেজিস্ট্রেশন করার ক্ষেত্রে বাধ্যতামূলক আইনি শর্তাবলি কি কি?"
      },
      {
        text: "পারিবারিক সহিংসতা প্রতিরোধ",
        prompt: "পারিবারিক সহিংসতা (প্রতিরোধ ও সুরক্ষা) আইনের আওতায় ক্ষতিগ্রস্ত ব্যক্তি কি কি আইনি সুরক্ষা পেতে পারে?"
      }
    ]
  },
  en: {
    brandName: "Bangladesh Law",
    actsBtn: "Acts Directory",
    settingsBtn: "Settings",
    themeBtn: "Toggle Theme",
    heroTitle: "Bangladesh Legal & Rights Intelligence",
    heroSubtitle: "Search and analyze constitutional provisions, penal code, labor law, property laws and statutory remedies",
    placeholder: "Ask a legal question (e.g. fundamental rights, labor laws, criminal trespass)...",
    sendTitle: "Search & Analyze",
    settingsTitle: "⚙️ Settings",
    apiKeyLabel: "Hugging Face Access Token (hf_token)",
    apiKeyHint: "Stored securely in your browser. Leave empty to use server hf_token from .env.",
    modelLabel: "Hugging Face Model",
    topKLabel: "Citations Retrieval Count (Top-K)",
    topKHint: "Maximum statutory clauses analyzed per response (1 to 20).",
    saveSettings: "Save Settings",
    actsTitle: "📜 Bangladesh Acts Directory",
    actsSearchPlaceholder: "Search acts by title or year...",
    citationTitle: "📜 Statutory Legal Clause",
    loadingText: "Analyzing statutory acts and legal rights...",
    assistantIdentity: "⚖️ Bangladesh Law AI",
    citationsLabel: "Referenced Statutory Acts",
    copyBtn: "📋 Copy",
    copiedText: "✓ Copied",
    secBadge: "Sections",
    yearLabel: "Year:",
    actNoLabel: "No:",
    relevanceLabel: "Relevance Match:",
    footnotesLabel: "Statutory Footnotes & Amendments:",
    noActsFound: "No statutory acts found.",
    actsLoadError: "Failed loading acts directory.",
    presets: [
      {
        text: "Constitution & Fundamental Rights",
        prompt: "What fundamental rights are guaranteed to citizens under the Constitution of Bangladesh, and what are the constitutional remedies?"
      },
      {
        text: "Penal Code & Criminal Offences",
        prompt: "Explain criminal trespass provisions, self-defense rights, and punishment standards under the Penal Code of Bangladesh."
      },
      {
        text: "Labor Act & Working Hours",
        prompt: "What are the statutory working hours, overtime compensation rules, and leave entitlements under the Bangladesh Labor Act?"
      },
      {
        text: "Land Transfer & Registration",
        prompt: "What are the mandatory legal requirements, documentation, and procedures for land transfer and registration in Bangladesh?"
      },
      {
        text: "Domestic Violence Remedies",
        prompt: "What legal protection and relief orders exist under the Domestic Violence (Prevention and Protection) Act of Bangladesh?"
      }
    ]
  }
};

class BangladeshLegalAI {
  constructor() {
    this.apiKey = localStorage.getItem("legal_hf_token") || localStorage.getItem("legal_groq_api_key") || "";
    let storedModel = localStorage.getItem("legal_model_name");
    if (!storedModel || storedModel.includes("openai") || storedModel.includes("groq") || storedModel.includes("qwen") || storedModel.includes("gpt")) {
      storedModel = "arnab9961/bangladesh-law-smollm2";
    }
    this.modelName = storedModel;
    
    let storedTheme = localStorage.getItem("legal_theme");
    if (!storedTheme || !["dark", "light", "carbon"].includes(storedTheme)) {
      storedTheme = "dark";
    }
    this.currentTheme = storedTheme;

    let storedLang = localStorage.getItem("legal_language");
    if (!storedLang || !["bn", "en"].includes(storedLang)) {
      storedLang = "bn";
    }
    this.currentLang = storedLang;

    this.topK = parseInt(localStorage.getItem("legal_top_k") || "5", 10);
    this.actsCache = [];
    this.searchDebounceTimer = null;

    this.initElements();
    this.initCanvasBackground();
    this.bindEvents();
    this.applyTheme(this.currentTheme);
    this.applyLanguage(this.currentLang);
    this.loadModels();
    this.applySettingsUI();
  }

  initElements() {
    // Header & Language
    this.brandName = document.getElementById("brandName");
    this.brandResetBtn = document.getElementById("brandResetBtn");
    this.langSwitcher = document.getElementById("langSwitcher");
    this.actsBtnText = document.getElementById("actsBtnText");
    this.settingsBtnText = document.getElementById("settingsBtnText");
    this.openThemeBtn = document.getElementById("openThemeBtn");

    // Chat & Input
    this.chatMessages = document.getElementById("chatMessages");
    this.heroState = document.getElementById("heroState");
    this.heroTitle = document.getElementById("heroTitle");
    this.heroSubtitle = document.getElementById("heroSubtitle");
    this.chatInput = document.getElementById("chatInput");
    this.sendBtn = document.getElementById("sendBtn");
    this.presetsTray = document.getElementById("presetsTray");

    // Modals
    this.openSettingsBtn = document.getElementById("openSettingsBtn");
    this.settingsModal = document.getElementById("settingsModal");
    this.closeSettingsBtn = document.getElementById("closeSettingsBtn");
    this.saveSettingsBtn = document.getElementById("saveSettingsBtn");
    this.settingsModalTitle = document.getElementById("settingsModalTitle");
    this.apiKeyLabel = document.getElementById("apiKeyLabel");
    this.apiKeyInput = document.getElementById("apiKeyInput");
    this.apiKeyHint = document.getElementById("apiKeyHint");
    this.modelSelectLabel = document.getElementById("modelSelectLabel");
    this.modelSelect = document.getElementById("modelSelect");
    this.topKLabel = document.getElementById("topKLabel");
    this.topKInput = document.getElementById("topKInput");
    this.topKHint = document.getElementById("topKHint");

    this.openActsBtn = document.getElementById("openActsBtn");
    this.actsModal = document.getElementById("actsModal");
    this.closeActsBtn = document.getElementById("closeActsBtn");
    this.actsModalTitle = document.getElementById("actsModalTitle");
    this.actSearchInput = document.getElementById("actSearchInput");
    this.actsListContent = document.getElementById("actsListContent");

    this.citationModal = document.getElementById("citationModal");
    this.closeCitationBtn = document.getElementById("closeCitationBtn");
    this.citationModalTitle = document.getElementById("citationModalTitle");
    this.citationContent = document.getElementById("citationContent");

    this.themeModal = document.getElementById("themeModal");
    this.closeThemeBtn = document.getElementById("closeThemeBtn");
  }

  /* ==========================================================================
     BANGLADESH FLAG BANGLA CHARACTER MATRIX BACKGROUND RENDERER
     ========================================================================== */
  initCanvasBackground() {
    this.canvas = document.getElementById("bdFlagCanvas");
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext("2d");

    const render = () => this.drawFlagPattern();
    window.addEventListener("resize", () => {
      clearTimeout(this.resizeTimer);
      this.resizeTimer = setTimeout(render, 150);
    });

    render();
  }

  drawFlagPattern() {
    if (!this.canvas || !this.ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.canvas.width = width * dpr;
    this.canvas.height = height * dpr;
    this.canvas.style.width = width + "px";
    this.canvas.style.height = height + "px";

    this.ctx.resetTransform();
    this.ctx.scale(dpr, dpr);
    this.ctx.clearRect(0, 0, width, height);

    // Bangladesh Flag Coordinates & Geometry
    // Center aligned with the central Scales of Justice symbol
    const centerX = width / 2;
    const centerY = height * 0.46;
    const circleRadius = Math.min(width, height) * 0.25;

    const isLight = this.currentTheme === "light";
    
    // Low-contrast, dignified color palette
    const greenColor = isLight 
      ? "rgba(0, 106, 78, 0.12)" 
      : "rgba(0, 106, 78, 0.22)";

    const redColor = isLight 
      ? "rgba(244, 42, 65, 0.16)" 
      : "rgba(244, 42, 65, 0.28)";

    // Authentic Bengali alphabet (বাংলা বর্ণমালা) forming the national flag
    // Green field: The rich, flowing consonants and vowels of Bangla
    const fieldLetters = [
      "অ", "আ", "ই", "উ", "এ", "ও", 
      "ক", "খ", "গ", "ঘ", "চ", "ছ", "জ", "ঝ", 
      "ট", "ঠ", "ড", "ঢ", "ত", "থ", "দ", "ধ", "ন", 
      "প", "ফ", "ব", "ভ", "ম", "য", "র", "ল", 
      "শ", "ষ", "স", "হ", "ড়", "ঢ়", "য়"
    ];

    // Red circle: Iconic Bengali letters signifying justice, rights & identity
    const circleLetters = [
      "আ", "ই", "ন", "হ", "ক", "ন", "্যা", "য়", 
      "বি", "চা", "র", "অ", "ধি", "কা", "র", 
      "মু", "ক্তি", "ব", "ঙ্গ", "দে", "শ"
    ];

    const spacingX = Math.max(22, Math.floor(width / 58));
    const spacingY = Math.max(22, Math.floor(height / 38));

    this.ctx.font = "600 13px 'Hind Siliguri', 'Plus Jakarta Sans', sans-serif";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";

    let colIndex = 0;
    for (let x = spacingX / 2; x < width; x += spacingX) {
      let rowIndex = 0;
      for (let y = spacingY / 2; y < height; y += spacingY) {
        // Distance from center of flag's red circle
        const dx = x - centerX;
        const dy = y - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        const insideCircle = dist <= circleRadius;
        
        let char;
        if (insideCircle) {
          this.ctx.fillStyle = redColor;
          char = circleLetters[(colIndex + rowIndex) % circleLetters.length];
        } else {
          this.ctx.fillStyle = greenColor;
          char = fieldLetters[(colIndex * 3 + rowIndex) % fieldLetters.length];
        }

        this.ctx.fillText(char, x, y);
        rowIndex++;
      }
      colIndex++;
    }
  }

  /* ==========================================================================
     LANGUAGE & INTERNATIONALIZATION (বাংলা / ENGLISH)
     ========================================================================== */
  applyLanguage(lang) {
    if (!I18N[lang]) lang = "bn";
    this.currentLang = lang;
    localStorage.setItem("legal_language", lang);
    document.documentElement.lang = lang;

    const t = I18N[lang];

    // Language buttons
    document.querySelectorAll(".lang-btn").forEach((btn) => {
      if (btn.getAttribute("data-lang") === lang) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    // Header strings
    if (this.brandName) this.brandName.textContent = t.brandName;
    if (this.actsBtnText) this.actsBtnText.textContent = t.actsBtn;
    if (this.settingsBtnText) this.settingsBtnText.textContent = t.settingsBtn;
    if (this.openThemeBtn) this.openThemeBtn.title = t.themeBtn;

    // Hero strings
    if (this.heroTitle) this.heroTitle.textContent = t.heroTitle;
    if (this.heroSubtitle) this.heroSubtitle.textContent = t.heroSubtitle;

    // Input strings
    if (this.chatInput) this.chatInput.placeholder = t.placeholder;
    if (this.sendBtn) this.sendBtn.title = t.sendTitle;

    // Presets Tray
    this.renderPresets();

    // Modals
    if (this.settingsModalTitle) this.settingsModalTitle.textContent = t.settingsTitle;
    if (this.apiKeyLabel) this.apiKeyLabel.textContent = t.apiKeyLabel;
    if (this.apiKeyHint) this.apiKeyHint.textContent = t.apiKeyHint;
    if (this.modelSelectLabel) this.modelSelectLabel.textContent = t.modelLabel;
    if (this.topKLabel) this.topKLabel.textContent = t.topKLabel;
    if (this.topKHint) this.topKHint.textContent = t.topKHint;
    if (this.saveSettingsBtn) this.saveSettingsBtn.textContent = t.saveSettings;

    if (this.actsModalTitle) this.actsModalTitle.textContent = t.actsTitle;
    if (this.actSearchInput) this.actSearchInput.placeholder = t.actsSearchPlaceholder;

    if (this.citationModalTitle) this.citationModalTitle.textContent = t.citationTitle;
  }

  renderPresets() {
    if (!this.presetsTray) return;
    const presets = I18N[this.currentLang].presets;
    
    this.presetsTray.innerHTML = presets.map((p) => `
      <button class="preset-chip" data-prompt="${this.escapeHtml(p.prompt)}">
        ${this.escapeHtml(p.text)}
      </button>
    `).join("");

    // Bind click events on newly rendered chips
    this.presetsTray.querySelectorAll(".preset-chip").forEach((chip) => {
      chip.addEventListener("click", (e) => {
        this.presetsTray.querySelectorAll(".preset-chip").forEach((c) => c.classList.remove("active"));
        const target = e.currentTarget;
        target.classList.add("active");
        const prompt = target.getAttribute("data-prompt");
        if (prompt) {
          this.chatInput.value = prompt;
          this.handleSend();
        }
      });
    });
  }

  /* ==========================================================================
     EVENT BINDINGS & INTERACTIONS
     ========================================================================== */
  bindEvents() {
    // Send action
    this.sendBtn.addEventListener("click", () => this.handleSend());

    // Enter to submit, Shift+Enter for newline
    this.chatInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        this.handleSend();
      }
    });

    // Auto-expand textarea height
    this.chatInput.addEventListener("input", () => {
      this.chatInput.style.height = "auto";
      this.chatInput.style.height = Math.min(this.chatInput.scrollHeight, 130) + "px";
    });

    // Brand reset
    if (this.brandResetBtn) {
      this.brandResetBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }

    // Language Switcher buttons
    document.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const lang = e.currentTarget.getAttribute("data-lang");
        this.applyLanguage(lang);
      });
    });

    // Direct Theme Toggle Button
    this.openThemeBtn.addEventListener("click", () => {
      const next = this.currentTheme === "dark" ? "light" : "dark";
      this.applyTheme(next);
    });

    // Settings Modal
    this.openSettingsBtn.addEventListener("click", () => this.showModal(this.settingsModal));
    this.closeSettingsBtn.addEventListener("click", () => this.hideModal(this.settingsModal));
    this.saveSettingsBtn.addEventListener("click", () => this.saveSettings());

    // Acts Modal
    this.openActsBtn.addEventListener("click", () => {
      this.showModal(this.actsModal);
      this.fetchActs();
    });
    this.closeActsBtn.addEventListener("click", () => this.hideModal(this.actsModal));

    this.actSearchInput.addEventListener("input", (e) => {
      clearTimeout(this.searchDebounceTimer);
      this.searchDebounceTimer = setTimeout(() => {
        this.fetchActs(e.target.value.trim());
      }, 250);
    });

    // Citation Modal
    this.closeCitationBtn.addEventListener("click", () => this.hideModal(this.citationModal));

    // Theme Modal (if opened)
    if (this.closeThemeBtn) {
      this.closeThemeBtn.addEventListener("click", () => this.hideModal(this.themeModal));
    }
    document.querySelectorAll(".theme-chip").forEach((chip) => {
      chip.addEventListener("click", (e) => {
        const theme = e.currentTarget.getAttribute("data-theme");
        this.applyTheme(theme);
        this.hideModal(this.themeModal);
      });
    });

    // Close modals on escape key or clicking backdrop
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        document.querySelectorAll(".modal-backdrop.active").forEach((m) => this.hideModal(m));
      }
    });

    document.querySelectorAll(".modal-backdrop").forEach((backdrop) => {
      backdrop.addEventListener("click", (e) => {
        if (e.target === backdrop) {
          this.hideModal(backdrop);
        }
      });
    });
  }

  /* ==========================================================================
     CORE CHAT / QUERY PIPELINE
     ========================================================================== */
  async handleSend() {
    const text = this.chatInput.value.trim();
    if (!text) return;

    // Activate active state
    document.body.classList.add("chat-active");
    if (this.heroState) this.heroState.style.display = "none";

    this.appendUserMessage(text);
    this.chatInput.value = "";
    this.chatInput.style.height = "auto";
    this.chatInput.disabled = true;
    this.sendBtn.disabled = true;

    const loaderId = this.appendLoadingIndicator();

    try {
      const topK = parseInt(this.topKInput?.value || this.topK || "5", 10);
      const payload = {
        message: text,
        api_key: this.apiKey || null,
        model_name: this.modelName,
        top_k: topK,
        temperature: 0.2
      };

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      this.removeMessage(loaderId);

      if (res.ok) {
        this.appendAssistantMessage(data);
      } else {
        const errPrefix = this.currentLang === "en" ? "Error Processing Request" : "অনুরোধ প্রক্রিয়াকরণে ত্রুটি";
        const errorDetail = data.error ? `${data.detail}: ${data.error}` : (data.detail || "Server Response Error");
        this.appendAssistantMessage({
          answer: `⚠️ **${errPrefix}**: ${errorDetail}`,
          citations: [],
          latency_ms: 0,
          model_used: "error"
        });
      }
    } catch (err) {
      this.removeMessage(loaderId);
      const connErr = this.currentLang === "en" 
        ? `⚠️ **Connection Error**: Could not connect to the service. (${err.message})`
        : `⚠️ **সংযোগ ত্রুটি**: সার্ভারের সাথে সংযোগ স্থাপন করা যায়নি। (${err.message})`;
      this.appendAssistantMessage({
        answer: connErr,
        citations: [],
        latency_ms: 0,
        model_used: "offline"
      });
    } finally {
      this.chatInput.disabled = false;
      this.sendBtn.disabled = false;
      this.chatInput.focus();
    }
  }

  appendUserMessage(text) {
    const div = document.createElement("div");
    div.className = "message-row user";
    div.innerHTML = `
      <div class="message-body">
        ${this.escapeHtml(text)}
      </div>
    `;
    this.chatMessages.appendChild(div);
    this.scrollToBottom();
  }

  appendLoadingIndicator() {
    const id = "loader_" + Date.now();
    const div = document.createElement("div");
    div.id = id;
    div.className = "message-row assistant";
    const loadingText = I18N[this.currentLang].loadingText;
    div.innerHTML = `
      <div class="loading-message">
        <div class="loading-dots">
          <span></span><span></span><span></span>
        </div>
        <span>${this.escapeHtml(loadingText)}</span>
      </div>
    `;
    this.chatMessages.appendChild(div);
    this.scrollToBottom();
    return id;
  }

  appendAssistantMessage(data) {
    const div = document.createElement("div");
    div.className = "message-row assistant";

    const msgIndex = Date.now();
    window[`_citations_${msgIndex}`] = data.citations || [];

    const t = I18N[this.currentLang];

    let citationsHtml = "";
    if (data.citations && data.citations.length > 0) {
      const pills = data.citations.map((c, idx) => {
        const shortTitle = c.act_title.length > 36 ? c.act_title.slice(0, 34) + "…" : c.act_title;
        const score = (c.score * 100).toFixed(0);
        return `
          <button class="citation-pill" onclick="app.showCitation('${msgIndex}', ${idx})" title="${this.escapeHtml(c.act_title)}">
            <span>📜 ${this.escapeHtml(shortTitle)}</span>
            <span class="pill-score">${score}%</span>
          </button>
        `;
      }).join("");

      citationsHtml = `
        <div class="citations-tray">
          <div class="citations-header">
            <span>${t.citationsLabel} (${data.citations.length})</span>
          </div>
          <div class="citations-list">${pills}</div>
        </div>
      `;
    }

    const formattedAnswer = this.formatMarkdown(data.answer);
    const latencySec = (data.latency_ms / 1000).toFixed(1);

    div.innerHTML = `
      <div class="message-body">
        <div class="message-meta">
          <div class="meta-identity">
            <span>${t.assistantIdentity}</span>
          </div>
          <div class="meta-stats">
            <span>${this.escapeHtml(data.model_used || "LLM")}</span>
            <span>&bull;</span>
            <span>${latencySec}s</span>
            <button class="btn-copy" onclick="app.copyAnswer(this)" title="${t.copyBtn}">
              ${t.copyBtn}
            </button>
          </div>
        </div>
        <div class="message-text">
          ${formattedAnswer}
        </div>
        ${citationsHtml}
      </div>
    `;

    this.chatMessages.appendChild(div);
    this.scrollToBottom();
  }

  copyAnswer(btn) {
    const textContainer = btn.closest(".message-body").querySelector(".message-text");
    if (!textContainer) return;
    const t = I18N[this.currentLang];
    navigator.clipboard.writeText(textContainer.innerText).then(() => {
      const original = btn.innerHTML;
      btn.innerHTML = t.copiedText;
      btn.style.color = "var(--accent-primary)";
      setTimeout(() => {
        btn.innerHTML = original;
        btn.style.color = "";
      }, 1800);
    });
  }

  showCitation(msgIndex, itemIndex) {
    const citations = window[`_citations_${msgIndex}`];
    if (!citations || !citations[itemIndex]) return;
    const item = citations[itemIndex];
    const t = I18N[this.currentLang];

    this.citationContent.innerHTML = `
      <div class="citation-view-header">
        <div class="citation-view-title">${this.escapeHtml(item.act_title)}</div>
        <div class="citation-view-sub">
          ${item.act_no ? t.actNoLabel + ' ' + this.escapeHtml(item.act_no) : ''}
          ${item.act_year ? ' | ' + t.yearLabel + ' ' + this.escapeHtml(item.act_year) : ''}
          | ${t.relevanceLabel} ${(item.score * 100).toFixed(1)}%
        </div>
      </div>
      <div class="citation-body-card">
        ${this.escapeHtml(item.section_content)}
      </div>
      ${item.footnotes && item.footnotes.length > 0 ? `
        <div class="citation-footnotes-card">
          <strong>${t.footnotesLabel}</strong>
          <ul>
            ${item.footnotes.map(f => `<li>${this.escapeHtml(f)}</li>`).join('')}
          </ul>
        </div>
      ` : ''}
    `;
    this.showModal(this.citationModal);
  }

  /* ==========================================================================
     ACTS DIRECTORY & REALTIME SEARCH
     ========================================================================== */
  async fetchActs(query = "") {
    const t = I18N[this.currentLang];
    try {
      this.actsListContent.innerHTML = `<div style="padding: 1.5rem; text-align: center; color: var(--text-tertiary);">${t.loadingText}</div>`;
      const url = `/api/acts?limit=150${query ? '&search=' + encodeURIComponent(query) : ''}`;
      const res = await fetch(url);
      const acts = await res.json();

      if (!acts || acts.length === 0) {
        this.actsListContent.innerHTML = `<div style="padding: 1.5rem; text-align: center; color: var(--text-tertiary);">${t.noActsFound}</div>`;
        return;
      }

      this.actsListContent.innerHTML = acts.map(a => {
        const displayTitle = (a.act_title || '').replace(/^(\d+)([A-Za-z\u0980-\u09FF])/, '$1 $2');
        return `
        <div class="act-row-item" onclick="app.selectActPrompt('${this.escapeHtml(displayTitle)}')">
          <div>
            <div class="act-title-text">${this.escapeHtml(displayTitle)}</div>
            <div class="act-sub-meta">
              ${a.act_year ? t.yearLabel + ' ' + a.act_year : ''} 
              ${a.act_no ? '| ' + t.actNoLabel + ' ' + a.act_no : ''}
            </div>
          </div>
          <span class="act-count-badge">${a.section_count} ${t.secBadge}</span>
        </div>
      `;
      }).join('');
    } catch (e) {
      this.actsListContent.innerHTML = `<div style="padding: 1rem; color: var(--danger);">${t.actsLoadError}</div>`;
    }
  }

  selectActPrompt(actTitle) {
    this.hideModal(this.actsModal);
    if (this.currentLang === "en") {
      this.chatInput.value = `Explain the core purpose, scope, and key legal provisions of the ${actTitle}.`;
    } else {
      this.chatInput.value = `${actTitle} এর মূল বিধান, উদ্দেশ্য এবং প্রযোজ্যতা সংক্ষেপে বুঝিয়ে বলুন।`;
    }
    this.chatInput.focus();
    this.handleSend();
  }

  /* ==========================================================================
     SETTINGS & MODELS
     ========================================================================== */
  async loadModels() {
    try {
      const res = await fetch("/api/models");
      const models = await res.json();
      if (!Array.isArray(models)) return;

      this.modelSelect.innerHTML = "";
      models.forEach((m) => {
        const opt = document.createElement("option");
        opt.value = m.id;
        opt.textContent = `${m.name} (${m.provider})`;
        if (m.id === this.modelName) opt.selected = true;
        this.modelSelect.appendChild(opt);
      });
    } catch (e) {
      console.warn("Model list fetch error:", e);
    }
  }

  applySettingsUI() {
    if (this.apiKeyInput) this.apiKeyInput.value = this.apiKey;
    if (this.modelSelect) this.modelSelect.value = this.modelName;
    if (this.topKInput) this.topKInput.value = this.topK;
  }

  saveSettings() {
    this.apiKey = this.apiKeyInput.value.trim();
    this.modelName = this.modelSelect.value || "arnab9961/bangladesh-law-smollm2";
    this.topK = parseInt(this.topKInput.value, 10) || 5;

    localStorage.setItem("legal_hf_token", this.apiKey);
    localStorage.removeItem("legal_groq_api_key");
    localStorage.setItem("legal_model_name", this.modelName);
    localStorage.setItem("legal_top_k", this.topK.toString());

    this.hideModal(this.settingsModal);
  }

  /* ==========================================================================
     THEME & MODAL UTILITIES
     ========================================================================== */
  applyTheme(theme) {
    this.currentTheme = theme;
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("legal_theme", theme);

    document.querySelectorAll(".theme-chip").forEach((c) => {
      if (c.getAttribute("data-theme") === theme) {
        c.classList.add("selected");
      } else {
        c.classList.remove("selected");
      }
    });

    // Redraw flag pattern to align with theme colors
    this.drawFlagPattern();
  }

  showModal(el) {
    if (!el) return;
    el.classList.add("active");
  }

  hideModal(el) {
    if (!el) return;
    el.classList.remove("active");
  }

  removeMessage(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
  }

  scrollToBottom() {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth"
    });
  }

  escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  formatMarkdown(text) {
    if (!text) return "";
    let html = this.escapeHtml(text);

    // Markdown Headers: ###, ##, #
    html = html.replace(/^### (.*?)$/gm, '<h4 style="margin: 0.6rem 0 0.3rem 0; font-size: 1rem; color: var(--text-primary); font-weight: 600;">$1</h4>');
    html = html.replace(/^## (.*?)$/gm, '<h3 style="margin: 0.8rem 0 0.4rem 0; font-size: 1.08rem; color: var(--text-primary); font-weight: 600;">$1</h3>');
    html = html.replace(/^# (.*?)$/gm, '<h2 style="margin: 1rem 0 0.5rem 0; font-size: 1.15rem; color: var(--text-primary); font-weight: 700;">$1</h2>');

    // Bold & Italics
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Code block
    html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Markdown Tables
    html = html.replace(/((?:^|\n)\|[^\n]+\|[ \t]*(?:\n\|[^\n]+\|[ \t]*)+)/g, (match) => {
      const rows = match.trim().split(/\r?\n/).map(r => r.trim()).filter(r => r.startsWith('|') && r.endsWith('|'));
      if (rows.length < 2) return match;
      
      const parseCells = (row) => row.slice(1, -1).split('|').map(c => c.trim());
      const isSep = (r) => /^\|(?:\s*:?-{2,}:?\s*\|)+$/.test(r);
      let thead = '';
      let bodyRows = rows;
      
      if (rows.length >= 2 && isSep(rows[1])) {
        const headerCells = parseCells(rows[0]);
        thead = '<thead><tr>' + headerCells.map(c => `<th>${c}</th>`).join('') + '</tr></thead>';
        bodyRows = rows.slice(2);
      }
      
      const tbody = '<tbody>' + bodyRows.map(r => {
        if (isSep(r)) return '';
        const cells = parseCells(r);
        return '<tr>' + cells.map(c => `<td>${c}</td>`).join('') + '</tr>';
      }).filter(r => r.length > 0).join('') + '</tbody>';
      
      return `<div class="table-responsive"><table class="legal-table">${thead}${tbody}</table></div>`;
    });

    // Bullet points
    html = html.replace(/^\s*[-*•]\s+(.*?)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

    // Numbered lists
    html = html.replace(/^\s*(\d+)\.\s+(.*?)$/gm, '<li>$2</li>');

    // Line breaks
    html = html.replace(/\n\n+/g, '<br/><br/>');
    html = html.replace(/\n/g, '<br/>');

    return html;
  }
}

// Global App Initialization
document.addEventListener("DOMContentLoaded", () => {
  window.app = new BangladeshLegalAI();
});
