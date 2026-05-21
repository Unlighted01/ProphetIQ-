import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * Capture and download the technical site intelligence report as a premium CAD-style PDF blueprint.
 */
export async function exportToPDF(elementId: string, cityName: string) {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Element with id "${elementId}" not found in DOM.`);
  }

  // Find and temporarily hide sticky sub-navigation and action button elements to clean up the printed document
  const stickyNav = element.querySelector('.sticky');
  const reportHeader = element.querySelector('.border-l-4'); // Selects the report header box
  const saveBtn = reportHeader?.querySelector('button');

  if (stickyNav) {
    (stickyNav as HTMLElement).style.setProperty('display', 'none', 'important');
  }
  if (saveBtn) {
    (saveBtn as HTMLElement).style.setProperty('display', 'none', 'important');
  }

  try {
    // Generate high-resolution canvas maintaining dark themes
    const canvas = await html2canvas(element, {
      scale: 2, // 2x density for razor-sharp typography and graphs
      useCORS: true,
      backgroundColor: '#050505', // Matches ProphetIQ --bg-deep default background exactly
      logging: false,
      windowWidth: 1200, // Standard desktop grid size
    });

    const imgWidth = canvas.width;
    const imgHeight = canvas.height;

    // Convert canvas to compressed JPEG data URI
    const imgData = canvas.toDataURL('image/jpeg', 0.9);

    // Calculate dynamic PDF dimensions to perfectly fit the generated canvas without artificial pagination seams
    const pdf = new jsPDF({
      orientation: imgWidth > imgHeight ? 'landscape' : 'portrait',
      unit: 'px',
      format: [imgWidth / 2, imgHeight / 2], // 1:1 scale for the 2x canvas ratio
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
    
    // Save locally
    const safeCity = cityName.trim().replace(/[^a-zA-Z0-9]/g, '_');
    pdf.save(`ProphetIQ_Blueprint_${safeCity}_${Date.now()}.pdf`);

  } finally {
    // Always restore the hidden interactive buttons after capturing
    if (stickyNav) {
      (stickyNav as HTMLElement).style.removeProperty('display');
    }
    if (saveBtn) {
      (saveBtn as HTMLElement).style.removeProperty('display');
    }
  }
}
