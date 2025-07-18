import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment.development';
import { SeoService } from '../../services/seo.service';

declare global {
  interface Window {
    grecaptcha: any;
  }
}

declare var grecaptcha: any;



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
export class ContactPageComponent implements OnInit {
  contactForm: FormGroup;
  errorMessage: string | null = null;
  loading: boolean = false;
  success: boolean = false;


  constructor(private fb: FormBuilder, private http: HttpClient, private seoService: SeoService) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    this.seoService.updatePageSeo({
      title: 'Contacto - Pilar Blanco | Ponte en Contacto con la Actriz',
      description: 'Contacta con Pilar Blanco para propuestas profesionales, casting o consultas. Formulario de contacto directo para proyectos de cine, televisión y teatro.',
      keywords: 'Pilar Blanco contacto, contactar actriz, casting, propuestas profesionales, formulario contacto, email actriz',
      ogImage: 'https://pilarblanco.com/assets/images/pilar-blanco-contact.jpg',
      canonicalUrl: 'https://pilarblanco.com/contact'
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

          const apiUrl = environment.production ? 'https://pilarblanco.es/api/send-email' : 'http://localhost:3000/api/send-email';

          this.http.post(apiUrl, formData).subscribe(
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
