var lbry = {
  isConnected: false,
  rootPath: '.',
  colors: {
    primary: '#155B4A'
  }
};

lbry.call = function (method, params, callback, errorCallback, connectFailedCallback)
{
  var xhr = new XMLHttpRequest;
  xhr.addEventListener('load', function() {
    var response = JSON.parse(xhr.responseText);

    if (response.error) {
      if (errorCallback) {
        errorCallback(response.error);        
      }
    } else if (callback) {
      callback(response.result);       
    }
  });

  if (connectFailedCallback) {
    xhr.addEventListener('error', function (e) {
      connectFailedCallback(e);
    });
  }

  xhr.open('POST', 'http://localhost:5279/lbryapi', true);
  xhr.send(JSON.stringify({
    'jsonrpc': '2.0',
    'method': method,
    'params': [params, ],
    'id': 0
  }));    
}

//core
lbry.connect = function(callback)
{
  // Check every half second to see if the daemon's running.
  // Returns true to callback once connected, or false if it takes too long and we give up.
  function checkDaemonRunning(tryNum=0) {
    lbry.daemonRunningStatus(function (runningStatus) {
      if (runningStatus) {
        lbry.isConnected = true;
        callback(true);
      } else {
        if (tryNum <= 600) { // Move # of tries into constant or config option
          setTimeout(function () {
            checkDaemonRunning(tryNum + 1);
          }, 500);
        } else {
          callback(false);
        }
      }
    });
  }
  checkDaemonRunning();
}

lbry.daemonRunningStatus = function (callback) {
  // Returns true/false whether the daemon is running (i.e. fully conncected to the network),
  // or null if the AJAX connection to the daemon fails.

  lbry.call('is_running', {}, callback, null, function () {
    callback(null);
  });
};

lbry.getDaemonStatus = function (callback) {
  lbry.call('daemon_status', {}, callback);
};

lbry.getStartNotice = function(callback) {
  lbry.call('get_start_notice', {}, callback);
}

lbry.getSettings = function(callback) {
  lbry.call('get_settings', {}, callback);
};

lbry.setSettings = function(settings, callback) {
  lbry.call('set_settings', settings, callback);
};

lbry.getBalance = function(callback)
{
  lbry.call("get_balance", {}, callback);
}

lbry.search = function(query, callback)
{
  lbry.call("search_nametrie", { "search": query }, callback);
}

lbry.getStream = function(name, callback) {
  lbry.call('get', { 'name': name }, callback);
};

lbry.getFileStatus = function(name, callback) {
  lbry.call('get_lbry_file', { 'name': name }, callback);
}

lbry.getFilesInfo = function(callback) {
  lbry.call('get_lbry_files', {}, callback);
}

lbry.startFile = function(name, callback) {
  lbry.call('start_lbry_file', { name: name }, callback);
}

lbry.stopFile = function(name, callback) {
  lbry.call('stop_lbry_file', { name: name }, callback);
}

lbry.deleteFile = function(name, callback) {
  lbry.call('delete_lbry_file', { name: name }, callback)
}

lbry.publish = function(params, callback) {
  // Use ES6 named arguments instead of directly passing param dict?
  lbry.call('publish', params, callback);
}

lbry.getVersionInfo = function(callback) {
  lbry.call('version', {}, callback);
};

lbry.checkNewVersionAvailable = function(callback) {
  lbry.call('version', {}, function() {
    // If the "version" method is available, we have a daemon new enough to do version checking
    lbry.call('check_for_new_version', {}, callback);
  }, function(err) {
    if (err.fault == 'NoSuchFunction') {
      // If it's not available, we're definitely in an old version
      callback(true);
    }
  });
}

lbry.reportBug = function(message, callback) {
  lbry.call('upload_log', {
    name_prefix: 'report',
    exclude_previous: false,
    force: true,
    message: message
  }, callback);
}

//utilities
lbry.formatCredits = function(amount, precision)
{
  return amount.toFixed(precision || 1);
}

lbry.loadJs = function(src, type, onload)
{
  var lbryScriptTag = document.getElementById('lbry'),
      newScriptTag = document.createElement('script'),
      type = type || 'text/javascript';
      
  newScriptTag.src = src;
  newScriptTag.type = type;
  if (onload)
  {
    newScript.onload = onload;
  }
  lbryScriptTag.parentNode.insertBefore(newScriptTag, lbryScriptTag);
}

lbry.imagePath = function(file)
{ 
  return lbry.rootPath + '/img/' + file; 
}

lbry.getMediaType = function(filename) {
  var dotIndex = filename.lastIndexOf('.');
  if (dotIndex == -1) {
    return 'unknown';
  }

  var ext = filename.substr(dotIndex + 1);
  if (/^mp4|mov|m4v|flv|f4v$/i.test(ext)) {
    return 'video';
  } else if (/^mp3|m4a|aac|wav|flac|ogg$/i.test(ext)) {
    return 'audio';
  } else if (/^html|htm|pdf|odf|doc|docx|md|markdown|txt$/i.test(ext)) {
    return 'document';
  } else {
    return 'unknown';
  }
}

lbry.stop = function(callback) {
  lbry.call('stop', {}, callback);
};


