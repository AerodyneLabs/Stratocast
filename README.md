Stratocast
===============

## Overview

Online stratospheric (high altitude) balloon flight prediction system.

## Description

This software gives users a flight path of how a weather balloon would fly on a certain date from a certain location. The user enters some information related to their future weather balloon flight and it uses data provided from US Government on the conditions of the atmosphere to plot the simulated flight on a map. This helps our users to know their balloon will fly so they can make a plan to fly and recover everything. This also helps avoid landing in water, cities, etc. Students may use this Application as a learning tool to better understand the atmosphere.

This software includes four applications:

 1. Forward Prediction: Run a *detailed* prediction from the launch site to *find the landing site*.
 1. Reverse Prediction: Run a *detailed* prediction from the landing site to *find the launch site*.
 1. Quick Prediction: Run a *course* prediction from the the launch site to *find the landing site*.
 1. Balloon Calculator: Compare different ascent rates and burst rates.

This software runs within the NodeJS framework.

## Dependencies

### Node version

```
$ node --version
v10.16.3
```

### Node Packet Manager (NPM) version

```
$ npm --version
6.9.0
```

### Redis Server version

```
$ redis-server --version
Redis server v=3.2.12
```

### Mongo DB version

```
$ mongod --version
db version v3.2.22
```

## Installation


### Install Node and Node Package Manager (NPM)

This depends on what Linux you are running. For CentOS 7:

```
$ sudo yum install gcc-c++ make
$ sudo curl -sL https://rpm.nodesource.com/setup_10.x | sudo -E bash -
$ sudo yum install -y nodejs
```

### Install Redis

```
sudo yum install redis
```

### Install MongoDB

```
cd /etc/yum.repos.d/
sudo vi mongodb-org-3.2.repo
```

Enter the following data into the file `mongodb-org-3.2.repo`

```
[mongodb-org-3.2]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/redhat/$releasever/mongodb-org/3.2/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://www.mongodb.org/static/pgp/server-3.2.asc
```

Perform the installation

```
$ sudo yum install mongodb-org
```

### Install wgrib2
This is needed to that we are able to process the data that is downloaded from the National Weather Service.

```
sudo yum install wgrib2
```


## Start up

### Start Mongodb server

```
systemctl start mongod
```

To get the status of the running mongodb server:

```
systemctl status mongod
```

### Start Redis

```
redis-server
```

### Start Node

```
cd <to the directory that contains the file package.json>
npm install
```

Need to create a data directory to put all the files into

```
mkdir data
```

Start node

```
npm start
```

### Start Node as a developer

We want to start node so that each time we change the source code it will automatically restart itself.
Install node monitor

```
$ sudo npm install -g nodemon
```

Start the node monitor

```
$ nodemon
```


## Use Application

### Browser

On your favourite browser go to: `http://localhost:8000`
