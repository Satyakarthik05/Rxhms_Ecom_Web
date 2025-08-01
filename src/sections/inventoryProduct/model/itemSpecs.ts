import {KeyType} from '../enum/keyType'
export interface ItemSpecs {
  id: number;
  itemId: number;
  keyName: string;
  keyType: KeyType;
  keyValue: string;
  required: boolean;
}

