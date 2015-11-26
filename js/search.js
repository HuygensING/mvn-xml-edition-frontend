HI.Searchcontrol = {
  doQuery: function(){
    $('#results').html('');
    var query = $("input#q").val();
    var url = HI.backend_url+"/search";
    $.post(url, $.param({q: query}), function (results) {
      for (var i = 0; i < results.length; i++) {
        var r=results[i];
        var resultline = '<div class="result"><a href="VVEVMf'+r.id+'.html">folio '+r.id+':</a><div class="kwic">'+r.kwic.join('</div><div class="kwic">')+'</div>'+'</div>';
        $('#results').append(resultline);
      }
    }, 'json').done(function() {
    }).fail(function() {
      alert("Something went wrong, sorry!");
    });

  }
}