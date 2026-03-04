// ─── Storefront Section Type Definitions ────────────────────────────────────
// These mirror the JSON structure stored in StorefrontSection.content

export type SectionType =
    | "HERO"
    | "PROMO"
    | "STATS"
    | "SCROLLING_TICKER"
    | "BENTO_GRID_4X4"
    | "ANIMATED_PROMO_CARD";

export interface HeroBannerContent {
    headline: string;
    subheadline: string;
    ctaLabel: string;
    ctaLink: string;
    imageUrl: string;
}

export interface PromoContent {
    message: string;
    linkUrl: string;
    bgColor: string;
}

export interface StatsContent {
    stats: {
        label: string;
        value: string;
    }[];
}

export interface ScrollingTickerContent {
    text: string;
    bgColor: string;
    textColor: string;
    speed: number;
}

export interface BentoGridItem {
    title: string;
    imageUrl: string;
    linkUrl: string;
}

export interface BentoGridContent {
    largeItem: BentoGridItem;
    smallItems: BentoGridItem[]; // exactly 4
}

export interface AnimatedPromoCardContent {
    title: string;
    subtitle?: string;
    images: string[]; // up to 4 images to swap between
    linkUrl: string;
}

export type SectionContent =
    | HeroBannerContent
    | PromoContent
    | StatsContent
    | ScrollingTickerContent
    | BentoGridContent
    | AnimatedPromoCardContent;

export interface StorefrontSectionData {
    id: string;
    type: SectionType;
    title: string;
    order: number;
    isActive: boolean;
    content: SectionContent;
    updatedAt: Date;
}
