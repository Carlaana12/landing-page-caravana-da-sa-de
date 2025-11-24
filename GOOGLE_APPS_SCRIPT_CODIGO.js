/**
 * CÓDIGO PARA O GOOGLE APPS SCRIPT
 * 
 * INSTRUÇÕES:
 * 1. Acesse https://script.google.com
 * 2. Crie um novo projeto
 * 3. Cole este código
 * 4. Configure o email de destino na variável EMAIL_DESTINO
 * 5. Salve e publique como Web App
 * 6. Copie a URL e atualize no arquivo submit.js
 */

// CONFIGURE AQUI O EMAIL QUE RECEBERÁ AS NOTIFICAÇÕES
const EMAIL_DESTINO = 'seu-email@exemplo.com'; // ALTERE AQUI!

function doPost(e) {
  try {
    // Parse dos dados recebidos
    const data = JSON.parse(e.postData.contents);
    
    // Conectar à planilha
    // OPÇÃO 1: Se o script está vinculado à planilha, use:
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // OPÇÃO 2: Se preferir usar o ID da planilha, descomente a linha abaixo e comente a linha acima:
    // const SPREADSHEET_ID = 'SEU_SPREADSHEET_ID_AQUI'; // ALTERE AQUI!
    // const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getActiveSheet();
    
    // Adicionar dados à planilha
    const row = [
      new Date(), // Data/Hora
      data.nomeCompleto || '',
      data.crm || '',
      data.especialidade || '',
      data.telefone || '',
      data.email || '',
      data.cidadeEstado || '',
      data.instituicao || '',
      data.observacoes || '',
      data.confirmacao ? 'Sim' : 'Não'
    ];
    
    sheet.appendRow(row);
    
    // Enviar email de notificação
    enviarEmailNotificacao(data);
    
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success', message: 'Dados salvos com sucesso!' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    Logger.log('Erro: ' + error.toString());
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function enviarEmailNotificacao(data) {
  try {
    const assunto = '🎉 Nova Confirmação de Parceria - Caravana da Saúde';
    
    const corpoEmail = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #498367; border-bottom: 3px solid #498367; padding-bottom: 10px;">
          Nova Confirmação de Parceria Recebida
        </h2>
        
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #333; margin-top: 0;">Informações do Parceiro:</h3>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px; font-weight: bold; color: #555;">Nome Completo:</td>
              <td style="padding: 8px;">${data.nomeCompleto || 'Não informado'}</td>
            </tr>
            <tr style="background-color: #fff;">
              <td style="padding: 8px; font-weight: bold; color: #555;">CRM:</td>
              <td style="padding: 8px;">${data.crm || 'Não informado'}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold; color: #555;">Especialidade:</td>
              <td style="padding: 8px;">${data.especialidade || 'Não informado'}</td>
            </tr>
            <tr style="background-color: #fff;">
              <td style="padding: 8px; font-weight: bold; color: #555;">Telefone:</td>
              <td style="padding: 8px;">${data.telefone || 'Não informado'}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold; color: #555;">E-mail:</td>
              <td style="padding: 8px;">${data.email || 'Não informado'}</td>
            </tr>
            <tr style="background-color: #fff;">
              <td style="padding: 8px; font-weight: bold; color: #555;">Cidade/Estado:</td>
              <td style="padding: 8px;">${data.cidadeEstado || 'Não informado'}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold; color: #555;">Instituição:</td>
              <td style="padding: 8px;">${data.instituicao || 'Não informado'}</td>
            </tr>
            <tr style="background-color: #fff;">
              <td style="padding: 8px; font-weight: bold; color: #555;">Observações:</td>
              <td style="padding: 8px;">${data.observacoes || 'Nenhuma observação'}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold; color: #555;">Confirmação:</td>
              <td style="padding: 8px; color: ${data.confirmacao ? '#28a745' : '#dc3545'};">
                ${data.confirmacao ? '✅ Confirmado' : '❌ Não confirmado'}
              </td>
            </tr>
          </table>
        </div>
        
        <p style="color: #666; font-size: 14px; margin-top: 20px;">
          Esta é uma notificação automática do sistema de confirmação de parcerias da Caravana da Saúde.
        </p>
        
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        
        <p style="color: #999; font-size: 12px; text-align: center;">
          Caravana da Saúde - Sistema de Confirmação de Parcerias
        </p>
      </div>
    `;
    
    MailApp.sendEmail({
      to: EMAIL_DESTINO,
      subject: assunto,
      htmlBody: corpoEmail
    });
    
    Logger.log('Email de notificação enviado com sucesso para: ' + EMAIL_DESTINO);
    
  } catch (error) {
    Logger.log('Erro ao enviar email: ' + error.toString());
    // Não interrompe o processo se o email falhar
  }
}

