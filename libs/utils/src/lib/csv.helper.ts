export const csvToObj = (content) => {
  const rows = content.trim().split('\n');
  const headers = rows[0].split(',').map((header) => header.trim());
  const result = rows.slice(1).map((row) => {
    const values = row.split(',').map((value) => value.trim());
    return headers.reduce((obj, header, index) => {
      obj[header] = values[index];
      return obj;
    }, {});
  });
  return result;
};

export const objToCSV = (obj) => {
  const array = [Object.keys(obj[0])].concat(obj);
  return array
    .map((row) => {
      return Object.values(row)
        .map((value) => {
          let escapedValue = value.toString().replace(/"/g, '""');
          if (escapedValue.includes(',') || escapedValue.includes('\n')) {
            escapedValue = `"${escapedValue}"`;
          }
          return escapedValue;
        })
        .join(',');
    })
    .join('\n');
};

export const downloadCSV = (csv, filename) => {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
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
