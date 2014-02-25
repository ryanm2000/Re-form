(function() {
  "use strict";

  function ConcatFields() {
    this.sourceFields = false;
  }

  ConcatFields.prototype = {

    getSourceFields: function(replicateGroup) {
      return document.querySelectorAll('[data-replicate-source='+replicateGroup+']');
    },

    getDestinationField: function(replicateGroup) {
      return document.querySelector('[data-replicate-destination='+replicateGroup+']');
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

    copyToDestination: function(value, destinationField) {
      destinationField.value = value;
    },

    init: function(replicateGroup) {
      var that = this;

      this.sourceFields = this.getSourceFields(replicateGroup); // Cache sourceFields

      // Add an event handler to each <input>
      for (var i = 0, j = that.sourceFields.length; i < j; i++) {
        (function(i) {
          that.addEvent(that.sourceFields[i], 'keyup', function() {

            // Jump to next field
            that.fieldAdvance(that.sourceFields[i]);

            // Update hidden field
            that.copyToDestination(
              that.generateValue(that.sourceFields),
              that.getDestinationField(replicateGroup)
            );
          });
        })(i);
      }
    }
  }

  // If we have replicate-destination present
  var elements = document.querySelectorAll('[data-replicate-destination]');
  if(elements.length) {
    for (var i = 0, j = elements.length; i < j; i++) {
      var replicateGroup = elements[i].getAttribute('data-replicate-destination'); // Unique name for group
      var field = new ConcatFields;
      field.init(replicateGroup);
    };
  }

})();