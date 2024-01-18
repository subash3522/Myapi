const { log } = require('console');
const EventEmitter  = require('events');

myEmitter = new EventEmitter();

myEmitter.on('eventname', (a)=>{
    console.log(`its listening ${a}`);
})

myEmitter.emit('eventname', 'helloworld')