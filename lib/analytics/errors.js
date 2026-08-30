export class UnknownSiteError extends Error {
    constructor() {
        super("Unknown site");
        this.name = "UnknownSiteError";
    }
}

export class InactiveSiteError extends Error {
    constructor() {
        super("Site is inactive");
        this.name = "InactiveSiteError";
    }
}

export class InvalidApiSecretError extends Error {
    constructor() {
        super("Invalid API secret");
        this.name = "InvalidApiSecretError";
    }
}

export class InvalidTrackingDataError extends Error {
    constructor(message) {
        super(message);
        this.name = "InvalidTrackingDataError";
    }
}