### Authentifizierung

Die DashMySite API verwendet einen Bearer Token:

Authorization: Bearer <api-secret>

Das Klartext-Secret wird ausschließlich auf der angebundenen Website gespeichert.

DashMySite speichert nur den SHA-256-Hash des Secrets.