/*
  main.js - pete fighne
*/

var app = {'config':{},'data':[],'cData':[]};

$(document).ready( function(){

  // Bootstrap plugin + native library activation
  $(function () { $('#datetimepicker1').datetimepicker(); });
  $('.btn').button();
  $('.dropdown-toggle').dropdown();

  // Navigation Bar panel switching - ( none Bootstrap )
  var navBarElements = $('div.navbar.navbar-default.navbar-fixed-top div.container div.navbar-collapse.collapse ul.nav.navbar-nav li');
  var panelElements = $('div.container div.panel.panel-default');
  navBarElements.on('click', function(e) {
    navBarElements.removeClass('active');
    $(this).addClass('active');
    panelElements.addClass('hidden');
    var panelName = e.currentTarget.firstChild.firstChild.data;
    panelElements.each( function(index) {
      if($(panelElements[index]).find('div.panel-heading h3.panel-title').html() === panelName) {
        $(panelElements[index]).removeClass('hidden');
      }
    });
  });

  // transfer data from forms on tabs to capture tab
  function gatherParameters () {
    document.parameterForm.parameter_1.value = $('#probeSpan').html();
    document.parameterForm.parameter_2.value = $('#datetimepicker1 input').val();
    document.parameterForm.parameter_3.value = $('#timeSpan').html();
    document.parameterForm.parameter_4.value = $('#timeSeconds').val();
	// checking for timespan which enables the process to ignore milliseconds if timespan is seconds
    $('#timeSpan').html() === 'Seconds' ? document.parameterForm.parameter_5.value = "000" : document.parameterForm.parameter_5.value = $('#timeMilliseconds').val();
    document.parameterForm.parameter_6.value = $('#ipAddress').val();
	// checking for port selection, if 'all ports' ignore values 
    $('#spanPorts').html() === "All Ports"  ? document.parameterForm.parameter_7.value = "n/a" : document.parameterForm.parameter_7.value = $('#portNumber').val();
    document.parameterForm.parameter_8.value = $('#spanTraffic').html();
  }

  // capture data and store as in global object
  $('#parameterSubmit').on('click', function (e) {
    e.preventDefault();
    app.config = {
      'probe' : document.parameterForm.parameter_1.value,
      'datetime' : document.parameterForm.parameter_2.value,
      'timeSpan' : document.parameterForm.parameter_3.value,
      'timeSeconds' : Number(document.parameterForm.parameter_4.value),
      'timeMilliseconds' : Number(document.parameterForm.parameter_5.value),
      'ipAddress' : document.parameterForm.parameter_6.value,
      'ports' : document.parameterForm.parameter_7.value,
      'traffic' : document.parameterForm.parameter_8.value
    };

    app.config.iTime = Date.parse( app.config.datetime )

    if ( isNaN( Date.parse( app.config.datetime ) ) ) {
      // checking for correct format before proceeding.
      alert("Please enter correct date time format");
      // exit function - tba
    } 

    if ( app.config.timeSpan === "Seconds") {
      app.config.iTime += (app.config.timeSeconds * 1000);
    } else if ( app.config.timeSpan === "Milliseconds") {
      app.config.iTime += (app.config.timeSeconds * 1000) + timeMilliseconds;
    }

    console.log(app.config);
    $.get('/cgi-bin/cgi.sh', { 'probe' : app.config.probe, 'time' : app.config.iTime, 'gran' : app.config.timespan /*, 'ip' : document.timeframe.tf_ip.value, 'port' : document.timeframe.tf_port.value, 'rate' : 'ms' */}, function(data) {
        })
        .done( function(data) {
			// process data here
        })
  });

  $('#parameterPanelShow').on('click', function(){
    panelElements.addClass('hidden');
    gatherParameters();
    $('#parameterPanel').removeClass('hidden');
  });

  function restorePanels () {
     $('#parameterPanel').addClass('hidden');
    navBarElements.each( function(index) {
      if( $(navBarElements[index]).hasClass('active') ) {
        $(panelElements[index]).removeClass('hidden');
      }
    });
  }

  $('#parameterPanelHide').on('click', restorePanels);

  // Timing panel gui elements
  var timingElements = "div.container div.panel.panel-default#capturePanel div.panel-body div.container div.row";

  function toggleRange () {
    $(timingElements + ' div.col-sm-3:nth-child(3)').toggleClass( 'hidden' );
    $(timingElements + ' div.col-sm-2').toggleClass(  'hidden' );
    $('#timeSpan').html() === "Seconds" ? $('#timeSpan').html("Milliseconds") : $('#timeSpan').html("Seconds") ;
  }

  $(timingElements + ' div.col-sm-3 div.btn-group button.btn.btn-default:nth-child(1)').on('click', toggleRange);

  // Filter panel gui elements
  var filterElements = "div.container div.panel.panel-default#filterPanel div.panel-body div.container div.row";

  function togglePorts () {
    $('#portInput').toggleClass( 'hidden' );

    $('#spanPorts').html() === "All Ports" ? $('#spanPorts').html("Port") : $('#spanPorts').html("All Ports");
  }

  $('#showPortInput').on('click', togglePorts);

  $(filterElements + ' div.col-sm-2 div.btn-group ul.dropdown-menu li a').on('click', function(e) {
    $('#spanTraffic').html(e.currentTarget.firstChild.data);
  });

  $('ul.dropdown-menu#probeOptionList li a').on('click', function (e) {
    $('#probeSpan').html(e.currentTarget.firstChild.data);
  });

});
