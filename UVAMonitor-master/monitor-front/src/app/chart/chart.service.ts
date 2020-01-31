import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable'
import { Injectable } from '@angular/core';
import { GlobVars } from '../global';

@Injectable()
export class ChartService {


	constructor(private http: HttpClient) {}


    async translateQuery(query): Promise<{}> {

        var url = GlobVars.baseUrl + ':3000/api/translateQuery/' + query;

        return new Promise((resolve, reject) => {
            this.http.get(url).subscribe(rows => {
               resolve(rows); 
            });
        });

    }


    search(query, chartComponent): void {

        var url = GlobVars.baseUrl + ':3000/api/search/' + query;
        this.http.get(url).subscribe(rows => {

            var data_size = Object.keys(rows).length;
            var page_data = [];
            var all_data = [];
            var count = 1;

            for (var row_index in rows) {

                page_data.push({
                    'group_name': rows[row_index]['group_name'],
                    'group_val': rows[row_index]['group_val'],
                    'streams': rows[row_index]['streams'],
                    'start': 'start' in rows[row_index] ? rows[row_index]['start'] : null,
                    'end': 'end' in rows[row_index] ? rows[row_index]['end'] : null
                });

                if ((count % 10 === 0 && count > 0) || count > data_size-1) {
                    all_data.push(page_data);
                    page_data = [];
                    if (count >= 100) { break }
                }

                count += 1

            }

            chartComponent.all_groups = all_data;
            chartComponent.vis_groups = all_data[0];
            chartComponent.pages = Array.apply(null, {length: all_data.length}).map(Number.call, Number);
            chartComponent.no_results = all_data.length > 0 ? false : true;
            chartComponent.resetCharts();

        });
    }


    getChartData(name, id, chartComponent): void {

        var url = GlobVars.baseUrl + ':3000/api/name/' + name
		this.http.get(url).subscribe(rows => {

			var shapes = [];
			var x = []; 
			var y = [];

			for (var row_index in rows) {

				x.push(new Date(rows[row_index]['timestamp'] * 1000).toLocaleString());
				y.push(rows[row_index]['value']);

                // if (rows[row_index]['event'] === 1) {

				// 	var before = parseInt(row_index) - 10;
				// 	var after = parseInt(row_index) + 10;

                //     if (after in rows) { var end = after.toString(); }
				// 	else { var end = before.toString(); }

				// 	shapes.push({
				// 		type: 'rect',
				// 		xref: 'x',
				// 		yref: 'paper',
				// 		x0: new Date(rows[row_index]['timestamp'] * 1000).toLocaleString(),
				// 		y0: 0,
				// 		x1: new Date(rows[end]['timestamp'] * 1000).toLocaleString(),
				// 		y1: 1,
				// 		fillcolor: '#ffcdd2',
				// 		opacity: 0.2,
				// 		line: { width: 0 }
				// 	});

				// }

			}

            x = x.reverse();
            y = y.reverse();

			var layout = { 
				shapes: shapes,
				height: 300,
				xaxis: { nticks: 10 },
				plot_bgcolor: '#ffffff',
                paper_bgcolor: '#ffffff',
                margin: { l: -10, r: -10, b: -10, t: 1, pad: -10 }
			};

			Plotly.newPlot(id, [{ 'x': x, 'y': y }], layout);

		});
	}


    getChartDataEvent(name, id, start, end, chartComponent): void {

        var url = GlobVars.baseUrl + ':3000/api/selection'
        this.http.post(url, {
            'selectionData' : {
                'stream': name,
                'start': start,
                'end': end
            }
        }).subscribe(rows => {

            var shapes = [];
			var x = []; 
			var y = [];

			for (var row_index in rows) {

				x.push(new Date(rows[row_index]['timestamp'] * 1000).toLocaleString());
				y.push(rows[row_index]['value']);

                // if (rows[row_index]['event'] === 1) {

				// 	var before = parseInt(row_index) - 10;
				// 	var after = parseInt(row_index) + 10;

                //     if (after in rows) { var end = after.toString(); }
				// 	else { var end = before.toString(); }

				// 	shapes.push({
				// 		type: 'rect',
				// 		xref: 'x',
				// 		yref: 'paper',
				// 		x0: new Date(rows[row_index]['timestamp'] * 1000).toLocaleString(),
				// 		y0: 0,
				// 		x1: new Date(rows[end]['timestamp'] * 1000).toLocaleString(),
				// 		y1: 1,
				// 		fillcolor: '#ffcdd2',
				// 		opacity: 0.2,
				// 		line: { width: 0 }
				// 	});

				// }

			}

            x = x.reverse();
            y = y.reverse();

			var layout = { 
				shapes: shapes,
				height: 300,
				xaxis: { nticks: 10 },
				plot_bgcolor: '#ffffff',
				paper_bgcolor: '#ffffff',
                margin: { l: -10, r: -10, b: -10, t: 1, pad: -10 }
			};

			Plotly.newPlot(id, [{ 'x': x, 'y': y }], layout);

		});
	}

}
