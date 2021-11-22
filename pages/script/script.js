setInterval(() => {
  const modeSelect = document.querySelector('.modeSelect').value;
  const autoOptions = document.querySelector('.autoOptions');
  const manualOptions = document.querySelector('.manualOptions');
  if(modeSelect == 'Automatic'){
    autoOptions.hidden = false;
    manualOptions.hidden = true;
  }else{
    autoOptions.hidden = true;
    manualOptions.hidden = false;
  }
}, 500);


setInterval(() => {
  const currentTemp = document.querySelector('.currentTemp');
  const currentHumidity = document.querySelector('.currentHumidity');
  const currentLightLevel = document.querySelector('.currentLightLevel');

  fetch('/getCurrentValue')
  .then(async(response) => {
    const data = await response.json();
    currentTemp.innerText = 'Current temperature:' + data.temp + ' C';
    currentHumidity.innerText = 'Current humidity:' + data.humidity;
    currentLightLevel.innerText = 'Current light level:' + data.lightLevel;
  })
}, 1000)

const sendSettings = document.querySelector('.sendSettings');
sendSettings.addEventListener('click', async () => {
  const temperatureSetting = document.querySelector('.temperatureSetting').value;
  const humiditySetting = document.querySelector('.humiditySetting').value;
  const lightLevelSetting = document.querySelector('.lightLevelSetting').value;
  const mode = document.querySelector('.modeSelect');
  const scheme = document.querySelector('.scheme').value;


  if(mode.value == 'Automatic'){
    if(scheme == 'Lizard'){
      const data = {
        mode: mode.value,
        scheme,
        temperature: '30',
        humidity: '50',
        lightLevel: '--',
        time: Date.now()
      }
      await fetch('/postSettings', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data)});
    }
    if(scheme == 'Snake'){
      const data = {
        mode: mode.value,
        scheme,
        temperature: '40',
        humidity: '60',
        lightLevel: '--',
        time: Date.now()
      }
      await fetch('/postSettings', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data)});
    }
    if(scheme == 'Green plant'){
      const data = {
        mode: mode.value,
        scheme,
        temperature: '25',
        humidity: '75',
        lightLevel: '--',
        time: Date.now()
      }
      await fetch('/postSettings', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data)});
    }
    if(scheme == 'Cactus'){
      const data = {
        mode: mode.value,
        scheme,
        temperature:'45',
        humidity:'50',
        lightLevel:'--',
        time: Date.now()
      }
      await fetch('/postSettings', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data)});
    }
    if(scheme == 'Hamster'){
      const data = {
        mode:mode.value,
        scheme,
        temperature:'25',
        humidity:'65',
        lightLevel:'--',
        time: Date.now()
      }
      await fetch('/postSettings', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data)});
    }
  }else{
    const data = {
      mode: mode.value,
      scheme: '--',
      temperature: temperatureSetting,
      humidity: humiditySetting,
      lightLevel: lightLevelSetting,
      time: Date.now()
    }
    await fetch('/postSettings', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data)});
  }

})