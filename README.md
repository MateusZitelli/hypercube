# Hypercube communication test

This is a simple test using Node.JS to create a distributed system based on the
hypercube architecture.

When It's executed many processes are spawned recursively for the hypercube
generation. After the spawning phase all the process wait a message via sockets,
when It arrives the process prints the received data and then replicate it for
other adjacent process in the hypercube.

# Execution
First you need to install Node.JS and npm, it was tested with the version
v0.10.31.

```sh
$ npm install
$ node hc.js -d <dimension of the cube | 3 by default>
```

Then just connect with the process 0 by the port 8100 and send whatever you
want.

```sh
$ telnet localhost 8100
#vamosprogramar
```
