import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SkierService } from '../../services/skier.service';
import { Skier } from '../../models/skier.model';

@Component({
  selector: 'app-skier',
  templateUrl: './skier.component.html',
  styleUrls: ['./skier.component.css']
})
export class SkierComponent implements OnInit {
  skiers: Skier[] = [];
  createSkierForm: FormGroup;
  isModalOpen: boolean = false;

  constructor(private skierService: SkierService, private fb: FormBuilder) {
    this.createSkierForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      city: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getSkiers();
  }

  // Fetch the list of skiers
  getSkiers(): void {
    this.skierService.getAllSkiers().subscribe((data: Skier[]) => {
      this.skiers = data;
    });
  }

  // Submit new skier
  submitSkier(): void {
    if (this.createSkierForm.valid) {
      const newSkier: Skier = this.createSkierForm.value;
      this.skierService.addSkier(newSkier).subscribe(
        (response: Skier) => {
          console.log('Skier created successfully:', response);
          this.getSkiers(); // Refresh the skier list after adding
          this.createSkierForm.reset(); // Reset the form
          this.closeModal(); // Close the modal
        },
        (error) => {
          console.error('Error creating skier:', error);
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

  // Delete skier by ID
  deleteSkier(id: number): void {
    this.skierService.deleteSkier(id).subscribe(
      () => {
        console.log(`Skier with ID ${id} deleted successfully`);
        this.getSkiers(); // Refresh the skier list after deletion
      },
      (error) => {
        console.error('Error deleting skier:', error);
      }
    );
  }
}
