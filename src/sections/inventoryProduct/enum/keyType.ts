export enum KeyType {
  TEXT = "TEXT",
  NUMBER = "NUMBER",
  DECIMAL = "DECIMAL",
  BOOLEAN = "BOOLEAN",
  PERCENTAGE = "PERCENTAGE",
}

export const KeyTypeDisplay = {
  [KeyType.TEXT]: "Text",
  [KeyType.NUMBER]: "Number",
  [KeyType.DECIMAL]: "Decimal",
  [KeyType.BOOLEAN]: "Boolean",
  [KeyType.PERCENTAGE]: "Percentage",
};
