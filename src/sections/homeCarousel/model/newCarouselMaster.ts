import { StatusType } from "../../header/enum/statusType";
import { NewCarouselSlide } from "./newCarouselSlide";

export interface NewCarouselMaster{

    id:number;
    code:string;
    channelCode:string;
    title:string;
    description:string;
    automatic:boolean;
    timeInterval:number;
    status:StatusType;
    carouselSlides:NewCarouselSlide[];
}


