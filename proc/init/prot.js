
// mode :: strict
// --------------------------------------------------------------------------------------------
   "use strict";
// --------------------------------------------------------------------------------------------



// edit :: global : constants
// --------------------------------------------------------------------------------------------
   Edit(global)
   ({
      TPO :'⋖tpof⋗',
      TPI :'⋖tpin⋗',

      ANY :'⋖any⋗',
      ALL :'⋖all⋗',

      KEY :'⋖keys⋗',
      VAL :'⋖vals⋗',

      BGN :'⋖begn⋗',
      END :'⋖endn⋗',

      KEYS:'⋖keys⋗',
      VALS:'⋖vals⋗',

      AUTO:'⋖auto⋗',
   });
// --------------------------------------------------------------------------------------------





// edit :: prot : object
// --------------------------------------------------------------------------------------------
   Edit(Number.prototype, String.prototype, Array.prototype, Object.prototype, Function.prototype)
   ({
      each:
      {
         trap:
         {
            set:function(func)
            {
               if (!isFnc(func))
               { throw new TypeError('function expected'); }

               if (isNum(this))
               {
                  for (var k=0; k<this; k++)
                  { func.apply(this, [k, (k+1)]); }

                  return;
               }

               for (var k in this)
               { func.apply(this, [k,this[k]]); }
            }
         }
      }
   });
// --------------------------------------------------------------------------------------------





// edit :: regx
// --------------------------------------------------------------------------------------------
   Edit(RegExp)
   ({
      escape:function(s)
      { return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'); }
   });
// --------------------------------------------------------------------------------------------





// edit :: math
// --------------------------------------------------------------------------------------------
   Edit(Math)
   ({
      real:function(nmbr)
      {
         var resl = nmbr.toString();

         if (resl.indexOf('.') < 0)
         { return nmbr; }

         resl = '0'+(resl.substr(resl.indexOf('.'), Proc.config.math.precision)).trimEnd('0');

         return (resl * 1);
      }
   });
// --------------------------------------------------------------------------------------------





// edit :: prot : object
// --------------------------------------------------------------------------------------------
   Edit(Object.prototype, Function.prototype)
   ({
      length:
      {
         trap:
         {
            get:function()
            { return Object.keys(this).length; }
         }
      }
   });
// --------------------------------------------------------------------------------------------





// edit :: prot : object
// --------------------------------------------------------------------------------------------
   Edit(Array.prototype, Object.prototype, Function.prototype)
   ({
      ordBy:function(list,kvon)
      {
         var self, tpos, resl, name, data;

         self = this;
         tpos = typeOf(self);
         kvon = (((kvon == KEYS) || (kvon == VALS)) ? kvon : Udf);
         kvon = ((kvon != Udf) ? kvon : (((tpos == Obj) || (tpos == Fnc)) ? KEYS : VALS));
         resl = ((tpos == Arr) ? [] : {});

         if (!isArr(list))
         { throw new TypeError('array expected'); }

         list.each = function(lk,lv)
         {
            name = ((tpos == Arr) ? lk : ((kvon == KEYS) ? lv : self.keysOf(lv)));
            data = ((kvon == KEYS) ? self[lv] : self[self.keysOf(lv)]);

            resl[name] = data;
         };

         return resl;
      },

      ordByKeys:function()
      {
         return this.ordBy(([].slice.call(arguments)), KEYS);
      },

      ordByVals:function()
      {
         return this.ordBy(([].slice.call(arguments)), VALS);
      },
   });
// --------------------------------------------------------------------------------------------





// edit :: prot : object
// --------------------------------------------------------------------------------------------
   Edit(Array.prototype, Object.prototype)
   ({
      with:function(defn)
      {
         var self, tpot, tpos, tpod, item, indx;

         self = this;
         tpos = typeOf(self);
         tpod = typeOf(defn);

         if ((tpos == Arr) && (tpod != Arr))
         {
            self[self.length] = defn;
            return self;
         }

         if ((tpod != Arr) && (tpod != Obj))
         { throw new TypeError('array or object expected'); }

         for (item in defn)
         { self[((tpos == Obj) ? item : self.length)] = defn[item]; }

         return self;
      }
   });
// --------------------------------------------------------------------------------------------





// edit :: prot : object
// --------------------------------------------------------------------------------------------
   Edit(String.prototype, Array.prototype, Object.prototype, Function.prototype)
   ({
   // -----------------------------------------------------------------------------------------
      keysAt:function()
      {
         var args, tpof, keys, resp, item, indx, span;

         args = ((arguments.length == 1) ? arguments[0] : [].slice.call(arguments));
         tpof = typeOf(args);
         args = (((tpof == Arr) || (tpof == Obj) || (tpof == Fnc)) ? args : [args]);
         keys = Object.keys(this);
         resp = [];

         for (item in args)
         {
            if (keys[(args[item])] != undefined)
            { resp[resp.length] = keys[(args[item])]; continue; }

            for (indx in keys)
            {
               if (args[item] === keys[indx])
               { resp[resp.length] = indx; }
            }
         }

         span = resp.length;

         return ((span > 1) ? resp : ((span == 1) ? resp[0] : undefined));
      },
   // -----------------------------------------------------------------------------------------


   // -----------------------------------------------------------------------------------------
      keysOf:function()
      {
         var args, tpof, resp, item, name, span;

         args = ((arguments.length == 1) ? arguments[0] : [].slice.call(arguments));
         tpof = typeOf(args);
         args = (((tpof == Arr) || (tpof == Obj) || (tpof == Fnc)) ? args : [args]);
         resp = [];

         for (item in args)
         {
            for (name in this)
            {
               if(!this.hasOwnProperty(name))
               { continue; }

               if (args[item] === this[name])
               { resp[resp.length] = name; }
            }
         }

         span = resp.length;

         return ((span > 1) ? resp : ((span == 1) ? resp[0] : undefined));
      },
   // -----------------------------------------------------------------------------------------


   // -----------------------------------------------------------------------------------------
      has:function(find,anal,kvon)
      {
         var tpot, tpof, tpol, self, sitm, fitm, slen, flen, nmbr;

         tpot = typeOf(this);
         tpof = typeOf(find);

         self = ((tpot != Str) ? this : this.toString());
         find = ((tpof == Arr) ? find : [find]);

         slen = self.length;
         flen = find.length;

         anal = (((anal == ANY ) || (anal == ALL )) ? anal : ANY);
         kvon = (((kvon == KEYS) || (kvon == VALS)) ? kvon : Emt);
         kvon = ((kvon != Emt) ? kvon : (((tpot == Obj) || (tpot == Fnc)) ? KEYS : VALS));

         nmbr = 0;

         for (fitm in find)
         {
            if (tpot == Str)
            {
               if (self.indexOf(find[fitm]) > -1)
               { nmbr++; }

               continue;
            }

            if ((kvon === KEYS) && ((tpot == Obj) || (tpot == Fnc)))
            {
               if (self.hasOwnProperty(find[fitm]))
               { nmbr++; }

               continue;
            }

            for (sitm in self)
            {
               if ((kvon === KEYS) && (sitm === find[fitm]))
               { nmbr++; continue; }

               if ((kvon === VALS) && (find[fitm] === self[sitm]))
               { nmbr++; }
            }
         }

         if (nmbr < 1)
         { return false; }

         if (anal == ANY)
         { return true; }

         if (nmbr === flen)
         { return true; }

         return false;
      },
   // -----------------------------------------------------------------------------------------


   // -----------------------------------------------------------------------------------------
      hasAny:function(find,kvon)
      { return this.has(find,ANY,kvon); },
   // -----------------------------------------------------------------------------------------
      hasAll:function(find,kvon)
      { return this.has(find,ALL,kvon); },
   // -----------------------------------------------------------------------------------------


   // -----------------------------------------------------------------------------------------
      hasKey:function(find)
      { return this.has(find,ANY,KEYS); },
   // -----------------------------------------------------------------------------------------
      hasAnyKeys:function(find)
      { return this.has(find,ANY,KEYS); },
   // -----------------------------------------------------------------------------------------
      hasAllKeys:function(find)
      { return this.has(find,ALL,KEYS); },
   // -----------------------------------------------------------------------------------------


   // -----------------------------------------------------------------------------------------
      hasVal:function(find)
      { return this.has(find,ANY,VALS); },
   // -----------------------------------------------------------------------------------------
      hasAnyVals:function(find)
      { return this.has(find,ANY,VALS); },
   // -----------------------------------------------------------------------------------------
      hasAllVals:function(find)
      { return this.has(find,ALL,VALS); },
   // -----------------------------------------------------------------------------------------


   // -----------------------------------------------------------------------------------------
      drop:function(list,kvon)
      {
         var self, resl, tpos, tpor, name;

         self = this;
         tpos = typeOf(self);
         tpor = tpos;
         list = (isArr(list) ? list : [list]);
         kvon = (((kvon == KEYS) || (kvon == VALS)) ? kvon : Udf);
         kvon = ((kvon != Udf) ? kvon : (((tpos == Obj) || (tpos == Fnc)) ? KEYS : VALS));

         if (tpos == Str)
         {
            if (kvon == KEYS)
            {
               self = self.split('');
               tpos = Arr;
            }
            else
            { resl = self; }
         }
         else
         { resl = ((tpos == Arr) ? [] : {}); }


         list.each = function(lk,lv)
         {
            if ((tpos == Str) && (kvon == VALS))
            { resl = resl.split(lv).join(''); return; }

            self.each = function(sk,sv)
            {
               if ((kvon == KEYS) && (lv == sk) && (typeOf(lv) == typeOf(sk)))
               { return; }

               if ((kvon == VALS) && (lv === sv))
               { return; }

               name = ((tpos == Arr) ? resl.length : sk);

               resl[name] = sv;
            };
         };

         if ((tpor == Str) && (tpos == Arr))
         { resl = resl.join(''); }

         return resl;
      },
   // -----------------------------------------------------------------------------------------
      dropKeys:function()
      {
         return this.drop(([].slice.call(arguments)), KEYS);
      },
   // -----------------------------------------------------------------------------------------
      dropVals:function()
      {
         return this.drop(([].slice.call(arguments)), VALS);
      },
   // -----------------------------------------------------------------------------------------
   });
// --------------------------------------------------------------------------------------------





// edit :: prot : object
// --------------------------------------------------------------------------------------------
   Edit(Boolean.prototype, Number.prototype, String.prototype, Array.prototype, Object.prototype, Function.prototype)
   ({
   // -----------------------------------------------------------------------------------------
      wrapIn:function(text)
      {
         var self = (isStr(this) ? this.toString() : this);
         var resp = {};

         resp[text] = self;

         return resp;
      },
   // -----------------------------------------------------------------------------------------


   // -----------------------------------------------------------------------------------------
      is:function(args,test)
      {
         var tpoi, self, nmbr;

         test = (test || ANY);
         tpoi = (((test == ANY) || (test == TPO)) ? typeOf(this) : typeIn(this));
         self = ((tpoi != Str) ? this : this.toString());
         nmbr = 0;

         args.each = function(k,v)
         {
            if (test === ANY)
            { nmbr = ((self === v) ? (nmbr+1) : nmbr); return; }

            if (test === TPO)
            { nmbr = ((tpoi === typeOf(v)) ? (nmbr+1) : nmbr); return; };

            if (test === TPI)
            { nmbr = ((tpoi === typeIn(v)) ? (nmbr+1) : nmbr); };
         };

         return ((nmbr > 0) ? true : false);
      },

      isANY:function()
      { return this.is([].slice.call(arguments), ANY); },

      isTPO:function()
      { return this.is([].slice.call(arguments), TPO); },

      isTPI:function()
      { return this.is([].slice.call(arguments), TPI); },
   // -----------------------------------------------------------------------------------------
   });
// --------------------------------------------------------------------------------------------





// edit :: prot : String
// --------------------------------------------------------------------------------------------
   Edit(String.prototype,Array.prototype,Object.prototype,Function.prototype)
   ({
      trim:function(list,bore)
      {
         var tpot, self, resl, tpoi, expr, args;

         tpot = typeOf(this);
         self = ((tpot != Str) ? this : [this.toString()]);
         bore = (!bore ? AUTO : (bore.isAny(BGN, END, AUTO) ? bore : AUTO));
         list = (!list ? [''] : (isArr(list) ? list : [(list)]));

         list.each = function(lk,lv)
         {
            tpoi = typeOf(lv);

            if (tpoi == Str)
            {
               expr = ((lv === '') ? '\\s\\uFEFF\\xA0' : RegExp.escape(lv));
               expr = ((bore == BGN) ? '^['+expr+']+' : ((bore == END) ? '['+expr+']+$' : '^['+expr+']+|['+expr+']+$'));
            }

            self.each = function(sk,sv)
            {
               if (!isStr(sv))
               { return; }

               if (tpoi == Str)
               { self[sk] = sv.replace(new RegExp(expr, 'g'),''); return; }

               if (tpoi == Num)
               {
                  args = [((bore != END) ? lv : 0), ((bore != BGN) ? (sv.length - lv) : sv.length)];
                  self[sk] = sv.slice(args[0], args[1]);
               }
            };
         };

         return ((tpot != Str) ? self : self.join(''));
      },

      trimBgn:function(list)
      { return this.trim(list,BGN); },

      trimEnd:function(list)
      { return this.trim(list,END); },
   });
// --------------------------------------------------------------------------------------------
