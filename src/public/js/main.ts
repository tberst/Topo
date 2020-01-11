$(document).ready(function () {
  // Place JavaScript code here...
  topoRouteInstance.saveRun = function():void{
    var date = $("#date").val();
    var score = $("#score").val();
    var comment = $("#comment").val();
    var href = location.href;
    $.post(href, {
      date: date,
      score: score,
      comment: comment
    }, function (result) {
      window.location.href = result;
    })
  };

  topoRouteInstance.deleteRun = function(runId:string):void{
    var date = $("#date").val();
    var score = $("#score").val();
    var comment = $("#comment").val();
    var href = location.href+"/" +runId;
    $.ajax({
      url: href,
      type: 'DELETE',
      success: function(result) {
        window.location.href = result;
      }});
  }
});


function toggleNavbar(collapseID: string) {
  document.getElementById(collapseID).classList.toggle("hidden");
  document.getElementById(collapseID).classList.toggle("bg-white");
  document.getElementById(collapseID).classList.toggle("m-2");
  document.getElementById(collapseID).classList.toggle("py-3");
  document.getElementById(collapseID).classList.toggle("px-6");
}

var topoRouteInstance: any = {};
