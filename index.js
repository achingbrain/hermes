var BrickPi = require('brickpi'),
    io = require('socket.io-client'),
    async = require('async')

var brickPi = new BrickPi.Board('/dev/ttyAMA0', function(error) {
  var left = brickPi.addMotor(new BrickPi.Motor(), BrickPi.PORTS.MB)
  var right = brickPi.addMotor(new BrickPi.Motor(), BrickPi.PORTS.MC)
  
  var soundSensor = brickPi.addSensor(new BrickPi.Sensors.NXT.Sound(), BrickPi.PORTS.S1)
  var lightSensor = brickPi.addSensor(new BrickPi.Sensors.NXT.Light(), BrickPi.PORTS.S2)
  var distanceSensor = brickPi.addSensor(new BrickPi.Sensors.NXT.Distance(), BrickPi.PORTS.S3)
  lightSensor.light(false)

  var left = brickPi.addMotor(new BrickPi.Motor(), BrickPi.PORTS.MC)
  var right = brickPi.addMotor(new BrickPi.Motor(), BrickPi.PORTS.MB)
  
  var readValues = function() {
    var tasks = [
      distanceSensor.value.bind(distanceSensor),
      soundSensor.value.bind(soundSensor),
      lightSensor.value.bind(lightSensor)
    ]

    async.parallel(tasks, function(error, results) {
      if(error) {
          console.error(error, error.stack)
      } else {
          console.info('distance sensor:', results[0])
          console.info('sound sensor:', results[1])
          console.info('light sensor:', results[2])
      }

      setTimeout(readValues, 500)
    })
  }
  readValues()
  

/*
  var socketUrl = 'http://192.168.1.75:9008'

  console.info('Hardware initialised, connecting to', socketUrl)

  var socket = io(socketUrl)
  socket.on('connect', function() {
    brickPi.led(0).on()

    console.info('Connected to', socketUrl)

    socket.on('message', function(direction, speed) {
      console.info('incoming message', direction, speed)
    })
    socket.on('left', function(speed) {
      console.info('left', speed)
      left.speed(speed)
    })
    socket.on('right', function(speed) {
      console.info('right', speed)
      right.speed(speed)
    })
    socket.on('disconnect', function() {
      brickPi.led(0).off()
    })
  });*/
})
brickPi.on('error', function(error) {
    console.error(error)
    console.error(error.stack)
})
brickPi.on('emergencyStop', function(error) {
    console.info('stopped')
})

process.on('exit', function(){
  
});

process.on('uncaughtException', function(error){
  console.error(error)
  console.error(error.stack)
  brickPi.led(0).off()
  process.exit(1)
});

function exitHandler() {
  brickPi.led(0).off()
  process.exit(1)
}

process.on('exit', exitHandler);
process.on('SIGINT', exitHandler);
