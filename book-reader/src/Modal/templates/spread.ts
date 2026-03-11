import {
  spreadStyles,
  clickBlockerScript,
  cursorOverrideStyle,
} from "./styles";

// Single-page HTML template generator

export interface SpreadOptions {
  content: string;
  currentPage: number;
  totalPages: number;
  onPrevious: string;
  onNext: string;
  hasNext: boolean;
  hasPrevious: boolean;
}

export function generateSpreadHTML(options: SpreadOptions): string {
  const {
    content,
    currentPage,
    totalPages,
    onPrevious,
    onNext,
    hasNext,
    hasPrevious,
  } = options;

  const percent = Math.round((currentPage / totalPages) * 100);
  const pageLabel = `${currentPage} / ${totalPages} (${percent}%)`;

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
${spreadStyles}
</style>
<script>
${clickBlockerScript}
</script>
</head>
<body>
<div id="spread-scroll">
  <div id="spread-container">
    <div class="page-panel">${content}</div>
  </div>
</div>
<footer id="reader-footer">
  <button class="nav-btn" id="btn-prev" ${!hasPrevious ? "disabled" : ""}
    onclick="${onPrevious}">&#8249;</button>
  <div id="nav-info-wrap">
    <span id="nav-label">${pageLabel}</span>
    <div id="nav-progress">
      <div id="nav-progress-fill" style="width:${percent}%"></div>
    </div>
  </div>
  <button class="nav-btn" id="btn-next" ${!hasNext ? "disabled" : ""}
    onclick="${onNext}">&#8250;</button>
</footer>
<style>
${cursorOverrideStyle}
</style>
</body>
</html>`;
}
