export const rtuOptions = {
  rtuModeOpts: [{ displayName: 'RTU', value: 'RTU' }],
  rtuBaudRateOpts: [300, 600, 1200, 1800, 2400, 4800, 9600, 19200, 38400, 57600, 115200, 230400, 460800, 921600],
  rtuDataBitsOpts: [7, 8],
  rtuParityOpts: [
    { displayName: 'None', value: 'None' },
    { displayName: 'Odd', value: 'Odd' },
    { displayName: 'Even', value: 'Even' }
  ],
  rtuStopBitsOpts: ['1', '2']
};

export const texolOptions = {
  rtuModeOpts: [{ displayName: 'RTU', value: 'RTU' }],
  rtuBaudRateOpts: [115200],
  rtuDataBitsOpts: [8],
  rtuParityOpts: [{ displayName: 'Even', value: 'Even' }],
  rtuStopBitsOpts: ['1']
};

export const tagOptions = {
  enableOpts: [true, false],
  tagTypeOpts: [
    { displayName: 'Boolean', value: 'Boolean', functionEnable: [1, 2, 3, 4, 5, 15, 16], quantity: 1 },
    { displayName: 'Int16', value: 'Int16', functionEnable: [3, 4, 6, 16], quantity: 11 },
    { displayName: 'Int32', value: 'Int32', functionEnable: [3, 4, 16], quantity: 2 },
    { displayName: 'Int64', value: 'Int64', functionEnable: [3, 4, 16], quantity: 4 },
    { displayName: 'Uint16', value: 'Uint16', functionEnable: [3, 4, 6, 16], quantity: 1 },
    { displayName: 'Uint32', value: 'Uint32', functionEnable: [3, 4, 16], quantity: 2 },
    { displayName: 'Uint64', value: 'Uint64', functionEnable: [3, 4, 16], quantity: 4 },
    { displayName: 'Float', value: 'Float', functionEnable: [3, 4, 16], quantity: 2 },
    { displayName: 'Double', value: 'Double', functionEnable: [3, 4, 16], quantity: 4 },
    { displayName: 'String', value: 'String', functionEnable: [3, 4, 6, 16] },
    { displayName: 'Raw', value: 'Raw', functionEnable: [1, 2, 3, 4, 5, 6, 15, 16] }
  ],

  tagFunctionOpts: [
    { displayName: '01-Read Coils', value: 1 },
    { displayName: '02-Read Discrete Inputs', value: 2 },
    { displayName: '03-Read Holding Registers', value: 3 },
    { displayName: '04-Read Input Registers', value: 4 },
    { displayName: '05-Write Single Coil', value: 5 },
    { displayName: '06-Write Single Register', value: 6 },
    { displayName: '15-Write Multiple Coils', value: 15 },
    { displayName: '16-Write Multiple Registers', value: 16 }
  ],
  tagTrigger: [
    { displayName: 'Cyclic', value: 'Cyclic', depFunctionEnable: [1, 2, 3, 4, 5, 6, 15, 16] },
    { displayName: 'Data Change', value: 'DataChange', depFunctionEnable: [5, 6, 15, 16] }
  ]
};
