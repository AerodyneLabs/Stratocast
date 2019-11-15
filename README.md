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

## Release Notes

### Version 2.0.0

- 17th Nov 2019.
- Burst altitude on prediction was incorrect due to incorrect API use, formulas and parsing of wgrib2 format.
- Added restful grib2 data, API and model documentation.
- Invalid parachute values no longer cause an error.
- Zero net lift no longer causes infinite loop.

### Version 1.0.0

- 10th Nov 2019.
- Initial release that was successfully used as a Minimum Viable Product (MVP) running on Heroku.
- https://stratocast-mvp.herokuapp.com/
- Successfully able to run a quick prediction for a balloon launch site in Fisher, Indiana.
- Documented how to install on Laptop and also run on the cloud.
- Open Street Maps used to serve up the map tiles.
- Successfully downloads wgrib2 format files to 1 degree from NOAA.
- Build the wgrib2 application in the Heroku deployment pipeline and then use from the Stratocast application. 
- Redis and MongoDB services on Heroku support the NOAA download queue and caching of sounding files, respectively.

### Version 0.0.1

- 11 May 2013
- Initial working version.

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

## High-Level Design

This document only captures the high-level design.

### Control flow

1. Write a list of time stamp keys to a Redis *sounding queue*.
1. Each worker attempts to pop a key from the *sounding queue* and perform a download, if a download is not currently occurring.
1. As each grib2 file is down loaded from NOAA, it is pre-processed by wgrib2 that performs a filtering of the original file.
1. The smaller filtered grib2 file is kept and the original down-loaded file is deleted.
1. The file path reference to the smaller grib2 file is written into a Mongo DB collection called *soundingFiles*.
1. User asynchronously makes a *flight prediction request*.
1. Attempt to get this sounding from the Mongo DB collection called *soundingCache*.
1. If there is a cache *hit* then the value from the cache is used to for the flight prediction.
1. If there is a cache *miss* then the path to the grib2 file is retrieved from the Mongo DB collection *soundingFiles*.
1. wgrib2 is used to process the smaller filtered grib2 file to get the temperature, altitude, wind and pressure values.
1. Extracted values are stored in the Mongo DB collection *soundingCache*.
1. Extracted values are used to calculate the flight path.
1. Results are presented back to the user on a Leaflet map that uses Open Street Map tiles.

### Data flow

1. Data store initialisation pushes time stamp keys to Redis *sounding queue*. 
1. Worker pops time stamp keys from Redis *sounding queue*.
1. Worker downloads grib2 data files from NOAA and converts them to a smaller filtered format.
1. Users make a flight prediction request
1. grib2 files have information extracted and stored into Mongo DB
1. Flight path prediction is presented to the user on a Leaflet map.
 
### Design Patterns

1. Separation of concerns
    - A design principle for separating a computer program into distinct sections, so that each section addresses a separate concern. A concern is a set of information that affects the code of a computer program. A concern can be as general as the details of the hardware the code is being optimised for, or as specific as the name of a class to instantiate. A program that embodies SoC well is called a modular program. Modularity, and hence separation of concerns, is achieved by encapsulating information inside a section of code that has a well-defined interface.
1. Model View Controller
    - An architectural pattern commonly used for developing user interfaces that divides an application into three interconnected parts. This is done to separate internal representations of information from the ways information is presented to and accepted from the user. The MVC design pattern decouples these major components allowing for code reuse and parallel development.
    - Model
        - The central component of the pattern. It is the application's dynamic data structure, independent of the user interface. It directly manages the data, logic and rules of the application.
    - View
        - Any representation of information such as a chart, diagram or table. Multiple views of the same information are possible, such as a bar chart for management and a tabular view for accountants.
    - Controller
        - Accepts input and converts it to commands for the model or view.

### Restful API

1. **api/balloons?<parameters>**
    - Parameters
        - None
    - Description
        - Get a listing of the Balloon types that are supported by the flight prediction tool that are categorised by their Balloon brand and size. Reporting additional information about each of the Balloon such as their mass, burst radius and drag.
    - Response
        - JSON: Describing characteristics of each of the supported balloon types.
1. **api/prediction?<parameters>**
    - Parameters
        - loc: Launch location as latitude and longitude, in decimal.
        - time: Milliseconds since Epoch.
        - balloon[type]: Supported Balloon type of the brand and size, example *Kaymont 800g*.
        - balloon[totalLift]: Sum of the Net lift, Balloon mass, and the payload, in kgs.
        - parachute[area]: Area of the parachute when deployed on descent, in m3.
        - parachute[drag]: Drag of the parachute when deployed on descent.
        - mass: Payload attached to the balloon, in kgs.
        - direction: Possible values of quick, forward, reverse.
    - Description
        - Performs a flight path prediction for the given balloon at the given time from the starting location in a forward or reverse direction using the balloon and parachute characteristics that are provided.
    - Response
        - JSON: Describing the flight path prediction as a series of geographical data points that can be plotted onto a map.
1. **api/sounding?<parameters>**
    - Parameters
        - loc: Launch location as latitude and longitude, in decimal.
        - time: Milliseconds since Epoch.
    - Description
        - Get the sounding information for the given location and time.
    - Response
        - JSON: Sounding information that includes the temperature, altitude, pressure and wind direction.

### Model

1. Estimation Calculations
    - Burst Volume = 4/3 * PI * r^3
    - Launch Volume = (Lift + Balloon mass + Payload mass) / (rhoAir - rohGas)
    - Burst Altitude = 7238.3 ln ( Burst Volume / Launch Volume )
1. Prediction Calculations
    - P * V = n * R  * T (Ideal Gas Law)
    - Ascent Rate = SQRT( (lift * gravity) / ( 0.5 * rohAir * Balloon Drag * Balloon Area ) )
        - Lift, rohAir and Balloon area values change as the altitude and hence atmospheric pressure changes.
    - Descent Rate = SQRT( (payload mass * gravity) / ( 0.5 * rohAir * Parachute Drag * Parachute Area ) )
        - rohAir changes as the altitude and hence atmospheric pressure changes

### Grib2 data

Grib2 data is down loaded from NOAA and is parsed into an internal data structure that is cached into a Mongo database.

To view this data.
```
$ ./grib2/wgrib2/wgrib2 data/1573495200000.grib2.small -s -ij 91 1
```

An example of the data format.

```
1:0:d=2019111106:HGT:1 mb:12 hour fcst::val=49076.6
2:78774:d=2019111106:TMP:1 mb:12 hour fcst::val=275.909
3:124181:d=2019111106:UGRD:1 mb:12 hour fcst::val=-5.87596
4:208839:d=2019111106:VGRD:1 mb:12 hour fcst::val=13.1186
5:292375:d=2019111106:HGT:2 mb:12 hour fcst::val=43495
6:378208:d=2019111106:TMP:2 mb:12 hour fcst::val=271.1
7:422138:d=2019111106:UGRD:2 mb:12 hour fcst::val=-3.63299
8:506059:d=2019111106:VGRD:2 mb:12 hour fcst::val=7.5756

```

The data comes in blocks of 4.
1. First element is the Altitude of the data point, in meters.
1. Second element is the Temperature of the data point, in kelvin.
1. Third element is the u-component of wind, in m/s.
1. Fourth element is the v-component of wind, in m/s.

Each of these blocks comes at the atmospheric pressure, in hPa, of 1, 2, 3, 5, 7, 125, 175, 225, 275, 325, 375, 425, 475, 525, 575, 625, 675, 725, 775, 825, and 875.

## Heroku

To get the Stratocast running as a Heroku application https://stratocast-mvp.herokuapp.com/ 


### Add-On

Add the following add-ons:

1. Heroku Redis
1. mLab MongoDB

### Build Packs

Add the following build packs:

 1. heroku-community/apt
 1. https://github.com/colonyamerican/heroku-buildpack-make.git
 1. heroku/nodejs
 
### Redis Configuration

The default Redis timeout is set to 5 minutes and this needs to be extended so that the Redis server does not timeout.

```
$ heroku redis:timeout --app stratocast-mvp  --seconds 0

```

### Configuration Variables

When running on Heroku the hostname, port and authentication to interact with the Redis, MongoDb and the node service
are configured by the following configuration variables.
 
 1. `MONGODB_URI`: Hostname, port and authentication to connect and use the Heroku Mongo DB service.
 1. `REDIS_URL`: Hostname, port and authentication to connect and use the Heroku Redis service.
 1. `PORT`: Port for the Heroku NodeJS web application.
 
### Deployment

When making a deployment of the Stratocast to the Heroku application https://stratocast-mvp.herokuapp.com/ from GitHub.

Use the **deploy** branch.

## Laptop Installation

To get the Stratocast running as an application on your laptop.

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
