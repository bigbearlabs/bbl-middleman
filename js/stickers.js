// Generated by CoffeeScript 1.6.2
(function() {
  var app, that;

  that = this;

  app = appModule;

  this.stickersCntl = angular.module('appModule').controller('StickersCntl', function($log, $scope, $rootScope, $location, userPrefs, runtime, globalsSvc) {
    app.stickersC = {
      update: function() {
        return $scope.update();
      }
    };
    $scope.shouldShowMenu = true;
    if ($location.path().match('/edit')) {
      $scope.editSticker(null);
    }
    $scope.toggleSticker = function(sticker) {
      var doit;

      doit = function() {
        $rootScope.msg = "Saving...";
        if (!$scope.page.hasSticker(sticker)) {
          return $scope.addSticker(sticker);
        } else {
          return $scope.removeSticker(sticker);
        }
      };
      return doit().then(function(result) {
        $rootScope.msg = "Saved.";
        return $rootScope.$apply();
      }).fail(function(error) {
        return globalsSvc.handleError(error);
      });
    };
    $scope.addSticker = function(sticker) {
      $scope.page.addSticker(sticker);
      return app.userDataSource.persist('page', $scope.page);
    };
    $scope.removeSticker = function(sticker) {
      $scope.page.removeSticker(sticker);
      return app.userDataSource.persist('page', $scope.page);
    };
    $scope.startCreateSticker = function() {
      $scope.newSticker = new Sticker({
        name: 'Noname'
      });
      $scope.editCallback = $scope.finishCreatingSticker;
      return $scope.editSticker($scope.newSticker);
    };
    $scope.finishCreatingSticker = function() {
      var newSticker;

      $scope.newSticker = $scope.editedSticker;
      newSticker = $scope.newSticker;
      newSticker.name = $scope.prefixedName(newSticker.name);
      return app.userDataSource.createSticker(newSticker).then(function(savedSticker) {
        $log.info({
          msg: "new sticker",
          sticker: savedSticker
        });
        $scope.stickers.push(savedSticker);
        $scope.newSticker = null;
        $scope.editedSticker = null;
        return $scope.$apply();
      }).fail(function(err) {
        err.userMessage = "Sorry, a sticker named '" + newSticker.name + "' already exists.";
        return globalsSvc.handleError(err);
      });
    };
    $scope.sortableOptions = {
      stop: function(e, ui) {
        $log.info("drag-drop finished.");
        return $scope.saveStickerOrder();
      }
    };
    $scope.saveStickerOrder = function() {
      return userPrefs.set('stickerOrder', $scope.stickers.map(function(sticker) {
        return sticker.name;
      }));
    };
    $scope.orderedStickers = function(stickers) {
      var orderedStickers, stickerOrder;

      stickerOrder = userPrefs.get('stickerOrder');
      if (!stickerOrder) {
        stickerOrder = [];
      }
      orderedStickers = stickerOrder.map(function(name) {
        return stickers.filter(function(sticker) {
          return sticker.name === name;
        })[0];
      });
      orderedStickers = _.without(orderedStickers, void 0);
      stickers.map(function(sticker) {
        if (!_.contains(orderedStickers, sticker)) {
          return orderedStickers.push(sticker);
        }
      });
      return orderedStickers;
    };
    $scope.fetchPage = function() {
      var url;

      url = $scope.page ? $scope.page.url : window.location.href;
      return runtime.pageForUrl(url).then(function(pageSpec) {
        return app.userDataSource.fetchPage(pageSpec);
      }).then(function(page) {
        $scope.page = page;
        $scope.$apply();
        return runtime.capturePageThumbnail(page);
      }).then(function(dataUrl) {
        $log.info({
          msg: " got the visual representation.",
          dataUrl: dataUrl
        });
        $scope.page.thumbnailUrl = dataUrl;
        return $scope.$apply();
      });
    };
    $scope.fetchStickers = function(page) {
      return app.userDataSource.fetchStickers(null).then(function(stickers) {
        var orderedStickers;

        orderedStickers = $scope.orderedStickers(stickers);
        orderedStickers = $scope.colouredStickers(orderedStickers);
        $scope.stickers = orderedStickers;
        return $scope.$apply();
      });
    };
    $scope.update = function() {
      $rootScope.msg = "Fetching data...";
      $rootScope.$apply();
      return Q.all([$scope.fetchPage(), $scope.fetchStickers()]).then(function() {
        $rootScope.msg = "";
        return $rootScope.$apply();
      });
    };
    $scope.showPageDetails = function() {
      return !runtime.hasRealPageContext();
    };
    $scope.highlight = function(sticker) {
      return $scope.highlightedSticker = sticker;
    };
    $scope.isHighlighted = function(sticker) {
      return $scope.highlightedSticker === sticker;
    };
    $scope.colours = [
      {
        name: 'yellow',
        code: '#eeed50'
      }, {
        name: 'red',
        code: '#ef4e4e'
      }, {
        name: 'violet',
        code: '#85648c'
      }, {
        name: 'pink',
        code: '#deadb4'
      }, {
        name: 'green',
        code: '#95a666'
      }, {
        name: 'khaki',
        code: '#4f5549'
      }, {
        name: 'blue',
        code: '#82b2c6'
      }, {
        name: 'navy',
        code: '#3a5579'
      }
    ];
    $scope.editSticker = function(sticker) {
      return $scope.editedSticker = that.clone(sticker);
    };
    $scope.finishEditingSticker = function() {
      var oldSticker;

      if ($scope.editCallback) {
        $scope.editCallback();
        return;
      }
      oldSticker = $scope.stickers.filter(function(sticker) {
        return sticker.id === $scope.editedSticker.id;
      })[0];
      $scope.editedSticker.name = $scope.prefixedName($scope.editedSticker.name);
      return app.userDataSource.updateSticker($scope.editedSticker).then(function() {
        var i;

        i = $scope.stickers.indexOf(oldSticker);
        $scope.stickers[i] = $scope.editedSticker;
        $scope.saveStickerOrder();
        $scope.saveStickerColours();
        $scope.editedSticker = null;
        return $scope.$apply();
      }).fail(function(error) {
        return globalsSvc.handleError(error);
      });
    };
    $scope.cancelEditingSticker = function() {
      return $scope.editedSticker = null;
    };
    $scope.saveStickerColours = function() {
      var colours;

      colours = $scope.stickers.map(function(e) {
        return {
          name: e.name,
          colour: e.colour
        };
      });
      return userPrefs.set('stickerColours', colours);
    };
    $scope.colouredStickers = function(stickers) {
      var colours, remainingColours;

      colours = userPrefs.get('stickerColours');
      if (colours) {
        remainingColours = colours;
        stickers.map(function(sticker) {
          var colourSpec;

          colourSpec = remainingColours.filter(function(e) {
            return e.name === sticker.name;
          })[0];
          if (colourSpec) {
            sticker.colour = colourSpec.colour;
          }
          return remainingColours = _.reject(remainingColours, function(e) {
            return e === colourSpec;
          });
        });
      }
      return stickers;
    };
    $scope.prefixedName = function(name) {
      if (name.match(userPrefs.sticker_prefix_pattern)) {
        return name;
      } else {
        return userPrefs.sticker_prefix + name;
      }
    };
    return Q.fcall(function() {
      return globalsSvc.doit();
    }).fail(function(e) {
      return globalsSvc.handleError(e);
    }).done();
  });

  this.clone = function(obj) {
    var flags, key, newInstance;

    if ((obj == null) || typeof obj !== 'object') {
      return obj;
    }
    if (obj instanceof Date) {
      return new Date(obj.getTime());
    }
    if (obj instanceof RegExp) {
      flags = '';
      if (obj.global != null) {
        flags += 'g';
      }
      if (obj.ignoreCase != null) {
        flags += 'i';
      }
      if (obj.multiline != null) {
        flags += 'm';
      }
      if (obj.sticky != null) {
        flags += 'y';
      }
      return new RegExp(obj.source, flags);
    }
    newInstance = new obj.constructor();
    for (key in obj) {
      newInstance[key] = clone(obj[key]);
    }
    return newInstance;
  };

}).call(this);
