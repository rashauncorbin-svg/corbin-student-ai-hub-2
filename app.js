(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const STORAGE_KEY = "corbinHub.studentPreview.v1";
  const phases = [
    { key: "learn", label: "Learn It", prompt: "Build the background knowledge needed to understand the essential question.", heading: "Build the foundation", body: "Identify the key people, events, concepts, and vocabulary. Separate what happened from why it mattered.", task: "Write one important fact from the lesson and explain why it matters." },
    { key: "process", label: "Process It", prompt: "Make connections, examine evidence, and recognize patterns.", heading: "Make meaning from evidence", body: "Compare perspectives, identify cause-and-effect relationships, and connect evidence to the essential question.", task: "What connection or pattern do you notice? Use a specific detail to explain it." },
    { key: "defend", label: "Defend It", prompt: "Develop a claim and support it with relevant evidence and reasoning.", heading: "Support your thinking", body: "Make a clear claim. Select relevant evidence. Explain how the evidence supports your reasoning rather than simply repeating it.", task: "Write a claim and support it with one piece of evidence and reasoning." },
    { key: "apply", label: "Apply It", prompt: "Transfer what you learned to a new situation, source, or problem.", heading: "Use what you know", body: "Apply the concept to a new example. Consider whether the same explanation works in a different context.", task: "Apply today's learning to a new example or situation." },
    { key: "reflect", label: "Reflect On It", prompt: "Evaluate your growth, identify uncertainty, and set a next step.", heading: "Check your growth", body: "Consider what you understand now, what changed in your thinking, and what question you still need to investigate.", task: "What is clearer now, and what do you still need to understand?" }
  ];
  const courses = {
    history: { name: "U.S. History — Standard", title: "Reconstruction: Promise and Limits", subject: "SOCIAL STUDIES · STANDARD", question: "To what extent did Reconstruction fulfill the promises of freedom and citizenship after the Civil War?" },
    honors: { name: "U.S. History — Honors", title: "Reconstruction: Competing Visions of Freedom", subject: "SOCIAL STUDIES · HONORS", question: "Why did competing visions of freedom and federal power shape the outcomes of Reconstruction?" },
    psychology: { name: "Psychology", title: "Understanding Human Behavior", subject: "PSYCHOLOGY", question: "How do biological, cognitive, and social factors influence human behavior?" },
    sociology: { name: "Sociology", title: "Culture, Groups & Society", subject: "SOCIOLOGY", question: "How do social structures and cultural expectations shape individual behavior?" }
  };

  function readState() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); }
    catch { return {}; }
  }
  let state = readState();
  state.responses ||= {};
  state.completed ||= [];
  state.activePhase ||= {};
  function saveState() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); return true; }
    catch { return false; }
  }

  const viewNames = { home: "Overview", courses: "My courses", path: "Learning path", tutor: "AI study partner", lesson: "Lesson player" };
  function showView(name) {
    $$(".view").forEach(view => view.classList.toggle("active", view.id === name + "View"));
    $$(".nav-link").forEach(button => button.classList.toggle("active", button.dataset.view === name));
    $("#crumb").textContent = viewNames[name] || "Overview";
    $("#sidebar").classList.remove("open");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  $$("[data-view]").forEach(button => button.addEventListener("click", () => showView(button.dataset.view)));
  $("#mobileMenu").addEventListener("click", () => $("#sidebar").classList.toggle("open"));
  $("#todayLabel").textContent = new Intl.DateTimeFormat(undefined, { weekday: "short", month: "short", day: "numeric" }).format(new Date());

  let activeCourse = "history";
  let activePhase = "learn";
  function lessonKey() { return activeCourse + ":reconstruction-lesson-07"; }
  function responseKey() { return lessonKey() + ":" + activePhase; }

  function renderLesson(courseId) {
    activeCourse = courses[courseId] ? courseId : "history";
    const course = courses[activeCourse];
    activePhase = state.activePhase[activeCourse] || "learn";
    $(".lesson-toolbar .lesson-course").textContent = course.subject;
    $(".lesson-hero .eyebrow").textContent = "LESSON 07 · " + phases.find(p => p.key === activePhase).label.toUpperCase();
    $(".lesson-hero h1").textContent = course.title;
    $(".lesson-hero > p").textContent = "Work through the lesson using the five moves of the Corbin Learning System.";
    $(".essential-question").textContent = course.question;

    const outline = $(".lesson-outline");
    outline.innerHTML = '<strong>THE LEARNING SEQUENCE</strong>' + phases.map((p, i) =>
      '<button type="button" class="phase-link ' + (p.key === activePhase ? "selected" : "") + '" data-phase="' + p.key + '">' +
      String(i + 1).padStart(2, "0") + " &nbsp; " + p.label + "</button>"
    ).join("");

    const reading = $(".lesson-reading");
    const phase = phases.find(p => p.key === activePhase);
    const saved = state.responses[responseKey()] || "";
    reading.innerHTML = '<div class="eyebrow">' + String(phases.indexOf(phase) + 1).padStart(2, "0") + " / " + phase.label.toUpperCase() + '</div>' +
      '<h2>' + phase.heading + '</h2><p class="phase-prompt">' + phase.prompt + '</p>' +
      '<p>' + phase.body + '</p>' +
      (activePhase === "learn" ? '<p class="essential-question">' + course.question + '</p>' : '') +
      '<div class="checkpoint"><span class="checkpoint-label">THINKING CHECKPOINT</span><h3>Show your thinking</h3>' +
      '<p>' + phase.task + '</p><textarea id="checkpointAnswer" placeholder="Write your thinking here..."></textarea>' +
      '<div class="checkpoint-actions"><button class="primary-button" id="saveCheckpoint">Save response <span>→</span></button>' +
      '<button class="secondary-button" id="nextPhase">' + (activePhase === "reflect" ? "Finish lesson" : "Next CLS phase") + ' →</button></div>' +
      '<small id="checkpointStatus" aria-live="polite"></small></div>';
    $("#checkpointAnswer").value = saved;
    $$("[data-phase]", outline).forEach(button => button.addEventListener("click", () => setPhase(button.dataset.phase)));
    $("#saveCheckpoint").addEventListener("click", saveCheckpoint);
    $("#nextPhase").addEventListener("click", nextPhase);
  }

  function setPhase(key) {
    if (!phases.some(p => p.key === key)) return;
    activePhase = key;
    state.activePhase[activeCourse] = key;
    saveState();
    renderLesson(activeCourse);
  }
  function saveCheckpoint() {
    const answer = $("#checkpointAnswer").value.trim();
    const status = $("#checkpointStatus");
    if (!answer) {
      status.textContent = "Add your thinking before saving.";
      status.style.color = "#a36d36";
      return false;
    }
    state.responses[responseKey()] = answer;
    saveState();
    status.textContent = "Saved on this device. Sign-in and a secure school database are not connected yet.";
    status.style.color = "#4e9369";
    return true;
  }
  function nextPhase() {
    const saved = saveCheckpoint();
    if (!saved) return;
    const index = phases.findIndex(p => p.key === activePhase);
    if (index === phases.length - 1) {
      if (!state.completed.includes(lessonKey())) state.completed.push(lessonKey());
      saveState();
      updateDashboard();
      $("#checkpointStatus").textContent = "Lesson marked complete on this device. Your progress is not yet synced to a teacher account.";
      return;
    }
    setPhase(phases[index + 1].key);
  }

  function openCourse(courseId) {
    renderLesson(courseId);
    showView("lesson");
  }
  $$("[data-course]").forEach(button => button.addEventListener("click", () => openCourse(button.dataset.course)));
  $("#openLesson").addEventListener("click", () => openCourse("history"));
  $("#backHome").addEventListener("click", () => showView("home"));

  const allCourses = $("#allCourses");
  if (allCourses) {
    $$(".course-card", $("#courseGrid")).forEach(card => allCourses.appendChild(card.cloneNode(true)));
    $$("[data-course]", allCourses).forEach(button => button.addEventListener("click", () => openCourse(button.dataset.course)));
  }

  function updateDashboard() {
    const completed = state.completed.length;
    const responseCount = Object.keys(state.responses).filter(key => state.responses[key]).length;
    const lessonStat = $$(".stat-card")[1];
    if (lessonStat) {
      $(".stat-value", lessonStat).textContent = String(completed).padStart(2, "0");
      $(".stat-foot", lessonStat).textContent = responseCount + " saved thinking checkpoints on this device";
    }
    const progress = Math.min(100, Math.round(completed / 4 * 100));
    const progressStat = $$(".stat-card")[3];
    if (progressStat) {
      $(".stat-value", progressStat).innerHTML = progress + '<span class="percent">%</span>';
      $(".progress-track span", progressStat).style.width = progress + "%";
    }
  }
  updateDashboard();

  const chatMessages = $("#chatMessages"), chatForm = $("#chatForm"), chatInput = $("#chatInput");
  function appendMessage(text, kind) {
    const node = document.createElement("div");
    node.className = kind === "user" ? "user-message" : "assistant-message";
    node.textContent = text;
    chatMessages.appendChild(node);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  function guidedReply(question) {
    const q = question.toLowerCase();
    if (/quiz|test me|practice/.test(q)) return "Let's practice one question at a time. First: what is the central idea you're studying? Answer in your own words, and I'll help you check the reasoning. (Guided preview; no live AI is connected.)";
    if (/argument|claim|thesis|evidence/.test(q)) return "Let's strengthen the argument. State your claim in one sentence. Then identify the strongest specific evidence you have. What makes that evidence relevant? (Guided preview; no live AI is connected.)";
    if (/understand|explain|confus|main idea/.test(q)) return "Let's break it down. What is the topic, and which part is confusing: the key idea, the sequence of events, the vocabulary, or why it matters? (Guided preview; no live AI is connected.)";
    return "Let's unpack that using the Corbin Learning System. What do you already know? What evidence supports your current thinking? What is one question you still need to answer? (Guided preview; no live AI is connected.)";
  }
  function sendMessage(value) {
    const clean = value.trim();
    if (!clean) return;
    appendMessage(clean, "user");
    appendMessage(guidedReply(clean), "assistant");
    chatInput.value = "";
  }
  chatForm.addEventListener("submit", event => { event.preventDefault(); sendMessage(chatInput.value); });
  $$("[data-prompt]").forEach(button => button.addEventListener("click", () => {
    showView("tutor");
    sendMessage(button.dataset.prompt);
  }));

  // Clear, local-only preview reset. This does not touch a school account or server.
  const reset = $("#resetPreview");
  if (reset) reset.addEventListener("click", () => {
    if (!window.confirm("Clear this browser's saved preview responses and progress?")) return;
    localStorage.removeItem(STORAGE_KEY);
    state = { responses: {}, completed: [], activePhase: {} };
    updateDashboard();
    renderLesson(activeCourse);
  });
})();
