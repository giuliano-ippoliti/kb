* Mongo

[git bash dans /c/Program Files/MongoDB/Server/4.2/bin ]

./mongo.exe

show dbs

use nodekb

db.createCollection('articles');

show collections

db.articles.insert({title:"Article One",author:"Giuliano",body:"This is article one"});

db.articles.insert({title:"Article Two",author:"Giuliano",body:"This is article two"});

db.articles.insert({title:"Article Three",author:"Giuliano",body:"This is article three"});

db.articles.find();

db.articles.find().pretty();

db.users.remove({_id:ObjectId("5eac1d27bc2a0f12e8ca26bf")});

* Node

nodemon [ dans le dossier où il y l'appli ]

npm WARN deprecated bower@1.8.8: We don't recommend using Bower for new projects. Please consider Yarn and Webpack or Parcel.

You can read how to migrate legacy project here: https://bower.io/blog/2017/how-to-migrate-away-from-bower/
(de toute façon c'est juste un packet manager pour le frontend)

bower install bootstrap

bower install jquery

Ctrl U : code source

