$(document).ready(function(){

    var LocalWeather = function(){

      var locationResponse = null;
      var localWeather = null;
      var displayUnit = 'F';
      var elementCache = null;

      function getCurrentLocation(){
        //return a thenable Promise
        var url = 'http://ip-api.com/json';
        return $.ajax({
          url: url,
          success: function(data){
            locationResponse = data;
          }
        });
      }

      function getCurrentWeather(){
        var url = 'http://api.openweathermap.org/data/2.5/weather';
        var data = {
          //bad idea to embed API Key here
          appid: 'fb36908083a2abc1d964a40f6a769a4a'
        };
        if(locationResponse !== null){
          data['q'] = [locationResponse['city'],locationResponse['region'],locationResponse['countryCode']].join(',');
          return $.ajax({
            url: url,
            data: data,
            success: function(data) {
              localWeather = data;
            }
          });
        }
      };

      //helper function to convert degree
      function convertDegree(degree, metric){
        switch(metric) {
            case 'F':
                degree = (degree * 9/5) - 457.87;
                break;
            case 'C':
                degree = degree - 273.15;
                break;
            default:
                return degree;
                break;
        }
        return degree.toFixed(2);
      }

      function renderUI(){
        if(locationResponse !== null){
          if(elementCache === null){
            cacheElements();
          }
          elementCache['$location'].html( locationResponse['city']+', '+locationResponse['region'] );
          var degree = localWeather['main']['temp'];
          degree = convertDegree(degree, displayUnit);
          elementCache['$degree'].html(degree);
          elementCache['$unit'].html('&deg;' + displayUnit);
          elementCache['$degreeControl'].each(function(i, el){
            var $el = $(el);
            if($el.val() === displayUnit){
              $el.prop('checked', true);
              return;
            }
          });

          var iconCode = localWeather.weather[0].icon;
          var iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png";

          elementCache['$icon'].empty().append( $('<img>').attr({
            'src':iconUrl
          }).css({width: '100px'}) );
          elementCache['$description'].html(localWeather['weather'][0]['main']);
          var ts = new Date(0);
          ts.setUTCSeconds( parseInt( localWeather['dt'] ) )
          elementCache['$timestamp'].html('Last Updated on <br/>' + ts.toString('MMMM dS, yyyy HH:mm'));
        }
      }

      function cacheElements(){
        var $weather = $('.weather')
        elementCache = {
          $location:$('#location'),
          $degree:$weather.find('.degree'),
          $unit:$weather.find('.unit'),
          $icon:$weather.find('.icon'),
          $description:$weather.find('.description'),
          $timestamp:$weather.find('.timestamp'),
          $degreeControl: $weather.find('.degree-control input[type=radio]')
        }
        elementCache['$degreeControl'].on('click', degreeRadioOnclick);
      }

      function degreeRadioOnclick(){
        displayUnit = elementCache['$degreeControl'].filter(':checked').get(0).value;
        renderUI();
      }

      return {
        getCurrentLocation: getCurrentLocation,
        getCurrentWeather: getCurrentWeather,
        renderUI: renderUI
      };
    }();

    LocalWeather.getCurrentLocation()
    .then(LocalWeather.getCurrentWeather)
    .then(LocalWeather.renderUI);
});
