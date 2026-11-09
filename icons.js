/**
 * DAILY COMMUTE & EXPENSE TRACKER - ICONS SYSTEM (icons.js)
 * Clean, modern vector SVG icons to replace system emojis across all platforms.
 */

(function (window) {
  'use strict';

  const SVG_DEFS = {
    // Transit & Travel
    'rapido': '<circle cx="5.5" cy="17.5" r="2.8"/><circle cx="18.5" cy="17.5" r="2.8"/><path d="M15 6h3.5"/><path d="M16 6l-2.5 7H7.5"/><path d="M10 13l-4.5 4.5"/><path d="M12 10h4"/>',
    'auto': '<circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M3.5 14h2l2.5-8h7l3 6h2.5v3.5h-2"/><path d="M8.5 18h7"/><path d="M8 6.5v6.5h6.5V6.5"/><line x1="16" y1="10" x2="18" y2="10"/>',
    'bus': '<rect x="4" y="3" width="16" height="15" rx="3"/><line x1="4" y1="10" x2="20" y2="10"/><circle cx="8" cy="14.5" r="1.2" fill="currentColor"/><circle cx="16" cy="14.5" r="1.2" fill="currentColor"/><path d="M6 18v2.5M18 18v2.5"/><line x1="10" y1="6" x2="14" y2="6"/>',
    'train': '<rect x="4" y="3" width="16" height="14" rx="3"/><path d="M4 10h16"/><circle cx="8" cy="14" r="1" fill="currentColor"/><circle cx="16" cy="14" r="1" fill="currentColor"/><path d="m8 17-3 3M16 17l3 3"/><line x1="9" y1="6" x2="15" y2="6"/>',
    'fuel': '<rect x="3" y="4" width="10" height="17" rx="2"/><path d="M3 10h10"/><circle cx="8" cy="7" r="1" fill="currentColor"/><path d="m13 8 4-2v9a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V7l-2-2"/>',
    'travel': '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>',

    // Food & Groceries
    'tea': '<path d="M17 8h1a3 3 0 0 1 3 3v1a3 3 0 0 1-3 3h-1"/><path d="M3 8h14v6a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" y1="2" x2="6" y2="5"/><line x1="10" y1="2" x2="10" y2="5"/><line x1="14" y1="2" x2="14" y2="5"/>',
    'food': '<path d="M18 2v20"/><path d="M15 2v5a3 3 0 0 0 6 0V2"/><path d="M6 2v7c0 1.66 1.34 3 3 3h1a3 3 0 0 0 3-3V2"/><path d="M9 12v10"/>',
    'groceries': '<circle cx="8" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2.5 3h2.5l2.4 11.2a2 2 0 0 0 2 1.6h9.2a2 2 0 0 0 2-1.6l1.4-7.2H6.5"/>',
    'bills': '<rect x="6" y="2" width="12" height="20" rx="3"/><line x1="11" y1="18" x2="13" y2="18"/><path d="M10 5h4"/>',
    'other': '<path d="m12 3 1.9 5.8a2 2 0 0 0 1.3 1.3L21 12l-5.8 1.9a2 2 0 0 0-1.3 1.3L12 21l-1.9-5.8a2 2 0 0 0-1.3-1.3L3 12l5.8-1.9a2 2 0 0 0 1.3-1.3Z"/>',

    // Payments
    'upi': '<rect x="6" y="2" width="12" height="20" rx="3"/><line x1="11" y1="18" x2="13" y2="18"/><path d="M10 5h4"/>',
    'cash': '<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M6 12h.01M18 12h.01"/>',
    'card': '<rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>',
    'metro-card': '<rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/><circle cx="17" cy="15" r="1.5" fill="currentColor"/>',

    // Navigation & UI Controls
    'moon': '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>',
    'sun': '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>',
    'zap': '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
    'refresh': '<path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 21v-5h5"/>',
    'logout': '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>',
    'cloud': '<path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>',
    'chevron-down': '<polyline points="6 9 12 15 18 9"/>',
    'user': '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',

    // Feedback & Notifications
    'check': '<circle cx="12" cy="12" r="10"/><polyline points="8 12 11 15 16 9"/>',
    'alert': '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
    'trash': '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>',
    'target': '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    'currency': '<circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 6v12"/>',
    'ticket': '<path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 11v2"/><path d="M13 17v2"/>',
    'search': '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
    'sparkle': '<path d="m12 3 1.9 5.8a2 2 0 0 0 1.3 1.3L21 12l-5.8 1.9a2 2 0 0 0-1.3 1.3L12 21l-1.9-5.8a2 2 0 0 0-1.3-1.3L3 12l5.8-1.9a2 2 0 0 0 1.3-1.3Z"/>'
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
    '🎫': 'ticket'
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
