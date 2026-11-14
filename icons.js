/**
 * DAILY COMMUTE & EXPENSE TRACKER - PREMIUM ICON SYSTEM (icons.js)
 * High-polish vector SVG icon library built on official Lucide / Feather geometry.
 */

(function (window) {
  'use strict';

  // Precision-crafted Lucide vector definitions (24x24 viewBox, stroke-based)
  const SVG_DEFS = {
    // Transit & Travel Modes
    'rapido': '<circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="15" cy="5" r="1"/><path d="M12 17.5V14l-3-3 4-3 2 3h2"/>',
    'auto': '<path d="M10 2h4"/><path d="m21 8-2 2-1.5-3.7A2 2 0 0 0 15.64 5H8.4a2 2 0 0 0-1.9 1.3L5 10 3 8"/><rect width="18" height="12" x="3" y="10" rx="2"/><circle cx="7" cy="16" r="2"/><circle cx="17" cy="16" r="2"/>',
    'bus': '<path d="M4 6 2 7"/><path d="M10 6h4"/><path d="m22 7-2-1"/><rect width="16" height="16" x="4" y="3" rx="2"/><path d="M4 11h16"/><path d="M8 15h.01"/><path d="M16 15h.01"/><path d="M6 19v2"/><path d="M18 19v2"/>',
    'train': '<path d="M8 3.1V7a4 4 0 0 0 8 0V3.1"/><rect x="4" y="3" width="16" height="14" rx="2"/><path d="M4 11h16"/><circle cx="8" cy="15" r="1"/><circle cx="16" cy="15" r="1"/><path d="m9 19-2 3"/><path d="m15 19 2 3"/>',
    'fuel': '<line x1="3" x2="15" y1="22" y2="22"/><line x1="4" x2="14" y1="9" y2="9"/><path d="M14 22V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v18"/><path d="M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2a2 2 0 0 0 2-2V9.83a2 2 0 0 0-.59-1.42L18 5"/>',
    'travel': '<polygon points="3 11 22 2 13 21 11 13 3 11"/>',

    // Food, Chai & Daily Spends
    'tea': '<path d="M10 2v2"/><path d="M14 2v2"/><path d="M16 8a1 1 0 0 1 1 1v2a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h12Zm0 0h1a3 3 0 0 1 3 3v0a3 3 0 0 1-3 3h-1"/><path d="M6 2v2"/>',
    'food': '<path d="M18 2v20"/><path d="m21 15-3-3-3 3"/><path d="M21 2v6a3 3 0 0 1-3 3v0a3 3 0 0 1-3-3V2"/><path d="M6 2v20"/><path d="M3 2v6a3 3 0 0 0 3 3h0a3 3 0 0 0 3-3V2"/>',
    'groceries': '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>',
    'bills': '<rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/>',
    'other': '<path d="m12 3-1.9 5.8a2 2 0 0 1-1.287 1.288L3 12l5.8 1.9a2 2 0 0 1 1.288 1.287L12 21l1.9-5.8a2 2 0 0 1 1.287-1.288L21 12l-5.8-1.9a2 2 0 0 1-1.288-1.287Z"/>',

    // Payment Methods
    'upi': '<rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/><path d="M3 12h.01"/><path d="M12 3h.01"/><path d="M12 16v.01"/><path d="M16 12h1"/><path d="M21 12v.01"/><path d="M12 21v-1"/>',
    'cash': '<rect width="20" height="12" x="2" y="6" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/>',
    'card': '<rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/>',
    'metro-card': '<rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/><path d="M7 15h3"/>',

    // Controls & Feedback
    'moon': '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
    'sun': '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
    'zap': '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
    'refresh': '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>',
    'logout': '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/>',
    'cloud': '<path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>',
    'chevron-down': '<polyline points="6 9 12 15 18 9"/>',
    'user': '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',

    'check': '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
    'alert': '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/>',
    'trash': '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>',
    'target': '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    'currency': '<circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 6v12"/>',
    'ticket': '<path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 11v2"/><path d="M13 17v2"/>',
    'search': '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    'home': '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
    'notes': '<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/>',
    'calendar': '<rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/>',
    'bell': '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>'
  };

  // Direct emoji aliases to ensure legacy cached data or emoji keys automatically return SVG
  const EMOJI_ALIAS = {
    '🛵': 'rapido',
    '🛺': 'auto',
    '🚌': 'bus',
    '🚆': 'train',
    '☕': 'tea',
    '🍱': 'food',
    '⛽': 'fuel',
    '🛒': 'groceries',
    '📱': 'bills',
    '✨': 'other',
    '🚀': 'travel',
    '🍵': 'food',
    '🌙': 'moon',
    '☀️': 'sun',
    '⚡': 'zap',
    '🔄': 'refresh',
    '🚪': 'logout',
    '☁️': 'cloud',
    '☁': 'cloud',
    '💵': 'cash',
    '💳': 'card',
    '✅': 'check',
    '⚠️': 'alert',
    '🗑️': 'trash',
    '🗑': 'trash',
    '🎯': 'target',
    '💱': 'currency',
    '🔍': 'search',
    '🎫': 'ticket',
    '🏠': 'home',
    '📝': 'notes',
    '📅': 'calendar',
    '🗓️': 'calendar',
    '🗓': 'calendar',
    '🗒️': 'notes',
    '🗒': 'notes',
    'reminder': 'bell',
    'reminders': 'bell',
    '🔔': 'bell',
    '⏰': 'bell'
  };

  // Populate aliases into defs
  for (const [em, iconName] of Object.entries(EMOJI_ALIAS)) {
    if (SVG_DEFS[iconName]) {
      SVG_DEFS[em] = SVG_DEFS[iconName];
    }
  }

  const AppIcons = {
    defs: SVG_DEFS,
    aliases: EMOJI_ALIAS,

    /**
     * Get SVG HTML string for an icon or emoji key
     * @param {string} name - Name of the icon or emoji character
     * @param {number|object} [opts] - Size or options object
     * @returns {string} SVG HTML markup
     */
    get: function (name, opts) {
      const normalizedKey = EMOJI_ALIAS[name] || name;
      const def = SVG_DEFS[normalizedKey] || SVG_DEFS[name] || SVG_DEFS['other'];
      let size = 20;
      let strokeWidth = 2;
      let className = 'svg-icon';
      let stroke = 'currentColor';
      let fill = 'none';

      if (typeof opts === 'number') {
        size = opts;
      } else if (typeof opts === 'object' && opts !== null) {
        if (opts.size) size = opts.size;
        if (opts.strokeWidth) strokeWidth = opts.strokeWidth;
        if (opts.className) className = `${className} ${opts.className}`;
        if (opts.stroke) stroke = opts.stroke;
        if (opts.fill) fill = opts.fill;
      }

      return `<svg class="${className}" viewBox="0 0 24 24" width="${size}" height="${size}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${def}</svg>`;
    },

    /**
     * Scan DOM element and replace any lingering emoji text nodes with SVG icons
     */
    cleanDomEmojis: function (root = document.body) {
      if (!root) return;
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
      const textNodes = [];
      let node;
      while ((node = walker.nextNode())) {
        if (node.nodeValue && /[\uD83C-\uDBFF\uDC00-\uDFFF\u2600-\u27BF]/.test(node.nodeValue)) {
          textNodes.push(node);
        }
      }

      textNodes.forEach(tNode => {
        const parent = tNode.parentNode;
        if (!parent || parent.tagName === 'SCRIPT' || parent.tagName === 'STYLE') return;
        let str = tNode.nodeValue;
        let hasEmoji = false;
        for (const [emojiChar, iconKey] of Object.entries(EMOJI_ALIAS)) {
          if (str.includes(emojiChar)) {
            hasEmoji = true;
            const svgHtml = AppIcons.get(iconKey, 18);
            str = str.split(emojiChar).join(svgHtml);
          }
        }
        if (hasEmoji) {
          const span = document.createElement('span');
          span.innerHTML = str;
          parent.replaceChild(span, tNode);
        }
      });
    }
  };

  window.AppIcons = AppIcons;

  // Auto clean any emojis that appear dynamically
  document.addEventListener('DOMContentLoaded', () => {
    AppIcons.cleanDomEmojis();
  });
})(window);
