from tqdm import tqdm


STREAM_DATA = '/home/akshat/Documents/School/Semester_4/Thesis/UVAMonitor/sql/sample_data/data.csv'
OUTPUT_DIR = '/home/akshat/Documents/School/Semester_4/Thesis/UVAMonitor/sql/events/data/split/'


def main():

    data = open(STREAM_DATA).readlines()

    parsed = {}
    for line in tqdm(data):
        line = line.strip().split(',')
        stream, timestamp, value, event = line[0], float(line[1]), float(line[2]), float(line[3])

        if stream in parsed:
            parsed[stream]['x'].append(timestamp)
            parsed[stream]['y'].append(value)

        else:
            parsed[stream] = { 'x': [], 'y': [] }
            parsed[stream]['x'].append(timestamp)
            parsed[stream]['y'].append(value)


    streams = list(parsed.keys())
    for stream in tqdm(streams):
        filename = OUTPUT_DIR + stream.replace(' ', '_') + '.csv'

        with open(filename, 'w') as w:
            for i in range(len(parsed[stream]['x'])):
                w.write('%s,%s\n' % (parsed[stream]['x'][i], parsed[stream]['y'][i]))


if __name__ == '__main__':
    main()

