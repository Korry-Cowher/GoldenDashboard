import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
    selector: 'app-event-dialog',
    template: `
      <h2 mat-dialog-title>Add Event</h2>
      <mat-dialog-content>
        <mat-form-field>
          <input matInput [(ngModel)]="event.title" placeholder="Event title">
        </mat-form-field>
        <br>
        <mat-form-field>
          <input matInput [matDatepicker]="startPicker" [(ngModel)]="event.startTime" placeholder="Start time">
          <mat-datepicker-toggle matSuffix [for]="startPicker"></mat-datepicker-toggle>
          <mat-datepicker #startPicker></mat-datepicker>
        </mat-form-field>
        <br>
        <mat-form-field>
          <input matInput [matDatepicker]="endPicker" [(ngModel)]="event.endTime" placeholder="End time">
          <mat-datepicker-toggle matSuffix [for]="endPicker"></mat-datepicker-toggle>
          <mat-datepicker #endPicker></mat-datepicker>
        </mat-form-field>
      </mat-dialog-content>
      <mat-dialog-actions>
        <button mat-button mat-dialog-close>Cancel</button>
        <button mat-button [mat-dialog-close]="event">Add</button>
      </mat-dialog-actions>
    `,
    styles: [`
      mat-form-field {
        width: 100%;
      }
    `]
  })
  export class EventDialogComponent implements OnInit {
    event: any = {};
    
    constructor(
      @Inject(MAT_DIALOG_DATA) public data: any
    ) { }
    
    ngOnInit() {
      this.event.startTime = this.data.startTime;
      this.event.endTime = this.data.endTime;
    }
  }
  