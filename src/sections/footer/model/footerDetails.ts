import { StatusType } from "../../header/enum/statusType";

export interface FooterDetail{
    id:number;
    typeCode:string;
    title:string;
    url:string;
    sequence:number;
    status:StatusType;
}
