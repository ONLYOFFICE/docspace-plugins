// ─── CSS Style templates ─────────────────────────────────────────────────────

export const spreadStyles = `
html { height: 100%; margin: 0; padding: 0; }
body {
  height: 100%;
  margin: 0; padding: 0;
  display: flex;
  flex-direction: column;
  background: #fff;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 17px;
  line-height: 1.7;
  color: #1a1a1a;
  padding-top: 8px; /* Safety spacing to prevent overlap with modal header */
}
#spread-scroll {
  flex: 1 1 auto;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  min-height: 0;
}
#spread-container {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 0;
  min-height: 100%;
  background: #fff;
  box-sizing: border-box;
  max-width: 100%;
  margin: 0 auto;
  width: 100%;
}

/* Desktop: constrain content width */
@media (min-width: 769px) {
  #spread-container {
    max-width: 700px;
  }
}

@media (min-width: 1025px) {
  #spread-container {
    max-width: 800px;
  }
}

@media (min-width: 1440px) {
  #spread-container {
    max-width: 900px;
  }
}

.page-divider {
  width: 1px;
  background: #e0e0e0;
  align-self: stretch;
  flex-shrink: 0;
}
.page-panel {
  flex: 1 1 0;
  background: #fff;
  padding: 32px 36px 36px; /* Reduced from 40px to 32px to account for body padding-top */
  box-sizing: border-box;
  min-width: 0;
}
img{max-width:100%;height:auto;display:block;margin:.8em auto;pointer-events:none !important;cursor:default !important;user-select:none !important}
a{pointer-events:none !important;cursor:default !important;text-decoration:none;color:inherit;user-select:none !important}
#spread-scroll *{cursor:default !important}
#spread-scroll a,#spread-scroll a *,#spread-scroll img{cursor:default !important}
h1,h2,h3,h4{line-height:1.3;margin-top:1.2em}p{margin:.5em 0}
table { border-collapse: collapse; width: 100%; }
td, th { border: 1px solid #ddd; padding: 6px 8px; font-size: 0.9em; }
#reader-footer {
  flex: 0 0 40px;
  min-height: 40px;
  max-height: 40px;
  border-top: 1px solid #ddd;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
}
#nav-info-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  min-width: 120px;
}
#nav-label {
  font-family: Arial, sans-serif;
  font-size: 12px;
  color: #666;
  white-space: nowrap;
}
#nav-progress {
  width: 90px; height: 3px;
  background: #e0e0e0; border-radius: 2px; overflow: hidden;
}
#nav-progress-fill {
  height: 100%;
  background: #4d8cf0;
  border-radius: 2px;
}
.nav-btn {
  width: 28px; height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  color: #444;
  padding: 0;
}
.nav-btn:hover:not(:disabled) { background: #f0f0f0; border-color: #aaa; }
.nav-btn:disabled { opacity: 0.3; cursor: not-allowed; }

/* ─── Responsive Design ──────────────────────────────────────────────────── */

/* Extra small phones - under 390px */
@media (max-width: 389px) {
  body {
    font-size: 14px;
    line-height: 1.55;
    padding-top: 12px; /* More spacing on small screens */
  }
  .page-panel {
    padding: 28px 12px 12px; /* Adjusted to account for body padding */
  }
  h1 { font-size: 1.4em; }
  h2 { font-size: 1.25em; }
  h3 { font-size: 1.1em; }
  h4 { font-size: 1em; }
  #reader-footer {
    flex: 0 0 48px;
    min-height: 48px;
    max-height: 48px;
    gap: 8px;
  }
  .nav-btn {
    width: 32px;
    height: 32px;
    font-size: 16px;
  }
  #nav-info-wrap {
    min-width: 90px;
  }
  #nav-label {
    font-size: 10px;
  }
  #nav-progress {
    width: 60px;
  }
  td, th {
    padding: 3px 4px;
    font-size: 0.8em;
  }
}

/* Mobile phones (portrait) - 390px to 480px */
@media (min-width: 390px) and (max-width: 480px) {
  body {
    font-size: 15px;
    line-height: 1.6;
    padding-top: 10px;
  }
  .page-panel {
    padding: 30px 16px 16px; /* Adjusted */
  }
  h1 { font-size: 1.5em; }
  h2 { font-size: 1.3em; }
  h3 { font-size: 1.15em; }
  h4 { font-size: 1.05em; }
  #reader-footer {
    flex: 0 0 48px;
    min-height: 48px;
    max-height: 48px;
    gap: 12px;
  }
  .nav-btn {
    width: 36px;
    height: 36px;
    font-size: 18px;
  }
  #nav-info-wrap {
    min-width: 100px;
  }
  #nav-label {
    font-size: 11px;
  }
  #nav-progress {
    width: 70px;
  }
  td, th {
    padding: 4px 6px;
    font-size: 0.85em;
  }
}

/* Tablets (portrait) - 481px to 768px */
@media (min-width: 481px) and (max-width: 768px) {
  body {
    font-size: 16px;
    line-height: 1.65;
  }
  .page-panel {
    padding: 32px 24px 24px; /* Adjusted */
  }
  #reader-footer {
    flex: 0 0 44px;
    min-height: 44px;
    max-height: 44px;
    gap: 14px;
  }
  .nav-btn {
    width: 32px;
    height: 32px;
    font-size: 17px;
  }
  #nav-info-wrap {
    min-width: 110px;
  }
  #nav-progress {
    width: 80px;
  }
}

/* Tablets (landscape) and small desktops - 769px to 1024px */
@media (min-width: 769px) and (max-width: 1024px) {
  .page-panel {
    padding: 35px 30px 30px;
  }
}

/* Larger desktops - 1025px+ */
@media (min-width: 1025px) {
  /* Keep existing desktop styles */
}
`;

export const clickBlockerScript = `
// Block all interaction with links and images to prevent CSP violations
(function() {
  var blockEvent = function(e) {
    var target = e.target;
    if (target.tagName === 'A' || target.tagName === 'IMG' || target.closest('a')) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      return false;
    }
  };
  ['click', 'mousedown', 'mouseup', 'contextmenu', 'auxclick'].forEach(function(eventType) {
    document.addEventListener(eventType, blockEvent, true);
    window.addEventListener(eventType, blockEvent, true);
  });
  window.addEventListener('beforeunload', function(e) {
    e.preventDefault();
  });
})();
`;

export const cursorOverrideStyle = `
/* Final cursor override - loaded after all EPUB content */
a,a *,img,#spread-scroll a,#spread-scroll a *,#spread-scroll img,
.page-panel a,.page-panel a *,.page-panel img{cursor:default !important}
`;
