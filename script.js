const tasks = [];
const dependencies = [];

const form = document.getElementById('task-form');
const nameInput = document.getElementById('task-name');
const depSelect = document.getElementById('task-dependency');
const diagramEl = document.getElementById('mermaid-diagram');

function sanitize(name) {
  return name.replace(/\s+/g, '_');
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = nameInput.value.trim();
  if (!name) return;

  const id = sanitize(name);
  tasks.push({ id, name });
  const dep = depSelect.value;
  if (dep) dependencies.push({ from: dep, to: id });

  // update dependency dropdown
  const option = document.createElement('option');
  option.value = id;
  option.textContent = name;
  depSelect.appendChild(option);

  nameInput.value = '';
  depSelect.value = '';
  renderChart();
});

function renderChart() {
  let def = 'flowchart TD\n';
  tasks.forEach(t => {
    def += `${t.id}[${t.name}]\n`;
  });
  dependencies.forEach(d => {
    def += `${d.from}-->${d.to}\n`;
  });
  diagramEl.innerHTML = def;
  mermaid.init(undefined, diagramEl);
}

renderChart();
