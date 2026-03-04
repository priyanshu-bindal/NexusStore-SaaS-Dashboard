"use client";

import { Star } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
    rating: number;
    maxRating?: number;
    onRatingChange?: (rating: number) => void;
    size?: number;
    interactive?: boolean;
    className?: string;
}

export function StarRating({
    rating,
    maxRating = 5,
    onRatingChange,
    size = 20,
    interactive = false,
    className,
}: StarRatingProps) {
    const [hoverRating, setHoverRating] = useState<number | null>(null);

    const handleMouseEnter = (index: number) => {
        if (interactive) {
            setHoverRating(index);
        }
    };

    const handleMouseLeave = () => {
        if (interactive) {
            setHoverRating(null);
        }
    };

    const handleClick = (index: number) => {
        if (interactive && onRatingChange) {
            onRatingChange(index);
        }
    };

    return (
        <div className={cn("flex items-center gap-0.5", className)}>
            {Array.from({ length: maxRating }).map((_, i) => {
                const starIndex = i + 1;
                const isConfigured = interactive ? (hoverRating !== null ? starIndex <= hoverRating : starIndex <= rating) : starIndex <= rating;

                return (
                    <button
                        key={i}
                        type="button"
                        onClick={() => handleClick(starIndex)}
                        onMouseEnter={() => handleMouseEnter(starIndex)}
                        onMouseLeave={handleMouseLeave}
                        disabled={!interactive}
                        className={cn(
                            "transition-all duration-200 focus:outline-none",
                            interactive ? "cursor-pointer hover:scale-110" : "cursor-default"
                        )}
                        aria-label={`Rate ${starIndex} stars`}
                    >
                        <Star
                            size={size}
                            className={cn(
                                "transition-colors",
                                isConfigured
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "fill-slate-100 text-slate-300"
                            )}
                            strokeWidth={isConfigured ? 0 : 1.5}
                        />
                    </button>
                );
            })}
        </div>
    );
}
