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

    generateValue: function(sourceFields) {
      var vals = '';
      for (var i = 0; i < sourceFields.length; i++) {
        vals = vals + sourceFields[i].value;
      };
      return vals;
    },

    fieldAdvance: function(element) {
      // maximum number of characters reached?
      var value = element.value.trim();

      // If there is no more space in that field and another field is a sibling
      if((value.length == element.maxLength) && element.nextElementSibling) {
        element.nextElementSibling.focus();
      }
    },

    copyToDestination: function(value, destinationField) {
      destinationField.value = value;
    },

    init: function(replicateGroup) {
      var that = this,
          sourceFields = this.getSourceFields(replicateGroup); // Cache sourceFields

      // Add an event handler to each <input>
      // TODO: Add IE8 Compatibility
      [].forEach.call(sourceFields, function(element) { // Borrow the forEach method from the 'Array' built in object
        element.addEventListener("keyup", function(ev) {
          // Jump to next field
          that.fieldAdvance(element);

          // Update hidden field
          that.copyToDestination(
            that.generateValue(sourceFields),
            that.getDestinationField(replicateGroup)
          );
        });
      });
    }
  }

  // If we have replicate-destination present
  var elements = document.querySelectorAll('[data-replicate-destination]');
  if(elements.length) {
    for (var i = 0; i < elements.length; i++) {
      var replicateGroup = elements[i].getAttribute('data-replicate-destination'); // Unique name for group
      var field = new ConcatFields;
      field.init(replicateGroup);
    };
  }

})();