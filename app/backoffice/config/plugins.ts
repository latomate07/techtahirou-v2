module.exports = ({ env }) => ({
    email: {
        config: {
            provider: 'nodemailer',
            providerOptions: {
                host: env('SMTP_HOST', 'smtp.mailgun.org'),
                port: env('SMTP_PORT', 587),
                auth: {
                    user: env('SMTP_USERNAME'),
                    pass: env('SMTP_PASSWORD'),
                },
                secure: false, // true for 465, false for other ports
            },
            settings: {
                defaultFrom: env('EMAIL_DEFAULT_FROM', 'noreply@clutchy.com'),
                defaultReplyTo: env('EMAIL_DEFAULT_REPLY_TO', 'noreply@clutchy.com'),
            },
        },
    },
});
