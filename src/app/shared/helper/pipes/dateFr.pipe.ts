import { Pipe, PipeTransform } from "@angular/core";
import { listMonthsWithNumber } from "../../utils/others";

@Pipe({
    name: 'dateFr',
})
export class DateFrPipe implements PipeTransform {

    private readonly listMonthsWithNumber = listMonthsWithNumber;

    transform(value: string): string {
        if (!value) return '';

        let month = value.split('-')[1]; // extrait le mois du format "YYYY-MM"
        let monthName = this.listMonthsWithNumber.find(m => m.id === Number.parseInt(month))?.name;
        let year = value.split('-')[2]; // extrait l'année du format "YYYY-MM"

        return `${monthName} ${year}`;
    }
}