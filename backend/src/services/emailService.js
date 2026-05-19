/**
 * Configuración de Nodemailer para enviar emails
 */
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

/**
 * Envía un código OTP al email del usuario
 */
export const sendOTPEmail = async (email, code) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: '🔐 Tu código de acceso de 4 dígitos',
            html: `
                <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
                    <div style="background-color: #FF8C00; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
                        <h1 style="color: white; margin: 0;">TICKET</h1>
                    </div>
                    <div style="background-color: #f9f9f9; padding: 40px; border-radius: 0 0 8px 8px;">
                        <h2 style="color: #0B1F3A; margin-top: 0;">Tu código de acceso</h2>
                        <p style="color: #666; font-size: 16px;">Ingresa el siguiente código para acceder a tu cuenta:</p>
                        
                        <div style="background-color: white; border: 2px solid #FF8C00; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
                            <p style="font-size: 36px; font-weight: bold; color: #FF8C00; margin: 0; letter-spacing: 5px;">
                                ${code}
                            </p>
                        </div>
                        
                        <p style="color: #999; font-size: 14px;">
                            Este código expira en 10 minutos.
                        </p>
                        <p style="color: #999; font-size: 14px;">
                            Si no solicitaste este código, ignora este email.
                        </p>
                        
                        <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
                        
                        <p style="color: #999; font-size: 12px; text-align: center;">
                            © 2024 TICKET. Todos los derechos reservados.
                        </p>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`Email enviado a ${email}`);
        return true;
    } catch (error) {
        console.error('Error enviando email:', error);
        throw new Error('Error al enviar el email');
    }
};

/**
 * Envía un ticket en PDF por email
 */
export const sendTicketEmail = async (email, ticket, event, pdfBuffer, ticketNumber, totalTickets) => {
    try {
        const eventDate = new Date(event.fecha);
        const formattedDate = eventDate.toLocaleDateString('es-ES', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });

        const subject = totalTickets > 1
            ? `🎫 Tu Ticket ${ticketNumber} de ${totalTickets} - ${event.titulo}`
            : `🎫 Tu Ticket - ${event.titulo}`;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: subject,
            html: `
                <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
                    <div style="background-color: #FF8C00; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
                        <h1 style="color: white; margin: 0;">TICKET APP</h1>
                    </div>
                    <div style="background-color: #f9f9f9; padding: 40px; border-radius: 0 0 8px 8px;">
                        <h2 style="color: #0B1F3A; margin-top: 0;">¡Tu ticket está listo!</h2>

                        ${totalTickets > 1 ? `<p style="color: #666; font-size: 16px;">Este es el ticket ${ticketNumber} de ${totalTickets} que solicitaste.</p>` : ''}

                        <div style="background-color: white; border: 1px solid #ddd; border-radius: 8px; padding: 20px; margin: 20px 0;">
                            <h3 style="color: #0B1F3A; margin-top: 0;">${event.titulo}</h3>
                            <p style="color: #666; margin: 5px 0;"><strong>Fecha:</strong> ${formattedDate}</p>
                            <p style="color: #666; margin: 5px 0;"><strong>Lugar:</strong> ${event.direccion || 'Dirección no disponible'}</p>
                            <p style="color: #666; margin: 5px 0;"><strong>Ciudad:</strong> ${event.ciudad || 'Ciudad no disponible'}</p>
                            <p style="color: #666; margin: 5px 0;"><strong>Nombre:</strong> ${ticket.nombre}</p>
                        </div>

                        <p style="color: #666; font-size: 16px;">
                            Adjunto encontrarás tu ticket en formato PDF con el código QR de acceso.
                            Presenta este documento en la entrada del evento.
                        </p>

                        <div style="background-color: #FFF3CD; border: 1px solid #FFEAA7; border-radius: 4px; padding: 15px; margin: 20px 0;">
                            <p style="color: #856404; margin: 0; font-size: 14px;">
                                <strong>Importante:</strong> Guarda este email y el PDF adjunto.
                                El código QR es único y necesario para ingresar al evento.
                            </p>
                        </div>

                        <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">

                        <p style="color: #999; font-size: 12px; text-align: center;">
                            © 2024 TICKET APP. Todos los derechos reservados.
                        </p>
                    </div>
                </div>
            `,
            attachments: [
                {
                    filename: totalTickets > 1
                        ? `ticket-${event.titulo.replace(/[^a-zA-Z0-9]/g, '-')}-${ticketNumber}.pdf`
                        : `ticket-${event.titulo.replace(/[^a-zA-Z0-9]/g, '-')}.pdf`,
                    content: pdfBuffer,
                    contentType: 'application/pdf'
                }
            ]
        };

        await transporter.sendMail(mailOptions);
        console.log(`Ticket PDF enviado a ${email} - Ticket ${ticketNumber}/${totalTickets}`);
        return true;
    } catch (error) {
        console.error('Error enviando email con ticket:', error);
        throw new Error('Error al enviar el email con el ticket');
    }
};
