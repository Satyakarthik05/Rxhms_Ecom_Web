export interface MessageTemplate {
  id: number; // INT represented as number
  template: string; // TEXT represented as string
  type: string; // Enum represented as string
  langCode: string; // 2-letter language code in camelCase
  textAlign: "LTR" | "RTL"; // Enum as string literal
  prefCommunication: string; // Enum represented as string
}
