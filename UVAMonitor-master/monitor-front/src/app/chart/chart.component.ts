import { MatTabChangeEvent, MatDialogConfig, MatDialog } from '@angular/material';
import { ChartDialogComponent } from '../chart-dialog/chart-dialog.component';
import { EventDialogComponent } from '../event-dialog/event-dialog.component';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChartService } from './chart.service';

@Component({
	selector: 'app-chart',
	templateUrl: './chart.component.html',
	styleUrls: ['./chart.component.css'],
})
export class ChartComponent implements OnInit {


    all_groups;
    vis_groups;
    no_results;
    waiting;
    pages;


	constructor(private http: HttpClient, private chartService: ChartService, private dialog: MatDialog) { }


	ngOnInit() { 

        this.no_results = false;
        this.all_groups = null;
        this.vis_groups = null;
        this.waiting = false;
        this.pages = null;

	}


	search(query) {

        this.all_groups = null;
        this.vis_groups = null;
        this.waiting = true;
        this.pages = null;
        
        let translated = this.chartService.translateQuery(query).then(translated => {
            var query = translated['newQuery'];
            this.chartService.search(query, this);
        });

	}


	getChart(event: MatTabChangeEvent) {

		var stream = event.tab.textLabel;
		this.chartService.getChartData(stream, stream, this);

	}


    resetCharts(): void {

        for (var row_index in this.vis_groups) {

            var name = this.vis_groups[row_index]['streams'][0];
            if (this.vis_groups[row_index]['start'] === null) {
                this.chartService.getChartData(name, name, this);
            } else {
                var start = this.vis_groups[row_index]['start'][0];
                var end = this.vis_groups[row_index]['end'][0];
                this.chartService.getChartDataEvent(name, name, start, end, this);
            }

        }

        this.waiting = false;

    }


	getPage(page) {

		this.vis_groups = this.all_groups[page];
		this.resetCharts();

	}


    openDialog(group) {

        const dialogConfig = new MatDialogConfig();

        dialogConfig.height = "800px";
        dialogConfig.width = "1500px";
        dialogConfig.data = { 
            'name': group.group_name,
            'value': group.group_val,
            'streams': group.streams,
            'start': group.start,
            'end': group.end
        };

        this.dialog.open(ChartDialogComponent, dialogConfig);

    }


    openEventDialog(stream) {

        var plotDiv: any = document.getElementById(stream);

        var ix1 = parseInt(plotDiv.layout['xaxis']['range'][0]);
        var ix2 = parseInt(plotDiv.layout['xaxis']['range'][1]);
        var xvals = plotDiv.data[0]['x'];

        ix1 = ix1 >= 0 ? ix1 : 0;
        ix2 = ix2 >= 0 ? ix2 : 0;
        ix1 = ix1 <= xvals.length-1 ? ix1 : xvals.length-1;
        ix2 = ix2 <= xvals.length-1 ? ix2 : xvals.length-1;
        
        var start = xvals[ix1];
        var end = xvals[ix2];

        const dialogConfig = new MatDialogConfig();

        dialogConfig.height = "600px";
        dialogConfig.width = "400px";
        dialogConfig.data = {
            'name': stream,
            'start': start,
            'end': end
        }

        this.dialog.open(EventDialogComponent, dialogConfig);

    }


}
