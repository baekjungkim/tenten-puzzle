import { TentenGamebox } from './game';

window.addEventListener('DOMContentLoaded', () => {
  const isMobile = window.innerWidth <= 768;
  new TentenGamebox({
    canvasId: 'gameCanvas',
    isMobile,
  });
});
