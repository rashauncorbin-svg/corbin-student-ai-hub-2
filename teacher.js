(() => {
  "use strict";
  const KEY = "corbinHub.teacherPreview.v1";
  const $ = id => document.getElementById(id);
  const courseNames = {
    "us-history-standard": "U.S. History — Standard",
    "us-history-honors": "U.S. History — Honors",
    psychology: "Psychology",
    sociology: "Sociology"
  };
  let data = { classes: [], assignments: [] };
  try { data = { ...data, ...JSON.parse(localStorage.getItem(KEY) || "{}") }; } catch {}
  data.classes ||= [];
  data.assignments ||= [];
  const persist = () => {
    try { localStorage.setItem(KEY, JSON.stringify(data)); return true; }
    catch { window.alert("This browser could not save the preview data. Check local storage availability."); return false; }
  };
  const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
  function render() {
    $("classCount").textContent = String(data.classes.length).padStart(2, "0");
    $("assignmentCount").textContent = String(data.assignments.length).padStart(2, "0");
    $("classList").innerHTML = data.classes.length ? data.classes.map(item =>
      '<article class="teacher-record"><strong>' + escapeHtml(item.name) + '</strong><small>' +
      escapeHtml(courseNames[item.course] || item.course) + '</small><button type="button" data-delete-class="' + escapeHtml(item.id) + '">Remove preview class</button></article>'
    ).join("") : '<div class="empty-state">No local classes yet. Create a class to organize your planning workspace.</div>';
    $("assignmentList").innerHTML = data.assignments.length ? data.assignments.map(item =>
      '<article class="teacher-record"><strong>' + escapeHtml(item.title) + '</strong><small>' +
      escapeHtml(courseNames[item.course] || item.course) + ' · ' + escapeHtml(item.phase) +
      '</small><button type="button" data-delete-assignment="' + escapeHtml(item.id) + '">Remove assignment</button></article>'
    ).join("") : '<div class="empty-state">Your planned assignments will appear here.</div>';
    document.querySelectorAll("[data-delete-class]").forEach(button => button.addEventListener("click", () => {
      data.classes = data.classes.filter(item => item.id !== button.dataset.deleteClass);
      persist(); render();
    }));
    document.querySelectorAll("[data-delete-assignment]").forEach(button => button.addEventListener("click", () => {
      data.assignments = data.assignments.filter(item => item.id !== button.dataset.deleteAssignment);
      persist(); render();
    }));
  }
  $("classForm").addEventListener("submit", event => {
    event.preventDefault();
    const name = $("className").value.trim();
    if (!name) return;
    data.classes.push({ id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()), name, course: $("classCourse").value });
    if (persist()) { $("classForm").reset(); render(); }
  });
  $("assignmentForm").addEventListener("submit", event => {
    event.preventDefault();
    const title = $("assignmentTitle").value.trim();
    if (!title) return;
    data.assignments.push({
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      title, course: $("assignmentCourse").value, phase: $("assignmentPhase").value
    });
    if (persist()) { $("assignmentForm").reset(); render(); }
  });
  render();
})();
