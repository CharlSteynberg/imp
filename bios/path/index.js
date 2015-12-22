
// mode :: strict
// --------------------------------------------------------------------------------------------
   "use strict";
// --------------------------------------------------------------------------------------------



// func :: Path
// --------------------------------------------------------------------------------------------
   define
   ({
      Path:
      {
         trap:
         {
            try:function(func,args)
            {
               var indx, iscb;

               func = func.split('Sync').join('');
               indx = (args.length -1);
               iscb = isFnc(args[indx]);

               if (!iscb)
               { func = (func+'Sync'); }

               if (!this.base.hasKey(func))
               { throw new ReferenceError('`'+func+'` is undefined'); }

               if (isStr(args[0]))
               {
                  if (args[0][0] == '$')
                  { args[0] = (Proc.path.self + args[0].substr(1,args[0].length)); }
               }

               if (func.hasAny('read', 'write') && !args[1])
               {
                  args[1] = 'utf8';
               }

               if (!iscb)
               { return this.base[func].apply(null,args) }

               this.base[func].apply(null,args)
            },
         },

         base:require('fs'),
      },
   });
// --------------------------------------------------------------------------------------------
