import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, effect, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { PersonService } from '../../shared/services/person.service';
import { listMonths } from '../../shared/utils/others';
import { AileRepository } from '../../shared/repository/aile.repository';

@Component({
  selector: 'app-stats',
  standalone: false,
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.scss',
})
export class StatsComponent implements OnInit {

  private readonly cd = inject(ChangeDetectorRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly personService = inject(PersonService);
  private readonly aileRepository = inject(AileRepository);



    dataChart: any;
    optionsChart: any;
    listAiles : any

    ngOnInit() {
        this.listAiles = this.aileRepository.get();
    }

    constructor() {
      effect(() => {
        if(this.personService.chartData_S().length > 0) {
          this.initChart();
        }
      });
    }

    initChart()
    {
      if (isPlatformBrowser(this.platformId)) 
      {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--p-text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
        const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');
        let datasetsGlobal = this.personService.chartData_S()

        let datasetsPerAilename = this.listAiles
        for(let aile of datasetsPerAilename){
            aile.datasets = [];
            aile.labels = listMonths;
            let dataset = datasetsGlobal.filter(d => d.aileName === aile.label);
            if(dataset) {
                aile.datasets = dataset
            }                
        }

        this.dataChart = datasetsPerAilename


        //partie pour calculer les valeurs min et max du graphique pour que l'échelle s'adapte automatiquement aux données, avec une marge de 10 kg de chaque côté
        let maxWeight = 0;
        let minWeight = 0;

        let allWeights = [...datasetsGlobal.map(d => d.data).flat()].filter(x => x !== null) as number[]; // filtrer les valeurs nulles ou indéfinies

        maxWeight = Math.ceil(Math.max(...allWeights)) + 10; // ajouter une marge de 10 kg
        minWeight = Math.floor(Math.min(...allWeights)) - 10; // ajouter une marge de 10 kg
    
        this.optionsChart = {
          maintainAspectRatio: false,
          aspectRatio: 0.6,
          plugins: {
              legend: {
                  labels: {
                      color: textColor
                  }
              }
          },
          scales: {
              x: {
                  ticks: {
                      color: textColorSecondary
                  },
                  grid: {
                      color: surfaceBorder,
                      drawBorder: false
                  }
              },
              y: {
                  ticks: {
                      color: textColorSecondary
                  },
                  grid: {
                      color: surfaceBorder,
                      drawBorder: false
                  },
                  min: minWeight,
                  max: maxWeight
              }
          }
        };
        this.cd.markForCheck();
      }
    }
}
