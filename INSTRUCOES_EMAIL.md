# 📧 Como Configurar Notificações por Email

Para receber um email sempre que alguém se cadastrar no formulário, você precisa atualizar o código do Google Apps Script.

## 📋 Passo a Passo

### 1. Acesse o Google Apps Script
- Acesse: https://script.google.com
- Encontre o projeto que está conectado ao seu Google Sheets

### 2. Atualize o Código
- Abra o arquivo `GOOGLE_APPS_SCRIPT_CODIGO.js` que está nesta pasta
- Copie todo o conteúdo
- Cole no Google Apps Script, substituindo o código atual

### 3. Configure o Email de Destino
No código, encontre a linha:
```javascript
const EMAIL_DESTINO = 'seu-email@exemplo.com'; // ALTERE AQUI!
```
E substitua pelo seu email que receberá as notificações.

### 4. Configure o ID da Planilha
No código, encontre a linha:
```javascript
const SPREADSHEET_ID = 'SEU_SPREADSHEET_ID_AQUI'; // ALTERE AQUI!
```
E substitua pelo ID da sua planilha do Google Sheets.

**Como encontrar o ID da planilha:**
- Abra sua planilha no Google Sheets
- Olhe na URL: `https://docs.google.com/spreadsheets/d/SEU_ID_AQUI/edit`
- O ID é a parte entre `/d/` e `/edit`

### 5. Salvar e Publicar
- Clique em **Salvar** (💾)
- Vá em **Publicar** → **Implantar como aplicativo da Web**
- Se já existe uma versão, clique em **Gerenciar implantações** → **Editar** → **Nova versão**
- Copie a nova URL e atualize no arquivo `netlify/functions/submit.js` se necessário

### 6. Testar
- Preencha o formulário no site
- Verifique se:
  - ✅ Os dados aparecem no Google Sheets
  - ✅ Você recebe um email de notificação

## 📝 Exemplo de Email que Você Receberá

O email terá:
- Assunto: "🎉 Nova Confirmação de Parceria - Caravana da Saúde"
- Corpo: Tabela formatada com todas as informações do cadastro

## ⚠️ Importante

- O email será enviado automaticamente para o endereço configurado em `EMAIL_DESTINO`
- Se o envio de email falhar, os dados ainda serão salvos no Google Sheets
- Você pode configurar múltiplos emails separando por vírgula: `'email1@exemplo.com, email2@exemplo.com'`

## 🔧 Solução de Problemas

**Email não está chegando?**
1. Verifique a pasta de spam
2. Confirme que o email está correto no código
3. Verifique os logs do Google Apps Script (Ver → Logs de execução)

**Erro ao salvar no Google Sheets?**
1. Verifique se o ID da planilha está correto
2. Confirme que a planilha tem as colunas corretas
3. Verifique as permissões do script

