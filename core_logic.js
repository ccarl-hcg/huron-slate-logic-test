$(document).ready(function () {
  const FORM_STATE_KEY = "financialAidFormState";

  // -------------------------------
  // 1. Field Definition Lists
  // -------------------------------

  const INPUT_FIELDS_LIST = [
    "sys:field:prospect_entry_term",
    "on_campus",
    "student_graduate_student",
    "student_current_grade_level",
    "state_of_residence",
    "soc",
    "sys:sex",
    "student_sai_known",
    "sai_amount_known",
    "parent_filed_tax_returns",
    "student_independence",
    "student_marital_status",
    "student_pursuing_a_teaching_certification",
    "student_children_of_fallen_heroes",
    "student_iraq_afghanistan_service_grant_indicator",
    "student_dependents",
    "student_number_in_family",
    "student_number_of_family_members_in_college",
    "parent_filing_status",
    "parent_adjusted_gross_income",
    "parent_deductible_payments_to_ira_keogh_other",
    "parent_untaxed_portions_of_ira_distributions",
    "parent_untaxed_portions_of_pensions",
    "parent_tax_exempt_interest_income",
    "parent_foreign_income_exclusion",
    "parent_education_credits",
    "parent_federal_workstudy",
    "parent_taxable_college_grant_and_scholarship_aid",
    "parent_annual_child_support_received_for_the_last_complete_calendar_year",
    "parent_cash_savings_and_checking_accounts",
    "parent_net_worth_of_current_investments",
    "parent_net_worth_of_businesses_and_or_investment_farms",
    "student_filed_tax_returns",
    "student_filing_status",
    "student_adjusted_gross_income",
    "student_deductible_payments_to_ira_keogh_other",
    "student_tax_exempt_interest_income",
    "student_untaxed_portions_of_ira_distributions",
    "student_untaxed_portions_of_pensions",
    "student_foreign_income_exclusion",
    "student_taxable_college_grant_and_scholarship_aid",
    "student_education_credits",
    "student_federal_workstudy",
    "student_annual_child_support_received_for_the_last_complete_calendar_year",
    "student_cash_savings_and_checking_accounts",
    "student_net_worth_of_current_investments",
    "student_net_worth_of_businesses_and_or_investment_farms",
    "gpa",
    "has_student_taken_test",
    "highest_sat",
    "highest_act",
    "highest_composite_score",
    "opt_in_to_receive_results",
    "sys:birthdate",
  ];

  const CALCULATED_FIELDS_LIST = [
    "sys:field:coa_person_entry_term",
    "parent_total_income_additions",
    "parent_total_income_offsets",
    "parent_total_income",
    "parent_us_income_tax_paid_or_foreign_equivalent",
    "parent_medicare_hospital_insurance_program_tax_rate",
    "parent_oasdi_tax_rate",
    "parent_income_protection_allowance",
    "parent_employment_expense_allowance",
    "parent_total_allowances_against_income",
    "parent_adjusted_net_worth_of_businesses_and_or_investment_farms",
    "parent_net_worth",
    "parent_asset_protection_allowance",
    "parent_asset_conversion_rate",
    "parent_available_income",
    "parent_contribution_from_assets",
    "parent_adjusted_available_income",
    "parent_contribution",
    "student_total_income_additions",
    "student_total_income_offsets",
    "student_us_income_tax_paid_or_foreign_equivalent",
    "student_medicare_hospital_insurance_program_tax_rate",
    "student_oasdi_tax_rate",
    "student_income_protection_allowance",
    "student_allowance_for_negative_adjusted_available_income",
    "student_total_income",
    "student_total_allowances_against_income",
    "student_assessment_of_student_available_income",
    "student_contribution_from_income",
    "student_available_income",
    "student_net_worth",
    "student_asset_protection_allowance",
    "student_discretionary_net_worth",
    "student_asset_conversion_rate",
    "student_contribution_from_assets",
    "maximum_pell_indicator",
    "parent_contribution_display",
    "student_available_income_display",
    "student_contribution_from_income_display",
    "student_contribution_from_assets_display",
    "student_adjusted_available_income",
    "student_total_student_contribution_from_aai",
    "sai_amount_calculated",
    "pell_grant_amount",
    "total_need",
    "highest_act_translated",
    "quality_rating",
    "merit_award",
    "resident_grant",
    "add_on_grant_residency",
    "add_on_grant_sex",
    "tuition_and_fees",
    "housing_and_food",
    "total_direct_billed_charges",
    "off_campus_living_allowance",
    "books_and_supplies",
    "personal_expenses",
    "transportation",
    "loan_fees",
    "total_indirect_education_expenses",
    "total_estimated_cost_of_attendance",
    "total_awards",
    "total_need_based",
    "total_gift_aid",
    "subtotal",
		"gift_aid_target",
    "net_price",
    "cost_of_attendance_minus_awards",
    "pell_grant_flag",
    "minimum_pell_indicator",
		"net_price_rounded",
    "net_price_low",
		"net_price_high",
		"total_gift_aid_rounded",
		"total_gift_aid_low",
		"total_gift_aid_high",
		"cost_of_attendance_minus_awards_rounded",
		"cost_of_attendance_minus_awards_low",
		"cost_of_attendance_minus_awards_high",
		"federal_loans",
		"federal_work_study",
		"other_aid",
  ];

  // -------------------------------
  // 2. Storage & DOM Helper Functions
  // -------------------------------

  function getFormState() {
    try {
      const stateString = sessionStorage.getItem(FORM_STATE_KEY);
      return stateString ? JSON.parse(stateString) : {};
    } catch (e) {
      console.error("Could not parse form state from sessionStorage", e);
      return {};
    }
  }

  function saveFormState(state) {
    sessionStorage.setItem(FORM_STATE_KEY, JSON.stringify(state));
  }

  function getValueFromDOM(key) {
    let $el = $(`[data-export="${key}"]:visible`);

    if (!$el.length) {
      $el = $(`[name="${key}"]:visible, [id="${key}"]:visible`);
    }

    if (!$el.length) return undefined;

    const $radios = $el.find('input[type="radio"]');
    if ($radios.length) {
      return $radios.filter(":checked").val()?.trim();
    }

    const $nestedSelect = $el.find("select");
    const $targetSelect = $el.is("select") ? $el : ($nestedSelect.length ? $nestedSelect : null);

    if ($targetSelect) {
        const $opt = $targetSelect.find('option:selected');
        return $opt.attr('data-text') || $targetSelect.val();
    }

    const $nestedInput = $el
      .find("input, textarea")
      .not('[type="radio"], [type="checkbox"]');
    if ($el.is("div") && $nestedInput.length) {
      return $nestedInput.val()?.trim();
    }

    return $el.val()?.trim();
  }

  function setValueInDOM(key, value) {
    if (value === undefined || value === null) value = "";

    let $el = $(`[data-export="${key}"]`);

    if (!$el.length) {
       $el = $(`[name="${key}"], [id="${key}"]`);
    }

    if (!$el.length) return;

    if ($el.find('input[type="radio"]').length) {
      $el.find('input[type="radio"]').prop("checked", false);
      $el.find(`input[type="radio"][value="${value}"]`).prop("checked", true);
      return;
    }

    const $nestedSelect = $el.find("select");
    const $targetSelect = $el.is("select") ? $el : ($nestedSelect.length ? $nestedSelect : null);

    if ($targetSelect) {
        $targetSelect.val(value);
        if (!$targetSelect.val() && value) {
            const $matchingOpt = $targetSelect.find(`option[data-text="${value}"]`);
            if ($matchingOpt.length) {
                 $targetSelect.val($matchingOpt.attr('value'));
            }
        }
        return;
    }

    const $nestedInput = $el.find("input, textarea");
    if ($el.is("div") && $nestedInput.length) {
      $nestedInput.val(value);
      return;
    }

    $el.val(value);
  }

  function updateAndSaveInputs() {
    let state = getFormState();
    INPUT_FIELDS_LIST.forEach((key) => {
      const value = getValueFromDOM(key);
      if (value !== undefined) {
        state[key] = value;
      }
    });
    saveFormState(state);
  }

  function populateFieldsFromState() {
    const state = getFormState();
    if (!state) return;
    const allFields = [...INPUT_FIELDS_LIST, ...CALCULATED_FIELDS_LIST];
    allFields.forEach((key) => {
      if (state[key] !== undefined) {
        setValueInDOM(key, state[key]);
      }
    });
  }

  function setCalculatedValue(state, key, value) {
    setValueInDOM(key, value);
    state[key] = value;
  }

  function parseCurrency(value) {
    if (!value) return 0;
    return parseFloat(value.toString().replace(/[^0-9.-]+/g, "")) || 0;
  }

  function formatCurrency(num) {
    return num ? "$" + num.toLocaleString() : "";
  }

  // -------------------------------
  // 3. Calculation Functions
  // -------------------------------

  function calculateCOAKey() {
    let state = getFormState();
    
    const $termWrapper = $(`[data-export="sys:field:prospect_entry_term"]`);
    let $termSelect = $termWrapper.is('select') ? $termWrapper : $termWrapper.find('select');
    if (!$termSelect.length) { $termSelect = $(`[id="sys:field:prospect_entry_term"]`); }
    
    const termText = $termSelect.find('option:selected').attr('data-text') || "";
    const onCampus = (state["on_campus"] || "").trim();

    let result = onCampus; 
    if (termText) {
        const formattedTerm = termText.toLowerCase().replace(/\s+/g, '_');
        result = formattedTerm + '_' + onCampus;
    }

    setCalculatedValue(state, "sys:field:coa_person_entry_term", result);
    saveFormState(state);
  }

  function calculateCOA() {
    calculateCOAKey();

    let state = getFormState();
    let key = (state["sys:field:coa_person_entry_term"] || "").trim();
    
    if (!key) return;

    let jsonUrl = `https://slate.huronconsultinggroup.com/manage/query/run?id=cbf2e91c-09f9-40df-ab7c-f92b2facebbd&cmd=service&output=json&h=a30621a2-c435-435d-8ef6-822d13f18f85&key=${encodeURIComponent(key)}`;

    $.getJSON(jsonUrl, function (data) {
      let currentState = getFormState();

      if (!data || !data.row || !data.row.length) {
        const fieldsToClear = [
          "tuition_and_fees",
          "housing_and_food",
          "books_and_supplies",
          "personal_expenses",
          "transportation",
          "loan_fees",
          "off_campus_living_allowance",
          "total_direct_billed_charges",
          "total_indirect_education_expenses",
          "total_estimated_cost_of_attendance",
        ];
        fieldsToClear.forEach((field) => {
          setCalculatedValue(currentState, field, "");
        });
        saveFormState(currentState);
        runAllCalculations();
        return;
      }

      let row = data.row[0];

      setCalculatedValue(currentState,"tuition_and_fees", row.tuition != null ? row.tuition : "");
      setCalculatedValue(currentState,"housing_and_food", row.room_and_board != null ? row.room_and_board : "");
      setCalculatedValue(currentState,"books_and_supplies", row.books != null ? row.books : "");
      setCalculatedValue(currentState,"personal_expenses", row.miscellaneous != null ? row.miscellaneous : "");
      setCalculatedValue(currentState,"transportation", row.transportation != null ? row.transportation : "");
      setCalculatedValue(currentState,"loan_fees", row.federal_stafford_loan_fee != null ? row.federal_stafford_loan_fee : "");

      let livingStatus = (currentState.on_campus || "").toLowerCase();
      let livingValue = "";
      const isOnCampus = livingStatus.includes("on") && livingStatus.includes("campus");

      if (!isOnCampus) {
        livingValue =
          row.dependent_living_with_parents ||
          row.dependent_living_without_parents ||
          row.independent_off_campus ||
          "";
      }
      setCalculatedValue(currentState, "off_campus_living_allowance", livingValue);

      const tuitionVal = parseCurrency(row.tuition);
      const roomVal = parseCurrency(row.room_and_board);
      const booksVal = parseCurrency(row.books);
      const miscVal = parseCurrency(row.miscellaneous);
      const transportVal = parseCurrency(row.transportation);
      const loanFeeVal = parseCurrency(row.federal_stafford_loan_fee);
      const livingVal = parseCurrency(livingValue);

      const totalDirect = tuitionVal + roomVal;
      let totalIndirect = booksVal + miscVal + transportVal + loanFeeVal;
      if (!isOnCampus) totalIndirect += livingVal;
      const totalAll = totalDirect + totalIndirect;

      setCalculatedValue(currentState, "total_direct_billed_charges", formatCurrency(totalDirect));
      setCalculatedValue(currentState, "total_indirect_education_expenses", formatCurrency(totalIndirect));
      setCalculatedValue(currentState, "total_estimated_cost_of_attendance", formatCurrency(totalAll));

      saveFormState(currentState);
      runAllCalculations();
    }).fail((jqxhr, textStatus, error) => {
      console.error("COA Request Failed:", textStatus, error);
      runAllCalculations();
    });
  }

  function calculateIncomeProtectionAllowance() {
    const state = getFormState();
    const saiKnown = parseCurrency(state.sai_amount_known);

    if (saiKnown) {
      setCalculatedValue(state, "parent_income_protection_allowance", "");
      setCalculatedValue(state, "student_income_protection_allowance", "");
      saveFormState(state);
      return;
    }

    let familySize = parseInt(state.student_number_in_family) || 0;
    let independenceStatus = state.student_independence;
    let maritalStatus = state.student_marital_status;
    let dependentsStatus = state.student_dependents;
    let ipa = 0;

    if (independenceStatus === "No") {
      if (familySize === 2) ipa = 27600;
      else if (familySize === 3) ipa = 34350;
      else if (familySize === 4) ipa = 42430;
      else if (familySize === 5) ipa = 50060;
      else if (familySize === 6) ipa = 58560;
      else if (familySize > 6) ipa = 58560 + (familySize - 6) * 6610;
      setCalculatedValue(state, "parent_income_protection_allowance", ipa);
      setCalculatedValue(state, "student_income_protection_allowance", "");
    } else if (independenceStatus === "Yes" && maritalStatus === "Yes") {
      if (familySize === 3) ipa = 54580;
      else if (familySize === 4) ipa = 67400;
      else if (familySize === 5) ipa = 79530;
      else if (familySize === 6) ipa = 93010;
      else if (familySize > 6) ipa = 93010 + (familySize - 6) * 10510;
      setCalculatedValue(state, "student_income_protection_allowance", ipa);
      setCalculatedValue(state, "parent_income_protection_allowance", "");
    } else if (independenceStatus === "Yes" && dependentsStatus === "Yes") {
      if (familySize === 2) ipa = 51960;
      else if (familySize === 3) ipa = 64700;
      else if (familySize === 4) ipa = 79880;
      else if (familySize === 5) ipa = 94260;
      else if (familySize === 6) ipa = 110230;
      else if (familySize > 6) ipa = 110230 + (familySize - 6) * 12460;
      setCalculatedValue(state, "student_income_protection_allowance", ipa);
      setCalculatedValue(state, "parent_income_protection_allowance", "");
    } else {
      setCalculatedValue(state, "parent_income_protection_allowance", "");
      setCalculatedValue(state, "student_income_protection_allowance", "");
    }
    saveFormState(state);
  }

  function calculatePovertyGuideline() {
    const state = getFormState();
    const saiKnown = parseCurrency(state.sai_amount_known);

    if (saiKnown) {
      setCalculatedValue(state, "poverty_guideline", "");
      saveFormState(state);
      return;
    }

    let residenceState = state.state_of_residence;
    let familySize = parseInt(state.student_number_in_family, 10);
    const guidelines = {
      default: [15650, 21150, 26650, 32150, 37650, 43150, 48650, 54150],
      AK: [19550, 26430, 33310, 40190, 47070, 53950, 60830, 67710],
      HI: [17990, 24320, 30650, 36980, 43310, 49640, 55970, 62300],
    };
    const additional = { default: 5500, AK: 6880, HI: 6330 };
    const base = guidelines[residenceState] || guidelines.default;
    const extra = additional[residenceState] || additional.default;

    let guideline = "";
    let formattedGuideline = "";
    if (!isNaN(familySize) && familySize > 0) {
      guideline =
        familySize <= 8
          ? base[familySize - 1]
          : base[7] + (familySize - 8) * extra;
      formattedGuideline = `$${guideline.toLocaleString()}`;
    }
    setCalculatedValue(state, "poverty_guideline", formattedGuideline);
    saveFormState(state);
  }

  function calculateMaximumPellIndicator() {
    const state = getFormState();
    const saiKnown = parseCurrency(state.sai_amount_known);

    if (saiKnown) {
      setCalculatedValue(state, "maximum_pell_indicator", "");
      saveFormState(state);
      return;
    }

    const dependencyStatus = state.student_independence;
    const povertyGuideline = parseCurrency(state.poverty_guideline);
    let maxPellIndicator = "";

    if (dependencyStatus === "No") {
      const parentFiledTaxes = state.parent_filed_tax_returns;
      const parentAGI = parseFloat(state.parent_adjusted_gross_income) || 0;
      const parentFilingStatus = state.parent_filing_status || "";
      const isSingleParent = [
        "Single",
        "Head of Household",
        "Qualifying Surviving Spouse",
      ].includes(parentFilingStatus);

      if (parentFiledTaxes === "No") maxPellIndicator = 1;
      else if (
        isSingleParent &&
        parentAGI > 0 &&
        parentAGI <= 2.25 * povertyGuideline
      )
        maxPellIndicator = 2;
      else if (
        !isSingleParent &&
        parentAGI > 0 &&
        parentAGI <= 1.75 * povertyGuideline
      )
        maxPellIndicator = 3;
    } else {
      const studentFiledTaxes = state.student_filed_tax_returns;
      const studentAGI = parseFloat(state.student_adjusted_gross_income) || 0;
      const studentFilingStatus = state.student_filing_status || "";
      const hasDependents = state.student_dependents === "Yes";
      const isSingleParent =
        [
          "Single",
          "Head of Household",
          "Qualifying Surviving Spouse",
        ].includes(studentFilingStatus) && hasDependents;

      if (studentFiledTaxes === "No") maxPellIndicator = 1;
      else if (
        isSingleParent &&
        studentAGI > 0 &&
        studentAGI <= 2.25 * povertyGuideline
      )
        maxPellIndicator = 2;
      else if (
        !isSingleParent &&
        studentAGI > 0 &&
        studentAGI <= 1.75 * povertyGuideline
      )
        maxPellIndicator = 3;
    }
    setCalculatedValue(state, "maximum_pell_indicator", maxPellIndicator);
    saveFormState(state);
  }

  function calculateSAIandPell() {
    let state = getFormState();
    const saiKnown = parseCurrency(state.sai_amount_known);
    let sai;
    let pellAmount = 0;
    let pellFlag = "No";

    if (saiKnown) {
      sai = saiKnown;
      setCalculatedValue(state, "sai_amount_calculated", sai.toFixed(2));
      setCalculatedValue(state, "minimum_pell_indicator", "");
      setCalculatedValue(state, "pell_grant_flag", "No");
      setCalculatedValue(state, "pell_grant_amount", "$0");
    } else {
      const maxPell = parseInt(state.maximum_pell_indicator) || 0;
      const line20 =
        parseFloat(state.student_total_student_contribution_from_aai) || 0;

      if (maxPell === 1) {
        sai = -1500;
      } else if (maxPell === 2 || maxPell === 3) {
        sai = line20 < 0 ? line20 : 0;
      } else {
        sai = line20 >= 0 ? line20 : line20 < -1500 ? -1500 : line20;
      }
      setCalculatedValue(state, "sai_amount_calculated", sai.toFixed(2));

      const poverty = parseCurrency(state.poverty_guideline);
      let minPell = 0;
      if (maxPell === 0 && sai < poverty * 2) {
        minPell = 1;
      }
      setCalculatedValue(state, "minimum_pell_indicator", minPell);

      const MAX_PELL_AMOUNT = 7395;
      const MIN_PELL_AMOUNT = 740;

      pellFlag =
        maxPell > 0 || minPell > 0 || sai < MAX_PELL_AMOUNT ? "Yes" : "No";
      setCalculatedValue(state, "pell_grant_flag", pellFlag);

      pellAmount = 0;
      if (pellFlag === "Yes") {
        if (maxPell === 1) {
          pellAmount = MAX_PELL_AMOUNT;
        } else if (sai < MAX_PELL_AMOUNT) {
          let calculatedPell = MAX_PELL_AMOUNT - sai;
          calculatedPell = Math.min(calculatedPell, MAX_PELL_AMOUNT);
          pellAmount =
            calculatedPell < MIN_PELL_AMOUNT ? MIN_PELL_AMOUNT : calculatedPell;
        }
      }
      setCalculatedValue(
        state,
        "pell_grant_amount",
        `$${pellAmount.toLocaleString()}`
      );
    }

    saveFormState(state);
    return { sai, pellAmount, pellFlag };
  }

  function calculateAwards() {
    const { pellAmount } = calculateSAIandPell();
    let state = getFormState();

    const gpa = parseFloat(state.gpa) || 0;
    const composite = parseInt(state.highest_composite_score) || 0;
    const soc = state.soc || "";
    // *** FIX: Handle "sys:sex" correctly via brackets ***
    // *** FIX: Normalize "Male"/"Female" text to "M"/"F" ***
    const rawSex = (state["sys:sex"] || "").trim();
    const sex = rawSex.charAt(0).toUpperCase(); // "Male" -> "M", "Female" -> "F"
    
    const residenceState = state.state_of_residence || "";
    const onCampus = state.on_campus || "";

    const totalCOA = parseCurrency(state.total_estimated_cost_of_attendance);
    const sai = parseCurrency(state.sai_amount_calculated);

    // Quality rating chart
    const qualityChart = [
      { rating: 54, gpa: [3.75, 5], comp: [1300, 9999], soc: true },
      { rating: 53, gpa: [3.5, 3.75], comp: [1200, 1300], soc: true },
      { rating: 52, gpa: [3.31, 3.5], comp: [1100, 1200], soc: true },
      { rating: 51, gpa: [3.1, 3.3], comp: [0, 1100], soc: true },
      { rating: 50, gpa: [0, 3.1], comp: [0, 0], soc: true },
      { rating: 23, gpaF: [4.1, 5], gpaM: [4.1, 5], compF: [1350, 9999], compM: [1350, 9999] },
      { rating: 22, gpaF: [4.0, 4.1], gpaM: [4.0, 4.1], compF: [1300, 1350], compM: [1300, 1350] },
      { rating: 21, gpaF: [4.0, 4.0], gpaM: [3.9, 4.0], compF: [1250, 1300], compM: [1250, 1300] },
      { rating: 20, gpaF: [3.9, 4.0], gpaM: [3.8, 3.9], compF: [1250, 1300], compM: [1250, 1300] },
      { rating: 19, gpaF: [3.8, 3.9], gpaM: [3.7, 3.8], compF: [1250, 1300], compM: [1250, 1300] },
      { rating: 18, gpaF: [3.75, 3.8], gpaM: [3.6, 3.7], compF: [1250, 1300], compM: [1250, 1300] },
      { rating: 17, gpaF: [3.7, 3.75], gpaM: [3.5, 3.6], compF: [1200, 1250], compM: [1200, 1250] },
      { rating: 16, gpaF: [3.6, 3.7], gpaM: [3.4, 3.5], compF: [1200, 1250], compM: [1200, 1250] },
      { rating: 15, gpaF: [3.5, 3.6], gpaM: [3.3, 3.4], compF: [1200, 1250], compM: [1200, 1250] },
      { rating: 14, gpaF: [3.45, 3.5], gpaM: [3.2, 3.3], compF: [1150, 1200], compM: [1150, 1200] },
      { rating: 13, gpaF: [3.4, 3.45], gpaM: [3.1, 3.2], compF: [1150, 1200], compM: [1150, 1200] },
      { rating: 12, gpaF: [3.3, 3.4], gpaM: [3.0, 3.1], compF: [1150, 1200], compM: [1150, 1200] },
      { rating: 11, gpaF: [3.2, 3.3], gpaM: [2.9, 3.0] },
      { rating: 10, gpaF: [2.9, 3.2], gpaM: [2.75, 2.9] },
      { rating: 1, gpaF: [0, 2.9], gpaM: [0, 2.75], compF: [0, 1150], compM: [0, 1150] },
    ];
    const gpaRating = (() => {
      if (soc === "Yes") {
        const rows = qualityChart.filter((r) => r.soc);
        const row = rows.find((r) => gpa >= r.gpa[0] && gpa < r.gpa[1]);
        return row ? row.rating : 0;
      } else {
        const key = sex === "M" ? "gpaM" : "gpaF";
        const row = qualityChart.find(
          (r) => gpa >= (r[key]?.[0] || 0) && gpa < (r[key]?.[1] || 0)
        );
        return row ? row.rating : 0;
      }
    })();
    const compRating = (() => {
      if (soc === "Yes") {
        const rows = qualityChart.filter((r) => r.soc);
        const row = rows.find(
          (r) => composite >= r.comp[0] && composite < r.comp[1]
        );
        return row ? row.rating : 0;
      } else {
        const key = sex === "M" ? "compM" : "compF";
        const row = qualityChart.find(
          (r) =>
            composite >= (r[key]?.[0] || 0) && composite < (r[key]?.[1] || 0)
        );
        return row ? row.rating : 0;
      }
    })();
    const qualityRating = Math.max(gpaRating, compRating);
    setCalculatedValue(state, "quality_rating", qualityRating);

    // Merit Award Table
    const meritTable = {
      54: 32500, 53: 32500, 52: 32500, 51: 32500, 50: 32500,
      23: 31500, 22: 31000, 21: 30500, 20: 29500, 19: 29500,
      18: 29000, 17: 29000, 16: 28500, 15: 28000, 14: 27500,
      13: 26500, 12: 25500, 11: 20000, 10: 14500, 1: 0,
    };
    const meritAward = meritTable[qualityRating] || 0;
    setCalculatedValue(state, "merit_award", formatCurrency(meritAward));

    // Add-on Grants
    let addOnResidency = 0,
      residentGrant = 0,
      addOnSex = 0;
    if (qualityRating >= 10) {
      const excludedStates = ["Massachusetts", "Connecticut", "Rhode Island", "New York", "New Jersey"];
      if (soc === "No" && !excludedStates.includes(residenceState))
        addOnResidency = 2500;
      if (onCampus === "on-campus_resident") residentGrant = 3500;
      if (soc === "No" && sex === "M") addOnSex = 2000;
    }
    setCalculatedValue(state, "add_on_grant_residency", addOnResidency ? formatCurrency(addOnResidency) : "");
    setCalculatedValue(state, "resident_grant", residentGrant ? formatCurrency(residentGrant) : "");
    setCalculatedValue(state, "add_on_grant_sex", addOnSex ? formatCurrency(addOnSex) : "");

    // Total Awards - Merit + Grants
    const totalnonneedAwards = meritAward + addOnResidency + residentGrant + addOnSex;
    setCalculatedValue(state, "total_awards", totalnonneedAwards ? formatCurrency(totalnonneedAwards) : "");

    // Need Calculation
    const totalNeed = Math.max(totalCOA - sai, 0);
    setCalculatedValue(state, "total_need", formatCurrency(totalNeed));

    const giftCharts = {
      SOC: [
        {
          min: 0,
          max: 0,
          ratings: {
            1: { target: meritAward, min: meritAward, max: meritAward },
            2: { target: meritAward, min: meritAward, max: meritAward },
            3: { target: meritAward, min: meritAward, max: meritAward },
            4: { target: meritAward, min: meritAward, max: meritAward },
            5: { target: meritAward, min: meritAward, max: meritAward },
            6: { target: meritAward, min: meritAward, max: meritAward },
            7: { target: meritAward, min: meritAward, max: meritAward },
            8: { target: meritAward, min: meritAward, max: meritAward },
            9: { target: meritAward, min: meritAward, max: meritAward },
            10: { target: meritAward, min: meritAward, max: meritAward },
            11: { target: meritAward, min: meritAward, max: meritAward },
            12: { target: meritAward, min: meritAward, max: meritAward },
            13: { target: meritAward, min: meritAward, max: meritAward },
            14: { target: meritAward, min: meritAward, max: meritAward },
            15: { target: meritAward, min: meritAward, max: meritAward },
            16: { target: meritAward, min: meritAward, max: meritAward },
            17: { target: meritAward, min: meritAward, max: meritAward },
            18: { target: meritAward, min: meritAward, max: meritAward },
            19: { target: meritAward, min: meritAward, max: meritAward },
            20: { target: meritAward, min: meritAward, max: meritAward },
            21: { target: meritAward, min: meritAward, max: meritAward },
            22: { target: meritAward, min: meritAward, max: meritAward },
            23: { target: meritAward, min: meritAward, max: meritAward },
          },
        },
        {
          min: 5001,
          max: 40000,
          ratings: {
            50: { target: Math.max(meritAward, 0.63 * totalNeed), min: Math.max(meritAward, 40000), max: Math.max(meritAward, 40000) },
            51: { target: Math.max(meritAward, 0.64 * totalNeed), min: Math.max(meritAward, 40000), max: Math.max(meritAward, 40000) },
            52: { target: Math.max(meritAward, 0.69 * totalNeed), min: Math.max(meritAward, 40000), max: Math.max(meritAward, 40000) },
            53: { target: Math.max(meritAward, 0.73 * totalNeed), min: Math.max(meritAward, 40000), max: Math.max(meritAward, 40000) },
            54: { target: Math.max(meritAward, 0.75 * totalNeed), min: Math.max(meritAward, 40000), max: Math.max(meritAward, 40000) },
          },
        },
        {
          min: 40001,
          max: 65000,
          ratings: {
            50: { target: Math.max(meritAward, 0.61 * totalNeed), min: Math.max(meritAward, 40000), max: Math.max(meritAward, 40000) },
            51: { target: Math.max(meritAward, 0.62 * totalNeed), min: Math.max(meritAward, 40000), max: Math.max(meritAward, 40300) },
            52: { target: Math.max(meritAward, 0.64 * totalNeed), min: Math.max(meritAward, 40000), max: Math.max(meritAward, 41600) },
            53: { target: Math.max(meritAward, 0.69 * totalNeed), min: Math.max(meritAward, 40000), max: Math.max(meritAward, 44850) },
            54: { target: Math.max(meritAward, 0.71 * totalNeed), min: Math.max(meritAward, 40000), max: Math.max(meritAward, 46150) },
          },
        },
        {
          min: 65001,
          max: 100000,
          ratings: {
            50: { target: Math.max(meritAward, 0.49 * totalNeed), min: Math.max(meritAward, 40000), max: Math.max(meritAward, 40000) },
            51: { target: Math.max(meritAward, 0.52 * totalNeed), min: Math.max(meritAward, 40300), max: Math.max(meritAward, 41800) },
            52: { target: Math.max(meritAward, 0.53 * totalNeed), min: Math.max(meritAward, 41600), max: Math.max(meritAward, 42583) },
            53: { target: Math.max(meritAward, 0.58 * totalNeed), min: Math.max(meritAward, 44850), max: Math.max(meritAward, 46600) },
            54: { target: Math.max(meritAward, 0.6 * totalNeed), min: Math.max(meritAward, 46150), max: Math.max(meritAward, 48200) },
          },
        },
      ],
      "Non-SOC-F": [
        {
          min: 0,
          max: 0,
          ratings: {
            1: { target: meritAward, min: meritAward, max: meritAward },
            2: { target: meritAward, min: meritAward, max: meritAward },
            3: { target: meritAward, min: meritAward, max: meritAward },
            4: { target: meritAward, min: meritAward, max: meritAward },
            5: { target: meritAward, min: meritAward, max: meritAward },
            6: { target: meritAward, min: meritAward, max: meritAward },
            7: { target: meritAward, min: meritAward, max: meritAward },
            8: { target: meritAward, min: meritAward, max: meritAward },
            9: { target: meritAward, min: meritAward, max: meritAward },
            10: { target: meritAward, min: meritAward, max: meritAward },
            11: { target: meritAward, min: meritAward, max: meritAward },
            12: { target: meritAward, min: meritAward, max: meritAward },
            13: { target: meritAward, min: meritAward, max: meritAward },
            14: { target: meritAward, min: meritAward, max: meritAward },
            15: { target: meritAward, min: meritAward, max: meritAward },
            16: { target: meritAward, min: meritAward, max: meritAward },
            17: { target: meritAward, min: meritAward, max: meritAward },
            18: { target: meritAward, min: meritAward, max: meritAward },
            19: { target: meritAward, min: meritAward, max: meritAward },
            20: { target: meritAward, min: meritAward, max: meritAward },
            21: { target: meritAward, min: meritAward, max: meritAward },
            22: { target: meritAward, min: meritAward, max: meritAward },
            23: { target: meritAward, min: meritAward, max: meritAward },
          },
        },
        {
          min: 1,
          max: 40000,
          ratings: {
            1: { target: Math.max(meritAward, 0.48 * totalNeed), min: meritAward, max: Math.max(meritAward, 19200) },
            2: { target: Math.max(meritAward, 0.48 * totalNeed), min: meritAward, max: Math.max(meritAward, 19200) },
            3: { target: Math.max(meritAward, 0.48 * totalNeed), min: meritAward, max: Math.max(meritAward, 19200) },
            4: { target: Math.max(meritAward, 0.48 * totalNeed), min: meritAward, max: Math.max(meritAward, 19200) },
            5: { target: Math.max(meritAward, 0.48 * totalNeed), min: meritAward, max: Math.max(meritAward, 19200) },
            6: { target: Math.max(meritAward, 0.48 * totalNeed), min: meritAward, max: Math.max(meritAward, 19200) },
            7: { target: Math.max(meritAward, 0.48 * totalNeed), min: meritAward, max: Math.max(meritAward, 19200) },
            8: { target: Math.max(meritAward, 0.48 * totalNeed), min: meritAward, max: Math.max(meritAward, 19200) },
            9: { target: Math.max(meritAward, 0.48 * totalNeed), min: meritAward, max: Math.max(meritAward, 19200) },
            10: { target: Math.max(meritAward, 0.48 * totalNeed), min: meritAward, max: Math.max(meritAward, 19200) },
            11: { target: Math.max(meritAward, 0.48 * totalNeed), min: meritAward, max: Math.max(meritAward, 19200) },
            12: { target: Math.max(meritAward, 0.58 * totalNeed), min: meritAward, max: Math.max(meritAward, 23200) },
            13: { target: Math.max(meritAward, 0.58 * totalNeed), min: meritAward, max: Math.max(meritAward, 23200) },
            14: { target: Math.max(meritAward, 0.58 * totalNeed), min: meritAward, max: Math.max(meritAward, 23200) },
            15: { target: Math.max(meritAward, 0.64 * totalNeed), min: meritAward, max: Math.max(meritAward, 25600) },
            16: { target: Math.max(meritAward, 0.64 * totalNeed), min: meritAward, max: Math.max(meritAward, 25600) },
            17: { target: Math.max(meritAward, 0.64 * totalNeed), min: meritAward, max: Math.max(meritAward, 25600) },
            18: { target: Math.max(meritAward, 0.67 * totalNeed), min: meritAward, max: Math.max(meritAward, 26800) },
            19: { target: Math.max(meritAward, 0.67 * totalNeed), min: meritAward, max: Math.max(meritAward, 26800) },
            20: { target: Math.max(meritAward, 0.67 * totalNeed), min: meritAward, max: Math.max(meritAward, 26800) },
            21: { target: Math.max(meritAward, 0.69 * totalNeed), min: meritAward, max: Math.max(meritAward, 27600) },
            22: { target: Math.max(meritAward, 0.69 * totalNeed), min: meritAward, max: Math.max(meritAward, 27600) },
            23: { target: Math.max(meritAward, 0.69 * totalNeed), min: meritAward, max: Math.max(meritAward, 27600) },
          }
					},
					    {
          min: 40001,
          max: 65000,
          ratings: {
            1: { target: Math.max(meritAward, 0.46 * totalNeed), min: Math.max(meritAward, 19200), max: Math.max(meritAward, 29900) },
            2: { target: Math.max(meritAward, 0.46 * totalNeed), min: Math.max(meritAward, 19200), max: Math.max(meritAward, 29900) },
            3: { target: Math.max(meritAward, 0.46 * totalNeed), min: Math.max(meritAward, 19200), max: Math.max(meritAward, 29900) },
            4: { target: Math.max(meritAward, 0.46 * totalNeed), min: Math.max(meritAward, 19200), max: Math.max(meritAward, 29900) },
            5: { target: Math.max(meritAward, 0.46 * totalNeed), min: Math.max(meritAward, 19200), max: Math.max(meritAward, 29900) },
            6: { target: Math.max(meritAward, 0.46 * totalNeed), min: Math.max(meritAward, 19200), max: Math.max(meritAward, 29900) },
            7: { target: Math.max(meritAward, 0.46 * totalNeed), min: Math.max(meritAward, 19200), max: Math.max(meritAward, 29900) },
            8: { target: Math.max(meritAward, 0.46 * totalNeed), min: Math.max(meritAward, 19200), max: Math.max(meritAward, 29900) },
            9: { target: Math.max(meritAward, 0.46 * totalNeed), min: Math.max(meritAward, 19200), max: Math.max(meritAward, 29900) },
            10: { target: Math.max(meritAward, 0.46 * totalNeed), min: Math.max(meritAward, 19200), max: Math.max(meritAward, 29900) },
            11: { target: Math.max(meritAward, 0.46 * totalNeed), min: Math.max(meritAward, 19200), max: Math.max(meritAward, 29900) },
            12: { target: Math.max(meritAward, 0.55 * totalNeed), min: Math.max(meritAward, 23200), max: Math.max(meritAward, 35750) },
            13: { target: Math.max(meritAward, 0.55 * totalNeed), min: Math.max(meritAward, 23200), max: Math.max(meritAward, 35750) },
            14: { target: Math.max(meritAward, 0.55 * totalNeed), min: Math.max(meritAward, 23200), max: Math.max(meritAward, 35750) },
            15: { target: Math.max(meritAward, 0.57 * totalNeed), min: Math.max(meritAward, 25600), max: Math.max(meritAward, 37050) },
            16: { target: Math.max(meritAward, 0.57 * totalNeed), min: Math.max(meritAward, 25600), max: Math.max(meritAward, 37050) },
            17: { target: Math.max(meritAward, 0.57 * totalNeed), min: Math.max(meritAward, 25600), max: Math.max(meritAward, 37050) },
            18: { target: Math.max(meritAward, 0.59 * totalNeed), min: Math.max(meritAward, 26800), max: Math.max(meritAward, 38350) },
            19: { target: Math.max(meritAward, 0.59 * totalNeed), min: Math.max(meritAward, 26800), max: Math.max(meritAward, 38350) },
            20: { target: Math.max(meritAward, 0.59 * totalNeed), min: Math.max(meritAward, 26800), max: Math.max(meritAward, 38350) },
            21: { target: Math.max(meritAward, 0.61 * totalNeed), min: Math.max(meritAward, 27600), max: Math.max(meritAward, 39650) },
            22: { target: Math.max(meritAward, 0.61 * totalNeed), min: Math.max(meritAward, 27600), max: Math.max(meritAward, 39650) },
            23: { target: Math.max(meritAward, 0.61 * totalNeed), min: Math.max(meritAward, 27600), max: Math.max(meritAward, 39650) },
          }
				},
					{
          min: 65001,
          max: 100000,
          ratings: {
            1: { target: Math.max(meritAward, 0.44 * totalNeed), min: Math.max(meritAward, 29900), max: Math.max(meritAward, 35400) },
            2: { target: Math.max(meritAward, 0.44 * totalNeed), min: Math.max(meritAward, 29900), max: Math.max(meritAward, 35400) },
            3: { target: Math.max(meritAward, 0.44 * totalNeed), min: Math.max(meritAward, 29900), max: Math.max(meritAward, 35400) },
            4: { target: Math.max(meritAward, 0.44 * totalNeed), min: Math.max(meritAward, 29900), max: Math.max(meritAward, 35400) },
            5: { target: Math.max(meritAward, 0.44 * totalNeed), min: Math.max(meritAward, 29900), max: Math.max(meritAward, 35400) },
            6: { target: Math.max(meritAward, 0.44 * totalNeed), min: Math.max(meritAward, 29900), max: Math.max(meritAward, 35400) },
            7: { target: Math.max(meritAward, 0.44 * totalNeed), min: Math.max(meritAward, 29900), max: Math.max(meritAward, 35400) },
            8: { target: Math.max(meritAward, 0.44 * totalNeed), min: Math.max(meritAward, 29900), max: Math.max(meritAward, 35400) },
            9: { target: Math.max(meritAward, 0.44 * totalNeed), min: Math.max(meritAward, 29900), max: Math.max(meritAward, 35400) },
            10: { target: Math.max(meritAward, 0.44 * totalNeed), min: Math.max(meritAward, 29900), max: Math.max(meritAward, 35400) },
            11: { target: Math.max(meritAward, 0.44 * totalNeed), min: Math.max(meritAward, 29900), max: Math.max(meritAward, 35400) },
            12: { target: Math.max(meritAward, 0.46 * totalNeed), min: Math.max(meritAward, 35750), max: Math.max(meritAward, 36200) },
            13: { target: Math.max(meritAward, 0.46 * totalNeed), min: Math.max(meritAward, 35750), max: Math.max(meritAward, 36200) },
            14: { target: Math.max(meritAward, 0.46 * totalNeed), min: Math.max(meritAward, 35750), max: Math.max(meritAward, 36200) },
            15: { target: Math.max(meritAward, 0.46 * totalNeed), min: Math.max(meritAward, 37050), max: Math.max(meritAward, 37762) },
            16: { target: Math.max(meritAward, 0.46 * totalNeed), min: Math.max(meritAward, 37050), max: Math.max(meritAward, 37762) },
            17: { target: Math.max(meritAward, 0.46 * totalNeed), min: Math.max(meritAward, 37050), max: Math.max(meritAward, 37762) },
            18: { target: Math.max(meritAward, 0.50 * totalNeed), min: Math.max(meritAward, 38350), max: Math.max(meritAward, 40200) },
            19: { target: Math.max(meritAward, 0.50 * totalNeed), min: Math.max(meritAward, 38350), max: Math.max(meritAward, 40200) },
            20: { target: Math.max(meritAward, 0.50 * totalNeed), min: Math.max(meritAward, 38350), max: Math.max(meritAward, 40200) },
            21: { target: Math.max(meritAward, 0.52 * totalNeed), min: Math.max(meritAward, 39650), max: Math.max(meritAward, 41800) },
            22: { target: Math.max(meritAward, 0.52 * totalNeed), min: Math.max(meritAward, 39650), max: Math.max(meritAward, 41800) },
            23: { target: Math.max(meritAward, 0.52 * totalNeed), min: Math.max(meritAward, 39650), max: Math.max(meritAward, 41800) },
          }
        },
      ],
      "Non-SOC-M": [
        {
          min: 0,
          max: 0,
          ratings: {
            1: { target: meritAward, min: meritAward, max: meritAward },
            2: { target: meritAward, min: meritAward, max: meritAward },
            3: { target: meritAward, min: meritAward, max: meritAward },
            4: { target: meritAward, min: meritAward, max: meritAward },
            5: { target: meritAward, min: meritAward, max: meritAward },
            6: { target: meritAward, min: meritAward, max: meritAward },
            7: { target: meritAward, min: meritAward, max: meritAward },
            8: { target: meritAward, min: meritAward, max: meritAward },
            9: { target: meritAward, min: meritAward, max: meritAward },
            10: { target: meritAward, min: meritAward, max: meritAward },
            11: { target: meritAward, min: meritAward, max: meritAward },
            12: { target: meritAward, min: meritAward, max: meritAward },
            13: { target: meritAward, min: meritAward, max: meritAward },
            14: { target: meritAward, min: meritAward, max: meritAward },
            15: { target: meritAward, min: meritAward, max: meritAward },
            16: { target: meritAward, min: meritAward, max: meritAward },
            17: { target: meritAward, min: meritAward, max: meritAward },
            18: { target: meritAward, min: meritAward, max: meritAward },
            19: { target: meritAward, min: meritAward, max: meritAward },
            20: { target: meritAward, min: meritAward, max: meritAward },
            21: { target: meritAward, min: meritAward, max: meritAward },
            22: { target: meritAward, min: meritAward, max: meritAward },
            23: { target: meritAward, min: meritAward, max: meritAward },
          },
        },
        {
          min: 1,
          max: 40000,
          ratings: {
            1: { target: Math.max(meritAward, 0.51 * totalNeed), min: meritAward, max: Math.max(meritAward, 20400) },
            2: { target: Math.max(meritAward, 0.51 * totalNeed), min: meritAward, max: Math.max(meritAward, 20400) },
            3: { target: Math.max(meritAward, 0.51 * totalNeed), min: meritAward, max: Math.max(meritAward, 20400) },
            4: { target: Math.max(meritAward, 0.51 * totalNeed), min: meritAward, max: Math.max(meritAward, 20400) },
            5: { target: Math.max(meritAward, 0.51 * totalNeed), min: meritAward, max: Math.max(meritAward, 20400) },
            6: { target: Math.max(meritAward, 0.51 * totalNeed), min: meritAward, max: Math.max(meritAward, 20400) },
            7: { target: Math.max(meritAward, 0.51 * totalNeed), min: meritAward, max: Math.max(meritAward, 20400) },
            8: { target: Math.max(meritAward, 0.51 * totalNeed), min: meritAward, max: Math.max(meritAward, 20400) },
            9: { target: Math.max(meritAward, 0.51 * totalNeed), min: meritAward, max: Math.max(meritAward, 20400) },
            10: { target: Math.max(meritAward, 0.51 * totalNeed), min: meritAward, max: Math.max(meritAward, 20400) },
            11: { target: Math.max(meritAward, 0.51 * totalNeed), min: meritAward, max: Math.max(meritAward, 20400) },
            12: { target: Math.max(meritAward, 0.6 * totalNeed), min: meritAward, max: Math.max(meritAward, 24000) },
            13: { target: Math.max(meritAward, 0.6 * totalNeed), min: meritAward, max: Math.max(meritAward, 24000) },
            14: { target: Math.max(meritAward, 0.6 * totalNeed), min: meritAward, max: Math.max(meritAward, 24000) },
            15: { target: Math.max(meritAward, 0.67 * totalNeed), min: meritAward, max: Math.max(meritAward, 26800) },
            16: { target: Math.max(meritAward, 0.67 * totalNeed), min: meritAward, max: Math.max(meritAward, 26800) },
            17: { target: Math.max(meritAward, 0.67 * totalNeed), min: meritAward, max: Math.max(meritAward, 26800) },
            18: { target: Math.max(meritAward, 0.7 * totalNeed), min: meritAward, max: Math.max(meritAward, 28000) },
            19: { target: Math.max(meritAward, 0.7 * totalNeed), min: meritAward, max: Math.max(meritAward, 28000) },
            20: { target: Math.max(meritAward, 0.7 * totalNeed), min: meritAward, max: Math.max(meritAward, 28000) },
            21: { target: Math.max(meritAward, 0.72 * totalNeed), min: meritAward, max: Math.max(meritAward, 28800) },
            22: { target: Math.max(meritAward, 0.72 * totalNeed), min: meritAward, max: Math.max(meritAward, 28800) },
            23: { target: Math.max(meritAward, 0.72 * totalNeed), min: meritAward, max: Math.max(meritAward, 28800) },
          },
        },
        {
          min: 40001,
          max: 65000,
          ratings: {
            1: { target: Math.max(meritAward, 0.46 * totalNeed), min: Math.max(meritAward, 20400), max: Math.max(meritAward, 29900) },
            2: { target: Math.max(meritAward, 0.46 * totalNeed), min: Math.max(meritAward, 20400), max: Math.max(meritAward, 29900) },
            3: { target: Math.max(meritAward, 0.46 * totalNeed), min: Math.max(meritAward, 20400), max: Math.max(meritAward, 29900) },
            4: { target: Math.max(meritAward, 0.46 * totalNeed), min: Math.max(meritAward, 20400), max: Math.max(meritAward, 29900) },
            5: { target: Math.max(meritAward, 0.46 * totalNeed), min: Math.max(meritAward, 20400), max: Math.max(meritAward, 29900) },
            6: { target: Math.max(meritAward, 0.46 * totalNeed), min: Math.max(meritAward, 20400), max: Math.max(meritAward, 29900) },
            7: { target: Math.max(meritAward, 0.46 * totalNeed), min: Math.max(meritAward, 20400), max: Math.max(meritAward, 29900) },
            8: { target: Math.max(meritAward, 0.46 * totalNeed), min: Math.max(meritAward, 20400), max: Math.max(meritAward, 29900) },
            9: { target: Math.max(meritAward, 0.46 * totalNeed), min: Math.max(meritAward, 20400), max: Math.max(meritAward, 29900) },
            10: { target: Math.max(meritAward, 0.46 * totalNeed), min: Math.max(meritAward, 20400), max: Math.max(meritAward, 29900) },
            11: { target: Math.max(meritAward, 0.46 * totalNeed), min: Math.max(meritAward, 20400), max: Math.max(meritAward, 29900) },
            12: { target: Math.max(meritAward, 0.55 * totalNeed), min: Math.max(meritAward, 24000), max: Math.max(meritAward, 35750) },
            13: { target: Math.max(meritAward, 0.55 * totalNeed), min: Math.max(meritAward, 24000), max: Math.max(meritAward, 35750) },
            14: { target: Math.max(meritAward, 0.55 * totalNeed), min: Math.max(meritAward, 24000), max: Math.max(meritAward, 35750) },
            15: { target: Math.max(meritAward, 0.57 * totalNeed), min: Math.max(meritAward, 26800), max: Math.max(meritAward, 37050) },
            16: { target: Math.max(meritAward, 0.57 * totalNeed), min: Math.max(meritAward, 26800), max: Math.max(meritAward, 37050) },
            17: { target: Math.max(meritAward, 0.57 * totalNeed), min: Math.max(meritAward, 26800), max: Math.max(meritAward, 37050) },
            18: { target: Math.max(meritAward, 0.58 * totalNeed), min: Math.max(meritAward, 28000), max: Math.max(meritAward, 37700) },
            19: { target: Math.max(meritAward, 0.58 * totalNeed), min: Math.max(meritAward, 28000), max: Math.max(meritAward, 37700) },
            20: { target: Math.max(meritAward, 0.58 * totalNeed), min: Math.max(meritAward, 28000), max: Math.max(meritAward, 37700) },
            21: { target: Math.max(meritAward, 0.6 * totalNeed), min: Math.max(meritAward, 28800), max: Math.max(meritAward, 39000) },
            22: { target: Math.max(meritAward, 0.6 * totalNeed), min: Math.max(meritAward, 28800), max: Math.max(meritAward, 39000) },
            23: { target: Math.max(meritAward, 0.6 * totalNeed), min: Math.max(meritAward, 28800), max: Math.max(meritAward, 39000) },
          }
				},
					{
          min: 65001,
          max: 100000,
          ratings: {
            1: { target: Math.max(meritAward, 0.42 * totalNeed), min: Math.max(meritAward, 29900), max: Math.max(meritAward, 33700) },
            2: { target: Math.max(meritAward, 0.42 * totalNeed), min: Math.max(meritAward, 29900), max: Math.max(meritAward, 33700) },
            3: { target: Math.max(meritAward, 0.42 * totalNeed), min: Math.max(meritAward, 29900), max: Math.max(meritAward, 33700) },
            4: { target: Math.max(meritAward, 0.42 * totalNeed), min: Math.max(meritAward, 29900), max: Math.max(meritAward, 33700) },
            5: { target: Math.max(meritAward, 0.42 * totalNeed), min: Math.max(meritAward, 29900), max: Math.max(meritAward, 33700) },
            6: { target: Math.max(meritAward, 0.42 * totalNeed), min: Math.max(meritAward, 29900), max: Math.max(meritAward, 33700) },
            7: { target: Math.max(meritAward, 0.42 * totalNeed), min: Math.max(meritAward, 29900), max: Math.max(meritAward, 33700) },
            8: { target: Math.max(meritAward, 0.42 * totalNeed), min: Math.max(meritAward, 29900), max: Math.max(meritAward, 33700) },
            9: { target: Math.max(meritAward, 0.42 * totalNeed), min: Math.max(meritAward, 29900), max: Math.max(meritAward, 33700) },
            10: { target: Math.max(meritAward, 0.42 * totalNeed), min: Math.max(meritAward, 29900), max: Math.max(meritAward, 33700) },
            11: { target: Math.max(meritAward, 0.42 * totalNeed), min: Math.max(meritAward, 29900), max: Math.max(meritAward, 33700) },
            12: { target: Math.max(meritAward, 0.45 * totalNeed), min: Math.max(meritAward, 35750), max: Math.max(meritAward, 36200) },
            13: { target: Math.max(meritAward, 0.45 * totalNeed), min: Math.max(meritAward, 35750), max: Math.max(meritAward, 36200) },
            14: { target: Math.max(meritAward, 0.45 * totalNeed), min: Math.max(meritAward, 35750), max: Math.max(meritAward, 36200) },
            15: { target: Math.max(meritAward, 0.47 * totalNeed), min: Math.max(meritAward, 37050), max: Math.max(meritAward, 37762) },
            16: { target: Math.max(meritAward, 0.47 * totalNeed), min: Math.max(meritAward, 37050), max: Math.max(meritAward, 37762) },
            17: { target: Math.max(meritAward, 0.47 * totalNeed), min: Math.max(meritAward, 37050), max: Math.max(meritAward, 37762) },
            18: { target: Math.max(meritAward, 0.50 * totalNeed), min: Math.max(meritAward, 37700), max: Math.max(meritAward, 40200) },
            19: { target: Math.max(meritAward, 0.50 * totalNeed), min: Math.max(meritAward, 37700), max: Math.max(meritAward, 40200) },
            20: { target: Math.max(meritAward, 0.50 * totalNeed), min: Math.max(meritAward, 37700), max: Math.max(meritAward, 40200) },
            21: { target: Math.max(meritAward, 0.52 * totalNeed), min: Math.max(meritAward, 39000), max: Math.max(meritAward, 41800) },
            22: { target: Math.max(meritAward, 0.52 * totalNeed), min: Math.max(meritAward, 39000), max: Math.max(meritAward, 41800) },
            23: { target: Math.max(meritAward, 0.52 * totalNeed), min: Math.max(meritAward, 39000), max: Math.max(meritAward, 41800) },
          }
        },
      ],
    };

    const groupKey =
      soc === "Yes" ? "SOC" : sex === "F" ? "Non-SOC-F" : "Non-SOC-M";
    const giftRow =
      giftCharts[groupKey].find(
        (row) => totalNeed >= row.min && totalNeed <= row.max
      ) || null;
    let giftAidTarget = 0;
    if (giftRow && giftRow.ratings[qualityRating]) {
      giftAidTarget = Math.max(
        giftRow.ratings[qualityRating].target,
        giftRow.ratings[qualityRating].min
      );
    }
    
    // Final COA Minus Awards
    const subtotal = totalnonneedAwards + pellAmount;
    const needbasedinstitutionalaid = Math.max(0, giftAidTarget - subtotal);
    const totalgiftaidtotal = subtotal + needbasedinstitutionalaid;
		const totalgiftaidtotalRoundedValue = Math.round(totalgiftaidtotal / 10) * 10;
				const totalgiftaidtotalRoundedMin = totalgiftaidtotalRoundedValue - 1500;
		const totalgiftaidtotalRoundedMax = totalgiftaidtotalRoundedValue + 1500;
    let federalWorkStudy = 0;
    if (totalNeed >= 1) {
      federalWorkStudy = 3000;
    }
    const federalloans = 5500;
    const netprice = totalCOA - totalgiftaidtotal;
    const net_coa = totalCOA - totalgiftaidtotal - federalWorkStudy - federalloans;
		const netPriceRoundedValue = Math.round(netprice / 10) * 10;
		const netPriceRoundedMin = netPriceRoundedValue - 1500;
		const netPriceRoundedMax = netPriceRoundedValue + 1500;
		const net_coaRoundedValue = Math.round(net_coa / 10) * 10;
		const net_coaRoundedMin = net_coaRoundedValue - 1500;
		const net_coaRoundedMax = net_coaRoundedValue + 1500;
		const otheraid = federalWorkStudy + federalloans;

    setCalculatedValue(state, "total_gift_aid", formatCurrency(totalgiftaidtotal));
    setCalculatedValue(state, "subtotal", formatCurrency(subtotal));
    setCalculatedValue(state, "total_need_based", formatCurrency(needbasedinstitutionalaid));
    setCalculatedValue(state, "net_price", formatCurrency(netprice));
    setCalculatedValue(state, "cost_of_attendance_minus_awards", formatCurrency(net_coa));
		setCalculatedValue(state, "net_price_rounded", formatCurrency(netPriceRoundedValue));
		setCalculatedValue(state, "net_price_low", formatCurrency(netPriceRoundedMin));
		setCalculatedValue(state, "net_price_high", formatCurrency(netPriceRoundedMax));
	  setCalculatedValue(state, "total_gift_aid_rounded", formatCurrency(totalgiftaidtotalRoundedValue));
		setCalculatedValue(state, "total_gift_aid_low", formatCurrency(totalgiftaidtotalRoundedMin));
		setCalculatedValue(state, "total_gift_aid_high", formatCurrency(totalgiftaidtotalRoundedMax));
			  setCalculatedValue(state, "cost_of_attendance_minus_awards_rounded", formatCurrency(net_coaRoundedValue));
		setCalculatedValue(state, "cost_of_attendance_minus_awards_low", formatCurrency(net_coaRoundedMin));
		setCalculatedValue(state, "cost_of_attendance_minus_awards_high", formatCurrency(net_coaRoundedMax));
		setCalculatedValue(state, "federal_loans", formatCurrency(federalloans));
		setCalculatedValue(state, "federal_work_study", formatCurrency(federalWorkStudy));
		setCalculatedValue(state, "other_aid", formatCurrency(otheraid));
		

    saveFormState(state);
  }

  function runAllCalculations() {
    calculateCOAKey(); // 1. Calculate Key first so it's ready for API
    calculateIncomeProtectionAllowance();
    calculatePovertyGuideline();
    calculateMaximumPellIndicator();
    calculateAwards(); // Calls calculateSAIandPell internally
  }

  // -------------------------------
  // 4. Initialization
  // -------------------------------

  populateFieldsFromState();
  // Initial calculation run
  calculateCOA(); 
  runAllCalculations(); 

  // -------------------------------
  // 5. Event Listeners (Optimized)
  // -------------------------------

  $(document).on("change input", "input, select", function (e) {
    const $el = $(this);
    const $parent = $el.closest("[data-export]");
    const key = $parent.length ? $parent.attr("data-export") : $el.attr("data-export");

    // 2. Spam Prevention: If it's the Entry Term, ONLY allow 'change' (not 'input')
    if (key === "sys:field:prospect_entry_term" && e.type === "input") {
      return;
    }

    // 3. Save Everything
    updateAndSaveInputs();

    // 4. Route to specific calculation
    // If they change Entry Term OR Housing, we must re-fetch COA (because the key changes)
    if (key === "sys:field:prospect_entry_term" || key === "on_campus") {
      calculateCOA(); 
    } else {
      runAllCalculations();
    }
  });
});
$(document).ready(function() {
    // --- 1. CONFIGURATION & SELECTORS ---
    
    // Selectors for the main elements
    const $formElement = $('form'); 
    const pageSelector = 'div.form_page';
    
    // Selectors for the existing buttons (we must use their current classes)
    const $continueButton = $('div.form_action_continue > button.default'); 
    const $backButton = $('button.form_action_back'); 
    
    // SAI removal selectors
    const $yesRadio = $('#form_59ccf76e-e28b-4a8e-84fb-2da5c6eb81ea_1'); 
    const pagesToRemoveSelector = '[data-export="sai_not_known"], [data-export="sai_not_known_dependent"]';

    // --- 2. INITIAL CLEANUP (CRITICAL STEP) ---
    
    // Remove the hardcoded inline 'onclick' handlers to prevent them from interfering
    $continueButton.removeAttr('onclick');
    $backButton.removeAttr('onclick');
    console.log('[Cleanup] Removed inline "onclick" handlers from navigation buttons.');

    // --- 3. CORE FUNCTIONS ---

    /**
     * Updates the main form's data-page-count attribute.
     */
    function updatePageCount() {
        const pageCount = $(pageSelector).length;
        $formElement.attr('data-page-count', pageCount);
        console.log(`[Page Count] Updated data-page-count to: ${pageCount}`);
    }

    /**
     * Navigates the form forward (Continue) using smart page skipping.
     */
    function navigateForward() {
        // Run form validation (assuming Form.Validate() is globally available)
        if (typeof Form !== 'undefined' && typeof Form.Validate === 'function' && !Form.Validate()) {
            return; // Stop if validation fails
        }
        
        const currentPageValue = parseInt($formElement.attr('data-page'), 10);
        
        // Find the next *existing* page with a data-page attribute greater than the current one
        const $nextPage = $(`${pageSelector}[data-page]`).filter(function() {
            return parseInt($(this).attr('data-page'), 10) > currentPageValue;
        }).first();

        if ($nextPage.length) {
            const nextPageValue = $nextPage.attr('data-page');
            $formElement.attr('data-page', nextPageValue);
            // Scroll to the top of the form container (mimics original behavior)
            $formElement.find('.form_container').closest('div').get(0).scrollIntoView({ behavior: 'smooth' });
            console.log(`[Navigation] Moved forward. Updated data-page to: ${nextPageValue}`);
        } else {
            console.log('[Navigation] End of form reached.');
        }
    }
    
    /**
     * Navigates the form backward (Back) using smart page skipping.
     */
    function navigateBack() {
        const currentPageValue = parseInt($formElement.attr('data-page'), 10);
        
        // Find the previous *existing* page with a data-page attribute less than the current one
        const $prevPage = $(`${pageSelector}[data-page]`).filter(function() {
            return parseInt($(this).attr('data-page'), 10) < currentPageValue;
        }).last(); // Use .last() to get the immediately preceding page

        if ($prevPage.length) {
            const prevPageValue = $prevPage.attr('data-page');
            $formElement.attr('data-page', prevPageValue);
            // Scroll to the top of the form container (mimics original behavior)
            $formElement.find('.form_container').closest('div').get(0).scrollIntoView({ behavior: 'smooth' });
            console.log(`[Navigation] Moved back. Updated data-page to: ${prevPageValue}`);
        } else {
            console.log('[Navigation] Start of form reached.');
        }
    }
    
    /**
     * Handles the 'Yes' selection to remove SAI-related pages.
     */
    function handleSaiKnownChange() {
        if ($yesRadio.is(':checked')) {
            $(pagesToRemoveSelector).remove();
            console.log('[SAI Removal] Removed SAI Not Known form sections.');
            
            // CRITICAL: Update the page count after removal
            updatePageCount(); 
        } 
    }

    // --- 4. EVENT BINDING & INITIALIZATION ---

    // A. Initial setup: Set the correct page count when the document loads
    updatePageCount(); 

    // B. Attach the handlers to the buttons
    $continueButton.on('click', navigateForward);
    $backButton.on('click', navigateBack);
    
    // C. Attach the SAI removal logic
    $yesRadio.on('change', handleSaiKnownChange);
    
    // D. Optional: Run the check on load in case the form is pre-filled
    // $yesRadio.trigger('change');
});
