let CloneInfo = ng.core.Component({
  selector: 'clone-info',
  templateUrl: '/views/clone-info.html',
  inputs:[
    'info'
  ]
})
.Class({
  constructor: [function(){
    this.info = null;
    this.dialog;
  }],
  show: function(triggerElementId, popupElementId){
    var triggerElement = document.getElementById(triggerElementId);
    var popupElement = document.getElementById(popupElementId);
    this.dialog = leonardoui.popover({
      content: popupElement,
      shadow: true,
      closeOnEscape: false,
      dock: "bottom",
      alignTo: triggerElement
    });
  },
  close: function(){
    this.dialog.close();
    this.dialog = null;
  }
});
