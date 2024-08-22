import { Injectable, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  snackbar: MatSnackBar = inject(MatSnackBar);

  show(message: string, action: string = 'Close', config: MatSnackBarConfig = { duration: 3000}) {
    this.snackbar.open(message, action, config);
  }
}
