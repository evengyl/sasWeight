import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AileRepository } from '../../../../shared/repository/aile.repository';
import { PersonFormFactory } from '../../../../shared/helper/formFactory/person.form';
import { IAile } from '../../../../shared/models/aile';
import { PersonService } from '../../../../shared/services/person.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SharedExportModule } from '../../../../shared/shared.module';
import { PrimeExportModule } from '../../../../shared/prime.module';


@Component({
    templateUrl: './dialogEditPerson.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ SharedExportModule, PrimeExportModule ]
})
export class DialogEditPerson implements OnInit {

    private readonly ref = inject(DynamicDialogRef);
    private readonly config = inject(DynamicDialogConfig);
    private readonly personService = inject(PersonService);
    private readonly confirmationService = inject(ConfirmationService);
    private readonly messageService = inject(MessageService);

    
    personToEditForm = PersonFormFactory.createPersonToAddForm()
    listAiles : IAile[] = null

    // pour éviter les flash de l'interface qui montre que le dialog est encore ouvert alors qu'on est en train de le fermer
    isClosing = false;


     stateOptions: { label: string; value: string }[] = [];
    value: string = 'one-way';

    personToEdit: any;

    constructor() {
        this.personToEdit = this.config.data.personToEdit;
        this.listAiles = new AileRepository().get();
        this.stateOptions = this.listAiles.map(aile => ({ label: aile.label, value: aile.label }));
    }

    ngOnInit() {
        this.personToEditForm.reset();  // au cas où l'instance serait réutilisée
        // pré-remplir le formulaire avec les données de la personne à éditer
        if(this.personToEdit) {
            this.personToEditForm.patchValue({
                name: this.personToEdit.name,
                surname: this.personToEdit.surname,
                chambreNumber : this.personToEdit.chambreNumber,
                aileName: this.personToEdit.aileName,
            });
        }
    }

    closeDialog(save: boolean) {
        this.isClosing = true;
        let isFormValid = this.personToEditForm.valid;
        //disable pour eviter les flash de l'interface qui montre que le dialog est encore ouvert alors qu'on est en train de le fermer
        this.personToEditForm.disable({ emitEvent: false });

        //merge des deux objets pour ne pas perdre les propriétés qui ne sont pas dans le formulaire (comme les poids)
        let personToEdit = { ...this.personToEdit, ...this.personToEditForm.value };

        if(save && isFormValid) {
            this.ref.close(personToEdit);
        } else {
            this.ref.close();
        }
    }

    deleteDialog(person: any) {
        // Implémentez la logique de suppression ici
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Voulez-vous supprimer ce résident ?',
            header: 'Zone de danger',
            icon: 'pi pi-info-circle',
            rejectLabel: 'Annuler',
            rejectButtonProps: {
                label: 'Annuler',
                severity: 'secondary',
                outlined: true
            },
            acceptButtonProps: {
                label: 'Supprimer',
                severity: 'danger'
            },
        
            accept: () => {
                this.personService.deletePerson(person.id);
                this.ref.close();
            },
            reject: () => {
                this.messageService.add({ severity: 'error', summary: 'Annulé', detail: 'Vous avez annulé' });
            }
        });
    }
}