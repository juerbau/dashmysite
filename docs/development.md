# Entwicklung

## Datenbankzugriff

Während der Entwicklung wird PostgreSQL direkt über
JetBrains DataGrip (bzw. den Database Explorer von WebStorm)
über einen SSH-Tunnel erreicht.

Dadurch sind keine offenen Datenbankports erforderlich.

Die Anwendung selbst verbindet sich ausschließlich lokal auf dem VPS
mit PostgreSQL.

## Entwicklungsumgebung

DashMySite wird lokal entwickelt.

Die lokale Umgebung besteht aus:

- Next.js
- PostgreSQL (Docker)
- DataGrip
- WebStorm

Der VPS dient ausschließlich als Deployment- und Produktionsumgebung.

Lokale Entwicklung und Produktivbetrieb verwenden dieselbe PostgreSQL-Version und dasselbe Datenbankschema.

## Konfiguration

Docker und Next.js besitzen bewusst getrennte
Konfigurationsdateien.

docker/postgres/postgres.env
→ Initialisierung des PostgreSQL-Containers

.env.local
→ Verbindung der Next.js-Anwendung zur Datenbank