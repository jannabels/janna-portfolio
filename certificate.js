document.addEventListener('DOMContentLoaded', async () => {
  if (!window.pdfjsLib) return;

  pdfjsLib.GlobalWorkerOptions.workerSrc =
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

  const images = document.querySelectorAll('.cert-image[data-pdf]');

  for (const img of images) {
    try {
      const pdf = await pdfjsLib.getDocument(img.dataset.pdf).promise;
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 1.4 });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({ canvasContext: context, viewport }).promise;

      img.src = canvas.toDataURL('image/png');
    } catch (error) {
      img.alt = 'Unable to load certificate image';
      img.closest('.certificate-image-wrap')?.classList.add('certificate-placeholder');
    }
  }
});
