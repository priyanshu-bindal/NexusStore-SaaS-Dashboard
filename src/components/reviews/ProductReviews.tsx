"use client";

import { useActionState, useState } from "react";
import { StarRating } from "./StarRating";
import { addReview } from "@/actions/review";
import { User } from "lucide-react";

interface Review {
    id: string;
    rating: number;
    comment: string | null;
    createdAt: Date;
    user: {
        name: string | null;
        image: string | null;
    };
}

interface ProductReviewsProps {
    productId: string;
    reviews: Review[];
    currentUser?: {
        id: string;
        name?: string | null;
        image?: string | null;
    } | null;
}

export function ProductReviews({ productId, reviews, currentUser }: ProductReviewsProps) {
    const averageRating = reviews.length > 0
        ? (reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1)
        : null;

    return (
        <div className="space-y-10 py-10">
            {/* Header section */}
            <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold text-slate-900">Customer Reviews</h2>
                {averageRating && (
                    <div className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full">
                        <StarRating rating={Number(averageRating)} size={16} />
                        <span className="font-bold text-slate-900">{averageRating}</span>
                        <span className="text-slate-500 text-sm">({reviews.length} reviews)</span>
                    </div>
                )}
            </div>

            {/* Add Review Form */}
            {currentUser ? (
                <div className="bg-slate-50 rounded-2xl p-6 md:p-8">
                    <h3 className="font-bold text-lg mb-4">Write a Review</h3>
                    <AddReviewForm productId={productId} />
                </div>
            ) : (
                <div className="bg-slate-50 rounded-2xl p-6 text-center">
                    <p className="text-slate-600">Please <a href="/auth/login" className="text-blue-600 font-bold hover:underline">log in</a> to write a review.</p>
                </div>
            )}

            {/* Reviews List */}
            <div className="space-y-6">
                {reviews.length === 0 ? (
                    <p className="text-slate-500 italic">No reviews yet. Be the first to share your thoughts!</p>
                ) : (
                    reviews.map((review) => (
                        <div key={review.id} className="border-b border-slate-100 pb-6 last:border-0 last:pb-0">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 bg-slate-200 rounded-full flex items-center justify-center overflow-hidden">
                                        {review.user.image ? (
                                            <img src={review.user.image} alt={review.user.name || "User"} className="h-full w-full object-cover" />
                                        ) : (
                                            <User size={16} className="text-slate-500" />
                                        )}
                                    </div>
                                    <span className="font-bold text-slate-900 text-sm">{review.user.name || "Anonymous"}</span>
                                </div>
                                <span className="text-xs text-slate-400">
                                    {new Date(review.createdAt).toLocaleDateString()}
                                </span>
                            </div>

                            <div className="mb-2">
                                <StarRating rating={review.rating} size={14} />
                            </div>

                            {review.comment && (
                                <p className="text-slate-600 text-sm leading-relaxed">{review.comment}</p>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

function AddReviewForm({ productId }: { productId: string }) {
    const [rating, setRating] = useState(0);
    const [state, formAction, isPending] = useActionState(async (prevState: any, formData: FormData) => {
        const comment = formData.get("comment") as string;

        if (rating === 0) {
            return { error: "Please select a star rating." };
        }

        const result = await addReview(productId, rating, comment);

        if (result.success) {
            // Reset form manually if needed or rely on key-change remount
        }
        return result;
    }, null);

    return (
        <form action={formAction} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Rating</label>
                <div className="flex items-center gap-2">
                    <StarRating
                        rating={rating}
                        onRatingChange={setRating}
                        interactive={true}
                        size={24}
                    />
                    <span className="text-sm text-slate-500 font-medium">
                        {rating > 0 ? `${rating} Stars` : "Select a rating"}
                    </span>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Comment</label>
                <textarea
                    name="comment"
                    rows={4}
                    placeholder="Tell us what you think about this product..."
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none text-sm"
                    required
                />
            </div>

            {state?.error && (
                <div className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded-lg">
                    {state.error}
                </div>
            )}

            {state?.success && (
                <div className="text-green-600 text-sm font-medium bg-green-50 p-3 rounded-lg">
                    Review submitted successfully!
                </div>
            )}

            <button
                type="submit"
                disabled={isPending || rating === 0}
                className="bg-black text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isPending ? "Submitting..." : "Submit Review"}
            </button>
        </form>
    );
}
