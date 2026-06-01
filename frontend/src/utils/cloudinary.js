import api from './api.js';

/**
 * Download a resume via a backend-signed Cloudinary URL.
 * This avoids 401 errors from direct Cloudinary access.
 *
 * @param {string} url        - The Cloudinary secure_url stored in DB
 * @param {string} publicId   - The Cloudinary public_id stored in DB
 * @param {string} filename   - Desired download filename (e.g. "John_resume.pdf")
 */
export const downloadFile = async (url, publicId, filename = 'resume.pdf') => {
  try {
    // Ensure filename has .pdf extension
    const name = filename.endsWith('.pdf') || filename.endsWith('.docx') || filename.endsWith('.doc')
      ? filename
      : `${filename}.pdf`;

    if (publicId) {
      // Get a signed URL from our backend
      const { data } = await api.post('/users/resume-url', { publicId });
      if (data?.url) {
        const a = document.createElement('a');
        a.href = data.url;
        a.download = name;
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        return;
      }
    }

    // Fallback — open direct URL in new tab
    window.open(url, '_blank');
  } catch (err) {
    console.error('Download failed:', err);
    // Last resort fallback
    if (url) window.open(url, '_blank');
  }
};
