import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { AileRepository } from '../../../../shared/repository/aile.repository';
import { PersonFormFactory } from '../../../../shared/helper/formFactory/person.form';
import { IAile } from '../../../../shared/models/aile';
import { PrimeExportModule } from '../../../../shared/prime.module';
import { SharedExportModule } from '../../../../shared/shared.module';


@Component({
    templateUrl: './dialogAddPerson.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ SharedExportModule, PrimeExportModule ]
})
export class DialogAddPerson implements OnInit {

    private readonly ref = inject(DynamicDialogRef);

    personToAddForm = PersonFormFactory.createPersonToAddForm()
    listAiles : IAile[] = null

    // pour éviter les flash de l'interface qui montre que le dialog est encore ouvert alors qu'on est en train de le fermer
    isClosing = false;


     stateOptions: { label: string; value: string }[] = [];
    value: string = 'one-way';

    constructor() {
        this.listAiles = new AileRepository().get();
        this.stateOptions = this.listAiles.map(aile => ({ label: aile.label, value: aile.label }));
    }

    ngOnInit() {
        this.personToAddForm.reset();  // au cas où l'instance serait réutilisée
    }

    closeDialog(save: boolean) {
        this.isClosing = true;
        let isFormValid = this.personToAddForm.valid;
        //disable pour eviter les flash de l'interface qui montre que le dialog est encore ouvert alors qu'on est en train de le fermer
        this.personToAddForm.disable({ emitEvent: false });
        if(save && isFormValid) {
            this.ref.close(this.personToAddForm.value);
        } else {
            this.ref.close();
        }
    }
}