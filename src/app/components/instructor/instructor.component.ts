import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InstructorService } from '../../services/instructor.service';
import { Instructor } from '../../models/instructor.model';

@Component({
  selector: 'app-instructor',
  templateUrl: './instructor.component.html',
  styleUrls: ['./instructor.component.css']
})
export class InstructorComponent implements OnInit {
  instructors: Instructor[] = [];
  createInstructorForm: FormGroup;
  isModalOpen: boolean = false;

  constructor(private instructorService: InstructorService, private fb: FormBuilder) {
    this.createInstructorForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dateOfHire: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getInstructors();
  }

  getInstructors(): void {
    this.instructorService.getAllInstructors().subscribe((data: Instructor[]) => {
      this.instructors = data;
    });
  }

  // Method to submit new instructor
  submitInstructor(): void {
    if (this.createInstructorForm.valid) {
      const newInstructor: Instructor = this.createInstructorForm.value;
      this.instructorService.addInstructor(newInstructor).subscribe(
        (response: Instructor) => {
          console.log('Instructor created successfully:', response);
          this.getInstructors(); // Refresh the instructor list after adding
          this.createInstructorForm.reset(); // Reset the form
          this.closeModal(); // Close the modal
        },
        (error) => {
          console.error('Error creating instructor:', error);
        }
      );
    }
  }

  // Method to open the modal
  openModal(): void {
    this.isModalOpen = true;
  }

  // Method to close the modal
  closeModal(): void {
    this.isModalOpen = false;
  }

  // Method to delete instructor
 
}
