
// mode :: strict
// --------------------------------------------------------------------------------------------
   "use strict";
// --------------------------------------------------------------------------------------------



// func :: typeIn : extended variable-type identification with global type-constants & `is` Fnc
// --------------------------------------------------------------------------------------------
   Name
   ({
      typeIn:function(data)
      {
         var tpof, name;

         tpof = typeOf(data);
         name = typeOf.list.keysOf(tpof);

         if (name in this.func)
         { return this.func[name](data); }
      }
      .with
      ({
         list:
         (
            function()
            {
               var list, item, resl, lpts, sitm, ipts, name, text;

               resl = {};
               list = // Obj
               {
                  Bln:'pos:positive neg:negative',
                  Num:'udf:1 emt:1 int:integer flo:float',
                  Str:'udf:1 emt:1 wsp:whitespace bln:1 num:1 pth:path ipa:address sck:socket qot:quoted '
                     +'exp:expression arr:1 obj:1 fnc:1 txt:text',
                  Arr:'emt:1 num:numeric aso:associative mxd:mixed',
                  Obj:'emt:1 num:numeric cls:class dom:element',
                  Fnc:'emt:1 obj:object',
               };

               for (item in list)
               {
                  lpts = list[item].split(' ');

                  for (sitm in lpts)
                  {
                     ipts = lpts[sitm].split(':');
                     name = (ipts[0] + item);

                     ipts[0] = (ipts[0][0].toUpperCase()+ipts[0].substr(1,2));

                     text = ((ipts[1] == '1') ? null : ipts[1]+' '+typeOf.list[item]);
                     text = (text ? text : typeOf.list[ipts[0]]+' '+typeOf.list[item]);

                     resl[name] = text;
                  }
               }

               return resl;
            }()
         ),

         init:function()
         {
            var list, item, func;

            list = {};

            for (item in this.list)
            {
               func = 'is'+(item[0].toUpperCase()+item.substr(1,5));

               list[item] = this.list[item];
               list[func] = function(data)
               {
                  return ((typeIn(data) === this.data) ? true : false);
               }
               .with
               ({data:this.list[item]});
            }

            Edit(global)(list);
         },

         func:
         {
            Bln:function(arg)
            { return (arg ? truBln : flsBln); },


            Num:function(arg)
            {
               if (arg === 0)
               { return emtNum; }

               if ((arg+'').indexOf('.') > 0)
               { return floNum; }

               return intNum;
            },


            Str:function(arg,flc,lst,tmp)
            {
               flc = (arg[0] + arg.substr(-1,1));
               lst = {'()':expStr, '[]':arrStr, '{}':objStr};
               tmp = arg.trim();

               if (arg.length < 1)
               { return emtStr; }

               if (!(/\S/.test(arg)))
               { return wspStr; }

               if ([Udf,Emt].indexOf(arg) > -1)
               { return arg+' '+Str; }

               if (['true','false','yes','no','on','off'].indexOf(arg) > -1)
               { return blnStr; }

               if (!isNaN((arg * 1)))
               { return numStr; }

               if (['""', "''", '``'].indexOf(flc) > -1)
               { return qotStr; }

               if (flc in lst)
               { return lst[flc]; }

               if ((tmp.indexOf('(') > 0) && (tmp.indexOf(')') > 1) && ((flc[1] == ')') || (flc[1] == '}')))
               { return fncStr; }

               if (/\s/g.test(arg))
               { return txtStr; }

               if ((/^[a-zA-Z0-9\-_\./]+$/.test(arg)) && (arg.indexOf('/') > -1) && (arg.indexOf('.') > -1))
               { return pthStr; }

               if (/^(([1-9]?\d|1\d\d|2[0-5][0-5]|2[0-4]\d)\.){3}([1-9]?\d|1\d\d|2[0-5][0-5]|2[0-4]\d)$/.test(arg.split(':')[0])) // ip or sock
               {
                  if (arg.indexOf(':') < 0)
                  { return ipaStr; }

                  return sckStr;
               }

               if (/(http|ftp|https|ws|wss):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/.test(arg))
               { return urlStr; }

               if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(arg))
               { return urlStr; }
            },


            Arr:function(arg,idx,num)
            {
               num = 0;

               if (arg.length < 1)
               { return emtArr; }

               for (idx in arg)
               {
                  if (isNaN(idx))
                  { return objArr; }

                  if (idx != num)
                  { return mxdArr; }

                  num++;
               }

               return lstArr;
            },


            Obj:function(arg,idx)
            {
               if ((varType(arg)).indexOf('element') > -1)
               { return domObj; }

               if (Object.keys(arg).length < 1)
               { return emtObj; }

               for (idx in arg)
               {
                  if (typeof idx == 'number')
                  { return mxdObj; }
               }

               return kvpObj;
            },


            Fnc:function(arg,str,tst,key)
            {
               for (key in arg)
               {
                  if (arg.hasOwnProperty(key))
                  { return objFnc; }
               }

               str = (arg.toString()).toLowerCase();
               tst = (((str.split('{')[1]).trim()).split('}')[0]).trim();

               if (tst.length < 1)
               { return emtFnc; }

               tst = (((str.split('(')[0]).trim()).split('function')[1]).trim();

               if (tst.length < 1)
               { return anoFnc; }

               return gloFnc;
            },
         }
      })
   // -----------------------------------------------------------------------------------------
   });
// --------------------------------------------------------------------------------------------
