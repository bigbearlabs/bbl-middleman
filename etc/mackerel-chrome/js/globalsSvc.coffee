that = this
app = @appModule

@appModule.factory 'globalsSvc', ($log, $rootScope, $location,
  Restangular
  userPrefs, envs) ->
  
  # set up an authentication object under root scope, as ui needs to invoke ops. all controllers must declare this service as an injected dep in order to make authentication flows work.
  $rootScope.authentication =
    
    loginAction:
      url: '#/login'
      message: 'Login'

    logoutAction:
      url: '#/logout'
      message: 'Logout'

    setLoggedIn: ->
      @loggedIn = true
      @nextAction = @logoutAction

    setLoggedOut: ->
      userPrefs.clear 'evernote_authToken'

      @loggedIn = false
      @nextAction = @loginAction

  $rootScope.authentication.loggedIn = false
  $rootScope.authentication.nextAction = $rootScope.authentication.loginAction


  # error handling
  $rootScope.resolveError = (error) ->
    # STUB
    'http://support.bigbearlabs.com/forums/191718-general/category/68202-tagyeti'
  
  $rootScope.acceptError = (e) ->
    $rootScope.error = null
    $rootScope.msg = null    



  # looking redundant - just use rootscope?
  obj = 

    setupRestangular: ->
      apiServer = envs[userPrefs.get('env')].apiServer
      Restangular.setBaseUrl(apiServer + "/mackerel")

      username = userPrefs.get 'username'
      throw "null username" unless username

      Restangular.setFullRequestInterceptor (el, op, what, url, headers, params)->
        headers['x-username'] = username
        # FIXME read username from localStorage
        headers: headers
        params: params
        element: el


    # all state refreshes.
    doit: ->
      envs.apply()
      
      obj.setupRestangular()

      obj.update()


    # update all dependents.
    update: ->
      app.userDataSource.init()
      $rootScope.authentication.setLoggedIn()
      app.stickersC?.update()


    handleError: (e) ->
      $log.error e

      $rootScope.msg = "error: #{e}"
      $rootScope.error = e

      $rootScope.$apply()

      # console.warn { msg: 'Exception!!', obj:e }


  obj


@appModule.factory 'userPrefs', ($log
  ) ->

  app.userPrefs = 

    ## defaults.

    env: 'production'
    
    sticker_prefix_pattern: /^##/
    sticker_prefix: '##'


    # local storage persistence

    set: (key, val) ->
      if val == undefined
        throw "value for key #{key} is undefined"

      $log.info "setting #{key}"
      @[key] = val
      localStorage.setItem key, JSON.stringify val
    
    get: (k) ->
      val = localStorage.getItem k
      if val and val != 'undefined'
        # update my properties.
        @[k] = val
      else
        # shouldn't set - it would be circular.

        # default to current properties.
        val = @[k]

      if val
        try 
          parsed = JSON.parse(val)
        catch e
          return val
      else
        console.log "returning null for '#{k}'"
        null

    clear: (key) ->
      localStorage.clear key



    needsIntro: ->
      nextIntroVal = @get 'nextIntro'
      unless nextIntroVal
        true
      else
        new Date(nextIntroVal).isPast()

    setFinishedIntro: ->
      @set 'nextIntro', @nextDate().getTime()

    nextDate: ->
      if @env == 'dev'
        Date.tomorrow()
      else
        Date.oneYearLater()



@appModule.factory 'envs', ($log, $injector
  userPrefs) ->


  obj =

    ## envs.

    production:
      userDataSource: 'stubDataSvc'
      apiServer: 'http://mackerel-everest.herokuapp.com'

    dev:
      userDataSource: 'stubDataSvc'
      apiServer: 'http://localhost:8081'


    apply: (env)->
      env ||= userPrefs.get 'env'

      console.log "applying env '#{env}'"

      app.userDataSource = $injector.get @[env].userDataSource
      app.apiServer = @[env].apiServer



# REFACTOR
Date.tomorrow = ->
  date = new Date()
  date.setDate date.getDate() + 1
  date

Date.oneYearLater = ->
  date = new Date()
  date.setFullYear date.getFullYear() + 1
  date

Date::isPast = ->
  now = new Date()
  @.getTime() < now.getTime()
