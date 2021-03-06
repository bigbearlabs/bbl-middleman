// Generated by CoffeeScript 1.6.2
(function() {
  var __slice = [].slice;

  Parse.initialize("RnNIA4148ExIhwBFNB9qMGci85tOOEBHbzwxenNY", "5FSg0xa311sim8Ok1Qeob7MLPGsz3wLFQexlOOgm");

  ({
    Page_parse: Parse.Object.extend('Page'),
    Sticker_parse: Parse.Object.extend('Sticker')
  });

  this.appModule.factory('parse', function($log, $http) {
    var obj;

    obj = {
      fetchPage_parse: function(params, resultHandler) {
        var query, that, url;

        url = params.url;
        query = new Parse.Query(Page_parse);
        query.equalTo('url', url);
        that = this;
        return query.find({
          success: function(results) {
            var result;

            $log.info({
              url: url,
              results: results
            });
            if (results.length > 0) {
              result = results[0];
            } else {
              result = new Page_parse();
              result.url = url;
              result.stickers = [];
            }
            results.push(result);
            that.attrsToProps(result, 'url', 'title');
            return that.fetchStickers(result, function(stickers) {
              return resultHandler(results);
            });
          },
          error: function(error) {
            $log.info("Error: " + error.code + " " + error.message);
            return resultHandler(error);
          }
        });
      },
      fetchStickers_parse: function(page, resultHandler) {
        var query, that;

        if (page === null) {
          query = new Parse.Query(Sticker_parse);
        } else {
          if (page.isNew()) {
            resultHandler([]);
            return;
          }
          query = page.relation('stickers').query();
        }
        that = this;
        return query.find({
          success: function(stickers) {
            $log.info("fetched " + stickers.length + " stickers for " + page);
            stickers.forEach(function(sticker) {
              return that.attrsToProps(sticker, 'name');
            });
            if (page) {
              page.stickers = stickers;
            }
            return resultHandler(stickers);
          },
          error: function(error) {
            return $log.error(error);
          }
        });
      },
      fetchItems_parse: function(params, resultHandler) {
        var query, that;

        query = new Parse.Query(Page_parse);
        query.equalTo('stickers', params[0]);
        that = this;
        return query.find({
          success: function(results) {
            $log.info({
              params: params,
              results: results
            });
            results.forEach(function(result) {
              return that.attrsToProps(result, 'url');
            });
            return resultHandler(results);
          },
          error: function(error) {
            $log.info("Error: " + error.code + " " + error.message);
            resultHandler(error);
            return results.forEach(function(result) {
              return that.attrsToProps(result, 'name', 'url');
            });
          }
        });
      },
      persist_parse: function(type, modelObj, resultHandler) {
        var properties, stickersRelation, that, theObj,
          _this = this;

        that = this;
        switch (type) {
          case 'page':
            properties = ['url'];
            $log.info({
              page: modelObj,
              stickers: modelObj.stickers
            });
            stickersRelation = modelObj.relation('stickers');
            stickersRelation.add(modelObj.stickers);
            break;
          case 'sticker':
            properties = ['name'];
            if (modelObj.className !== 'Sticker') {
              theObj = new Sticker_parse();
              theObj.name = modelObj.name;
              modelObj = theObj;
            }
        }
        properties.forEach(function(p) {
          return modelObj.set(p, modelObj[p]);
        });
        return modelObj.save(null, {
          success: function(theObj) {
            $log.info("save successful");
            if (resultHandler) {
              return resultHandler(theObj);
            }
          },
          error: function(theObj) {
            return $log.error(theObj);
          }
        });
      },
      attrsToProps: function() {
        var attrs, obj;

        obj = arguments[0], attrs = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        return attrs.forEach(function(attr) {
          var val;

          val = obj.get(attr);
          if (val) {
            return obj[attr] = val;
          }
        });
      }
    };
    return obj;
  });

}).call(this);
