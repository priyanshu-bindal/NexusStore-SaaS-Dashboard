import {
    Html,
    Head,
    Preview,
    Body,
    Container,
    Section,
    Text,
    Hr,
    Column,
    Row,
} from "@react-email/components";
import * as React from "react";

interface OrderStatusEmailProps {
    orderId: string;
    customerName: string;
    newStatus: "SHIPPED" | "DELIVERED";
    trackingNumber?: string;
    carrier?: string;
}

export const OrderStatusEmail = ({
    orderId,
    customerName,
    newStatus,
    trackingNumber,
    carrier,
}: OrderStatusEmailProps) => {
    const isShipped = newStatus === "SHIPPED";
    const titleText = isShipped ? "Your Order is on the way!" : "Your Order has Arrived!";
    const previewText = isShipped
        ? `Order #${orderId} has been shipped.`
        : `Order #${orderId} has been delivered.`;

    const bodyText = isShipped
        ? "Good news! Your order has been shipped and is making its way to you."
        : "Your package has been delivered. We hope you enjoy your purchase!";

    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Section>
                        <Text style={heading}>NexusStore</Text>
                    </Section>

                    <Section>
                        <Text style={title}>{titleText}</Text>
                        <Text style={paragraph}>Hi {customerName},</Text>
                        <Text style={paragraph}>{bodyText}</Text>
                    </Section>

                    {/* Tracking Info (Only for SHIPPED) */}
                    {isShipped && trackingNumber && (
                        <Section style={trackingSection}>
                            <Text style={label}>Tracking Information</Text>
                            <Text style={trackingNumberStyle}>{trackingNumber}</Text>
                            {carrier && <Text style={carrierStyle}>via {carrier}</Text>}
                        </Section>
                    )}

                    <Section style={{ paddingBottom: "20px" }}>
                        <Text style={label}>Order Reference</Text>
                        <Text style={orderIdStyle}>#{orderId}</Text>
                    </Section>

                    <Hr style={hr} />

                    <Section>
                        <Text style={footer}>
                            If you have any questions, simply reply to this email.
                        </Text>
                        <Text style={footer}>
                            © 2026 NexusStore. All rights reserved.
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};

export default OrderStatusEmail;

const main = {
    backgroundColor: "#ffffff",
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
    margin: "0 auto",
    padding: "20px 0 48px",
    width: "100%",
    maxWidth: "600px",
};

const heading = {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#1a1a1a",
    textAlign: "center" as const,
    margin: "30px 0",
};

const title = {
    fontSize: "24px",
    lineHeight: "1.25",
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: "12px",
};

const paragraph = {
    fontSize: "16px",
    lineHeight: "24px",
    color: "#4b5563",
    marginBottom: "24px",
};

const trackingSection = {
    backgroundColor: "#f9fafb",
    padding: "16px",
    borderRadius: "8px",
    marginBottom: "24px",
};

const label = {
    fontSize: "14px",
    color: "#6b7280",
    marginBottom: "4px",
    fontWeight: "bold",
};

const trackingNumberStyle = {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#2563eb",
    margin: "0",
    fontFamily: "monospace",
};

const carrierStyle = {
    fontSize: "14px",
    color: "#4b5563",
    margin: "4px 0 0",
};

const orderIdStyle = {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#1a1a1a",
    margin: "0",
};

const hr = {
    borderColor: "#e5e7eb",
    margin: "32px 0",
};

const footer = {
    fontSize: "13px",
    color: "#9ca3af",
    textAlign: "center" as const,
    margin: "0 0 10px",
};
