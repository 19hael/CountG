# Automatizaciones con n8n

Este documento describe los flujos de automatización recomendados para CountG.

## Instalación de n8n

Para ejecutar estas automatizaciones localmente:

1. Instalar n8n: `npm install n8n -g`
2. Ejecutar: `n8n start`
3. Abrir `http://localhost:5678`

## Flujos Recomendados

### 1. Nueva Venta → Actualización Contable

**Trigger**: Webhook desde CountG (cuando se crea una venta).
**Lógica**:

- Si es contado: Crear registro en tabla `ingresos`.
- Si es crédito: Crear registro en tabla `facturas` y programar recordatorio.
  **Nodos**: Webhook -> If -> Postgres (Insert) -> WhatsApp (Send).

### 2. Alerta de Stock Bajo

**Trigger**: Cron (cada hora) o Database Trigger.
**Lógica**:

- Consultar productos con `stock_actual <= stock_minimo`.
- Si hay resultados: Generar lista.
- Enviar alerta al administrador.
  **Nodos**: Cron -> Postgres (Select) -> If (Not Empty) -> WhatsApp/Email.

### 3. Chatbot WhatsApp (Integración)

**Trigger**: Webhook de Twilio/WhatsApp API.
**Lógica**:

- Recibir mensaje.
- Enviar a API de CountG (`/api/chat`).
- Recibir respuesta de IA.
- Responder a usuario vía Twilio.
  **Nodos**: Webhook (Twilio) -> HTTP Request (CountG API) -> HTTP Request (Twilio Response).

## Ejemplo de Workflow JSON (Chatbot)

Puedes importar este JSON en n8n para configurar el bot básico.

```json
{
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "whatsapp-webhook",
        "options": {}
      },
      "name": "WhatsApp Webhook",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [250, 300]
    },
    {
      "parameters": {
        "url": "http://localhost:3000/api/chat",
        "method": "POST",
        "jsonParameters": true,
        "options": {},
        "bodyParametersUi": {
          "parameter": [
            {
              "name": "message",
              "value": "={{$node[\"WhatsApp Webhook\"].json[\"body\"][\"Body\"]}}"
            }
          ]
        }
      },
      "name": "Consultar IA",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 1,
      "position": [450, 300]
    },
    {
      "parameters": {
        "url": "https://api.twilio.com/2010-04-01/Accounts/{YOUR_ACCOUNT_SID}/Messages.json",
        "method": "POST",
        "authentication": "basicAuth",
        "options": {},
        "bodyParametersUi": {
          "parameter": [
            {
              "name": "To",
              "value": "={{$node[\"WhatsApp Webhook\"].json[\"body\"][\"From\"]}}"
            },
            {
              "name": "From",
              "value": "whatsapp:+14155238886"
            },
            {
              "name": "Body",
              "value": "={{$node[\"Consultar IA\"].json[\"response\"]}}"
            }
          ]
        }
      },
      "name": "Responder WhatsApp",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 1,
      "position": [650, 300]
    }
  ],
  "connections": {
    "WhatsApp Webhook": {
      "main": [
        [
          {
            "node": "Consultar IA",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Consultar IA": {
      "main": [
        [
          {
            "node": "Responder WhatsApp",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  }
}
```
