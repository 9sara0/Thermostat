$(document).ready(function() {
  var thermostat = new Thermostat();
  updateTemperature();

  function getTempDecimal() {
    currentTemp = thermostat.getCurrentTemperature() / thermostat.MAX_LIMIT_PSM_OFF;
    bar.animate(currentTemp);
  }

  $('#temperature').text(thermostat.temperature);
  if (thermostat.powerSavingMode) {
    $('#power-saving-status').text('ON');
  }else {
    $('#power-saving-status').text('OFF');
  }

  function updateTemperature() {
    $('#temperature').text(thermostat.temperature);
    $('#page').attr('class', thermostat.energyUsage());
  }

  $('#temperature-down').click(function() {
    thermostat.down();
    updateTemperature();
    getTempDecimal();
  });

  $('#temperature-up').click(function() {
    thermostat.up();
    updateTemperature();
    getTempDecimal();
  });

  $('#temperature-reset').click(function() {
    thermostat.resetTemperature();
    updateTemperature();
    getTempDecimal();
  });


  $("#power-saving-toggle").bootstrapSwitch({offColor: 'danger', onColor: 'success'});
  $("#power-saving-toggle").on('switchChange.bootstrapSwitch', function() {
   thermostat.togglePowerSavingMode();
   updateTemperature();
 });

  $('#select-city').submit(function(event){
    event.preventDefault();
    var city = $('#current-city').val();
    displayWeather(city);
  });

  function displayWeather(city) {
    var url   = 'http://api.openweathermap.org/data/2.5/weather?q=' + city;
    var token = '&appid=267264c5f0acf7f84238123331b10e7a';
    var units = '&units=metric';
    $.get(url + token + units , function(data) {
      $('#current-temperature').text(data.main.temp);
      $('#city-name').text(city + '  temperature: ');
      displayIcon(data.weather[0].icon)
    });
  }

  function displayIcon(icon_code) {
    var url       = "http://openweathermap.org/img/w/" + icon_code;
    var extention = ".png";
    var source    = url + extention;
    $('#icon').attr('src', source);
  }


  var bar = new ProgressBar.SemiCircle(container, {
    strokeWidth: 6,
    color: '#FFEA82',
    trailColor: '#eee',
    trailWidth: 1,
    easing: 'easeInOut',
    duration: 1400,
    svgStyle: null,
    text: {
      value: '',
      alignToBottom: false
    },
    from: {color: '#FFEA82'},
    to: {color: '#ED6A5A'},
    // Set default step function for all animate calls
    step: function(state, bar) {
      bar.path.setAttribute('stroke', state.color);
      bar.setText(thermostat.getCurrentTemperature() + '&deg;C');
    }
  });
  bar.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
  bar.text.style.fontSize = '2rem';


});
