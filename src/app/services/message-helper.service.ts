import {inject, Injectable} from "@angular/core";
import {MessageService} from "primeng/api";

@Injectable({
  providedIn: 'root'
})
export class MessageHelperService {
  messageService = inject(MessageService)

  sendErrorMessage(summary: string, message: string): void {
    this.sendMessage(summary, message, "error")
  }

  sendSuccessMessage(summary: string, message: string): void {
    this.sendMessage(summary, message, "success")
  }

  private sendMessage(summary: string, detail: string, severity: string): void {
    this.messageService.add({summary, detail, severity, life: 3000, closable: true, key: 'main-toast'})
  }

}
