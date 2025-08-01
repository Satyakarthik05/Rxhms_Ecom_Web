import { PositionType } from "../enum/positionType";
import { TitleAnimationType } from "../enum/titleAnimationType";

export interface NewCarouselSlide {
    id:number;
    carouselId:number;
    fileRefId:number;
    mediaUrl:string;
    title:string;
    titleRequired:boolean;
    caption:string;
    captionRequired:boolean;
    ctaTitle:string;
    ctaRequired:boolean;
    ctaType:string;
    ctaColor:string;
    ctaLink:string;
    targetUrl:string;
    sequence:number;
    titlePosition: PositionType;
    titleAnimation: TitleAnimationType;
    ctaPosition: PositionType;

}

