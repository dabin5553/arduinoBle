// 소문자 (아두이노와 동일하게 입력)
const SERVICE_UUID = "19b10000-e8f2-537e-4f6c-d104768a1214"; 
const WRITE_UUID = "19b10001-e8f2-537e-4f6c-d104768a1214"; 
let writeChar, statusP, connectBtn;
let button1, button2, button3;
let circleColor;

function setup() {
  createCanvas(windowWidth, windowHeight);

  // 초기 색상 설정 (기본값)
  circleColor = color(150, 150, 150);

  // BLE 연결
  connectBtn = createButton("Scan & Connect");
  connectBtn.mousePressed(connectAny);
  connectBtn.size(120, 30);
  connectBtn.position(20, 40);

  statusP = createP("Status: Not connected");
  statusP.position(22, 60);

  // 버튼 3개 추가
  button1 = createButton("Button 1");
  button1.mousePressed(() => {
    circleColor = color(255, 0, 0); // red
    sendNumber(1);
  });
  button1.size(120, 30);
  button1.position(20, 120);

  button2 = createButton("Button 2");
  button2.mousePressed(() => {
    circleColor = color(0, 255, 0); // green
    sendNumber(2);
  });
  button2.size(120, 30);
  button2.position(20, 160);

  button3 = createButton("Button 3");
  button3.mousePressed(() => {
    circleColor = color(0, 0, 255); // blue
    sendNumber(3);
  });
  button3.size(120, 30);
  button3.position(20, 200);
}

function draw() {
  background(240);
  
  // 중앙에 크기 200인 원 그리기
  fill(circleColor);
  noStroke();
  circle(width / 2, height / 2, 200);
}

// ---- BLE Connect ----
async function connectAny() {
  try {
    const device = await navigator.bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: [SERVICE_UUID],
    });
    const server = await device.gatt.connect();
    const service = await server.getPrimaryService(SERVICE_UUID);
    writeChar = await service.getCharacteristic(WRITE_UUID);
    statusP.html("Status: Connected to " + (device.name || "device"));
  } catch (e) {
    statusP.html("Status: Error - " + e);
    console.error(e);
  }
}

// ---- Write 1 byte to BLE ----
async function sendNumber(n) {
  if (!writeChar) {
    statusP.html("Status: Not connected");
    return;
  }
  try {
    await writeChar.writeValue(new Uint8Array([n & 0xff]));
    statusP.html("Status: Sent " + n);
  } catch (e) {
    statusP.html("Status: Write error - " + e);
  }
}
