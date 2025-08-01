import {
    Facebook,
    Instagram,
    X as XIcon,
    LinkedIn,
    YouTube,
  } from "@mui/icons-material";
import { StatusType } from "../../header/enum/statusType";
import { PlatformType } from "../enum/platformType";
import { FooterDetail } from "./footerDetails";

export interface FooterType{

    id:number;
    code:string;
    title:string;
    url:string;
    fileId:number;
    logoUrl:string;
    sequence:number;
    status:StatusType;
    footerDetails:FooterDetail[];
}



  
  export const getPlatformIcon = (platform: PlatformType) => {
    switch (platform) {
      case PlatformType.FACEBOOK:
        return Facebook;
      case PlatformType.INSTAGRAM:
        return Instagram;
      case PlatformType.X:
        return XIcon;
      case PlatformType.LINKEDIN:
        return LinkedIn;
      case PlatformType.YOUTUBE:
        return YouTube;
      default:
        return null;
    }
  };
  
