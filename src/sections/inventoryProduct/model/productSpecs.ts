import {KeyType} from "../enum/keyType";
export interface ProductSpecs {
  id: number;
  productId: number;
  keyName: string;
  keyType: KeyType;
  keyValue: string;
  required: boolean;
}

