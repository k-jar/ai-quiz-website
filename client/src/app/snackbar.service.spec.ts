import { TestBed } from '@angular/core/testing';

import { SnackbarService } from './snackbar.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('SnackbarService', () => {
  let service: SnackbarService;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('MatSnackBar', ['open']);

    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule],
      providers: [
        SnackbarService,
        { provide: MatSnackBar, useValue: spy },
      ],
    });

    service = TestBed.inject(SnackbarService);
    snackBarSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should open a snackbar with the correct message, action, and config', () => {
    const message = 'Test Message';
    const action = 'Test Action';
    const config: MatSnackBarConfig = { duration: 5000 };

    service.show(message, action, config);

    expect(snackBarSpy.open).toHaveBeenCalledWith(message, action, config);
  });
});
