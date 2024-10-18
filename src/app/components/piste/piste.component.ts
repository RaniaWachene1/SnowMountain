import { Component, OnInit } from '@angular/core';
import { PisteService } from '../../services/piste.service';
import { Piste } from '../../models/piste.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Color } from '../../models/color.enum';

@Component({
  selector: 'app-piste',
  templateUrl: './piste.component.html',
  styleUrls: ['./piste.component.css']
})
export class PisteComponent implements OnInit {
  pistes: Piste[] = [];
  createPisteForm: FormGroup;
  colorOptions: string[] = [];
  isModalOpen: boolean = false;

  constructor(private pisteService: PisteService, private fb: FormBuilder) {
    this.createPisteForm = this.fb.group({
      namePiste: ['', Validators.required],
      color: ['', Validators.required],
      length: [0, [Validators.required, Validators.min(0)]],
      slope: [0, [Validators.required, Validators.min(0)]]
    });

    this.colorOptions = Object.values(Color);
  }

  ngOnInit(): void {
    this.getPistes();
  }

  getPistes(): void {
    this.pisteService.getAllPistes().subscribe((data: Piste[]) => {
      this.pistes = data;
    });
  }

  submitPiste(): void {
    if (this.createPisteForm.valid) {
      const newPiste: Piste = {
        ...this.createPisteForm.value,
        length: parseFloat(this.createPisteForm.value.length),
        slope: parseFloat(this.createPisteForm.value.slope)
      };

      this.pisteService.addPiste(newPiste).subscribe(
        (response: Piste) => {
          console.log('Piste created successfully:', response);
          this.getPistes();  // Refresh piste list after adding
          this.createPisteForm.reset();  // Reset the form
          this.closeModal();  // Close the modal
        },
        (error) => {
          console.error('Error creating piste:', error);
        }
      );
    }
  }

  // Method to delete a piste by its ID
  deletePiste(id: number): void {
    this.pisteService.deletePiste(id).subscribe(
      () => {
        console.log(`Piste with ID ${id} deleted successfully`);
        this.getPistes();  // Refresh the list after deletion
      },
      (error) => {
        console.error('Error deleting piste:', error);
      }
    );
  }

  openModal(): void {
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }
}
