import { inject, Injectable, signal, WritableSignal } from "@angular/core";
import { getDocs } from "@angular/fire/firestore";
import { IPersonFirestore, IPersonUI } from "../models/person";
import { PersonMapper } from "../mapper/person.mapper";
import { dbFirebase } from "../core/dbFirebase";
import { PersonsToLoad } from "../core/mocksDataTest/person.mock";
import { MessageService } from "primeng/api";


@Injectable({
    providedIn: 'root'
})
export class PersonRepository extends dbFirebase{

    listPerson_S : WritableSignal<IPersonFirestore[]> = signal<IPersonFirestore[]>([]);
    private readonly messageService = inject(MessageService);

    constructor() {
        super('persons');
    }


    async deleteAllAndRefill(): Promise<void> {
       await this.deleteAllPersons(); // vide la collection
       this.listPerson_S.set(PersonsToLoad); // charge les données de test
       this.listPerson_S().forEach((person) => {
          person.id = this.generateId_id(); // génère un id pour chaque personne
       })
       await this.saveListPerson(); // sauvegarde la collection vide pour supprimer les documents existants
    }


    async deleteAllPersons(): Promise<void> {
        const snapshot = await getDocs(this.collection);
        const batch = this.createBatch();
        snapshot.docs.forEach(d => batch.delete(this.getById(d.id)));
        await this.commitBatch(batch);
    }


    async deletePersonFromFirestore(id: string): Promise<void> {
        await this.deleteById(id);
    }


    async updateOnePerson(person: IPersonUI): Promise<void> {
        //save de une seul personne dans firestore et pas de tous le monde pour éviter les problèmes de concurrence si plusieurs personnes sont modifiées en même temps
        const batch = this.createBatch();
        const ref = person.id ? this.getById(person.id) : this.generateId_docref();
        batch.set(ref, PersonMapper.mapper_personUI_personFirestore(person));
        await this.commitBatch(batch);

    }

    async addOnePerson(person: IPersonUI): Promise<void> {
        const id = this.generateId_id(); // génère un id Firestore
        const personWithId = { ...person, id: id };
        const batch = this.createBatch();
        const ref = this.getById(id);
        batch.set(ref, PersonMapper.mapper_personUI_personFirestore(personWithId));
        await this.commitBatch(batch);
    }



    private async saveListPerson() {
        //copie car writeBatch ne supporte pas les objets avec des propriétés en lecture seule comme les signaux et les maps
        let listPersonCopy = [...this.listPerson_S().map(p => PersonMapper.mapper_personUI_personFirestore(p))];
        const batch = this.createBatch();
        listPersonCopy.forEach(person => {
            const ref = person.id ? this.getById(person.id) : this.generateId_docref(); // génère un id si absent
            batch.set(ref, person);
        });

        //pas besoin de mettre à jour le signal ici car on écoute les changements en temps réel avec onSnapshot,
        // donc dès que la base de données est mise à jour, le signal se met à jour automatiquement grâce à l'abonnement dans initListPerson()
        await this.commitBatch(batch);
    }



    listenerPerson(){
        return this.getListener()
    }


    private async commitBatch(batch: any)
    {
        try {
            await batch.commit();
        }
        catch (e) {
            // something failed with batch.commit().
            // the batch was rolled back.
            console.error(e);  
            this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Erreur lors du commit des données, voir l\'administrateur' });
        }
    }
}