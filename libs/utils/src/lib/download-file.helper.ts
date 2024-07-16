export const downloadFile = (data: ArrayBuffer, filename, type = 'text/csv;charset=utf-8;') => {
  const blob = new Blob([data], { type });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
