### Authentifizierung

Die Pulse API verwendet einen Bearer Token:

Authorization: Bearer <api-secret>

Das Klartext-Secret wird ausschließlich auf der angebundenen Website gespeichert.

Pulse speichert nur den SHA-256-Hash des Secrets.