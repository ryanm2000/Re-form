// Concatinate and replicate fields
(function() {
  "use strict";

    function getSourceFields (replicateGroup) {
      return $('[data-replicate-source='+replicateGroup+']');
    }

    function getDestinationField (replicateGroup) {
      return $('[data-replicate-destination='+replicateGroup+']').first();
    }

    function generateValue (sourceFields) {
      var vals = '';
      sourceFields.each(function(){
        vals = vals + $(this).val();
      });
      return vals;
    }

    function fieldAdvance(currentField) {
      if(!currentField.is(':last-child')) {
        currentField.next().focus();
      }
    }


    function copyToDestination (value, destinationField) {
       destinationField.val(value)
    }

    function init () {
      $('[data-replicate-destination]').each(function() {
        var replicateGroup = $(this).attr('data-replicate-destination'); // Unique name for group
        // Cache sourceFields
        var sourceFields = getSourceFields(replicateGroup);

        // Wire up keypress and keyup events
        sourceFields.keypress(function(e) {
          var that = $(this);
          if (that.val().length+1 == that.attr('maxlength') && e.which !== 0) {
            fieldAdvance(that); // Advance to the next field
          }
        }).keyup(function() {
          copyToDestination(
            generateValue(sourceFields),
            getDestinationField(replicateGroup)
          ); // Copy text to the destination field
        });
      })
    }

  // If we are have replicate-destination present
  if($('[data-replicate-destination]').length) {
    init();
  }

}());