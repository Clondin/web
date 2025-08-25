(() => {
	/** @type {HTMLButtonElement} */
	const newNoteButton = document.getElementById('new-note');
	/** @type {HTMLButtonElement} */
	const exportButton = document.getElementById('export-notes');
	/** @type {HTMLInputElement} */
	const importFileInput = document.getElementById('import-file');
	/** @type {HTMLButtonElement} */
	const themeToggleButton = document.getElementById('toggle-theme');
	/** @type {HTMLInputElement} */
	const searchInput = document.getElementById('search');
	/** @type {HTMLUListElement} */
	const notesListElement = document.getElementById('notes-list');
	/** @type {HTMLInputElement} */
	const noteTitleInput = document.getElementById('note-title');
	/** @type {HTMLTextAreaElement} */
	const noteBodyTextarea = document.getElementById('note-body');
	/** @type {HTMLButtonElement} */
	const saveButton = document.getElementById('save-note');
	/** @type {HTMLButtonElement} */
	const deleteButton = document.getElementById('delete-note');
	/** @type {HTMLButtonElement} */
	const pinButton = document.getElementById('pin-note');

	/**
	 * @typedef {Object} Note
	 * @property {string} id
	 * @property {string} title
	 * @property {string} body
	 * @property {number} updatedAt
	 * @property {boolean} pinned
	 */

	/** @type {Note[]} */
	let notes = [];
	/** @type {string|null} */
	let activeNoteId = null;

	const STORAGE_KEY = 'simple-notes.v1';

	function loadNotes() {
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (!raw) return [];
			const parsed = JSON.parse(raw);
			if (!Array.isArray(parsed)) return [];
			return parsed.map(n => ({
				id: n.id || crypto.randomUUID(),
				title: typeof n.title === 'string' ? n.title : '',
				body: typeof n.body === 'string' ? n.body : '',
				updatedAt: typeof n.updatedAt === 'number' ? n.updatedAt : Date.now(),
				pinned: !!n.pinned,
			}));
		} catch {
			return [];
		}
	}

	function saveNotes() {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
	}

	function createEmptyNote() {
		return {
			id: crypto.randomUUID(),
			title: '',
			body: '',
			updatedAt: Date.now(),
			pinned: false,
		};
	}

	function setActiveNote(noteId) {
		activeNoteId = noteId;
		renderNotesList();
		const note = notes.find(n => n.id === noteId);
		if (note) {
			noteTitleInput.value = note.title;
			noteBodyTextarea.value = note.body;
			noteTitleInput.focus();
		}
	}

	function upsertActiveNoteFromInputs() {
		if (!activeNoteId) return;
		const idx = notes.findIndex(n => n.id === activeNoteId);
		if (idx === -1) return;
		notes[idx] = {
			...notes[idx],
			title: noteTitleInput.value.trim(),
			body: noteBodyTextarea.value,
			updatedAt: Date.now(),
		};
		saveNotes();
		renderNotesList();
	}

	function deleteActiveNote() {
		if (!activeNoteId) return;
		notes = notes.filter(n => n.id !== activeNoteId);
		saveNotes();
		activeNoteId = notes[0]?.id ?? null;
		renderNotesList();
		renderEditor();
	}

	function renderEditor() {
		const note = notes.find(n => n.id === activeNoteId);
		if (!note) {
			noteTitleInput.value = '';
			noteBodyTextarea.value = '';
			pinButton.disabled = true;
			pinButton.setAttribute('aria-pressed', 'false');
			pinButton.textContent = 'Pin';
			return;
		}
		noteTitleInput.value = note.title;
		noteBodyTextarea.value = note.body;
		pinButton.disabled = false;
		pinButton.setAttribute('aria-pressed', String(!!note.pinned));
		pinButton.textContent = note.pinned ? 'Unpin' : 'Pin';
	}

	function matchesQuery(note, query) {
		if (!query) return true;
		const q = query.toLowerCase();
		return (
			note.title.toLowerCase().includes(q) ||
			note.body.toLowerCase().includes(q)
		);
	}

	function renderNotesList() {
		const query = searchInput.value.trim();
		const sorted = [...notes]
			.filter(n => matchesQuery(n, query))
			.sort((a, b) => (Number(b.pinned) - Number(a.pinned)) || (b.updatedAt - a.updatedAt));

		notesListElement.innerHTML = '';
		for (const note of sorted) {
			const li = document.createElement('li');
			li.dataset.id = note.id;
			li.className = `${note.id === activeNoteId ? 'active ' : ''}${note.pinned ? 'pinned' : ''}`.trim();
			li.setAttribute('role', 'button');
			li.tabIndex = 0;
			const title = note.title || 'Untitled';
			const preview = note.body.replace(/\n/g, ' ').slice(0, 80);
			li.innerHTML = `<span class="title">${escapeHtml(title)}</span><span class="preview">${escapeHtml(preview)}</span>`;
			li.addEventListener('click', () => setActiveNote(note.id));
			li.addEventListener('keydown', (e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					setActiveNote(note.id);
				}
			});
			if (note.id === activeNoteId) {
				li.setAttribute('aria-current', 'true');
			} else {
				li.removeAttribute('aria-current');
			}
			notesListElement.appendChild(li);
		}
	}

	function escapeHtml(str) {
		return str
			.replaceAll('&', '&amp;')
			.replaceAll('<', '&lt;')
			.replaceAll('>', '&gt;');
	}

	function debounce(fn, wait) {
		let t = 0;
		return (...args) => {
			clearTimeout(t);
			t = setTimeout(() => fn.apply(null, args), wait);
		};
	}

	// Event bindings
	newNoteButton.addEventListener('click', () => {
		const note = createEmptyNote();
		notes.unshift(note);
		saveNotes();
		setActiveNote(note.id);
		renderEditor();
	});

	saveButton.addEventListener('click', () => {
		upsertActiveNoteFromInputs();
	});

	deleteButton.addEventListener('click', () => {
		if (!activeNoteId) return;
		if (confirm('Delete this note?')) {
			deleteActiveNote();
		}
	});

	pinButton.addEventListener('click', () => {
		if (!activeNoteId) return;
		const idx = notes.findIndex(n => n.id === activeNoteId);
		if (idx === -1) return;
		notes[idx].pinned = !notes[idx].pinned;
		notes[idx].updatedAt = Date.now();
		saveNotes();
		renderNotesList();
		renderEditor();
	});

	noteTitleInput.addEventListener('input', debounce(() => upsertActiveNoteFromInputs(), 300));
	noteBodyTextarea.addEventListener('input', debounce(() => upsertActiveNoteFromInputs(), 300));
	searchInput.addEventListener('input', () => renderNotesList());

	// Keyboard shortcuts
	document.addEventListener('keydown', (e) => {
		if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
			e.preventDefault();
			upsertActiveNoteFromInputs();
		}
		if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
			e.preventDefault();
			newNoteButton.click();
		}
		if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'e') {
			e.preventDefault();
			exportButton.click();
		}
		if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
			e.preventDefault();
			pinButton.click();
		}
	});

	// Export / Import
	exportButton.addEventListener('click', () => {
		const data = JSON.stringify(notes, null, 2);
		const blob = new Blob([data], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `notes-${new Date().toISOString().slice(0,10)}.json`;
		document.body.appendChild(a);
		a.click();
		a.remove();
		URL.revokeObjectURL(url);
	});

	importFileInput.addEventListener('change', async () => {
		const file = importFileInput.files?.[0];
		if (!file) return;
		try {
			const text = await file.text();
			const imported = JSON.parse(text);
			if (!Array.isArray(imported)) throw new Error('Invalid format');
			const normalized = imported.map(n => ({
				id: n.id || crypto.randomUUID(),
				title: typeof n.title === 'string' ? n.title : '',
				body: typeof n.body === 'string' ? n.body : '',
				updatedAt: typeof n.updatedAt === 'number' ? n.updatedAt : Date.now(),
				pinned: !!n.pinned,
			}));
			if (!confirm('Replace existing notes with imported notes?')) return;
			notes = normalized;
			saveNotes();
			activeNoteId = notes[0]?.id || null;
			renderNotesList();
			renderEditor();
		} catch (err) {
			alert('Failed to import notes. Ensure the file is a valid JSON export.');
		} finally {
			importFileInput.value = '';
		}
	});

	// Theme
	function applyTheme(theme) {
		document.documentElement.setAttribute('data-theme', theme);
		localStorage.setItem('simple-notes.theme', theme);
		themeToggleButton.textContent = theme === 'light' ? 'Dark' : 'Light';
		themeToggleButton.setAttribute('aria-label', `Switch to ${theme === 'light' ? 'dark' : 'light'} mode`);
	}
	const savedTheme = localStorage.getItem('simple-notes.theme') || 'dark';
	applyTheme(savedTheme);
	
	themeToggleButton.addEventListener('click', () => {
		const current = document.documentElement.getAttribute('data-theme') || 'dark';
		applyTheme(current === 'dark' ? 'light' : 'dark');
	});

	// Init
	notes = loadNotes();
	if (notes.length === 0) {
		const first = createEmptyNote();
		first.title = 'Welcome';
		first.body = 'Start typing your notes here.';
		notes.push(first);
	}
	activeNoteId = notes[0].id;
	renderNotesList();
	renderEditor();
})();