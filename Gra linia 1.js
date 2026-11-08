/* Rewir: w aplikacji Android podmienia GPS przeglądarki na GPS w tle (usługa pierwszoplanowa). W zwykłej przeglądarce nic nie robi. */
(function(){
  var C=window.Capacitor;
  if(!C||!C.isNativePlatform||!C.isNativePlatform())return;
  var BG;try{BG=C.registerPlugin('BackgroundGeolocation');}catch(e){return;}
  var next=1,W={};
  function toPos(l){return {coords:{latitude:l.latitude,longitude:l.longitude,accuracy:l.accuracy==null?20:l.accuracy,altitude:l.altitude==null?null:l.altitude,altitudeAccuracy:l.altitudeAccuracy==null?null:l.altitudeAccuracy,heading:l.bearing==null?null:l.bearing,speed:l.speed==null?null:l.speed},timestamp:l.time||Date.now()};}
  function toErr(e){var c=e&&e.code==='NOT_AUTHORIZED'?1:2;return {code:c,message:(e&&e.message)||'GPS error',PERMISSION_DENIED:1,POSITION_UNAVAILABLE:2,TIMEOUT:3};}
  function start(ok,err,once){
    var id=next++,rec={wid:null,dead:false};W[id]=rec;
    BG.addWatcher({backgroundTitle:'Rewir działa',backgroundMessage:'Gra i nagrywanie trasy trwają w tle.',requestPermissions:true,stale:false,distanceFilter:0},function(loc,e){
      if(rec.dead)return;
      if(e){if(e.code==='NOT_AUTHORIZED'){try{BG.openSettings();}catch(x){}}if(err)try{err(toErr(e));}catch(x){}return;}
      try{ok(toPos(loc));}catch(x){console.error(x);}
      if(once)stop(id);
    }).then(function(w){rec.wid=w;if(rec.dead)BG.removeWatcher({id:w});}).catch(function(e){if(err)try{err(toErr(e));}catch(x){}});
    return id;
  }
  function stop(id){var r=W[id];if(!r)return;r.dead=true;if(r.wid!=null)try{BG.removeWatcher({id:r.wid});}catch(e){}delete W[id];}
  var g=navigator.geolocation;
  var shim={watchPosition:function(ok,err){return start(ok,err,false);},getCurrentPosition:function(ok,err){start(ok,err,true);},clearWatch:stop};
  try{Object.defineProperty(navigator,'geolocation',{value:shim,configurable:true});}catch(e){try{navigator.geolocation=shim;}catch(x){}}
})();
