/**
 *  WizardTabs Plugin 0.2
 *
 *  Copyright 2011,
 *  Author: Bruno Felix, White Road Software
 *  Licenced under the MIT license.
 *  http://www.opensource.org/licenses/mit-license.php
 *
 *  Depends:
 *    jquery.ui.tabs
 *    jquery.ui.button
 *  */
(function($){
  $.widget("ui.WizardTabs", {
    
    /**
     * The widget comes with some sensible defaults that allow it to be used
     * without any further config.     
     **/
    options:{
        prevLabel: "Previous",
        nextLabel: "Next",
        submitLabel: "Submit",
        defaultPrevIcon: "ui-icon-circle-arrow-w",
        defaultNextIcon: "ui-icon-circle-arrow-e",
        defaultSubmitIcon: "ui-icon-circle-check",
        endActionEnabled: true,
        submitAction: function(){ alert("Please remember to set the submit action."); }    
    },
    
    /**
     * Instance variables
     */
    sufix:"",
    buttonSize: 0,
    
    _create: function(){
      var $baseElem = $(this.element);
      this.sufix = Math.ceil(Math.random()*2048);
      
      var links = [];
      $baseElem.find("ul:first li a").each(function() {
        links.push($(this));
      });
      
      var $prev = null;
      
      var length = links.length;
      for (var i = 0; i < length; i++) {
        var leftId = "btnContainerLeft" + i + this.sufix;
        var rightId = "btnContainerRight" + i + this.sufix;
        var $baseDiv = $(links[i].attr("href"));
        $baseDiv.css("overflow-y", "auto");
      
        //Depending if the height is fixed, the buttons are absolutelly positioned.
        if(this.options.height !== undefined){
          $baseDiv.append("<div style='position: absolute; bottom: 10px; width: 95%; text-align:center; margin:auto;'><hr/><div id='"+leftId+"' style='float:left;text-align:left; padding:10px;'></div><div id='"+rightId+"' style='float:right;text-align:right; padding:10px;'></div></div>");
        }else{
          $baseDiv.append("<div style='text-align:center; margin:auto;'><hr/><div id='"+leftId+"' style='float:left;text-align:left; padding:10px;'></div><div id='"+rightId+"' style='float:right;text-align:right; padding:10px;'></div></div>");
        }
      
        var $containerLeft = $("#" + leftId);
        var $containerRight = $("#" + rightId);
        if (i > 0) {
          this._generatePrevBtn($prev, $containerLeft);
        }
      
        if (i < length - 1) {
          var $next = links[i + 1];
          this._generateNextBtn($next, $containerRight);
        }
      
        if(this.options.endActionEnabled){
          if (i == length - 1) {
            this._generateSubmit($containerRight);
          }
        }
      
        //TODO: Use the clearfix technique instead of this.
        $prev = links[i];
        $containerLeft.parent().append("<div style='clear: both;'></div>");
        $containerRight.parent().append("<div style='clear: both;'></div>");
      
        if(this.buttonSize == 0){
          this.buttonSize = parseInt($containerRight.css("font-size"), 10) * 5;
        }
      //If the container height is fixed, then we cannot exceed it, so we trim the content divs.
        if(this.options.height !== undefined){
          //TODO: be careful - the value of 2 * buttonsite may not be correct!
          var reduced = Math.abs(this.options.height - (2*this.buttonSize));
          $baseDiv.height(reduced);
        }
      }
      
      $baseElem.tabs();
      //Setting height for the whole container.
      if(this.options.height !== undefined){
        $baseElem.height(this.options.height);
      }
      /*
        else{
        $baseElem.height(_getMaxHeight($baseElem, this.buttonSize));
        }
      */
      },
        /**
         * Resizes the container divs (if its size is not set by the user) and the
         * divs that have the content in order to accomodate larger buttons.         
         **/
      resize: function(){
        var $baseElem = $(this.element);
          var newBtnSize = 0;
          var dif = 0;
          var links = [];
          $baseElem.find("ul li a").each(function() {
              links.push($(this));
          });

          var $prev = null;
          var length = links.length;
          for (var i = 0; i < length; i++) {
            var $baseDiv = $(links[i]);
            
            //find out the current font-size for the buttons.
            if(newBtnSize == 0){
              newBtnSize = parseInt($('#btnContainerRight' + i + this.sufix).css("font-size"), 10) * 5;
              dif = newBtnSize - this.buttonSize;
            }
            
            //If the container height is fixed, then we cannot exceed it, so we trim the content divs.
            if(this.options.height !== undefined){
              var reduced = Math.abs($baseDiv.height() + dif);
              $baseDiv.height(reduced);
            }
          }
          
          /*if(this.options.height === undefined){
            $baseElem.height(_getMaxHeight($baseElem, dif));
          }*/
          this.buttonSize = newBtnSize;
    },
    _generateNextBtn: function($next, $container){
        this._generateButton($container , this.options.defaultNextIcon, this.options.nextLabel, function(){ $next.trigger("click"); });
    },
    _generatePrevBtn: function($prev, $container){
        this._generateButton($container , this.options.defaultPrevIcon, this.options.prevLabel, function(){ $prev.trigger("click"); });
    },
     _generateSubmit:function($container){
        this._generateButton($container , this.options.defaultSubmitIcon, this.options.submitLabel, this.options.submitAction);
    },
    _generateButton: function($container, iconClass, text, action){
        var genId = "wizardBtn" + Math.floor(Math.random()*2048);
        var $button = $("<div id='"+genId+"'>"+text+"</div>");
        $button.button({icons:{primary: iconClass}}).click(function(){action.apply(this);});
        $container.append($button);
    },   
    destroy: function() {
      $.Widget.prototype.destroy.apply(this, arguments); // default destroy
    }
  });  
})(jQuery);