const PANEL_NAME = 'Layout';
const panels = chrome.devtools.panels;

panels.create(
  PANEL_NAME,
  null,
  'panel.html',
  null,
);