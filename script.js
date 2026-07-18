// Replace this with your Discord invite link.
const DISCORD_URL = "https://discord.gg/RQtdhjpKrY";

/*
  HOW TO ADD A SCRIPT
  Copy one object inside SCRIPTS and change its values.
  category must match a category id in CATEGORIES.
*/
const SCRIPTS = [
  {
    id: 1,
    title: "Movement Toolkit",
    description: "Movement controls for keyboard and mobile.",
    image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=900&q=85",
    category: "popular",
    tags: ["Utility", "Mobile"],
    features: ["Smooth controls", "Mobile friendly", "Easy setup"],
    code: `-- Movement Toolkit (Example)\nlocal Players = game:GetService("Players")\nlocal UserInputService = game:GetService("UserInputService")\n\nlocal Player = Players.LocalPlayer\n\nUserInputService.InputBegan:Connect(function(Input, Processed)\n\tif Processed then return end\n\tif Input.KeyCode == Enum.KeyCode.Space then\n\t\tprint(Player.Name .. " jumped")\n\tend\nend)`,
    featured: true,
    added: "Today"
  },
  {
    id: 2,
    title: "Interface Starter",
    description: "A draggable interface shell for game tools.",
    image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=900&q=85",
    category: "latest",
    tags: ["UI", "Starter"],
    features: ["Draggable window", "Responsive sizing", "Theme variables"],
    code: `-- Interface Starter (Example)\nlocal Players = game:GetService("Players")\n\nlocal ScreenGui = Instance.new("ScreenGui")\nScreenGui.Name = "IdealInterface"\nScreenGui.ResetOnSpawn = false\nScreenGui.Parent = Players.LocalPlayer:WaitForChild("PlayerGui")\n\nlocal Main = Instance.new("Frame")\nMain.Size = UDim2.fromOffset(320, 190)\nMain.Position = UDim2.new(0.5, -160, 0.5, -95)\nMain.BackgroundColor3 = Color3.fromRGB(16, 22, 31)\nMain.Parent = ScreenGui`,
    added: "2 days ago"
  },
  {
    id: 3,
    title: "Team Visuals",
    description: "Team-colored character highlights.",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=900&q=85",
    category: "visuals",
    tags: ["Visual", "Teams"],
    features: ["Team colors", "Auto refresh", "Customizable"],
    code: `-- Team Visuals (Example)\nlocal Players = game:GetService("Players")\n\nlocal function AddHighlight(Character, Color)\n\tlocal Highlight = Instance.new("Highlight")\n\tHighlight.FillColor = Color\n\tHighlight.FillTransparency = 0.55\n\tHighlight.Parent = Character\nend\n\nfor _, Player in Players:GetPlayers() do\n\tif Player.Character then\n\t\tAddHighlight(Player.Character, Player.TeamColor.Color)\n\tend\nend`,
    added: "1 week ago"
  },
  {
    id: 4,
    title: "Cooldown Module",
    description: "Server cooldowns for abilities and tools.",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=900&q=85",
    category: "utilities",
    tags: ["Module", "Server"],
    features: ["Per-player timers", "Automatic cleanup", "Reusable API"],
    code: `-- Cooldown Module (Example)\nlocal Cooldowns = {}\n\nlocal function IsReady(Player, Name, Duration)\n\tlocal Key = tostring(Player.UserId) .. ":" .. Name\n\tlocal Now = os.clock()\n\tif (Cooldowns[Key] or 0) > Now then return false end\n\tCooldowns[Key] = Now + Duration\n\treturn true\nend\n\nreturn IsReady`,
    added: "2 weeks ago"
  }
];

/* Add sidebar tabs here. Use a unique id and matching script category. */
const CATEGORIES = [
  { id: "popular", label: "Popular Scripts", icon: "◉" },
  { id: "latest", label: "Latest", icon: "◷" },
  { id: "utilities", label: "Utilities", icon: "◆" },
  { id: "visuals", label: "Visuals", icon: "◈" },
  { id: "credits", label: "Credits", icon: "☆" }
];

const State = { category: "popular", query: "", expanded: new Set([1]) };
const Elements = {
  tabs: document.querySelector("#categoryTabs"),
  library: document.querySelector("#libraryView"),
  credits: document.querySelector("#creditsView"),
  searchWrap: document.querySelector("#searchWrap"),
  search: document.querySelector("#searchInput"),
  clear: document.querySelector("#clearSearch"),
  searchKey: document.querySelector("#searchKey"),
  list: document.querySelector("#scriptList"),
  empty: document.querySelector("#emptyState"),
  label: document.querySelector("#sectionLabel"),
  title: document.querySelector("#sectionTitle"),
  count: document.querySelector("#resultCount"),
  toast: document.querySelector("#toast"),
  topbar: document.querySelector("#topbar"),
  homeButton: document.querySelector("#homeButton"),
  scriptsButton: document.querySelector("#scriptsButton"),
  creditsButton: document.querySelector("#creditsButton")
};

function escapeHTML(value) {
  return String(value).replace(/[&<>'"]/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]);
}

function highlight(value, query) {
  const safe = escapeHTML(value);
  const clean = query.trim();
  if (!clean) return safe;
  const index = value.toLowerCase().indexOf(clean.toLowerCase());
  if (index < 0) return safe;
  return `${escapeHTML(value.slice(0, index))}<mark>${escapeHTML(value.slice(index, index + clean.length))}</mark>${escapeHTML(value.slice(index + clean.length))}`;
}

function getResults() {
  const query = State.query.trim().toLowerCase();
  return SCRIPTS.filter(script => {
    if (!query) return script.category === State.category;
    return [script.title, script.description, script.category, ...script.tags, ...script.features].join(" ").toLowerCase().includes(query);
  }).sort((a, b) => {
    if (!query) return a.id - b.id;
    const score = script => script.title.toLowerCase().startsWith(query) ? 3 : script.title.toLowerCase().includes(query) ? 2 : script.tags.some(tag => tag.toLowerCase().includes(query)) ? 1 : 0;
    return score(b) - score(a);
  });
}

function renderTabs() {
  Elements.tabs.innerHTML = CATEGORIES.map(category => {
    const count = category.id === "credits" ? "" : `<small>${SCRIPTS.filter(script => script.category === category.id).length}</small>`;
    return `<button class="category-tab ${State.category === category.id ? "active" : ""}" data-category="${category.id}" role="tab" aria-selected="${State.category === category.id}"><b>${category.icon}</b><span>${category.label}</span>${count}</button>`;
  }).join("");
}

function cardTemplate(script) {
  const expanded = State.expanded.has(script.id);
  const category = CATEGORIES.find(item => item.id === script.category)?.label || script.category;
  return `<article class="script-card" data-id="${script.id}">
    <div class="script-visual"><img src="${escapeHTML(script.image)}" alt="" loading="lazy"><div class="visual-overlay"></div><span class="image-label">${escapeHTML(script.added)}</span></div>
    <div class="script-info">
      ${script.featured ? '<p class="featured">Featured</p>' : ""}
      ${State.query ? `<p class="category-label">${escapeHTML(category)}</p>` : ""}
      <h3>${highlight(script.title, State.query)}</h3>
      <p class="description">${escapeHTML(script.description)}</p>
      <div class="tags">${script.tags.map(tag => `<span>${escapeHTML(tag)}</span>`).join("")}</div>
      <ul>${script.features.map(feature => `<li>${escapeHTML(feature)}</li>`).join("")}</ul>
    </div>
    <div class="code-side ${expanded ? "expanded" : ""}">
      <div class="code-toolbar"><div class="dots"><i class="dot"></i><i class="dot"></i><i class="dot"></i></div><span>Lua</span><button class="mini-copy" data-copy="${script.id}" aria-label="Copy script">Copy</button></div>
      <pre><code>${escapeHTML(script.code)}</code></pre>
      <div class="card-actions"><button class="expand-button" data-expand="${script.id}">${expanded ? "Collapse code" : "View full code"}</button><button class="copy-button" data-copy="${script.id}">Copy Script</button></div>
    </div>
  </article>`;
}

function renderScripts() {
  const results = getResults();
  const category = CATEGORIES.find(item => item.id === State.category);
  Elements.label.textContent = State.query ? "All categories" : category.label;
  Elements.title.innerHTML = State.query ? `Results for <mark>“${escapeHTML(State.query)}”</mark>` : "Scripts";
  Elements.count.textContent = `${results.length} ${results.length === 1 ? "script" : "scripts"}`;
  Elements.list.innerHTML = results.map(cardTemplate).join("");
  Elements.list.classList.toggle("hidden", results.length === 0);
  Elements.empty.classList.toggle("hidden", results.length !== 0);
}

function showLibrary(category = "popular", scroll = false) {
  State.category = category;
  State.query = "";
  Elements.search.value = "";
  Elements.library.classList.remove("hidden");
  Elements.credits.classList.add("hidden");
  Elements.creditsButton.classList.remove("active");
  renderTabs();
  updateSearchControls();
  renderScripts();
  if (scroll) document.querySelector("#scripts").scrollIntoView({ behavior: "smooth" });
  else window.scrollTo({ top: 0, behavior: "smooth" });
}

function showCredits() {
  State.category = "credits";
  Elements.library.classList.add("hidden");
  Elements.credits.classList.remove("hidden");
  Elements.homeButton.classList.remove("active");
  Elements.scriptsButton.classList.remove("active");
  Elements.creditsButton.classList.add("active");
  renderTabs();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function updateSearchControls() {
  const hasQuery = Elements.search.value.length > 0;
  Elements.clear.classList.toggle("hidden", !hasQuery);
  Elements.searchKey.classList.toggle("hidden", hasQuery);
}

async function copyScript(id, button) {
  const script = SCRIPTS.find(item => item.id === id);
  if (!script) return;
  try { await navigator.clipboard.writeText(script.code); }
  catch {
    const area = document.createElement("textarea");
    area.value = script.code;
    document.body.append(area);
    area.select();
    document.execCommand("copy");
    area.remove();
  }
  const oldText = button.textContent;
  button.textContent = "Copied!";
  button.classList.add("copied");
  Elements.toast.classList.add("show");
  setTimeout(() => { button.textContent = oldText; button.classList.remove("copied"); Elements.toast.classList.remove("show"); }, 1500);
}

document.querySelectorAll(".discord-target").forEach(link => link.href = DISCORD_URL);
Elements.tabs.addEventListener("click", event => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  button.dataset.category === "credits" ? showCredits() : showLibrary(button.dataset.category, true);
});
Elements.list.addEventListener("click", event => {
  const copyButton = event.target.closest("[data-copy]");
  const expandButton = event.target.closest("[data-expand]");
  if (copyButton) copyScript(Number(copyButton.dataset.copy), copyButton);
  if (expandButton) {
    const id = Number(expandButton.dataset.expand);
    State.expanded.has(id) ? State.expanded.delete(id) : State.expanded.add(id);
    renderScripts();
  }
});
Elements.search.addEventListener("focus", () => { Elements.searchWrap.classList.add("focused"); Elements.searchWrap.setAttribute("aria-expanded", "true"); });
Elements.search.addEventListener("blur", () => setTimeout(() => { Elements.searchWrap.classList.remove("focused"); Elements.searchWrap.setAttribute("aria-expanded", "false"); }, 120));
Elements.search.addEventListener("input", () => { State.query = Elements.search.value; updateSearchControls(); renderScripts(); });
Elements.search.addEventListener("keydown", event => { if (event.key === "Enter") document.querySelector("#scripts").scrollIntoView({ behavior: "smooth" }); });
Elements.clear.addEventListener("click", () => { Elements.search.value = ""; State.query = ""; updateSearchControls(); renderScripts(); Elements.search.focus(); });
document.querySelectorAll("[data-search]").forEach(button => button.addEventListener("click", () => { Elements.search.value = button.dataset.search; State.query = button.dataset.search; updateSearchControls(); renderScripts(); Elements.searchWrap.classList.remove("focused"); document.querySelector("#scripts").scrollIntoView({ behavior: "smooth" }); }));
document.querySelector("#emptyClear").addEventListener("click", () => { Elements.search.value = ""; State.query = ""; updateSearchControls(); renderScripts(); Elements.search.focus(); });
document.querySelector("#emptyPopular").addEventListener("click", () => showLibrary("popular", true));
document.querySelector("#homeLogo").addEventListener("click", () => showLibrary("popular"));
document.querySelector("#footerHome").addEventListener("click", () => showLibrary("popular"));
document.querySelector("#homeButton").addEventListener("click", () => showLibrary("popular"));
document.querySelector("#scriptsButton").addEventListener("click", () => showLibrary("popular", true));
document.querySelector("#creditsButton").addEventListener("click", showCredits);
document.querySelector("#creditName").addEventListener("click", showCredits);
document.querySelector("#browseButton").addEventListener("click", () => showLibrary("popular", true));
window.addEventListener("scroll", () => {
  Elements.topbar.classList.toggle("scrolled", window.scrollY > 12);
  if (State.category !== "credits") {
    Elements.homeButton.classList.toggle("active", window.scrollY < 420);
    Elements.scriptsButton.classList.toggle("active", window.scrollY >= 420);
  }
}, { passive: true });
window.addEventListener("keydown", event => {
  const typing = ["INPUT", "TEXTAREA"].includes(document.activeElement.tagName);
  if (((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") || (event.key === "/" && !typing)) {
    event.preventDefault(); Elements.search.focus();
  }
  if (event.key === "Escape" && document.activeElement === Elements.search) { Elements.search.value = ""; State.query = ""; updateSearchControls(); renderScripts(); Elements.search.blur(); }
});

renderTabs();
renderScripts();
