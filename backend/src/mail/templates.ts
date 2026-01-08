export function renderBaseTemplate(
  content: string,
  title: string = 'IndustriaSP',
) {
  // Styles for compatibility
  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');
    body { margin: 0; padding: 0; background-color: #f3f4f6; font-family: 'Roboto', Arial, sans-serif; -webkit-font-smoothing: antialiased; }
    table { border-collapse: collapse; }
    .wrapper { width: 100%; background-color: #f3f4f6; padding: 40px 0; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
    .header { background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%); padding: 40px; text-align: left; }
    .logo-text { color: #ffffff; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; display: block; }
    .welcome-text { color: #ffffff; font-size: 32px; font-weight: 700; margin: 0; line-height: 1.2; }
    .content { padding: 40px; color: #374151; font-size: 16px; line-height: 1.6; background-color: #ffffff; }
    .btn { display: inline-block; background-color: #2563eb; color: #ffffff !important; font-weight: 600; padding: 16px 40px; border-radius: 12px; text-decoration: none; font-size: 16px; text-align: center; width: auto; min-width: 200px; box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2); }
    .btn:hover { background-color: #1d4ed8; }
    .footer { background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0; }
    .footer-text { font-size: 12px; color: #64748b; margin-bottom: 8px; }
    .footer-link { color: #64748b; text-decoration: underline; }
    
    /* Feature boxes */
    .features-table { width: 100%; margin-top: 30px; margin-bottom: 30px; }
    .feature-box { background-color: #f8fafc; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; }
    .feature-title { font-weight: 700; color: #1e293b; font-size: 14px; margin-bottom: 4px; display: block; }
    .feature-desc { color: #64748b; font-size: 14px; margin: 0; }

    @media (max-width: 600px) {
      .wrapper { padding: 10px; }
      .container { border-radius: 12px; }
      .header { padding: 30px 20px; }
      .content { padding: 30px 20px; }
      .welcome-text { font-size: 28px; }
      .features-td { display: block; width: 100%; padding-bottom: 10px; }
      .features-td:last-child { padding-bottom: 0; }
    }
  `;

  return `<!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>${title}</title>
    <style>${styles}</style>
  </head>
  <body>
    <div class="wrapper">
      <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
          <td align="center">
            <!-- Main Container -->
            <table role="presentation" class="container" width="600" border="0" cellspacing="0" cellpadding="0">
              
              <!-- Header -->
              <tr>
                <td class="header">
                  <span class="logo-text">INDUSTRIAS SP</span>
                  <h1 class="welcome-text">Bienvenido</h1>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td class="content">
                  ${content}
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td class="footer">
                  <div class="footer-text">
                    Enviado por Industrias SP · © ${new Date().getFullYear()}
                  </div>
                  <div class="footer-text">
                    <a href="mailto:soporte@industriasp.com" class="footer-link">Soporte</a> · 
                    <a href="#" class="footer-link">Privacidad</a>
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  </body>
  </html>`;
}

export function accountCreationTemplate(name: string) {
  return renderBaseTemplate(
    `
    <p>Hola <strong>${name}</strong>,</p>
    <p>Tu cuenta en <strong>Industrias SP</strong> ha sido creada exitosamente.</p>
    <p>Estamos emocionados de tenerte con nosotros. Ahora podrás acceder a nuestro catálogo exclusivo, realizar cotizaciones y gestionar tus pedidos.</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${process.env.WEB_URL || 'http://localhost:3000'}/auth/login" class="btn">Iniciar Sesión</a>
    </div>
    <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
    `,
    'Bienvenido a Industrias SP',
  );
}

export function verifyEmailTemplate(name: string, url: string) {
  return renderBaseTemplate(
    `
    <p>Hola <strong>${name}</strong>,</p>
    <p>Gracias por registrarte en <strong>Industrias SP</strong>.</p>
    <p>Para completar tu registro y activar tu cuenta, por favor verifica tu correo electrónico haciendo clic en el siguiente botón:</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${url}" class="btn">Verificar Email</a>
    </div>
    <p>O copia y pega el siguiente enlace en tu navegador:</p>
    <p style="word-break: break-all; color: #2563eb;">${url}</p>
    <p>Este enlace expirará en 24 horas.</p>
    `,
    'Verifica tu cuenta - Industrias SP',
  );
}

export function passwordResetTemplate() {
  const t = (n: string) => '${' + n + '}';
  const content = `
    <p style="margin-top: 0; font-size: 18px; color: #1e293b; font-weight: 500;">
      Solicitud de cambio de contraseña
    </p>
    <p>Hola ${t('user_full_name')},</p>
    <p>Hemos recibido una solicitud para restablecer tu contraseña. Haz clic en el botón de abajo para crear una nueva.</p>
    
    <div style="text-align: center; margin: 35px 0;">
      <a class="btn" href="${t('reset_url')}" target="_blank">Restablecer Contraseña</a>
    </div>

    <p style="font-size: 14px; color: #64748b; text-align: center; background-color: #f1f5f9; padding: 15px; border-radius: 8px;">
      Este enlace expirará en <strong>${t('expire_hours')} horas</strong>.
    </p>
  `;
  return renderBaseTemplate(content, 'Restablecer Contraseña');
}

export function orderRegisteredTemplate() {
  const t = (n: string) => '${' + n + '}';
  const content = `
    <p style="margin-top: 0; font-size: 18px; color: #1e293b; font-weight: 500;">
      ¡Tu orden ha sido confirmada!
    </p>
    <p>Hola ${t('user_full_name')}, aquí tienes los detalles de tu compra.</p>
    
    <div style="background-color: #f8fafc; border-radius: 12px; padding: 24px; margin: 24px 0; border: 1px solid #e2e8f0;">
      <table width="100%" border="0">
        <tr>
          <td style="padding-bottom: 12px; border-bottom: 1px solid #e2e8f0;"><strong>Orden:</strong></td>
          <td style="padding-bottom: 12px; border-bottom: 1px solid #e2e8f0; text-align: right;">${t('order_number')}</td>
        </tr>
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;"><strong>Seguimiento:</strong></td>
          <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; text-align: right;">${t('tracking_number')}</td>
        </tr>
        <tr>
          <td style="padding-top: 12px; font-size: 18px; font-weight: 700; color: #2563eb;">Total</td>
          <td style="padding-top: 12px; font-size: 18px; font-weight: 700; color: #2563eb; text-align: right;">${t('total')}</td>
        </tr>
      </table>
    </div>

    <div style="margin-bottom: 30px;">
      <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">Resumen:</h3>
      ${t('items_summary_html')}
    </div>

    <div style="text-align: center; margin: 30px 0;">
      <a class="btn" href="${t('details_url')}" target="_blank">Ver Detalles</a>
    </div>
  `;
  return renderBaseTemplate(content, 'Orden Confirmada');
}

export function promotionalTemplate() {
  const t = (n: string) => '${' + n + '}';
  const content = `
    <h2 style="margin-top: 0; color: #1e293b;">${t('promo_title')}</h2>
    
    <div style="margin-bottom: 30px;">
      ${t('promo_body_html')}
    </div>

    <div style="text-align: center; margin: 30px 0;">
      <a class="btn" href="${t('promo_cta_url')}" target="_blank">${t('promo_cta_text')}</a>
    </div>
  `;
  return renderBaseTemplate(content, 'Novedades IndustriaSP');
}
