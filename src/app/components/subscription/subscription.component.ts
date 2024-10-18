import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubscriptionService } from '../../services/subscription.service';
import { Subscription } from '../../models/subscription.model';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.css']
})
export class SubscriptionComponent implements OnInit {
  subscriptions: Subscription[] = [];
  selectedType: string = 'ALL';  // Default filter for type
  startDate: string = '';  // Default value for the start date filter
  endDate: string = '';    // Default value for the end date filter
  createSubscriptionForm: FormGroup;
  isModalOpen: boolean = false;
  isUpdateMode: boolean = false;  // Determines if we are updating an existing subscription
  subscriptionToUpdate: Subscription | null = null;  // Holds the subscription to update

  constructor(private subscriptionService: SubscriptionService, private fb: FormBuilder) {
    this.createSubscriptionForm = this.fb.group({
      numSub: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      price: [0, Validators.required],
      typeSub: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getSubscriptions();
  }

  // Fetch all subscriptions
  getSubscriptions(): void {
    this.subscriptionService.getSubscriptionsByType('ALL').subscribe((data: Subscription[]) => {
      this.subscriptions = data;
    });
  }

  // Submit the form to add or update a subscription
  submitSubscription(): void {
    if (this.createSubscriptionForm.valid) {
      const newSubscription: Subscription = this.createSubscriptionForm.value;

      if (this.isUpdateMode && this.subscriptionToUpdate) {
        newSubscription.numSub = this.subscriptionToUpdate.numSub;  // Retain the subscription number for the update
        this.subscriptionService.updateSubscription(newSubscription).subscribe(
          (response: Subscription) => {
            console.log('Subscription updated successfully:', response);
            this.getSubscriptions();  // Refresh the list after updating
            this.createSubscriptionForm.reset();
            this.closeModal();
            this.isUpdateMode = false;
          },
          (error) => {
            console.error('Error updating subscription:', error);
          }
        );
      } else {
        this.subscriptionService.addSubscription(newSubscription).subscribe(
          (response: Subscription) => {
            console.log('Subscription added successfully:', response);
            this.getSubscriptions();  // Refresh the list after adding
            this.createSubscriptionForm.reset();
            this.closeModal();
          },
          (error) => {
            console.error('Error adding subscription:', error);
          }
        );
      }
    }
  }

  // Method to fetch subscriptions by type
  getSubscriptionsByType(type: string): void {
    this.subscriptionService.getSubscriptionsByType(type).subscribe(
      (subscriptions: Subscription[]) => {
        this.subscriptions = subscriptions;
      },
      (error) => {
        console.error('Error fetching subscriptions by type:', error);
      }
    );
  }

  // Method to fetch subscriptions by date range
  getSubscriptionsByDates(startDate: string, endDate: string): void {
    this.subscriptionService.getSubscriptionsByDates(startDate, endDate).subscribe(
      (subscriptions: Subscription[]) => {
        this.subscriptions = subscriptions;
      },
      (error) => {
        console.error('Error fetching subscriptions by date range:', error);
      }
    );
  }

  // Handler for filtering by subscription type
  filterByType(): void {
    this.getSubscriptionsByType(this.selectedType);
  }

  // Handler for filtering by date range
  filterByDates(): void {
    if (this.startDate && this.endDate) {
      this.getSubscriptionsByDates(this.startDate, this.endDate);
    } else {
      console.warn('Please select both start and end dates.');
    }
  }

  // Open modal for creating or updating subscription
  openModal(subscription?: Subscription): void {
    if (subscription) {
      this.isUpdateMode = true;
      this.subscriptionToUpdate = subscription;
      this.createSubscriptionForm.patchValue(subscription);  // Pre-fill the form with existing subscription data
    } else {
      this.isUpdateMode = false;
      this.createSubscriptionForm.reset();
    }
    this.isModalOpen = true;
  }

  // Close modal
  closeModal(): void {
    this.isModalOpen = false;
    this.isUpdateMode = false;
    this.subscriptionToUpdate = null;
  }

  // Prepare to update subscription
  updateSubscription(subscription: Subscription): void {
    this.openModal(subscription);  // Open modal with pre-filled data for update
  }
}
