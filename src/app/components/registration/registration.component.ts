import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegistrationService } from '../../services/registration.service';
import { Registration } from '../../models/registration.model';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  registrations: Registration[] = [];
  createRegistrationForm: FormGroup;
  isModalOpen: boolean = false;
  selectedSkierId: number | undefined;
  selectedCourseId: number | undefined;

  constructor(private registrationService: RegistrationService, private fb: FormBuilder) {
    this.createRegistrationForm = this.fb.group({
      numWeek: [0, Validators.required],  // Number of weeks
      skierId: ['', Validators.required],  // Skier ID input
      courseId: ['', Validators.required]  // Course ID input
    });
  }

  ngOnInit(): void {
  
  }




  // Method to open the modal for registration creation
  openModal(): void {
    this.isModalOpen = true;
  }

  // Method to close the modal
  closeModal(): void {
    this.isModalOpen = false;
  }


}
