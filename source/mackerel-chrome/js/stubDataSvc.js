// Generated by CoffeeScript 1.6.2
(function() {
  var that;

  that = this;

  this.appModule.factory('stubDataSvc', function($log, $http, $resource) {
    var obj;

    obj = {
      init: function() {},
      fetchPage: function(params) {
        return Q.fcall(function() {
          var result;

          result = new that.Page();
          result.url = params.url;
          result.stickers = [
            {
              name: "stub-sticker-3"
            }
          ];
          return result;
        });
      },
      fetchStickers: function(page) {
        var deferred, results;

        deferred = Q.defer();
        results = $resource('http://localhost\\:8081/mackerel/tags').query(function() {
          results = results.map(function(e) {
            return new that.Sticker(e);
          });
          return deferred.resolve(results);
        });
        return deferred.promise;
      },
      fetchItems: function(params, resultHandler) {
        return Q.fcall(function() {
          $log.error("stub fetchItems called");
          return null;
        });
      },
      updateSticker: function(sticker) {
        return Q.fcall(function() {
          $log.error("stub updateSticker called");
          return null;
        });
      },
      persist: function(type, modelObj, resultHandler) {
        return Q.fcall(function() {
          $log.error("stub persist called");
          return null;
        });
      }
    };
    return obj;
  });

}).call(this);
