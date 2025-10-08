class Logger {
    private static timestamp() {
        return new Date().toISOString();
        
    }

    static info(e: unknown) {

        if (e instanceof Error) {

            console.error(`[${this.timestamp()}] [ERROR]: ${e.message}`);
        }
        else {
            console.info(`[${this.timestamp()}] [INFO]: ${String(e)}`);
        }

    }

    static warn(e: unknown) {
                if (e instanceof Error) {

            console.error(`[${this.timestamp()}] [ERROR]: ${e.message}`);
        } else {
            console.warn(`[${this.timestamp()}] [WARN]: ${String(e)}`);
        }
    }

    static error(e: unknown) {
                        if (e instanceof Error) {

            console.error(`[${this.timestamp()}] [ERROR]: ${e.message}`);
        } else {
            console.error(`[${this.timestamp()}] [ERROR]: ${String(e)}`);
        }
    }
}

export default Logger;
