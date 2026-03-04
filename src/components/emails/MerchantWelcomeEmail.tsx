import * as React from 'react';

interface MerchantWelcomeEmailProps {
    name: string;
}

export const MerchantWelcomeEmail: React.FC<Readonly<MerchantWelcomeEmailProps>> = ({
    name,
}) => (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
        <h1 style={{ color: '#0f172a' }}>Welcome to Shopystore, {name}!</h1>
        <p>
            Thank you for applying to become a merchant on Shopystore.
            Your application is currently being reviewed by our team.
        </p>
        <p>
            We will get back to you within 2-3 business days with an update on your status.
        </p>
        <p>Best regards,</p>
        <p><strong>The Shopystore Team</strong></p>
    </div>
);
