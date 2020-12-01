init user credentials:
username: 'barakd' 
password: 'barakpass1985'
(encrypt - '1d3aa575a23050455c9cf5d96adbda01')

mongo shell commands:
mongo, 
use <db-name>
db.users.find()
db.projects.find()
db.users.insertOne( { username: "", password: "", role: "admin" } );