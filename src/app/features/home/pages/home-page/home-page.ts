import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button } from 'primeng/button';
import { AuthService } from '@core/auth/auth-service';

@Component({
  selector: 'app-home-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Button],
  templateUrl: './home-page.html',
})
export class HomePage {
  protected readonly auth = inject(AuthService);
}
