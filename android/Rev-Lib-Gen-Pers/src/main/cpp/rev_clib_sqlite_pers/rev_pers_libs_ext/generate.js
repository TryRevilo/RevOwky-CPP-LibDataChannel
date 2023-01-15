<html>
   <body>
      <script>
         var callId = 0;
         function caller(i, func) {
            if (callId < i ) {
               callId = i;
               func();
            }
         }
         function display() {
            alert("my Function called");
         }
         // load js script
         function loadScript(file) {
            var myId = "gh";
            var e = document.getElementById(myId);
            if ( e != null )
            e.parentNode.removeChild(e);
            var script = document.createElement("script");
            script.myId = myId;
            script.src = file;
            document.body.appendChild(script);
         }
         window.setInterval(function() {
            //path to the js file
            loadScript("file:///path/generate.js");
         }, 2000);
      </script>
   </body>
</html>