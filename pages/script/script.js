
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
  const currentTemp = document.querySelector('.currentTemp');
  const currentHumidity = document.querySelector('.currentHumidity');
  const currentLightLevel = document.querySelector('.currentLightLevel');
  
  fetch('/getCurrentValue')
  .then(async(response) => {
    const data = await response.json();
    currentTemp.innerText = 'Current temperature:' + data.temperature + ' C';
    currentHumidity.innerText = 'Current humidity:' + data.humidity + '%';
    currentLightLevel.innerText = 'Current light level:' + data.lightLevel;
  })
}, 1000);


const sendSettings = document.querySelector('.sendSettings');
sendSettings.addEventListener('click', async () => {
  const temperatureSetting = document.querySelector('.temperatureSetting').value;
  const humiditySetting = document.querySelector('.humiditySetting').value;
  const lightLevelSetting = document.querySelector('.lightLevelSetting').value;
  const mode = document.querySelector('.modeSelect');
  const scheme = document.querySelector('.scheme').value;


  if(mode.value == 'Automatic'){
    if(scheme == 'Summer Beach Time'){
      const data = {
        mode: mode.value,
        scheme,
        temperature: '25',
        humidity: '40',
        lightLevel: '--',
        time: Date.now()
      }
      await fetch('/postSettings', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data)});
    }
    if(scheme == 'Summer Chilly'){
      const data = {
        mode: mode.value,
        scheme,
        temperature: '15',
        humidity: '70',
        lightLevel: '--',
        time: Date.now()
      }
      await fetch('/postSettings', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data)});
    }
    if(scheme == 'Autumn walk'){
      const data = {
        mode: mode.value,
        scheme,
        temperature: '15',
        humidity: '50',
        lightLevel: '--',
        time: Date.now()
      }
      await fetch('/postSettings', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data)});
    }
    if(scheme == 'Autumn home with book'){
      const data = {
        mode: mode.value,
        scheme,
        temperature:'5',
        humidity:'75',
        lightLevel:'--',
        time: Date.now()
      }
      await fetch('/postSettings', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data)});
    }
    if(scheme == 'Winter snowball competition'){
      const data = {
        mode:mode.value,
        scheme,
        temperature:'0',
        humidity:'25',
        lightLevel:'--',
        time: Date.now()
      }
      await fetch('/postSettings', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data)});
    }
    if(scheme == 'Winter frozen nose hair'){
      const data = {
        mode:mode.value,
        scheme,
        temperature:'-20',
        humidity:'10',
        lightLevel:'--',
        time: Date.now()
      }
      await fetch('/postSettings', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data)});
    }
    if(scheme == 'Spring Only Sweater time'){
      const data = {
        mode:mode.value,
        scheme,
        temperature:'10',
        humidity:'40',
        lightLevel:'--',
        time: Date.now()
      }
      await fetch('/postSettings', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data)});
    }
    if(scheme == 'Spring stay at home drunk'){
      const data = {
        mode:mode.value,
        scheme,
        temperature:'0',
        humidity:'70',
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

const logout = document.querySelector('.logout');

logout.addEventListener('click', async e => {
  fetch('/logout', {method : 'POST'});
  window.location = '/'
  e.preventDefault();
})

const toArchive = document.querySelector('.toArchive');

toArchive.addEventListener('click', e => {
  window.location = "/archive"
  e.preventDefault()
})