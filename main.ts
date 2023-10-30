function kiSteuerung() {
    Ausgabe_String = ""
    seriennummer = seriennummer + 1
    Ausgabe_String = Ausgabe_String + seriennummer.toString() + ","
    erzeugeSnapshot()
    for (let Index = 0; Index <= 5; Index++) {
        Ausgabe_String = Ausgabe_String + snapshot[Index].toString() + ","
    }
    warten = true
    serial.writeString('Snapshot:' + Ausgabe_String + serial.NEW_LINE)
    ergebnis[0] = 0
    ergebnis[1] = 0
    let empfangen = ''
    let delimiter = 0
    let start = control.millis()

    // Warten auf Ergebnis mit Timeout
    while (warten == true) {
        empfangen = empfangen + serial.readString()
        if ((empfangen.length > 0) && (empfangen.includes(serial.NEW_LINE, 0))) {
            warten = false
            //serial.writeString('Rechenzeit:' + (control.millis() - start).toString() + serial.NEW_LINE)
            // 200 passt. max 114
        }
        if ((control.millis() - start) > 200) {
            serial.writeString('Timeout:' + (control.millis() - start).toString() + serial.NEW_LINE)
            warten = false
        }
    }
    if (empfangen.length > 0) {
        //serial.writeString('Empfangen:' + empfangen + serial.NEW_LINE)
        let ergebnisPos = empfangen.indexOf('Ergebnis:', 0)
        if (ergebnisPos > -1) {
            basic.setLedColor(0x00FF00)
            //serial.writeString('Korrekt:' + empfangen + serial.NEW_LINE)
            empfangen = empfangen.substr(ergebnisPos + 9, 99)
            for (let Index = 0; Index <= 2; Index++) {
                delimiter = empfangen.indexOf(',', 0)
                ergebnis[Index] = parseFloat(empfangen.substr(0, delimiter))
                empfangen = empfangen.substr(delimiter + 1, 99)
            }
            //serial.writeString('E0:' + ergebnis[0].toString() + serial.NEW_LINE)
            //serial.writeString('E1:' + ergebnis[1].toString() + serial.NEW_LINE)
            //serial.writeString('E2:' + ergebnis[2].toString() + serial.NEW_LINE)
            basic.turnRgbLedOff()
            warten = false
        }
    }
    if (ergebnis[1] >= 0.5) {
        output = "A"
        buttonA()
    } else {
        if (ergebnis[2] >= 0.5) {
            output = "B"
            buttonB()
        } else {
            output = "x"
        }
    }
//basic.pause(10)
}
input.onButtonEvent(Button.A, input.buttonEventClick(), function() {
    buttonA()
})
input.onButtonEvent(Button.B, input.buttonEventClick(), function () {
    buttonB()
})
function buttonA() {
    if (playerCar.get(LedSpriteProperty.X) > 0) {
        playerCar.change(LedSpriteProperty.X, -1)
    }
} function buttonB() {
    if (playerCar.get(LedSpriteProperty.X) < 4) {
        playerCar.change(LedSpriteProperty.X, 1)
    }
}
function movecar(carnumber: number, x: number, y: number) {
    cars[carnumber] = game.createSprite(x, y)
    basic.pause(Math.randomRange(0, 5001))
    while (gameOn == true) {
        if (cars[carnumber].get(LedSpriteProperty.Y) == 4) {
            if (playerCar.isTouching(cars[carnumber])) {
                gameOn = false
            } else {
                score = score + 1
                cars[carnumber].delete()
                basic.pause(Math.randomRange(1000, 5001))
                cars[carnumber] = game.createSprite(x, y)
                basic.pause(500)
            }
        } else {
            cars[carnumber].change(LedSpriteProperty.Y, 1)
            basic.pause(500)
        }
    }
}
function erzeugeSnapshot() {
    snapshot = [
        playerCar.get(LedSpriteProperty.X) / 4,
        (cars[0].get(LedSpriteProperty.Y) + 1) / 5,
        (cars[1].get(LedSpriteProperty.Y) + 1) / 5,
        (cars[2].get(LedSpriteProperty.Y) + 1) / 5,
        (cars[3].get(LedSpriteProperty.Y) + 1) / 5,
        (cars[4].get(LedSpriteProperty.Y) + 1) / 5
    ]
    for (let Index = 0; Index <= 4; Index++) {
        if (cars[Index].isDeleted()) {
            snapshot[Index + 1] = 0
        }
    }
}
serial.setRxBufferSize(100)
serial.setTxBufferSize(100)
serial.redirect(SerialPin.C17, SerialPin.C16, 115200)
serial.writeString('Init' + serial.NEW_LINE)
let score = 0
let seriennummer = 0
let gameOn = false
let warten = false
let transfer = false
let output = ""
let Ausgabe_String = ""
let ergebnis: number[] = [0.0, 0.0]
let snapshot: number[] = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
let playerCar: game.LedSprite = null
let car0 = game.createSprite(0, 0)
let car1 = game.createSprite(0, 0)
let car2 = game.createSprite(0, 0)
let car3 = game.createSprite(0, 0)
let car4 = game.createSprite(0, 0)
car0.delete()
car1.delete()
car2.delete()
car3.delete()
car4.delete()
let cars: game.LedSprite[] = [car0, car1, car2, car3, car4]
basic.forever(function () {
    basic.pause(100)
    if (gameOn == true) {
        movecar(0, 0, 0)
    }
})
basic.forever(function () {
    basic.pause(100)
    if (gameOn == true) {
        movecar(1, 1, 0)
    }
})
basic.forever(function () {
    basic.pause(100)
    if (gameOn == true) {
        movecar(2, 2, 0)
    }
})
basic.forever(function () {
    basic.pause(100)
    if (gameOn == true) {
        movecar(3, 3, 0)
    }
})
basic.forever(function () {
    basic.pause(100)
    if (gameOn == true) {
        movecar(4, 4, 0)
    }
})
control.inBackground(function () {
    while (true) {
        basic.pause(100)
        if (gameOn == true) {
            kiSteuerung()
        }
    }
})
control.inBackground(function () {
    score = 0
    playerCar = game.createSprite(2, 4)
    playerCar.setBrightness(60)
    gameOn = true
    while (gameOn == true) {
        basic.pause(100)
    }
    basic.clearScreen()
    control.reset()
    //game.addScore(score)
    //game.gameOver()
})

