function NanowrimoMeter() {
    this.init();
}

NanowrimoMeter.prototype.init = function() {
  this._kWindowMediator = Components.classes[ '@mozilla.org/appshell/window-mediator;1' ].getService(Components.interfaces.nsIWindowMediator);
  this._prefs = Components.classes[ '@mozilla.org/preferences-service;1' ].getService(Components.interfaces.nsIPrefService).getBranch('extensions.nanowrimometer.');
  this.word_count = 0;
  this.load_prefs();
  setTimeout('oNanowrimoMeter.calculate_remaining()', 5000);
}

NanowrimoMeter.prototype.get_pref_name = function() {
  var now = new Date();
  return 'word_count_' + now.getFullYear();
}

NanowrimoMeter.prototype.load_prefs = function() {
  try {
    this.word_count = this._prefs.getIntPref(this.get_pref_name());
  } catch (err) {}
  this.updateinterval = 15;
  var myTime = new Date();
  this.lastupdate = myTime.getTime();
}

NanowrimoMeter.prototype.save_prefs = function() {
  try {
    this._prefs.setIntPref(this.get_pref_name(), this.word_count);
  } catch (err) {}
}

NanowrimoMeter.prototype.calculate_remaining = function() {
  if (!this.interval) {
    this.interval =
      setInterval('oNanowrimoMeter.calculate_remaining()', 60 * 1000);
  } 

  var StatusBar = document.getElementById('nanowrimometer-status');
  if (StatusBar) {
    var now = new Date();
    var year = now.getFullYear();
    var start_of_november = new Date();
    start_of_november.setFullYear(year, 10, 1);
    start_of_november.setHours(0);
    start_of_november.setMinutes(0);
    start_of_november.setSeconds(0);
    var end_of_november = new Date();
    end_of_november.setFullYear(year, 11, 1);
    end_of_november.setHours(0);
    end_of_november.setMinutes(0);
    end_of_november.setSeconds(0);
    var seconds_elapsed = (now.getTime() - start_of_november) / 1000;
    var seconds_left = (end_of_november - now.getTime()) / 1000;
    var status;
    var color;
    if (seconds_elapsed <= 0) {
      status = "NaNoWriMo " + year + " hasn't begun yet!";
      var hours_until = -seconds_elapsed / 3600;
      if (hours_until > 48) {
        status = "NaNoWriMo " + year + " begins in " +
        Math.round(hours_until / 24) + " days!";
      } else {
        status = "NaNoWriMo " + year + " begins in " +
        Math.round(hours_until) + " hours!";
      }
    } else if (seconds_left <= 0) {
      status = 'NaNoWriMo ' + year + ' has ended!';
    } else if (this.word_count <= 0) {
      status = 'Enter your word count now!';
    } else {
      var rate = this.word_count / seconds_elapsed;
      var predicted = Math.round(rate * (30 * 24 * 60 * 60) / 100) / 10;
      status = 'Word count (predicted): ' + predicted + 'K';
      if (predicted >= 50) {
        color = 'green';
      } else if (predicted >= 40) {
        color = '#630';
      } else {
        color = 'red';
      }      
    }
    StatusBar.setAttribute('label', status);
    if (color) {
      StatusBar.setAttribute('style', 'color: ' + color);
    }
  }
}

NanowrimoMeter.prototype.fill_tooltip = function() {
  try {
    document.getElementById('nanowrimometer-tooltip-nextupdate').value =
      this.get_tooltip_text();
  } catch(err) {
    alert(err);
  }
}

NanowrimoMeter.prototype.get_tooltip_text = function() {
  if (this.word_count && this.word_count > 0) {
    return 'You have written ' + this.word_count + ' words.';
  } else {
    return 'Click here to enter your word count!';
  }
}

NanowrimoMeter.prototype.set_word_count = function() {
  var wc = prompt('How many words have you written?');
  wc = parseInt(wc);
  if (wc >= 0) {
    this.word_count = wc;
  }
  this.save_prefs();
  this.calculate_remaining();
}

var oNanowrimoMeter = new NanowrimoMeter();
