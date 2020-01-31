# Create docker network
docker network create --driver=bridge monitor_network

###################
# MYSQL CONTAINER #
###################

echo "Removing Active Container";
docker rm -f monitor_db;

echo "Creating Image";
docker build -t monitor_db sql;

echo "Creating Container";
docker run --name=monitor_db --net=monitor_network -e MYSQL_ROOT_PASSWORD=monitor_db -v monitor_db_volume:/var/lib/mysql -d monitor_db;
sleep 30

echo "Populating Database";
docker exec monitor_db mysql -h localhost -u root -pmonitor_db -e 'source /home/monitor_db/create_tables.sql;';

echo "Creating Feature Vectors";
docker exec monitor_db python3 /home/monitor_db/events/src/split_streams.py;
docker exec monitor_db python3 /home/monitor_db/events/src/feature_extractor.py;
docker exec monitor_db mysql -h localhost -u root -pmonitor_db -e 'source /home/monitor_db/events/data/vector/event_table.sql;';
docker exec monitor_db mysql -h localhost -u root -pmonitor_db -e 'source /home/monitor_db/events/data/vector/hcdm_vector_table.sql;';

echo "Creating Split Feature Vectors";
docker exec monitor_db chmod a+x /home/monitor_db/events/data/vector/reduce.sh
docker exec monitor_db /bin/sh /home/monitor_db/events/data/vector/reduce.sh
docker exec monitor_db python3 /home/monitor_db/events/src/split_feature_extractor.py;
docker cp monitor_db:/home/monitor_db/events/src/data.py ./monitor-api/routes/event_vectors/;
docker cp monitor_db:/home/monitor_db/events/src/normalizer.save ./monitor-api/routes/event_vectors/;
docker exec monitor_db mysql -h localhost -u root -pmonitor_db -e 'source /home/monitor_db/events/data/vector/split_hcdm_vector_table.sql;';

#########################
# MONITOR API CONTAINER #
#########################
 
echo "Removing Active Container";
docker rm -f monitor_api;

echo "Creating Image";
docker build -t monitor_api monitor-api;
  
echo "Creating Container";
docker run -e TZ=America/New_York --name=monitor_api --net=monitor_network -p 3000:3000 -d monitor_api

echo "Installing Python";
docker exec monitor_api apt update;
docker exec monitor_api apt install -y python3 python3-pip;
docker exec monitor_api pip3 install -U pip;
docker exec monitor_api pip install mysql-connector sklearn scipy tqdm numpy;

###########################
# MONITOR FRONT CONTAINER #
###########################

echo "Removing Active Container"
docker rm -f monitor_front;

echo "Creating Image";
docker build -t monitor_front monitor-front;

echo "Creating Container";
docker run --name=monitor_front --net=monitor_network -p 4200:4200 -d monitor_front
