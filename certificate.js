// Renders the first page of each certificate PDF as a canvas preview
// inside its .cert-image-wrap container, replacing the "Loading preview…" label.

(function () {
  if (typeof pdfjsLib === 'undefined') return;

  pdfjsLib.GlobalWorkerOptions.workerSrc =
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

  async function renderPdfPreview(container) {
    const url = container.getAttribute('data-pdf');
    if (!url) return;

    const loadingEl = container.querySelector('.cert-loading');

    try {
      const pdf = await pdfjsLib.getDocument(url).promise;
      const page = await pdf.getPage(1);

      const baseViewport = page.getViewport({ scale: 1 });
      const targetWidth = container.clientWidth || 600;
      const scale = (targetWidth * 2) / baseViewport.width; // 2x for crisp retina rendering
      const viewport = page.getViewport({ scale });

      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext('2d');

      await page.render({ canvasContext: ctx, viewport }).promise;

      if (loadingEl) loadingEl.remove();
      container.appendChild(canvas);
    } catch (err) {
      console.error('Could not render certificate preview for', url, err);
      if (loadingEl) loadingEl.textContent = 'Preview unavailable';
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.cert-image-wrap[data-pdf]').forEach(renderPdfPreview);
  });
})();
