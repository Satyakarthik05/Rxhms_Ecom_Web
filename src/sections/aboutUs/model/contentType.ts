import { ContentDetails } from "./contentDetails";

export interface  Content{

    id: number;
    code: string;
    title: string;
    description: string;
    picUrl: string;
    fileId: number;
    contentDetails: ContentDetails[];

}

