#!/usr/bin/env node
const argv = require('yargs').argv;
const getMSB = require('./utils').getMSB;
const childProcess = require('child_process');
const net = require('net');

const BASE_PORT = 8100;

var spawnNodes = function (id, fromDimension, toDimension) {
  var proc;
  var procs = [];

  var onout = function (proc, data) {
    if(data.toString() === 'ready'){
      console.log(" Connected with", proc.port);
      proc.socket.connect(proc.port);
    }
    process.stdout.write(" " + data);
  };

  var onerr = function (proc, data) {
    process.stdout.write('Stderr from '+ proc.id + ": " + data);
  };

  var onclose = function (proc, code) {
    process.stdout.write('Process', proc.id, 'closed with code', code);
  };

  for(var i = fromDimension; i < toDimension; i++){
    proc = {ls: null, id: null, port: null, socket: null};

    proc.id = id | (1 << i);

    proc.ls = childProcess.spawn(
      'node', ['hc.js', '-d', toDimension, '--id', proc.id] 
    );
    proc.ls.stdout.on('data', onout.bind(null, proc));
    proc.ls.stderr.on('data', onerr.bind(null, proc));
    proc.ls.on('close', onclose.bind(null, proc));

    proc.port = BASE_PORT + proc.id;
    proc.socket = new net.Socket();
    procs.push(proc);
  }

  return procs;
};

var waitAndReplicateMessage = function (port, nodes, myId) {
  var server = net.createServer(function (socket) {
    socket.on('data', function(data) {
      process.stdout.write(data.toString());
      for(var i in nodes){
        nodes[i].socket.write(data.toString());
      }
    });
  });
  server.listen(port);
  process.stdout.write('ready');
};

var msb, port;
var myId = 0;
var dimensions = 3;

if(argv.d || argv.dimentsions) {
  dimensions = argv.d || argv.dimensions;
}

if(argv.n || argv.id){
  myId = argv.n || argv.id;
}

port = BASE_PORT + myId;

msb = getMSB (dimensions, myId);
nodes = spawnNodes (myId, msb, dimensions);
waitAndReplicateMessage(port, nodes, myId);

