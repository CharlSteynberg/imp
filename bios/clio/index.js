 
// mode :: strict
// --------------------------------------------------------------------------------------------
   "use strict";
// --------------------------------------------------------------------------------------------



// func :: Repl
// --------------------------------------------------------------------------------------------
   define
   ({
      Repl:function(trgt)
      {
         var tpin, host, view, bufr, grab, func;

         trgt = (trgt || './file.imp');
         tpin = typeIn(trgt);


         if (tpin == sckStr)
         {
            stdLog('repl :: sock : not implemented, yet');
            Exit();
         }

         process.stdin.setRawMode(true);
         process.stdin.resume();

         Umod.keypress(process.stdin);

         process.stdin.on
         (
            'keypress',function(ch,key)
            {
               console.log(ch,key);

               if (key && key.ctrl && key.name == 'c')
               {
                  process.stdin.pause();
               }
            }
         );
      }
   });
// --------------------------------------------------------------------------------------------

