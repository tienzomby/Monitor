import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobVars } from '../global';

@Injectable({ providedIn: 'root' })
export class ChartDialogService {


    constructor(private http: HttpClient) { }

    getChartAttributes(name): Promise<{}> {

        var url = GlobVars.baseUrl + ':3000/api/attributes_by_stream/' + name

        return new Promise((resolve, reject) => {
            this.http.get(url).subscribe(rows => {
                for (var row_index in rows) {
                    resolve(rows);
                }
            });
        });

    }

    getChartData(name, id): void {

        var url = GlobVars.baseUrl + ':3000/api/name/' + name
        this.http.get(url).subscribe(rows => {

            var shapes = [];
            var x = []; 
            var y = [];

            for (var row_index in rows) {

                x.push(new Date(rows[row_index]['timestamp'] * 1000).toLocaleString());
                y.push(rows[row_index]['value']);

                // if (rows[row_index]['event'] === 1) {

                //     var before = parseInt(row_index) - 10;
                //     var after = parseInt(row_index) + 10;

                //     if (after in rows) { var end = after.toString(); }
                //     else { var end = before.toString(); }

                //     shapes.push({
                //         type: 'rect',
                //         xref: 'x',
                //         yref: 'paper',
                //         x0: new Date(rows[row_index]['timestamp'] * 1000).toLocaleString(),
                //         y0: 0,
                //         x1: new Date(rows[end]['timestamp'] * 1000).toLocaleString(),
                //         y1: 1,
                //         fillcolor: '#ffcdd2',
                //         opacity: 0.2,
                //         line: { width: 0 }
                //     });

                // }

            }

            x = x.reverse();
            y = y.reverse();

            var layout = { 
                shapes: shapes,
                height: 400,
                xaxis: { nticks: 25 },
                plot_bgcolor: '#ffffff',
                paper_bgcolor: '#ffffff',
                margin: { l: -10, r: -10, b: -10, t: 1, pad: -10, }
            };

            Plotly.newPlot(id, [{ 'x': x, 'y': y }], layout);

        });
    }


    getChartDataEvent(name, id, start, end): void {

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
				height: 400,
				xaxis: { nticks: 10 },
				plot_bgcolor: '#ffffff',
				paper_bgcolor: '#ffffff',
                margin: { l: -10, r: -10, b: -10, t: 1, pad: -10, }
			};

			Plotly.newPlot(id, [{ 'x': x, 'y': y }], layout);

		});
	}

}
