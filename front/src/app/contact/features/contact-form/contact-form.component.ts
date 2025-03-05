import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { Message, MessageService } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';


@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    CardModule,
    FloatLabelModule,
		ToastModule,
		MessagesModule,
    InputTextareaModule
  ],
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.css'
})
export class ContactFormComponent {

  
  contactFormGroup: FormGroup;
  characterCount = 0;
  constructor(private formBuilder: FormBuilder, private service: MessageService) {
    this.contactFormGroup = this.formBuilder.group({
      email: new FormControl<string>("", [
        Validators.required,
        Validators.email
      ]),
      message: new FormControl<string>("", {
        validators : [
          Validators.required,
          Validators.maxLength(300)
        ],
      })
    });
  }
  updateCharacterCount() {
    const messageControl = this.contactFormGroup.get('message');
    if (messageControl) {
        this.characterCount = messageControl.value.length;
    }
}
  cancel() {
    throw new Error('Method not implemented.');
  }
  submit() {
    this.service.add({ key: 'feedbackMessage', severity: 'success', summary: 'Envoyé!', detail: 'Demande de contact envoyée avec succès' });
    this.contactFormGroup.reset();
  }
}
