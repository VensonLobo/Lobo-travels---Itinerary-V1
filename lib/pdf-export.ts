import jsPDF from 'jspdf';
import { toJpeg } from 'html-to-image';

const TRANSPARENT_PIXEL = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

async function inlineElementImages(root: HTMLElement): Promise<() => void> {
  const images = Array.from(root.querySelectorAll('img'));
  const originalSources = new Map<HTMLImageElement, string>();

  await Promise.all(
    images.map(async (img) => {
      const src = img.currentSrc || img.src || img.getAttribute('src');
      if (!src || src.startsWith('data:')) return;

      originalSources.set(img, src);

      try {
        const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(src)}`;
        const res = await fetch(proxyUrl);
        if (res.ok) {
          const blob = await res.blob();
          const base64 = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
          });
          img.src = base64;
        } else {
          img.src = TRANSPARENT_PIXEL;
        }
      } catch (err) {
        console.warn('Failed to inline image via proxy, using fallback', err);
        img.src = TRANSPARENT_PIXEL;
      }
    })
  );

  return () => {
    originalSources.forEach((originalSrc, img) => {
      img.src = originalSrc;
    });
  };
}

export async function exportElementToPdf(
  element: HTMLElement,
  filename: string,
  onProgress?: (status: string) => void
): Promise<void> {
  onProgress?.('Preparing high-resolution A4 document...');

  // Reset any CSS zoom or transform on preview container so coordinate space is 1:1
  const originalTransform = element.style.transform;
  element.style.transform = 'none';

  let restoreImages: (() => void) | null = null;

  try {
    onProgress?.('Inlining document assets...');
    // Pre-convert all images to base64 data URIs so foreignObject never makes cross-origin requests
    restoreImages = await inlineElementImages(element);

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const pdfWidth = pdf.internal.pageSize.getWidth(); // 210mm
    const pdfHeight = pdf.internal.pageSize.getHeight(); // 297mm

    // Check if the container is composed of explicit discrete A4 pages (.pdf-page)
    const pageNodes = Array.from(element.querySelectorAll<HTMLElement>('.pdf-page'));

    if (pageNodes.length > 0) {
      // Discrete Page-by-Page Rendering (guarantees zero mid-content cuts and pinned footers)
      for (let i = 0; i < pageNodes.length; i++) {
        const pageEl = pageNodes[i];
        onProgress?.(`Rendering A4 page ${i + 1} of ${pageNodes.length}...`);

        let pageImgData: string;
        try {
          pageImgData = await toJpeg(pageEl, {
            quality: 0.95,
            backgroundColor: '#ffffff',
            pixelRatio: 2,
            skipFonts: true,
            cacheBust: false,
          });
        } catch (renderErr) {
          console.warn(`2x render fallback on page ${i + 1}:`, renderErr);
          pageImgData = await toJpeg(pageEl, {
            quality: 0.85,
            backgroundColor: '#ffffff',
            pixelRatio: 1.5,
            skipFonts: true,
            cacheBust: false,
          });
        }

        if (i > 0) {
          pdf.addPage();
        }
        pdf.addImage(pageImgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
      }
    } else {
      // Single continuous container rendering fallback
      onProgress?.('Rendering document pages...');

      let imgData: string;
      try {
        imgData = await toJpeg(element, {
          quality: 0.95,
          backgroundColor: '#ffffff',
          pixelRatio: 2,
          skipFonts: true,
          cacheBust: false,
        });
      } catch (primaryErr) {
        console.warn('Primary 2x render warning, attempting 1.5x fallback', primaryErr);
        imgData = await toJpeg(element, {
          quality: 0.85,
          backgroundColor: '#ffffff',
          pixelRatio: 1.5,
          skipFonts: true,
          cacheBust: false,
        });
      }

      const img = new Image();
      img.src = imgData;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = (e) => reject(e);
      });

      const canvasWidth = img.naturalWidth || img.width || 800;
      const canvasHeight = img.naturalHeight || img.height || 1123;
      const totalPdfHeight = (canvasHeight * pdfWidth) / canvasWidth;

      let heightLeft = totalPdfHeight;
      let position = 0;
      let page = 1;

      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, totalPdfHeight, undefined, 'FAST');
      heightLeft -= pdfHeight;

      while (heightLeft > 2) {
        position = -(page * pdfHeight);
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, totalPdfHeight, undefined, 'FAST');
        heightLeft -= pdfHeight;
        page++;
      }
    }

    onProgress?.('Saving PDF file...');
    pdf.save(filename);
  } catch (error) {
    console.error('Direct PDF export encountered an issue, launching browser print fallback:', error);
    window.print();
  } finally {
    if (restoreImages) {
      restoreImages();
    }
    element.style.transform = originalTransform;
  }
}
