import { Component, inject } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PrimeExportModule } from '../../../../shared/prime.module';
import { SharedExportModule } from '../../../../shared/shared.module';

@Component({
    templateUrl: './dialogAddWeight.html',
    imports : [SharedExportModule, PrimeExportModule],
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