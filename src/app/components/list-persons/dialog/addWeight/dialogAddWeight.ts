import { Component, inject, OnInit } from '@angular/core';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
    standalone: false,
    templateUrl: './dialogAddWeight.html',
})
export class DialogAddWeight {
    private readonly config = inject(DynamicDialogConfig);

    private readonly ref = inject(DynamicDialogRef);


    person : any = this.config.data.person;
    monthWeighted : any = this.config.data.monthWeighted;
    year : any = this.config.data.year;
    newWeight : number = 0;

    closeDialog(data) {
        this.ref.close(data);
    }
}