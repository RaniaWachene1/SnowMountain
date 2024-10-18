import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../services/course.service';
import { Course } from '../../models/course.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TypeCourse } from '../../models/type-course.enum';
import { Support } from '../../models/support.enum'; // Import the Support enum

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {
  courses: Course[] = [];
  createCourseForm: FormGroup;
  typeCourses: string[] = [];
  supportTypes: string[] = [];
  isModalOpen: boolean = false;

  constructor(private courseService: CourseService, private fb: FormBuilder) {
    // Initialize form with validation and required fields
    this.createCourseForm = this.fb.group({
      courseName: ['', Validators.required],  // Required field
      courseLevel: [0, [Validators.required, Validators.min(0)]],  // Required and minimum value validator
      typeCourse: ['', Validators.required],  // Required field
      supportType: ['', Validators.required],  // Required field (if this is an enum)
      coursePrice: [0, [Validators.required, Validators.min(0)]],  // Required and minimum value validator
      courseTimeSlot: ['', Validators.required]  // Required field
    });
    

    // Initialize the typeCourses and supportTypes with enum values
    this.typeCourses = Object.values(TypeCourse);
    this.supportTypes = Object.values(Support); // Add support enum values

  }

  ngOnInit(): void {
    this.getCourses();
  }

  getCourses(): void {
    this.courseService.getAllCourses().subscribe((data: Course[]) => {
      this.courses = data;
    });
  }

  submitCourse(): void {
    if (this.createCourseForm.valid) {
      const newCourse: Course = {
        ...this.createCourseForm.value,
        price: parseFloat(this.createCourseForm.value.coursePrice),
        level: parseInt(this.createCourseForm.value.courseLevel),
        timeSlot: parseInt(this.createCourseForm.value.courseTimeSlot),
        support: this.createCourseForm.value.supportType  // Map supportType to support
      };
      
      console.log("Form values to submit:", newCourse);  // Log the casted form values
      
      this.courseService.addCourse(newCourse).subscribe(
        (response: Course) => {
          console.log('Course created successfully:', response);
          this.getCourses();  // Refresh the course list after adding
          this.createCourseForm.reset();  // Reset the form
          this.closeModal();  // Close the modal
        },
        (error) => {
          console.error('Error creating course:', error);
        }
      );
    } else {
      console.log("Form is invalid:", this.createCourseForm.errors);  // Log form errors
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
}
