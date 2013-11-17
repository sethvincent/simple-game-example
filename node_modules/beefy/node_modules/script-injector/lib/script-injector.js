var trumpet = require('trumpet')
  , duplexer = require('duplexer')
  , through = require('through');

function scriptInjector (script) {
  var tr1 = trumpet()
    , tr2 = trumpet()
    , needToAddScript = true;

  script = script ? '<script type=\"text/javascript\">\n;(' + script + ')()\n<\/script>\n'
                  : ';(' + "function () { console.log('You didn\'t provide a script to inject') }" + ')()';

  var firstScriptTag = tr1.createStream('script', { outer: true });
  var bodyTag = tr2.createStream('body');

  firstScriptTag // Inject the new script before the first existing <script>
    .pipe(through(
      function (data) {
        if (needToAddScript) {
          this.queue(script);
          needToAddScript = false;
        }
        this.queue(data);
      }))
    .pipe(firstScriptTag);

  bodyTag // If there were no <script>'s, insert the script right before </body>
    .pipe(through(
      null,
      function () {
        if (needToAddScript) {
          this.queue(script);
        }
        this.queue(null);
      }))
    .pipe(bodyTag);

  tr1.pipe(tr2);

  return duplexer(tr1, tr2);
}

module.exports = scriptInjector;
