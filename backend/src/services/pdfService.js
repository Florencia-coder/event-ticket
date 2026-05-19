import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';

/**
 * Genera un PDF con el ticket y QR code
 */
export const generateTicketPDF = async (ticket, event) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Crear documento PDF
            const doc = new PDFDocument({
                size: 'A4',
                margin: 50
            });

            const buffers = [];

            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                const pdfBuffer = Buffer.concat(buffers);
                resolve(pdfBuffer);
            });

            // Generar QR code como buffer
            const qrDataUrl = await QRCode.toDataURL(ticket.qrData, {
                width: 200,
                margin: 2,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF'
                }
            });

            // Convertir data URL a buffer (remover el prefijo data:image/png;base64,)
            const qrBuffer = Buffer.from(qrDataUrl.split(',')[1], 'base64');

            // Header
            doc.fillColor('#FF8C00')
                .fontSize(28)
                .font('Helvetica-Bold')
                .text('TICKET APP', { align: 'center' });

            doc.moveDown(2);

            // Título del evento
            doc.fillColor('#0B1F3A')
                .fontSize(20)
                .font('Helvetica-Bold')
                .text(event.titulo || 'Evento', { align: 'center' });

            doc.moveDown(1);

            // Información del ticket
            doc.fillColor('#333')
                .fontSize(12)
                .font('Helvetica');

            const eventDate = new Date(event?.fecha || Date.now());
            const formattedDate = isNaN(eventDate.getTime())
                ? 'Fecha no disponible'
                : eventDate.toLocaleDateString('es-ES', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                });

            doc.text(`Fecha: ${formattedDate}`);
            doc.text(`Lugar: ${event?.direccion || 'Dirección no disponible'}`);
            doc.text(`Ciudad: ${event?.ciudad || 'Ciudad no disponible'}`);
            doc.text(`Organizador: ${event?.organizador || 'TicketApp'}`);

            doc.moveDown(1);

            // Información del comprador
            doc.fillColor('#666')
                .fontSize(11);
            doc.text(`Nombre: ${ticket.nombre}`);
            doc.text(`WhatsApp: ${ticket.whatsapp || 'No proporcionado'}`);
            doc.text(`Email: ${ticket.email}`);

            doc.moveDown(2);

            // QR Code
            doc.fillColor('#0B1F3A')
                .fontSize(14)
                .font('Helvetica-Bold')
                .text('Código QR de Acceso', { align: 'center' });

            doc.moveDown(1);

            // Centrar el QR code
            const qrX = (doc.page.width - 200) / 2;
            const qrY = doc.y;

            doc.image(qrBuffer, qrX, qrY, {
                width: 200,
                height: 200
            });

            doc.moveDown(3);

            // Código del ticket
            doc.fillColor('#999')
                .fontSize(10)
                .text(`ID del Ticket: ${ticket.id}`, { align: 'center' });
            doc.text(`Código: ${ticket.qrData}`, { align: 'center' });

            doc.moveDown(1);

            // Footer
            doc.fillColor('#999')
                .fontSize(8)
                .text('© 2024 TICKET APP. Todos los derechos reservados.', { align: 'center' });
            doc.text('Presenta este ticket en la entrada del evento.', { align: 'center' });

            // Finalizar documento
            doc.end();

        } catch (error) {
            reject(error);
        }
    });
};