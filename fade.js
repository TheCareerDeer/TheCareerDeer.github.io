 $(document).ready(function() {
      $("a").click(function(event){
          event.preventDefault();
          linkLocation = this.href;  
         $('.block-job').addClass('fadeOutDown').delay(3000).queue(function(){
           window.location = linkLocation;
        });
      });
    });