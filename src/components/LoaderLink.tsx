"use client";

import Link, { LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import { useGlobalLoader } from "@/context/GlobalLoaderContext";
import { AnchorHTMLAttributes, forwardRef } from "react";

type LoaderLinkProps = LinkProps & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps>;

export const LoaderLink = forwardRef<HTMLAnchorElement, LoaderLinkProps>(
    ({ href, onClick, ...props }, ref) => {
        const { startLoading } = useGlobalLoader();
        const pathname = usePathname();

        const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
            // Allow user to open in new tab via ctrl/cmd/shift without showing loader
            if (!e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey) {
                const targetUrl = typeof href === 'string' ? href : href.pathname;
                // Only trigger loading if we are actually navigating to a new route
                if (targetUrl && targetUrl !== pathname) {
                    startLoading();
                }
            }
            if (onClick) onClick(e);
        };

        return (
            <Link href={href} onClick={handleClick} ref={ref} {...props} />
        );
    }
);

LoaderLink.displayName = "LoaderLink";
