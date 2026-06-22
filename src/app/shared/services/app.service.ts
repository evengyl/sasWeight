import { HttpClient } from '@angular/common/http';
import { effect, inject, Injectable, signal } from '@angular/core';
import { MessageService } from 'primeng/api';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {

    readonly stateOnlineWWW = signal<boolean>(navigator.onLine);
    private readonly messageService = inject(MessageService);
    private readonly http = inject(HttpClient);

  constructor() { 
    // Écoute les changements de statut en ligne/hors ligne
    globalThis.addEventListener('online', () => this.stateOnlineWWW.set(true));
    globalThis.addEventListener('offline', () => this.stateOnlineWWW.set(false));

     // 2. Vérification périodique ou au démarrage
    this.checkRealStatus();
    setInterval(() => this.checkRealStatus(), 5000); // Optionnel: vérifie toutes les 5s

    effect(() => {
        console.log(this.stateOnlineWWW())
        if(this.stateOnlineWWW()) {
            this.messageService.add({ severity: 'success', summary: 'En ligne', detail: 'Vous êtes de nouveau en ligne.' });
        } else {
            this.messageService.add({ severity: 'error', summary: 'Hors ligne', detail: 'Vous êtes actuellement hors ligne. Certaines fonctionnalités peuvent être limitées.' });
        }
    })
  }


  /**
   * Envoie une mini requête HTTP légère vers votre backend ou une image de 1px
   */
  async checkRealStatus(): Promise<boolean> {
    if (!navigator.onLine) {
      this.stateOnlineWWW.set(false);
      return false;
    }

    try {
      // Utilisez une URL de votre API qui répond rapidement (Ex: un endpoint /ping ou /health)
      // On ajoute un timestamp (?t=...) pour éviter que le navigateur ne mette la réponse en cache
      await firstValueFrom(
        this.http.get(`/api/ping?t=${Date.now()}`, { responseType: 'text' })
      );
      this.stateOnlineWWW.set(true);
      return true;
    } catch (error) {
      // Si la requête échoue (Pas d'internet, câble coupé, serveur en panne), on est hors ligne
      this.stateOnlineWWW.set(false);
      throw error;
    }
  }
}
