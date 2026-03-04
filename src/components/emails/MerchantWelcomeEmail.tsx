import * as React from 'react';

interface MerchantWelcomeEmailProps {
    name: string;
}

export const MerchantWelcomeEmail: React.FC<Readonly<MerchantWelcomeEmailProps>> = ({
    name,
}) => (
    <div style={{ fontFamily: 'sans-serif', padding: '20px', color: '#333' }}>
        <h1 style={{ color: '#0f172a' }}>Welcome to NexusStore, {name}!</h1>
        <p>
            Thank you for applying to become a merchant on NexusStore.
            Your application has been received and is currently under review.
        </p>
        <p>
            We will review your details and send you an email within 24 hours regarding your approval status.
        </p>
        <br />
        <p>Best regards,</p>
        <p><strong>The NexusStore Team</strong></p>
    </div>
);
