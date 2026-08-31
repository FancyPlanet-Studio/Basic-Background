const state = { background: 0, time: 0, shape: 0, material: 0 };
const preloadedImages = [];

function preloadImages(items) {
  items.forEach(({ image }) => {
    const preload = new Image();
    preload.src = image;
    preloadedImages.push(preload);
  });
}

function showPreview(container, item) {
  container.dataset.imagePath = item.image;
  const image = new Image();
  image.alt = `${item.name} 샘플 이미지`;
  image.decoding = "async";

  image.onload = () => {
    if (container.dataset.imagePath !== item.image) return;
    container.replaceChildren(image);
  };

  image.onerror = () => {
    if (container.dataset.imagePath !== item.image || container.querySelector("img")) return;
    container.replaceChildren();
  };

  image.src = item.image;
}

function createOptionButton(item, isSelected, onSelect) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "option-button";
  button.setAttribute("aria-pressed", String(isSelected));
  button.innerHTML = `<span class="swatch" style="--swatch:${item.color}"></span><span>${item.name}</span>`;
  button.addEventListener("click", onSelect);
  return button;
}

function renderSelector({ key, items, optionsId, previewId }) {
  const selectedIndex = state[key];
  const options = document.getElementById(optionsId);

  options.replaceChildren(...items.map((item, index) =>
    createOptionButton(item, index === selectedIndex, () => {
      state[key] = index;
      renderSelector({ key, items, optionsId, previewId });
    })
  ));

  showPreview(document.getElementById(previewId), items[selectedIndex]);
}

function renderDeliveries() {
  const grid = document.getElementById("delivery-grid");
  const cards = pageData.deliveries.map((item, index) => {
    const card = document.createElement("article");
    card.className = "delivery-item";
    const title = document.createElement("h3");
    title.textContent = `${index + 1}. ${item.name}`;
    const preview = document.createElement("div");
    preview.className = "preview-frame preview-frame--delivery";
    showPreview(preview, item);
    card.append(title, preview);
    return card;
  });
  grid.replaceChildren(...cards);
}

function fileNumber(path) {
  const match = path.match(/(\d+)(?=\.[^.]+$)/);
  return match ? Number(match[1]) : 0;
}

function renderPortfolio() {
  const track = document.getElementById("portfolio-track");
  const { prefix, extension, maxItems, files = [] } = pageData.portfolio;
  const imagePaths = files.length
    ? [...files]
    : Array.from({ length: maxItems }, (_, index) => `${prefix}${String(index + 1).padStart(2, "0")}${extension}`);

  // 큰 번호가 가장 먼저 보이도록 정렬합니다. (Portfolio_09 → Portfolio_08 → ...)
  imagePaths.sort((a, b) => fileNumber(b) - fileNumber(a));

  let checked = 0;
  let visible = 0;
  const showEmptyMessage = () => {
    checked += 1;
    if (checked !== imagePaths.length || visible) return;
    track.innerHTML = '<article class="portfolio-item"><div class="preview-frame placeholder">등록된 포트폴리오 이미지가 없습니다.</div></article>';
  };

  imagePaths.forEach((path, order) => {
    const image = new Image();
    image.alt = "FANCY PLANET 작업 포트폴리오";
    image.onload = () => {
      const item = document.createElement("article");
      item.className = "portfolio-item";
      item.style.order = String(order);
      const frame = document.createElement("div");
      frame.className = "preview-frame";
      frame.append(image);
      item.append(frame);
      track.append(item);
      visible += 1;
      showEmptyMessage();
    };
    image.onerror = showEmptyMessage;
    image.src = path;
  });

  const move = (direction) => {
    const width = track.querySelector(".portfolio-item")?.offsetWidth || 300;
    track.scrollBy({ left: direction * (width + 16), behavior: "smooth" });
  };

  document.getElementById("portfolio-prev").addEventListener("click", () => move(-1));
  document.getElementById("portfolio-next").addEventListener("click", () => move(1));
}

function renderNotices() {
  const list = document.getElementById("notice-list");
  const notices = pageData.notices.map((notice, index) => {
    const item = document.createElement("article");
    item.className = "notice-item";
    item.innerHTML = `<span>${String(index + 1).padStart(2, "0")}</span><p></p>`;
    item.querySelector("p").textContent = notice;
    return item;
  });
  list.replaceChildren(...notices);
}

function renderInquiryFields() {
  const container = document.getElementById("inquiry-fields");
  const fields = pageData.inquiryFields.map((field, index) => {
    const wrap = document.createElement("div");
    wrap.className = "form-field";
    const number = document.createElement("span");
    number.className = "form-field__number";
    number.textContent = String(index + 1).padStart(2, "0");
    const content = document.createElement("div");
    const label = document.createElement("label");
    label.htmlFor = field.id;
    label.textContent = field.label;
    const description = document.createElement("small");
    description.className = "form-field__description";
    description.textContent = field.description;
    const control = createFieldControl(field);
    content.append(label, description, control);
    wrap.append(number, content);
    return wrap;
  });
  container.replaceChildren(...fields);
}

function createFieldControl(field) {
  let control;
  if (field.type === "textarea") {
    control = document.createElement("textarea");
    control.rows = 3;
  } else if (field.type === "select") {
    control = document.createElement("select");
    field.options.forEach((optionText) => control.add(new Option(optionText, optionText)));
  } else {
    control = document.createElement("input");
    control.type = field.type;
  }
  control.id = field.id;
  control.name = field.id;
  control.placeholder = field.placeholder || "";
  return control;
}

function inquiryText() {
  return pageData.inquiryFields.map((field, index) => {
    const value = document.getElementById(field.id).value.trim();
    return `${index + 1}. ${field.label}\n${value}`;
  }).join("\n\n");
}

let statusTimer;
function showCopyStatus(message) {
  const status = document.getElementById("copy-status");
  status.textContent = message;
  status.classList.add("is-visible");
  window.clearTimeout(statusTimer);
  statusTimer = window.setTimeout(() => status.classList.remove("is-visible"), 2600);
}

function legacyCopy(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.cssText = "position:fixed;left:-9999px;top:0;opacity:0";
  document.body.append(textarea);
  textarea.select();
  const copied = document.execCommand("copy");
  textarea.remove();
  return copied;
}

async function copyInquiry() {
  const text = inquiryText();
  try {
    if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(text);
    else if (!legacyCopy(text)) throw new Error("Copy failed");
    showCopyStatus("문의 내용이 복사되었습니다.");
  } catch {
    showCopyStatus(legacyCopy(text) ? "문의 내용이 복사되었습니다." : "복사 권한을 허용한 뒤 다시 시도해주세요.");
  }
}

function setupNavigationMarker() {
  if (!("IntersectionObserver" in window)) return;
  const links = [...document.querySelectorAll(".quick-nav a")];
  const sections = links.map((link) => document.querySelector(link.getAttribute("href"))).filter(Boolean);
  const observer = new IntersectionObserver((entries) => {
    const current = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!current) return;
    links.forEach((link) => link.classList.toggle("is-current", link.getAttribute("href") === `#${current.target.id}`));
  }, { rootMargin: "-35% 0px -55% 0px", threshold: [0.01, 0.15] });
  sections.forEach((section) => observer.observe(section));
}

function setupEmbeddedNavigation() {
  if (window.parent === window) return;

  document.querySelectorAll(".quick-nav a").forEach((link) => {
    link.addEventListener("click", () => {
      const target = document.querySelector(link.getAttribute("href"));
      if (!target) return;

      window.parent.postMessage({
        type: "fancy-planet:navigate",
        top: Math.round(target.getBoundingClientRect().top + window.scrollY)
      }, "*");
    });
  });
}

function reportEmbedHeight() {
  if (window.parent === window) return;
  // iframe의 임시 높이(예: 9000px)가 아니라 실제 페이지 내용 높이만 전달합니다.
  const height = Math.ceil(document.body.scrollHeight);
  window.parent.postMessage({ type: "fancy-planet:resize", height }, "*");
}

preloadImages([...pageData.backgrounds, ...pageData.times, ...pageData.shapes, ...pageData.materials]);
renderSelector({ key: "background", items: pageData.backgrounds, optionsId: "background-options", previewId: "background-preview" });
renderSelector({ key: "time", items: pageData.times, optionsId: "time-options", previewId: "time-preview" });
renderSelector({ key: "shape", items: pageData.shapes, optionsId: "shape-options", previewId: "shape-preview" });
renderSelector({ key: "material", items: pageData.materials, optionsId: "material-options", previewId: "material-preview" });
renderDeliveries();
renderPortfolio();
renderNotices();
renderInquiryFields();
document.getElementById("copy-inquiry").addEventListener("click", copyInquiry);
setupNavigationMarker();
setupEmbeddedNavigation();
window.addEventListener("load", reportEmbedHeight);
window.addEventListener("resize", reportEmbedHeight);
window.addEventListener("message", (event) => {
  if (event.data?.type === "fancy-planet:request-height") reportEmbedHeight();
});
if ("ResizeObserver" in window) new ResizeObserver(reportEmbedHeight).observe(document.documentElement);
