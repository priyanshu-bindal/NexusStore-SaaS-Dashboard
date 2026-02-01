import {
    Html,
    Head,
    Preview,
    Body,
    Container,
    Section,
    Text,
    Hr,
    Row,
    Column,
} from "@react-email/components";
import * as React from "react";

interface OrderConfirmationProps {
    orderId: string;
    totalAmount: number;
    shippingAddress: {
        name: string;
        street: string;
        city: string;
        state: string;
        zip: string;
        country: string;
    };
    items: {
        productName: string;
        quantity: number;
        price: number;
        size?: string;
    }[];
}

export const OrderConfirmation = ({
    orderId,
    totalAmount,
    shippingAddress,
    items,
}: OrderConfirmationProps) => {
    return (
        <Html>
            <Head />
            <Preview>Your order #{orderId} has been confirmed!</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Section>
                        <Text style={heading}>NexusStore</Text>
                    </Section>
                    <Section>
                        <Text style={title}>Thank you for your order!</Text>
                        <Text style={paragraph}>
                            We're validating your order details and we'll send you another email
                            once your items have shipped.
                        </Text>
                    </Section>

                    <Section style={{ paddingBottom: "20px" }}>
                        <Row>
                            <Column>
                                <Text style={label}>Order Number</Text>
                                <Text style={orderIdStyle}>#{orderId}</Text>
                            </Column>
                            <Column align="right">
                                <Text style={label}>Total Amount</Text>
                                <Text style={{ ...orderIdStyle, color: "#1a1a1a" }}>
                                    ${Number(totalAmount).toFixed(2)}
                                </Text>
                            </Column>
                        </Row>
                    </Section>

                    <Hr style={hr} />

                    <Section>
                        <Text style={subTitle}>Order Summary</Text>
                        {items?.map((item, index) => (
                            <Row key={index} style={{ marginBottom: "12px" }}>
                                <Column>
                                    <Text style={productTitle}>{item.productName}</Text>
                                    {item.size && (
                                        <Text style={productMeta}>Size: {item.size}</Text>
                                    )}
                                    <Text style={productMeta}>Qty: {item.quantity}</Text>
                                </Column>
                                <Column align="right">
                                    <Text style={productPrice}>
                                        ${Number(item.price).toFixed(2)}
                                    </Text>
                                </Column>
                            </Row>
                        ))}
                    </Section>

                    <Hr style={hr} />

                    <Section>
                        <Text style={subTitle}>Shipping Address</Text>
                        <Text style={addressText}>
                            {shippingAddress?.name}
                            <br />
                            {shippingAddress?.street}
                            <br />
                            {shippingAddress?.city}, {shippingAddress?.state} {shippingAddress?.zip}
                            <br />
                            {shippingAddress?.country}
                        </Text>
                    </Section>

                    <Hr style={hr} />

                    <Section>
                        <Text style={footer}>
                            If you have any questions, reply to this email or contact our
                            support team.
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

export default OrderConfirmation;

const main = {
    backgroundColor: "#ffffff",
    fontFamily:
        '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
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

const subTitle = {
    fontSize: "18px",
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: "16px",
    display: "block",
};

const paragraph = {
    fontSize: "16px",
    lineHeight: "24px",
    color: "#4b5563",
    marginBottom: "24px",
};

const label = {
    fontSize: "14px",
    color: "#6b7280",
    marginBottom: "4px",
};

const orderIdStyle = {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#2563eb",
    margin: "0",
};

const productTitle = {
    fontSize: "15px",
    fontWeight: "600",
    color: "#1a1a1a",
    margin: "0 0 4px",
};

const productMeta = {
    fontSize: "13px",
    color: "#6b7280",
    margin: "0",
};

const productPrice = {
    fontSize: "15px",
    fontWeight: "500",
    color: "#1a1a1a",
    margin: "0",
};

const addressText = {
    fontSize: "15px",
    lineHeight: "24px",
    color: "#4b5563",
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
