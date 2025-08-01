export interface ImageConfig {
  src: string;
  alt: string;
}

export interface ButtonConfig {
  id: string;
  labelLine1: string;
  labelLine2: string;
  icon: string | React.ComponentType;
  iconType: "image" | "component";
  to: string;
}

export interface CardConfig {
  id: string;
  title: string;
  subtitle: string;
  bgImage: string;
  description: string;
  to: string;
  image: string;
}

export interface SectionConfig {
  image?: ImageConfig;
  headline1?: string;
  headline2?: string;
  subheading?: string;
  description?: string;
  sectionButton: ButtonConfig;
  buttons?: ButtonConfig[];
  cards?: CardConfig[];
}

export const sectionConfig: SectionConfig = {
  image: {
    src: "",
    alt: "",
  },
  headline1: "",
  headline2: "",
  subheading: "",
  description: "",
  sectionButton: {
    id: "cta-1",
    labelLine1: "Get it on",
    labelLine2: "Google Play",
    iconType: "image",
    icon: "/assets/icons/playstore.svg",
    to: "/download",
  },
  buttons: [
    // {
    //   id: "cta-1",
    //   labelLine1: "Get it on",
    //   labelLine2: "Google Play",
    //   iconType: "image",
    //   icon: "/assets/icons/playstore.svg",
    //   to: "/download",
    // },
  ],
  cards: [
    // {
    //   id: "promo-card-1",
    //   title: "Summer Sale",
    //   subtitle: "Up to 50% off",
    //   bgImage: "/assets/images/summer.jpg",
    // },
  ],
};
