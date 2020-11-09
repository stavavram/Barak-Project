docker commands:

docker build -t node-test dockerTest/

### expose the service on port 8085. get access to path
docker run -p 8085:8080 -v <host path>:<container-path>  node-test

example:
docker run -p 8085:8080 -v /home/stavav/projects:/images  node-test



open url = localhost:8085/docs


####for unit tests run the command:
./node_modules/mocha/bin/mocha