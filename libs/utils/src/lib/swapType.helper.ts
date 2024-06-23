export const swapType = (byte: boolean, word: boolean) => {
  if (byte && word) {
    return 'ByteWord';
  } else if (!byte && word) {
    return 'Word';
  } else if (byte && !word) {
    return 'Byte';
  } else {
    return 'None';
  }
};

const swapTypeMapping = {
  ByteWord: { word: true, byte: true },
  Word: { word: true, byte: false },
  Byte: { word: false, byte: true },
  None: { word: false, byte: false }
};

export const isSwapWord = (swapType: 'ByteWord' | 'Word' | 'Byte' | 'None') => {
  return swapTypeMapping[swapType].word;
};

export const isSwapByte = (swapType: 'ByteWord' | 'Word' | 'Byte' | 'None') => {
  return swapTypeMapping[swapType].byte;
};
