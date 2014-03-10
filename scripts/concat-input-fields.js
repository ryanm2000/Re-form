(function() {
  "use strict";

  function ConcatFields() {
    this.sourceFields = [];
  }

  ConcatFields.prototype = {

    isSupportedBrowser: function() {
      return !(navigator.userAgent.match(/(iPod|iPhone|iPad)/) && navigator.userAgent.match(/AppleWebKit/))
    },

    getSourceFields: function(replicateGroup) {
      return document.querySelectorAll('[data-replicate-source='+replicateGroup+']');
    },

    addEvent: function(element, event, func) {
      if(element.addEventListener) {
        element.addEventListener(event, func);
      } else { // IE8
        element.attachEvent('on'+event, func);
      }
    },

    generateValue: function(sourceFields) {
      var vals = '';
      for (var i = 0, j = this.sourceFields.length; i < j; i++) {
        vals = vals + this.sourceFields[i].value;
      };
      return vals;
    },

    nextSibling: function(element) {
      var supported = !!document.getElementsByTagName('head')[0].nextElementSibling,
        next = (supported) ? 'nextElementSibling' : 'nextSibling';

      return function(element) {
        if(element[next]) {
          return element[next];
        } else {
          return null;
        }
      };
    }(),

    previousSibling: function(element) {
      var supported = !!document.getElementsByTagName('head')[0].nextElementSibling,
          previous = (supported) ? 'previousElementSibling' : 'previousSibling';

      return function(element) {
        if(element[previous]) {
          return element[previous];
        } else {
          return null;
        }
      };
    }(),

    fieldAdvance: function(element) {
      // maximum number of characters reached?
      var value = element.value,
          that = this;
      // If there is no more space in that field and another field is a sibling
      // TODO: Clean the following line up. It is a messy, messy hack
      // to fix 2 issues in IE8:
      //   1. nextSibling returns whitespace as the next sibling
      //   2. nextSibling will return true if there is *anything* next
      //      to it at all. So we need to check the tags. Its ugly.
      if( (value.length == element.maxLength) && (that.nextSibling(element)) && (that.nextSibling(element).tagName == 'INPUT' || that.nextSibling(element).tagName == 'TEXTAREA')) {
        that.nextSibling(element).focus();
      }
    },

    fieldRetreat: function(element) {
      var value = element.value,
          that = this;
      // TODO: See comment in fieldAdvance method
      // TODO: If the user presses backspace when there is nothing in the field, backspace from the previous field
      if( (value.length == 0) && (that.previousSibling(element)) && (that.previousSibling(element).tagName == 'INPUT' || that.previousSibling(element).tagName == 'TEXTAREA')) {
        var prevEl = that.previousSibling(element);
        prevEl.focus();
        prevEl.value = prevEl.value; // Hack for IE to place the cursor at the end of the field
      }
    },

    copyToDestination: function(value, destinationField) {
      destinationField.value = value;
    },

    init: function(destinationField) {
      var that = this;

      if(!that.isSupportedBrowser()) {
        return;
      }

      that.destinationField = destinationField; // Cache sourceField
      that.pattern = destinationField.getAttribute('data-replicate-pattern').split(','); // Cache desired pattern
      that.fieldType = destinationField.getAttribute('type') || 'text';

      // Create new fields based on pattern from destination field
      if(typeof this.pattern == "object") {
        var that = this,
            wrapper = destinationField.parentNode; // Determine where to put these new fields

        for (var i = 0; i < this.pattern.length; i++) {
          (function(i) {
            var inputEl = document.createElement('input');
            var newEl  = wrapper.appendChild(inputEl);

            // Update the sourceFields array
            that.sourceFields.push(newEl);

            newEl.setAttribute('maxlength', that.pattern[i]); // Set the appropriate maxlength
            newEl.setAttribute('type', that.fieldType); // Set the appropriate type

            // Set the original field to type hidden
            that.destinationField.setAttribute('type','hidden')

            that.addEvent(newEl, 'keyup', function(ev) {
              // TODO: If user enters a character on a field that is
              // already full, advance to the next field before entering it.

              if(ev.keyCode != 8) { // Key hit wasnt BACKSPACE
                // Jump to next field
                that.fieldAdvance(newEl);
              } else {
                that.fieldRetreat(newEl);
              }

              // Update hidden field
              that.copyToDestination(
                that.generateValue(that.sourceFields),
                that.destinationField
              );
            });
          })(i)
        };
      }
    }
  }

  // If we have replicate-destination present
  var elements = document.querySelectorAll('[data-replicate]');
  if(elements.length) {
    for (var i = 0, j = elements.length; i < j; i++) {
      var field = new ConcatFields;
      field.init(elements[i]);
    };
  }

})();