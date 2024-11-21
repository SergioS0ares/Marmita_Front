import {Injectable, signal} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class RouterService {
  previousUrl = signal<string | null>(null);
}
