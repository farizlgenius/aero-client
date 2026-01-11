import * as signalR from "@microsoft/signalr";
import { HubEndPoint } from "../constants/constant";

const PORT = import.meta.env.PORT || 5031;
const server = import.meta.env.VITE_SERVER_IP || `${location.protocol}//${location.hostname}:${PORT}`;

class SignalRService {
  
  private connection: signalR.HubConnection | null = null;

  public getConnection(): signalR.HubConnection {
    if (!this.connection) {
      this.connection = new signalR.HubConnectionBuilder()
        .withUrl(server + HubEndPoint.AERO_HUB)
        .withAutomaticReconnect()
        .build();

      // Register lifecycle handlers (for logging & recovery)
      this.connection.onreconnecting((error) => {
        console.warn("[SignalR] Reconnecting...", error);
      });

      this.connection.onreconnected((connectionId) => {
        console.info("[SignalR] Reconnected successfully:", connectionId);
      });

      this.connection.onclose((error) => {
        console.error("[SignalR] Connection closed:", error);
        // Optional: You can auto-restart if desired
        //this.startConnection();
      });

      // Start the connection once
      this.startConnection();
    }

    return this.connection;
  }

  private async startConnection() {
    if (!this.connection) return;

    try {
      await this.connection.start();
      console.info("[SignalR] Connection started successfully.");
    } catch (error) {
      console.error("[SignalR] Connection start failed:", error);
      console.log(server)
      // Retry after delay if initial connect fails
      setTimeout(() => this.startConnection(), 5000);
    }

  }

  public stopConnection() {
    if (this.connection) {
      this.connection.stop()
        .then(() => console.info("[SignalR] Connection stopped."))
        .catch((error) => console.error("[SignalR] Stop error:", error));
      this.connection = null;
    }
  }
}

export default new SignalRService();