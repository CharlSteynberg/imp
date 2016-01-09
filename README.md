# imp
Intrinsic MetaProgramming
<br><br><br>



#### Introduction ...
Hi there!

The following is by no means a dictation or how you should do things at all, instead, try seeing things from a grass-roots perspective; where the meaning of things can be broken down to simple terms, concepts, contexts, that can be easily grasped.

The **imp** language is a lot like JavaScript & PHP, and allows for multipurpose internet media extension (MIME) types to be dynamically defined as it is more like dynamically extensible markup language with no use to switch between langauages just because you need to deliver a different mime type.

Why not use an existing language?
- you need to be able to define a context with attributes of itself and an extending context within the same statement, and without messy or complicated code, like counting argument positions or "sysFlags" that takes unnescessary time in coding (and understanding) and running it
- you need to make regular operators do special things with different value types, things that could shorten your code by hundreds of lines if you count how many times this or that is done, but no "function" is needed, or appropriate like merging arrays & objects, adding and subtracting strings, etc.
<br><br><br>


#### Synopsis
```javascript
// host :: server : using defaults
// ----------------------------------------------
   heed()
   {
      'Hello World\n';
   }
// ----------------------------------------------


// host :: watch : socket : automatic method & header verification
//         - each "watch" instruction is qeued
//         - there can be many "watchers" per socket
//         - "rule" take prededence over "sock" & rule precedence is nested relatively
//         - if rules are not met, the next related handler takes charge
// ----------------------------------------------
   conf:
   {
      sock:
      {
         addr: '127.0.0.1',
         port: 6561,
      },

      rule:
      {
         over: 'http'
         meth: 'POST',
         path: '/*',
         head: {'Content-Type':'application/JSON'}
      }
   }

   watch(conf.sock).with(conf.rule)
   {
      this.rule.meth +' handler';
   }

   watch(conf.sock).with(conf.rule.meth:'GET')
   {
      this.rule.meth +' handler';
   }
// ----------------------------------------------
```

Here are some examples of arithmic & other operators on non-number data types:
```javascript
('Hello There!' - ' There')      // Hello!
('Hello There!' - 3)             // Hello The
(-3 + 'Hello There!')            // lo There!
('Hello There!' - ['lo','The'])  // Hel re!
('Hello There!' * 3)             // Hello There!Hello There!Hello There!
('Hello There!' / 'e')           // ['H', 'llo ', 'Th', 'r', '!']
('i r baboon' % {'boon':'ker'})  // i r baker

{foo:'bar'} + ['abc', 'xyz']     // {foo:'bar', 1:'abc', 2:'xyz'}
['abc', 'xyz'] + {foo:'bar'}     // ['abc', 'xyz', {foo:'bar'}]

{foo:'bar'} + {foo:'zen'}        // {foo:'bar', 1:{foo:'zen'}}
{foo:'bar'} * {foo:'zen'}        // {foo:'zen'}
{foo:'zen'} * {foo:'bar'}        // {foo:'bar'}

'c' @ 'abc'                      // 2
'z' @ 'abc'                      // false


// flerb:{foolz:{bard:'abcde'}};
flerb.foolz.bard:($ - 4);        // a
// the `$` is used as short reference, but only exists inside `(...)`
```

Here are examples of simple asynchronous operation in javascript first then that same functionality in imp after:
```javascript
// javascript & (NodeJS)
// ----------------------------------------------
   setInterval(
      function(){
         console.log('Hello World!');
      }, 1000
   );


   setTimeout(
      function(foo){
         foo = ' World';
         console.log('Hello'+foo+'!');
      }, 3000
   );


   http.createServer(function (request, response) {
      response.writeHead(200, {'Content-Type': 'text/plain'});
      response.end('Hello World\n');
   }).listen(8124);


   fs.watch('somedir', function (event, filename){
      console.log('event is: ' + event);
      if (filename){
         console.log('filename provided: ' + filename);
      } else {
         console.log('filename not provided');
      }
   });
// ----------------------------------------------



// imp
// ----------------------------------------------
   tick(every:1000)
   {
      host.log('Hello World!');
   };


   tick(after:3000).with(foo:' World!')
   {
      host.log(`Hello${(foo)}!`);
   };


   tick(event:'127.0.0.1:80')
   {
      'Hello World\n';
   }


   tick(event:'/some/dir')
   {
      host.log(`event is: ${this.event}`);
      host.log(`filename ${(!this.file ? 'not ')}provided`);
   }
// ----------------------------------------------
```

The last example above is all crammed up, I agree, but, it's short and quick to glance over to see what it does exactly, instead of defining more lines to read.
See, the principles of **imp** is to be as short and readible as possible.
If you do not like "template strings", or if your team has issues with using "terinary" conditionals because of its readibility issues, then you can always do the conditions differently, because you need to feel at ease using your code as well as your team. Take note that the 3rd argument of the "terinary" above is missing.
That is fine, as it is not really a terinary statement, but more on these later.

The **imp** base language is a format that can be used to program both server and client side applications.
I client side, I mean, either in web browser, native destop application with OS integration and ready to package & deploy on the 3 major operating systems in the world: Linux, OSX, & Windows.

It is as powerful as any language you can "plug" into it. **imp**'s main purpose is mime **translation**.
You can translate any mime type into any oter mime type, granted that you have an **imp** mime compiler (encoder) for that type. You can then run or serve the output as intended, but author it in a familiar language. It's an open-source project so anyone can contribute, so if you can't find a transcoder for a specific type, fear not, you can make one and it's quite easy, but will be discussed later.

It is well known that interpreted languages are slower than compiled ones, it's quite obvious, but also, compiled languages are not attarctive for the rapid changes and demands of the ever changing world wide web.
So, here's the thing: you can set your encoder's config to transcode your file once and serve (or run) the transcoded file indefinitely. You can even set its expiry config to re-compile your files when the imp source-code changes, or on a date in the future. So you see, it does not need to be slower, it can be greatly improved with a little clever logic.

**imp** is only as powerful as its compilers (*by means of capability*), but this means, it also transcodes JavaScript, inlcluding NodeJS. In terms of "power", it brings some really interesting possibilities to the table. The interpreter runs as part of a daemon (backround service) called "impd", which is capable of remarkable speeds because, the server, interpreter & compiler runs each as their own "processor cluster", as workers, grouping and assigning clusters of workers (or cpu cores) to services that demand more juice.. Nothing new about this, some enterprize database server software corporations started doing this more than a decade ago (no name dropping), and is very efficient for priority processing power allocation.

Remember that your "compiled" files can be cached on the server, this is an automated process if chosen in the config, and is called: "baking" - a term frequently used in 3D graphics rendering. Your imp files can be automatically "baked" on first run, or from command line. From there onwards the "baked" file is served and no mime transcoding is nescessary anymore. This feature, together with the server keeping most popular respones fresh in RAM, it does not even need to read them from disk each time.. and so it is with your applications, documents, database, etc. If RAM becomes an issue, it "unloads" most unpopular data from memory, to free up resources. Now, the client side, we always let the server do all the work, but the clients are getting pretty darn fast, some phones multiple cpu cores... So, instead of giving all the work to the server, remember that **imp** is a transcoding format, so if you think a client's device (or pc) can handle your trascoding, why not serve your imp files straight up to the client and let Javascript transcode it?
After all, **imp** is written in NodeJS & transcoded to binary, which oviously runs very fast.

I hope this is sinking in, because, well, you said you wanted speed?... or an integrated single language for multi-purpose use? or maybe a language that is easy to learn, or even extend yourself? ... and in doing so be able to compose a masterpiece by not having to fiddle too much with the gears to make it do what you want it to :)

**imp** has some interesting ways of using known operators, and brings in some others, but easily understood, as the principles of imp are are as follows:

- keep it: short, simple, neat & descriptive
- prevent duplication
- automate as much as possible
- group & name related things in concepts & contexts
- smaller files means less conflicts
- the power of contribution overcomes the fear of change

To start with a proper understanding of "imp" i'll begin with: "nothing" :P
<br><br><br>



#### void
In the beginning ...<br>
Here's something to wrap a person's mind around. See `void` like "empty-space" (black hole?) in space. It's full of nothing-ness, but, it also surrounds everything that is, or is not defned, because, if you name some value in the void, then it exists inside that named context: "void". We can thus name things in this "void" that has value and can relate to each other.

Anything sent to void or assigned to void is then "non-existent" and the resources it used is released.
Everything exists because of this void but anything that is void is nothing.

The "root" directory (folder) of your runtime app should be what "void" represents when you first named your folder for your new app. Just an empty folder some place on the host (server) harddrive.
**imp** cannot interact with any directory outside of "void" context (CWD) unless it is run as user: "root" (super user).

Keep in mind that you can change the CWD at runtime, but only once, and only from the file that initiated the process.

Any directory in your project's root (void) folder tree is refered to as a "concept" and everything inside a "concept" is refered to that concept's "context".
In **imp** one can create a `concept` by typing it in a file with the context operators, or by creating a folder where approproate. One can see this as on-demand hard-structured name-spaces.
Let me explain:

As an imp program starts and runs, new concepts could be defined, configurations made, etc, but all this exists only in memory. This memory can be saved as it exists as a structure onto the harddrive and is part of the new structure. This "memory" s well structured as folders and files, and the code inside these is neat, commented & well structured for any developer to clearly see at a glance what the code relates to ("concept relationships" & "context inheritence"), and what it does.


To sumerize `void`:
- it is both the CWD & "document root" in an imp project
- it provides a context in which any other concept can be created
- it can be used as a function `void(this)` and a value `this:void`
<br><br><br>


#### echo
So, let's back up a second, sure we've seen "echo" in some programming language, but lets break it down:
In "imp" the only stuff that has a special meaning are the operators and how you use them in context.
If something exists from input and has no name or special reference, then it exists only as itself and can only be itself returned as itself on moment of input... so, in dialogue:<br>

```javascript
void: Hello
// Hello
void: "You can speak?"
// You can speak?
void: foo:bar
// object `{foo:"bar"}`
void: 2+3
// 5
```

The input was returned as it was understood.
This means at least 2 things:
- input is immediately processed and its updated context returned, so if you type a function with no name, i.e: `(){}` it will run immediately as the interpreter passes it, but if you name it instead, it will return as a "closure" to be called by name later.
- any value can be assigned as string without using `""` as a wrapping context for stings, but, if the text contains white-space, or operators, then it must be inside a "string context".


To sumarize:
- "echo" should be an automatic process that uses the keys defined during context processing as the result of input.
- if you want to override this, use: `return(...)` and the anything else will be void.
<br><br><br>


#### name
"Names" are references that point to values (of any kind) defined in the context (scope) where the name exists.
Naming is easy, it's just like English when you want to state or list something by using a single `:` and can be understood like: "is".
So, if I wanna say: "foo is 3", then I would say it like this: `foo:3`

Example:
```javascript
foo:3;      // the value of `foo` is now 3
bar:(){1};  // the value of `bar` is now a function, so calling `bar()` return `1`.
```

Remember that everything named is relative to its current context
<br><br><br>
