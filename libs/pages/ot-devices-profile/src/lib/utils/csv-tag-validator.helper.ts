import { ICsvTag } from '@neo-edge-web/models';
import { tagFieldValidators } from '../configs';

export const checkTagFieldValidators = (data: ICsvTag) => {
  try {
    return {
      tag_name: data.tag_name ? true : false,
      enable: tagFieldValidators.enable.test(data.enable),
      data_type: tagFieldValidators.data_type.test(data.data_type),
      function: tagFieldValidators.function.test(data.function),
      start_address: isNaN(Number(data.start_address)) ? false : true,
      quantity: isNaN(Number(data.quantity)) ? false : true,
      trigger: tagFieldValidators.trigger.test(data.trigger),
      interval: isNaN(Number(data.interval)) ? false : true
    };
  } catch {
    return { tagCsvError: 'Field is missing' };
  }
};

export const checkCsvTagsFormat = (csvContent: ICsvTag[]) => {
  const importCsvResult = [];
  if (Object.keys(csvContent[0]).length !== 8) {
    importCsvResult.push('Field is missing');
    return importCsvResult;
  }

  csvContent.map((item, index) => {
    const checkResult = checkTagFieldValidators(item);

    if (checkResult && Object.values(checkResult).findIndex((d) => !d) > -1) {
      const errorItem = Object.keys(checkResult)
        .filter((key) => checkResult[key] === false)
        .join(', ');
      importCsvResult.push(`[Row ${index + 1}] invalid (${errorItem})`);
    }
  });
  return importCsvResult;
};
