import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';



@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  templateUrl: './contact-page.component.html',
  styleUrl: './contact-page.component.css'
})
export class ContactPageComponent {
  contactForm: FormGroup;
  errorMessage: string | null = null;
  loading: boolean = false;
  success: boolean = false;


  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onSubmit() {
    if (this.contactForm.valid) {
      this.loading = true;
      grecaptcha.ready(() => {
        grecaptcha.execute('6LevbScqAAAAAAxWX_syCEhEXzudSqMPtqfcmHb0', { action: 'submit' }).then((token: string) => {
          const recaptchaToken = token;
          if (!recaptchaToken) {
            console.log('Por favor, completa el reCAPTCHA');
            return;
          }

          const formData = {
            ...this.contactForm.value,
            recaptchaToken
          };

          this.http.post('http://localhost:3000/api/send-email', formData).subscribe(
            (response: any) => {
              console.log(response.message);
              this.errorMessage = null; // Limpiar el mensaje de error en caso de éxito
              this.contactForm.reset();
              this.loading = false;
              this.success = true;
            },
            (error: any) => {
              if (error.status === 429) {
                this.errorMessage = 'Por favor, espera 5 minutos antes de enviar otro correo.';
              } else {
                this.errorMessage = 'Error al enviar el email';
              }
              console.error('Error al enviar el email', error);
              this.loading = false;
              this.success = false;
            }
          );
        });
      });
    } else {
      console.log('Formulario no válido');
    }
  }

  get name() {
    return this.contactForm.get('name');
  }

  get email() {
    return this.contactForm.get('email');
  }

  get message() {
    return this.contactForm.get('message');
  }
}
