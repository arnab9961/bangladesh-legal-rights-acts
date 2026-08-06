/**
 * LEGALTYPE - MONKEYTYPE INSPIRED RAG CHATBOT CONTROLLER
 */

class LegaltypeApp {
  constructor() {
    this.apiKey = localStorage.getItem("legal_groq_api_key") || "";
    this.modelName = localStorage.getItem("legal_model_name") || "llama-3.3-70b-versatile";
    this.currentTheme = localStorage.getItem("legal_theme") || "serika";
    
    this.initElements();
    this.bindEvents();
    this.applyTheme(this.currentTheme);
    this.loadModels();
    this.applySettingsUI();
  }

  initElements() {
    this.chatMessages = document.getElementById("chatMessages");
    this.chatInput = document.getElementById("chatInput");
    this.sendBtn = document.getElementById("sendBtn");
    
    // Modals & Triggers
    this.openThemeBtn = document.getElementById("openThemeBtn");
    this.themeModal = document.getElementById("themeModal");
    this.closeThemeBtn = document.getElementById("closeThemeBtn");

    this.openSettingsBtn = document.getElementById("openSettingsBtn");
    this.settingsModal = document.getElementById("settingsModal");
    this.closeSettingsBtn = document.getElementById("closeSettingsBtn");
    this.saveSettingsBtn = document.getElementById("saveSettingsBtn");
    this.apiKeyInput = document.getElementById("apiKeyInput");
    this.modelSelect = document.getElementById("modelSelect");
    this.topKInput = document.getElementById("topKInput");

    this.openActsBtn = document.getElementById("openActsBtn");
    this.actsModal = document.getElementById("actsModal");
    this.closeActsBtn = document.getElementById("closeActsBtn");
    this.actSearchInput = document.getElementById("actSearchInput");
    this.actsListContent = document.getElementById("actsListContent");

    this.citationModal = document.getElementById("citationModal");
    this.closeCitationBtn = document.getElementById("closeCitationBtn");
    this.citationContent = document.getElementById("citationContent");
  }

  bindEvents() {
    this.sendBtn.addEventListener("click", () => this.handleSend());
    this.chatInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        this.handleSend();
      }
    });

    // Theme Modal
    this.openThemeBtn.addEventListener("click", () => this.showModal(this.themeModal));
    this.closeThemeBtn.addEventListener("click", () => this.hideModal(this.themeModal));
    document.querySelectorAll(".theme-chip").forEach((chip) => {
      chip.addEventListener("click", (e) => {
        const theme = e.target.getAttribute("data-theme");
        this.applyTheme(theme);
        this.hideModal(this.themeModal);
      });
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
    this.actSearchInput.addEventListener("input", (e) => this.fetchActs(e.target.value));

    // Citation Modal
    this.closeCitationBtn.addEventListener("click", () => this.hideModal(this.citationModal));

    // Preset Chips
    document.querySelectorAll(".preset-chip").forEach((chip) => {
      chip.addEventListener("click", (e) => {
        document.querySelectorAll(".preset-chip").forEach(c => c.classList.remove("active"));
        e.target.classList.add("active");
        const text = e.target.getAttribute("data-prompt");
        this.chatInput.value = text;
        this.handleSend();
      });
    });
  }

  applyTheme(themeName) {
    this.currentTheme = themeName;
    document.documentElement.setAttribute("data-theme", themeName);
    localStorage.setItem("legal_theme", themeName);

    document.querySelectorAll(".theme-chip").forEach(c => {
      if (c.getAttribute("data-theme") === themeName) {
        c.classList.add("selected");
      } else {
        c.classList.remove("selected");
      }
    });
  }

  showModal(modalEl) {
    modalEl.classList.add("active");
  }

  hideModal(modalEl) {
    modalEl.classList.remove("active");
  }

  applySettingsUI() {
    this.apiKeyInput.value = this.apiKey;
    this.modelSelect.value = this.modelName;
  }

  saveSettings() {
    this.apiKey = this.apiKeyInput.value.trim();
    this.modelName = this.modelSelect.value;
    localStorage.setItem("legal_groq_api_key", this.apiKey);
    localStorage.setItem("legal_model_name", this.modelName);
    this.hideModal(this.settingsModal);
  }

  async loadModels() {
    try {
      const res = await fetch("/api/models");
      const models = await res.json();
      this.modelSelect.innerHTML = "";
      models.forEach((m) => {
        const opt = document.createElement("option");
        opt.value = m.id;
        opt.textContent = `${m.name} [${m.provider}]`;
        if (m.id === this.modelName) opt.selected = true;
        this.modelSelect.appendChild(opt);
      });
    } catch (e) {
      console.error("Failed loading model list:", e);
    }
  }

  async fetchActs(searchQuery = "") {
    try {
      const url = `/api/acts?limit=100${searchQuery ? '&search=' + encodeURIComponent(searchQuery) : ''}`;
      const res = await fetch(url);
      const acts = await res.json();
      
      if (!acts || acts.length === 0) {
        this.actsListContent.innerHTML = `<div style="color: var(--text-sub); font-size: 0.9rem; padding: 0.5rem;">কোনো মিল পাওয়া যায়নি।</div>`;
        return;
      }

      this.actsListContent.innerHTML = acts.map(a => `
        <div style="background: var(--bg-main); border: 1px solid var(--border-subtle); padding: 0.75rem; border-radius: var(--radius); display: flex; align-items: center; justify-content: space-between;">
          <div>
            <div style="font-weight: 500; color: var(--text-main); font-size: 0.92rem;">${this.escapeHtml(a.act_title)}</div>
            <div style="font-family: var(--font-mono); font-size: 0.78rem; color: var(--text-sub);">বর্ষ: ${a.act_year || 'N/A'} ${a.act_no ? '| আইন নং: ' + a.act_no : ''}</div>
          </div>
          <span style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--accent-yellow);">${a.section_count} অনুচ্ছেদ</span>
        </div>
      `).join('');
    } catch (e) {
      this.actsListContent.innerHTML = `<div style="color: var(--danger);">আইন সূচি লোড করতে ব্যর্থ।</div>`;
    }
  }

  showCitationModal(citation) {
    this.citationContent.innerHTML = `
      <div style="font-size: 1.1rem; font-weight: 600; color: var(--accent-yellow); margin-bottom: 0.4rem;">
        ${this.escapeHtml(citation.act_title)}
      </div>
      <div style="font-family: var(--font-mono); color: var(--text-sub); font-size: 0.82rem; margin-bottom: 1rem;">
        ${citation.act_no ? 'আইন নং: ' + citation.act_no : ''} ${citation.act_year ? ' | বর্ষ: ' + citation.act_year : ''} | মিল স্কোর: ${(citation.score * 100).toFixed(1)}%
      </div>
      <div style="background: var(--bg-main); border: 1px solid var(--border-subtle); padding: 1.1rem; border-radius: var(--radius); line-height: 1.65; font-size: 0.95rem; margin-bottom: 1rem; color: var(--text-main);">
        ${this.escapeHtml(citation.section_content)}
      </div>
      ${citation.footnotes && citation.footnotes.length > 0 ? `
        <div style="font-family: var(--font-mono); color: var(--text-sub); font-size: 0.8rem; margin-bottom: 0.4rem; text-transform: uppercase;">আইনি ফুটনোট:</div>
        <ul style="font-size: 0.85rem; color: var(--text-sub); padding-left: 1.2rem;">
          ${citation.footnotes.map(f => `<li style="margin-bottom: 0.3rem;">${this.escapeHtml(f)}</li>`).join('')}
        </ul>
      ` : ''}
    `;
    this.showModal(this.citationModal);
  }

  async handleSend() {
    const text = this.chatInput.value.trim();
    if (!text) return;

    this.appendUserMessage(text);
    this.chatInput.value = "";
    this.chatInput.disabled = true;
    this.sendBtn.disabled = true;

    const loaderId = this.appendLoadingIndicator();

    try {
      const topK = parseInt(this.topKInput?.value || "5", 10);
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
        this.appendAssistantMessage({
          answer: `⚠️ **ত্রুটি**: ${data.detail || "সার্ভার ত্রুটি"}`,
          citations: [],
          latency_ms: 0,
          model_used: "error"
        });
      }
    } catch (err) {
      this.removeMessage(loaderId);
      this.appendAssistantMessage({
        answer: `⚠️ **নেটওয়ার্ক ত্রুটি**: FastAPI সার্ভিসে সংযুক্ত হওয়া যায়নি। ${err.message}`,
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
      <div class="message-header" style="align-self: flex-end;">
        <span>আপনি &bull; ${new Date().toLocaleTimeString()}</span>
      </div>
      <div class="message-content">
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
    div.innerHTML = `
      <div class="message-header">
        <span class="role-badge">লিগ্যালটাইপ এআই</span>
        <span>&bull; আইন সূচি অনুসন্ধান করা হচ্ছে...</span>
      </div>
      <div class="message-content" style="color: var(--text-sub); font-family: var(--font-mono); font-size: 0.9rem;">
        বাংলাদেশের প্রাসঙ্গিক ধারা সংগ্রহ ও উত্তর সংকলন করা হচ্ছে...
      </div>
    `;
    this.chatMessages.appendChild(div);
    this.scrollToBottom();
    return id;
  }

  appendAssistantMessage(data) {
    const div = document.createElement("div");
    div.className = "message-row assistant";

    window._lastCitations = data.citations || [];
    let citationsHtml = "";
    if (data.citations && data.citations.length > 0) {
      const pills = data.citations.map((c, idx) => {
        return `<button class="citation-pill" onclick="app.showCitationIndex(${idx})">📜 ${this.escapeHtml(c.act_title.slice(0, 32))}</button>`;
      }).join(" ");

      citationsHtml = `
        <div class="citations-wrapper">
          <div class="citations-label">আইনি প্রমাণ (${data.citations.length} প্রাপ্ত):</div>
          <div class="citations-list">${pills}</div>
        </div>
      `;
    }

    const formattedAnswer = this.formatMarkdown(data.answer);

    div.innerHTML = `
      <div class="message-header">
        <span class="role-badge">লিগ্যালটাইপ এআই</span>
        <span>&bull; মডেল: ${data.model_used} &bull; ${data.latency_ms}ms</span>
      </div>
      <div class="message-content">
        <div>${formattedAnswer}</div>
        ${citationsHtml}
      </div>
    `;
    this.chatMessages.appendChild(div);
    this.scrollToBottom();
  }

  showCitationIndex(index) {
    if (window._lastCitations && window._lastCitations[index]) {
      this.showCitationModal(window._lastCitations[index]);
    }
  }

  removeMessage(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
  }

  scrollToBottom() {
    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
  }

  escapeHtml(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  formatMarkdown(text) {
    if (!text) return "";
    let html = this.escapeHtml(text);
    
    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Italic
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    // Code block
    html = html.replace(/```([\s\S]*?)```/g, '<pre style="background: var(--bg-sub); border: 1px solid var(--border-subtle); padding: 0.8rem; border-radius: var(--radius); font-family: var(--font-mono); font-size: 0.85rem; overflow-x: auto; margin: 0.5rem 0;"><code>$1</code></pre>');
    // Code inline
    html = html.replace(/`([^`]+)`/g, '<code style="background: var(--bg-hover); color: var(--accent-yellow); padding: 2px 5px; border-radius: 4px; font-family: var(--font-mono); font-size: 0.88rem;">$1</code>');
    // Linebreaks
    html = html.replace(/\n/g, '<br/>');
    return html;
  }
}

// Global App Instance
document.addEventListener("DOMContentLoaded", () => {
  window.app = new LegaltypeApp();
});
