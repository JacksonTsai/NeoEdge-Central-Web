export const neoFlowProfileOptions = {
  encode: ['UTF-8'],
  contentType: ['JSON'],
  dateTimeFormat: ['ISO8601-2004'],
  timeZone: [...generateTimeZones()]
};

function generateTimeZones() {
  const range = Array.from({ length: 26 }, (_, i) => i - 11);
  const timeZones = range.map((offset) => `UTC${offset >= 0 ? '+' : ''}${offset}`);
  return timeZones;
}
