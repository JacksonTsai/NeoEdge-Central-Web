export const tagFieldValidators = {
  enable: /\b(true|false|TRUE|FALSE|True|False)\b/,
  data_type: /\b(Boolean|Int16|Int32|Int64|Uint16|Uint32|Uint64|Float|Double|String|Raw)\b/,
  function: /\b(1[56]?|[1-6])\b/,
  trigger: /\b(Cyclic|DataChange)\b/
};
