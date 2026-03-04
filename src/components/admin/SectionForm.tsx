"use client";

import { useForm } from "react-hook-form";
import { useTransition, useEffect } from "react";
import { toast } from "sonner";
import { Save, Loader2 } from "lucide-react";
import { updateSectionContent } from "@/actions/storefront";
import type {
    StorefrontSectionData,
    HeroBannerContent,
    PromoContent,
    StatsContent,
    ScrollingTickerContent,
    BentoGridContent,
    AnimatedPromoCardContent,
} from "@/types/storefront";

interface Props {
    section: StorefrontSectionData;
    onSaved: () => void;
}

// ─── Hero Banner Form ──────────────────────────────────────────────────────────
function HeroForm({
    section,
    onSaved,
}: {
    section: StorefrontSectionData;
    onSaved: () => void;
}) {
    const content = section.content as HeroBannerContent;
    const { register, handleSubmit, reset } = useForm<HeroBannerContent>({
        defaultValues: content,
    });
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        reset(content);
    }, [content, reset]);

    const onSubmit = (data: HeroBannerContent) => {
        startTransition(async () => {
            const result = await updateSectionContent(section.id, data);
            if (result.success) {
                toast.success("Hero Banner updated! Homepage will refresh shortly.");
                onSaved();
            }
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Headline / CTA Text" id="headline">
                    <input
                        id="headline"
                        {...register("headline")}
                        placeholder="Shop the New Summer Collection"
                        className={inputCls}
                    />
                </Field>
                <Field label="CTA Label" id="ctaLabel">
                    <input
                        id="ctaLabel"
                        {...register("ctaLabel")}
                        placeholder="Explore Now"
                        className={inputCls}
                    />
                </Field>
                <Field label="Sub-headline" id="subheadline">
                    <input
                        id="subheadline"
                        {...register("subheadline")}
                        placeholder="Up to 50% off on all items from our top vendors"
                        className={inputCls}
                    />
                </Field>
                <Field label="CTA Link" id="ctaLink">
                    <input
                        id="ctaLink"
                        {...register("ctaLink")}
                        placeholder="/collections/all"
                        className={inputCls}
                    />
                </Field>
                <Field
                    label="Background Image URL"
                    id="imageUrl"
                    className="md:col-span-2"
                >
                    <input
                        id="imageUrl"
                        {...register("imageUrl")}
                        placeholder="https://images.unsplash.com/photo-..."
                        className={inputCls}
                    />
                </Field>
            </div>
            <SubmitButton isPending={isPending} />
        </form>
    );
}

// ─── Promo Strip Form ─────────────────────────────────────────────────────────
function PromoForm({
    section,
    onSaved,
}: {
    section: StorefrontSectionData;
    onSaved: () => void;
}) {
    const content = section.content as PromoContent;
    const { register, handleSubmit, reset } = useForm<PromoContent>({
        defaultValues: content,
    });
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        reset(content);
    }, [content, reset]);

    const onSubmit = (data: PromoContent) => {
        startTransition(async () => {
            const result = await updateSectionContent(section.id, data);
            if (result.success) {
                toast.success("Promo Strip updated! Homepage will refresh shortly.");
                onSaved();
            }
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Field label="Message Content" id="message" className="md:col-span-2">
                    <input
                        id="message"
                        {...register("message")}
                        placeholder="🚀 Free Shipping on orders over $50! Use code: FREESHIP"
                        className={inputCls}
                    />
                </Field>
                <Field label="Payment Destination" id="linkUrl">
                    <input
                        id="linkUrl"
                        {...register("linkUrl")}
                        placeholder="/collections/all"
                        className={inputCls}
                    />
                </Field>
                <Field label="Strip Color (hex)" id="bgColor">
                    <div className="flex gap-2">
                        <input
                            id="bgColor"
                            type="color"
                            {...register("bgColor")}
                            className="h-10 w-14 rounded-lg border border-slate-200 cursor-pointer p-1"
                        />
                        <input
                            {...register("bgColor")}
                            placeholder="#F59E0B"
                            className={`${inputCls} flex-1`}
                        />
                    </div>
                </Field>
            </div>
            <SubmitButton isPending={isPending} />
        </form>
    );
}

// ─── Stats Form ────────────────────────────────────────────────────────────────
function StatsForm({
    section,
    onSaved,
}: {
    section: StorefrontSectionData;
    onSaved: () => void;
}) {
    const content = section.content as StatsContent;
    const { register, handleSubmit, reset } = useForm<StatsContent>({
        defaultValues: content,
    });
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        reset(content);
    }, [content, reset]);

    const onSubmit = (data: StatsContent) => {
        startTransition(async () => {
            const result = await updateSectionContent(section.id, data);
            if (result.success) {
                toast.success("Platform Stats updated! Homepage will refresh shortly.");
                onSaved();
            }
        });
    };

    const statIndices = [0, 1, 2];

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {statIndices.map((i) => (
                    <div key={i} className="space-y-2">
                        <Field label={`Metric ${i + 1} Label`} id={`stats.${i}.label`}>
                            <input
                                id={`stats.${i}.label`}
                                {...register(`stats.${i}.label`)}
                                placeholder={["Active Vendors", "Monthly Orders", "Market Reach"][i]}
                                className={inputCls}
                            />
                        </Field>
                        <Field label="Live Value" id={`stats.${i}.value`}>
                            <input
                                id={`stats.${i}.value`}
                                {...register(`stats.${i}.value`)}
                                placeholder={["1,240+", "50,000+", "45 Regions"][i]}
                                className={`${inputCls} text-blue-600 font-bold`}
                            />
                        </Field>
                    </div>
                ))}
            </div>
            <SubmitButton isPending={isPending} />
        </form>
    );
}

// ─── Shared helpers ────────────────────────────────────────────────────────────
const inputCls =
    "w-full h-10 px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-colors";

function Field({
    label,
    id,
    children,
    className,
}: {
    label: string;
    id: string;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={`space-y-1 ${className ?? ""}`}>
            <label htmlFor={id} className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {label}
            </label>
            {children}
        </div>
    );
}

function SubmitButton({ isPending }: { isPending: boolean }) {
    return (
        <div className="flex justify-end pt-2">
            <button
                type="submit"
                disabled={isPending}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-bold px-5 py-2.5 rounded-full transition-colors shadow-sm"
            >
                {isPending ? (
                    <Loader2 size={16} className="animate-spin" />
                ) : (
                    <Save size={16} />
                )}
                {isPending ? "Saving..." : "Save Changes"}
            </button>
        </div>
    );
}

// ─── Scrolling Ticker Form ───────────────────────────────────────────────────
function ScrollingTickerForm({
    section,
    onSaved,
}: {
    section: StorefrontSectionData;
    onSaved: () => void;
}) {
    const content = section.content as ScrollingTickerContent;
    const { register, handleSubmit, reset } = useForm<ScrollingTickerContent>({
        defaultValues: content,
    });
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        reset(content);
    }, [content, reset]);

    const onSubmit = (data: ScrollingTickerContent) => {
        // Parse speed string back to number
        const payload = { ...data, speed: Number(data.speed) || 50 };
        startTransition(async () => {
            const result = await updateSectionContent(section.id, payload);
            if (result.success) {
                toast.success("Scrolling Ticker updated! Homepage will refresh shortly.");
                onSaved();
            }
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Field label="Ticker Text" id="text">
                <input
                    id="text"
                    {...register("text")}
                    placeholder="🔥 SUMMER SALE 🔥 50% OFF 🔥 LIMITED TIME ONLY 🔥"
                    className={inputCls}
                />
            </Field>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Field label="Background Color (hex)" id="bgColor">
                    <div className="flex gap-2">
                        <input
                            id="bgColor"
                            type="color"
                            {...register("bgColor")}
                            className="h-10 w-14 rounded-lg border border-slate-200 cursor-pointer p-1"
                        />
                        <input {...register("bgColor")} placeholder="#000000" className={`${inputCls} flex-1`} />
                    </div>
                </Field>
                <Field label="Text Color (hex)" id="textColor">
                    <div className="flex gap-2">
                        <input
                            id="textColor"
                            type="color"
                            {...register("textColor")}
                            className="h-10 w-14 rounded-lg border border-slate-200 cursor-pointer p-1"
                        />
                        <input {...register("textColor")} placeholder="#FFFFFF" className={`${inputCls} flex-1`} />
                    </div>
                </Field>
                <Field label="Speed (10=fast, 100=slow)" id="speed">
                    <input
                        id="speed"
                        type="number"
                        {...register("speed")}
                        placeholder="50"
                        className={inputCls}
                    />
                </Field>
            </div>
            <SubmitButton isPending={isPending} />
        </form>
    );
}

// ─── Bento Grid 4x4 Form ────────────────────────────────────────────────────
function BentoGridForm({
    section,
    onSaved,
}: {
    section: StorefrontSectionData;
    onSaved: () => void;
}) {
    const content = section.content as BentoGridContent;
    const { register, handleSubmit, reset } = useForm<BentoGridContent>({
        defaultValues: content,
    });
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        reset(content);
    }, [content, reset]);

    const onSubmit = (data: BentoGridContent) => {
        startTransition(async () => {
            const result = await updateSectionContent(section.id, data);
            if (result.success) {
                toast.success("Bento Grid updated! Homepage will refresh shortly.");
                onSaved();
            }
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl space-y-4">
                <h3 className="text-sm font-bold text-blue-900 border-b border-blue-100 pb-2">Main Feature (Left)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Field label="Title" id="largeItem.title">
                        <input id="largeItem.title" {...register("largeItem.title")} className={inputCls} />
                    </Field>
                    <Field label="Image URL" id="largeItem.imageUrl" className="md:col-span-2">
                        <input id="largeItem.imageUrl" {...register("largeItem.imageUrl")} className={inputCls} />
                    </Field>
                    <Field label="Link URL" id="largeItem.linkUrl" className="md:col-span-3">
                        <input id="largeItem.linkUrl" {...register("largeItem.linkUrl")} className={inputCls} />
                    </Field>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-800 border-b border-slate-200 pb-2">Sub-Items (Right 4x4 Grid)</h3>
                {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="flex flex-col md:flex-row gap-4 p-3 bg-slate-50 border border-slate-100 rounded-lg">
                        <div className="w-8 shrink-0 flex items-center justify-center font-bold text-slate-400 bg-white rounded shadow-sm border border-slate-100">
                            #{i + 1}
                        </div>
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <input {...register(`smallItems.${i}.title`)} placeholder="Card Title" className={inputCls} />
                            <input {...register(`smallItems.${i}.imageUrl`)} placeholder="Image URL" className={inputCls} />
                            <input {...register(`smallItems.${i}.linkUrl`)} placeholder="Link URL" className={inputCls} />
                        </div>
                    </div>
                ))}
            </div>

            <SubmitButton isPending={isPending} />
        </form>
    );
}

// ─── Animated Promo Card Form ────────────────────────────────────────────────
function AnimatedPromoCardForm({
    section,
    onSaved,
}: {
    section: StorefrontSectionData;
    onSaved: () => void;
}) {
    const content = section.content as AnimatedPromoCardContent;
    const { register, handleSubmit, reset } = useForm<AnimatedPromoCardContent>({
        defaultValues: content,
    });
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        reset(content);
    }, [content, reset]);

    const onSubmit = (data: AnimatedPromoCardContent) => {
        startTransition(async () => {
            const result = await updateSectionContent(section.id, data);
            if (result.success) {
                toast.success("Animated Promo Card updated! Homepage will refresh shortly.");
                onSaved();
            }
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Main Title" id="title">
                    <input id="title" {...register("title")} className={inputCls} />
                </Field>
                <Field label="Subtitle" id="subtitle">
                    <input id="subtitle" {...register("subtitle")} className={inputCls} />
                </Field>
                <Field label="Click Destination URL" id="linkUrl" className="md:col-span-2">
                    <input id="linkUrl" {...register("linkUrl")} placeholder="/collections/brand-exclusive" className={inputCls} />
                </Field>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Hover / Animated Images</h3>
                <p className="text-xs text-slate-400 mb-3 block">Provide up to 4 image URLs. They will crossfade sequentially.</p>
                {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3">
                        <span className="text-xs font-mono text-slate-400 w-16">Img {i + 1}</span>
                        <input
                            {...register(`images.${i}`)}
                            placeholder={`https://.../img-${i + 1}.jpg`}
                            className={`${inputCls} flex-1`}
                        />
                    </div>
                ))}
            </div>

            <SubmitButton isPending={isPending} />
        </form>
    );
}

// ─── Export: routes to correct form ──────────────────────────────────────────
export default function SectionForm({ section, onSaved }: Props) {
    switch (section.type) {
        case "HERO":
            return <HeroForm section={section} onSaved={onSaved} />;
        case "PROMO":
            return <PromoForm section={section} onSaved={onSaved} />;
        case "STATS":
            return <StatsForm section={section} onSaved={onSaved} />;
        case "SCROLLING_TICKER":
            return <ScrollingTickerForm section={section} onSaved={onSaved} />;
        case "BENTO_GRID_4X4":
            return <BentoGridForm section={section} onSaved={onSaved} />;
        case "ANIMATED_PROMO_CARD":
            return <AnimatedPromoCardForm section={section} onSaved={onSaved} />;
        default:
            return <p className="text-sm text-slate-500">Unknown section type: {section.type}</p>;
    }
}
