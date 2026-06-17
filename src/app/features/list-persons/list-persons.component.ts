import { Component, inject, OnInit } from '@angular/core';
import { PersonService } from '../../shared/services/person.service';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { DialogAddWeight } from './dialog/addWeight/dialogAddWeight';
import { DialogAddPerson } from './dialog/addResident/dialogAddPerson';
import { take } from 'rxjs';
import { AileRepository } from '../../shared/repository/aile.repository';
import { IPersonUI } from '../../shared/models/person';
import { IAile } from '../../shared/models/aile';
import { listMonthsWithNumber } from '../../shared/utils/others';
import { DialogEditPerson } from './dialog/editResident/dialogEditPerson';
import { PrimeExportModule } from '../../shared/primeModuleExport.module';
import { DateFrPipe } from '../../shared/helper/pipes/dateFr.pipe';
import { SharedExportModule } from '../../shared/sharedExport.module';


@Component({
  selector: 'app-list-persons',
  templateUrl: './list-persons.component.html',
  styleUrls: ['./list-persons.component.scss'],
  //changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SharedExportModule, PrimeExportModule, DateFrPipe]
})
export class ListPersonsComponent implements OnInit {

  private readonly personService = inject(PersonService);
  private readonly dialogService = inject(DialogService);
  private readonly aileRepository = inject(AileRepository);


  readonly personList = this.personService.listPerson_S;
  readonly loadingData = this.personService.loadingData;

  listAiles: IAile[] = null;


  constructor() {
    this.listAiles = this.aileRepository.get();
  }

  ngOnInit() {
    this.personService.initListPerson()
  }


  deleteAllAndRefill() {
    this.personService.deleteAllAndRefill()
  }


  addPerson() {
    let ref = this.dialogService.open(DialogAddPerson, {
      header: 'Ajouter un résident',
      width: '30%',
      breakpoints: { '1024px': '70vw', '768px': '90vw' },
      data: {
      }
    });

    ref.onClose.pipe(take(1)).subscribe((personToAdd) => {
      if (personToAdd) {
        setTimeout(() => {
          this.personService.addPerson(personToAdd);
        }, 200);
      }
    })
  }


  editPerson(personToEdit) {
    let ref = this.dialogService.open(DialogEditPerson, {
      header: 'Modifier un résident',
      width: '30%',
      breakpoints: { '1024px': '70vw', '768px': '90vw' },
      data: {
        personToEdit: personToEdit
      }
    });

    ref.onClose.pipe(take(1)).subscribe((personToEdit) => {
      if (personToEdit) {
        setTimeout(() => {
          this.personService.updateOnePerson(personToEdit);
        }, 200);
      }
    })
  }


  editMonthClicked(person, monthWeighted, year) {
    let ref = this.dialogService.open(DialogAddWeight, {
      header: 'Ajouter un poids',
      data: {
        person: person,
        monthWeighted: monthWeighted,
        year: year
      }
    });

    ref.onClose.pipe(take(1)).subscribe((newWeight) => {
      console.log(newWeight)
      let monthNumber = listMonthsWithNumber.find(month => month.name === monthWeighted)?.id;
      let dateForSave = `01-${monthNumber}-${year}`

      if (newWeight) {
        //converti le moi en toute lettre en chiffre

        let ifExistWeightForMonth = person.listWeight.find((weight) => (weight.date) === dateForSave);

        //c'est qu'on est sur le même mois et la même année que le poids ajouté, on peut donc modifier le poids du mois en cours
        if (ifExistWeightForMonth) {
          person.listWeight = person.listWeight.map((weightEntry) => {
            if (weightEntry.date === ifExistWeightForMonth.date) {
              return { date: weightEntry.date, weight: newWeight };
            }
            return weightEntry;
          })

          this.personService.updateOnePerson(person);
        }
        else { //sinon on ajoute un nouveau poids pour le mois en cours
          person.listWeight = [...person.listWeight, { date: dateForSave, weight: newWeight }];
          this.personService.updateOnePerson(person);
        }
      }
      else if (newWeight === 0) { //encoder à 0 surement donc on retire cette ligne de poids
        person.listWeight = person.listWeight.filter((weight) => weight.date !== dateForSave);
        this.personService.updateOnePerson(person);
      }
    })
  }



  //NgClass
  getClassSeverity(monthWeighted: any): string {
    if (monthWeighted.weight === "/") return "bg-gray-500 text-gray-100";

    else if (monthWeighted.evolveStatus?.includes("decrease")) return "bg-red-500 text-red-100";
    else if (monthWeighted.evolveStatus?.includes("increase")) return "bg-green-500 text-green-100";
    else return "bg-blue-500 text-blue-100";
  }

  getClassIcon(monthWeighted: any): string {
    if (monthWeighted.weight === "/") return "pi-minus";

    else if (monthWeighted.evolveStatus?.includes("decrease")) return "pi-arrow-down";
    else if (monthWeighted.evolveStatus?.includes("increase")) return "pi-arrow-up";
    else return "pi-minus";
  }


  getRowBgColor(person: IPersonUI): string {
    if (this.aileRepository.getOneByLabel(person.aileName)?.label) {
      switch (person.aileName) {
        case "Saphir": return '#0f53ba80';
        case "Azurite": return '#3c7cb180';
        case "Améthyste": return '#9b59b680';
        case "Topaze": return '#f1c40f80';
        case "Emeraude": return '#50c89580';
        case "Ambre": return '#ff980080';
      }
    }
    return '';
  }

}
