// =============================================================
// FILE: core_logic.js (or update your institution_data.js)
// =============================================================
window.FormHelpers = {
    CALCULATED_FIELDS: [],
    INPUT_FIELDS: [],

    // 1. THE DISCOVERY ENGINE
    // This scans the form for fields ending in _calculated
    discoverFields: function() {
        this.CALCULATED_FIELDS = [];
        this.INPUT_FIELDS = [];

        var self = this;
        $('[data-export]').each(function() {
            var key = $(this).attr('data-export');
            
            if (key.endsWith('_calculated')) {
                self.CALCULATED_FIELDS.push(key);
            } 
            // Add system fields or specific inputs that don't end in _calculated
            else if (key.startsWith('sys:') || !key.includes('_')) {
                self.INPUT_FIELDS.push(key);
            }
        });
        
        console.log("Auto-Discovered Calculated Fields:", this.CALCULATED_FIELDS);
    },

    // 2. UPDATED STATE MANAGEMENT
    // Now uses the auto-discovered lists
    populateFieldsFromState: function () {
        const state = this.getFormState();
        const allFields = [...this.INPUT_FIELDS, ...this.CALCULATED_FIELDS];
        allFields.forEach((key) => {
            if (state[key] !== undefined) {
                this.setValueInDOM(key, state[key]);
            }
        });
    },

    // ... (Keep your existing getValueFromDOM and setValueInDOM here)
};
