/* Data and state */
const state = { background: 0, time: 0, shape: 0, material: 0 };

/* Option previews */
function createOptionButton(item, index, selected, onSelect) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "option-button";
  button.setAttribute("aria-pressed", String(index === selected));
  button.innerHTML = `<span class="swatch" style="--swatch:${item.color}"></span><span>${item.name}</span>`;
  button.addEventListener("click", onSelect);
  return button;
}

function makeImagePreview(container, item, variant) {
  container.replaceChildren();
  container.classList.remove("is-loaded");
  const placeholder = document.createElement("div");
  placeholder.className = "placeholder";
  placeholder.innerHTML = `<span>${item.name}</span><small>${item.image}</small>`;
  container.append(placeholder);
  const image = new Image();
  image.alt = `${item.name} 샘플 이미지`;
  image.onload = () => { container.replaceChildren(image); container.classList.add("is-loaded"); };
  image.onerror = () => { /* The designed placeholder remains, so no broken image is exposed. */ };
  image.src = item.image;
  if (variant) container.dataset.variant = variant;
}

function renderSelector(config) {
  const { key, items, optionsId, previewId, nameId, pathId } = config;
  const options = document.getElementById(optionsId);
  const selected = state[key];
  options.replaceChildren(...items.map((item, index) => createOptionButton(item, index, selected, () => {
    state[key] = index;
    renderSelector(config);
  })));
  const item = items[selected];
  makeImagePreview(document.getElementById(previewId), item, key);
  document.getElementById(nameId).textContent = item.name;
  document.getElementById(pathId).textContent = item.image;
}

function renderDeliveries() {
  const grid = document.getElementById("delivery-grid");
  pageData.deliveries.forEach((item, index) => {
    const article = document.createElement("article");
    article.className = "delivery-item";
    const title = document.createElement("h3");
    title.textContent = `${String(index + 1).padStart(2, "0")}  ${item.name}`;
    const frame = document.createElement("div");
    frame.className = "preview-frame preview-frame--delivery";
    makeImagePreview(frame, item, "delivery");
    article.append(title, frame);
    grid.append(article);
  });
}

function renderPortfolio() {
  const track = document.getElementById("portfolio-track");
  const { prefix, extension, maxItems } = pageData.portfolio;
  let checkedImages = 0;
  let visibleImages = 0;

  const finishImageCheck = () => {
    checkedImages += 1;
    if (checkedImages !== maxItems || visibleImages !== 0) return;
    const article = document.createElement("article");
    article.className = "portfolio-item";
    const frame = document.createElement("div");
    frame.className = "preview-frame";
    const placeholder = document.createElement("div");
    placeholder.className = "placeholder";
    placeholder.innerHTML = "<span>작업 포트폴리오</span><small>이미지를 추가하면 이곳에 표시됩니다.</small>";
    frame.append(placeholder);
    article.append(frame);
    track.append(article);
  };

  for (let index = 1; index <= maxItems; index += 1) {
    const number = String(index).padStart(2, "0");
    const item = {
      image: `${prefix}${number}${extension}`,
      alt: `FANCY PLANET 작업 포트폴리오 ${number}`
    };
    const article = document.createElement("article");
    article.className = "portfolio-item";
    article.style.order = String(index);
    const frame = document.createElement("div");
    frame.className = "preview-frame";
    const image = new Image();
    image.alt = item.alt;
    image.onload = () => {
      frame.append(image);
      article.append(frame);
      track.append(article);
      visibleImages += 1;
      finishImageCheck();
    };
    image.onerror = () => {
      finishImageCheck();
    };
    image.src = item.image;
  }

  const movePortfolio = (direction) => {
    const amount = track.querySelector(".portfolio-item")?.offsetWidth || 300;
    track.scrollBy({ left: direction * (amount + 16), behavior: "smooth" });
  };
  document.getElementById("portfolio-prev").addEventListener("click", () => movePortfolio(-1));
  document.getElementById("portfolio-next").addEventListener("click", () => movePortfolio(1));
}

function renderNotices() {
  const list = document.getElementById("notice-list");
  pageData.notices.forEach((notice, index) => {
    const article = document.createElement("article");
    article.className = "notice-item";
    article.innerHTML = `<span>${String(index + 1).padStart(2, "0")}</span><p></p>`;
    article.querySelector("p").textContent = notice;
    list.append(article);
  });
}

/* Inquiry form */
function renderInquiryFields() {
  const container = document.getElementById("inquiry-fields");
  pageData.inquiryFields.forEach((field, index) => {
    const fieldWrap = document.createElement("div");
    fieldWrap.className = "form-field";
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
    let control;
    if (field.type === "textarea") {
      control = document.createElement("textarea");
      control.rows = 3;
      control.placeholder = field.placeholder;
    } else if (field.type === "select") {
      control = document.createElement("select");
      field.options.forEach((optionText) => {
        const option = document.createElement("option");
        option.value = optionText;
        option.textContent = optionText;
        control.append(option);
      });
    } else {
      control = document.createElement("input");
      control.type = field.type;
      control.placeholder = field.placeholder;
    }
    control.id = field.id;
    control.name = field.id;
    content.append(label, description, control);
    fieldWrap.append(number, content);
    container.append(fieldWrap);
  });
}

function buildInquiryText() {
  const answers = pageData.inquiryFields.map((field, index) => {
    const value = document.getElementById(field.id).value.trim();
    return `${index + 1}. ${field.label}\n${value}`;
  });
  return answers.join("\n\n");
}

let copyStatusTimeout;
function showCopyStatus(message) {
  const status = document.getElementById("copy-status");
  status.textContent = message;
  status.classList.add("is-visible");
  window.clearTimeout(copyStatusTimeout);
  copyStatusTimeout = window.setTimeout(() => status.classList.remove("is-visible"), 2600);
}

function copyWithSelection(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.cssText = "position:fixed;left:-9999px;top:0;opacity:0;pointer-events:none";
  document.body.append(textarea);
  textarea.focus({ preventScroll: true });
  textarea.select();
  textarea.setSelectionRange(0, textarea.value.length);
  const copied = document.execCommand("copy");
  textarea.remove();
  return copied;
}

async function copyInquiry() {
  const text = buildInquiryText();
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      showCopyStatus("문의 내용이 복사되었습니다.");
      return;
    }
    if (copyWithSelection(text)) {
      showCopyStatus("문의 내용이 복사되었습니다.");
      return;
    }
    throw new Error("Clipboard is unavailable");
  } catch {
    const copied = copyWithSelection(text);
    showCopyStatus(copied ? "문의 내용이 복사되었습니다." : "복사 권한이 차단되었습니다. 브라우저에서 복사를 허용한 뒤 다시 시도해주세요.");
  }
}

/* Current navigation marker */
function setupNavigationMarker() {
  const links = [...document.querySelectorAll(".quick-nav a")];
  const sections = links.map((link) => document.querySelector(link.getAttribute("href"))).filter(Boolean);
  if (!("IntersectionObserver" in window)) return;
  const observer = new IntersectionObserver((entries) => {
    const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    links.forEach((link) => link.classList.toggle("is-current", link.getAttribute("href") === `#${visible.target.id}`));
  }, { rootMargin: "-35% 0px -55% 0px", threshold: [0.01, 0.15] });
  sections.forEach((section) => observer.observe(section));
}

renderSelector({ key: "background", items: pageData.backgrounds, optionsId: "background-options", previewId: "background-preview", nameId: "background-name", pathId: "background-path" });
renderSelector({ key: "time", items: pageData.times, optionsId: "time-options", previewId: "time-preview", nameId: "time-name", pathId: "time-path" });
renderSelector({ key: "shape", items: pageData.shapes, optionsId: "shape-options", previewId: "shape-preview", nameId: "shape-name", pathId: "shape-path" });
renderSelector({ key: "material", items: pageData.materials, optionsId: "material-options", previewId: "material-preview", nameId: "material-name", pathId: "material-path" });
renderDeliveries();
renderPortfolio();
renderNotices();
renderInquiryFields();
document.getElementById("copy-inquiry").addEventListener("click", copyInquiry);
setupNavigationMarker();

/* Artmug iframe bridge: report the document height to the parent page. */
function reportEmbedHeight() {
  if (window.parent === window) return;
  const height = Math.max(
    document.documentElement.scrollHeight,
    document.body.scrollHeight,
    document.documentElement.offsetHeight,
    document.body.offsetHeight
  );
  window.parent.postMessage({ type: "fancy-planet:resize", height }, "*");
}

window.addEventListener("load", reportEmbedHeight);
window.addEventListener("resize", reportEmbedHeight);
window.addEventListener("message", (event) => {
  if (event.data?.type === "fancy-planet:request-height") reportEmbedHeight();
});

if ("ResizeObserver" in window) {
  const observer = new ResizeObserver(reportEmbedHeight);
  observer.observe(document.documentElement);
}
