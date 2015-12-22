
// mode :: strict
// --------------------------------------------------------------------------------------------
   "use strict";
// --------------------------------------------------------------------------------------------





// func :: std output, exit & halt
// --------------------------------------------------------------------------------------------
   Object.defineProperties
   (
      global,
      (
         function(resl,list,item)
         {
            resl = {};

            list = // Obj
            {
               stdLog:function()
               { console.log.apply(null,([].slice.call(arguments))); },

               stdOut:function(data)
               { process.stdout.write(data); },

               stdErr:function(text)
               { process.stderr.write(text + '\n'); },

               Exit:function(code)
               { process.exit((code || 0)); },

               Fail:function(mesg)
               {
                  stdLog(mesg);
                  Exit(1);
               },

               Dbug:function(cond)
               {
                  return function(mesg)
                  {
                     if (this.cond === true)
                     { Fail('debug :: '+mesg); }
                  }.bind({cond:cond});
               },
            };

            for (item in list)
            {
               resl[item] = // Obj
               {
                  writable:false,
                  enumerable:false,
                  configurable:false,

                  value:list[item]
               };
            }

            return resl;
         }()
      )
   );
// --------------------------------------------------------------------------------------------





// prot :: with : binds object to function & assign keys for external reference
// --------------------------------------------------------------------------------------------
   Object.defineProperty
   (
      Function.prototype, 'with',
      {
         writable:false,
         enumerable:false,
         configurable:false,

         value:function(arg)
         {
            var attr = {};

            for (var itm in arg)
            { attr[itm] = arg[itm]; }

            attr = this.bind(attr);

            for (var itm in arg)
            { attr[itm] = arg[itm]; }

            return attr;
         }
      }
   );
// --------------------------------------------------------------------------------------------





// func :: copyOf : creates a new copy of a variable
// --------------------------------------------------------------------------------------------
   Object.defineProperty
   (
      global, 'copyOf',
      {
         writable:false,
         enumerable:false,
         configurable:false,

         value:function(src,cir)
         {
         	var pind, desc, keys, cur, nsrc, idx,
         		copies = [{source: src, target: Object.create(Object.getPrototypeOf(src))}],
         		result = copies[0].target,
         		srcref = [src],
         		tgtref = [result];

         	while (cur = copies.shift())
         	{
         		keys = Object.getOwnPropertyNames(cur.source);

         		for (pind = 0; pind < keys.length; pind ++)
         		{
         			desc = Object.getOwnPropertyDescriptor(cur.source, keys[pind]);

         			if (!desc.value || typeof desc.value !== Obj)
         			{
         				Object.defineProperty(cur.target, keys[pind], desc);
         				continue;
         			}

         			nsrc = desc.value;
         			desc.value = Array.isArray(nsrc) ? [] : Object.create(Object.getPrototypeOf(nsrc));

         			if (cir)
         			{
         				idx = srcref.idx(nsrc);

         				if (idx !== -1)
         				{
         					desc.value = tgtref[idx];
         					Object.defineProperty(cur.target, keys[pind], desc);
         					continue;
         				}

         				srcref.push(nsrc);
         				tgtref.push(desc.value);
         			}

         			Object.defineProperty(cur.target, keys[pind], desc);

         			copies.push({source: nsrc, target: desc.value});
         		}
         	}

         	return result;
         }
      }
   );
// --------------------------------------------------------------------------------------------





// func :: typeOf : extended variable-type identification with global type-constants & `is` Fnc
// --------------------------------------------------------------------------------------------
   Object.defineProperty
   (
      global, 'typeOf',
      {
         writable:false,
         enumerable:false,
         configurable:false,

         value:function(data)
         {
            if (data === null)
            { return 'empty';  }

            return (({}).toString.call(data).match(/\s([a-zA-Z]+)/)[1].toLowerCase());
         }
         .with
         (
            (function(resl,item,defn,prop)
            {
               resl = // Obj
               {
                  list:
                  {
                     Arr:'array',
                     Bln:'boolean',
                     Dom:'element',
                     Emt:'empty',
                     Fnc:'function',
                     Glo:'global',
                     Num:'number',
                     Obj:'object',
                     Str:'string',
                     Udf:'undefined',
                  },
               },

               prop = // Obj
               {
                  writable:false,
                  enumerable:false,
                  configurable:false,
               };

               for (item in resl.list)
               {
                  defn = {};

                  defn[item] = copyOf(prop);
                  defn[item].value = resl.list[item];

                  defn[('is'+item)] = copyOf(prop);
                  defn[('is'+item)].value = function(data)
                  {
                     return ((typeOf(data) === this.data) ? true : false);
                  }
                  .with
                  ({
                     data:resl.list[item]
                  });

                  Object.defineProperties(global, defn);
               }

               return resl;
            }())
         )
      }
   );
// --------------------------------------------------------------------------------------------






// func :: Edit : prototypes, objects, functions
// --------------------------------------------------------------------------------------------
   Object.defineProperty
   (
      global, 'Edit',
      {
         writable:false,
         enumerable:false,
         configurable:false,

         value:function()
         {
            return function(spec)
            {
               var list, name, item, defn, tpof, text, meta=false, trap=false;

               if (typeOf(spec) != Obj)
               {
                  throw new TypeError('object expected');
                  return;
               }

               for (name in spec)
               {
                  if(!spec.hasOwnProperty(name))
                  { continue; }

                  tpof = typeOf(spec[name]);
                  defn = {};


                  if (spec[name].meta)
                  {
                     meta = true;

                     if (((tpof == Fnc) || (tpof == Obj)) && isObj(spec[name].meta.trap))
                     { trap = true; }
                  }


                  for (item in this.conf)
                  {
                     if(!this.conf.hasOwnProperty(item))
                     { continue; }

                     text = Object.keys(this.conf[item])[0];

                     if ((tpof == Obj) && isObj(spec[name].conf) && (item in spec[name].conf))
                     { defn[text] = spec[name].conf[item]; continue; }

                     defn[text] = this.conf[item][text];
                  }


                  if (!trap)
                  { defn.value = spec[name]; }

                  if (trap)
                  {
                     if (spec[name].trap.try)
                     {
                        if (!('Proxy' in global))
                        { throw new Error('global: `Proxy` is required'); }

                        spec[name].trap.got = (spec[name].trap.get || function(){});
                        spec[name].trap.get = function(tgt,nme)
                        {
                           var rsp = undefined;

                           rsp = spec[name].trap.got(tgt,nme);

                           if (rsp !== undefined)
                           { return rsp; }

                           rsp = tgt[nme];

                           if (rsp !== undefined)
                           { return rsp; }

                           spec[name].trap.try = spec[name].trap.try.bind(tgt);

                           return function()
                           { return spec[name].trap.try(nme, [].slice.call(arguments)); };
                        };

                        defn.value = new Proxy(spec[name], spec[name].trap);
                     }
                     else
                     {
                        for (item in spec[name].trap)
                        {
                           if(!spec[name].trap.hasOwnProperty(item))
                           { continue; }

                           defn[item] = spec[name].trap[item];
                        }

                        if (Object.keys(spec[name]).length > 1)
                        { defn.value = spec[name]; }
                        else
                        {
                           delete(defn.writable);

                           if (defn.hasOwnProperty('get') && !defn.hasOwnProperty('set'))
                           {
                              defn.set = function(data)
                              {
                                 if (this.meta)
                                 { this.meta.value = data; return; }

                                 Object.defineProperty
                                 (
                                    this,'meta',
                                    {
                                       writable:true,
                                       configurable:true,
                                       enumerable:false,
                                       value:{value:data},
                                    }
                                 );
                              };
                           }

                           if (defn.hasOwnProperty('set') && !defn.hasOwnProperty('get'))
                           {
                              defn.get = function()
                              {
                                 if (this.meta)
                                 { return this.meta.value; }

                                 Object.defineProperty
                                 (
                                    this,'meta',
                                    {
                                       writable:true,
                                       configurable:true,
                                       enumerable:false,
                                       value:{value:undefined},
                                    }
                                 );
                              };
                           }
                        }

                     }
                  }

                  tpof = typeOf(defn.value)

                  for (item in this.list)
                  {
                     Object.defineProperty(this.list[item], name, defn);

                     if (((tpof == Fnc) || (tpof == Obj)) && (this.list[item][name].hasOwnProperty('init')))
                     { this.list[item][name].init(); }
                  }
               }
            }
            .with
            ({
               list:arguments,
               defn:this.defn,
               conf:this.conf,
            });
         }
         .with
         ({
            meta: {self:1, conf:1, trap:1, init:1},
            conf:
            {
               edit: {writable:false},
               enum: {enumerable:false},
               conf: {configurable:false},
            },
         })
      }
   );
// --------------------------------------------------------------------------------------------





// func :: Name : globals
// --------------------------------------------------------------------------------------------
   Edit(global)
   ({
   // -----------------------------------------------------------------------------------------
      Name:function(list,data)
      {
         if (isStr(list))
         { list = data.wrapIn(list); }

         if (!isObj(list))
         { throw new TypeError('object expected'); return; }

         Edit(global)(list);
      },
   // -----------------------------------------------------------------------------------------
   });
// --------------------------------------------------------------------------------------------




/*





// name :: process : path
// --------------------------------------------------------------------------------------------
   process.path = // Obj
   (
      function(resl)
      {
         resl = require('fs');

         resl.self = (__filename.split('/proc/')[0]);
         resl.exec = process.cwd();

         return resl;
      }()
   );
// --------------------------------------------------------------------------------------------





// name :: process : args
// --------------------------------------------------------------------------------------------
   process.args = // Arr
   (
      function(resl)
      {
         resl = process.argv;

         resl.shift();
         resl.shift();

         return resl;
      }()
   );
// --------------------------------------------------------------------------------------------





// name :: Proc : global
// --------------------------------------------------------------------------------------------
   Name
   ({
      Proc:
      {
         path:
         {
            self:process.path.self,
            exec:process.path.exec,
         },

         cmnd:
         {
            info:function(defn)
            {

            },

            dmon:function(defn)
            {

            },

            clio:function(defn)
            {

            },
         },

         args:
         {

         }
      }
   });
// --------------------------------------------------------------------------------------------





// load :: proc : init
// --------------------------------------------------------------------------------------------
   (
      function(path,list,item)
      {
         path = process.path.self+'/proc/init/';
         list = process.path.readdirSync(path);

         for (item in list)
         {
            if (list.hasOwnProperty(item))
            { require(path+list[item]); }
         }
      }()
   );
// --------------------------------------------------------------------------------------------





// name :: proc
// --------------------------------------------------------------------------------------------
   Name
   ({
      Proc:
      (
         function(path,resl,list,item)
         {
            resl = // Obj
            {
               path:
               {
                  self:process.path.self,
                  self:process.path.exec,
               }
            };

            list = ['init', 'info', 'util'];
         }()
      )
   });
// --------------------------------------------------------------------------------------------
*/
