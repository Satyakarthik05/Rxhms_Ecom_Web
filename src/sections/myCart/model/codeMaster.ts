import CodedetailsMaster from "../../Dashboard/model/codedetailsMaster";
import { Code } from "./code";

export interface CodeMaster {
  id: number;
  code: string;
  type: Code;
  description: string;
  codedetails: CodedetailsMaster[];
}
