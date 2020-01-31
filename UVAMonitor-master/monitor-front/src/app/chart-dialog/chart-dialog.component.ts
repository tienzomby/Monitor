import { MAT_DIALOG_DATA, MatTabChangeEvent, MatDialogConfig, MatDialog } from '@angular/material';
import { AttributeDialogComponent } from '../attribute-dialog/attribute-dialog.component';
import { EventDialogComponent } from '../event-dialog/event-dialog.component';
import { ChartDialogService } from './chart-dialog.service';
import { Component, Inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-chart-dialog',
  templateUrl: './chart-dialog.component.html',
  styleUrls: ['./chart-dialog.component.css']
})
export class ChartDialogComponent implements OnInit {


    name;
    value;
    streams;
    stream;
    starts;
    ends;
    atts;


    constructor(@Inject(MAT_DIALOG_DATA) public data: any, private chartDialogService: ChartDialogService, private dialog: MatDialog) { }


    ngOnInit() {

        this.name = this.data.name;
        this.value = this.data.value;
        this.streams = this.data.streams;
        this.stream = this.streams[0]
        this.starts = this.data.start;
        this.ends = this.data.end;
        this.atts = [];
        var stream_label = this.stream + '_dialog';

        let attributes = this.chartDialogService.getChartAttributes(this.stream).then(attributes => {
            for (var att_index in attributes) {
                this.atts.push({
                    'stream': this.stream,
                    'attribute': attributes[att_index]['attribute'],
                    'value': attributes[att_index]['value']
                });
            }
        });

        if (this.starts === null) {
            this.chartDialogService.getChartData(this.stream, stream_label);
        } else {
            var start = this.starts[0];
            var end = this.ends[0];
            this.chartDialogService.getChartDataEvent(this.stream, stream_label, start, end);
        }

    }


	get_chart(event: MatTabChangeEvent) {

		this.stream = event.tab.textLabel;
        var stream_label = this.stream + '_dialog';

        this.atts = [];
        let attributes = this.chartDialogService.getChartAttributes(this.stream).then(attributes => {
            for (var att_index in attributes) {
                this.atts.push({
                    'stream': this.stream,
                    'attribute': attributes[att_index]['attribute'],
                    'value': attributes[att_index]['value']
                });
            }
        });

        this.chartDialogService.getChartData(this.stream, stream_label);

	}


    newAttributeDialog() {

        const dialogConfig = new MatDialogConfig();

        dialogConfig.height = "600px";
        dialogConfig.width = "400px";
        dialogConfig.data = {
            'stream': this.stream,
            'attribute': null,
            'value': null 
        };

        this.dialog.open(AttributeDialogComponent, dialogConfig)
        .afterClosed().subscribe(result => {
            this.atts = [];
            let attributes = this.chartDialogService.getChartAttributes(this.stream).then(attributes => {
                for (var att_index in attributes) {
                    this.atts.push({
                        'stream': this.stream,
                        'attribute': attributes[att_index]['attribute'],
                        'value': attributes[att_index]['value']
                    });
                }
            });
        });

    }


    openAttributeDialog(att) {

        const dialogConfig = new MatDialogConfig();

        dialogConfig.height = "600px";
        dialogConfig.width = "400px";
        dialogConfig.data = {
            'stream': att.stream,
            'attribute': att.attribute,
            'value': att.value
        };

        this.dialog.open(AttributeDialogComponent, dialogConfig)
        .afterClosed().subscribe(result => {
            this.atts = [];
            let attributes = this.chartDialogService.getChartAttributes(this.stream).then(attributes => {
                for (var att_index in attributes) {
                    this.atts.push({
                        'stream': this.stream,
                        'attribute': attributes[att_index]['attribute'],
                        'value': attributes[att_index]['value']
                    });
                }
            });
        });

    }


    openEventDialog(stream) {

        var plotDiv: any = document.getElementById(stream);
        var title = stream.substring(0, stream.length-7);

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
            'name': title,
            'start': start,
            'end': end
        }

        this.dialog.open(EventDialogComponent, dialogConfig);

    }


}
