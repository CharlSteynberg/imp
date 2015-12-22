
// mode :: strict
// --------------------------------------------------------------------------------------------
   "use strict";
// --------------------------------------------------------------------------------------------



// func :: Tick
// --------------------------------------------------------------------------------------------
   Name
   ({
      Tick:function(defn)
      {
         if (!isObj(defn))
         { throw new TypeError('object expected'); }

         var func = defn.keysAt(0);

         if (!this[func])
         { throw new ReferenceError('`'+func+'` is undefined'); }

         return function(cbfn)
         {
            Tick[this.Name](this.Defn, cbfn);
         }
         .with
         ({
            Name:func,
            Defn:defn[func],
         });
      }
      .with
      ({
         after:function(time, cbfn) // milliseconds
         {
            stdLog('TODO :: tick : after');
         },

         every:function(time, cbfn) // milliseconds
         {
            stdLog('TODO :: tick : every');
         },

         event:function(pors, cbfn) // listen for path or sock event
         {
            stdLog('TODO :: tick : event');
         },

         until:function(func, cbfn) // wait until func(cond) returns true
         {
            stdLog('TODO :: tick : until');
         },
      })
   })
// --------------------------------------------------------------------------------------------
