const NOTES_WINDOW_NAME = 'reveal.js - Notes'
const BG = '#11111b' // catppuccin mocha crust
const TEXT = '#cdd6f4' // catppuccin mocha text
const MUTED = '#9399b2' // catppuccin mocha overlay2

function notesThemeCss(): string {
	return `
		html, body {
			background: ${BG} !important;
			color: ${TEXT} !important;
		}
		#connection-status {
			background: ${BG} !important;
			color: ${TEXT} !important;
		}
		#speaker-controls,
		.speaker-controls-time,
		.speaker-controls-pace {
			color: ${TEXT} !important;
			border-color: rgba(205, 214, 244, 0.15) !important;
		}
		.speaker-controls-time .label,
		.speaker-controls-notes .label {
			color: ${MUTED} !important;
		}
		#current-slide iframe,
		#upcoming-slide iframe {
			background: ${BG} !important;
			border-color: rgba(205, 214, 244, 0.15) !important;
		}
	`
}

function injectNotesTheme(win: Window, attempts = 40): void {
	try {
		const doc = win.document
		if (!doc?.head || !doc.body) {
			if (attempts > 0) {
				setTimeout(() => injectNotesTheme(win, attempts - 1), 50)
			}
			return
		}
		if (doc.getElementById('ctp-notes-theme')) return
		const style = doc.createElement('style')
		style.id = 'ctp-notes-theme'
		style.textContent = notesThemeCss()
		doc.head.appendChild(style)
	} catch {
		// window closed or cross-origin - nothing to do
	}
}

export function initNotesTheme(): void {
	if (typeof window === 'undefined') return
	const original = window.open
	window.open = ((...args: Parameters<typeof window.open>) => {
		const win = original.apply(window, args)
		if (win && args[1] === NOTES_WINDOW_NAME) {
			// the notes plugin calls document.write() right after open(), so
			// inject after the current task to avoid being wiped
			setTimeout(() => injectNotesTheme(win), 0)
			win.addEventListener('load', () => injectNotesTheme(win))
		}
		return win
	}) as typeof window.open
}
