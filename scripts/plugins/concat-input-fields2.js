(function() {
  "use strict";

  function ConcatFields() {
    this.sourceFields = false;
  }

  ConcatFields.prototype = {

    getSourceFields: function(replicateGroup) {
      var one = document.querySelectorAll('[data-replicate-source='+replicateGroup+']');
      var two = $('[data-replicate-source='+replicateGroup+']');
      return two;
    },

    getDestinationField: function(replicateGroup) {
      return document.querySelector('[data-replicate-destination='+replicateGroup+']');
    },

    generateValue: function(sourceFields) {
      var vals = '';
      for (var i = 0; i < vals.length; i++) {
        vals = vals + vals[i].value;
      };
      /*sourceFields.each(function(){
          vals = vals + $(this).val();
      });*/
      return vals;
    },

    fieldAdvance: function(element) {
      // if(!currentField.is(':last-child')) {
      //     sourceFields[i+1].focus();
      // }

      // // do { el = el.nextSibling } while ( el && el.nodeType !== 1 )
      // return el
      // maximum number of characters reached?
      var value = element.value.trim();

      if(element.nextElementSibling && (value.length == element.maxLength)) {
        element.nextElementSibling.focus();
      }

    },

    copyToDestination: function(value, destinationField) {
      destinationField.value = value;
    },

    init: function(replicateGroup) {
      // Cache sourceFields
      var that = this,
          sourceFields = this.getSourceFields(replicateGroup);


      // Add an event handler to each <input>
      [].forEach.call(sourceFields, function(element) { // Borrow the forEach method from the 'Array' built in object
        element.addEventListener("keyup", function(ev) {
          that.fieldAdvance(element);
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